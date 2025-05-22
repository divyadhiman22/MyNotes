// components/HomePage.tsx
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Services from '../components/Services';
import Footer from '../components/Footer';
import Home from '../components/Home';
import Contact from '../components/Contact';

const HomePage = () => {
  // Create refs for each section
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
  // Get the location from react-router
  const location = useLocation();
  
  // Scroll to the appropriate section when the URL changes
  useEffect(() => {
    // Check if there's a hash in the URL and scroll to the corresponding section
    if (location.hash) {
      const hash = location.hash.substring(1); // Remove the # character
      
      setTimeout(() => {
        if (hash === 'services' && servicesRef.current) {
          servicesRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === 'contact' && contactRef.current) {
          contactRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (hash === 'home' && heroRef.current) {
          heroRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure DOM is ready
    } else {
      // If no hash, scroll to top when navigating to home page
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="w-full bg-gradient-to-r from-yellow-400 via-white to-yellow-300 flex flex-col">
      {/* Hero Section with ref */}
      <div ref={heroRef} id="home" className="w-full">
        <Home />
      </div>
      
      {/* Services Section with ref */}
      <div ref={servicesRef} id="services" className="w-full">
        <Services />
      </div>
      
      {/* Contact Section with ref */}
      <div ref={contactRef} id="contact" className="w-full">
        <Contact />
      </div>
      
      {/* Footer Section */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;