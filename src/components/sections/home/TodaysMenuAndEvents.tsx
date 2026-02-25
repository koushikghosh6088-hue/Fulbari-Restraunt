"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CalendarDays, Loader2, ChevronLeft, ChevronRight, ArrowRight, X, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { sanitizeImageUrl } from "@/lib/utils";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isVeg: boolean;
    isBestseller?: boolean;
    menu_type: "RESTAURANT" | "CAFE";
    variant_prices?: Record<string, number>;
    price_options?: number[];
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
// Premium Auto-sliding image carousel with horizontal motion
function EventImageCarousel({ images }: { images: string[] }) {
    const [idx, setIdx] = useState(0);
    const [direction, setDirection] = useState(0); // 1 for right, -1 for left
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (images.length <= 1 || isHovered) return;
        const t = setInterval(() => {
            setDirection(1);
            setIdx(i => (i + 1) % images.length);
        }, 5000); // 5s for slower premium feel
        return () => clearInterval(t);
    }, [images.length, isHovered]);

    if (images.length === 0) {
        return (
            <div className="w-full h-56 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 to-card">
                <CalendarDays size={36} className="text-primary/40" />
            </div>
        );
    }

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setIdx(i => (i + newDirection + images.length) % images.length);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1.1
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring" as const, stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 }
            }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.9,
            transition: {
                x: { type: "spring" as const, stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 }
            }
        })
    };

    return (
        <div
            className="relative w-full h-56 overflow-hidden select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={idx}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                >
                    <Image
                        src={sanitizeImageUrl(images[idx])}
                        alt={`Event image ${idx + 1}`}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </motion.div>
            </AnimatePresence>

            {/* Prev / Next arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-all z-20 shadow-lg border border-white/10 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); paginate(1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-primary transition-all z-20 shadow-lg border border-white/10 group"
                    >
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setDirection(i > idx ? 1 : -1); setIdx(i); }}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                    i === idx ? "bg-primary w-5 shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-white/40 hover:bg-white/60"
                                )}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Modern, high-performance gallery with snap-scrolling (mobile) and Bento Grid (desktop)
// Modern, high-performance gallery with auto-scrolling (mobile) and dynamic Bento Grid (desktop)
function ModernEventGallery({ images }: { images: string[] }) {
    const mobileScrollRef = useRef<HTMLDivElement>(null);
    const [bentoOffset, setBentoOffset] = useState(0);

    // Mobile Auto-scroll logic
    useEffect(() => {
        const el = mobileScrollRef.current;
        if (!el || images.length <= 1) return;

        const interval = setInterval(() => {
            if (!el) return;
            const scrollWidth = el.scrollWidth;
            const clientWidth = el.clientWidth;
            const currentScroll = el.scrollLeft;

            // If we're at the end, jump back to start, else scroll one "page"
            if (currentScroll + clientWidth >= scrollWidth - 10) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [images.length]);

    // Bento Grid dynamic cycling (every 6 seconds change the offset if many images)
    useEffect(() => {
        if (images.length <= 5) return;
        const interval = setInterval(() => {
            setBentoOffset(prev => (prev + 1) % (images.length - 4));
        }, 6000);
        return () => clearInterval(interval);
    }, [images.length]);

    if (images.length === 0) return null;

    const bentoImages = images.length > 5
        ? images.slice(bentoOffset, bentoOffset + 5)
        : images;

    return (
        <div className="relative w-full overflow-hidden">
            {/* Mobile/Tablet: Native Snap Slider with JS Auto-scroll (Fast & Dynamic) */}
            <div
                ref={mobileScrollRef}
                className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-8 no-scrollbar scroll-smooth"
            >
                {images.map((img, i) => (
                    <div
                        key={`snap-${i}`}
                        className="flex-none w-[75vw] aspect-[4/5] snap-center snap-always"
                    >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl border border-border/50">
                            <Image
                                src={sanitizeImageUrl(img)}
                                alt=""
                                fill
                                sizes="75vw"
                                className="object-cover"
                                priority={i < 2}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: Premium Bento-style Grid with subtle cycling */}
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 h-[500px] px-8 lg:px-12">
                <AnimatePresence mode="popLayout">
                    {bentoImages.slice(0, 5).map((img, i) => (
                        <motion.div
                            key={`bento-${img}-${i}`}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25,
                                opacity: { duration: 0.4 }
                            }}
                            className={cn(
                                "relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer",
                                i === 0 ? "col-span-2 row-span-2" :
                                    i === 1 ? "col-span-1 row-span-1" :
                                        i === 2 ? "col-span-1 row-span-2" :
                                            "col-span-1 row-span-1"
                            )}
                        >
                            <Image
                                src={sanitizeImageUrl(img)}
                                alt=""
                                fill
                                sizes={i === 0 ? "50vw" : "25vw"}
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 group-hover:ring-primary/40 transition-all rounded-3xl" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Background elements to add depth */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-primary/2 opacity-20 blur-3xl pointer-events-none" />
        </div>
    );
}

export function TodaysMenuAndEvents() {
    const [activeTab, setActiveTab] = useState<"events" | "menu">("events");
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
        <section className={`pt-12 md:pt-20 pb-0 bg-background relative overflow-hidden ${showSpecialsPopup ? "z-[100]" : "z-10"}`}>
            {/* Background accents */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-6 md:mb-10"
                >
                    <span className="text-primary font-heading italic text-sm md:text-base mb-2 block tracking-wide">
                        What&apos;s On Today
                    </span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-heading mb-2 tracking-tight">
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
                            { key: "events", label: "Events", icon: <CalendarDays size={14} /> },
                            { key: "menu", label: "Today's Special", icon: <Star size={14} /> },
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
                                <>
                                    {/* Infinite Marquee gallery - only show this as per user request */}
                                    <div className="mb-0">
                                        <div className="text-center mb-6">
                                            <h3 className="text-xl md:text-2xl font-bold font-heading">Event Gallery</h3>
                                            <div className="w-12 h-0.5 bg-primary mx-auto mt-2 rounded-full" />
                                        </div>
                                        <ModernEventGallery images={
                                            events.flatMap(ev =>
                                                (ev.image_urls && ev.image_urls.length > 0)
                                                    ? ev.image_urls
                                                    : ev.poster_url ? [ev.poster_url] : []
                                            ).filter((v, i, a) => a.indexOf(v) === i) // unique
                                        } />
                                    </div>
                                </>
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
                                                        ? <Image
                                                            src={sanitizeImageUrl(item.image)}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        : <div className="w-full h-full bg-card flex items-center justify-center"><Utensils size={24} className="text-muted-foreground" /></div>
                                                    }
                                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-primary text-[10px] font-bold border border-white/10">
                                                        {item.variant_prices && Object.keys(item.variant_prices).length > 0
                                                            ? `From ₹${Math.min(...Object.values(item.variant_prices as Record<string, number>))}`
                                                            : item.price_options && Array.isArray(item.price_options) && item.price_options.length > 0
                                                                ? `From ₹${Math.min(...(item.price_options as number[]))}`
                                                                : `₹${item.price}`
                                                        }
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
                            className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8"
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
                                                        ? <Image
                                                            src={sanitizeImageUrl(item.image)}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        : <div className="w-full h-full bg-muted flex items-center justify-center"><Utensils size={24} className="text-muted-foreground" /></div>
                                                    }
                                                </div>
                                                <div className="flex flex-col justify-center flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                                                        <span className="text-primary font-bold text-sm shrink-0 ml-2">
                                                            {item.variant_prices && Object.keys(item.variant_prices).length > 0
                                                                ? `From ₹${Math.min(...Object.values(item.variant_prices as Record<string, number>))}`
                                                                : item.price_options && Array.isArray(item.price_options) && item.price_options.length > 0
                                                                    ? `From ₹${Math.min(...(item.price_options as number[]))}`
                                                                    : `₹${item.price}`
                                                            }
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-1.5">{item.description || "Chef's special preparation for today."}</p>
                                                    {item.variant_prices && Object.keys(item.variant_prices).length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {Object.entries(item.variant_prices as Record<string, number>).map(([k, v]) => (
                                                                <span key={k} className="text-[9px] bg-accent/40 px-1.5 py-0.5 rounded border border-border/30 text-muted-foreground">
                                                                    <span className="font-bold text-primary mr-1">{k}:</span>₹{v}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
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
