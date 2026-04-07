import React from 'react';
import MenuItemCard from './MenuItemCard';
import { motion } from 'framer-motion';

const CategorySection = ({ category }: { category: any }) => {
    if (!category.items || category.items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 last:mb-0"
        >
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-foreground whitespace-nowrap">
                    {category.category}
                </h2>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-primary/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {category.items.map((item: any, idx: number) => (
                    <MenuItemCard key={`${item.name}-${idx}`} item={item} />
                ))}
            </div>
        </motion.div>
    );
};

export default React.memo(CategorySection);
