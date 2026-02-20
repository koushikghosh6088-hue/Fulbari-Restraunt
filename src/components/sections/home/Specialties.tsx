"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Coffee, Wine, Cake, X, Leaf } from "lucide-react";
import { menuItems, type Category } from "@/data/menu";

const categories = [
    {
        icon: Utensils,
        label: "Main Course",
        count: "40+ Items",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop",
        menuCategories: ["Bengali", "Indian", "Chinese"] as Category[],
    },
    {
        icon: Coffee,
        label: "Breakfast",
        count: "15+ Items",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400&auto=format&fit=crop",
        menuCategories: ["Starters"] as Category[],
    },
    {
        icon: Wine,
        label: "Drinks",
        count: "20+ Items",
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=400&auto=format&fit=crop",
        menuCategories: ["Drinks"] as Category[],
    },
    {
        icon: Cake,
        label: "Desserts",
        count: "10+ Items",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop",
        menuCategories: ["Desserts"] as Category[],
    },
];

export function Specialties() {
    const [selectedCategory, setSelectedCategory] = useState<typeof categories[number] | null>(null);

    const getFilteredItems = () => {
        if (!selectedCategory) return [];
        return menuItems.filter((item) =>
            selectedCategory.menuCategories.includes(item.category)
        );
    };

    return (
        <>
            <section className="py-20 bg-card">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary font-heading italic text-lg mb-2 block">Our Categories</span>
                            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-5">Explore Our Cuisine</h2>
                            <p className="text-muted-foreground text-base mb-7 leading-relaxed">
                                From hearty breakfasts to elegant dinners, we offer a wide range of culinary delights. Our specialties include authentic Bengali dishes, spicy Chinese stir-frys, and rich Indian curries.
                            </p>

                            {/* Category Image */}
                            <div className="relative h-[220px] md:h-[260px] rounded-2xl overflow-hidden mb-8 group">
                                <Image
                                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2074&auto=format&fit=crop"
                                    alt="Varieties of food served at Fulbari"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full text-primary-foreground text-sm font-medium">
                                        Multi-Cuisine Specialties
                                    </span>
                                </div>
                            </div>

                            <Link href="/menu">
                                <Button variant="outline" size="lg">View Full Menu</Button>
                            </Link>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-6">
                            {categories.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    onClick={() => setSelectedCategory(item)}
                                    className="bg-background rounded-xl overflow-hidden hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all cursor-pointer group hover:shadow-lg hover:shadow-primary/10"
                                >
                                    {/* Category Thumbnail */}
                                    <div className="relative h-28 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.label}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                                    </div>
                                    <div className="p-4 flex flex-col items-center text-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-card shadow-inner flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary -mt-10 relative z-10 border-2 border-background">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">{item.label}</h4>
                                            <span className="text-sm text-muted-foreground">{item.count}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Popup Modal */}
            <AnimatePresence>
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
                                    src={selectedCategory.image}
                                    alt={selectedCategory.label}
                                    fill
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
                                            <p className="text-sm text-muted-foreground">{selectedCategory.count}</p>
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
                                    {getFilteredItems().map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex gap-4 p-3 rounded-xl bg-background border border-border/30 hover:border-primary/30 hover:shadow-md transition-all group"
                                        >
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
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
                                                    {item.isBestseller && (
                                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">Bestseller</span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {getFilteredItems().length === 0 && (
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
