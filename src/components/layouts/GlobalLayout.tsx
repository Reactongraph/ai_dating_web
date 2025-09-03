'use client';

import { useState } from 'react';
import NavBar from '@/components/navigation/NavBar';
import Sidebar from '@/components/navigation/Sidebar';
import Footer from '@/components/footer/Footer';

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
      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <main className="pt-16 pl-16 flex-grow">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GlobalLayout;
