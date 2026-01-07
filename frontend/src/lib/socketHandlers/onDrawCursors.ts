import { reDrawCursors } from "../tools/reDrawCursors";
export function onDrawCursors(otherCursors:any,  s:any, cursorCanvasRef:any,  myCursor:any) {
      s.on("drawCursor", ({ id, x, y }: { id: string; x: number; y: number }) => {
        if (otherCursors.current.has(id)) {
          //console.log(`drawCursor received for ${id}: (${x}, ${y})`);
          const cursor = otherCursors.current.get(id)!;
          cursor.update(x, y);
          reDrawCursors(cursorCanvasRef, otherCursors, myCursor);
        }
      });
}