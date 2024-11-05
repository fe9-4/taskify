# 코드잇 프론트엔드 9기 4팀 Taskify 프로젝트

<div align="center"> 
  <img src="https://www.taskify.kr/_next/image?url=%2Fimages%2Flanding%2Flanding1.png&w=828&q=75" width="auto" height="300">
</div>

## 배포 사이트: https://www.taskify.kr

## 프로젝트 소개
- Taskify 소개: 회사 내에서 업무를 하면서 팀에서 진행할 여러 프로젝트들을 하나의 직관적인 대시보드에서 관리하면서 팀원들 간 업무 소통을 원활히 하며 업무효율성을 증대시킬 수 있는 서비스입니다. 현재 프로젝트, 예정된 프로젝트, 마감된 프로젝트 등의 여러 상황에도 유연하게 적용하여 사용해볼 수 있고, 업무 진행도 및 일정, 내용 등을 하나의 대시보드와 컬럼, 카드에서 한눈에 파악할 수 있어서 팀원 모두 현재상황에 대해서 언제 어디서든 편하게 파악할 수 있습니다.
- 제작 기간: 2024. 10. 18 ~ 2024. 11. 5 
- 제작 인원: 5명 

| 문창기 | 김원 | 김충오 | 지혜민 | 홍예림 |
| :---: | :---: | :---: | :---: | :---: |
|<img src="https://avatars.githubusercontent.com/u/126491953?v=4" width="100" height="100">|<img src="https://avatars.githubusercontent.com/u/10387266?v=4" width="100" height="100">|<img src="https://avatars.githubusercontent.com/u/103034239?v=4" width="100" height="100">|<img src="https://avatars.githubusercontent.com/u/144791802?v=4" width="100" height="100">|<img src="https://avatars.githubusercontent.com/u/167871589?v=4" width="100" height="100">|
|byeolee1221|cccwon2|ChungO5|hyemeeny|hongggyelim|

- 역할
  - 문창기: 팀장, github 탬플릿, 테일윈드 커스텀 세팅, chip 컴포넌트, dropdown 컴포넌트, 컬럼 및 카드 컴포넌트, 대시보드 상세페이지
  - 김원: 레포지토리 세팅, 헤더 컴포넌트, 인증 관련 기능 및 페이지, 계정관리 페이지
  - 김충오: 랜딩 페이지, 공용 모달 컴포넌트 및 모달 페이지 제작
  - 지혜민: input 컴포넌트, date picker 커스텀, 할 일 카드(상세 조회, 생성, 수정) 모달 컴포넌트
  - 홍예림: 버튼 컴포넌트, 사이드바, 대시보드 관리 페이지


## 주요 기능 및 기술 스택

### 주요 기능

#### 대시보드로 프로젝트 관리
- 대시보드를 생성하고 팀원들을 초대하여 하나의 대시보드에서 하나의 프로젝트 전체를 관리할 수 있습니다.
- 대시보드는 언제든 생성, 삭제가 가능하며, 초대된 팀원의 관리도 편리하게 할 수 있습니다.

#### 대시보드 컬럼에서의 할 일 카드 관리
- 주요 프로젝트를 컬럼으로 만들고 해당 컬럼에서 할 일 카드를 생성하여 관리할 수 있습니다.
- 컬럼 간 이동이 가능하여 예정, 진행중, 마감 등으로 컬럼을 구분하면 상황에 따라 프로젝트를 관리해볼 수 있습니다.
- 컬럼 내 무한스크롤, 태블릿 및 모바일에서의 버튼식 스크롤, 드래그 앤 드랍방식 등 편리한 기능으로 스크롤을 많이 쓰지 않고도 전체 상황을 파악할 수 있습니다.

#### 전체 대시보드 확인이 가능한 사이드바
- 대시보드가 늘어나면 찾기가 쉽지 않을 수 있는데, 이를 사이드바에서 언제든 확인이 가능합니다.
- 모바일환경처럼 화면이 작더라도 사이드바를 펼쳐서 어떤 대시보드인지 확인이 가능하도록 구성되어 있습니다.

#### 가시성이 좋은 레이아웃 구조
- 전체적으로 사용자가 스크롤을 많이 움직이지 않게 설계되어 가시성이 좋게 구성되었습니다.
- 사용자 경험을 고려한 모달과 토스트 알람을 적절히 분배 후 적용하였습니다.

#### 사용자의 개인정보 보호를 위한 안전성 강화
- 사용자 개인정보 보호를 위해 쿠키로 토큰을 관리하였으며, HttpOnly 및 secure 등 쿠키를 안전하게 요청에 포함하여 전달할 수 있게 하였습니다.
- 로그인한 사용자만 서비스를 이용할 수 있도록 설정하여, 주요 정보가 외부로 노출되지 않도록 했습니다.

### 기술 스택

