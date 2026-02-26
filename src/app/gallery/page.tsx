"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { sanitizeImageUrl } from "@/lib/utils";

interface GalleryItem {
    id: string;
    url: string;
    category: 'Cafe' | 'Restaurant' | 'Ambience' | 'Food' | 'Other';
    created_at: string;
}

const filterTabs = ["All", "Cafe", "Restaurant", "Ambience", "Food", "Other"];

const galleryData: GalleryItem[] = [
    // --- CAFE ---
    { id: "cafe-1", url: "/gallery-images/cafe-1.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },
    { id: "cafe-2", url: "/gallery-images/cafe-2.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },
    { id: "cafe-3", url: "/gallery-images/cafe-3.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },
    { id: "cafe-4", url: "/gallery-images/cafe-4.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },
    { id: "cafe-5", url: "/gallery-images/cafe-5.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },
    { id: "cafe-6", url: "/gallery-images/cafe-6.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },
    { id: "cafe-7", url: "/gallery-images/cafe-7.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },
    { id: "cafe-8", url: "/gallery-images/cafe-8.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },
    { id: "cafe-9", url: "/gallery-images/cafe-9.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },
    { id: "cafe-10", url: "/gallery-images/cafe-10.jpg", category: "Cafe", created_at: "2024-01-01T00:00:00Z" },

    // --- RESTAURANT ---
    { id: "restaurant-1", url: "/gallery-images/restaurant-1.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },
    { id: "restaurant-2", url: "/gallery-images/restaurant-2.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },
    { id: "restaurant-3", url: "/gallery-images/restaurant-3.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },
    { id: "restaurant-4", url: "/gallery-images/restaurant-4.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },
    { id: "restaurant-5", url: "/gallery-images/restaurant-5.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },
    { id: "restaurant-6", url: "/gallery-images/restaurant-6.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },
    { id: "restaurant-7", url: "/gallery-images/restaurant-7.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },
    { id: "restaurant-8", url: "/gallery-images/restaurant-8.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },
    { id: "restaurant-9", url: "/gallery-images/restaurant-9.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },
    { id: "restaurant-10", url: "/gallery-images/restaurant-10.jpg", category: "Restaurant", created_at: "2024-01-01T00:00:00Z" },

    // --- AMBIENCE ---
    { id: "ambience-1", url: "/gallery-images/ambience-1.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },
    { id: "ambience-2", url: "/gallery-images/ambience-2.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },
    { id: "ambience-3", url: "/gallery-images/ambience-3.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },
    { id: "ambience-4", url: "/gallery-images/ambience-4.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },
    { id: "ambience-5", url: "/gallery-images/ambience-5.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },
    { id: "ambience-6", url: "/gallery-images/ambience-6.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },
    { id: "ambience-7", url: "/gallery-images/ambience-7.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },
    { id: "ambience-8", url: "/gallery-images/ambience-8.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },
    { id: "ambience-9", url: "/gallery-images/ambience-9.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },
    { id: "ambience-10", url: "/gallery-images/ambience-10.jpg", category: "Ambience", created_at: "2024-01-01T00:00:00Z" },

    // --- FOOD ---
    { id: "food-1", url: "/gallery-images/food-1.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },
    { id: "food-2", url: "/gallery-images/food-2.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },
    { id: "food-3", url: "/gallery-images/food-3.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },
    { id: "food-4", url: "/gallery-images/food-4.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },
    { id: "food-5", url: "/gallery-images/food-5.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },
    { id: "food-6", url: "/gallery-images/food-6.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },
    { id: "food-7", url: "/gallery-images/food-7.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },
    { id: "food-8", url: "/gallery-images/food-8.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },
    { id: "food-9", url: "/gallery-images/food-9.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },
    { id: "food-10", url: "/gallery-images/food-10.jpg", category: "Food", created_at: "2024-01-01T00:00:00Z" },

    // --- OTHER ---
    { id: "other-1", url: "/gallery-images/other-1.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" },
    { id: "other-2", url: "/gallery-images/other-2.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" },
    { id: "other-3", url: "/gallery-images/other-3.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" },
    { id: "other-4", url: "/gallery-images/other-4.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" },
    { id: "other-5", url: "/gallery-images/other-5.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" },
    { id: "other-6", url: "/gallery-images/other-6.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" },
    { id: "other-7", url: "/gallery-images/other-7.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" },
    { id: "other-8", url: "/gallery-images/other-8.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" },
    { id: "other-9", url: "/gallery-images/other-9.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" },
    { id: "other-10", url: "/gallery-images/other-10.jpg", category: "Other", created_at: "2024-01-01T00:00:00Z" }
];

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load the static data
        setGalleryItems(galleryData);
        setLoading(false);
    }, []);

    const filteredImages = activeFilter === "All"
        ? galleryItems
        : galleryItems.filter((img) => img.category === activeFilter);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Header with Background Image */}
            <section className="pt-24 md:pt-32 pb-8 md:pb-12 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"
                        alt="Gallery ambiance"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <h1 className="text-2xl md:text-4xl font-bold font-heading mb-3 text-foreground">Our Gallery</h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8">
                        A glimpse into our world of elegance and taste.
                    </p>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 justify-center flex-wrap">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === tab
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-accent text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </section>

            <section className="container mx-auto px-4 pb-24 flex-grow">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <p className="text-muted-foreground animate-pulse">Loading gallery...</p>
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No images found in this category.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredImages.map((img, idx) => (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className="break-inside-avoid rounded-2xl overflow-hidden relative group shadow-lg"
                            >
                                <div className="relative w-full h-full">
                                    <img
                                        src={sanitizeImageUrl(img.url)}
                                        alt={`${img.category} at Fulbari Restaurant - Gallery item`}
                                        loading={idx < 4 ? "eager" : "lazy"}
                                        className="w-full h-auto min-h-[200px] object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            console.error(`Gallery image failed: ${target.src}`);
                                            target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop';
                                        }}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-heading text-lg font-bold bg-primary/80 px-4 py-2 rounded-full ring-2 ring-white/20 backdrop-blur-sm">
                                        {img.category}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}
