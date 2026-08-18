"use client"

import { motion, useDragControls } from "framer-motion"
import { useRef } from "react"

const EXTRA_PLAYGROUND_IMAGES = [
    {
        src: "/playground/mehkaash-packaging.webp",
        alt: "Mehkaash fragrance packaging design",
        className: "playground-card--mehkaash-packaging",
    },
    {
        src: "/playground/mehkaash-logo.webp",
        alt: "Mehkaash logo construction grid",
        className: "playground-card--mehkaash-logo",
    },
    {
        src: "/playground/ghat-safety-poster.webp",
        alt: "Illustrated safety poster for bathing at a ghat",
        className: "playground-card--ghat-poster",
    },
    {
        src: "/playground/chess-quake.webp",
        alt: "Chess Quake board game cover",
        className: "playground-card--chess-quake",
    },
    {
        src: "/playground/zine-spread.webp",
        alt: "Space-themed Hindi zine artwork",
        className: "playground-card--zine",
    },
] as const

export default function PlaygroundCanvas() {
    const prototypeDragControls = useDragControls()
    const blinkitWasDragged = useRef(false)

    return (
        <div className="playground-canvas playground-canvas--shared">
            <motion.figure
                className="playground-card playground-card--poster"
                data-interactive
                drag
                dragMomentum={false}
                whileDrag={{ scale: 1.025, zIndex: 10 }}
            >
                <img
                    src="/playground/kundal-poster.webp"
                    alt="Kundal film poster"
                    draggable={false}
                />
            </motion.figure>

            <motion.figure
                className="playground-card playground-card--blinkit"
                data-interactive
                drag
                dragMomentum={false}
                onDragStart={() => {
                    blinkitWasDragged.current = true
                }}
                onDragEnd={() => {
                    window.setTimeout(() => {
                        blinkitWasDragged.current = false
                    }, 0)
                }}
                whileDrag={{ scale: 1.025, zIndex: 10 }}
            >
                <a
                    className="playground-card__link"
                    href="https://www.figma.com/deck/mRnp8BajJZbf0zV8FbohWh/Blinkit-Digital-Marketing-Campaign?node-id=2150-59&t=fTRItSVlAuUyQS1K-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1"
                    target="_blank"
                    rel="noopener noreferrer"
                    draggable={false}
                    aria-label="Open the Blinkit Digital Marketing Campaign in a new tab"
                    onClick={(event) => {
                        if (blinkitWasDragged.current) event.preventDefault()
                    }}
                >
                    <img
                        src="/playground/blinkit-campaign.png"
                        alt="Immersive Blinkit marketing campaign concept"
                        draggable={false}
                    />
                </a>
            </motion.figure>

            <motion.figure
                className="playground-embed-card"
                data-interactive
                drag
                dragListener={false}
                dragControls={prototypeDragControls}
                dragMomentum={false}
                whileDrag={{ scale: 1.01, zIndex: 10 }}
            >
                <div
                    className="playground-embed-card__handle"
                    onPointerDown={(event) =>
                        prototypeDragControls.start(event)
                    }
                />
                <div className="playground-embed-card__viewport">
                    <iframe
                        src="https://embed.figma.com/proto/4TaUScFns0NC7Ln4ooStqF/Kuwait-Airport?node-id=1-2&starting-point-node-id=1%3A2&scaling=scale-down-width&content-scaling=fixed&embed-host=share"
                        title="Kuwait Airport interactive prototype"
                        loading="lazy"
                        allowFullScreen
                        sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-popups allow-popups-to-escape-sandbox"
                    />
                </div>
            </motion.figure>

            {EXTRA_PLAYGROUND_IMAGES.map((image) => (
                <motion.figure
                    key={image.src}
                    className={`playground-card playground-card--extra ${image.className}`}
                    data-interactive
                    drag
                    dragMomentum={false}
                    whileDrag={{ scale: 1.025, zIndex: 10 }}
                >
                    <img
                        src={image.src}
                        alt={image.alt}
                        draggable={false}
                    />
                </motion.figure>
            ))}
        </div>
    )
}
