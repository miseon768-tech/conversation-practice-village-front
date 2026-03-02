'use client'; // 브라우저에서 동작하는 컴포넌트임을 명시
import { useState } from 'react';

export default function SignupPage() {
    // 1. 입력 데이터를 관리할 상태(State)
    const [form, setForm] = useState({
        email: '',
        password: '',
        nickname: ''
    });

    // 2. 가입 버튼 클릭 시 실행될 함수
    const handleSignup = async (e) => {
        e.preventDefault(); // 페이지 새로고침 방지

        // 우리가 만든 Next.js API(/api/members)를 호출합니다.
        const res = await fetch('/api/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            alert('주민 등록이 완료되었습니다! 로그인 페이지로 이동합니다.');
            window.location.href = '/members/login'; // 성공 시 로그인 페이지로 이동
        } else {
            alert('등록에 실패했습니다. 다시 확인해주세요.');
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1>🏡 새로운 주민 등록</h1>
            <p>마을에 오신 것을 환영합니다!</p>

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                <input
                    type="text"
                    placeholder="닉네임"
                    required
                    style={{ padding: '10px' }}
                    onChange={(e) => setForm({...form, nickname: e.target.value})}
                />
                <button
                    type="submit"
                    style={{ padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    마을 주민으로 등록하기
                </button>
            </form>

            <p style={{ marginTop: '20px', fontSize: '14px' }}>
                이미 계정이 있으신가요? <a href="/members/login">로그인하기</a>
            </p>
        </div>
    );
}