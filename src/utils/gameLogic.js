// Game logic utilities for determining trick winners and managing game flow

import {
  GAME_MODES,
  SUITS,
  RANK_VALUES,
} from '../constants/gameConstants';

/**
 * Determines the winner of a trick based on game mode
 * @param {Array} playedCards - Array of {playerId, card} objects
 * @param {string} gameMode - Current game mode
 * @returns {string} Winner's player ID
 */
export const determineTrickWinner = (playedCards, gameMode) => {
  if (!playedCards || playedCards.length === 0) {
    return null;
  }

  switch (gameMode) {
    case GAME_MODES.SUIT_FOLLOWS:
      return suitFollowsWinner(playedCards);
    case GAME_MODES.HIGHEST_CARD:
      return highestCardWinner(playedCards);
    case GAME_MODES.SPADES_TRUMP:
      return spadesTrumpWinner(playedCards);
    default:
      return highestCardWinner(playedCards);
  }
};

/**
 * Suit Follows mode: First card sets the suit, highest card in that suit wins
 * @param {Array} playedCards - Array of {playerId, card} objects
 * @returns {string} Winner's player ID
 */
const suitFollowsWinner = (playedCards) => {
  const leadCard = playedCards[0];
  const leadSuit = leadCard.card.suit;

  // Filter cards in the lead suit
  const cardsInLeadSuit = playedCards.filter(
    pc => pc.card.suit === leadSuit
  );

  // Find highest card in lead suit
  let winner = cardsInLeadSuit[0];
  for (let i = 1; i < cardsInLeadSuit.length; i++) {
    if (cardsInLeadSuit[i].card.value > winner.card.value) {
      winner = cardsInLeadSuit[i];
    }
  }

  return winner.playerId;
};

/**
 * Highest Card mode: Suits don't matter, highest rank wins
 * @param {Array} playedCards - Array of {playerId, card} objects
 * @returns {string} Winner's player ID
 */
const highestCardWinner = (playedCards) => {
  let winner = playedCards[0];

  for (let i = 1; i < playedCards.length; i++) {
    if (playedCards[i].card.value > winner.card.value) {
      winner = playedCards[i];
    }
  }

  return winner.playerId;
};

/**
 * Spades Trump mode: Spades beat everything, otherwise highest card in lead suit
 * @param {Array} playedCards - Array of {playerId, card} objects
 * @returns {string} Winner's player ID
 */
const spadesTrumpWinner = (playedCards) => {
  const leadCard = playedCards[0];
  const leadSuit = leadCard.card.suit;

  // Check if any spades were played
  const spades = playedCards.filter(pc => pc.card.suit === SUITS.SPADES);

  if (spades.length > 0) {
    // If spades were played, highest spade wins
    let winner = spades[0];
    for (let i = 1; i < spades.length; i++) {
      if (spades[i].card.value > winner.card.value) {
        winner = spades[i];
      }
    }
    return winner.playerId;
  }

  // No spades, so use suit follows logic
  return suitFollowsWinner(playedCards);
};

/**
 * Gets the lead suit from played cards
 * @param {Array} playedCards - Array of {playerId, card} objects
 * @returns {string|null} Lead suit or null if no cards played
 */
export const getLeadSuit = (playedCards) => {
  if (!playedCards || playedCards.length === 0) {
    return null;
  }
  return playedCards[0].card.suit;
};

/**
 * Determines the next player in turn order
 * @param {string} currentPlayer - Current player ID
 * @param {Array} playerOrder - Array of player IDs in order
 * @returns {string} Next player ID
 */
export const getNextPlayer = (currentPlayer, playerOrder) => {
  const currentIndex = playerOrder.indexOf(currentPlayer);
  if (currentIndex === -1) {
    return playerOrder[0];
  }
  return playerOrder[(currentIndex + 1) % playerOrder.length];
};

/**
 * Gets the starting player for a new trick
 * @param {string} lastWinner - Winner of the last trick (null for first trick)
 * @param {Array} playerOrder - Array of player IDs in order
 * @returns {string} Starting player ID
 */
