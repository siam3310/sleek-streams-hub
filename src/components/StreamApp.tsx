
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import CategoryCard from './CategoryCard';
import ChannelCard from './ChannelCard';
import VideoPlayer from './VideoPlayer';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockCategories, mockChannels } from '@/data/mockData';

interface Category {
  category_id: number;
  category_name: string;
}

interface Channel {
  stream_id: string;
  name: string;
  stream_icon: string;
}

const StreamApp: React.FC = () => {
  // Using HTTPS for the API URL to prevent mixed content issues
  const baseUrl = 'https://cors-anywhere.herokuapp.com/http://filex.tv:8080/player_api.php?username=zulfikarsh01&password=000576';
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [displayedChannels, setDisplayedChannels] = useState<Channel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentStream, setCurrentStream] = useState('');
  const [loading, setLoading] = useState(true);
  const [channelsPerLoad, setChannelsPerLoad] = useState(20);
  const [showWelcome, setShowWelcome] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  
  const isMobile = useIsMobile();
  
  useEffect(() => {
    loadCategories();
    
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Try to fetch real data
      const response = await fetch(baseUrl + '&action=get_live_categories', {
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fall back to mock data
      setCategories(mockCategories);
      setUsingMockData(true);
      toast({
        title: "Using Demo Mode",
        description: "Unable to connect to the live server. Using demo data instead.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const selectCategory = async (categoryId: number) => {
    setSelectedCategory(categoryId);
    try {
      setLoading(true);
      
      if (usingMockData) {
        // Use mock data since we're in demo mode
        setChannels(mockChannels);
        setDisplayedChannels(mockChannels.slice(0, channelsPerLoad));
      } else {
        const response = await fetch(`${baseUrl}&action=get_live_streams&category_id=${categoryId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setChannels(data);
          setDisplayedChannels(data.slice(0, channelsPerLoad));
        } else {
          toast({
            title: "No Channels",
            description: "No channels found in this category.",
          });
          setChannels([]);
          setDisplayedChannels([]);
        }
      }
    } catch (error) {
      console.error('Error loading channels:', error);
      
      if (!usingMockData) {
        // If this is the first error, switch to mock data
        setChannels(mockChannels);
        setDisplayedChannels(mockChannels.slice(0, channelsPerLoad));
        setUsingMockData(true);
        toast({
          title: "Using Demo Mode",
          description: "Unable to connect to the channel server. Using demo data instead.",
          variant: "default"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const loadMoreChannels = () => {
    const currentCount = displayedChannels.length;
    setDisplayedChannels([
      ...displayedChannels,
      ...channels.slice(currentCount, currentCount + channelsPerLoad)
    ]);
  };
  
  const playStream = (streamId: string) => {
    if (usingMockData) {
      // For demo mode, just show a message
      toast({
        title: "Demo Mode",
        description: "Video playback is not available in demo mode.",
        variant: "default"
      });
      return;
    }
    
    const streamUrl = `${baseUrl.split('/player_api.php')[0]}/live/zulfikarsh01/000576/${streamId}.m3u8`;
    setCurrentStream(streamUrl);
    setIsPlayerOpen(true);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (selectedCategory) {
      if (!query) {
        setDisplayedChannels(channels.slice(0, channelsPerLoad));
      } else {
        const filtered = channels.filter(channel => 
          channel.name.toLowerCase().includes(query.toLowerCase())
        );
        setDisplayedChannels(filtered);
      }
    }
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };
  
  const backToCategories = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-stream-dark' : 'bg-stream-light'} transition-all duration-300`}>
      <Navbar 
        onSearch={handleSearch} 
        onToggleDarkMode={toggleDarkMode} 
        isDarkMode={isDarkMode} 
      />
      
      {/* Welcome Notice */}
      {showWelcome && (
        <div className="fixed top-16 left-0 right-0 z-10 p-4 bg-stream-primary/90 text-white text-center transform transition-all animate-fade-in">
          <p className="font-semibold">
            {usingMockData 
              ? "Welcome to STREAM DEMO! Currently running in demo mode with sample data." 
              : "Welcome to STREAM! Enjoy your favorite channels anytime, anywhere."}
          </p>
        </div>
      )}
      
      {usingMockData && (
        <div className="bg-yellow-500/20 border-l-4 border-yellow-500 p-4 text-yellow-700 mb-4">
          <p className="text-sm font-medium">
            Demo Mode: Using sample data. Live streaming features are limited.
          </p>
        </div>
      )}
      
      <main className="container mx-auto py-6 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-stream-primary" />
          </div>
        ) : selectedCategory === null ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-stream-primary to-stream-accent bg-clip-text text-transparent">
              Select Your Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.category_id} 
                  category={category} 
                  onSelect={selectCategory} 
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={backToCategories} 
                className="flex items-center gap-2 bg-stream-card hover:bg-stream-card-hover border-stream-primary/20"
                size={isMobile ? "sm" : "default"}
              >
                <ArrowLeft size={isMobile ? 14 : 16} />
                Back to Categories
              </Button>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-stream-primary to-stream-accent bg-clip-text text-transparent">
              Select a Channel
            </h2>
            
            {displayedChannels.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {displayedChannels.map((channel) => (
                  <ChannelCard 
                    key={channel.stream_id} 
                    channel={channel} 
                    onPlay={playStream} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No channels found. Try another category.</p>
              </div>
            )}
            
            {channels.length > displayedChannels.length && (
              <div className="flex justify-center mt-6 md:mt-8">
                <Button 
                  onClick={loadMoreChannels}
                  className="bg-stream-primary hover:bg-stream-secondary"
                  size={isMobile ? "sm" : "default"}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      
      <VideoPlayer 
        streamUrl={currentStream} 
        onClose={() => setIsPlayerOpen(false)} 
        isOpen={isPlayerOpen} 
      />
    </div>
  );
};

export default StreamApp;
