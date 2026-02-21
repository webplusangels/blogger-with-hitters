# 프로젝트 이슈

## ISSUE-1: 한글 제목 폰트 Pretendard로 복구

**원인:** `Playfair Display`는 한글 글리프가 없어 `h1~h3`의 한글이 OS 기본 폰트로 폴백됨. 본문(Pretendard)과 유형이 달라 가독성 저하.

**작업 내용:**

`src/styles/global.css`에서 다음 두 항목을 제거한다:

1. `@import "@fontsource/playfair-display/index.css";`
2. `h1, h2, h3, .font-display { font-family: "Playfair Display", Georgia, serif; }` 블록 전체

제거 후 `h1~h3`는 `body`의 Pretendard를 그대로 상속한다. `BaseLayout.astro`에서 로고 링크에 `font-display` 클래스가 붙어 있다면 함께 제거한다.

수정 파일: `src/styles/global.css`, `src/layouts/BaseLayout.astro`

---

## ISSUE-2: 코드 블록 라이트 모드 가독성 개선 (Shiki 듀얼 테마)

**원인:** 현재 Shiki 테마가 단일 테마(`github-dark` 계열)로 고정되어 있어 라이트 모드에서 어두운 배경 코드 블록이 페이지와 충돌함.

**작업 내용:**

1. `astro.config.mjs`에 듀얼 테마 설정 추가:

   ```js
   markdown: {
     shikiConfig: {
       themes: {
         light: 'github-light',
         dark:  'one-dark-pro',
       },
     },
   },
   ```

2. `src/styles/global.css`에 클래스 기반 테마 전환 CSS 추가:

   ```css
   /* Astro가 두 테마를 모두 렌더링하므로, 현재 모드가 아닌 것을 숨김 */
   .astro-code[data-theme="dark"] {
     display: none;
   }
   html.dark .astro-code[data-theme="light"] {
     display: none;
   }
   html.dark .astro-code[data-theme="dark"] {
     display: block;
   }
   ```

3. 기존 `.astro-code` 패딩/줄번호/복사버튼 CSS에 `data-theme` selector가 겹치지 않는지 확인 후 필요 시 병합.

수정 파일: `astro.config.mjs`, `src/styles/global.css`

---

## ISSUE-3: 레이아웃 재구성 — 헤더 제거 + 푸터 네비 + 플로팅 테마 버튼

**작업 내용:**

### 3-A. `src/layouts/BaseLayout.astro`

- `<header>` 블록 **전체 삭제** (SearchComponent, ThemeToggle 임포트 포함)
- `<footer>` 내부를 아래와 같이 교체:
  ```html
  <footer>
    <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
      <!-- 사이트명 -->
      <span class="font-bold text-teal-700 dark:text-cyan-400">nimwver.me</span>
      <!-- 검색 + 링크 -->
      <div class="flex items-center gap-4">
        <search placeholder="검색..." />
        <!-- 기존 Search 컴포넌트 -->
        <a href="/">Home</a>
        <a href="/rss.xml">RSS</a>
      </div>
    </div>
  </footer>
  ```
- `ThemeToggle` 컴포넌트를 `</body>` 직전으로 이동.

### 3-B. `src/components/ThemeToggle.astro`

버튼 외관을 **플로팅 고정** 스타일로 변경:

- `fixed bottom-6 right-6 z-50`
- 크기: `w-10 h-10 rounded-full`
- 배경: `bg-stone-200/80 backdrop-blur-sm dark:bg-gray-800/80`
- 그림자: `shadow-md hover:shadow-lg`
- 기존 sun/moon SVG 인라인 로직은 유지.

수정 파일: `src/layouts/BaseLayout.astro`, `src/components/ThemeToggle.astro`

---

## ISSUE-4: 헤더 해파리 (정적 배치, 스크롤 고정 없음, 경량 로딩)

