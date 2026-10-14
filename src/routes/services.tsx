import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sun, Moon, PawPrint, Check } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Dog Boarding & Daycare Prices — The Cozy Pets" },
      { name: "description", content: "Daycare from ₹500/day and overnight dog boarding from ₹800/day in Pune, including meals, play, supervision and health checks." },
      { property: "og:title", content: "Dog Boarding & Daycare Prices — The Cozy Pets" },
      { property: "og:description", content: "Daycare from ₹500/day and overnight dog boarding from ₹800/day in Pune, including meals, play, supervision and health checks." },
      { property: "og:url", content: "https://thecozyypets-co.lovable.app/services" },
      { name: "twitter:title", content: "Dog Boarding & Daycare Prices — The Cozy Pets" },
      { name: "twitter:description", content: "Daycare from ₹500/day and overnight dog boarding from ₹800/day in Pune, including meals, play, supervision and health checks." },
    ],
    links: [{ rel: "canonical", href: "https://thecozyypets-co.lovable.app/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: [
            {
              "@type": "Service",
              name: "Dog & Cat Daycare",
              description: "Daytime care with safe play, feeding, supervised activities and daily health monitoring.",
              provider: { "@type": "LocalBusiness", name: "The Cozy Pets" },
              offers: { "@type": "Offer", price: "500", priceCurrency: "INR" },
            },
            {
              "@type": "Service",
              name: "Overnight Boarding",
              description: "Cozy overnight stays with meals, bedtime routines and nighttime supervision.",
              provider: { "@type": "LocalBusiness", name: "The Cozy Pets" },
              offers: { "@type": "Offer", price: "800", priceCurrency: "INR" },
            },
          ],
        }),
      },
    ],
  }),
  component: Services,
});

const services = [
  {
    icon: Sun, tag: "Daycare", price: "₹500/day",
    title: "Fun-filled Daycare",
    desc: "Bright daytime fun for your furry friend with playmates and supervision.",
    features: ["Safe play environment","Regular feeding","Supervised activities","Daily health monitoring"],
    color: "from-sunshine to-accent", text: "text-foreground",
  },
  {
    icon: Moon, tag: "Most Popular", price: "₹800/day",
    title: "Overnight Stay",
    desc: "Comfortable overnight stays with 24/7 care and bedtime routines.",
    features: ["Cozy sleeping arrangements","Evening & morning meals","Nighttime supervision","Bedtime routines"],
    color: "from-primary to-berry", text: "text-primary-foreground", featured: true,
  },
];

function Services() {
  return (
    <section className="py-20 mx-auto max-w-7xl px-5 lg:px-10">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-sm font-bold uppercase tracking-widest text-primary">Services</span>
        <h1 className="mt-2 text-5xl md:text-6xl font-display font-bold">Everything they need to feel at home</h1>
        <p className="mt-5 text-muted-foreground">Pick the perfect plan for your pet's vacation.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -10, rotate: -1 }}
            className={`relative bg-gradient-to-br ${s.color} ${s.text} rounded-3xl p-7 shadow-soft overflow-hidden ${s.featured ? "lg:scale-105 shadow-paw" : ""}`}
          >
            <div className="absolute -right-6 -top-6 opacity-10">
              <PawPrint className="w-32 h-32" />
            </div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-background/30 backdrop-blur px-2.5 py-1 rounded-full">{s.tag}</span>
            <s.icon className="w-10 h-10 mt-4" />
            <h3 className="mt-4 text-2xl font-display font-bold">{s.title}</h3>
            <p className="mt-2 text-sm opacity-90">{s.desc}</p>
            <div className="mt-4 text-2xl font-display font-bold">{s.price}</div>
            <ul className="mt-4 space-y-1.5 text-sm">
              {s.features.map(f => (
                <li key={f} className="flex items-center gap-2"><Check className="w-4 h-4" /> {f}</li>
              ))}
            </ul>
            <a href="tel:7378528453" className="mt-6 inline-block w-full text-center rounded-full bg-background/95 text-foreground font-bold py-2.5 hover:bg-background transition-colors">Book now</a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
