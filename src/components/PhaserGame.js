'use client';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function PhaserGame({ onReply }) {
    // 현재 활성화된 대화방 ID를 저장 (Ref를 사용해야 렌더링 사이클과 무관하게 유지됨)
    const currentConvId = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-container',
            width: 800,
            height: 600,
            // ⭐️ 핵심 수정: 물리 엔진 설정을 추가해야 this.physics.add를 사용할 수 있습니다.
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 }, // 탑다운 게임이므로 중력 제거
                    debug: false      // 충돌 영역 확인이 필요하면 true로 변경
                }
            },
            scene: {
                preload: function() {
                    // 외부 이미지 자산 로드
                    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
                    this.load.image('npc', 'https://labs.phaser.io/assets/sprites/ghost.png');
                },
                create: function() {
                    // 배경 그리기
                    this.add.rectangle(400, 300, 800, 600, 0x2c3e50);

                    // NPC 생성 (초록색 유령)
                    this.npc = this.physics.add.sprite(400, 200, 'npc').setScale(2).setTint(0x00ff00);

                    // 플레이어 생성
                    this.player = this.physics.add.sprite(400, 500, 'player');

                    // 키보드 입력 설정
                    this.cursors = this.input.keyboard.createCursorKeys();
                    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                },
                update: function() {
                    // 플레이어 이동 로직
                    this.player.setVelocity(0);
                    if (this.cursors.left.isDown) this.player.setVelocityX(-200);
                    else if (this.cursors.right.isDown) this.player.setVelocityX(200);
                    if (this.cursors.up.isDown) this.player.setVelocityY(-200);
                    else if (this.cursors.down.isDown) this.player.setVelocityY(200);

                    // 플레이어와 NPC 간의 거리 계산
                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);

                    // 거리 70 이내에서 스페이스바를 누르면 대화 시작
                    if (dist < 70 && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                        const msg = prompt("마을 주민(유령)에게 할 말을 입력하세요:");
                        if (msg) {
                            // 대화 흐름 처리 함수 호출
                            handleChatFlow(msg, onReply);
                        }
                    }
                }
            }
        };

        const game = new Phaser.Game(config);

        // 컴포넌트 언마운트 시 게임 인스턴스 파괴 (메모리 누수 방지)
        return () => game.destroy(true);
    }, [onReply]);

    /**
     * handleChatFlow: 대화방 생성 및 메시지 전송 로직
     */
    async function handleChatFlow(msg, callback) {
        try {
            // 1. 대화방(Conversation) 세션이 아직 없다면 새로 생성
            if (!currentConvId.current) {
                // 백엔드가 @RequestBody를 받지 않으므로 옵션을 최소화합니다.
                const convRes = await fetch(`/api/conversations/persona/1`, {
                    method: 'POST'
                    // body와 headers를 넣지 않습니다. (백엔드 컨트롤러 사양에 맞춤)
                });

                if (!convRes.ok) {
                    // 서버 에러 상세 내용을 확인하기 위해 로그 추가
                    const errorDetail = await convRes.text();
                    console.error("서버 응답 에러:", errorDetail);
                    throw new Error("방 생성 실패");
                }

                const newId = await convRes.json();
                currentConvId.current = newId;
                console.log("새로운 대화방 생성됨 ID:", newId);
            }

            // 2. 메시지 전송 (이 부분은 기존대로 유지)
            const messageRes = await fetch(`/api/messages/${currentConvId.current}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });

            if (!messageRes.ok) throw new Error("메시지 전송 실패");

            const data = await messageRes.json();
            callback(data.aiReply || "조금 더 구체적으로 말해주겠어?");

        } catch (e) {
            console.error("채팅 처리 중 오류:", e);
            alert("주민이 대답을 거부하고 있습니다. (서버 확인 필요)");
        }
    }

    return <div id="phaser-container" style={{ borderRadius: '10px', overflow: 'hidden' }} />;
}