import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — The Cozy Pets" },
      { name: "description", content: "Sign in or create a free account to publish blog posts, share reviews and add photos to The Cozy Pets gallery." },
      { property: "og:title", content: "Sign In — The Cozy Pets" },
      { property: "og:description", content: "Sign in or create a free account to publish blog posts, share reviews and add photos to The Cozy Pets gallery." },
      { property: "og:url", content: "https://thecozyypets-co.lovable.app/auth" },
      { name: "twitter:title", content: "Sign In — The Cozy Pets" },
      { name: "twitter:description", content: "Sign in or create a free account to publish blog posts, share reviews and add photos to The Cozy Pets gallery." },
    ],
    links: [{ rel: "canonical", href: "https://thecozyypets-co.lovable.app/auth" }],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  displayName: z.string().trim().min(1).max(60).optional(),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, displayName: mode === "signup" ? displayName : undefined });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: displayName } },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm (or sign in if already confirmed).");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="min-h-[70vh] grid place-items-center px-5 py-16">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-soft">
        <h1 className="text-3xl font-display font-bold">{mode === "signin" ? "Welcome back" : "Join the pack"}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {mode === "signin" ? "Sign in to write blog posts and reviews." : "Create an account to share your stories and reviews."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="dn">Display name</Label>
              <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} required />
            </div>
          )}
          <div>
            <Label htmlFor="em">Email</Label>
            <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 text-sm text-primary hover:underline w-full text-center">
          {mode === "signin" ? "No account? Sign up" : "Already have one? Sign in"}
        </button>
      </div>
    </section>
  );
}
