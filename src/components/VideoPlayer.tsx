
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  streamUrl: string;
  onClose: () => void;
  isOpen: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ streamUrl, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Load the video player
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/video.js/8.3.0/video.min.js';
      script.async = true;
      script.onload = () => {
        if (window.videojs && videoRef.current) {
          const player = window.videojs(videoRef.current);
          player.src({ src: streamUrl, type: 'application/x-mpegURL' });
          player.play();
        }
      };
      document.body.appendChild(script);
      
      // Add the CSS
      if (!document.querySelector('link[href*="video-js.min.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/video.js/8.3.0/video-js.min.css';
        document.head.appendChild(link);
      }
      
      return () => {
        if (window.videojs && videoRef.current) {
          window.videojs(videoRef.current).dispose();
        }
      };
    }
  }, [isOpen, streamUrl]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full md:w-3/4 lg:w-2/3 h-[60vh] rounded-lg overflow-hidden animate-scale-up shadow-2xl border border-stream-primary/30">
        <video 
          ref={videoRef}
          id="video-player" 
          className="video-js vjs-default-skin vjs-big-play-centered w-full h-full" 
          controls 
          preload="auto"
          data-setup="{}"
        />
        <button 
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-stream-primary/80 transition-colors duration-300 z-10"
          onClick={onClose}
          aria-label="Close video player"
        >
          <X className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    videojs: any;
  }
}

export default VideoPlayer;
