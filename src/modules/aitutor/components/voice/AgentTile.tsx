'use client';

import { type AgentState, type TrackReference } from '@livekit/components-react';
import { cn } from '@/utils/helpers';
import { SphereVisualizer } from './SphereVisualizer';

interface AgentAudioTileProps {
  state: AgentState;
  audioTrack: TrackReference;
  className?: string;
  size?: number;
}

export const AgentTile = ({
  state,
  audioTrack,
  className,
  size = 360,
  ...props
}: React.ComponentProps<'div'> & AgentAudioTileProps) => {
  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <SphereVisualizer
        state={state}
        audioTrack={audioTrack}
        size={size}
        className="rounded-lg"
      />
    </div>
  );
}; 