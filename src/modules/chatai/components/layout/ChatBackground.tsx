import React from 'react';
import Image from 'next/image';

interface ChatBackgroundProps {
  imageBackground?: string | null;
}

export function ChatBackground({ imageBackground }: ChatBackgroundProps) {
  if (!imageBackground) {
    return (
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-indigo-100" />
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src={imageBackground}
        alt="Chat background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black opacity-60" />
    </div>
  );
} 