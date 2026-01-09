// Header component with theme toggle, settings, and help

import React, { useState } from 'react';
import { FiSun, FiMoon, FiSettings, FiHelpCircle, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import SettingsModal from './SettingsModal';
import TutorialModal from './TutorialModal';

const Header = ({ showMenuButton = false }) => {
  const { isDark, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setMenuOpen(false);
  };

  const handleHelpClick = () => {
    setShowTutorial(true);
    setMenuOpen(false);
  };

  const buttons = (
    <>
      <button
        onClick={handleThemeToggle}
        className={`p-3 rounded-lg transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
          isDark
            ? 'bg-casino-dark-700 text-casino-gold-400 hover:bg-casino-dark-600'
            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
        }`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        {isDark ? <FiSun size={24} /> : <FiMoon size={24} />}
      </button>

      <button
        onClick={handleHelpClick}
        className={`p-3 rounded-lg transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
          isDark
            ? 'bg-casino-dark-700 text-casino-gold-400 hover:bg-casino-dark-600'
            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
        }`}
        aria-label="How to play"
        title="How to play"
      >
        <FiHelpCircle size={24} />
      </button>

      <button
        onClick={handleSettingsClick}
        className={`p-3 rounded-lg transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
          isDark
            ? 'bg-casino-dark-700 text-casino-gold-400 hover:bg-casino-dark-600'
            : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
        }`}
        aria-label="Settings"
        title="Settings"
      >
        <FiSettings size={24} />
      </button>
    </>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className={`text-xl font-bold ${
              isDark ? 'text-casino-gold-400' : 'text-casino-dark-900'
            }`}>
              Card Tricks
            </div>

            {/* Desktop buttons */}
            <div className="hidden landscape:flex md:flex gap-3">
              {buttons}
            </div>

            {/* Mobile menu button */}
            <div className="flex landscape:hidden md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-casino-gold-400 ${
                  isDark
                    ? 'bg-casino-dark-700 text-casino-gold-400'
                    : 'bg-white text-gray-700 shadow-md'
                }`}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {menuOpen && (
            <div
              className={`mt-3 p-3 rounded-lg shadow-xl landscape:hidden md:hidden ${
                isDark
                  ? 'bg-casino-dark-800 border border-casino-dark-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleThemeToggle}
                  className={`w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    isDark
                      ? 'bg-casino-dark-700 text-casino-dark-100 hover:bg-casino-dark-600'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                  <span>Switch to {isDark ? 'Light' : 'Dark'} Theme</span>
                </button>

                <button
                  onClick={handleHelpClick}
                  className={`w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    isDark
                      ? 'bg-casino-dark-700 text-casino-dark-100 hover:bg-casino-dark-600'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiHelpCircle size={20} />
                  <span>How to Play</span>
                </button>

                <button
                  onClick={handleSettingsClick}
                  className={`w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all ${
                    isDark
                      ? 'bg-casino-dark-700 text-casino-dark-100 hover:bg-casino-dark-600'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiSettings size={20} />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {showTutorial && (
        <TutorialModal onClose={() => setShowTutorial(false)} />
      )}
    </>
  );
};

export default Header;
