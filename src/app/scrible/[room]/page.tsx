"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../../../lib/socket";
import BoardCanvas from "@/components/Board/boardCanvas";

export default function Home() {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const {room} = useParams();

    const [strokeWidth, setStrokeWidth] = useState(5);
    const [strokeColor, setStrokeColor] = useState("red");
    

  useEffect(() => {
    const s = getSocket();
    setSocket(s);
    const handleConnect = () => {
      s.emit("join", room); 
      setConnected(true);
    };
 
    s.off("connect", handleConnect);
    s.on("connect", handleConnect);

    if(s.connected) handleConnect();

    const handleDisconnect = () => setConnected(false);
    s.off("disconnect", handleDisconnect);
    s.on("disconnect", handleDisconnect);

  
    return () => {
      s.emit("leave", room);
      s.off("connect");
      s.off("disconnect");
      s.off("userJoined");
      s.off("userLeft");
    };
  }, [room]);


  return (
    <div>
        <BoardCanvas socket={socket} room={room as string} strokeWidth={strokeWidth} strokeColor={strokeColor} />
    </div>
    
  );
}