'use client';

import { useState } from 'react';
import SafeImage from '@/components/common/SafeImage';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { CollectionCharacter } from '@/types/collection';
import ImageGallery from './ImageGallery';
import Image from 'next/image';

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
      {/* Header with Breadcrumb */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 mb-6">
            <Link
              href="/collection"
              className="text-2xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              My Collection
            </Link>
            <FiChevronRight className="text-gray-400" size={20} />
            <div className="flex items-center space-x-2">
              <Image
                src={character.mainImage}
                alt={character.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-white">{character.name}</span>
            </div>
          </nav>
        </div>
      </div>
      {/* Images Grid */}
      <div className=" relative max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {character.images.map((image, index) => (
            <div
              key={image.id}
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => openGallery(index)}
            >
              <div className="relative aspect-[3/4]">
                <SafeImage
                  src={image.url}
                  alt={image.alt}
                  imageType={(image as { imageType?: 'sfw' | 'nsfw' }).imageType || 'sfw'}
                  fill
                  className="object-cover"
                />

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
