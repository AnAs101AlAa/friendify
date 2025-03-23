import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../userSlice";
import { useNotification } from "../../context/notificationContext";

export default function LoginPage() {
    const [userInput, setUserInput] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { addNotification } = useNotification();

    const submitLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch("https://friendify-production.up.railway.app/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInput),
            });

            if (response.status === 404) {
                const data = await response.json();
                addNotification(data.message, "error");
                return;
            }

            if (!response.ok) {
                const data = await response.json();
                addNotification(data.message || "Error logging in", "error");
                return;
            }

            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            dispatch(setUser({ name: data.user.name, id: data.user.id, friends: data.user.friends, requests: data.user.requests }));
            addNotification("Logged in successfully", "success");
            setTimeout(() => {
                navigate("/main");
            }, 2000);
        } catch (error) {
            addNotification("Error logging in", "error");
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center min-h-svh bg-[#222121]">
            <div className="w-[25%] bg-[#111B21] rounded-2xl shadow-lg p-6 text-white">
                <div className="text-center w-full font-bold text-[32px]">Login</div>
                <form onSubmit={submitLogin} className="mt-6">
                    <div className="flex flex-col space-y-4">
                        <input type="text" placeholder="Username" className="p-2 border font-thin bg-[#202C33] border-[#0a432c] focus:border-[#0a632c] focus:outline-none rounded" value={userInput.username} onChange={(e) => setUserInput({ ...userInput, username: e.target.value })} />
                        <input type="password" placeholder="Password" className="p-2 border font-thin bg-[#202C33] border-[#0a432c] focus:border-[#0a632c] focus:outline-none rounded" value={userInput.password} onChange={(e) => setUserInput({ ...userInput, password: e.target.value })} />
                        <p className="text-sm text-gray-400 mb-3">Don't have an account? <span onClick={() => navigate("/")} className="text-[#00a884] cursor-pointer">Signup</span></p>
                        <button type="submit" className="bg-[#0a332c] w-fit mx-auto cursor-pointer hover:bg-[#0a432c] text-[#00a884] transition-colors py-1 px-3 rounded-xl focus:outline-none">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}