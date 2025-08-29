export const colors = {
  primary: {
    50: '#E6F7FF',
    100: '#BAE7FF',
    200: '#91D5FF',
    300: '#69C0FF',
    400: '#40A9FF',
    500: '#3BB9FF', // Main primary color
    600: '#2AA8EE', // Secondary shade
    700: '#1890FF',
    800: '#0C53B7',
    900: '#094293',
    gradient: {
      from: '#3BB9FF',
      to: '#2AA8EE',
    },
  },
  secondary: {
    50: '#F5F5F5',
    100: '#E9E9E9',
    200: '#D9D9D9',
    300: '#BFBFBF',
    400: '#A6A6A6',
    500: '#8C8C8C',
    600: '#737373',
    700: '#595959',
    800: '#404040',
    900: '#262626',
  },
  background: {
    primary: '#111111', // Main background
    secondary: '#1A1A1A', // Lighter background
    elevated: '#222222', // Cards, modals, etc.
    hover: '#FFFFFF1A', // Hover state background
    card: '#121212', // Card background
    cardShadow: '#222222', // Card shadow/border effect
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A6A6A6',
    disabled: '#737373',
    muted: '#666666', // Muted text color
    inactive: '#666666', // Inactive tab color
  },
  border: {
    divider: '#222222', // Tab bottom border
  },
  status: {
    success: '#52C41A',
    warning: '#FAAD14',
    error: '#FF4D4F',
    info: '#1890FF',
  },
  accent: {
    yellow: {
      primary: '#FFD700',
      hover: '#FFC700',
    },
  },
} as const;

export const fontFamily = {
  sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-geist-mono)', 'monospace'],
} as const;

export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem', { lineHeight: '1' }],
} as const;

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

export const theme = {
  colors,
  fontFamily,
  fontSize,
  spacing,
  borderRadius,
} as const;
