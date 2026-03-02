import { NextResponse } from 'next/server';
const BACKEND_URL = 'http://localhost:8080/api/conversations';

// [POST] 새로운 대화 세션 생성
export async function POST(request, { params }) {
    try {
        // 1. 폴더 이름 [personaId] 덕분에 URL의 '1'을 여기서 바로 꺼낼 수 있습니다.
        const { personaId } = params;

        // 2. 프론트(Phaser)에서 보낸 데이터를 읽습니다. (memberId가 들어있어야 함)
        const body = await request.json();

        // 3. 백엔드(8080) 명세서 주소로 요청을 보냅니다.
        const res = await fetch(`${BACKEND_URL}/persona/${personaId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body), // { memberId: ... } 가 백엔드로 전달됨
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json({ error: "백엔드 응답 에러", detail: errorText }, { status: res.status });
        }

        const data = await res.json(); // 생성된 conversationId 등이 담긴 응답
        return NextResponse.json(data);
    } catch (error) {
        console.error("API Route 에러:", error);
        return NextResponse.json({ error: "서버 통신 실패" }, { status: 500 });
    }
}


// [GET] 특정 페르소나와 나누었던 방 목록 조회
export async function GET(request, { params }) {
    const { personaId } = params;

    try {
        const res = await fetch(`${BACKEND_URL}/persona/${personaId}`, {
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("데이터 조회 실패");

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}