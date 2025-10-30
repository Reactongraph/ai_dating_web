'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChatUser, GeneratedImage } from '@/types/chat';
import ImageGallery from '@/components/collection/ImageGallery';
import { CharacterImage } from '@/types/collection';

interface ProfilePanelProps {
  user: ChatUser | null;
  generatedImages?: GeneratedImage[];
}
 
const ProfilePanel: React.FC<ProfilePanelProps> = ({
  user,
  generatedImages = [],
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'collection'>(
    'profile'
  );
  const [showFullDescription, setShowFullDescription] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<CharacterImage[]>([]);
  const [initialImageIndex, setInitialImageIndex] = useState(0);

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

    // Add generated images from the chat
    generatedImages.forEach((img) => {
      images.push({
        id: img.id,
        url: img.imageURL,
        alt: img.prompt,
      });
    });

    return images;
  };

  // Handle image click to open gallery
  const handleImageClick = (imageIndex: number) => {
    const images = createGalleryImages();
    setGalleryImages(images);
    setInitialImageIndex(imageIndex);
    setIsGalleryOpen(true);
  };

  // Close gallery
  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  if (!user) {
    return (
      <div className="w-80 bg-black border-l border-gray-800 flex flex-col h-full">
        {/* Empty header space to align with chat header */}
        <div className="h-[73px] border-b border-gray-800"></div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Select a chat to view profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-black border-l border-gray-800 flex flex-col h-full">
      {/* Empty header space to align with chat header */}
      <div className="h-[73px] border-b border-gray-800"></div>

      {/* Header with Tabs */}
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'text-white border-white'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
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
            <div className="relative mb-4">
              <div
                className="w-full h-64 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleImageClick(0)}
              >
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Navigation Arrows */}
              <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Profile Info */}
            <div className="text-center mb-6">
              <h2 className="text-white font-bold text-xl mb-2">
                {user.name}, {user.age}
              </h2>

              <div className="flex justify-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-white font-bold">
                    {user.stats.messages}
                  </div>
                  <div className="text-gray-400 text-xs">messages</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold">{user.stats.chats}</div>
                  <div className="text-gray-400 text-xs">chats</div>
                </div>
              </div>

              <div className="flex justify-center space-x-2 mb-4">
                {user.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-sm mb-4">{user.description}</p>

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
              <div className="space-y-3 animate-in slide-in-from-top duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Age</span>
                  </div>
                  <span className="text-white text-sm">{user.details.age}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Occupation</span>
                  </div>
                  <span className="text-white text-sm">
                    {user.details.occupation}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6V5a2 2 0 114 0v1H8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Gender</span>
                  </div>
                  <span className="text-white text-sm">
                    {user.details.gender}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Ethnicity</span>
                  </div>
                  <span className="text-white text-sm">
                    {user.details.ethnicity}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Body type</span>
                  </div>
                  <span className="text-white text-sm">
                    {user.details.bodyType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Relationship</span>
                  </div>
                  <span className="text-white text-sm">
                    {user.details.relationship}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Personality</span>
                  </div>
                  <span className="text-white text-sm">
                    {user.details.personality}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-400 text-sm">Hobby</span>
                  </div>
                  <span className="text-white text-sm">
                    {user.details.hobby}
                  </span>
                </div>

                {/* Create AI Character Button */}
              </div>
            )}
            <div className="mt-8 pt-4 border-t border-gray-800">
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
            </div>
          </div>
        ) : (
          // Collection Tab Content
          <div className="p-4">
            {generatedImages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">No images yet</div>
                <p className="text-gray-500 text-sm">
                  Start chatting to generate images with {user.name}!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {generatedImages.map((image, index) => (
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
                      <p
                        className="text-white text-xs truncate"
                        title={image.prompt}
                      >
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

export default ProfilePanel;
