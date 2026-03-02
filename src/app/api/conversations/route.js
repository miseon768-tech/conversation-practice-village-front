import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api/conversations';

// [POST] 특정 페르소나와 새로운 대화 시작 및 메시지 전송
export async function POST(request) {
    const { personaId} = await request.json();

    const res = await fetch(`${BACKEND_URL}/persona/${personaId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data);
}

// [GET] 특정 대화 세션의 모든 메시지 조회
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get('personaId');

    const res = await fetch(`${BACKEND_URL}/persona/${personaId}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
}