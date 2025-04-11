import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logoutUser } from "@/modules/auth/services/firebase";
import Alert from "@/shared/components/Alert";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ 
    type: "success" | "error"; 
    message: string; 
  } | null>(null);

  useEffect(() => {
    // Set up an auth state listener from Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isUserAuthenticated = !!user;
      setIsAuthenticated(isUserAuthenticated); // Set to true if user exists, false otherwise
      setIsLoading(false); // Set loading to false once we have auth state
      
      // Redirect authenticated users to Home if they're on the landing page
      if (isUserAuthenticated) {
        if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
          navigate('/home');
        }
      } else {
        // Redirect unauthenticated users away from protected routes
        const protectedRoutes = ['/home', '/add', '/view', '/edit'];
        if (protectedRoutes.includes(location.pathname)) {
          navigate('/login');
        }
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Add another effect to handle page refresh and make Home the default for authenticated users
  useEffect(() => {
    if (!isLoading && isAuthenticated && location.pathname === '/') {
      navigate('/home');
    }
  }, [isLoading, isAuthenticated, location.pathname, navigate]);

  const handleLogout = async () => {
    try {
      // Show confirmation alert before actually logging out
      setAlert({ 
        type: "success", 
        message: "Are you sure you want to log out?" 
      });
      // Don't call logoutUser() here - wait for confirmation
    } catch (error) {
      console.error("Logout error:", error);
      setAlert({ 
        type: "error", 
        message: "Failed to log out. Please try again." 
      });
    }
  };

  const handleAlertConfirm = async () => {
    if (alert?.type === "success") {
      try {
        await logoutUser(); // Only log out after confirmation
        // Show success message
        setAlert({
          type: "success",
          message: "You have been successfully logged out."
        });
        // Navigation will happen in the next confirm step
      } catch (error) {
        console.error("Logout error:", error);
        setAlert({ 
          type: "error", 
          message: "Failed to log out. Please try again." 
        });
      }
    } else {
      // For error alerts, just close the alert
      setAlert(null);
      setIsMenuOpen(false);
    }
  };

  const handleLogoutSuccess = () => {
    navigate("/");
    setAlert(null);
    setIsMenuOpen(false);
  };

  const handleAlertCancel = () => {
    setAlert(null);
    setIsMenuOpen(false); // Close menu after alert is dismissed
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to navigate to a specific section
  const navigateToSection = (section: string) => {
    // If we're already on the home page, just scroll to the section
    if (location.pathname === '/') {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Otherwise, navigate to the home page with the section hash
      navigate(`/#${section}`);
    }
    setIsMenuOpen(false);
  };

  // Show a minimal navbar or nothing while authentication state is loading
  if (isLoading) {
    return (
      <nav className="w-full p-2 shadow-md bg-white">
        <div className="container mx-auto flex justify-between items-center w-[90%] p-2 flex-wrap">
          <h1 className="text-black text-2xl font-bold">
            <span className="text-[#fca311]">My</span>Notes
          </h1>
          {/* Don't show any navigation links while loading */}
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full p-2 shadow-md bg-white">
      <div className="container mx-auto flex justify-between items-center w-[90%] p-2 flex-wrap relative">
        <h1 className="text-black text-2xl font-bold">
          <span className="text-[#fca311]">My</span>Notes
        </h1>

        {/* Alert Component */}
        {alert && (
          <div className="fixed inset-0 z-50">
            <Alert
              type={alert.type}
              message={alert.message}
              onConfirm={alert.message === "You have been successfully logged out." ? handleLogoutSuccess : handleAlertConfirm}
              onCancel={handleAlertCancel}
              confirmText={alert.message === "You have been successfully logged out." ? "OK" : "Yes, Log Out"}
              cancelText="Cancel"
              showCancelButton={alert.message !== "You have been successfully logged out." && alert.message !== "Failed to log out. Please try again."}
            />
          </div>
        )}

        {/* Hamburger Menu Button */}
        <button 
          className="md:hidden text-black p-2" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-0.5 bg-black mb-1.5"></div>
          <div className="w-6 h-0.5 bg-black mb-1.5"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </button>

        {/* Navigation Links */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full md:w-auto items-center gap-y-4 md:gap-y-0 gap-x-8 mt-4 md:mt-0`}>
          {isAuthenticated ? (
            <>
              <NavLink 
                to="/home" 
                className="text-black font-bold hover:text-[#fca311] w-full md:w-auto text-center py-2 md:py-0"
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </NavLink>
              <NavLink 
                to="/add" 
                className="text-black font-bold hover:text-[#fca311] w-full md:w-auto text-center py-2 md:py-0"
                onClick={() => setIsMenuOpen(false)}
              >
                ADD
              </NavLink>
              <NavLink 
                to="/view" 
                className="text-black font-bold hover:text-[#fca311] w-full md:w-auto text-center py-2 md:py-0"
                onClick={() => setIsMenuOpen(false)}
              >
                VIEW
              </NavLink>
              <NavLink 
                to="/edit" 
                className="text-black font-bold hover:text-[#fca311] w-full md:w-auto text-center py-2 md:py-0"
                onClick={() => setIsMenuOpen(false)}
              >
                EDIT
              </NavLink>
              <button 
                className="bg-red-600 text-white font-bold px-8 py-2 rounded-md shadow-md w-full md:w-auto"
                onClick={handleLogout}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button 
                className="text-black font-bold hover:text-[#fca311] w-full md:w-auto text-center py-2 md:py-0"
                onClick={() => navigateToSection('home')}
              >
                HOME
              </button>
              <button 
                className="text-black font-bold hover:text-[#fca311] w-full md:w-auto text-center py-2 md:py-0"
                onClick={() => navigateToSection('services')}
              >
                SERVICES
              </button>
              <button 
                className="text-black font-bold hover:text-[#fca311] w-full md:w-auto text-center py-2 md:py-0"
                onClick={() => navigateToSection('contact')}
              >
                CONTACT
              </button>
              <button 
                className="bg-[#fca311] text-white font-bold px-8 py-2 rounded-md shadow-md w-full md:w-auto"
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
              >
                SIGN IN
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;