'use client';

import { ReactNode } from 'react';
import ReduxProvider from './ReduxProvider';
import SnackbarProvider from './SnackbarProvider';
import AuthInitializer from './AuthInitializer';
import NextAuthProvider from './NextAuthProvider';

interface RootProviderProps {
  children: ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <NextAuthProvider>
      <ReduxProvider>
        <SnackbarProvider>
          <AuthInitializer />
          {children}
        </SnackbarProvider>
      </ReduxProvider>
    </NextAuthProvider>
  );
}

export default RootProvider;
