import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";


interface ChatProps {
    socket: Socket | null;
    room: string;
    username: string;
}

interface Message {
    user: string;
    text: string;
}


export default function Chat({socket, room, username}: ChatProps){
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");

    useEffect(() => {
        if(!socket) return;
        socket.on("chatMessage", (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
    }, [socket])

    const handleSendMessage = () => {
        if(!socket) return;
        const messageText = username + ": " + inputMessage;
        socket.emit("chatMessage", {room, text: messageText});
    };

    return(      
        <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700 w-80">
            {/* HEADER */}
            <div className="p-3 border-b border-gray-700 bg-gray-800">
                <h3 className="font-bold text-white">Room Chat</h3>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg,index)=>(
                    <div key={index} className="p-2 bg-gray-800 rounded">
                        {msg.text}
                    </div>
                ))}
            </div>

            <textarea className="p-2 border-t border-gray-700 bg-gray-800 text-white w-full resize-none" rows={3} placeholder="Type your message..." onChange={(e) => {setInputMessage(e.target.value)}}></textarea>
            <button className="p-3 border-t border-gray-700 bg-gray-800 hover:bg-gray-700" onClick={handleSendMessage}>Send Message</button>
        </div>
    )
}