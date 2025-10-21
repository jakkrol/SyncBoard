"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomSelect() {
  const [room, setRoom] = useState("");
  const router = useRouter();

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
      <label className="m-1" htmlFor="roomInput" onClick={() => joinRoom("room1")}>Room1</label>
      <label className="m-1" htmlFor="roomInput" onClick={() => joinRoom("room2")}>Room2</label>
      <label className="m-1" htmlFor="roomInput" onClick={() => joinRoom("room3")}>Room3</label>
      <label className="m-1" htmlFor="roomInput" onClick={() => joinRoom("room4")}>Room4</label>
    </div>
  );
}
