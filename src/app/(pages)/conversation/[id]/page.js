'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ChatRoom() {
    const { id: personaId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input) return;
        const userMsg = { sender_type: 'USER', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        const res = await fetch('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ personaId, message: input })
        });
        const aiMsg = await res.json();
        setMessages(prev => [...prev, { sender_type: 'AI', content: aiMsg.content }]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ textAlign: m.sender_type === 'USER' ? 'right' : 'left', margin: '10px' }}>
                        <div style={{ background: m.sender_type === 'USER' ? '#e1f5fe' : '#f5f5f5', display: 'inline-block', padding: '10px', borderRadius: '10px' }}>
                            {m.content}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <input style={{ flex: 1 }} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                <button onClick={handleSend}>전송</button>
            </div>
        </div>
    );
}