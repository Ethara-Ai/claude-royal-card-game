// SettingsModal component - card customization and preferences

import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { HexColorPicker } from 'react-colorful';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { CARD_PATTERNS, CARD_PATTERN_NAMES } from '../constants/gameConstants';
import Card from './Card';

const SettingsModal = ({ onClose }) => {
  const { isDark } = useTheme();
  const {
    cardBackColor,
    cardBackPattern,
    setCardBackColor,
    setCardBackPattern,
    resetSettings,
  } = useSettings();

  const [tempColor, setTempColor] = useState(cardBackColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (color) => {
    setTempColor(color);
    setCardBackColor(color);
  };

  const handlePatternChange = (pattern) => {
    setCardBackPattern(pattern);
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default?')) {
      resetSettings();
    }
  };

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
      aria-labelledby="settings-title"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-screen overflow-y-auto ${
          isDark
            ? 'bg-casino-dark-800 border border-casino-dark-700'
            : 'bg-white border border-gray-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            id="settings-title"
            className={`text-2xl font-bold ${
              isDark ? 'text-casino-gold-400' : 'text-casino-dark-900'
            }`}
          >
            Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
              isDark
                ? 'bg-casino-dark-700 text-casino-dark-100 hover:bg-casino-dark-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Close settings"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Card Preview */}
        <div className="mb-8">
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-casino-dark-100' : 'text-gray-900'
            }`}
          >
            Preview
          </h3>
          <div className="flex justify-center items-center p-8 rounded-lg"
            style={{
              background: isDark
                ? 'linear-gradient(to bottom, #0f766e, #134e4a)'
                : 'linear-gradient(to bottom, #059669, #047857)'
            }}
          >
            <Card
              card={null}
              faceUp={false}
              size="large"
            />
          </div>
        </div>

        {/* Card Back Color */}
        <div className="mb-8">
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-casino-dark-100' : 'text-gray-900'
            }`}
          >
            Card Back Color
          </h3>

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
                isDark
                  ? 'bg-casino-dark-700 text-casino-dark-100 hover:bg-casino-dark-600'
                  : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Pick a color"
            >
              <div
                className="w-8 h-8 rounded border-2 border-white shadow-md"
                style={{ backgroundColor: tempColor }}
              />
              <span className="font-medium">Pick a Color</span>
            </button>

            <div
              className={`px-4 py-3 rounded-lg font-mono ${
                isDark ? 'bg-casino-dark-700 text-casino-dark-200' : 'bg-gray-50 text-gray-700'
              }`}
            >
              {tempColor.toUpperCase()}
            </div>
          </div>

          {showColorPicker && (
            <div className="mb-4">
              <HexColorPicker
                color={tempColor}
                onChange={handleColorChange}
                style={{ width: '100%', height: '200px' }}
              />
            </div>
          )}

          {/* Preset Colors */}
          <div className="flex flex-wrap gap-2">
            {[
              '#1e40af', // blue
              '#dc2626', // red
              '#059669', // green
              '#7c3aed', // purple
              '#ea580c', // orange
              '#0891b2', // cyan
              '#4b5563', // gray
              '#000000', // black
            ].map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
                  tempColor.toLowerCase() === color.toLowerCase()
                    ? 'border-casino-gold-400 shadow-lg'
                    : 'border-white shadow'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>

        {/* Card Back Pattern */}
        <div className="mb-8">
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-casino-dark-100' : 'text-gray-900'
            }`}
          >
            Card Back Pattern
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(CARD_PATTERNS).map((pattern) => (
              <button
                key={pattern}
                onClick={() => handlePatternChange(pattern)}
                className={`px-4 py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
                  cardBackPattern === pattern
                    ? isDark
                      ? 'bg-casino-gold-500 text-white border-2 border-casino-gold-400'
                      : 'bg-casino-gold-400 text-white border-2 border-casino-gold-500'
                    : isDark
                      ? 'bg-casino-dark-700 text-casino-dark-100 border-2 border-casino-dark-600 hover:border-casino-gold-500'
                      : 'bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-casino-gold-400'
                }`}
                aria-pressed={cardBackPattern === pattern}
              >
                {CARD_PATTERN_NAMES[pattern]}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-6 border-t"
          style={{
            borderColor: isDark ? '#334e68' : '#e5e7eb'
          }}
        >
          <button
            onClick={handleReset}
            className={`w-full py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 ${
              isDark
                ? 'bg-red-900 text-red-100 hover:bg-red-800 border-2 border-red-700'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-200'
            }`}
          >
            Reset to Defaults
          </button>
        </div>

        {/* Info */}
        <p
          className={`text-center text-sm mt-4 ${
            isDark ? 'text-casino-dark-300' : 'text-gray-500'
          }`}
        >
          Your settings are saved automatically
        </p>
      </div>
    </div>
  );
};

export default SettingsModal;
