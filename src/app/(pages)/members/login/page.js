'use client';

import { useState } from 'react';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. 내가 만든 Next.js API(/api/members/login)를 호출합니다.
            // 상대 경로 사용으로 EC2 환경에서도 동작
            const res = await fetch('/api/members/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok && data.id) {
                localStorage.setItem('memberId', data.id);
                localStorage.setItem('nickname', data.nickname);
                alert(`${data.nickname}님, 환영합니다!`);
                window.location.href = '/';
            } else {
                // 에러 메시지 표시
                const errorMsg = data.error || data.message || '로그인 실패. 이메일 또는 비밀번호를 확인하세요.';
                setError(errorMsg);
                console.error('로그인 실패:', data);
            }
        } catch (err) {
            setError('서버 연결 실패. 잠시 후 다시 시도하세요.');
            console.error('로그인 에러:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
            <h1>🔑 로그인</h1>

            {/* 에러 메시지 표시 */}
            {error && (
                <div style={{
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderRadius: '5px',
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="email"
                    placeholder="이메일"
                    required
                    style={{ padding: '10px' }}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    required
                    style={{ padding: '10px' }}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px',
                        backgroundColor: loading ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '로그인 중...' : '입장하기'}
                </button>
            </form>
            <p style={{ marginTop: '20px', fontSize: '14px' }}>
                처음 오셨나요? <a href="/members/signup">주민 등록하기</a>
            </p>
        </div>
    );
}