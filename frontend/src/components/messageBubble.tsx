import { useEffect, useRef, useState } from "react";
import { Message } from "../types/message";

export default function MessageBubble({ messageData, flag }: { messageData: Message, flag: boolean }) {
    const timestamp = new Date(messageData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const bubbleRef = useRef<HTMLDivElement>(null);
    const [clipPath, setClipPath] = useState<string>("");

    useEffect(() => {
        if (bubbleRef.current) {
            const width = bubbleRef.current.offsetWidth;
            const pointPosition = flag ? width - 16 : 16;
            const clipPathValue = flag
                ? `polygon(0% 0%, 100% 0%, 100% 100%, ${pointPosition}px 92%, 0 92%)`
                : `polygon(0% 0%, 100% 0%, 100% 92%, ${pointPosition}px 92%, 0 100%, 0 74%)`;
            setClipPath(clipPathValue);
        }
    }, [messageData, flag]);

    if (flag) {
        return (
            <div ref={bubbleRef} className="max-w-[40%] min-w-[6%] bg-[#005c4b] p-2 px-4 rounded-t-lg rounded-l-lg" style={{ clipPath }}>
                <p className="text-[14px] text-white">{messageData.messagecontent}</p>
                <p className="text-[11px] mb-1 text-gray-300">{timestamp}</p>
            </div>
        );
    }
    return (
        <div ref={bubbleRef} className="max-w-[40%] min-w-[6%] bg-[#202C33] p-2 px-4 rounded-t-lg rounded-r-lg" style={{ clipPath }}>
            <p className="text-[14px] text-white">{messageData.messagecontent}</p>
            <p className="text-[11px] mb-1 text-gray-300">{timestamp}</p>
        </div>
    );
}