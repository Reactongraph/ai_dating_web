'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useCustomSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useCustomSnackbar must be used within a CustomSnackbarProvider');
  }
  return context;
};

interface CustomSnackbarProviderProps {
  children: ReactNode;
}

function SnackbarWrapper({ children }: { children: ReactNode }) {
  const showSnackbar = useCallback(
    (message: string, type: SnackbarType = 'info', duration = 5000) => {
      const options = {
        position: 'top-right' as const,
        autoClose: duration,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      };

      switch (type) {
        case 'success':
          toast.success(message, options);
          break;
        case 'error':
          toast.error(message, options);
          break;
        case 'warning':
          toast.warning(message, options);
          break;
        case 'info':
        default:
          toast.info(message, options);
          break;
      }
    },
    [],
  );

  const hideSnackbar = useCallback(() => {
    toast.dismiss();
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function CustomSnackbarProvider({ children }: CustomSnackbarProviderProps) {
  return (
    <>
      <SnackbarWrapper>{children}</SnackbarWrapper>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ marginTop: '70px' }}
      />
    </>
  );
}

export default CustomSnackbarProvider;
