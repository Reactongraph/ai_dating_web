import SafeImage from '@/components/common/SafeImage';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useLikeBotMutation, useUnlikeBotMutation } from '@/redux/services/botProfilesApi';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useSnackbar } from '@/providers';
import { useState, useEffect, useMemo } from 'react';
import { openAuthModal } from '@/redux/slices/authSlice';
import { selectContentMode, setMode } from '@/redux/slices/contentModeSlice';
import { useUpdateProfileMutation } from '@/redux/services/profileApi';

export interface Companion {
  id: string;
  name: string;
  age: number;
  description: string;
  imageSrc: string;
  tags: string[];
  isLiked?: boolean;
}

interface CompanionCardProps {
  companion: Companion;
  handleCardClick?: (companion: Companion) => void;
}

const CompanionCard = ({ companion, handleCardClick = () => {} }: CompanionCardProps) => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const userId = useAppSelector(state => state.auth.user?._id);
  const contentMode = useAppSelector(selectContentMode);
  const dispatch = useAppDispatch();
  const [likeBot, { isLoading: isLiking }] = useLikeBotMutation();
  const [unlikeBot, { isLoading: isUnliking }] = useUnlikeBotMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const { showSnackbar } = useSnackbar();
  const [localIsLiked, setLocalIsLiked] = useState(companion.isLiked || false);

  // Check if card should be blurred (sfw mode + nsfw category)
  const shouldBlur = useMemo(() => {
    const category = (companion as { category?: 'sfw' | 'nsfw' }).category;
    return contentMode === 'sfw' && category === 'nsfw';
  }, [contentMode, (companion as { category?: 'sfw' | 'nsfw' }).category]);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalIsLiked(companion.isLiked || false);
  }, [companion.isLiked, companion.id]);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking heart

    if (!isAuthenticated) {
      dispatch(openAuthModal({ mode: 'email-login' }));
      return;
    }

    try {
      if (localIsLiked) {
        await unlikeBot(companion.id).unwrap();
        setLocalIsLiked(false);
        showSnackbar('Removed from favorites', 'success');
      } else {
        await likeBot(companion.id).unwrap();
        setLocalIsLiked(true);
        showSnackbar('Added to favorites', 'success');
      }
    } catch (error: unknown) {
      console.error('Failed to toggle like:', error);

      // Handle "Bot already liked" error gracefully
      let errorMessage: string | null = null;
      let statusCode: number | null = null;

      if (
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof error.data === 'object' &&
        error.data !== null
      ) {
        if ('message' in error.data) {
          errorMessage = error.data.message as string;
        }
        if ('statusCode' in error.data) {
          statusCode = error.data.statusCode as number;
        }
      }

      // Check for "Bot already liked" error (statusCode 400 or message contains "already liked")
      if (
        (statusCode === 400 && errorMessage?.includes('already liked')) ||
        errorMessage?.toLowerCase().includes('already liked')
      ) {
        // If bot is already liked, update local state and show info message
        setLocalIsLiked(true);
        showSnackbar('This companion is already in your favorites', 'info');
      } else {
        // For other errors, show generic error message
        showSnackbar(errorMessage || 'Failed to update favorite. Please try again.', 'error');
      }
    }
  };

  const handleCardClickInternal = async () => {
    // If card is blurred, toggle to NSFW mode and update user profile instead of navigating
    if (shouldBlur) {
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
      return; // Don't navigate to chat
    }

    // If not blurred, proceed with normal card click (navigate to chat)
    handleCardClick(companion);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300 h-full flex-[1_1_calc(50%-4px)] sm:flex-[1_1_calc(50%-10px)] md:flex-[1_1_calc(50%-8px)] lg:flex-[1_1_280px] xl:flex-[1_1_300px] 2xl:flex-[1_1_320px] min-w-[150px] max-w-[400px]"
      onClick={handleCardClickInternal}
    >
      {/* Image */}
      <div className="relative h-[350px] sm:h-[300px] lg:h-[380px] xl:h-[400px] 2xl:h-[420px] w-full">
        <SafeImage
          src={companion.imageSrc}
          alt={companion.name}
          imageType={(companion as { imageType?: 'sfw' | 'nsfw' }).imageType}
          category={(companion as { category?: 'sfw' | 'nsfw' }).category}
          fill
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-90" />

        {/* Heart Icon - Top Right Corner */}
        <button
          onClick={handleHeartClick}
          disabled={isLiking || isUnliking || shouldBlur}
          className={`absolute top-3 right-3 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${shouldBlur ? 'blur-sm pointer-events-none' : ''}`}
          aria-label={localIsLiked ? 'Unlike' : 'Like'}
        >
          {localIsLiked ? (
            <IoHeart size={24} className="text-red-500" />
          ) : (
            <IoHeartOutline size={24} className="text-white" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6 xl:p-6 2xl:p-7">
        <h3 className={`text-2xl font-semibold text-white mb-2 ${shouldBlur ? 'blur-sm' : ''}`}>
          {companion.name}, {companion.age}
        </h3>
        <p className={`text-gray-300 text-sm mb-4 line-clamp-4 ${shouldBlur ? 'blur-sm' : ''}`}>
          {companion.description}
        </p>

        {/* Tags */}
        {/* <div className="flex gap-2 flex-wrap">
        {companion.tags.map((tag, index) => (
          <span
            key={index}
            className=" whitespace-nowrap px-3 py-1 bg-[rgba(0,0,0,0.5)] rounded-full text-sm text-white flex items-center justify-center"
          >
            {tag}
          </span>
        ))}
      </div> */}
      </div>
    </div>
  );
};

export default CompanionCard;
