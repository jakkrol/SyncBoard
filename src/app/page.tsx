"use client";
import { get } from "http";
import { userAgent } from "next/server";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const s = io("http://localhost:3000");
    
    setSocket(s);

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    s.on("moveCard", (data) => {
      setEvents((prev) => [...prev, JSON.stringify(data)]);
    });

    const ctx = canvasRef.current?.getContext('2d')!;
    ctx.strokeStyle = 'red';

    s.on("draw", ({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) => {
      draw(x0, y0, x1, y1, ctx);
    })

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

  const draw = (x0: number, y0: number, x1: number, y1: number, ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  }

  const getPositionMouse = (e: React.MouseEvent) => {
    const pos = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - pos.left,
      y: e.clientY - pos.top
    };
  }

  const handeMouseDown = (e: React.MouseEvent) =>{
    drawing.current = true;
    const {x, y} = getPositionMouse(e);
    lastPos.current = {x, y};

  };

  const handeMouseMove = (e: React.MouseEvent) =>{
    if(!drawing.current) return;
    const {x, y} = getPositionMouse(e);
    const ctx = canvasRef.current?.getContext('2d');
    
    
    draw(lastPos.current!.x, lastPos.current!.y, x, y, ctx!);
    //socketRef.current?.emit("draw", {x0: lastPos.current!.x, y0: lastPos.current!.y, x1: x, y1: y});
    socket?.emit("draw", {x0: lastPos.current!.x, y0: lastPos.current!.y, x1: x, y1: y});
    lastPos.current = {x, y};
    
  }

  const handeMouseUp = (e: React.MouseEvent) =>{
    drawing.current = false;
    lastPos.current = null;
  }

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
        onMouseMove={handeMouseMove}
        onMouseUp={handeMouseUp}
      />
    </div>
  );
}
