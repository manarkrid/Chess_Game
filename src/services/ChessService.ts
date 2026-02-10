import { Chess } from 'chess.js';

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  id: string;
  type: PieceType;
  color: PieceColor;
  position: string; // 'a1', 'b2', etc.
}

export interface MoveHistory {
  pieceId: string;
  from: string;
  to: string;
  timestamp: Date;
}

export class ChessService {
  private chess: Chess;
  private pieces: ChessPiece[] = [];
  private moveHistory: MoveHistory[] = [];

  constructor() {
    this.chess = new Chess();
    this.initializeBoard();
  }

  private initializeBoard(): void {
    this.chess.reset();
    this.pieces = [];
    this.moveHistory = [];

    // Pièces blanches
    this.pieces.push(
      { id: 'wr1', type: 'rook', color: 'white', position: 'a1' },
      { id: 'wn1', type: 'knight', color: 'white', position: 'b1' },
      { id: 'wb1', type: 'bishop', color: 'white', position: 'c1' },
      { id: 'wq', type: 'queen', color: 'white', position: 'd1' },
      { id: 'wk', type: 'king', color: 'white', position: 'e1' },
      { id: 'wb2', type: 'bishop', color: 'white', position: 'f1' },
      { id: 'wn2', type: 'knight', color: 'white', position: 'g1' },
      { id: 'wr2', type: 'rook', color: 'white', position: 'h1' }
    );

    for (let i = 0; i < 8; i++) {
      this.pieces.push({
        id: `wp${i + 1}`,
        type: 'pawn',
        color: 'white',
        position: `${String.fromCharCode(97 + i)}2`
      });
    }

    // Pièces noires
    this.pieces.push(
      { id: 'br1', type: 'rook', color: 'black', position: 'a8' },
      { id: 'bn1', type: 'knight', color: 'black', position: 'b8' },
      { id: 'bb1', type: 'bishop', color: 'black', position: 'c8' },
      { id: 'bq', type: 'queen', color: 'black', position: 'd8' },
      { id: 'bk', type: 'king', color: 'black', position: 'e8' },
      { id: 'bb2', type: 'bishop', color: 'black', position: 'f8' },
      { id: 'bn2', type: 'knight', color: 'black', position: 'g8' },
      { id: 'br2', type: 'rook', color: 'black', position: 'h8' }
    );

    for (let i = 0; i < 8; i++) {
      this.pieces.push({
        id: `bp${i + 1}`,
        type: 'pawn',
        color: 'black',
        position: `${String.fromCharCode(97 + i)}7`
      });
    }
  }

  public getPieces(): ChessPiece[] {
    return [...this.pieces];
  }

  public getPieceAt(position: string): ChessPiece | null {
    return this.pieces.find(p => p.position === position) || null;
  }

  // 🔥 MÉTHODE CLÉ DU TP
  public movePiece(pieceId: string, newPosition: string): boolean {
    const piece = this.pieces.find(p => p.id === pieceId);
    if (!piece) return false;

    const move = this.chess.move({
      from: piece.position,
      to: newPosition,
      promotion: 'q' // requis par chess.js
    });

    // ❌ coup illégal → refusé
    if (!move) {
      return false;
    }

    const oldPosition = piece.position;

    // Capture
    if (move.captured) {
      this.pieces = this.pieces.filter(p => p.position !== newPosition);
    }

    piece.position = newPosition;

    this.moveHistory.push({
      pieceId,
      from: oldPosition,
      to: newPosition,
      timestamp: new Date()
    });

    return true;
  }

  public getMoveHistory(): MoveHistory[] {
    return [...this.moveHistory];
  }

  public resetBoard(): void {
    this.initializeBoard();
  }
}
