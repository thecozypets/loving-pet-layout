import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$id")({
  head: () => ({
    meta: [
      { title: "Blog Post | The Cozy Pets" },
      { name: "description", content: "Read pet care stories and boarding tips from The Cozy Pets community in Pune." },
      { property: "og:title", content: "Blog Post | The Cozy Pets" },
      { property: "og:description", content: "Read pet care stories and boarding tips from The Cozy Pets community in Pune." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPostPage,
});

type Post = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  cover_url: string | null;
  created_at: string;
};

function BlogPostPage() {
  const { id } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("id, author_id, title, content, cover_url, created_at")
        .eq("id", id)
        .maybeSingle();
      if (!active) return;
      setPost((data as Post) ?? null);
      if (data) {
        const { data: prof } = await supabase.from("profiles").select("display_name").eq("id", (data as Post).author_id).maybeSingle();
        if (active) setAuthor((prof as any)?.display_name ?? null);
        if ((data as Post).cover_url) {
          const { data: signed } = await supabase.storage.from("blog-covers").createSignedUrl((data as Post).cover_url!, 60 * 60 * 24 * 7);
          if (active) setCover(signed?.signedUrl ?? null);
        }
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [id]);

  return (
    <main className="pt-10 pb-24 mx-auto max-w-3xl px-5">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4" /> Back to all stories
      </Link>

      {loading ? (
        <div className="mt-10 space-y-4">
          <div className="h-8 w-2/3 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
        </div>
      ) : !post ? (
        <div className="mt-16 text-center text-muted-foreground">This story could not be found.</div>
      ) : (
        <article className="mt-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-red-700">{post.title}</h1>
          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
            <span>• by {author ?? "Anonymous"}</span>
          </div>
          {cover && (
            <img src={cover} alt={post.title} className="mt-6 w-full rounded-3xl object-cover" />
          )}
          <div className="mt-6 whitespace-pre-wrap leading-relaxed text-foreground/90">{post.content}</div>
        </article>
      )}
    </main>
  );
}
