// components/home/HeroSection.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[90%] min-h-[87.5vh] flex flex-col lg:flex-row justify-between items-center mx-auto py-12 lg:py-0">
      {/* Left Content */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-[50%] text-center lg:text-left mb-10 lg:mb-0"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-6">
          Capture Your <br />
          <span className="block mt-4 md:mt-8 relative">
            <span className="py-2 md:py-4 inline-block transform bg-gradient-to-r from-orange-400 to-red-800 text-transparent bg-clip-text">
              Thoughts
            </span>
          </span>
        </h1>
        <p className="text-lg md:text-xl text-black font-bold drop-shadow mt-6 md:mt-12">
          Organize your notes effortlessly and stay productive.
        </p>
        <button
          className="mt-6 md:mt-8 px-6 py-3 md:px-8 md:py-4 bg-white text-yellow-600 font-bold text-lg rounded-lg shadow-lg hover:bg-gray-200 transition transform hover:scale-105"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </motion.div>

      {/* Right Image Showcase */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex space-x-2 md:space-x-4 w-full lg:w-[50%] justify-center"
      >
        <div className="w-24 md:w-32 lg:w-40 h-48 md:h-56 lg:h-64 bg-yellow-500 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition">
          <img src="https://cdn.prod.website-files.com/629997f37bd997702e98c3b9/65239a8a82dd299f7c5595d8_6501652acfd5a0a5e28879c6_notess.png" alt="Artwork 1" className="w-full h-full object-cover"/>
        </div>
        <div className="w-24 md:w-32 lg:w-40 h-52 md:h-60 lg:h-72 bg-yellow-400 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition">
          <img src="https://djnw5a0wszky0.cloudfront.net/inkfactorywp/wp-content/uploads/2016/12/Blog_7-Digital-Tools_Header-Image_1920x1080-1900x1069.jpg.webp" alt="Artwork 2" className="w-full h-full object-cover"/>
        </div>
        <div className="w-24 md:w-32 lg:w-40 h-48 md:h-56 lg:h-64 bg-yellow-500 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition">
          <img src="https://cdn.prod.website-files.com/66bf05dee8c5f0991d608526/67052df8acee2f2eba3fca4a_Digital%20Notes.png" alt="Artwork 3" className="w-full h-full object-cover"/>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;