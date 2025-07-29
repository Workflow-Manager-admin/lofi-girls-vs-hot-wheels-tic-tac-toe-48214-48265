import { Component } from '@angular/core';

const LOFI_GIRL_SRC = 'https://assets.only-single-use.link/tic-tac-toe/lofi-girl.png';
const HOT_WHEELS_SRC = 'https://assets.only-single-use.link/tic-tac-toe/hot-wheels.png';

type Player = 'X' | 'O' | null;

interface Score {
  X: number;
  O: number;
  Draw: number;
}

/**
 * MAIN tic-tac-toe UI and logic component.
 */
// PUBLIC_INTERFACE
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Lofi Girls vs Hot Wheels';

  // 3x3 board; null = empty, "X" or "O"
  board!: Player[][];
  // Who's turn is it? (Start with Lofi Girl/"X")
  currentPlayer!: Player;
  // Winner, if any ('X' | 'O'), 'Draw' string, or null if on-going
  winner!: 'X' | 'O' | 'Draw' | null;
  // Track current game score
  score: Score;

  // Show winner line if win detected
  winLine: { row: number, col: number }[] | null = null;

  constructor() {
    this.score = { X: 0, O: 0, Draw: 0 };
    this.startNewGame();
  }
  // PUBLIC_INTERFACE
  /**
   * Handle a cell click event.
   * @param row Row index
   * @param col Column index
   */
  onCellClick(row: number, col: number): void {
    if (this.winner || this.board[row][col]) return;
    this.board[row][col] = this.currentPlayer;
    this.checkGameEnd();
    if (!this.winner) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  /**
   * Returns true if this cell is part of the winning line
   */
  isHighlightedCell(rowIdx: number, colIdx: number): boolean {
    return !!this.winLine && this.winLine.some(l => l.row === rowIdx && l.col === colIdx);
  }

  // PUBLIC_INTERFACE
  /**
   * Start a new game round (reset board, keep score)
   */
  startNewGame(): void {
    this.board = Array(3).fill(null).map(() => Array(3).fill(null));
    this.currentPlayer = 'X';
    this.winner = null;
    this.winLine = null;
  }

  /**
   * Get the image src for a player X/O/null
   */
  getSymbolImg(piece: Player): string | null {
    if (piece === 'X') return LOFI_GIRL_SRC;
    if (piece === 'O') return HOT_WHEELS_SRC;
    return null;
  }

  /**
   * Check for win or draw, update state and score accordingly
   */
  private checkGameEnd(): void {
    const b = this.board;
    const lines = [
      // rows
      [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
      // cols
      [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
      // diagonals
      [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
    ];

    for (const line of lines) {
      const [a, bIdx, c] = line;
      const val = this.board[a[0]][a[1]];
      if (val && val === this.board[bIdx[0]][bIdx[1]] && val === this.board[c[0]][c[1]]) {
        this.winner = val;
        this.winLine = line.map(([r, c]) => ({ row: r, col: c }));
        this.score[val]++;
        return;
      }
    }

    // Draw? All filled and no winner
    if (b.every(row => row.every(cell => cell != null))) {
      this.winner = 'Draw';
      this.score.Draw++;
    }
  }

  /**
   * Return label for the current or finished game state
   */
  get statusMessage(): string {
    if (this.winner === 'X') return 'Lofi Girls Win! 🎶';
    if (this.winner === 'O') return 'Hot Wheels Win! 🏎️';
    if (this.winner === 'Draw') return "It's a Draw!";
    return this.currentPlayer === 'X' ? "Lofi Girl's Turn" : "Hot Wheels's Turn";
  }

  // For template access
  lofiGirl = LOFI_GIRL_SRC;
  hotWheels = HOT_WHEELS_SRC;
}
