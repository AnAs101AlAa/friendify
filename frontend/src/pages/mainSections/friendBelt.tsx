import { SetStateAction, useEffect, useState } from 'react';
import FriendSlice from '../../components/friendSlice';
import { Friend } from '../../types/Friend';
import temp from '../../assets/image.jpg';
import { LuMessageCirclePlus } from "react-icons/lu";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import AddFriendModal from '../../components/addFriendModal';
import RequestsModal from '../../components/requestsModal';
import { useSelector } from 'react-redux';

export default function FriendBelt({ switchUser }: { switchUser: React.Dispatch<SetStateAction<Friend | null>> }) {
    const [showFriendModal, setShowfriendModal] = useState(false);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [friendList, setFriendList] = useState<Friend[]>([]);
    const [filteredFriendList, setFilteredFriendList] = useState<Friend[]>([]);
    const [searchKey, setSearchKey] = useState<string>("");
    const userData = useSelector((state) => state.user);

    useEffect(() => {
        if(searchKey === "") {
            setFilteredFriendList(friendList)
            return;
        } else {
            const filterSearch = userData.friends.filter((friend: string) => friend.toLowerCase().includes(searchKey.toLowerCase()))
            setFilteredFriendList(friendList.filter((friend) => {
                if(filterSearch.includes(friend.name)) {
                    return {...friend, image: temp}
                }
                else {
                    return null;
                }
            }))
        }
    }, [searchKey]);


    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsData = await Promise.all(
                    userData.friends.map(async (friend: string) => {
                        const response = await fetch("https://friendify-production.up.railway.app/api/users/fetch", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                            },
                            body: JSON.stringify({ username: friend }),
                        });
                        const data = await response.json();
                        const addedImage = { ...data.user, image: temp };
                        return addedImage;
                    })
                );
                setFriendList(friendsData);
                setFilteredFriendList(friendsData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFriends();
    }, [userData.friends]);

    return (
        <div className="w-[29%] h-full bg-[#111B21] py-3 border-gray-600/50 border-r">
            {showFriendModal && <AddFriendModal onClose={setShowfriendModal}/>}
            {showRequestsModal && <RequestsModal onClose={setShowRequestsModal}/>}
            <div className='flex justify-between items-center mb-5'>
                <div className="text-2xl font-bold text-white pl-3">Chats</div>
                <div className="flex gap-4">
                    <div className='relative'>
                        <IoPersonAddOutline onClick={() => setShowRequestsModal(true)} className="size-9 text-white pr-3 cursor-pointer" />
                        {userData.requests.length > 0 && <div className="absolute -top-1 -right-1 bg-[#0a332c] text-[#00a884] font-semibold rounded-full h-5 w-5 flex justify-center items-center">{userData.requests.length}</div>}
                    </div>
                    <LuMessageCirclePlus onClick={() => setShowfriendModal(true)} className="size-9 text-white pr-3 cursor-pointer" />
                </div>
            </div>
            <div className=' w-[96%] bg-[#202C33] mx-auto flex items-center gap-4 rounded-md py-1 px-2 mb-4'>
                <IoMdSearch className="text-white size-5" />
                <input type="text" placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} className="w-[85%] bg-transparent focus:outline-none text-md text-white" />
            </div>
            {searchKey !== '' && filteredFriendList.length == 0 && <div className="text-center text-gray-400 my-3">No user matches your search</div> }
            <div className='flex flex-col border-b border-gray-500/50 pb-1 max-h-[90%] overflow-y-auto'>
                {filteredFriendList.map((friend) => (
                    <FriendSlice key={friend.id} friend={friend} trigger={switchUser}/>
                ))}
            </div>
        </div>
    );
}