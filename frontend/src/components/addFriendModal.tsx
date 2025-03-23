import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { useSelector, useDispatch } from "react-redux";
import { User } from "../types/user";
import { useNotification } from "../context/notificationContext";

export default function AddFriendModal({ onClose }: { onClose: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [userList, setUserList] = useState<User[]>([]);
    const [searched, setSearched] = useState(false);
    const userData = useSelector((state) => state.user);
    const { addNotification } = useNotification();
    const [searchKey, setSearchKey] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const searchFriends = async () => {
        setSubmitting(true);
        const response = await fetch("https://friendify-production.up.railway.app/api/users/friend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({ username: searchKey }),
        });
        const data = await response.json();
        const filteredList = data.friend.filter((user: User) => !(user.name === userData.name || userData.friends.filter((name: string) => name === user.name).length != 0));
        setUserList(filteredList);
        setSubmitting(false);
        setSearched(true);
    }

    const addFriend = async (friend: User) => {
        try {
            const response = await fetch("https://friendify-production.up.railway.app/api/users/addfriend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ username: userData.name, friendName: friend.name }),
            });

            if (!response.ok) {
                const data = await response.json();
                addNotification(data.message || "Error adding friend", "error");
                return;
            }

            setUserList(userList.map((user) => {
                if (user.id === friend.id) {
                    user.requests.push(userData.name);
                }
                return user;
            }));
            addNotification("Friend request sent", "success");
        } catch (error) {
            console.error(error);
            addNotification("Error adding friend", "error");
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
            <div className="p-6 rounded-lg w-1/3 relative bg-[#111B21] text-white">
                <HiOutlineXMark className="absolute size-5 top-2 right-2 cursor-pointer" onClick={() => onClose(false)} />
                <div className="text-center text-2xl font-bold">Add Friend</div>
                <input type="text" placeholder="Enter Username" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} className="w-full px-3 py-1 rounded-lg focus:outline-none text-white bg-[#202C33] mt-3" />
                <div className="max-h-[30vh] border-gray-500/50 border-t overflow-y-auto mt-2 flex flex-col">
                    {userList.length === 0 && searched && <div className="text-center text-gray-400 mt-4">No users found</div>}
                    {userList.map((user) => (
                        <div key={user.id} className="flex justify-between items-center bg-[#202C33] p-2 rounded-lg mt-2">
                            <div>{user.name}</div>
                            <button onClick={() => addFriend(user)} disabled={user.requests.filter((name: string) => name === userData.name).length != 0 || userData.friends.filter((name: string) => name === user.name).length != 0} className="bg-[#0a332c] cursor-pointer hover:bg-[#0a432c] text-[#00a884] transition-colors py-1 px-3 rounded-xl focus:outline-none">
                                {userData.friends.filter((name: string) => name === user.name).length != 0 ? "Added" : user.requests.filter((name: string) => name === userData.name).length != 0 ? "Requested" : "Add"}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                    <button onClick={searchFriends} className="bg-[#0a332c] cursor-pointer hover:bg-[#0a432c] text-[#00a884] transition-colors py-1 px-3 rounded-xl focus:outline-none">
                        {submitting ? "Loading..." : "Search"}
                    </button>
                </div>
            </div>
        </div>
    )
}