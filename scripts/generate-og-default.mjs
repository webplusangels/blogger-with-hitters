/**
 * scripts/generate-og-default.mjs
 *
 * Generates:
 *  - public/og-default.png (1200x630, default OG image)
 *  - public/favicon-16x16.png
 *  - public/favicon-32x32.png
 *  - public/apple-touch-icon.png (180x180)
 *
 * Run: node scripts/generate-og-default.mjs
 */

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

// ── Font loading ──────────────────────────────────────────────────────────────

async function loadFont() {
  try {
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
      }
    );
    const css = await cssRes.text();
    const urlMatch = css.match(/src:\s*url\(([^)]+)\)/);
    if (!urlMatch || !urlMatch[1]) throw new Error("Font URL not found");
    const fontRes = await fetch(urlMatch[1]);
    return await fontRes.arrayBuffer();
  } catch (err) {
    console.warn("⚠️  Font fetch failed, using fallback sans-serif:", err.message);
    return null;
  }
}

// ── OG Default Image (1200x630) ───────────────────────────────────────────────

async function generateOgDefault(fontData) {
  const fonts = fontData
    ? [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" }]
    : [];

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #030712 0%, #0f172a 50%, #030712 100%)",
          fontFamily: fontData ? "Noto Sans KR" : "sans-serif",
        },
        children: [
          // Top: site name
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
              },
              children: [
                // Wave decoration
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "40px",
                      color: "#22d3ee",
                    },
                    children: "〜",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "28px",
                      color: "#a8a29e",
                      fontWeight: 700,
                    },
                    children: "nimwver.me",
                  },
                },
              ],
            },
          },
          // Middle: main title
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              },
              children: [
                {
                  type: "h1",
                  props: {
                    style: {
                      fontSize: "64px",
                      color: "#f3f4f6",
                      lineHeight: 1.2,
                      margin: 0,
                    },
                    children: "nimwver.me",
                  },
                },
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize: "28px",
                      color: "#9ca3af",
                      lineHeight: 1.5,
                      margin: 0,
                    },
                    children: "개인 블로그",
                  },
                },
              ],
            },
          },
          // Bottom: cyan accent line
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "20px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "120px",
                      height: "4px",
                      background: "#0891b2",
                      borderRadius: "2px",
                      display: "flex",
                    },
                    children: "",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "18px",
                      color: "#4b5563",
                    },
                    children: "작은 블로그",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return resvg.render().asPng();
}

// ── Favicon PNG from SVG ──────────────────────────────────────────────────────

function generateFaviconPng(size) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="16" fill="#0e7490"/>
  <path d="M6 16 Q8.5 11 11 16 Q13.5 21 16 16 Q18.5 11 21 16 Q23.5 21 26 17"
        stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        fill="none"/>
</svg>`;

  const resvg = new Resvg(svgContent, {
    fitTo: { mode: "width", value: size },
  });
  return resvg.render().asPng();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Generating assets...\n");

  // Load font
  console.log("📥 Loading font...");
  const fontData = await loadFont();
  if (fontData) {
    console.log("✅ Font loaded\n");
  } else {
    console.log("⚠️  Using system font fallback\n");
  }

  // Generate og-default.png
  console.log("🖼  Generating og-default.png (1200x630)...");
  const ogPng = await generateOgDefault(fontData);
  const ogPath = path.join(publicDir, "og-default.png");
  fs.writeFileSync(ogPath, ogPng);
  console.log(`✅ Saved: ${ogPath}\n`);

  // Generate favicon PNGs
  const favicons = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
  ];

  for (const { name, size } of favicons) {
    console.log(`🖼  Generating ${name} (${size}x${size})...`);
    const png = generateFaviconPng(size);
    const filePath = path.join(publicDir, name);
    fs.writeFileSync(filePath, png);
    console.log(`✅ Saved: ${filePath}`);
  }

  console.log("\n🎉 All assets generated successfully!");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
