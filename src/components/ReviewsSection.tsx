import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, Check, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Review = {
  id: string;
  name: string;
  pet: string;
  rating: number;
  text: string;
};

const DEMO_REVIEWS: Review[] = [
  {
    id: "1",
    name: "Shivani Chauhan",
    pet: "Joey & Snowy ( GR & Indie )",
    rating: 5,
    text: "I would firstly thank Snehal for being so wonderful and caring for my kids.This was my first time keeping my dogs with cozy pets and it turned out to be amazing and now it will be a second home for my kids whenever im not around. My kids had amazing time with her. She can handle dogs very well and she make sure to stretch her way out to make them feel at home whether its their walks food playing with them and she shared every single pics videos to me to make me feel comfortable. I would highly recommend this place for boarding and keeping your pets in safe hands. Thanks again cozy pet for taking care and giving so much love to my kids. Your doing an amazing job.",
  },
  {
    id: "2",
    name: "Nishant",
    pet: "Pablo - Golden Retriever",
    rating: 5,
    text: "I cannot say enough good things about The Cozy Pets! I was away for 5 days and needed someone I could fully trust with my dog Pablo, and Snehal exceeded every expectation. Pablo has separation anxiety, so leaving him is always something I worry about. But from day one, Snehal made him feel completely at ease. What truly stood out was how she didn't just meet his physical needs, she tuned into his emotional needs as well. She genuinely understands dog language and knows how to read what a dog is feeling, which is rare and incredibly reassuring for a pet parent like me. She also kept sharing Pablos pictures and videos for my assurance. Pablo came home happy, relaxed, and clearly well cared for. That says it all. If you're looking for a place where your dog will be treated with patience, love, and real understanding, The Cozy Pets is the place. I'll absolutely be coming back and would recommend Snehal to anyone without hesitation.",
  },
  {
    id: "3",
    name: "Abhishek Hajare",
    pet: "Ruby - Labrador",
    rating: 5,
    text: "My Labrador, stayed for 3days and seemed to have good and comfortable time here. The facility is clean, well maintained and budget friendly. We used to get daily updates of our dog which I loved. He came home happy and healthy – a true home-away-from-home! The owners took really good care of him.It was a great experience and I would continue to avail this facility,and also would suggest this place to other pet parents.",
  },
  {
    id: "4",
    name: "Antara Patil",
    pet: "Oreo & Misha - GR",
    rating: 5,
    text: "The cozy pet is like 2nd home for dogs. Snehal took good care of Oreo & Misha like their own dogs. Facilities are best as they provide all things needed to keep dogs happy. Thanks a lot.",
  },
  {
    id: "5",
    name: "Tanish Singhal",
    pet: "Boomer - Husky",
    rating: 5,
    text: "This place is awesome for all the pet owners. Snehal is very caring, she will take care of the pets as if they were her own pets.",
  },
];

const STORAGE_KEY = "cozypets_reviews";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(DEMO_REVIEWS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Review | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setReviews(JSON.parse(saved));
    } catch {}
  }, []);

  const persist = (next: Review[]) => {
    setReviews(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const startEdit = (r: Review) => {
    setEditingId(r.id);
    setDraft({ ...r });
  };

  const saveEdit = () => {
    if (!draft) return;
    persist(reviews.map((r) => (r.id === draft.id ? draft : r)));
    setEditingId(null);
    setDraft(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const removeReview = (id: string) => {
    persist(reviews.filter((r) => r.id !== id));
  };

  const addReview = () => {
    const newReview: Review = {
      id: crypto.randomUUID(),
      name: "New Reviewer",
      pet: "Pet name",
      rating: 5,
      text: "Write the review here...",
    };
    persist([...reviews, newReview]);
    startEdit(newReview);
  };

  return (
    <section className="py-20 mx-auto max-w-7xl px-5 lg:px-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-sm font-bold uppercase tracking-widest text-primary">Reviews</span>
        <h2 className="mt-2 text-4xl md:text-5xl font-display font-bold">What pet parents say</h2>
        <p className="mt-4 text-muted-foreground">
          Real words from our cozy community. Click the pencil to edit, or add your own.
        </p>
        <Button onClick={addReview} className="mt-6 gap-2" variant="default">
          <Plus className="h-4 w-4" /> Add review
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r, i) => {
          const isEditing = editingId === r.id;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-3xl p-7 border-2 border-sunshine/60 hover:border-sunshine bg-gradient-to-br from-cream to-sunshine/15 shadow-paw transition-colors"
            >
              {isEditing && draft ? (
                <div className="space-y-3">
                  <Input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="Reviewer name"
                  />
                  <Input
                    value={draft.pet}
                    onChange={(e) => setDraft({ ...draft, pet: e.target.value })}
                    placeholder="Pet name & breed"
                  />
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setDraft({ ...draft, rating: n })}
                        aria-label={`${n} stars`}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            n <= draft.rating ? "fill-sunshine text-sunshine" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    value={draft.text}
                    onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                    rows={4}
                    placeholder="Review text"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} className="gap-1">
                      <Check className="h-4 w-4" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit} className="gap-1">
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => startEdit(r)}
                      aria-label="Edit review"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeReview(r.id)}
                      aria-label="Delete review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, n) => (
                      <Star
                        key={n}
                        className={`h-5 w-5 ${
                          n < r.rating ? "fill-sunshine text-sunshine" : "text-muted-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic">"{r.text}"</p>
                  <div className="mt-4">
                    <div className="font-display font-bold">{r.name}</div>
                    <div className="text-sm text-muted-foreground">{r.pet}</div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(r)}
                      className="gap-1"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeReview(r.id)}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
