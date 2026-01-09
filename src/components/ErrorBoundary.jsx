// ErrorBoundary component for graceful error handling

import React from 'react';
import errorTracking from '../services/errorTracking';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Track error
    errorTracking.captureException(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-900 via-red-800 to-red-900">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-4xl font-bold text-red-600 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                We're sorry, but something unexpected happened. Don't worry, your progress wasn't saved anyway!
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <summary className="font-semibold text-red-700 cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-sm text-red-800 font-mono overflow-auto">
                  <p className="font-bold mb-2">{this.state.error.toString()}</p>
                  <pre className="whitespace-pre-wrap text-xs">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full py-4 rounded-lg text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl hover:from-red-400 hover:to-red-500 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Reload Game
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-4 rounded-lg text-xl font-bold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Go to Home
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              If this problem persists, please try refreshing your browser or clearing your cache.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
