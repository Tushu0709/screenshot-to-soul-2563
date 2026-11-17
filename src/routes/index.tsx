import { createFileRoute } from "@tanstack/react-router";
import template from "@/pounce/pounce.html?raw";

// The home page is the standalone "pounce." hero document, served as-is.
// Image placeholders (@@name@@) resolve to the uploaded CDN pictures.
const assets = import.meta.glob<{ url: string }>("../assets/pounce/*.asset.json", {
  eager: true,
  import: "default",
});

const urls: Record<string, string> = {};
for (const [path, asset] of Object.entries(assets)) {
  const name = (path.split("/").pop() ?? "").replace(/(-milo)?\.(webp|mp4)\.asset\.json$/, "");
  urls[name] = asset.url;
}

const html = template.replace(/@@([a-z0-9-]+)@@/g, (match, key: string) => {
  const url = urls[key];
  if (!url) throw new Error(`Missing picture for ${match}`);
  return url;
});

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: () =>
        new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
    },
  },
});
