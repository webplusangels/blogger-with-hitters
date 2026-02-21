#!/usr/bin/env node

/**
 * 새 블로그 포스트 생성 스크립트
 * 사용법: npm run new "포스트 제목"
 */

import { writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, "..", "src", "content", "blog");

const title = process.argv[2];

if (!title) {
  console.error("❌ 제목을 입력해주세요.");
  console.error("   사용법: npm run new \"포스트 제목\"");
  process.exit(1);
}

// Generate slug: lowercase, spaces → hyphens, remove non-alphanumeric (keep hyphens)
const slug = title
  .toLowerCase()
  .replace(/\s+/g, "-")
  .replace(/[^a-z0-9-]/g, "")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "");

if (!slug) {
  console.error("❌ 유효한 slug를 생성할 수 없습니다. 영문자를 포함한 제목을 입력해주세요.");
  process.exit(1);
}

// Generate date string
const now = new Date();
const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

const fileName = `${dateStr}-${slug}.mdx`;
const filePath = join(BLOG_DIR, fileName);

if (existsSync(filePath)) {
  console.error(`❌ 파일이 이미 존재합니다: ${fileName}`);
  process.exit(1);
}

const frontmatter = `---
title: "${title}"
description: ""
pubDate: ${dateStr}
tags: []
draft: true
---

여기에 내용을 작성하세요.
`;

writeFileSync(filePath, frontmatter, "utf-8");
console.log(`✅ 새 포스트가 생성되었습니다: src/content/blog/${fileName}`);
