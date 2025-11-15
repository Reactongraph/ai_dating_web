import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next.js recommended rules
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier rules to avoid conflicts
  prettier,

  // Your custom rules
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Ignored files
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];
