"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type MouseEvent } from "react"
import { IconArrowUpRight } from "@tabler/icons-react"
import AboutPanelContent from "@/components/AboutPanelContent"
import RandomLetterSwap from "@/components/RandomLetterSwap"

// Résumé opens in a new tab.
const RESUME_URL =
    "https://drive.google.com/file/d/1cRmWNXUA26PlIeRiowkOTLmx32HaCLA5/view?usp=sharing"
// Default header links (Work · Playground · About · Resume).
type NavLink = {
    href: string
    label: string
    external?: boolean
    about?: boolean
    work?: boolean
}

const DEFAULT_LINKS: readonly NavLink[] = [
    { href: "/#selected-work", label: "Work", work: true },
    { href: "/playground", label: "Playground" },
    { href: "/#about", label: "About", about: true },
    { href: RESUME_URL, label: "Resume", external: true },
]

export default function SiteNav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [aboutOpen, setAboutOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const close = () => {
        setOpen(false)
        setAboutOpen(false)
    }

    const closeAbout = () => {
        setAboutOpen(false)
        if (window.location.hash === "#about") {
            window.history.replaceState(null, "", pathname || "/")
        }
    }

    const openAbout = () => {
        setOpen(false)
        setAboutOpen(true)
        window.history.replaceState(null, "", "/#about")
    }

    const openWork = (event: MouseEvent<HTMLAnchorElement>) => {
        close()
        if (pathname !== "/") return

        const selectedWork = document.getElementById("selected-work")
        if (!selectedWork) return

        event.preventDefault()
        selectedWork.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    useEffect(() => {
        const syncAboutHash = () => {
            if (window.location.hash !== "#about") {
                setAboutOpen(false)
                return
            }

            setOpen(false)
            setAboutOpen(true)
        }

        syncAboutHash()
        window.addEventListener("hashchange", syncAboutHash)
        return () => window.removeEventListener("hashchange", syncAboutHash)
    }, [pathname])

    useEffect(() => {
        if (!aboutOpen) return

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return

            setAboutOpen(false)
            if (window.location.hash === "#about") {
                window.history.replaceState(null, "", pathname || "/")
            }
        }

        const handleOutsideClick = (event: PointerEvent) => {
            if (!(event.target instanceof Node)) return

            if (
                event.target instanceof Element &&
                event.target.closest('[aria-controls="about-panel"]')
            ) {
                return
            }

            const panel = document.getElementById("about-panel")
            if (panel?.contains(event.target)) return

            setAboutOpen(false)
            if (window.location.hash === "#about") {
                window.history.replaceState(null, "", pathname || "/")
            }
        }

        const handleScroll = () => {
            setAboutOpen(false)
            if (window.location.hash === "#about") {
                window.history.replaceState(null, "", pathname || "/")
            }
        }

        window.addEventListener("keydown", handleEscape)
        window.addEventListener("scroll", handleScroll, { passive: true })
        document.addEventListener("pointerdown", handleOutsideClick)
        return () => {
            window.removeEventListener("keydown", handleEscape)
            window.removeEventListener("scroll", handleScroll)
            document.removeEventListener("pointerdown", handleOutsideClick)
        }
    }, [aboutOpen, pathname])

    useEffect(() => {
        const selectedWork = document.getElementById("selected-work")
        const testimonials = document.getElementById("testimonials")
        let frame = 0

        const update = () => {
            frame = 0

            // A scroll event can fire after a client-side navigation has
            // started but before this effect has been replaced. Do not let
            // the outgoing Work page overwrite the destination URL.
            if (window.location.pathname !== pathname) return

            const selectedWorkTop = selectedWork
                ? selectedWork.getBoundingClientRect().top
                : Number.POSITIVE_INFINITY
            const testimonialsTop = testimonials
                ? testimonials.getBoundingClientRect().top
                : Number.POSITIVE_INFINITY
            const sectionActivationLine = Math.min(
                240,
                window.innerHeight * 0.35,
            )
            const shouldHide = selectedWorkTop <= 96
            const isInWork = selectedWorkTop <= 1
            const isInTestimonials = testimonialsTop <= sectionActivationLine

            setHidden(shouldHide)
            if (shouldHide) setOpen(false)

            const isWorkLanding = pathname === "/" || pathname === "/work"
            if (
                isWorkLanding &&
                !aboutOpen &&
                window.location.hash !== "#about"
            ) {
                const activeHash = isInTestimonials
                    ? "#testimonials"
                    : isInWork
                      ? "#selected-work"
                      : ""

                if (window.location.hash !== activeHash) {
                    window.history.replaceState(
                        null,
                        "",
                        `${pathname}${activeHash}`,
                    )
                }
            }
        }

        const requestUpdate = () => {
            if (frame) return
            frame = window.requestAnimationFrame(update)
        }

        requestUpdate()

        if (selectedWork || testimonials) {
            window.addEventListener("scroll", requestUpdate, {
                passive: true,
            })
            window.addEventListener("resize", requestUpdate)
        }

        return () => {
            window.cancelAnimationFrame(frame)
            window.removeEventListener("scroll", requestUpdate)
            window.removeEventListener("resize", requestUpdate)
        }
    }, [aboutOpen, pathname])

    const isProjectPage = pathname.startsWith("/work/")
    const links = DEFAULT_LINKS

    if (isProjectPage) return null

    return (
        <header
            className="site-header"
            data-hidden={hidden}
            aria-hidden={hidden}
        >
            <div
                className="nav-bar"
                data-open={open}
                data-about-open={aboutOpen}
            >
                <Link
                    className="nav-bar__logo"
                    href="/"
                    onClick={close}
                    aria-label="Amrendra — Home"
                >
                    <span className="nav-bar__logo-mark">
                        <video
                            src="/brand/hive-cats.webm"
                            width="36"
                            height="36"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-hidden="true"
                        />
                    </span>
                    <span
                        className="nav-bar__logo-preview"
                        aria-hidden="true"
                    >
                        <video
                            src="/brand/cat-typing.webm"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                        />
                    </span>
                </Link>

                <button
                    type="button"
                    className="nav-bar__toggle"
                    aria-expanded={open}
                    aria-label={open ? "Close menu" : "Open menu"}
                    onClick={() => {
                        setAboutOpen(false)
                        setOpen((v) => !v)
                    }}
                >
                    <span className="nav-bar__toggle-bar" />
                    <span className="nav-bar__toggle-bar" />
                </button>

                <div className="nav-bar__menu">
                    <nav className="nav-bar__nav" aria-label="Primary">
                        <ul className="nav-bar__links">
                            {links.map(
                                ({ href, label, external, about, work }) => {
                                    if (about) {
                                        return (
                                            <li key={label}>
                                                <Link
                                                    href={href}
                                                    aria-expanded={aboutOpen}
                                                    aria-controls="about-panel"
                                                    onClick={(event) => {
                                                        setOpen(false)
                                                        if (pathname === "/") {
                                                            event.preventDefault()
                                                            if (aboutOpen) {
                                                                closeAbout()
                                                            } else {
                                                                openAbout()
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <RandomLetterSwap
                                                        label={label}
                                                        mode="pingpong"
                                                        staggerDuration={0.035}
                                                    />
                                                </Link>
                                            </li>
                                        )
                                    }

                                return (
                                    <li key={label}>
                                        {external ? (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={close}
                                            >
                                                <RandomLetterSwap
                                                    label={label}
                                                    mode="pingpong"
                                                    staggerDuration={0.035}
                                                />
                                                <IconArrowUpRight aria-hidden="true" />
                                            </a>
                                        ) : (
                                            <Link
                                                href={href}
                                                onClick={
                                                    work ? openWork : close
                                                }
                                            >
                                                <RandomLetterSwap
                                                    label={label}
                                                    mode="pingpong"
                                                    staggerDuration={0.035}
                                                />
                                            </Link>
                                        )}
                                    </li>
                                )
                                },
                            )}
                        </ul>
                    </nav>
                </div>

                {aboutOpen ? (
                    <section
                        id="about-panel"
                        className="about-panel"
                        aria-labelledby="about-panel-title"
                    >
                        <AboutPanelContent
                            titleId="about-panel-title"
                            onClose={closeAbout}
                        />
                    </section>
                ) : null}
            </div>
        </header>
    )
}
