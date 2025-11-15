import Image from 'next/image';
import Link from 'next/link';
import { BsImages } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { CollectionCharacter } from '@/types/collection';

interface CollectionCardProps {
  character: CollectionCharacter;
}

const CollectionCard = ({ character }: CollectionCardProps) => {
  return (
    <Link
      href={`/collection/${character.id}`}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-[480px] w-full">
        <Image src={character.mainImage} alt={character.name} fill className="object-cover" />

        {/* Top Actions */}
        <div className="absolute top-4 right-4 left-4 flex justify-between items-center">
          <button className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
            <FiMoreVertical size={20} />
          </button>
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-black/50 text-white">
            <BsImages size={16} />
            <span className="text-sm">+{character.images.length}</span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-2xl font-semibold text-white">{character.name}</h3>
            <span className="text-xl text-white">{character.age}</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
};

export default CollectionCard;
