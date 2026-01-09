// Scoreboard component - displays current scores and game status

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Scoreboard = ({ scores, currentPlayer, getPlayerInfo }) => {
  const { isDark } = useTheme();

  const playerIds = ['human', 'ai_top', 'ai_left', 'ai_right'];
  const maxScore = Math.max(...Object.values(scores));

  return (
    <div className={`w-full px-4 py-3 rounded-lg shadow-lg ${
      isDark
        ? 'bg-casino-dark-800 border border-casino-dark-700'
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex justify-around items-center">
        {playerIds.map((playerId) => {
          const player = getPlayerInfo(playerId);
          const isCurrentPlayer = currentPlayer === playerId;
          const isLeading = scores[playerId] === maxScore && maxScore > 0;

          return (
            <div
              key={playerId}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
                isCurrentPlayer
                  ? isDark
                    ? 'bg-casino-gold-500 text-white shadow-md'
                    : 'bg-casino-gold-400 text-white shadow-md'
                  : isDark
                    ? 'bg-casino-dark-700'
                    : 'bg-gray-50'
              }`}
              role="status"
              aria-live="polite"
              aria-label={`${player.name}: ${scores[playerId]} points${isCurrentPlayer ? ', current turn' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${
                  isCurrentPlayer
                    ? 'text-white'
                    : isDark
                      ? 'text-casino-dark-100'
                      : 'text-gray-900'
                }`}>
                  {player.name}
                </span>
                {isLeading && scores[playerId] > 0 && (
                  <span className="text-sm" title="Leading">👑</span>
                )}
              </div>
              <span className={`text-2xl font-bold ${
                isCurrentPlayer
                  ? 'text-white'
                  : isDark
                    ? 'text-casino-gold-400'
                    : 'text-casino-gold-600'
              }`}>
                {scores[playerId]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scoreboard;
