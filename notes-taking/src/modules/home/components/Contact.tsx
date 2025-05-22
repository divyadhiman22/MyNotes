import Alert from "@/shared/components/Alert";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormValues, contactSchema } from "../schema/contact-schema";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formsubmit.co/dhimandivya2209@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        // Form submitted successfully
        setAlertType("success");
        setAlertMessage("Thank you! Your message has been sent successfully.");
        setShowAlert(true);
        
        // Reset form fields
        reset();
      } else {
        setAlertType("error");
        setAlertMessage("There was a problem sending your message. Please try again.");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlertType("error");
      setAlertMessage("There was a problem sending your message. Please try again.");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase text-black">Contact Us</h2>
      <div className="flex flex-col md:flex-row bg-white p-6 md:p-10 rounded-2xl shadow-lg w-full md:w-[90%] max-w-4xl">
        
        {/* Left: Contact Form */}
        <div className="w-full md:w-1/2 p-3 md:p-5 mb-6 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 md:mb-6">
            Get In Touch
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                {...register("name")}
                className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <input
                type="email"
                placeholder="Your Email"
                {...register("email")}
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400`}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <textarea
                placeholder="Your Message"
                {...register("message")}
                className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-orange-400`}
              ></textarea>
              {errors.message && (
                <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-800 text-white font-bold text-lg rounded-full shadow-lg hover:bg-gray-900 transition duration-300 disabled:opacity-70"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right: Illustration */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src="https://assets.dochipo.com/editor/illustrations/contact-us/0eed5ca1-01f2-44d2-80da-d3c2062a7b50.png"
            alt="Contact Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>

      {/* Alert Component */}
      {showAlert && (
        <Alert
          type={alertType}
          message={alertMessage}
          onConfirm={handleCloseAlert}
          confirmText="OK Done!"
          showCancelButton={false}
        />
      )}
    </div>
  );
};

export default Contact;