"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Trash2,
    Power,
    PowerOff,
    Image as ImageIcon,
    Tag,
    Utensils,
    Save,
    LogOut,
    ChevronDown,
    ChevronUp,
    Pencil,
    ArrowLeft,
    Upload,
    ImagePlus,
    Loader2,
    CheckCircle2,
    AlertCircle,
    CalendarDays,
    Star,
    Search,
    X
} from "lucide-react";

interface EventItem {
    id: string;
    title: string;
    description: string;
    event_date: string;
    poster_url: string | null;
    image_urls: string[];
    is_active: boolean;
}

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isVeg: boolean;
    isBestseller?: boolean;
    available: boolean;
    menu_type: "RESTAURANT" | "CAFE";
    variant_prices?: Record<string, number>;
    price_options?: number[];
}

export default function AdminDashboard() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({
        show: false,
        message: "",
        type: 'success'
    });
    const router = useRouter();

    // ── Today's Special state ──
    const [adminTab, setAdminTab] = useState<'menu' | 'specials' | 'events'>('menu');
    const [todaysSpecialIds, setTodaysSpecialIds] = useState<string[]>([]);
    const [specSearch, setSpecSearch] = useState('');
    const [togglingSpecial, setTogglingSpecial] = useState<string | null>(null);

    // ── Events state ──
    const [events, setEvents] = useState<EventItem[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '' });
    const [eventImages, setEventImages] = useState<string[]>([]);
    const [eventUploading, setEventUploading] = useState(false);
    const [eventSaving, setEventSaving] = useState(false);
    const [isEditingEvent, setIsEditingEvent] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        price: 0,
        category: "Bengali",
        image: "",
        isVeg: false,
        isBestseller: false,
        menu_type: "RESTAURANT" as "RESTAURANT" | "CAFE",
        variant_prices: {} as Record<string, number>,
        price_options: [] as number[]
    });

    const [variantInput, setVariantInput] = useState("");
    const [priceOptionsInput, setPriceOptionsInput] = useState("");

    const [customCategory, setCustomCategory] = useState("");
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("adminLoggedIn");
        if (!isLoggedIn) { router.push("/admin/login"); return; }
        fetchMenu();
        fetchTodaysSpecials();
        fetchEvents();
    }, []);

    const fetchTodaysSpecials = async () => {
        try {
            const res = await fetch('/api/daily-specials');
            const data = await res.json();
            setTodaysSpecialIds((data ?? []).map((i: MenuItem) => i.id));
        } catch { }
    };

    const fetchEvents = async () => {
        setEventsLoading(true);
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch { }
        finally { setEventsLoading(false); }
    };

    const toggleSpecial = async (item: MenuItem) => {
        const isSpecial = todaysSpecialIds.includes(item.id);
        setTogglingSpecial(item.id);
        try {
            await fetch('/api/daily-specials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: isSpecial ? 'REMOVE' : 'ADD', menu_item_id: item.id }),
            });
            setTodaysSpecialIds(prev => isSpecial ? prev.filter(id => id !== item.id) : [...prev, item.id]);
        } catch { }
        finally { setTogglingSpecial(null); }
    };

    const handleEventPosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (eventImages.length >= 10) {
            alert("Maximum 10 images allowed per event.");
            return;
        }

        setEventUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('bucket', 'events');
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.url) setEventImages(prev => [...prev, data.url]);
        } catch { }
        finally { setEventUploading(false); }
    };

    const removeEventImage = (idx: number) => {
        setEventImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setEventSaving(true);
        try {
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: isEditingEvent ? 'UPDATE' : 'ADD',
                    event: {
                        ...eventForm,
                        id: editingEventId,
                        poster_url: eventImages[0] ?? null,
                        image_urls: eventImages,
                    }
                }),
            });
            if (res.ok) {
                setEventForm({ title: '', description: '', event_date: '' });
                setEventImages([]);
                setIsEditingEvent(false);
                setEditingEventId(null);
                fetchEvents();
                setShowToast({ show: true, message: isEditingEvent ? "Event Updated!" : "Event Added!", type: 'success' });
                setTimeout(() => setShowToast(p => ({ ...p, show: false })), 3000);
            }
        } catch { }
        finally { setEventSaving(false); }
    };

    const handleEditEvent = (ev: EventItem) => {
        setEventForm({
            title: ev.title,
            description: ev.description,
            event_date: new Date(ev.event_date).toISOString().split('T')[0]
        });
        setEventImages(ev.image_urls || []);
        setIsEditingEvent(true);
        setEditingEventId(ev.id);
        // Scroll to form
        const form = document.querySelector('#event-form');
        form?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Delete this event?')) return;
        await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'DELETE', event: { id } }),
        });
        fetchEvents();
    };

    const handleToggleEvent = async (ev: EventItem) => {
        await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'TOGGLE', event: ev }),
        });
        fetchEvents();
    };

    // Derive categories from existing items
    const existingCategories = Array.from(new Set(menuItems.map(item => item.category)));

    const fetchMenu = async () => {
        try {
            const res = await fetch("/api/menu");
            const data = await res.json();
            setMenuItems(data);
        } catch (error) {
            console.error("Failed to fetch menu");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminLoggedIn");
        router.push("/admin/login");
    };

    const toggleAvailability = async (item: MenuItem) => {
        try {
            const res = await fetch("/api/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "TOGGLE", item }),
            });
            if (res.ok) fetchMenu();
        } catch (error) {
            console.error("Toggle failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            const res = await fetch("/api/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "DELETE", item: { id } }),
            });
            if (res.ok) fetchMenu();
        } catch (error) {
            console.error("Delete failed");
        }
    };

    const handleEditItem = (item: MenuItem) => {
        setNewItem({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            isVeg: item.isVeg,
            isBestseller: item.isBestseller || false,
            menu_type: item.menu_type || "RESTAURANT",
            variant_prices: item.variant_prices || {},
            price_options: item.price_options || []
        });
        setVariantInput(item.variant_prices ? JSON.stringify(item.variant_prices) : "");
        setPriceOptionsInput(item.price_options ? item.price_options.join(", ") : "");
        setIsEditing(true);
        setEditingId(item.id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setNewItem({ ...newItem, image: data.url });
            } else {
                alert("Upload failed: " + data.error);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed! Please ensure you created the 'menu-images' bucket in Supabase and set it to Public.");
        } finally {
            setIsUploading(false);
        }
    };

    const fixUnsplashUrl = (url: string) => {
        if (!url) return "";
        // If it's a standard Unsplash photo page link
        // Example: https://unsplash.com/photos/a-bowl-of-soup-gDwy_JEoz8k
        if (url.includes("unsplash.com/photos/")) {
            const parts = url.split("/");
            const id = parts[parts.length - 1];
            // If the ID has a slug name before it (e.g., bowl-of-soup-ABC123)
            const idParts = id.split("-");
            const actualId = idParts[idParts.length - 1];
            return `https://images.unsplash.com/photo-${actualId}?q=80&w=2070&auto=format&fit=crop`;
        }
        return url;
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const categoryToSave = isCustomCategory ? customCategory : newItem.category;
        const fixedImageUrl = fixUnsplashUrl(newItem.image);

        try {
            const res = await fetch("/api/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: isEditing ? "UPDATE" : "ADD",
                    item: isEditing
                        ? { ...newItem, id: editingId, category: categoryToSave, image: fixedImageUrl }
                        : { ...newItem, category: categoryToSave, image: fixedImageUrl }
                }),
            });
            if (res.ok) {
                setShowAddForm(false);
                setIsEditing(false);
                setEditingId(null);
                setNewItem({
                    name: "",
                    description: "",
                    price: 0,
                    category: "Bengali",
                    image: "",
                    isVeg: false,
                    isBestseller: false,
                    menu_type: "RESTAURANT",
                    variant_prices: {},
                    price_options: []
                });
                setVariantInput("");
                setPriceOptionsInput("");
                setCustomCategory("");
                setIsCustomCategory(false);
                fetchMenu();

                // Show success toast
                setShowToast({
                    show: true,
                    message: isEditing ? "Update Complete!" : "Item Added Successfully!",
                    type: 'success'
                });
                setTimeout(() => setShowToast({ ...showToast, show: false }), 3000);
            } else {
                // Show specific error from Supabase
                const data = await res.json();
                alert(`Error: ${data.error || "Failed to save item"}. Check your Supabase table and keys.`);
            }
        } catch (error) {
            console.error(isEditing ? "Update failed" : "Add failed");
            alert("Connection error. Please check your internet or try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const updatePrice = async (id: string, newPrice: number) => {
        try {
            await fetch("/api/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "UPDATE_PRICE", item: { id, price: newPrice } }),
            });
        } catch (error) {
            console.error("Price update failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-background relative">
            {/* Success/Error Toast */}
            <AnimatePresence>
                {showToast.show && (
                    <div className="fixed bottom-24 left-0 right-0 z-[100] flex justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className={cn(
                                "px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 w-full max-w-[400px] md:w-auto",
                                showToast.type === 'success' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                            )}
                        >
                            {showToast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            <span className="font-bold text-sm tracking-wide text-center flex-grow">{showToast.message}</span>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Navbar />
            <main className="flex-grow pt-24 pb-12 px-4 container mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <Link href="/" className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all mb-4">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>
                        <h1 className="text-3xl font-bold font-heading text-foreground mb-1">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage menu, today&apos;s specials &amp; events</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => {
                                if (showAddForm && isEditing) {
                                    setIsEditing(false);
                                    setEditingId(null);
                                    setNewItem({
                                        name: "",
                                        description: "",
                                        price: 0,
                                        category: "Bengali",
                                        image: "",
                                        isVeg: false,
                                        isBestseller: false,
                                        menu_type: "RESTAURANT",
                                        variant_prices: {},
                                        price_options: []
                                    });
                                    setVariantInput("");
                                    setPriceOptionsInput("");
                                } else {
                                    setShowAddForm(!showAddForm);
                                }
                            }}
                            className="bg-primary hover:bg-primary/90 rounded-full px-6"
                        >
                            {showAddForm ? <ChevronUp className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
                            {showAddForm ? (isEditing ? "Cancel Edit" : "Close Form") : "Add New Item"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="rounded-full border-red-500/20 text-red-500 hover:bg-red-500/10"
                        >
                            <LogOut className="mr-2" size={18} />
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Add Item Form */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.section
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <form
                                onSubmit={handleAddItem}
                                className="bg-card border border-border rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 shadow-xl relative"
                            >
                                <div className="md:col-span-2 lg:col-span-3 mb-2">
                                    <h2 className="text-xl font-bold font-heading text-primary">
                                        {isEditing ? `Editing: ${newItem.name}` : "Add New Menu Item"}
                                    </h2>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Item Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mutton Rogan Josh"
                                        className="w-full bg-accent border-transparent rounded-xl p-3 outline-none focus:ring-1 focus:ring-primary transition-all"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Price (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full bg-accent border-transparent rounded-xl p-3 outline-none focus:ring-1 focus:ring-primary transition-all"
                                        value={newItem.price}
                                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Menu Type</label>
                                    <select
                                        className="w-full bg-accent border-transparent rounded-xl p-3 outline-none focus:ring-1 focus:ring-primary transition-all font-bold"
                                        value={newItem.menu_type}
                                        onChange={(e) => setNewItem({ ...newItem, menu_type: e.target.value as "RESTAURANT" | "CAFE" })}
                                    >
                                        <option value="RESTAURANT">Restaurant Menu</option>
                                        <option value="CAFE">Cafe Menu</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-muted-foreground">Category</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsCustomCategory(!isCustomCategory)}
                                            className="text-[10px] text-primary hover:underline"
                                        >
                                            {isCustomCategory ? "Select Existing" : "Add New"}
                                        </button>
                                    </div>
                                    {isCustomCategory ? (
                                        <input
                                            type="text"
                                            placeholder="Enter New Category"
                                            className="w-full bg-accent border-transparent rounded-xl p-3 outline-none focus:ring-1 focus:ring-primary transition-all"
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            required
                                        />
                                    ) : (
                                        <select
                                            className="w-full bg-accent border-transparent rounded-xl p-3 outline-none focus:ring-1 focus:ring-primary transition-all"
                                            value={newItem.category}
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        >
                                            {existingCategories.length > 0 ? (
                                                existingCategories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option value="Bengali">Bengali</option>
                                                    <option value="Indian">Indian</option>
                                                    <option value="Chinese">Chinese</option>
                                                    <option value="Starters">Starters</option>
                                                    <option value="Drinks">Drinks</option>
                                                    <option value="Desserts">Desserts</option>
                                                </>
                                            )}
                                        </select>
                                    )}
                                </div>
                                <div className="space-y-3 md:col-span-2 lg:col-span-1">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                        <span>Item Image</span>
                                        {newItem.image && (
                                            <button
                                                type="button"
                                                onClick={() => setNewItem({ ...newItem, image: "" })}
                                                className="text-[10px] text-red-500 hover:underline"
                                            >
                                                Clear Image
                                            </button>
                                        )}
                                    </label>

                                    {/* Premium Dual UI: Upload or Paste */}
                                    <div className="space-y-3">
                                        {/* 1. Upload Area */}
                                        <div className="relative group/upload">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className={cn(
                                                    "flex flex-col items-center justify-center w-full min-h-[140px] rounded-2xl border-2 border-dashed transition-all cursor-pointer relative overflow-hidden",
                                                    newItem.image
                                                        ? "border-primary/50 bg-primary/5"
                                                        : "border-border hover:border-primary/50 bg-accent/30"
                                                )}
                                            >
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                        <span className="text-xs font-bold text-primary animate-pulse uppercase tracking-widest">Uploading...</span>
                                                    </div>
                                                ) : newItem.image ? (
                                                    <div className="absolute inset-0 w-full h-full">
                                                        <img
                                                            src={fixUnsplashUrl(newItem.image)}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover/upload:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <Upload size={20} className="text-white" />
                                                                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change Image</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover/upload:text-primary transition-colors py-6">
                                                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-inner">
                                                            <ImagePlus size={24} strokeWidth={1.5} />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload local photo</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>

                                        {/* 2. URL Fallback */}
                                        <div className="relative">
                                            <div className="flex items-center gap-2 mb-1.5 px-1">
                                                <div className="h-[1px] flex-1 bg-border/50" />
                                                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">or paste image link</span>
                                                <div className="h-[1px] flex-1 bg-border/50" />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="https://images.unsplash.com/..."
                                                    className="w-full bg-accent/50 border border-border/50 rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all pr-10"
                                                    value={newItem.image}
                                                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                                                />
                                                <ImageIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-muted-foreground italic px-1 pt-1">
                                        Tip: Photos from Pexels, Pixabay, or Times of India now work perfectly!
                                    </p>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <textarea
                                        placeholder="Tell us about this dish..."
                                        className="w-full bg-accent border-transparent rounded-xl p-3 outline-none focus:ring-1 focus:ring-primary transition-all h-12 min-h-[48px]"
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        required
                                    />
                                </div>

                                {newItem.menu_type === "CAFE" && (
                                    <>
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-sm font-medium text-muted-foreground">Variant Prices (JSON)</label>
                                            <input
                                                type="text"
                                                placeholder='{"veg": 100, "chicken": 150}'
                                                className="w-full bg-accent border-transparent rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-primary transition-all"
                                                value={variantInput}
                                                onChange={(e) => {
                                                    setVariantInput(e.target.value);
                                                    try {
                                                        const parsed = JSON.parse(e.target.value);
                                                        setNewItem({ ...newItem, variant_prices: parsed });
                                                    } catch (e) { }
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-1">
                                            <label className="text-sm font-medium text-muted-foreground">Price Options (Comma separated)</label>
                                            <input
                                                type="text"
                                                placeholder="15, 20, 25"
                                                className="w-full bg-accent border-transparent rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-primary transition-all"
                                                value={priceOptionsInput}
                                                onChange={(e) => {
                                                    setPriceOptionsInput(e.target.value);
                                                    const parsed = e.target.value.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                                                    setNewItem({ ...newItem, price_options: parsed });
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center col-span-1 md:col-span-2 lg:col-span-3 pt-2">
                                    <div className="flex flex-wrap gap-x-6 gap-y-3 items-center w-full lg:w-auto">
                                        <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-primary rounded cursor-pointer"
                                                checked={newItem.isVeg}
                                                onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium group-hover:text-primary transition-colors">Vegetarian</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
                                                checked={newItem.isBestseller}
                                                onChange={(e) => setNewItem({ ...newItem, isBestseller: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium group-hover:text-yellow-500 transition-colors">Bestseller</span>
                                        </label>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full lg:w-auto lg:ml-auto px-6 lg:px-8 py-6 rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 overflow-hidden"
                                    >
                                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                        <span className="truncate">{isEditing ? "Update Menu Item" : "Save Item to Menu"}</span>
                                    </Button>
                                </div>
                            </form>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* ── Admin Tab Switcher ─────────────────────── */}
                <div className="flex items-center gap-2 mb-6 bg-card border border-border rounded-2xl p-1.5 w-fit">
                    {([
                        { key: 'menu', label: 'Menu Items', icon: <Utensils size={14} /> },
                        { key: 'specials', label: "Today's Special", icon: <Star size={14} /> },
                        { key: 'events', label: 'Events', icon: <CalendarDays size={14} /> },
                    ] as const).map(t => (
                        <button key={t.key} onClick={() => setAdminTab(t.key)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                                ${adminTab === t.key ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>
                            {t.icon}{t.label}
                        </button>
                    ))}
                </div>

                {/* ── TODAY'S SPECIAL TAB ───────────────────── */}
                {adminTab === 'specials' && (
                    <div className="bg-card border border-border rounded-3xl p-6 shadow-xl mb-8">
                        <h2 className="text-xl font-bold font-heading mb-1">Today&apos;s Special</h2>
                        <p className="text-muted-foreground text-sm mb-5">Toggle any item to feature it on the homepage today.</p>
                        {/* Search */}
                        <div className="relative mb-5">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text" placeholder="Search menu items..."
                                value={specSearch} onChange={e => setSpecSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-accent border-transparent rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {menuItems
                                .filter(i => i.name.toLowerCase().includes(specSearch.toLowerCase()))
                                .map(item => {
                                    const isSpecial = todaysSpecialIds.includes(item.id);
                                    return (
                                        <div key={item.id}
                                            className={`relative flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all duration-200 group
                                                ${isSpecial ? 'border-primary bg-primary/10' : 'border-border bg-accent/40 hover:border-primary/40'}`}
                                            onClick={() => toggleSpecial(item)}
                                        >
                                            {/* Item image */}
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                                {item.image
                                                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full bg-card flex items-center justify-center"><Utensils size={16} className="text-muted-foreground" /></div>
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">₹{item.price} · {item.category}</p>
                                            </div>
                                            {/* Toggle star */}
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all
                                                ${isSpecial ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground group-hover:bg-primary/20'}`}>
                                                {togglingSpecial === item.id
                                                    ? <Loader2 size={13} className="animate-spin" />
                                                    : <Star size={13} fill={isSpecial ? 'currentColor' : 'none'} />
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                )}

                {/* ── EVENTS TAB ───────────────────────────── */}
                {adminTab === 'events' && (
                    <div className="space-y-8">
                        {/* Add/Edit Event Form */}
                        <div id="event-form" className="bg-card border border-border rounded-3xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold font-heading mb-4">
                                {isEditingEvent ? 'Edit Event' : 'Add New Event'}
                            </h2>
                            <form onSubmit={handleSaveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Event Title *</label>
                                    <input required type="text" placeholder="e.g. Durga Puja Special Night"
                                        value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                                        className="w-full bg-accent border-transparent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Event Date *</label>
                                    <input required type="date"
                                        value={eventForm.event_date} onChange={e => setEventForm(f => ({ ...f, event_date: e.target.value }))}
                                        className="w-full bg-accent border-transparent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <textarea placeholder="Describe the event..." rows={3}
                                        value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
                                        className="w-full bg-accent border-transparent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary resize-none" />
                                </div>
                                {/* Multi-image upload */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground flex justify-between">
                                        <span>Event Images <span className="text-xs text-muted-foreground/60">(max 10)</span></span>
                                        <span className="text-[10px] font-bold text-primary">{eventImages.length}/10</span>
                                    </label>
                                    {/* Thumbnails row */}
                                    {eventImages.length > 0 && (
                                        <div className="flex gap-2 flex-wrap mb-2">
                                            {eventImages.map((url, i) => (
                                                <div key={i} className="relative w-20 h-14 rounded-xl overflow-hidden border border-border group">
                                                    <img src={url} alt={`img ${i + 1}`} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeEventImage(i)}
                                                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        <X size={9} />
                                                    </button>
                                                    {i === 0 && <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-primary text-primary-foreground px-1 rounded">Cover</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2 items-center">
                                        <label className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/30 text-primary rounded-xl text-sm font-medium cursor-pointer hover:bg-primary/20 transition-all shrink-0",
                                            eventImages.length >= 10 && "opacity-50 cursor-not-allowed pointer-events-none"
                                        )}>
                                            {eventUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                            {eventUploading ? 'Uploading...' : '+ Add Image'}
                                            <input type="file" accept="image/*" className="hidden" onChange={handleEventPosterUpload} disabled={eventImages.length >= 10} />
                                        </label>
                                        <span className="text-xs text-muted-foreground">or</span>
                                        <div className="flex-1 flex gap-2">
                                            <input type="text" placeholder="Paste image URL then press Add" id="url-input"
                                                className="flex-1 bg-accent border-transparent rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
                                            <button type="button"
                                                onClick={(e) => {
                                                    const input = document.getElementById('url-input') as HTMLInputElement;
                                                    if (input.value.trim()) {
                                                        if (eventImages.length < 10) {
                                                            setEventImages(prev => [...prev, input.value.trim()]);
                                                            input.value = '';
                                                        } else {
                                                            alert("Max 10 images allowed.");
                                                        }
                                                    }
                                                }}
                                                className="px-3 py-2 bg-accent border border-border rounded-xl text-xs font-medium hover:bg-primary/10 transition whitespace-nowrap"
                                            >Add</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3">
                                    {isEditingEvent && (
                                        <Button type="button" variant="outline" onClick={() => {
                                            setIsEditingEvent(false);
                                            setEditingEventId(null);
                                            setEventForm({ title: '', description: '', event_date: '' });
                                            setEventImages([]);
                                        }}>
                                            Cancel
                                        </Button>
                                    )}
                                    <Button type="submit" disabled={eventSaving} className="px-8 gap-2">
                                        {eventSaving && <Loader2 size={14} className="animate-spin" />}
                                        {isEditingEvent ? 'Update Event' : 'Add Event'}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Events List */}
                        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold font-heading mb-5">All Events</h2>
                            {eventsLoading ? (
                                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
                            ) : events.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground text-sm">No events yet. Add one above!</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {events.map(ev => (
                                        <div key={ev.id} className={`rounded-2xl border overflow-hidden transition-all ${ev.is_active ? 'border-border' : 'border-border/30 opacity-60'}`}>
                                            {ev.poster_url && (
                                                <div className="relative w-full h-36">
                                                    <img src={ev.poster_url} alt={ev.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h3 className="font-bold text-sm leading-tight">{ev.title}</h3>
                                                    <div className="flex gap-1 shrink-0">
                                                        <button onClick={() => handleEditEvent(ev)}
                                                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                                                            title="Edit Event">
                                                            <Pencil size={13} />
                                                        </button>
                                                        <button onClick={() => handleToggleEvent(ev)}
                                                            className={`p-1.5 rounded-lg transition-all ${ev.is_active ? 'bg-green-500/15 text-green-500 hover:bg-green-500/30' : 'bg-red-500/15 text-red-500 hover:bg-red-500/30'}`}
                                                            title={ev.is_active ? 'Deactivate' : 'Activate'}>
                                                            {ev.is_active ? <Power size={13} /> : <PowerOff size={13} />}
                                                        </button>
                                                        <button onClick={() => handleDeleteEvent(ev.id)}
                                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/25 transition-all"
                                                            title="Delete Event">
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-primary font-medium mb-1">
                                                    {new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                {ev.description && <p className="text-xs text-muted-foreground line-clamp-2">{ev.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── MENU ITEMS TAB ───────────────────────── */}
                {adminTab === 'menu' && (
                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                            {menuItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    className={`relative group p-4 rounded-2xl border transition-all flex flex-col ${item.available ? "bg-accent/50 border-border" : "bg-accent/20 border-border/50 opacity-60"}`}
                                >
                                    <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleAvailability(item);
                                                }}
                                                className={`w-12 h-6 rounded-full relative transition-all duration-300 backdrop-blur-md border border-white/20 ${item.available ? "bg-green-500/80" : "bg-red-500/80"}`}
                                                title={item.available ? "Disable Item" : "Enable Item"}
                                            >
                                                <motion.div
                                                    animate={{ x: item.available ? 24 : 4 }}
                                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                                                />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditItem(item);
                                                }}
                                                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-primary transition-all"
                                                title="Edit Item"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(item.id);
                                                }}
                                                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-red-500 transition-all"
                                                title="Delete Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <h3 className="font-bold font-heading line-clamp-1">{item.name}</h3>
                                                <span className={cn(
                                                    "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded w-fit mt-1",
                                                    item.menu_type === "CAFE" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {item.menu_type || "RESTAURANT"}
                                                </span>
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">{item.category}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{item.description}</p>

                                        <div className="flex items-center gap-3 mt-auto">
                                            <span className="text-sm font-bold text-foreground">₹</span>
                                            <input
                                                type="number"
                                                defaultValue={item.price}
                                                onBlur={(e) => updatePrice(item.id, Number(e.target.value))}
                                                className="w-20 bg-background border-border border rounded-lg px-2 py-1 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                                            />
                                            <div className={`ml-auto w-3 h-3 rounded-full ${item.available ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {menuItems.length === 0 && (
                            <div className="text-center py-20">
                                <Utensils size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                                <p className="text-muted-foreground">Your menu is currently empty.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
