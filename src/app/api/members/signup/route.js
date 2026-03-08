import { NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// 회원 가입
export async function POST(request) {
    try {
        const memberData = await request.json();
        console.log('회원가입 요청:', memberData.email);
        console.log('백엔드 URL:', `${BACKEND_URL}/api/members`);

        const res = await fetch(`${BACKEND_URL}/api/members`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(memberData),
        });

        const payload = await parseBackendBodySafely(res);

        if (!res.ok) {
            const errorData = await res.json();
            console.error('백엔드 에러:', errorData);
            return NextResponse.json(errorData, {status: res.status});
            const message = payload?.message || payload?.error || '회원가입 실패. 입력값을 다시 확인하세요.';
        }

        console.log('회원가입 성공:', payload?.email);
        return NextResponse.json(payload ?? {});
    } catch (error) {
        console.error('API 에러:', error);
        const data = await res.json();
        console.log('회원가입 성공:', data.email);
        return NextResponse.json(data);
    }
}