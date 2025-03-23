import { Friend } from "../../types/Friend";
import backGround from "../../assets/chatBackground.jpg";
import { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";
import { Message } from "../../types/message";
import { Chat } from "../../types/chat";
import MessageBubble from "../../components/messageBubble";
import { FaWolfPackBattalion } from "react-icons/fa";
import { io } from "socket.io-client";

const socket = io("https://friendify-production.up.railway.app");

export default function ChatSegment({ user }: { user: Friend | null }) {
    const [inputMessage, setInputMessage] = useState<string>("");
    const [currChat, setCurrChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const userData = useSelector((state: any) => state.user);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async (messageId: string) => {
        const cleanedMessageId = messageId.replace("'", "");
        const response = await fetch('https://friendify-production.up.railway.app/api/messages/fetch', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({ messageId: cleanedMessageId }),
        });
        const data: Message = await response.json();
        return data;
    };

    useEffect(() => {
        if (!user) return;
        const fetchChatData = async () => {
            const response = await fetch('https://friendify-production.up.railway.app/api/chats/fetch', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ fuser: userData.name, suser: user.name }),
            });
            const data = await response.json();
            setCurrChat(data.chat);
            const fetchedMessages = await Promise.all(
                data.chat.messages.map(async (message: string) => {
                    const gotten = await fetchMessages(message);
                    return gotten;
                })
            );
            setMessages(fetchedMessages);
        };
        fetchChatData();
    }, [user]);

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!user || !currChat) return;
        const messageData = { chatId: currChat.id, content: inputMessage, sender: userData.name, receiver: user.name };
        socket.emit('sendMessage', messageData);
        setInputMessage("");
    };

    if (!user) {
        return (
            <div className="w-[71%] h-full bg-[#202C33] flex items-center justify-center text-white">
                <div className="flex flex-col gap-4 items-center">
                    <FaWolfPackBattalion className="size-24"/>
                    <div className="text-[24px]">Select a friend to start chatting</div>
                </div>
            </div>
        );
    }
    return (
        <div className="w-[71%] h-full bg-[#111B21]">
            <div className="bg-[#202C33] w-full h-[7vh] flex items-center justify-between px-5 border-b border-gray-500/50">
                <div className="flex items-center gap-[2%] w-full">
                    <img src={user.image} alt="user" className="w-11 h-11 rounded-full" />
                    <div className="text-white text-[18px]">{user.name}</div>
                </div>
            </div>
            <div className="w-full h-[86vh] bg-contain bg-center py-3 flex flex-col gap-3 overflow-y-auto" style={{ backgroundImage: `url(${backGround})` }}>
                {messages.map((message, index) => (
                    <div key={index} className={`flex relative h-fit px-3 ${userData.name === message.sender ? "justify-end" : "justify-start"}`}>
                        <MessageBubble messageData={message} flag={userData.name === message.sender} />
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="bg-[#202C33] w-full h-[7vh] flex items-center gap-3 py-3 px-5 border-t border-gray-500/50 text-white">
                <input type="text" placeholder="Enter message" onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }} className="p-2 px-3 w-2/3 font-thin bg-[#31444e] focus:outline-none rounded-2xl text-[14px]" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
                {inputMessage !== "" && <IoMdSend onClick={() => handleSendMessage()} className="size-7 cursor-pointer text-[#8e9da5]" />}
            </div>
        </div>
    );
}