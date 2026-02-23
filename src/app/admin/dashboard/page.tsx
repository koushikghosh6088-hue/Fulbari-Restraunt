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
    AlertCircle
} from "lucide-react";

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

    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        price: 0,
        category: "Bengali",
        image: "",
        isVeg: false,
        isBestseller: false
    });

    const [customCategory, setCustomCategory] = useState("");
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    useEffect(() => {
        // Simple protected route check
        const isLoggedIn = localStorage.getItem("adminLoggedIn");
        if (!isLoggedIn) {
            router.push("/admin/login");
            return;
        }
        fetchMenu();
    }, []);

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
            isBestseller: item.isBestseller || false
        });
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
                    isBestseller: false
                });
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
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: -20, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className={cn(
                            "fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 w-[90%] md:min-w-[320px] md:w-auto",
                            showToast.type === 'success' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        )}
                    >
                        {showToast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <span className="font-bold text-sm tracking-wide text-center flex-grow">{showToast.message}</span>
                    </motion.div>
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
                        <p className="text-muted-foreground">Manage your restaurant menu items dynamically</p>
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
                                        isBestseller: false
                                    });
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

                {/* Items List */}
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
                                        <h3 className="font-bold font-heading line-clamp-1">{item.name}</h3>
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
            </main>
            <Footer />
        </div>
    );
}
