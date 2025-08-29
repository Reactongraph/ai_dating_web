'use client';

import { useState } from 'react';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import Footer from '../footer/Footer';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const NavigationWrapper = ({ children }: NavigationWrapperProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />
      <NavBar />
      <main className="pt-16 pl-16 flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default NavigationWrapper;
