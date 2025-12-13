import { Socket } from "socket.io-client";
import { reDrawCursors } from "../tools/reDrawCursors";

export function onUserLeft(s: Socket, cursorCanvasRef: React.RefObject<HTMLCanvasElement | null>, otherCursors: React.RefObject<Map<string, any>>, myCursor: React.RefObject<any>) {
    s.on("userLeft", ({ id }: { id: string }) => {
      if (otherCursors.current.has(id)) {
        otherCursors.current.delete(id);
        reDrawCursors(cursorCanvasRef, otherCursors, myCursor);
      }
    });
}