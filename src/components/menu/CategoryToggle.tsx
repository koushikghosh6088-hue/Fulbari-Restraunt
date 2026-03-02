import React from 'react';

interface CategoryToggleProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const CategoryToggle: React.FC<CategoryToggleProps> = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
        <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                <button
                    onClick={() => onCategoryChange('All')}
                    className={`
                        px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border
                        ${selectedCategory === 'All'
                            ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105'
                            : 'bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:border-amber-500/50 hover:text-zinc-200'}
                    `}
                >
                    All Categories
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`
                            px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border whitespace-nowrap
                            ${selectedCategory === category
                                ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105'
                                : 'bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:border-amber-500/50 hover:text-zinc-200'}
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryToggle;
