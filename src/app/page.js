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
    const [dialogueText, setDialogueText] = useState('');

    // ⭐️ [중요] 로그인된 유저의 정보를 담는 상태 (초기값 null)
    const [currentMemberId, setCurrentMemberId] = useState(null);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        // 1. 브라우저 저장소에서 로그인 정보 확인 (누가 들어왔는지 확인)
        const savedMemberId = localStorage.getItem('memberId');
        const savedNickname = localStorage.getItem('nickname');

        if (!savedMemberId) {
            // 2. 로그인 정보가 없으면 로그인 페이지로 튕겨냄
            router.replace('/members/login');
        } else {
            // 3. 현재 로그인한 사람의 ID를 상태에 저장 (문자열을 숫자로 변환)
            setCurrentMemberId(Number(savedMemberId));
            setNickname(savedNickname);
            console.log("현재 접속 유저 ID:", savedMemberId); // 디버깅용
        }
    }, [router]);

    const [formData, setFormData] = useState({
        name: '', job: '', mbti: 'INFP', speechStyle: ''
    });

    const handleInteraction = (personaId) => {
        if (!personaId) {
            setMode('CREATE');
        } else {
            setTargetPersonaId(personaId);
            setDialogueText(`${nickname}님, 이 주민과 대화하시겠습니까?`);
            setMode('TALK');
        }
    };

    const onCreatePersona = async (e) => {
        e.preventDefault();

        // ⭐️ 500 에러 방지: ID가 없는 상태에서 요청 보내는 것 차단
        if (!currentMemberId) {
            alert("로그인 정보가 만료되었습니다. 다시 로그인해주세요.");
            router.push('/members/login');
            return;
        }

        try {
            // ⭐️ 상대 경로 대신 절대 경로를 사용하여 주소 꼬임 방지
            const res = await fetch(`http://localhost:3000/api/personas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memberId: currentMemberId, // 👈 고정된 2가 아니라 진짜 내 ID 전송!
                    ...formData
                })
            });

            const data = await res.json();

            if (!res.ok) {
                // 백엔드에서 던진 구체적인 에러 메시지(member not found 등)를 보여줌
                throw new Error(data.error || data.message || "주민 생성에 실패했습니다.");
            }

            const generatedId = typeof data === 'object' ? data.id : data;

            setTargetPersonaId(generatedId);
            setDialogueText(`반가워요! 저는 ${formData.name}라고 합니다.`);
            setMode('TALK');
        } catch (err) {
            console.error("생성 에러:", err);
            alert(`에러 발생: ${err.message}\n(DB에 ID ${currentMemberId}번 사용자가 있는지 확인하세요)`);
        }
    };

    // 로그인 체크 완료 전에는 검은 화면만 보여줌 (깜빡임 방지)
    if (!currentMemberId) {
        return <div style={{ backgroundColor: '#2c3e50', height: '100vh' }} />;
    }

    return (
        <main style={{ position: 'fixed', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {/* 상단 닉네임 표시 및 로그아웃 */}
            <div style={{ position: 'absolute', top: 20, right: 20, color: 'white', zIndex: 1000, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
                📍 {nickname} (ID: {currentMemberId}) 님 접속 중
                <button
                    onClick={() => {
                        localStorage.clear();
                        router.push('/members/login');
                    }}
                    style={{ marginLeft: '10px', padding: '5px', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px' }}
                >
                    로그아웃
                </button>
            </div>

            <PhaserGame onSpacePress={handleInteraction} personaId={targetPersonaId} />

            {mode === 'CREATE' && (
                <div style={retroContainerStyle}>
                    <div style={nameTagStyle}>[ 새 주민 등록 - 관리자: {nickname} ]</div>
                    <form onSubmit={onCreatePersona} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input placeholder="이름" onChange={e => setFormData({...formData, name: e.target.value})} required style={retroInputStyle} />
                        <input placeholder="직업" onChange={e => setFormData({...formData, job: e.target.value})} required style={retroInputStyle} />
                        <select onChange={e => setFormData({...formData, mbti: e.target.value})} style={retroInputStyle}>
                            {['INFP', 'ENFP', 'INFJ', 'ENFJ', 'INTJ', 'ENTJ', 'INTP', 'ENTP'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <input placeholder="말투 (예: 친근한 반말)" onChange={e => setFormData({...formData, speechStyle: e.target.value})} required style={retroInputStyle} />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" style={retroButtonStyle}>주민 생성</button>
                            <button type="button" onClick={() => setMode('EXPLORE')} style={{...retroButtonStyle, backgroundColor: '#c0392b'}}>취소</button>
                        </div>
                    </form>
                </div>
            )}

            <DialogueBox text={dialogueText} isOpen={mode === 'TALK'} onClose={() => setMode('EXPLORE')} npcName={formData.name || "주민"} />
        </main>
    );
}

// 스타일 상수는 이전과 동일
const retroContainerStyle = { position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '700px', backgroundColor: 'rgba(20, 20, 25, 0.98)', border: '4px solid #fff', padding: '20px', zIndex: 2000 };
const nameTagStyle = { color: '#ffcc00', marginBottom: '10px', fontWeight: 'bold', fontSize: '18px' };
const retroInputStyle = { backgroundColor: '#000', color: '#fff', border: '1px solid #555', padding: '12px', fontSize: '16px' };
const retroButtonStyle = { flex: 1, padding: '12px', backgroundColor: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' };