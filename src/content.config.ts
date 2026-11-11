import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/blog/posts" }),
  schema: z.preprocess((input) => {
    if (typeof input !== "object" || input === null) return input;
    const data = input as Record<string, unknown>;
    return { ...data, pubDate: data.pubDate ?? data.publishDate };
  }, z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().default("Notes"),
    author: z.string().default("Sean Merriam"),
    image: z.string().optional(),
    imageAlt: z.string().default(""),
    draft: z.boolean().default(false),
  })),
});

export const collections = { blog };
