'use client';
import { useState } from 'react';

export default function Signup() {
    const [form, setForm] = useState({ email: '', nickname: '', password: '' });

    const handleSignup = async () => {
        const res = await fetch('/api/members', {
            method: 'POST',
            body: JSON.stringify(form),
        });
        if (res.ok) {
            alert('마을 주민으로 등록되었습니다! 로그인을 해주세요.');
            window.location.href = '/member/login';
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>🏠 마을 주민 센터 등록</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
                <input placeholder="이메일" onChange={e => setForm({...form, email: e.target.value})} />
                <input placeholder="닉네임" onChange={e => setForm({...form, nickname: e.target.value})} />
                <input type="password" placeholder="비밀번호" onChange={e => setForm({...form, password: e.target.value})} />
                <button onClick={handleSignup} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>가입하기</button>
            </div>
        </div>
    );
}