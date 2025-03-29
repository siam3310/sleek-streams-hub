
import React, { useEffect, useRef, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface VideoPlayerProps {
  streamUrl: string;
  onClose: () => void;
  isOpen: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ streamUrl, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadError, setLoadError] = useState(false);
  
  useEffect(() => {
    if (isOpen && videoRef.current) {
      setLoadError(false);
      
      // Load the video player
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/video.js/8.3.0/video.min.js';
      script.async = true;
      script.onload = () => {
        if (window.videojs && videoRef.current) {
          try {
            const player = window.videojs(videoRef.current);
            player.src({ src: streamUrl, type: 'application/x-mpegURL' });
            
            player.on('error', function() {
              setLoadError(true);
              toast({
                title: "Playback Error",
                description: "Unable to play this stream. Please try another channel.",
                variant: "destructive"
              });
            });
            
            player.play().catch(err => {
              console.error('Video playback error:', err);
              setLoadError(true);
            });
            
          } catch (error) {
            console.error('Video.js initialization error:', error);
            setLoadError(true);
          }
        }
      };
      
      script.onerror = () => {
        setLoadError(true);
        toast({
          title: "Player Error",
          description: "Failed to load video player. Please check your connection.",
          variant: "destructive"
        });
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
          try {
            window.videojs(videoRef.current).dispose();
          } catch (error) {
            console.error('Error disposing video player:', error);
          }
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
        {loadError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Playback Error</h3>
            <p className="text-center text-gray-300 max-w-md mb-6">
              Unable to play this stream. Please try another channel or check your connection.
            </p>
          </div>
        ) : (
          <video 
            ref={videoRef}
            id="video-player" 
            className="video-js vjs-default-skin vjs-big-play-centered w-full h-full" 
            controls 
            preload="auto"
            data-setup="{}"
          />
        )}
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
