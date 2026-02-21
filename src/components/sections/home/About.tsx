import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Coffee, Building2, PartyPopper, Users, Clock, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";

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

function VenueImageSlider({ images, label }: { images: string[], label: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative group overflow-hidden rounded-2xl shadow-2xl h-[300px] md:h-[500px]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full"
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`${label} photo ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-primary transition-colors"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-primary transition-colors"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full transition-all ${idx === currentIndex ? "bg-primary w-6 md:w-8" : "bg-white/40 hover:bg-white/60"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Image Counter Badge */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}

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

                {/* Active Venue Content - Standardized with Slider */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeVenue}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
                            {/* Interactive Slider - Left Column */}
                            <div className="lg:col-span-7">
                                <VenueImageSlider images={current.images} label={current.label} />
                            </div>

                            {/* Venue Info - Right Column */}
                            <div className="lg:col-span-5 flex flex-col justify-center">
                                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                    <IconComponent size={16} className="text-primary" />
                                    <span className={`text-sm md:text-base font-bold ${current.taglineClassName || ''}`}>
                                        {current.tagline}
                                    </span>
                                </div>

                                <h3 className="text-2xl md:text-4xl font-bold font-heading mb-4 leading-tight">
                                    {current.label}
                                </h3>
                                <p className={`text-sm md:text-base mb-8 leading-relaxed ${current.descriptionClassName || 'text-muted-foreground'}`}>
                                    {current.description}
                                </p>

                                {/* Highlights Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {current.highlights.map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-2.5"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Star className="text-primary" size={12} fill="currentColor" />
                                            </div>
                                            <span className="text-foreground text-sm md:text-base font-medium leading-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Info Badges */}
                                <div className="flex flex-wrap gap-3 pt-6 border-t border-border/50">
                                    <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl border border-border/60 shadow-sm">
                                        <Users className="text-primary" size={16} />
                                        <span className="text-xs md:text-sm font-bold tracking-tight">{current.capacity}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl border border-border/60 shadow-sm">
                                        <Clock className="text-primary" size={16} />
                                        <span className="text-xs md:text-sm font-bold tracking-tight">{current.timing}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl border border-border/60 shadow-sm">
                                        <MapPin className="text-primary" size={16} />
                                        <span className="text-xs md:text-sm font-bold tracking-tight uppercase">Serampore</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>
        </section>
    );
}
