export class Bullet {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public width: number;
  public height: number;
  public color: string;
  public type: 'player' | 'enemy';

  constructor(x: number, y: number, vx: number, vy: number, radius: number, color: string, type: 'player' | 'enemy') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = radius * 2;
    this.height = radius * 2;
    this.color = color;
    this.type = type;
  }

  public update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 5;
    
    if (this.type === 'player') {
      // Draw elongated bullet for player
      ctx.fillRect(this.x - 2, this.y - 8, 4, 16);
    } else {
      // Draw round bullet for enemies
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}
