import React from 'react';
import { Category } from '../../types';
import { formatCategoryCount } from '../../utils';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">
        Chọn danh mục: {formatCategoryCount(categories.length)}
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full border-2 cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              selectedCategory?.id === category.id
                ? 'border-accent-primary bg-accent-primary text-white shadow-glow'
                : 'border-border-subtle bg-background-card text-text-primary hover:border-accent-primary hover:bg-background-hover'
            }`}
            onClick={() => onCategorySelect(category)}
          >
            <span className="font-medium text-sm">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}; 