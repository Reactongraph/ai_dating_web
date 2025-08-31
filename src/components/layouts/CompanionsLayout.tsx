import { ReactNode } from 'react';

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
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="relative w-full bg-cover bg-center py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-gray-300 text-lg">{subtitle}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CompanionsLayout;
