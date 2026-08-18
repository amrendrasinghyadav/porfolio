// Single source of truth for the project list, shared by the Work grid and the
// project detail pages so they never drift apart.
//
// These are portfolio-ready placeholders. Replace the copy and artwork with
// real case-study content later; every card, preview, and detail route reads
// from this shared source.

export type Project = {
    slug: string
    index: number
    title: string
    description: string
    image: string
    cardHoverVideo?: string
    cardHoverVideoFit?: "cover" | "contain"
    cardHoverReplayDelay?: number
    heroImage?: string
    heroVideo?: string
    heroVideos?: readonly string[]
    client?: string
    team?: string[]
    timeline?: string
    scope?: string
    badges?: Array<{
        label: string
        status?: "success" | "neutral"
    }>
    overview?: {
        title?: string
        introduction?: string
        emphasis?: string
        details?: string
        solution?: string
        paragraphs?: Array<{
            before?: string
            strong?: string
            after?: string
        }>
        cards?: Array<{
            title: string
            body: string
        }>
    }
    challenge?: {
        metadata?: string
        title: string
        paragraphs: string[]
        cards?: Array<{
            title: string
            intro?: string
            details?: string[]
            outro?: string
            icon?: "context" | "workflows" | "transfer" | "review"
        }>
    }
    strategy?: {
        metadata?: string
        title: string
        paragraphs: string[]
    }
}

