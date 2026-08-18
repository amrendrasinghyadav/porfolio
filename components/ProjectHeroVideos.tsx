"use client"

import { useState } from "react"

type ProjectHeroVideosProps = {
    title: string
    videos: readonly string[]
}

export default function ProjectHeroVideos({
    title,
    videos,
}: ProjectHeroVideosProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const activeVideo = videos[activeIndex]

    const showPrevious = () => {
        setActiveIndex((current) =>
            current === 0 ? videos.length - 1 : current - 1,
        )
    }

    const showNext = () => {
        setActiveIndex((current) => (current + 1) % videos.length)
    }

    return (
        <figure className="project-detail__hero project-detail__hero--video-carousel">
            <div className="project-hero-videos__media">
                <video
                    key={activeVideo}
                    src={activeVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`${title} interface demonstration ${activeIndex + 1} of ${videos.length}`}
                />
            </div>

            <figcaption
                className="project-hero-videos__controls"
                aria-label="Choose a project demonstration"
            >
                <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Show previous demonstration"
                >
                    ←
                </button>
                <div className="project-hero-videos__pages">
                    {videos.map((video, index) => (
                        <button
                            className={
                                index === activeIndex ? "is-active" : undefined
                            }
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Show demonstration ${index + 1}`}
                            aria-pressed={index === activeIndex}
                            key={video}
                        >
                            {String(index + 1).padStart(2, "0")}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={showNext}
                    aria-label="Show next demonstration"
                >
                    →
                </button>
            </figcaption>
        </figure>
    )
}
