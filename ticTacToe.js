const board = document.getElementById('board');
const resetButton = document.getElementById('resetButton');
const gameStatus = document.getElementById('gameStatus');
const ws = new WebSocket('ws://localhost:8080'); // Connect to WebSocket server

let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = '';
let gameActive = false;
let opponentPlayer = '';

ws.onopen = () => {
  gameStatus.textContent = 'Connected. Waiting for opponent...';
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.message) {
    gameStatus.textContent = message.message; // Display general status
  }

  if (message.type === 'start') {
    boardState = message.boardState;
    currentPlayer = message.currentPlayer;
    gameActive = true;
    createBoard();
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  }

  if (message.type === 'move') {
    boardState[message.position] = opponentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    createBoard();
  }
};

function createBoard() {
  board.innerHTML = '';
  boardState.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', () => handleCellClick(index));
    board.appendChild(cellDiv);
  });
}

function handleCellClick(index) {
  if (boardState[index] !== '' || !gameActive || currentPlayer !== 'X' && currentPlayer !== 'O') return;

  boardState[index] = currentPlayer;
  ws.send(JSON.stringify({ type: 'move', position: index })); // Send move to server
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
}

resetButton.addEventListener('click', () => {
  if (gameActive) {
    boardState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X'; // Reset to 'X' starting
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    createBoard();
    ws.send(JSON.stringify({ type: 'reset' }));
  }
});
