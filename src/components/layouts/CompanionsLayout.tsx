import { ReactNode } from 'react';
import GlobalLayout from './GlobalLayout';

interface CompanionsLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const CompanionsLayout = ({
  title,
  subtitle,
  children,
}: CompanionsLayoutProps) => {
  return (
    <GlobalLayout>
      <div className="bg-black">
        {/* Header Section */}
        <div className="relative w-full bg-cover bg-center py-6 sm:py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
              {title}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {children}
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default CompanionsLayout;
