"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const phoneNumber = "+919432750140";
    const secondaryPhoneNumber = "+918420680650";
    const whatsappLink = `https://wa.me/${phoneNumber.replace("+", "")}`;

    useEffect(() => {
        setMounted(true);
        console.log("FloatingContact [v3-FINAL] Mounted at", new Date().toISOString());
    }, []);

    if (!mounted) return null;

    return (
        <>


            <div
                id="floating-contact-widget"
                className="fixed bottom-6 right-6 z-[99999] flex flex-col items-end gap-3 print:hidden"
                style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999 }}
            >
                {/* Expanded Options */}
                <AnimatePresence mode="wait">
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
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                <span className="text-xs font-bold whitespace-nowrap bg-black/40 text-white px-2 py-1 rounded">
                                    WhatsApp Us
                                </span>
                                <MessageCircle size={24} />
                            </a>

                            {/* Call Button Primary */}
                            <a
                                href={`tel:${phoneNumber}`}
                                className="group flex items-center gap-3 bg-[#EFB11D] text-black px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                <span className="text-xs font-bold whitespace-nowrap bg-black/40 text-white px-2 py-1 rounded">
                                    Call Primary
                                </span>
                                <Phone size={24} />
                            </a>

                            {/* Call Button Secondary */}
                            <a
                                href={`tel:${secondaryPhoneNumber}`}
                                className="group flex items-center gap-3 bg-[#EFB11D] text-black px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                <span className="text-xs font-bold whitespace-nowrap bg-black/40 text-white px-2 py-1 rounded">
                                    Call Secondary
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
                        "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 z-[99999] border-2 border-white/20",
                        isOpen ? "bg-gray-900 text-white" : "bg-[#EFB11D] text-black shadow-[0_0_20px_rgba(239,177,29,0.5)]"
                    )}
                    style={{
                        backgroundColor: isOpen ? '#111' : '#EFB11D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999
                    }}
                >
                    {isOpen ? (
                        <X size={32} />
                    ) : (
                        <div className="relative">
                            <MessageSquare size={32} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#EFB11D]" />
                        </div>
                    )}
                </button>
            </div>
        </>
    );
}
