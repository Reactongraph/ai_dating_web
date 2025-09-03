'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiMoreVertical } from 'react-icons/fi';
import { CollectionCharacter } from '@/types/collection';
import ImageGallery from './ImageGallery';

interface CharacterImagesProps {
  character: CollectionCharacter;
}

const CharacterImages = ({ character }: CharacterImagesProps) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <div className=" bg-black">
      {/* Header */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-white">My Collection</h1>
            <Image
              src={character.mainImage}
              alt={character.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <h2 className="text-3xl font-bold text-white">{character.name}</h2>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {character.images.map((image, index) => (
            <div
              key={image.id}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => openGallery(index)}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />

                {/* Top Actions */}
                <div className="absolute top-4 right-4">
                  <button className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                    <FiMoreVertical size={20} />
                  </button>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      <ImageGallery
        images={character.images}
        initialImageIndex={selectedImageIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

export default CharacterImages;
