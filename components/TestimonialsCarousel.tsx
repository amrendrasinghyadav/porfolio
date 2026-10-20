"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

const TESTIMONIALS = [
    {
        quote: "I had the pleasure of working with Amrendra at Accolade, where he joined as an early-career product designer while still finishing at the National Institute of Design, and immediately punched above his experience. Barely three months in, our design lead recognized him publicly for taking real ownership: understanding the use cases deeply, asking the right questions, and volunteering well beyond his scope. He owned an internal portal end to end and helped shape our call-center designs. Amrendra has the curiosity and grit that make a designer great over time, and I recommend him wholeheartedly to any team investing in design talent.",
        name: "Galen Simmons",
        role: "Founder @Accolade",
        image: "/testimonials/galen-simmons.jpeg",
        expandable: true,
    },
    {
        quote: "I mentored Amrendra during his internship at Accolade, and he quickly proved to be far more than an intern. From the start, he volunteered for work across multiple modules and always came in prepared. He contributed to our Voice AI call center module, our internal communications work, admin screens, and user onboarding. In the fast-paced environment of a startup, he consistently made well-informed decisions while working against the many constraints that come with an early-stage company.\n\nWhat stood out most was how much he grew over the course of the internship. His systems thinking sharpened noticeably, which is something I look for in any strong designer, and he had a habit of asking the right questions at the right moments. He is a talented UX designer with a real passion for problem-solving, backed by a solid design process and a curious mindset. He also pays close attention to the emotions that shape how people engage with a product, and it shows in his work.\n\nHaving managed him closely, I came to know him as open, thorough, and thoughtful in the way he makes decisions. I would gladly recommend Amrendra for any future opportunity so he can put more of his talent and skill to good use.",
        name: "Nikith DSouza",
        role: "Design Lead @Accolade, Ex Medidata, Deloitte, and Rocket Mortgage",
        image: "/testimonials/nikith-dsouza.png",
        expandable: true,
    },
    {
        quote: "It was great working with Amrendra during our internship. He picks things up quickly, which made collaborating with him easy and efficient. He was always proactive, dependable, and took ownership of his work.\n\nAmrendra has strong skills across UI, UX, and strategic thinking. He consistently brought fresh ideas and thoughtful perspectives to everything we worked on, from dashboards to internal tools, helping improve both the design and the overall product direction.\n\nHe’s a great teammate, and I’d happily recommend him to any team looking for a skilled and collaborative designer.",
        name: "Namya Kansra",
        role: "UX @ICICI Bank, Ex Covvalent",
        image: "/testimonials/namya-kansra.png",
        expandable: true,
    },
] as const

