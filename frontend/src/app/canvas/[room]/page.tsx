"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../../../lib/socket";
import BoardCanvas from "../../../components/Board/boardCanvas";
import CursorOverlay, { CursorOverlayRef } from "../../../components/Board/cursorCanvas";
import ColorPicker from "@/components/ColorPicker";
import RotateNotice from "@/components/RotateNotice";

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { room } = useParams();
  const cursorRef = useRef<CursorOverlayRef>(null);

  const [strokeWidth, setStrokeWidth] = useState(5);
  const [strokeColor, setStrokeColor] = useState("red");
  const [isEraserOn, setIsEraserOn] = useState(false);

  useEffect(() => {
    const s = getSocket();
    setSocket(s);
    const handleConnect = () => s.emit("join", room);
    s.on("connect", handleConnect);
    if(s.connected) handleConnect();
    return () => {
      s.emit("leave", room);
      s.off("connect");
    };
  }, [room]);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Szukamy fizycznej tablicy
    const board = e.currentTarget.querySelector('canvas:not([style*="z-index: 10"])');
    if (!board) return;

    const rect = board.getBoundingClientRect();
    
    // Obliczamy pozycję względem tablicy (klucz do synchronizacji rysunku)
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 600;

    cursorRef.current?.moveMyCursor(x, y);
  };

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(parseInt(e.target.value, 10));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      
      <RotateNotice />
      {/* TWOJA ORYGINALNA LEWA KOLUMNA */}
      <div className="p-4 flex flex-col z-10 relative"> 
        <div className="mt-4">
          <ColorPicker onColorChange={(color) => setStrokeColor(color)}/>
        </div>

        <div className="flex flex-col relative items-center mt-5">
          <label className="text-xs mb-1">Brush size: {strokeWidth}px</label>
          <input 
              type="range" min="1" max="40" 
              value={strokeWidth} 
              onChange={handleStrokeChange}
              className="w-24"
          /> 
        </div>

        <button
            onClick={() => setIsEraserOn(!isEraserOn)}
            className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center mt-4 ${
                isEraserOn ? "bg-gray-800 text-white shadow-md scale-105" : "bg-white text-gray-500 border border-gray-200"
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/>
              <path d="M22 21H7"/><path d="m5 11 9 9"/>
          </svg>
        </button>
      </div>



      <div className="flex-1 relative m-10 flex items-center justify-center ">
        {/* Kontener, do którego CursorOverlay się "przykleja" */}
        <div 
          className="relative inline-block"
          onMouseMove={handleContainerMouseMove}
          onMouseLeave={() => cursorRef.current?.clear()}
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
    </div>
  );
}