# AGENTS.md

이 파일은 AI 코딩 에이전트(opencode 등)가 프로젝트를 이해하고 올바르게 작업하기 위한 지침서입니다.

---

## 프로젝트 개요

블로그. 라이트/다크 모드 전환 지원, cyan 포인트 컬러, 한국어 콘텐츠 포함.

- **Repository:** `webplusangels/blogger-with-hitters` (GitHub)
- **Framework:** Astro 5 (SSG, output: static)
- **CSS:** Tailwind CSS 4 (`@tailwindcss/vite` 플러그인 방식 — `tailwind.config.js` 없음)
- **Language:** TypeScript (strict)

---

## 명령어

```bash
npm run dev      # 개발 서버 (localhost:4321)
npm run build    # 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

---

## 디렉토리 구조

```
src/
  components/          # 재사용 가능한 Astro 컴포넌트 (반드시 여기에)
  content/
    blog/              # 블로그 포스트 (.md 또는 .mdx)
  layouts/
    BaseLayout.astro   # 전체 HTML 쉘 (head, nav, footer 포함)
    BlogPost.astro     # 포스트 상세 레이아웃
  pages/
    index.astro
    blog/[...slug].astro
  styles/
    global.css
  content.config.ts    # Collection 스키마 (Zod)
```

---

## Content Collection 스키마 (blog)

```typescript
// src/content.config.ts
{
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
}
```

glob 패턴: `**/*.{md,mdx}` (MDX 지원 활성화됨)

---

## 주요 규칙 및 제약

### Astro 버전별 주의사항 (Astro 5)

- View Transitions: `import { ClientRouter } from 'astro:transitions'` 사용. 구버전 `ViewTransitions` import는 deprecated.
- Content Layer API 사용 중 (`glob` loader). `getEntryBySlug` 대신 `getEntry` 사용.

### Tailwind CSS v4 주의사항

- `tailwind.config.js` 없음. CSS 변수 사용 시 `src/styles/global.css`에 직접 작성.
- 다크 모드: **클래스 기반 토글 방식** — `<html class="dark">` 여부로 전환. `dark:` variant를 적극 활용할 것.
- 모드 전환 로직: `localStorage`에 `theme` 키로 `'light'` / `'dark'` 저장. 초기 로드 시 `<head>` 인라인 스크립트로 깜빡임 없이 적용.
- **라이트 모드 기본 색상:** `bg-stone-50`, `text-stone-800`, 포인트 `text-teal-700`, `border-cyan-600`.
- **다크 모드 색상:** `dark:bg-[#1a1c1c]`, `dark:text-gray-100`, 포인트 `dark:text-teal-400/90`, `dark:border-cyan-400`.

### 한글 처리

- `BaseLayout.astro`의 `<meta charset="UTF-8">`와 `<html lang="ko">` 절대 제거 금지.
- 모든 파일은 UTF-8 (BOM 없음) 인코딩으로 저장.
- 한국어/영문 본문 폰트: `@fontsource/pretendard` 설치됨.
- 코드블록 폰트: `@fontsource/jetbrains-mono` 설치됨.

### 컴포넌트 작성 원칙

- 인라인 로직보다 `src/components/`에 분리된 컴포넌트 우선.
- 상호작용이 필요한 컴포넌트는 Astro 기본 + `<script>` (가능하면 프레임워크 없이) 우선.

### `astro.config.mjs` 수정 시

- `integrations: []` 배열에만 추가. 기존 `vite.plugins` 설정 보존 필수.
- 예시:
  ```js
  import mdx from "@astrojs/mdx";
  export default defineConfig({
    integrations: [mdx()],
    vite: { plugins: [tailwindcss()] }, // 이 줄 보존
  });
  ```

---
