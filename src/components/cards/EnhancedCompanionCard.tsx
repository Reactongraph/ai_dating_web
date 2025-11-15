import Image from 'next/image';
import { ReactNode } from 'react';

export interface Companion {
  id: string;
  name: string;
  age: number;
  description: string;
  imageSrc: string;
  tags: string[];
}

interface EnhancedCompanionCardProps {
  companion: Companion;
  topRightIcon?: ReactNode;
  onIconClick?: () => void;
  onCardClick?: () => void;
}

const EnhancedCompanionCard = ({
  companion,
  topRightIcon,
  onIconClick,
  onCardClick,
}: EnhancedCompanionCardProps) => (
  <div className="relative rounded-2xl overflow-hidden group cursor-pointer" onClick={onCardClick}>
    {/* Image */}
    <div className="relative h-[350px]  sm:h-[300px] lg:h-[400px]  w-full">
      <Image src={companion.imageSrc} alt={companion.name} fill className="object-cover" />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-90" />
    </div>

    {/* Top Right Icon */}
    {topRightIcon && (
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={e => {
            e.stopPropagation(); // Prevent card click when icon is clicked
            onIconClick?.();
          }}
          className="transition-all duration-200 text-white"
        >
          {topRightIcon}
        </button>
      </div>
    )}

    {/* Content */}
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="text-2xl font-semibold text-white mb-2">
        {companion.name}, {companion.age}
      </h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-4">{companion.description}</p>

      {/* Tags */}
      {/* <div className="flex gap-2 flex-wrap">
        {companion.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-black bg-opacity-50 rounded-full text-sm text-white"
          >
            {tag}
          </span>
        ))}
      </div> */}
    </div>
  </div>
);

export default EnhancedCompanionCard;
