# Conversation Practice Village - Frontend

대화 연습 마을 프로젝트의 프론트엔드 클라이언트입니다. Next.js (App Router)와 Phaser.js를 활용한 2D 게임 형식의 대화 연습 플랫폼이며, 백엔드와의 인증(Access/Refresh token), WebSocket 연결을 지원합니다.

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

- Node.js 18+
- npm 또는 yarn
- 백엔드 서버(포트 8080) 가 실행 중이어야 함

### 설치 및 실행 (개발)

1) 프로젝트 루트로 이동
```bash
cd conversation-practice-village-front
```

2) 의존성 설치
```bash
npm install
# 또는
yarn install
```

3) 환경 변수 설정
프로젝트 루트에 `.env.local` 생성 (예):
```env
# 백엔드 API 서버 주소 (클라이언트에서 호출하는 기본 주소)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
# 프론트엔드 서버 주소
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4) 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 `http://localhost:3000`을 확인하세요.

### 프로덕션 배포(요약)
- 빌드: `npm run build`
- 프로덕션 서버 실행: `npm start`
- 배포 환경에서 `NEXT_PUBLIC_BACKEND_URL`을 퍼블릭 API 엔드포인트(예: `http://13.125.244.156:8080`)로 설정하세요.

## ⚙️ 환경 변수 및 프록시

필수 환경 변수
- `NEXT_PUBLIC_BACKEND_URL` - 백엔드 API 기본 주소 (예: `http://localhost:8080` 또는 `http://13.125.244.156:8080`)
- `NEXT_PUBLIC_BASE_URL` - 프론트엔드 URL (예: `http://localhost:3000`)

Next.js에서 개발 편의를 위해 내부 rewrite를 사용해 `/api/*` 를 백엔드로 프록시하도록 설정되어 있습니다. 실제 배포 시에는 퍼블릭 도메인/포트에 맞춰 `NEXT_PUBLIC_BACKEND_URL`을 변경하세요.

```javascript
// next.config.mjs (예시)
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_URL + '/api/:path*',
      },
    ];
  },
};
export default nextConfig;
```

## 🎮 주요 컴포넌트

### 1. PhaserGame.js

Phaser 게임 엔진을 React 컴포넌트로 래핑한 핵심 컴포넌트입니다.

**주요 기능:**
- 게임 초기화 및 씬 관리
- 플레이어 캐릭터 이동 (방향키)
- NPC 배치 및 상호작용 감지 (Space 키)
- 반응형 화면 크기 조정
- personaId 동적 업데이트

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onSpacePress` | Function | Space 키 눌렀을 때 실행되는 콜백 (personaId 전달) |
| `personaId` | Number | 현재 선택된 페르소나 ID |

**사용 예시:**
```javascript
<PhaserGame 
    onSpacePress={(personaId) => console.log('Interact with:', personaId)} 
    personaId={1} 
/>
```

### 2. DialogueBox.js

레트로 게임 스타일의 대화창 컴포넌트입니다.

**주요 기능:**
- 타이핑 효과 (Typewriter Effect)
- NPC 이름 표시
- 클릭으로 닫기
- 픽셀 아트 스타일 디자인

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `text` | String | 표시할 대화 텍스트 |
| `isOpen` | Boolean | 대화창 표시 여부 |
| `onClose` | Function | 대화창 닫기 콜백 |
| `npcName` | String | NPC 이름 (기본값: "주민") |

**사용 예시:**
```javascript
<DialogueBox 
    text="안녕하세요! 저는 마을의 대장장이입니다." 
    isOpen={true} 
    onClose={() => setIsOpen(false)}
    npcName="대장장이 김철수"
