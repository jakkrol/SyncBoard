import { Socket } from "socket.io-client";

export function handleSaveBoard(room: string, socket: Socket | null, canvasRef: React.RefObject<HTMLCanvasElement | null>) {
    console.log("Saving board...");
    socket?.emit("saveBoard", {room, data: canvasRef.current!.toDataURL()});
}