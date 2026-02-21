"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { menuItems, Category } from "@/data/menu";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Leaf, Utensils } from "lucide-react";

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [searchQuery, setSearchQuery] = useState("");

    const categories: Category[] = ["All", "Bengali", "Indian", "Chinese", "Starters", "Drinks", "Desserts"];

    // Filter logic
    const filteredItems = menuItems.filter((item) => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Menu Header */}
            <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2074&auto=format&fit=crop"
                        alt="Delicious food spread"
                        fill
                        className="object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <h1 className="text-2xl md:text-5xl font-bold font-heading mb-3 text-foreground">Our Menu</h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                        Discover a symphony of flavors prepared with love and tradition.
                        From spicy Bengali curries to comforting Chinese bowls.
                    </p>
                </motion.div>
            </section>

            {/* Our Mission Block */}
            <div className="container mx-auto px-4 -mt-8 mb-12 relative z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-8 md:p-12 rounded-3xl bg-primary/5 border border-primary/20 text-center relative overflow-hidden backdrop-blur-sm"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Utensils size={120} className="text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-heading mb-6 text-primary flex items-center justify-center gap-3">
                        <span className="w-8 h-[1px] bg-primary/30"></span>
                        <span className="font-bengali-logo">আমাদের লক্ষ্য (Our Mission)</span>
                        <span className="w-8 h-[1px] bg-primary/30"></span>
                    </h3>
                    <p className="text-base md:text-xl font-bengali font-bold italic text-foreground max-w-4xl mx-auto leading-relaxed md:leading-loose px-4">
                        "ফুলবাড়ি রেস্তোরাঁতে আমরা কেবল খাবার পরিবেশন করি না, আমরা স্মৃতি তৈরি করি। আমাদের আন্তরিক আতিথেয়তা এবং মানসম্পন্ন খাবার আপনাকে বারবার ফিরে আসতে বাধ্য করবে।"
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="w-12 h-1 bg-primary/20 rounded-full"></div>
                    </div>
                </motion.div>
            </div>

            {/* Controls Section */}
            <section className="sticky top-[56px] md:top-[72px] z-40 bg-background/95 backdrop-blur-md py-4 border-b border-border">
                <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${activeCategory === cat
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-accent text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full bg-accent border-transparent focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground outline-none transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* Menu Grid */}
            <section className="flex-grow py-12 px-4 container mx-auto">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-xl">No dishes found matching your search.</p>
                        <Button variant="link" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ y: -6 }}
                                    className="group bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {item.isBestseller && (
                                            <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-sm shadow-md">
                                                Bestseller
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                                            ₹{item.price}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                                {item.name}
                                            </h3>
                                            {item.isVeg ? (
                                                <span title="Vegetarian">
                                                    <Leaf size={16} className="text-green-500 shrink-0 mt-1" />
                                                </span>
                                            ) : (
                                                <div className="w-4 h-4 border border-red-500 flex items-center justify-center shrink-0 mt-1" title="Non-Veg">
                                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-sm line-clamp-3 flex-grow">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </section>

            <Footer />
        </div>
    );
}
