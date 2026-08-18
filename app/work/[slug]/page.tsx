import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import CaseStudyNav from "@/components/CaseStudyNav"
import FinalProductSlides from "@/components/FinalProductSlides"
import OnboardingFlow from "@/components/OnboardingFlow"
import ProcessBoard from "@/components/ProcessBoard"
import ProcessSlides from "@/components/ProcessSlides"
import ProjectBackButton from "@/components/ProjectBackButton"
import ProjectHeroVideos from "@/components/ProjectHeroVideos"
import { PROJECTS, getProject, getAdjacent } from "../projects"

const CASE_STUDY_SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "challenge", label: "Challenge" },
    { id: "strategy", label: "Process" },
    { id: "impact", label: "Decisions" },
    { id: "final-product", label: "Final Product" },
    { id: "reflections", label: "Reflections" },
] as const

const PROJECT_ONE_CASE_STUDY_SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "overview-impact", label: "Impact" },
    { id: "challenge", label: "Challenge" },
    { id: "strategy", label: "Process" },
    { id: "impact", label: "Decisions" },
    { id: "final-product", label: "Final Product" },
    { id: "reflections", label: "Reflections" },
] as const

const PROJECT_FOUR_CASE_STUDY_SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "challenge", label: "Challenge" },
    { id: "strategy", label: "Solution" },
    { id: "reflections", label: "Reflections" },
] as const

const PROJECT_THREE_CASE_STUDY_SECTIONS = [
    { id: "objective", label: "Objective" },
    { id: "my-role", label: "My Role" },
    { id: "final-product", label: "Final Product" },
] as const

const PROJECT_ONE_FINAL_PRODUCT_IMAGES = [
    "/projects/project-1-final-product-01.webp",
    "/projects/project-1-final-product-02.webp",
    "/projects/project-1-final-product-03.webp",
    "/projects/project-1-final-product-04.webp",
    "/projects/project-1-final-product-05.webp",
    "/projects/project-1-final-product-06.webp",
    "/projects/project-1-final-product-10.webp",
    "/projects/project-1-final-product-11.webp",
] as const

const PROJECT_ONE_FINAL_PRODUCT_CONTENT = [
    {
        descriptionLead: "A single view of every organization",
        description:
            "The landing page gives super admins a quick view of all organizations, their PMS setup, onboarding status, and assigned owners.",
    },
    {
        descriptionLead: "Start with only what is needed",
        description:
            "The creation flow captures essential organization details first, while communities, products, integrations, and other setup happen later.",
    },
    {
        descriptionLead: "Keep organization details in one place",
        description:
            "The profile brings together key information, onboarding owners, admins, and documents within the organization workspace.",
    },
    {
        descriptionLead: "See communities and product access together",
        description:
            "The page shows each community, its PMS connection, system IDs, and provisioned products in one view.",
    },
    {
        descriptionLead: "Add multiple communities at once",
        description:
            "The flow supports bulk community setup while clearly showing which details become fixed after they are added.",
    },
    {
        descriptionLead: "Track each community’s readiness",
        description:
            "The community view combines product provisioning with an operational checklist, making completed and pending setup easier to track.",
    },
    {
        descriptionLead: "Manage integrations without losing context",
        description:
            "Credentials, community mappings, validation status, and workflows are grouped within the same integration for easier setup and review.",
    },
    {
        descriptionLead: "Configure workflows and monitor every sync",
        description:
            "Each workflow includes its schedule, blackout window, and sync history so configuration and system status stay connected.",
    },
] as const

const PROJECT_TWO_FINAL_PRODUCT_CONTENT = [
    {
        descriptionLead: "See every call in one place",
        description:
            "The Call Log gives agents and supervisors a quick view of who called, what happened, who handled it, and which community it belonged to, with search and filters to find the right conversation quickly.",
    },
    {
        descriptionLead: "Make past conversations easier to understand",
        description:
            "The transcript turns the completed call into a searchable conversation record, giving agents and supervisors more context than call history alone.",
    },
    {
        descriptionLead: "Start calls from the work already in progress",
        description:
            "Agents can place an outbound call from the relevant record and begin with the same context they were already working with.",
    },
    {
        descriptionLead: "Know who is calling before answering",
        description:
            "The incoming call shows the caller and community upfront, giving agents useful context before they start the conversation.",
    },
    {
        descriptionLead: "Bring the conversation and the work together",
        description:
            "The call workspace keeps caller details, notes, and relevant property information in one place so agents can work without jumping between tools.",
    },
    {
        descriptionLead: "Turn a maintenance conversation into action",
        description:
            "Agents can create a work order while speaking with the resident so the issue is recorded when the details are still clear.",
    },
    {
        descriptionLead: "Keep the next step inside the same workflow",
        description:
            "While creating a work order, agents can assign and schedule the work without leaving the conversation to finish it somewhere else.",
    },
    {
        descriptionLead: "Hand off the conversation with context",
        description:
            "Agents can bring another team member into the call before leaving, helping the next agent understand the situation without making the caller start over.",
    },
    {
        descriptionLead: "Capture follow-up before it is forgotten",
        description:
            "Agents can add a reminder while handling the conversation so important next steps do not depend on memory after the call ends.",
    },
    {
        descriptionLead: "Keep previous conversations within reach",
        description:
            "Agents can review recent communication while speaking with the caller, helping them understand what has already happened before taking the next step.",
    },
    {
        descriptionLead: "Finish the call without starting the record again",
        description:
            "Wrap-up carries forward information from the conversation so agents can review what was captured, complete what is missing, and return to the queue.",
    },
] as const

