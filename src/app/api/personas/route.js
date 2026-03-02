import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api/personas';

export async function POST(request) {
    try {
        const body = await request.json();

        // 모든 데이터(npcId 포함)를 백엔드로 전송
        const res = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            // 백엔드의 Unique 제약 조건 위반 에러 등을 처리
            return NextResponse.json(
                { error: data.message || "생성에 실패했습니다." },
                { status: res.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Fetch Error:", error);
        return NextResponse.json(
            { error: "백엔드 서버 연결 실패" },
            { status: 500 }
        );
    }
}