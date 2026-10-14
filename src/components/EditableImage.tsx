import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type Props = {
  slot: string;
  fallback: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  /** Mark the LCP image so it loads eagerly with high priority. */
  priority?: boolean;
};

// Admin-editable image bound to a named "slot" (hero, about, daycare, overnight, etc.).
// Falls back to the bundled default if nothing is uploaded yet.
export default function EditableImage({ slot, fallback, alt, className, imgClassName, width, height, priority }: Props) {
  const { user, isAdmin } = useAuth();
  const canManage = !!user && isAdmin;
  const [path, setPath] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("site_images" as any).select("path").eq("slot", slot).maybeSingle();
    const p = (data as any)?.path as string | undefined;
    if (!p) { setPath(null); setUrl(null); return; }
    setPath(p);
    const { data: signed } = await supabase.storage.from("site-images").createSignedUrl(p, 60 * 60 * 24 * 7);
    setUrl(signed?.signedUrl ?? null);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [slot]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !canManage) return;
    setBusy(true);
    const toastId = toast.loading(`Uploading ${file.name}…`);
    try {
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const newPath = `${slot}-${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("site-images").upload(newPath, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { error: dbErr } = await supabase.from("site_images" as any).upsert({ slot, path: newPath }, { onConflict: "slot" });
      if (dbErr) throw dbErr;
      if (path) await supabase.storage.from("site-images").remove([path]);
      toast.success("Image updated", { id: toastId });
      await load();
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed", { id: toastId, description: err?.message ?? "Try again." });
    } finally { setBusy(false); }
  };

  const onDelete = async () => {
    if (!canManage || !path) return;
    if (!confirm("Reset this image to the default?")) return;
    setBusy(true);
    try {
      await supabase.storage.from("site-images").remove([path]);
      await supabase.from("site_images" as any).delete().eq("slot", slot);
      toast.success("Reset to default");
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? "Delete failed");
    } finally { setBusy(false); }
  };

  const src = url ?? fallback;
  return (
    <div className={`relative group ${className ?? ""}`}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        width={width}
        height={height}
        className={imgClassName ?? "w-full h-full object-cover"}
      />
      {canManage && (
        <>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow" onClick={() => fileRef.current?.click()} disabled={busy} aria-label="Replace image">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
            {path && (
              <Button size="icon" variant="destructive" className="h-9 w-9 rounded-full shadow" onClick={onDelete} disabled={busy} aria-label="Reset to default">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
