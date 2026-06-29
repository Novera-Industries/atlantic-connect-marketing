/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-hosted VPS target (NOT Vercel): emit a standalone Node server.
  output: "standalone",
  // Pin the file-tracing root to this project (a stray lockfile lives in $HOME).
  outputFileTracingRoot: import.meta.dirname,
  reactStrictMode: true,
  poweredByHeader: false,
  // ESLint is intentionally not part of the prod build gate here; we run typecheck instead.
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ["image/avif", "image/webp"],
    // Temporary placeholder photography only (verified hosts). Real commissioned
    // shoot drops in over these slots at content time — see lib/media.ts.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        // Long-cache the static brand frame sequences / posters (nginx will mirror this).
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
