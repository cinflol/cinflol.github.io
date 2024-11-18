const board = document.getElementById('board');
const resetButton = document.getElementById('resetButton');
const gameStatus = document.getElementById('gameStatus');

let boardState = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X';
let gameActive = true;

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
  if (boardState[index] !== '' || !gameActive) return;

  boardState[index] = currentPlayer;
  checkWinner();
  switchPlayer();
  createBoard();
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      gameStatus.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
      return;
    }
  }

  if (!boardState.includes('')) {
    gameStatus.textContent = "It's a draw!";
    gameActive = false;
  }
}

function resetGame() {
  boardState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
}

resetButton.addEventListener('click', resetGame);

// Initialize the board
createBoard();
