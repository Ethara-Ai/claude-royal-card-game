// Test file for game logic utilities

import { describe, it, expect } from 'vitest';
import {
  determineTrickWinner,
  getLeadSuit,
  getNextPlayer,
  isGameOver,
  determineGameWinner,
  initializeScores,
  validateCardPlay,
} from '../../utils/gameLogic';
import { GAME_MODES, SUITS } from '../../constants/gameConstants';

describe('Game Logic', () => {
  describe('determineTrickWinner', () => {
    it('should determine winner in Suit Follows mode', () => {
      const playedCards = [
        { playerId: 'human', card: { suit: SUITS.HEARTS, rank: '10', value: 10 } },
        { playerId: 'ai_top', card: { suit: SUITS.HEARTS, rank: 'K', value: 13 } },
        { playerId: 'ai_left', card: { suit: SUITS.CLUBS, rank: 'A', value: 14 } },
        { playerId: 'ai_right', card: { suit: SUITS.HEARTS, rank: '5', value: 5 } },
      ];

      const winner = determineTrickWinner(playedCards, GAME_MODES.SUIT_FOLLOWS);
      expect(winner).toBe('ai_top');
    });

    it('should determine winner in Highest Card mode', () => {
      const playedCards = [
        { playerId: 'human', card: { suit: SUITS.HEARTS, rank: '10', value: 10 } },
        { playerId: 'ai_top', card: { suit: SUITS.DIAMONDS, rank: 'K', value: 13 } },
        { playerId: 'ai_left', card: { suit: SUITS.CLUBS, rank: 'A', value: 14 } },
        { playerId: 'ai_right', card: { suit: SUITS.SPADES, rank: '5', value: 5 } },
      ];

      const winner = determineTrickWinner(playedCards, GAME_MODES.HIGHEST_CARD);
      expect(winner).toBe('ai_left');
    });

    it('should determine winner in Spades Trump mode - spades played', () => {
      const playedCards = [
        { playerId: 'human', card: { suit: SUITS.HEARTS, rank: 'A', value: 14 } },
        { playerId: 'ai_top', card: { suit: SUITS.HEARTS, rank: 'K', value: 13 } },
        { playerId: 'ai_left', card: { suit: SUITS.SPADES, rank: '5', value: 5 } },
        { playerId: 'ai_right', card: { suit: SUITS.HEARTS, rank: 'Q', value: 12 } },
      ];

      const winner = determineTrickWinner(playedCards, GAME_MODES.SPADES_TRUMP);
      expect(winner).toBe('ai_left');
    });

    it('should determine winner in Spades Trump mode - no spades played', () => {
      const playedCards = [
        { playerId: 'human', card: { suit: SUITS.HEARTS, rank: '10', value: 10 } },
        { playerId: 'ai_top', card: { suit: SUITS.HEARTS, rank: 'K', value: 13 } },
        { playerId: 'ai_left', card: { suit: SUITS.CLUBS, rank: 'A', value: 14 } },
        { playerId: 'ai_right', card: { suit: SUITS.HEARTS, rank: '5', value: 5 } },
      ];

      const winner = determineTrickWinner(playedCards, GAME_MODES.SPADES_TRUMP);
      expect(winner).toBe('ai_top');
    });

    it('should handle multiple spades in Spades Trump mode', () => {
      const playedCards = [
        { playerId: 'human', card: { suit: SUITS.SPADES, rank: '10', value: 10 } },
        { playerId: 'ai_top', card: { suit: SUITS.SPADES, rank: 'K', value: 13 } },
        { playerId: 'ai_left', card: { suit: SUITS.SPADES, rank: '5', value: 5 } },
        { playerId: 'ai_right', card: { suit: SUITS.HEARTS, rank: 'A', value: 14 } },
      ];

      const winner = determineTrickWinner(playedCards, GAME_MODES.SPADES_TRUMP);
      expect(winner).toBe('ai_top');
    });
  });

  describe('getLeadSuit', () => {
    it('should return the suit of the first card', () => {
      const playedCards = [
        { playerId: 'human', card: { suit: SUITS.HEARTS, rank: '10', value: 10 } },
        { playerId: 'ai_top', card: { suit: SUITS.CLUBS, rank: 'K', value: 13 } },
      ];

      const leadSuit = getLeadSuit(playedCards);
      expect(leadSuit).toBe(SUITS.HEARTS);
    });

    it('should return null for empty array', () => {
      const leadSuit = getLeadSuit([]);
      expect(leadSuit).toBeNull();
    });
  });

  describe('getNextPlayer', () => {
    const playerOrder = ['human', 'ai_top', 'ai_left', 'ai_right'];

    it('should return the next player in order', () => {
      expect(getNextPlayer('human', playerOrder)).toBe('ai_top');
      expect(getNextPlayer('ai_top', playerOrder)).toBe('ai_left');
      expect(getNextPlayer('ai_left', playerOrder)).toBe('ai_right');
    });

    it('should wrap around to first player', () => {
      expect(getNextPlayer('ai_right', playerOrder)).toBe('human');
    });

    it('should return first player for invalid current player', () => {
      expect(getNextPlayer('invalid', playerOrder)).toBe('human');
    });
  });

  describe('isGameOver', () => {
    it('should return true when all tricks are played', () => {
      const scores = {
        human: 3,
        ai_top: 2,
        ai_left: 1,
        ai_right: 1,
      };

      expect(isGameOver(scores, 7)).toBe(true);
    });

    it('should return false when tricks remain', () => {
      const scores = {
        human: 2,
        ai_top: 1,
        ai_left: 1,
        ai_right: 0,
      };

      expect(isGameOver(scores, 7)).toBe(false);
    });
  });

  describe('determineGameWinner', () => {
    it('should return the player with highest score', () => {
      const scores = {
        human: 4,
        ai_top: 2,
        ai_left: 1,
        ai_right: 0,
      };

      expect(determineGameWinner(scores)).toBe('human');
    });

    it('should return null for a tie', () => {
      const scores = {
        human: 3,
        ai_top: 3,
        ai_left: 1,
        ai_right: 0,
      };

      expect(determineGameWinner(scores)).toBeNull();
    });

    it('should handle all players tied', () => {
      const scores = {
        human: 2,
        ai_top: 2,
        ai_left: 2,
        ai_right: 2,
      };

      expect(determineGameWinner(scores)).toBeNull();
    });
  });

  describe('initializeScores', () => {
    it('should initialize all scores to 0', () => {
      const playerIds = ['human', 'ai_top', 'ai_left', 'ai_right'];
      const scores = initializeScores(playerIds);

      expect(scores).toEqual({
        human: 0,
        ai_top: 0,
        ai_left: 0,
        ai_right: 0,
      });
    });
  });

  describe('validateCardPlay', () => {
    const hand = [
      { id: 'A_hearts', suit: SUITS.HEARTS, rank: 'A', value: 14 },
      { id: 'K_hearts', suit: SUITS.HEARTS, rank: 'K', value: 13 },
      { id: '5_clubs', suit: SUITS.CLUBS, rank: '5', value: 5 },
    ];

    it('should allow any card when no lead suit', () => {
      const result = validateCardPlay(
        hand[0],
        hand,
        null,
        GAME_MODES.SUIT_FOLLOWS
      );

      expect(result.valid).toBe(true);
    });

    it('should allow any card in Highest Card mode', () => {
      const result = validateCardPlay(
        hand[2],
        hand,
        SUITS.HEARTS,
        GAME_MODES.HIGHEST_CARD
      );

      expect(result.valid).toBe(true);
    });

    it('should require following suit when player has lead suit', () => {
      const result = validateCardPlay(
        hand[2], // clubs card
        hand,
        SUITS.HEARTS, // hearts led
        GAME_MODES.SUIT_FOLLOWS
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Must follow suit');
    });

    it('should allow any card when player has no lead suit', () => {
      const handWithoutHearts = [
        { id: '5_clubs', suit: SUITS.CLUBS, rank: '5', value: 5 },
        { id: '6_clubs', suit: SUITS.CLUBS, rank: '6', value: 6 },
      ];

      const result = validateCardPlay(
        handWithoutHearts[0],
        handWithoutHearts,
        SUITS.HEARTS,
        GAME_MODES.SUIT_FOLLOWS
      );

      expect(result.valid).toBe(true);
    });

    it('should reject card not in hand', () => {
      const cardNotInHand = { id: 'A_spades', suit: SUITS.SPADES, rank: 'A', value: 14 };

      const result = validateCardPlay(
        cardNotInHand,
        hand,
        null,
        GAME_MODES.SUIT_FOLLOWS
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Card not in hand');
    });
  });
});
