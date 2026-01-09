# Architecture Documentation

## Overview

Card Trick Game is a modern, production-ready single-page application built with React. This document describes the architecture, design decisions, and technical implementation.

## Technology Stack

### Core
- **React 19** - Latest React with hooks and concurrent features
- **Vite 7** - Fast build tool with HMR and optimized production builds
- **Tailwind CSS v4** - Utility-first CSS framework with CSS-based configuration

### Libraries
- **react-icons** - Icon components (FiSun, FiMoon, etc.)
- **react-colorful** - Color picker for card customization
- **react-confetti** - Celebration effects (lazy loaded)
- **sonner** - Toast notifications

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Terser** - JavaScript minification

## Project Structure

```
card-game/
├── src/
│   ├── components/          # React components
│   │   ├── Card.jsx         # Individual card with animations
│   │   ├── GameTable.jsx    # Main game area with poker table
│   │   ├── PlayerHand.jsx   # Player's hand with fan layout
│   │   ├── PlayedCardsArea.jsx  # Center area showing played cards
│   │   ├── Scoreboard.jsx   # Score display
│   │   ├── TurnIndicator.jsx    # Shows current player
│   │   ├── Lobby.jsx        # Game setup screen
│   │   ├── GameOver.jsx     # End game screen with results
│   │   ├── Header.jsx       # App header with theme toggle
│   │   ├── SettingsModal.jsx    # Card customization
│   │   ├── TutorialModal.jsx    # Game instructions
│   │   └── ErrorBoundary.jsx    # Error handling
│   │
│   ├── contexts/            # React Context providers
│   │   ├── ThemeContext.jsx     # Dark/light theme management
│   │   └── SettingsContext.jsx  # Card customization settings
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useGameState.js      # Main game state management
│   │
│   ├── utils/               # Utility functions
│   │   ├── cardUtils.js         # Card and deck operations
│   │   └── gameLogic.js         # Game rules and winner determination
│   │
│   ├── services/            # External service integrations
│   │   ├── analytics.js         # Analytics tracking (console for now)
│   │   └── errorTracking.js     # Error reporting (console for now)
│   │
│   ├── constants/           # Constants and configuration
│   │   └── gameConstants.js     # Game modes, suits, timings, etc.
│   │
│   ├── __tests__/           # Test files
│   │   ├── components/
│   │   ├── utils/
│   │   └── services/
│   │
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and Tailwind config
│
├── infrastructure/          # AWS deployment configuration
│   └── cloudformation.yml   # Complete AWS stack template
│
├── .github/                 # GitHub configuration
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline
│
├── public/                  # Static assets
├── dist/                    # Build output (generated)
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## State Management

### Game State Hook (`useGameState`)

The core game logic is centralized in a custom hook that manages:

- **Game Phase**: LOBBY → DEALING → PLAYING → TRICK_COMPLETE → GAME_OVER
- **Player Hands**: Cards for each player (human + 3 AI)
- **Scores**: Points tracker for all players
- **Current Player**: Whose turn it is
- **Played Cards**: Cards played in current trick
- **Selected Card**: Human player's card selection
- **Turn Timer**: 30-second countdown per turn
- **Tutorial State**: First-time user guidance

**Key Features:**
- Automatic AI turns with realistic delays (1.5s think time)
- Turn timer with auto-play fallback
- Proper cleanup of all timers on unmount
- Winner determination based on game mode
- Error tracking integration

### Context Providers

**ThemeContext:**
- Dark/light theme toggle
- System preference detection
- localStorage persistence
- Reduced motion detection
- High contrast mode support

**SettingsContext:**
- Card back color customization
- Card back pattern selection (4 patterns)
- Settings persistence
- Analytics integration

## Game Logic

### Card Utilities (`cardUtils.js`)

- **Deck Creation**: Standard 52-card deck generation
- **Card Shuffling**: Fisher-Yates algorithm
- **Card Dealing**: Distribute cards evenly to players
- **Card Validation**: Check if card can be played based on rules
- **Card Layout**: Calculate rotation and offset for fan display
- **AI Card Selection**: Random valid card picker (can be enhanced)

### Game Logic (`gameLogic.js`)

**Three Game Modes:**

1. **Suit Follows**: Follow the lead suit if possible, highest card in lead suit wins
2. **Highest Card Wins**: Suits don't matter, highest rank wins
3. **Spades Trump**: Spades beat everything, otherwise follow suit rules

**Key Functions:**
- `determineTrickWinner()`: Determines winner based on game mode
- `validateCardPlay()`: Ensures rules are followed
- `isGameOver()`: Checks if 7 tricks completed
- `determineGameWinner()`: Finds player with most points

## Component Architecture

### Component Hierarchy

```
App
├── Header
│   ├── SettingsModal
│   └── TutorialModal
├── Lobby (phase: LOBBY)
├── GameTable (phase: PLAYING/TRICK_COMPLETE)
│   ├── Scoreboard
│   ├── TurnIndicator (x4)
│   ├── PlayedCardsArea
│   │   └── Card (x4)
│   └── PlayerHand
│       └── Card (x7)
└── GameOver (phase: GAME_OVER)
    └── Confetti (lazy loaded)
