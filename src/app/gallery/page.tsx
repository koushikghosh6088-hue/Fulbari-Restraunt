"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

const galleryImages = [
    { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop", type: "Interior" },
    { src: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=2030&auto=format&fit=crop", type: "Food" },
    { src: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1970&auto=format&fit=crop", type: "Interior" },
    { src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2074&auto=format&fit=crop", type: "Food" },
    { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop", type: "Ambience" },
    { src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop", type: "Interior" },
    { src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974&auto=format&fit=crop", type: "Food" },
    { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop", type: "Food" },
    { src: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?q=80&w=2069&auto=format&fit=crop", type: "Interior" },
    { src: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1971&auto=format&fit=crop", type: "Food" },
    { src: "https://images.unsplash.com/photo-1525755662778-989d966695cc?q=80&w=1974&auto=format&fit=crop", type: "Food" },
    { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop", type: "Events" },
];

const filterTabs = ["All", "Interior", "Food", "Ambience", "Events"];

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredImages = activeFilter === "All"
        ? galleryImages
        : galleryImages.filter((img) => img.type === activeFilter);

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
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {filteredImages.map((img, idx) => (
                        <motion.div
                            key={`${img.src}-${idx}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            className="break-inside-avoid rounded-2xl overflow-hidden relative group"
                        >
                            <Image
                                src={img.src}
                                alt={`${img.type} - Gallery image ${idx + 1}`}
                                width={600}
                                height={idx % 3 === 0 ? 900 : 600}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-heading text-xl bg-primary/80 px-4 py-2 rounded-full">{img.type}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
