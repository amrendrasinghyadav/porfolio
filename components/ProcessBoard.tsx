"use client"

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from "react"
import { animate, motion, useDragControls, useMotionValue } from "framer-motion"

type ProcessBoardImage = {
    src: string
    label: string
    width: number
    height: number
}

type ProcessBoardProps = {
    images: readonly ProcessBoardImage[]
}

type PanBounds = {
    left: number
    right: number
    top: number
    bottom: number
}

const MIN_SCALE = 0.12
const MAX_SCALE = 2.5
const SCALE_STEP = 0.15
const ARTIFACT_SCALE = 0.5

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

export default function ProcessBoard({ images }: ProcessBoardProps) {
    const viewportRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLDivElement>(null)
    const artifactRefs = useRef<Array<HTMLImageElement | null>>([])
    const dragControls = useDragControls()
    const canvasX = useMotionValue(0)
    const canvasY = useMotionValue(0)
    const canvasScale = useMotionValue(1)
    const [scale, setScale] = useState(1)
    const [dragging, setDragging] = useState(false)
    const [panBounds, setPanBounds] = useState<PanBounds>({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    })

    const fitBoard = useCallback(() => {
        const viewport = viewportRef.current
        const canvas = canvasRef.current
        if (!viewport || !canvas) return

        const rect = viewport.getBoundingClientRect()
        const boardWidth = canvas.offsetWidth
        const boardHeight = canvas.offsetHeight
        const nextScale = clamp(
            Math.min(
                (rect.width - 80) / boardWidth,
                (rect.height - 80) / boardHeight,
            ),
            MIN_SCALE,
            1,
        )

        canvasX.set(0)
        canvasY.set(0)
        canvasScale.set(nextScale)
        setScale(nextScale)
    }, [canvasScale, canvasX, canvasY])

    const getPanBounds = useCallback((currentScale: number) => {
        const viewport = viewportRef.current
        const canvas = canvasRef.current
        if (!viewport || !canvas) return null

        const maxX = Math.max(
            0,
            (canvas.offsetWidth * currentScale - viewport.clientWidth) / 2,
        )
        const maxY = Math.max(
            0,
            (canvas.offsetHeight * currentScale - viewport.clientHeight) / 2,
        )

        return {
            left: -maxX,
            right: maxX,
            top: -maxY,
            bottom: maxY,
        }
    }, [])

    const zoomAtPoint = useCallback(
        (zoomDelta: number, clientX: number, clientY: number) => {
            const viewport = viewportRef.current
            if (!viewport) return

            const rect = viewport.getBoundingClientRect()
            const pointerX = clientX - (rect.left + rect.width / 2)
            const pointerY = clientY - (rect.top + rect.height / 2)
            const currentScale = canvasScale.get()
            const nextScale = clamp(
                currentScale * Math.exp(zoomDelta),
                MIN_SCALE,
                MAX_SCALE,
            )
            if (nextScale === currentScale) return

            const nextBounds = getPanBounds(nextScale)
            if (!nextBounds) return

            const scaleRatio = nextScale / currentScale
            const nextX =
                pointerX - (pointerX - canvasX.get()) * scaleRatio
            const nextY =
                pointerY - (pointerY - canvasY.get()) * scaleRatio

            setPanBounds(nextBounds)
            canvasX.set(clamp(nextX, nextBounds.left, nextBounds.right))
            canvasY.set(clamp(nextY, nextBounds.top, nextBounds.bottom))
            canvasScale.set(nextScale)
            setScale(nextScale)
        },
        [canvasScale, canvasX, canvasY, getPanBounds],
    )

    const zoomBy = useCallback(
        (amount: number) => {
            const viewport = viewportRef.current
            if (!viewport) return

            const currentScale = canvasScale.get()
            const nextScale = clamp(
                currentScale + amount,
                MIN_SCALE,
                MAX_SCALE,
            )
            if (nextScale === currentScale) return

            const rect = viewport.getBoundingClientRect()
            zoomAtPoint(
                Math.log(nextScale / currentScale),
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
            )
        },
        [canvasScale, zoomAtPoint],
    )

    const updatePanBounds = useCallback(
        (currentScale: number) => {
            const nextBounds = getPanBounds(currentScale)
            if (!nextBounds) return

            setPanBounds(nextBounds)
            canvasX.set(clamp(canvasX.get(), nextBounds.left, nextBounds.right))
            canvasY.set(clamp(canvasY.get(), nextBounds.top, nextBounds.bottom))
        },
        [canvasX, canvasY, getPanBounds],
    )

    const focusFrame = useCallback(
        (index: number, instant = false) => {
            const viewport = viewportRef.current
            const canvas = canvasRef.current
            const artifact = artifactRefs.current[index]
            const row = artifact?.offsetParent
            if (
                !viewport ||
                !canvas ||
                !artifact ||
                !(row instanceof HTMLElement)
            ) {
                return
            }

            const targetScale = 1
            const nextBounds = getPanBounds(targetScale)
            if (!nextBounds) return

            const artifactCenterX =
                row.offsetLeft + artifact.offsetLeft + artifact.offsetWidth / 2
            const artifactTop = row.offsetTop + artifact.offsetTop
            const topInset = 32
            const targetX = clamp(
                -(artifactCenterX - canvas.offsetWidth / 2) * targetScale,
                nextBounds.left,
                nextBounds.right,
            )
            const targetY = clamp(
                topInset -
                    viewport.clientHeight / 2 -
                    (artifactTop - canvas.offsetHeight / 2) * targetScale,
                nextBounds.top,
                nextBounds.bottom,
            )

            if (!instant) viewport.focus({ preventScroll: true })
            setPanBounds(nextBounds)
            setScale(targetScale)
            if (instant) {
                canvasScale.set(targetScale)
                canvasX.set(targetX)
                canvasY.set(targetY)
            } else {
                animate(canvasScale, targetScale, {
                    duration: 0.35,
                    ease: "easeOut",
                })
                animate(canvasX, targetX, { duration: 0.35, ease: "easeOut" })
                animate(canvasY, targetY, { duration: 0.35, ease: "easeOut" })
            }
        },
        [canvasScale, canvasX, canvasY, getPanBounds],
    )

    useEffect(() => {
        const animationFrame = window.requestAnimationFrame(() => {
            focusFrame(0, true)
        })

        return () => window.cancelAnimationFrame(animationFrame)
    }, [focusFrame])

    useEffect(() => {
        const animationFrame = window.requestAnimationFrame(() => {
            updatePanBounds(scale)
        })

        const viewport = viewportRef.current
        if (!viewport) {
            return () => window.cancelAnimationFrame(animationFrame)
        }

        const resizeObserver = new ResizeObserver(() => {
            updatePanBounds(scale)
        })
        resizeObserver.observe(viewport)

        return () => {
            window.cancelAnimationFrame(animationFrame)
            resizeObserver.disconnect()
        }
    }, [scale, updatePanBounds])

    useEffect(() => {
        const viewport = viewportRef.current
        if (!viewport) return

        const isBoardActive = () =>
            viewport.matches(":hover") ||
            viewport === document.activeElement ||
            viewport.contains(document.activeElement)

        const handleWheel = (event: WheelEvent) => {
            if (
                !(event.target instanceof Node) ||
                !viewport.contains(event.target)
            ) {
                return
            }

            event.preventDefault()
            event.stopPropagation()
            const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1
            const delta = event.deltaY * multiplier
            zoomAtPoint(
                -delta * 0.0012,
                event.clientX,
                event.clientY,
            )
        }

        const handleZoomShortcut = (event: KeyboardEvent) => {
            if (!isBoardActive()) return

            const isZoomIn =
                event.code === "Equal" || event.code === "NumpadAdd"
            const isZoomOut =
                event.code === "Minus" || event.code === "NumpadSubtract"
            const isReset =
                event.code === "Digit0" || event.code === "Numpad0"

            if (!isZoomIn && !isZoomOut && !isReset) return

            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()

            if (isZoomIn) zoomBy(SCALE_STEP)
            if (isZoomOut) zoomBy(-SCALE_STEP)
            if (isReset) fitBoard()
        }

        window.addEventListener("wheel", handleWheel, {
            passive: false,
            capture: true,
        })
        window.addEventListener("keydown", handleZoomShortcut, true)

        return () => {
            window.removeEventListener("wheel", handleWheel, true)
            window.removeEventListener("keydown", handleZoomShortcut, true)
        }
    }, [fitBoard, zoomAtPoint, zoomBy])

    const handleBoardKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const panAmount = event.shiftKey ? 80 : 32

        if (event.key === "ArrowLeft")
            canvasX.set(
                clamp(canvasX.get() + panAmount, panBounds.left, panBounds.right),
            )
        else if (event.key === "ArrowRight")
            canvasX.set(
                clamp(canvasX.get() - panAmount, panBounds.left, panBounds.right),
            )
        else if (event.key === "ArrowUp")
            canvasY.set(
                clamp(canvasY.get() + panAmount, panBounds.top, panBounds.bottom),
            )
        else if (event.key === "ArrowDown")
            canvasY.set(
                clamp(canvasY.get() - panAmount, panBounds.top, panBounds.bottom),
            )
        else if (event.key === "+" || event.key === "=") zoomBy(SCALE_STEP)
        else if (event.key === "-") zoomBy(-SCALE_STEP)
        else if (event.key === "0") fitBoard()
        else return

        event.preventDefault()
    }

    const startCanvasDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return
        viewportRef.current?.focus({ preventScroll: true })
        dragControls.start(event)
    }

    return (
        <div className="process-board" aria-label="Process exploration board">
            <div className="process-board__toolbar" aria-label="Board controls">
                <button
                    type="button"
                    onClick={() => zoomBy(-SCALE_STEP)}
                    aria-label="Zoom out"
                    disabled={scale <= MIN_SCALE}
                >
                    −
                </button>
                <output aria-live="polite">{Math.round(scale * 100)}%</output>
                <button
                    type="button"
                    onClick={() => zoomBy(SCALE_STEP)}
                    aria-label="Zoom in"
                    disabled={scale >= MAX_SCALE}
                >
                    +
                </button>
                <button
                    className="process-board__fit"
                    type="button"
                    onClick={fitBoard}
                >
                    Fit
                </button>
            </div>

            <div
                ref={viewportRef}
                data-interactive
                className={`process-board__viewport${
                    dragging ? " is-dragging" : ""
                }`}
                role="application"
                aria-label="Interactive process board. Drag to pan and scroll to zoom."
                tabIndex={0}
                onPointerDown={startCanvasDrag}
                onKeyDown={handleBoardKeyDown}
            >
                <div className="process-board__canvas-origin">
                    <motion.div
                        ref={canvasRef}
                        className="process-board__canvas"
                        drag
                        dragControls={dragControls}
                        dragListener={false}
                        dragConstraints={panBounds}
                        dragMomentum={false}
                        dragElastic={0}
                        style={{ x: canvasX, y: canvasY, scale: canvasScale }}
                        onDragStart={() => setDragging(true)}
                        onDragEnd={() => setDragging(false)}
                    >
                        {Array.from(
                            { length: Math.ceil(images.length / 3) },
                            (_, rowIndex) => (
                                <div
                                    className="process-board__row"
                                    key={`process-row-${rowIndex + 1}`}
                                >
                                    {images
                                        .slice(rowIndex * 3, rowIndex * 3 + 3)
                                        .map((image, imageIndex) => (
                                            <img
                                                className="process-board__artifact"
                                                key={image.src}
                                                ref={(node) => {
                                                    artifactRefs.current[
                                                        rowIndex * 3 + imageIndex
                                                    ] = node
                                                }}
                                                src={image.src}
                                                alt={image.label}
                                                width={
                                                    image.width * ARTIFACT_SCALE
                                                }
                                                height={
                                                    image.height * ARTIFACT_SCALE
                                                }
                                                draggable={false}
                                            />
                                        ))}
                                </div>
                            ),
                        )}
                    </motion.div>
                </div>
            </div>

            <div
                className="process-board__thumbnails"
                aria-label="Process frame thumbnails"
            >
                {images.map((image, index) => (
                    <button
                        className="process-board__thumbnail"
                        type="button"
                        key={image.src}
                        aria-label={`View ${image.label} at 100% zoom`}
                        onClick={() => focusFrame(index)}
                    >
                        <img src={image.src} alt="" draggable={false} />
                        <span>{String(index + 1).padStart(2, "0")}</span>
                    </button>
                ))}
            </div>

            <p className="process-board__hint">
                Drag to pan · Scroll, pinch, or use + / − to zoom
            </p>
        </div>
    )
}
