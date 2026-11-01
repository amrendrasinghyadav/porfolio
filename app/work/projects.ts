type Project = {
    slug: string
    index: number
    title: string
    description: string
    image: string
    cardImages?: readonly [string, string, string, string]
    heroImage?: string
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
            icon?: string
        }>
        flow?: Array<{
            title: string
            body: string
            icon: string
        }>
        helpTitle?: string
        helpItems?: string[]
    }
    overviewImpact?: {
        outcomes: Array<{
            title: string
            body: string
            icon: string
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
        summaryCards?: Array<{
            eyebrow: string
            title: string
            body: string
            icon: string
        }>
        detailCards?: Array<{
            title: string
            body: string
            image?: {
                src: string
                alt: string
            }
        }>
    }
    strategy?: {
        metadata?: string
        title: string
        paragraphs: string[]
        cards?: Array<{
            title: string
            body: string
        }>
    }
    decisions?: Array<{
        title: string
        body: string
        image: {
            src: string
            alt: string
            width: number
            height: number
        }
    }>
    finalProduct?: {
        title: string
        body: string
        slides?: Array<{
            image: string
            alt: string
            descriptionLead: string
            description: string
        }>
    }
    reflection?: string
}

function projectTitleToSlug(title: string): string {
    return title
        .normalize("NFKD")
        .replace(/[’']/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()
}

const PROJECT_DEFINITIONS: Array<Omit<Project, "slug">> = [
    {
        index: 1,
        title: "Untangling B2B Customer Onboarding",
        description:
            "Turning a fragmented provisioning process into one structured operational workflow.",
        image: "/projects/project-1-thumbnail.webp",
        cardImages: [
            "/projects/project-1-final-product-02.webp",
            "/projects/project-1-final-product-03.webp",
            "/projects/accolade-connected-communities.gif",
            "/projects/project-1-final-product-04.webp",
        ],
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
        index: 2,
        title: "Designing an E2E Call Center Experience",
        description:
            "Connecting live calls with caller context, operational work, transfers, wrap-up, and post-call review.",
        image: "/projects/project-2-cover.webp",
        cardImages: [
            "/projects/project-2-final-product-03.webp",
            "/projects/project-2-final-product-04.webp",
            "/projects/accolade-call-center.gif",
            "/projects/project-2-final-product-05.webp",
        ],
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
        index: 3,
        title: "Unit Turns - Simplifying the Make-Ready Workflow",
        description:
            "Designing a unified experience to streamline unit turnovers, coordinate maintenance workflows, and track readiness from move-out to move-in.",
        image: "/projects/project-1-thumbnail.webp",
        heroImage: "/projects/unit-turns-hero-laptop-lossless.webp",
        cardImages: [
            "/projects/unit-turns-create-template.webp",
            "/projects/unit-turns-dependency-conflict.webp",
            "/projects/accolade-unit-turns.gif",
            "/projects/unit-turns-turn-board.webp",
        ],
        client: "Accolade",
        team: [
            "Product Designer (me)",
            "Product Manager",
            "2 Software Engineers",
        ],
        timeline: "8 weeks",
        scope: "Desktop Web",
        badges: [
            { label: "Shipped", status: "success" },
            { label: "B2B" },
            { label: "Workflow Management" },
        ],
        overview: {
            paragraphs: [
                {
                    before:
                        "Preparing a rental unit for a new resident involves multiple inspections, repairs, work orders, and schedules that need to stay coordinated. For maintenance supervisors managing several units, keeping track of everything can become complex.",
                },
                {
                    before:
                        "Unit Turns brings these activities into one connected workflow, helping teams plan tasks, track progress, and manage the make-ready process from move-out to move-in.",
                },
            ],
            flow: [
                {
                    title: "Move-out",
                    body: "Unit vacates",
                    icon: "/icons/accolade-building-2.svg",
                },
                {
                    title: "Inspect",
                    body: "Assess condition",
                    icon: "/icons/accolade-eye.svg",
                },
                {
                    title: "Make-ready",
                    body: "Repairs, cleaning, and more",
                    icon: "/icons/accolade-wrench.svg",
                },
                {
                    title: "Unit ready",
                    body: "Available for move-in",
                    icon: "/icons/accolade-circle-check.svg",
                },
            ],
            helpTitle: "What it helps teams do",
            helpItems: [
                "Create and manage customizable turn templates",
                "Monitor unit turnovers and identify delays",
                "Coordinate teams, schedules, and dependencies",
                "Improve efficiency with automation and manual control",
            ],
        },
        overviewImpact: {
            outcomes: [
                {
                    title: "Better visibility into turnovers",
                    body: "Supervisors can easily understand the status of each unit, identify delays, and see what needs attention without switching between different tools.",
                    icon: "/icons/accolade-eye.svg",
                },
                {
                    title: "Clearer workflow management",
                    body: "Supervisors understand how tasks connect, which activities can happen together, and how dependencies affect the overall timeline.",
                    icon: "/icons/accolade-workflow.svg",
                },
                {
                    title: "Confidence in customization",
                    body: "Teams feel comfortable creating and adjusting templates to match their property's needs without worrying about breaking the workflow.",
                    icon: "/icons/accolade-pencil-line.svg",
                },
                {
                    title: "Easier task coordination",
                    body: "Supervisors feel more in control when assigning work, managing schedules, and coordinating technicians and vendors.",
                    icon: "/icons/accolade-users-round.svg",
                },
            ],
        },
        challenge: {
            title: "Challenge",
            paragraphs: [
                "Preparing a unit for its next resident involves multiple inspections, repairs, schedules, and teams. Each property follows different processes, while maintenance supervisors need to manage several turnovers within tight deadlines.",
                "The challenge was to bring these connected workflows into one experience that is easy to set up, track, and manage.",
            ],
            detailCards: [
                {
                    title: "Bringing structure to interconnected tasks",
                    body: "A single unit turn involves multiple inspections and work orders that may happen in sequence or at the same time. Each step has its own duration and dependencies. The challenge was to help supervisors organize these activities, set timelines, and understand how changes to one step affect the overall workflow.",
                    image: {
                        src: "/projects/unit-turns-workflow-network.webp",
                        alt: "Connected workflow network",
                    },
                },
                {
                    title: "Supporting different property needs",
                    body: "Each property may have different maintenance requirements, unit types, and timelines. The challenge was to maintain a consistent process across properties while allowing teams to customize workflows for their needs.",
                    image: {
                        src: "/projects/unit-turns-workflow-pipeline.webp",
                        alt: "Configurable workflow pipeline",
                    },
                },
                {
                    title: "Bringing visibility and control together",
                    body: "Supervisors need to track multiple turns, identify delays, and manage individual tasks. The challenge was to present all this information clearly while making it easy to access details, assign work, and update schedules.",
                    image: {
                        src: "/projects/unit-turns-productivity-dashboard.webp",
                        alt: "Unit turnover dashboard showing task status and schedules",
                    },
                },
            ],
        },
        strategy: {
            title: "How I broke down the workflow",
            paragraphs: [
                "I focused on understanding how unit turnovers work, organizing the different workflows, and making complex tasks easier to manage.",
            ],
        },
        decisions: [
            {
                title: "Using a visual timeline to build workflows",
                body: "Instead of relying only on forms, the Template Builder uses a timeline to show steps, durations, and their order. This helps users understand how a unit turn is planned while configuring it.",
                image: {
                    src: "/projects/unit-turns-create-template.webp",
                    alt: "Create template screen with a visual unit-turn timeline",
                    width: 2048,
                    height: 1280,
                },
            },
            {
                title: "Allowing flexibility while protecting task dependencies",
                body: "Users can arrange steps and plan parallel activities. When a change conflicts with an existing dependency, the interface explains the conflict and provides a way to resolve it.",
                image: {
                    src: "/projects/unit-turns-dependency-conflict.webp",
                    alt: "Dependency conflict dialog in the Template Builder",
                    width: 2048,
                    height: 1280,
                },
            },
            {
                title: "Making templates reusable and customizable",
                body: "The design supports shared templates that can be imported and adapted for individual communities. This reduces repeated setup while allowing properties to adjust their workflows.",
                image: {
                    src: "/projects/unit-turns-template-preview.webp",
                    alt: "Template preview screen for customizing a shared workflow",
                    width: 2048,
                    height: 1280,
                },
            },
            {
                title: "Choosing a table layout for the Turn Board",
                body: "The Turn Board presents units as rows and workflow steps as columns, making it easier to compare progress across several turns and quickly identify delayed or incomplete work.",
                image: {
                    src: "/projects/unit-turns-turn-board.webp",
                    alt: "Turn Board table showing unit status and workflow progress",
                    width: 2048,
                    height: 1280,
                },
            },
            {
                title: "Keeping task details close to the main workflow",
                body: "Work order and inspection details are accessible from the Turn Board, allowing supervisors to review tasks, assign work, and manage schedules without losing the context of the overall turn.",
                image: {
                    src: "/projects/unit-turns-create-work-order.webp",
                    alt: "Create Work Order panel opened from the Turn Board",
                    width: 2048,
                    height: 1280,
                },
            },
        ],
        finalProduct: {
            title: "From move-out to move-in ready",
            body: "A closer look at the key screens and workflows that bring template creation, turn tracking, inspections, and maintenance tasks into one connected experience.",
            slides: [
                {
                    image: "/projects/unit-turns-template-builder.webp",
                    alt: "Template Builder with a visual workflow timeline",
                    descriptionLead: "Template Builder",
                    description:
                        "The Template Builder helps users create and manage turn workflows with a visual timeline and editable steps, making it easier to organize tasks and customize workflows for different property needs.",
                },
                {
                    image: "/projects/unit-turns-add-step-configuration.webp",
                    alt: "Add Step panel for configuring a workflow task",
                    descriptionLead: "Adding and Configuring Steps",
                    description:
                        "The Add Step panel lets users customize each step by setting task types, dependencies, duration, and assignments, helping them build workflows that fit their property's needs.",
                },
                {
                    image: "/projects/unit-turns-updated-steps-list.webp",
                    alt: "Updated workflow steps list with task details",
                    descriptionLead: "Visual Workflow Preview",
                    description:
                        "The visual timeline helps users see the full turn process, including task order, duration, and parallel steps, while keeping each step easy to review and edit.",
                },
                {
                    image: "/projects/unit-turns-turn-board-task-details.webp",
                    alt: "Task details popover opened from the Turn Board",
                    descriptionLead: "Viewing Task Details",
                    description:
                        "The Turn Board lets users quickly view tasks within each workflow step, check their status, see assignments and schedules, and add new tasks without leaving the board.",
                },
                {
                    image: "/projects/unit-turns-turn-details.webp",
                    alt: "Turn Details view with timeline, tasks, and scheduling",
                    descriptionLead: "Turn Details",
                    description:
                        "The Turn Details view gives users a complete picture of a unit turn, including its timeline, current status, assigned tasks, and scheduling details, making it easier to track progress and manage the full workflow in one place.",
                },
            ],
        },
        reflection:
            "Working on Unit Turns taught me to look beyond individual screens and understand how the whole experience connects. I learned that good design is not about removing complexity, but making it easier for users to understand and manage. This project helped me think more carefully about my design choices and their impact on the user experience.",
    },
    {
        index: 4,
        title: "Designing a Process Development Platform",
        description:
            "Designing clearer, more connected workflows for scientists working across route planning, experimentation, and process simulation.",
        image: "/projects/project-4-thumbnail.webp",
        cardImages: [
            "/projects/project-4-card-01.jpg",
            "/projects/project-4-card-02.jpg",
            "/projects/project-4-molecule-card.png",
            "/projects/project-4-card-03.jpg",
        ],
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

const PROJECT_DISPLAY_ORDER = [3, 1, 2, 4]

export const PROJECTS: Project[] = [...PROJECT_DEFINITIONS]
    .sort(
        (first, second) =>
            PROJECT_DISPLAY_ORDER.indexOf(first.index) -
            PROJECT_DISPLAY_ORDER.indexOf(second.index),
    )
    .map((project) => ({
        ...project,
        slug: projectTitleToSlug(project.title),
    }))

export function getProject(slug: string): Project | undefined {
    return PROJECTS.find((project) => project.slug === slug)
}

export function getNextProject(slug: string): Project | undefined {
    const index = PROJECTS.findIndex((project) => project.slug === slug)
    if (index === -1) return undefined
    return PROJECTS[(index + 1) % PROJECTS.length]
}
