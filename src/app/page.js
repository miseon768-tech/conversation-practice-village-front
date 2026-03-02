'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DialogueBox from '../components/DialogueBox';

const PhaserGame = dynamic(() => import('../components/PhaserGame'), { ssr: false });

export default function Home() {
    const router = useRouter();
    const [mode, setMode] = useState('EXPLORE');
    const [targetPersonaId, setTargetPersonaId] = useState(null);
    const [targetNpcId, setTargetNpcId] = useState(null); // ⭐️ 어떤 NPC(사람)와 접촉했는지 저장
    const [dialogueText, setDialogueText] = useState('');

    const [currentMemberId, setCurrentMemberId] = useState(null);
    const [nickname, setNickname] = useState('');

    // 인격 생성 폼 데이터
    const [formData, setFormData] = useState({
        name: '', job: '', mbti: 'INFJ', speechStyle: ''
    });

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

    // ⭐️ Phaser에서 personaId와 npcId를 모두 받아오도록 수정
    const handleInteraction = (personaId, npcId) => {
        setTargetNpcId(npcId); // 접촉한 NPC ID 기록 (예: NPC_01)

        if (!personaId) {
            setMode('CREATE'); // 인격이 없으면 생성창 오픈
        } else {
            setTargetPersonaId(personaId);
            setDialogueText(`${nickname}님, 이 상담사와 대화를 시작할까요?`);
            setMode('TALK');
        }
    };

    const onCreatePersona = async (e) => {
        e.preventDefault();

        if (!currentMemberId) {
            alert("로그인 세션이 만료되었습니다.");
            router.push('/members/login');
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/personas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memberId: currentMemberId,
                    npcId: targetNpcId, // ⭐️ 백엔드에 어떤 NPC인지 전달
                    ...formData
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "주민 등록 실패");

            setTargetPersonaId(data.id);
            setDialogueText(`반가워요! 저는 새로운 상담사 ${formData.name}입니다.`);
            setMode('TALK');

            // 2초 뒤 새로고침하여 Phaser 화면에 반영 (선택 사항)
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            alert(err.message);
        }
    };

    if (!currentMemberId) return <div style={{ backgroundColor: '#1a1a1a', height: '100vh' }} />;

    return (
        <main style={{ position: 'fixed', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>

            {/* 상단 정보 바 */}
            <div style={topBarStyle}>
                <span>📍 {nickname} 님 접속 중</span>
                <button onClick={() => { localStorage.clear(); router.push('/members/login'); }} style={logoutBtnStyle}>
                    로그아웃
                </button>
            </div>

            {/* 게임 화면 */}
            <PhaserGame onSpacePress={handleInteraction} personaId={targetPersonaId} />

            {/* 인격 생성 모달 (사람 형태 NPC를 위한 세련된 디자인) */}
            {mode === 'CREATE' && (
                <div style={retroContainerStyle}>
                    <div style={nameTagStyle}>✨ 새로운 인격 부여 [{targetNpcId}]</div>
                    <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '15px' }}>이 캐릭터에게 이름과 성격을 만들어 주세요.</p>

                    <form onSubmit={onCreatePersona} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input placeholder="상담사 이름" onChange={e => setFormData({...formData, name: e.target.value})} required style={retroInputStyle} />
                        <input placeholder="하는 일 (예: 고민 상담소장)" onChange={e => setFormData({...formData, job: e.target.value})} required style={retroInputStyle} />
                        <select onChange={e => setFormData({...formData, mbti: e.target.value})} style={retroInputStyle}>
                            {['INFJ', 'ENFP', 'INTJ', 'ENTP', 'INFP', 'ENTJ'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <input placeholder="말투 (예: 다정한 존댓말)" onChange={e => setFormData({...formData, speechStyle: e.target.value})} required style={retroInputStyle} />

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" style={retroButtonStyle}>등록하기</button>
                            <button type="button" onClick={() => setMode('EXPLORE')} style={{...retroButtonStyle, backgroundColor: '#444'}}>취소</button>
                        </div>
                    </form>
                </div>
            )}

            <DialogueBox text={dialogueText} isOpen={mode === 'TALK'} onClose={() => setMode('EXPLORE')} npcName={formData.name || "상담사"} />
        </main>
    );
}

// --- 스타일링 (칙칙함을 제거한 다크 그린 & 골드 테마) ---
const topBarStyle = { position: 'absolute', top: 20, right: 20, color: 'white', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '30px', border: '1px solid #333' };
const logoutBtnStyle = { padding: '5px 12px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
const retroContainerStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '420px', backgroundColor: '#18181b', border: '1px solid #facc15', padding: '30px', zIndex: 2000, borderRadius: '15px', boxShadow: '0 0 30px rgba(0,0,0,0.5)' };
const nameTagStyle = { color: '#facc15', marginBottom: '5px', fontWeight: 'bold', fontSize: '20px' };
const retroInputStyle = { backgroundColor: '#09090b', color: '#fff', border: '1px solid #27272a', padding: '12px', fontSize: '15px', borderRadius: '8px', outline: 'none' };
const retroButtonStyle = { flex: 1, padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '8px' };