**기존 헤더 nav를 제거한 뒤(ISSUE-3 완료 후 진행)**, 페이지 최상단에 회전하는 해파리 모델을 배치한다.

**작업 내용:**

### 4-A. `src/components/ModelViewer.astro` 수정

현재 컴포넌트를 아래 스펙으로 교체:

- `position: static` — `sticky`/`fixed` 없음, 스크롤 시 위로 사라짐
- 크기: `height: 140px; width: 140px` (너무 크지 않게)
- 중앙 정렬: `mx-auto block`
- `<model-viewer>` 속성:
  - `auto-rotate` — 자동 회전
  - `rotation-per-second="30deg"` — 천천히
  - `camera-controls` 제거 — 사용자 조작 불가
  - `interaction-prompt="none"` — 손 모양 아이콘 제거
  - `loading="lazy"` — 뷰포트 진입 시 로드
  - `reveal="auto"` — 로드 완료 전까지 placeholder 표시
- `public/models/jellyfish.glb` 파일이 없으면 컴포넌트를 렌더링하지 않고 빈 `<div>` 반환 (파일 존재 체크는 빌드 타임에 `fs.existsSync` 사용).

### 4-B. `src/layouts/BaseLayout.astro`

- `<ModelViewer>` 태그를 `<main>` 바로 위, 전체 너비 컨테이너 안에 배치:
  ```html
  <div class="flex justify-center py-6">
    <ModelViewer src="/models/jellyfish.glb" alt="해파리" />
  </div>
  ```

### 경량 로딩 전략

- `<model-viewer>` CDN 스크립트 태그에 `defer` 추가 (이미 `type="module"` 이므로 자동 defer)
- `BaseLayout.astro`의 `<head>` 스크립트를 `<link rel="modulepreload">` 없이 유지 — 3D 모델이 LCP 블로킹하지 않도록
- GLB 파일은 `public/models/` 경로에서 직접 서빙 (번들링 없음)

수정 파일: `src/components/ModelViewer.astro`, `src/layouts/BaseLayout.astro`

---

## ISSUE-5: 검색 UI 수정

**검색 기능은 이미 `astro-pagefind` + `Search.astro`로 구현되어 있음.**

**문제 원인:** Pagefind UI가 전체 블록 위젯으로 설계되어, 네비게이션 인라인 배치 시 높이·결과 패널 레이아웃이 깨짐. ISSUE-3에서 푸터로 이동 후에도 동일 문제 발생 가능. 검색 창 높이도 현재 비교적 크기 떄문에 줄일 수 있는 방법을 찾아야 함.

**작업 내용:**

`src/components/Search.astro`의 `<style>` 블록에 추가:

```css
/* 입력창 높이 제한 */
:global(.pagefind-ui__search-input) {
  height: 36px !important;
  padding: 0 0.75rem !important;
  font-size: 0.875rem !important;
}

/* 결과 패널을 절대 위치 오버레이로 */
:global(.pagefind-ui__form) {
  position: relative;
}
:global(.pagefind-ui__drawer) {
  position: absolute;
  bottom: calc(100% + 4px); /* 푸터에 배치되므로 위로 올라오게 */
  right: 0;
  width: 420px;
  max-height: 60vh;
  overflow-y: auto;
  z-index: 100;
  background: var(--pagefind-ui-background);
  border: 1px solid var(--pagefind-ui-border);
  border-radius: var(--pagefind-ui-border-radius);
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
}
```

**주의:** `bottom: calc(100% + 4px)` 는 푸터 배치 기준. 향후 위치가 바뀌면 `top` / `bottom` 방향 조절 필요.

수정 파일: `src/components/Search.astro`, `src/styles/global.css` (Pagefind 라이트 모드 색상 토큰 재확인)

## ISSUE-6: 포인트 색상 변경

- 플로팅 시에 빛나는 효과 제거
- 청록색을 보다 빈티지하고 따뜻한 색상으로 변경
