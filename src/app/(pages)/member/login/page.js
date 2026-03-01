'use client';
import { useState } from 'react';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });

    const handleLogin = async () => {
        const res = await fetch('/api/members/login', { // 백엔드 로그인 엔드포인트에 맞춤
            method: 'POST',
            body: JSON.stringify(form),
        });
        if (res.ok) {
            alert('마을에 입장하셨습니다!');
            window.location.href = '/persona'; // 입장 후 주민 목록으로 이동
        } else {
            alert('이메일 또는 비밀번호를 확인해주세요.');
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>🚪 마을 입구 (로그인)</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
                <input placeholder="이메일" onChange={e => setForm({...form, email: e.target.value})} />
                <input type="password" placeholder="비밀번호" onChange={e => setForm({...form, password: e.target.value})} />
                <button onClick={handleLogin} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>입장하기</button>
                <p style={{ fontSize: '14px' }}>처음 오셨나요? <a href="/member/signup">주민 등록하기</a></p>
            </div>
        </div>
    );
}