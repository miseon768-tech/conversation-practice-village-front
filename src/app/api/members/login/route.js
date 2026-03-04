import { NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';


// 로그인
export async function POST(request) {
    const memberData = await request.json();

    const res = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
    });
    const data = await res.json();
    return NextResponse.json(data);
}