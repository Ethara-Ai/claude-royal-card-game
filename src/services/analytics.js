// Analytics service for tracking user interactions and game events
// Ready for integration with Google Analytics, Mixpanel, or similar services

import { ANALYTICS_EVENTS } from '../constants/gameConstants';

class AnalyticsService {
  constructor() {
    this.isEnabled = false;
    this.hasConsent = false;
    this.queue = [];
    this.initialized = false;
  }

  /**
   * Initialize the analytics service
   * @param {Object} config - Configuration options
   */
  init(config = {}) {
    // Check for Do Not Track
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    const doNotTrack = dnt === '1' || dnt === 'yes';

    if (doNotTrack) {
      console.log('[Analytics] Do Not Track is enabled. Analytics disabled.');
      this.isEnabled = false;
      return;
    }

    // Check for stored consent (GDPR compliance)
    this.hasConsent = this.getStoredConsent();
    this.isEnabled = this.hasConsent;

    this.initialized = true;

    if (this.isEnabled) {
      console.log('[Analytics] Service initialized with consent');
      this.flushQueue();
    } else {
      console.log('[Analytics] Service initialized, waiting for consent');
    }
  }

  /**
   * Get stored consent from localStorage
   * @returns {boolean} Whether user has given consent
   */
  getStoredConsent() {
    try {
      const consent = localStorage.getItem('analytics_consent');
      return consent === 'true';
    } catch (error) {
      console.warn('[Analytics] Could not access localStorage:', error);
      return false;
    }
  }

  /**
   * Set user consent for analytics
   * @param {boolean} hasConsent - Whether user consents
   */
  setConsent(hasConsent) {
    this.hasConsent = hasConsent;
    this.isEnabled = hasConsent;

    try {
      localStorage.setItem('analytics_consent', String(hasConsent));
    } catch (error) {
      console.warn('[Analytics] Could not save consent to localStorage:', error);
    }

    if (hasConsent) {
      console.log('[Analytics] Consent granted, flushing queue');
      this.flushQueue();
    } else {
      console.log('[Analytics] Consent revoked, clearing queue');
      this.queue = [];
    }
  }

  /**
   * Track an event
   * @param {string} eventName - Name of the event
   * @param {Object} properties - Event properties
   */
  track(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    if (!this.isEnabled) {
      // Queue events until consent is given
      this.queue.push(event);
      console.log('[Analytics] Event queued (no consent):', eventName, properties);
      return;
    }

    this.sendEvent(event);
  }

  /**
   * Send event to analytics provider
   * @param {Object} event - Event to send
   */
  sendEvent(event) {
    // TODO: Integrate with actual analytics service
    // Examples:
    // - Google Analytics: gtag('event', event.name, event.properties)
    // - Mixpanel: mixpanel.track(event.name, event.properties)
    // - Segment: analytics.track(event.name, event.properties)

    console.log('[Analytics] Event tracked:', event.name, event.properties);

    // Example Google Analytics integration (uncomment when ready):
    // if (window.gtag) {
    //   window.gtag('event', event.name, event.properties);
    // }

    // Example Mixpanel integration (uncomment when ready):
    // if (window.mixpanel) {
    //   window.mixpanel.track(event.name, event.properties);
    // }
  }

  /**
   * Flush queued events
   */
  flushQueue() {
    if (this.queue.length === 0) return;

    console.log(`[Analytics] Flushing ${this.queue.length} queued events`);
    this.queue.forEach(event => this.sendEvent(event));
    this.queue = [];
  }

  /**
   * Track page view
   * @param {string} pageName - Name of the page
   */
  trackPageView(pageName) {
    this.track('page_view', { page: pageName });
  }

  /**
   * Track game started
   * @param {string} gameMode - Selected game mode
   * @param {string} playerName - Player's name
   */
  trackGameStarted(gameMode, playerName) {
    this.track(ANALYTICS_EVENTS.GAME_STARTED, {
      game_mode: gameMode,
      player_name: playerName,
    });
  }

  /**
   * Track game completed
   * @param {string} gameMode - Game mode played
   * @param {boolean} playerWon - Whether the player won
   * @param {number} playerScore - Player's final score
   * @param {number} duration - Game duration in seconds
   */
  trackGameCompleted(gameMode, playerWon, playerScore, duration) {
    this.track(ANALYTICS_EVENTS.GAME_COMPLETED, {
      game_mode: gameMode,
      player_won: playerWon,
      player_score: playerScore,
      duration_seconds: duration,
    });
  }

  /**
   * Track game mode selection
   * @param {string} gameMode - Selected game mode
   */
  trackGameModeSelected(gameMode) {
    this.track(ANALYTICS_EVENTS.GAME_MODE_SELECTED, {
      game_mode: gameMode,
    });
  }

  /**
   * Track theme change
   * @param {string} theme - New theme
   */
  trackThemeChanged(theme) {
    this.track(ANALYTICS_EVENTS.THEME_CHANGED, {
      theme: theme,
    });
  }

  /**
   * Track card customization
   * @param {string} color - Card back color
   * @param {string} pattern - Card back pattern
   */
  trackCardCustomized(color, pattern) {
    this.track(ANALYTICS_EVENTS.CARD_CUSTOMIZED, {
      card_back_color: color,
      card_back_pattern: pattern,
    });
  }

  /**
   * Track tutorial viewed
   */
  trackTutorialViewed() {
    this.track(ANALYTICS_EVENTS.TUTORIAL_VIEWED, {});
  }

  /**
   * Track error occurred
   * @param {string} errorMessage - Error message
   * @param {string} errorContext - Context where error occurred
   */
  trackError(errorMessage, errorContext) {
    this.track(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      error_message: errorMessage,
      error_context: errorContext,
    });
  }

  /**
   * Set user properties
   * @param {Object} properties - User properties
   */
  setUserProperties(properties) {
    if (!this.isEnabled) return;

    console.log('[Analytics] User properties set:', properties);

    // TODO: Integrate with actual analytics service
    // Examples:
    // - Google Analytics: gtag('set', 'user_properties', properties)
    // - Mixpanel: mixpanel.people.set(properties)
  }

  /**
   * Identify user
   * @param {string} userId - Unique user identifier
   */
  identify(userId) {
    if (!this.isEnabled) return;

    console.log('[Analytics] User identified:', userId);

    // TODO: Integrate with actual analytics service
    // Examples:
    // - Google Analytics: gtag('config', 'GA_MEASUREMENT_ID', { user_id: userId })
    // - Mixpanel: mixpanel.identify(userId)
  }
}

// Export singleton instance
const analytics = new AnalyticsService();
export default analytics;
