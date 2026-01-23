export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  id: string;
  type: PieceType;
  color: PieceColor;
  position: string; // format: 'a1', 'b2', etc.
}

export interface MoveHistory {
  pieceId: string;
  from: string;
  to: string;
  timestamp: Date;
}

export class ChessService {
  private pieces: ChessPiece[] = [];
  private moveHistory: MoveHistory[] = [];
  
  constructor() {
    this.initializeBoard();
  }
  
  private initializeBoard(): void {
    // Initialiser avec un tableau vide
    this.pieces = [];
    
    // Pièces blanches
    // Tours blanches
    this.pieces.push(
      { id: 'wr1', type: 'rook', color: 'white', position: 'a1' },
      { id: 'wr2', type: 'rook', color: 'white', position: 'h1' },
      // Cavaliers blancs
      { id: 'wn1', type: 'knight', color: 'white', position: 'b1' },
      { id: 'wn2', type: 'knight', color: 'white', position: 'g1' },
      // Fous blancs
      { id: 'wb1', type: 'bishop', color: 'white', position: 'c1' },
      { id: 'wb2', type: 'bishop', color: 'white', position: 'f1' },
      // Reine blanche
      { id: 'wq', type: 'queen', color: 'white', position: 'd1' },
      // Roi blanc
      { id: 'wk', type: 'king', color: 'white', position: 'e1' }
    );
    
    // Pions blancs
    for (let i = 0; i < 8; i++) {
      this.pieces.push({
        id: `wp${i + 1}`,
        type: 'pawn',
        color: 'white',
        position: `${String.fromCharCode(97 + i)}2`
      });
    }
    
    // Pièces noires
    // Tours noires
    this.pieces.push(
      { id: 'br1', type: 'rook', color: 'black', position: 'a8' },
      { id: 'br2', type: 'rook', color: 'black', position: 'h8' },
      // Cavaliers noirs
      { id: 'bn1', type: 'knight', color: 'black', position: 'b8' },
      { id: 'bn2', type: 'knight', color: 'black', position: 'g8' },
      // Fous noirs
      { id: 'bb1', type: 'bishop', color: 'black', position: 'c8' },
      { id: 'bb2', type: 'bishop', color: 'black', position: 'f8' },
      // Reine noire
      { id: 'bq', type: 'queen', color: 'black', position: 'd8' },
      // Roi noir
      { id: 'bk', type: 'king', color: 'black', position: 'e8' }
    );
    
    // Pions noirs
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
    return this.pieces.find(piece => piece.position === position) || null;
  }
  
  public movePiece(pieceId: string, newPosition: string): boolean {
    const pieceIndex = this.pieces.findIndex(p => p.id === pieceId);
    if (pieceIndex === -1) return false;
    
    const piece = this.pieces[pieceIndex];
    const oldPosition = piece.position;
    
    // Si on essaie de bouger sur la même case
    if (oldPosition === newPosition) {
      // On enregistre quand même le mouvement dans l'historique
      this.moveHistory.push({
        pieceId,
        from: oldPosition,
        to: newPosition,
        timestamp: new Date()
      });
      return true;
    }
    
    // Retirer la pièce à la position cible si elle existe
    const targetPieceIndex = this.pieces.findIndex(p => p.position === newPosition && p.id !== pieceId);
    if (targetPieceIndex !== -1) {
      this.pieces.splice(targetPieceIndex, 1);
    }
    
    // Mettre à jour la position de la pièce
    piece.position = newPosition;
    
    // Ajouter à l'historique
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
    this.pieces = [];
    this.moveHistory = [];
    this.initializeBoard();
  }
}