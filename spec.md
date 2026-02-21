# Blogger-with-Hitters 프로젝트 고도화 명세서

## 1. 목표 (Goal)

초기화된 Astro + Tailwind CSS 기반의 블로그를 실 서비스 가능한 수준으로 고도화하고, UI/UX 및 SEO를 최적화한다.

## 2. 요구사항 (Requirements)

- **UI/UX 및 모던 디자인 (Tailwind CSS 활용):**
  - 전체 테마는 깊이감 있는 '다크 모드(Dark Mode)'를 고정으로 사용하며, 포인트 컬러는 세련된 형광 블루/그린(예: text-cyan-400)을 사용하여 개발자 친화적인 무드를 연출한다.
  - 가독성을 위해 폰트는 텍스트용(Pretendard 또는 Inter)과 코드블록용(Fira Code 등 JetBrains Mono)을 분리하여 적용한다.
  - Astro의 `View Transitions API`를 적용하여, 페이지 간 이동 시 깜빡임 없이 부드러운 SPA(Single Page Application) 경험을 제공한다. **(주의: Astro 5에서는 `ClientRouter`를 사용해야 함)**

- **콘텐츠 및 마크다운(MDX) 시스템:**
  - 단순 마크다운(`.md`)을 넘어 확장된 `.mdx` 포맷을 기본으로 지원하도록 설정한다.
  - 포스트 상세 페이지 우측에는 현재 읽고 있는 위치를 표시해주는 **자동 목차(Table of Contents, TOC)** 사이드바를 구현한다.
  - 본문 최상단에 예상 읽기 시간(Reading Time)을 계산하여 표시한다.
  - 향후 다양한 주제를 다룰 수 있도록 카테고리/태그 기반의 필터링 UI를 메인 페이지에 구현한다.
  - **`@tailwindcss/typography`를 사용하여 마크다운 본문에 스타일을 적용한다.**

- **상호작용 및 SEO:**
  - GitHub Discussions 기반의 `Giscus` 컴포넌트를 포스트 하단에 부착하여 방문자가 댓글을 남길 수 있도록 한다. **(주의: GitHub Discussions 활성화 필요)**
  - Open Graph(OG) 태그와 트위터 카드를 포함한 완벽한 SEO 메타데이터 헤더를 구성한다.
  - **`@astrojs/sitemap`을 사용하여 sitemap.xml을 생성하고, `robots.txt`를 추가한다.**
  - **Canonical URL을 설정하여 중복 콘텐츠 문제를 방지한다.**
  - **RSS 피드를 제공하기 위해 `@astrojs/rss`를 설정한다.**
  - **OG 이미지를 자동 생성하기 위해 `@vercel/og` 또는 `satori`를 활용한다.**

## 3. 작업 지침 (Constraints)

- 코드를 작성할 때 기존 설정 파일(`astro.config.mjs` 등)이 깨지지 않도록 유의한다.
- 컴포넌트는 최대한 재사용 가능하도록 쪼개서 `src/components` 폴더에 작성한다.
- 불필요한 더미 텍스트보다는 실제 기술 블로그에 들어갈 법한 세련된 임시 데이터로 UI를 구성한다.
- **Shiki 코드 하이라이터를 설정하고, 테마(`github-dark`, `one-dark-pro` 등)와 줄 번호, 복사 버튼을 추가한다.**
- **`category` 필드를 스키마에 추가하여 포스트를 카테고리별로 분류할 수 있도록 한다.**
- **Pagefind를 사용하여 정적 검색 기능을 구현한다.**
- **OG 이미지를 자동 생성하기 위해 `@vercel/og` 또는 `satori`를 활용한다.**
