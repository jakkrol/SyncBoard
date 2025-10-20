"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomSelect() {
  const [room, setRoom] = useState("");
  const router = useRouter();

  const joinRoom = () => {
    if (!room) return;
    router.push(`/canvas/${room}`);
  };

  return (
    <div>
      <h1 className="m-1">Choose a room</h1>
      <input className="m-1" value={room} onChange={e => setRoom(e.target.value)} placeholder="Room name" />
      <button onClick={joinRoom}>Join</button>
    </div>
  );
}
