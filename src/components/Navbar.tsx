
import React, { useState } from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onSearch: (query: string) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onToggleDarkMode, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <header className="flex justify-between items-center p-4 md:p-5 bg-gradient-to-r from-black to-stream-dark border-b border-stream-primary/20 shadow-md sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-stream-primary to-stream-accent bg-clip-text text-transparent animate-pulse-glow">
          STREAM<span className="text-stream-accent">+</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-60 md:w-80 bg-stream-card/80 border-stream-primary/20 focus:border-stream-primary transition-all"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        </div>
        
        <button 
          onClick={onToggleDarkMode} 
          className="p-2 rounded-full hover:bg-stream-card card-hover"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="text-stream-accent" size={20} /> : <Moon className="text-stream-primary" size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
