"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    s.on("moveCard", (data) => {
      setEvents((prev) => [...prev, JSON.stringify(data)]);
    });

    // Cleanup on unmount
    return () => {
      s.off("connect");
      s.off("disconnect");
      s.off("moveCard");
      s.disconnect();
    };
  }, []);

  const sendEvent = () => {
    socket?.emit("moveCard", { cardId: 1, position: "A2" });
  };



  const handeMouseDown = (e: React.MouseEvent) =>{

  };

  return (
    <div style={{ padding: 20, color: "#fff", background: "#111", minHeight: "100vh" }}>
      <h1>Socket.IO Test</h1>
      <p>Status: {connected ? "Connected" : "Disconnected"}</p>
      <button onClick={sendEvent} style={{ marginBottom: 20 }}>
        Send moveCard event
      </button>
      <h2>Events received:</h2>
      <ul>
        {events.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>


      <canvas
        width={800}
        height={600}
        style={{border: 'solid 1px #fff', background: '#111' }}
        ref={canvasRef}
        onMouseDown={handeMouseDown}
      />
    </div>
  );
}
