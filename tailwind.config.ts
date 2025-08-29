import type { Config } from 'tailwindcss';
import { theme as customTheme } from './src/theme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: customTheme.colors.primary,
        secondary: customTheme.colors.secondary,
        background: {
          primary: customTheme.colors.background.primary,
          secondary: customTheme.colors.background.secondary,
          elevated: customTheme.colors.background.elevated,
          hover: customTheme.colors.background.hover,
          card: customTheme.colors.background.card,
          cardShadow: customTheme.colors.background.cardShadow,
        },
        text: {
          primary: customTheme.colors.text.primary,
          secondary: customTheme.colors.text.secondary,
          disabled: customTheme.colors.text.disabled,
          muted: customTheme.colors.text.muted,
          inactive: customTheme.colors.text.inactive,
        },
        border: {
          divider: customTheme.colors.border.divider,
        },
        status: customTheme.colors.status,
        accent: customTheme.colors.accent,
      },
      fontFamily: customTheme.fontFamily,
      fontSize: customTheme.fontSize,
      spacing: customTheme.spacing,
      borderRadius: customTheme.borderRadius,
    },
  },
  plugins: [],
};

export default config;
