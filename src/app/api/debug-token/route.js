import { NextResponse } from 'next/server';

export async function GET(request) {
    const cookie = request.headers.get('cookie') || '';
    let accessToken = '';
    cookie.split(';').forEach((c) => {
        const [key, value] = c.trim().split('=');
        if (key === 'accessToken') accessToken = value;
    });
    return NextResponse.json({ accessToken });
}
