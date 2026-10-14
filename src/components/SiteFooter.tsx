import { PawPrint, Phone, Mail, MapPin, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-warm">
              <PawPrint className="w-5 h-5 text-primary-foreground" />
            </span>
            <span className="font-display font-bold text-xl">The Cozy Pets</span>
          </div>
          <p className="text-background/70 max-w-md leading-relaxed">
            A loving, safe and playful home away from home for your dog. 7+ years
            of professional animal care experience.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-accent">Visit</h4>
          <ul className="space-y-2 text-background/70 text-sm">
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-zinc-200" /> Opp. to Bharati Vidyapeeth college of Engineering, Lavale, Pirangut, Mulshi, Pune. 412115</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-slate-50" /> +91 73785 28453 / 9325615181</li>
            <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 text-zinc-200" /> thecozypets@gmail.com</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3 text-accent">Hours</h4>
          <ul className="space-y-1 text-background/70 text-sm">
            <li>Mon – Sun</li>
            <li>24 / 7 boarding care</li>
            <li>Daycare 9AM – 7 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 py-6 text-center text-sm text-background/50 flex items-center justify-center gap-1">
      </div>
    </footer>
  );
}
