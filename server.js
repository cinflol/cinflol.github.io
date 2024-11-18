const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server running on port 8080

let waitingPlayer = null; // Store the player who is waiting for a match

wss.on('connection', (ws) => {
  console.log('New client connected');

  // If there is already a player waiting, pair them together
  if (waitingPlayer) {
    waitingPlayer.send(JSON.stringify({ message: 'Game starting!' }));
    ws.send(JSON.stringify({ message: 'Game starting!' }));
    startGame(waitingPlayer, ws);
    waitingPlayer = null;
  } else {
    // Otherwise, add the current player to the waiting list
    waitingPlayer = ws;
    ws.send(JSON.stringify({ message: 'Waiting for opponent...' }));
  }

  ws.on('message', (data) => {
    // Broadcast player move to the other player
    const moveData = JSON.parse(data);
    if (moveData.type === 'move') {
      // Send the move to the other player
      ws.opponent.send(JSON.stringify({ type: 'move', position: moveData.position }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (ws === waitingPlayer) {
      waitingPlayer = null; // Reset waiting player if the waiting player disconnects
    }
  });
});

// Start the game between two players
function startGame(player1, player2) {
  player1.opponent = player2;
  player2.opponent = player1;
  
  // Initialize an empty board for the game
  const boardState = ['', '', '', '', '', '', '', '', ''];
  
  player1.send(JSON.stringify({ type: 'start', boardState, currentPlayer: 'X' }));
  player2.send(JSON.stringify({ type: 'start', boardState, currentPlayer: 'O' }));
}
