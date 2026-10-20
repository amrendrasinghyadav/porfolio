"use client"

import { useEffect, useRef, type ReactNode } from "react"

type DesktopProjectRailProps = {
    children: ReactNode
}

export default function DesktopProjectRail({
    children,
}: DesktopProjectRailProps) {
    const railRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
        const rail = railRef.current
        if (!rail) return

        const desktopQuery = window.matchMedia("(min-width: 1051px)")
        const section = rail.closest<HTMLElement>(".selected-work")
        if (!section) return
        let scrollFrame = 0
        let measureFrame = 0
        let railTravel = 0
        let sectionTop = 0
        let verticalTravel = 1
        let lastTranslateX = Number.NaN
        let hasMeasured = false
        let disposed = false

        const updateTransform = () => {
            scrollFrame = 0

            if (!desktopQuery.matches || !hasMeasured) return

            const progress = Math.max(
                0,
                Math.min(
                    1,
                    (window.scrollY - sectionTop) / verticalTravel,
                ),
            )
            const translateX = -railTravel * progress

            if (Math.abs(translateX - lastTranslateX) < 0.1) return

            rail.style.transform = `translate3d(${translateX}px, 0, 0)`
            lastTranslateX = translateX
        }

        const requestTransformUpdate = () => {
            if (!scrollFrame) {
                scrollFrame = window.requestAnimationFrame(updateTransform)
            }
        }

        const measureRail = () => {
            measureFrame = 0

            if (!desktopQuery.matches) {
                rail.style.removeProperty("transform")
                section.style.removeProperty("--project-rail-travel")
                railTravel = 0
                sectionTop = 0
                verticalTravel = 1
                lastTranslateX = Number.NaN
                hasMeasured = false
                return
            }

            const viewportWidth = window.innerWidth
            const sectionStyles = window.getComputedStyle(section)
            const leftInset = Number.parseFloat(sectionStyles.paddingLeft) || 0
            const rightInset =
                Number.parseFloat(sectionStyles.paddingRight) || 0
            const railStyles = window.getComputedStyle(rail)
            const railLeadingPadding =
                Number.parseFloat(railStyles.paddingLeft) || 0
            const nextRailTravel = Math.max(
                0,
                rail.scrollWidth -
                    (viewportWidth - leftInset - rightInset) -
                    railLeadingPadding,
            )

            if (
                !hasMeasured ||
                Math.abs(nextRailTravel - railTravel) >= 0.1
            ) {
                section.style.setProperty(
                    "--project-rail-travel",
                    `${nextRailTravel}px`,
                )
            }

            railTravel = nextRailTravel
            sectionTop =
                section.getBoundingClientRect().top + window.scrollY
            verticalTravel = Math.max(
                1,
                section.offsetHeight - window.innerHeight,
            )
            lastTranslateX = Number.NaN
            hasMeasured = true
            requestTransformUpdate()
        }

        const requestMeasure = () => {
            if (!measureFrame) {
                measureFrame = window.requestAnimationFrame(measureRail)
            }
        }

        const resizeObserver = new ResizeObserver(requestMeasure)
        resizeObserver.observe(rail)
        window.addEventListener("scroll", requestTransformUpdate, {
            passive: true,
        })
        window.addEventListener("resize", requestMeasure)
        desktopQuery.addEventListener("change", requestMeasure)
        document.fonts.ready.then(() => {
            if (!disposed) requestMeasure()
        })
        requestMeasure()

        return () => {
            disposed = true
            if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
            if (measureFrame) window.cancelAnimationFrame(measureFrame)
            resizeObserver.disconnect()
            window.removeEventListener("scroll", requestTransformUpdate)
            window.removeEventListener("resize", requestMeasure)
            desktopQuery.removeEventListener("change", requestMeasure)
        }
    }, [])

    return (
        <ul
            ref={railRef}
            className="project-grid"
            aria-label="Selected work projects"
            tabIndex={0}
        >
            {children}
        </ul>
    )
}
