import { drawLine } from "../tools/drawLine";

export function onDraw(ctx: CanvasRenderingContext2D, s: any) {
    s.on("draw", ({ x0, y0, x1, y1, color, width, isEraser }: { x0: number; y0: number; x1: number; y1: number; color: string; width: number; isEraser: boolean }) => {
        ctx.save();
        ctx.lineWidth = width;
        
        
        if (isEraser) {
            ctx.globalCompositeOperation = "destination-out";
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = color;
        }
        
        drawLine(x0, y0, x1, y1, ctx);
        ctx.restore();
    });
}