"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost" | "link";
    size?: "sm" | "md" | "lg" | "icon";
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, ...props }, ref) => {

        const variants = {
            primary: "bg-primary text-primary-foreground hover:bg-yellow-600 shadow-md",
            outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        };

        const sizes = {
            sm: "h-9 px-3 text-sm rounded-md",
            md: "h-11 px-6 text-base rounded-full", // Rounded full as per PRD
            lg: "h-14 px-8 text-lg rounded-full",
            icon: "h-10 w-10",
        };

        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props as HTMLMotionProps<"button">} // Cast to satisfy TS with framer motion if needed, but simple button props should work with HTMLButtonElement ref usually.
            // Actually, for framer motion button we might need motion.button props.
            >
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button };
