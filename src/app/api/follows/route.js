import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// [POST] 팔로우 (RequestParam 방식)
export async function POST(request) {
    const { followerId, followingId } = await request.json();

    const res = await fetch(`${BACKEND_URL}?followerId=${followerId}&followingId=${followingId}`, {
        method: 'POST',
    });
    return NextResponse.json({ success: res.ok });
}

// [DELETE] 언팔로우
export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get('followerId');
    const followingId = searchParams.get('followingId');

    const res = await fetch(`${BACKEND_URL}?followerId=${followerId}&followingId=${followingId}`, {
        method: 'DELETE',
    });
    return NextResponse.json({ success: res.ok });
}