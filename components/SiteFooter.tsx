"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState, type MouseEvent } from "react"
import { IconArrowUpRight, IconCoffee, IconHeart } from "@tabler/icons-react"
import AboutPanelContent from "@/components/AboutPanelContent"

const RESUME_URL =
    "https://drive.google.com/file/d/1cRmWNXUA26PlIeRiowkOTLmx32HaCLA5/view?usp=sharing"

const PRIMARY_LINKS = [
    { href: "/#selected-work", label: "Work" },
    { href: "/playground", label: "Playground" },
    { href: "/#about", label: "About" },
] as const

export default function SiteFooter() {
    const pathname = usePathname()
    const footerChromeRef = useRef<HTMLDivElement>(null)
    const [aboutOpen, setAboutOpen] = useState(false)

    useEffect(() => {
        if (!aboutOpen) return

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setAboutOpen(false)
        }

        const handleOutsideClick = (event: PointerEvent) => {
            if (!(event.target instanceof Node)) return
            if (footerChromeRef.current?.contains(event.target)) return
            setAboutOpen(false)
        }

        window.addEventListener("keydown", handleEscape)
        document.addEventListener("pointerdown", handleOutsideClick)
        return () => {
            window.removeEventListener("keydown", handleEscape)
            document.removeEventListener("pointerdown", handleOutsideClick)
        }
    }, [aboutOpen])

    const openWork = (event: MouseEvent<HTMLAnchorElement>) => {
        setAboutOpen(false)
        const selectedWork = document.getElementById("selected-work")
        if (!selectedWork) return

        event.preventDefault()
        selectedWork.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    if (pathname !== "/" && pathname !== "/work") return null

    return (
        <footer className="site-footer">
            <div ref={footerChromeRef} className="site-footer__chrome">
                <nav
                    className="site-footer__nav"
                    aria-label="Footer navigation"
                    data-about-open={aboutOpen}
                >
                    <ul className="site-footer__group">
                        {PRIMARY_LINKS.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    aria-expanded={
                                        link.label === "About"
                                            ? aboutOpen
                                            : undefined
                                    }
                                    aria-controls={
                                        link.label === "About"
                                            ? "footer-about-panel"
                                            : undefined
                                    }
                                    onClick={(event) => {
                                        if (link.label === "About") {
                                            event.preventDefault()
                                            setAboutOpen((open) => !open)
                                            return
                                        }

                                        if (link.href === "/#selected-work") {
                                            openWork(event)
                                            return
                                        }

                                        setAboutOpen(false)
                                    }}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <a
                                href={RESUME_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setAboutOpen(false)}
                            >
                                Resume
                                <IconArrowUpRight aria-hidden="true" />
                            </a>
                        </li>
                    </ul>

                    <ul className="site-footer__group site-footer__group--contact">
                        <li>
                            <a
                                href="https://www.linkedin.com/in/amrendrasinghyadav/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setAboutOpen(false)}
                            >
                                LinkedIn
                                <IconArrowUpRight aria-hidden="true" />
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:amr2003sngh@gmail.com"
                                onClick={() => setAboutOpen(false)}
                            >
                                Email
                                <IconArrowUpRight aria-hidden="true" />
                            </a>
                        </li>
                    </ul>
                </nav>

                {aboutOpen ? (
                    <section
                        id="footer-about-panel"
                        className="footer-about-panel"
                        aria-labelledby="footer-about-panel-title"
                    >
                        <AboutPanelContent
                            titleId="footer-about-panel-title"
                            onClose={() => setAboutOpen(false)}
                        />
                    </section>
                ) : null}
            </div>

            <p
                className="site-footer__credit"
                aria-label="Vibecoded with love and coffee"
            >
                <span aria-hidden="true">Vibecoded with</span>
                <IconHeart aria-hidden="true" />
                <span aria-hidden="true">and</span>
                <IconCoffee aria-hidden="true" />
            </p>
        </footer>
    )
}
