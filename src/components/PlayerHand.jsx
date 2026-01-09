// PlayerHand component for displaying and interacting with player cards

import React from 'react';
import Card from './Card';
import { calculateCardRotation, calculateCardOffset } from '../utils/cardUtils';
import { useTheme } from '../contexts/ThemeContext';

const PlayerHand = ({
  hand,
  selectedCard,
  onCardSelect,
  onCardPlay,
  disabled,
  playerName,
  isCurrentPlayer,
}) => {
  const { isDark } = useTheme();

  const handleCardClick = (card) => {
    if (disabled) return;

    if (selectedCard?.id === card.id) {
      // Card is already selected, play it
      onCardPlay(card);
    } else {
      // Select the card
      onCardSelect(card);
    }
  };

  if (hand.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      {/* Player indicator */}
      <div className={`mb-4 px-6 py-2 rounded-full ${
        isCurrentPlayer
          ? isDark
            ? 'bg-casino-gold-500 text-white shadow-lg'
            : 'bg-casino-gold-400 text-white shadow-lg'
          : isDark
            ? 'bg-casino-dark-700 text-casino-dark-200'
            : 'bg-gray-200 text-gray-700'
      }`}>
        <p className="font-semibold">
          {isCurrentPlayer ? `${playerName} - Your Turn` : playerName}
        </p>
      </div>

      {/* Cards */}
      <div className="relative h-36 flex items-end justify-center">
        <div className="relative" style={{ width: `${hand.length * 60 + 80}px`, height: '140px' }}>
          {hand.map((card, index) => {
            const rotation = calculateCardRotation(index, hand.length, 15);
            const offsetX = calculateCardOffset(index, hand.length, 80, 0.6);
            const isSelected = selectedCard?.id === card.id;

            return (
              <div
                key={card.id}
                className="absolute"
                style={{
                  left: '50%',
                  bottom: '0',
                  transform: `translateX(-50%)`,
                }}
              >
                <Card
                  card={card}
                  faceUp={true}
                  selected={isSelected}
                  onClick={handleCardClick}
                  rotation={rotation}
                  offsetX={offsetX}
                  disabled={disabled}
                  size="normal"
                  tabIndex={disabled ? -1 : 0}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      {isCurrentPlayer && selectedCard && (
        <div className={`mt-4 px-4 py-2 rounded-lg ${
          isDark ? 'bg-casino-dark-700' : 'bg-white'
        } shadow-lg`}>
          <p className={`text-sm ${
            isDark ? 'text-casino-dark-200' : 'text-gray-700'
          }`}>
            Click the card again or tap the table to play it
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerHand;
