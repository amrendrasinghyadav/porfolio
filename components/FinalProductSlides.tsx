"use client"

import { useState, type KeyboardEvent } from "react"
import NextSlideArea from "./NextSlideArea"

const FIRST_FINAL_PRODUCT_SLIDE = {
    title: "Organization setup",
    variant: "organization",
    image: "/projects/final-product-acco-frame-trimmed.svg",
    alt: "Accolade organization setup interface",
    descriptionLead: "A single view of every organization",
    description:
        "The landing page gives super admins a quick view of all organizations, their PMS setup, onboarding status, and assigned owners.",
} as const

const SECOND_FINAL_PRODUCT_SLIDE = {
    title: "Add a new organization — Empty state",
    variant: "organization-empty",
    image: "/projects/final-product-add-organization-empty-trimmed.svg",
    alt: "Accolade interface showing the empty state for adding a new organization",
    descriptionLead: "Adding a new organization",
    description:
        "The form asks only for the details needed to create the organization, such as basic information, owners, and supporting documents. The remaining setup happens later inside the organization workspace.",
} as const

const FINAL_PRODUCT_SLIDES = Array.from({ length: 14 }, (_, index) => {
    if (index === 1) return SECOND_FINAL_PRODUCT_SLIDE

    return {
        ...FIRST_FINAL_PRODUCT_SLIDE,
        title:
            index === 0
                ? FIRST_FINAL_PRODUCT_SLIDE.title
                : `${FIRST_FINAL_PRODUCT_SLIDE.title} ${index + 1}`,
        alt:
            index === 0
                ? FIRST_FINAL_PRODUCT_SLIDE.alt
                : `${FIRST_FINAL_PRODUCT_SLIDE.alt}, slide ${index + 1}`,
    }
})

type FinalProductSlidesProps = {
    slideImages?: readonly string[]
    slideVideos?: readonly (string | undefined)[]
    slideContent?: readonly {
        descriptionLead: string
        description: string
    }[]
    slideCount?: number
}

export default function FinalProductSlides({
    slideImages,
    slideVideos,
    slideContent,
    slideCount = FINAL_PRODUCT_SLIDES.length,
}: FinalProductSlidesProps) {
    const finalProductSlides = FINAL_PRODUCT_SLIDES.slice(
        0,
        slideCount,
    ).map((slide, index) => ({
        ...slide,
        ...(slideImages?.[index] ? { image: slideImages[index] } : {}),
        ...(slideVideos?.[index] ? { video: slideVideos[index] } : {}),
        ...(slideContent?.[index] ?? {}),
    }))
    const firstFinalProductSlide = finalProductSlides[0]
    const [activeIndex, setActiveIndex] = useState(0)
    const [trackIndex, setTrackIndex] = useState(0)
    const [isResettingTrack, setIsResettingTrack] = useState(false)

    const showNext = () => {
        if (trackIndex === finalProductSlides.length) return

        setActiveIndex((current) =>
            (current + 1) % finalProductSlides.length,
        )
        setTrackIndex((current) => current + 1)
    }

    const showPrevious = () => {
        if (trackIndex === finalProductSlides.length) return

        setActiveIndex((current) => Math.max(0, current - 1))
        setTrackIndex((current) => Math.max(0, current - 1))
    }

    const chooseSlide = (index: number) => {
        setIsResettingTrack(false)
        setActiveIndex(index)
        setTrackIndex(index)
    }

    const handleTrackTransitionEnd = () => {
        if (trackIndex !== finalProductSlides.length) return

        setIsResettingTrack(true)
        setTrackIndex(0)

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                setIsResettingTrack(false)
            })
        })
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault()
            showPrevious()
        }

        if (event.key === "ArrowRight") {
            event.preventDefault()
            showNext()
        }
    }

    return (
        <section
            className="final-product-slides"
            aria-label="Final product screens"
            aria-roledescription="carousel"
            data-interactive
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <NextSlideArea
                className="final-product-slides__viewport"
                onPrevious={showPrevious}
                onNext={showNext}
            >
                <div
                    className="final-product-slides__track"
                    style={{
                        transform: `translate3d(-${trackIndex * 100}%, 0, 0)`,
                        transition: isResettingTrack ? "none" : undefined,
                    }}
                    onTransitionEnd={handleTrackTransitionEnd}
                >
                    {finalProductSlides.map((slide, index) => (
                        <figure
                            className={`final-product-slides__frame${
                                "image" in slide
                                    ? " final-product-slides__frame--image"
                                    : ""
                            }`}
                            aria-hidden={activeIndex !== index}
                            key={slide.title}
                        >
                            <p className="final-product-slides__description">
                                <strong>{slide.descriptionLead}</strong>
                                <span aria-hidden="true"> - </span>
                                {slide.description}
                            </p>
                            <div className="final-product-slides__media">
                                {"video" in slide && slide.video ? (
                                    <video
                                        className="final-product-slides__video"
                                        src={slide.video}
                                        aria-label={slide.alt}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                    />
                                ) : (
                                    <img
                                        className="final-product-slides__image"
                                        src={slide.image}
                                        alt={slide.alt}
                                    />
                                )}
                            </div>
                        </figure>
                    ))}

                    <figure
                        className="final-product-slides__frame final-product-slides__frame--image"
                        aria-hidden="true"
                    >
                        <p className="final-product-slides__description">
                            <strong>
                                {firstFinalProductSlide.descriptionLead}
                            </strong>
                            <span aria-hidden="true"> - </span>
                            {firstFinalProductSlide.description}
                        </p>
                        <div className="final-product-slides__media">
                            {"video" in firstFinalProductSlide &&
                            firstFinalProductSlide.video ? (
                                <video
                                    className="final-product-slides__video"
                                    src={firstFinalProductSlide.video}
                                    aria-hidden="true"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                />
                            ) : (
                                <img
                                    className="final-product-slides__image"
                                    src={firstFinalProductSlide.image}
                                    alt=""
                                />
                            )}
                        </div>
                    </figure>
                </div>
            </NextSlideArea>

            <div
                className="final-product-slides__thumbnails"
                aria-label="Choose a final product screen"
            >
                {finalProductSlides.map((slide, index) => (
                    <button
                        className={activeIndex === index ? "is-active" : undefined}
                        type="button"
                        aria-label={`Show screen ${index + 1}: ${slide.title}`}
                        aria-pressed={activeIndex === index}
                        onClick={() => chooseSlide(index)}
                        key={slide.title}
                    >
                        <img
                            className="final-product-slides__thumbnail-image"
                            src={slide.image}
                            alt=""
                        />
                    </button>
                ))}
            </div>
        </section>
    )
}
