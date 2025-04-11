import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateRoute from "@/routing/PrivateRoutes";
import CubeLoader from "@/modules/Loader/Loading";
import Navbar from "@/modules/home/components/Navbar";

// Regular imports for non-lazy loaded components
import HomePage from "@/modules/home/pages/HomePage";
import Services from "@/modules/home/components/Services";
import Contact from "@/modules/home/components/Contact";
import Login from "@/modules/user/components/Login";
import SignUp from "@/modules/user/components/SignUp";
import AddNote from "@/modules/notes/pages/AddNote";

// Lazy load only HomeNote, EditNote, and ViewNote components
const HomeNote = lazy(() => import("@/modules/notes/pages/HomeNote"));
const EditNote = lazy(() => import("@/modules/notes/pages/EditNote"));
const ViewNote = lazy(() => import("@/modules/notes/pages/ViewNote"));

const AppRoutes = () => {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Routes>
        {/* Public Routes - Not lazy loaded */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes - Not lazy loaded */}
        <Route path="/add" element={<PrivateRoute><AddNote /></PrivateRoute>} />
        
        {/* Protected Routes - Lazy loaded */}
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <Suspense fallback={<CubeLoader />}>
                <HomeNote />
              </Suspense>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/edit" 
          element={
            <PrivateRoute>
              <Suspense fallback={<CubeLoader />}>
                <EditNote />
              </Suspense>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/view" 
          element={
            <PrivateRoute>
              <Suspense fallback={<CubeLoader />}>
                <ViewNote />
              </Suspense>
            </PrivateRoute>
          } 
        />
      </Routes>
    </div>
  );
};

export default AppRoutes;