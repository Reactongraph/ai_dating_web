import SafeImage from '@/components/common/SafeImage';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import { useLikeBotMutation, useUnlikeBotMutation } from '@/redux/services/botProfilesApi';
import { useAppSelector } from '@/redux/hooks';
import { useSnackbar } from '@/providers';
import { useState, useEffect, useMemo } from 'react';
import { selectContentMode } from '@/redux/slices/contentModeSlice';
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
  const [likeBot, { isLoading: isLiking }] = useLikeBotMutation();
  const [unlikeBot, { isLoading: isUnliking }] = useUnlikeBotMutation();
  const { showSnackbar } = useSnackbar();
  const [localIsLiked, setLocalIsLiked] = useState(companion.isLiked || false);
  const mode = useAppSelector(selectContentMode);
  const shouldBlur = useMemo(() => {
    return mode === 'sfw' && (companion as { imageType?: 'sfw' | 'nsfw' }).imageType === 'nsfw';
  }, [mode, (companion as { imageType?: 'sfw' | 'nsfw' }).imageType]);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalIsLiked(companion.isLiked || false);
  }, [companion.isLiked, companion.id]);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking heart

    if (!isAuthenticated) {
      showSnackbar('Please login to like companions', 'warning');
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

  return (
    <div
      className="relative rounded-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300 h-full flex-[1_1_calc(50%-4px)] sm:flex-[1_1_calc(50%-10px)] md:flex-[1_1_calc(50%-8px)] lg:flex-[1_1_280px] xl:flex-[1_1_300px] 2xl:flex-[1_1_320px] min-w-[150px] max-w-[400px]"
      onClick={() => (shouldBlur ? null : handleCardClick(companion))}
    >
      {/* Image */}
      <div className="relative h-[350px] sm:h-[300px] lg:h-[380px] xl:h-[400px] 2xl:h-[420px] w-full">
        <SafeImage
          src={companion.imageSrc}
          alt={companion.name}
          imageType={(companion as { imageType?: 'sfw' | 'nsfw' }).imageType || 'sfw'}
          fill
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-90" />

        {/* Heart Icon - Top Right Corner */}
        <button
          onClick={handleHeartClick}
          disabled={isLiking || isUnliking}
          className="absolute top-3 right-3 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        <h3 className="text-2xl font-semibold text-white mb-2">
          {companion.name}, {companion.age}
        </h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-4">{companion.description}</p>

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

      {shouldBlur && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs md:text-sm font-medium backdrop-blur-sm rounded-lg">
          <div className="text-center px-4">
            <p className="font-semibold mb-1">NSFW Content Hidden</p>
            <p className="text-xs opacity-90">Switch to NSFW mode to view.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanionCard;
