# Conversation Practice Village - Frontend

대화 연습 마을 프로젝트의 프론트엔드 클라이언트입니다. Next.js와 Phaser.js를 활용한 2D 게임 형식의 대화 연습 플랫폼입니다.

## 📋 목차
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경 설정](#환경-설정)
- [주요 컴포넌트](#주요-컴포넌트)
- [API 통신](#api-통신)
- [문제 해결](#문제-해결)

## 🛠 기술 스택

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: JavaScript (ES6+)
- **UI Library**: React 19.2.3
- **Game Engine**: Phaser 3.90.0
- **Styling**: Tailwind CSS 4.0
- **Typography**: Typewriter Effect 2.22.0
- **Build Tool**: Turbopack (Next.js 내장)
- **Package Manager**: npm

## ✨ 주요 기능

### 1. 2D 게임 방식의 인터랙션
- Phaser.js 기반의 2D 게임 환경
- 키보드 조작으로 캐릭터 이동 (방향키)
- NPC와의 거리 감지 및 상호작용 (Space 키)
- 반응형 게임 화면 (화면 크기 자동 조절)

### 2. 회원 시스템
- 회원 가입 및 로그인
- localStorage 기반 세션 관리
- 로그인 상태 보존 및 자동 리다이렉트
- 로그아웃 기능

### 3. 페르소나 생성 및 관리
- 게임 내에서 직접 NPC(페르소나) 생성
- 페르소나 특성 설정
  - 이름, 직업
  - MBTI 성격 유형
  - 말투 스타일
- 실시간 페르소나 정보 동기화

### 4. 대화 시스템
- 레트로 게임 스타일의 대화창 (DialogueBox)
- 타이핑 효과로 몰입감 향상
- NPC와의 실시간 AI 대화
- 대화 히스토리 관리

### 5. UI/UX
- 픽셀 아트 스타일의 레트로 디자인
- 포켓몬/젤다 풍 대화 인터페이스
- 직관적인 조작 방법 (방향키 + Space)
- 부드러운 페이지 전환

## 📁 프로젝트 구조

```
conversation-practice-village-front/
├── public/
│   ├── assets/
│   │   ├── SpriteSheet.png          # 캐릭터 스프라이트
│   │   └── TilesetVillageAbandoned.png
│   └── *.svg                        # 아이콘 파일들
├── src/
│   ├── app/
│   │   ├── (pages)/                 # 라우팅 그룹
│   │   │   ├── conversations/       # 대화방 관련 페이지
│   │   │   ├── follows/             # 팔로우 관련 페이지
│   │   │   ├── members/             # 회원 관련 페이지
│   │   │   ├── messages/            # 메시지 관련 페이지
│   │   │   └── personas/            # 페르소나 관련 페이지
│   │   ├── api/                     # API 라우트
│   │   ├── layout.js                # 루트 레이아웃
│   │   ├── page.js                  # 메인 페이지 (게임 화면)
│   │   └── globals.css              # 전역 스타일
│   └── components/
│       ├── PhaserGame.js            # Phaser 게임 메인 컴포넌트
│       └── DialogueBox.js           # 대화창 UI 컴포넌트
├── .env.local                       # 로컬 환경 변수
├── .env.production                  # 프로덕션 환경 변수
├── next.config.mjs                  # Next.js 설정
├── tailwind.config.js               # Tailwind CSS 설정
├── postcss.config.mjs               # PostCSS 설정
├── jsconfig.json                    # JavaScript 설정
└── package.json                     # 의존성 관리
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn
- 백엔드 서버 실행 중 (포트 8080)

### 설치 및 실행

1. **프로젝트 디렉토리 이동**
   ```bash
   cd conversation-practice-village-front
   ```

2. **의존성 설치**
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. **환경 변수 설정**
   
   `.env.local` 파일을 프로젝트 루트에 생성:
   ```env
   # 백엔드 API 서버 주소
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
   
   # 프론트엔드 베이스 URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   # 또는
   yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