/>
```

## 📡 API 통신 및 인증 요약

권장: Next.js rewrites를 사용해 클라이언트에서 상대 경로(`/api/*`)로 호출하세요. 프로덕션에서는 퍼블릭 백엔드 주소를 환경변수로 지정합니다.

인증/토큰 관련 주의사항
- Access Token: Authorization 헤더로 전송하거나, 쿠키(권장: HttpOnly)로 관리 가능
- Refresh Token: 보안상 HttpOnly Cookie로 저장하고, 프론트는 자동 갱신 흐름을 구현하세요.

fetch 예시 (쿠키 기반 요청):
```javascript
const res = await fetch('/api/personas/6', {
  method: 'GET',
  credentials: 'include', // 쿠키 전송
});
```

로그인 요청(Access/Refresh 토큰 발급 후 쿠키 설정을 백엔드에서 수행하는 경우):
```javascript
await fetch('/api/members/login', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({email, password}),
  credentials: 'include'
});
```

## 🎨 스타일링

### Tailwind CSS 설정

프로젝트는 Tailwind CSS 4.0을 사용합니다. 커스텀 스타일은 `globals.css`에서 관리합니다.

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 커스텀 픽셀 폰트 */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
```

### 인라인 스타일 (레트로 게임 컴포넌트)

DialogueBox와 같은 게임 UI는 인라인 스타일을 사용하여 픽셀 아트 느낌을 표현합니다.

```javascript
const retroStyle = {
    backgroundColor: 'rgba(20, 20, 25, 0.95)',
    border: '4px solid #ffffff',
    borderRadius: '4px',
    color: '#ffffff',
    fontFamily: '"Press Start 2P", monospace',
    boxShadow: '0 0 0 4px #000, 0 10px 20px rgba(0,0,0,0.5)'
};
```
## 🔧 문제 해결 요약

1) 401 Unauthorized (토큰 없음/형식 오류)
 - 프론트에서 `credentials: 'include'`로 쿠키를 전송하고 있는지 확인하세요.
 - Access Token이 만료됐을 경우 Refresh Token으로 Access를 재발급하는 흐름이 정상 동작하는지 확인하세요.

2) 500 Internal Server Error (서버 에러)
 - 백엔드 로그에서 스택트레이스 확인 후 원인 파악
 - 데이터베이스 연결, NullPointer, 서비스 로직 에러가 원인일 가능성이 큽니다.

3) CORS / 프록시 문제
 - 개발 시 rewrites로 `/api`를 프록시하거나, 백엔드에서 정확한 AllowedOrigins를 설정하세요.

4) AI(Gemini) 호출 실패
 - 환경변수, endpoint 버전(v1/v1beta) 및 모델이 해당 메서드를 지원하는지 확인하세요.

필요하면 프론트의 특정 파일(`src/components/DialogueBox.js`, `src/app/(pages)/members/login/page.js`, `src/components/PhaserGame.js`)을 열어 바로 수정해 드리겠습니다.
4. 네트워크 연결 문제

**해결 방법:**

#### ✅ 1단계: 백엔드 서버 확인
```bash
# 8080 포트 확인
lsof -i :8080

# 실행 중이 아니면 백엔드 시작
cd conversation-practice-village-back
./run-dev.sh
```

#### ✅ 2단계: GEMINI_API_KEY 설정 확인 (중요!)
```bash
# 백엔드 디렉토리에서 확인
cd conversation-practice-village-back

# 환경변수 확인
echo $GEMINI_API_KEY

# 없으면 설정
# .env.example을 .env로 복사하고 API 키 입력
cp .env.example .env
nano .env

# API 키 발급: https://aistudio.google.com/app/apikey
```

**⚠️ GEMINI_API_KEY가 없으면 AI 대화가 작동하지 않습니다!**

#### ✅ 3단계: 백엔드 재시작
```bash
# 환경변수 로드 후 서버 재시작
source .env
./gradlew bootRun

# 또는 실행 스크립트 사용
./run-dev.sh
```

#### ✅ 4단계: 프론트엔드 확인

#### ✅ API 경로 확인
```javascript
// ✅ 올바른 방법 (상대 경로)
fetch('/api/members')

// ❌ 잘못된 방법 (절대 경로, CORS 에러 발생)
fetch('http://localhost:8080/api/members')
```

#### ✅ next.config.mjs의 rewrites 설정 확인
```javascript
async rewrites() {
    return [
        {
            source: '/api/:path*',
            destination: 'http://localhost:8080/api/:path*',
        },
    ];
}
```

### 4. 로그인 후 바로 로그인 페이지로 돌아갑니다

**원인:** localStorage에 저장이 안 되거나 즉시 읽기 실패

**해결 방법:**
```javascript
// 저장 후 즉시 리다이렉트 하지 말고 약간의 딜레이 추가
localStorage.setItem('memberId', data.id);
localStorage.setItem('nickname', data.nickname);

