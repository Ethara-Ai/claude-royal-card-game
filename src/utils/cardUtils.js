// Card and deck utility functions

import {
  SUITS,
  RANKS,
  RANK_VALUES,
  SUIT_SYMBOLS,
  SUIT_COLORS,
  CARDS_PER_HAND,
  NUMBER_OF_PLAYERS,
} from '../constants/gameConstants';

/**
 * Creates a standard 52-card deck
 * @returns {Array} Array of card objects
 */
export const createDeck = () => {
  const deck = [];
  const suits = Object.values(SUITS);
  const ranks = Object.values(RANKS);

  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({
        id: `${rank}_${suit}`,
        rank,
        suit,
        value: RANK_VALUES[rank],
      });
    });
  });

  return deck;
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffleDeck = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Deals cards to players
 * @param {Array} deck - Shuffled deck
 * @param {number} cardsPerPlayer - Number of cards per player
 * @param {number} numberOfPlayers - Number of players
 * @returns {Object} Object with player hands
 */
export const dealCards = (deck, cardsPerPlayer = CARDS_PER_HAND, numberOfPlayers = NUMBER_OF_PLAYERS) => {
  const shuffled = shuffleDeck(deck);
  const hands = {
    human: [],
    ai_top: [],
    ai_left: [],
    ai_right: [],
  };

  const playerIds = Object.keys(hands);

  for (let i = 0; i < cardsPerPlayer * numberOfPlayers; i++) {
    const playerIndex = i % numberOfPlayers;
    const playerId = playerIds[playerIndex];
    hands[playerId].push(shuffled[i]);
  }

  // Sort each hand by rank value for better display
  Object.keys(hands).forEach(playerId => {
    hands[playerId].sort((a, b) => {
      if (a.suit === b.suit) {
        return a.value - b.value;
      }
      return a.suit.localeCompare(b.suit);
    });
  });

  return hands;
};

/**
 * Gets the display symbol for a suit
 * @param {string} suit - Suit name
 * @returns {string} Suit symbol
 */
export const getSuitSymbol = (suit) => {
  return SUIT_SYMBOLS[suit] || '';
};

/**
 * Gets the color for a suit
 * @param {string} suit - Suit name
 * @returns {string} Color hex code
 */
export const getSuitColor = (suit) => {
  return SUIT_COLORS[suit] || '#000000';
};

/**
 * Formats a card for display
 * @param {Object} card - Card object
 * @returns {string} Formatted card string
 */
export const formatCard = (card) => {
  if (!card) return '';
  return `${card.rank}${getSuitSymbol(card.suit)}`;
};

/**
 * Gets a readable card name for accessibility
 * @param {Object} card - Card object
 * @returns {string} Readable card name
 */
export const getCardName = (card) => {
  if (!card) return '';
  const rankName = card.rank === 'A' ? 'Ace' :
                   card.rank === 'K' ? 'King' :
                   card.rank === 'Q' ? 'Queen' :
                   card.rank === 'J' ? 'Jack' :
                   card.rank;
  const suitName = card.suit.charAt(0).toUpperCase() + card.suit.slice(1);
  return `${rankName} of ${suitName}`;
};

/**
 * Checks if a player can play a specific card
 * @param {Object} card - Card to check
 * @param {Array} hand - Player's hand
 * @param {string} leadSuit - The suit that was led (if any)
 * @param {string} gameMode - Current game mode
 * @returns {boolean} Whether the card can be played
 */
export const canPlayCard = (card, hand, leadSuit, gameMode) => {
  // If no lead suit (first card), any card can be played
  if (!leadSuit) return true;

  // In HIGHEST_CARD mode, suits don't matter
  if (gameMode === 'highest_card') return true;

  // Check if player has the lead suit
  const hasLeadSuit = hand.some(c => c.suit === leadSuit);

  // If player has lead suit, they must play it
  if (hasLeadSuit) {
    return card.suit === leadSuit;
  }

  // If player doesn't have lead suit, they can play anything
  return true;
};

/**
 * Gets valid cards that can be played
 * @param {Array} hand - Player's hand
 * @param {string} leadSuit - The suit that was led (if any)
 * @param {string} gameMode - Current game mode
 * @returns {Array} Array of valid cards
 */
export const getValidCards = (hand, leadSuit, gameMode) => {
  if (!leadSuit || gameMode === 'highest_card') {
    return hand;
  }

  const cardsInLeadSuit = hand.filter(card => card.suit === leadSuit);

  // If player has cards in lead suit, they must play one of them
  if (cardsInLeadSuit.length > 0) {
    return cardsInLeadSuit;
  }

  // Otherwise, they can play any card
  return hand;
};

/**
 * Calculates the rotation angle for a card in a fan layout
 * @param {number} index - Card index
 * @param {number} total - Total number of cards
 * @param {number} maxAngle - Maximum rotation angle
 * @returns {number} Rotation angle in degrees
 */
export const calculateCardRotation = (index, total, maxAngle = 20) => {
  if (total === 1) return 0;
  const step = (maxAngle * 2) / (total - 1);
  return -maxAngle + (index * step);
};

/**
 * Calculates the horizontal offset for a card in a fan layout
 * @param {number} index - Card index
 * @param {number} total - Total number of cards
 * @param {number} cardWidth - Width of a single card
 * @param {number} overlap - How much cards overlap (0-1)
 * @returns {number} Horizontal offset in pixels
 */
export const calculateCardOffset = (index, total, cardWidth = 80, overlap = 0.7) => {
  const effectiveWidth = cardWidth * (1 - overlap);
  const totalWidth = effectiveWidth * (total - 1) + cardWidth;
  const startX = -totalWidth / 2 + cardWidth / 2;
  return startX + (index * effectiveWidth);
};

/**
 * Selects a random valid card for AI to play
 * @param {Array} hand - AI player's hand
 * @param {string} leadSuit - The suit that was led (if any)
 * @param {string} gameMode - Current game mode
 * @returns {Object} Selected card
 */
export const selectAICard = (hand, leadSuit, gameMode) => {
  const validCards = getValidCards(hand, leadSuit, gameMode);

  // Simple AI: just pick a random valid card
  // Could be enhanced with strategy later
  const randomIndex = Math.floor(Math.random() * validCards.length);
  return validCards[randomIndex];
};

/**
 * Generates a unique ID for a card
 * @param {string} rank - Card rank
 * @param {string} suit - Card suit
 * @returns {string} Unique card ID
 */
export const generateCardId = (rank, suit) => {
  return `${rank}_${suit}`;
};

/**
 * Parses a card ID into rank and suit
 * @param {string} cardId - Card ID
 * @returns {Object} Object with rank and suit
 */
export const parseCardId = (cardId) => {
  const [rank, suit] = cardId.split('_');
  return { rank, suit };
};
