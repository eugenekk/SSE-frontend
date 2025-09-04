# SSE Frontend - 실시간 작업 처리 시스템 (클라이언트)

Server-Sent Events(SSE)를 활용한 실시간 작업 처리 시스템의 프론트엔드 애플리케이션입니다.

## 📋 프로젝트 개요

이 프로젝트는 SSE 기술을 테스트하고 학습하기 위한 MVP(Minimum Viable Product)로, 백엔드 서버에서 처리되는 작업들을 실시간으로 모니터링하고 상호작용할 수 있는 웹 인터페이스를 제공합니다.

## 🛠 기술 스택

- **Frontend Framework**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **실시간 통신**: Server-Sent Events (EventSource API)
- **상태 관리**: React Hooks (useState, useEffect, useCallback)
- **패키지 매니저**: npm

## ✨ 주요 기능

### 🔌 실시간 서버 연결
- SSE(Server-Sent Events)를 통한 실시간 서버 통신
- 연결 상태 표시 (연결됨/연결 끊김)
- 자동 재연결 기능

### 📊 작업 관리
- **3가지 작업 유형 지원**:
  - Standard (5초 처리)
  - Long (10초 처리)
  - Extended (15초 처리)
- 작업 생성 및 실시간 진행률 추적
- 작업 상태별 시각적 구분 (대기중, 처리중, 완료, 실패)

### 📈 실시간 모니터링
- 큐 상태 실시간 업데이트 (대기 중, 처리 중, 완료된 작업 수)
- 작업별 진행률 프로그레스 바 (25%, 50%, 75%, 100%)
- 현재 처리 중인 작업 ID 표시

### 🎨 사용자 경험
- 토스트 알림 시스템 (성공, 실패, 정보 메시지)
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 직관적인 UI/UX
- 연결 상태에 따른 버튼 비활성화

## 🚀 시작하기

### 필수 조건
- Node.js 18.0.0 이상
- npm 또는 yarn
- [SSE Backend](https://github.com/eugenekk/SSE-backend) 서버 실행 중

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/eugenekk/SSE-frontend.git
cd SSE-frontend
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
`.env.local` 파일을 생성하고 백엔드 서버 주소를 설정:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **브라우저에서 접속**
http://localhost:3000

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

## 🏗 프로젝트 구조

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지 (SSE 클라이언트)
├── components/            # 재사용 가능한 컴포넌트
│   └── Toast.tsx          # 토스트 알림 컴포넌트
├── hooks/                 # 커스텀 React 훅
│   └── useToast.ts        # 토스트 알림 훅
├── public/               # 정적 파일
└── package.json          # 프로젝트 설정 및 의존성
```

## 📡 SSE 이벤트 처리

애플리케이션에서 처리하는 SSE 이벤트들:

- **`connected`**: 서버 연결 확인
- **`job-progress`**: 작업 진행률 업데이트 (25%, 50%, 75%)
- **`job-complete`**: 작업 완료 알림
- **`job-error`**: 작업 실패 알림
- **`queue-status`**: 큐 상태 업데이트 (대기/처리중/완료 작업 수)
- **`heartbeat`**: 연결 유지용 하트비트

## 🎯 사용 방법

1. **서버 연결 확인**: 페이지 상단의 연결 상태 인디케이터 확인
2. **작업 생성**: "Create Job" 섹션에서 원하는 작업 유형 선택
3. **실시간 모니터링**: 
   - Queue Status에서 전체 큐 상황 확인
   - Jobs 섹션에서 개별 작업 진행률 추적
4. **알림 확인**: 화면 우하단 토스트 메시지로 작업 완료/실패 확인

## 🔧 주요 컴포넌트 설명

### 메인 페이지 (app/page.tsx)
- SSE 연결 관리
- 작업 상태 관리
- UI 렌더링 및 이벤트 처리

### Toast 컴포넌트 (components/Toast.tsx)
- 사용자 알림 메시지 표시
- 자동 사라짐 기능 (4초)
- 3가지 타입: success, error, info

### useToast 훅 (hooks/useToast.ts)
- 토스트 메시지 상태 관리
- 메시지 추가/제거 함수 제공

## 🐛 알려진 이슈

- SSE 연결이 불안정한 네트워크에서 간헐적으로 끊어질 수 있음
- 대량의 작업 생성 시 UI 성능 저하 가능

## 🤝 기여하기

1. 이 저장소를 Fork
2. 새로운 브랜치 생성 (`git checkout -b feature/새기능`)
3. 변경사항 커밋 (`git commit -am '새기능 추가'`)
4. 브랜치에 Push (`git push origin feature/새기능`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🔗 관련 저장소

- [SSE Backend](https://github.com/eugenekk/SSE-backend) - 백엔드 서버

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 Issues를 통해 연락해 주세요.