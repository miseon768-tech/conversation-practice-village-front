'use client';
import { useState } from 'react';

export default function CreatePersona() {
    const [form, setForm] = useState({
        name: '', age: '', job: '', mbti: '',
        relationship_type: '친구', personality_keywords: '', speech_style: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/personas', {
            method: 'POST',
            body: JSON.stringify({ memberId: 1, ...form }), // memberId는 실제 로그인 정보 사용
        });
        if (res.ok) {
            alert(`${form.name}님이 마을 주민으로 합류했습니다!`);
            window.location.href = '/persona';
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
            <h2>🤝 새 주민 초대 (대화 상대 등록)</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input placeholder="이름" required onChange={e => setForm({...form, name: e.target.value})} />
                <input type="number" placeholder="나이" onChange={e => setForm({...form, age: e.target.value})} />
                <input placeholder="직업" onChange={e => setForm({...form, job: e.target.value})} />
                <select onChange={e => setForm({...form, relationship_type: e.target.value})}>
                    <option value="친구">친구</option>
                    <option value="연인">연인</option>
                    <option value="가족">가족</option>
                    <option value="멘토">멘토</option>
                </select>
                <input placeholder="MBTI" onChange={e => setForm({...form, mbti: e.target.value})} />
                <textarea placeholder="성격 키워드 (예: 다정함, 냉철함)" onChange={e => setForm({...form, personality_keywords: e.target.value})} />
                <input placeholder="말투 (예: 반말, 존댓말)" onChange={e => setForm({...form, speech_style: e.target.value})} />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none' }}>마을로 초대하기</button>
            </form>
        </div>
    );
}