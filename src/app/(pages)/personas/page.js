'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DialogueBox from '../components/DialogueBox';

// Phaser 컴포넌트 (SSR 방지)
const PhaserGame = dynamic(() => import('../components/PhaserGame'), { ssr: false });

export default function Home() {
    const router = useRouter();

    // 1. 상태 관리
    const [mode, setMode] = useState('EXPLORE'); // EXPLORE(탐색), CREATE(인격생성), TALK(대화확인)
    const [targetPersonaId, setTargetPersonaId] = useState(null);
    const [targetNpcId, setTargetNpcId] = useState(null);
    const [dialogueText, setDialogueText] = useState('');
    const [currentMemberId, setCurrentMemberId] = useState(null);
    const [nickname, setNickname] = useState('');

    // 인격 생성을 위한 폼 데이터 (DB 컬럼과 100% 매칭)
    const [formData, setFormData] = useState({
        name: '',
        age: 20,
        job: '',
        mbti: 'INFJ',
        relationship_type: '비밀 상담사',
        personality_keywords: '',
        speech_style: ''
    });

    // 2. 초기 인증 체크 (추후 JWT 도입 시 이 부분이 토큰 검증 로직으로 교체됩니다)
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

    // 3. Phaser에서 유령과 접촉 시 실행
    const handleInteraction = (personaId, npcId) => {
        setTargetNpcId(npcId);

        if (!personaId) {
            // 인격이 없는 유령이면 생성 모드로
            setMode('CREATE');
        } else {
            // 인격이 이미 존재하면 대화 확인 모드로
            setTargetPersonaId(personaId);
            setDialogueText(`비밀 상담사 [${npcId}]와 대화를 시작할까요?`);
            setMode('TALK');
        }
    };

    // 4. 인격 생성 요청 (상담사 등록)
    const onCreatePersona = async (e) => {
        e.preventDefault();

        // 백엔드 전송 전 필수값 검증
        if (!currentMemberId || !targetNpcId) {
            alert("세션 정보가 만료되었습니다. 다시 로그인해주세요.");
            return;
        }

        try {
            // ⭐️ 나중에 JWT를 쓰게 되면 headers에 Authorization: `Bearer ${token}`을 추가하게 됩니다.
            const res = await fetch(`/api/personas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memberId: currentMemberId, // ⭐️ JWT 도입 후에는 백엔드에서 처리 가능
                    npc_id: targetNpcId,      // ⭐️ 유니크 식별자
                    ...formData
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "상담사 등록 중 오류가 발생했습니다.");
            }

            setTargetPersonaId(data.id);
            setDialogueText(`상담사 ${formData.name}가 배정되었습니다. 비밀을 지켜드릴게요.`);
            setMode('TALK');

            // 2초 뒤 새로고침하여 Phaser 상태 동기화
            setTimeout(() => window.location.reload(), 2000);

        } catch (err) {
            console.error("생성 에러:", err);
            alert(err.message);
        }
    };

    if (!currentMemberId) return <div style={{ backgroundColor: '#1a1a1a', height: '100vh' }} />;

    return (
        <main style={{ position: 'fixed', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>

            {/* 상단 인터페이스: 칙칙함을 줄이기 위한 반투명 스타일링 */}
            <div style={userTagStyle}>
                <span style={{ color: '#4ade80' }}>●</span> {nickname}님의 비밀 상담실
            </div>

            {/* 게임 캔버스 영역 */}
            <PhaserGame onSpacePress={handleInteraction} personaId={targetPersonaId} />

            {/* 인격 생성 UI: 모달 스타일 */}
            {mode === 'CREATE' && (
                <div style={retroContainerStyle}>
                    <div style={nameTagStyle}>🤫 신규 비밀 상담사 배정 [{targetNpcId}]</div>
                    <p style={{ color: '#aaa', fontSize: '12px', marginBottom: '15px' }}>
                        이 상담사와의 대화는 오직 사용자님께만 공개됩니다.
                    </p>

                    <form onSubmit={onCreatePersona} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>상담사 이름</label>
                            <input required style={retroInputStyle} placeholder="상담사의 별명을 지어주세요"
                                   onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>말투 설정</label>
                            <input style={retroInputStyle} placeholder="예: 차분한 존댓말, 친근한 반말"
                                   onChange={e => setFormData({...formData, speech_style: e.target.value})} />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>상담 키워드</label>
                            <textarea style={{...retroInputStyle, height: '60px'}} placeholder="예: 진로 고민, 연애 상담 전문"
                                      onChange={e => setFormData({...formData, personality_keywords: e.target.value})} />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button type="submit" style={retroButtonStyle}>상담 시작하기</button>
                            <button type="button" onClick={() => setMode('EXPLORE')}
                                    style={{...retroButtonStyle, backgroundColor: '#444'}}>취소</button>
                        </div>
                    </form>
                </div>
            )}

            {/* 하단 대화창 컴포넌트 */}
            <DialogueBox
                text={dialogueText}
                isOpen={mode === 'TALK'}
                onClose={() => setMode('EXPLORE')}
                npcName={formData.name || "비밀 상담사"}
            />
        </main>
    );
}

// --- 스타일 가이드 (칙칙함을 제거한 다크 테마) ---

const userTagStyle = {
    position: 'absolute', top: 20, right: 20, color: 'white', zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.7)', padding: '12px 20px', borderRadius: '30px',
    border: '1px solid #333', fontSize: '14px', fontWeight: '500', backdropFilter: 'blur(5px)'
};

const retroContainerStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '450px', backgroundColor: '#18181b', border: '1px solid #3f3f46',
    padding: '30px', zIndex: 2000, color: '#fff', borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
};

const nameTagStyle = { color: '#facc15', marginBottom: '5px', fontWeight: 'bold', fontSize: '18px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '12px', color: '#94a3b8', fontWeight: '600' };

const retroInputStyle = {
    backgroundColor: '#09090b', color: '#fff', border: '1px solid #27272a',
    padding: '12px', fontSize: '14px', borderRadius: '6px', outline: 'none'
};

const retroButtonStyle = {
    flex: 1, padding: '12px', backgroundColor: '#10b981', color: '#fff',
    border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px',
    transition: 'background 0.2s'
};