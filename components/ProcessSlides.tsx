"use client"

import { useState, type KeyboardEvent } from "react"
import NextSlideArea from "./NextSlideArea"

const PROCESS_SLIDES = [
    {
        label: "Step 1",
        title: "Understand the system",
        description:
            "Mapped the key entities and responsibilities involved in customer onboarding.",
        outputTitle: "System map",
        outputDescription:
            "Helped me understand how information moved across modules and where users could get blocked.",
    },
    {
        label: "Step 2",
        title: "Identify dependencies",
        description:
            "Defined the conditions and relationships that affected onboarding progress.",
        outputTitle: "Dependency flow",
        outputDescription:
            "This helped me design the correct sequence of actions, disabled states, and system feedback.",
    },
    {
        label: "Step 3",
        title: "Structure the experience",
        description:
            "Separated global oversight from organization-level work and grouped tasks by operational responsibility.",
        outputTitle: "Information architecture",
        outputDescription:
            "I organized the portal around the responsibilities of internal teams instead of exposing technical architecture.",
    },
    {
        label: "Step 4",
        title: "Design complete workflows",
        description:
            "Designed the primary journeys and the states around them.",
        outputTitle: "End-to-end workflows & state coverage",
        outputDescription:
            "Since internal tools are often used when something is incomplete or incorrect, edge cases were treated as part of the main experience.",
    },
] as const

const SYSTEM_NODES = [
    { label: "Owners & Admins", className: "owners" },
    { label: "Communities", className: "communities" },
    { label: "Products", className: "products" },
    { label: "PMS Integrations", className: "pms" },
    { label: "Users", className: "users" },
] as const

const DEPENDENCY_STEPS = [
    "Valid PMS credentials",
    "Community sync completed",
    "Admin provisioned",
    "Organization ready for onboarding",
] as const

const WORKFLOW_STATES = [
    { label: "Empty", icon: "/icons/accolade-circle-dashed.svg" },
    { label: "Filled", icon: "/icons/accolade-list-checks.svg" },
    { label: "Editing", icon: "/icons/accolade-pencil-line.svg" },
    { label: "Success", icon: "/icons/accolade-circle-check.svg" },
    { label: "Failure", icon: "/icons/accolade-triangle-alert.svg" },
    { label: "View-only", icon: "/icons/accolade-eye.svg" },
] as const

function SystemMap() {
    return (
        <div
            className="process-system-map"
            role="img"
            aria-label="Organization connected to Owners and Admins, Communities, Users, Products, and PMS Integrations"
        >
            <svg
                className="process-system-map__connections"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d="M50 38 L50 8" />
                <path d="M70 43.5 L89.94 37.02" />
                <path d="M58.7 62 L74.69 83.98" />
                <path d="M41.3 62 L25.31 83.98" />
                <path d="M30 43.5 L10.06 37.02" />
            </svg>

            <strong className="process-system-map__organization">
                Organization
            </strong>

            {SYSTEM_NODES.map((node) => (
                <span
                    className={`process-system-map__node process-system-map__node--${node.className}`}
                    key={node.label}
                >
                    {node.label}
                </span>
            ))}
        </div>
    )
}

function DependencyFlow() {
    return (
        <ol
            className="process-dependency-flow"
            aria-label="Dependency flow from valid PMS credentials to an organization ready for onboarding"
        >
            {DEPENDENCY_STEPS.map((step, index) => (
                <li
                    className={
                        index === DEPENDENCY_STEPS.length - 1
                            ? "is-outcome"
                            : undefined
                    }
                    key={step}
                >
                    <span aria-hidden="true">{index + 1}</span>
                    <strong>{step}</strong>
                </li>
            ))}
        </ol>
    )
}

function InformationArchitectureImage() {
    return (
        <figure className="process-ia-image">
            <img
                src="/projects/process-step-3-information-architecture.png"
                width="1586"
                height="992"
                alt="A skeleton interface illustrating global navigation and organization-level operational modules"
            />
        </figure>
    )
}

function WorkflowStateCoverage() {
    return (
        <div
            className="workflow-state-coverage"
            role="img"
            aria-label="Six interface cards representing empty, filled, editing, success, failure, and view-only states"
        >
            {WORKFLOW_STATES.map((state) => (
                <div className="workflow-state-card" key={state.label}>
                    <span className="workflow-state-card__icon" aria-hidden="true">
                        <span
                            className="workflow-state-card__glyph"
                            style={{
                                WebkitMaskImage: `url("${state.icon}")`,
                                maskImage: `url("${state.icon}")`,
                            }}
                        />
                    </span>
                    <strong>{state.label}</strong>
                </div>
            ))}
        </div>
    )
}

export default function ProcessSlides() {
    const [activeIndex, setActiveIndex] = useState(0)

    const showPrevious = () => {
        setActiveIndex((current) => Math.max(0, current - 1))
    }

    const showNext = () => {
        setActiveIndex((current) =>
            (current + 1) % PROCESS_SLIDES.length,
        )
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault()
            showPrevious()
        }

        if (event.key === "ArrowRight") {
            event.preventDefault()
            showNext()
        }
    }

    return (
        <section
            className="process-slides"
            aria-label="Process presentation"
            aria-roledescription="carousel"
            data-interactive
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <NextSlideArea
                className="process-slides__viewport"
                onPrevious={showPrevious}
                onNext={showNext}
            >
                <div
                    className="process-slides__track"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    {PROCESS_SLIDES.map((slide, index) => (
                        <article
                            className={`process-slides__frame process-slides__frame--${
                                index + 1
                            }`}
                            aria-hidden={activeIndex !== index}
                            key={slide.title}
                        >
                            {index === 0 ? (
                                <SystemMap />
                            ) : index === 1 ? (
                                <DependencyFlow />
                            ) : index === 2 ? (
                                <InformationArchitectureImage />
                            ) : (
                                <WorkflowStateCoverage />
                            )}

                            <div className="process-slides__copy">
                                <span>{slide.label}</span>
                                <h3>{slide.title}</h3>
                                <p>{slide.description}</p>
                                {"outputTitle" in slide && (
                                    <div className="process-slides__output">
                                        <strong>
                                            <span>Output:</span>{" "}
                                            {slide.outputTitle}
                                        </strong>
                                        <p>{slide.outputDescription}</p>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </NextSlideArea>

            <div className="process-slides__controls">
                <div
                    className="process-slides__pagination"
                    aria-label="Choose a process frame"
                >
                    {PROCESS_SLIDES.map((slide, index) => (
                        <button
                            className={
                                activeIndex === index ? "is-active" : undefined
                            }
                            type="button"
                            aria-label={`Show frame ${index + 1}: ${slide.title}`}
                            aria-pressed={activeIndex === index}
                            onClick={() => setActiveIndex(index)}
                            key={slide.title}
                        >
                            <span className="process-slides__thumbnail">
                                <img
                                    className="process-slides__thumbnail-image"
                                    src={`/projects/process-frame-${
                                        index + 1
                                    }-thumbnail.jpg?v=3`}
                                    alt=""
                                />
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}
