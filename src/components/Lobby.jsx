// Lobby component for game setup

import React, { useState } from 'react';
import { GAME_MODES, GAME_MODE_NAMES, GAME_MODE_DESCRIPTIONS, AI_PLAYERS } from '../constants/gameConstants';
import { useTheme } from '../contexts/ThemeContext';

const Lobby = ({ playerName, onPlayerNameChange, gameMode, onGameModeChange, onStartGame }) => {
  const { isDark } = useTheme();
  const [localName, setLocalName] = useState(playerName);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setLocalName(name);
    onPlayerNameChange(name || 'You');
  };

  const handleModeSelect = (mode) => {
    onGameModeChange(mode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 safe-area-inset ${
      isDark ? 'bg-gradient-to-br from-casino-dark-900 via-casino-dark-800 to-casino-dark-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl p-8 ${
        isDark ? 'bg-casino-dark-800 border border-casino-dark-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${
            isDark ? 'text-casino-gold-400' : 'text-casino-dark-900'
          }`}>
            Card Trick Game
          </h1>
          <p className={`text-lg ${
            isDark ? 'text-casino-dark-200' : 'text-gray-600'
          }`}>
            Win tricks and outscore your opponents
          </p>
        </div>

        {/* Player Name Input */}
        <div className="mb-8">
          <label htmlFor="player-name" className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-casino-dark-100' : 'text-gray-700'
          }`}>
            Your Name
          </label>
          <input
            id="player-name"
            type="text"
            value={localName}
            onChange={handleNameChange}
            placeholder="Enter your name"
            maxLength={20}
            className={`w-full px-4 py-3 rounded-lg text-lg focus:ring-2 focus:ring-casino-gold-400 focus:outline-none ${
              isDark
                ? 'bg-casino-dark-700 text-white border-casino-dark-600 placeholder-casino-dark-400'
                : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'
            } border`}
            aria-label="Enter your name"
          />
        </div>

        {/* Opponents */}
        <div className="mb-8">
          <h2 className={`text-sm font-medium mb-3 ${
            isDark ? 'text-casino-dark-100' : 'text-gray-700'
          }`}>
            Your Opponents
          </h2>
          <div className="flex justify-around items-center">
            {AI_PLAYERS.map((player) => (
              <div key={player.id} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2 ${
                  isDark
                    ? 'bg-casino-dark-700 text-casino-gold-400 border-2 border-casino-dark-600'
                    : 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                }`}>
                  {player.name.charAt(0)}
                </div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-casino-dark-200' : 'text-gray-600'
                }`}>
                  {player.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="mb-8">
          <h2 className={`text-sm font-medium mb-3 ${
            isDark ? 'text-casino-dark-100' : 'text-gray-700'
          }`}>
            Select Game Mode
          </h2>
          <div className="space-y-3">
            {Object.values(GAME_MODES).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeSelect(mode)}
                className={`w-full text-left px-4 py-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
                  gameMode === mode
                    ? isDark
                      ? 'bg-casino-gold-500 text-white border-2 border-casino-gold-400 shadow-lg'
                      : 'bg-casino-gold-400 text-white border-2 border-casino-gold-500 shadow-lg'
                    : isDark
                      ? 'bg-casino-dark-700 text-casino-dark-100 border-2 border-casino-dark-600 hover:border-casino-gold-500'
                      : 'bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-casino-gold-400'
                }`}
                aria-pressed={gameMode === mode}
                aria-label={`Select ${GAME_MODE_NAMES[mode]} mode`}
              >
                <div className="font-semibold text-lg mb-1">
                  {GAME_MODE_NAMES[mode]}
                </div>
                <div className={`text-sm ${
                  gameMode === mode
                    ? 'text-white opacity-90'
                    : isDark ? 'text-casino-dark-300' : 'text-gray-600'
                }`}>
                  {GAME_MODE_DESCRIPTIONS[mode]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={onStartGame}
          className={`w-full py-4 rounded-lg text-xl font-bold transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
            isDark
              ? 'bg-gradient-to-r from-casino-gold-500 to-casino-gold-600 text-white shadow-xl hover:from-casino-gold-400 hover:to-casino-gold-500'
              : 'bg-gradient-to-r from-casino-gold-400 to-casino-gold-500 text-white shadow-xl hover:from-casino-gold-500 hover:to-casino-gold-600'
          }`}
          aria-label="Start game"
        >
          Start Game
        </button>

        {/* Rules Hint */}
        <p className={`text-center text-sm mt-4 ${
          isDark ? 'text-casino-dark-300' : 'text-gray-500'
        }`}>
          Play 7 tricks. Most points wins!
        </p>
      </div>
    </div>
  );
};

export default Lobby;
