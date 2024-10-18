# 코드잇 프론트엔드 9기 4팀 Taskify 프로젝트

## 주요 기능 및 기술 스택

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
bun install
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
