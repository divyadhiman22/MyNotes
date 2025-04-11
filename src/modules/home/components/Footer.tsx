// components/home/FooterSection.tsx
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 md:py-8 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-6">
        {/* Logo & Branding */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold uppercase">MyNotes</h2>
          <p className="text-gray-400 text-sm md:text-base">Innovating the future.</p>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-white transition text-lg md:text-xl"><FaFacebook /></a>
          <a href="#" className="text-gray-400 hover:text-white transition text-lg md:text-xl"><FaTwitter /></a>
          <a href="#" className="text-gray-400 hover:text-white transition text-lg md:text-xl"><FaInstagram /></a>
          <a href="#" className="text-gray-400 hover:text-white transition text-lg md:text-xl"><FaLinkedin /></a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-500 mt-4 md:mt-6 text-sm">
        <p>© {new Date().getFullYear()} MyNotes. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;