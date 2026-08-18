import type { Metadata } from "next"
import AboutGallery from "@/components/AboutGallery"

export const metadata: Metadata = {
    title: "About",
}

export default function AboutPage() {
    return (
        <main className="shell shell--about">
            <section
                className="about-page"
                aria-labelledby="about-title"
            >
                <AboutGallery />

                <div className="about-page__content">
                    <h1
                        id="about-title"
                        className="about-page__title selectable"
                    >
                        About me
                    </h1>

                    <div className="about-page__bio selectable">
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
                </div>
            </section>
        </main>
    )
}
