"use client"

import { useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"

type HeroTypingTextProps = {
    text: string
}

const INTRO_COMPLETE_EVENT = "portfolio:intro-complete"
const HERO_RETURN_EVENT = "portfolio:hero-return"
const HERO_CLIENT_NAVIGATION_DATA_KEY = "portfolioHeroClientNavigation"
const START_DELAY_MS = 140
const LETTER_DELAY_MS = 76

export default function HeroTypingText({
    text,
}: HeroTypingTextProps) {
    const reduceMotion = useReducedMotion() ?? false
    const [visibleCharacters, setVisibleCharacters] = useState(
        reduceMotion ? text.length : 0,
    )
    const hasStartedRef = useRef(false)
    const timersRef = useRef<number[]>([])

    const clearTimers = useCallback(() => {
        timersRef.current.forEach(window.clearTimeout)
        timersRef.current = []
    }, [])

    const startTyping = useCallback(() => {
        if (hasStartedRef.current || reduceMotion) return

        hasStartedRef.current = true
        setVisibleCharacters(0)

        text.split("").forEach((_, index) => {
            timersRef.current.push(
                window.setTimeout(
                    () => setVisibleCharacters(index + 1),
                    START_DELAY_MS + index * LETTER_DELAY_MS,
                ),
            )
        })
    }, [reduceMotion, text])

    const restartTyping = useCallback(() => {
        clearTimers()

        if (reduceMotion) {
            hasStartedRef.current = true
            setVisibleCharacters(text.length)
            return
        }

        hasStartedRef.current = false
        startTyping()
    }, [clearTimers, reduceMotion, startTyping, text])

    useEffect(() => {
        if (reduceMotion) {
            hasStartedRef.current = true
            clearTimers()
            timersRef.current.push(
                window.setTimeout(
                    () => setVisibleCharacters(text.length),
                    0,
                ),
            )
            return
        }

        const handleIntroComplete = () => startTyping()
        const handleHeroReturn = () => restartTyping()
        window.addEventListener(
            INTRO_COMPLETE_EVENT,
            handleIntroComplete,
        )
        window.addEventListener(HERO_RETURN_EVENT, handleHeroReturn)

        const introAlreadyCompleted =
            document.documentElement.dataset.portfolioIntroComplete === "true"
        const isClientNavigationToHero =
            document.documentElement.dataset[
                HERO_CLIENT_NAVIGATION_DATA_KEY
            ] === "true"
        const introRunsOnThisRoute =
            window.location.pathname === "/" &&
            new URLSearchParams(window.location.search).get("reveal") !==
                "projects"

        if (
            introRunsOnThisRoute &&
            (introAlreadyCompleted || isClientNavigationToHero)
        ) {
            delete document.documentElement.dataset[
                HERO_CLIENT_NAVIGATION_DATA_KEY
            ]
            startTyping()
        }

        return () => {
            window.removeEventListener(
                INTRO_COMPLETE_EVENT,
                handleIntroComplete,
            )
            window.removeEventListener(
                HERO_RETURN_EVENT,
                handleHeroReturn,
            )
            clearTimers()
            hasStartedRef.current = false
        }
    }, [
        clearTimers,
        reduceMotion,
        restartTyping,
        startTyping,
        text,
    ])

    return (
        <span className="hero-typing" aria-hidden="true">
            <span className="hero-typing__measure">{text}</span>
            <span className="hero-typing__typed">
                {text.slice(0, visibleCharacters)}
                {visibleCharacters < text.length && (
                    <span className="hero-typing__cursor" />
                )}
            </span>
        </span>
    )
}
