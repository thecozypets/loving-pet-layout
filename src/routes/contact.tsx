import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import InstagramButton from "@/components/InstagramButton";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Booking — The Cozy Pets, Pune" },
      { name: "description", content: "Book a stay or a free meet & greet for your dog or cat. Send us your dates on WhatsApp or call 7378528453 / 9325615181." },
      { property: "og:title", content: "Contact & Booking — The Cozy Pets, Pune" },
      { property: "og:description", content: "Book a stay or a free meet & greet for your dog or cat. Send us your dates on WhatsApp or call 7378528453 / 9325615181." },
      { property: "og:url", content: "https://thecozyypets-co.lovable.app/contact" },
      { name: "twitter:title", content: "Contact & Booking — The Cozy Pets, Pune" },
      { name: "twitter:description", content: "Book a stay or a free meet & greet for your dog or cat. Send us your dates on WhatsApp or call 7378528453 / 9325615181." },
    ],
    links: [{ rel: "canonical", href: "https://thecozyypets-co.lovable.app/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "The Cozy Pets",
          url: "https://thecozyypets-co.lovable.app/contact",
          telephone: ["+917378528453", "+919325615181"],
          address: {
            "@type": "PostalAddress",
            streetAddress: "Opp. to Bharati Vidyapeeth College of Engineering, Lavale, Pirangut",
            addressLocality: "Mulshi, Pune",
            postalCode: "412115",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  component: Contact,
});

const WHATSAPP_NUMBER = "917378528453";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    petName: "",
    breed: "",
    age: "",
    service: "Boarding",
    startDate: "",
    endDate: "",
    contact: "",
    notes: "",
  });
  const [sent, setSent] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message =
      `Hi Cozy Pets! 🐾%0A%0A` +
      `*Name:* ${form.name}%0A` +
      `*Contact:* ${form.contact}%0A%0A` +
      `*Pet's Name:* ${form.petName}%0A` +
      `*Breed:* ${form.breed}%0A` +
      `*Age:* ${form.age}%0A%0A` +
      `*Service:* ${form.service}%0A` +
      `*From:* ${form.startDate}%0A` +
      `*To:* ${form.endDate}%0A%0A` +
      `*Notes:* ${form.notes || "—"}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURI(message.replace(/%0A/g, "\n"))}`;
    window.open(url, "_blank");
    setSent(true);
  };

  return (
    <section className="py-20 mx-auto max-w-7xl px-5 lg:px-10">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-sm font-bold uppercase tracking-widest text-primary">Let's chat</span>
        <h1 className="mt-2 text-5xl md:text-6xl font-display font-bold">Say <span className="text-gradient-warm">woof</span>!</h1>
        <p className="mt-4 text-muted-foreground">Fill the form and we'll get back on WhatsApp.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: Phone, label: "Call us", value: "+91 73785 28453", href: "tel:7378528453", color: "bg-primary text-primary-foreground" },
            { icon: MessageCircle, label: "WhatsApp", value: "Quick replies, daily updates", href: "https://wa.me/917378528453", color: "bg-leaf text-background" },
            { icon: Mail, label: "Email", value: "thecozypets@gmail.com", href: "mailto:thecozypets@gmail.com", color: "bg-accent text-accent-foreground" },
            { icon: MapPin, label: "Visit", value: "By appointment only", href: "#", color: "bg-sky text-foreground" },
          ].map((c, i) => (
            <motion.a
              key={c.label} href={c.href}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-paw transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl ${c.color} grid place-items-center shrink-0`}>
                <c.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{c.label}</div>
                <div className="font-display font-bold text-lg">{c.value}</div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3 bg-card border border-border rounded-3xl p-8 shadow-soft space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name" placeholder="Jane Doe" value={form.name} onChange={update("name")} />
            <Field label="Phone / Email" placeholder="How should we reach you?" value={form.contact} onChange={update("contact")} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Pet's name" placeholder="Buddy" value={form.petName} onChange={update("petName")} />
            <Field label="Breed" placeholder="Labrador" value={form.breed} onChange={update("breed")} />
            <Field label="Age" placeholder="2 yrs" value={form.age} onChange={update("age")} />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5">Service</label>
            <select
              value={form.service}
              onChange={update("service")}
              className="w-full rounded-2xl border-2 border-input bg-background px-4 py-3 focus:border-primary focus:outline-none transition-colors"
            >
              <option>Boarding</option>
              <option>Day Care</option>
              <option>Grooming</option>
              <option>Training</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="From date" type="date" value={form.startDate} onChange={update("startDate")} />
            <Field label="To date" type="date" value={form.endDate} onChange={update("endDate")} />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5">Anything special?</label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={update("notes")}
              placeholder="Diet, meds, behaviour, vaccination status…"
              className="w-full rounded-2xl border-2 border-input bg-background px-4 py-3 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-leaf text-background font-bold py-4 hover:opacity-90 transition-opacity shadow-paw"
          >
            <MessageCircle className="w-5 h-5" /> {sent ? "Opened WhatsApp ✓ Send again" : "Send via WhatsApp"}
          </button>
        </motion.form>
      </div>
      <InstagramButton />
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1.5">{label}</label>
      <input
        required
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border-2 border-input bg-background px-4 py-3 focus:border-primary focus:outline-none transition-colors"
      />
    </div>
  );
}
