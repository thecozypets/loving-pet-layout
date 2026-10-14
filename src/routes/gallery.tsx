import { createFileRoute } from "@tanstack/react-router";
import GallerySection from "@/components/GallerySection";
import ReviewsSection from "@/components/ReviewsSection";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Happy Pets at The Cozy Pets" },
      { name: "description", content: "Photos and videos of the dogs and cats who stay with us — playtime, naps and cuddles at our cozy Pune boarding home." },
      { property: "og:title", content: "Gallery — Happy Pets at The Cozy Pets" },
      { property: "og:description", content: "Photos and videos of the dogs and cats who stay with us — playtime, naps and cuddles at our cozy Pune boarding home." },
      { property: "og:url", content: "https://thecozyypets-co.lovable.app/gallery" },
      { name: "twitter:title", content: "Gallery — Happy Pets at The Cozy Pets" },
      { name: "twitter:description", content: "Photos and videos of the dogs and cats who stay with us — playtime, naps and cuddles at our cozy Pune boarding home." },
    ],
    links: [{ rel: "canonical", href: "https://thecozyypets-co.lovable.app/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  return (
    <>
      <div className="pt-12 text-center max-w-2xl mx-auto px-5">
        <span className="text-sm font-bold uppercase tracking-widest text-primary">Gallery</span>
        <h1 className="mt-2 text-5xl md:text-6xl font-display font-bold">Tails of joy</h1>
        <p className="mt-4 text-muted-foreground">Add, replace or remove photos directly below — changes save instantly.</p>
      </div>

      <GallerySection heading={false} />

      <ReviewsSection />
    </>
  );
}

