
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative flex w-full max-w-sm items-center">
      <Input
        type="text"
        placeholder="Search blog posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pr-10"
      />
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute right-0 top-0 h-full px-3"
        onClick={onSearch}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SearchBar;
