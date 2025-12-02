export class Cursor {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;

  constructor(id: string, color: string, name: string) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.name = name;
  }

  update(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "12px sans-serif";
    ctx.fillText(this.name, this.x + 10, this.y + 4);
  }
}