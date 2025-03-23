import { Friend } from "../types/Friend"

export default function FriendSlice({friend, trigger}:{friend:Friend, trigger:React.Dispatch<React.SetStateAction<Friend | null>>}) {
    return (
        <div className="w-full flex gap-4 items-center p-2 pr-0 h-16 cursor-pointer" onClick={() => trigger(friend)}>
            <img src={friend.image} alt="user" className="h-[90%] w-[9%] rounded-full" />
            <div className="border-t py-1.5 border-gray-600/50 text-white text-lg font-semibold w-full -mt-1 flex flex-col">
                {friend.name}
                <div className="text-xs text-gray-400">last message</div>
            </div>
        </div>

    )
}