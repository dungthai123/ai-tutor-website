import { getImageUrl, isValidImageUrl } from '../../utils';
import Image from 'next/image';

interface ImageGridProps {
  images: string[];
  className?: string;
  onImageClick?: (index: number) => void;
  selectedIndex?: number;
}

export function ImageGrid({ 
  images, 
  className = "",
  onImageClick,
  selectedIndex 
}: ImageGridProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className={`image-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {images.map((imageUrl, index) => (
        isValidImageUrl(imageUrl) && (
          <div 
            key={index} 
            className={`image-item relative group cursor-pointer ${
              selectedIndex === index ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onImageClick?.(index)}
          >
            <Image
              src={getImageUrl(imageUrl)}
              alt={`Option ${String.fromCharCode(65 + index)}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:border-blue-300 transition-all duration-200 shadow-sm"
            />
            <div className="image-label absolute top-2 left-2 bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full shadow">
              {String.fromCharCode(65 + index)}
            </div>
          </div>
        )
      ))}
    </div>
  );
} 