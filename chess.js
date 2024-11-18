const movementRules = {
    'P': (startRow, startCol, targetRow, targetCol, color) => {
        const direction = color === 'white' ? -1 : 1;
        const isInitialMove = (color === 'white' && startRow === 6) || (color === 'black' && startRow === 1);
        const moveForward = targetRow === startRow + direction && targetCol === startCol;
        const initialDoubleMove = isInitialMove && targetRow === startRow + 2 * direction && targetCol === startCol;
        const captureMove = targetRow === startRow + direction && Math.abs(targetCol - startCol) === 1;
        return moveForward || initialDoubleMove || captureMove;
    },
    'R': (startRow, startCol, targetRow, targetCol) => {
        return startRow === targetRow || startCol === targetCol;
    },
    'N': (startRow, startCol, targetRow, targetCol) => {
        return (Math.abs(startRow - targetRow) === 2 && Math.abs(startCol - targetCol) === 1) ||
               (Math.abs(startRow - targetRow) === 1 && Math.abs(startCol - targetCol) === 2);
    },
    'B': (startRow, startCol, targetRow, targetCol) => {
        return Math.abs(startRow - targetRow) === Math.abs(startCol - targetCol);
    },
    'Q': (startRow, startCol, targetRow, targetCol) => {
        return movementRules['R'](startRow, startCol, targetRow, targetCol) ||
               movementRules['B'](startRow, startCol, targetRow, targetCol);
    },
    'K': (startRow, startCol, targetRow, targetCol) => {
        return Math.abs(startRow - targetRow) <= 1 && Math.abs(startCol - targetCol) <= 1;
    }
};

let selectedPiece = null;
let currentPlayer = 'white';
let aiEnabled = true;
let squares = [];
const pieces = {
    'P': 'pawn.jpeg',
    'R': 'rook.jpeg',
    'N': 'knight.jpeg',
    'B': 'bishop.jpeg',
    'Q': 'queen.jpeg',
    'K': 'king.jpeg'
};
const board = document.getElementById('chessBoard'); // The chessboard element

const initialBoard = [
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

function createBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.className = 'square';
            if ((i + j) % 2 === 1) {
                square.classList.add('black');
            }
            square.dataset.row = i;
            square.dataset.col = j;
            board.appendChild(square);
            squares.push(square);

            square.addEventListener('click', () => handleSquareClick(square));
        }
    }
}

function placePieces() {
    // Define the pieces with their corresponding images for white and black
    const pieces = {
        'P': { white: 'white-pawn.jpeg', black: 'black-pawn.jpeg' },
        'R': { white: 'white-rook.jpeg', black: 'black-rook.jpeg' },
        'N': { white: 'white-knight.jpeg', black: 'black-knight.jpeg' },
        'B': { white: 'white-bishop.jpeg', black: 'black-bishop.jpeg' },
        'Q': { white: 'white-queen.jpeg', black: 'black-queen.jpeg' },
        'K': { white: 'white-king.jpeg', black: 'black-king.jpeg' }
    };

    // Define the initial board setup with pieces
    const initialBoard = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    // Place pieces on the board
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = initialBoard[i][j];
            if (piece) {
                const img = document.createElement('img');
                const color = i < 2 ? 'black' : 'white';
                img.src = `assets/chess-pieces/${pieces[piece][color]}`;
                img.dataset.piece = piece;
                img.dataset.color = color;
                squares[i * 8 + j].appendChild(img);
            }
        }
    }
}

function handleSquareClick(square) {
    const img = square.querySelector('img');

    if (selectedPiece) {
        const targetRow = parseInt(square.dataset.row);
        const targetCol = parseInt(square.dataset.col);
        const startRow = parseInt(selectedPiece.parentElement.dataset.row);
        const startCol = parseInt(selectedPiece.parentElement.dataset.col);

        if (isValidMove(selectedPiece.dataset.piece, startRow, startCol, targetRow, targetCol, selectedPiece.dataset.color)) {
            movePiece(square);
        } else {
            deselectPiece();
        }
    } else if (img && img.dataset.color === currentPlayer) {
        selectPiece(img);
    }
}

function selectPiece(piece) {
    selectedPiece = piece;
    piece.classList.add('selected');
}

function deselectPiece() {
    selectedPiece.classList.remove('selected');
    selectedPiece = null;
}

function movePiece(targetSquare) {
    if (targetSquare.querySelector('img')) {
        targetSquare.innerHTML = '';
    }

    targetSquare.appendChild(selectedPiece);
    deselectPiece();

    if (checkWinCondition()) {
        document.getElementById('status').innerText = `${currentPlayer} wins!`;
        resetGame();
    } else if (aiEnabled && currentPlayer === 'black') {
        switchPlayer();
        aiMove();
    } else {
        switchPlayer();
    }
}

function isValidMove(piece, startRow, startCol, targetRow, targetCol, color) {
    if (movementRules[piece]) {
        return movementRules[piece](startRow, startCol, targetRow, targetCol, color) && !isBlocked(startRow, startCol, targetRow, targetCol);
    }
    return false;
}

function isBlocked(startRow, startCol, targetRow, targetCol) {
    const rowDir = targetRow - startRow > 0 ? 1 : -1;
    const colDir = targetCol - startCol > 0 ? 1 : -1;
    if (startRow === targetRow) {
        for (let col = startCol + colDir; col !== targetCol; col += colDir) {
            if (squares[startRow * 8 + col].querySelector('img')) return true;
        }
    } else if (startCol === targetCol) {
        for (let row = startRow + rowDir; row !== targetRow; row += rowDir) {
            if (squares[row * 8 + startCol].querySelector('img')) return true;
        }
    } else if (Math.abs(startRow - targetRow) === Math.abs(startCol - targetCol)) {
        for (let row = startRow + rowDir, col = startCol + colDir; row !== targetRow && col !== targetCol; row += rowDir, col += colDir) {
            if (squares[row * 8 + col].querySelector('img')) return true;
        }
    }
    return false;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    document.getElementById('status').innerText = `${currentPlayer}'s turn`;
}

function checkWinCondition() {
    const kings = document.querySelectorAll('img[data-piece="K"]');
    return kings.length < 2;
}

function aiMove() {
    setTimeout(() => {
        const availableMoves = [];

        squares.forEach(square => {
            const img = square.querySelector('img');
            if (img && img.dataset.color === 'black') {
                const startRow = parseInt(square.dataset.row);
                const startCol = parseInt(square.dataset.col);

                squares.forEach(targetSquare => {
                    const targetRow = parseInt(targetSquare.dataset.row);
                    const targetCol = parseInt(targetSquare.dataset.col);

                    if (isValidMove(img.dataset.piece, startRow, startCol, targetRow, targetCol, 'black')) {
                        availableMoves.push({ piece: img, target: targetSquare });
                    }
                });
            }
        });

        if (availableMoves.length > 0) {
            const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            selectedPiece = move.piece;
            movePiece(move.target);
        }

        switchPlayer();
    }, 500);
}

function resetGame() {
    squares.forEach(square => {
        square.innerHTML = '';
    });
    placePieces();
    currentPlayer = 'white';
    selectedPiece = null;
    document.getElementById('status').innerText = "White's turn";
}

// Initialize the game
createBoard();
placePieces();

// Add event listener for resetting the game
document.getElementById('resetGame').addEventListener('click', resetGame);