'use client';
import { useEffect, useState } from 'react';

export default function FollowPage() {
    const [following, setFollowing] = useState([]); // 내가 팔로우하는 사람들
    const [followers, setFollowers] = useState([]);  // 나를 팔로우하는 사람들
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // 1. 내가 팔로우하는 목록 가져오기 (memberId 1번 가정)
        fetch('/api/follows?followerId=1', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setFollowing(data));

        // 2. 나를 팔로우하는 목록 가져오기
        fetch('/api/follows?followingId=1', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setFollowers(data));
    }, []);

    const handleFollow = async (targetId) => {
        const res = await fetch('/api/follows', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ follower_id: 1, following_id: targetId }),
        });
        if (res.ok) {
            alert('상대방의 마을을 팔로우했습니다!');
            // 목록 새로고침 로직 추가 가능
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>👨‍👨‍👧‍👦 마을 네트워크 (Follow)</h1>
            <p>다른 트레이너들과 교류하고 그들의 마을을 구경해보세요.</p>

            {/* 유저 검색 섹션 */}
            <div style={{ margin: '30px 0', padding: '20px', backgroundColor: '#f0f4f8', borderRadius: '10px' }}>
                <h3>🔍 새로운 이웃 찾기</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        style={{ flex: 1, padding: '10px' }}
                        placeholder="이웃의 닉네임이나 이메일을 입력하세요..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={() => alert('검색 기능은 백엔드 구현 후 연동!')} style={{ padding: '10px 20px' }}>검색</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* 팔로잉 목록 */}
                <div>
                    <h3>✅ 내가 방문하는 마을 ({following.length})</h3>
                    <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
                        {following.length > 0 ? following.map(f => (
                            <div key={f.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                                <span>ID: {f.following_id} 트레이너</span>
                                <button onClick={() => handleFollow(f.following_id)} style={{ fontSize: '12px', color: 'red', border: 'none', background: 'none' }}>언팔로우</button>
                            </div>
                        )) : <p style={{ padding: '15px', color: '#888' }}>아직 팔로우하는 이웃이 없습니다.</p>}
                    </div>
                </div>

                {/* 팔로워 목록 */}
                <div>
                    <h3>🔔 내 마을의 방문객 ({followers.length})</h3>
                    <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
                        {followers.length > 0 ? followers.map(f => (
                            <div key={f.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                                <span>ID: {f.follower_id} 트레이너</span>
                            </div>
                        )) : <p style={{ padding: '15px', color: '#888' }}>아직 나를 팔로우하는 이웃이 없습니다.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}