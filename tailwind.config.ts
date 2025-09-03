import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'accent-blue': 'var(--color-accent-blue)',
        'accent-cyan': 'var(--color-accent-cyan)',
        'accent-cyan-dark': 'var(--color-accent-cyan-dark)',
        'accent-yellow': 'var(--color-accent-yellow)',
        'gray-333': 'var(--color-gray-333)',
        'gray-666': 'var(--color-gray-666)',
        'gray-222': 'var(--color-gray-222)',
        'gray-1a': 'var(--color-gray-1a)',
        'gray-2a': 'var(--color-gray-2a)',
        'white-1a': 'var(--color-white-1a)',
      },
    },
  },
  plugins: [],
};

export default config;
