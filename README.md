# Card Trick Game 🎴

A beautiful, polished trick-taking card game where you play against three AI opponents. Built with React, featuring smooth animations, full accessibility support, and a professional casino aesthetic.

![Card Trick Game](./preview.png)

## ✨ Features

### Game Modes
- **Suit Follows**: Follow the suit of the first card played. Highest card in that suit wins.
- **Highest Card Wins**: Suits don't matter. Highest card value wins the trick.
- **Spades Trump**: Spades beat everything, like in the actual game of Spades.

### User Experience
- 🎨 **Beautiful UI**: Casino-inspired design with smooth animations
- 🌓 **Dark/Light Themes**: Toggle between dark and light modes
- 🎯 **Card Customization**: Choose your card back color and pattern
- 📱 **Fully Responsive**: Works perfectly on phones, tablets, and desktops
- ⌨️ **Keyboard Navigation**: Complete keyboard support for accessibility
- 🔊 **Screen Reader Support**: Full ARIA labels and live regions
- ⏱️ **Turn Timer**: 30-second countdown for each turn
- 🎉 **Celebration Effects**: Confetti when you win!

### Technical Excellence
- ⚡ **Fast Performance**: Optimized bundle under 500KB gzipped
- 🎭 **Smooth Animations**: 60fps animations with reduced motion support
- 🛡️ **Error Handling**: Graceful error boundaries and tracking
- 📊 **Analytics Ready**: Built-in analytics service (console logging for now)
- 🔒 **Security**: CSP headers, HTTPS, and security best practices
- ♿ **Accessible**: WCAG 2.1 AA compliant with keyboard and screen reader support
- 🌐 **PWA Ready**: Manifest and service worker support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd card-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:3000`

## 🎮 How to Play

1. **Setup**: Enter your name and choose a game mode
2. **Deal**: Cards are dealt to all players (7 cards each)
3. **Play**: Click a card to select it, then click again to play it
4. **Win Tricks**: Highest card wins the trick (based on game mode rules)
5. **Score Points**: Winner of each trick gets 1 point
6. **Win the Game**: Player with most points after 7 tricks wins!

### Controls
- **Mouse/Touch**: Click cards to select and play
- **Keyboard**: Tab to navigate, Enter/Space to select/play
- **Timer**: You have 30 seconds per turn

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm test             # Run tests
npm run format       # Format code with Prettier
```

### Project Structure

```
src/
├── components/        # React components
│   ├── Card.jsx
│   ├── GameTable.jsx
│   ├── Lobby.jsx
│   ├── GameOver.jsx
│   ├── Header.jsx
│   └── ...
├── contexts/         # React contexts
│   ├── ThemeContext.jsx
│   └── SettingsContext.jsx
├── hooks/            # Custom hooks
│   └── useGameState.js
├── utils/            # Utility functions
│   ├── cardUtils.js
│   └── gameLogic.js
├── services/         # External services
│   ├── analytics.js
│   └── errorTracking.js
├── constants/        # Constants and enums
│   └── gameConstants.js
└── __tests__/        # Test files
```

### Key Technologies

- **React 19**: Latest React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Icon library
- **React Colorful**: Color picker
- **React Confetti**: Celebration effects
- **Sonner**: Toast notifications

## 📦 Build & Bundle Optimization

The build process includes:
- Code splitting for optimal caching
- Tree shaking to remove unused code
- Minification and compression
- Asset optimization
- Source maps for debugging

**Bundle Targets:**
- Main bundle: < 200KB gzipped
- Total bundle: < 500KB gzipped
- First Contentful Paint: < 1.5s

## 🌐 Deployment

### AWS Infrastructure

The game includes a complete AWS CloudFormation template for production deployment:

**Included Resources:**
- S3 bucket for static hosting (encrypted, versioned)
- CloudFront CDN for global distribution
- Origin Access Identity for security
- Security headers policy
- IAM role for GitHub Actions OIDC
- Custom error pages for SPA routing

### Deploy to AWS

1. **Create the infrastructure:**

```bash
aws cloudformation create-stack \
  --stack-name card-game-production \
  --template-body file://infrastructure/cloudformation.yml \
  --parameters ParameterKey=Environment,ParameterValue=production \
  --capabilities CAPABILITY_NAMED_IAM
```

2. **Get the outputs:**

```bash
aws cloudformation describe-stacks \
  --stack-name card-game-production \
  --query 'Stacks[0].Outputs'
```

3. **Configure GitHub Secrets:**

Add these secrets to your GitHub repository:
- `AWS_ROLE_ARN`: IAM role ARN from stack outputs
- `S3_BUCKET`: S3 bucket name from stack outputs
- `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront distribution ID
- `PRODUCTION_URL`: Your production URL

4. **Deploy:**

Push to `main` branch to trigger automatic deployment via GitHub Actions.

### Manual Deployment

```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## ♿ Accessibility

This game is built with accessibility as a priority:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and live regions
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Reduced Motion**: Respects prefers-reduced-motion
- **High Contrast**: Supports high contrast mode
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Touch Targets**: Minimum 44px touch targets

## 🎨 Customization

### Themes

Toggle between dark and light themes using the sun/moon icon in the header.

### Card Backs

Customize your card backs in the Settings:
- Choose any color with the color picker
- Select from 4 patterns: Solid, Checkerboard, Diagonal Stripes, Polka Dots

## 🔧 Configuration

### Analytics

To enable real analytics, uncomment the integration code in `src/services/analytics.js`:

```javascript
// For Google Analytics
if (window.gtag) {
  window.gtag('event', event.name, event.properties);
}

// For Mixpanel
if (window.mixpanel) {
  window.mixpanel.track(event.name, event.properties);
}
```

### Error Tracking

To enable Sentry error tracking, add your DSN in `src/services/errorTracking.js`:

```javascript
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
  release: 'card-game@1.0.0',
});
```

## 🧪 Testing

Test files should be added in the `src/__tests__/` directory:

```bash
src/__tests__/
├── components/       # Component tests
├── utils/           # Utility function tests
└── services/        # Service tests
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🎯 Future Enhancements

Potential features to add:
- [ ] Multiplayer support with WebSockets
- [ ] More game modes (Hearts, Oh Hell, etc.)
- [ ] Player statistics and history
- [ ] Sound effects
- [ ] Achievements and badges
- [ ] AI difficulty levels
- [ ] Tournament mode
- [ ] Replay system
- [ ] Social sharing

## 🐛 Known Issues

- None at this time! Please report any bugs you find.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ and lots of ♠️♥️♦️♣️

---

## Copyright

Copyright (c) 2026 Green Rider Technology LLP (Ethara AI). All rights reserved.
