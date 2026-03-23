"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "../lib/socket";

export default function RoomSelect() {
  const [room, setRoom] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    
    // Check if already connected
    if (socket.connected) setIsConnected(true);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const joinRoom = (r?: string) => {
    if (!isConnected) return; // Prevent join if not connected
    const roomToJoin = r || room;
    if (!roomToJoin) return;
    router.push(`/canvas/${roomToJoin}`);
  };

  const joinScribleRoom = (r?: string) => {
    if (!isConnected) return; // Prevent join if not connected
    const roomToJoin = r || room;
    if (!roomToJoin) return;
    router.push(`/scrible/${roomToJoin}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-40 p-6 text-foreground">
      
      {/* 1. Connection Status */}
      <div className={`fixed top-24 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500 flex items-center gap-2 shadow-sm
        ${isConnected ? 'border-green-500/30 bg-green-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-amber-500 animate-pulse'}`} />
        <span className="text-xs font-medium uppercase tracking-wider">
          {isConnected ? 'Server Online' : 'Connecting to Server...'}
        </span>
      </div>

      <h1 className="text-4xl font-bold mb-8 tracking-tight drop-shadow-lg text-primary">
        Select a Room
      </h1>

   
      <div className={`w-full max-w-lg flex shadow-xl rounded-lg mb-12 overflow-hidden border border-ui-border backdrop-blur-md transition-opacity duration-300 ${!isConnected && 'opacity-60 pointer-events-none'}`}>
        <input
          className="flex-1 p-4 bg-ui-input text-primary placeholder-text-muted outline-none transition-colors"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Type a room name..."
          disabled={!isConnected}
        />
        <button
          onClick={() => joinRoom()}
          disabled={!isConnected}
          className="bg-action px-8 font-semibold text-white hover:bg-action-hover transition-colors border-l border-ui-border disabled:bg-gray-500"
        >
          {isConnected ? 'GO' : '...'}
        </button>
      </div>

     
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl transition-all duration-500 ${!isConnected ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100 grayscale-0'}`}>

        
        <div 
          onClick={() => joinScribleRoom("scribleRoom1")}
          className="cursor-pointer bg-accent-gradient p-6 rounded-2xl shadow-lg hover:shadow-action/40 hover:-translate-y-1 transition-all flex flex-col justify-between h-40 border border-ui-border"
        >
          <span className="bg-black/20 backdrop-blur-md w-fit px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-white">
            Game Mode
          </span>
          <h3 className="text-2xl font-bold drop-shadow-md text-white">
            Scribble Room
          </h3>
        </div>

        {["room1", "room2", "room3", "room4", "room5"].map((r, i) => (
          <div 
            key={r}
            onClick={() => joinRoom(r)}
            className="group cursor-pointer bg-card-bg backdrop-blur-sm p-6 rounded-2xl border border-ui-border hover:border-action/50 hover:shadow-xl hover:shadow-action/10 transition-all flex flex-col justify-center items-center h-40"
          >
            <div className="w-12 h-12 bg-action-soft rounded-full flex items-center justify-center mb-3 group-hover:bg-action group-hover:text-white transition-colors text-action">
              <span className="font-bold text-lg">{i + 1}</span>
            </div>
            <p className="font-medium capitalize text-primary group-hover:text-action transition-colors">
              {r}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}