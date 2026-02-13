"use client"
import { useEffect, useState, useMemo } from "react";


interface ColorPickerProps {
    onColorChange: (color: string) => void;
}

export default function ColorPicker({onColorChange}: ColorPickerProps){
    const [selectedColor, setSelectedColor] = useState("#ff0000");

    const chan = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hexValue = e.target.value;
        onColorChange(hexValue);
        setSelectedColor(hexValue);
        const r = parseInt(hexValue.slice(1, 3), 16);
        const g = parseInt(hexValue.slice(3, 5), 16);
        const b = parseInt(hexValue.slice(5, 7), 16);
        const rgbValue = `rgb(${r}, ${g}, ${b})`;
        console.log("Selected color:", hexValue, rgbValue);
    }
    return(
        <div className="relative flex items-center gap-3 p-1.5 pr-4 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all w-fit group">
            
            {/* Circular Swatch */}
            <div 
                className="w-8 h-8 rounded-full shadow-inner ring-1 ring-black/10"
                style={{ backgroundColor: selectedColor }}
            />
            
            {/* Text Info */}
            <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-semibold uppercase leading-none">Primary</span>
                <span className="font-mono text-sm text-gray-800 uppercase leading-tight mt-0.5 group-hover:text-blue-600 transition-colors">
                    {selectedColor}
                </span>
            </div>

            {/* Invisible Input */}
            <input 
                type="color" 
                value={selectedColor} 
                onChange={chan}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
        </div>
        
    );
}