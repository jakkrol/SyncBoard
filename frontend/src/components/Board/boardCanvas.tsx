"use client";

import React, { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { onDraw } from "../../lib/socketHandlers/onDraw";
import { onLoadBoard } from "../../lib/socketHandlers/onLoadBoard";
import { handleMouseDown } from "../../lib/boardHandlers.ts/handleMouseDown";
import { handleMouseMove } from "../../lib/boardHandlers.ts/handleMouseMove";
import { handleMouseUp } from "../../lib/boardHandlers.ts/handleMouseUp";

interface BoardCanvasProps {
    socket: Socket | null;
    room: string;
    strokeWidth: number;
    strokeColor: string;
    isAllowedToDraw: boolean;
    isEraser: boolean;
}

export default function BoardCanvas({ socket, room, strokeWidth, strokeColor, isAllowedToDraw, isEraser }: BoardCanvasProps) {
const canvasRef = useRef<HTMLCanvasElement>(null); 
const drawing = useRef(false);
const lastPos = useRef<{ x: number; y: number } | null>(null);

useEffect(() => {
    if (!socket || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;

    onLoadBoard(ctx, canvasRef, socket);
    onDraw(ctx, socket);

    socket.on("clearBoard", () => {
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    });

    return () => {
      socket.off("loadBoard");
      socket.off("draw");
    };
  }, [socket]);

useEffect(() => {
    if(!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round"; 
    ctx.lineJoin = "round";
    if(isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = strokeColor;
    }
},[strokeWidth, strokeColor, isEraser]);


const getPositionMouse = (e: React.MouseEvent | React.TouchEvent) => {
    const realPos = canvasRef.current; 
    if(!realPos){return {x: 0, y: 0}}
    const pos = canvasRef.current!.getBoundingClientRect();

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = (clientX - pos.left) * (realPos.width / pos.width);
    const y = (clientY - pos.top) * (realPos.height / pos.height);
    return {
      x, y
    };
  };

    return (
  /* The Container: Control spacing here */
  <div className="relative w-full max-w-250 aspect-5/3 mx-auto mt-8 overflow-hidden shadow-2xl border-2 border-white/20 rounded-lg">
    <canvas
      className="cursor-crosshair w-full h-full"
      width={1000}
      height={600}
      ref={canvasRef}
      style={{
        background: "#111",
        pointerEvents: isAllowedToDraw ? 'auto' : 'none',
        display: "block",
      }}
      onMouseDown={(e) => handleMouseDown(e, drawing, lastPos, getPositionMouse)}
      onMouseMove={(e) => handleMouseMove(e, canvasRef, drawing, lastPos, getPositionMouse, socket, room, isEraser)} 
      onMouseUp={() => handleMouseUp(drawing, lastPos)}
      onMouseLeave={() => handleMouseUp(drawing, lastPos)}
      
      /* Add Touch Support for Mobile */
      onTouchStart={(e) => handleMouseDown(e as any, drawing, lastPos, getPositionMouse)}
      onTouchMove={(e) => handleMouseMove(e as any, canvasRef, drawing, lastPos, getPositionMouse, socket, room, isEraser)}
      onTouchEnd={() => handleMouseUp(drawing, lastPos)}
    />
  </div>
);
}



