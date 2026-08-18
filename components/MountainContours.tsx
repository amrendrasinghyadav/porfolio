"use client"

import { useEffect, useRef } from "react"

type Point = { x: number; y: number }
type TrailPoint = Point & { createdAt: number }

const CONTOUR_LEVELS = [
    0.23, 0.29, 0.35, 0.41, 0.47, 0.53, 0.59, 0.65, 0.71, 0.77,
]
const TRAIL_LIFETIME = 680

function fade(value: number) {
    return value * value * value * (value * (value * 6 - 15) + 10)
}

function mix(start: number, end: number, amount: number) {
    return start + (end - start) * amount
}

function hash(x: number, y: number) {
    const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123
    return value - Math.floor(value)
}

function valueNoise(x: number, y: number) {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const fx = fade(x - ix)
    const fy = fade(y - iy)

    const top = mix(hash(ix, iy), hash(ix + 1, iy), fx)
    const bottom = mix(hash(ix, iy + 1), hash(ix + 1, iy + 1), fx)
    return mix(top, bottom, fy)
}

function terrain(x: number, y: number, time: number) {
    let total = 0
    let amplitude = 0.55
    let frequency = 1
    let weight = 0

    for (let octave = 0; octave < 4; octave += 1) {
        const driftX = time * (0.035 + octave * 0.008)
        const driftY = time * (0.018 - octave * 0.003)
        total +=
            valueNoise(x * frequency + driftX, y * frequency + driftY) *
            amplitude
        weight += amplitude
        amplitude *= 0.5
        frequency *= 2.03
    }

    return total / weight
}

function interpolate(
    first: Point,
    second: Point,
    firstValue: number,
    secondValue: number,
    level: number
) {
    const delta = secondValue - firstValue
    const amount = Math.abs(delta) < 0.0001 ? 0.5 : (level - firstValue) / delta

    return {
        x: mix(first.x, second.x, amount),
        y: mix(first.y, second.y, amount),
    }
}

function drawSegment(
    context: CanvasRenderingContext2D,
    first: Point,
    second: Point
) {
    context.moveTo(first.x, first.y)
    context.lineTo(second.x, second.y)
}

/**
 * Animated contour field adapted from the supplied Alpine Contours source.
 * Pointer tracking stays on `window`, allowing this decorative canvas to sit
 * behind the portfolio without intercepting scrolling or link interaction.
 */
