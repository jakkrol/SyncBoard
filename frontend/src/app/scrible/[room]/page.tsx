"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../../../lib/socket";
import BoardCanvas from "../../../components/Board/boardCanvas";
import Chat from "../../../components/Chat";
import ScribbleLobby from "../../../components/Board/ScribbleLobby";
import ColorPicker from "../../../components/ColorPicker";

export default function Home() {
    //const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const {room} = useParams();

    const [word, setWord] = useState("");
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [strokeColor, setStrokeColor] = useState("red");
    const [players, setPlayers] = useState<any[]>([]);

    const [gameStarted, setGameStarted] = useState(false);

    const [drawingUser, setDrawingUser] = useState<string | null>(null);
    

  useEffect(() => {
    const s = getSocket();
    setSocket(s);
    const handleConnect = () => {
      //s.emit("join", room);
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

    s.on("updateGameState", (data: { drawingUser: string, currentWord: string }) => {
      setDrawingUser(data.drawingUser);
      setWord(data.currentWord);
      //console.log("Game state updated:", data);
    });
    // const handleDisconnect = () => setConnected(false);
    // s.off("disconnect", handleDisconnect);
    // s.on("disconnect", handleDisconnect);

  
    return () => {
      s.emit("leave", room);
      s.off("connect");
      s.off("disconnect");
      // s.off("loadBoard");
      // s.off("initializeCursors");
      s.off("userJoined");
      // s.off("draw");
      // s.off("drawCursor");
      s.off("userLeft");
    };
  }, [room]);

  const checkIfDrawingAllowed = useMemo(() => {
    if(!socket || !drawingUser) return false;
    console.log("Checking drawing permission:", socket.id, drawingUser);

    if(socket.id === drawingUser){
      return true;
    }else{
      return false;
    }
  },[drawingUser, socket]);


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
                {checkIfDrawingAllowed && (
                <div>
                  <h1 className="text-2xl font-bold p-4">Word to guess: {word}</h1>
                </div> 
                )}
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
                      isAllowedToDraw={checkIfDrawingAllowed}
                  />
              </div>
            </div>

            <div style={{position: 'relative' }}>
                <Chat 
                    socket={socket} 
                    room={room as string} 
                    username={socket?.id || "Anonymous"}
                    isAllowedtoChat={!checkIfDrawingAllowed}
                    onMessageSent={(message) => console.log("Message sent:", message)}
                />
            </div> 
          </div>
        )}

        
      </div>
    
  );
}