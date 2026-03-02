'use client';

import React, { useState, useMemo } from 'react';
import restaurantData from '@/data/restaurant_menu.json';
import VegToggle from './VegToggle';
import CategoryToggle from './CategoryToggle';
import CategorySection from './CategorySection';

type FilterType = 'All' | 'Veg' | 'Non-Veg';

const MenuSection = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = useMemo(() => {
        return restaurantData.menu.map(c => c.category);
    }, []);

    const processedMenu = useMemo(() => {
        return restaurantData.menu.map(category => {
            const vegItems: any[] = [];
            const nonVegItems: any[] = [];

            category.items.forEach((item: any) => {
                const name = item.name.toLowerCase();
                const isMeatRelated = name.includes('chicken') || name.includes('mutton') || name.includes('fish') || name.includes('prawn') || name.includes('egg');

                // Handle Multi-Price Splitting (Soups/Noodles)
                if (item.veg !== undefined) {
                    vegItems.push({ ...item, displayedPrice: item.veg, forcedType: 'Veg' });
                }
                if (item.nonVeg !== undefined) {
                    nonVegItems.push({ ...item, displayedPrice: item.nonVeg, forcedType: 'Non-Veg' });
                }

                // Handle Variants like Egg/Chicken/Mixed in Noodles
                if (item.egg !== undefined || item.eggChicken !== undefined || item.mixed !== undefined) {
                    const nonVegVariants: any = {};
                    if (item.egg) nonVegVariants.egg = item.egg;
                    if (item.eggChicken) nonVegVariants.eggChicken = item.eggChicken;
                    if (item.mixed) nonVegVariants.mixed = item.mixed;
                    nonVegItems.push({ ...item, displayedVariants: nonVegVariants, forcedType: 'Non-Veg' });
                }

                // Handle Fish & Prawns special (basa/bhetki)
                if (item.basa !== undefined) {
                    nonVegItems.push({ ...item, displayedVariants: { basa: item.basa, bhetki: item.bhetki }, forcedType: 'Non-Veg' });
                }

                // Handle Fixed Price items
                if (item.price !== undefined) {
                    const categoryName = category.category.toLowerCase();
                    const isNonVegCategory = categoryName.includes('(non-veg)') || categoryName.includes('mutton') || categoryName.includes('egg') || categoryName === 'biryani';

                    if (isMeatRelated || isNonVegCategory) {
                        nonVegItems.push({ ...item, displayedPrice: item.price, forcedType: 'Non-Veg' });
                    } else {
                        vegItems.push({ ...item, displayedPrice: item.price, forcedType: 'Veg' });
                    }
                }
            });

            return {
                category: category.category,
                vegItems,
                nonVegItems
            };
        }).filter(category => category.vegItems.length > 0 || category.nonVegItems.length > 0);
    }, []);

    const filteredMenu = useMemo(() => {
        return processedMenu
            .filter(category => selectedCategory === 'All' || category.category === selectedCategory);
    }, [processedMenu, selectedCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-6xl font-black text-zinc-100 mb-4 tracking-tight">
                    Exquisite <span className="text-amber-500 text-glow">Restaurant Menu</span>
                </h1>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light italic">
                    Indulge in our curated selection of fine dining delicacies, crafted with passion and the freshest ingredients.
                </p>
            </div>

            <div className="mb-12">
                <CategoryToggle
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
            </div>

            <div className="space-y-4">
                {filteredMenu.length > 0 ? (
                    filteredMenu.map((category, idx) => (
                        <CategorySection
                            key={idx}
                            category={category.category}
                            vegItems={category.vegItems}
                            nonVegItems={category.nonVegItems}
                            filter="All"
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-zinc-800 border-dashed">
                        <p className="text-zinc-500 text-xl font-medium">No items found matching this category.</p>
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className="mt-4 text-amber-500 hover:underline transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        .text-glow {
          text-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }
      `}</style>
        </div>
    );
};

export default MenuSection;
