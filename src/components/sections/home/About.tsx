"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Coffee, Building2, PartyPopper, Users, Clock, MapPin, Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { sanitizeImageUrl, cn } from "@/lib/utils";

type VenueKey = "restaurant" | "cafe" | "community" | "banquet";

interface VenueData {
    icon: any;
    label: string;
    bengaliLabel: string;
    tagline: string;
    description: string;
    highlights: string[];
    capacity: string;
    timing: string;
    images: string[];
    taglineClassName?: string;
    descriptionClassName?: string;
}

const venues: Record<VenueKey, VenueData> = {
    cafe: {
        icon: Coffee,
        label: "Café",
        bengaliLabel: "ক্যাফে",
        tagline: "Brews & Bites",
        description:
            "Unwind with freshly brewed coffee, artisan teas, and light bites in our cozy café corner. Perfect for casual meetups, work sessions, or a quiet afternoon escape.",
        highlights: ["Specialty Coffee", "Fresh Pastries", "Free Wi-Fi", "Cozy Ambience"],
        capacity: "40+ Guests",
        timing: "8:00 AM - 9:00 PM",
        images: [
            "/cafe/cafe1.jpeg",
            "/cafe/cafe2.jpeg",
            "/cafe/cafe3.jpeg",
            "/cafe/cafe4.jpeg",
        ],
    },
    restaurant: {
        icon: Utensils,
        label: "Restaurant",
        bengaliLabel: "রেস্তোরাঁ",
        tagline: "প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা",
        taglineClassName: "font-bengali-logo text-base md:text-lg text-primary font-bold tracking-wide",
        description:
            "আমাদের সবুজ ঘেরা ওপেন-এয়ার গার্ডেন ডাইনিং আপনাকে দেবে এক অসাধারণ অভিজ্ঞতা। খোলা আকাশের নিচে ঝকঝকে আলোকসজ্জার মাঝে প্রিয়জনের সাথে কাটানো সময় হবে সত্যিই স্মরণীয়।",
        descriptionClassName: "font-bengali text-sm md:text-base leading-relaxed font-semibold text-muted-foreground",
        highlights: ["Open-Air Garden Dining", "Live Band ('Nostalgic')", "Signature Reshmi Butter Masala", "Traditional Bengali Thalis"],
        capacity: "120+ Guests",
        timing: "11:00 AM - 10:30 PM",
        images: [
            "/restaurant/r1.jpeg",
            "/restaurant/r2.jpeg",
            "/restaurant/r3.jpeg",
            "/restaurant/r4.jpeg",
            "/restaurant/r5.jpeg",
        ],
    },
    community: {
        icon: Building2,
        label: "Community Hall",
        bengaliLabel: "কমিউনিটি হল",
        tagline: "Celebrate Together",
        description:
            "Our spacious community hall is ideal for cultural events, meetings, seminars, and social gatherings. Equipped with modern amenities and flexible seating arrangements.",
        highlights: ["Projector & Sound", "Flexible Layout", "AC Hall", "Stage Available"],
        capacity: "300+ Guests",
        timing: "Contact for Inquiry",
        images: [
            "/community/community4.jpeg",
            "/community/community2.jpeg",
            "/community/community3.jpeg",
            "/community/community1.jpeg",
            "/community/community5.jpeg",
        ],
    },
    banquet: {
        icon: PartyPopper,
        label: "Food & Events",
        bengaliLabel: "ফুড ও ইভেন্টস",
        tagline: "Weddings & Grand Occasions",
        description:
            "From grand weddings to birthday celebrations, our food provide an elegant setting with premium catering, décor support, and dedicated event coordination.",
        highlights: ["Wedding Packages", "Custom Décor", "Premium Catering", "Event Manager"],
        capacity: "500+ Guests",
        timing: "Contact for Inquiry",
        images: [
            "/food/food3.jpeg",
            "/food/food2.jpeg",
            "/food/food1.jpeg",
            "/food/food4.jpeg",
            "/food/food5.jpeg",
        ],
    },
};

