const express = require('express');
const Chess = require('chess.js').Chess;

const router = express.Router();

// Create a dictionary to store chess game instances based on game IDs
const games = {};

// Route to start a new game
router.post('/new-game', (req, res) => {
  const gameId = generateGameId();
  const chess = new Chess();
  games[gameId] = chess;
  res.json({ gameId });
});

// Route to make a move
router.post('/move/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  const chess = games[gameId];

  if (!chess) {
    return res.status(404).json({ error: 'Game not found.' });
  }

  const { move } = req.body;

  if (!chess.move(move)) {
    return res.status(400).json({ error: 'Invalid move.' });
  }

  // Check for checkmate and stalemate
  if (chess.in_checkmate()) {
    return res.json({ board: chess.ascii(), result: 'checkmate' });
  } else if (chess.in_stalemate() || chess.in_draw() || chess.insufficient_material() || chess.in_threefold_repetition()) {
    return res.json({ board: chess.ascii(), result: 'stalemate' });
  }

  res.json({ board: chess.ascii() });
});

function generateGameId() {
  return Math.random().toString(36).substring(7);
}

module.exports = router;