const PROJECT_TWO_FINAL_PRODUCT_IMAGES = [
    "",
    "/projects/project-2-final-product-02.webp",
    "/projects/project-2-final-product-03.webp",
    "/projects/project-2-final-product-04.webp",
    "/projects/project-2-final-product-05.webp",
    "/projects/project-2-final-product-06.webp",
    "/projects/project-2-final-product-07.webp",
    "/projects/project-2-final-product-08.webp",
    "/projects/project-2-final-product-09.webp",
    "/projects/project-2-final-product-10.webp",
    "/projects/project-2-final-product-11.webp",
] as const

const DESIGN_DECISIONS = [
    {
        title: "Start simple, add details later",
        details: [
            "Ask for only the basic organization details first",
            "Create the organization before technical setup",
            "Add admins, communities, products, and integrations later",
        ],
    },
    {
        title: "Group work by task",
        details: [
            "Use one page to view all organizations",
            "Use Profile, Communities & Products, Integrations, and Users",
            "Use clear task names instead of technical terms",
        ],
    },
    {
        title: "Show technical details step by step",
        details: [
            "Show fields based on the selected PMS",
            "Show only the community IDs linked to that PMS",
            "Show workflows and sync history after setup is complete",
        ],
    },
] as const

const CALL_CENTER_DESIGN_DECISIONS = [
    {
        title: "Keep the call familiar",
        details: [
            "Keep core call controls in the same place",
            "Keep notes available throughout the conversation",
            "Change the workspace based on caller context",
        ],
    },
    {
        title: "Adapt the workspace to the caller",
        details: [
            "Identify whether the caller is a Resident, Prospect, or Unknown Caller",
            "Show the information relevant to that caller",
            "Keep the core call controls consistent across every call",
        ],
    },
    {
        title: "Transfer the context too",
        details: [
            "Brief the next agent before leaving",
            "Carry caller context into the handoff",
            "Keep transfer history for later review",
        ],
    },
    {
        title: "Capture work as it happens",
        details: [
            "Save notes during the conversation",
            "Link work created during the call",
            "Use wrap-up to complete, not recreate",
        ],
    },
    {
        title: "Connect the call to its record",
        details: [
            "Carry caller and call details into the Call Log",
            "Add recordings and transcripts after the call",
            "Keep the full conversation understandable later",
        ],
    },
    {
        title: "Find first, understand second",
        details: [
            "Keep the Call Log easy to scan",
            "Put deeper information inside Call Detail",
            "Give supervisors more context when reviewing calls",
        ],
    },
] as const

const ONBOARDING_CHALLENGES = [
    {
        title: "Too many steps to manage",
        details: [
            "Organization details, contracts, and admins",
            "Communities, products, and user access",
            "PMS credentials, workflows, and schedules",
        ],
    },
    {
        title: "Hard to see what was still pending",
        details: [
            "One missing step could block onboarding",
            "Teams needed to know what was complete",
            "Go-live required both a successful community sync and an admin setup",
        ],
    },
    {
        title: "Technical setup had many dependencies",
        details: [
            "Each PMS required different credentials",
            "Community IDs had to match the selected PMS",
            "Workflows depended on valid credentials and mappings",
        ],
    },
] as const

