"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef, use } from "react";
import { io, Socket } from "socket.io-client";
import { getSocket } from "../../../lib/socket";
import { Cursor } from "../../../lib/Cursor";
import { onInitCursors } from "../../../lib/socketHandlers/onInitCursors";
import { onUserJoined } from "@/lib/socketHandlers/onUserJoined";
import { onDrawCursors } from "@/lib/socketHandlers/onDrawCursors";
import { onUserLeft } from "@/lib/socketHandlers/onUserLeft";
import BoardCanvas from "@/components/Board/boardCanvas";
import CursorOverlay, { CursorOverlayRef } from "@/components/Board/cursorCanvas";


export default function Home() {
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const {room} = useParams();

  // //const canvasRef = useRef<HTMLCanvasElement>(null);
  // const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  // const myCursor = useRef<Cursor | null>(null);
  // const otherCursors = useRef<Map<string, Cursor>>(new Map());
  const cursorRef = useRef<CursorOverlayRef>(null);


  // const socketRef = useRef<Socket | null>(null);
  // const drawing = useRef(false);
  // const lastPos = useRef<{ x: number; y: number } | null>(null);
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
    //setSocket(s);

    // s.on("connect", () => {
    //     setConnected(true)
    //     s.emit("join", room);  
    // });
    const handleDisconnect = () => setConnected(false);
    s.off("disconnect", handleDisconnect);
    s.on("disconnect", handleDisconnect);

    // const userCursor = new Cursor("0", "red", "User ");
    // myCursor.current = userCursor;


    // const ctx = canvasRef.current!.getContext('2d')!;
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = strokeWidth;

    //test if Im smart enough xd
    //onLoadBoard(ctx, canvasRef, s);
    // s.on("loadBoard", (data: string) => {
    //     const img = new Image();
    //     img.onload = () => {
    //       ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    //       ctx.drawImage(img, 0, 0);
    //     };
    //     img.src = data; 
    // });

    //onInitCursors(s, otherCursors, cursorCanvasRef, myCursor);
    // s.on("initializeCursors", (cursors: {id: string, name: string, color: string}[]) => {
    //   otherCursors.current.clear();
    //   cursors.forEach((c) => {
    //     const cursor = new Cursor(c.id, c.color, c.name);
    //     otherCursors.current.set(c.id, cursor);
    //   });
    //   reDrawCursors();
    // });


    //onUserJoined(s, myCursor, cursorCanvasRef, otherCursors);
    
  // s.on("userJoined", ({ id, name, color }: { id: string; name: string; color: string }) => {
  //   if (id === s.id) {
  //     myCursor.current = new Cursor(id, color, name);
  //   } else {
  //     otherCursors.current.set(id, new Cursor(id, color, name));
  //   }
  //   reDrawCursors(cursorCanvasRef, otherCursors, myCursor);
  // });


  //onDrawCursors(otherCursors, s, cursorCanvasRef,  myCursor);
  // s.on("drawCursor", ({ id, x, y }: { id: string; x: number; y: number }) => {
  //   if (otherCursors.current.has(id)) {
  //     const cursor = otherCursors.current.get(id)!;
  //     cursor.update(x, y);
  //     reDrawCursors(cursorCanvasRef, otherCursors, myCursor);
  //   }
  // });

 // onDraw(ctx, s);
    // s.on("draw", ({ x0, y0, x1, y1, color, width }: { x0: number; y0: number; x1: number; y1: number, color: string, width: number }) => {
    //   ctx.save();
    //   ctx.strokeStyle = color;
    //   ctx.lineWidth = width;
    //   drawLine(x0, y0, x1, y1, ctx);
    //   ctx.restore();
    // })

  //onUserLeft(s, cursorCanvasRef, otherCursors, myCursor);
    // s.on("userLeft", ({ id }: { id: string }) => {
    //   if (otherCursors.current.has(id)) {
    //     otherCursors.current.delete(id);
    //     reDrawCursors(cursorCanvasRef, otherCursors, myCursor);
    //   }
    // });

    return () => {
      s.emit("leave", room);
      //s.off("join");
      s.off("connect");
      s.off("disconnect");
      s.off("loadBoard");
      s.off("initializeCursors");
      s.off("userJoined");
      s.off("draw");
      s.off("drawCursor");
      s.off("userLeft");
      // s.off("moveCard");
      //s.disconnect();
      //console.log("Socket disconnected");
    };
  }, [room]);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const pos = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - pos.left;
    const y = e.clientY - pos.top;

    cursorRef.current?.moveMyCursor(x, y);
  }
  const handleContainerMoveLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    cursorRef.current?.clear();
  }


  // const getPositionMouse = (e: React.MouseEvent) => {
  //   const pos = canvasRef.current!.getBoundingClientRect();
  //   return {
  //     x: e.clientX - pos.left,
  //     y: e.clientY - pos.top
  //   };
  // }

  // const handeMouseDown = (e: React.MouseEvent) =>{
  //   drawing.current = true;
  //   const {x, y} = getPositionMouse(e);
  //   lastPos.current = {x, y};

  // };

  // const handeMouseMove = (e: React.MouseEvent) =>{
  //   if(!drawing.current) return;
  //   const {x, y} = getPositionMouse(e);
  //   const ctx = canvasRef.current!.getContext('2d');
    
    
  //   drawLine(lastPos.current!.x, lastPos.current!.y, x, y, ctx!);
  //   socket?.emit("draw", {room, x0: lastPos.current!.x, y0: lastPos.current!.y, x1: x, y1: y, color: canvasRef.current!.getContext('2d')?.strokeStyle, width: canvasRef.current!.getContext('2d')?.lineWidth});
  //   socket?.emit("saveBoard", {room, data: canvasRef.current!.toDataURL()});
  //   lastPos.current = {x, y};
  // }

  // const handeMouseUp = (e: React.MouseEvent) =>{
  //   drawing.current = false;
  //   lastPos.current = null;
  // }


  const handleColorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const color = window.getComputedStyle(element).backgroundColor;
    console.log("Selected color:", color);
    // const ctx = canvasRef.current!.getContext('2d');
    // ctx!.strokeStyle = color;
    setStrokeColor(color);
  }

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setStrokeWidth(size);
    // const ctx = canvasRef.current!.getContext('2d');
    // ctx!.lineWidth = size;
    setStrokeWidth(size);
  }

