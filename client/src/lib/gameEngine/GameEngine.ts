import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { Bullet } from "./Bullet";
import { Particle } from "./Particle";
import { CollisionSystem } from "./CollisionSystem";

export interface GameState {
  score: number;
  lives: number;
  level: number;
  enemiesKilled: number;
  levelProgress: number;
  gameOver: boolean;
}

export class GameEngine {
  public player: Player;
  private enemies: Enemy[] = [];
  private playerBullets: Bullet[] = [];
  private enemyBullets: Bullet[] = [];
  private particles: Particle[] = [];
  private collisionSystem: CollisionSystem;
  
  private score = 0;
  private lives = 3;
  private level = 1;
  private enemiesKilled = 0;
  private gameOver = false;
  
  // Level progression settings
  private readonly ENEMIES_PER_LEVEL = 10; // Enemies to kill to advance level
  
  // Dynamic difficulty settings (adjusted per level)
  private enemySpawnTimer = 0;
  private enemySpawnDelay = 120; // frames (gets faster each level)
  private readonly BASE_ENEMY_SPAWN_DELAY = 120;
  private readonly MIN_ENEMY_SPAWN_DELAY = 30;
  
  private playerFireTimer = 0;
  private playerFireDelay = 15; // frames
  
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    
    this.player = new Player(width / 2, height - 80, 60, 40);
    this.collisionSystem = new CollisionSystem();
    
