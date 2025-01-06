const board = document.getElementById('board');
const resetButton = document.getElementById('resetButton');
const gameStatus = document.getElementById('gameStatus');

let boardState = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X';
let gameActive = true;

// Create the board dynamically
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

// Handle a cell click (mark the cell and check for a winner)
function handleCellClick(index) {
  if (boardState[index] !== '' || !gameActive) return; // Cell is already filled or the game is over

  // Mark the cell and check for a winner
  boardState[index] = currentPlayer;
  checkWinner();
  if (gameActive) switchPlayer(); // Only switch player if the game is still active
  createBoard();
}

// Switch the current player
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

// Check if a player has won or if the game is a draw
function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];

  for (const [a, b, c] of winningCombinations) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      gameStatus.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
      return;
    }
  }

  // Check for a draw (no empty cells left)
  if (!boardState.includes('')) {
    gameStatus.textContent = "It's a draw!";
    gameActive = false;
  }
}

// Reset the game
function resetGame() {
  boardState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
  createBoard();
}

resetButton.addEventListener('click', resetGame);

// Initialize the board when the page loads
createBoard();
