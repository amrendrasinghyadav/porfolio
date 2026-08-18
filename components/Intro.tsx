"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function announceIntroComplete() {
    document.documentElement.dataset.portfolioIntroComplete = "true"
    window.dispatchEvent(new Event("portfolio:intro-complete"))
}

/**
 * Intro
 *
 * A cinematic, one-shot intro overlay that plays only when the hero route is
 * loaded directly.
 * It renders on top of the fully mounted portfolio and background (which stay
 * behind it the whole time), reveals a quote with a masked / blur / horizontal
 * distortion treatment, holds it, then compresses it out and fades the dark
 * overlay away to reveal the portfolio already in place — no reload, no shift.
 *
 * Timeline (see globals.css for the matching transition durations):
 *   0–400ms    dark screen
 *   400–1600   quote reveals   (1200ms transition)
 *   1100–1800  author reveals  (700ms transition)
 *   1800–4000  hold
 *   4000–4800  quote + author exit (800ms transition)
 *   4700–5500  overlay fades away (800ms transition), then unmounts
 *
 * Because it lives in the root layout, it can cover the fully mounted hero
 * without affecting other routes. Project and secondary routes skip it. Click
 * or press Escape to skip. Honors prefers-reduced-motion (simple fade).
 */
export default function Intro() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [shouldPlay] = useState(
        () => pathname === "/" && searchParams.get("reveal") !== "projects",
    )
    const [quoteIn, setQuoteIn] = useState(false)
    const [authorIn, setAuthorIn] = useState(false)
    const [exiting, setExiting] = useState(false)
    const [overlayHidden, setOverlayHidden] = useState(false)
    const [removed, setRemoved] = useState(false)

    const timers = useRef<number[]>([])
    const done = useRef(false)

    const unlock = () =>
        document.documentElement.classList.remove("intro-lock")

    const skip = useCallback(() => {
        if (done.current) return
        done.current = true
        timers.current.forEach(clearTimeout)
        timers.current = []
        // Jump straight to the exit, then fade + unmount quickly.
        setQuoteIn(true)
        setAuthorIn(true)
        setExiting(true)
        timers.current.push(window.setTimeout(() => setOverlayHidden(true), 200))
        timers.current.push(
            window.setTimeout(() => {
                setRemoved(true)
                unlock()
                announceIntroComplete()
            }, 900)
        )
    }, [])

    useEffect(() => {
        if (!shouldPlay) return

        const at = (ms: number, fn: () => void) =>
            timers.current.push(window.setTimeout(fn, ms))

        document.documentElement.classList.add("intro-lock")

        at(400, () => setQuoteIn(true))
        at(1100, () => setAuthorIn(true))
        at(4000, () => setExiting(true))
        at(4700, () => setOverlayHidden(true))
        at(5500, () => {
            done.current = true
            setRemoved(true)
            unlock()
            announceIntroComplete()
        })

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") skip()
        }
        window.addEventListener("keydown", onKey)

        return () => {
            timers.current.forEach(clearTimeout)
            timers.current = []
            window.removeEventListener("keydown", onKey)
            unlock()
        }
    }, [shouldPlay, skip])

    if (!shouldPlay || removed) return null

    const quoteState = exiting ? "out" : quoteIn ? "in" : "pre"
    const authorState = exiting ? "out" : authorIn ? "in" : "pre"

    return (
        <div
            className="intro"
            data-overlay={overlayHidden ? "hidden" : "shown"}
            onClick={skip}
        >
            <figure className="intro__figure">
                <blockquote className="intro__quote" data-state={quoteState}>
                    “A river cuts through rock, not because of its power, but because of its persistence.”
                </blockquote>
                <figcaption className="intro__author" data-state={authorState}>
                    ~ Jim Watkins
                </figcaption>
            </figure>
        </div>
    )
}
