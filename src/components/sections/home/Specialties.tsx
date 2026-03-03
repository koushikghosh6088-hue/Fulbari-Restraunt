"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Coffee, Wine, Cake, X, Leaf } from "lucide-react";
import { type Category } from "@/data/menu";
import { sanitizeImageUrl } from "@/lib/utils";

// Category configuration with icons and precise database mapping
const categoryConfig = [
    {
        icon: Utensils,
        label: "Main Course",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop",
        menuCategories: ["Indian Main Course"] as Category[],
        menuType: "RESTAURANT",
    },
    {
        icon: Coffee,
        label: "Breakfast",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400&auto=format&fit=crop",
        menuCategories: ["Breakfast"] as Category[],
        menuType: "CAFE",
    },
    {
        icon: Wine,
        label: "Drinks",
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400&auto=format&fit=crop",
        menuCategories: ["Beverages"] as Category[],
        // Any menu type
    },
    {
        icon: Cake,
        label: "Desserts",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop",
        menuCategories: ["Desserts", "Ice Cream"] as Category[],
        menuType: "RESTAURANT",
    },
];

export function Specialties() {
    const [selectedCategory, setSelectedCategory] = useState<typeof categoryConfig[number] | null>(null);
    const [liveMenu, setLiveMenu] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/menu")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLiveMenu(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load live menu for specialties", err);
                setLoading(false);
            });
    }, []);

    // Dynamically calculate counts and filter items
    const categoriesWithCounts = useMemo(() => {
        return (categoryConfig as any[]).map(cat => {
            const items = liveMenu.filter(item => {
                const categoryMatch = (cat.menuCategories as string[]).includes(item.category);
                const typeMatch = cat.menuType ? item.menu_type === cat.menuType : true;
                return categoryMatch && typeMatch && item.available !== false;
            });
            return {
                ...cat,
                count: items.length > 0 ? `${items.length}+ Items` : "Items coming soon",
                items: items
            };
        });
    }, [liveMenu]);

    const activeCategoryData = selectedCategory
        ? categoriesWithCounts.find(c => c.label === selectedCategory.label)
        : null;

    const filteredItems = activeCategoryData?.items || [];

    return (
        <>
            <section className="py-12 md:py-20 bg-background relative overflow-hidden">
                {/* Minimalist Brand Accents */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                        {/* 1. The Compact Header Block (cols 1-5) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 w-full space-y-6"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="h-[1px] w-6 bg-primary" />
                                    <span className="text-primary font-heading italic text-xs uppercase tracking-widest">Our Categories</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading tracking-tighter leading-[0.9]">
                                    Explore <br />
                                    <span className="text-primary">Our Cuisine</span>
                                </h2>
                            </div>

                            {/* Ultra-Boutique Bengali Callout */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-sm rounded-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                                <div className="relative p-5 rounded-xl bg-card/40 border border-primary/10 backdrop-blur-md">
                                    <p className="text-foreground font-bengali-logo text-base md:text-lg leading-relaxed font-bold italic">
                                        চাইনিজ, তন্দুরি থেকে শুরু করে ইন্ডিয়ার—প্রতিটি পদ আমাদের অভিজ্ঞ শেফদের নিপুণ হাতের ছোঁয়ায় তৈরি। আমাদের বিশেষ চিকেন রেশমি বাটার মাসালা এবং জিভে জল আনা তন্দুরি আইটেমগুলো চেখে দেখতে ভুলবেন না।
                                    </p>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                                Experience <span className="text-foreground font-semibold">"Proshantir Neer"</span> with our signature <span className="text-primary font-bold">Chicken Reshmi Butter Masala</span>—crafted by masters.
                            </p>

                            <div className="flex flex-wrap gap-4 items-center">
                                <Link href="/menu">
                                    <Button className="rounded-full px-8 py-6 font-black uppercase tracking-widest group shadow-[0_10px_30px_rgba(var(--primary),0.2)]">
                                        View Full Menu
                                    </Button>
                                </Link>
                                <div className="hidden md:flex flex-col border-l border-primary/20 pl-4">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Serving</span>
                                    <span className="text-sm font-black text-primary">Indian • Chinese • Tandoori</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. The Visual Grid Block (cols 6-12) */}
                        <div className="lg:col-span-7 w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-2 gap-3 md:gap-4"
                            >
                                {categoriesWithCounts.map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        onClick={() => setSelectedCategory(item)}
                                        className="relative bg-card/60 rounded-2xl overflow-hidden hover:bg-primary/[0.08] border border-primary/5 hover:border-primary/30 transition-all duration-500 cursor-pointer group shadow-lg h-[180px] md:h-[220px]"
                                    >
                                        {/* Category Visual */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={sanitizeImageUrl(item.image)}
                                                alt={item.label}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                        </div>

                                        {/* Minimal Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-black font-heading text-lg md:text-xl group-hover:text-primary transition-colors leading-tight">{item.label}</h4>
                                                <div className="p-2 rounded-full bg-primary/20 backdrop-blur-md text-primary group-hover:bg-primary group-hover:text-white transition-all scale-75 group-hover:scale-100">
                                                    <item.icon size={16} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="h-[2px] w-4 bg-primary rounded-full" />
                                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{item.count}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Popup Modal */}
            <AnimatePresence mode="wait">
                {selectedCategory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                        onClick={() => setSelectedCategory(null)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ duration: 0.3, type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="relative h-40 md:h-48 overflow-hidden">
                                <Image
                                    src={sanitizeImageUrl(selectedCategory.image)}
                                    alt={selectedCategory.label}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                                <div className="absolute bottom-4 left-6 z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                            <selectedCategory.icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold font-heading text-foreground">{selectedCategory.label}</h3>
                                            <p className="text-sm text-muted-foreground">{activeCategoryData?.count}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors z-20 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Items List */}
                            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(85vh-12rem)] custom-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {filteredItems.map((item: any, index: number) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex gap-4 p-3 rounded-xl bg-background border border-border/30 hover:border-primary/30 hover:shadow-md transition-all group"
                                        >
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                                <img
                                                    src={sanitizeImageUrl(item.image)}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        console.error(`Specialty item image failed: ${target.src}`);
                                                        target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                                                    {item.isVeg && (
                                                        <Leaf size={12} className="text-green-500 shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{item.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-primary font-bold text-sm">₹{item.price}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {filteredItems.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>No items found in this category.</p>
                                    </div>
                                )}

                                {/* View Full Menu Link */}
                                <div className="mt-6 text-center">
                                    <Link href="/menu" onClick={() => setSelectedCategory(null)}>
                                        <Button variant="outline" size="sm">View Full Menu →</Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
