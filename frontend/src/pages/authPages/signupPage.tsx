import { useState } from "react";
import { useNotification } from "../../context/notificationContext";
import { useNavigate } from "react-router-dom";
export default function SignupPage() {
    const [user, setUser] = useState({ username: "", password: "", confirmPassword: "" });
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const submitSignup = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (user.password !== user.confirmPassword) {
            addNotification("Passwords do not match", "error");
            return;
        }
        try {
            const response = await fetch("https://friendify-production.up.railway.app/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: user.username, password: user.password })
            });
            
            console.log(response);
            if (response.status === 409) {
                const data = await response.json();
                addNotification(data.message, "error");
                return;
            }
    
            if (!response.ok) {
                const data = await response.json();
                addNotification(data.message || "Error creating user", "error");
                return;
            }
            addNotification("User created successfully", "success");
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            addNotification(error.message, "error");
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center min-h-svh bg-[#222121]">
            <div className="w-1/3 bg-[#111B21] rounded-2xl shadow-lg p-6 text-white">
                <div className="text-center w-full font-bold text-[32px]">Register</div>
                <form className="mt-6" onSubmit={submitSignup}>
                    <div className="mb-5">
                        <label htmlFor="username" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Username</label>
                        <input type="text" name="username" id="username" value={user.username} onChange={(e) => setUser({...user, username: e.target.value})} placeholder="Enter Username" required className="w-full p-3 rounded-lg border-[#0a432c] bg-[#202C33] focus:border-[#0a632c] border focus:outline-none" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Password</label>
                        <input type="password" name="password" id="password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} placeholder="Enter Password" required className="w-full p-3 rounded-lg border-[#0a432c] bg-[#202C33] focus:border-[#0a632c] border focus:outline-none" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Confirm Password</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" value={user.confirmPassword} onChange={(e) => setUser({...user, confirmPassword: e.target.value})} placeholder="Enter Password" required className="w-full p-3 rounded-lg border-[#0a432c] bg-[#202C33] border focus:border-[#0a632c] focus:outline-none" />
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Already have an account? <span onClick={() => navigate("/login")} className="text-[#00a884] cursor-pointer">Login</span></p>
                    <div className="flex justify-center">
                    <button type="submit" className="bg-[#0a332c] w-fit mx-auto cursor-pointer hover:bg-[#0a432c] text-[#00a884] transition-colors py-1 px-3 rounded-xl focus:outline-none">Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
}