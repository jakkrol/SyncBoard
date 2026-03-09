"use client"
import { useEffect, useState } from "react";


interface ScoreBoardProps {
    scoreboard: Record<string, number>;
    drawingUser: string;
}

export default function ScoreBoard({scoreboard, drawingUser}: ScoreBoardProps){
    useEffect(() => {
        console.log("Scoreboard updated:", scoreboard);
    }, [scoreboard]);

   

    return(
        <div>

        </div>
    );
}
