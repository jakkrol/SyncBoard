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
  const [isEraserOn, setIsEraserOn] = useState(false);
  

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

  // const handleColorClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   const element = e.target as HTMLDivElement;
  //   const color = window.getComputedStyle(element).backgroundColor;
  //   setStrokeColor(color);
  // }

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setStrokeWidth(size);
  }

  
  return (
  <div className="flex h-screen w-screen overflow-hidden ">
    
    <div className="p-4 flex flex-col z-10 relative"> 
      
      {/* Color Picker */}
      {/* <div className="flex gap-1 mb-4 flex-col">
         <div className="w-6 h-6 bg-white border rounded cursor-pointer" onClick={handleColorClick}/>
         <div className="w-6 h-6 bg-red-600 border rounded cursor-pointer" onClick={handleColorClick}/>
         <div className="w-6 h-6 bg-green-500 border rounded cursor-pointer" onClick={handleColorClick}/>
         <div className="w-6 h-6 bg-blue-500 border rounded cursor-pointer" onClick={handleColorClick}/>
         <div className="w-6 h-6 bg-yellow-400 border rounded cursor-pointer" onClick={handleColorClick}/>
      </div> */}

      <div className="mt-4">
        <ColorPicker onColorChange={(color) => setStrokeColor(color)}/>
      </div>

      {/* Slider */}
      <div className="flex flex-col relative items-center mt-5">
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

        {/* Ereaser */}
        <button
            onClick={() => setIsEraserOn(!isEraserOn)}
            title="Toggle Eraser"
            className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center ${
                isEraserOn
                    ? "bg-gray-800 text-white shadow-md scale-105"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 shadow-sm"
            }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
                <path d="M22 21H7"/>
                <path d="m5 11 9 9"/>
            </svg>
      </button>

    </div>

    {/* Canvas Container */}
    <div
      className="flex-1 relative m-5"
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMoveLeave}
    >
      <BoardCanvas 
           socket={socket} 
           room={room as string} 
           strokeWidth={strokeWidth}
           strokeColor={strokeColor}
           isAllowedToDraw={true}
           isEraser={isEraserOn}
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
