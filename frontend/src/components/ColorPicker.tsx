"use client"

export default function ColorPicker(){

    const chan = (e: React.ChangeEvent<HTMLInputElement>) => {
        const hexValue = e.target.value;
        const r = parseInt(hexValue.slice(1, 3), 16);
        const g = parseInt(hexValue.slice(3, 5), 16);
        const b = parseInt(hexValue.slice(5, 7), 16);
        const rgbValue = `rgb(${r}, ${g}, ${b})`;
        console.log("Selected color:", hexValue, rgbValue);
    }
    return(
            <div className="color-picker">
                <input type="color" onChange={chan} id="colorInput" value="#ff0000"/>
                <div className="color-info">
                    <p>HEX: <span id="hexValue">#ff0000</span></p>
                    <p>RGB: <span id="rgbValue">rgb(255, 0, 0)</span></p>
                </div>
            </div>
        
    );
}