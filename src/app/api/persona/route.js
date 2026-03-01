import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api/personas';

// [POST] 페르소나 생성
export async function POST(request) {
    const { memberId, ...personaData } = await request.json();

    const res = await fetch(`${BACKEND_URL}/member/${memberId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personaData),
    });
    const data = await res.json();
    return NextResponse.json(data);
}

// [GET] 특정 회원(memberId)의 모든 페르소나 조회 또는 단건 조회
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const personaId = searchParams.get('personaId');

    // memberId가 있으면 목록 조회, personaId가 있으면 상세 조회
    const targetUrl = memberId ? `${BACKEND_URL}/member/${memberId}` : `${BACKEND_URL}/${personaId}`;

    const res = await fetch(targetUrl, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
}