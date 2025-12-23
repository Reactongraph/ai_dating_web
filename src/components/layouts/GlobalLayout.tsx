'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMobileView } from '@/hooks/useMobileView';
import NavBar from '@/components/navigation/NavBar';
import Sidebar from '@/components/navigation/Sidebar';
import Footer from '@/components/footer/Footer';
import MobileTopBanner from '@/components/common/MobileTopBanner';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const isMobileView = useMobileView();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Routes where bottom navigation is visible on mobile
  const bottomNavRoutes = ['/', '/girls', '/guys', '/collection', '/my-ai', '/explore', '/chat'];
  const isBottomNavPage = bottomNavRoutes.some(route =>
    route === '/' ? pathname === '/' : pathname.startsWith(route),
  );

  const toggleSidebar = () => {
    if (isMobileView) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsSidebarExpanded(prev => !prev);
    }
  };

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
  }, [pathname]);

  return (
    <div className="h-screen flex flex-col">
      {/* Promotional Top Banner */}
      <MobileTopBanner />

      {/* Sidebar - Only on desktop */}
      {!isMobileView && (
        <Sidebar
          isExpanded={isSidebarExpanded}
          onToggle={toggleSidebar}
          isMobileView={isMobileView}
          isMobileOpen={isMobileSidebarOpen}
        />
      )}

      {/* Header */}
      <NavBar onToggleSidebar={toggleSidebar} isMobileOpen={isMobileSidebarOpen} />
      {/* Main Content */}
      <main
        className={`${
          isBannerVisible ? 'pt-[108px] md:pt-[116px]' : 'pt-17'
        } ${!isMobileView ? 'pl-16' : ''} ${isMobileView && isBottomNavPage ? 'pb-24' : ''} flex-grow`}
      >
        {children}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GlobalLayout;
