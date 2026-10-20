"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

function announceIntroComplete() {
    document.documentElement.dataset.portfolioIntroComplete = "true"
    window.dispatchEvent(new Event("portfolio:intro-complete"))
}

/**
 * Cinematic opening overlay for direct visits to the landing page.
 * Click or press Escape to skip. Reduced-motion preferences keep a simple fade.
 */
export default function Intro() {
    const pathname = usePathname()
    const [shouldPlay] = useState(() => pathname === "/")
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
        setQuoteIn(true)
        setAuthorIn(true)
        setExiting(true)
        timers.current.push(window.setTimeout(() => setOverlayHidden(true), 200))
        timers.current.push(
            window.setTimeout(() => {
                setRemoved(true)
                unlock()
                announceIntroComplete()
            }, 900),
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

        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") skip()
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
                    “A river cuts through rock, not because of its power, but
                    because of its persistence.”
                </blockquote>
                <figcaption className="intro__author" data-state={authorState}>
                    ~ Jim Watkins
                </figcaption>
            </figure>
        </div>
    )
}
