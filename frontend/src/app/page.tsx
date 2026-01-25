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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
      
      <h1 className="text-4xl font-bold mb-8 tracking-tight drop-shadow-lg">
        Select a Room
      </h1>

      <div className="w-full max-w-lg flex shadow-2xl rounded-lg mb-12 overflow-hidden border border-white/20">
        <input
          className="flex-1 p-4 bg-black/30 backdrop-blur-sm text-white placeholder-gray-400 outline-none focus:bg-black/50 transition-colors"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Type a room name..."
        />
        <button
          onClick={() => joinRoom()}
          className="bg-indigo-600 px-8 font-semibold hover:bg-indigo-500 transition-colors border-l border-white/10"
        >
          GO
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">

        <div 
          onClick={() => joinScribleRoom("scribleRoom1")}
          className="cursor-pointer bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-lg hover:shadow-purple-500/50 hover:-translate-y-1 transition-all text-white flex flex-col justify-between h-40 border border-white/20"
        >
          <span className="bg-black/20 backdrop-blur-md w-fit px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
            Game Mode
          </span>
          <h3 className="text-2xl font-bold drop-shadow-md">Scribble Room</h3>
        </div>

        {["room1", "room2", "room3", "room4", "room5"].map((r, i) => (
          <div 
            key={r}
            onClick={() => joinRoom(r)}
            className="group cursor-pointer bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex flex-col justify-center items-center h-40"
          >

            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-500 group-hover:text-white transition-colors text-indigo-300">
              <span className="font-bold text-lg">{i + 1}</span>
            </div>
            
            <p className="font-medium text-gray-200 capitalize group-hover:text-white">
              {r}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}