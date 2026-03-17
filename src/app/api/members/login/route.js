import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 로그인 정보
        const memberData = await request.json();
        console.log('로그인 요청:', memberData.email);

        // 백엔드 로그인 API 호출
        const res = await fetch(`${BACKEND_URL}/api/members/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData),
        });

        let data;
        try {
            data = await res.json();
        } catch {
            data = {};
        }

        if (!res.ok) {
            // 백엔드에서 에러 반환 시 그대로 전달
            const message = data?.message || data?.error || '로그인 실패. 이메일 또는 비밀번호를 확인하세요.';
            return NextResponse.json({ error: message }, { status: res.status });
        }

        // 로그인 성공 → 토큰 저장
        const response = NextResponse.json({
            message: '로그인 성공',
            id: data.id,
            nickname: data.nickname
        });

        // 쿠키에 accessToken / refreshToken 저장 (HTTP only)
        response.cookies.set('accessToken', data.accessToken, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 30, // 30분
        });

        response.cookies.set('refreshToken', data.refreshToken, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7일
        });

        console.log('로그인 성공, 쿠키에 토큰 저장 완료');
        return response;

    } catch (error) {
        console.error('로그인 API 에러:', error);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}