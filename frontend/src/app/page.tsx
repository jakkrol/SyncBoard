"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "../lib/socket";

export default function RoomSelect() {
  const [room, setRoom] = useState("");
  const router = useRouter();

  useEffect(() => {
    getSocket();
  }, []);

  const joinRoom = (r?: string) => {
    const roomToJoin = r || room;
    if (!roomToJoin) return;
    router.push(`/canvas/${roomToJoin}`);
  };

  const joinScribleRoom = (r?: string) => {
    const roomToJoin = r || room;
    if (!roomToJoin) return;
    router.push(`/scrible/${roomToJoin}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-foreground">
      
      <h1 className="text-4xl font-bold mb-8 tracking-tight drop-shadow-lg text-primary">
        Select a Room
      </h1>

      {/* Adaptive Input Section */}
      <div className="w-full max-w-lg flex shadow-xl rounded-lg mb-12 overflow-hidden border border-ui-border backdrop-blur-md">
        <input
          className="flex-1 p-4 bg-ui-input text-primary placeholder-text-muted outline-none transition-colors"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Type a room name..."
        />
        <button
          onClick={() => joinRoom()}
          className="bg-action px-8 font-semibold text-white hover:bg-action-hover transition-colors border-l border-ui-border"
        >
          GO
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">

        {/* Game Mode Card - Adaptive Gradient */}
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

        {/* Room Selection Cards */}
        {["room1", "room2", "room3", "room4", "room5"].map((r, i) => (
          <div 
            key={r}
            onClick={() => joinRoom(r)}
            className="group cursor-pointer bg-card-bg backdrop-blur-sm p-6 rounded-2xl border border-ui-border hover:border-action/50 hover:shadow-xl hover:shadow-action/10 transition-all flex flex-col justify-center items-center h-40"
          >
            {/* Number Circle - Adaptive Colors */}
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