import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";


interface ChatProps {
    socket: Socket | null;
    room: string;
    username: string;
    isAllowedtoChat: boolean;
    onMessageSent: (message: string) => void;
}

interface Message {
    user: string;
    text: string;
}


export default function Chat({socket, room, username, isAllowedtoChat}: ChatProps){
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");

    useEffect(() => {
        if(!socket) return;
        socket.on("chatMessage", (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
            console.log("New chat message:", data);
        });

        return () => {
            socket.off("chatMessage");
        }
    }, [socket])

    const handleSendMessage = () => {
        if(!socket || !isAllowedtoChat) return;
        const messageText = username + ": " + inputMessage;
        socket.emit("chatMessage", {room, text: messageText});
        setInputMessage("");
    };

    const handleEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    return(      
        <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700 w-80">
            {/* HEADER */}
            <div className="p-3 border-b border-gray-700 bg-gray-800">
                <h3 className="font-bold text-white">Room Chat</h3>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-1 space-y-1">
                {messages.map((msg,index)=>(
                    <div key={index} className="p-1">
                        {msg.text}
                    </div>
                ))}
            </div>

            <textarea readOnly={!isAllowedtoChat} className="p-2 border-t border-gray-700 bg-gray-800 text-white w-full resize-none" rows={3} placeholder="Type your message..." value={inputMessage} onChange={(e) => {setInputMessage(e.target.value)}} onKeyDown={handleEnterKey}></textarea>
            <button className="p-3 border-t border-gray-700 bg-gray-800 hover:bg-gray-700" onClick={handleSendMessage}>Send Message</button>
        </div>
    )
}