// Shared footer, mounted once in app/layout.tsx so it appears on every route.
const RESUME_URL =
    "https://drive.google.com/file/d/1cRmWNXUA26PlIeRiowkOTLmx32HaCLA5/view?usp=sharing"

export default function SiteFooter() {
    return (
        <footer className="site-footer">
            <span className="site-footer__identity">© 2026 Amrendra Singh</span>
            <span className="site-footer__rule" aria-hidden="true" />
            <span className="site-footer__credit">{"Vibecoded with <3"}</span>
            <span className="site-footer__rule" aria-hidden="true" />
            <span className="site-footer__links">
                <a
                    href="https://www.linkedin.com/in/amrendrasinghyadav/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    LinkedIn
                </a>
                <span aria-hidden="true">·</span>
                <a
                    href={RESUME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Resume
                </a>
                <span aria-hidden="true">·</span>
                <a href="mailto:amr2003sngh@gmail.com">Let&apos;s Connect</a>
            </span>
        </footer>
    )
}
