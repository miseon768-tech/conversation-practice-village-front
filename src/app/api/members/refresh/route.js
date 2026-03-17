import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function POST() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: 'Refresh token이 없습니다.' }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/members/refresh`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${refreshToken}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json({ error: data?.message || data?.error || '토큰 재발급 실패' }, { status: res.status });
    }

    // 새 토큰 쿠키에 저장
    const response = NextResponse.json({
        message: '토큰 재발급 성공',
        id: data.id,
        nickname: data.nickname,
    });
    response.cookies.set('accessToken', data.accessToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 30,
    });
    response.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });
    return response;
}

