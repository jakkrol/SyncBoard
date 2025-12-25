"use client";
import { useState } from "react";
import { Socket } from "socket.io-client";

interface ScribbleLobbyProps {
    socket: Socket | null;
    room: string;
    players: Array<{id: string, name: string}>;
    onStart: () => void;
}

export default function ScribbleLobby() {
    const [players, setPlayers] = useState<Array<{id: string, name: string}>>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    return (
        <div>

        </div>
    );
}
