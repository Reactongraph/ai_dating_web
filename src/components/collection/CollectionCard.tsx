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
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectContentMode, setMode } from '@/redux/slices/contentModeSlice';
import { useUpdateProfileMutation } from '@/redux/services/profileApi';

interface CollectionCardProps {
  character: CollectionCharacter;
}

const CollectionCard = ({ character }: CollectionCardProps) => {
  const contentMode = useAppSelector(selectContentMode);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const userId = useAppSelector(state => state.auth.user?._id);
  const dispatch = useAppDispatch();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [unlikeBot, { isLoading: isUnliking }] = useUnlikeBotMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const { startChat } = useChatInitiation();
  const { showSnackbar } = useSnackbar();

  // Check if card should be blurred (sfw mode + nsfw category)
  const shouldBlur = useMemo(() => {
    const category = (character as { category?: 'sfw' | 'nsfw' }).category;
    return contentMode === 'sfw' && category === 'nsfw';
  }, [contentMode, (character as { category?: 'sfw' | 'nsfw' }).category]);

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

  const handleCardClick = async (e: React.MouseEvent) => {
    // If card is blurred, toggle to NSFW mode and update user profile instead of navigating
    if (shouldBlur) {
      e.preventDefault();
      e.stopPropagation();

      try {
        // Toggle content mode to nsfw
        dispatch(setMode('nsfw'));

        // Update user's isNsfw flag if authenticated
        if (isAuthenticated && userId) {
          await updateProfile({
            userId,
            data: { isNsfw: true },
          }).unwrap();
        }

        showSnackbar('Switched to NSFW mode', 'success');
      } catch (error) {
        console.error('Failed to update profile:', error);
        // Don't show error to user, mode is already toggled
      }
    }
    // If not blurred, Link component will handle navigation
  };

  const cardContent = (
    <>
      {/* Image */}
      <div className="relative h-[480px] w-full">
        <SafeImage
          src={character.mainImage}
          alt={character.name}
          imageType={(character as { imageType?: 'sfw' | 'nsfw' }).imageType}
          category={(character as { category?: 'sfw' | 'nsfw' }).category}
          fill
          className="object-cover"
        />

        {/* Top Actions */}
        <div className="absolute top-4 right-4 left-4 flex justify-between items-center z-10">
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={handleMoreClick}
              disabled={shouldBlur}
              className={`p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${shouldBlur ? 'blur-sm pointer-events-none' : ''}`}
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
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full bg-black/50 text-white ${shouldBlur ? 'blur-sm' : ''}`}
          >
            <BsImages size={16} />
            <span className="text-sm">
              +{character.images.length > 0 ? character.images.length - 1 : 0}
            </span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center space-x-2">
            <h3 className={`text-2xl font-semibold text-white ${shouldBlur ? 'blur-sm' : ''}`}>
              {character.name}
            </h3>
            <span className={`text-xl text-white ${shouldBlur ? 'blur-sm' : ''}`}>
              {character.age}
            </span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </>
  );

  return (
    <Link
      href={`/collection/${character.id}`}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      {cardContent}
    </Link>
  );
};

export default CollectionCard;
