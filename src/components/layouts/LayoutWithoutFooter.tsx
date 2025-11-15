'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/navigation/NavBar';
import Sidebar from '@/components/navigation/Sidebar';
import ChipsBanner from '@/components/common/ChipsBanner';

interface LayoutWithoutFooterProps {
  children: React.ReactNode;
}

const LayoutWithoutFooter = ({ children }: LayoutWithoutFooterProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Check if we're on mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  const toggleSidebar = () => {
    if (isMobileView) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsSidebarExpanded(prev => !prev);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Chips Banner - at the very top */}
      <ChipsBanner />

      {/* Sidebar */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        onToggle={toggleSidebar}
        isMobileView={isMobileView}
        isMobileOpen={isMobileSidebarOpen}
      />

      {/* Header */}
      <NavBar onToggleSidebar={toggleSidebar} isMobileOpen={isMobileSidebarOpen} />

      {/* Main Content Area - No Footer */}
      <main className="pt-24 md:pl-16 flex-grow">{children}</main>
    </div>
  );
};

export default LayoutWithoutFooter;
