"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GalleryItem {
    id: string;
    url: string;
    category: 'Cafe' | 'Restaurant' | 'Ambience' | 'Food' | 'Other';
    created_at: string;
}

const filterTabs = ["All", "Cafe", "Restaurant", "Ambience", "Food", "Other"];

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                setGalleryItems(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch gallery:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
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
                                    <Image
                                        src={img.url}
                                        alt={`${img.category} - Gallery image ${idx + 1}`}
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                        unoptimized={img.url.startsWith('http')} // Optimization fallback for external URLs
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
