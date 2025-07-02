import { getImageUrl, isValidImageUrl } from '../../utils';

interface AspectRatioImageProps {
  src: string;
  alt?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
  className?: string;
  maxWidth?: string;
}

export function AspectRatioImage({ 
  src, 
  alt = "Question image",
  aspectRatio = 'video',
  className = "",
  maxWidth = "max-w-lg"
}: AspectRatioImageProps) {
  if (!isValidImageUrl(src)) return null;

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
    tall: 'aspect-[3/4]'
  };

  return (
    <div className={`relative ${maxWidth} mx-auto ${className}`}>
      <div className={`relative ${aspectRatioClasses[aspectRatio]} w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm`}>
        <img
          src={getImageUrl(src)}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error('Failed to load image:', src);
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
} 