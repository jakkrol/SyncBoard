export function onLoadBoard(ctx: CanvasRenderingContext2D, canvasRef: any, s: any) {
     s.on("loadBoard", (data: string) => {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = data; 
    });
}