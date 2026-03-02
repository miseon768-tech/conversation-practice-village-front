'use client';
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function PhaserGame({ onSpacePress, personaId }) {
    const gameRef = useRef(null);

    useEffect(() => {
        // 브라우저 여백 제거
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';

        const config = {
            type: Phaser.AUTO,
            mode: Phaser.Scale.RESIZE,
            parent: 'phaser-container',
            width: window.innerWidth,
            height: window.innerHeight,
            scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
            physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
            scene: {
                preload: function() {
                    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
                    this.load.image('npc', 'https://labs.phaser.io/assets/sprites/ghost.png');
                },
                create: function() {
                    const { width, height } = this.scale;
                    this.bg = this.add.rectangle(width / 2, height / 2, width * 2, height * 2, 0x2c3e50);
                    this.npc = this.physics.add.sprite(width / 2, height / 2 - 60, 'npc').setScale(2.5).setTint(0x00ff00);

                    // 초기 personaId 주입
                    this.npc.personaId = personaId;

                    this.player = this.physics.add.sprite(width / 2, height / 2 + 100, 'player').setScale(1.2);
                    this.player.setCollideWorldBounds(true);
                    this.cursors = this.input.keyboard.createCursorKeys();
                    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

                    this.scale.on('resize', (gameSize) => {
                        const { width, height } = gameSize;
                        this.bg.setPosition(width / 2, height / 2);
                        this.npc.setPosition(width / 2, height / 2 - 60);
                        this.player.setPosition(width / 2, height / 2 + 100);
                    });
                },
                update: function() {
                    this.player.setVelocity(0);
                    if (this.cursors.left.isDown) this.player.setVelocityX(-250);
                    else if (this.cursors.right.isDown) this.player.setVelocityX(250);
                    if (this.cursors.up.isDown) this.player.setVelocityY(-250);
                    else if (this.cursors.down.isDown) this.player.setVelocityY(250);

                    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
                    if (dist < 80 && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                        onSpacePress(this.npc.personaId); // 최신 personaId 전달
                    }
                }
            }
        };

        const game = new Phaser.Game(config);
        gameRef.current = game;
        return () => game.destroy(true);
    }, [onSpacePress]); // onSpacePress가 바뀌지 않는 한 재실행 안함

    // ⭐️ 중요: 리액트에서 personaId가 바뀌면 Phaser NPC 정보 동기화
    useEffect(() => {
        const scene = gameRef.current?.scene.scenes[0];
        if (scene?.npc) {
            scene.npc.personaId = personaId;
        }
    }, [personaId]);

    return <div id="phaser-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }} />;
}