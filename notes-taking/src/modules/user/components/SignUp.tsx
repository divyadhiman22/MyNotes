import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { userSchema, UserSchema } from "../schema/user-schema";
import { createUserDocumentIfNotExists, signUpWithEmailPassword } from "@/modules/auth/services/firebase";
// import Loading from "@/modules/Loader/Loading";
import Alert from "@/shared/components/Alert";

const SignUp = () => {
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [alert, setAlert] = useState<{ 
      type: "success" | "error"; 
      message: string; 
    } | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const doSignUp = async (data: UserSchema) => {
        // setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...userData } = data;
        
        try {
            // Register user with Firebase Authentication
            const user = await signUpWithEmailPassword(userData.email, userData.password);
            
            // Create user document in Firestore
            await createUserDocumentIfNotExists(user);
            
            localStorage.setItem("isAuthenticated", "true");
            setAlert({ 
              type: "success", 
              message: "Account created successfully!" 
            });
            // No navigation here - will wait for user to confirm
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error signing up:", error);
            
            let errorMessage = "Error signing up. Please try again.";
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use. Please try another email.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Please use a stronger password.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format. Please check your email address.";
            }
            
            setAlert({ type: "error", message: errorMessage });
        } finally {
            // setLoading(false);
        }
    };

    const handleAlertConfirm = () => {
        // Only navigate on successful login after user clicks OK
        if (alert?.type === "success") {
            navigate("/home");
        }
        // Close the alert in all cases
        setAlert(null);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md p-4">
            <div className="relative w-full sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-md flex flex-col justify-center items-center bg-[#f6f8f9] shadow-lg rounded-lg p-4 sm:p-6">
                <button className="absolute top-4 right-4" onClick={() => navigate("/")}>
                    <AiOutlineClose size={24} className="stroke-[34]" />
                </button>
                <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl p-2 sm:p-4 mt-4 sm:mt-8">SIGN UP</h1>
                
                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onConfirm={handleAlertConfirm}
                        confirmText="OK Done!"
                    />
                )}
                
                <form onSubmit={handleSubmit(doSignUp)} className="w-full max-w-sm px-4">
                    <div className="flex flex-col">
                        <label className="mb-2 mt-2 text-gray-500">Email :</label>
                        <input 
                            className="p-2 shadow w-full border rounded" 
                            {...register("email")} 
                            type="email" 
                            placeholder="Type Email Here" 
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 mt-2 text-gray-500">Password :</label>
                        <div className="relative">
                            <input 
                                className="p-2 shadow w-full border rounded" 
                                {...register("password")} 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Type Password Here" 
                            />
                            <button 
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 mt-2 text-gray-500">Confirm Password :</label>
                        <div className="relative">
                            <input 
                                className="p-2 shadow w-full border rounded" 
                                {...register("confirmPassword")} 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm Password Here" 
                            />
                            <button 
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>
                    <button 
                        type="submit" 
                        className="bg-[#fca311] text-white font-bold px-6 py-2 rounded-md shadow-md mt-4 w-full mb-2"
                    >
                        SIGN UP
                    </button>
                </form>
                
                <div className="flex w-full max-w-sm mb-4 justify-center mt-4">
                    <h1 className="text-gray-500 mr-2 text-sm sm:text-base">Already have an account?</h1>
                    <span 
                        className="text-[#fca311] cursor-pointer font-bold hover:underline text-sm sm:text-base" 
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;