    // Listen for touch controls
    window.addEventListener('playerMove', this.handlePlayerMove.bind(this));
  }

  private handlePlayerMove = (event: Event) => {
    const customEvent = event as CustomEvent;
    const position = customEvent.detail.position;
    // Map position 0-1 to full screen width (0 to canvasWidth)
    const targetX = position * this.width;
    console.log(`Touch position: ${position.toFixed(2)}, Target X: ${targetX.toFixed(1)}, Canvas width: ${this.width}`);
    this.player.setTargetPosition(targetX);
  };

  public reset() {
    // Reset player position instead of creating new player
    this.player.x = this.width / 2;
    this.player.y = this.height - 80;
    this.player.targetX = this.width / 2;
    this.player.moveLeft = false;
    this.player.moveRight = false;
    
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.particles = [];
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.enemiesKilled = 0;
    this.gameOver = false;
    this.enemySpawnTimer = 0;
    this.playerFireTimer = 0;
    
    // Reset difficulty settings
    this.enemySpawnDelay = this.BASE_ENEMY_SPAWN_DELAY;
  }

  public update(): GameState {
    if (this.gameOver) {
      return { 
        score: this.score, 
        lives: this.lives, 
        level: this.level,
        enemiesKilled: this.enemiesKilled,
        levelProgress: (this.enemiesKilled % this.ENEMIES_PER_LEVEL) / this.ENEMIES_PER_LEVEL,
        gameOver: this.gameOver 
      };
    }

    // Update player
    this.player.update(this.width, this.height);

    // Auto-fire player bullets
    this.playerFireTimer++;
    if (this.playerFireTimer >= this.playerFireDelay) {
      this.playerBullets.push(new Bullet(
        this.player.x,
        this.player.y - this.player.height / 2,
        0,
        -8,
        3,
        '#00ff00',
        'player'
      ));
      this.playerFireTimer = 0;
      
      // Play shoot sound
      window.dispatchEvent(new CustomEvent('playShootSound'));
    }

    // Spawn enemies with level-based difficulty
    this.enemySpawnTimer++;
    if (this.enemySpawnTimer >= this.enemySpawnDelay) {
      const x = Math.random() * (this.width - 40) + 20;
      // Enemy speed increases with level
      const enemySpeed = 1 + (this.level - 1) * 0.3; 
      this.enemies.push(new Enemy(x, -20, 30, 20, enemySpeed));
      this.enemySpawnTimer = 0;
    }

    // Update enemies and their bullets
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(this.width, this.height);

      // Remove enemies that are off-screen
      if (enemy.y > this.height + 50) {
        this.enemies.splice(i, 1);
        continue;
      }

      // Enemy firing frequency increases with level
      const enemyFireChance = 0.003 + (this.level - 1) * 0.002; // More bullets per level
      if (Math.random() < enemyFireChance) {
        this.enemyBullets.push(new Bullet(
          enemy.x,
          enemy.y + enemy.height / 2,
          0,
          4 + (this.level - 1) * 0.5, // Bullet speed increases with level
          2,
          '#ff0000',
          'enemy'
        ));
        
        // Play enemy shoot sound (quieter)
        window.dispatchEvent(new CustomEvent('playShootSound'));
      }
    }

    // Update bullets
    this.updateBullets(this.playerBullets);
    this.updateBullets(this.enemyBullets);

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }

    // Handle collisions
    this.handleCollisions();

    return { 
      score: this.score, 
      lives: this.lives, 
      level: this.level,
      enemiesKilled: this.enemiesKilled,
      levelProgress: (this.enemiesKilled % this.ENEMIES_PER_LEVEL) / this.ENEMIES_PER_LEVEL,
      gameOver: this.gameOver 
    };
  }

  private updateBullets(bullets: Bullet[]) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update();
      
      // Remove bullets that are off-screen
      if (bullets[i].y < -10 || bullets[i].y > this.height + 10) {
        bullets.splice(i, 1);
      }
    }
  }

  private handleCollisions() {
    // Player bullets vs enemies
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const bullet = this.playerBullets[i];
      
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        
        if (this.collisionSystem.checkCollision(bullet, enemy)) {
          // Create explosion particles
          this.createExplosion(enemy.x, enemy.y, '#ffff00');
          
          // Remove bullet and enemy
          this.playerBullets.splice(i, 1);
          this.enemies.splice(j, 1);
          
          // Update score and enemy kill count
          this.score += 3 + (this.level - 1) * 4; // More points per level
          this.enemiesKilled++;
          
          // Check for level progression
          this.checkLevelProgression();
          
          // Play hit sound
          window.dispatchEvent(new CustomEvent('playHitSound'));
          break;
        }
      }
    }

    // Enemy bullets vs player
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = this.enemyBullets[i];
      
      if (this.collisionSystem.checkCollision(bullet, this.player)) {
        // Create explosion particles
        this.createExplosion(this.player.x, this.player.y, '#ff0000');
        
        // Remove bullet
        this.enemyBullets.splice(i, 1);
        
        // Reduce lives
        this.lives--;
        
        // Play hit sound
        window.dispatchEvent(new CustomEvent('playHitSound'));
        
        if (this.lives <= 0) {
          this.gameOver = true;
        }
        break;
      }
    }

    // Enemies vs player
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      
      if (this.collisionSystem.checkCollision(enemy, this.player)) {
        // Create explosion particles
        this.createExplosion(enemy.x, enemy.y, '#ff8800');
        
        // Remove enemy
        this.enemies.splice(i, 1);
        
        // Reduce lives
        this.lives--;
        
        // Play hit sound
        window.dispatchEvent(new CustomEvent('playHitSound'));
        
        if (this.lives <= 0) {
          this.gameOver = true;
        }
        break;
      }
    }
  }

  private checkLevelProgression() {
    // Check if enough enemies killed to advance level
    if (this.enemiesKilled >= this.level * this.ENEMIES_PER_LEVEL) {
      this.level++;
      
      // Update difficulty settings for new level
      this.updateDifficulty();
      
      // Dispatch level up event for UI feedback
      window.dispatchEvent(new CustomEvent('levelUp', { 
        detail: { level: this.level, score: this.score } 
      }));
      
      // Play success sound
      window.dispatchEvent(new CustomEvent('playSuccessSound'));
    }
  }

  private updateDifficulty() {
    // Decrease spawn delay (increase spawn rate) but don't go below minimum
    this.enemySpawnDelay = Math.max(
      this.MIN_ENEMY_SPAWN_DELAY,
      this.BASE_ENEMY_SPAWN_DELAY - (this.level - 1) * 15
    );
  }

  private createExplosion(x: number, y: number, color: string) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = Math.random() * 3 + 2;
      this.particles.push(new Particle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        30
      ));
    }
  }

  public render() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 20, 0.2)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Render star field
    this.renderStars();

    // Render player
    this.player.render(this.ctx);

    // Render enemies
    this.enemies.forEach(enemy => enemy.render(this.ctx));

    // Render bullets
    this.playerBullets.forEach(bullet => bullet.render(this.ctx));
    this.enemyBullets.forEach(bullet => bullet.render(this.ctx));

    // Render particles
    this.particles.forEach(particle => particle.render(this.ctx));
  }

  private renderStars() {
    this.ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % this.width;
      const y = (i * 47 + Date.now() * 0.05) % this.height;
      const size = Math.sin(i) * 0.5 + 1;
      this.ctx.fillRect(x, y, size, size);
    }
  }
}