function VenueImageSlider({ images, label }: { images: string[], label: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isPaused, currentIndex, images.length]);

    return (
        <div
            className="relative group rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-black"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] w-full"
                >
                    <Image
                        src={sanitizeImageUrl(images[currentIndex])}
                        alt={`${label} ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Glass Navigation */}
            <div className="absolute inset-x-6 bottom-8 flex items-center justify-between z-20">
                <div className="flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                i === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-white/30"
                            )}
                        />
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-colors">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-colors">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-widest z-10">
                Visual Tour
            </div>
        </div>
    );
}

export function About() {
    const [activeVenue, setActiveVenue] = useState<VenueKey>("cafe");
    const current = venues[activeVenue];
    const IconComponent = current.icon;

    return (
        <section className="relative py-16 md:py-32 overflow-hidden bg-background">
            {/* Cinematic Ambient Background (matches active venue) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`about-bg-${activeVenue}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.05 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 scale-110 blur-[150px] pointer-events-none"
                    style={{
                        backgroundImage: `url(${sanitizeImageUrl(current.images[0])})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                />
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                {/* Section Header - Condensed for Mobile */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:items-end mb-12 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <span className="text-primary font-heading italic text-sm md:text-lg uppercase tracking-widest">About Us</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                            <span className="font-bengali text-muted-foreground/60 text-[10px] md:text-sm">আমাদের সম্পর্কে</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-heading leading-[1.1]">
                            A <span className="text-primary italic">Proshantir Neer</span><br className="hidden md:block" />
                            <span className="md:hidden"> </span>in Serampore
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative p-4 md:p-8 rounded-2xl md:rounded-[2rem] bg-primary/5 border border-primary/10 backdrop-blur-sm"
                    >
                        <Sparkles className="absolute -top-3 -right-3 text-primary animate-pulse" size={24} />
                        <p className="font-bengali italic text-sm md:text-lg leading-relaxed text-center font-semibold text-foreground/90">
                            "ব্যস্ত জীবনের ক্লান্তি ভুলে যদি প্রকৃতির স্নিগ্ধ ছোঁয়ায় সুস্বাদু খাবারের স্বাদ নিতে চান, তবে ফুলবাড়ি রেস্তোরাঁ আপনার জন্য এক আদর্শ গন্তব্য।"
                        </p>
                    </motion.div>
                </div>

                {/* Venue Navigation - Horizontal Scroll on Mobile */}
                <div className="relative mb-12 md:mb-16">
                    <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth snap-x">
                        {(Object.keys(venues) as VenueKey[]).map((key) => {
                            const VIcon = venues[key].icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveVenue(key)}
                                    className={cn(
                                        "group relative px-5 py-2.5 rounded-xl transition-all duration-500 flex items-center gap-3 border shrink-0 snap-start",
                                        activeVenue === key
                                            ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-105"
                                            : "bg-card/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground backdrop-blur-sm"
                                    )}
                                >
                                    <VIcon size={16} className={activeVenue === key ? "text-primary-foreground" : "text-primary group-hover:scale-110 transition-transform"} />
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-xs md:text-sm font-bold tracking-tight">{venues[key].label}</span>
                                        <span className="text-[9px] opacity-60 font-bengali">{venues[key].bengaliLabel}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Staggered Content Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeVenue}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center"
                    >
                        {/* Visuals Column */}
                        <div className="lg:col-span-7 relative">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative z-10"
                            >
                                <VenueImageSlider images={current.images} label={current.label} />
                            </motion.div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-5">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="space-y-3 md:space-y-4 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                                        <IconComponent size={16} className="text-primary" />
                                        <span className={cn("text-[10px] md:text-xs font-black tracking-widest uppercase", current.taglineClassName)}>
                                            {current.tagline}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-black font-heading leading-tight">
                                        {current.label}
                                    </h3>
                                    <p className={cn("text-sm md:text-lg leading-relaxed text-muted-foreground", current.descriptionClassName)}>
                                        {current.description}
                                    </p>
                                </div>

                                {/* Highlights in Cinema Style - 2 cols even on small mobile */}
                                <div className="grid grid-cols-2 gap-3">
                                    {current.highlights.map((h, i) => (
                                        <motion.div
                                            key={h}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + (i * 0.05) }}
                                            className="flex items-center gap-2 p-2.5 rounded-lg bg-card/40 border border-border/50 backdrop-blur-sm"
                                        >
                                            <div className="w-6 h-6 shrink-0 rounded-md bg-primary/20 flex items-center justify-center">
                                                <Star className="text-primary" size={10} fill="currentColor" />
                                            </div>
                                            <span className="text-[10px] md:text-sm font-bold tracking-tight line-clamp-1">{h}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Modern Stats Badges - Side by side on mobile */}
                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/50">
                                    {[
                                        { icon: Users, label: current.capacity, sub: "Capacity" },
                                        { icon: Clock, label: current.timing, sub: "Available" }
                                    ].map((stat, i) => (
                                        <div key={i} className="flex items-center gap-3 group">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                                <stat.icon size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs md:text-base font-black leading-none mb-1 tracking-tight truncate">{stat.label}</p>
                                                <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{stat.sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}

