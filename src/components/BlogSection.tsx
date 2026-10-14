import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { PenSquare, Trash2, Pencil, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { z } from "zod";

type Post = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  cover_url: string | null;
  created_at: string;
  profiles?: { display_name: string | null } | null;
  _coverSigned?: string | null;
};

const postSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(20000),
});

async function signCover(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data } = await supabase.storage.from("blog-covers").createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

export default function BlogSection() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, author_id, title, content, cover_url, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6);
    if (error) { console.error(error); return; }
    const rows = (data ?? []) as any[];
    const authorIds = Array.from(new Set(rows.map((r) => r.author_id)));
    let profileMap: Record<string, string | null> = {};
    if (authorIds.length) {
      const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", authorIds);
      profileMap = Object.fromEntries((profs ?? []).map((p: any) => [p.id, p.display_name]));
    }
    const withSigned = await Promise.all(
      rows.map(async (p) => ({ ...p, profiles: { display_name: profileMap[p.author_id] ?? null }, _coverSigned: await signCover(p.cover_url) })),
    );
    setPosts(withSigned as Post[]);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setOpen(true); }
  function openEdit(p: Post) { setEditing(p); setOpen(true); }

  async function remove(p: Post) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    if (p.cover_url) await supabase.storage.from("blog-covers").remove([p.cover_url]);
    toast.success("Post deleted");
    load();
  }

  return (
    <section className="py-24 mx-auto max-w-7xl px-5 lg:px-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-primary">From the home</span>
          <h2 className="mt-2 text-4xl md:text-5xl font-display font-bold">Stories & tips</h2>
          <p className="mt-2 text-muted-foreground max-w-xl">Tales from our cozy home — and a place for pet parents to share their own.</p>
        </div>
        {user ? (
          <Button onClick={openNew} className="gap-2"><PenSquare className="w-4 h-4" /> Write a post</Button>
        ) : (
          <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-semibold text-sm hover:bg-primary/90">
            Sign in to write
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-3xl">
          No posts yet. {user ? "Be the first to write one!" : <Link to="/auth" className="text-primary underline">Sign in</Link>} to share your story.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group bg-card border border-border rounded-3xl overflow-hidden shadow-soft flex flex-col"
            >
              {p._coverSigned && (
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={p._coverSigned} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(p.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                  <span>• by {p.profiles?.display_name ?? "Anonymous"}</span>
                </div>
                <h3 className="mt-2 text-xl font-display font-bold">
                  <Link to="/blog/$id" params={{ id: p.id }} className="hover:text-primary transition-colors">{p.title}</Link>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap line-clamp-5 flex-1">{p.content}</p>
                <Link to="/blog/$id" params={{ id: p.id }} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  Read full story →
                </Link>

                {user?.id === p.author_id && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(p)} className="gap-1"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <PostEditor open={open} onOpenChange={setOpen} post={editing} onSaved={load} />
    </section>
  );
}

function PostEditor({ open, onOpenChange, post, onSaved }: {
  open: boolean; onOpenChange: (v: boolean) => void; post: Post | null; onSaved: () => void;
}) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(post?.title ?? "");
      setContent(post?.content ?? "");
      setFile(null);
    }
  }, [open, post]);

  async function save() {
    if (!user) return;
    const parsed = postSchema.safeParse({ title, content });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    try {
      let cover_url = post?.cover_url ?? null;
      if (file) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("blog-covers").upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        if (post?.cover_url) await supabase.storage.from("blog-covers").remove([post.cover_url]);
        cover_url = path;
      }
      if (post) {
        const { error } = await supabase.from("blog_posts").update({ title, content, cover_url }).eq("id", post.id);
        if (error) throw error;
        toast.success("Post updated");
      } else {
        const { error } = await supabase.from("blog_posts").insert({ author_id: user.id, title, content, cover_url });
        if (error) throw error;
        toast.success("Post published");
      }
      onOpenChange(false);
      onSaved();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{post ? "Edit post" : "Write a new post"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="t">Title</Label>
            <Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
          </div>
          <div>
            <Label htmlFor="c">Content</Label>
            <Textarea id="c" value={content} onChange={(e) => setContent(e.target.value)} maxLength={20000} rows={10} />
          </div>
          <div>
            <Label htmlFor="f">Cover image (optional)</Label>
            <Input id="f" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
