'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PersonaList() {
    const [personas, setPersonas] = useState([]);

    useEffect(() => {
        fetch('/api/personas?memberId=1').then(res => res.json()).then(setPersonas);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>🏡 우리 마을 주민 명부</h1>
            <Link href="/persona/create"><button>+ 새 주민 등록</button></Link>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                {personas.map(p => (
                    <div key={p.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px' }}>
                        <h3>{p.name} ({p.relationship_type})</h3>
                        <p>❤️ 친밀도: {p.intimacy_score} | 🤝 신뢰도: {p.trust_score}</p>
                        <Link href={`/conversation/${p.id}`}><button>대화 연습하기</button></Link>
                    </div>
                ))}
            </div>
        </div>
    );
}