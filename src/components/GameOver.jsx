// GameOver component - displays game results with confetti celebration

import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useTheme } from '../contexts/ThemeContext';

const GameOver = ({ scores, gameWinner, getPlayerInfo, onPlayAgain, onBackToLobby }) => {
  const { isDark, prefersReducedMotion } = useTheme();

  const humanPlayer = getPlayerInfo('human');
  const playerWon = gameWinner === 'human';

  // Sort players by score
  const sortedPlayers = Object.entries(scores)
    .map(([playerId, score]) => ({
      ...getPlayerInfo(playerId),
      score,
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 safe-area-inset ${
        isDark
          ? 'bg-gradient-to-br from-casino-dark-900 via-casino-dark-800 to-casino-dark-900'
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
      }`}
    >
      {/* Confetti for winner */}
      {playerWon && !prefersReducedMotion && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl p-8 ${
          isDark
            ? 'bg-casino-dark-800 border border-casino-dark-700'
            : 'bg-white border border-gray-200'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              playerWon
                ? 'text-casino-gold-400 animate-pulse'
                : isDark
                ? 'text-casino-dark-100'
                : 'text-gray-900'
            }`}
          >
            {playerWon ? '🎉 You Win! 🎉' : 'Game Over'}
          </h1>
          <p
            className={`text-xl ${
              isDark ? 'text-casino-dark-200' : 'text-gray-600'
            }`}
          >
            {playerWon
              ? 'Congratulations! You outsmarted your opponents!'
              : gameWinner
              ? `${getPlayerInfo(gameWinner).name} wins this round!`
              : "It's a tie!"}
          </p>
        </div>

        {/* Final Scores */}
        <div className="mb-8">
          <h2
            className={`text-2xl font-bold mb-4 text-center ${
              isDark ? 'text-casino-gold-400' : 'text-casino-dark-900'
            }`}
          >
            Final Scores
          </h2>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const isWinner = player.id === gameWinner;
              const isHuman = player.id === 'human';

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between px-6 py-4 rounded-lg transition-all ${
                    isWinner
                      ? isDark
                        ? 'bg-casino-gold-500 text-white shadow-lg'
                        : 'bg-casino-gold-400 text-white shadow-lg'
                      : isDark
                      ? 'bg-casino-dark-700 text-casino-dark-100'
                      : 'bg-gray-50 text-gray-900'
                  }`}
                  role="listitem"
                  aria-label={`${index + 1}. ${player.name}: ${player.score} points${isWinner ? ' - Winner' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold opacity-60">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {player.name}
                      </span>
                      {isWinner && <span className="text-xl">👑</span>}
                      {isHuman && !isWinner && <span className="text-sm opacity-75">(You)</span>}
                    </div>
                  </div>
                  <span className="text-3xl font-bold">
                    {player.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className={`w-full py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
              isDark
                ? 'bg-gradient-to-r from-casino-gold-500 to-casino-gold-600 text-white shadow-xl hover:from-casino-gold-400 hover:to-casino-gold-500'
                : 'bg-gradient-to-r from-casino-gold-400 to-casino-gold-500 text-white shadow-xl hover:from-casino-gold-500 hover:to-casino-gold-600'
            }`}
            aria-label="Play another game"
          >
            Play Again
          </button>

          <button
            onClick={onBackToLobby}
            className={`w-full py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
              isDark
                ? 'bg-casino-dark-700 text-casino-dark-100 hover:bg-casino-dark-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
            aria-label="Return to lobby"
          >
            Back to Lobby
          </button>
        </div>

        {/* Stats hint */}
        <p
          className={`text-center text-sm mt-6 ${
            isDark ? 'text-casino-dark-300' : 'text-gray-500'
          }`}
        >
          {playerWon
            ? 'Great job! Want to try a different game mode?'
            : 'Better luck next time! Practice makes perfect.'}
        </p>
      </div>
    </div>
  );
};

export default GameOver;
