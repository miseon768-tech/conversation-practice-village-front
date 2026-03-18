
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function GET(request, { params }) {
    const { personaId } = params;
    // next/headers의 cookies()로 accessToken을 안전하게 읽기
    const accessToken = cookies().get('accessToken')?.value || '';
    try {
        const res = await fetch(`${BACKEND_URL}/api/personas/${personaId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || '조회 실패' },
                { status: res.status }
            );
        }
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: '백엔드 서버 연결 실패' },
            { status: 500 }
        );
    }
}


