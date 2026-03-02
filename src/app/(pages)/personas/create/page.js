'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePersona() {
    const router = useRouter();
    const [currentMemberId, setCurrentMemberId] = useState(null);

    const [form, setForm] = useState({
        npcId: 'GHOST_1', // 기본값 설정 혹은 선택형
        name: '',
        age: '',
        job: '',
        mbti: '',
        relationship_type: '친구',
        personality_keywords: '',
        speech_style: ''
    });

    useEffect(() => {
        const savedId = localStorage.getItem('memberId');
        if (savedId) setCurrentMemberId(Number(savedId));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentMemberId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const res = await fetch('/api/personas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                memberId: currentMemberId,
                ...form
            }),
        });

        if (res.ok) {
            alert(`${form.name}님이 마을 주민으로 합류했습니다!`);
            router.push('/personas'); // 명부 페이지로 이동
        } else {
            const errData = await res.json();
            alert(`생성 실패: ${errData.error || '이미 인격이 있는 NPC입니다.'}`);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <h2 style={{ borderBottom: '2px solid #2196F3', paddingBottom: '10px' }}>🤝 새 주민 초대</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>

                <label>대상 유령 식별자 (npcId)</label>
                <select value={form.npcId} onChange={e => setForm({...form, npcId: e.target.value})} style={inputStyle}>
                    <option value="GHOST_1">유령 1 (GHOST_1)</option>
                    <option value="GHOST_2">유령 2 (GHOST_2)</option>
                    <option value="GHOST_3">유령 3 (GHOST_3)</option>
                </select>

                <input placeholder="이름" required style={inputStyle} onChange={e => setForm({...form, name: e.target.value})} />
                <input type="number" placeholder="나이" style={inputStyle} onChange={e => setForm({...form, age: e.target.value})} />
                <input placeholder="직업" style={inputStyle} onChange={e => setForm({...form, job: e.target.value})} />

                <label>관계 유형</label>
                <select style={inputStyle} onChange={e => setForm({...form, relationship_type: e.target.value})}>
                    <option value="친구">친구</option>
                    <option value="연인">연인</option>
                    <option value="가족">가족</option>
                    <option value="멘토">멘토</option>
                </select>

                <input placeholder="MBTI" style={inputStyle} onChange={e => setForm({...form, mbti: e.target.value})} />
                <textarea placeholder="성격 키워드 (다정함, 냉철함 등)" style={{...inputStyle, height: '80px'}} onChange={e => setForm({...form, personality_keywords: e.target.value})} />
                <input placeholder="말투 (예: 정중한 존댓말)" style={inputStyle} onChange={e => setForm({...form, speech_style: e.target.value})} />

                <button type="submit" style={submitButtonStyle}>마을로 초대하기</button>
            </form>
        </div>
    );
}

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' };
const submitButtonStyle = { padding: '12px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };