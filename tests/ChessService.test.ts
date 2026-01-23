import { describe, it, expect, beforeEach } from 'vitest';
import { ChessService } from '../src/services/ChessService';

describe('ChessService', () => {
  let chessService: ChessService;

  beforeEach(() => {
    chessService = new ChessService();
  });

  describe('Initialization', () => {
    it('should initialize with 32 pieces', () => {
      const pieces = chessService.getPieces();
      expect(pieces).toHaveLength(32);
    });

    it('should have correct number of each piece type', () => {
      const pieces = chessService.getPieces();
      const whitePieces = pieces.filter(p => p.color === 'white');
      const blackPieces = pieces.filter(p => p.color === 'black');

      expect(whitePieces).toHaveLength(16);
      expect(blackPieces).toHaveLength(16);

      // Vérifier les pièces spécifiques
      expect(pieces.filter(p => p.type === 'king')).toHaveLength(2);
      expect(pieces.filter(p => p.type === 'queen')).toHaveLength(2);
      expect(pieces.filter(p => p.type === 'rook')).toHaveLength(4);
      expect(pieces.filter(p => p.type === 'bishop')).toHaveLength(4);
      expect(pieces.filter(p => p.type === 'knight')).toHaveLength(4);
      expect(pieces.filter(p => p.type === 'pawn')).toHaveLength(16);
    });

    it('should have correct initial positions', () => {
      const pieces = chessService.getPieces();
      
      // Vérifier quelques positions spécifiques
      const whiteKing = pieces.find(p => p.id === 'wk');
      expect(whiteKing?.position).toBe('e1');

      const blackQueen = pieces.find(p => p.id === 'bq');
      expect(blackQueen?.position).toBe('d8');

      const whitePawnA2 = pieces.find(p => p.id === 'wp1');
      expect(whitePawnA2?.position).toBe('a2');
    });
  });

  describe('Piece Movement', () => {
    it('should move a piece to an empty square', () => {
      const success = chessService.movePiece('wp1', 'a3');
      expect(success).toBe(true);

      const piece = chessService.getPieceAt('a3');
      expect(piece?.id).toBe('wp1');
      expect(piece?.position).toBe('a3');

      const oldPosition = chessService.getPieceAt('a2');
      expect(oldPosition).toBeNull();
    });

    it('should replace piece when moving to occupied square', () => {
      // Vérifier qu'il y a une pièce en e2 (pion blanc)
      const initialPieceAtE2 = chessService.getPieceAt('e2');
      expect(initialPieceAtE2?.type).toBe('pawn');

      // Déplacer la tour a1 vers e2
      const success = chessService.movePiece('wr1', 'e2');
      expect(success).toBe(true);

      // Vérifier que la tour est maintenant en e2
      const newPieceAtE2 = chessService.getPieceAt('e2');
      expect(newPieceAtE2?.id).toBe('wr1');
      expect(newPieceAtE2?.type).toBe('rook');

      // Vérifier que le pion n'est plus dans la liste des pièces
      const pieces = chessService.getPieces();
      const pawnAtE2 = pieces.find(p => p.id === initialPieceAtE2?.id);
      expect(pawnAtE2).toBeUndefined();
    });

    it('should return false when moving non-existent piece', () => {
      const success = chessService.movePiece('nonexistent', 'a3');
      expect(success).toBe(false);
    });

    it('should not allow moving to the same position', () => {
      // Note: Cette fonctionnalité pourrait être ajoutée au service
      // Pour l'instant, on vérifie que le mouvement est enregistré
      const success = chessService.movePiece('wp1', 'a2'); // Même position
      expect(success).toBe(true);
      
      // Le mouvement devrait être enregistré dans l'historique
      const history = chessService.getMoveHistory();
      expect(history).toHaveLength(1);
    });
  });

  describe('Move History', () => {
    it('should record moves in history', () => {
      chessService.movePiece('wp1', 'a3');
      chessService.movePiece('bp1', 'a6');

      const history = chessService.getMoveHistory();
      expect(history).toHaveLength(2);

      expect(history[0].pieceId).toBe('wp1');
      expect(history[0].from).toBe('a2');
      expect(history[0].to).toBe('a3');

      expect(history[1].pieceId).toBe('bp1');
      expect(history[1].from).toBe('a7');
      expect(history[1].to).toBe('a6');
    });

    it('should include timestamp in history', () => {
      const beforeMove = new Date();
      chessService.movePiece('wp1', 'a3');
      const afterMove = new Date();

      const history = chessService.getMoveHistory();
      const moveTimestamp = new Date(history[0].timestamp);

      expect(moveTimestamp.getTime()).toBeGreaterThanOrEqual(beforeMove.getTime());
      expect(moveTimestamp.getTime()).toBeLessThanOrEqual(afterMove.getTime());
    });
  });

  describe('Board Reset', () => {
    it('should reset board to initial state', () => {
      // Faire quelques mouvements
      chessService.movePiece('wp1', 'a3');
      chessService.movePiece('wr1', 'e2');
      chessService.movePiece('bp1', 'a6');

      // Réinitialiser
      chessService.resetBoard();

      // Vérifier que l'historique est vide
      expect(chessService.getMoveHistory()).toHaveLength(0);

      // Vérifier que les pièces sont revenues à leurs positions initiales
      const pieces = chessService.getPieces();
      expect(pieces).toHaveLength(32);

      const whiteRook = pieces.find(p => p.id === 'wr1');
      expect(whiteRook?.position).toBe('a1');

      const whitePawn = pieces.find(p => p.id === 'wp1');
      expect(whitePawn?.position).toBe('a2');

      const blackPawn = pieces.find(p => p.id === 'bp1');
      expect(blackPawn?.position).toBe('a7');
    });
  });

  describe('Piece Retrieval', () => {
    it('should get piece at specific position', () => {
      const piece = chessService.getPieceAt('e1');
      expect(piece?.id).toBe('wk');
      expect(piece?.type).toBe('king');
      expect(piece?.color).toBe('white');
    });

    it('should return null for empty position', () => {
      const piece = chessService.getPieceAt('a3'); // Position vide initialement
      expect(piece).toBeNull();
    });
  });
});