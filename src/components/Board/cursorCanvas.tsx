"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef, use } from "react";
import { Socket } from "socket.io-client";
import { Cursor } from "@/lib/Cursor";
// Adjust these import paths to match where your socket handlers live
import { onInitCursors } from "@/lib/socketHandlers/onInitCursors";
import { onUserJoined } from "@/lib/socketHandlers/onUserJoined";
import { onDrawCursors } from "@/lib/socketHandlers/onDrawCursors";
import { onUserLeft } from "@/lib/socketHandlers/onUserLeft";

interface CursorOverlayProps {
  socket: Socket | null;
  room: string;
}

// This interface defines what the Parent is allowed to call on this component
export interface CursorOverlayRef {
  moveMyCursor: (x: number, y: number) => void;
  clear: () => void;
}

const CursorOverlay = forwardRef<CursorOverlayRef, CursorOverlayProps>(({ socket, room }, ref) => {
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const myCursor = useRef<Cursor | null>(null);
  const otherCursors = useRef<Map<string, Cursor>>(new Map());

  useEffect(() => {
    myCursor.current = new Cursor("0", "red", "Me");
  }, []);

  useEffect(() => {
    if(!socket) return;

    onInitCursors(socket, otherCursors, cursorCanvasRef, myCursor);
    onUserJoined(socket, myCursor, cursorCanvasRef, otherCursors);
    onDrawCursors(otherCursors, socket, cursorCanvasRef, myCursor);
    onUserLeft(socket, cursorCanvasRef, otherCursors, myCursor);

    return () => {
      socket.off("initCursors");
      socket.off("userJoined");
      socket.off("drawCursors");
      socket.off("userLeft");
    }
  }, [socket]);

  useImperativeHandle(ref, () =>({
    moveMyCursor: (x: number, y: number) => {
        myCursor.current?.update(x, y);
        const ctx = cursorCanvasRef.current!.getContext("2d")!;
        ctx.clearRect(0, 0, cursorCanvasRef.current!.width, cursorCanvasRef.current!.height);

        otherCursors.current.forEach(c => c.draw(ctx));
        myCursor.current?.draw(cursorCanvasRef.current!.getContext("2d")!);

        socket?.emit("drawCursor", { x, y, room });
    },

    clear: () => {
        const ctx = cursorCanvasRef.current!.getContext("2d")!;
        ctx.clearRect(0, 0, cursorCanvasRef.current!.width, cursorCanvasRef.current!.height);
        socket?.emit("drawCursor", { x: -20, y: -20, room });
    }
  }))


  return (
    <canvas
      ref={cursorCanvasRef}
      width={1400}
      height={800}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1, 
        pointerEvents: "none", 
      }}
    />
  );
});

CursorOverlay.displayName = "CursorOverlay";
export default CursorOverlay;