export class Player {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public moveLeft: boolean = false;
  public moveRight: boolean = false;
  
  public targetX: number;
  private speed: number = 5;
  private shipImage: HTMLImageElement | null = null;
  private imageLoaded: boolean = false;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.targetX = x;
    
    // Load the spaceship image
    this.shipImage = new Image();
    this.shipImage.onload = () => {
      this.imageLoaded = true;
      console.log('Spaceship image loaded successfully');
    };
    this.shipImage.onerror = () => {
      console.error('Failed to load spaceship image');
    };
    this.shipImage.src = '/spaceship.png';
  }

  public setTargetPosition(x: number) {
    this.targetX = x;
  }

  public update(canvasWidth: number, canvasHeight: number) {
    // Handle keyboard input
    if (this.moveLeft) {
      this.x -= this.speed;
    }
    if (this.moveRight) {
      this.x += this.speed;
    }

    // Handle touch input (smooth movement to target)
    const diff = this.targetX - this.x;
    if (Math.abs(diff) > 1) {
      this.x += diff * 0.3; // Faster interpolation for more responsive movement
    }

    // Keep player within screen bounds (allow ship to reach actual edges)
    this.x = Math.max(0, Math.min(canvasWidth, this.x));
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.imageLoaded && this.shipImage) {
      // Draw the spaceship image
      ctx.drawImage(
        this.shipImage,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      // Fallback to simple green rectangle while image loads
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      
      // Draw spaceship details
      ctx.fillStyle = '#00aa00';
      ctx.fillRect(-this.width / 4, -this.height / 2, this.width / 2, 5);
      
      // Draw engine glow
      ctx.fillStyle = '#0088ff';
      ctx.fillRect(-3, this.height / 2, 6, 8);
    }

    ctx.restore();
  }
}
