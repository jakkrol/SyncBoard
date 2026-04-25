"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Socket } from "socket.io-client";
import { Cursor } from "../../lib/Cursor";
import { onInitCursors } from "../../lib/socketHandlers/onInitCursors";
import { onUserJoined } from "../../lib/socketHandlers/onUserJoined";
import { onDrawCursors } from "../../lib/socketHandlers/onDrawCursors";
import { onUserLeft } from "../../lib/socketHandlers/onUserLeft";

export interface CursorOverlayRef {
  moveMyCursor: (x: number, y: number) => void;
  clear: () => void;
}

const CursorOverlay = forwardRef<CursorOverlayRef, { socket: Socket | null; room: string }>(({ socket, room }, ref) => {
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const myCursor = useRef<Cursor | null>(null);
  const otherCursors = useRef<Map<string, Cursor>>(new Map());

  useEffect(() => {
    myCursor.current = new Cursor("0", "red", "Me");
  }, []);

  // --- KLUCZOWA SYNCHRONIZACJA POZYCJI ---
  useEffect(() => {
    const syncWithBoard = () => {
      const canvas = cursorCanvasRef.current;
      // Szukamy BoardCanvas (zakładamy, że to jedyny inny canvas w tym kontenerze)
      const board = canvas?.parentElement?.querySelector('canvas:not([style*="z-index: 10"])') as HTMLCanvasElement;

      if (canvas && board) {
        const rect = board.getBoundingClientRect();
        const parentRect = canvas.parentElement?.getBoundingClientRect();

        if (parentRect) {
          canvas.style.left = `${rect.left - parentRect.left}px`;
          canvas.style.top = `${rect.top - parentRect.top}px`;
          canvas.style.width = `${rect.width}px`;
          canvas.style.height = `${rect.height}px`;
        }

        canvas.width = 1000;
        canvas.height = 600;
      }
    };

    syncWithBoard();
    window.addEventListener("resize", syncWithBoard);
    return () => window.removeEventListener("resize", syncWithBoard);
  }, []);

  useEffect(() => {
    if (!socket) return;
    onInitCursors(socket, otherCursors, cursorCanvasRef, myCursor);
    onUserJoined(socket, myCursor, cursorCanvasRef, otherCursors);
    onDrawCursors(otherCursors, socket, cursorCanvasRef, myCursor);
    onUserLeft(socket, cursorCanvasRef, otherCursors, myCursor);

    return () => {
      socket.off("initCursors");
      socket.off("userJoined");
      socket.off("drawCursors");
      socket.off("userLeft");
    };
  }, [socket]);

  useImperativeHandle(ref, () => ({
    moveMyCursor: (x: number, y: number) => {
      myCursor.current?.update(x, y);
      const canvas = cursorCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      otherCursors.current.forEach(c => c.draw(ctx));
      myCursor.current?.draw(ctx);
      socket?.emit("drawCursor", { x, y, room });
    },
    clear: () => {
      const canvas = cursorCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      socket?.emit("drawCursor", { x: -50, y: -50, room });
    }
  }));

  return (
    <canvas
      ref={cursorCanvasRef}
      style={{
        position: "absolute",
        zIndex: 10,
        pointerEvents: "none",
        display: "block",
        touchAction: "none",
      }}
    />
  );
});

CursorOverlay.displayName = "CursorOverlay";
export default CursorOverlay;