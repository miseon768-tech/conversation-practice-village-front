import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Typewriter from 'typewriter-effect';

const DialogueBox = forwardRef(function DialogueBox({ text, isOpen, onClose, npcName = "주민", personaId }, ref) {
    const [userMessage, setUserMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayText, setDisplayText] = useState(text);
    const inputRef = useRef(null);

    // 외부에서 포커스를 줄 수 있도록 함수 노출
    useImperativeHandle(ref, () => ({
        focusInput: () => {
            inputRef.current?.focus();
        }
    }));

    // 현재 페르소나와 연결된 대화방 ID 저장
    const [conversationId, setConversationId] = useState(null);

    // 대화창이 열릴 때 초기화
    useEffect(() => {
        if (isOpen) {
            setDisplayText(text);
            // 대화창을 닫았다 열었을 때 기존 대화방을 유지하고 싶다면
            // setConversationId(null)을 지워주세요.
            setConversationId(null);

            // 입력 필드에 포커스
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen, text]);

    // ESC 키로 닫기
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscKey);
        }

        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onClose]);

    const handleSendMessage = async () => {
        if (!userMessage.trim() || isLoading) return;

        const messageToSend = userMessage;
        setUserMessage('');
        setIsLoading(true);

        try {
            // 1. 대화방 ID 확보
            let currentId = conversationId;

            if (!currentId) {
                const convRes = await fetch(`/api/conversations/persona/${personaId}`, {
                    method: 'POST',
                    credentials: 'include',
                });
                if (!convRes.ok) {
                    setDisplayText("대화방 세션 확보 실패");
                    setIsLoading(false);
                    return;
                }

                currentId = await convRes.json();
                setConversationId(currentId);
            }

            // 2. 메시지 전송 (백엔드 ChatResponse.reply 필드와 매칭)
            const res = await fetch(`/api/messages/${currentId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageToSend })
            });

            if (res.ok) {
                const data = await res.json();

                // 에러 발생 지점 수정: data.reply가 있으면 사용하고, 53번 줄 중복 코드는 삭제함
                const aiReply = data.reply || "주민이 대답을 마쳤습니다.";
                setDisplayText(aiReply);

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
        <>
            {/* 배경 오버레이 - 클릭 시 닫기 */}
            <div style={overlayStyle} onClick={onClose} />

            {/* 대화창 본체 - 클릭 이벤트 전파 방지 */}
            <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
                <div style={nameTagStyle}>[ {npcName} ]</div>

            <div style={contentStyle}>
                {/* key를 displayText로 주어 텍스트가 바뀔 때마다 다시 타이핑 효과 발생 */}
                <Typewriter
                    key={displayText}
                    options={{
                        strings: [displayText],
                        autoStart: true,
                        delay: 30,
                        cursor: "▼",
                        loop: false,
                        deleteSpeed: Infinity,
                    }}
                />
            </div>

            <div style={inputContainerStyle}>
                <textarea
                    ref={inputRef}
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
        </>
    );
});

export default DialogueBox;

// --- 스타일 정의 (기존과 동일) ---
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 };
const containerStyle = { position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '740px', minHeight: '200px', backgroundColor: 'rgba(20, 20, 25, 0.95)', border: '4px solid #ffffff', borderRadius: '4px', color: '#ffffff', padding: '25px', fontSize: '22px', fontFamily: '"Press Start 2P", monospace', zIndex: 1000, boxShadow: '0 0 0 4px #000, 0 10px 20px rgba(0,0,0,0.5)' };
const nameTagStyle = { color: '#ffcc00', marginBottom: '12px', fontWeight: 'bold', fontSize: '18px' };
const contentStyle = { lineHeight: '1.5', minHeight: '60px', marginBottom: '15px' };
const inputContainerStyle = { display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '10px' };
const inputStyle = { flex: 1, padding: '8px', backgroundColor: '#000', color: '#fff', border: '2px solid #666', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', maxHeight: '60px', resize: 'vertical' };
const buttonStyle = { padding: '8px 20px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', fontFamily: '"Press Start 2P", monospace', fontSize: '14px', fontWeight: 'bold' };
const footerStyle = { fontSize: '12px', color: '#aaa', marginTop: '10px' };