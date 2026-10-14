import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Award, Stethoscope, Apple } from "lucide-react";
import aboutImg from "@/assets/about-dog-updated.jpg";
import EditableImage from "@/components/EditableImage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — The Cozy Pets, Pune" },
      { name: "description", content: "Meet the animal lovers behind The Cozy Pets: 7+ years of hospital-grade handling, nutrition and care experience for dogs and cats." },
      { property: "og:title", content: "About Us — The Cozy Pets, Pune" },
      { property: "og:description", content: "Meet the animal lovers behind The Cozy Pets: 7+ years of hospital-grade handling, nutrition and care experience for dogs and cats." },
      { property: "og:url", content: "https://thecozyypets-co.lovable.app/about" },
      { name: "twitter:title", content: "About Us — The Cozy Pets, Pune" },
      { name: "twitter:description", content: "Meet the animal lovers behind The Cozy Pets: 7+ years of hospital-grade handling, nutrition and care experience for dogs and cats." },
    ],
    links: [{ rel: "canonical", href: "https://thecozyypets-co.lovable.app/about" }],
  }),
  component: About,
});

function About() {
  return (
    <section className="py-20 mx-auto max-w-7xl px-5 lg:px-10">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <span className="text-sm font-bold uppercase tracking-widest text-primary">About us</span>
          <h1 className="mt-2 text-5xl md:text-6xl font-display font-bold">
            Over <span className="text-gradient-warm">7+ years</span> of paw-fessional care
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Passionate animal lovers with more than 6 years of professional experience
            handling and managing cats and dogs in animal hospitals. Hands-on experience
            in treatment, plus deep knowledge of nutrition for the wellbeing of every animal in our care.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: Award, label: "Certified", sub: "Animal handlers" },
              { icon: Stethoscope, label: "Medical", sub: "Hospital experience" },
              { icon: Apple, label: "Nutrition", sub: "Tailored meals" },
              { icon: Heart, label: "Love", sub: "Above all" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-4 hover:shadow-paw hover:-translate-y-1 transition-all"
              >
                <s.icon className="w-7 h-7 text-primary mb-2" />
                <div className="font-display font-bold">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-paw">
            <EditableImage slot="about" fallback={aboutImg} alt="Caretaker with happy dog" className="w-full h-full" imgClassName="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl px-6 py-4 shadow-soft border border-border">
            <div className="text-4xl font-display font-bold text-gradient-warm">​</div>
            <div className="text-xs text-muted-foreground font-semibold">​</div>
          </div>
        </motion.div>
      </div>

      <div className="mt-24 bg-gradient-sky rounded-[2.5rem] p-10 md:p-14 text-primary-foreground">
        <h2 className="text-3xl md:text-4xl font-display font-bold max-w-2xl">
          "Your pets are in very safe and good hands."
        </h2>
        <p className="mt-4 max-w-2xl opacity-90">
          We treat every dog and cat that walks through our door like family —
          because to us, they truly are. Cozy beds, joyful play, gentle hands.
        </p>
      </div>
    </section>
  );
}
