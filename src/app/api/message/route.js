import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api/messages';

// [POST] 특정 페르소나에게 메시지 보내고 AI 응답 받기
export async function POST(request) {
    const { personaId, message } = await request.json();

    const res = await fetch(`${BACKEND_URL}/persona/${personaId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });
    const data = await res.json();
    return NextResponse.json(data);
}

// [GET] 특정 페르소나와 관련된 모든 메시지 조회
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get('personaId');

    const res = await fetch(`${BACKEND_URL}/persona/${personaId}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
}