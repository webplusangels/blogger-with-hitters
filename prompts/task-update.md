# 프로젝트 작업 지시서 (Astro 기반 웹사이트 개선)

현재 프로젝트의 SEO/Meta 정보 최적화 및 UI/UX 개선 작업을 수행해야 합니다.
오케스트레이터는 아래의 Phase 1부터 3까지 순차적으로 실행하세요. 각 Phase의 작업은 `task` 도구를 사용하여 적절한 하위 에이전트에게 위임하고, **하나의 Phase가 완전히 끝날 때마다 `git-master`를 이용해 작업 내역을 커밋한 후** 다음 Phase로 넘어가세요.

---

## Phase 1: SEO & Meta Data Setup

**TASK**: 브라우저, SNS, 검색엔진을 위한 메타데이터 및 아이콘 추가 설정
**EXPECTED OUTCOME**: `public/` 폴더 내 필요한 에셋/매니페스트 생성 및 `BaseLayout.astro`의 `<head>` 영역에 완벽한 메타 태그가 적용된 상태. 관련 문서화 완료.
**REQUIRED SKILLS**: ["git-master"]
**REQUIRED TOOLS**: []
**MUST DO**:

- `public/`에 favicon(16, 32), `apple-touch-icon.png`, `safari-pinned-tab.svg`, `og-default.png` 추가 및 `site.webmanifest` 생성
- `src/layouts/BaseLayout.astro`의 `<head>`에 favicon 링크, manifest, theme-color 설정
- Open Graph (fallback: `/og-default.png`), Twitter Card, JSON-LD (Website/Organization) 스키마 적용
- 기본 description, canonical, rss(`/rss.xml`), 소유권 메타 플레이스홀더 추가
- `docs/meta.md`에 사용된 규격 및 테마 컬러 기준 문서화
  **MUST NOT DO**: `<head>` 태그 외부의 기존 레이아웃이나 기능 로직을 수정하지 말 것.
  **CONTEXT**: `src/layouts/BaseLayout.astro` 파일, `public/` 디렉토리, `docs/meta.md`.

---

## Phase 2: UI Layout Refactoring

**TASK**: 불필요한 모듈(Search, Footer Home 링크)을 제거하고 블로그 본문의 읽기 경험을 개선하기 위한 UI 리팩토링
**EXPECTED OUTCOME**: 더 넓어진 블로그 본문 영역, 검색 모듈 완전 제거, 3D 로고 클릭을 통한 Home 라우팅 구현
**REQUIRED SKILLS**: ["frontend-ui-ux", "git-master"]
**REQUIRED TOOLS**: []
**MUST DO**:

- 오른쪽 목차(sticky-top) 컴포넌트 너비를 축소하거나 반응형으로 조정해 블로그 본문 영역 폭 확대
- GNB/레이아웃에 포함된 Search 모듈(컴포넌트 및 로직) 완전 제거
- Footer에서 'Home' 링크 제거
- 페이지 상단의 `logo.glb` (3D 로고) 컴포넌트에 Home 라우팅 클릭 이벤트 추가
  **MUST NOT DO**: 3D 로고의 렌더링 로직이나 사이트의 전체적인 컬러 스킴/기본 레이아웃 구조를 훼손하지 말 것.
  **CONTEXT**: 블로그 본문/목차 컴포넌트, Search 관련 컴포넌트, Footer 컴포넌트, 상단 Header 및 `logo.glb` 렌더링 컴포넌트. Astro 프레임워크 사용.

---

## Phase 3: State Bug Fix & E2E Testing

**TASK**: 테마(라이트/다크 모드) 전환 상태 버그 및 Home 버튼 상호작용 버그 수정, Playwright E2E 테스트 코드 작성
**EXPECTED OUTCOME**: 버그가 수정된 상태 관리 로직, 작성된 Playwright E2E 테스트 코드, 그리고 실제 브라우저 테스트 통과 결과
**REQUIRED SKILLS**: ["playwright", "git-master"]
**REQUIRED TOOLS**: []
**MUST DO**:

- **버그 재현 경로 해결:** 다크모드 상태에서 상단 Home(로고) 버튼을 클릭해 라우팅될 때, 라이트모드로 강제 초기화되는 현상을 수정할 것. (`localStorage` 및 HTML 클래스 상태 유지 보장)
- **Astro 생명주기 점검:** Astro의 View Transitions 사용 시 DOM이 교체되면서 스크립트 상태가 초기화되는 이슈가 원인인지 확인하고, 페이지 이동 후에도 테마 상태가 올바르게 Hydration(동기화)되도록 수정할 것.
- Playwright 테스트 시나리오 구현:
  1. 페이지 접속 후 다크모드로 전환
  2. 로고 클릭하여 Home으로 라우팅
  3. 라우팅 후에도 다크모드(html 태그의 dark 클래스나 로컬 스토리지 등)가 정상 유지되는지 검증
- 테스트를 직접 실행하여 통과하는지 확인할 것.
  **MUST NOT DO**: 기능과 무관한 다른 레이아웃 파일이나 컴포넌트의 스타일을 임의로 변경하지 말 것.
  **CONTEXT**: 테마 상태 관리 스크립트/컴포넌트, 상단 로고 컴포넌트, Astro View Transitions 로직, Playwright 테스트 폴더.
