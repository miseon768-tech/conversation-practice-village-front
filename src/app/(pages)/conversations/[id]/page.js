'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ChatPage() {
    const params = useParams(); // URL에서 conversationId 추출
    const conversationId = params.id;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // 1. 방에 입장하자마자 기존 대화 내역 불러오기
        fetch(`/api/messages/${conversationId}`)
            .then(res => res.json())
            .then(setMessages);
    }, [conversationId]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // 2. 채팅 메시지 전송 (현재 방 ID 사용)
        const res = await fetch(`/api/messages/${conversationId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
        });

        const data = await res.json();

        // 내 메시지와 AI 응답을 화면에 업데이트
        setMessages([...messages,
            { senderType: 'USER', content: input },
            { senderType: 'AI', content: data.aiReply }
        ]);
        setInput('');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>💬 대화방 #{conversationId}</h2>
            <div style={chatBoxStyle}>
                {messages.map((m, i) => (
                    <div key={i} style={{ textAlign: m.senderType === 'USER' ? 'right' : 'left' }}>
                        <p><strong>{m.senderType}:</strong> {m.content}</p>
                    </div>
                ))}
            </div>
            <input value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={sendMessage}>전송</button>
        </div>
    );
}

const chatBoxStyle = { height: '400px', border: '1px solid #ccc', overflowY: 'scroll', marginBottom: '10px', padding: '10px' };