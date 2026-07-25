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
        <div className="flex justify-center items-center h-screen w-full bg-linear-to-br from-gray-900 to-black">
            <div className="w-full max-w-md items-center justify-center flex flex-col gap-4 rounded-2xl border-6 border-gray-900 p-6 shadow-xl">
                <div>
                    Connected players: {players.length}
                </div>
                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border border-gray-700 rounded" onClick={onStart} disabled={players.length < 2}>Start game</button>
            </div>
        </div>
    );
}
