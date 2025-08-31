import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiLogIn } from 'react-icons/fi';
import { RiVipCrownFill } from 'react-icons/ri';

interface DropdownOption {
  icon: React.ReactNode;
  label: string;
  href: string;
  highlight?: boolean;
  badge?: string;
  onClick?: () => void;
}

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const UserDropdown = ({ isOpen, onClose, onLoginClick }: UserDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const options: DropdownOption[] = [
    {
      icon: <FiLogIn className="w-5 h-5" />,
      label: 'Log in',
      href: '#',
      onClick: () => {
        onClose();
        onLoginClick();
      },
    },
    {
      icon: <RiVipCrownFill className="w-5 h-5 text-yellow-400" />,
      label: 'Subscription',
      href: '/subscription',
      highlight: true,
      badge: '70%',
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-[#2A2A2A] shadow-lg ring-1 ring-black ring-opacity-5 z-50"
    >
      <div className="py-2">
        {options.map((option, index) => {
          const commonClasses = `
            ${option.onClick ? 'w-full' : ''} flex items-center justify-between px-4 py-3 hover:bg-gray-700/50 transition-colors
            ${option.highlight ? 'text-yellow-400' : 'text-white'}
          `;

          const content = (
            <>
              <div className="flex items-center space-x-3">
                {option.icon}
                <span className="text-sm font-medium">{option.label}</span>
              </div>
              {option.badge && (
                <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                  {option.badge}
                </span>
              )}
            </>
          );

          return option.onClick ? (
            <button
              key={index}
              onClick={option.onClick}
              className={commonClasses}
            >
              {content}
            </button>
          ) : (
            <Link key={index} href={option.href} className={commonClasses}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UserDropdown;
