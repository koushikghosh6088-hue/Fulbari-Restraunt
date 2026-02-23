"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
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
    ChevronUp
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
    const router = useRouter();

    // New item form state
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

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const categoryToSave = isCustomCategory ? customCategory : newItem.category;

        try {
            const res = await fetch("/api/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "ADD",
                    item: { ...newItem, category: categoryToSave }
                }),
            });
            if (res.ok) {
                setShowAddForm(false);
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
            }
        } catch (error) {
            console.error("Add failed");
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
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow pt-24 pb-12 px-4 container mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-foreground mb-1">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage your restaurant menu items dynamically</p>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-primary hover:bg-primary/90 rounded-full px-6"
                        >
                            {showAddForm ? <ChevronUp className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
                            {showAddForm ? "Close Form" : "Add New Item"}
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
                                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                                    <label className="text-sm font-medium text-muted-foreground">Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full bg-accent border-transparent rounded-xl p-3 outline-none focus:ring-1 focus:ring-primary transition-all"
                                        value={newItem.image}
                                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                                        required
                                    />
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
                                <div className="flex gap-6 items-center lg:col-span-3 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-primary rounded cursor-pointer"
                                            checked={newItem.isVeg}
                                            onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium group-hover:text-primary transition-colors">Vegetarian</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-yellow-500 rounded cursor-pointer"
                                            checked={newItem.isBestseller}
                                            onChange={(e) => setNewItem({ ...newItem, isBestseller: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium group-hover:text-yellow-500 transition-colors">Bestseller</span>
                                    </label>
                                    <Button type="submit" className="ml-auto px-8 py-6 rounded-2xl font-bold shadow-lg shadow-primary/20">
                                        Save Item to Menu
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
                                            onClick={() => toggleAvailability(item)}
                                            className={`p-2 rounded-full backdrop-blur-md border border-white/20 transition-all ${item.available ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"}`}
                                            title={item.available ? "Disable Item" : "Enable Item"}
                                        >
                                            {item.available ? <Power size={18} /> : <PowerOff size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-red-500/80 transition-all"
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
