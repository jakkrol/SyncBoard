"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "../lib/socket";
import { get } from "http";

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

  return (
    <div>
      <h1 className="m-1">Choose a room</h1>
      <input className="m-1" value={room} onChange={e => setRoom(e.target.value)} placeholder="Room name" />
      <button onClick={() => joinRoom()}>Join</button>

      <div className="flex flex-col items-start">
        <p className="m-2 font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" onClick={() => joinRoom("room1")}>Room1</p>
        <p className="m-2 font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" onClick={() => joinRoom("room2")}>Room2</p>
        <p className="m-2 font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" onClick={() => joinRoom("room3")}>Room3</p>
        <p className="m-2 font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" onClick={() => joinRoom("room4")}>Room4</p>
        <p className="m-2 font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" onClick={() => joinRoom("room5")}>Room5</p>
      </div>
    </div>
  );
}
