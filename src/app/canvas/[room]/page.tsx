"use client";
import { get } from "http";
import { useParams } from "next/navigation";
import { userAgent } from "next/server";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

class Cursor {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;

  constructor(id: string, color: string, name: string) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.name = name;
  }

  update(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "12px sans-serif";
    ctx.fillText(this.name, this.x + 10, this.y + 4);
  }
}



export default function Home() {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const {room} = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const myCursor = useRef<Cursor | null>(null);
  const otherCursors = useRef<Map<string, Cursor>>(new Map());


  // const socketRef = useRef<Socket | null>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [strokeWidth, setStrokeWidth] = useState(5);
  

  useEffect(() => {
    const s = io("http://localhost:3000");
    
    setSocket(s);

    s.on("connect", () => {
        setConnected(true)
        s.emit("join", room);  
    });
    s.on("disconnect", () => setConnected(false));

    const userCursor = new Cursor("0", "red", "User ");
    myCursor.current = userCursor;


    const ctx = canvasRef.current?.getContext('2d')!;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = strokeWidth;

    s.on("loadBoard", (data: string) => {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = data; 
    });

    s.on("initializeCursors", (cursors: {id: string, name: string, color: string}[]) => {
      otherCursors.current.clear();
      cursors.forEach((c) => {
        const cursor = new Cursor(c.id, c.color, c.name);
        otherCursors.current.set(c.id, cursor);
      });
      reDrawCursors();
    });


  s.on("userJoined", ({ id, name, color }: { id: string; name: string; color: string }) => {
    if (id === s.id) {
      // This is our own cursor info
      myCursor.current = new Cursor(id, color, name);
    } else {
      // Other users
      otherCursors.current.set(id, new Cursor(id, color, name));
    }
    reDrawCursors();
  });


  s.on("drawCursor", ({ id, x, y }: { id: string; x: number; y: number }) => {
    if (otherCursors.current.has(id)) {
      const cursor = otherCursors.current.get(id)!;
      cursor.update(x, y);
      reDrawCursors();
    }
  });


    s.on("draw", ({ x0, y0, x1, y1, color, width }: { x0: number; y0: number; x1: number; y1: number, color: string, width: any }) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      draw(x0, y0, x1, y1, ctx);
      ctx.restore();
    })

    return () => {
      s.off("connect");
      s.off("disconnect");
      // s.off("moveCard");
      s.disconnect();
    };
  }, [room]);

  // const sendEvent = () => {
  //   socket?.emit("moveCard", {room, cardId: 1, position: "A2" });
  // };

  const draw = (x0: number, y0: number, x1: number, y1: number, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  }

  const reDrawCursors = () => {
    const ctxs = cursorCanvasRef.current?.getContext("2d");
    ctxs!.clearRect(0, 0, cursorCanvasRef.current!.width, cursorCanvasRef.current!.height);

    otherCursors.current.forEach((cursor) => {
      cursor.draw(ctxs!);
    })

    myCursor.current?.draw(ctxs!);

     // DEBUG: log all cursors
  console.log("All cursors:", {
    myCursor: myCursor.current,
    others: Array.from(otherCursors.current.values())
  });
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
    socket?.emit("draw", {room, x0: lastPos.current!.x, y0: lastPos.current!.y, x1: x, y1: y, color: canvasRef.current?.getContext('2d')?.strokeStyle, width: canvasRef.current?.getContext('2d')?.lineWidth});
    socket?.emit("saveBoard", {room, data: canvasRef.current?.toDataURL()});
    lastPos.current = {x, y};
    
  }

  const handeMouseUp = (e: React.MouseEvent) =>{
    drawing.current = false;
    lastPos.current = null;
  }


  const handleColorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const color = window.getComputedStyle(element).backgroundColor;
    console.log("Selected color:", color);
    const ctx = canvasRef.current?.getContext('2d');
    ctx!.strokeStyle = color;
  }

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setStrokeWidth(size);
    const ctx = canvasRef.current?.getContext('2d');
    ctx!.lineWidth = size;
  }

const handleCursorMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const pos = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
  const x = e.clientX - pos.left;
  const y = e.clientY - pos.top;

  myCursor.current?.update(x, y);

  const ctxs = cursorCanvasRef.current?.getContext("2d");
  if (ctxs) {
    ctxs.clearRect(0, 0, cursorCanvasRef.current!.width, cursorCanvasRef.current!.height);
    myCursor.current?.draw(ctxs);
  }

  socket?.emit("drawCursor", { room, id: socket?.id, x, y });
};


  const handleMouseLeave = (e: React.MouseEvent) => {
    const ctxs = cursorCanvasRef.current?.getContext("2d");
    ctxs!.clearRect(0, 0, cursorCanvasRef.current!.width, cursorCanvasRef.current!.height);
  }
  
  return (
    <div style={{ padding: 20, color: "#fff", background: "#111", minHeight: "100vh" }}>
      <p>Status: {connected ? "Connected" : "Disconnected"}</p>
      <div className="">

        <div className="flex gap-1 mb-1">
          <div className="w-6 h-6 bg-white border rounded cursor-pointer" onClick={handleColorClick}/>
          <div className="w-6 h-6 bg-red-500 border rounded cursor-pointer" onClick={handleColorClick}/>
          <div className="w-6 h-6 bg-green-500 border rounded cursor-pointer" onClick={handleColorClick}/>
          <div className="w-6 h-6 bg-blue-500 border rounded cursor-pointer" onClick={handleColorClick}/>
          <div className="w-6 h-6 bg-yellow-400 border rounded cursor-pointer" onClick={handleColorClick}/>
        </div>


        <div>
          <label className="mr-3">Brush size: {strokeWidth}</label>
          <input type="range" min="1" max="40" maxLength={40} minLength={40} value={strokeWidth} onChange={handleStrokeChange}/>
        </div>
      </div>
      {/* <button onClick={sendEvent} style={{ marginBottom: 20 }}>
        Send moveCard event
      </button>
      <h2>Events received:</h2>
      <ul>
        {events.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul> */}


  <div
    style={{ position: "relative", display: "inline-block" }}
    onMouseMove={handleCursorMove}
    onMouseLeave={handleMouseLeave}
  >
    <canvas
      width={1400}
      height={800}
      ref={canvasRef}
      style={{
        border: "solid 1px #fff",
        background: "#111",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
      onMouseDown={handeMouseDown}
      onMouseMove={handeMouseMove}
      onMouseUp={handeMouseUp}
    />

    <canvas
      width={1400}
      height={800}
      ref={cursorCanvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  </div>
    </div>
  );
}
