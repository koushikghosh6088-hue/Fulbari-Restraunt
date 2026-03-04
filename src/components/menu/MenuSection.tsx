'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Loader2, Search } from 'lucide-react';
import { sanitizeImageUrl } from '@/lib/utils';

const MenuSection = () => {
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/menu')
            .then(res => res.json())
            .then(data => {
                // Filter only RESTAURANT type items that are available
                const restaurantItems = Array.isArray(data)
                    ? data.filter((item: any) => item.menu_type === 'RESTAURANT' && item.available !== false)
                    : [];
                setMenuItems(restaurantItems);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = useMemo(() => {
        return ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
    }, [menuItems]);

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [menuItems, activeCategory, searchQuery]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading our restaurant menu...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-card/30 p-4 rounded-2xl border border-border/50">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${activeCategory === cat
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-accent text-muted-foreground hover:bg-accent/80'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search restaurant items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-accent border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Menu Grid */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-xl">No dishes found matching your search.</p>
                    <button
                        onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                        className="mt-4 text-primary hover:underline transition-all"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ y: -6 }}
                                className="group bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 hover:border-primary/50 transition-all flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={sanitizeImageUrl(item.image)}
                                        alt={item.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
                                        }}
                                    />
                                    {/* Price badge */}
                                    {!item.variant_prices && (
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full border border-white/20">
                                            ₹{item.price}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors pr-2">
                                            {item.name}
                                        </h3>
                                        {item.isVeg ? (
                                            <Leaf size={16} className="text-green-500 mt-1 shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 border border-red-500 flex items-center justify-center shrink-0 mt-1">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground text-xs line-clamp-2 mb-4">
                                        {item.description || 'A delicious dish crafted with care.'}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-border/40">
                                        {item.variant_prices && Object.entries(item.variant_prices).map(([k, v]: any) => (
                                            <div key={k} className="flex justify-between text-sm mb-1">
                                                <span className="text-muted-foreground uppercase text-[10px] font-bold">{k}</span>
                                                <span className="font-black text-primary">₹{v}</span>
                                            </div>
                                        ))}
                                        {!item.variant_prices && (
                                            <div className="text-right font-black text-xl text-primary">₹{item.price}</div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default MenuSection;
