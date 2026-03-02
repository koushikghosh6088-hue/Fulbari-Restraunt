"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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


const formatEventDate = (dateString: string) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return dateString;
    }
};

const tabVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.06 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};



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
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    // Filter out failed images
    const validImages = images.filter(img => !failedImages.has(img));

    useEffect(() => {
        if (validImages.length <= 1 || isHovered) return;
        const t = setInterval(() => {
            setDirection(1);
            setIdx(i => (i + 1) % validImages.length);
        }, 5000); // 5s for slower premium feel
        return () => clearInterval(t);
    }, [validImages.length, isHovered]);

    const handleImageError = (failedUrl: string) => {
        console.error(`Event image failed to load: ${failedUrl}`);
        setFailedImages(prev => new Set([...prev, failedUrl]));
        // Move to next valid image
        if (validImages.length > 0) {
            setIdx(i => (i + 1) % validImages.length);
        }
    };

    if (validImages.length === 0) {
        return (
            <div className="w-full h-56 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 to-card">
                <CalendarDays size={36} className="text-primary/40" />
                <p className="text-sm text-muted-foreground">No event images available</p>
            </div>
        );
    }

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setIdx(i => (i + newDirection + validImages.length) % validImages.length);
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
                    <img
                        src={sanitizeImageUrl(validImages[idx])}
                        alt={`Event at Fulbari - image ${idx + 1}`}
                        loading={idx === 0 ? "eager" : "lazy"}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            handleImageError(validImages[idx]);
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </motion.div>
            </AnimatePresence>

            {/* Prev / Next arrows */}
            {validImages.length > 1 && (
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
                        {validImages.map((_, i) => (
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

interface GallerySlide {
    url: string;
    title: string;
    date: string;
}

export function PremiumEventGallery({ events }: { events: Event[] }) {
    const [idx, setIdx] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    // Process events into flat slides with metadata
    const slides = useMemo(() => {
        const allSlides: GallerySlide[] = [];
        events.forEach(ev => {
            const urls = new Set<string>();
            if (ev.poster_url && ev.poster_url.trim()) urls.add(ev.poster_url);
            if (Array.isArray(ev.image_urls)) {
                ev.image_urls.forEach(u => {
                    if (u && u.trim()) urls.add(u);
                });
            }
            urls.forEach(url => {
                if (!failedImages.has(url)) {
                    allSlides.push({ url, title: ev.title, date: ev.event_date });
                }
            });
        });
        return allSlides;
    }, [events, failedImages]);

    useEffect(() => {
        if (slides.length <= 1 || isHovered) return;
        const t = setInterval(() => {
            setDirection(1);
            setIdx(i => (i + 1) % slides.length);
        }, 6000); // Slower for premium cinematic feel
        return () => clearInterval(t);
    }, [slides.length, isHovered]);

    const handleImageError = (url: string) => {
        setFailedImages(prev => new Set([...prev, url]));
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setIdx(i => (i + newDirection + slides.length) % slides.length);
    };

    if (slides.length === 0) {
        return (
            <div className="flex justify-center items-center h-48 md:h-80 border border-dashed border-border/50 rounded-3xl mx-4">
                <div className="text-center">
                    <p className="text-muted-foreground text-sm font-heading">Our event gallery is preparing for you...</p>
                </div>
            </div>
        );
    }

    const currentSlide = slides[idx];

    return (
        <div
            className="group relative w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-black select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Ambient Background Blur - Hardware accelerated */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`bg-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 scale-125 blur-[100px] pointer-events-none"
                    style={{
                        backgroundImage: `url(${sanitizeImageUrl(currentSlide.url)})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                    }}
                />
            </AnimatePresence>

            {/* Main Stage (Preserve original aspects) */}
            <div className="relative aspect-[4/5] md:aspect-[3/2] max-h-[700px] overflow-hidden flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={idx}
                        custom={direction}
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                        transition={{
                            opacity: { duration: 0.6, ease: "easeInOut" },
                            scale: { duration: 0.8, ease: "easeOut" },
                            filter: { duration: 0.6 }
                        }}
                        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                    >
                        {/* The Actual Full Image */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img
                                src={sanitizeImageUrl(currentSlide.url)}
                                alt={currentSlide.title}
                                className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl shadow-2xl ring-1 ring-white/20"
                                onError={() => handleImageError(currentSlide.url)}
                            />
                        </div>

                        {/* Dramatic Vignette Overlay (Only on background) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Glassmorphism Info Card */}
            <div className="absolute bottom-10 left-6 right-6 md:bottom-12 md:left-12 md:right-auto md:max-w-md z-30 pointer-events-none">
                <motion.div
                    key={`info-${idx}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                    className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-[2px] bg-primary rounded-full" />
                        <span className="text-primary font-heading font-medium text-xs tracking-[0.2em] uppercase">Featured Event</span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold font-heading text-white mb-2 leading-tight">
                        {currentSlide.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-primary" />
                            <span>{formatEventDate(currentSlide.date)}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Progress Bar (Auto-play indicator) */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-40 overflow-hidden">
                {!isHovered && slides.length > 1 && (
                    <motion.div
                        key={`progress-${idx}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                    />
                )}
            </div>

            {/* Premium Navigation Controls */}
            {
                slides.length > 1 && (
                    <>
                        <div className="absolute right-6 bottom-10 md:right-12 md:bottom-12 flex gap-3 z-40">
                            <button
                                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                className="w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white transition-all active:scale-95 group/btn shadow-xl"
                            >
                                <ChevronLeft size={24} className="group-hover/btn:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                className="w-12 h-12 md:w-14 md:h-14 bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 rounded-2xl flex items-center justify-center transition-all active:scale-95 group/btn shadow-xl shadow-primary/20"
                            >
                                <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Slide Indicators (Vertical on desktop) */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 z-40">
                            {slides.map((_s: GallerySlide, i: number) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setDirection(i > idx ? 1 : -1); setIdx(i); }}
                                    className={cn(
                                        "w-1 transition-all duration-500 rounded-full",
                                        i === idx ? "h-10 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]" : "h-4 bg-white/30 hover:bg-white/60"
                                    )}
                                />
                            ))}
                        </div>
                    </>
                )
            }
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
        const ts = Date.now();
        // Add cache buster to prevent stale responses
        fetch(`/api/daily-specials?t=${ts}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
            }
        })
            .then(r => r.json())
            .then(data => setSpecials(Array.isArray(data) ? data : []))
            .catch(() => setSpecials([]))
            .finally(() => setLoadingMenu(false));

        fetch(`/api/events?t=${ts}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
            }
        })
            .then(r => r.json())
            .then(data => {
                // Ensure image_urls is valid and filter empty URLs
                const cleanedEvents = (Array.isArray(data) ? data : []).map((ev: Event) => ({
                    ...ev,
                    image_urls: Array.isArray(ev.image_urls)
                        ? ev.image_urls.filter((url: string) => url && url.trim() !== "")
                        : []
                }));
                setEvents(cleanedEvents);
            })
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
                            { key: "events", label: "Events | ইভেন্ট", icon: <CalendarDays size={14} /> },
                            { key: "menu", label: "Specials | বিশেষ", icon: <Star size={14} /> },
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
                                        <PremiumEventGallery events={events} />
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
                                                        ? <img
                                                            src={sanitizeImageUrl(item.image)}
                                                            alt={item.name}
                                                            loading={index < 4 ? "eager" : "lazy"}
                                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                console.error(`Specials image failed: ${target.src}`);
                                                                target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
                                                            }}
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
                                                        ? <img
                                                            src={sanitizeImageUrl(item.image)}
                                                            alt={item.name}
                                                            loading="lazy"
                                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
                                                            }}
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
