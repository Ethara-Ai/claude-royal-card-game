// PlayedCardsArea component - displays cards played in current trick

import React from 'react';
import Card from './Card';
import { useTheme } from '../contexts/ThemeContext';

const PlayedCardsArea = ({ playedCards, trickWinner, getPlayerInfo }) => {
  const { isDark } = useTheme();

  if (playedCards.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-center ${
          isDark ? 'text-casino-dark-400' : 'text-casino-green-900'
        } opacity-50`}>
          <p className="text-lg font-semibold">Waiting for first card...</p>
        </div>
      </div>
    );
  }

  // Position cards based on player position
  const getCardPosition = (playerId) => {
    switch (playerId) {
      case 'human':
        return { bottom: '20%', left: '50%', transform: 'translateX(-50%)' };
      case 'ai_top':
        return { top: '20%', left: '50%', transform: 'translateX(-50%)' };
      case 'ai_left':
        return { top: '50%', left: '20%', transform: 'translateY(-50%)' };
      case 'ai_right':
        return { top: '50%', right: '20%', transform: 'translateY(-50%)' };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {playedCards.map(({ playerId, card }) => {
        const position = getCardPosition(playerId);
        const isWinner = trickWinner === playerId;

        return (
          <div
            key={playerId}
            className="absolute animate-card-play"
            style={position}
          >
            <Card
              card={card}
              faceUp={true}
              isWinner={isWinner}
              size="normal"
            />
          </div>
        );
      })}

      {/* Winner announcement */}
      {trickWinner && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-20">
          <div className={`px-6 py-3 rounded-full shadow-2xl animate-pulse ${
            isDark
              ? 'bg-casino-gold-500 text-white'
              : 'bg-casino-gold-400 text-white'
          }`}>
            <p className="font-bold text-lg whitespace-nowrap">
              {getPlayerInfo(trickWinner).name} wins!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayedCardsArea;
