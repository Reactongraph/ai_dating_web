'use client';

import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectContentMode, setMode } from '@/redux/slices/contentModeSlice';
import { useUpdateProfileMutation } from '@/redux/services/profileApi';
import Image, { ImageProps } from 'next/image';
import { useMemo } from 'react';

export type ImageType = 'sfw' | 'nsfw';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt?: string;
  imageType?: ImageType; // Keep for backward compatibility but not used for blur logic
  category?: 'sfw' | 'nsfw'; // Bot profile category from API
  containerClassName?: string; // Separate prop for container styling
  fallbackSrc?: string;
  onBlurClick?: () => void; // Optional custom handler when clicking blurred image
}

const SafeImage = ({
  src,
  alt = '',
  imageType,
  category,
  containerClassName = '',
  fallbackSrc,
  className, // This comes from ImageProps
  onBlurClick,
  ...imageProps
}: SafeImageProps) => {
  const mode = useAppSelector(selectContentMode);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const userId = useAppSelector(state => state.auth.user?._id);
  const dispatch = useAppDispatch();
  const [updateProfile] = useUpdateProfileMutation();

  // Blur logic: blur when in sfw mode and bot profile category is nsfw
  const shouldBlur = useMemo(() => {
    return mode === 'sfw' && category === 'nsfw';
  }, [mode, category]);

  const handleBlurClick = async (e: React.MouseEvent) => {
    if (shouldBlur) {
      e.preventDefault();
      e.stopPropagation();

      // Call custom handler if provided
      if (onBlurClick) {
        onBlurClick();
        return;
      }

      // Toggle to nsfw mode
      dispatch(setMode('nsfw'));

      // Update user's isNsfw flag if authenticated
      if (isAuthenticated && userId) {
        try {
          await updateProfile({
            userId,
            data: { isNsfw: true },
          }).unwrap();
        } catch (error) {
          console.error('Failed to update profile:', error);
          // Don't show error to user, mode is already toggled
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full" onClick={handleBlurClick}>
      <Image
        {...imageProps}
        src={src}
        alt={alt}
        className={`${shouldBlur ? 'blur-sm sm:blur-md pointer-events-none select-none' : ''} ${className || ''}`}
        onError={fallbackSrc ? () => {} : undefined}
      />
      {shouldBlur && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs md:text-sm font-medium backdrop-blur-sm rounded-lg cursor-pointer">
          <div className="text-center px-4">
            <p className="font-semibold mb-1">NSFW Content Hidden</p>
            <p className="text-xs opacity-90">Click to switch to NSFW mode.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeImage;
