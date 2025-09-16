'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import Snackbar, { SnackbarType } from '@/components/common/Snackbar';

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    duration?: number
  ) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [snackbarState, setSnackbarState] = useState({
    message: '',
    type: 'info' as SnackbarType,
    isVisible: false,
    duration: 5000,
  });

  const showSnackbar = useCallback(
    (message: string, type: SnackbarType = 'info', duration = 5000) => {
      setSnackbarState({
        message,
        type,
        isVisible: true,
        duration,
      });
    },
    []
  );

  const hideSnackbar = useCallback(() => {
    setSnackbarState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        message={snackbarState.message}
        type={snackbarState.type}
        isVisible={snackbarState.isVisible}
        duration={snackbarState.duration}
        onClose={hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
}

export default SnackbarProvider;
