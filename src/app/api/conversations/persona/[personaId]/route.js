import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// [POST] 새로운 대화 세션 생성
export async function POST(request, { params }) {
    try {
        const { personaId } = params;
        // next/headers의 cookies()로 accessToken을 안전하게 읽기
        const accessToken = cookies().get('accessToken')?.value || '';

        // 백엔드로 요청 (body 불필요)
        const res = await fetch(`${BACKEND_URL}/api/conversations/persona/${personaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            },
        });

        if (!res.ok) return NextResponse.json({ error: "방 생성 실패" }, { status: res.status });

        const conversationId = await res.json(); // 백엔드에서 준 Long 값
        return NextResponse.json(conversationId); // 백엔드에서 {id: ...} 또는 Long 값이 오므로 그대로 전달
    } catch (error) {
        return NextResponse.json({ error: "통신 에러" }, { status: 500 });
    }
}


// [GET] 특정 페르소나와 나누었던 방 목록 조회
export async function GET(request, { params }) {
    const { personaId } = params;

    try {
        // next/headers의 cookies()로 accessToken을 안전하게 읽기
        const accessToken = cookies().get('accessToken')?.value || '';

        const res = await fetch(`${BACKEND_URL}/api/conversations/persona/${personaId}`, {
            cache: 'no-store',
            headers: {
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            },
        });

        if (!res.ok) throw new Error("데이터 조회 실패");

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}