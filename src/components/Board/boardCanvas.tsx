"use client";

import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { onDraw } from "@/lib/socketHandlers/onDraw";
import { onLoadBoard } from "@/lib/socketHandlers/onLoadBoard";
import { handleMouseDown } from "@/lib/boardHandlers.ts/handleMouseDown";
import { handleMouseMove } from "@/lib/boardHandlers.ts/handleMouseMove";
import { handleMouseUp } from "@/lib/boardHandlers.ts/handleMouseUp";

interface BoardCanvasProps {
    socket: Socket | null;
    room: string;
    strokeWidth: number;
    strokeColor: string;
}

export default function BoardCanvas({ socket, room, strokeWidth, strokeColor }: BoardCanvasProps) {
const canvasRef = useRef<HTMLCanvasElement>(null); 
const drawing = useRef(false);
const lastPos = useRef<{ x: number; y: number } | null>(null);

useEffect(() => {
    if (!socket || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;

    onLoadBoard(ctx, canvasRef, socket);
    onDraw(ctx, socket);

    return () => {
      socket.off("loadBoard");
      socket.off("draw");
    };
  }, [socket]);

useEffect(() => {
    if(!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.lineCap = "round"; 
    ctx.lineJoin = "round";
},[strokeWidth, strokeColor]);


const getPositionMouse = (e: React.MouseEvent) => {
    const pos = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - pos.left,
      y: e.clientY - pos.top,
    };
  };

    return(
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
            onMouseDown={(e) => handleMouseDown(e, drawing, lastPos, getPositionMouse)}
            onMouseMove={(e) => handleMouseMove(e, canvasRef, drawing, lastPos, getPositionMouse, socket, room)} 
            onMouseUp={(e) => handleMouseUp(drawing, lastPos)}
            onMouseLeave={(e) => handleMouseUp(drawing, lastPos)}
        />
    );
}



