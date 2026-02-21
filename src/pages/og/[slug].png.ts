import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { generateOgImage } from "../../utils/og-image";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description,
      category: post.data.category,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description, category } = props as {
    title: string;
    description: string;
    category?: string;
  };

  const pngData = await generateOgImage(title, description, category);

  const body = new Uint8Array(pngData) as BlobPart;
  return new Response(new Blob([body], { type: "image/png" }), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
