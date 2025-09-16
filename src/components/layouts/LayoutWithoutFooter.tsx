'use client';

import { useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import Sidebar from '@/components/navigation/Sidebar';
import ChipsBanner from '@/components/common/ChipsBanner';

interface LayoutWithoutFooterProps {
  children: React.ReactNode;
}

const LayoutWithoutFooter = ({ children }: LayoutWithoutFooterProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Chips Banner - at the very top */}
      <ChipsBanner />

      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

      {/* Header */}
      <NavBar />

      {/* Main Content Area - No Footer */}
      <main className="pt-24 pl-16 flex-grow">{children}</main>
    </div>
  );
};

export default LayoutWithoutFooter;
