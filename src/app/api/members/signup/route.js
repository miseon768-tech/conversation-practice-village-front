import { NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

async function parseBackendBodySafely(res) {
    const text = await res.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
}

// 회원 가입
export async function POST(request) {
    try {
        const memberData = await request.json();
        console.log('회원가입 요청:', memberData.email);
        console.log('백엔드 URL:', `${BACKEND_URL}/api/members`);

        const res = await fetch(`${BACKEND_URL}/api/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData),
        });

        const payload = await parseBackendBodySafely(res);

        if (!res.ok) {
            const message = payload?.message || payload?.error || '회원가입 실패. 입력값을 다시 확인하세요.';
            console.error('백엔드 에러:', payload);
            return NextResponse.json({ error: message, backend: payload }, { status: res.status });
        }

        console.log('회원가입 성공:', payload?.email);
        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}