// const handleCursorMove = (e: React.MouseEvent<HTMLDivElement>) => {
//   const pos = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
//   const x = e.clientX - pos.left;
//   const y = e.clientY - pos.top;

//   myCursor.current?.update(x, y);

//   const ctxs = cursorCanvasRef.current!.getContext("2d");
//   if (ctxs) {
//     ctxs.clearRect(0, 0, cursorCanvasRef.current!.width, cursorCanvasRef.current!.height);
//     myCursor.current?.draw(ctxs);
//   }

//   socket?.emit("drawCursor", { room, id: socket?.id, x, y });
// };


  // const handleMouseLeave = (e: React.MouseEvent) => {
  //   const ctxs = cursorCanvasRef.current!.getContext("2d");
  //   ctxs!.clearRect(0, 0, cursorCanvasRef.current!.width, cursorCanvasRef.current!.height);
  // }
  
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
  <div
    style={{ position: "relative", display: "inline-block" }}
    onMouseMove={handleContainerMouseMove}
    onMouseLeave={handleContainerMoveLeave}
  >
    {/* <canvas
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
    /> */}
    <BoardCanvas 
            socket={socket} 
            room={room as string} 
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
        />

    <CursorOverlay 
          ref={cursorRef} 
          socket={socket} 
          room={room as string}
        />
  </div>
    </div>
  );
}
