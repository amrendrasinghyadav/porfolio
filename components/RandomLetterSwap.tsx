"use client"

import { useCallback, useMemo } from "react"
import { motion, useAnimate, useReducedMotion } from "framer-motion"

type RandomLetterSwapProps = {
    label: string
    mode?: "forward" | "pingpong"
    reverse?: boolean
    staggerDuration?: number
}

/**
 * RandomLetterSwap
 *
 * Splits a label into two stacked copies and swaps each letter vertically in
 * a randomized order. Navigation uses pingpong mode so pointer leave always
 * restores the neutral resting label.
 */
export default function RandomLetterSwap({
    label,
    mode = "pingpong",
    reverse = false,
    staggerDuration = 0.035,
}: RandomLetterSwapProps) {
    const [scope, animate] = useAnimate()
    const reduceMotion = useReducedMotion()

    const letterIndexes = useMemo(
        () =>
            label
                .split("")
                .map((letter, index) => (letter === " " ? -1 : index))
                .filter((index) => index !== -1),
        [label]
    )

    const shuffledIndexes = useCallback(
        () => [...letterIndexes].sort(() => Math.random() - 0.5),
        [letterIndexes]
    )

    const animateLetters = useCallback(
        (hovered: boolean) => {
            if (reduceMotion) return

            const order = shuffledIndexes()
            order.forEach((index, sequenceIndex) => {
                const delay = sequenceIndex * staggerDuration
                const transition = {
                    duration: 0.24,
                    delay,
                    ease: [0.22, 1, 0.36, 1] as const,
                }

                animate(
                    `.letter-${index}`,
                    { y: hovered ? (reverse ? "100%" : "-100%") : "0%" },
                    transition
                )
                animate(
                    `.letter-secondary-${index}`,
                    {
                        top: hovered
                            ? "0%"
                            : reverse
                              ? "-100%"
                              : "100%",
                    },
                    transition
                )
            })
        },
        [
            animate,
            reduceMotion,
            reverse,
            shuffledIndexes,
            staggerDuration,
        ]
    )

    const handlePointerEnter = () => animateLetters(true)
    const handlePointerLeave = () => {
        if (mode === "pingpong") animateLetters(false)
    }

    return (
        <span
            ref={scope}
            className="random-letter-swap"
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <span className="sr-only">{label}</span>
            <span className="random-letter-swap__letters" aria-hidden="true">
                {label.split("").map((letter, index) => (
                    <span
                        className="random-letter-swap__slot"
                        key={`${letter}-${index}`}
                    >
                        <motion.span className={`letter-${index}`}>
                            {letter}
                        </motion.span>
                        <motion.span
                            className={`letter-secondary-${index}`}
                            style={{ top: reverse ? "-100%" : "100%" }}
                        >
                            {letter}
                        </motion.span>
                    </span>
                ))}
            </span>
        </span>
    )
}
