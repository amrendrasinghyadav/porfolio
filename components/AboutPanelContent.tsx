import { IconArrowUpRight, IconX } from "@tabler/icons-react"
import AboutGallery from "@/components/AboutGallery"

type AboutPanelContentProps = {
    titleId: string
    onClose: () => void
}

export default function AboutPanelContent({
    titleId,
    onClose,
}: AboutPanelContentProps) {
    return (
        <>
            <div className="about-panel__mobile-head">
                <span>About me</span>
                <button
                    type="button"
                    aria-label="Close About"
                    onClick={onClose}
                >
                    <IconX aria-hidden="true" />
                </button>
            </div>

            <div className="about-panel__layout">
                <AboutGallery />

                <div className="about-panel__content selectable">
                    <h2 id={titleId} className="sr-only">
                        About me
                    </h2>
                    <div className="about-panel__bio">
                        <p>
                            Hi, I’m Amrendra, a <strong>high-agency</strong>{" "}
                            designer who thrives on taking{" "}
                            <strong>full ownership</strong> of the products I
                            craft. My experience spans working at two startups
                            and freelancing, where I’ve driven projects from
                            concept to completion. I bring a deep commitment to
                            seeing ideas through and delivering thoughtful
                            results.
                        </p>
                        <p>
                            I’m from the National Institute of Design, one of
                            <strong> India’s top design schools</strong>, where I
                            honed my approach to problem-solving.
                        </p>
                        <p>
                            I’m currently based in Bangalore. Outside of design,
                            I love traveling, hiking, trekking, and exploring new
                            places wherever I get the chance.
                        </p>
                    </div>

                    <div className="about-panel__links">
                        <a href="mailto:amr2003sngh@gmail.com">
                            Email
                            <IconArrowUpRight aria-hidden="true" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/amrendrasinghyadav/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LinkedIn
                            <IconArrowUpRight aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
