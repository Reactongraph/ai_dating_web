import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the current viewport is mobile (width < 768px).
 * @returns boolean true if mobile view, false otherwise.
 */
export const useMobileView = (breakpoint: number = 768): boolean => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobileView);
  }, [breakpoint]);

  return isMobileView;
};

export default useMobileView;
