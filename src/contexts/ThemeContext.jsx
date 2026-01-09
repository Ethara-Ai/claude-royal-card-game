// Theme context for managing dark/light themes and preferences

import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, LOCAL_STORAGE_KEYS } from '../constants/gameConstants';
import analytics from '../services/analytics';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      if (stored) {
        const settings = JSON.parse(stored);
        return settings.theme || THEMES.DARK;
      }
    } catch (error) {
      console.warn('Could not load theme from localStorage:', error);
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }

    return THEMES.DARK;
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [prefersHighContrast, setPrefersHighContrast] = useState(() => {
    if (window.matchMedia) {
      return window.matchMedia('(prefers-contrast: high)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Listen for system theme changes
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      // Only auto-update if user hasn't manually set a preference
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
        if (!stored) {
          setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
        }
      } catch (error) {
        console.warn('Error handling theme change:', error);
      }
    };

    if (darkModeQuery.addEventListener) {
      darkModeQuery.addEventListener('change', handleThemeChange);
    } else {
      // Fallback for older browsers
      darkModeQuery.addListener(handleThemeChange);
    }

    return () => {
      if (darkModeQuery.removeEventListener) {
        darkModeQuery.removeEventListener('change', handleThemeChange);
      } else {
        darkModeQuery.removeListener(handleThemeChange);
      }
    };
  }, []);

  useEffect(() => {
    // Listen for reduced motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    } else {
      motionQuery.addListener(handleMotionChange);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      } else {
        motionQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  useEffect(() => {
    // Listen for high contrast preference changes
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const handleContrastChange = (e) => {
      setPrefersHighContrast(e.matches);
    };

    if (contrastQuery.addEventListener) {
      contrastQuery.addEventListener('change', handleContrastChange);
    } else {
      contrastQuery.addListener(handleContrastChange);
    }

    return () => {
      if (contrastQuery.removeEventListener) {
        contrastQuery.removeEventListener('change', handleContrastChange);
      } else {
        contrastQuery.removeListener(handleContrastChange);
      }
    };
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove(THEMES.DARK, THEMES.LIGHT);
    document.documentElement.classList.add(theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === THEMES.DARK ? '#102a43' : '#f0f4f8'
      );
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);

    // Save to localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      const settings = stored ? JSON.parse(stored) : {};
      settings.theme = newTheme;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.warn('Could not save theme to localStorage:', error);
    }

    // Track theme change
    analytics.trackThemeChanged(newTheme);
  };

  const setThemeValue = (newTheme) => {
    if (newTheme !== THEMES.DARK && newTheme !== THEMES.LIGHT) {
      console.warn('Invalid theme value:', newTheme);
      return;
    }

    setTheme(newTheme);

    // Save to localStorage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      const settings = stored ? JSON.parse(stored) : {};
      settings.theme = newTheme;
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.warn('Could not save theme to localStorage:', error);
    }

    // Track theme change
    analytics.trackThemeChanged(newTheme);
  };

  const value = {
    theme,
    isDark: theme === THEMES.DARK,
    isLight: theme === THEMES.LIGHT,
    toggleTheme,
    setTheme: setThemeValue,
    prefersReducedMotion,
    prefersHighContrast,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
