'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { initializeAuthState } from '@/redux/slices/authSlice';

/**
 * Component that initializes authentication state from localStorage on app load
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuthState());
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}

export default AuthInitializer;
