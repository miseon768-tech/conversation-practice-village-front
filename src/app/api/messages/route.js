import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// [POST] 특정 페르소나에게 메시지 보내고 AI 응답 받기
export async function POST(request) {
    const { conversationId, message } = await request.json();

    const res = await fetch(`${BACKEND_URL}/${conversationId}`, {
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
    const conversationId = searchParams.get('conversationId');

    const res = await fetch(`${BACKEND_URL}/api/messages/${conversationId}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
}