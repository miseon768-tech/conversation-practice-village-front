'use client';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function PhaserGame({ onSpacePress, memberId }) {
    const gameRef = useRef(null);
    const onSpacePressRef = useRef(onSpacePress);

    // 최신 handleInteraction 함수를 Phaser 엔진이 알 수 있게 Ref에 저장
    useEffect(() => {
        onSpacePressRef.current = onSpacePress;
    }, [onSpacePress]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (gameRef.current) return;

        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-container',
            backgroundColor: '#2d5a27',
            scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH, width: '100%', height: '100%' },
            physics: { default: 'arcade', arcade: { debug: false } },
            scene: {
                preload: function() {
                    // 이미지 로드
                    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
                    this.load.image('npc_cat', 'https://labs.phaser.io/assets/sprites/orange-cat1.png');
                },
                create: function() {
                    const { width, height } = this.scale;

                    // 1. NPC 위치 설정
                    const counselorData = [
                        { id: 'NPC_01', x: width * 0.3, y: height * 0.3 },
                        { id: 'NPC_02', x: width * 0.7, y: height * 0.3 },
                        { id: 'NPC_03', x: width * 0.5, y: height * 0.6 },
                    ];

                    this.npcs = this.physics.add.group();
                    counselorData.forEach(data => {
                        const npc = this.npcs.create(data.x, data.y, 'npc_cat').setScale(1.5);
                        npc.npcId = data.id;
                        npc.personaId = null; // 인격 ID 초기값
                        npc.nameTag = this.add.text(data.x, data.y - 45, data.id, {
                            fontSize: '14px', fill: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)', padding: {x:4, y:2}
                        }).setOrigin(0.5);
                    });

                    // 2. 서버에서 등록된 주민 리스트 가져와서 NPC에 입히기
                    if (memberId) {
                        fetch(`/api/personas?memberId=${memberId}`, { credentials: 'include' })
                            .then(res => res.json())
                            .then(data => {
                                this.npcs.getChildren().forEach(npc => {
                                    const found = data.find(p => p.npcId === npc.npcId);
                                    if (found) {
                                        npc.personaId = found.id; // 인격 ID 부여
                                        npc.nameTag.setText(found.name).setStyle({ fill: '#ffff00' }); // 이름 노란색으로 변경
                                    }
                                });
                            })
                            .catch(() => console.log("아직 등록된 주민이 없네요!"));
                    }

                    // 3. 플레이어 생성
                    this.player = this.physics.add.sprite(width / 2, height * 0.8, 'player').setScale(1.2);
                    this.player.setCollideWorldBounds(true);
                    this.cursors = this.input.keyboard.createCursorKeys();
                    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                },
                update: function() {
                    if (!this.player) return;

                    // 이동 로직
                    this.player.setVelocity(0);
                    const speed = 250;
                    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
                    else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
                    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
                    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);

                    // 거리 체크 및 상호작용
                    this.npcs.getChildren().forEach(npc => {
                        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
                        if (dist < 70) {
                            npc.setAlpha(1);
                            if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                                // ⭐️ [중요] npc.personaId가 있으면 대화창, 없으면 생성창이 뜹니다.
                                onSpacePressRef.current(npc.personaId, npc.npcId);
                            }
                        } else {
                            npc.setAlpha(0.6);
                        }
                    });
                }
            }
        };

        gameRef.current = new Phaser.Game(config);
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []); // 의존성 배열을 빈 배열로 두어 에러 방지

    return <div id="phaser-container" style={{ width: '100vw', height: '100vh' }} />;
}