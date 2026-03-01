import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api/members';

// [POST] 회원 가입
export async function POST(request) {
    const memberData = await request.json();

    const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
    });
    const data = await res.json();
    return NextResponse.json(data);
}

// [GET] 회원 정보 상세 조회
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    const res = await fetch(`${BACKEND_URL}/${memberId}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
}