"use client";

import { useTheme } from "next-themes"
import { useState } from "react"

export default function ToggleTheme(){

    const {theme, setTheme} = useTheme();

    return(
        <div>
            <button onClick={() => setTheme(theme == "dark" ? "light" : "dark")}>Test</button>
        </div>
    )
}