'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DialogueBox from '../components/DialogueBox';

// Phaser는 브라우저에서만 돌아가므로 dynamic import를 사용합니다.
const PhaserGame = dynamic(() => import('../components/PhaserGame'), { ssr: false });

export default function Home() {
    const router = useRouter();

    // 상태 관리
    const [mode, setMode] = useState('EXPLORE'); // EXPLORE, CREATE, TALK
    const [targetPersonaId, setTargetPersonaId] = useState(null);
    const [targetNpcId, setTargetNpcId] = useState(null);
    const [dialogueText, setDialogueText] = useState('');
    const [currentMemberId, setCurrentMemberId] = useState(null);
    const [nickname, setNickname] = useState('');

    // 주민 정보 저장용
    const [formData, setFormData] = useState({
        name: '', age: '', job: '', mbti: '',
        relationship_type: '', personality_keywords: '', speech_style: ''
    });

    // 1. 로그인 체크
    useEffect(() => {
        const savedMemberId = localStorage.getItem('memberId');
        const savedNickname = localStorage.getItem('nickname');
        if (!savedMemberId) {
            router.replace('/members/login');
        } else {
            setCurrentMemberId(Number(savedMemberId));
            setNickname(savedNickname);
        }
    }, [router]);

    // 2. 상호작용 로직 (Phaser에서 스페이스바 누르면 실행됨)
    const handleInteraction = useCallback(async (personaId, npcId) => {
        console.log("상호작용 감지 - 페르소나ID:", personaId, "NPC ID:", npcId);
        setTargetNpcId(npcId);

        if (personaId) {
            // ✅ 이미 인격이 있는 경우 -> 대화창 오픈
            setTargetPersonaId(personaId);
            setMode('TALK');

            try {
                const res = await fetch(`http://localhost:3000/api/personas/${personaId}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData(data);
                    setDialogueText(`${data.name}님, 오늘 날씨가 참 좋네요!`);
                }
            } catch (err) {
                setDialogueText("주민이 수줍음을 타는지 대답이 없네요...");
            }
        } else {
            // ❌ 인격이 없는 경우 -> 생성창 오픈
            setFormData({ name: '', age: '', job: '', mbti: '', relationship_type: '', personality_keywords: '', speech_style: '' });
            setMode('CREATE');
        }
    }, []);

    // 3. 새 주민 등록 함수
    const onCreatePersona = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/personas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memberId: currentMemberId,
                    npcId: targetNpcId,
                    ...formData
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "등록 실패");

            alert("새로운 주민이 마을에 합류했습니다!");
            window.location.reload(); // 월드 갱신을 위해 새로고침
        } catch (err) {
            alert(err.message);
        }
    };

    if (!currentMemberId) return null;

    return (
        <main style={{ position: 'fixed', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
            {/* 상단바 */}
            <div style={topBarStyle}>🏡 {nickname}님의 마을</div>

            {/* 게임 화면 */}
            <PhaserGame onSpacePress={handleInteraction} memberId={currentMemberId} />

            {/* 주민 생성 창 (모달) */}
            {mode === 'CREATE' && (
                <div style={villageContainerStyle}>
                    <h2 style={villageTitleStyle}>🌿 새로운 주민 프로필 [{targetNpcId}]</h2>
                    <form onSubmit={onCreatePersona} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input placeholder="이름" required style={villageInputStyle} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input placeholder="나이" type="number" style={villageInputStyle} onChange={e => setFormData({...formData, age: e.target.value})} />
                        <input placeholder="직업" required style={villageInputStyle} onChange={e => setFormData({...formData, job: e.target.value})} />
                        <input placeholder="MBTI (예: ENFP)" required style={villageInputStyle} onChange={e => setFormData({...formData, mbti: e.target.value})} />
                        <input placeholder="나와의 관계 (예: 소꿉친구)" required style={villageInputStyle} onChange={e => setFormData({...formData, relationship_type: e.target.value})} />
                        <input placeholder="말투 힌트" required style={villageInputStyle} onChange={e => setFormData({...formData, speech_style: e.target.value})} />
                        <textarea placeholder="성격 특징을 입력하세요" style={{...villageInputStyle, height: '60px'}} onChange={e => setFormData({...formData, personality_keywords: e.target.value})} />
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button type="submit" style={villageSubmitButtonStyle}>주민으로 확정 ✨</button>
                            <button type="button" onClick={() => setMode('EXPLORE')} style={{...villageSubmitButtonStyle, backgroundColor: '#444'}}>취소</button>
                        </div>
                    </form>
                </div>
            )}

            {/* 대화창 */}
            <DialogueBox
                text={dialogueText}
                isOpen={mode === 'TALK'}
                onClose={() => setMode('EXPLORE')}
                npcName={formData.name || "주민"}
                personaId={targetPersonaId}
            />
        </main>
    );
}

// 간단 스타일링
const topBarStyle = { position: 'absolute', top: 20, right: 20, color: 'white', zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.6)', padding: '10px 20px', borderRadius: '30px' };
const villageContainerStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '350px', backgroundColor: '#1b261b', border: '3px solid #4caf50', padding: '20px', zIndex: 2000, borderRadius: '15px', color: 'white' };
const villageTitleStyle = { fontSize: '18px', color: '#4caf50', marginBottom: '15px', textAlign: 'center' };
const villageInputStyle = { width: '100%', backgroundColor: '#000', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '5px' };
const villageSubmitButtonStyle = { flex: 1, padding: '12px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };