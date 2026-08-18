"use client"

import MountainContours from "@/components/MountainContours"
import { usePathname } from "next/navigation"

/**
 * BackgroundGrid
 *
 * The portfolio's permanent background system. This is the only place that
 * positions MountainContours — it pins the canvas to the full viewport and
 * keeps it fixed behind all page content while the page scrolls normally.
 *
 * MountainContours never contains page content;
 * this wrapper owns layout only. New portfolio sections are added in the
 * content layer (see app/layout.tsx) without touching the background.
 *
 * The visual is adapted from the supplied Alpine Contours source and remains
 * isolated from the scrolling content layer.
 */
export default function BackgroundGrid() {
    const pathname = usePathname()
    const isProjectDetail = pathname.startsWith("/work/")

    if (isProjectDetail) {
        return (
            <div
                className="background-grid background-grid--project"
                aria-hidden="true"
            />
        )
    }

    return (
        <div
            className="background-grid"
            data-interactive="true"
            aria-hidden="true"
        >
            <MountainContours interactive />
        </div>
    )
}
