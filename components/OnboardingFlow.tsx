type FlowIcon =
    | "organization"
    | "owners"
    | "products"
    | "connection"
    | "workflows"
    | "ready"

const STEPS: Array<{ label: string; icon: FlowIcon }> = [
    { label: "Create organization", icon: "organization" },
    { label: "Assign owners and admins", icon: "owners" },
    { label: "Add communities and products", icon: "products" },
    { label: "Connect PMS", icon: "connection" },
    { label: "Configure workflows", icon: "workflows" },
    { label: "Ready for go-live", icon: "ready" },
]

const ICON_PATHS: Record<FlowIcon, string> = {
    organization: "/icons/accolade-building-2.svg",
    owners: "/icons/accolade-users-round.svg",
    products: "/icons/accolade-package-plus.svg",
    connection: "/icons/accolade-cable.svg",
    workflows: "/icons/accolade-workflow.svg",
    ready: "/icons/accolade-circle-check-big.svg",
}

function StepIcon({ icon }: { icon: FlowIcon }) {
    return (
        <span
            className="onboarding-flow__glyph"
            style={{
                WebkitMaskImage: `url("${ICON_PATHS[icon]}")`,
                maskImage: `url("${ICON_PATHS[icon]}")`,
            }}
            aria-hidden="true"
        />
    )
}

export default function OnboardingFlow() {
    return (
        <figure className="onboarding-flow" aria-labelledby="onboarding-flow-caption">
            <div className="onboarding-flow__viewport">
                <ol className="onboarding-flow__track">
                    {STEPS.map((step, index) => {
                        const isLast = index === STEPS.length - 1

                        return (
                            <li className="onboarding-flow__step" key={step.label}>
                                <div className="onboarding-flow__card">
                                    <span className="onboarding-flow__number">
                                        {index + 1}
                                    </span>
                                    <span className="onboarding-flow__icon">
                                        <StepIcon icon={step.icon} />
                                    </span>
                                    <strong>{step.label}</strong>
                                </div>

                                {!isLast && (
                                    <span
                                        className="onboarding-flow__connector"
                                        aria-hidden="true"
                                    >
                                        <span className="onboarding-flow__connector-glyph" />
                                    </span>
                                )}
                            </li>
                        )
                    })}
                </ol>
            </div>

            <figcaption id="onboarding-flow-caption">
                A missing or failed step could block the rest of the onboarding
                journey.
            </figcaption>
        </figure>
    )
}
