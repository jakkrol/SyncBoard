export function reDrawCursors(cursorCanvasRef: any, otherCursors: any, myCursor: any) {
    const canvas = cursorCanvasRef.current;
    const ctxs = canvas?.getContext("2d");
    if (!canvas || !ctxs) return;
    ctxs.clearRect(0, 0, canvas.width, canvas.height);

    otherCursors.current.forEach((cursor: any) => {
      cursor.draw(ctxs!);
    })

    myCursor.current?.draw(ctxs!);

  console.log("All cursors:", {
    myCursor: myCursor.current,
    others: Array.from(otherCursors.current.values())
  });
}