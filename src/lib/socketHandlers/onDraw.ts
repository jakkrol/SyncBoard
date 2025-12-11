import { drawLine } from "../tools/drawLine";

export function onDraw(ctx: CanvasRenderingContext2D, s: any) {
        s.on("draw", ({ x0, y0, x1, y1, color, width }: { x0: number; y0: number; x1: number; y1: number, color: string, width: number }) => {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          drawLine(x0, y0, x1, y1, ctx);
          ctx.restore();
        })
}