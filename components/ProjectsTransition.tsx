"use client"

import { animate, useReducedMotion } from "framer-motion"
import {
    useCallback,
    useEffect,
    useRef,
    type ReactNode,
} from "react"
import type { Project } from "../app/work/projects"

type ProjectsTransitionProps = {
    projects: readonly Project[]
    hero: ReactNode
    children: ReactNode
}

type PreviewTarget = {
    x: number
    y: number
}

type StoppableAnimation = {
    stop: () => void
    then: (onResolve: () => void, onReject?: () => void) => Promise<void>
}

const STACK = [
    { x: -12, y: 7, rotate: -2.4, scale: 0.52 },
    { x: 10, y: -3, rotate: 1.8, scale: 0.51 },
    { x: -6, y: -10, rotate: -1.2, scale: 0.5 },
    { x: 12, y: 4, rotate: 2.2, scale: 0.49 },
] as const

const EASE = [0.25, 0.8, 0.25, 1] as const
const REVEAL_VIEWPORT_LINE = 0.9
const IDLE_SCROLLBAR_CLASS = "work-reveal-scrollbar-hidden"
const HERO_RETURN_REQUEST_EVENT = "portfolio:request-hero-return"

const syncVisibleWorkRoute = (view: "hero" | "projects") => {
    const nextPath = view === "hero" ? "/" : "/work"
    if (
        window.location.pathname === nextPath &&
        window.location.search === ""
    ) {
        return
    }

    window.history.replaceState(window.history.state, "", nextPath)
}

function getDistributedGridTop(): number {
    const headerBottom =
        document
            .querySelector<HTMLElement>(".site-header")
            ?.getBoundingClientRect().bottom ?? 72

    return Math.max(0, headerBottom - 4)
}

function waitForScrollSettle(): Promise<void> {
    return new Promise((resolve) => {
        let quietTimer = 0

        const finish = () => {
            window.clearTimeout(quietTimer)
            window.removeEventListener("scroll", handleScroll)
            resolve()
        }

        const handleScroll = () => {
            window.clearTimeout(quietTimer)
            quietTimer = window.setTimeout(finish, 140)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        quietTimer = window.setTimeout(finish, 140)
    })
}

function lockPageScroll(): () => void {
    const lockedScrollX = window.scrollX
    const lockedScrollY = window.scrollY
    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior
    let isLocked = true

    const preventScroll = (event: Event) => {
        event.preventDefault()
    }

    const preventScrollKeys = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null
        const isEditable =
            target?.isContentEditable ||
            target?.matches("input, textarea, select")

        if (
            !isEditable &&
            [
                "ArrowDown",
                "ArrowUp",
                "End",
                "Home",
                "PageDown",
                "PageUp",
                " ",
            ].includes(event.key)
        ) {
            event.preventDefault()
        }
    }

    const holdScrollPosition = () => {
        if (
            window.scrollX !== lockedScrollX ||
            window.scrollY !== lockedScrollY
        ) {
            window.scrollTo(lockedScrollX, lockedScrollY)
        }
    }

    root.style.scrollBehavior = "auto"
    window.addEventListener("wheel", preventScroll, { passive: false })
    window.addEventListener("touchmove", preventScroll, {
        passive: false,
    })
    window.addEventListener("scroll", holdScrollPosition, {
        passive: true,
    })
    document.addEventListener("keydown", preventScrollKeys)

    return () => {
        if (!isLocked) return
        isLocked = false

        window.removeEventListener("wheel", preventScroll)
        window.removeEventListener("touchmove", preventScroll)
        window.removeEventListener("scroll", holdScrollPosition)
        document.removeEventListener("keydown", preventScrollKeys)
        root.style.scrollBehavior = previousScrollBehavior
    }
}

