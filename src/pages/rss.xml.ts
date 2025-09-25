import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import type { APIContext } from "astro";
import { marked } from "marked";
import { siteConfig } from "@/config";

function stripInvalidXmlChars(str: string): string {
  return str.replace(
    // biome-ignore lint/suspicious/noControlCharactersInRegex: https://www.w3.org/TR/xml/#charsets
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
    ""
  );
}

export async function GET(context: APIContext) {
  const blog = await getSortedPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.subtitle || "非淡泊无以明志，非宁静无以致远",
    site: context.site ?? "https://blog.fis.ink",
    items: blog.map((post) => {
      const content =
        typeof post.body === "string" ? post.body : String(post.body || "");
      const cleanedContent = stripInvalidXmlChars(content);
      const finalSlug = post.data.customSlug || post.slug;

      return {
        title: post.data.title,
        pubDate: post.data.published,
        description: post.data.description || "",
        link: `/posts/${finalSlug}/`,
        content: marked(cleanedContent), // 直接用 marked 解析，不再过滤
      };
    }),
    customData: `<language>${siteConfig.lang}</language>`,
    stylesheet: "/rss-style.xsl",
  });
}