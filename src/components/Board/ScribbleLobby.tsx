"use client";
import { useState } from "react";
import { Socket } from "socket.io-client";

interface ScribbleLobbyProps {
    socket: Socket | null;
    room: string;
    players: any[];
    onStart: () => void;
}

export default function ScribbleLobby({ socket, room, players, onStart }: ScribbleLobbyProps) {
    // const [players, setPlayers] = useState<Array<{id: string, name: string}>>([]);
    // const [socket, setSocket] = useState<Socket | null>(null);

    return (
        <div className="flex justify-center items-center h-screen w-full flex-col gap-4">
            <div>
                Connected players: {players.length}
            </div>
            <button onClick={onStart} disabled={players.length < 2}>Start game</button>
        </div>
    );
}
