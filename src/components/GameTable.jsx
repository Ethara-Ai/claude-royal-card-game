// GameTable component - the main playing area with poker table aesthetic

import React from 'react';
import Card from './Card';
import PlayerHand from './PlayerHand';
import PlayedCardsArea from './PlayedCardsArea';
import Scoreboard from './Scoreboard';
import TurnIndicator from './TurnIndicator';
import { useTheme } from '../contexts/ThemeContext';
import { PLAYER_POSITIONS } from '../constants/gameConstants';

const GameTable = ({
  hands,
  playedCards,
  selectedCard,
  currentPlayer,
  scores,
  trickWinner,
  gameMode,
  playerName,
  turnTimer,
  onCardSelect,
  onCardPlay,
  getPlayerInfo,
}) => {
  const { isDark } = useTheme();

  const humanPlayer = getPlayerInfo('human');
  const topPlayer = getPlayerInfo('ai_top');
  const leftPlayer = getPlayerInfo('ai_left');
  const rightPlayer = getPlayerInfo('ai_right');

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 safe-area-inset ${
        isDark
          ? 'bg-gradient-to-br from-casino-dark-900 via-casino-dark-800 to-casino-dark-900'
          : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50'
      }`}
    >
      <div className="w-full max-w-6xl relative">
        {/* Scoreboard */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <Scoreboard
            scores={scores}
            currentPlayer={currentPlayer}
            getPlayerInfo={getPlayerInfo}
          />
        </div>

        {/* Turn Timer */}
        {currentPlayer === 'human' && turnTimer !== null && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
            <div className={`px-6 py-3 rounded-full shadow-lg ${
              turnTimer <= 10
                ? 'bg-red-500 animate-pulse'
                : isDark
                ? 'bg-casino-dark-700'
                : 'bg-white'
            }`}>
              <p className={`text-xl font-bold ${
                turnTimer <= 10
                  ? 'text-white'
                  : isDark
                  ? 'text-casino-gold-400'
                  : 'text-casino-dark-900'
              }`}>
                {turnTimer}s
              </p>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="relative">
          {/* Poker Table */}
          <div
            className={`relative mx-auto rounded-full table-shadow ${
              isDark
                ? 'bg-gradient-to-br from-casino-green-800 to-casino-green-900'
                : 'bg-gradient-to-br from-casino-green-600 to-casino-green-700'
            }`}
            style={{
              width: '100%',
              maxWidth: '800px',
              aspectRatio: '1.5/1',
            }}
          >
            {/* Table border */}
            <div className="absolute inset-0 rounded-full border-8 border-opacity-30"
              style={{
                borderColor: isDark ? '#78350f' : '#92400e',
              }}
            />

            {/* Top Player */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="flex flex-col items-center">
                <TurnIndicator
                  isActive={currentPlayer === 'ai_top'}
                  playerName={topPlayer.name}
                />
                <div className="mt-2">
                  {hands.ai_top.length > 0 && (
                    <div className="flex gap-1">
                      {hands.ai_top.map((_, index) => (
                        <Card
                          key={index}
                          card={null}
                          faceUp={false}
                          size="small"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Left Player */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center gap-2">
                <TurnIndicator
                  isActive={currentPlayer === 'ai_left'}
                  playerName={leftPlayer.name}
                  vertical
                />
                <div>
                  {hands.ai_left.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {hands.ai_left.map((_, index) => (
                        <Card
                          key={index}
                          card={null}
                          faceUp={false}
                          size="small"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Player */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center gap-2">
                <div>
                  {hands.ai_right.length > 0 && (
                    <div className="flex flex-col gap-1">
                      {hands.ai_right.map((_, index) => (
                        <Card
                          key={index}
                          card={null}
                          faceUp={false}
                          size="small"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <TurnIndicator
                  isActive={currentPlayer === 'ai_right'}
                  playerName={rightPlayer.name}
                  vertical
                />
              </div>
            </div>

            {/* Center - Played Cards Area */}
            <PlayedCardsArea
              playedCards={playedCards}
              trickWinner={trickWinner}
              getPlayerInfo={getPlayerInfo}
            />
          </div>

          {/* Human Player Hand */}
          <div className="mt-8">
            <PlayerHand
              hand={hands.human}
              selectedCard={selectedCard}
              onCardSelect={onCardSelect}
              onCardPlay={onCardPlay}
              disabled={currentPlayer !== 'human'}
              playerName={playerName}
              isCurrentPlayer={currentPlayer === 'human'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTable;
