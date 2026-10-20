import Link from "next/link"

export default function ProjectBackButton() {
    return (
        <Link
            href="/#selected-work"
            className="project-detail__rail-back"
            aria-label="Back to Work"
        >
            <span
                className="project-detail__rail-back-arrow"
                aria-hidden="true"
            >
                <span className="project-detail__rail-back-glyph" />
            </span>
            <span className="project-detail__rail-back-label">Work</span>
        </Link>
    )
}
