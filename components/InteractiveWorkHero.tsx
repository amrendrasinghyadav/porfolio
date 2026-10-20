"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { IconTerminal } from "@tabler/icons-react"
import {
    useEffect,
    useRef,
    useState,
    type ReactNode,
    type RefObject,
} from "react"

type DeskObjectProps = {
    children: ReactNode
    className: string
    draggable: boolean
    constraintsRef: RefObject<HTMLDivElement | null>
    onDragStart?: () => void
}

function DeskObject({
    children,
    className,
    draggable,
    constraintsRef,
    onDragStart,
}: DeskObjectProps) {
    return (
        <motion.div
            className={`work-hero__object ${className}`}
            drag={draggable}
            dragConstraints={constraintsRef}
            dragElastic={0.08}
            dragMomentum={false}
            onDragStart={onDragStart}
            whileDrag={{ scale: 1.025, zIndex: 12 }}
        >
            {children}
        </motion.div>
    )
}

export default function InteractiveWorkHero() {
    const dragBoundsRef = useRef<HTMLDivElement>(null)
    const testimonialsDraggedRef = useRef(false)
    const reduceMotion = useReducedMotion()
    const [desktopPointer, setDesktopPointer] = useState(false)
    const [folderOpen, setFolderOpen] = useState(false)
    const [terminalOpen, setTerminalOpen] = useState(false)
    const [terminalHovered, setTerminalHovered] = useState(false)

    useEffect(() => {
        const query = window.matchMedia("(min-width: 901px) and (pointer: fine)")
        const sync = () => {
            setDesktopPointer(query.matches)
            if (query.matches) {
                setFolderOpen(false)
                setTerminalOpen(false)
            } else {
                setTerminalHovered(false)
            }
        }

        sync()
        query.addEventListener("change", sync)
        return () => query.removeEventListener("change", sync)
    }, [])

    const draggable = desktopPointer && !reduceMotion
    const terminalExpanded = terminalOpen || terminalHovered

    return (
        <section
            className="work-hero"
            aria-labelledby="work-hero-title"
        >
            <div className="work-hero__grid" aria-hidden="true" />

            <div className="work-hero__composition">
                <div className="work-hero__content selectable">
                    <h1 id="work-hero-title" className="work-hero__title">
                        Namaste, I&apos;m Amrendra
                    </h1>
                    <p className="work-hero__lede">
                        I design B2B and AI-powered products with a systems
                        mindset, connecting user needs, technical complexity,
                        and business outcomes.
                    </p>
                </div>
            </div>

            <div
                ref={dragBoundsRef}
                className="work-hero__objects"
                aria-label="Amrendra's design desk"
            >
                <DeskObject
                    className="work-hero__object--badge"
                    draggable={draggable}
                    constraintsRef={dragBoundsRef}
                >
                    <article className="hero-badge">
                        <div className="hero-badge__photo">
                            <Image
                                src="/about/about-image-2.png"
                                alt="Amrendra jumping across a stream in a grassy valley"
                                fill
                                draggable={false}
                                sizes="156px"
                                priority
                            />
                        </div>
                        <p>Never Really Stopped Making Things.</p>
                    </article>
                </DeskObject>

                <DeskObject
                    className="work-hero__object--note"
                    draggable={draggable}
                    constraintsRef={dragBoundsRef}
                >
                    <article className="hero-note">
                        <Image
                            className="hero-note__image"
                            src="/hero/handwritten-working-note.webp"
                            alt="A taped note: Asking better questions, making the complex feel simple, and making the small details count."
                            width={1278}
                            height={1230}
                            draggable={false}
                            sizes="220px"
                            loading="eager"
                        />
                    </article>
                </DeskObject>

                <DeskObject
                    className="work-hero__object--terminal"
                    draggable={draggable}
                    constraintsRef={dragBoundsRef}
                >
                    <article
                        className="hero-terminal"
                        data-open={terminalExpanded ? "true" : "false"}
                        onMouseEnter={() => {
                            if (desktopPointer) setTerminalHovered(true)
                        }}
                        onMouseLeave={() => {
                            if (desktopPointer) setTerminalHovered(false)
                        }}
                        onFocusCapture={() => {
                            if (desktopPointer) setTerminalHovered(true)
                        }}
                        onBlurCapture={(event) => {
                            if (
                                desktopPointer &&
                                !event.currentTarget.contains(event.relatedTarget)
                            ) {
                                setTerminalHovered(false)
                            }
                        }}
                    >
                        <button
                            className="hero-terminal__trigger"
                            type="button"
                            aria-expanded={terminalExpanded}
                            onClick={() => {
                                if (!desktopPointer) {
                                    setTerminalOpen((open) => !open)
                                }
                            }}
                        >
                            <span className="hero-terminal__bar">
                                <span className="hero-terminal__dots" aria-hidden="true">
                                    <i />
                                    <i />
                                    <i />
                                </span>
                                <span>amrendra — work</span>
                                <IconTerminal size={15} stroke={1.5} aria-hidden="true" />
                            </span>
                            <span className="hero-terminal__body">
                                <span>
                                    <b>~ $</b> who_am_i
                                </span>
                                <em>Product Designer · Enterprise and AI</em>
                                <span>
                                    <b>~ $</b> experience
                                </span>
                                <em>2 startups + freelance projects</em>
                                {terminalExpanded ? (
                                    <>
                                        <span>
                                            <b>~ $</b> think_in
                                        </span>
                                        <em>Systems, workflows, and dependencies</em>
                                        <span>
                                            <b>~ $</b> optimize_for
                                        </span>
                                        <em>Usability, clarity, and business value</em>
                                        <span>
                                            <b>~ $</b> education
                                        </span>
                                        <em>National Institute of Design · Oct &apos;26</em>
                                    </>
                                ) : null}
                                <span className="hero-terminal__prompt">
                                    <b>~ $</b>
                                </span>
                            </span>
                        </button>

                    </article>
                </DeskObject>

                <DeskObject
                    className="work-hero__object--folder"
                    draggable={draggable}
                    constraintsRef={dragBoundsRef}
                >
                    <button
                        className="hero-folder"
                        type="button"
                        data-open={folderOpen ? "true" : "false"}
                        aria-disabled={desktopPointer}
                        aria-label={folderOpen ? "Close My Stacks folder" : "Open My Stacks folder"}
                        aria-pressed={folderOpen}
                        tabIndex={desktopPointer ? -1 : 0}
                        onClick={() => {
                            if (!desktopPointer) setFolderOpen((open) => !open)
                        }}
                    >
                        <span className="hero-folder__logos" aria-hidden="true">
                            <span className="hero-folder__logo">
                                <Image
                                    src="/hero/stacks/figma.webp"
                                    alt=""
                                    fill
                                    draggable={false}
                                    sizes="46px"
                                />
                            </span>
                            <span className="hero-folder__logo">
                                <Image
                                    src="/hero/stacks/notion.webp"
                                    alt=""
                                    fill
                                    draggable={false}
                                    sizes="46px"
                                />
                            </span>
                            <span className="hero-folder__logo">
                                <Image
                                    src="/hero/stacks/openai.webp"
                                    alt=""
                                    fill
                                    draggable={false}
                                    sizes="46px"
                                />
                            </span>
                            <span className="hero-folder__logo">
                                <Image
                                    src="/hero/stacks/claude.webp"
                                    alt=""
                                    fill
                                    draggable={false}
                                    sizes="46px"
                                />
                            </span>
                            <span className="hero-folder__logo">
                                <Image
                                    src="/hero/stacks/github.webp"
                                    alt=""
                                    fill
                                    draggable={false}
                                    sizes="46px"
                                />
                            </span>
                        </span>
                        <span className="hero-folder__art" aria-hidden="true">
                            <Image
                                className="hero-folder__image hero-folder__image--closed"
                                src="/hero/sage-folder-closed.webp"
                                alt=""
                                fill
                                draggable={false}
                                loading="eager"
                                sizes="(max-width: 640px) 112px, (max-width: 900px) 126px, 142px"
                            />
                            <Image
                                className="hero-folder__image hero-folder__image--open"
                                src="/hero/sage-folder-open.webp"
                                alt=""
                                fill
                                draggable={false}
                                sizes="(max-width: 640px) 112px, (max-width: 900px) 126px, 142px"
                            />
                        </span>
                        <span className="hero-folder__label">My Stacks</span>
                    </button>
                </DeskObject>

                <DeskObject
                    className="work-hero__object--recommendations"
                    draggable={draggable}
                    constraintsRef={dragBoundsRef}
                    onDragStart={() => {
                        testimonialsDraggedRef.current = true
                    }}
                >
                    <Link
                        className="hero-recommendations"
                        href="#testimonials"
                        aria-label="View testimonials"
                        draggable={false}
                        onPointerDown={() => {
                            testimonialsDraggedRef.current = false
                        }}
                        onClick={(event) => {
                            if (testimonialsDraggedRef.current) {
                                event.preventDefault()
                                testimonialsDraggedRef.current = false
                            }
                        }}
                    >
                        <span className="hero-recommendations__art" aria-hidden="true">
                            <Image
                                src="/hero/layered-review-bubbles.png"
                                alt=""
                                fill
                                draggable={false}
                                sizes="(max-width: 640px) 108px, 142px"
                            />
                        </span>
                        <span className="hero-recommendations__label">
                            View Testimonials
                        </span>
                    </Link>
                </DeskObject>

            </div>

        </section>
    )
}
