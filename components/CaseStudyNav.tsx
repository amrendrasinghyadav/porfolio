"use client"

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type MouseEvent,
} from "react"

export type CaseStudySection = {
    id: string
    label: string
}

type CaseStudyNavProps = {
    sections: readonly CaseStudySection[]
}

export default function CaseStudyNav({ sections }: CaseStudyNavProps) {
    const [activeId, setActiveId] = useState("")
    const frame = useRef<number | null>(null)

    const updateActiveSection = useCallback(() => {
        if (sections.length === 0) return

        const headerBottom =
            document
                .querySelector<HTMLElement>(".site-header")
                ?.getBoundingClientRect().bottom ?? 0
        const localNav =
            document.querySelector<HTMLElement>(".case-study-nav")
        const localNavHeight = localNav?.getBoundingClientRect().height ?? 0
        const navIsInDesktopRail = Boolean(
            localNav?.closest(".project-detail__rail") &&
                window.matchMedia("(min-width: 981px)").matches,
        )
        const compactRailHeight =
            localNav
                ?.closest<HTMLElement>(".project-detail__rail")
                ?.getBoundingClientRect().height ?? localNavHeight
        const readingLine =
            headerBottom +
            (navIsInDesktopRail ? 0 : compactRailHeight) +
            (navIsInDesktopRail ? 40 : 16)

        let nextId = ""

        for (const section of sections) {
            const element = document.getElementById(section.id)
            if (!element) continue

            if (element.getBoundingClientRect().top <= readingLine) {
                nextId = section.id
            } else {
                break
            }
        }

        const reachedPageEnd =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 4

        if (reachedPageEnd && window.scrollY > 0) {
            nextId = sections[sections.length - 1].id
        }

        setActiveId((current) => (current === nextId ? current : nextId))
    }, [sections])

    useEffect(() => {
        if (window.location.hash) {
            window.history.replaceState(
                window.history.state,
                "",
                `${window.location.pathname}${window.location.search}`,
            )
        }

        const scheduleUpdate = () => {
            if (frame.current !== null) return
            frame.current = window.requestAnimationFrame(() => {
                frame.current = null
                updateActiveSection()
            })
        }

        scheduleUpdate()
        window.addEventListener("scroll", scheduleUpdate, { passive: true })
        window.addEventListener("resize", scheduleUpdate)

        return () => {
            window.removeEventListener("scroll", scheduleUpdate)
            window.removeEventListener("resize", scheduleUpdate)
            if (frame.current !== null) {
                window.cancelAnimationFrame(frame.current)
                frame.current = null
            }
        }
    }, [sections, updateActiveSection])

    const handleClick = (
        event: MouseEvent<HTMLButtonElement>,
        sectionId: string
    ) => {
        const target = document.getElementById(sectionId)
        if (!target) return

        event.preventDefault()
        setActiveId(sectionId)
        target.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <nav className="case-study-nav" aria-label="Case study sections">
            <ul className="case-study-nav__list">
                {sections.map((section) => {
                    const active = activeId === section.id

                    return (
                        <li key={section.id}>
                            <button
                                className={`case-study-nav__link${
                                    active ? " is-active" : ""
                                }`}
                                type="button"
                                aria-current={active ? "location" : undefined}
                                onClick={(event) =>
                                    handleClick(event, section.id)
                                }
                            >
                                {section.label}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
