"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, CalendarDays, Star, ChevronRight, Loader2, ChevronLeft, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isVeg: boolean;
    isBestseller?: boolean;
    rating?: number;
}

interface Event {
    id: string;
    title: string;
    description: string;
    event_date: string;
    poster_url: string | null;
    image_urls?: string[];
    is_active: boolean;
}

const tabVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.06 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};

function formatEventDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
            <p className="text-muted-foreground text-sm max-w-xs">{text}</p>
        </div>
    );
}

// Auto-scrolling image carousel for event cards
function EventImageCarousel({ images }: { images: string[] }) {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const t = setInterval(() => setIdx(i => (i + 1) % images.length), 3000);
        return () => clearInterval(t);
    }, [images.length]);

    if (images.length === 0) {
        return (
            <div className="w-full h-52 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 to-card">
                <CalendarDays size={36} className="text-primary/40" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-52 overflow-hidden select-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Image src={images[idx]} alt={`Event image ${idx + 1}`} fill className="object-cover" />
                </motion.div>
            </AnimatePresence>

            {/* Prev / Next arrows */}
            {images.length > 1 && (
                <>
                    <button onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition z-10">
                        <ChevronLeft size={13} />
                    </button>
                    <button onClick={() => setIdx(i => (i + 1) % images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition z-10">
                        <ChevronRight size={13} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                        {images.map((_, i) => (
                            <button key={i} onClick={() => setIdx(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white w-4" : "bg-white/50"}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export function TodaysMenuAndEvents() {
    const [activeTab, setActiveTab] = useState<"events" | "menu">("menu");
    const [specials, setSpecials] = useState<MenuItem[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [showSpecialsPopup, setShowSpecialsPopup] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/daily-specials")
            .then(r => r.json())
            .then(data => setSpecials(Array.isArray(data) ? data : []))
            .catch(() => setSpecials([]))
            .finally(() => setLoadingMenu(false));

        fetch("/api/events")
            .then(r => r.json())
            .then(data => setEvents(Array.isArray(data) ? data : []))
            .catch(() => setEvents([]))
            .finally(() => setLoadingEvents(false));
    }, []);

    return (
        <section className="py-14 md:py-20 bg-background relative overflow-hidden">
            {/* Background accents */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 md:mb-12"
                >
                    <span className="text-primary font-heading italic text-sm md:text-base mb-2 block tracking-wide">
                        What&apos;s On Today
                    </span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading mb-3 tracking-tight">
                        Today&apos;s Menu &amp; Events
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-xs md:text-sm">
                        Fresh picks and upcoming celebrations — updated daily by our team.
                    </p>
                </motion.div>

                {/* Tab Switcher */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-1 bg-card/60 border border-border/50 rounded-2xl p-1.5 backdrop-blur-sm shadow-lg">
                        {([
                            { key: "menu", label: "Today's Special", icon: <Star size={14} /> },
                            { key: "events", label: "Events", icon: <CalendarDays size={14} /> },
                        ] as const).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300
                                    ${activeTab === tab.key
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                                        : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {tab.icon}{tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">

                    {/* ── EVENTS ── */}
                    {activeTab === "events" && (
                        <motion.div key="events" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                            {loadingEvents ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
                            ) : events.length === 0 ? (
                                <EmptyState icon={<CalendarDays size={26} />} text="No upcoming events right now. Follow us for announcements!" />
                            ) : (
                                <motion.div variants={tabVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {events.map(event => {
                                        // Build image list: prefer image_urls array, fallback to poster_url
                                        const imgs: string[] = (event.image_urls && event.image_urls.length > 0)
                                            ? event.image_urls
                                            : event.poster_url ? [event.poster_url] : [];

                                        return (
                                            <motion.div
                                                key={event.id}
                                                variants={cardVariants}
                                                whileHover={{ y: -5 }}
                                                className="group bg-card/60 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                                            >
                                                <EventImageCarousel images={imgs} />
                                                {/* Date chip */}
                                                <div className="px-5 pt-4 pb-5">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-full mb-3">
                                                        <CalendarDays size={11} /> {formatEventDate(event.event_date)}
                                                    </span>
                                                    <h3 className="font-bold text-foreground text-base leading-snug mb-1">{event.title}</h3>
                                                    {event.description && (
                                                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ── TODAY'S SPECIAL ── */}
                    {activeTab === "menu" && (
                        <motion.div key="menu" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                            {loadingMenu ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
                            ) : specials.length === 0 ? (
                                <EmptyState icon={<Utensils size={26} />} text="No specials set for today. Check back later or browse our full menu!" />
                            ) : (
                                <>
                                    {/* Grid layout matching TopFlavours: Horizontal scroll on mobile, grid on sm+ */}
                                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
                                        {specials.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                variants={cardVariants}
                                                whileHover={{ y: -5 }}
                                                onClick={() => setShowSpecialsPopup(true)}
                                                className="min-w-[160px] sm:min-w-0 group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
                                            >
                                                <div className="relative h-28 md:h-36 lg:h-40 overflow-hidden">
                                                    {item.image
                                                        ? <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        : <div className="w-full h-full bg-card flex items-center justify-center"><Utensils size={24} className="text-muted-foreground" /></div>
                                                    }
                                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-primary text-[10px] font-bold">
                                                        ₹{item.price}
                                                    </div>
                                                    <div className="absolute top-2 left-2">
                                                        <div className={`w-2.5 h-2.5 rounded-full border border-white/20 shadow-[0_0_5px] ${item.isVeg ? "bg-green-500 shadow-green-500/40" : "bg-red-500 shadow-red-500/40"}`} />
                                                    </div>
                                                </div>

                                                <div className="p-3">
                                                    <h3 className="text-sm font-bold font-heading group-hover:text-primary transition-colors truncate mb-1">{item.name}</h3>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full">{item.category}</span>
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={8} fill={i < (item.rating ?? 5) ? "currentColor" : "none"} className={i < (item.rating ?? 5) ? "text-yellow-500" : "text-muted"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {specials.length > 5 && (
                                        <div className="text-center mt-8">
                                            <button
                                                onClick={() => setShowSpecialsPopup(true)}
                                                className="inline-flex items-center text-primary text-sm font-medium hover:underline underline-offset-4 gap-2 cursor-pointer"
                                            >
                                                See All Specials <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}


                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showSpecialsPopup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                            onClick={() => setShowSpecialsPopup(false)}
                        >
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                transition={{ duration: 0.3, type: "spring", damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                                className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
                            >
                                <div className="flex items-center justify-between p-5 border-b border-border">
                                    <div>
                                        <span className="text-primary font-heading italic text-sm">Special Menu</span>
                                        <h3 className="text-xl font-bold font-heading">Today&apos;s Special Selection</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowSpecialsPopup(false)}
                                        className="w-9 h-9 rounded-full bg-muted/50 hover:bg-primary/20 border border-border/50 hover:border-primary/30 flex items-center justify-center text-foreground transition-colors cursor-pointer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="p-5 overflow-y-auto max-h-[calc(85vh-5rem)] custom-scrollbar">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {specials.map((item, index) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex gap-4 p-3.5 rounded-2xl bg-background/40 border border-border/30 hover:border-primary/30 transition-all group"
                                            >
                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 shadow-lg">
                                                    {item.image
                                                        ? <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        : <div className="w-full h-full bg-muted flex items-center justify-center"><Utensils size={24} className="text-muted-foreground" /></div>
                                                    }
                                                </div>
                                                <div className="flex flex-col justify-center flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                                                        <span className="text-primary font-bold text-sm shrink-0 ml-2">₹{item.price}</span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-1.5">{item.description || "Chef's special preparation for today."}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{item.category}</span>
                                                            <div className={`w-2 h-2 rounded-full shadow-[0_0_5px] ${item.isVeg ? "bg-green-500 shadow-green-500/40" : "bg-red-500 shadow-red-500/40"}`} />
                                                        </div>
                                                        <div className="flex items-center gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={10} fill={i < (item.rating ?? 5) ? "currentColor" : "none"} className={i < (item.rating ?? 5) ? "text-yellow-500" : "text-muted"} />
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
            </div>
        </section>
    );
}
