
import React from 'react';

interface Category {
  category_id: number;
  category_name: string;
}

interface CategoryCardProps {
  category: Category;
  onSelect: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  return (
    <div 
      className="glassmorphism p-6 text-center cursor-pointer card-hover animate-fade-in"
      onClick={() => onSelect(category.category_id)}
    >
      <div className="mb-3 flex justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stream-primary to-stream-secondary flex items-center justify-center">
          <span className="text-xl font-bold text-white">
            {category.category_name.charAt(0)}
          </span>
        </div>
      </div>
      <h3 className="text-md font-semibold text-white">{category.category_name}</h3>
    </div>
  );
};

export default CategoryCard;
