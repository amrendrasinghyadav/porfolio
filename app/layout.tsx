import type { Metadata, Viewport } from "next"
import { Instrument_Serif, Inter } from "next/font/google"
import { Suspense } from "react"
import BackgroundGrid from "@/components/BackgroundGrid"
import SiteNav from "@/components/SiteNav"
import SiteFooter from "@/components/SiteFooter"
import Intro from "@/components/Intro"
import "./globals.css"

const instrumentSerif = Instrument_Serif({
    weight: "400",
    style: "normal",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-instrument-serif",
})

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
})

export const metadata: Metadata = {
    // TODO: replace with your own name / title.
    // "%s" is filled by each page's own title (see app/work, app/about).
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
    themeColor: "#F8F6F4",
    width: "device-width",
    initialScale: 1,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            className={`${instrumentSerif.variable} ${inter.variable}`}
        >
            <body>
                {/* Permanent background system — mounted once, fixed behind
                    all content. Never place page content inside it. */}
                <BackgroundGrid />

                {/* Scrolling content layer. Nav + footer are shared across
                    every route; each page supplies its own <main>. The
                    background never needs to change. */}
                <div className="content-layer">
                    <SiteNav />
                    {children}
                    <SiteFooter />
                </div>

                {/* Cinematic hero intro. Intro decides whether the initial URL
                    is the hero route; every other route renders no overlay. */}
                <Suspense fallback={null}>
                    <Intro />
                </Suspense>
            </body>
        </html>
    )
}
