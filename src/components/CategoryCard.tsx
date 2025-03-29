
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

interface Category {
  category_id: number;
  category_name: string;
}

interface CategoryCardProps {
  category: Category;
  onSelect: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className="glassmorphism p-4 md:p-6 text-center cursor-pointer card-hover animate-fade-in"
      onClick={() => onSelect(category.category_id)}
    >
      <div className="mb-3 flex justify-center">
        <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-gradient-to-br from-stream-primary to-stream-secondary flex items-center justify-center`}>
          <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white`}>
            {category.category_name.charAt(0)}
          </span>
        </div>
      </div>
      <h3 className={`${isMobile ? 'text-sm' : 'text-md'} font-semibold text-white line-clamp-2`}>
        {category.category_name}
      </h3>
    </div>
  );
};

export default CategoryCard;
