// Game constants and enums

export const SUITS = {
  HEARTS: 'hearts',
  DIAMONDS: 'diamonds',
  CLUBS: 'clubs',
  SPADES: 'spades',
};

export const SUIT_SYMBOLS = {
  [SUITS.HEARTS]: '♥',
  [SUITS.DIAMONDS]: '♦',
  [SUITS.CLUBS]: '♣',
  [SUITS.SPADES]: '♠',
};

export const SUIT_COLORS = {
  [SUITS.HEARTS]: '#dc2626',
  [SUITS.DIAMONDS]: '#dc2626',
  [SUITS.CLUBS]: '#000000',
  [SUITS.SPADES]: '#000000',
};

export const RANKS = {
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  SEVEN: '7',
  EIGHT: '8',
  NINE: '9',
  TEN: '10',
  JACK: 'J',
  QUEEN: 'Q',
  KING: 'K',
  ACE: 'A',
};

export const RANK_VALUES = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14,
};

export const GAME_MODES = {
  SUIT_FOLLOWS: 'suit_follows',
  HIGHEST_CARD: 'highest_card',
  SPADES_TRUMP: 'spades_trump',
};

export const GAME_MODE_NAMES = {
  [GAME_MODES.SUIT_FOLLOWS]: 'Suit Follows',
  [GAME_MODES.HIGHEST_CARD]: 'Highest Card Wins',
  [GAME_MODES.SPADES_TRUMP]: 'Spades Trump',
};

export const GAME_MODE_DESCRIPTIONS = {
  [GAME_MODES.SUIT_FOLLOWS]: 'Follow the suit of the first card played. Highest card in that suit wins.',
  [GAME_MODES.HIGHEST_CARD]: 'Suits don\'t matter. Highest card value wins the trick.',
  [GAME_MODES.SPADES_TRUMP]: 'Spades are trump. They beat all other suits.',
};

export const GAME_PHASES = {
  LOBBY: 'lobby',
  DEALING: 'dealing',
  PLAYING: 'playing',
  TRICK_COMPLETE: 'trick_complete',
  GAME_OVER: 'game_over',
};

export const PLAYER_POSITIONS = {
  HUMAN: 'bottom',
  AI_TOP: 'top',
  AI_LEFT: 'left',
  AI_RIGHT: 'right',
};

export const AI_PLAYERS = [
  { id: 'ai_top', name: 'Alex', position: PLAYER_POSITIONS.AI_TOP },
  { id: 'ai_left', name: 'Sam', position: PLAYER_POSITIONS.AI_LEFT },
  { id: 'ai_right', name: 'Jordan', position: PLAYER_POSITIONS.AI_RIGHT },
];

export const TIMING = {
  AI_THINK_TIME: 1500, // AI pauses before playing
  TRICK_DISPLAY_TIME: 2000, // How long to show completed trick
  CARD_DEAL_DELAY: 100, // Delay between dealing each card
  TURN_TIME_LIMIT: 30000, // 30 seconds per turn
  ANIMATION_DURATION: 300, // Standard animation duration
};

export const CARDS_PER_HAND = 7;
export const NUMBER_OF_PLAYERS = 4;

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
};

export const CARD_PATTERNS = {
  SOLID: 'solid',
  CHECKERBOARD: 'checkerboard',
  DIAGONAL: 'diagonal',
  POLKA: 'polka',
};

export const CARD_PATTERN_NAMES = {
  [CARD_PATTERNS.SOLID]: 'Solid',
  [CARD_PATTERNS.CHECKERBOARD]: 'Checkerboard',
  [CARD_PATTERNS.DIAGONAL]: 'Diagonal Stripes',
  [CARD_PATTERNS.POLKA]: 'Polka Dots',
};

export const DEFAULT_SETTINGS = {
  theme: THEMES.DARK,
  cardBackColor: '#1e40af',
  cardBackPattern: CARD_PATTERNS.SOLID,
  soundEnabled: true,
  animationsEnabled: true,
};

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'cardgame_settings',
  PLAYER_NAME: 'cardgame_player_name',
  STATS: 'cardgame_stats',
  TUTORIAL_COMPLETED: 'cardgame_tutorial_completed',
};

export const ARIA_LABELS = {
  CARD: (rank, suit) => `${rank} of ${suit}`,
  PLAYER_TURN: (playerName) => `${playerName}'s turn`,
  TRICK_WINNER: (playerName, points) => `${playerName} wins the trick and now has ${points} points`,
  GAME_WINNER: (playerName) => `${playerName} wins the game!`,
  SCORE: (playerName, score) => `${playerName}: ${score} points`,
};

export const ANALYTICS_EVENTS = {
  GAME_STARTED: 'game_started',
  GAME_COMPLETED: 'game_completed',
  GAME_MODE_SELECTED: 'game_mode_selected',
  THEME_CHANGED: 'theme_changed',
  CARD_CUSTOMIZED: 'card_customized',
  TUTORIAL_VIEWED: 'tutorial_viewed',
  ERROR_OCCURRED: 'error_occurred',
};

export const ERROR_MESSAGES = {
  INVALID_CARD: 'Invalid card selection',
  NOT_YOUR_TURN: 'It\'s not your turn',
  MUST_FOLLOW_SUIT: 'You must follow suit if you can',
  GAME_ERROR: 'An error occurred. Please restart the game.',
};

export const SUCCESS_MESSAGES = {
  CARD_PLAYED: 'Card played!',
  TRICK_WON: 'You won the trick!',
  GAME_WON: 'Congratulations! You won!',
  SETTINGS_SAVED: 'Settings saved',
};

export const MIN_TOUCH_TARGET = 44; // Minimum touch target size in pixels
