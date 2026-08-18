"use client"

import {
    useEffect,
    useRef,
    type MouseEvent,
    type PointerEvent,
    type ReactNode,
} from "react"

type NextSlideAreaProps = {
    children: ReactNode
    className: string
    onPrevious: () => void
    onNext: () => void
}

export default function NextSlideArea({
    children,
    className,
    onPrevious,
    onNext,
}: NextSlideAreaProps) {
    const cursorRef = useRef<HTMLSpanElement>(null)
    const frameRef = useRef<number | null>(null)
    const cursorPositionRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        return () => {
            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current)
            }
        }
    }, [])

    const positionCursor = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "mouse") return

        const bounds = event.currentTarget.getBoundingClientRect()
        const edgeInset = 48
        const pointerX = event.clientX - bounds.left

        cursorRef.current?.setAttribute(
            "data-direction",
            pointerX < bounds.width / 2 ? "previous" : "next",
        )

        cursorPositionRef.current = {
            x: Math.min(
                Math.max(pointerX, edgeInset),
                Math.max(edgeInset, bounds.width - edgeInset),
            ),
            y: Math.min(
                Math.max(event.clientY - bounds.top, edgeInset),
                Math.max(edgeInset, bounds.height - edgeInset),
            ),
        }

        if (frameRef.current !== null) return

        frameRef.current = window.requestAnimationFrame(() => {
            const { x, y } = cursorPositionRef.current

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
            }

            frameRef.current = null
        })
    }

    const showCursor = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "mouse") return

        positionCursor(event)
        cursorRef.current?.setAttribute("data-visible", "true")
    }

    const hideCursor = () => {
        cursorRef.current?.removeAttribute("data-visible")
    }

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement

        if (target.closest("a, button, input, select, textarea")) return

        const bounds = event.currentTarget.getBoundingClientRect()

        if (event.clientX - bounds.left < bounds.width / 2) {
            onPrevious()
            return
        }

        onNext()
    }

    return (
        <div
            className={`${className} slide-next-area`}
            onClick={handleClick}
            onPointerEnter={showCursor}
            onPointerLeave={hideCursor}
            onPointerMove={positionCursor}
        >
            {children}
            <span className="slide-next-cursor" ref={cursorRef} aria-hidden="true">
                <span className="slide-next-cursor__label slide-next-cursor__label--previous">
            <span className="slide-next-cursor__arrow">‹</span> Back
                </span>
                <span className="slide-next-cursor__label slide-next-cursor__label--next">
                    Next <span className="slide-next-cursor__arrow">›</span>
                </span>
            </span>
        </div>
    )
}
