'use client';
import { useEffect, useState } from 'react';

export default function MessageArchive() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // 모든 메시지 로그 가져오기
        fetch('/api/messages').then(res => res.json()).then(setMessages);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>📜 대화 기록 보관소</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '10px' }}>보낸 사람</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>내용</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>시간</th>
                </tr>
                </thead>
                <tbody>
                {messages.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>
                            <span style={{ color: m.sender_type === 'USER' ? 'blue' : 'green' }}>{m.sender_type}</span>
                        </td>
                        <td style={{ padding: '10px' }}>{m.content}</td>
                        <td style={{ padding: '10px', fontSize: '12px', color: '#999' }}>{new Date(m.created_at).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}