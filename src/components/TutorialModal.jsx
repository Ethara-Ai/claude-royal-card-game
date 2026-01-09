// TutorialModal component - game instructions and rules

import React from 'react';
import { FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { GAME_MODE_NAMES, GAME_MODE_DESCRIPTIONS, GAME_MODES } from '../constants/gameConstants';

const TutorialModal = ({ onClose }) => {
  const { isDark } = useTheme();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-2xl p-6 max-h-screen overflow-y-auto ${
          isDark
            ? 'bg-casino-dark-800 border border-casino-dark-700'
            : 'bg-white border border-gray-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            id="tutorial-title"
            className={`text-2xl font-bold ${
              isDark ? 'text-casino-gold-400' : 'text-casino-dark-900'
            }`}
          >
            How to Play
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
              isDark
                ? 'bg-casino-dark-700 text-casino-dark-100 hover:bg-casino-dark-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Close tutorial"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Game Overview */}
        <section className="mb-8">
          <h3
            className={`text-xl font-bold mb-3 ${
              isDark ? 'text-casino-dark-100' : 'text-gray-900'
            }`}
          >
            Game Overview
          </h3>
          <p
            className={`text-base leading-relaxed mb-3 ${
              isDark ? 'text-casino-dark-200' : 'text-gray-700'
            }`}
          >
            Card Trick Game is a trick-taking card game where you compete against three AI opponents.
            Each player receives 7 cards, and you'll play 7 tricks total. The goal is to win the most tricks
            and score the highest points!
          </p>
        </section>

        {/* How to Play */}
        <section className="mb-8">
          <h3
            className={`text-xl font-bold mb-3 ${
              isDark ? 'text-casino-dark-100' : 'text-gray-900'
            }`}
          >
            How to Play
          </h3>
          <ol
            className={`list-decimal list-inside space-y-3 text-base ${
              isDark ? 'text-casino-dark-200' : 'text-gray-700'
            }`}
          >
            <li>
              <strong>Starting the Game:</strong> Enter your name, choose a game mode, and click "Start Game".
            </li>
            <li>
              <strong>Playing a Card:</strong> When it's your turn, click a card to select it, then click it again
              or tap anywhere on the table to play it. You have 30 seconds to make your move.
            </li>
            <li>
              <strong>Winning Tricks:</strong> After all four players have played a card, the winner is determined
              based on the game mode rules. The winner gets 1 point.
            </li>
            <li>
              <strong>Next Trick:</strong> The winner of the previous trick leads the next one. This continues
              for 7 tricks.
            </li>
            <li>
              <strong>Winning the Game:</strong> After 7 tricks, whoever has the most points wins!
            </li>
          </ol>
        </section>

        {/* Game Modes */}
        <section className="mb-8">
          <h3
            className={`text-xl font-bold mb-3 ${
              isDark ? 'text-casino-dark-100' : 'text-gray-900'
            }`}
          >
            Game Modes
          </h3>
          <div className="space-y-4">
            {/* Suit Follows */}
            <div
              className={`p-4 rounded-lg ${
                isDark ? 'bg-casino-dark-700' : 'bg-gray-50'
              }`}
            >
              <h4
                className={`font-bold text-lg mb-2 ${
                  isDark ? 'text-casino-gold-400' : 'text-casino-dark-900'
                }`}
              >
                {GAME_MODE_NAMES[GAME_MODES.SUIT_FOLLOWS]}
              </h4>
              <p
                className={`text-base mb-2 ${
                  isDark ? 'text-casino-dark-200' : 'text-gray-700'
                }`}
              >
                {GAME_MODE_DESCRIPTIONS[GAME_MODES.SUIT_FOLLOWS]}
              </p>
              <p
                className={`text-sm ${
                  isDark ? 'text-casino-dark-300' : 'text-gray-600'
                }`}
              >
                <strong>Rule:</strong> If you have a card in the lead suit, you must play it. The highest card
                in the lead suit wins the trick.
              </p>
            </div>

            {/* Highest Card */}
            <div
              className={`p-4 rounded-lg ${
                isDark ? 'bg-casino-dark-700' : 'bg-gray-50'
              }`}
            >
              <h4
                className={`font-bold text-lg mb-2 ${
                  isDark ? 'text-casino-gold-400' : 'text-casino-dark-900'
                }`}
              >
                {GAME_MODE_NAMES[GAME_MODES.HIGHEST_CARD]}
              </h4>
              <p
                className={`text-base mb-2 ${
                  isDark ? 'text-casino-dark-200' : 'text-gray-700'
                }`}
              >
                {GAME_MODE_DESCRIPTIONS[GAME_MODES.HIGHEST_CARD]}
              </p>
              <p
                className={`text-sm ${
                  isDark ? 'text-casino-dark-300' : 'text-gray-600'
                }`}
              >
                <strong>Rule:</strong> Play any card you want. The highest ranked card wins,
                regardless of suit. Ace is highest, 2 is lowest.
              </p>
            </div>

            {/* Spades Trump */}
            <div
              className={`p-4 rounded-lg ${
                isDark ? 'bg-casino-dark-700' : 'bg-gray-50'
              }`}
            >
              <h4
                className={`font-bold text-lg mb-2 ${
                  isDark ? 'text-casino-gold-400' : 'text-casino-dark-900'
                }`}
              >
                {GAME_MODE_NAMES[GAME_MODES.SPADES_TRUMP]}
              </h4>
              <p
                className={`text-base mb-2 ${
                  isDark ? 'text-casino-dark-200' : 'text-gray-700'
                }`}
              >
                {GAME_MODE_DESCRIPTIONS[GAME_MODES.SPADES_TRUMP]}
              </p>
              <p
                className={`text-sm ${
                  isDark ? 'text-casino-dark-300' : 'text-gray-600'
                }`}
              >
                <strong>Rule:</strong> Spades (♠) are trump and beat all other suits. If no spades are played,
                the highest card in the lead suit wins. You must follow suit if you can.
              </p>
            </div>
          </div>
        </section>

        {/* Card Rankings */}
        <section className="mb-8">
          <h3
            className={`text-xl font-bold mb-3 ${
              isDark ? 'text-casino-dark-100' : 'text-gray-900'
            }`}
          >
            Card Rankings
          </h3>
          <p
            className={`text-base mb-2 ${
              isDark ? 'text-casino-dark-200' : 'text-gray-700'
            }`}
          >
            From highest to lowest:
          </p>
          <div
            className={`p-4 rounded-lg text-center ${
              isDark ? 'bg-casino-dark-700' : 'bg-gray-50'
            }`}
          >
            <p
              className={`text-lg font-mono ${
                isDark ? 'text-casino-gold-400' : 'text-casino-dark-900'
              }`}
            >
              A → K → Q → J → 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2
            </p>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-6">
          <h3
            className={`text-xl font-bold mb-3 ${
              isDark ? 'text-casino-dark-100' : 'text-gray-900'
            }`}
          >
            Tips & Tricks
          </h3>
          <ul
            className={`list-disc list-inside space-y-2 text-base ${
              isDark ? 'text-casino-dark-200' : 'text-gray-700'
            }`}
          >
            <li>In Suit Follows mode, try to win tricks with your high cards when you lead.</li>
            <li>In Spades Trump mode, save your spades for when you really need them!</li>
            <li>Watch what cards other players play to strategize your moves.</li>
            <li>The winner of each trick leads the next one, so winning gives you control.</li>
            <li>You can use keyboard navigation - Tab to move between cards, Enter to select/play.</li>
          </ul>
        </section>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-lg text-lg font-bold transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
            isDark
              ? 'bg-gradient-to-r from-casino-gold-500 to-casino-gold-600 text-white shadow-xl hover:from-casino-gold-400 hover:to-casino-gold-500'
              : 'bg-gradient-to-r from-casino-gold-400 to-casino-gold-500 text-white shadow-xl hover:from-casino-gold-500 hover:to-casino-gold-600'
          }`}
        >
          Got It!
        </button>
      </div>
    </div>
  );
};

export default TutorialModal;
