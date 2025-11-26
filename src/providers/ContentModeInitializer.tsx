'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { initializeMode, setLoading } from '@/redux/slices/contentModeSlice';

/**
 * Component that initializes content mode from localStorage
 * Prevents flashing by loading mode before app renders
 */
export function ContentModeInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize mode from localStorage
    dispatch(initializeMode());
    // Mark loading as complete
    dispatch(setLoading(false));
  }, [dispatch]);

  return null;
}

export default ContentModeInitializer;