```

### Key Components

**Card Component:**
- Face up/down rendering
- Custom back patterns (solid, checkerboard, diagonal, polka)
- Hover and selection states
- Accessibility labels
- Animations (deal, play, win)

**GameTable Component:**
- Casino aesthetic with green felt
- Oval poker table layout
- Positioned players (top, left, right, bottom)
- Responsive design
- Turn timer display

**PlayerHand Component:**
- Fan layout with card rotation
- Interactive card selection
- Visual feedback for current player
- Keyboard navigation support

## Styling Architecture

### Tailwind CSS v4

Uses CSS-based configuration with `@theme` directive:

```css
@theme {
  --color-casino-dark-*: /* Dark theme colors */
  --color-casino-green-*: /* Poker table green */
  --color-casino-gold-*: /* Accent colors */
}
```

### Custom Animations

- `cardDeal`: Cards fly in from top
- `cardPlay`: Card plays with scale effect
- `cardWin`: Winning card glows gold
- `lift`: Selected card lifts up
- `pulseGold`: Continuous gold glow

### Responsive Design

**Mobile-First Approach:**
- Base styles for phones (320px+)
- Tablet breakpoint: `md:` (768px+)
- Desktop breakpoint: `lg:` (1024px+)
- Landscape mode: Custom media query

**Touch Targets:**
- Minimum 44px for all interactive elements
- Safe area insets for notched devices
- Optimized tap handling

## Accessibility Features

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- Tab through all interactive elements
- Enter/Space to activate
- Clear focus indicators (gold ring)

**Screen Reader Support:**
- Semantic HTML (`button`, `nav`, `main`, etc.)
- ARIA labels for all cards and game states
- Live regions for turn announcements
- Descriptive button labels

**Visual Accessibility:**
- High contrast mode support
- Color-blind friendly (not color-dependent)
- Reduced motion support
- Large, readable text
- Clear visual hierarchy

**Additional Features:**
- Skip to content links
- Landmark regions
- Focus management for modals
- Descriptive error messages

## Performance Optimization

### Build Optimization

**Code Splitting:**
```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'ui-vendor': ['react-icons', 'react-colorful', 'sonner'],
  'confetti': ['react-confetti'],  // Lazy loaded
}
```

**Bundle Targets:**
- React vendor: ~12KB gzipped
- UI vendor: ~13KB gzipped
- Main bundle: ~70KB gzipped
- **Total: ~95KB gzipped** ✅

**Optimizations:**
- Tree shaking
- Minification with Terser
- Asset optimization
- Long-term caching (1 year for fingerprinted assets)
- No cache for HTML files

### Runtime Performance

**React Optimization:**
- `useCallback` for stable function references
- Proper dependency arrays
- Minimal re-renders
- Lazy loading for confetti

**Animation Performance:**
- CSS animations (GPU accelerated)
- `will-change` for transformations
- 60fps target
- Reduced motion fallback

## Services Architecture

### Analytics Service

**Current Implementation:**
- Console logging for development
- Event tracking structure
- GDPR compliant (Do Not Track support)
- Consent management

**Ready for:**
- Google Analytics 4
- Mixpanel
- Segment
- Any event-based analytics

**Tracked Events:**
- Game started/completed
- Game mode selection
- Theme changes
- Card customization
- Tutorial views
- Errors

### Error Tracking Service

**Current Implementation:**
- Console logging
- Breadcrumb tracking
- Context capture
- Game state snapshots

**Ready for:**
- Sentry integration
- Custom error reporting
- Production error monitoring

**Features:**
- Global error handlers
- Unhandled promise rejection handling
- Component error boundaries
- User action tracking
- Game state context

## Deployment Architecture

### AWS Infrastructure (CloudFormation)

**S3 Bucket:**
- Static website hosting
- Server-side encryption (AES256)
- Versioning enabled (30-day retention)
- Public access blocked (CloudFront only)

**CloudFront Distribution:**
- Global CDN with edge caching
- HTTPS redirect
- Origin Access Identity for S3
- Custom error responses for SPA routing
- Gzip/Brotli compression

**Cache Strategy:**
```
*.html files:      no-cache (immediate updates)
/assets/* files:   1 year cache (immutable)
Other files:       1 day cache
```

**Security Headers:**
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options: DENY
- X-XSS-Protection
- Referrer-Policy

**IAM Configuration:**
- GitHub Actions OIDC (no stored credentials)
- Least privilege access
- Separate roles per environment

### CI/CD Pipeline (GitHub Actions)

**Workflow Stages:**

1. **Test & Build:**
   - Install dependencies
   - Run tests
   - Build production bundle
   - Check bundle size

2. **Deploy:**
   - Configure AWS credentials (OIDC)
   - Sync files to S3
   - Set appropriate cache headers
   - Invalidate CloudFront cache

3. **Validate:**
   - Run Lighthouse CI
   - Performance metrics
   - Accessibility audit

**Environments:**
- `main` branch → Production
- `staging` branch → Staging
- Pull requests → Test only

## Error Handling Strategy

### Error Boundary

Top-level error boundary catches:
- Component render errors
- Lifecycle method errors
- Constructor errors

**User Experience:**
- Friendly error message
- Reload button
- Developer details (dev mode only)

### Graceful Degradation

- Missing localStorage → In-memory state
- Failed analytics → Silent failure
- Animation errors → Static fallback

## Testing Strategy

### Unit Tests

**Target Coverage:**
- Game logic functions (100%)
- Card utilities (100%)
- Helper functions (100%)

**Test Files:**
```
__tests__/
├── utils/
│   ├── gameLogic.test.js
│   └── cardUtils.test.js
├── components/
│   ├── Card.test.jsx
│   └── PlayerHand.test.jsx
└── services/
    ├── analytics.test.js
    └── errorTracking.test.js
```

### Integration Tests

- Component interactions
- State management
- Context providers
- User flows

### Accessibility Tests

- Keyboard navigation
- Screen reader compatibility
- ARIA attributes
- Focus management

## Security Considerations

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
```

### HTTPS Enforcement

- CloudFront forces HTTPS
- HSTS header with preload
- Secure cookies (when implemented)

### Input Validation

- All user inputs sanitized
- No eval() or innerHTML
- Safe external integrations

## Browser Support

### Target Browsers

- Chrome 90+ (92% coverage)
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari iOS 14+
- Chrome Android 90+

### Progressive Enhancement

- Core functionality works everywhere
- Enhanced features for modern browsers
- Graceful degradation for old browsers

## Future Enhancements

### Planned Features

1. **Multiplayer:**
   - WebSocket integration
   - Real-time game sync
   - Lobby system

2. **Advanced AI:**
   - Strategy-based card selection
   - Difficulty levels
   - Learning AI

3. **Social Features:**
   - Leaderboards
   - Achievements
   - Friend challenges
   - Share results

4. **More Game Modes:**
   - Hearts
   - Oh Hell
   - Bridge
   - Custom rules

5. **Analytics Dashboard:**
   - Win/loss statistics
   - Game history
   - Performance trends

6. **Sound Effects:**
   - Card dealing sounds
   - Win celebrations
   - Background music
   - Volume controls

### Technical Debt

- Add comprehensive test coverage
- Implement i18n for multiple languages
- Add service worker for offline play
- Optimize bundle size further
- Add E2E tests with Playwright

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Standards

- ESLint for code quality
- Prettier for formatting (recommended)
- Semantic commit messages
- Component-driven development

### Git Workflow

1. Create feature branch from `main`
2. Implement feature with tests
3. Create pull request
4. CI runs tests automatically
5. Code review
6. Merge to `staging` for QA
7. Merge to `main` for production

## Monitoring & Observability

### Metrics to Track

**Performance:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Bundle size over time

**User Behavior:**
- Games started/completed
- Game mode preferences
- Average game duration
- Win rates per mode

**Errors:**
- Error frequency
- Error types
- Affected users
- Browser/OS breakdown

### Health Checks

- CloudFront availability
- S3 bucket access
- Average response time
- Cache hit ratio

## Conclusion

This architecture provides a solid foundation for a production-ready card game with:

- **Clean code structure** for maintainability
- **Performance optimization** for fast loading
- **Accessibility** for all users
- **Security** best practices
- **Scalability** for future features
- **Developer experience** with modern tooling

The game is ready to deploy, monitor, and iterate on with confidence.