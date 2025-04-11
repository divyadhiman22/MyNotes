import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserLoginSchema, userLoginSchema } from "../schema/login-user-schema";
import { loginWithEmailPassword, signInWithGoogle } from "@/modules/auth/services/firebase";
// import Loading from "@/modules/Loader/Loading";
import Alert from "@/shared/components/Alert";

const Login = () => {
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [alert, setAlert] = useState<{ 
      type: "success" | "error"; 
      message: string; 
    } | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<UserLoginSchema>({
        resolver: zodResolver(userLoginSchema),
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleSignIn = async () => {
        // setLoading(true);
        try {
            await signInWithGoogle();
            localStorage.setItem("isAuthenticated", "true");
            setAlert({ 
              type: "success", 
              message: "Google sign-in successful!" 
            });
            // No navigation here - will wait for user to confirm
        } catch (error) {
            console.error("Google sign-in failed:", error);
            setAlert({ 
              type: "error", 
              message: "Google sign-in failed. Please try again." 
            });
        } finally {
            // setLoading(false);
        }
    };

    const doLogin = async (data: UserLoginSchema) => {
        // setLoading(true);
        try {
            await loginWithEmailPassword(data.email, data.password);
            localStorage.setItem("isAuthenticated", "true");
            setAlert({ 
              type: "success", 
              message: "Login successful!" 
            });
            // No navigation here - will wait for user to confirm
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Login error:", error);
            let errorMessage = "Login failed. Please try again.";
            
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Invalid email or password. Please try again.";
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
                <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl p-2 sm:p-4 mt-4 sm:mt-8">SIGN IN</h1>
                
                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onConfirm={handleAlertConfirm}
                        confirmText="OK Done!"
                    />
                )}
                
                <form onSubmit={handleSubmit(doLogin)} className="w-full max-w-sm px-4">
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
                    <button 
                        type="submit" 
                        className="bg-[#fca311] text-white font-bold px-6 py-2 rounded-md shadow-md mt-4 w-full mb-2"
                    >
                        SIGN IN
                    </button>
                </form>
                
                <div className="flex flex-col mt-2 w-full max-w-sm px-4">
                    <h1 className="text-center pb-2 text-gray-500">Or</h1>
                    <button 
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center w-full space-x-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition duration-150 mb-4"
                    >
                        <FcGoogle size={20} className="mr-2" />
                        <span>Sign in with Google</span>
                    </button>
                </div>
                
                <div className="flex w-full max-w-sm mb-4 justify-center">
                    <h1 className="text-gray-500 mr-2 text-sm sm:text-base">Don't have an account?</h1>
                    <span 
                        className="text-[#fca311] cursor-pointer font-bold hover:underline text-sm sm:text-base" 
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;