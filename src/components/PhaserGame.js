'use client';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function PhaserGame({ onSpacePress, personaId }) {
    const gameRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (gameRef.current) return;

        const config = {
            type: Phaser.AUTO,
            parent: 'phaser-container',
            backgroundColor: '#2d5a27', // 싱그러운 숲색 배경
            width: window.innerWidth,
            height: window.innerHeight,
            physics: { default: 'arcade', arcade: { debug: false } },
            scene: {
                preload: function() {
                    // ⭐️ [검증됨] 현재 작동하는 사람/캐릭터 형태의 이미지들만 모았습니다.
                    // 나(플레이어)
                    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');

                    // 주민 1: 우주복 입은 사람 (기존 nanovisor 대체)
                    this.load.image('char_1', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
                    // 주민 2: 꼬마 캐릭터 (기존 red_balloon 대체)
                    this.load.image('char_2', 'https://labs.phaser.io/assets/sprites/ayu.png');
                    // 주민 3: 고전 게임 스타일 캐릭터 (기존 exocet 대체)
                    this.load.image('char_3', 'https://labs.phaser.io/assets/sprites/orange-cat1.png');
                    // 주민 4: 작고 귀여운 캐릭터 (tinycar는 작동하므로 유지)
                    this.load.image('char_4', 'https://labs.phaser.io/assets/sprites/tinycar.png');
                    // 주민 5: 사람 형태의 슬라임 캐릭터
                    this.load.image('char_5', 'https://labs.phaser.io/assets/sprites/slime.png');
                },
                create: function() {
                    const { width, height } = this.scale;

                    const counselors = [
                        { id: 'NPC_01', x: width * 0.2, y: height * 0.3, key: 'char_1', label: '차분한 상담사' },
                        { id: 'NPC_02', x: width * 0.8, y: height * 0.3, key: 'char_2', label: '열정적인 상담사' },
                        { id: 'NPC_03', x: width * 0.5, y: height * 0.5, key: 'char_3', label: '냉철한 분석가' },
                        { id: 'NPC_04', x: width * 0.2, y: height * 0.7, key: 'char_4', label: '친절한 이웃' },
                        { id: 'NPC_05', x: width * 0.8, y: height * 0.7, key: 'char_5', label: '신비로운 조언자' },
                    ];

                    this.npcs = this.physics.add.group();

                    counselors.forEach(data => {
                        const npc = this.npcs.create(data.x, data.y, data.key).setScale(1.8);
                        npc.npcId = data.id;
                        npc.setAlpha(0.8);

                        // 이름표 배경과 텍스트
                        this.add.text(data.x, data.y - 45, data.label, {
                            fontSize: '14px',
                            fill: '#fff',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            padding: { x: 5, y: 2 }
                        }).setOrigin(0.5);
                    });

                    // 플레이어 생성
                    this.player = this.physics.add.sprite(width / 2, height * 0.8, 'player').setScale(1.5);
                    this.player.setCollideWorldBounds(true);

                    this.cursors = this.input.keyboard.createCursorKeys();
                    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                },
                update: function() {
                    this.player.setVelocity(0);
                    const speed = 300;
                    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
                    else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
                    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
                    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);

                    this.npcs.getChildren().forEach(npc => {
                        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
                        if (dist < 80) {
                            npc.setAlpha(1);
                            if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                                // ⭐️ 부모 컴포넌트로 npcId를 확실히 넘겨줌
                                onSpacePress(null, npc.npcId);
                            }
                        } else {
                            npc.setAlpha(0.7);
                        }
                    });
                }
            }
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;

        const handleResize = () => {
            if (gameRef.current) gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [onSpacePress]);

    return <div id="phaser-container" style={{ width: '100vw', height: '100vh' }} />;
}