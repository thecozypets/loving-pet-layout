import { createFileRoute } from "@tanstack/react-router";
import BlogSection from "@/components/BlogSection";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Pet Care Stories & Tips | The Cozy Pets" },
      { name: "description", content: "Pet care stories, boarding tips and updates from The Cozy Pets community in Pune. Sign in to publish your own story." },
      { property: "og:title", content: "Blog — Pet Care Stories & Tips | The Cozy Pets" },
      { property: "og:description", content: "Pet care stories, boarding tips and updates from The Cozy Pets community in Pune. Sign in to publish your own story." },
      { property: "og:url", content: "https://thecozyypets-co.lovable.app/blog" },
      { name: "twitter:title", content: "Blog — Pet Care Stories & Tips | The Cozy Pets" },
      { name: "twitter:description", content: "Pet care stories, boarding tips and updates from The Cozy Pets community in Pune. Sign in to publish your own story." },
    ],
    links: [{ rel: "canonical", href: "https://thecozyypets-co.lovable.app/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <main className="pt-10 pb-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-red-700">Stories & Tips</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Read our latest pet care stories and tips. Signed-in users can write and publish their own.
        </p>
      </div>
      <BlogSection />
    </main>
  );
}
