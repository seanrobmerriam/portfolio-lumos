import { getCollection, type CollectionEntry } from "astro:content";

export async function getPublishedPosts() {
  return (await getCollection("blog", ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id));
}

export function postHref(post: CollectionEntry<"blog">) {
  return `/blog/posts/${post.id.split("/").map(encodeURIComponent).join("/")}/`;
}

export function postCard(post: CollectionEntry<"blog">) {
  const { data } = post;
  const minutes = Math.max(1, Math.ceil((post.body ?? "").split(/\s+/).filter(Boolean).length / 200));
  return {
    title: data.title,
    href: postHref(post),
    category: data.category,
    date: data.pubDate.toISOString().slice(0, 10),
    dateLabel: data.pubDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }),
    excerpt: data.description,
    image: data.image ?? "",
    imageAlt: data.imageAlt,
    author: data.author,
    readTime: `${minutes} min read`,
  };
}
