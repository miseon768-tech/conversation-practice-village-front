import { NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';


// 로그인
export async function POST(request) {
    try {
        const memberData = await request.json();
        console.log('로그인 요청:', memberData.email);
        console.log('백엔드 URL:', `${BACKEND_URL}/api/members/login`);

        const res = await fetch(`${BACKEND_URL}/api/members/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('백엔드 에러:', errorData);
            return NextResponse.json(errorData, { status: res.status });
        }

        const data = await res.json();
        console.log('로그인 성공:', data.email);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}