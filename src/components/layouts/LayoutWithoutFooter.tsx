'use client';

import { useState, useEffect } from 'react';
import { useMobileView } from '@/hooks/useMobileView';
import NavBar from '@/components/navigation/NavBar';
import Sidebar from '@/components/navigation/Sidebar';
import MobileTopBanner from '@/components/common/MobileTopBanner';

interface LayoutWithoutFooterProps {
  children: React.ReactNode;
}

const LayoutWithoutFooter = ({ children }: LayoutWithoutFooterProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const isMobileView = useMobileView();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  // Sync banner visibility to adjust main content padding
  useEffect(() => {
    const checkBannerVisibility = () => {
      const mobileTopBanner = document.querySelector('[data-banner="mobile-top"]');
      setIsBannerVisible(!!mobileTopBanner);
    };

    checkBannerVisibility();

    const observer = new MutationObserver(checkBannerVisibility);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const toggleSidebar = () => {
    if (isMobileView) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsSidebarExpanded(prev => !prev);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Promotional Top Banner */}
      <MobileTopBanner />

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
      <main
        className={`${isBannerVisible ? 'pt-[112px] md:pt-[120px]' : 'pt-18 md:pt-20'} md:pl-16 flex-grow overflow-x-hidden`}
      >
        {children}
      </main>
    </div>
  );
};

export default LayoutWithoutFooter;
