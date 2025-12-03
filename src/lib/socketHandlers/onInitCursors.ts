import { Cursor } from "../Cursor";

export function onInitCursors(s: any, otherCursors: any, reDrawCursors: () => void) {
    s.on("initializeCursors", (cursors: {id: string, name: string, color: string}[]) => {
        otherCursors.current.clear();
        cursors.forEach((c) => {
            const cursor = new Cursor(c.id, c.color, c.name);
            otherCursors.current.set(c.id, cursor);
        });
        reDrawCursors();
    });
}