export default function TestimonialsCarousel() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    const [cardHeight, setCardHeight] = useState<number>()
    const contentRefs = useRef<Array<HTMLDivElement | null>>([])

    const showPrevious = useCallback(() => {
        setExpandedIndex(null)
        setActiveIndex(
            (current) =>
                (current - 1 + TESTIMONIALS.length) %
                TESTIMONIALS.length,
        )
    }, [])

    const showNext = useCallback(() => {
        setExpandedIndex(null)
        setActiveIndex(
            (current) => (current + 1) % TESTIMONIALS.length,
        )
    }, [])

    useEffect(() => {
        const contents = contentRefs.current.filter(
            (content): content is HTMLDivElement => Boolean(content),
        )

        if (!contents.length) return

        const syncCardHeight = () => {
            const nextHeight = Math.max(
                224,
                ...contents.map(
                    (content) =>
                        Math.ceil(content.offsetHeight) + 66,
                ),
            )
            setCardHeight(nextHeight)
        }

        const resizeObserver = new ResizeObserver(syncCardHeight)
        contents.forEach((content) => resizeObserver.observe(content))
        syncCardHeight()

        return () => resizeObserver.disconnect()
    }, [])

    return (
        <section
            id="testimonials"
            className="peer-testimonials"
            aria-labelledby="peer-testimonials-title"
        >
            <div className="peer-testimonials__inner">
                <div className="peer-testimonials__heading">
                    <h2
                        id="peer-testimonials-title"
                        className="peer-testimonials__title"
                    >
                        From people I&apos;ve built with
                    </h2>
                </div>

                <div className="peer-testimonials__stack-wrap">
                    <div
                        className="peer-testimonials__stack"
                        style={
                            cardHeight
                                ? { height: `${cardHeight + 60}px` }
                                : undefined
                        }
                    >
                        {TESTIMONIALS.map((testimonial, index) => {
                            const slot =
                                (index - activeIndex +
                                    TESTIMONIALS.length) %
                                TESTIMONIALS.length
                            const isExpanded = expandedIndex === index
                            const quoteId = `testimonial-quote-${index}`

                            return (
                                <article
                                    key={testimonial.name}
                                    className={`peer-testimonial-card peer-testimonial-card--slot-${slot}`}
                                    style={
                                        cardHeight
                                            ? { minHeight: cardHeight }
                                            : undefined
                                    }
                                    aria-hidden={slot !== 0}
                                >
                                    <button
                                        type="button"
                                        className="peer-testimonial-card__cycle"
                                        aria-label="Show next testimonial"
                                        tabIndex={slot === 0 ? 0 : -1}
                                        onClick={showNext}
                                    />
                                    <div
                                        ref={(node) => {
                                            contentRefs.current[index] = node
                                        }}
                                        className="peer-testimonial-card__content"
                                    >
                                        <p
                                            id={quoteId}
                                            className={`peer-testimonial-card__quote${
                                                testimonial.expandable &&
                                                !isExpanded
                                                    ? " peer-testimonial-card__quote--clamped"
                                                    : ""
                                            }${
                                                testimonial.expandable
                                                    ? " peer-testimonial-card__quote--expandable"
                                                    : ""
                                            }`}
                                        >
                                            {testimonial.quote}
                                        </p>
                                        {testimonial.expandable ? (
                                            <button
                                                type="button"
                                                className="peer-testimonial-card__read-more"
                                                aria-expanded={isExpanded}
                                                aria-controls={quoteId}
                                                tabIndex={slot === 0 ? 0 : -1}
                                                onClick={() =>
                                                    setExpandedIndex(
                                                        isExpanded
                                                            ? null
                                                            : index,
                                                    )
                                                }
                                            >
                                                {isExpanded
                                                    ? "Read less"
                                                    : "Read more"}
                                            </button>
                                        ) : null}
                                        <div className="peer-testimonial-card__author">
                                            <div className="peer-testimonial-card__avatar">
                                                <Image
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    fill
                                                    sizes="48px"
                                                />
                                            </div>
                                            <div className="peer-testimonial-card__identity">
                                                <span className="peer-testimonial-card__name">
                                                    {testimonial.name}
                                                </span>
                                                <span className="peer-testimonial-card__role">
                                                    {testimonial.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>

                <div
                    className="peer-testimonials__nav"
                    aria-label="Testimonial navigation"
                >
                    <button
                        type="button"
                        className="peer-testimonials__nav-button"
                        aria-label="Previous testimonial"
                        onClick={showPrevious}
                    >
                        <Image
                            src="/icons/testimonial-chevron-left.svg"
                            alt=""
                            width={18}
                            height={18}
                        />
                    </button>
                    <button
                        type="button"
                        className="peer-testimonials__nav-button"
                        aria-label="Next testimonial"
                        onClick={showNext}
                    >
                        <Image
                            src="/icons/testimonial-chevron-right.svg"
                            alt=""
                            width={18}
                            height={18}
                        />
                    </button>
                </div>

                <p className="sr-only" aria-live="polite" aria-atomic="true">
                    Testimonial {activeIndex + 1} of {TESTIMONIALS.length}:{" "}
                    {TESTIMONIALS[activeIndex].name}
                </p>
            </div>
        </section>
    )
}
