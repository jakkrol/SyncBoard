"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../../../lib/socket";
import BoardCanvas from "../../../components/Board/boardCanvas";
import CursorOverlay, { CursorOverlayRef } from "../../../components/Board/cursorCanvas";
import ColorPicker from "@/components/ColorPicker";


export default function Home() {
  //const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const {room} = useParams();

  const cursorRef = useRef<CursorOverlayRef>(null);

  const [strokeWidth, setStrokeWidth] = useState(5);
  const [strokeColor, setStrokeColor] = useState("red");
  

  useEffect(() => {
    const s = getSocket();
    setSocket(s);
    const handleConnect = () => {
      s.emit("join", room); 
      //setConnected(true);
    };
 
    // s.off("connect", handleConnect);
    s.on("connect", handleConnect);

    if(s.connected) handleConnect();

    // const handleDisconnect = () => setConnected(false);
    // s.off("disconnect", handleDisconnect);
    // s.on("disconnect", handleDisconnect);

  
    return () => {
      s.emit("leave", room);
      s.off("connect");
      s.off("disconnect");
      s.off("loadBoard");
      s.off("initializeCursors");
      s.off("userJoined");
      s.off("draw");
      s.off("drawCursor");
      s.off("userLeft");

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


 
  const handleColorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const color = window.getComputedStyle(element).backgroundColor;
    setStrokeColor(color);
  }

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setStrokeWidth(size);
  }

  
  return (
  <div className="flex h-screen w-screen overflow-hidden ">
    
    <div className="p-4 flex flex-col z-10"> 
      
      {/* Color Picker */}
      <div className="flex gap-1 mb-4 flex-col">
         <div className="w-6 h-6 bg-white border rounded cursor-pointer" onClick={handleColorClick}/>
         <div className="w-6 h-6 bg-red-600 border rounded cursor-pointer" onClick={handleColorClick}/>
         <div className="w-6 h-6 bg-green-500 border rounded cursor-pointer" onClick={handleColorClick}/>
         <div className="w-6 h-6 bg-blue-500 border rounded cursor-pointer" onClick={handleColorClick}/>
         <div className="w-6 h-6 bg-yellow-400 border rounded cursor-pointer" onClick={handleColorClick}/>
         <ColorPicker />
      </div>

      {/* Slider */}
      <div className="flex flex-col relative items-center">
        <label className="text-xs mb-1">Brush size: {strokeWidth}px</label>
        <input 
            type="range" 
            min="1" 
            max="40" 
            value={strokeWidth} 
            onChange={handleStrokeChange}
            className="w-24 "
        /> 
      </div>
    </div>

    {/* Canvas Container */}
    <div
      className="flex-1 relative cursor-crosshair m-5"
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMoveLeave}
    >
      <BoardCanvas 
           socket={socket} 
           room={room as string} 
           strokeWidth={strokeWidth}
           strokeColor={strokeColor}
           isAllowedToDraw={true}
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
