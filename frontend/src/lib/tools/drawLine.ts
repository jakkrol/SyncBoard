  export function drawLine(x0: number, y0: number, x1: number, y1: number, ctx: CanvasRenderingContext2D){
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  }