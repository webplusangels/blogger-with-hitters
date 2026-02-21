import { Resvg } from "@resvg/resvg-js";
import type { SatoriOptions } from "satori";
import satori from "satori";

let fontDataCache: ArrayBuffer | null = null;

async function loadFont(): Promise<ArrayBuffer> {
  if (fontDataCache) return fontDataCache;

  // Fetch Noto Sans KR from Google Fonts CDN (use legacy UA to get TTF)
  const cssRes = await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    },
  );
  const css = await cssRes.text();

  // Extract TTF URL from CSS
  const urlMatch = css.match(/src:\s*url\(([^)]+)\)/);
  if (!urlMatch || !urlMatch[1]) {
    throw new Error("Failed to extract font URL from Google Fonts CSS");
  }

  const fontRes = await fetch(urlMatch[1]);
  fontDataCache = await fontRes.arrayBuffer();
  return fontDataCache;
}

export async function generateOgImage(
  title: string,
  description: string,
  category?: string,
): Promise<Uint8Array> {
  const fontData = await loadFont();

  const options: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Noto Sans KR",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  };

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
          background:
            "linear-gradient(135deg, #030712 0%, #0f172a 50%, #030712 100%)",
          fontFamily: "Noto Sans KR",
        },
        children: [
          // Top: category badge
          category
            ? {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                  },
                  children: {
                    type: "span",
                    props: {
                      style: {
                        color: "#a8a29e",
                        fontSize: "20px",
                        border: "2px solid rgba(168, 162, 158, 0.3)",
                        borderRadius: "8px",
                        padding: "6px 16px",
                        background: "rgba(168, 162, 158, 0.1)",
                      },
                      children: category,
                    },
                  },
                },
              }
            : {
                type: "div",
                props: {
                  style: { display: "flex" },
                  children: "",
                },
              },
          // Middle: title + description
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              },
              children: [
                {
                  type: "h1",
                  props: {
                    style: {
                      fontSize: title.length > 30 ? "48px" : "56px",
                      color: "#f3f4f6",
                      lineHeight: 1.3,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    children: title,
                  },
                },
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize: "24px",
                      color: "#9ca3af",
                      lineHeight: 1.5,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    children: description,
                  },
                },
              ],
            },
          },
          // Bottom: site name + decoration
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "24px",
                      color: "#a8a29e",
                      fontWeight: 700,
                    },
                    children: "nimwver.me",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      width: "80px",
                      height: "4px",
                      background: "#a8a29e",
                      borderRadius: "2px",
                      display: "flex",
                    },
                    children: "",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    options,
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });

  return resvg.render().asPng();
}
