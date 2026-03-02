"use client";

import { ReactLenis } from "lenis/react";
import { PropsWithChildren } from "react";

export function SmoothScrolling({ children }: PropsWithChildren) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.1, // Controls the speed of the scroll (lower is smoother/slower, higher is snappier text-to-scroll response)
                duration: 1.2, // Base duration for smooth scroll
                smoothWheel: true,
                wheelMultiplier: 1.2, // Makes standard mouse wheels feel a bit faster/snappier
                touchMultiplier: 2, // Keeps touch scrolling feeling native but fast
            }}
        >
            {children}
        </ReactLenis>
    );
}