export const getTrickStartPlayer = (lastWinner, playerOrder) => {
  // Winner of last trick goes first, or first player if first trick
  return lastWinner || playerOrder[0];
};

/**
 * Checks if the game is over
 * @param {Object} scores - Object mapping player IDs to scores
 * @param {number} tricksPerGame - Number of tricks per game
 * @returns {boolean} Whether the game is over
 */
export const isGameOver = (scores, tricksPerGame = 7) => {
  const totalTricks = Object.values(scores).reduce((sum, score) => sum + score, 0);
  return totalTricks >= tricksPerGame;
};

/**
 * Determines the winner of the game
 * @param {Object} scores - Object mapping player IDs to scores
 * @returns {string|null} Winner's player ID or null if tie
 */
export const determineGameWinner = (scores) => {
  let maxScore = -1;
  let winners = [];

  Object.entries(scores).forEach(([playerId, score]) => {
    if (score > maxScore) {
      maxScore = score;
      winners = [playerId];
    } else if (score === maxScore) {
      winners.push(playerId);
    }
  });

  // Return single winner or null if tie
  return winners.length === 1 ? winners[0] : null;
};

/**
 * Gets all winners in case of a tie
 * @param {Object} scores - Object mapping player IDs to scores
 * @returns {Array} Array of player IDs with highest score
 */
export const getGameWinners = (scores) => {
  const maxScore = Math.max(...Object.values(scores));
  return Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([playerId, _]) => playerId);
};

/**
 * Initializes scores for all players
 * @param {Array} playerIds - Array of player IDs
 * @returns {Object} Object mapping player IDs to 0
 */
export const initializeScores = (playerIds) => {
  const scores = {};
  playerIds.forEach(playerId => {
    scores[playerId] = 0;
  });
  return scores;
};

/**
 * Creates the turn order for the game
 * @param {string} startingPlayer - Player who starts
 * @param {Array} allPlayers - All player IDs
 * @returns {Array} Ordered array of player IDs
 */
export const createTurnOrder = (startingPlayer, allPlayers) => {
  const startIndex = allPlayers.indexOf(startingPlayer);
  if (startIndex === -1) return allPlayers;

  return [
    ...allPlayers.slice(startIndex),
    ...allPlayers.slice(0, startIndex)
  ];
};

/**
 * Validates a card play
 * @param {Object} card - Card to play
 * @param {Array} hand - Player's hand
 * @param {string} leadSuit - Lead suit (if any)
 * @param {string} gameMode - Current game mode
 * @returns {Object} {valid: boolean, reason: string}
 */
export const validateCardPlay = (card, hand, leadSuit, gameMode) => {
  // Check if card is in hand
  const hasCard = hand.some(c => c.id === card.id);
  if (!hasCard) {
    return { valid: false, reason: 'Card not in hand' };
  }

  // If no lead suit or highest card mode, any card is valid
  if (!leadSuit || gameMode === GAME_MODES.HIGHEST_CARD) {
    return { valid: true, reason: null };
  }

  // Check if player has cards in lead suit
  const hasLeadSuit = hand.some(c => c.suit === leadSuit);

  // If player has lead suit, they must play it
  if (hasLeadSuit && card.suit !== leadSuit) {
    return { valid: false, reason: 'Must follow suit' };
  }

  return { valid: true, reason: null };
};

/**
 * Compares two cards for sorting
 * @param {Object} a - First card
 * @param {Object} b - Second card
 * @returns {number} Comparison result
 */
export const compareCards = (a, b) => {
  // Sort by suit first, then by value
  if (a.suit !== b.suit) {
    return a.suit.localeCompare(b.suit);
  }
  return a.value - b.value;
};

/**
 * Gets a player's rank based on their score
 * @param {Object} scores - All player scores
 * @param {string} playerId - Player to rank
 * @returns {number} Player's rank (1 = first place)
 */
export const getPlayerRank = (scores, playerId) => {
  const sortedScores = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

  return sortedScores.findIndex(([id]) => id === playerId) + 1;
};

/**
 * Formats a score for display
 * @param {number} score - Score to format
 * @returns {string} Formatted score
 */
export const formatScore = (score) => {
  return score === 1 ? '1 point' : `${score} points`;
};
