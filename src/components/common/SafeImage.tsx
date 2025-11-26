'use client';

import { useAppSelector } from '@/redux/hooks';
import { selectContentMode } from '@/redux/slices/contentModeSlice';
import Image, { ImageProps } from 'next/image';
import { useMemo } from 'react';

export type ImageType = 'sfw' | 'nsfw';

interface SafeImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt?: string;
  imageType: ImageType;
  containerClassName?: string; // Separate prop for container styling
  fallbackSrc?: string;
}

const SafeImage = ({
  src,
  alt = '',
  imageType,
  containerClassName = '',
  fallbackSrc,
  className, // This comes from ImageProps
  ...imageProps
}: SafeImageProps) => {
  const mode = useAppSelector(selectContentMode);
 
  const shouldBlur = useMemo(() => {
    return mode === 'sfw' && imageType === 'nsfw';
  }, [mode, imageType]);

  return (
    <>
      <Image
        {...imageProps}
        src={src}
        alt={alt}
        className={`${shouldBlur ? 'blur-sm sm:blur-md pointer-events-none select-none' : ''} ${className || ''}`}
        onError={fallbackSrc ? () => {} : undefined}
      />
      {shouldBlur && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs md:text-sm font-medium backdrop-blur-sm rounded-lg">
          <div className="text-center px-4">
            <p className="font-semibold mb-1">NSFW Content Hidden</p>
            <p className="text-xs opacity-90">Switch to NSFW mode to view.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SafeImage;
