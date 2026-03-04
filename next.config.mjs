/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        return [
            {
                source: '/api/:path*',
                destination: `${backendUrl}/api/:path*`, // Spring Boot 주소
            },
        ];
    },
};

export default nextConfig;