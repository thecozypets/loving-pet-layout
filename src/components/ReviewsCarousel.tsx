import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Plus, Pencil, Trash2 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { z } from "zod";

type Review = {
  id: string;
  author_id: string | null;
  name: string;
  pet: string | null;
  rating: number;
  text: string;
  initials: string;
};

const SEED: Review[] = [
  { id: "s1", author_id: null, name: "Shivani Chauhan", pet: "Joey & Snowy ( GR & Indie )", rating: 5, initials: "SC",
    text: "I would firstly thank Snehal for being so wonderful and caring for my kids. This was my first time keeping my dogs with cozy pets and it turned out to be amazing. She can handle dogs very well and made sure to make them feel at home. Highly recommend!" },
  { id: "s2", author_id: null, name: "Nishant", pet: "Pablo - Golden Retriever", rating: 5, initials: "N",
    text: "I cannot say enough good things about The Cozy Pets! Pablo has separation anxiety, but Snehal made him feel completely at ease. She tunes into emotional needs as well as physical. Pablo came home happy, relaxed, and clearly well cared for." },
  { id: "s3", author_id: null, name: "Abhishek Hajare", pet: "Ruby - Labrador", rating: 5, initials: "AH",
    text: "My Labrador stayed for 3 days. The facility is clean, well maintained and budget friendly. Daily updates were lovely. He came home happy and healthy — a true home-away-from-home!" },
  { id: "s4", author_id: null, name: "Antara Patil", pet: "Oreo & Misha - GR", rating: 5, initials: "AP",
    text: "The Cozy Pets is like a 2nd home for dogs. Snehal took good care of Oreo & Misha like her own dogs. Facilities are the best." },
  { id: "s5", author_id: null, name: "Tanish Singhal", pet: "Boomer - Husky", rating: 5, initials: "TS",
    text: "This place is awesome for all pet owners. Snehal is very caring — she will treat the pets as if they were her own." },
];

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  pet: z.string().trim().max(100).optional(),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(1).max(2000),
});

function initialsOf(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function ReviewsCarousel() {
  const { user } = useAuth();
  const [dbReviews, setDbReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);

  async function load() {
    const { data, error } = await supabase.from("reviews").select("id, author_id, name, pet, rating, text").order("created_at", { ascending: false });
    if (error) { console.error(error); return; }
    setDbReviews((data ?? []).map((r: any) => ({ ...r, initials: initialsOf(r.name) })));
  }
  useEffect(() => { load(); }, []);

  const all = [...dbReviews, ...SEED];

  async function remove(r: Review) {
    if (!confirm("Delete your review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted"); load();
  }

  return (
    <section className="py-24 bg-gradient-to-b from-cream via-sunshine/20 to-cream">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">Loved by pet parents</span>
          <h2 className="mt-2 text-4xl md:text-5xl font-display font-bold">Tails wag, hearts melt</h2>
          <p className="mt-4 text-muted-foreground">Hear from the families who trust us with their furry best friends.</p>
        </motion.div>

        <div className="flex justify-center mb-8">
          {user ? (
            <Button onClick={() => { setEditing(null); setOpen(true); }} className="gap-2"><Plus className="w-4 h-4" /> Share your review</Button>
          ) : (
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-semibold text-sm hover:bg-primary/90">
              Sign in to share a review
            </Link>
          )}
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {all.map((r, i) => (
              <CarouselItem key={r.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}
                  className="h-full bg-card border-2 border-sunshine/60 hover:border-sunshine rounded-3xl p-7 shadow-paw relative overflow-hidden transition-colors"
                >
                  <Quote className="absolute -top-2 -right-2 w-24 h-24 text-sunshine/40" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, n) => (
                      <Star key={n} className={`h-5 w-5 ${n < r.rating ? "fill-sunshine text-sunshine" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic leading-relaxed min-h-[7rem]">"{r.text}"</p>
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t-2 border-sunshine/40">
                    <div className="w-11 h-11 rounded-full bg-gradient-warm text-primary-foreground grid place-items-center font-display font-bold ring-2 ring-sunshine">{r.initials}</div>
                    <div className="flex-1">
                      <div className="font-display font-bold">{r.name}</div>
                      {r.pet && <div className="text-sm text-muted-foreground">{r.pet}</div>}
                    </div>
                    {user?.id && user.id === r.author_id && (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(r)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </div>
        </Carousel>
      </div>

      <ReviewEditor open={open} onOpenChange={setOpen} review={editing} onSaved={load} />
    </section>
  );
}

function ReviewEditor({ open, onOpenChange, review, onSaved }: {
  open: boolean; onOpenChange: (v: boolean) => void; review: Review | null; onSaved: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [pet, setPet] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setName(review?.name ?? ""); setPet(review?.pet ?? ""); setRating(review?.rating ?? 5); setText(review?.text ?? "");
    }
  }, [open, review]);

  async function save() {
    if (!user) return;
    const parsed = schema.safeParse({ name, pet: pet || undefined, rating, text });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    try {
      if (review) {
        const { error } = await supabase.from("reviews").update({ name, pet: pet || null, rating, text }).eq("id", review.id);
        if (error) throw error;
        toast.success("Review updated");
      } else {
        const { error } = await supabase.from("reviews").insert({ author_id: user.id, name, pet: pet || null, rating, text });
        if (error) throw error;
        toast.success("Thanks for sharing!");
      }
      onOpenChange(false); onSaved();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save");
    } finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{review ? "Edit your review" : "Share your review"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label htmlFor="rn">Your name</Label><Input id="rn" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></div>
          <div><Label htmlFor="rp">Pet name & breed (optional)</Label><Input id="rp" value={pet} onChange={(e) => setPet(e.target.value)} maxLength={100} placeholder="e.g. Bruno - Labrador" /></div>
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1,2,3,4,5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} star${n>1?"s":""}`}>
                  <Star className={`h-7 w-7 ${n <= rating ? "fill-sunshine text-sunshine" : "text-muted-foreground/30"}`} />
                </button>
              ))}
            </div>
          </div>
          <div><Label htmlFor="rt">Your review</Label><Textarea id="rt" value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} rows={5} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
