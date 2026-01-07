import { Cursor } from "../Cursor";
import { reDrawCursors } from "../tools/reDrawCursors";

export function onUserJoined(s: any, myCursor: any, cursorCanvasRef: any, otherCursors: any) {
      s.on("userJoined", ({ id, name, color }: { id: string; name: string; color: string }) => {
    if (id === s.id) {
      myCursor.current = new Cursor(id, color, name);
    } else {
      otherCursors.current.set(id, new Cursor(id, color, name));
    }
    reDrawCursors(cursorCanvasRef, otherCursors, myCursor);
  });

}