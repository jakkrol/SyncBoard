import { Cursor } from "../Cursor";
import { reDrawCursors } from "../tools/reDrawCursors";

export function onInitCursors(s: any, otherCursors: any, cursorCanvasRef: any, myCursor: any) {
    s.on("initializeCursors", (cursors: {id: string, name: string, color: string}[]) => {
        otherCursors.current.clear();
        cursors.forEach((c) => {
            const cursor = new Cursor(c.id, c.color, c.name);
            otherCursors.current.set(c.id, cursor);
        });
        reDrawCursors(cursorCanvasRef, otherCursors, myCursor);
    });
}