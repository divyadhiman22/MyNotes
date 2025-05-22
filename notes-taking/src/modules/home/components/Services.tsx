// components/home/ServicesSection.tsx
import {FaEdit, FaRegStickyNote} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { HiLockClosed } from "react-icons/hi";

const Services = () => {
  const services = [
    { title: "Simple & Smart Note-Taking", icon: <FaRegStickyNote />, description: "Create clean, well-structured notes with ease.Use bullet points, headings, and highlights to organize ideas.Perfect for daily study, journaling, or brainstorming.", },
    { title: " Privacy & Security", icon: <HiLockClosed />, description: "All your notes stay on your device—no unwanted access, optional password protection for extra-sensitive content. We respect your privacy—no tracking, no ads.", },
    { title: "Editable Notes", icon: <FaEdit />, description: "Easily create and update your notes anytime, make changes on the go with our user-friendly editor and perfect for revising, reordering, or adding new info effortlessly.", },
    { title: "Quick Search", icon: <FiSearch />, description: "Instantly find what you need with a powerful search bar, search by title, content, or tags in seconds.No more scrolling—just type and go!", },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 md:px-6 py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black uppercase">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-2 w-full max-w-5xl">
        {services.map((service, index) => (
          <div
            key={index}
            className="group  p-4 md:p-6 rounded-lg shadow-lg transition duration-300 
                      bg-gradient-to-r from-orange-500 to-red-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:text-white">{service.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-white">{service.title}</h3>
              <p className="text-white text-sm md:text-base group-hover:text-white">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;