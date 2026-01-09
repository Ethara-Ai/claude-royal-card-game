// Main App component - orchestrates game flow and phases

import React, { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useGameState } from "./hooks/useGameState";
import { useTheme } from "./contexts/ThemeContext";
import { GAME_PHASES } from "./constants/gameConstants";
import Header from "./components/Header";
import Lobby from "./components/Lobby";
import GameTable from "./components/GameTable";
import GameOver from "./components/GameOver";
import TutorialModal from "./components/TutorialModal";
import analytics from "./services/analytics";
import errorTracking from "./services/errorTracking";

function App() {
  const { isDark } = useTheme();
  const gameState = useGameState();

  // Initialize services
  useEffect(() => {
    analytics.init();
    errorTracking.init({ enabled: true });

    // Track page view
    analytics.trackPageView("game");

    // Set user context
    errorTracking.setUser({
      name: gameState.playerName,
    });
  }, []);

  // Update error tracking with game state
  useEffect(() => {
    if (gameState.phase !== GAME_PHASES.LOBBY) {
      errorTracking.setGameState(gameState);
    }
  }, [gameState.phase, gameState.currentPlayer, gameState.trickNumber]);

  // Handle card selection
  const handleCardSelect = (card) => {
    gameState.selectCard(card);
  };

  // Handle card play
  const handleCardPlay = (card) => {
    if (!card) {
      // Play the selected card
      if (gameState.selectedCard) {
        gameState.playCard(gameState.selectedCard);
        toast.success("Card played!");
      }
    } else {
      gameState.playCard(card);
      toast.success("Card played!");
    }
  };

  // Handle play again
  const handlePlayAgain = () => {
    gameState.resetGame();
    setTimeout(() => {
      gameState.startGame();
    }, 100);
  };

  // Handle back to lobby
  const handleBackToLobby = () => {
    gameState.resetGame();
  };

  // Show tutorial on first turn
  useEffect(() => {
    if (
      gameState.phase === GAME_PHASES.PLAYING &&
      gameState.currentPlayer === "human" &&
      gameState.trickNumber === 1 &&
      gameState.playedCards.length === 0 &&
      gameState.showTutorial
    ) {
      // Don't auto-show tutorial, let user click help button instead
    }
  }, [
    gameState.phase,
    gameState.currentPlayer,
    gameState.trickNumber,
    gameState.playedCards,
    gameState.showTutorial,
  ]);

  // Notify when it's player's turn
  useEffect(() => {
    if (
      gameState.phase === GAME_PHASES.PLAYING &&
      gameState.currentPlayer === "human"
    ) {
      if (gameState.playedCards.length > 0 || gameState.trickNumber > 1) {
        toast.info("Your turn!", { duration: 2000 });
      }
    }
  }, [gameState.currentPlayer, gameState.phase]);

  // Notify when trick is won
  useEffect(() => {
    if (
      gameState.phase === GAME_PHASES.TRICK_COMPLETE &&
      gameState.trickWinner
    ) {
      const winner = gameState.getPlayerInfo(gameState.trickWinner);
      if (gameState.trickWinner === "human") {
        toast.success(`You won the trick!`, { duration: 2000 });
      } else {
        toast.info(`${winner.name} wins the trick!`, { duration: 2000 });
      }
    }
  }, [gameState.phase, gameState.trickWinner]);

  return (
    <div
      className={`min-h-screen theme-transition ${isDark ? "dark" : "light"}`}
    >
      {/* Header */}
      <Header showMenuButton={gameState.phase !== GAME_PHASES.LOBBY} />

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        theme={isDark ? "dark" : "light"}
        richColors
        closeButton
      />

      {/* First-time tutorial */}
      {gameState.showTutorial && gameState.phase === GAME_PHASES.PLAYING && (
        <TutorialModal onClose={gameState.completeTutorial} />
      )}

      {/* Game Phases */}
      {gameState.phase === GAME_PHASES.LOBBY && (
        <Lobby
          playerName={gameState.playerName}
          onPlayerNameChange={gameState.updatePlayerName}
          gameMode={gameState.gameMode}
          onGameModeChange={gameState.setGameMode}
          onStartGame={gameState.startGame}
        />
      )}

      {(gameState.phase === GAME_PHASES.DEALING ||
        gameState.phase === GAME_PHASES.PLAYING ||
        gameState.phase === GAME_PHASES.TRICK_COMPLETE) && (
        <GameTable
          hands={gameState.hands}
          playedCards={gameState.playedCards}
          selectedCard={gameState.selectedCard}
          currentPlayer={gameState.currentPlayer}
          scores={gameState.scores}
          trickWinner={gameState.trickWinner}
          gameMode={gameState.gameMode}
          playerName={gameState.playerName}
          turnTimer={gameState.turnTimer}
          onCardSelect={handleCardSelect}
          onCardPlay={handleCardPlay}
          getPlayerInfo={gameState.getPlayerInfo}
        />
      )}

      {gameState.phase === GAME_PHASES.GAME_OVER && (
        <GameOver
          scores={gameState.scores}
          gameWinner={gameState.gameWinner}
          getPlayerInfo={gameState.getPlayerInfo}
          onPlayAgain={handlePlayAgain}
          onBackToLobby={handleBackToLobby}
        />
      )}

      {/* Accessibility announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {gameState.phase === GAME_PHASES.PLAYING && (
          <span>
            {gameState.getPlayerInfo(gameState.currentPlayer).name}'s turn.
            Trick {gameState.trickNumber} of 7.
          </span>
        )}
      </div>
    </div>
  );
}

export default App;
