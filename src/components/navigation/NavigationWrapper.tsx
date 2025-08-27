'use client';

import { useState } from 'react';
import NavBar from './NavBar';
import Sidebar from './Sidebar';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const NavigationWrapper = ({ children }: NavigationWrapperProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <>
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />
      <NavBar />
      <main className="pt-16 pl-16">{children}</main>
    </>
  );
};

export default NavigationWrapper;