const PROJECT_REFLECTIONS = [
    {
        icon: "ownership",
        title: "Ownership goes beyond making screens",
        body: "Owning the product end to end early in my career taught me to take responsibility for the full experience. I had to understand the requirements, make decisions, manage changing needs, and carry the work through to detailed final flows.",
    },
    {
        icon: "systems",
        title: "Think in systems, not single pages",
        body: "The portal had many connected parts. I learned to map these relationships first, then design each screen as part of one larger journey.",
    },
    {
        icon: "edge-cases",
        title: "Edge cases are part of the product",
        body: "Empty, failed, restricted, and destructive states were not secondary details. Designing them helped make the experience more complete and ready for real use.",
    },
    {
        icon: "decisions",
        title: "Clear decisions build confidence",
        body: "Working closely with product and engineering taught me to explain my choices, accept feedback, and make decisions even when every detail was not fully defined.",
    },
] as const

const CALL_CENTER_REFLECTIONS = [
    {
        icon: "uncertainty",
        title: "Design for uncertainty",
        body: "Real-time calls do not wait for every piece of information to be ready. Caller lookup could be delayed, return multiple matches, or fail completely. This project taught me to treat incomplete information as a normal product state and design a useful experience around it.",
    },
    {
        icon: "continuity",
        title: "Continuity is part of the experience",
        body: "A conversation could move between screens, agents, wrap-up, and the Call Log. I learned that preserving context across these transitions was just as important as designing each individual screen. The experience felt reliable when agents did not have to rebuild what the system already knew.",
    },
    {
        icon: "record",
        title: "Build the record as the call happens",
        body: "I chose to capture information during the conversation instead of asking agents to recreate it afterward. Notes, caller context, related work, and transfer activity carried into wrap-up and the Call Log. This taught me that post-call review should be designed as a continuation of the live experience.",
    },
    {
        icon: "engineering",
        title: "Work through the details with engineering",
        body: "Some call behaviours looked simple in the design, but needed clear rules behind them. Working closely with engineering helped me catch gaps early, understand what could go wrong, and make the final experience more reliable.",
    },
] as const

const PROJECT_FOUR_REFLECTIONS = [
    {
        icon: "decisions",
        title: "Eight weeks meant learning while designing",
        body: "Eight weeks was a short time to understand a new and highly technical industry, then start designing the product from scratch. I had to learn quickly, ask the right questions, and make decisions without always having the full picture. There were plenty of trade-offs along the way between exploring more, moving faster, and getting the details right. It taught me how to work with uncertainty, prioritise what mattered most, and keep moving without losing sight of the larger workflow.",
    },
    {
        icon: "systems",
        title: "Hierarchy matters more than simplification",
        body: "Scientific workflows naturally contain a lot of information. I learned that the goal was not to remove that complexity, but to organise it well. Route options, process conditions, risks, and results all needed to stay visible while still making it clear what a scientist should look at first.",
    },
    {
        icon: "edge-cases",
        title: "Risks need context",
        body: "A risk by itself does not tell a scientist much. It becomes useful when it is shown alongside the route, condition, or result that caused it. This project taught me to place warnings close to the decision they affect instead of treating them as separate alerts competing for attention.",
    },
    {
        icon: "ownership",
        title: "Design from the science, not the dashboard",
        body: "It was easy to fall back on familiar dashboard patterns when working with dense data. I learned that the structure had to come from the process development workflow itself how routes are compared, how conditions are tested, and how results are reviewed. Understanding that flow helped me make better interface decisions.",
    },
] as const

const CALL_CENTER_PROCESS_IMAGES = [
    {
        src: "/projects/project-2-process-frame-1.webp",
        label: "Process frame 01",
        width: 2000,
        height: 2554,
    },
    {
        src: "/projects/project-2-process-frame-2.webp",
        label: "Process frame 02",
        width: 2000,
        height: 1355,
    },
    {
        src: "/projects/project-2-process-frame-3.webp",
        label: "Process frame 03",
        width: 1680,
        height: 1357,
    },
    {
        src: "/projects/project-2-process-frame-4.webp",
        label: "Process frame 04",
        width: 2000,
        height: 3257,
    },
    {
        src: "/projects/project-2-process-frame-5.webp",
        label: "Process frame 05",
        width: 2639,
        height: 1421,
    },
    {
        src: "/projects/project-2-process-frame-6.webp",
        label: "Process frame 06",
        width: 2527,
        height: 1968,
    },
] as const

const CALL_CENTER_PRE_DESIGN_JOURNEY = [
    "Call rings",
    "Agent answers",
    "Searches separately",
    "Opens relevant record",
    "Transfers",
    "Caller repeats",
    "Notes entered later",
    "Supervisor searches fragmented records",
] as const

type ReflectionIconName =
    | (typeof PROJECT_REFLECTIONS)[number]["icon"]
    | (typeof CALL_CENTER_REFLECTIONS)[number]["icon"]

