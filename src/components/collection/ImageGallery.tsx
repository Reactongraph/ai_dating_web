'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/common/SafeImage';
import { IoClose } from 'react-icons/io5';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { CharacterImage } from '@/types/collection';

interface ImageGalleryProps {
  images: CharacterImage[];
  initialImageIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageGallery = ({ images, initialImageIndex = 0, isOpen, onClose }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  // Update currentIndex when initialImageIndex changes or gallery opens
  useEffect(() => {
    if (isOpen && initialImageIndex !== undefined) {
      setCurrentIndex(initialImageIndex);
    }
  }, [isOpen, initialImageIndex]);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <IoClose size={32} />
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 text-white hover:text-gray-300 transition-colors"
      >
        <IoChevronBackOutline size={40} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 text-white hover:text-gray-300 transition-colors"
      >
        <IoChevronForwardOutline size={40} />
      </button>

      {/* Main Image */}
      <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-auto">
        <SafeImage
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          imageType={(images[currentIndex] as { imageType?: 'sfw' | 'nsfw' }).imageType || 'sfw'}
          fill
          className="object-contain"
        />
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-16 h-16 relative rounded-lg overflow-hidden transition-opacity
              ${index === currentIndex ? 'ring-2 ring-accent-blue' : 'opacity-50 hover:opacity-100'}`}
          >
            <SafeImage
              src={image.url}
              alt={image.alt}
              imageType={(image as { imageType?: 'sfw' | 'nsfw' }).imageType || 'sfw'}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
