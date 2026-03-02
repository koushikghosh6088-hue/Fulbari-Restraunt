"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                // For a simple demo/app, we'll use localStorage to keep the session
                localStorage.setItem("adminLoggedIn", "true");
                router.push("/admin/dashboard");
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-4 pt-24 md:pt-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 rounded-3xl bg-card border border-border shadow-2xl relative overflow-hidden"
                >
                    {/* Glow effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                    <div className="text-center mb-8 relative z-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                            <Lock className="text-primary" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold font-heading mb-2">Admin Login</h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your credentials to manage Fulbari Restaurant
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-accent border border-transparent focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-accent border border-transparent focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-red-500 font-medium text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-6 rounded-xl text-base font-bold shadow-lg shadow-primary/20 group"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    Logging in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Access Dashboard
                                </span>
                            )}
                        </Button>
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
