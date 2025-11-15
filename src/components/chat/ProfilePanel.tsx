'use client';

import React from 'react';
import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ChatUser, GeneratedImage } from '@/types/chat';
import ImageGallery from '@/components/collection/ImageGallery';
import { CharacterImage } from '@/types/collection';

interface ProfilePanelProps {
  user: ChatUser | null;
  generatedImages?: GeneratedImage[];
  onRefetchImages?: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  user,
  generatedImages = [],
  onRefetchImages,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'collection'>('profile');
  const [showFullDescription, setShowFullDescription] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<CharacterImage[]>([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  // Track current image index in profile tab (0 = profile image, 1+ = collection images)
  const [currentProfileImageIndex, setCurrentProfileImageIndex] = useState(0);

  // Sort images by createdAt descending (latest first)
  const sortedImages = useMemo(() => {
    return [...generatedImages].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }, [generatedImages]);

  // Track if we've already fetched for this user
  const lastFetchedUserRef = useRef<string | null>(null);
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Refetch images when Collection tab is clicked - with debouncing
  useEffect(() => {
    // Clear any pending refetch
    if (refetchTimeoutRef.current) {
      clearTimeout(refetchTimeoutRef.current);
    }

    if (activeTab === 'collection' && onRefetchImages && user?.id) {
      // Only refetch if we haven't fetched for this user yet
      if (lastFetchedUserRef.current !== user.id) {
        // Debounce to avoid multiple rapid calls
        refetchTimeoutRef.current = setTimeout(() => {
          onRefetchImages();
          lastFetchedUserRef.current = user.id;
        }, 100); // Small delay to batch rapid switches
      }
    }

    return () => {
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
    };
  }, [activeTab, onRefetchImages, user?.id]);

  // Reset to profile image when user changes or switching to profile tab
  useEffect(() => {
    setCurrentProfileImageIndex(0);
  }, [user?.id, activeTab]);

  // Navigation handlers for profile image arrows - memoized
  const handlePreviousImage = useCallback(() => {
    setCurrentProfileImageIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextImage = useCallback(() => {
    setCurrentProfileImageIndex(prev => Math.min(sortedImages.length, prev + 1));
  }, [sortedImages.length]);

  // Determine if arrows should be disabled - memoized
  const canGoLeft = useMemo(() => currentProfileImageIndex > 0, [currentProfileImageIndex]);
  const canGoRight = useMemo(
    () => currentProfileImageIndex < sortedImages.length,
    [currentProfileImageIndex, sortedImages.length],
  );

  // Get current image to display - memoized
  const currentDisplayImage = useMemo(() => {
    if (currentProfileImageIndex === 0) {
      return user?.avatar || '';
    }
    // Index 1+ means collection images (subtract 1 to get sortedImages index)
    const collectionIndex = currentProfileImageIndex - 1;
    return sortedImages[collectionIndex]?.imageURL || user?.avatar || '';
  }, [currentProfileImageIndex, sortedImages, user?.avatar]);

  // Get current image alt text - memoized
  const currentImageAlt = useMemo(() => {
    if (currentProfileImageIndex === 0) {
      return user?.name || 'Profile';
    }
    const collectionIndex = currentProfileImageIndex - 1;
    return sortedImages[collectionIndex]?.prompt || user?.name || 'Generated image';
  }, [currentProfileImageIndex, sortedImages, user?.name]);

  // Create gallery images from user data
  const createGalleryImages = (): CharacterImage[] => {
    if (!user) return [];

    const images: CharacterImage[] = [];

    // Add main profile image
    images.push({
      id: 'profile-main',
      url: user.avatar,
      alt: `${user.name} - Profile Image`,
    });

    // Add generated images from the chat (sorted by latest first)
    sortedImages.forEach(img => {
      images.push({
        id: img.id,
        url: img.imageURL,
        alt: img.prompt,
      });
    });

    return images;
  };

  // Handle image click to open gallery - memoized
  const handleImageClick = useCallback(
    (imageIndex: number) => {
      const images = createGalleryImages();
      setGalleryImages(images);
      setInitialImageIndex(imageIndex);
      setIsGalleryOpen(true);
    },
    [sortedImages, user],
  );

  // Close gallery - memoized
  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  // Handle profile image click - memoized
  const handleProfileImageClick = useCallback(() => {
    const images = createGalleryImages();
    setGalleryImages(images);
    setInitialImageIndex(currentProfileImageIndex);
    setIsGalleryOpen(true);
  }, [currentProfileImageIndex, sortedImages, user]);

  if (!user) {
    return (
      <div className="w-full lg:w-80 bg-black border-l border-gray-800 flex flex-col h-full">
        {/* Empty header space to align with chat header - Only on desktop */}
        <div className="hidden lg:block h-[73px] border-b border-gray-800"></div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-400 text-sm md:text-base text-center">
            Select a chat to view profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 bg-black border-l border-gray-800 flex flex-col h-full">
      {/* Empty header space to align with chat header - Only on desktop */}
      <div className="hidden lg:block h-[73px] border-b border-gray-800"></div>

      {/* Header with Tabs */}
      <div className="p-3 md:p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex space-x-6 justify-center lg:justify-start">
          <button
            onClick={() => setActiveTab('profile')}
            className={`text-base md:text-lg font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'text-white border-white'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`text-base md:text-lg font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'collection'
                ? 'text-white border-white'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Collection
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'profile' ? (
          <div className="p-4">
            {/* Profile Image */}
            <div className="relative mb-3 md:mb-4">
              <div
                className="w-full h-48 md:h-64 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleProfileImageClick}
              >
                <Image
                  src={currentDisplayImage}
                  alt={currentImageAlt}
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                  priority={currentProfileImageIndex === 0}
                />
              </div>

              {/* Navigation Arrows - Only show if there are collection images */}
              {sortedImages.length > 0 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    disabled={!canGoLeft}
                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full p-1.5 md:p-2 transition-all ${
                      canGoLeft
                        ? 'bg-black/50 text-white hover:bg-black/70 cursor-pointer'
                        : 'bg-black/20 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    disabled={!canGoRight}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-1.5 md:p-2 transition-all ${
                      canGoRight
                        ? 'bg-black/50 text-white hover:bg-black/70 cursor-pointer'
                        : 'bg-black/20 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-left mb-4 md:mb-6">
              <h2 className="text-white font-bold text-lg md:text-xl mb-2">
                {user.name}, {user.age}
              </h2>

              <div className="flex items-center mb-3 md:mb-4 mt-3">
                <div className="flex-1">
                  <div className="flex items-baseline">
                    <span className="text-white font-bold text-xl md:text-2xl mr-1">
                      {user.stats.messages}
                    </span>
                    <span className="text-gray-500 text-sm">messages</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline">
                    <span className="text-white font-bold text-xl md:text-2xl mr-1">
                      {user.stats.chats}
                    </span>
                    <span className="text-gray-500 text-sm">chats</span>
                  </div>
                </div>
              </div>

              {/* <div className="flex flex-wrap justify-center gap-2 mb-3 md:mb-4">
                {user.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div> */}

              <p className="text-gray-300 text-xs md:text-sm mb-3 md:mb-4">{user.description}</p>

              {/* Show Less/More Button */}
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary-500 text-sm hover:text-primary-400 transition-colors"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Details - Collapsible */}
            {showFullDescription && (
              <div className="space-y-3 animate-in slide-in-from-top duration-300 border-1 bg-[#1d1d1d] border-[#1d1d1d] rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Age</span>
                  </div>
                  <span className="text-white text-sm capitalize">{user.details.age}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Occupation</span>
                  </div>
                  <span className="text-white text-sm capitalize">{user.details.occupation}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6V5a2 2 0 114 0v1H8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Gender</span>
                  </div>
                  <span className="text-white text-sm capitalize">{user.details.gender}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Ethnicity</span>
                  </div>
                  <span className="text-white text-sm capitalize">{user.details.ethnicity}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Body type</span>
                  </div>
                  <span className="text-white text-sm capitalize">{user.details.bodyType}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Relationship</span>
                  </div>
                  <span className="text-white text-sm capitalize">{user.details.relationship}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Personality</span>
                  </div>
                  <span className="text-white text-sm capitalize">{user.details.personality}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Hobby</span>
                  </div>
                  <span className="text-white text-sm capitalize">{user.details.hobby}</span>
                </div>

                {/* Create AI Character Button */}
              </div>
            )}
            {/* <div className="mt-8 pt-4 border-t border-gray-800">
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-medium transition-colors">
                <span className="flex items-center justify-center gap-2">
                  {' '}
                  <Image
                    src="/assets/wand2.svg"
                    alt="Create AI Character"
                    width={24}
                    height={24}
                    className="brightness-0 invert"
                  />{' '}
                  Create AI Character{' '}
                </span>
              </button>
            </div> */}
          </div>
        ) : (
          // Collection Tab Content
          <div className="p-4">
            {sortedImages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">No images yet</div>
                <p className="text-gray-500 text-sm">
                  Start chatting to generate images with {user.name}!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {sortedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group"
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <Image
                      src={image.imageURL}
                      alt={image.prompt}
                      width={150}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />

                    {/* Image info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs truncate" title={image.prompt}>
                        {image.prompt}
                      </p>
                      <p className="text-gray-300 text-xs">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Gallery */}
      <ImageGallery
        images={galleryImages}
        initialImageIndex={initialImageIndex}
        isOpen={isGalleryOpen}
        onClose={closeGallery}
      />
    </div>
  );
};

// Memoize ProfilePanel to prevent unnecessary re-renders
export default React.memo(ProfilePanel);
