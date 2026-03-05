import { NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// [POST] 새로운 대화 세션 생성
export async function POST(request, { params }) {
    try {
        const { personaId } = params;
        // 백엔드로 요청 (Body가 필요 없다면 빈 객체라도 보냄)
        const res = await fetch(`${BACKEND_URL}/persona/${personaId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) return NextResponse.json({ error: "방 생성 실패" }, { status: res.status });

        const conversationId = await res.json(); // 백엔드에서 준 Long 값
        return NextResponse.json({ conversationId }); // 객체 형태로 리턴
    } catch (error) {
        return NextResponse.json({ error: "통신 에러" }, { status: 500 });
    }
}


// [GET] 특정 페르소나와 나누었던 방 목록 조회
export async function GET(request, { params }) {
    const { personaId } = params;

    try {
        const res = await fetch(`${BACKEND_URL}/api/conversations/persona/${personaId}`, {
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("데이터 조회 실패");

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}