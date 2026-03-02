import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api/personas';

export async function POST(request) {
    try {
        const { memberId, ...personaData } = await request.json();

        // 백엔드 로그에 맞춰 경로를 조정했습니다.
        const res = await fetch(`${BACKEND_URL}/member/${memberId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personaData),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || "백엔드 생성 실패" }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "서버 연결에 실패했습니다." }, { status: 500 });
    }
}