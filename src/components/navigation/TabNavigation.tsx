'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Tab {
  label: string;
  href: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  defaultActiveTab?: string;
}

const TabNavigation = ({
  tabs,
  defaultActiveTab = 'Girls',
}: TabNavigationProps) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <div className="relative w-full">
      {/* Tabs Container */}
      <div className="flex justify-center items-center">
        {tabs.map((tab) => (
          <div key={tab.label} className="relative">
            <Link
              href={tab.href}
              onClick={() => setActiveTab(tab.label)}
              className={`relative px-12 py-4 text-[28px] transition-colors duration-200 block ${
                activeTab === tab.label
                  ? 'text-text-primary'
                  : 'text-gray-666 hover:text-text-secondary'
              }`}
            >
              {tab.label}
            </Link>
            {/* Active Tab Indicator - Blue Line */}
            {activeTab === tab.label && (
              <>
                {/* Main Blue Line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-500" />
                {/* Extended Line - Left */}
                <div className="absolute bottom-0 right-full w-[200px] h-[1px] bg-primary-500 opacity-20" />
                {/* Extended Line - Right */}
                <div className="absolute bottom-0 left-full w-[200px] h-[1px] bg-primary-500 opacity-20" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Border - Full Width */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-222" />
    </div>
  );
};

export default TabNavigation;
