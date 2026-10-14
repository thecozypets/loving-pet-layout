import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, Lock, LogIn, LogOut, User as UserIcon } from "lucide-react";
import logo from "@/assets/logo.ico";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

const externalNav = [
  { href: "https://adoption-thecozypets.lovable.app", label: "Adoption" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-10 h-16 md:h-20 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden bg-gradient-warm shadow-paw group-hover:rotate-12 transition-transform">
            <img src={logo} alt="The Cozy Pets logo" className="w-full h-full object-cover" />
          </span>
          <span className="font-display font-bold text-lg md:text-xl tracking-tight">
            The <span className="text-primary">Cozy</span> Pets
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-full font-semibold text-xs lg:text-sm text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
            >
              {n.label}
            </Link>
          ))}
          {externalNav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-full font-semibold text-xs lg:text-sm bg-brand-red text-brand-red-foreground shadow-soft animate-adoption-pulse hover:scale-105 transition-transform"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-1 lg:gap-2">
          {user ? (
            <button onClick={signOut} title={user.email ?? "Account"}
              className="inline-flex items-center gap-1.5 lg:gap-2 rounded-full bg-secondary text-secondary-foreground px-2.5 lg:px-3 py-2 lg:py-2.5 font-semibold text-xs lg:text-sm hover:bg-secondary/80 transition-colors">
              <UserIcon className="w-4 h-4" /> Sign out
            </button>
          ) : (
            <Link to="/auth"
              className="inline-flex items-center gap-1.5 lg:gap-2 rounded-full bg-secondary text-secondary-foreground px-2.5 lg:px-3 py-2 lg:py-2.5 font-semibold text-xs lg:text-sm hover:bg-secondary/80 transition-colors">
              <LogIn className="w-4 h-4" /> Sign in
            </Link>
          )}
          <a
            href="https://thecozypetsmanagement.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 lg:gap-2 rounded-full bg-primary text-primary-foreground px-2.5 lg:px-3 py-2 lg:py-2.5 font-semibold text-xs lg:text-sm hover:bg-primary/90 transition-colors shadow-soft"
          >
            <Lock className="w-4 h-4" /> Admin
          </a>
          <a
            href="tel:9325615181"
            className="inline-flex items-center gap-1.5 lg:gap-2 rounded-full bg-brand-red text-brand-red-foreground px-3 lg:px-4 py-2 lg:py-2.5 font-semibold text-xs lg:text-sm hover:bg-brand-red/90 transition-colors shadow-soft animate-call-now"
          >
            <Phone className="w-4 h-4" /> Call now
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <a
            href="tel:9325615181"
            aria-label="Call now"
            className="inline-grid place-items-center w-10 h-10 rounded-full bg-brand-red text-brand-red-foreground shadow-soft animate-call-now"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            className="p-2 rounded-lg bg-secondary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="w-5 h-0.5 bg-foreground mb-1.5" />
            <div className="w-5 h-0.5 bg-foreground mb-1.5" />
            <div className="w-5 h-0.5 bg-foreground" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 px-4 py-3 flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-secondary data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
            >
              {n.label}
            </Link>
          ))}
          {externalNav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-brand-red text-brand-red-foreground animate-adoption-pulse"
            >
              {n.label}
            </a>
          ))}
          <a
            href="tel:9325615181"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 bg-brand-red text-brand-red-foreground animate-call-now"
          >
            <Phone className="w-4 h-4" /> Call now
          </a>
          {user ? (
            <button onClick={() => { setOpen(false); signOut(); }}
              className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <LogIn className="w-4 h-4" /> Sign in
            </Link>
          )}
          <a
            href="https://thecozypetsmanagement.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Lock className="w-4 h-4" /> Admin
          </a>
        </div>
      )}
    </motion.header>
  );
}
