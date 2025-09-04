'use client';

import { useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import Sidebar from '@/components/navigation/Sidebar';

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
      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

      {/* Header */}
      <NavBar />

      {/* Main Content Area - No Footer */}
      <main className="pt-16 pl-16 flex-grow">{children}</main>
    </div>
  );
};

export default LayoutWithoutFooter;
