'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import SafeImage from '@/components/common/SafeImage';
import Link from 'next/link';
import { BsImages } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { IoHeartDislikeOutline } from 'react-icons/io5';
import { CollectionCharacter } from '@/types/collection';
import { useUnlikeBotMutation } from '@/redux/services/botProfilesApi';
import { useChatInitiation } from '@/hooks/useChatInitiation';
import { useSnackbar } from '@/providers';
import { selectContentMode } from '@/redux/slices/contentModeSlice';
import { useAppSelector } from '@/redux/hooks';

interface CollectionCardProps {
  character: CollectionCharacter;
}

const CollectionCard = ({ character }: CollectionCardProps) => {
  const mode = useAppSelector(selectContentMode);
  const shouldBlur = useMemo(() => {
    return mode === 'sfw' && character.imageType === 'nsfw';
  }, [mode, character.imageType]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [unlikeBot, { isLoading: isUnliking }] = useUnlikeBotMutation();
  const { startChat } = useChatInitiation();
  const { showSnackbar } = useSnackbar();

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopoverOpen(!isPopoverOpen);
  };

  const handleDislike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopoverOpen(false);

    try {
      await unlikeBot(character.id).unwrap();
      showSnackbar('Removed from collection', 'success');
      // Cache invalidation will automatically update the list
    } catch (error) {
      console.error('Failed to unlike bot:', error);
      showSnackbar('Failed to remove from collection. Please try again.', 'error');
    }
  };

  const handleChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopoverOpen(false);
    startChat(character.id);
  };

  const cardContent = (
    <>
      {/* Image */}
      <div className="relative h-[480px] w-full">
        <SafeImage
          src={character.mainImage}
          alt={character.name}
          imageType={(character as { imageType?: 'sfw' | 'nsfw' }).imageType || 'sfw'}
          fill
          className="object-cover"
        />

        {/* Top Actions */}
        <div className="absolute top-4 right-4 left-4 flex justify-between items-center z-10">
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={handleMoreClick}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="More options"
            >
              <FiMoreVertical size={20} />
            </button>

            {/* Popover */}
            {isPopoverOpen && (
              <div
                ref={popoverRef}
                className="absolute top-12 left-0 bg-gray-800 rounded-lg shadow-lg py-2 min-w-[160px] z-20"
              >
                <button
                  onClick={handleChat}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                >
                  <HiChatBubbleLeftRight size={18} />
                  <span>Chat</span>
                </button>
                <button
                  onClick={handleDislike}
                  disabled={isUnliking}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoHeartDislikeOutline size={18} />
                  <span>{isUnliking ? 'Removing...' : 'Dislike'}</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-black/50 text-white">
            <BsImages size={16} />
            <span className="text-sm">
              +{character.images.length > 0 ? character.images.length - 1 : 0}
            </span>
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
    </>
  );

  if (shouldBlur) {
    return (
      <div className="relative rounded-2xl overflow-hidden group cursor-not-allowed">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/collection/${character.id}`}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
    >
      {cardContent}
    </Link>
  );
};

export default CollectionCard;