export const PROJECTS: Project[] = [
    {
        slug: "untangling-b2b-customer-onboarding",
        index: 1,
        title: "Untangling B2B Customer Onboarding",
        description:
            "Turning a fragmented provisioning process into one structured operational workflow.",
        image: "/projects/project-1-thumbnail.webp",
        cardHoverVideo: "/projects/project-1-hover.webm",
        cardHoverReplayDelay: 1000,
        client: "Accolade",
        team: [
            "Product Designer (me)",
            "Product Manager",
            "2 Software Engineers",
        ],
        timeline: "10 weeks",
        scope: "Desktop Web",
        badges: [
            { label: "Shipped", status: "success" },
            { label: "B2B" },
            { label: "Customer Onboarding" },
        ],
        overview: {
            introduction:
                "Accolade’s internal team is responsible for taking new B2B customers from initial setup to a ready-to-use environment.",
            emphasis:
                "Several dependent activities had to come together before an organization was ready to go live.",
            details:
                "This included creating the organization, assigning onboarding owners, provisioning administrators, configuring communities and products, connecting Property Management Software (PMS) providers, and scheduling data workflows.",
            solution:
                "I created a centralized provisioning portal that brought these activities into one structured system. It gave internal teams visibility into onboarding progress, helped them manage technical configurations, and provided a clearer path from organization creation to go-live.",
        },
        challenge: {
            title: "One setup, many dependencies",
            paragraphs: [
                "Onboarding required Accolade’s team to manage organization details, admins, communities, products, PMS credentials, workflows, and user access.",
                "Each step affected the next. A customer could only move forward once key requirements, such as a successful community sync and admin provisioning, were completed.",
            ],
        },
        strategy: {
            title: "How I turned complexity into a system",
            paragraphs: [
                "I started by understanding the entities, dependencies, and business rules behind onboarding. I then structured them into clear workflows, designed the required states, and refined the experience with product and engineering.",
            ],
        },
    },
    {
        slug: "designing-an-e2e-call-center-experience",
        index: 2,
        title: "Designing an E2E Call Center Experience",
        description:
            "Connecting live calls with caller context, operational work, transfers, wrap-up, and post-call review.",
        image: "/projects/project-2-cover.webp",
        cardHoverVideo: "/projects/project-2-hover.webm",
        cardHoverVideoFit: "contain",
        heroImage: "/projects/project-2-cover.webp",
        client: "Accolade",
        team: ["Product (Me)", "1 Software Engineer"],
        timeline: "9 Weeks",
        scope: "Desktop Web",
        badges: [
            { label: "Under Development", status: "neutral" },
            { label: "B2B SaaS" },
            { label: "Real-time Communication" },
        ],
        overview: {
            title: "From ringing phone to reviewable record",
            paragraphs: [
                {
                    strong:
                        "Designing an in-browser call center that helped property teams answer with context, manage operational work during a conversation, transfer calls smoothly, and review every interaction afterward.",
                },
                {
                    before:
                        "Accolade’s leasing and maintenance teams use the platform to manage residents, prospects, guest cards, work orders, tours, and community operations. Phone conversations, however, were disconnected from these workflows. Agents often answered without knowing who was calling, moved between systems to find relevant information, and manually documented the interaction after the call.",
                },
                {
                    before: "I led the project as both ",
                    strong: "Product Manager and Product Designer",
                    after:
                        ", owning the work from product definition through design execution. I translated operational problems into product requirements, defined the V1 scope and business rules, mapped the complete call lifecycle, aligned real-time behaviour with engineering, and designed the final workflows and interface.",
                },
                {
                    strong:
                        "The resulting experience connected two product areas:",
                },
            ],
            cards: [
                {
                    title: "Call Center Agent Experience",
                    body: "An in-browser workspace for receiving and placing calls, identifying callers, accessing relevant operational context, managing live-call actions, transferring conversations, and completing wrap-up.",
                },
                {
                    title: "Call Log",
                    body: "A role-adaptive history for agents and supervisors to find recent calls, review missed interactions, access notes, listen to recordings, read transcripts, and understand what happened during each conversation.",
                },
            ],
        },
        challenge: {
            metadata: "Challenge",
            title: "Phone calls were separate from the work agents had to do",
            paragraphs: [
                "Accolade’s teams used the platform to manage residents, prospects, tours, work orders, and community tasks.",
                "But phone calls happened outside this flow.",
                "Agents had to handle the conversation, search for information, complete related tasks, and record what happened. This made each call harder to manage and harder to review later.",
            ],
            cards: [
                {
                    title: "Agents started calls without enough context",
                    icon: "context",
                    details: [
                        "A caller could be a resident, prospect, vendor, or unknown person.",
                        "Agents often had to search for the right record after answering the call.",
                        "This slowed down the conversation and made the first few moments less clear.",
                    ],
                },
                {
                    title: "Call handling and related work happened in different places",
                    icon: "workflows",
                    intro: "One call could involve:",
                    details: [
                        "Checking a resident record",
                        "Updating a guest card",
                        "Booking a tour",
                        "Creating a work order",
                    ],
                    outro:
                        "These tasks were part of the same conversation, but agents had to manage them separately.",
                },
                {
                    title: "Transfers caused context to get lost",
                    icon: "transfer",
                    details: [
                        "When a call moved to another agent, the next person might not know what had already been discussed.",
                        "The caller could be asked to repeat the same information.",
                        "It was also unclear who owned the notes, actions, and final call record.",
                    ],
                },
                {
                    title: "Finished calls were hard to review",
                    icon: "review",
                    details: [
                        "Details could be spread across notes, records, work orders, recordings, and call history.",
                        "This made follow-up harder for agents.",
                        "It also made it harder for supervisors to understand the full conversation.",
                    ],
                },
            ],
        },
        strategy: {
            metadata: "Process",
            title: "Designing the screens meant first defining how the system should work",
            paragraphs: [
                "As both Product Manager and Product Designer, I worked across product definition and design. I first mapped how calls fit into the wider product, who was involved, and how a call moved from start to finish. I then defined the rules and states behind that journey before structuring the interface and connecting the live conversation to its final call record.",
            ],
        },
    },
    {
        slug: "contributing-to-accolades-design-system",
        index: 3,
        title: "Contributing to Accolade’s Design System",
        description:
            "A collection of reusable components and patterns I contributed while designing Accolade’s core product experiences.",
        image: "/projects/project-3-card.webp",
    },
    {
        slug: "designing-a-process-development-platform",
        index: 4,
        title: "Designing a Process Development Platform",
        description:
            "Designing clearer, more connected workflows for scientists working across route planning, experimentation, and process simulation.",
        image: "/projects/project-4-thumbnail.webp",
        heroVideos: [
            "/projects/project-4-hero-02.webm",
            "/projects/project-4-hero-03.webm",
            "/projects/project-4-hero-01.webm",
        ],
        client: "Covvalent",
        team: [
            "Product Designer (me)",
            "Chief of Staff",
            "2 Software Engineers",
        ],
        timeline: "8 Weeks",
        scope: "Desktop Web",
        badges: [
            { label: "B2B" },
            { label: "Process Development" },
            { label: "Chemical Tech" },
        ],
        overview: {
            paragraphs: [
                {
                    before:
                        "This project focused on designing a confidential web platform for process development teams working across complex scientific workflows. The goal was to make dense technical information easier to understand, help users move between planning and simulation tasks, and surface the most important actions, risks, and decisions without overwhelming the interface.",
                },
                {
                    before:
                        "My work focused on translating these workflows into clear product experiences across key areas such as project monitoring, route evaluation, and virtual process simulation. Due to NDA restrictions, the screens and content shown here have been generalized and do not represent the original product or confidential company information.",
                },
            ],
        },
        challenge: {
            title: "Complex workflows, too much information",
            paragraphs: [
                "Process development involves a lot of technical information spread across different stages of work.",
                "Scientists need to compare routes, review results, track risks, and understand what is happening during simulations. With so much information to work with, it can be difficult to quickly find what matters and understand what needs attention.",
            ],
        },
        strategy: {
            title: "Bringing route planning and simulation into one clear workflow",
            paragraphs: [
                "I designed the platform around how process development teams actually work: reviewing synthesis routes, comparing trade-offs, tracking risks, and testing process conditions before moving forward.",
                "Instead of treating each step as a separate tool, the experience connects project status, route evaluation, and virtual simulation in one consistent interface. This gives scientists a clearer view of what is happening at each stage and helps them make decisions with less back-and-forth.",
            ],
        },
    },
]

export function getProject(slug: string): Project | undefined {
    const legacySlugs: Record<string, string> = {
        "project-1": "untangling-b2b-customer-onboarding",
        "project-2": "designing-an-e2e-call-center-experience",
        terrain: "designing-an-e2e-call-center-experience",
        "project-3": "contributing-to-accolades-design-system",
        "atlas-ai": "contributing-to-accolades-design-system",
        "project-4": "designing-a-process-development-platform",
        "common-ground": "designing-a-process-development-platform",
    }
    const canonicalSlug = legacySlugs[slug] ?? slug
    return PROJECTS.find((p) => p.slug === canonicalSlug)
}

// Previous / next project (wraps around) for the detail-page footer nav.
export function getAdjacent(slug: string): {
    prev?: Project
    next?: Project
} {
    const i = PROJECTS.findIndex((p) => p.slug === slug)
    if (i === -1) return {}
    const n = PROJECTS.length
    return {
        prev: PROJECTS[(i - 1 + n) % n],
        next: PROJECTS[(i + 1) % n],
    }
}
