/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/work.",
        destination: "/work",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
