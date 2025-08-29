import Image from 'next/image';

export interface Companion {
  id: string;
  name: string;
  age: number;
  description: string;
  imageSrc: string;
  tags: string[];
}

interface CompanionCardProps {
  companion: Companion;
}

const CompanionCard = ({ companion }: CompanionCardProps) => (
  <div className="relative rounded-2xl overflow-hidden group">
    {/* Image */}
    <div className="relative h-[480px] w-full">
      <Image
        src={companion.imageSrc}
        alt={companion.name}
        fill
        className="object-cover"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-90" />
    </div>

    {/* Content */}
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="text-2xl font-semibold text-white mb-2">
        {companion.name}, {companion.age}
      </h3>
      <p className="text-gray-300 text-sm mb-4">{companion.description}</p>

      {/* Tags */}
      <div className="flex gap-2">
        {companion.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-black bg-opacity-50 rounded-full text-sm text-white"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default CompanionCard;
