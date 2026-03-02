import React from 'react';
import MenuItemCard from './MenuItemCard';

interface CategorySectionProps {
    category: string;
    vegItems: any[];
    nonVegItems: any[];
    filter: 'All' | 'Veg' | 'Non-Veg';
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, vegItems, nonVegItems }) => {
    const allItems = [...vegItems, ...nonVegItems];

    if (allItems.length === 0) return null;

    return (
        <section className="mb-20">
            <div className="flex items-center space-x-4 mb-10">
                <h2 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight">
                    {category}
                </h2>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {allItems.map((item, idx) => (
                    <MenuItemCard key={`${category}-${item.name}-${idx}`} item={item} filter="All" />
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