const ACCOLADE_REFLECTION_ICONS = {
    uncertainty: "/icons/accolade-circle-help.svg",
    continuity: "/icons/accolade-workflow.svg",
    record: "/icons/accolade-file-check-2.svg",
    engineering: "/icons/accolade-wrench.svg",
} as const

function ReflectionIcon({ name }: { name: ReflectionIconName }) {
    const accoladeIcon =
        ACCOLADE_REFLECTION_ICONS[
            name as keyof typeof ACCOLADE_REFLECTION_ICONS
        ]

    if (accoladeIcon) {
        return <img src={accoladeIcon} alt="" aria-hidden="true" />
    }

    const commonProps = {
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.5,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true,
    }

    if (name === "ownership") {
        return (
            <svg {...commonProps}>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        )
    }

    if (name === "systems") {
        return (
            <svg {...commonProps}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
        )
    }

    if (name === "edge-cases") {
        return (
            <svg {...commonProps}>
                <path d="M12 8.00049V12.0005M12 16.0005H12.01M20 13.0004C20 18.0004 16.5 20.5005 12.34 21.9505C12.1222 22.0243 11.8855 22.0207 11.67 21.9405C7.5 20.5005 4 18.0004 4 13.0004V6.00045C4 5.73523 4.10536 5.48088 4.29289 5.29334C4.48043 5.10581 4.73478 5.00045 5 5.00045C7 5.00045 9.5 3.80045 11.24 2.28045C11.4519 2.09945 11.7214 2 12 2C12.2786 2 12.5481 2.09945 12.76 2.28045C14.51 3.81045 17 5.00045 19 5.00045C19.2652 5.00045 19.5196 5.10581 19.7071 5.29334C19.8946 5.48088 20 5.73523 20 6.00045V13.0004Z" />
            </svg>
        )
    }

    return (
        <svg {...commonProps}>
            <path d="M18 6 7 17 2 12M22 10l-7.5 7.5L13 16" />
        </svg>
    )
}

function ChallengeCardIcon({
    name,
}: {
    name: "context" | "workflows" | "transfer" | "review"
}) {
    const commonProps = {
        width: 26,
        height: 26,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.6,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        "aria-hidden": true,
    }

    if (name === "context") {
        return (
            <svg {...commonProps}>
                <circle cx="8" cy="8" r="3" />
                <path d="M3.5 19c.6-3 2.2-4.5 4.5-4.5s3.9 1.5 4.5 4.5" />
                <path d="M15 7h6M15 11h4M15 15h5" />
            </svg>
        )
    }

    if (name === "workflows") {
        return (
            <svg {...commonProps}>
                <rect x="3" y="7" width="7" height="10" rx="1.5" />
                <rect x="14" y="7" width="7" height="10" rx="1.5" />
            </svg>
        )
    }

    if (name === "transfer") {
        return (
            <svg {...commonProps}>
                <path d="M4 7h13M14 4l3 3-3 3" />
                <path d="M20 17H7M10 14l-3 3 3 3" />
            </svg>
        )
    }

    return (
        <svg {...commonProps}>
            <path d="M5 3h11a2 2 0 0 1 2 2v6" />
            <path d="M5 3v18h8M8 8h7M8 12h5" />
            <circle cx="17" cy="17" r="4" />
            <path d="m20 20 2 2" />
        </svg>
    )
}

