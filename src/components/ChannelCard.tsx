
import React from 'react';

interface Channel {
  stream_id: string;
  name: string;
  stream_icon: string;
}

interface ChannelCardProps {
  channel: Channel;
  onPlay: (id: string) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onPlay }) => {
  return (
    <div 
      className="bg-stream-card rounded-lg overflow-hidden shadow-lg card-hover animate-fade-in"
      onClick={() => onPlay(channel.stream_id)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={channel.stream_icon || 'https://via.placeholder.com/150'} 
          alt={channel.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/150?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-3 w-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-stream-accent animate-pulse"></div>
              <span className="text-xs text-white/90">LIVE</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-white truncate">{channel.name}</h4>
      </div>
    </div>
  );
};

export default ChannelCard;
