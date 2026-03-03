import { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';

export default function DialogueBox({ text, isOpen, onClose, npcName = "주민", personaId }) {
    const [userMessage, setUserMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayText, setDisplayText] = useState(text);

    // 현재 페르소나와 연결된 대화방 ID 저장
    const [conversationId, setConversationId] = useState(null);

    // 대화창이 열릴 때 초기화
    useEffect(() => {
        if (isOpen) {
            setDisplayText(text);
            // 대화창을 닫았다 열었을 때 기존 대화방을 유지하고 싶다면
            // setConversationId(null)을 지워주세요.
            setConversationId(null);
        }
    }, [isOpen, text]);

    const handleSendMessage = async () => {
        if (!userMessage.trim() || isLoading) return;

        const messageToSend = userMessage;
        setUserMessage('');
        setIsLoading(true);

        try {
            // 1. 대화방 ID 확보 (기존 로직 동일)
            let currentId = conversationId;

            if (!currentId) {
                const convRes = await fetch(`http://localhost:8080/api/conversations/persona/${personaId}`, {
                    method: 'POST',
                });
                if (!convRes.ok) throw new Error("대화방 세션 확보 실패");

                currentId = await convRes.json();
                setConversationId(currentId);
            }

            // 2. 메시지 전송 (백엔드 컨트롤러 주소 /api/messages/{id} 에 맞춤)
            const res = await fetch(`http://localhost:8080/api/messages/${currentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageToSend })
            });

            if (res.ok) {
                const data = await res.json();
                // 백엔드 ChatResponse의 필드명(예: answer 또는 content)에 맞춰 수정하세요.
                // 아래는 일반적인 관례인 .answer 또는 .content를 예시로 둡니다.
                setDisplayText(data.answer || data.content || data.response || "주민이 대답을 마쳤습니다.");
            } else {
                setDisplayText("아, 말이 안 통하네요... (서버 응답 에러)");
            }
        } catch (err) {
            console.error("메시지 전송 오류:", err);
            setDisplayText("주민과의 통신에 문제가 생겼어요.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
            <div style={nameTagStyle}>[ {npcName} ]</div>

            <div style={contentStyle}>
                <Typewriter
                    key={displayText}
                    options={{
                        strings: [displayText],
                        autoStart: true,
                        delay: 30,
                        cursor: "▼",
                    }}
                />
            </div>

            <div style={inputContainerStyle}>
                <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isLoading ? "생각 중..." : "주민에게 말을 걸어보세요..."}
                    style={inputStyle}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSendMessage}
                    style={{...buttonStyle, opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}}
                    disabled={isLoading}
                >
                    {isLoading ? '...' : '전송'}
                </button>
            </div>

            <div style={footerStyle}>닫기: ESC 또는 바깥 클릭</div>
        </div>
    );
}

// --- 스타일 정의 생략 ---
const containerStyle = { position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '740px', minHeight: '200px', backgroundColor: 'rgba(20, 20, 25, 0.95)', border: '4px solid #ffffff', borderRadius: '4px', color: '#ffffff', padding: '25px', fontSize: '22px', fontFamily: '"Press Start 2P", monospace', zIndex: 1000, boxShadow: '0 0 0 4px #000, 0 10px 20px rgba(0,0,0,0.5)' };
const nameTagStyle = { color: '#ffcc00', marginBottom: '12px', fontWeight: 'bold', fontSize: '18px' };
const contentStyle = { lineHeight: '1.5', minHeight: '60px', marginBottom: '15px' };
const inputContainerStyle = { display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '10px' };
const inputStyle = { flex: 1, padding: '8px', backgroundColor: '#000', color: '#fff', border: '2px solid #666', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', maxHeight: '60px', resize: 'vertical' };
const buttonStyle = { padding: '8px 20px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', fontFamily: '"Press Start 2P", monospace', fontSize: '14px', fontWeight: 'bold' };
const footerStyle = { fontSize: '12px', color: '#aaa', marginTop: '10px' };