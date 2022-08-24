import { gameInfo } from './GameField/main.js';
const canvas = document.getElementById('sudoku-canvas-options');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
canvas.addEventListener('click', event => {
    gameInfo.startGame();
});