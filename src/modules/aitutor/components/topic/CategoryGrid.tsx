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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedCategory?.id === category.id
                ? 'border-accent-primary bg-background-hover shadow-glow'
                : 'border-border-subtle bg-background-card hover:border-accent-primary hover:bg-background-hover'
            }`}
            onClick={() => onCategorySelect(category)}
          >
            <h4 className="font-semibold text-text-primary text-sm">
              {category.name}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}; 