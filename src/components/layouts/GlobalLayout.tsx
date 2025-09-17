'use client';

import { useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import Sidebar from '@/components/navigation/Sidebar';
import Footer from '@/components/footer/Footer';
import ChipsBanner from '@/components/common/ChipsBanner';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout = ({ children }: GlobalLayoutProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Chips Banner - at the very top */}
      <ChipsBanner />

      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

      {/* Header */}
      <NavBar />
      {/* Main Content */}
      <main className="pt-17 pl-16 flex-grow">{children}</main>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GlobalLayout;
