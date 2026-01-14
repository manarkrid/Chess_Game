<template>
  <div class="chess-container">
    <h1>Jeu d'Échecs</h1>
    <div class="chess-board">
      <div class="board-grid">
        <div 
          v-for="row in 8" 
          :key="`row-${row}`"
          class="board-row"
        >
          <div
            v-for="col in 8"
            :key="`square-${row}-${col}`"
            :class="[
              'board-square',
              (row + col) % 2 === 0 ? 'light' : 'dark'
            ]"
            :data-position="getPosition(row, col)"
            @dragover.prevent
            @drop="handleDrop($event, getPosition(row, col))"
          >
            <div
              v-if="getPieceAt(getPosition(row, col))"
              class="chess-piece"
              :class="getPieceAt(getPosition(row, col))?.color"
              draggable="true"
              @dragstart="handleDragStart($event, getPieceAt(getPosition(row, col))!.id)"
            >
              {{ getPieceSymbol(getPieceAt(getPosition(row, col))!) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="move-history">
      <h2>Historique des déplacements</h2>
      <button @click="resetBoard" class="reset-btn">Réinitialiser le plateau</button>
      <ul>
        <li v-for="(move, index) in moveHistory" :key="index">
          {{ formatMove(move) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ChessService, type ChessPiece, type MoveHistory } from '../services/ChessService';

const chessService = new ChessService();
const pieces = ref<ChessPiece[]>([]);
const moveHistory = ref<MoveHistory[]>([]);

onMounted(() => {
  updatePieces();
  updateHistory();
});

function updatePieces() {
  pieces.value = chessService.getPieces();
}

function updateHistory() {
  moveHistory.value = chessService.getMoveHistory();
}

function getPosition(row: number, col: number): string {
  const colLetter = String.fromCharCode(96 + col);
  const rowNumber = 9 - row; // Ligne 1 en bas, ligne 8 en haut
  return `${colLetter}${rowNumber}`;
}

function getPieceAt(position: string): ChessPiece | null {
  return pieces.value.find(p => p.position === position) || null;
}

function getPieceSymbol(piece: ChessPiece): string {
  const symbols: Record<string, string> = {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  };
  const blackSymbols: Record<string, string> = {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  };
  
  return piece.color === 'white' ? symbols[piece.type] : blackSymbols[piece.type];
}

let draggedPieceId: string | null = null;

function handleDragStart(event: DragEvent, pieceId: string) {
  draggedPieceId = pieceId;
  event.dataTransfer?.setData('text/plain', pieceId);
}

function handleDrop(event: DragEvent, position: string) {
  if (!draggedPieceId) return;
  
  const success = chessService.movePiece(draggedPieceId, position);
  if (success) {
    updatePieces();
    updateHistory();
  }
  draggedPieceId = null;
}

function formatMove(move: MoveHistory): string {
  const piece = pieces.value.find(p => p.id === move.pieceId);
  const pieceName = piece ? `${piece.color} ${piece.type}` : 'Piece';
  return `${pieceName}: ${move.from} → ${move.to} (${move.timestamp.toLocaleTimeString()})`;
}

function resetBoard() {
  chessService.resetBoard();
  updatePieces();
  updateHistory();
}
</script>

<style scoped>
.chess-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.chess-board {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.board-grid {
  border: 2px solid #333;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.board-row {
  display: flex;
}

.board-square {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.board-square.light {
  background-color: #f0d9b5;
}

.board-square.dark {
  background-color: #b58863;
}

.chess-piece {
  font-size: 40px;
  cursor: grab;
  user-select: none;
  transition: transform 0.2s;
}

.chess-piece:hover {
  transform: scale(1.1);
}

.chess-piece.white {
  color: white;
  text-shadow: 1px 1px 2px #000;
}

.chess-piece.black {
  color: #333;
  text-shadow: 1px 1px 2px #fff;
}

.move-history {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.move-history h2 {
  color: #333;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reset-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #45a049;
}

.move-history ul {
  list-style-type: none;
  padding: 0;
  margin-top: 15px;
}

.move-history li {
  padding: 8px 12px;
  margin-bottom: 5px;
  background-color: white;
  border-left: 4px solid #4CAF50;
  border-radius: 4px;
}
</style>