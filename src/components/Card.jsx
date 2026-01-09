// Card component with animations, patterns, and accessibility

import React, { useMemo } from 'react';
import { getSuitSymbol, getSuitColor, getCardName } from '../utils/cardUtils';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { CARD_PATTERNS } from '../constants/gameConstants';

const Card = ({
  card,
  faceUp = true,
  selected = false,
  isWinner = false,
  onClick,
  rotation = 0,
  offsetX = 0,
  style = {},
  disabled = false,
  size = 'normal', // 'small', 'normal', 'large'
  className = '',
  tabIndex,
}) => {
  const { prefersReducedMotion } = useTheme();
  const { cardBackColor, cardBackPattern, animationsEnabled } = useSettings();

  const sizeClasses = {
    small: 'w-12 h-16',
    normal: 'w-20 h-28',
    large: 'w-24 h-32',
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(card);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Generate card back pattern
  const getCardBackPattern = () => {
    const baseColor = cardBackColor;
    const lighterColor = adjustColor(baseColor, 40);
    const darkerColor = adjustColor(baseColor, -20);

    switch (cardBackPattern) {
      case CARD_PATTERNS.CHECKERBOARD:
        return (
          <pattern id="checkerboard" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill={baseColor} />
            <rect x="10" y="0" width="10" height="10" fill={lighterColor} />
            <rect x="0" y="10" width="10" height="10" fill={lighterColor} />
            <rect x="10" y="10" width="10" height="10" fill={baseColor} />
          </pattern>
        );
      case CARD_PATTERNS.DIAGONAL:
        return (
          <pattern id="diagonal" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill={baseColor} />
            <line x1="0" y1="0" x2="10" y2="10" stroke={lighterColor} strokeWidth="2" />
          </pattern>
        );
      case CARD_PATTERNS.POLKA:
        return (
          <pattern id="polka" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={baseColor} />
            <circle cx="5" cy="5" r="3" fill={lighterColor} />
            <circle cx="15" cy="15" r="3" fill={lighterColor} />
          </pattern>
        );
      default:
        return null;
    }
  };

  const patternId = cardBackPattern === CARD_PATTERNS.SOLID ? null : cardBackPattern;

  const cardStyle = {
    transform: `rotate(${rotation}deg) translateX(${offsetX}px) ${selected ? 'translateY(-20px)' : ''}`,
    transition: animationsEnabled && !prefersReducedMotion ? 'all 0.3s ease' : 'none',
    cursor: disabled ? 'default' : onClick ? 'pointer' : 'default',
    ...style,
  };

  if (faceUp && card) {
    const suitColor = getSuitColor(card.suit);
    const suitSymbol = getSuitSymbol(card.suit);

    return (
      <div
        className={`
          ${sizeClasses[size]}
          bg-white rounded-lg card-shadow
          flex flex-col items-center justify-center
          relative
          ${selected ? 'ring-4 ring-casino-gold-400 glow-gold' : ''}
          ${isWinner ? 'animate-card-win' : ''}
          ${onClick && !disabled ? 'hover:scale-105 active:scale-95' : ''}
          ${disabled ? 'opacity-50' : ''}
          ${className}
        `}
        style={cardStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={onClick ? 'button' : 'img'}
        aria-label={getCardName(card)}
        tabIndex={onClick && !disabled ? (tabIndex !== undefined ? tabIndex : 0) : -1}
      >
        {/* Top left corner */}
        <div className="absolute top-1 left-1 flex flex-col items-center">
          <span className="text-lg font-bold leading-none" style={{ color: suitColor }}>
            {card.rank}
          </span>
          <span className="text-sm leading-none" style={{ color: suitColor }}>
            {suitSymbol}
          </span>
        </div>

        {/* Center suit symbol */}
        <div className="text-4xl" style={{ color: suitColor }}>
          {suitSymbol}
        </div>

        {/* Bottom right corner (rotated) */}
        <div className="absolute bottom-1 right-1 flex flex-col items-center rotate-180">
          <span className="text-lg font-bold leading-none" style={{ color: suitColor }}>
            {card.rank}
          </span>
          <span className="text-sm leading-none" style={{ color: suitColor }}>
            {suitSymbol}
          </span>
        </div>
      </div>
    );
  }

  // Card back
  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-lg card-shadow
        relative overflow-hidden
        ${onClick && !disabled ? 'hover:scale-105 active:scale-95' : ''}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
      style={cardStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : 'img'}
      aria-label="Card back"
      tabIndex={onClick && !disabled ? (tabIndex !== undefined ? tabIndex : 0) : -1}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {getCardBackPattern()}
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={patternId ? `url(#${patternId})` : cardBackColor}
          rx="8"
        />
        {/* Border */}
        <rect
          width="100%"
          height="100%"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          rx="8"
        />
      </svg>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  // Convert hex to RGB
  let usePound = false;
  if (color[0] === '#') {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  return (
    (usePound ? '#' : '') +
    ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
  );
}

export default Card;
