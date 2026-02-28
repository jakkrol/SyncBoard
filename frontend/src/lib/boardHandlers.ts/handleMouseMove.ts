  import { drawLine } from "../tools/drawLine";

  export function handleMouseMove(e: React.MouseEvent, canvasRef: React.RefObject<HTMLCanvasElement | null>, drawing: React.RefObject<boolean>, lastPos: React.RefObject<{x: number, y: number} | null>, getPositionMouse: (e: React.MouseEvent) => {x: number, y: number}, socket: any, room: string, isEraser: boolean  ) {
    if(!drawing.current) return;
    const {x, y} = getPositionMouse(e);
    const ctx = canvasRef.current!.getContext('2d');
    
    
    drawLine(lastPos.current!.x, lastPos.current!.y, x, y, ctx!);
    socket?.emit("draw", {room, x0: lastPos.current!.x, y0: lastPos.current!.y, x1: x, y1: y, color: canvasRef.current!.getContext('2d')?.strokeStyle, width: canvasRef.current!.getContext('2d')?.lineWidth, isEraser});
    socket?.emit("saveBoard", {room, data: canvasRef.current!.toDataURL()});
    lastPos.current = {x, y};
  }