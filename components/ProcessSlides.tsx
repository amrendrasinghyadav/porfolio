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

const UNIT_TURNS_FIRST_SLIDE = {
    label: "",
    title: "Understanding the Workflow",
    description:
        "Breaking down the unit turnover process to understand how inspections, work orders, scheduling, and dependencies connect.",
} as const

const UNIT_TURNS_SECOND_SLIDE = {
    label: "",
    title: "Structuring the Experience",
    description:
        "Organizing the workflow into template creation, turn tracking, and task management.",
} as const

const UNIT_TURNS_THIRD_SLIDE = {
    label: "",
    title: "Exploring and Refining",
    description:
        "Working through layouts and interactions to make the experience clearer and easier to use.",
} as const

const UNIT_TURNS_FLOW = [
    { title: "Lease End", icon: "/icons/accolade-building-2.svg" },
    {
        title: "Move-out\nInspection",
        icon: "/icons/accolade-file-check-2.svg",
    },
    { title: "Work Orders", icon: "/icons/accolade-wrench.svg" },
    { title: "Final\nInspection", icon: "/icons/accolade-file-check-2.svg" },
    { title: "Unit Ready", icon: "/icons/accolade-circle-check.svg" },
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

function UnitTurnsWorkflowVisual() {
    return (
        <div className="unit-turns-workflow-slide">
            <div className="unit-turns-workflow-slide__intro">
                <h3>Understanding the Workflow</h3>
                <p>
                    Breaking down the unit turnover process to understand how
                    inspections, work orders, scheduling, and dependencies
                    connect.
                </p>
            </div>

            <div className="unit-turns-workflow-slide__flow">
                {UNIT_TURNS_FLOW.slice(0, 3).map((stage, index) => (
                    <div
                        className="unit-turns-workflow-slide__stage"
                        key={stage.title}
                    >
                        {index === 1 && (
                            <span className="unit-turns-workflow-slide__inspection-note">
                                <span>From inspection results</span>
                            </span>
                        )}
                        <img src={stage.icon} alt="" aria-hidden="true" />
                        <strong>
                            {stage.title.split("\n").map((line) => (
                                <span key={line}>{line}</span>
                            ))}
                        </strong>
                    </div>
                ))}

                <div className="unit-turns-workflow-slide__repairs">
                    <strong>Repairs &amp; Tasks</strong>
                    <ul>
                        <li>Painting</li>
                        <li>Cleaning</li>
                        <li>Flooring</li>
                    </ul>
                    <span>Some tasks can run in parallel</span>
                </div>

                {UNIT_TURNS_FLOW.slice(3).map((stage) => (
                    <div
                        className={[
                            "unit-turns-workflow-slide__stage",
                            stage.title === "Unit Ready" ? "is-ready" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        key={stage.title}
                    >
                        <img src={stage.icon} alt="" aria-hidden="true" />
                        <strong>
                            {stage.title.split("\n").map((line) => (
                                <span key={line}>{line}</span>
                            ))}
                        </strong>
                    </div>
                ))}
            </div>
        </div>
    )
}

function UnitTurnsStructureVisual() {
    const stages = [
        {
            title: "Turn Template",
            description: "Define a repeatable turn process",
            icon: "/icons/accolade-file-check-2.svg",
            accent: false,
        },
        {
            title: "Turn Tracking",
            description: "Monitor each unit’s progress",
            icon: "/icons/accolade-workflow.svg",
            accent: true,
        },
        {
            title: "Task Management",
            description: "Assign, schedule, and complete work",
            icon: "/icons/accolade-list-checks.svg",
            accent: false,
        },
    ] as const

    return (
        <div className="unit-turns-structure-slide">
            <div className="unit-turns-structure-slide__intro">
                <h3>Structuring the Experience</h3>
                <p>
                    Organizing the workflow into template creation, turn
                    tracking, and task management.
                </p>
            </div>

            <div className="unit-turns-structure-slide__flow">
                {stages.map((stage) => (
                    <div
                        className={[
                            "unit-turns-structure-slide__stage",
                            stage.accent ? "is-accent" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        key={stage.title}
                    >
                        <img src={stage.icon} alt="" aria-hidden="true" />
                        <strong>{stage.title}</strong>
                        <p>{stage.description}</p>
                    </div>
                ))}
            </div>

            <p className="unit-turns-structure-slide__caption">
                A connected workflow from setup to completion
            </p>
        </div>
    )
}

function UnitTurnsRefinementVisual() {
    const stages = [
        {
            title: "Layout Explorations",
            description: "Tested structure and hierarchy",
            visual: "layout",
            accent: false,
        },
        {
            title: "Interaction Patterns",
            description: "Refined actions and flows",
            visual: "interaction",
            accent: true,
        },
        {
            title: "Refined Experience",
            description: "Improved clarity and usability",
            visual: "refined",
            accent: false,
        },
    ] as const

    return (
        <div className="unit-turns-structure-slide unit-turns-refinement-slide">
            <div className="unit-turns-structure-slide__intro">
                <h3>Exploring and Refining</h3>
                <p>
                    Working through layouts and interactions to make the
                    experience clearer and easier to use.
                </p>
            </div>

            <div className="unit-turns-structure-slide__flow">
                {stages.map((stage) => (
                    <div
                        className={[
                            "unit-turns-structure-slide__stage",
                            stage.accent ? "is-accent" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        key={stage.title}
                    >
                        <span
                            className={`unit-turns-refinement-slide__mock is-${stage.visual}`}
                            aria-hidden="true"
                        >
                            <i />
                            <i />
                            <i />
                        </span>
                        <strong>{stage.title}</strong>
                        <p>{stage.description}</p>
                    </div>
                ))}
            </div>

            <p className="unit-turns-structure-slide__caption">
                Iterating from structure to clarity
            </p>
        </div>
    )
}

export default function ProcessSlides({
    variant = "onboarding",
}: {
    variant?: "onboarding" | "unit-turns"
}) {
    const slides =
        variant === "unit-turns"
            ? [
                  UNIT_TURNS_FIRST_SLIDE,
                  UNIT_TURNS_SECOND_SLIDE,
                  UNIT_TURNS_THIRD_SLIDE,
              ]
            : PROCESS_SLIDES
    const [activeIndex, setActiveIndex] = useState(0)

    const showPrevious = () => {
        setActiveIndex((current) => Math.max(0, current - 1))
    }

    const showNext = () => {
        setActiveIndex((current) =>
            (current + 1) % slides.length,
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
                    {slides.map((slide, index) => (
                        <article
                            className={[
                                "process-slides__frame",
                                "process-slides__frame--" + (index + 1),
                                variant === "unit-turns" && index < 3
                                    ? `process-slides__frame--unit-turns-${index + 1}`
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            aria-hidden={activeIndex !== index}
                            key={slide.title}
                        >
                            {variant === "unit-turns" && index === 0 ? (
                                <UnitTurnsWorkflowVisual />
                            ) : variant === "unit-turns" && index === 1 ? (
                                <UnitTurnsStructureVisual />
                            ) : variant === "unit-turns" && index === 2 ? (
                                <UnitTurnsRefinementVisual />
                            ) : index === 0 ? (
                                <SystemMap />
                            ) : index === 1 ? (
                                <DependencyFlow />
                            ) : index === 2 ? (
                                <InformationArchitectureImage />
                            ) : (
                                <WorkflowStateCoverage />
                            )}

                            {!(variant === "unit-turns" && index < 3) && (
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
                            )}
                        </article>
                    ))}
                </div>
            </NextSlideArea>

            <div className="process-slides__controls">
                <div
                    className="process-slides__pagination"
                    aria-label="Choose a process frame"
                >
                    {slides.map((slide, index) => (
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