setTimeout(() => {
    router.push('/');
}, 100);
```

### 5. 페르소나 생성 시 500 에러

**원인:** memberId가 null이거나 백엔드 DB에 해당 회원이 없음

**해결 방법:**
```javascript
// 1. 로그인 여부 확인
if (!currentMemberId) {
    alert("로그인 정보가 만료되었습니다.");
    router.push('/members/login');
    return;
}

// 2. 요청 전 memberId 검증
console.log("현재 memberId:", currentMemberId);

// 3. 백엔드 DB에 해당 memberId가 존재하는지 확인
```

### 6. Typewriter 효과가 작동하지 않습니다

**원인:** typewriter-effect 패키지 미설치

**해결 방법:**
```bash
npm install typewriter-effect
```

### 7. 화면 크기 조정 시 게임이 깨집니다

**원인:** Phaser의 resize 이벤트 미설정

**해결 방법:**
PhaserGame.js의 create 함수에 resize 리스너 추가:
```javascript
this.scale.on('resize', (gameSize) => {
    const { width, height } = gameSize;
    this.bg.setPosition(width / 2, height / 2);
    this.npc.setPosition(width / 2, height / 2 - 60);
    this.player.setPosition(width / 2, height / 2 + 100);
});
```

## 📝 개발 팁

### 1. 디버깅 모드

브라우저 콘솔에서 유용한 디버깅 명령어:

```javascript
// localStorage 확인
console.log('memberId:', localStorage.getItem('memberId'));
console.log('nickname:', localStorage.getItem('nickname'));

// 모든 localStorage 삭제
localStorage.clear();
```

### 2. Phaser 디버그 모드

게임 객체 상태를 확인하려면:
```javascript
// PhaserGame.js의 update 함수에 추가
console.log('Player Position:', this.player.x, this.player.y);
console.log('Distance to NPC:', dist);
```

### 3. 빠른 로컬 테스트

백엔드 없이 프론트엔드만 테스트하려면 Mock API를 사용:
```javascript
// 임시 Mock 데이터
const mockResponse = {
    id: 1,
    name: '테스트 NPC',
    message: '안녕하세요!'
};

// API 호출 대신 Mock 데이터 사용
// const res = await fetch('/api/personas'); // 주석 처리
const res = { ok: true, json: async () => mockResponse };
```

### 4. Hot Reload 최적화

개발 중 불필요한 재렌더링을 방지하려면:
```javascript
// useEffect 의존성 배열을 정확히 명시
useEffect(() => {
    // ...
}, [dependency1, dependency2]); // 필요한 것만!
```

### 5. 커스텀 훅 활용

반복되는 로직은 커스텀 훅으로 추출:
```javascript
// hooks/useAuth.js
export function useAuth() {
    const [memberId, setMemberId] = useState(null);
    
    useEffect(() => {
        const id = localStorage.getItem('memberId');
        setMemberId(id ? Number(id) : null);
    }, []);
    
    return { memberId, isLoggedIn: !!memberId };
}
```

## 🎮 게임 조작법

| 키 | 동작 |
|----|------|
| **방향키 ↑↓←→** | 캐릭터 이동 |
| **Space** | NPC와 대화 / 페르소나 생성 |
| **마우스 클릭** | 대화창 닫기 |

## 🎯 향후 계획

- [ ] 웹소켓을 활용한 실시간 대화
- [ ] 여러 NPC 동시 배치
- [ ] 맵 타일셋 적용
- [ ] 캐릭터 애니메이션 추가
- [ ] 사운드 이펙트 및 BGM
- [ ] 모바일 터치 조작 지원
- [ ] PWA 전환 (오프라인 지원)

## 📚 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [React Hooks Reference](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🐛 알려진 이슈

1. **Safari에서 localStorage 이슈**: 일부 Safari 버전에서 localStorage가 작동하지 않을 수 있습니다. (해결: 쿠키 사용 권장)
2. **IE 지원 안 됨**: Phaser 3는 Internet Explorer를 지원하지 않습니다.
3. **모바일 키보드 미지원**: 현재 터치 조작이 구현되지 않았습니다.

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ using Next.js & Phaser**  
**Last Updated:** 2026-03-02

