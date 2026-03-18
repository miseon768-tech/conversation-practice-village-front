
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function GET(request) {
    try {
        // 현재 로그인한 사용자의 ID를 쿼리 파라미터에서 가져오기
        const { searchParams } = new URL(request.url);
        const memberId = searchParams.get('memberId');

        if (!memberId) {
            return NextResponse.json(
                { error: "memberId가 필요합니다" },
                { status: 400 }
            );
        }

        // next/headers의 cookies()는 Promise를 반환할 수 있으므로 await로 해제
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value || '';

        const res = await fetch(`${BACKEND_URL}/api/personas/member/${memberId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || "조회 실패" },
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

export async function POST(request) {
    try {
        const body = await request.json();

        // 모든 데이터(npcId 포함)를 백엔드로 전송
        const res = await fetch(`${BACKEND_URL}/api/personas`, {
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