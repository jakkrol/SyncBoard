"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../../../lib/socket";
import BoardCanvas from "@/components/Board/BoardCanvas";
import Chat from "@/components/Chat";
import ScribbleLobby from "@/components/Board/ScribbleLobby";

export default function Home() {
    //const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const {room} = useParams();

    const [strokeWidth, setStrokeWidth] = useState(5);
    const [strokeColor, setStrokeColor] = useState("red");
    const [players, setPlayers] = useState<Array<{id: string, name: string}>>([]);

    const [gameStarted, setGameStarted] = useState(false);
    

  useEffect(() => {
    const s = getSocket();
    setSocket(s);
    const handleConnect = () => {
      s.emit("join", room);
      s.emit("joinScribble", room); 
      //setConnected(true);
    };
 
    //s.off("connect", handleConnect);
    s.on("connect", handleConnect);

    if(s.connected) handleConnect();
    s.on("startScribbleGameServer", () => {
      setGameStarted(true);
    });
    s.on("updatePlayerList", (listPlayers) => {
      setPlayers(listPlayers);
      console.log("Updated player list:", listPlayers);
    });
    // const handleDisconnect = () => setConnected(false);
    // s.off("disconnect", handleDisconnect);
    // s.on("disconnect", handleDisconnect);

  
    return () => {
      s.emit("leave", room);
      s.off("connect");
      s.off("disconnect");
      s.off("userJoined");
      s.off("userLeft");
    };
  }, [room]);

  const handleColorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    const bg = window.getComputedStyle(el).backgroundColor;
    setStrokeColor(bg);
  }

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrokeWidth(parseInt(e.target.value));
  }

  const handleStartGame = () => {
    if(socket){
      socket.emit("startScribbleGame", room);
      setGameStarted(true);
    }
  };
  return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
        {!gameStarted ? (
          <ScribbleLobby socket={socket} room={room as string} players={players} onStart={() => {handleStartGame()}} />
        ) : (
          <div className="flex flex-1">
              <div className=" flex-1 relative">
                <div className="m-2">
                    <div className="flex gap-1 mb-2">
                      <div className="w-6 h-6 bg-white border rounded cursor-pointer" onClick={handleColorClick}/>
                      <div className="w-6 h-6 bg-red-500 border rounded cursor-pointer" onClick={handleColorClick}/>
                      <div className="w-6 h-6 bg-green-500 border rounded cursor-pointer" onClick={handleColorClick}/>
                      <div className="w-6 h-6 bg-blue-500 border rounded cursor-pointer" onClick={handleColorClick}/>
                      <div className="w-6 h-6 bg-yellow-400 border rounded cursor-pointer" onClick={handleColorClick}/>
                    </div>


                    <div>
                      <label className="mr-3">Brush size: {strokeWidth}</label>
                      <input type="range" min="1" max="40" maxLength={40} minLength={40} value={strokeWidth} onChange={handleStrokeChange}/>
                    </div>
                </div>

              

              <div className="flex-1 relative m-5">
                  <BoardCanvas 
                      socket={socket} 
                      room={room as string} 
                      strokeWidth={strokeWidth} 
                      strokeColor={strokeColor} 
                  />
              </div>
            </div>

            <div style={{position: 'relative' }}>
                <Chat 
                    socket={socket} 
                    room={room as string} 
                    username={socket?.id || "Anonymous"} 
                />
            </div> 
          </div>
        )}

        
      </div>
    
  );
}