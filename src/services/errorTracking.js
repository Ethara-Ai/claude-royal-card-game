// Error tracking service for capturing and reporting errors
// Ready for integration with Sentry or similar error tracking services

class ErrorTrackingService {
  constructor() {
    this.isEnabled = false;
    this.initialized = false;
    this.breadcrumbs = [];
    this.maxBreadcrumbs = 50;
    this.context = {};
  }

  /**
   * Initialize the error tracking service
   * @param {Object} config - Configuration options
   */
  init(config = {}) {
    this.isEnabled = config.enabled !== false;
    this.initialized = true;

    if (this.isEnabled) {
      this.setupGlobalHandlers();
      console.log('[Error Tracking] Service initialized');
    }

    // TODO: Initialize Sentry when ready
    // Example:
    // if (config.sentryDsn) {
    //   Sentry.init({
    //     dsn: config.sentryDsn,
    //     environment: config.environment || 'production',
    //     release: config.release,
    //     beforeSend: (event) => this.beforeSend(event),
    //   });
    // }
  }

  /**
   * Setup global error handlers
   */
  setupGlobalHandlers() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.captureException(event.error, {
        type: 'uncaught_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason, {
        type: 'unhandled_rejection',
        promise: event.promise,
      });
    });
  }

  /**
   * Capture an exception
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  captureException(error, context = {}) {
    if (!this.isEnabled) return;

    const errorData = {
      message: error?.message || String(error),
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      breadcrumbs: [...this.breadcrumbs],
      context: {
        ...this.context,
        ...context,
      },
    };

    console.error('[Error Tracking] Exception captured:', errorData);

    // TODO: Send to Sentry when ready
    // if (window.Sentry) {
    //   Sentry.captureException(error, {
    //     extra: errorData.context,
    //     tags: context.tags,
    //   });
    // }
  }

  /**
   * Capture a message
   * @param {string} message - Message to capture
   * @param {string} level - Severity level (info, warning, error)
   * @param {Object} context - Additional context
   */
  captureMessage(message, level = 'info', context = {}) {
    if (!this.isEnabled) return;

    const messageData = {
      message,
      level,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      breadcrumbs: [...this.breadcrumbs],
      context: {
        ...this.context,
        ...context,
      },
    };

    console.log(`[Error Tracking] Message captured (${level}):`, messageData);

    // TODO: Send to Sentry when ready
    // if (window.Sentry) {
    //   Sentry.captureMessage(message, {
    //     level: level,
    //     extra: messageData.context,
    //   });
    // }
  }

  /**
   * Add a breadcrumb
   * @param {Object} breadcrumb - Breadcrumb data
   */
  addBreadcrumb(breadcrumb) {
    const enrichedBreadcrumb = {
      ...breadcrumb,
      timestamp: new Date().toISOString(),
    };

    this.breadcrumbs.push(enrichedBreadcrumb);

    // Keep only the most recent breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }

    console.log('[Error Tracking] Breadcrumb added:', enrichedBreadcrumb);

    // TODO: Send to Sentry when ready
    // if (window.Sentry) {
    //   Sentry.addBreadcrumb(enrichedBreadcrumb);
    // }
  }

  /**
   * Set context data
   * @param {string} key - Context key
   * @param {*} value - Context value
   */
  setContext(key, value) {
    this.context[key] = value;

    // TODO: Send to Sentry when ready
    // if (window.Sentry) {
    //   Sentry.setContext(key, value);
    // }
  }

  /**
   * Set user context
   * @param {Object} user - User data
   */
  setUser(user) {
    this.setContext('user', user);

    // TODO: Send to Sentry when ready
    // if (window.Sentry) {
    //   Sentry.setUser(user);
    // }
  }

  /**
   * Set game state context
   * @param {Object} gameState - Current game state
   */
  setGameState(gameState) {
    this.setContext('game_state', {
      phase: gameState.phase,
      currentPlayer: gameState.currentPlayer,
      trickNumber: gameState.trickNumber,
      gameMode: gameState.gameMode,
      scores: gameState.scores,
    });
  }

  /**
   * Track user action as breadcrumb
   * @param {string} action - Action name
   * @param {Object} data - Action data
   */
  trackAction(action, data = {}) {
    this.addBreadcrumb({
      category: 'user_action',
      message: action,
      data: data,
      level: 'info',
    });
  }

  /**
   * Track navigation as breadcrumb
   * @param {string} from - Previous location
   * @param {string} to - New location
   */
  trackNavigation(from, to) {
    this.addBreadcrumb({
      category: 'navigation',
      message: `Navigated from ${from} to ${to}`,
      data: { from, to },
      level: 'info',
    });
  }

  /**
   * Track game event as breadcrumb
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  trackGameEvent(event, data = {}) {
    this.addBreadcrumb({
      category: 'game_event',
      message: event,
      data: data,
      level: 'info',
    });
  }

  /**
   * Clear breadcrumbs
   */
  clearBreadcrumbs() {
    this.breadcrumbs = [];
  }

  /**
   * Clear context
   */
  clearContext() {
    this.context = {};
  }

  /**
   * Before send hook for filtering/modifying events
   * @param {Object} event - Event to be sent
   * @returns {Object|null} Modified event or null to drop
   */
  beforeSend(event) {
    // Filter out events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    // Add custom data
    event.extra = {
      ...event.extra,
      breadcrumbs: this.breadcrumbs,
      context: this.context,
    };

    return event;
  }

  /**
   * Wrap a function to capture errors
   * @param {Function} fn - Function to wrap
   * @param {Object} context - Context for error reporting
   * @returns {Function} Wrapped function
   */
  wrapFunction(fn, context = {}) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.captureException(error, {
          ...context,
          function_name: fn.name,
          arguments: args,
        });
        throw error;
      }
    };
  }

  /**
   * Wrap an async function to capture errors
   * @param {Function} fn - Async function to wrap
   * @param {Object} context - Context for error reporting
   * @returns {Function} Wrapped async function
   */
  wrapAsyncFunction(fn, context = {}) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.captureException(error, {
          ...context,
          function_name: fn.name,
          arguments: args,
        });
        throw error;
      }
    };
  }

  /**
   * Create a safe execution wrapper
   * @param {Function} fn - Function to execute safely
   * @param {*} fallback - Fallback value if error occurs
   * @param {Object} context - Context for error reporting
   * @returns {*} Result or fallback
   */
  safe(fn, fallback = null, context = {}) {
    try {
      return fn();
    } catch (error) {
      this.captureException(error, context);
      return fallback;
    }
  }

  /**
   * Enable error tracking
   */
  enable() {
    this.isEnabled = true;
    console.log('[Error Tracking] Service enabled');
  }

  /**
   * Disable error tracking
   */
  disable() {
    this.isEnabled = false;
    console.log('[Error Tracking] Service disabled');
  }
}

// Export singleton instance
const errorTracking = new ErrorTrackingService();
export default errorTracking;
