import React, { useMemo } from 'react';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { sanitizeImageUrl } from '@/lib/utils';

const MenuItemCard = ({ item }: { item: any }) => {
    // Determine image based on keywords dynamically
    const getFoodImage = (name: string) => {
        const lower = (name || "").toLowerCase();
        if (lower.includes('soup')) return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('chicken')) return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('mutton')) return 'https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('paneer')) return 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('rice') || lower.includes('biryani') || lower.includes('pulao')) return 'https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('noodle') || lower.includes('mein') || lower.includes('chop suey')) return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('fish') || lower.includes('prawn')) return 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('ice cream')) return 'https://images.unsplash.com/photo-1501443762994-82bd5dabb892?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('shake') || lower.includes('drink') || lower.includes('mojito') || lower.includes('soda') || lower.includes('lassi') || lower.includes('cold coffee')) return 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('salad')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('raita') || lower.includes('curd')) return 'https://images.unsplash.com/photo-1588674917454-e6995cd7b973?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('roti') || lower.includes('naan') || lower.includes('kulcha')) return 'https://images.unsplash.com/photo-1606850244622-c24097f48baf?q=80&w=800&auto=format&fit=crop';
        if (lower.includes('fry') || lower.includes('potato') || lower.includes('corn')) return 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?q=80&w=800&auto=format&fit=crop';

        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
    };

    // Explicitly check item.isVeg, if not available fallback to name detection
    const isVeg = useMemo(() => {
        if (item.isVeg !== undefined && item.isVeg !== null) return item.isVeg;
        const n = (item.name || "").toLowerCase();
        if (n.includes('chicken') || n.includes('mutton') || n.includes('fish') || n.includes('prawn') || n.includes('egg') || item.nonVeg || item.egg || item.eggChicken || item.basa || item.bhetki) return false;
        return true;
    }, [item]);

    // Check if there are exact prices or variant prices
    const hasMultiplePrices = item.variant_prices && Object.keys(item.variant_prices).length > 0;

    const priceEntries = useMemo(() => {
        if (!hasMultiplePrices) return [];
        return Object.entries(item.variant_prices).filter(([k]) => k !== 'name' && k !== 'price');
    }, [item, hasMultiplePrices]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -6 }}
            className="group bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 hover:border-primary/50 transition-all flex flex-col h-full"
        >
            <div className="relative h-32 sm:h-48 overflow-hidden bg-zinc-900 shrink-0">
                <img
                    src={item.image ? sanitizeImageUrl(item.image) : getFoodImage(item.name)}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (item.image && !target.src.includes('unsplash.com')) {
                            target.src = getFoodImage(item.name);
                        }
                    }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {!hasMultiplePrices && item.price !== undefined && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full border border-white/20">
                        ₹{item.price}
                    </div>
                )}
            </div>

            <div className="p-3 sm:p-4 flex-grow flex flex-col bg-card relative z-10">
                <div className="flex justify-between items-start gap-1.5 mb-1.5">
                    <h3 className="font-heading font-bold text-sm sm:text-lg text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                        {item.name}
                    </h3>
                    <div className="shrink-0 mt-1">
                        {isVeg ? (
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center border border-green-500 rounded-sm bg-white/5">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                            </div>
                        ) : (
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center border border-red-500 rounded-sm bg-white/5">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-3 border-t border-border/40">
                    {hasMultiplePrices ? (
                        <div className="space-y-1">
                            {priceEntries.map(([variant, price]: any) => (
                                <div key={variant} className="flex justify-between items-center text-[10px] sm:text-sm">
                                    <span className="text-muted-foreground font-bold uppercase tracking-wider text-[8px] sm:text-[10px]">
                                        {variant.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                    <span className="font-black text-primary">₹{price}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-end items-center">
                            <span className="font-black text-base sm:text-xl text-primary">₹{item.price}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(MenuItemCard);
