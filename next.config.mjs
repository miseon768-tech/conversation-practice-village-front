/** @type {import('next').NextConfig} */
const nextConfig = {
    // Docker standalone 출력 모드 활성화
    output: 'standalone',

    async rewrites() {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        return [
            {
                source: '/api/:path*',
                destination: `${backendUrl}/api/:path*`, // Spring Boot 주소
            },
        ];
    },
};

export default nextConfig;