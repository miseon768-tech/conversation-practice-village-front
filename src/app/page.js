'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import DialogueBox from '../components/DialogueBox';

// Phaser는 브라우저 전용이라 dynamic import가 필수입니다.
const PhaserGame = dynamic(() => import('../components/PhaserGame'), { ssr: false });

export default function Home() {
    const [dialogue, setDialogue] = useState({ isVisible: false, text: '' });

    // NPC에게 받은 답변을 화면에 띄우는 함수
    const handleReply = (msg) => {
        setDialogue({ isVisible: true, text: msg });
    };

    const closeDialogue = () => {
        setDialogue({ ...dialogue, isVisible: false });
    };

    return (
        <main style={{
            position: 'relative',
            width: '800px',
            margin: '20px auto',
            backgroundColor: '#000'
        }}>
            <h2 style={{ color: '#fff', textAlign: 'center', padding: '10px' }}>🗣️ AI 대화 연습 마을</h2>

            {/* 게임 컴포넌트 */}
            <PhaserGame onReply={handleReply} />

            {/* 대화창 UI */}
            <DialogueBox
                text={dialogue.text}
                isOpen={dialogue.isVisible}
                onClose={closeDialogue}
            />
        </main>
    );
}