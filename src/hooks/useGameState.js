// Comprehensive game state management hook

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GAME_PHASES,
  GAME_MODES,
  AI_PLAYERS,
  TIMING,
  CARDS_PER_HAND,
  LOCAL_STORAGE_KEYS,
} from '../constants/gameConstants';
import {
  createDeck,
  dealCards,
  selectAICard,
  getValidCards,
} from '../utils/cardUtils';
import {
  determineTrickWinner,
  getLeadSuit,
  getNextPlayer,
  getTrickStartPlayer,
  isGameOver,
  determineGameWinner,
  initializeScores,
  validateCardPlay,
} from '../utils/gameLogic';
import analytics from '../services/analytics';
import errorTracking from '../services/errorTracking';

const PLAYER_IDS = ['human', 'ai_top', 'ai_left', 'ai_right'];

export const useGameState = () => {
  const [phase, setPhase] = useState(GAME_PHASES.LOBBY);
  const [gameMode, setGameMode] = useState(GAME_MODES.SUIT_FOLLOWS);
  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEYS.PLAYER_NAME) || 'You';
    } catch (error) {
      return 'You';
    }
  });

  const [hands, setHands] = useState({
    human: [],
    ai_top: [],
    ai_left: [],
    ai_right: [],
  });

  const [scores, setScores] = useState(initializeScores(PLAYER_IDS));
  const [currentPlayer, setCurrentPlayer] = useState('human');
  const [playedCards, setPlayedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [trickWinner, setTrickWinner] = useState(null);
  const [gameWinner, setGameWinner] = useState(null);
  const [trickNumber, setTrickNumber] = useState(1);
  const [turnOrder, setTurnOrder] = useState(PLAYER_IDS);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [turnTimer, setTurnTimer] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Refs for cleanup
  const aiThinkTimeoutRef = useRef(null);
  const trickCompleteTimeoutRef = useRef(null);
  const turnTimerIntervalRef = useRef(null);
  const turnTimerTimeoutRef = useRef(null);

  // Check if tutorial should be shown
  useEffect(() => {
    try {
      const completed = localStorage.getItem(LOCAL_STORAGE_KEYS.TUTORIAL_COMPLETED);
      if (!completed) {
        setShowTutorial(true);
      }
    } catch (error) {
      console.warn('Could not check tutorial status:', error);
    }
  }, []);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = useCallback(() => {
    if (aiThinkTimeoutRef.current) {
      clearTimeout(aiThinkTimeoutRef.current);
      aiThinkTimeoutRef.current = null;
    }
    if (trickCompleteTimeoutRef.current) {
      clearTimeout(trickCompleteTimeoutRef.current);
      trickCompleteTimeoutRef.current = null;
    }
    if (turnTimerIntervalRef.current) {
      clearInterval(turnTimerIntervalRef.current);
      turnTimerIntervalRef.current = null;
    }
    if (turnTimerTimeoutRef.current) {
      clearTimeout(turnTimerTimeoutRef.current);
      turnTimerTimeoutRef.current = null;
    }
  }, []);

  // Start turn timer
  const startTurnTimer = useCallback(() => {
    clearAllTimers();

    let timeRemaining = TIMING.TURN_TIME_LIMIT / 1000; // Convert to seconds
    setTurnTimer(timeRemaining);

    turnTimerIntervalRef.current = setInterval(() => {
      timeRemaining -= 1;
      setTurnTimer(timeRemaining);
    }, 1000);

    turnTimerTimeoutRef.current = setTimeout(() => {
      if (currentPlayer === 'human' && phase === GAME_PHASES.PLAYING) {
        // Auto-play a random valid card
        autoPlayCard();
      }
    }, TIMING.TURN_TIME_LIMIT);
  }, [currentPlayer, phase]);

  // Stop turn timer
  const stopTurnTimer = useCallback(() => {
    if (turnTimerIntervalRef.current) {
      clearInterval(turnTimerIntervalRef.current);
      turnTimerIntervalRef.current = null;
    }
    if (turnTimerTimeoutRef.current) {
      clearTimeout(turnTimerTimeoutRef.current);
      turnTimerTimeoutRef.current = null;
    }
    setTurnTimer(null);
  }, []);

  // Auto-play card when timer runs out
  const autoPlayCard = useCallback(() => {
    const leadSuit = getLeadSuit(playedCards);
    const validCards = getValidCards(hands.human, leadSuit, gameMode);

    if (validCards.length > 0) {
      const randomCard = validCards[Math.floor(Math.random() * validCards.length)];
      playCard(randomCard);

      errorTracking.trackAction('auto_played_card', {
        reason: 'turn_timer_expired',
        card: randomCard.id,
      });
    }
  }, [hands.human, playedCards, gameMode]);

  // Update player name
  const updatePlayerName = useCallback((name) => {
    setPlayerName(name);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PLAYER_NAME, name);
    } catch (error) {
      console.warn('Could not save player name:', error);
    }
  }, []);

  // Start a new game
  const startGame = useCallback(() => {
    clearAllTimers();

    setPhase(GAME_PHASES.DEALING);
    setGameStartTime(Date.now());

    // Track game start
    analytics.trackGameStarted(gameMode, playerName);
    errorTracking.trackGameEvent('game_started', { gameMode, playerName });
    errorTracking.setGameState({
      phase: GAME_PHASES.DEALING,
      gameMode,
      trickNumber: 1,
    });

    // Deal cards
    const deck = createDeck();
    const dealtHands = dealCards(deck, CARDS_PER_HAND, PLAYER_IDS.length);
    setHands(dealtHands);

    // Initialize game state
    setScores(initializeScores(PLAYER_IDS));
    setTrickNumber(1);
    setPlayedCards([]);
    setSelectedCard(null);
    setTrickWinner(null);
    setGameWinner(null);
    setCurrentPlayer('human');
    setTurnOrder(PLAYER_IDS);

    // Transition to playing phase after dealing animation
    setTimeout(() => {
      setPhase(GAME_PHASES.PLAYING);
      startTurnTimer();
    }, TIMING.CARD_DEAL_DELAY * CARDS_PER_HAND * PLAYER_IDS.length + 500);
  }, [gameMode, playerName, startTurnTimer, clearAllTimers]);

  // Select a card
  const selectCard = useCallback((card) => {
    if (phase !== GAME_PHASES.PLAYING || currentPlayer !== 'human') {
      return;
    }

    // Toggle selection
    if (selectedCard?.id === card.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }

    errorTracking.trackAction('card_selected', { card: card.id });
  }, [phase, currentPlayer, selectedCard]);

  // Play a card
  const playCard = useCallback((card) => {
    if (phase !== GAME_PHASES.PLAYING) {
      return;
    }

    const playerId = currentPlayer;
    const hand = hands[playerId];
    const leadSuit = getLeadSuit(playedCards);

    // Validate card play
    const validation = validateCardPlay(card, hand, leadSuit, gameMode);
    if (!validation.valid) {
      console.warn('Invalid card play:', validation.reason);
      errorTracking.captureMessage('Invalid card play attempted', 'warning', {
        reason: validation.reason,
        card: card.id,
      });
      return;
    }

    stopTurnTimer();

    // Remove card from hand
    const newHands = {
      ...hands,
      [playerId]: hand.filter(c => c.id !== card.id),
    };
    setHands(newHands);

    // Add card to played cards
    const newPlayedCards = [...playedCards, { playerId, card }];
    setPlayedCards(newPlayedCards);

    // Clear selection
    setSelectedCard(null);

    errorTracking.trackAction('card_played', {
      playerId,
      card: card.id,
      trickNumber,
    });

    // Check if trick is complete
    if (newPlayedCards.length === PLAYER_IDS.length) {
      completeTrick(newPlayedCards);
    } else {
      // Move to next player
      const nextPlayer = getNextPlayer(playerId, turnOrder);
      setCurrentPlayer(nextPlayer);
    }
  }, [phase, currentPlayer, hands, playedCards, gameMode, turnOrder, trickNumber, stopTurnTimer]);

  // Complete a trick
  const completeTrick = useCallback((completedPlayedCards) => {
    setPhase(GAME_PHASES.TRICK_COMPLETE);

    // Determine winner
    const winner = determineTrickWinner(completedPlayedCards, gameMode);
    setTrickWinner(winner);

    // Update scores
    const newScores = {
      ...scores,
      [winner]: scores[winner] + 1,
    };
    setScores(newScores);

    errorTracking.trackGameEvent('trick_completed', {
      winner,
      trickNumber,
      scores: newScores,
    });

    // Check if game is over
    trickCompleteTimeoutRef.current = setTimeout(() => {
      if (isGameOver(newScores, CARDS_PER_HAND)) {
        endGame(newScores);
      } else {
        startNextTrick(winner);
      }
    }, TIMING.TRICK_DISPLAY_TIME);
  }, [gameMode, scores, trickNumber]);

  // Start next trick
  const startNextTrick = useCallback((lastWinner) => {
    setPhase(GAME_PHASES.PLAYING);
    setPlayedCards([]);
    setTrickWinner(null);
    setTrickNumber(prev => prev + 1);

    // Winner goes first
    const newTurnOrder = createTurnOrder(lastWinner, PLAYER_IDS);
    setTurnOrder(newTurnOrder);
    setCurrentPlayer(lastWinner);

    if (lastWinner !== 'human') {
      // AI starts, no timer
    } else {
      startTurnTimer();
    }

    errorTracking.trackGameEvent('trick_started', {
      trickNumber: trickNumber + 1,
      startingPlayer: lastWinner,
    });
  }, [trickNumber, startTurnTimer]);

  // End game
  const endGame = useCallback((finalScores) => {
    stopTurnTimer();
    clearAllTimers();

    setPhase(GAME_PHASES.GAME_OVER);
    const winner = determineGameWinner(finalScores);
    setGameWinner(winner);

    // Calculate game duration
    const duration = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;

    // Track game completion
    analytics.trackGameCompleted(
      gameMode,
      winner === 'human',
      finalScores.human,
      duration
    );

    errorTracking.trackGameEvent('game_completed', {
      winner,
      scores: finalScores,
      duration,
    });
  }, [gameMode, gameStartTime, stopTurnTimer, clearAllTimers]);

  // AI player logic
  useEffect(() => {
    if (phase !== GAME_PHASES.PLAYING) {
      return;
    }

    if (currentPlayer === 'human') {
      startTurnTimer();
      return;
    }

    // AI turn
    stopTurnTimer();

    aiThinkTimeoutRef.current = setTimeout(() => {
      const hand = hands[currentPlayer];
      if (hand.length === 0) return;

      const leadSuit = getLeadSuit(playedCards);
      const card = selectAICard(hand, leadSuit, gameMode);

      if (card) {
        playCard(card);
      }
    }, TIMING.AI_THINK_TIME);

    return () => {
      if (aiThinkTimeoutRef.current) {
        clearTimeout(aiThinkTimeoutRef.current);
      }
    };
  }, [phase, currentPlayer, hands, playedCards, gameMode, playCard, startTurnTimer, stopTurnTimer]);

  // Mark tutorial as completed
  const completeTutorial = useCallback(() => {
    setShowTutorial(false);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.TUTORIAL_COMPLETED, 'true');
    } catch (error) {
      console.warn('Could not save tutorial status:', error);
    }
  }, []);

  // Reset game to lobby
  const resetGame = useCallback(() => {
    clearAllTimers();
    stopTurnTimer();

    setPhase(GAME_PHASES.LOBBY);
    setHands({
      human: [],
      ai_top: [],
      ai_left: [],
      ai_right: [],
    });
    setScores(initializeScores(PLAYER_IDS));
    setCurrentPlayer('human');
    setPlayedCards([]);
    setSelectedCard(null);
    setTrickWinner(null);
    setGameWinner(null);
    setTrickNumber(1);
    setTurnOrder(PLAYER_IDS);
    setGameStartTime(null);
  }, [clearAllTimers, stopTurnTimer]);

  // Get player info
  const getPlayerInfo = useCallback((playerId) => {
    if (playerId === 'human') {
      return { id: 'human', name: playerName, position: 'bottom' };
    }
    return AI_PLAYERS.find(p => p.id === playerId);
  }, [playerName]);

  // Get valid cards for current player
  const getValidCardsForCurrentPlayer = useCallback(() => {
    if (currentPlayer !== 'human') return [];
    const leadSuit = getLeadSuit(playedCards);
    return getValidCards(hands.human, leadSuit, gameMode);
  }, [currentPlayer, hands.human, playedCards, gameMode]);

  return {
    // State
    phase,
    gameMode,
    playerName,
    hands,
    scores,
    currentPlayer,
    playedCards,
    selectedCard,
    trickWinner,
    gameWinner,
    trickNumber,
    turnOrder,
    turnTimer,
    showTutorial,

    // Actions
    setGameMode,
    updatePlayerName,
    startGame,
    selectCard,
    playCard,
    resetGame,
    completeTutorial,

    // Helpers
    getPlayerInfo,
    getValidCardsForCurrentPlayer,
    getLeadSuit: () => getLeadSuit(playedCards),
  };
};

// Helper function to create turn order
function createTurnOrder(startingPlayer, allPlayers) {
  const startIndex = allPlayers.indexOf(startingPlayer);
  if (startIndex === -1) return allPlayers;

  return [
    ...allPlayers.slice(startIndex),
    ...allPlayers.slice(0, startIndex)
  ];
}
