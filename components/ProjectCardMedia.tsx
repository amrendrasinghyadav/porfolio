import Image from "next/image"

type ProjectCardMediaProps = {
    images: readonly [string, string, string, string]
    client: string
    title: string
}

export default function ProjectCardMedia({
    images,
    client,
    title,
}: ProjectCardMediaProps) {
    const [leftImage, middleImage, sceneImage, rightImage] = images
    const hasLongTitle = title.length > 28
    const sceneVideo = sceneImage.endsWith(".gif")
        ? sceneImage.replace(/\.gif$/i, ".mp4")
        : null

    return (
        <div className="work-art">
            <span className="folder-bg" aria-hidden="true" />

            <span className="shot shot-left" aria-hidden="true">
                <Image
                    src={leftImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 148px, (max-width: 1050px) 128px, 156px"
                />
            </span>
            <span className="shot shot-middle" aria-hidden="true">
                <Image
                    src={middleImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 148px, (max-width: 1050px) 128px, 156px"
                />
            </span>

            <span className="scene-art project-scene" aria-hidden="true">
                {sceneVideo ? (
                    <video
                        src={sceneVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                    />
                ) : (
                    <Image
                        src={sceneImage}
                        alt=""
                        fill
                        sizes="(max-width: 768px) calc(100vw - 40px), 420px"
                    />
                )}
            </span>

            <span className="shot shot-right" aria-hidden="true">
                <Image
                    src={rightImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 148px, (max-width: 1050px) 128px, 156px"
                />
            </span>

            <span className="folder-front" aria-hidden="true">
                <Image
                    src="/icons/project-folder-front.svg"
                    alt=""
                    fill
                    sizes="(max-width: 768px) calc(100vw - 40px), 420px"
                    unoptimized
                />
            </span>

            <span className="folder-meta">{client}</span>
            <h3
                className={`folder-title${
                    hasLongTitle ? " folder-title--long" : ""
                }`}
            >
                {title}
            </h3>
        </div>
    )
}
