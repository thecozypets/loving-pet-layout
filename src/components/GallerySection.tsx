import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import heroImg from "@/assets/hero-pets.jpg";
import aboutImg from "@/assets/about-dog.jpg";
import daycareImg from "@/assets/daycare-new.jpg";
import overnightImg from "@/assets/overnight-latest.jpg";

type Kind = "image" | "video";
type Item = { id: string; src: string; alt: string; span: string; path: string; kind: Kind; position: number };

const SEED_MARKER = ".seeded";
const DEFAULT_SEEDS = [
  { url: heroImg, name: "default-hero.jpg" },
  { url: aboutImg, name: "default-about.jpg" },
  { url: daycareImg, name: "default-daycare.jpg" },
  { url: overnightImg, name: "default-overnight.jpg" },
];

const VIDEO_EXT = ["mp4", "webm", "mov", "m4v", "ogg"];
const isVideoName = (name: string) => VIDEO_EXT.includes((name.split(".").pop() ?? "").toLowerCase());

async function signGallery(path: string): Promise<string | null> {
  const { data } = await supabase.storage.from("gallery").createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

async function seedDefaultsIfEmpty() {
  const { data: existing } = await supabase.storage.from("gallery").list("", { limit: 5 });
  if (existing && existing.some((f) => f.name === SEED_MARKER)) return;
  if (existing && existing.length > 0) {
    await supabase.storage.from("gallery").upload(SEED_MARKER, new Blob([""]), { upsert: true });
    return;
  }
  for (const seed of DEFAULT_SEEDS) {
    try {
      const res = await fetch(seed.url);
      const blob = await res.blob();
      await supabase.storage.from("gallery").upload(seed.name, blob, { contentType: blob.type || "image/jpeg", upsert: true });
    } catch (e) { console.error("seed failed", seed.name, e); }
  }
  await supabase.storage.from("gallery").upload(SEED_MARKER, new Blob([""]), { upsert: true });
}

function spanFor(i: number) {
  return i === 0 ? "lg:col-span-2 lg:row-span-2" : i === 3 ? "lg:col-span-2" : "";
}

export default function GallerySection({ heading = true }: { heading?: boolean }) {
  const { user, isAdmin } = useAuth();
  const canManage = !!user && isAdmin;
  const [items, setItems] = useState<Item[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceItemRef = useRef<Item | null>(null);

  const load = async () => {
    const { data, error } = await supabase.storage.from("gallery").list("", { limit: 500, sortBy: { column: "created_at", order: "asc" } });
    if (error) { console.error(error); return; }
    const files = (data ?? []).filter((f) => f.name && !f.name.endsWith("/") && f.name !== SEED_MARKER);
    const { data: orderRows } = await supabase.from("gallery_order" as any).select("path, position");
    const posMap = new Map<string, number>();
    (orderRows as any[] | null)?.forEach((r) => posMap.set(r.path, r.position));
    // Assign fallback positions to files without rows, appended after known ones
    const maxPos = orderRows && (orderRows as any[]).length ? Math.max(...(orderRows as any[]).map((r) => r.position)) : -1;
    let next = maxPos + 1;
    const withPos = files.map((f) => ({ f, position: posMap.has(f.name) ? posMap.get(f.name)! : next++ }));
    withPos.sort((a, b) => a.position - b.position);
    const signed = await Promise.all(withPos.map(async ({ f, position }, idx) => {
      const src = await signGallery(f.name);
      if (!src) return null;
      const kind: Kind = isVideoName(f.name) ? "video" : "image";
      return { id: f.id ?? f.name, src, alt: kind === "video" ? `Video of a pet staying at The Cozy Pets (${f.name})` : `A dog or cat enjoying their stay at The Cozy Pets boarding home`, span: spanFor(idx), path: f.name, kind, position } as Item;
    }));
    setItems(signed.filter(Boolean) as Item[]);
  };

  useEffect(() => {
    (async () => {
      if (canManage) await seedDefaultsIfEmpty();
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canManage]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !canManage) return;
    const isReplace = !!replaceItemRef.current;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const toastId = toast.loading(`${isReplace ? "Replacing" : "Uploading"} ${file.name} (${sizeMb} MB)…`);
    try {
      let inheritPosition: number | null = null;
      if (replaceItemRef.current?.path) {
        inheritPosition = replaceItemRef.current.position;
        await supabase.from("gallery_order" as any).delete().eq("path", replaceItemRef.current.path);
        const { error: rmErr } = await supabase.storage.from("gallery").remove([replaceItemRef.current.path]);
        if (rmErr) throw rmErr;
      }
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("gallery").upload(path, file, { contentType: file.type });
      if (error) throw error;
      if (inheritPosition !== null) {
        await supabase.from("gallery_order" as any).upsert({ path, position: inheritPosition }, { onConflict: "path" });
      }
      toast.success(isReplace ? "Media replaced" : "Media added", { id: toastId, description: file.name });
      replaceItemRef.current = null;
      load();
    } catch (err: any) {
      console.error("Gallery upload failed", err);
      toast.error("Upload failed", { id: toastId, description: err?.message ?? "Unknown error. Please try again." });
    }
  };

  const triggerAdd = () => { replaceItemRef.current = null; fileRef.current?.click(); };
  const triggerReplace = (it: Item) => { replaceItemRef.current = it; fileRef.current?.click(); };
  const remove = async (it: Item) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("gallery_order" as any).delete().eq("path", it.path);
    const { error } = await supabase.storage.from("gallery").remove([it.path]);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted"); load();
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[idx]; const b = items[j];
    // Optimistic swap
    const next = items.slice();
    next[idx] = { ...b, position: a.position, span: spanFor(idx) };
    next[j] = { ...a, position: b.position, span: spanFor(j) };
    setItems(next);
    const { error } = await supabase.from("gallery_order" as any).upsert([
      { path: a.path, position: b.position },
      { path: b.path, position: a.position },
    ], { onConflict: "path" });
    if (error) { toast.error("Move failed: " + error.message); load(); }
  };

  const displayItems: Item[] = items.length > 0 ? items : DEFAULT_SEEDS.map((s, i) => ({
    id: `default-${i}`, src: s.url, alt: "A dog enjoying their stay at The Cozy Pets boarding home",
    span: spanFor(i), path: "", kind: "image" as Kind, position: i,
  }));

  return (
    <section className="py-20 mx-auto max-w-7xl px-5 lg:px-10">
      {heading && (
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">Gallery</span>
          <div className="flex justify-center mt-3" aria-hidden="true" />
          <h2 className="mt-2 text-4xl md:text-5xl font-display font-bold">Tails of joy</h2>
          <p className="mt-4 text-muted-foreground">Tiny moments of comfort, play and love from our cozy little home.</p>
        </div>
      )}

      {canManage && (
        <div className="flex justify-center mb-6">
          <Button onClick={triggerAdd} className="gap-2"><Plus className="h-4 w-4" /> Add photo or video</Button>
          <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[150px] sm:auto-rows-[200px] gap-3 sm:gap-4">
        {displayItems.map((it, i) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.05 }}
            className={`relative rounded-3xl overflow-hidden shadow-soft group bg-muted ${it.span}`}
            style={{ contentVisibility: "auto", containIntrinsicSize: "200px" } as React.CSSProperties}
          >
            {it.kind === "video" ? (
              <video src={it.src} controls playsInline preload="none" className="w-full h-full object-cover bg-black" />
            ) : (
              <img
                src={it.src}
                alt={it.alt}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full lg:group-hover:scale-110 transition-transform duration-700 object-cover"
              />
            )}
            {it.kind === "video" && (
              <div className="pointer-events-none absolute top-2 left-2 rounded-full bg-black/60 text-white text-xs px-2 py-1 flex items-center gap-1">
                <Play className="h-3 w-3" /> Video
              </div>
            )}
            {canManage && it.path && (
              <>
                {/* Desktop hover overlay */}
                <div className="absolute inset-0 bg-black/0 lg:group-hover:bg-black/30 transition-colors hidden lg:flex items-center justify-center gap-2 lg:opacity-0 lg:group-hover:opacity-100">
                  <Button size="sm" variant="secondary" className="gap-1" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="gap-1" onClick={() => triggerReplace(it)}>
                    <Upload className="h-4 w-4" /> Replace
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1" onClick={() => remove(it)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="gap-1" onClick={() => move(i, 1)} disabled={i === displayItems.length - 1} aria-label="Move right">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                {/* Mobile controls */}
                <div className="absolute top-2 right-2 flex gap-2 lg:hidden">
                  <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow" onClick={() => triggerReplace(it)} aria-label="Replace">
                    <Upload className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-9 w-9 rounded-full shadow" onClick={() => remove(it)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-2 lg:hidden">
                  <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow" onClick={() => move(i, 1)} disabled={i === displayItems.length - 1} aria-label="Move right">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
