"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false);
    const phoneNumber = "+918420680650";
    const whatsappLink = `https://wa.me/${phoneNumber.replace("+", "")}`;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 print:hidden">
            {/* Expanded Options */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="flex flex-col gap-3 mb-2"
                    >
                        {/* WhatsApp Button */}
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <span className="text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                WhatsApp Us
                            </span>
                            <MessageCircle size={24} />
                        </a>

                        {/* Call Button */}
                        <a
                            href={`tel:${phoneNumber}`}
                            className="group flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <span className="text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                Call Now
                            </span>
                            <Phone size={24} />
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95",
                    isOpen
                        ? "bg-muted-foreground text-background rotate-90"
                        : "bg-primary text-primary-foreground animate-bounce-slow"
                )}
            >
                {isOpen ? (
                    <X size={28} />
                ) : (
                    <div className="relative">
                        <MessageSquare size={28} />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-primary animate-pulse" />
                    </div>
                )}
            </button>
        </div>
    );
}

// Add bounce animation to globals if not present, but here using standard scale
