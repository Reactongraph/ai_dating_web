'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/navigation/NavBar';
import Sidebar from '@/components/navigation/Sidebar';
import Footer from '@/components/footer/Footer';
import ChipsBanner from '@/components/common/ChipsBanner';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
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
    <div className="h-screen flex flex-col">
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
      {/* Main Content */}
      <main className="pt-17 md:pl-16 flex-grow">{children}</main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GlobalLayout;
