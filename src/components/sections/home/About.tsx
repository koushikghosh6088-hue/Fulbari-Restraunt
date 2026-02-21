"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Coffee, Building2, PartyPopper, Users, Clock, MapPin, Star } from "lucide-react";

type VenueKey = "restaurant" | "cafe" | "community" | "banquet";

const venues = {
    restaurant: {
        icon: Utensils,
        label: "Restaurant",
        tagline: "প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা",
        taglineClassName: "font-bengali-logo text-base md:text-lg text-primary font-bold tracking-wide",
        description:
            "আমাদের সবুজ ঘেরা ওপেন-এয়ার গার্ডেন ডাইনিং আপনাকে দেবে এক অসাধারণ অভিজ্ঞতা। খোলা আকাশের নিচে ঝকঝকে আলোকসজ্জার মাঝে প্রিয়জনের সাথে কাটানো সময় হবে সত্যিই স্মরণীয়।",
        descriptionClassName: "font-bengali text-sm md:text-base leading-relaxed font-semibold text-muted-foreground",
        highlights: ["Open-Air Garden Dining", "Live Band ('Nostalgic')", "Signature Reshmi Butter Masala", "Traditional Bengali Thalis"],
        capacity: "120+ Guests",
        timing: "11:00 AM - 10:30 PM",
        images: [
            "/restaurant/r1.jpg",
            "/restaurant/r2.jpg",
            "/restaurant/r3.jpg",
            "/restaurant/r4.jpg",
            "/restaurant/r5.jpg",
        ],
    },
    cafe: {
        icon: Coffee,
        label: "Café",
        tagline: "Brews & Bites",
        description:
            "Unwind with freshly brewed coffee, artisan teas, and light bites in our cozy café corner. Perfect for casual meetups, work sessions, or a quiet afternoon escape.",
        highlights: ["Specialty Coffee", "Fresh Pastries", "Free Wi-Fi", "Cozy Ambience"],
        capacity: "40+ Guests",
        timing: "8:00 AM - 9:00 PM",
        taglineClassName: "text-primary font-medium",
        descriptionClassName: "text-muted-foreground",
        images: [
            "/cafe/cafe1.jpeg",
            "/cafe/cafe2.jpeg",
            "/cafe/cafe3.jpeg",
            "/cafe/cafe4.jpeg",
        ],
    },
    community: {
        icon: Building2,
        label: "Community Hall",
        tagline: "Celebrate Together",
        description:
            "Our spacious community hall is ideal for cultural events, meetings, seminars, and social gatherings. Equipped with modern amenities and flexible seating arrangements.",
        highlights: ["Projector & Sound", "Flexible Layout", "AC Hall", "Stage Available"],
        capacity: "300+ Guests",
        timing: "Contact for Inquiry",
        taglineClassName: "text-primary font-medium",
        descriptionClassName: "text-muted-foreground",
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
        tagline: "Weddings & Grand Occasions",
        description:
            "From grand weddings to birthday celebrations, our food provide an elegant setting with premium catering, décor support, and dedicated event coordination.",
        highlights: ["Wedding Packages", "Custom Décor", "Premium Catering", "Event Manager"],
        capacity: "500+ Guests",
        timing: "Contact for Inquiry",
        taglineClassName: "text-primary font-medium",
        descriptionClassName: "text-muted-foreground",
        images: [
            "/food/food3.jpeg",
            "/food/food2.jpeg",
            "/food/food1.jpeg",
            "/food/food4.jpeg",
            "/food/food5.jpeg",
        ],
    },
};

export function About() {
    const [activeVenue, setActiveVenue] = useState<VenueKey>("restaurant");
    const current = venues[activeVenue];
    const IconComponent = current.icon;

    return (
        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Decorative glows */}
            <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="text-primary font-heading italic text-base md:text-lg mb-2 block">
                        About Us
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold font-heading mb-3 leading-tight">
                        A <span className="text-primary">Proshantir Neer</span> in Serampore
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mb-8">
                        Fulbari is a complete destination — dine, sip, celebrate, and connect under one roof
                        in the heart of Serampore.
                    </p>
                    <div className="relative max-w-4xl mx-auto p-6 md:p-8 rounded-2xl bg-primary/5 border border-primary/10 backdrop-blur-sm">
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-background border border-primary/20 rounded-full text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
                            Our Atmosphere
                        </div>
                        <p className="text-foreground font-bengali italic text-sm md:text-base leading-relaxed md:leading-loose text-center font-semibold">
                            ব্যস্ত জীবনের ক্লান্তি ভুলে যদি প্রকৃতির স্নিগ্ধ ছোঁয়ায় সুস্বাদু খাবারের স্বাদ নিতে চান, তবে ফুলবাড়ি রেস্তোরাঁ আপনার জন্য এক আদর্শ গন্তব্য। শ্রীবামপুর ওল্ড দিল্লি রোডের ওপর রাজ্যাধরপুরে অবস্থিত আমাদের এই রেস্তোরাঁটি কেবল খাবারের জায়গাই নয়, বরং এটি এক প্রশান্তির নীড়।
                        </p>
                    </div>
                </motion.div>

                {/* Venue Tabs */}
                <div className="flex justify-center mb-10 md:mb-14">
                    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {(Object.keys(venues) as VenueKey[]).map((key) => {
                            const venue = venues[key];
                            const VIcon = venue.icon;
                            const isActive = activeVenue === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveVenue(key)}
                                    className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-full whitespace-nowrap transition-all text-sm md:text-base font-medium border ${isActive
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                        : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                        }`}
                                >
                                    <VIcon size={18} />
                                    {venue.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Venue Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeVenue}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Info + Featured Image */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-14">
                            {/* Featured Image */}
                            <div className="relative h-[280px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl group">
                                <Image
                                    src={current.images[0]}
                                    alt={current.label}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                                    <div className={`flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-primary-foreground text-sm font-medium ${current.taglineClassName || ''}`}>
                                        <IconComponent size={16} className="shrink-0" />
                                        {current.tagline}
                                    </div>
                                </div>
                            </div>

                            {/* Venue Info */}
                            <div className="flex flex-col justify-center">
                                <h3 className="text-xl md:text-3xl font-bold font-heading mb-3 md:mb-4">
                                    {current.label}
                                </h3>
                                <p className={`text-sm md:text-base mb-5 leading-relaxed ${current.descriptionClassName || 'text-muted-foreground'}`}>
                                    {current.description}
                                </p>

                                {/* Highlights Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {current.highlights.map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-2 text-sm md:text-base"
                                        >
                                            <Star className="text-primary shrink-0" size={16} fill="currentColor" />
                                            <span className="text-foreground font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Info Badges */}
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border">
                                        <Users className="text-primary" size={16} />
                                        <span className="text-sm font-medium">{current.capacity}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border">
                                        <Clock className="text-primary" size={16} />
                                        <span className="text-sm font-medium">{current.timing}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border">
                                        <MapPin className="text-primary" size={16} />
                                        <span className="text-sm font-medium">Serampore</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        <div>
                            <h4 className="text-base md:text-lg font-bold font-heading mb-4 md:mb-5 flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-primary inline-block"></span>
                                {current.label} Gallery
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                {current.images.map((img, idx) => (
                                    <motion.div
                                        key={img}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative h-[140px] md:h-[200px] rounded-xl overflow-hidden group cursor-pointer"
                                    >
                                        <Image
                                            src={img}
                                            alt={`${current.label} ${idx + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">{current.label}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>
        </section>
    );
}
