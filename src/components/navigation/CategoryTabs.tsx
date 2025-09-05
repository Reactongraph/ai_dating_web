'use client';

import { useState, useEffect, useRef } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface CategoryTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const CategoryTabs = ({ tabs, activeTab, onTabChange }: CategoryTabsProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeTabElement = tabsRef.current[activeTabIndex];

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="relative inline-flex flex-col">
      <div className="flex space-x-16">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            onClick={() => onTabChange(tab.id)}
            className={`relative py-2 text-[28px] transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-gray-666 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Indicator */}
      <div
        className="absolute bottom-0 h-[2px] bg-primary-500 transition-all duration-300"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-222" />
    </div>
  );
};

export default CategoryTabs;