<img src="https://nextjs.org/static/favicon/favicon-32x32.png" width="16" height="16"> **[Next.js](https://nextjs.org/)** 14.2.15: 서버 사이드 렌더링(SSR) 및 정적 사이트 생성(SSG)을 지원하는 React 프레임워크

<img src="https://reactjs.org/favicon.ico" width="16" height="16"> **[React](https://reactjs.org/)** 18: 최신 버전의 React 라이브러리

<img src="https://www.typescriptlang.org/favicon-32x32.png" width="16" height="16"> **[TypeScript](https://www.typescriptlang.org/)** 5: 정적 타입 언어로, 코드 품질과 생산성을 높여줌

<img src="https://tailwindcss.com/favicons/favicon-32x32.png" width="16" height="16"> **[Tailwind CSS](https://tailwindcss.com/)** 3.4.14: 유틸리티 기반의 CSS 프레임워크로, 빠르고 효율적인 스타일링 제공

<img src="https://axios-http.com/assets/favicon.ico" width="16" height="16"> **[Axios](https://axios-http.com/)** 1.7.7: HTTP 요청을 간편하게 처리할 수 있는 라이브러리

<img src="https://jotai.org/favicon.svg" width="16" height="16"> **[Jotai](https://jotai.org/)** 2.10.1: 간결하고 사용하기 쉬운 전역 상태 관리 라이브러리



## 주요 의존성

<img src="https://react-hook-form.com/images/logo/react-hook-form-logo-only.png" width="16" height="16"> **[`react-hook-form`](https://react-hook-form.com/)** 7.53.0: 폼 관리를 위한 React 라이브러리

<img src="https://github.com/react-hook-form.png" width="16" height="16"> **[`@hookform/resolvers`](https://github.com/react-hook-form/resolvers)** 3.9.0: 폼 유효성 검사를 위한 라이브러리

<img src="https://react-hot-toast.com/favicon.png" width="16" height="16"> **[`react-hot-toast`](https://react-hot-toast.com/)** 2.4.1: 알림 메시지를 표시하기 위한 라이브러리

<img src="/public/images/favicons/tailwind-merge.svg" width="16" height="16"> **[`tailwind-merge`](https://github.com/dcastil/tailwind-merge)** 2.5.4: Tailwind CSS 클래스를 효율적으로 병합하는 유틸리티

<img src="https://zod.dev/static/favicon-32x32.png" width="16" height="16"> **[`zod`](https://github.com/colinhacks/zod)** 3.23.8: 스키마 선언 및 유효성 검사 라이브러리

<img src="/public/images/favicons/react_datepicker.png" width="16" height="16"> **[`react-datepicker`](https://reactdatepicker.com/)** 7.5.0: 날짜 선택 컴포넌트를 제공하는 라이브러리

<img src="https://react-icons.github.io/react-icons/favicon.ico" width="16" height="16"> **[`react-icons`](https://react-icons.github.io/react-icons/)** 5.3.0: 다양한 아이콘 세트를 제공하는 라이브러리

<img src="https://github.com/reactjs.png" width="16" height="16"> **[`react-modal`](https://github.com/reactjs/react-modal)** 3.16.1: 모달 창을 쉽게 구현할 수 있게 해주는 라이브러리

## 스크립트 설명

| 스크립트 | 설명                                        |
| -------- | ------------------------------------------- |
| `dev`    | 개발 서버를 실행합니다.                     |
| `build`  | 프로덕션 빌드를 생성합니다.                 |
| `start`  | 프로덕션 빌드를 기반으로 서버를 실행합니다. |
| `lint`   | ESLint를 사용하여 코드 스타일을 검사합니다. |
| `format` | Prettier를 사용하여 코드 형식을 정리합니다. |
| `test`   | 테스트를 실행합니다. (현재 설정되지 않음)   |

## 패키지 매니저: Bun

이 프로젝트는 [Bun](https://bun.sh/)을 패키지 매니저로 사용합니다. Bun은 빠른 JavaScript 런타임 및 패키지 매니저입니다.

### Bun 설치 (Windows)

Windows에서 Bun을 설치하려면 PowerShell을 관리자 모드로 실행한 후 다음 명령어를 입력하세요:

```powershell
npm install -g bun
```

### package.json 인스톨

```bash
bun install
```

### Bun으로 라이브러리 추가

```bash
bun add zod
```

### Bun으로 프로젝트 실행

프로젝트를 빌드하고 개발 서버를 실행하려면 다음 명령어를 사용하세요:

```bash
# 프로젝트 빌드
bun run build

# 개발 서버 실행
bun run dev
```

## 개발 환경 설정

### ESLint

ESLint는 JavaScript 및 TypeScript 코드의 품질을 향상시키고 일관된 코딩 스타일을 유지하는 데 도움을 줍니다.
이 프로젝트에서는 다음과 같이 ESLint를 구성했습니다:

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "react/react-in-jsx-scope": "off"
  }
}
```

이 설정은 Next.js의 core-web-vitals 규칙과 Prettier 호환성을 포함하며, React 17 이상에서는 React를 import 하지 않아도 되도록 설정되어 있습니다.

### Prettier

코드 스타일의 일관성을 유지하기 위해 Prettier를 사용합니다. `.prettierrc` 파일에 다음과 같이 구성되어 있습니다:

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "proseWrap": "preserve",
  "endOfLine": "auto",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

이 설정은 코드의 일관성을 유지하며, Tailwind CSS와의 호환성을 위한 플러그인을 포함하고 있습니다.

### TypeScript

타입 안정성을 높이기 위해 TypeScript를 사용합니다. `tsconfig.json` 파일에 다음과 같이 구성되어 있습니다:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["@hookform/resolvers"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

이 설정은 Next.js와 호환되는 TypeScript 환경을 제공하며, 절대 경로 임포트를 위한 paths 설정과 react-hook-form 타입을 포함하고 있습니다.

### TailwindCSS

CSS 프레임워크로 스타일링을 돕습니다. `tailwind.config.ts` 파일에 다음과 같이 구성되어 있습니다:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Helvetica Neue",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
```

이 설정은 프로젝트의 특정 색상과 폰트 설정을 포함하며, Tailwind CSS를 프로젝트의 모든 페이지와 컴포넌트에 적용할 수 있도록 구성되어 있습니다.

