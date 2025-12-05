import { Cursor } from "../Cursor";

export function onUserJoined(s: any, myCursor: any, otherCursors: any, reDrawCursors: ()=> void) {
      s.on("userJoined", ({ id, name, color }: { id: string; name: string; color: string }) => {
    if (id === s.id) {
      myCursor.current = new Cursor(id, color, name);
    } else {
      otherCursors.current.set(id, new Cursor(id, color, name));
    }
    reDrawCursors();
  });

}