export default function ProjectsTransition({
    projects,
    hero,
    children,
}: ProjectsTransitionProps) {
    const heroShellRef = useRef<HTMLDivElement>(null)
    const heroRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLSpanElement>(null)
    const previewLayerRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const hasPlayedRef = useRef(false)
    const hasCompletedRef = useRef(false)
    const hasRestoredHeroRef = useRef(false)
    const finalHeroHeightRef = useRef<number | null>(null)
    const isMountedRef = useRef(true)
    const activeAnimationsRef = useRef<StoppableAnimation[]>([])
    const scrollUnlockRef = useRef<(() => void) | null>(null)
    const reducedMotion = useReducedMotion() ?? false

    const releaseScrollLock = useCallback(() => {
        scrollUnlockRef.current?.()
        scrollUnlockRef.current = null
    }, [])

    const showPageScrollbar = useCallback(() => {
        document.documentElement.classList.remove(
            IDLE_SCROLLBAR_CLASS,
        )
    }, [])

    const stopActiveAnimations = useCallback(() => {
        activeAnimationsRef.current.forEach((animation) => animation.stop())
        activeAnimationsRef.current = []
    }, [])

    const revealGrid = useCallback(
        (hideHero = true) => {
            if (hasCompletedRef.current) return

            hasPlayedRef.current = true
            hasCompletedRef.current = true
            syncVisibleWorkRoute("projects")
            stopActiveAnimations()
            releaseScrollLock()
            showPageScrollbar()

            const heroElement = heroRef.current
            const heroShell = heroShellRef.current
            const previewLayer = previewLayerRef.current
            const grid = gridRef.current

            if (hideHero && heroElement) {
                if (
                    heroShell &&
                    grid &&
                    finalHeroHeightRef.current !== null
                ) {
                    const correctedHeight = Math.max(
                        0,
                        heroShell.getBoundingClientRect().height +
                            (getDistributedGridTop() -
                                grid.getBoundingClientRect().top),
                    )

                    finalHeroHeightRef.current = correctedHeight
                    heroShell.style.height = `${correctedHeight}px`
                    heroShell.style.overflow = "hidden"
                }
                heroElement.style.opacity = "0"
                heroElement.style.transform =
                    "translateY(-24px) scale(0.97)"
                heroElement.style.visibility = "hidden"
                heroElement.style.pointerEvents = "none"
                heroElement.setAttribute("aria-hidden", "true")
            } else if (!hideHero) {
                hasRestoredHeroRef.current = true
            }

            if (previewLayer) {
                previewLayer.style.visibility = "hidden"
            }

            if (grid) {
                grid.dataset.revealState = "revealed"
                grid.removeAttribute("inert")
                grid.removeAttribute("aria-hidden")
                grid.style.removeProperty("opacity")
                grid.style.removeProperty("transform")
                grid.style.removeProperty("visibility")
            }
        },
        [
            releaseScrollLock,
            showPageScrollbar,
            stopActiveAnimations,
        ],
    )

    const measurePreviewTargets = useCallback(
        (visiblePreviewCount: number): PreviewTarget[] => {
            const grid = gridRef.current
            const previewLayer = previewLayerRef.current
            if (!grid || !previewLayer) return []

            const cards = Array.from(
                grid.querySelectorAll<HTMLElement>(".project-card"),
            ).slice(0, visiblePreviewCount)
            const previews = Array.from(
                previewLayer.querySelectorAll<HTMLElement>(
                    ".projects-transition__preview",
                ),
            ).slice(0, visiblePreviewCount)

            if (cards.length === 0 || cards.length !== previews.length) {
                return []
            }

            const previousTransform = grid.style.transform
            grid.style.transform = "none"
            const cardRects = cards.map((card) =>
                card.getBoundingClientRect(),
            )
            grid.style.transform = previousTransform

            previews.forEach((preview, index) => {
                preview.style.width = `${cardRects[index].width}px`
            })

            const viewportCenterX = window.innerWidth / 2
            const viewportCenterY = window.innerHeight / 2

            return cardRects.map((rect) => ({
                x: rect.left + rect.width / 2 - viewportCenterX,
                y: rect.top + rect.height / 2 - viewportCenterY,
            }))
        },
        [],
    )

    const playReveal = useCallback(async (waitForSettle = true) => {
        if (hasPlayedRef.current || !isMountedRef.current) return

        hasPlayedRef.current = true
        if (waitForSettle) {
            await waitForScrollSettle()
        }

        if (!isMountedRef.current || hasCompletedRef.current) return

        const heroElement = heroRef.current
        const heroShell = heroShellRef.current
        const previewLayer = previewLayerRef.current
        const grid = gridRef.current
        if (!heroElement || !heroShell || !previewLayer || !grid) return

        const visiblePreviewCount = window.innerWidth <= 860 ? 3 : 4
        const heroHeight = heroShell.getBoundingClientRect().height
        const previousGridTransform = grid.style.transform
        grid.style.transform = "none"
        const gridTop = grid.getBoundingClientRect().top
        grid.style.transform = previousGridTransform
        const desiredGridTop = getDistributedGridTop()
        const finalHeroHeight = Math.max(
            0,
            heroHeight - Math.max(0, gridTop - desiredGridTop),
        )

        finalHeroHeightRef.current = finalHeroHeight
        heroShell.style.height = `${finalHeroHeight}px`
        heroShell.style.overflow = "hidden"
        const targets = measurePreviewTargets(visiblePreviewCount)
        heroShell.style.height = `${heroHeight}px`
        const previews = Array.from(
            previewLayer.querySelectorAll<HTMLElement>(
                ".projects-transition__preview",
            ),
        ).slice(0, visiblePreviewCount)

        if (targets.length !== previews.length || targets.length === 0) {
            revealGrid()
            return
        }

        grid.dataset.revealState = "playing"
        grid.style.opacity = "0"
        grid.style.transform = "translateY(12px) scale(0.99)"
        grid.style.visibility = "hidden"
        previewLayer.style.visibility = "visible"
        releaseScrollLock()
        scrollUnlockRef.current = lockPageScroll()

        const baseDuration = 1.55
        const mobileScale = window.innerWidth <= 640 ? 0.86 : 1
        const totalDuration = baseDuration * mobileScale
        const controls: StoppableAnimation[] = []
        const track = <T extends StoppableAnimation>(animation: T): T => {
            controls.push(animation)
            return animation
        }
        let stabilizationTimer = 0
        let stabilizationFrame = 0
        let shouldStabilizeGrid = false

        const stabilizeGridPosition = () => {
            stabilizationFrame = 0
            if (
                !shouldStabilizeGrid ||
                !isMountedRef.current ||
                hasCompletedRef.current
            ) {
                return
            }

            const previousTransform = grid.style.transform
            grid.style.transform = "none"
            const currentGridTop = grid.getBoundingClientRect().top
            grid.style.transform = previousTransform

            const positionDelta =
                getDistributedGridTop() - currentGridTop
            if (Math.abs(positionDelta) < 0.5) return

            const stabilizedHeight = Math.max(
                0,
                heroShell.getBoundingClientRect().height +
                    positionDelta,
            )

            finalHeroHeightRef.current = stabilizedHeight
            heroShell.style.height = `${stabilizedHeight}px`
        }

        const requestGridStabilization = () => {
            if (!shouldStabilizeGrid || stabilizationFrame) return

            stabilizationFrame = window.requestAnimationFrame(
                stabilizeGridPosition,
            )
        }

        window.addEventListener("scroll", requestGridStabilization, {
            passive: true,
        })
        stabilizationTimer = window.setTimeout(() => {
            shouldStabilizeGrid = true
            stabilizeGridPosition()
        }, 0.88 * mobileScale * 1000)

        track(
            animate(
                heroElement,
                {
                    opacity: 0,
                    y: -24,
                    scale: 0.97,
                },
                {
                    duration: 0.3 * mobileScale,
                    ease: EASE,
                },
            ),
        )

        track(
            animate(
                heroShell,
                {
                    height: finalHeroHeight,
                },
                {
                    delay: 0.24 * mobileScale,
                    duration: 0.62 * mobileScale,
                    ease: EASE,
                },
            ),
        )

        previews.forEach((preview, index) => {
            const stack = STACK[index]
            const target = targets[index]
            const rotationScale = window.innerWidth <= 640 ? 0.6 : 1
            const entranceStart =
                (index === 0 ? 0.22 : 0.36 + (index - 1) * 0.07) /
                baseDuration
            const entranceEnd =
                (index === 0 ? 0.46 : 0.55 + (index - 1) * 0.06) /
                baseDuration
            const expansionStart =
                (0.68 + index * 0.035) / baseDuration
            const handoffStart = 0.95 / baseDuration
            const expansionEnd = 1.28 / baseDuration
            const expansionBlend = 0.82
            const stackRotate = stack.rotate * rotationScale
            const blendedX =
                stack.x + (target.x - stack.x) * expansionBlend
            const blendedY =
                stack.y + (target.y - stack.y) * expansionBlend
            const blendedScale =
                stack.scale + (1 - stack.scale) * expansionBlend

            track(
                animate(
                    preview,
                    {
                        opacity: [0, 0, 1, 1, 1, 0.25, 0],
                        x: [
                            0,
                            0,
                            stack.x,
                            stack.x,
                            blendedX,
                            target.x,
                            target.x,
                        ],
                        y: [
                            index === 0 ? 36 : 24,
                            index === 0 ? 36 : 24,
                            stack.y,
                            stack.y,
                            blendedY,
                            target.y,
                            target.y,
                        ],
                        scale: [
                            index === 0 ? 0.36 : 0.4,
                            index === 0 ? 0.36 : 0.4,
                            stack.scale,
                            stack.scale,
                            blendedScale,
                            1,
                            1,
                        ],
                        rotate: [
                            (index === 0 ? -4 : stack.rotate) *
                                rotationScale,
                            (index === 0 ? -4 : stack.rotate) *
                                rotationScale,
                            stackRotate,
                            stackRotate,
                            stackRotate * (1 - expansionBlend),
                            0,
                            0,
                        ],
                    },
                    {
                        duration: totalDuration,
                        times: [
                            0,
                            entranceStart,
                            entranceEnd,
                            expansionStart,
                            handoffStart,
                            expansionEnd,
                            1,
                        ],
                        ease: EASE,
                    },
                ),
            )
        })

        track(
            animate(
                grid,
                {
                    visibility: ["hidden", "visible"],
                    opacity: [0, 1],
                    y: [4, 0],
                    scale: [0.995, 1],
                },
                {
                    delay: 0.95 * mobileScale,
                    duration: (baseDuration - 0.95) * mobileScale,
                    ease: EASE,
                },
            ),
        )

        activeAnimationsRef.current = controls

        try {
            await Promise.all(
                controls.map(
                    (animation) =>
                        new Promise<void>((resolve) =>
                            animation.then(resolve),
                        ),
                ),
            )
        } finally {
            window.clearTimeout(stabilizationTimer)
            window.cancelAnimationFrame(stabilizationFrame)
            window.removeEventListener(
                "scroll",
                requestGridStabilization,
            )

            if (shouldStabilizeGrid) {
                stabilizeGridPosition()
            }
            shouldStabilizeGrid = false

            if (isMountedRef.current && !hasCompletedRef.current) {
                revealGrid()
            }
            releaseScrollLock()
        }
    }, [
        measurePreviewTargets,
        releaseScrollLock,
        revealGrid,
        showPageScrollbar,
    ])

    useEffect(() => {
        isMountedRef.current = true

        const trigger = triggerRef.current
        const grid = gridRef.current
        if (!trigger || !grid) return

        if (!reducedMotion) {
            document.documentElement.classList.add(
                IDLE_SCROLLBAR_CLASS,
            )
        }

        let queuedRevealFrame = 0
        let triggerObserver: IntersectionObserver | null = null
        let fastScrollObserver: IntersectionObserver | null = null
        let removeInitialGestureListeners = () => {}

        const scrollGridIntoPosition = (
            behavior: ScrollBehavior,
        ) => {
            const targetScrollY =
                window.scrollY +
                grid.getBoundingClientRect().top -
                getDistributedGridTop()

            window.scrollTo({
                top: Math.max(0, targetScrollY),
                behavior,
            })
        }

        const requestWorkReveal = () => {
            removeInitialGestureListeners()

            if (hasCompletedRef.current) {
                scrollGridIntoPosition(
                    reducedMotion ? "auto" : "smooth",
                )
                return
            }

            if (reducedMotion) {
                revealGrid(false)
                queuedRevealFrame = window.requestAnimationFrame(() => {
                    scrollGridIntoPosition("auto")
                })
                return
            }

            const triggerDocumentTop =
                window.scrollY + trigger.getBoundingClientRect().top
            const targetScrollY = Math.max(
                0,
                triggerDocumentTop - window.innerHeight * 0.68,
            )

            window.scrollTo({
                top: targetScrollY,
                behavior: "smooth",
            })
            void playReveal()
        }

        const cleanup = () => {
            window.cancelAnimationFrame(queuedRevealFrame)
            showPageScrollbar()
            removeInitialGestureListeners()
            window.removeEventListener(
                "portfolio:reveal-work",
                requestWorkReveal,
            )
            triggerObserver?.disconnect()
            fastScrollObserver?.disconnect()
        }

        window.addEventListener(
            "portfolio:reveal-work",
            requestWorkReveal,
        )

        const hasQueuedWorkReveal =
            new URLSearchParams(window.location.search).get("reveal") ===
            "projects"

        if (hasQueuedWorkReveal) {
            queuedRevealFrame = window.requestAnimationFrame(() => {
                requestWorkReveal()
            })
            return cleanup
        }

        if (window.location.pathname === "/work") {
            const heroShell = heroShellRef.current
            if (heroShell) {
                finalHeroHeightRef.current = 0
                heroShell.style.height = "0px"
                heroShell.style.overflow = "hidden"
            }
            revealGrid()
            return cleanup
        }

        if (reducedMotion) {
            revealGrid(false)
            return cleanup
        }

        const triggerRect = trigger.getBoundingClientRect()
        const gridRect = grid.getBoundingClientRect()

        if (
            triggerRect.bottom < 0 ||
            gridRect.top < window.innerHeight * 0.25
        ) {
            revealGrid()
            return cleanup
        }

        if (
            triggerRect.top <=
            window.innerHeight * REVEAL_VIEWPORT_LINE
        ) {
            void playReveal()
            return cleanup
        }

        let initialTouchY: number | null = null

        const startRevealFromGesture = () => {
            if (hasPlayedRef.current) return

            removeInitialGestureListeners()
            triggerObserver?.disconnect()
            void playReveal(false)
        }

        const handleInitialWheel = (event: WheelEvent) => {
            if (event.deltaY <= 0 || hasPlayedRef.current) return

            event.preventDefault()
            startRevealFromGesture()
        }

        const handleInitialTouchStart = (event: TouchEvent) => {
            initialTouchY = event.touches[0]?.clientY ?? null
        }

        const handleInitialTouchMove = (event: TouchEvent) => {
            const currentTouchY = event.touches[0]?.clientY
            if (
                currentTouchY === undefined ||
                initialTouchY === null ||
                initialTouchY - currentTouchY < 6 ||
                hasPlayedRef.current
            ) {
                return
            }

            event.preventDefault()
            startRevealFromGesture()
        }

        const handleInitialKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null
            const isEditable =
                target?.isContentEditable ||
                target?.matches("input, textarea, select")
            const revealsProjects =
                !isEditable &&
                ["ArrowDown", "End", "PageDown", " "].includes(
                    event.key,
                )

            if (!revealsProjects || hasPlayedRef.current) return

            event.preventDefault()
            startRevealFromGesture()
        }

        removeInitialGestureListeners = () => {
            window.removeEventListener("wheel", handleInitialWheel)
            window.removeEventListener(
                "touchstart",
                handleInitialTouchStart,
            )
            window.removeEventListener(
                "touchmove",
                handleInitialTouchMove,
            )
            document.removeEventListener(
                "keydown",
                handleInitialKeyDown,
            )
        }

        window.addEventListener("wheel", handleInitialWheel, {
            passive: false,
        })
        window.addEventListener(
            "touchstart",
            handleInitialTouchStart,
            { passive: true },
        )
        window.addEventListener("touchmove", handleInitialTouchMove, {
            passive: false,
        })
        document.addEventListener("keydown", handleInitialKeyDown)

        triggerObserver = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return

                removeInitialGestureListeners()
                triggerObserver?.disconnect()
                void playReveal()
            },
            {
                threshold: 0,
                // Start after a small, intentional scroll rather than making
                // visitors travel through a quarter of the hero first.
                rootMargin: "0px 0px -10% 0px",
            },
        )

        fastScrollObserver = new IntersectionObserver(
            ([entry]) => {
                if (
                    hasPlayedRef.current &&
                    !hasCompletedRef.current &&
                    !entry.isIntersecting &&
                    entry.boundingClientRect.bottom < 0
                ) {
                    revealGrid()
                }
            },
            { threshold: 0 },
        )

        triggerObserver.observe(trigger)
        fastScrollObserver.observe(grid)

        return cleanup
    }, [
        playReveal,
        reducedMotion,
        revealGrid,
        showPageScrollbar,
    ])

    useEffect(() => {
        let interactionStarted = false
        let previousRootAnchor = ""
        let previousBodyAnchor = ""
        let previousTouchY: number | null = null
        let touchReachedProjectTop = false
        let blankHoldTimer = 0
        let unlockReturnScroll: (() => void) | null = null
        let returnAnimations: StoppableAnimation[] = []
        let previousScrollY = window.scrollY
        let hasScrolledWithinProjects = window.scrollY > 1
        let lastWheelDeltaY = 0
        let cycleReadyForReveal = false

        const waitForBlankHold = () =>
            new Promise<void>((resolve) => {
                blankHoldTimer = window.setTimeout(resolve, 160)
            })

        const waitForAnimation = (animation: StoppableAnimation) =>
            new Promise<void>((resolve) => {
                animation.then(resolve, resolve)
            })

        const restoreDocumentAnchoring = () => {
            document.documentElement.style.overflowAnchor =
                previousRootAnchor
            document.body.style.overflowAnchor = previousBodyAnchor
        }

        const finishHeroReturn = () => {
            const heroElement = heroRef.current
            const heroShell = heroShellRef.current
            const previewLayer = previewLayerRef.current
            const grid = gridRef.current
            if (!heroElement || !heroShell || !grid) return

            finalHeroHeightRef.current = null
            heroShell.style.removeProperty("height")
            heroShell.style.removeProperty("overflow")
            heroElement.style.removeProperty("opacity")
            heroElement.style.removeProperty("transform")
            heroElement.style.visibility = "visible"
            heroElement.style.removeProperty("pointer-events")
            heroElement.removeAttribute("aria-hidden")
            restoreDocumentAnchoring()
            unlockReturnScroll?.()
            unlockReturnScroll = null
            interactionStarted = false

            grid.dataset.revealState = "idle"
            grid.setAttribute("inert", "")
            grid.setAttribute("aria-hidden", "true")
            if (previewLayer) {
                previewLayer.style.visibility = "hidden"
            }

            hasPlayedRef.current = false
            hasCompletedRef.current = false
            hasRestoredHeroRef.current = false
            hasScrolledWithinProjects = false
            previousScrollY = window.scrollY
            cycleReadyForReveal = true
            syncVisibleWorkRoute("hero")
            document.documentElement.classList.add(
                IDLE_SCROLLBAR_CLASS,
            )
        }

        const startAutomaticHeroReturn = async () => {
            if (
                interactionStarted ||
                !hasCompletedRef.current ||
                hasRestoredHeroRef.current
            ) {
                return
            }

            const heroElement = heroRef.current
            const heroShell = heroShellRef.current
            if (!heroElement || !heroShell) return

            interactionStarted = true
            previousRootAnchor =
                document.documentElement.style.overflowAnchor
            previousBodyAnchor = document.body.style.overflowAnchor
            document.documentElement.style.overflowAnchor = "none"
            document.body.style.overflowAnchor = "none"

            const collapsedHeight =
                heroShell.getBoundingClientRect().height
            const naturalHeight = Math.max(
                heroShell.scrollHeight,
                heroElement.getBoundingClientRect().height,
            )

            heroShell.style.height = `${collapsedHeight}px`
            heroShell.style.overflow = "hidden"
            heroElement.style.visibility = "hidden"
            heroElement.style.opacity = "0"
            heroElement.style.transform =
                "translateY(-38px) scale(0.985)"
            heroElement.style.pointerEvents = "none"
            heroElement.setAttribute("aria-hidden", "true")
            unlockReturnScroll = lockPageScroll()

            const shellAnimation = animate(
                heroShell,
                { height: naturalHeight },
                {
                    duration: 0.44,
                    ease: EASE,
                },
            )
            returnAnimations = [shellAnimation]
            await waitForAnimation(shellAnimation)

            if (!isMountedRef.current) return
            await waitForBlankHold()
            if (!isMountedRef.current) return

            heroElement.style.visibility = "visible"
            heroElement.removeAttribute("aria-hidden")
            window.dispatchEvent(
                new Event("portfolio:hero-return"),
            )

            const heroAnimation = animate(
                heroElement,
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                },
                {
                    duration: 0.68,
                    ease: EASE,
                },
            )
            returnAnimations.push(heroAnimation)
            await waitForAnimation(heroAnimation)

            if (isMountedRef.current) {
                finishHeroReturn()
            }
        }

        const handleReturnWheel = (event: WheelEvent) => {
            lastWheelDeltaY = event.deltaY

            if (
                cycleReadyForReveal &&
                window.scrollY <= 1 &&
                event.deltaY > 0
            ) {
                event.preventDefault()
                cycleReadyForReveal = false
                void playReveal(false)
                return
            }

            if (
                window.scrollY <= 1 &&
                event.deltaY < 0 &&
                hasCompletedRef.current &&
                !hasRestoredHeroRef.current
            ) {
                event.preventDefault()
                void startAutomaticHeroReturn()
            }
        }

        const handleProjectScroll = () => {
            const currentScrollY = window.scrollY
            const isMovingUp = currentScrollY < previousScrollY

            if (currentScrollY > 1) {
                hasScrolledWithinProjects = true
            }

            if (
                isMovingUp &&
                lastWheelDeltaY < 0 &&
                currentScrollY <= 1 &&
                hasScrolledWithinProjects &&
                hasCompletedRef.current &&
                !hasRestoredHeroRef.current
            ) {
                void startAutomaticHeroReturn()
            }

            previousScrollY = currentScrollY
        }

        const handleReturnTouchStart = (event: TouchEvent) => {
            previousTouchY = event.touches[0]?.clientY ?? null
            touchReachedProjectTop = window.scrollY <= 1
        }

        const handleReturnTouchMove = (event: TouchEvent) => {
            const currentTouchY = event.touches[0]?.clientY
            if (
                currentTouchY === undefined ||
                previousTouchY === null
            ) {
                return
            }

            const touchDelta = currentTouchY - previousTouchY
            previousTouchY = currentTouchY

            if (
                cycleReadyForReveal &&
                window.scrollY <= 1 &&
                touchDelta < -5
            ) {
                event.preventDefault()
                cycleReadyForReveal = false
                void playReveal(false)
                return
            }

            if (window.scrollY > 1) {
                touchReachedProjectTop = false
                return
            }

            if (!touchReachedProjectTop) {
                touchReachedProjectTop = true
                return
            }

            if (
                touchDelta > 5 &&
                hasCompletedRef.current &&
                !hasRestoredHeroRef.current
            ) {
                event.preventDefault()
                void startAutomaticHeroReturn()
            }
        }

        const handleReturnTouchEnd = () => {
            previousTouchY = null
            touchReachedProjectTop = false
        }

        const handleReturnKeyDown = (event: KeyboardEvent) => {
            if (
                cycleReadyForReveal &&
                window.scrollY <= 1 &&
                ["ArrowDown", "End", "PageDown", " "].includes(
                    event.key,
                )
            ) {
                event.preventDefault()
                cycleReadyForReveal = false
                void playReveal(false)
                return
            }

            if (
                window.scrollY <= 1 &&
                ["ArrowUp", "Home", "PageUp"].includes(event.key) &&
                hasCompletedRef.current &&
                !hasRestoredHeroRef.current
            ) {
                event.preventDefault()
                void startAutomaticHeroReturn()
            }
        }

        const handleRequestedHeroReturn = (event: Event) => {
            event.preventDefault()
            window.scrollTo({
                top: 0,
                behavior: "auto",
            })

            if (
                hasPlayedRef.current &&
                !hasCompletedRef.current
            ) {
                revealGrid()
            }

            if (
                hasCompletedRef.current &&
                !hasRestoredHeroRef.current
            ) {
                void startAutomaticHeroReturn()
                return
            }

            if (hasCompletedRef.current) {
                finishHeroReturn()
            } else {
                syncVisibleWorkRoute("hero")
            }

            window.dispatchEvent(
                new Event("portfolio:hero-return"),
            )
        }

        window.addEventListener("wheel", handleReturnWheel, {
            passive: false,
        })
        window.addEventListener("scroll", handleProjectScroll, {
            passive: true,
        })
        window.addEventListener("touchstart", handleReturnTouchStart, {
            passive: true,
        })
        window.addEventListener("touchmove", handleReturnTouchMove, {
            passive: false,
        })
        window.addEventListener("touchend", handleReturnTouchEnd, {
            passive: true,
        })
        window.addEventListener("touchcancel", handleReturnTouchEnd, {
            passive: true,
        })
        document.addEventListener("keydown", handleReturnKeyDown)
        window.addEventListener(
            HERO_RETURN_REQUEST_EVENT,
            handleRequestedHeroReturn,
        )

        return () => {
            window.removeEventListener("wheel", handleReturnWheel)
            window.removeEventListener("scroll", handleProjectScroll)
            window.removeEventListener(
                "touchstart",
                handleReturnTouchStart,
            )
            window.removeEventListener(
                "touchmove",
                handleReturnTouchMove,
            )
            window.removeEventListener(
                "touchend",
                handleReturnTouchEnd,
            )
            window.removeEventListener(
                "touchcancel",
                handleReturnTouchEnd,
            )
            document.removeEventListener(
                "keydown",
                handleReturnKeyDown,
            )
            window.removeEventListener(
                HERO_RETURN_REQUEST_EVENT,
                handleRequestedHeroReturn,
            )
            window.clearTimeout(blankHoldTimer)
            returnAnimations.forEach((animation) => animation.stop())
            unlockReturnScroll?.()

            if (interactionStarted) {
                restoreDocumentAnchoring()
            }
        }
    }, [playReveal, revealGrid])

    useEffect(
        () => () => {
            isMountedRef.current = false
            stopActiveAnimations()
            releaseScrollLock()
            showPageScrollbar()
        },
        [
            releaseScrollLock,
            showPageScrollbar,
            stopActiveAnimations,
        ],
    )

    return (
        <>
            <div
                ref={heroShellRef}
                className="projects-transition__hero-shell"
            >
                <div ref={heroRef} className="projects-transition__hero-layer">
                    {hero}
                </div>
                <span
                    id="projects-transition-progress"
                    ref={triggerRef}
                    className="projects-transition__trigger"
                    aria-hidden="true"
                />
            </div>

            <section
                className="projects-transition"
                aria-label="Projects introduction"
            >
                <div
                    ref={previewLayerRef}
                    className="projects-transition__preview-layer"
                    aria-hidden="true"
                >
                    {projects.slice(0, 4).map((project) => (
                        <div
                            key={project.slug}
                            className="projects-transition__preview"
                        >
                            <div className="projects-transition__preview-media">
                                <img
                                    src={project.image}
                                    alt=""
                                    decoding="async"
                                />
                            </div>
                            <div className="project-card__info">
                                <div className="project-card__title">
                                    {project.title}
                                </div>
                                <div className="project-card__desc">
                                    {project.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    ref={gridRef}
                    className="projects-grid-handoff"
                    data-reveal-state="idle"
                    aria-hidden="true"
                    inert
                >
                    {children}
                </div>
            </section>
        </>
    )
}
