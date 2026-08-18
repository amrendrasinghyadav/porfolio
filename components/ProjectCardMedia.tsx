"use client"

import { useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"

type ProjectCardMediaProps = {
    image: string
    hoverVideo?: string
    videoFit?: "cover" | "contain"
    replayDelayMs?: number
}

export default function ProjectCardMedia({
    image,
    hoverVideo,
    videoFit = "cover",
    replayDelayMs = 0,
}: ProjectCardMediaProps) {
    const mediaRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const ambientVideoRef = useRef<HTMLVideoElement>(null)
    const resetTimerRef = useRef<number | null>(null)
    const replayTimerRef = useRef<number | null>(null)
    const isHoveredRef = useRef(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const reducedMotion = useReducedMotion() ?? false

    const clearResetTimer = useCallback(() => {
        if (resetTimerRef.current === null) return
        window.clearTimeout(resetTimerRef.current)
        resetTimerRef.current = null
    }, [])

    const clearReplayTimer = useCallback(() => {
        if (replayTimerRef.current === null) return
        window.clearTimeout(replayTimerRef.current)
        replayTimerRef.current = null
    }, [])

    const play = useCallback(() => {
        const video = videoRef.current
        if (!video || reducedMotion) return
        const ambientVideo = ambientVideoRef.current

        clearResetTimer()
        clearReplayTimer()
        video.currentTime = 0
        if (ambientVideo) {
            ambientVideo.currentTime = 0
            void ambientVideo.play().catch(() => undefined)
        }
        void video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false))
    }, [clearReplayTimer, clearResetTimer, reducedMotion])

    const stop = useCallback(() => {
        const video = videoRef.current
        if (!video) return
        const ambientVideo = ambientVideoRef.current

        clearResetTimer()
        clearReplayTimer()
        video.pause()
        ambientVideo?.pause()
        setIsPlaying(false)
        resetTimerRef.current = window.setTimeout(() => {
            if (videoRef.current) videoRef.current.currentTime = 0
            if (ambientVideoRef.current) ambientVideoRef.current.currentTime = 0
            resetTimerRef.current = null
        }, 200)
    }, [clearReplayTimer, clearResetTimer])

    const handleEnter = useCallback(() => {
        isHoveredRef.current = true
        play()
    }, [play])

    const handleLeave = useCallback(() => {
        isHoveredRef.current = false
        stop()
    }, [stop])

    const queueReplay = useCallback(() => {
        if (!isHoveredRef.current || reducedMotion) return

        clearReplayTimer()
        replayTimerRef.current = window.setTimeout(() => {
            replayTimerRef.current = null
            if (isHoveredRef.current) play()
        }, replayDelayMs)
    }, [clearReplayTimer, play, reducedMotion, replayDelayMs])

    useEffect(() => {
        if (!hoverVideo) return

        const card = mediaRef.current?.closest<HTMLElement>(".project-card")
        if (!card) return

        card.addEventListener("pointerenter", handleEnter)
        card.addEventListener("pointerleave", handleLeave)
        card.addEventListener("focusin", handleEnter)
        card.addEventListener("focusout", handleLeave)

        return () => {
            card.removeEventListener("pointerenter", handleEnter)
            card.removeEventListener("pointerleave", handleLeave)
            card.removeEventListener("focusin", handleEnter)
            card.removeEventListener("focusout", handleLeave)
            clearResetTimer()
            clearReplayTimer()
            videoRef.current?.pause()
            ambientVideoRef.current?.pause()
        }
    }, [
        clearReplayTimer,
        clearResetTimer,
        handleEnter,
        handleLeave,
        hoverVideo,
    ])

    return (
        <div
            ref={mediaRef}
            className={`project-card__media${hoverVideo ? " project-card__media--video" : ""}${isPlaying ? " is-playing" : ""}`}
        >
            <img src={image} alt="" loading="lazy" />
            {hoverVideo ? (
                <>
                    {videoFit === "contain" ? (
                        <video
                            ref={ambientVideoRef}
                            className="project-card__video project-card__video--ambient"
                            src={hoverVideo}
                            muted
                            playsInline
                            preload="metadata"
                            loop
                            aria-hidden="true"
                        />
                    ) : null}
                    <video
                        ref={videoRef}
                        className={`project-card__video project-card__video--${videoFit}`}
                        src={hoverVideo}
                        muted
                        playsInline
                        preload="metadata"
                        onEnded={queueReplay}
                        aria-hidden="true"
                    />
                </>
            ) : null}
        </div>
    )
}
