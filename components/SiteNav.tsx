"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type MouseEvent } from "react"
import RandomLetterSwap from "@/components/RandomLetterSwap"

// Résumé opens in a new tab.
const RESUME_URL =
    "https://drive.google.com/file/d/1cRmWNXUA26PlIeRiowkOTLmx32HaCLA5/view?usp=sharing"
const HERO_RETURN_REQUEST_EVENT = "portfolio:request-hero-return"
const HERO_CLIENT_NAVIGATION_DATA_KEY = "portfolioHeroClientNavigation"

// Default header links (Works · Playground · About · Resume).
const DEFAULT_LINKS = [
    { href: "/?reveal=projects", label: "Works" },
    { href: "/playground", label: "Playground" },
    { href: "/about", label: "About" },
    { href: RESUME_URL, label: "Resume", external: true },
]

export default function SiteNav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)

    // Project detail pages live at /work/[slug] (not the /work grid itself).
    const isProjectPage = pathname.startsWith("/work/")
    const links = DEFAULT_LINKS

    const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
        close()

        if (pathname !== "/" && pathname !== "/work") {
            document.documentElement.dataset[
                HERO_CLIENT_NAVIGATION_DATA_KEY
            ] = "true"
            return
        }

        const returnRequest = new Event(HERO_RETURN_REQUEST_EVENT, {
            cancelable: true,
        })
        const wasHandled = !window.dispatchEvent(returnRequest)

        if (wasHandled) {
            event.preventDefault()
        } else {
            document.documentElement.dataset[
                HERO_CLIENT_NAVIGATION_DATA_KEY
            ] = "true"
        }
    }

    const handleInternalLinkClick = (
        event: MouseEvent<HTMLAnchorElement>,
        label: string,
    ) => {
        close()
        if (label !== "Works") return

        if (pathname === "/" || pathname === "/work") {
            event.preventDefault()
            window.dispatchEvent(new Event("portfolio:reveal-work"))
        }
    }

    if (isProjectPage) return null

    return (
        <header className="site-header">
            <div className="nav-bar" data-open={open}>
                <Link
                    className="nav-bar__logo"
                    href="/"
                    onClick={handleLogoClick}
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
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="nav-bar__toggle-bar" />
                    <span className="nav-bar__toggle-bar" />
                </button>

                <div className="nav-bar__menu">
                    <nav className="nav-bar__nav" aria-label="Primary">
                        <ul className="nav-bar__links">
                            {links.map(({ href, label, external }) => {
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
                                            </a>
                                        ) : (
                                            <Link
                                                href={href}
                                                onClick={(event) =>
                                                    handleInternalLinkClick(
                                                        event,
                                                        label,
                                                    )
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
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}
