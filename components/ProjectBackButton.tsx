import Link from "next/link"

export default function ProjectBackButton() {
    return (
        <Link
            href="/work"
            className="project-detail__rail-back"
            aria-label="Back to Works"
        >
            <span
                className="project-detail__rail-back-arrow"
                aria-hidden="true"
            >
                <span className="project-detail__rail-back-glyph" />
            </span>
            <span className="project-detail__rail-back-label">Works</span>
        </Link>
    )
}
