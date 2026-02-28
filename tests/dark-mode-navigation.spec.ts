import { test, expect } from "@playwright/test";

test("다크모드가 로고(홈) 클릭 후 라우팅에도 유지된다", async ({ page }) => {
  // 1. 블로그 포스트 페이지 접속
  await page.goto("/blog/getting-started");
  await page.waitForLoadState("networkidle");

  // 2. 라이트 모드 상태에서 시작 확인 (localStorage 초기화)
  await page.evaluate(() => localStorage.removeItem("theme"));
  await page.evaluate(() => document.documentElement.classList.remove("dark"));

  // 3. 테마 토글 버튼 클릭 → 다크 모드로 전환
  const themeToggle = page.locator("#theme-toggle");
  await themeToggle.click();

  // 4. html.dark 클래스 확인
  await expect(page.locator("html")).toHaveClass(/dark/);

  // 5. localStorage theme === 'dark' 확인
  const themeBefore = await page.evaluate(() => localStorage.getItem("theme"));
  expect(themeBefore).toBe("dark");

  // 6. 모델 뷰어(홈 링크) 클릭 → 홈으로 라우팅
  const modelViewer = page.locator('model-viewer[aria-label="홈으로 이동"]');
  await modelViewer.click();

  // 7. URL이 / 인지 확인
  await expect(page).toHaveURL("/");

  // 8. 라우팅 후에도 html.dark 클래스 유지 확인
  await expect(page.locator("html")).toHaveClass(/dark/);

  // 9. localStorage theme 여전히 'dark' 확인
  const themeAfter = await page.evaluate(() => localStorage.getItem("theme"));
  expect(themeAfter).toBe("dark");
});
