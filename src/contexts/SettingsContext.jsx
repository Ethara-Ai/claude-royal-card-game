// Settings context for card customization and game preferences

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CARD_PATTERNS,
  LOCAL_STORAGE_KEYS,
  DEFAULT_SETTINGS,
} from '../constants/gameConstants';
import analytics from '../services/analytics';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
        };
      }
    } catch (error) {
      console.warn('Could not load settings from localStorage:', error);
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.warn('Could not save settings to localStorage:', error);
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  const setCardBackColor = (color) => {
    setSettings(prev => ({
      ...prev,
      cardBackColor: color,
    }));

    analytics.trackCardCustomized(color, settings.cardBackPattern);
  };

  const setCardBackPattern = (pattern) => {
    if (!Object.values(CARD_PATTERNS).includes(pattern)) {
      console.warn('Invalid card pattern:', pattern);
      return;
    }

    setSettings(prev => ({
      ...prev,
      cardBackPattern: pattern,
    }));

    analytics.trackCardCustomized(settings.cardBackColor, pattern);
  };

  const setSoundEnabled = (enabled) => {
    setSettings(prev => ({
      ...prev,
      soundEnabled: enabled,
    }));
  };

  const setAnimationsEnabled = (enabled) => {
    setSettings(prev => ({
      ...prev,
      animationsEnabled: enabled,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const value = {
    settings,
    cardBackColor: settings.cardBackColor,
    cardBackPattern: settings.cardBackPattern,
    soundEnabled: settings.soundEnabled,
    animationsEnabled: settings.animationsEnabled,
    updateSettings,
    setCardBackColor,
    setCardBackPattern,
    setSoundEnabled,
    setAnimationsEnabled,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
