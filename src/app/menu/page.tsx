"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Category } from "@/data/menu";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Leaf, Utensils, Loader2, ArrowLeft } from "lucide-react";
import { cn, sanitizeImageUrl } from "@/lib/utils";
import { GoogleReviewModal } from "@/components/common/GoogleReviewModal";
import MenuSection from "@/components/menu/MenuSection";

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMenuTab, setActiveMenuTab] = useState<"RESTAURANT" | "CAFE">("RESTAURANT");
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        // Logic for showing Review Modal once per session (using localStorage as requested)
        const hasSeenModal = localStorage.getItem("hasSeenReviewModal");

        if (!hasSeenModal) {
            // Trigger 1: 20 seconds timer
            const timer = setTimeout(() => {
                triggerModal();
            }, 20000);

            // Trigger 2: 60% scroll depth
            const handleScroll = () => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercentage = (window.scrollY / scrollHeight) * 100;

                if (scrollPercentage >= 60) {
                    triggerModal();
                    window.removeEventListener("scroll", handleScroll);
                }
            };

            const triggerModal = () => {
                setShowReviewModal(true);
                localStorage.setItem("hasSeenReviewModal", "true");
                clearTimeout(timer);
                window.removeEventListener("scroll", handleScroll);
            };

            window.addEventListener("scroll", handleScroll);

            return () => {
                clearTimeout(timer);
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, []);

    useEffect(() => {
        fetch("/api/menu")
            .then(res => res.json())
            .then(data => {
                setMenuItems(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load menu", err);
                setLoading(false);
            });
    }, []);

    // Derive categories dynamically from data based on active menu tab
    const filteredByMenuType = menuItems.filter(item => (item.menu_type || "RESTAURANT") === activeMenuTab);
    const categories = ["All", ...Array.from(new Set(filteredByMenuType.map(item => item.category)))];

    // Reset sub-category if it doesn't exist in the new menu type
    useEffect(() => {
        if (activeCategory !== "All" && !categories.includes(activeCategory)) {
            setActiveCategory("All");
        }
    }, [activeMenuTab, categories, activeCategory]);

    // Filter logic - Only show available items
    const filteredItems = filteredByMenuType.filter((item) => {
        const isAvailable = item.available !== false;
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return isAvailable && matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <GoogleReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
            />

            <Navbar />

            {/* Menu Header */}
            <section className="pt-24 md:pt-32 pb-8 md:pb-12 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={activeMenuTab === "RESTAURANT"
                            ? "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2074&auto=format&fit=crop"
                            : "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop"
                        }
                        alt="Menu background"
                        fill
                        priority
                        className="object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 container mx-auto px-4"
                >
                    <Link href="/" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all mb-4 md:mb-6">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold font-heading mb-3 text-foreground tracking-tight">
                        Fulbari <span className="text-primary">{activeMenuTab === "RESTAURANT" ? "Restaurant" : "Cafe"}</span> Menu
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto uppercase tracking-widest font-bold opacity-80">
                        {activeMenuTab === "RESTAURANT"
                            ? "Traditional Flavors & Fine Dining"
                            : "Quick Bites, Beverages & Comfort Food"
                        }
                    </p>
                </motion.div>
            </section>

            {/* Menu Tab Switcher */}
            <div className="container mx-auto px-4 mb-4 relative z-20">
                <div className="flex bg-card p-1.5 rounded-2xl border border-border w-full max-w-md mx-auto shadow-xl">
                    <button
                        onClick={() => setActiveMenuTab("RESTAURANT")}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                            activeMenuTab === "RESTAURANT"
                                ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                    >
                        Restaurant Menu
                    </button>
                    <button
                        onClick={() => setActiveMenuTab("CAFE")}
                        className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                            activeMenuTab === "CAFE"
                                ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                    >
                        Cafe Menu
                    </button>
                </div>
            </div>

            {/* Our Mission Block - Optional hidden on mobile to save space if needed, but keeping for now */}
            <div className="container mx-auto px-4 mb-8 relative z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="py-6 px-8 rounded-3xl bg-primary/5 border border-primary/20 text-center relative overflow-hidden backdrop-blur-sm"
                >
                    <p className="text-sm md:text-lg font-bengali font-bold italic text-foreground max-w-4xl mx-auto leading-relaxed">
                        {activeMenuTab === "RESTAURANT"
                            ? "\"ফুলবাড়ি রেস্তোরাঁতে আমরা কেবল খাবার পরিবেশন করি না, আমরা স্মৃতি তৈরি করি।\""
                            : "\"ফুলবাড়ি ক্যাফেতে প্রতিটি চুমুক এবং প্রতিটি কামড় আপনাকে তরতাজা করে তুলবে।\""
                        }
                    </p>
                </motion.div>
            </div>

            {/* New Dynamic Menu Section */}
            <section className="flex-grow bg-zinc-950/20 py-8">
                {activeMenuTab === "RESTAURANT" ? (
                    <MenuSection />
                ) : (
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                <p className="text-muted-foreground animate-pulse">Loading our delicious cafe menu...</p>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground text-xl">No dishes found matching your search.</p>
                                <Button variant="link" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Legacy Controls for Cafe (if still needed) */}
                                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-card/30 p-4 rounded-2xl border border-border/50">
                                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat)}
                                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${activeCategory === cat
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-accent text-muted-foreground hover:bg-accent/80"
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
                                            placeholder="Search cafe items..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-full bg-accent border-transparent outline-none"
                                        />
                                    </div>
                                </div>
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {filteredItems.map((item, idx) => (
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
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={sanitizeImageUrl(item.image)}
                                                        alt={item.name}
                                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    {!item.variant_prices && (
                                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full border border-white/20">
                                                            ₹{item.price}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 flex-grow flex flex-col">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors pr-2">
                                                            {item.name}
                                                        </h3>
                                                        {item.isVeg ? <Leaf size={16} className="text-green-500 mt-1" /> : <div className="w-4 h-4 border border-red-500 flex items-center justify-center shrink-0 mt-1"><div className="w-2 h-2 rounded-full bg-red-500" /></div>}
                                                    </div>
                                                    <p className="text-muted-foreground text-xs line-clamp-2 mb-4">
                                                        {item.description}
                                                    </p>
                                                    <div className="mt-auto pt-4 border-t border-border/40">
                                                        {item.variant_prices && Object.entries(item.variant_prices).map(([k, v]: any) => (
                                                            <div key={k} className="flex justify-between text-sm mb-1">
                                                                <span className="text-muted-foreground uppercase text-[10px] font-bold">{k}</span>
                                                                <span className="font-black text-primary">₹{v}</span>
                                                            </div>
                                                        ))}
                                                        {!item.variant_prices && <div className="text-right font-black text-xl text-primary">₹{item.price}</div>}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            </>
                        )}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
