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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(memberData),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('백엔드 에러:', data);
            const message = data?.message || data?.error || '로그인 실패. 이메일 또는 비밀번호를 확인하세요.';
            return NextResponse.json({ error: message }, { status: res.status });
        }

        console.log('로그인 성공:', data.email);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}