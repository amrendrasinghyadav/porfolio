import type { Metadata, Viewport } from "next"
import Intro from "@/components/Intro"
import SiteNav from "@/components/SiteNav"
import "./globals.css"

export const metadata: Metadata = {
    title: {
        default: "Portfolio",
        template: "%s — Portfolio",
    },
    description: "Design portfolio.",
    icons: {
        icon: [{ url: "/favicon.gif", type: "image/gif" }],
    },
}

export const viewport: Viewport = {
    themeColor: "#FAFAF8",
    width: "device-width",
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" data-scroll-behavior="smooth">
            <body>
                <div className="content-layer">
                    <SiteNav />
                    {children}
                </div>

                <Intro />
            </body>
        </html>
    )
}
