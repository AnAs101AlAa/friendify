import { useEffect, useState } from "react"
import FriendBelt from "./mainSections/friendBelt"
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../userSlice";
import ChatSegment from "./mainSections/chatSegment";
import { Friend } from "../types/Friend";

export default function MainPage() {
    const [currUser, setCurrUser] = useState<Friend| null>(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    useEffect(() => {
        const fetchUsrData = async () => {
            try {
                const response = await fetch("https://friendify-production.up.railway.app/api/users/fetch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ username: user.name}),
                });
                const data = await response.json();
                dispatch(setUser(data.user));
            } catch (error) {
                console.error(error);
            }
        }
        fetchUsrData();
    }, []);
    
    return (
        <div className="w-screen h-screen flex bg-black">
            <FriendBelt switchUser={setCurrUser}/>
            <ChatSegment user={currUser}/>
        </div>
    )
}