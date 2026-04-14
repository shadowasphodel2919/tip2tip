"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { saveGameScore, getTopScores, LeaderboardEntry } from "@/app/actions/game";

type GameState = "IDLE" | "PLAYING" | "LIFE_LOST" | "GAME_OVER";
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = "UP";

export default function CiggyRush() {
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [playerName, setPlayerName] = useState("");
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
  const [isHighScore, setIsHighScore] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>(INITIAL_SNAKE);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Direction>(INITIAL_DIRECTION);
  const ciggyRef = useRef<Point>({ x: 5, y: 5 });

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    const scores = await getTopScores();
    setTopScores(scores);
  };

  const spawnCiggy = useCallback((currentSnake: Point[]) => {
    let newCiggy: Point;
    while (true) {
      newCiggy = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some((segment) => segment.x === newCiggy.x && segment.y === newCiggy.y);
      if (!isOnSnake) break;
    }
    ciggyRef.current = newCiggy;
  }, []);

  const resetSnake = useCallback(() => {
    snakeRef.current = [...INITIAL_SNAKE];
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    spawnCiggy(snakeRef.current);
  }, [spawnCiggy]);

  const handleGameOver = useCallback(async (finalScore: number) => {
    setGameState("GAME_OVER");

    // Leaderboard is frozen — high score celebration triggers locally at > 75
    // (no longer depends on live DB rankings)
    if (finalScore > 75) {
      setIsHighScore(true);
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ef4444', '#facc15', '#ffffff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ef4444', '#facc15', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else {
      setIsHighScore(false);
    }

    await saveGameScore(playerName, finalScore);
    await fetchScores();

  }, [playerName, topScores]);

  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    const gameLoop = setInterval(() => {
      // Prevent 180 reversing into self natively here
      const checkOpposite = (dir1: string, dir2: string) => {
        return (dir1 === "UP" && dir2 === "DOWN") ||
          (dir1 === "DOWN" && dir2 === "UP") ||
          (dir1 === "LEFT" && dir2 === "RIGHT") ||
          (dir1 === "RIGHT" && dir2 === "LEFT");
      };

      if (!checkOpposite(directionRef.current, nextDirectionRef.current)) {
        directionRef.current = nextDirectionRef.current;
      }

      const head = { ...snakeRef.current[0] };

      switch (directionRef.current) {
        case "UP": head.y -= 1; break;
        case "DOWN": head.y += 1; break;
        case "LEFT": head.x -= 1; break;
        case "RIGHT": head.x += 1; break;
      }

      // Check collision
      const hitWall = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
      const hitSelf = snakeRef.current.some((segment) => segment.x === head.x && segment.y === head.y);

      if (hitWall || hitSelf) {
        if (lives > 1) {
          setLives((l) => l - 1);
          setGameState("LIFE_LOST");
          setTimeout(() => {
            resetSnake();
            setGameState("PLAYING");
          }, 1500);
        } else {
          setLives(0);
          handleGameOver(score);
        }
        clearInterval(gameLoop);
        return;
      }

      const newSnake = [head, ...snakeRef.current];

      // Check ciggy collection
      if (head.x === ciggyRef.current.x && head.y === ciggyRef.current.y) {
        setScore((s) => s + 1);
        spawnCiggy(newSnake);
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;

      // Ensure canvas clears before redraw to prevent weird artifacts on mobile
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw
      ctx.fillStyle = "#111"; // Background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Pattern
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
      ctx.globalAlpha = 1.0;

      // Draw Ciggy
      ctx.fillStyle = "#facc15"; // yellow
      ctx.fillRect(ciggyRef.current.x * cellSize + 2, ciggyRef.current.y * cellSize + 2, cellSize - 4, cellSize - 4);
      ctx.fillStyle = "#ffffff"; // tip
      ctx.fillRect(ciggyRef.current.x * cellSize + 2, ciggyRef.current.y * cellSize + 2, (cellSize - 4) / 3, cellSize - 4);

      // Draw Snake
      snakeRef.current.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#ef4444" : "#dc2626"; // red head, dark red body
        ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
      });

    }, Math.max(50, 160 - (score * 5)));

    return () => clearInterval(gameLoop);
  }, [gameState, lives, score, spawnCiggy, resetSnake, handleGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return;

      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      const currentDir = directionRef.current;
      switch (e.key.toLowerCase()) {
        case "arrowup": case "w":
          if (currentDir !== "DOWN") nextDirectionRef.current = "UP"; break;
        case "arrowdown": case "s":
          if (currentDir !== "UP") nextDirectionRef.current = "DOWN"; break;
        case "arrowleft": case "a":
          if (currentDir !== "RIGHT") nextDirectionRef.current = "LEFT"; break;
        case "arrowright": case "d":
          if (currentDir !== "LEFT") nextDirectionRef.current = "RIGHT"; break;
      }
    };

    // Need to bind it onto the window to ensure we catch arrow events wherever focus is
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== "PLAYING") return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameState !== "PLAYING") return;

    // Prevent default clicking/scrolling events while swiping canvas
    if (e.cancelable) e.preventDefault();

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const dx = endX - touchStartRef.current.x;
    const dy = endY - touchStartRef.current.y;

    const currentDir = directionRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 30 && currentDir !== "LEFT") nextDirectionRef.current = "RIGHT";
      else if (dx < -30 && currentDir !== "RIGHT") nextDirectionRef.current = "LEFT";
    } else {
      // Vertical swipe
      if (dy > 30 && currentDir !== "UP") nextDirectionRef.current = "DOWN";
      else if (dy < -30 && currentDir !== "DOWN") nextDirectionRef.current = "UP";
    }
  };

  const startGame = () => {
    if (!playerName.trim()) setPlayerName("PLAYER");
    setScore(0);
    setLives(3);
    setIsHighScore(false);
    resetSnake();
    setGameState("PLAYING");
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12 mb-12 px-4 font-mono select-none relative z-10">
      <div className="text-center mb-8 border-t border-[var(--border-muted)] pt-12 md:pt-16 mt-4">
        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-2">TIRED OF WAITING?</p>
        <h2 className="text-3xl font-black tracking-tight text-[var(--text-secondary)] mb-1">CIGGY RUSH</h2>
        <p className="text-xs text-[var(--text-primary)] mt-1 tracking-widest">COLLECT ALL CIGGIES</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-center md:items-start max-w-3xl mx-auto">
        {/* Game Container */}
        <div className="bg-[#111] border-2 border-[var(--border-muted)] rounded-xl p-4 w-full md:w-[400px] shadow-2xl relative">

          {/* Header Stats */}
          <div className="flex justify-between items-center mb-4 px-2 tracking-widest text-xs">
            <div className="text-[var(--text-primary)]">
              PLYR: <span className="text-[#facc15] truncate inline-block max-w-[80px] align-bottom">{playerName || "???"}</span>
            </div>
            <div className="text-[var(--text-primary)]">
              SCR: <span className="text-white">{score}</span>
            </div>
            <div className="text-[var(--text-primary)]">
              LVS: <span className="text-[#ef4444]">{"♥".repeat(lives)}{"♡".repeat(3 - lives)}</span>
            </div>
          </div>

          <div
            className="w-full aspect-square bg-[#050505] rounded-md relative overflow-hidden ring-1 ring-white/10 touch-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />

            {/* Overlays */}
            {gameState === "IDLE" && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 backdrop-blur-sm z-10">
                <p className="text-[#ef4444] mb-6 text-center text-xs leading-relaxed uppercase tracking-widest font-bold">
                  WASD to Move<br /><span className="text-white/50 font-normal">Swipe on Mobile</span>
                </p>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="ENTER NAME"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                  className="bg-black border-2 border-white/20 rounded-md px-4 py-2 text-center text-white mb-6 uppercase tracking-widest font-bold focus:outline-none focus:border-[#facc15] w-full max-w-[200px]"
                />
                <button
                  onClick={startGame}
                  className="bg-[#ef4444] text-white px-8 py-3 rounded-full uppercase tracking-widest font-bold hover:bg-[#dc2626] hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                >
                  START
                </button>
              </div>
            )}

            {gameState === "LIFE_LOST" && (
              <div className="absolute inset-0 bg-[#ef4444]/20 flex items-center justify-center z-10 animate-pulse">
                <span className="bg-[#ef4444] text-white px-4 py-2 rounded font-bold uppercase tracking-widest shadow-lg border border-white/20">
                  Crash!
                </span>
              </div>
            )}

            {gameState === "GAME_OVER" && (
              <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md z-10">
                <h3 className="text-[#ef4444] text-2xl font-black mb-2 tracking-widest">GAME OVER</h3>
                <p className="text-white text-sm mb-4 tracking-widest">SCORE: <span className="text-[#facc15] font-bold">{score}</span></p>
                {isHighScore && (
                  <div className="text-[#facc15] text-center mb-6 animate-pulse">
                    <p className="text-xs uppercase tracking-widest font-bold">New High Score!</p>
                  </div>
                )}
                <button
                  onClick={startGame}
                  className="border-2 border-white/20 text-white px-6 py-2 rounded-full uppercase tracking-widest hover:bg-white/10 transition-colors text-sm font-bold"
                >
                  AGAIN?
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-[#111] border-2 border-[var(--border-muted)] rounded-xl p-6 w-full md:w-[280px]">
          <h3 className="text-[#facc15] text-center font-bold tracking-widest text-sm mb-6 uppercase border-b border-white/10 pb-4">
            Top 5 Drivers
          </h3>
          <ul className="flex flex-col gap-3">
            {topScores.map((entry, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-secondary)] w-4 font-bold">{idx + 1}.</span>
                  <span className="text-white tracking-wider truncate max-w-[120px]">{entry.name}</span>
                </div>
                <span className="text-[#ef4444] font-bold">{entry.score}</span>
              </li>
            ))}
            {topScores.length === 0 && (
              <li className="text-center text-[var(--text-secondary)] text-xs mt-4 uppercase tracking-wider leading-relaxed">
                No scores yet.<br />Be the first!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
