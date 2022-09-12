/** @type {import('next').NextConfig} */
const { withPlausibleProxy } = require('next-plausible');

module.exports = withPlausibleProxy()({
    // ...your next js config, if any
    reactStrictMode: true,
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
    // FROM: https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    images: {
        domains: ['merge-nft.s3.us-west-2.amazonaws.com'],
    },
});