// Prerender a detail page for every project at build time.
export function generateStaticParams() {
    return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const project = getProject(slug)
    return { title: project?.title ?? "Project" }
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const project = getProject(slug)
    if (!project) notFound()
    if (slug !== project.slug) redirect(`/work/${project.slug}`)

    const { next } = getAdjacent(slug)

    return (
        <main className="shell project-detail">
            <aside className="project-detail__rail">
                <ProjectBackButton />

                <div className="project-detail__rail-heading">
                    <h2 className="project-detail__rail-title">
                        {project.title}
                    </h2>
                </div>

                    <CaseStudyNav
                        sections={
                            project.index === 1
                                ? PROJECT_ONE_CASE_STUDY_SECTIONS
                                : project.index === 3
                                  ? PROJECT_THREE_CASE_STUDY_SECTIONS
                                : project.index === 4
                                  ? PROJECT_FOUR_CASE_STUDY_SECTIONS
                                : CASE_STUDY_SECTIONS
                        }
                    />

                {next && (
                    <Link
                        className="project-detail__rail-next"
                        href={`/work/${next.slug}`}
                    >
                        <span>Next case study</span>
                        <strong>{next.title}</strong>
                        <span aria-hidden="true">→</span>
                    </Link>
                )}
            </aside>

            <article className="project-detail__content">
                <header className="project-detail__header">
                    <div className="project-detail__heading">
                        <h1 className="project-detail__title selectable">
                            {project.title}
                        </h1>
                        {project.badges && (
                            <ul
                                className="project-detail__badges"
                                aria-label="Project attributes"
                            >
                                {project.badges.map((badge) => (
                                    <li
                                        className={
                                            badge.label === "B2B SaaS"
                                                ? "project-detail__badge--preserve-case"
                                                : undefined
                                        }
                                        key={badge.label}
                                    >
                                        {badge.status && (
                                            <span
                                                className={`project-detail__badge-status project-detail__badge-status--${badge.status}`}
                                                aria-hidden="true"
                                            />
                                        )}
                                        {badge.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <p className="project-detail__lede selectable">
                        {project.description}
                    </p>
                </header>

                {project.heroVideos ? (
                    <ProjectHeroVideos
                        title={project.title}
                        videos={project.heroVideos}
                    />
                ) : (
                    <figure
                        className={`project-detail__hero${
                            project.heroVideo
                                ? " project-detail__hero--video"
                                : ""
                        }`}
                    >
                        {project.heroVideo ? (
                            <video
                                src={project.heroVideo}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-label={`${project.title} interface demonstration`}
                            />
                        ) : (
                            <img src={project.heroImage ?? project.image} alt="" />
                        )}
                    </figure>
                )}

                {project.index !== 3 && (
                    <dl
                        className="project-detail__summary"
                        aria-label="Project summary"
                    >
                    <div>
                        <dt>Client</dt>
                        <dd>{project.client ?? "[ client ]"}</dd>
                    </div>
                    <div>
                        <dt>Team</dt>
                        <dd
                            className={
                                project.team
                                    ? "project-detail__summary-team"
                                    : undefined
                            }
                        >
                            {project.team
                                ? project.team.map((member) => (
                                      <span key={member}>{member}</span>
                                  ))
                                : "[ team ]"}
                        </dd>
                    </div>
                    <div>
                        <dt>Timeline</dt>
                        <dd>{project.timeline ?? "[ timeline ]"}</dd>
                    </div>
                    <div>
                        <dt>Scope</dt>
                        <dd>{project.scope ?? "[ scope ]"}</dd>
                    </div>
                    </dl>
                )}

                <div className="case-study-sections">
                {project.index === 3 ? (
                    <>
                        <section
                            id="objective"
                            className="case-study-section"
                            aria-labelledby="objective-title"
                        >
                            <div className="case-study-section__head">
                                <h2 id="objective-title">Objective</h2>
                            </div>
                            <div className="case-study-section__copy prose selectable">
                                <p>
                                    While working on Accolade’s core products,
                                    new component needs often surfaced through
                                    real product use cases. Whenever an existing
                                    pattern wasn’t sufficient, I contributed by
                                    designing or extending reusable components
                                    that could support both the immediate
                                    requirement and future use across the
                                    product.
                                </p>
                            </div>
                        </section>

                        <section
                            id="my-role"
                            className="case-study-section"
                            aria-labelledby="my-role-title"
                        >
                            <div className="case-study-section__head">
                                <h2 id="my-role-title">My Role</h2>
                            </div>
                            <div className="case-study-section__copy prose selectable">
                                <p>
                                    As a Product Designer, I contributed to
                                    Accolade’s design system alongside my work
                                    on the core product experience. When new UI
                                    or interaction needs emerged, I helped
                                    design, adapt, and extend reusable
                                    components, often building on shadcn
                                    patterns to make them suitable for
                                    Accolade’s product and future use cases.
                                </p>
                                <p>
                                    My contributions included patterns such as
                                    empty states, contextual sidebars, alert
                                    dialogs, and toast notifications.
                                </p>
                            </div>
                        </section>

                        <section
                            id="final-product"
                            className="case-study-section"
                            aria-labelledby="final-product-title"
                        >
                            <div className="case-study-section__head">
                                <h2 id="final-product-title">Final Product</h2>
                            </div>
                            <figure className="project-three-final-product">
                                <img
                                    src="/projects/accolade-design-system.webp"
                                    alt="Accolade design system components, including empty states, contextual sidebars, alert dialogs, and toast notifications"
                                />
                            </figure>
                        </section>
                    </>
                ) : (
                    <>
                <section
                    id="overview"
                    className="case-study-section"
                    aria-labelledby="overview-title"
                >
                    <div className="case-study-section__head case-study-section__head--with-label">
                        <span className="case-study-section__metadata-label">
                            Overview
                        </span>
                        <h2 id="overview-title">
                            {project.overview?.title ?? "Overview"}
                        </h2>
                    </div>

                    <div className="project-detail__overview prose selectable">
                        {project.overview?.paragraphs ? (
                            project.overview.paragraphs.map(
                                (paragraph, index) => (
                                    <p key={index}>
                                        {paragraph.before}
                                        {paragraph.strong && (
                                            <strong>{paragraph.strong}</strong>
                                        )}
                                        {paragraph.after}
                                    </p>
                                ),
                            )
                        ) : project.overview ? (
                            <>
                                <p>
                                    {project.overview.introduction}{" "}
                                    <strong>{project.overview.emphasis}</strong>{" "}
                                    {project.overview.details}
                                </p>
                                <p>{project.overview.solution}</p>
                            </>
                        ) : (
                            <>
                                <p>
                                    [ Overview placeholder — summarize the
                                    project, the problem it addressed, and the
                                    outcome you wanted to create. ]
                                </p>
                                <p>
                                    [ Add the context a reader needs before
                                    moving into the deeper case-study sections. ]
                                </p>
                            </>
                        )}
                    </div>

                    {project.overview?.cards && (
                        <div className="overview-area-cards selectable">
                            {project.overview.cards.map((card) => (
                                <article
                                    className="overview-area-card"
                                    key={card.title}
                                >
                                    <h3>{card.title}</h3>
                                    <p>{card.body}</p>
                                </article>
                            ))}
                        </div>
                    )}

                    {project.index === 1 && (
                        <>
                            <h3 className="challenge-visualization__title selectable">
                                Onboarding flow
                            </h3>
                            <OnboardingFlow />
                        </>
                    )}

                </section>

                {project.index === 1 && (
                    <section
                        id="overview-impact"
                        className="case-study-section"
                        aria-labelledby="overview-impact-title"
                    >
                        <div className="case-study-section__head case-study-section__head--with-label">
            <span className="case-study-section__metadata-label">
                Impact
            </span>
            <h2 id="overview-impact-title">How success was defined</h2>
        </div>
                                <div className="case-study-section__copy prose selectable">
                                    <p>
                                        Success was defined around onboarding speed, independence
                                        from engineering, operational effort, and task completion.
                                    </p>
                                </div>
        <div className="success-metrics selectable">
            <article className="success-metric-card">
                <p className="success-metric-card__value">≤ 48 hours</p>
                <h3>Time to Onboarded (Median)</h3>
                <p className="success-metric-card__description">
                    Elapsed time from Org creation to Onboarding Status flipping
                    to &quot;Onboarded&quot; (first successful sync + Org Admin
                    provisioned).
                </p>
                                    </article>
                                    <article className="success-metric-card">
                                        <p className="success-metric-card__value">100%</p>
                                        <h3>Routine onboarding without engineering</h3>
                <p className="success-metric-card__description">
                    Percentage of standard organization onboarding flows
                    completed without engineering support.
                </p>
            </article>
            <article className="success-metric-card">
                <p className="success-metric-card__value">≤ 4 sessions</p>
                <h3>Sessions to Onboard</h3>
                <p className="success-metric-card__description">
                    Average number of distinct portal sessions required to take
                    a single Org from creation to &quot;Onboarded.&quot;
                </p>
            </article>
            <article className="success-metric-card">
                <p className="success-metric-card__value">≥ 90%</p>
                <h3>Task Completion Rate</h3>
                <p className="success-metric-card__description">
                    % of portal sessions where the user completes their intended
                    action (Org creation, property addition, integration setup)
                    without abandoning.
                </p>
            </article>
        </div>
    </section>
)}

                <section
                    id="challenge"
                    className="case-study-section"
                    aria-labelledby="challenge-title"
                >
                    <div className="case-study-section__head case-study-section__head--with-label">
                        <span className="case-study-section__metadata-label">
                            Challenge
                        </span>
                        <h2 id="challenge-title">
                            {project.challenge?.title ?? "Challenge"}
                        </h2>
                    </div>
                    <div className="case-study-section__copy prose selectable">
                        {project.challenge ? (
                            project.challenge.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))
                        ) : (
                            <>
                                <p>
                                    [ Challenge placeholder — describe the
                                    user, business, or technical problems that
                                    made the existing experience difficult. ]
                                </p>
                                <p>
                                    [ Add research signals, constraints, and
                                    the key tension the project needed to
                                    resolve. ]
                                </p>
                            </>
                        )}
                    </div>

                    {project.challenge?.cards && (
                        <div className="challenge-title-cards selectable">
                            {project.challenge.cards.map((card) => (
                                <article
                                    className={`challenge-title-card${
                                        card.details ? " has-details" : ""
                                    }`}
                                    key={card.title}
                                    tabIndex={card.details ? 0 : undefined}
                                    aria-label={card.title}
                                >
                                    {card.details ? (
                                        <div className="challenge-title-card__inner">
                                            <div
                                                className="challenge-title-card__face challenge-title-card__face--front"
                                                aria-hidden="true"
                                            >
                                                {card.icon && (
                                                    <span className="challenge-title-card__icon">
                                                        <ChallengeCardIcon
                                                            name={card.icon}
                                                        />
                                                    </span>
                                                )}
                                                <h3>{card.title}</h3>
                                            </div>
                                            <div className="challenge-title-card__face challenge-title-card__face--back">
                                                {card.intro && (
                                                    <p>{card.intro}</p>
                                                )}
                                                <ul>
                                                    {card.details.map(
                                                        (detail) => (
                                                            <li key={detail}>
                                                                {detail}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                                {card.outro && (
                                                    <p>{card.outro}</p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {card.icon && (
                                                <span className="challenge-title-card__icon">
                                                    <ChallengeCardIcon
                                                        name={card.icon}
                                                    />
                                                </span>
                                            )}
                                            <h3>{card.title}</h3>
                                        </>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}

                    {project.index === 2 && (
                        <div className="call-center-journey selectable">
                            <h3>Journey before the designs existed</h3>
                            <div className="call-center-journey__viewport">
                                <ol className="call-center-journey__steps">
                                    {CALL_CENTER_PRE_DESIGN_JOURNEY.map(
                                        (step, index) => (
                                            <li key={step}>
                                                <span className="call-center-journey__number">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>
                                                <span className="call-center-journey__label">
                                                    {step}
                                                </span>
                                            </li>
                                        ),
                                    )}
                                </ol>
                            </div>
                        </div>
                    )}

                    {project.index === 1 && (
                        <>
                            <div className="challenge-breakdown selectable">
                                <div className="challenge-breakdown__intro">
                                    <h3>What made onboarding hard</h3>
                                    <p>
                                        A customer could not go live until
                                        several connected setup steps were
                                        completed correctly.
                                    </p>
                                </div>

                                <div className="challenge-breakdown__cards">
                                    {ONBOARDING_CHALLENGES.map((challenge) => (
                                        <article
                                            className="challenge-breakdown__card"
                                            key={challenge.title}
                                        >
                                            <h4>{challenge.title}</h4>
                                            <ul>
                                                {challenge.details.map(
                                                    (detail) => (
                                                        <li key={detail}>
                                                            {detail}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </article>
                                    ))}
                                </div>
                            </div>

                        </>
                    )}
                </section>

                <section
                    id="strategy"
                    className="case-study-section"
                    aria-labelledby="strategy-title"
                >
                    <div className="case-study-section__head case-study-section__head--with-label">
                        <span className="case-study-section__metadata-label">
                            {project.index === 4 ? "Solution" : "Process"}
                        </span>
                        <h2 id="strategy-title">
                            {project.strategy?.title ??
                                (project.index === 4 ? "Solution" : "Strategy")}
                        </h2>
                    </div>
                    <div className="case-study-section__copy prose selectable">
                        {project.strategy ? (
                            project.strategy.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))
                        ) : (
                            <>
                                <p>
                                    [ Strategy placeholder — explain the
                                    principles, priorities, and design
                                    decisions that shaped your approach. ]
                                </p>
                                <p>
                                    [ Add the alternatives you considered and
                                    why this direction best addressed the
                                    identified challenge. ]
                                </p>
                            </>
                        )}
                    </div>

                    {project.index === 1 ? (
                        <ProcessSlides />
                    ) : project.index === 2 ? (
                        <ProcessBoard images={CALL_CENTER_PROCESS_IMAGES} />
                    ) : project.index === 4 ? (
                        null
                    ) : (
                        <div className="project-detail__gallery">
                            <figure className="project-detail__shot">
                                <img
                                    src={project.image}
                                    alt=""
                                    loading="lazy"
                                />
                            </figure>
                            <figure className="project-detail__shot">
                                <img
                                    src={project.image}
                                    alt=""
                                    loading="lazy"
                                />
                            </figure>
                        </div>
                    )}
                </section>

                {project.index !== 4 && (
                    <>
                <section
                    id="impact"
                    className="case-study-section"
                    aria-labelledby="impact-title"
                >
                    <div className="case-study-section__head case-study-section__head--with-label">
                        <span className="case-study-section__metadata-label">
                            Decisions
                        </span>
                        <h2 id="impact-title">Design Decisions</h2>
                    </div>
                    {project.index === 1 || project.index === 2 ? (
                        <div className="decision-cards selectable">
                            {(project.index === 2
                                ? CALL_CENTER_DESIGN_DECISIONS
                                : DESIGN_DECISIONS
                            ).map((decision, index) => (
                                <article
                                    className="decision-card"
                                    key={`${decision.title}-${index}`}
                                >
                                    <h3>{decision.title}</h3>
                                    <ul>
                                        {decision.details.map((detail) => (
                                            <li key={detail}>{detail}</li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="case-study-section__copy prose selectable">
                            <p>
                                [ Design decisions placeholder — explain the
                                choices that shaped the final experience. ]
                            </p>
                            <p>
                                [ Add the evidence and tradeoffs behind each
                                decision. ]
                            </p>
                        </div>
                    )}
                </section>

                <section
                    id="final-product"
                    className="case-study-section"
                    aria-labelledby="final-product-title"
                >
                    <div className="case-study-section__head case-study-section__head--with-label">
                        <span className="case-study-section__metadata-label">
                            Final Product
                        </span>
                        <h2 id="final-product-title">
                            From organization setup to go-live
                        </h2>
                    </div>
                    <div className="case-study-section__copy prose selectable">
                        <p>
                            The final portal gave Accolade’s internal team one
                            place to create organizations, complete setup,
                            manage integrations, and track the information
                            needed for go-live.
                        </p>
                        {project.index === 1 && (
                            <p>
                                A selection of key screens from the complete
                                portal, highlighting the core setup,
                                provisioning, and integration flows.
                            </p>
                        )}
                    </div>
                    {(project.index === 1 || project.index === 2) && (
                        <FinalProductSlides
                            slideCount={
                                project.index === 1 ? 8 : 11
                            }
                            slideImages={
                                project.index === 1
                                    ? PROJECT_ONE_FINAL_PRODUCT_IMAGES
                                    : PROJECT_TWO_FINAL_PRODUCT_IMAGES
                            }
                            slideVideos={
                                project.index === 2
                                    ? [
                                          "/projects/project-2-final-product-01.webm",
                                      ]
                                    : undefined
                            }
                            slideContent={
                                project.index === 1
                                    ? PROJECT_ONE_FINAL_PRODUCT_CONTENT
                                    : PROJECT_TWO_FINAL_PRODUCT_CONTENT
                            }
                        />
                    )}
                </section>

                    </>
                )}

                <section
                    id="reflections"
                    className="case-study-section"
                    aria-labelledby="reflections-title"
                >
                    <div className="case-study-section__head case-study-section__head--with-label">
                        <span className="case-study-section__metadata-label">
                            Reflections
                        </span>
                        <h2 id="reflections-title">Reflections</h2>
                    </div>
                    {project.index === 1 ||
                    project.index === 2 ||
                    project.index === 4 ? (
                        <div className="reflection-cards selectable">
                            {(project.index === 4
                                ? PROJECT_FOUR_REFLECTIONS
                                : project.index === 2
                                  ? CALL_CENTER_REFLECTIONS
                                  : PROJECT_REFLECTIONS
                            ).map((reflection) => (
                                <article
                                    className="reflection-card"
                                    key={reflection.title}
                                >
                                    <span className="reflection-card__icon">
                                        <ReflectionIcon name={reflection.icon} />
                                    </span>
                                    <h3>{reflection.title}</h3>
                                    <p>{reflection.body}</p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="case-study-section__copy prose selectable">
                            <p>
                                [ Reflections placeholder — share what you
                                learned, what you would change, and how the
                                project informed your future practice. ]
                            </p>
                            <p>
                                [ Add any open questions or next steps that
                                remained after delivery. ]
                            </p>
                        </div>
                    )}
                </section>

                {project.index === 4 && (
                    <aside
                        className="case-study-request-panel selectable"
                        aria-label="Full case study availability"
                    >
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="5" y="10" width="14" height="11" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                        <div className="case-study-request-panel__copy">
                            <h2>A note on confidentiality</h2>
                            <p>
                                This project was completed under a
                                non-disclosure agreement. To respect that
                                agreement, the work shown here has been
                                simplified and generalized. Confidential
                                product details, internal processes, research,
                                and original company information have been
                                intentionally excluded.
                            </p>
                        </div>
                    </aside>
                )}
                    </>
                )}
                </div>

            </article>
        </main>
    )
}
