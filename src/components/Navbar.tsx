
import React, { useState } from 'react';
import { Search, Menu, X, Moon, Sun } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  onSearch: (query: string) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onToggleDarkMode, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-black to-stream-dark border-b border-stream-primary/20 shadow-md">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            <span className="bg-stream-primary px-2 py-1 rounded">STREAM</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="relative">
              <Input
                type="text"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-44 md:w-64 lg:w-80 bg-stream-card/80 border-stream-primary/20 focus:border-stream-primary transition-all"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          )}
          
          <button 
            onClick={onToggleDarkMode} 
            className="p-2 rounded-full hover:bg-stream-card card-hover"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="text-stream-accent" size={20} /> : <Moon className="text-stream-primary" size={20} />}
          </button>
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="p-4 bg-stream-dark border-t border-stream-primary/20">
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-stream-card/80 border-stream-primary/20 focus:border-stream-primary transition-all"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
