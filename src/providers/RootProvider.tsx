'use client';

import { ReactNode } from 'react';
import ReduxProvider from './ReduxProvider';
import SnackbarProvider from './SnackbarProvider';
import AuthInitializer from './AuthInitializer';

interface RootProviderProps {
  children: ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ReduxProvider>
      <SnackbarProvider>
        <AuthInitializer />
        {children}
      </SnackbarProvider>
    </ReduxProvider>
  );
}

export default RootProvider;
