# 메타데이터 & SEO 가이드

## 개요

nimwver.me 블로그에서 사용하는 메타데이터 규격, 파비콘 에셋, OG 이미지, JSON-LD 스키마 기준을 정리한 문서입니다.

---

## 테마 컬러

| 모드 | 색상 코드 | 용도 |
|------|-----------|------|
| 라이트 | `#fafaf9` (stone-50) | `background_color`, `theme-color` (light) |
| 다크 | `#1a1c1c` | `theme-color` (dark), OG 이미지 배경 |
| 포인트 | `#0e7490` (cyan-700) | 파비콘 배경, mask-icon 색상, 어센트 컬러 |
| 포인트 (밝음) | `#0891b2` (cyan-600) | OG 이미지 하단 라인 |

---

## 파비콘 파일 목록

모든 파비콘 파일은 `public/` 디렉토리에 위치합니다.

| 파일명 | 크기 | 용도 |
|--------|------|------|
| `favicon.svg` | 벡터 | 모던 브라우저 기본 파비콘 (`<link rel="icon" type="image/svg+xml">`) |
| `favicon-16x16.png` | 16×16 | 레거시 브라우저 16px 아이콘 |
| `favicon-32x32.png` | 32×32 | 레거시 브라우저 32px 아이콘 |
| `apple-touch-icon.png` | 180×180 | iOS 홈화면 추가 아이콘 |
| `safari-pinned-tab.svg` | 벡터 (단색) | Safari 핀 탭 아이콘 (흑백 경로만 사용) |
| `site.webmanifest` | JSON | PWA 매니페스트 |

### 파비콘 디자인

물결(`~`) 모양을 사용한 심플한 SVG 디자인. 해파리 3D 로고(`logo.glb`)와 테마 일관성 유지.

- 배경: `#0e7490` (cyan 원형)
- 아이콘: 흰색 물결선 (`stroke-width: 2.5`)

### PNG 생성 방법

`scripts/generate-og-default.mjs`를 실행하면 SVG → PNG 변환 (resvg 사용):

```bash
node scripts/generate-og-default.mjs
```

---

## Web App Manifest (`site.webmanifest`)

```json
{
  "name": "nimwver.me",
  "short_name": "nimwver",
  "theme_color": "#0e7490",
  "background_color": "#fafaf9",
  "display": "browser"
}
```

---

## OG 이미지

### 동적 OG 이미지 (블로그 포스트)

경로: `/og/[slug].png`
엔드포인트: `src/pages/og/[slug].png.ts`
생성 함수: `src/utils/og-image.ts`

- 크기: 1200×630
- 배경: 다크 그라디언트 (`#030712` → `#0f172a`)
- 폰트: Noto Sans KR (Google Fonts CDN, 런타임 fetch)

### 기본 OG 이미지 (fallback)

경로: `public/og-default.png`
크기: 1200×630

생성 방법:
```bash
node scripts/generate-og-default.mjs
```

디자인:
- 배경: 다크 그라디언트 (동적 OG와 동일)
- 상단: 물결(`〜`) + `nimwver.me` 텍스트
- 중앙: 대형 `nimwver.me` + `개인 블로그` 서브텍스트
- 하단: cyan `#0891b2` 어센트 라인

---

## BaseLayout.astro `<head>` 메타태그

### 파비콘 & 매니페스트

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0e7490" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafaf9" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a1c1c" />
```

### Open Graph

```html
<meta property="og:type" content="website | article" />
<meta property="og:url" content="{canonical}" />
<meta property="og:title" content="{pageTitle}" />
<meta property="og:description" content="{description}" />
<meta property="og:image" content="{ogImageURL}" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:site_name" content="nimwver.me" />
<!-- article 타입인 경우 -->
<meta property="article:published_time" content="{pubDate.toISOString()}" />
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="{canonical}" />
<meta name="twitter:title" content="{pageTitle}" />
<meta name="twitter:description" content="{description}" />
<meta name="twitter:image" content="{ogImageURL}" />
```

---

## JSON-LD 스키마

### WebSite (메인 페이지)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "nimwver.me",
  "url": "https://nimwver.me",
  "description": "개인 블로그"
}
```

### BlogPosting (블로그 포스트)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{pageTitle}",
  "description": "{description}",
  "url": "{canonical}",
  "datePublished": "{pubDate.toISOString()}",
  "publisher": {
    "@type": "Person",
    "name": "nimwver",
    "url": "https://nimwver.me"
  }
}
```

---

## 소유권 확인 메타태그

`BaseLayout.astro` `<head>` 내 주석으로 플레이스홀더가 포함되어 있습니다.
실제 값을 발급받은 후 주석을 해제하고 코드를 교체하세요.

```html
<!-- Google Search Console: https://search.google.com/search-console -->
<meta name="google-site-verification" content="YOUR_GOOGLE_CODE_HERE" />

<!-- Naver Search Advisor: https://searchadvisor.naver.com -->
<meta name="naver-site-verification" content="YOUR_NAVER_CODE_HERE" />
```

---

## RSS 피드

경로: `/rss.xml`
엔드포인트: `src/pages/rss.xml.ts`

```html
<link rel="alternate" type="application/rss+xml" title="nimwver.me RSS Feed" href="/rss.xml" />
```