export default function MountainContours({
    interactive = true,
}: {
    interactive?: boolean
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d")
        if (!context) return

        const motionQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        )
        let reduceMotion = motionQuery.matches
        let width = 0
        let height = 0
        let columns = 0
        let rows = 0
        let cell = 13
        let values = new Float32Array(0)
        let animationFrame = 0
        let lastFrame = -100
        let targetX = 0.5
        let targetY = 0.5
        let pointerX = 0.5
        let pointerY = 0.5
        let hasPointer = false
        let hoverStrength = 0
        let deformationStrength = 0
        let trail: TrailPoint[] = []

        const resize = () => {
            width = canvas.clientWidth
            height = canvas.clientHeight
            const ratio = Math.min(window.devicePixelRatio || 1, 2)

            canvas.width = Math.round(width * ratio)
            canvas.height = Math.round(height * ratio)
            context.setTransform(ratio, 0, 0, ratio, 0, 0)

            cell = width < 720 ? 15 : 13
            columns = Math.ceil(width / cell) + 1
            rows = Math.ceil(height / cell) + 1
            values = new Float32Array(columns * rows)
        }

        const onPointerMove = (event: PointerEvent) => {
            targetX = event.clientX / Math.max(width, 1)
            targetY = event.clientY / Math.max(height, 1)
            hasPointer = true

            const previous = trail[trail.length - 1]
            const nextX = previous
                ? mix(previous.x, event.clientX, 0.46)
                : event.clientX
            const nextY = previous
                ? mix(previous.y, event.clientY, 0.46)
                : event.clientY
            if (
                !previous ||
                Math.hypot(
                    nextX - previous.x,
                    nextY - previous.y
                ) > 2
            ) {
                trail.push({
                    x: nextX,
                    y: nextY,
                    createdAt: event.timeStamp,
                })
                if (trail.length > 56) trail.shift()
            }
        }

        const onPointerLeave = () => {
            hasPointer = false
        }

        const draw = (timestamp = 0) => {
            if (!reduceMotion && timestamp - lastFrame < 32) {
                animationFrame = requestAnimationFrame(draw)
                return
            }
            lastFrame = timestamp

            const time = reduceMotion ? 0 : timestamp / 1000
            pointerX += (targetX - pointerX) * 0.045
            pointerY += (targetY - pointerY) * 0.045
            const interactionTarget = hasPointer ? 1 : 0
            hoverStrength +=
                (interactionTarget - hoverStrength) *
                (hasPointer ? 0.14 : 0.05)
            deformationStrength +=
                (interactionTarget - deformationStrength) *
                (hasPointer ? 0.1 : 0.018)

            context.clearRect(0, 0, width, height)
            context.fillStyle = "#F8F6F4"
            context.fillRect(0, 0, width, height)

            const aspect = width / Math.max(height, 1)
            for (let row = 0; row < rows; row += 1) {
                for (let column = 0; column < columns; column += 1) {
                    const nx =
                        (column / Math.max(columns - 1, 1)) * 3.6 * aspect
                    const ny = (row / Math.max(rows - 1, 1)) * 3.6
                    let field = terrain(nx, ny, time)

                    if (deformationStrength > 0.002) {
                        const dx = column / columns - pointerX
                        const dy = row / rows - pointerY
                        const influence = Math.exp(
                            -(dx * dx + dy * dy) * 56
                        )
                        field += influence * 0.12 * deformationStrength
                    }

                    values[row * columns + column] = field
                }
            }

            context.lineCap = "round"
            context.lineJoin = "round"
            context.globalCompositeOperation = "source-over"

            CONTOUR_LEVELS.forEach((level, levelIndex) => {
                context.beginPath()

                for (let row = 0; row < rows - 1; row += 1) {
                    for (let column = 0; column < columns - 1; column += 1) {
                        const topLeftValue = values[row * columns + column]
                        const topRightValue = values[row * columns + column + 1]
                        const bottomLeftValue =
                            values[(row + 1) * columns + column]
                        const bottomRightValue =
                            values[(row + 1) * columns + column + 1]

                        const topLeft = {
                            x: column * cell,
                            y: row * cell,
                        }
                        const topRight = {
                            x: (column + 1) * cell,
                            y: row * cell,
                        }
                        const bottomLeft = {
                            x: column * cell,
                            y: (row + 1) * cell,
                        }
                        const bottomRight = {
                            x: (column + 1) * cell,
                            y: (row + 1) * cell,
                        }

                        const intersections: Point[] = []
                        if (
                            (topLeftValue >= level) !==
                            (topRightValue >= level)
                        ) {
                            intersections.push(
                                interpolate(
                                    topLeft,
                                    topRight,
                                    topLeftValue,
                                    topRightValue,
                                    level
                                )
                            )
                        }
                        if (
                            (topRightValue >= level) !==
                            (bottomRightValue >= level)
                        ) {
                            intersections.push(
                                interpolate(
                                    topRight,
                                    bottomRight,
                                    topRightValue,
                                    bottomRightValue,
                                    level
                                )
                            )
                        }
                        if (
                            (bottomRightValue >= level) !==
                            (bottomLeftValue >= level)
                        ) {
                            intersections.push(
                                interpolate(
                                    bottomRight,
                                    bottomLeft,
                                    bottomRightValue,
                                    bottomLeftValue,
                                    level
                                )
                            )
                        }
                        if (
                            (bottomLeftValue >= level) !==
                            (topLeftValue >= level)
                        ) {
                            intersections.push(
                                interpolate(
                                    bottomLeft,
                                    topLeft,
                                    bottomLeftValue,
                                    topLeftValue,
                                    level
                                )
                            )
                        }

                        if (intersections.length === 2) {
                            drawSegment(
                                context,
                                intersections[0],
                                intersections[1]
                            )
                        } else if (intersections.length === 4) {
                            const center =
                                (topLeftValue +
                                    topRightValue +
                                    bottomLeftValue +
                                    bottomRightValue) /
                                4

                            if (center >= level) {
                                drawSegment(
                                    context,
                                    intersections[0],
                                    intersections[3]
                                )
                                drawSegment(
                                    context,
                                    intersections[1],
                                    intersections[2]
                                )
                            } else {
                                drawSegment(
                                    context,
                                    intersections[0],
                                    intersections[1]
                                )
                                drawSegment(
                                    context,
                                    intersections[2],
                                    intersections[3]
                                )
                            }
                        }
                    }
                }

                if (hoverStrength > 0.002) {
                    const hover = context.createRadialGradient(
                        pointerX * width,
                        pointerY * height,
                        0,
                        pointerX * width,
                        pointerY * height,
                        Math.max(width, height) * 0.13
                    )
                    const hoverColor = `rgba(${Math.round(
                        mix(115, 71, hoverStrength)
                    )}, ${Math.round(
                        mix(201, 109, hoverStrength)
                    )}, ${Math.round(
                        mix(153, 88, hoverStrength)
                    )}, ${mix(0.2, 1, hoverStrength)})`

                    hover.addColorStop(0, hoverColor)
                    hover.addColorStop(0.34, hoverColor)
                    hover.addColorStop(1, "rgba(115, 201, 153, 0.2)")
                    context.strokeStyle = hover
                } else {
                    context.strokeStyle = "rgba(115, 201, 153, 0.2)"
                }

                context.globalAlpha = 1
                context.lineWidth =
                    levelIndex === 3 || levelIndex === 8 ? 1.05 : 0.72
                context.stroke()
            })

            context.shadowBlur = 0
            context.globalAlpha = 1
            context.globalCompositeOperation = "source-over"

            trail = trail.filter(
                (point) => timestamp - point.createdAt < TRAIL_LIFETIME
            )
            if (trail.length > 1) {
                const start = trail[0]
                const end = trail[trail.length - 1]
                const endLife = Math.max(
                    0,
                    1 -
                        (timestamp - end.createdAt) /
                            TRAIL_LIFETIME
                )

                context.beginPath()
                context.moveTo(start.x, start.y)
                for (let index = 1; index < trail.length - 1; index += 1) {
                    const current = trail[index]
                    const next = trail[index + 1]
                    context.quadraticCurveTo(
                        current.x,
                        current.y,
                        (current.x + next.x) / 2,
                        (current.y + next.y) / 2
                    )
                }

                const penultimate = trail[trail.length - 2]
                context.quadraticCurveTo(
                    penultimate.x,
                    penultimate.y,
                    end.x,
                    end.y
                )

                const trailGradient = context.createLinearGradient(
                    start.x,
                    start.y,
                    end.x,
                    end.y
                )
                trailGradient.addColorStop(0, "rgba(0, 82, 36, 0)")
                trailGradient.addColorStop(0.3, "rgba(0, 82, 36, 0.2)")
                trailGradient.addColorStop(1, "rgba(0, 82, 36, 0.72)")

                context.strokeStyle = trailGradient
                context.globalAlpha = endLife * endLife
                context.lineWidth = 1.9
                context.stroke()
            }
            context.globalAlpha = 1

            if (!reduceMotion) {
                animationFrame = requestAnimationFrame(draw)
            }
        }

        const onResize = () => {
            resize()
            if (reduceMotion) draw()
        }

        const onMotionChange = (event: MediaQueryListEvent) => {
            reduceMotion = event.matches
            cancelAnimationFrame(animationFrame)
            draw()
        }

        resize()
        draw()
        window.addEventListener("resize", onResize)
        if (interactive) {
            window.addEventListener("pointermove", onPointerMove, {
                passive: true,
            })
            document.documentElement.addEventListener(
                "pointerleave",
                onPointerLeave
            )
        }
        motionQuery.addEventListener("change", onMotionChange)

        return () => {
            window.removeEventListener("resize", onResize)
            if (interactive) {
                window.removeEventListener("pointermove", onPointerMove)
                document.documentElement.removeEventListener(
                    "pointerleave",
                    onPointerLeave
                )
            }
            motionQuery.removeEventListener("change", onMotionChange)
            cancelAnimationFrame(animationFrame)
        }
    }, [interactive])

    return (
        <canvas
            ref={canvasRef}
            className="mountain-canvas"
            aria-hidden="true"
        />
    )
}
