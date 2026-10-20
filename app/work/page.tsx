import type { Metadata } from "next"
import Link from "next/link"
import DesktopProjectRail from "../../components/DesktopProjectRail"
import InteractiveWorkHero from "../../components/InteractiveWorkHero"
import ProjectCardMedia from "../../components/ProjectCardMedia"
import SiteFooter from "../../components/SiteFooter"
import TestimonialsCarousel from "../../components/TestimonialsCarousel"
import { PROJECTS } from "./projects"

export const metadata: Metadata = {
    title: "Work",
}

export default function WorkPage() {
    const projects = (
        <>
            <section
                id="selected-work"
                className="section section--page selected-work"
                aria-labelledby="selected-work-title"
            >
                <div className="selected-work__sticky">
                    <h2
                        id="selected-work-title"
                        className="selected-work__title"
                    >
                        Selected work
                    </h2>
                    <DesktopProjectRail>
                        {PROJECTS.map((project) => (
                            <li key={project.slug}>
                                <Link
                                    className="project-card"
                                    href={`/work/${project.slug}`}
                                    aria-label={project.title}
                                >
                                    <ProjectCardMedia
                                        images={
                                            project.cardImages ??
                                            ([
                                                project.image,
                                                project.image,
                                                project.image,
                                                project.image,
                                            ] as const)
                                        }
                                        client={project.client ?? "Accolade"}
                                        title={project.title}
                                    />
                                    <p className="work-description">
                                        {project.description}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </DesktopProjectRail>
                </div>
            </section>
            <TestimonialsCarousel />
        </>
    )

    return (
        <main className="shell shell--work">
            <div className="work-page-stack">
                <div className="work-hero-shell">
                    <InteractiveWorkHero />
                </div>
                <div className="work-content-panel">
                    {projects}
                    <SiteFooter />
                </div>
            </div>
        </main>
    )
}
