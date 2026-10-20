import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old room-era URLs keep working.
  async redirects() {
    return [
      { source: "/computer", destination: "/work", permanent: true },
      { source: "/computer/experience", destination: "/work/resume", permanent: true },
      { source: "/computer/:path*", destination: "/work/:path*", permanent: true },
      // About Me merged into the computer's Home page.
      { source: "/about", destination: "/work", permanent: true },
      { source: "/work/about", destination: "/work", permanent: true },
      { source: "/creative/:path*", destination: "/work/gallery", permanent: true },
      { source: "/soccer", destination: "/barcelona", permanent: true },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
