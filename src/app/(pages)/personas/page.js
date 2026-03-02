'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonaList() {
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 1. 페이지 로드 시 내가 만든 페르소나 목록 불러오기
    useEffect(() => {
        fetch('/api/personas?memberId=1') // 실제 환경에선 로그인된 유저 ID 사용
            .then(res => res.json())
            .then(data => {
                setPersonas(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("데이터 로딩 실패:", err);
                setLoading(false);
            });
    }, []);

    // ⭐️ 2. 캐릭터 클릭 시: 방 생성 -> 방 번호 획득 -> 채팅 페이지 이동
    const handleCharacterClick = async (personaId) => {
        try {
            // 백엔드 컨트롤러 (@PostMapping("/persona/{personaId}")) 사양에 맞춤
            const res = await fetch(`/api/conversations/persona/${personaId}`, {
                method: 'POST'
                // 백엔드에서 @RequestBody를 받지 않으므로 headers와 body는 생략 가능합니다.
            });

            if (!res.ok) {
                const errorMsg = await res.text();
                throw new Error(errorMsg || "방 생성 실패");
            }

            // 백엔드에서 생성된 Conversation ID (Long 타입)를 받아옴
            const conversationId = await res.json();

            // 3. 해당 방 번호를 주소에 담아 대화 페이지(게임 화면)로 즉시 이동
            // 예: /conversations/15
            router.push(`/conversations/${conversationId}`);

        } catch (err) {
            console.error("대화 시작 에러:", err);
            alert("해당 주민과 대화방을 만들 수 없습니다. 잠시 후 다시 시도해주세요!");
        }
    };

    if (loading) return <div style={containerStyle}>마을 주민들을 불러오는 중...</div>;

    return (
        <div style={containerStyle}>
            <header style={headerStyle}>
                <h1>🏡 우리 마을 주민 명부</h1>
                <button
                    onClick={() => router.push('/personas/create')}
                    style={addButtonStyle}
                >
                    + 새 주민 초대하기
                </button>
            </header>

            <div style={gridStyle}>
                {personas.length > 0 ? (
                    personas.map(p => (
                        <div
                            key={p.id}
                            style={cardStyle}
                            onClick={() => handleCharacterClick(p.id)} // 카드 클릭 시 대화 시작
                        >
                            <div style={avatarStyle}>
                                {p.name ? p.name[0] : '👤'}
                            </div>
                            <h3 style={nameStyle}>{p.name}</h3>
                            <p style={relStyle}>
                                {p.relationship_type || p.relationshipType || '동네 주민'}
                            </p>
                            <div style={statStyle}>
                                ❤️ {p.intimacy_score || 0} | 🤝 {p.trust_score || 0}
                            </div>
                            <button style={btnStyle}>대화하기</button>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
                        <p>아직 마을에 주민이 없어요. 새로운 주민을 초대해보세요!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 디자인 스타일 (포켓몬/깔끔한 RPG 감성) ---
const containerStyle = { padding: '40px', maxWidth: '1000px', margin: '0 auto' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '3px solid #333', paddingBottom: '10px' };
const addButtonStyle = { padding: '10px 20px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' };
const cardStyle = { border: '2px solid #333', padding: '25px', borderRadius: '15px', cursor: 'pointer', textAlign: 'center', backgroundColor: '#fff', transition: 'transform 0.2s', boxShadow: '5px 5px 0px #333' };
const avatarStyle = { width: '70px', height: '70px', backgroundColor: '#eee', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', border: '2px solid #333' };
const nameStyle = { margin: '10px 0', fontSize: '22px', color: '#333' };
const relStyle = { color: '#666', fontSize: '14px', marginBottom: '10px' };
const statStyle = { fontSize: '12px', color: '#888', marginBottom: '15px' };
const btnStyle = { width: '100%', padding: '10px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };