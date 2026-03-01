'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ConversationList() {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        // 진행 중인 모든 대화 세션 가져오기
        fetch('/api/conversations').then(res => res.json()).then(setConversations);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>💬 대화 중인 주민들</h1>
            <p>연습이 중단된 대화를 이어서 할 수 있습니다.</p>
            <div style={{ marginTop: '20px' }}>
                {conversations.length > 0 ? conversations.map(c => (
                    <Link href={`/conversation/${c.persona_id}`} key={c.id} style={{ textDecoration: 'none', color: 'black' }}>
                        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong>주민 ID: {c.persona_id}</strong>와(과)의 대화
                                <div style={{ fontSize: '12px', color: '#888' }}>시작일: {new Date(c.created_at).toLocaleDateString()}</div>
                            </div>
                            <span>➡️ 이어서 하기</span>
                        </div>
                    </Link>
                )) : <p>아직 진행 중인 대화가 없습니다. 주민을 찾아가보세요!</p>}
            </div>
        </div>
    );
}