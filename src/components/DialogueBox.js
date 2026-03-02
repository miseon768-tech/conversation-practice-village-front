import Typewriter from 'typewriter-effect';

export default function DialogueBox({ text, isOpen, onClose, npcName = "주민" }) {
    if (!isOpen) return null;

    return (
        <div
            style={containerStyle}
            onClick={onClose}
        >
            {/* 이름표 영역 */}
            <div style={nameTagStyle}>
                [ {npcName} ]
            </div>

            {/* 텍스트 영역 */}
            <div style={contentStyle}>
                <Typewriter
                    options={{
                        strings: [text],
                        autoStart: true,
                        delay: 30, // 약간 더 빠르게 조절 (유저가 답답하지 않게)
                        cursor: "▼", // 포켓몬 대화창 특유의 화살표 느낌
                    }}
                />
            </div>

            <div style={footerStyle}>
                클릭하여 닫기
            </div>
        </div>
    );
}

// 스타일 정의 (가독성을 위해 분리)
const containerStyle = {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%', // 고정 px보다 유동적으로
    maxWidth: '740px',
    minHeight: '130px',
    backgroundColor: 'rgba(20, 20, 25, 0.95)',
    border: '4px solid #ffffff',
    borderRadius: '4px', // 둥근 것보다 각진 게 레트로 느낌이 납니다
    color: '#ffffff',
    padding: '25px',
    fontSize: '22px',
    fontFamily: '"Press Start 2P", monospace', // 구글 폰트에서 픽셀 폰트 쓰면 대박입니다
    zIndex: 1000,
    cursor: 'pointer',
    boxShadow: '0 0 0 4px #000, 0 10px 20px rgba(0,0,0,0.5)' // 이중 테두리 효과
};

const nameTagStyle = { color: '#ffcc00', marginBottom: '12px', fontWeight: 'bold', fontSize: '18px' };
const contentStyle = { lineHeight: '1.5' };
const footerStyle = { position: 'absolute', bottom: '10px', right: '20px', fontSize: '14px', color: '#aaa', animation: 'blink 1s infinite' };