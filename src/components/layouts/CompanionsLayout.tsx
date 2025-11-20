import { ReactNode } from 'react';
import GlobalLayout from './GlobalLayout';

interface CompanionsLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const CompanionsLayout = ({ title, subtitle, children }: CompanionsLayoutProps) => {
  return (
    <GlobalLayout>
      <div className="bg-black">
        {/* Header Section */}
        <div className="relative w-full bg-cover bg-center sm:py-8 md:pt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className=" sm:text-xl md:text-3xl font-bold text-white sm:mb-3 md:mb-2">
              {title}
            </h1>
            <p className="text-gray-300  sm:text-base md:text-sm">{subtitle}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full mx-auto sm:px-4 sm:py-6 md:py-4">
          <div className="flex flex-wrap gap-2 sm:gap-5 md:gap-4 lg:gap-4 xl:gap-5 2xl:gap-6">
            {children}
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default CompanionsLayout;
