import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { useSelector, useDispatch } from "react-redux";
import { appendFriend, removeRequest } from "../userSlice";
import { useNotification } from "../context/notificationContext";

export default function RequestsModal({ onClose }: { onClose: React.Dispatch<React.SetStateAction<boolean>> }) {
    const userData = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { addNotification } = useNotification();
    const [submitting, setSubmitting] = useState(false);

    const handleFriend = async (flag: boolean, friend: string) => {
        setSubmitting(true);
        try {
            if (flag) {
                const response = await fetch("http://localhost:3000/api/users/acceptfriend", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ username: userData.name, friendName: friend }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    addNotification(data.message || "Error accepting friend request", "error");
                    setSubmitting(false);
                    return;
                }

                const data = await response.json();
                if (data.success) {
                    dispatch(appendFriend(friend));
                }
            }

            const response = await fetch("http://localhost:3000/api/users/rejectfriend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ username: userData.name, friendName: friend }),
            });

            if (!response.ok) {
                const data = await response.json();
                addNotification(data.message || "Error rejecting friend request", "error");
                setSubmitting(false);
                return;
            }

            dispatch(removeRequest(friend));
            addNotification(flag ? "Friend request accepted" : "Friend request rejected", "success");
            setSubmitting(false);
        } catch (error) {
            console.error(error);
            addNotification("Error processing friend request", "error");
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
            <div className="p-6 rounded-lg w-1/3 relative bg-[#111B21] text-white">
                <HiOutlineXMark className="absolute size-5 top-2 right-2 cursor-pointer" onClick={() => onClose(false)} />
                <div className="text-center text-2xl font-bold">Friend Requests</div>
                <div className="max-h-[30vh] border-gray-500/50 border-t overflow-y-auto mt-2 flex flex-col">
                    {userData.requests.length === 0 && <div className="text-center text-gray-400 mt-4">No current requests</div>}
                    {userData.requests.map((user: string, index: number) => (
                        <div key={index} className="flex justify-between items-center bg-[#202C33] p-2 rounded-lg mt-2">
                            <div>{user}</div>
                            {submitting ? <button onClick={() => null} disabled={true} className="bg-[#0a332c] text-[#00a884] transition-colors py-1 px-3 rounded-xl focus:outline-none">loading...</button> :
                                <div className="flex gap-2">
                                    <button onClick={() => handleFriend(true, user)} className="bg-[#0a332c] cursor-pointer hover:bg-[#0a432c] text-[#00a884] transition-colors py-1 px-3 rounded-xl focus:outline-none">Accept</button>
                                    <button onClick={() => handleFriend(false, user)} className="bg-[#0a332c] cursor-pointer hover:bg-[#0a432c] text-[#00a884] transition-colors py-1 px-3 rounded-xl focus:outline-none">Cancel</button>
                                </div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}