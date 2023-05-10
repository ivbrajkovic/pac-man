import eatGhostSound from 'assets/sounds/eat_ghost.wav';
import gameOverSound from 'assets/sounds/gameOver.wav';
import { Ghost } from 'class/Ghost';
import { Pacman } from 'class/Pacman';
import { WallMap } from 'class/WallMap';

type GameProps = {
  canvas: HTMLCanvasElement;
  rectSize: number;
  velocity: number;
  map: number[][][];
  pacmanLife: number;
};

export class Game {
  static instance: Game;

  private isPaused = false;
  private animationFrameId: number | null = null;
  private gameMap: WallMap;
  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private score: number;
  private pacman!: Pacman;
  private pacmanLife: number;
  private originalPacmanLife: number;
  private ghosts: Ghost[] = [];
  private velocity: number;
  private maps: number[][][];
  private gameOverSound: HTMLAudioElement;
  private eatGhostSound: HTMLAudioElement;

  static getGameInstance(props: GameProps) {
    if (!Game.instance) return (this.instance = new Game(props));
    return Game.instance;
  }

  private constructor({
    canvas,
    rectSize,
    velocity,
    map,
    pacmanLife,
  }: GameProps) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.velocity = velocity;
    this.maps = map;
    this.gameMap = new WallMap(rectSize);
    this.score = 0;
    this.pacmanLife = pacmanLife;
    this.originalPacmanLife = pacmanLife;
    this.gameOverSound = new Audio(gameOverSound);
    this.eatGhostSound = new Audio(eatGhostSound);
    this.init();
  }

  public init = () => {
    this.pacmanLife = this.originalPacmanLife;
    this.isPaused = false;
    this.score = 0;
    this.initMap();
    this.initPlayers();
    this.start();

    this.onGameStart?.();
    this.onScoreChange?.(this.score);
    this.onPacmanLifeChange?.(this.pacmanLife);
  };

  private initMap() {
    this.gameMap.mapInit(this.maps[0]);
    this.gameMap.setCanvasSize(this.canvas);
  }

  private initPlayers() {
    this.pacman = this.gameMap.getPacman(this.velocity);
    if (!this.pacman) throw new Error('Pacman is not initialized');
    this.ghosts = this.gameMap.getGhosts(this.velocity);

    this.pacman.startKeyDownListener();
    this.pacman.onStartMove = () => this.ghosts.forEach((g) => g.startMoving());
    this.pacman.onEatPowerPellet = () =>
      this.ghosts.forEach((g) => g.setScared());
    this.pacman.onEatPellet = () => this.onScoreChange?.(++this.score);
  }

  private eatPacman() {
    this.pacmanLife--;
    this.onPacmanLifeChange?.(this.pacmanLife);

    if (this.pacmanLife > 0) {
      this.pacman.reset();
      return;
    }

    this.stop();
    this.onGameOver?.();
    this.gameOverSound.play();
  }

  private eatGhost(ghostIndex: number) {
    this.ghosts[ghostIndex].remove();
    this.ghosts.splice(ghostIndex, 1);
    this.eatGhostSound.play();
  }

  private pacmanGhostCollision() {
    this.ghosts.forEach((ghost, ghostIndex) => {
      if (!this.pacman.intersects(ghost.getRect())) return;
      ghost.isScared ? this.eatGhost(ghostIndex) : this.eatPacman();
    });
  }

  private tick = () => {
    this.animationFrameId = requestAnimationFrame(this.tick);

    if (this.isPaused) return;
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.gameMap.draw(this.context);
    this.pacman.update(this.context);
    this.ghosts.forEach((g) => g.update(this.context));
    this.pacmanGhostCollision();
  };

  onGameOver?: () => void;
  onPacmanLifeChange?: (life: number) => void;
  onScoreChange?: (score: number) => void;
  onLevelChange?: (level: number) => void;
  onGameWin?: () => void;
  onGameStart?: () => void;
  onGamePause?: () => void;
  onGameResume?: () => void;
  onGameReset?: () => void;
  onGameStop?: () => void;

  get isAnimationStarted() {
    return this.animationFrameId !== null;
  }

  start() {
    if (this.isAnimationStarted) return;
    this.isPaused = false;
    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  stop() {
    if (!this.isAnimationStarted) return;
    this.isPaused = true;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cancelAnimationFrame(this.animationFrameId!);
    this.animationFrameId = null;
  }
}
