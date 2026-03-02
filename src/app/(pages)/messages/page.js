'use client';
import { useEffect, useState } from 'react';

export default function MessageArchive() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // 모든 메시지 로그 가져오기 (전체 조회용 API)
        fetch('/api/messages')
            .then(res => res.json())
            .then(setMessages)
            .catch(err => console.error("데이터 로딩 실패:", err));
    }, []);

    return (
        <div style={archiveContainerStyle}>
            <h1 style={titleStyle}>📜 마을 전체 대화 로그</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>마을 주민들과 나눈 모든 대화가 기록됩니다.</p>

            <table style={tableStyle}>
                <thead>
                <tr style={headerStyle}>
                    <th style={thStyle}>주민(페르소나)</th>
                    <th style={thStyle}>발신자</th>
                    <th style={thStyle}>내용</th>
                    <th style={thStyle}>기록 시간</th>
                </tr>
                </thead>
                <tbody>
                {messages.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>아직 기록된 대화가 없습니다.</td></tr>
                ) : (
                    messages.map(m => (
                        <tr key={m.id} style={rowStyle}>
                            {/* 페르소나 이름 (백엔드 MessageDto에 personaName이 포함되어 있다고 가정) */}
                            <td style={tdStyle}>
                                <strong>{m.personaName || "알 수 없는 주민"}</strong>
                            </td>

                            {/* 발신자 구분 (USER / AI) */}
                            <td style={tdStyle}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        backgroundColor: m.senderType === 'USER' ? '#E3F2FD' : '#F1F8E9',
                                        color: m.senderType === 'USER' ? '#1976D2' : '#388E3C'
                                    }}>
                                        {m.senderType}
                                    </span>
                            </td>

                            {/* 대화 내용 */}
                            <td style={{ ...tdStyle, color: '#333', lineHeight: '1.4' }}>
                                {m.content}
                            </td>

                            {/* 시간 표시 (createdAt 카멜케이스 주의) */}
                            <td style={{ ...tdStyle, fontSize: '12px', color: '#999' }}>
                                {m.createdAt ? new Date(m.createdAt).toLocaleString() : '-'}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

// --- 스타일 정의 ---
const archiveContainerStyle = { padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' };
const titleStyle = { fontSize: '28px', borderBottom: '4px solid #333', paddingBottom: '10px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
const headerStyle = { backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' };
const thStyle = { textAlign: 'left', padding: '15px', fontWeight: '600' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #eee' };
const rowStyle = { transition: 'background 0.2s' };