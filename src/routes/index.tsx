import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PawPrint, Heart, Shield, Sparkles, Phone, Star, Clock, Bone } from "lucide-react";
import heroImg from "@/assets/hero-pets.jpg";
import daycareImg from "@/assets/daycare-new.jpg";
import overnightImg from "@/assets/overnight-cozy-dog.jpg.asset.json";
import { FloatingPaws } from "@/components/FloatingPaws";
import GallerySection from "@/components/GallerySection";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import WhatsAppButton from "@/components/WhatsAppButton";
import EditableImage from "@/components/EditableImage";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Cozy Pets — Dog & Cat Boarding in Pune" },
      { name: "description", content: "Cozy home-style daycare and overnight dog & cat boarding in Lavale, Pune. 24/7 loving care from handlers with 7+ years experience." },
      { property: "og:title", content: "The Cozy Pets — Dog & Cat Boarding in Pune" },
      { property: "og:description", content: "Cozy home-style daycare and overnight dog & cat boarding in Lavale, Pune. 24/7 loving care from handlers with 7+ years experience." },
      { property: "og:url", content: "https://thecozyypets-co.lovable.app/" },
      { name: "twitter:title", content: "The Cozy Pets — Dog & Cat Boarding in Pune" },
      { name: "twitter:description", content: "Cozy home-style daycare and overnight dog & cat boarding in Lavale, Pune. 24/7 loving care from handlers with 7+ years experience." },
    ],
    links: [{ rel: "canonical", href: "https://thecozyypets-co.lovable.app/" }],
  }),
  component: Home,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = { initial: { y: 30, opacity: 0 }, whileInView: { y: 0, opacity: 1 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.7, ease: EASE } };


function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-20 lg:pb-32">
        <FloatingPaws />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-10 grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex self-start items-center gap-2 rounded-full bg-accent/30 border border-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-foreground"
            >
              <Sparkles className="w-3.5 h-3.5" /> Not a hostel — a real home
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
              className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] text-black"
            >
              A Cozy <span className="text-red-600">HOME</span> For Your Pet
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
              className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              Safe, comfortable, playful and loving daycare & overnight boarding for
              dogs and cats. Run by passionate animal lovers with 7+ years of
              professional experience.
            </motion.p>


          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative max-w-md mx-auto lg:max-w-none w-full"

          >
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-paw">
              <EditableImage slot="hero" priority fallback={heroImg} alt="Happy dogs at The Cozy Pets boarding home" width={1536} height={1152} className="w-full h-full" imgClassName="w-full h-full object-cover" />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -left-6 bg-card rounded-2xl p-4 shadow-soft border border-border flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-leaf/20 grid place-items-center text-leaf">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="font-display font-bold">24/7 Care</div>
                <div className="text-xs text-muted-foreground">Always watched over</div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -right-4 bg-card rounded-2xl p-4 shadow-soft border border-border flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-berry/15 grid place-items-center text-berry">
                <Heart className="w-6 h-6 fill-current text-red-700" />
              </div>
              <div>
                <div className="font-display font-bold">7+ Years</div>
                <div className="text-xs text-muted-foreground">Of love & expertise</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-2 flex flex-wrap gap-4 lg:col-span-2 justify-center"
          >
            <a href="tel:7378528453" className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 font-bold shadow-paw hover:scale-105 transition-transform">
              <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Schedule a visit
            </a>
            <Link to="/services" className="inline-flex items-center gap-2 rounded-full bg-foreground/5 border-2 border-foreground/10 px-7 py-4 font-bold hover:bg-foreground hover:text-background transition-colors">
              Our services <Bone className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="bg-foreground text-background py-6">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 flex flex-wrap justify-around gap-6 text-sm font-semibold">
          {[
            { icon: Shield, label: "Safe Play Environment" },
            { icon: Clock, label: "Daily Health Monitoring" },
            { icon: Heart, label: "Lots of Cuddles" },
            { icon: Bone, label: "" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <f.icon className="w-4 h-4 text-accent" /> {f.label}
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">What we offer</span>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-display font-bold text-red-700">Services tail-ored for them</h2>
            <p className="mt-4 text-muted-foreground">Whether it's a sunny afternoon of play or a cozy night under the stars, we've got your pet covered.</p>
          </motion.div>


          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                slot: "daycare",
                tag: "Daycare", title: "Fun-filled daytime care", img: daycareImg,
                features: ["Safe play environment","Regular feeding","Supervised activities","Daily health monitoring"],
                color: "bg-accent/30", accent: "text-accent-foreground",
              },
              {
                slot: "overnight",
                tag: "Most Popular", title: "Overnight stay & boarding", img: overnightImg.url,
                features: ["Cozy sleeping arrangements","Evening & morning meals","Nighttime supervision","Bedtime routines"],
                color: "bg-primary/15", accent: "text-primary",
              },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
                whileHover={{ y: -8, transition: { duration: 0.35, ease: EASE } }}
                className="group bg-card rounded-3xl overflow-hidden shadow-soft border border-border flex flex-col"

              >
                <div className="relative h-56 overflow-hidden">
                  <EditableImage slot={s.slot} fallback={s.img} alt={s.title} className="w-full h-full" imgClassName="w-full h-full group-hover:scale-110 transition-transform duration-700 object-cover" />
                  <span className={`absolute top-4 left-4 ${s.color} ${s.accent} text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur text-amber-400 bg-neutral-950 opacity-90`}>{s.tag}</span>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="text-2xl font-display font-bold">{s.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground flex-1">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <PawPrint className="w-4 h-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/services" className="mt-6 inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all">
                    {s.slot === "daycare" ? "View daycare details" : "Read about overnight boarding"} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <GallerySection />


      {/* REVIEWS */}
      <ReviewsCarousel />


      {/* CTA */}
      <section className="px-5 lg:px-10 pb-16">
        <motion.div {...fadeUp} className="relative overflow-hidden mx-auto max-w-7xl bg-gradient-sunset rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center">
          <FloatingPaws />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary-foreground">Ready to give your pet a vacation too?</h2>
            <p className="mt-4 text-primary-foreground/90 max-w-xl mx-auto">Book a free meet & greet. We'll show you the cozy corners your pet will call home.</p>

            <a href="tel:7378528453" className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-4 font-bold hover:bg-background hover:text-foreground transition-colors">
              <Phone className="w-5 h-5" /> Call 7378528453 / 9325615181
            </a>
          </div>
        </motion.div>
      </section>

      <WhatsAppButton />
    </>

  );
}
