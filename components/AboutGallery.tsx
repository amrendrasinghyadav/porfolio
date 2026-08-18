"use client"

import { useState } from "react"

const ABOUT_IMAGES = [
    {
        src: "/about/about-image-1.webp",
        alt: "Amrendra overlooking a green valley and waterfalls",
        objectPosition: "center",
    },
    {
        src: "/about/about-image-2.webp",
        alt: "Amrendra jumping across a stream in a grassy valley",
        objectPosition: "center",
    },
    {
        src: "/about/about-image-3.webp",
        alt: "Rolling green hills with a stream running through the valley",
        objectPosition: "center",
    },
    {
        src: "/about/about-image-4.webp",
        alt: "A designer meme about choosing between rounded and sharp corners",
        objectPosition: "center bottom",
    },
] as const

export default function AboutGallery() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const selectedImage = ABOUT_IMAGES[selectedIndex]

    return (
        <div className="about-gallery">
            <div className="about-gallery__chrome" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>

            <div className="about-gallery__stage">
                <img
                    key={selectedImage.src}
                    className="about-gallery__image"
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    style={{ objectPosition: selectedImage.objectPosition }}
                />
            </div>

            <div
                className="about-gallery__thumbnails"
                aria-label="About gallery"
            >
                {ABOUT_IMAGES.map((image, index) => (
                    <button
                        key={image.src}
                        type="button"
                        className="about-gallery__thumbnail"
                        data-selected={selectedIndex === index}
                        aria-label={`Show image ${index + 1}`}
                        aria-pressed={selectedIndex === index}
                        onClick={() => setSelectedIndex(index)}
                    >
                        <img
                            src={image.src}
                            alt=""
                            style={{ objectPosition: image.objectPosition }}
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
