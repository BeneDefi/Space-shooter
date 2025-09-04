export class Enemy {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public speed: number;
  public health: number;

  private oscillationOffset: number;
  private oscillationSpeed: number = 0.02;

  constructor(x: number, y: number, width: number, height: number, speed: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.health = 1;
    this.oscillationOffset = Math.random() * Math.PI * 2;
  }

  public update(canvasWidth: number, canvasHeight: number) {
    this.y += this.speed;
    
    // Add slight oscillation for more interesting movement
    this.x += Math.sin(this.y * this.oscillationSpeed + this.oscillationOffset) * 0.5;
    
    // Keep enemy within screen bounds
    this.x = Math.max(this.width / 2, Math.min(canvasWidth - this.width / 2, this.x));
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Draw enemy body
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Draw enemy details
    ctx.fillStyle = '#aa0000';
    ctx.fillRect(-this.width / 4, this.height / 2 - 5, this.width / 2, 5);
    
    // Draw antenna/weapon
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(-2, -this.height / 2 - 5, 4, 5);

    ctx.restore();
  }
}
