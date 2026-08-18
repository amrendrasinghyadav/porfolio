import type { Metadata } from "next"
import PlaygroundCanvas from "@/components/PlaygroundCanvas"

export const metadata: Metadata = {
    title: "Playground",
}

export default function PlaygroundPage() {
    return (
        <main
            className="playground-page"
            aria-labelledby="playground-title"
        >
            <h1 id="playground-title" className="sr-only">
                Playground
            </h1>
            <PlaygroundCanvas />
        </main>
    )
}
