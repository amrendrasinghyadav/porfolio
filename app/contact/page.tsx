import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact",
}

export default function ContactPage() {
    return (
        <main className="shell">
            <section
                className="section section--page"
                aria-labelledby="contact-title"
            >
                <div className="section-head">
                    <h1 id="contact-title" className="section-head__title">
                        Contact
                    </h1>
                    <span className="section-head__index">[ reach out ]</span>
                </div>
                <a
                    className="contact-line selectable"
                    href="mailto:amr2003sngh@gmail.com"
                >
                    [ amr2003sngh@gmail.com ]
                </a>
            </section>
        </main>
    )
}
