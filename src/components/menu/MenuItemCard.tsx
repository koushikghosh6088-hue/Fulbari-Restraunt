import React, { useMemo } from 'react';
import Image from 'next/image';

interface MenuItemCardProps {
    item: any;
    filter: 'All' | 'Veg' | 'Non-Veg';
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, filter }) => {
    // Extract variants (keys that aren't name or descriptions)
    const variants = useMemo(() => {
        if (item.displayedVariants) {
            return Object.entries(item.displayedVariants).map(([key, value]) => ({
                label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                price: value as number,
                type: (['egg', 'eggChicken', 'mixed', 'basa', 'bhetki'].includes(key) ? 'nonVeg' : 'all')
            }));
        }

        const skipKeys = ['name', 'description', 'category', 'isVeg', 'available', 'menu_type', 'price', 'img', 'displayedPrice', 'forcedType', 'displayedVariants'];
        return Object.entries(item)
            .filter(([key]) => !skipKeys.includes(key))
            .map(([key, value]) => ({
                label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                price: value as number,
                type: (key === 'veg' ? 'veg' : (['nonVeg', 'egg', 'eggChicken', 'mixed', 'basa', 'bhetki'].includes(key) ? 'nonVeg' : 'all'))
            }));
    }, [item]);

    // Use forced display price if available
    const displayPrice = item.displayedPrice || item.price;

    const filteredVariants = useMemo(() => {
        if (filter === 'All') return variants;
        if (filter === 'Veg') return variants.filter(v => v.type === 'veg' || v.type === 'all');
        return variants.filter(v => v.type === 'nonVeg' || v.type === 'all');
    }, [variants, filter]);

    // Optimized image sourcing
    const imageUrl = useMemo(() => {
        const searchTerms = [item.name, 'food', 'restaurant'].join(' ');
        // Using a stable placeholder or a mapping would be better, but let's use a themed Unsplash search logic
        // For a real production app, we'd have a fixed mapping.
        const query = encodeURIComponent(item.name.split(' (')[0]);
        return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop`; // Fallback base
        // In a dynamic implementation, we'd use a search API or pre-defined IDs.
        // I'll provide a mapping utility in the next step.
    }, [item.name]);

    // Helper for dynamic image mapping based on name keywords
    const getDynamicImage = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('soup')) return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800';
        if (n.includes('biryani')) return 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800';
        if (n.includes('paneer')) return 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800';
        if (n.includes('chicken')) return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800';
        if (n.includes('noodle')) return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800';
        if (n.includes('shake') || n.includes('drink') || n.includes('mojito')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800';
        if (n.includes('rice')) return 'https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800';
        if (n.includes('mutton')) return 'https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=800';
        if (n.includes('fish') || n.includes('prawn')) return 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=800';
        if (n.includes('ice cream')) return 'https://images.unsplash.com/photo-1501443762994-82bd5dabb892?q=80&w=800';
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800';
    };

    const currentImage = getDynamicImage(item.name);

    return (
        <div className="group bg-zinc-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800 transition-all duration-500 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] flex h-32 sm:h-40">
            {/* Image Side */}
            <div className="relative w-32 sm:w-40 h-full overflow-hidden shrink-0">
                <img
                    src={currentImage}
                    alt={item.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/80"></div>
            </div>

            {/* Content Side */}
            <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm sm:text-base font-semibold text-zinc-100 truncate pr-2 group-hover:text-amber-400 transition-colors">
                        {item.name}
                    </h3>
                    {displayPrice && (
                        <span className="text-amber-500 font-bold whitespace-nowrap text-sm sm:text-base">
                            ₹{displayPrice}
                        </span>
                    )}
                </div>

                {/* Variants */}
                {filteredVariants.length > 0 && !displayPrice && (
                    <div className="space-y-1 mt-1">
                        {filteredVariants.map((variant, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                                <span className="text-zinc-400 font-medium">{variant.label}</span>
                                <span className="text-amber-500/90 font-semibold ml-2">₹{variant.price as any}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-auto flex items-center space-x-2">
                    {/* Subtle veg/non-veg indicator based on item forced type or name */}
                    {item.forcedType === 'Non-Veg' || item.name.toLowerCase().includes('chicken') || item.name.toLowerCase().includes('mutton') || item.name.toLowerCase().includes('fish') || item.name.toLowerCase().includes('non-veg') ? (
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
                    ) : (
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                    )}
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                        Fulbari Taste
                    </span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(MenuItemCard);
