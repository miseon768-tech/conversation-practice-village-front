'use client';

import { useState } from 'react';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();

        // 1. 내가 만든 Next.js API(/api/members/login)를 호출합니다.
        const res = await fetch('/api/members/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            const member = await res.json();

            // ⭐️ 중요: 로그인 성공 시 유저 정보를 브라우저(localStorage)에 저장합니다.
            // 이렇게 해야 나중에 '내 정보'나 '내 주민 목록'을 불러올 수 있어요!
            localStorage.setItem('memberId', member.id);
            localStorage.setItem('nickname', member.nickname);

            alert(`${member.nickname}님, 환영합니다!`);
            window.location.href = '/';
        } else {
            alert('이메일 또는 비밀번호가 일치하지 않습니다.');
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
            <h1>🔑 로그인</h1>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="email"
                    placeholder="이메일"
                    required
                    style={{ padding: '10px' }}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    required
                    style={{ padding: '10px' }}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                />
                <button
                    type="submit"
                    style={{
                        padding: '12px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    입장하기
                </button>
            </form>
            <p style={{ marginTop: '20px', fontSize: '14px' }}>
                처음 오셨나요? <a href="/members/signup">주민 등록하기</a>
            </p>
        </div>
    );
}