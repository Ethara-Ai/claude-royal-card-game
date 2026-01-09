// TurnIndicator component - shows whose turn it is

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TurnIndicator = ({ isActive, playerName, vertical = false }) => {
  const { isDark } = useTheme();

  if (!isActive) {
    return (
      <div className={`px-3 py-1 rounded-full text-sm ${
        isDark
          ? 'bg-casino-dark-700 text-casino-dark-300'
          : 'bg-gray-200 text-gray-600'
      }`}>
        {playerName}
      </div>
    );
  }

  return (
    <div
      className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse ${
        isDark
          ? 'bg-casino-gold-500 text-white'
          : 'bg-casino-gold-400 text-white'
      }`}
      role="status"
      aria-label={`${playerName}'s turn`}
      aria-live="polite"
    >
      {playerName}
    </div>
  );
};

export default TurnIndicator;
