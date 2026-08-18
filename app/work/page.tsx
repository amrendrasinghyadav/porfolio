import type { Metadata } from "next"
import Link from "next/link"
import HeroTypingText from "../../components/HeroTypingText"
import ProjectCardMedia from "../../components/ProjectCardMedia"
import ProjectsTransition from "../../components/ProjectsTransition"
import { PROJECTS } from "./projects"

export const metadata: Metadata = {
    title: "Work",
}

export default function WorkPage() {
    const hero = (
        <section className="work-hero" aria-labelledby="work-hero-title">
            <div className="work-hero__composition">
                <div
                    className="work-hero__annotation work-hero__annotation--left"
                    aria-hidden="true"
                >
                    <span>
                        Complex work,
                        <br />
                        made clearer.
                    </span>
                    <svg viewBox="0 0 74 48" role="presentation">
                        <path d="M4 38C15 7 43 6 61 27" />
                        <path d="M52 25L62 28L60 17" />
                    </svg>
                </div>

                <div className="work-hero__content selectable">
                    <h1
                        id="work-hero-title"
                        className="work-hero__title"
                        aria-label="Namaste, I'm Amrendra"
                    >
                        <span
                            className="work-hero__greeting"
                            aria-hidden="true"
                        >
                            Namaste,{" "}
                        </span>
                        <HeroTypingText text="I'm Amrendra" />
                    </h1>
                    <p className="work-hero__lede">
                        A high-agency Product Designer crafting B2B products
                        and taking ideas from messy problems to shipped
                        experiences. I’ve worked across early-stage startups
                        and freelance projects, designing products from the
                        ground up.
                    </p>
                </div>

                <div
                    className="work-hero__annotation work-hero__annotation--right"
                    aria-hidden="true"
                >
                    <svg viewBox="0 0 74 48" role="presentation">
                        <path d="M70 38C59 7 31 6 13 27" />
                        <path d="M22 25L12 28L14 17" />
                    </svg>
                    <span>
                        From messy questions
                        <br />
                        to usable products.
                    </span>
                </div>
            </div>

            <div
                className="work-hero__scroll"
                aria-hidden="true"
            >
                <span>Keep Scrolling</span>
                <span className="work-hero__scroll-mark" aria-hidden="true">
                    <span />
                </span>
            </div>
        </section>
    )

    const projects = (
        <section
            id="selected-work"
            className="section section--page"
            aria-label="Selected work"
        >
            <ul className="project-grid" role="list">
                {PROJECTS.map((project) => (
                    <li key={project.slug}>
                        <Link
                            className="project-card"
                            href={`/work/${project.slug}`}
                            aria-label={project.title}
                        >
                            <ProjectCardMedia
                                image={project.image}
                                hoverVideo={project.cardHoverVideo}
                                videoFit={project.cardHoverVideoFit}
                                replayDelayMs={project.cardHoverReplayDelay}
                            />
                            <div className="project-card__info">
                                <h2 className="project-card__title">
                                    {project.title}
                                </h2>
                                <p className="project-card__desc">
                                    {project.description}
                                </p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )

    return (
        <main className="shell shell--work">
            <ProjectsTransition projects={PROJECTS} hero={hero}>
                {projects}
            </ProjectsTransition>
        </main>
    )
}
