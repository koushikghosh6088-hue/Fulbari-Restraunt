"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const specialItems = [
    {
        id: 1,
        name: "Special Thali",
        category: "Bengali",
        description: "Authentic Bengali platter with fish curry, daal, and sweets.",
        price: "₹350",
        rating: 5,
        image: "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 2,
        name: "Dragon Chicken",
        category: "Chinese",
        description: "Spicy and tangy chicken stir-fry with peppers.",
        price: "₹280",
        rating: 5,
        image: "https://images.unsplash.com/photo-1626645738196-c2a98d2c3b89?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 3,
        name: "Paneer Tikka",
        category: "Indian",
        description: "Marinated cottage cheese grilled to perfection.",
        price: "₹240",
        rating: 4,
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 4,
        name: "Ilish Bhapa",
        category: "Bengali",
        description: "Hilsa fish steamed in mustard sauce, a Bengali classic.",
        price: "₹450",
        rating: 5,
        image: "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 5,
        name: "Chilli Prawns",
        category: "Chinese",
        description: "Crispy prawns tossed in a fiery chilli sauce.",
        price: "₹320",
        rating: 4,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: 6,
        name: "Gulab Jamun",
        category: "Desserts",
        description: "Soft milk dumplings soaked in rose-flavored sugar syrup.",
        price: "₹80",
        rating: 5,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=400&auto=format&fit=crop",
    },
];

export function TopFlavours() {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <section className="py-10 md:py-14 bg-card/50">
                <div className="container mx-auto px-4">
                    {/* Compact Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between mb-6 md:mb-8"
                    >
                        <div>
                            <span className="text-primary font-heading italic text-sm md:text-base mb-1 block">Special Menu</span>
                            <h2 className="text-xl md:text-2xl font-bold font-heading">Today&apos;s Special</h2>
                        </div>
                        <button
                            onClick={() => setShowPopup(true)}
                            className="inline-flex items-center text-primary text-sm font-medium hover:underline underline-offset-4 gap-1 cursor-pointer"
                        >
                            View All <ArrowRight size={14} />
                        </button>
                    </motion.div>

                    {/* Horizontal Scrolling on Mobile, Grid on Desktop */}
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-6 md:overflow-visible">
                        {specialItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{ y: -5 }}
                                className="min-w-[140px] md:min-w-0 group bg-card rounded-xl overflow-hidden border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
                            >
                                <div className="relative h-28 md:h-32 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-primary text-xs font-bold">
                                        {item.price}
                                    </div>
                                </div>

                                <div className="p-3">
                                    <h3 className="text-sm font-bold font-heading group-hover:text-primary transition-colors truncate">{item.name}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-muted-foreground">{item.category}</span>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "text-yellow-500" : "text-muted"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Items Popup */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                        onClick={() => setShowPopup(false)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ duration: 0.3, type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-border">
                                <div>
                                    <span className="text-primary font-heading italic text-sm">Special Menu</span>
                                    <h3 className="text-xl font-bold font-heading">Today&apos;s Special Items</h3>
                                </div>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="w-9 h-9 rounded-full bg-muted/50 hover:bg-primary/20 border border-border/50 hover:border-primary/30 flex items-center justify-center text-foreground transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Items Grid */}
                            <div className="p-5 overflow-y-auto max-h-[calc(85vh-5rem)] custom-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {specialItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.06 }}
                                            className="flex gap-4 p-3 rounded-xl bg-background border border-border/30 hover:border-primary/30 hover:shadow-md transition-all group"
                                        >
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                                                    <span className="text-primary font-bold text-sm shrink-0 ml-2">{item.price}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{item.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{item.category}</span>
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={10} fill={i < item.rating ? "currentColor" : "none"} className={i < item.rating ? "text-yellow-500" : "text-muted"} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
