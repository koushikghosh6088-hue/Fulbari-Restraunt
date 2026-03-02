"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn, sanitizeImageUrl, fixUnsplashUrl } from "@/lib/utils";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
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
    ShieldAlert,
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

interface GalleryItem {
    id: string;
    url: string;
    category: 'Cafe' | 'Restaurant' | 'Ambience' | 'Food' | 'Other';
    created_at: string;
}

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isVeg: boolean;
    available: boolean;
    menu_type: "RESTAURANT" | "CAFE";
    variant_prices?: Record<string, number>;
    price_options?: number[];
}

export default function AdminDashboard() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    // helper to quickly verify a File can be decoded/displayed by the browser
    const canDisplayFile = (file: File): Promise<boolean> => {
        return new Promise((res) => {
            const img = document.createElement('img');
            const url = URL.createObjectURL(file);
            let settled = false;
            img.onload = () => { if (!settled) { settled = true; URL.revokeObjectURL(url); res(true); } };
            img.onerror = () => { if (!settled) { settled = true; URL.revokeObjectURL(url); res(false); } };
            img.src = url;
            setTimeout(() => { if (!settled) { settled = true; URL.revokeObjectURL(url); res(false); } }, 5000);
        });
    };
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

    // ── Navigation ──
    const [adminTab, setAdminTab] = useState<'menu' | 'specials' | 'events' | 'gallery'>('menu');
    const [todaysSpecialIds, setTodaysSpecialIds] = useState<string[]>([]);
    const [specSearch, setSpecSearch] = useState('');
    const [togglingSpecial, setTogglingSpecial] = useState<string | null>(null);

    // ── Events state ──
    const [events, setEvents] = useState<EventItem[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '' });
    const [eventImages, setEventImages] = useState<string[]>([]);
    const [eventLocalPreviews, setEventLocalPreviews] = useState<string[]>([]); // object URLs while uploading/remote not ready
    const [eventUploading, setEventUploading] = useState(false);
    const [eventUploads, setEventUploads] = useState(0); // active uploads counter
    const [eventSaving, setEventSaving] = useState(false);
    const [isEditingEvent, setIsEditingEvent] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    // ── Gallery state ──
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [galleryForm, setGalleryForm] = useState({ url: '', category: 'Food' as GalleryItem['category'] });
    const [galleryLocalPreview, setGalleryLocalPreview] = useState<string>('');
    const [galleryUploading, setGalleryUploading] = useState(false);
    const [gallerySaving, setGallerySaving] = useState(false);

    // ── Menu image preview ──
    const [menuLocalPreview, setMenuLocalPreview] = useState<string>('');

    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        price: "" as any,
        category: "Bengali",
        image: "",
        isVeg: false,
        available: true,
        menu_type: "RESTAURANT" as "RESTAURANT" | "CAFE",
        variant_prices: {} as Record<string, number>,
        price_options: [] as number[]
    });

    const [variantInput, setVariantInput] = useState("");
    const [priceOptionsInput, setPriceOptionsInput] = useState("");

    // ── Menu Search & Filters ──
    const [menuSearch, setMenuSearch] = useState("");
    const [menuTypeFilter, setMenuTypeFilter] = useState<"ALL" | "RESTAURANT" | "CAFE">("ALL");
    const [menuCategoryFilter, setMenuCategoryFilter] = useState("All");

    const [customCategory, setCustomCategory] = useState("");
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const [storageStatus, setStorageStatus] = useState<any>(null);
    const [isCheckingStorage, setIsCheckingStorage] = useState(false);

    const checkStorage = async () => {
        setIsCheckingStorage(true);
        try {
            const res = await fetch('/api/init-storage');
            const data = await res.json();
            setStorageStatus(data.buckets);
            if (data.success) {
                setShowToast({
                    show: true,
                    message: "Storage Status Checked!",
                    type: 'success'
                });
            }
        } catch (error) {
            console.error("Storage check failed", error);
        } finally {
            setIsCheckingStorage(false);
            setTimeout(() => setShowToast(p => ({ ...p, show: false })), 3000);
        }
    };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("adminLoggedIn");
        if (!isLoggedIn) { router.push("/admin/login"); return; }
        fetchMenu();
        fetchTodaysSpecials();
        fetchEvents();
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setGalleryLoading(true);
        try {
            const res = await fetch('/api/gallery');
            const data = await res.json();
            setGalleryItems(Array.isArray(data) ? data : []);
        } catch { }
        finally { setGalleryLoading(false); }
    };

    const fetchTodaysSpecials = async () => {
        try {
            const res = await fetch('/api/daily-specials');
            const data = await res.json();
            setTodaysSpecialIds((Array.isArray(data) ? data : []).map((i: MenuItem) => i.id));
        } catch { }
    };

    const fetchEvents = async () => {
        setEventsLoading(true);
        try {
            const res = await fetch('/api/events?all=true');
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



    const removeEventImage = (idx: number) => {
        setEventImages(prev => prev.filter((_, i) => i !== idx));
        setEventLocalPreviews(prev => {
            const copy = [...prev];
            const removed = copy.splice(idx, 1);
            if (removed[0]) URL.revokeObjectURL(removed[0]);
            return copy;
        });
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
                        poster_url: eventImages[0] ? eventImages[0] : null,
                        image_urls: eventImages,
                    }
                }),
            });
            if (res.ok) {
                setEventForm({ title: '', description: '', event_date: '' });
                setEventImages([]);
                setEventLocalPreviews([]);
                setEventUploads(0);
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

    // ── Gallery Actions ──


    const handleSaveGalleryItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!galleryForm.url) return;
        setGallerySaving(true);
        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'ADD',
                    item: {
                        ...galleryForm,
                        url: galleryForm.url
                    }
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setGalleryForm({ url: '', category: 'Food' });
                setGalleryLocalPreview('');
                fetchGallery();
                setShowToast({ show: true, message: "Image Added to Gallery!", type: 'success' });
            } else {
                throw new Error(data.error || "Failed to save item");
            }
        } catch (err: any) {
            console.error("Gallery save error:", err);
            setShowToast({ show: true, message: `Save Failed: ${err.message}. Ensure 'gallery_items' table exists.`, type: 'error' });
        }
        finally { setGallerySaving(false); }
        setTimeout(() => setShowToast(p => ({ ...p, show: false })), 4000);
    };

    const handleDeleteGalleryItem = async (id: string) => {
        if (!confirm('Delete this gallery image?')) return;
        await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'DELETE', item: { id } }),
        });
        fetchGallery();
    };

    // Derive categories from existing items
    const existingCategories = useMemo(() => {
        if (!Array.isArray(menuItems)) return [];
        return Array.from(new Set(menuItems.map(item => item.category)));
    }, [menuItems]);

    // ── Filtered Menu Items ──
    const filteredMenuItems = useMemo(() => {
        return (Array.isArray(menuItems) ? menuItems : []).filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                item.description.toLowerCase().includes(menuSearch.toLowerCase());
            const matchesType = menuTypeFilter === "ALL" || item.menu_type === menuTypeFilter;
            const matchesCategory = menuCategoryFilter === "All" || item.category === menuCategoryFilter;
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [menuItems, menuSearch, menuTypeFilter, menuCategoryFilter]);

    const fetchMenu = async () => {
        try {
            const res = await fetch("/api/menu");
            const data = await res.json();
            setMenuItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch menu");
            setMenuItems([]);
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
            available: item.available,
            menu_type: item.menu_type || "RESTAURANT",
            variant_prices: item.variant_prices || {},
            price_options: item.price_options || []
        });
        setVariantInput(item.variant_prices ? JSON.stringify(item.variant_prices) : "");
        setPriceOptionsInput(item.price_options ? item.price_options.join(", ") : "");
        setIsEditing(true);
        setEditingId(item.id);
        setShowAddForm(true);

        // Scroll to form automatically
        setTimeout(() => {
            const form = document.querySelector('#admin-menu-form');
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
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
                setMenuLocalPreview('');
                setNewItem({
                    name: "",
                    description: "",
                    price: "" as any,
                    category: "Bengali",
                    image: "",
                    isVeg: false,
                    available: true,
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
        } catch (error: any) {
            console.error("Price update failed", error);
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
                                        price: "" as any,
                                        category: "Bengali",
                                        image: "",
                                        isVeg: false,
                                        available: true,
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
                            onClick={checkStorage}
                            disabled={isCheckingStorage}
                            className={cn(
                                "rounded-full border-blue-500/20 text-blue-500 hover:bg-blue-500/10",
                                storageStatus && Object.values(storageStatus).some((s: any) => s.status !== 'OK') && "border-amber-500 text-amber-500 animate-pulse"
                            )}
                        >
                            {isCheckingStorage ? <Loader2 size={18} className="animate-spin mr-2" /> : <ShieldAlert className="mr-2" size={18} />}
                            {storageStatus ? "Storage Checked" : "Setup Storage"}
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

                {/* Storage Status Banner */}
                {storageStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col md:flex-row gap-4 items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-blue-500" size={20} />
                            <div>
                                <h3 className="text-sm font-bold">Supabase Storage Status</h3>
                                <div className="flex gap-4 mt-1 flex-wrap">
                                    {Object.entries(storageStatus).map(([name, info]: [string, any]) => (
                                        <div key={name} className="flex flex-col gap-1">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block w-fit",
                                                info.status === 'OK' ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                                            )}>
                                                {name}: {info.status}
                                            </span>
                                            {info.message && info.status !== 'OK' && (
                                                <span className="text-[9px] text-red-400 max-w-[150px] leading-tight font-medium">
                                                    {info.message}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {Object.values(storageStatus).some((s: any) => s.status !== 'OK') && (
                            <p className="text-[10px] text-muted-foreground italic md:max-w-md">
                                Tip: Ensure your Supabase buckets are set to <strong>'Public'</strong>
                                in the Supabase Dashboard {' > '} Storage.
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Add Item Form */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.section
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-12"
                            id="admin-menu-form"
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
                                        value={newItem.price === 0 && !isEditing ? "" : newItem.price}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setNewItem({ ...newItem, price: val === "" ? "" as any : Number(val) });
                                        }}
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
                                        {(newItem.image || menuLocalPreview) && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNewItem({ ...newItem, image: "" });
                                                    setMenuLocalPreview("");
                                                }}
                                                className="text-[10px] font-bold text-red-500 hover:underline bg-red-500/10 px-2 py-1 rounded transition-colors"
                                            >
                                                Clear Image
                                            </button>
                                        )}
                                    </label>

                                    {/* Premium Dual UI: Upload or Paste */}
                                    <div className="space-y-3">
                                        {/* 1. Upload Area */}
                                        <div className="border-2 border-dashed border-border rounded-2xl overflow-hidden bg-accent/30 p-2">
                                            {newItem.image || menuLocalPreview ? (
                                                <div className="relative w-full h-32 rounded-xl overflow-hidden group/upload">
                                                    <img
                                                        src={menuLocalPreview || sanitizeImageUrl(fixUnsplashUrl(newItem.image))}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 md:group-hover/upload:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setNewItem({ ...newItem, image: "" });
                                                                setMenuLocalPreview("");
                                                            }}
                                                            className="flex flex-col items-center gap-1 cursor-pointer pointer-events-auto"
                                                        >
                                                            <Trash2 size={20} className="text-white" />
                                                            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Remove Image</span>
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setNewItem({ ...newItem, image: "" });
                                                            setMenuLocalPreview("");
                                                        }}
                                                        className="md:hidden absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg z-10"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <UploadDropzone
                                                    endpoint="menuImage"
                                                    config={{ mode: "auto" }}
                                                    onClientUploadComplete={(res) => {
                                                        if (res && res.length > 0) {
                                                            setNewItem({ ...newItem, image: res[0].url });
                                                            setMenuLocalPreview(res[0].url);
                                                            setShowToast({ show: true, message: "Image uploaded successfully!", type: 'success' });
                                                        }
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        setShowToast({ show: true, message: `Upload failed: ${error.message}`, type: 'error' });
                                                    }}
                                                    appearance={{
                                                        label: "text-primary hover:text-primary/80 text-xs",
                                                        button: "bg-primary text-white text-xs px-4 py-2",
                                                    }}
                                                />
                                            )}
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
                        { key: 'gallery', label: 'Gallery', icon: <ImageIcon size={14} /> },
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
                            {(Array.isArray(menuItems) ? menuItems : [])
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
                                                    ? <img
                                                        src={sanitizeImageUrl(item.image)}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            console.error(`Admin special item list image failed: ${target.src}`);
                                                        }}
                                                    />
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
                                    {/* UploadThing Dropzone */}
                                    <div className="border-2 border-dashed border-border rounded-2xl overflow-hidden bg-accent/30 p-2 relative group/upload">
                                        <UploadDropzone
                                            endpoint="eventImage"
                                            config={{ mode: "auto" }}
                                            onClientUploadComplete={(res) => {
                                                if (res && res.length > 0) {
                                                    const newUrls = res.map(r => r.url);
                                                    setEventImages(prev => {
                                                        const updated = [...prev, ...newUrls].slice(0, 10);
                                                        return updated;
                                                    });
                                                    setShowToast({ show: true, message: "Images uploaded successfully!", type: 'success' });
                                                }
                                            }}
                                            onUploadError={(error: Error) => {
                                                setShowToast({ show: true, message: `Upload failed: ${error.message}`, type: 'error' });
                                            }}
                                            appearance={{
                                                label: "text-primary hover:text-primary/80 text-xs",
                                                button: "bg-primary text-white text-xs px-4 py-2",
                                            }}
                                        />
                                    </div>
                                    {/* paste URL input */}
                                    <div className="flex-1 flex gap-2 pt-2">
                                        <input
                                            type="text"
                                            placeholder="Paste image URL then press Add"
                                            id="url-input"
                                            className="flex-1 bg-accent border-transparent rounded-xl p-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <button
                                            type="button"
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
                                    {/* thumbnails strip */}
                                    {(eventImages.length > 0 || eventLocalPreviews.length > 0) && (
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {Array.from({ length: Math.max(eventImages.length, eventLocalPreviews.length) }).map((_, i) => {
                                                const url = eventImages[i];
                                                const local = eventLocalPreviews[i];
                                                return (
                                                    <div key={i} className="relative w-20 h-14 rounded-xl overflow-hidden border border-border group">
                                                        <img
                                                            src={
                                                                local
                                                                    ? local
                                                                    : url
                                                                        ? sanitizeImageUrl(url)
                                                                        : ''
                                                            }
                                                            alt={`img ${i + 1}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                console.error(`Admin event thumbnail failed: ${target.src}`);
                                                            }}
                                                        />
                                                        <button type="button" onClick={() => removeEventImage(i)}
                                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-md">
                                                            <X size={12} />
                                                        </button>
                                                        {i === 0 && <span className="absolute bottom-0.5 left-0.5 text-[8px] bg-primary text-primary-foreground px-1 rounded">Cover</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
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
                                    <Button type="submit" disabled={eventSaving || eventUploads > 0} className="px-8 gap-2">
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
                                            <div className="relative w-full h-36 bg-accent/30 flex items-center justify-center">
                                                {(ev.poster_url || (ev.image_urls && ev.image_urls.length > 0)) ? (
                                                    <img
                                                        src={sanitizeImageUrl(ev.poster_url || ev.image_urls[0])}
                                                        alt={ev.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            console.error(`Admin event list image failed: ${target.src}`);
                                                            target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <CalendarDays size={32} className="text-muted-foreground/40" />
                                                )}
                                            </div>
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

                {/* ── GALLERY TAB ───────────────────────────── */}
                {adminTab === 'gallery' && (
                    <div className="space-y-8">
                        {/* Upload Gallery Form */}
                        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold font-heading mb-4">Add Gallery Image</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Select Category</label>
                                        <select
                                            value={galleryForm.category}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                                            className="w-full bg-accent border-transparent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary font-bold"
                                        >
                                            <option value="Food">Food</option>
                                            <option value="Ambience">Ambience</option>
                                            <option value="Event">Event</option>
                                            <option value="People">People</option>
                                        </select>
                                    </div>

                                    {/* Uploading section */}
                                    <div className="p-4 rounded-xl border border-dashed border-border/60 bg-accent/30 flex flex-col items-center justify-center text-center">
                                        {(() => {
                                            const categoryImagesCount = galleryItems.filter(img => img.category === galleryForm.category).length;
                                            if (categoryImagesCount >= 10) {
                                                return (
                                                    <div className="text-red-500 py-6">
                                                        <div className="text-sm font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">Maximum 10 images reached for the "{galleryForm.category}" category.</div>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div className="w-full">
                                                    <UploadDropzone
                                                        endpoint="galleryImage"
                                                        onClientUploadComplete={(res) => {
                                                            if (res?.[0]) {
                                                                setGalleryForm(prev => ({ ...prev, url: res[0].url }));
                                                                setShowToast({ show: true, message: "Image Uploaded! Click 'Add to Gallery' to save.", type: 'success' });
                                                            }
                                                        }}
                                                        onUploadError={(error: Error) => {
                                                            setShowToast({ show: true, message: `Upload Failed: ${error.message}`, type: 'error' });
                                                        }}
                                                        config={{ mode: "auto" }}
                                                    />
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <form onSubmit={handleSaveGalleryItem}>
                                        {galleryForm.url && (
                                            <div className="mb-4 bg-accent p-2 rounded-lg border border-border flex justify-between items-center">
                                                <span className="text-xs truncate text-muted-foreground font-mono">{galleryForm.url}</span>
                                                <button type="button" onClick={() => setGalleryForm(prev => ({ ...prev, url: '' }))} className="text-red-500 hover:text-red-600 px-2 text-xs font-bold">Clear</button>
                                            </div>
                                        )}
                                        <Button type="submit" disabled={gallerySaving || !galleryForm.url} className="w-full h-12 rounded-xl mt-4">
                                            {gallerySaving && <Loader2 size={16} className="animate-spin mr-2" />}
                                            Save to Gallery Database
                                        </Button>
                                    </form>
                                </div>
                                <div className="space-y-4 pt-2">
                                    <h3 className="text-sm font-bold text-muted-foreground mb-3 border-b border-border pb-2">Category Limits</h3>
                                    <ul className="text-sm space-y-3 text-muted-foreground">
                                        <li className="flex items-center gap-2"><ImageIcon size={14} className="text-primary" /> <span>You can upload only 1 image at a time.</span></li>
                                        <li className="flex items-center gap-2"><ImageIcon size={14} className="text-primary" /> <span>Maximum 10 images are allowed per category.</span></li>
                                        <li className="flex items-center gap-2 mt-4 p-3 bg-accent rounded-lg">
                                            <span className="font-bold flex-1">Current images in '{galleryForm.category}':</span>
                                            <span className="font-bold text-primary">{galleryItems.filter(img => img.category === galleryForm.category).length}/10</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Gallery List */}
                        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl mt-6">
                            <h2 className="text-xl font-bold font-heading mb-5">Current Gallery ({galleryItems.length})</h2>
                            {galleryLoading ? (
                                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
                            ) : galleryItems.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground text-sm">No gallery images yet. Upload one above!</div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {galleryItems.map(item => (
                                        <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-square border border-border bg-accent/20">
                                            <img
                                                src={sanitizeImageUrl(item.url)}
                                                alt={item.category}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-3 backdrop-blur-sm pointer-events-none md:pointer-events-auto">
                                                <span className="text-white font-bold text-[10px] tracking-widest uppercase px-3 py-1 bg-white/20 border border-white/30 rounded-full">{item.category}</span>
                                                <button
                                                    onClick={() => handleDeleteGalleryItem(item.id)}
                                                    className="w-10 h-10 rounded-full bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-xl pointer-events-auto"
                                                    title="Delete Image"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteGalleryItem(item.id)}
                                                className="md:hidden absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg pointer-events-auto"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── MENU ITEMS TAB ───────────────────────── */}
                {
                    adminTab === 'menu' && (
                        <div className="space-y-6">
                            {/* Menu Filters */}
                            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Search size={14} /> Search Menu
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Search by name or description..."
                                        className="w-full bg-accent border-transparent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                                        value={menuSearch}
                                        onChange={(e) => setMenuSearch(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-48 space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Menu Type</label>
                                    <select
                                        className="w-full bg-accent border-transparent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary font-bold"
                                        value={menuTypeFilter}
                                        onChange={(e) => setMenuTypeFilter(e.target.value as any)}
                                    >
                                        <option value="ALL">All Types</option>
                                        <option value="RESTAURANT">Restaurant</option>
                                        <option value="CAFE">Cafe</option>
                                    </select>
                                </div>
                                <div className="w-full md:w-48 space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                                    <select
                                        className="w-full bg-accent border-transparent rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                                        value={menuCategoryFilter}
                                        onChange={(e) => setMenuCategoryFilter(e.target.value)}
                                    >
                                        <option value="All">All Categories</option>
                                        {existingCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                {(menuSearch || menuTypeFilter !== "ALL" || menuCategoryFilter !== "All") && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setMenuSearch("");
                                            setMenuTypeFilter("ALL");
                                            setMenuCategoryFilter("All");
                                        }}
                                        className="text-xs text-muted-foreground hover:text-primary h-11 px-4"
                                    >
                                        <X size={14} className="mr-1" /> Clear
                                    </Button>
                                )}
                            </div>

                            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                                    {filteredMenuItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            className={`relative group p-4 rounded-2xl border transition-all flex flex-col ${item.available ? "bg-accent/50 border-border" : "bg-accent/20 border-border/50 opacity-60"}`}
                                        >
                                            <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                                                <img
                                                    src={sanitizeImageUrl(item.image)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        console.error(`Admin menu list image failed: ${target.src}`);
                                                        target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
                                                    }}
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
                                {filteredMenuItems.length === 0 && (
                                    <div className="text-center py-20">
                                        <Utensils size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                                        <p className="text-muted-foreground">
                                            {menuItems.length === 0 ? "Your menu is currently empty." : "No items match your filters."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }
            </main >
            <Footer />
        </div >
    );
}
