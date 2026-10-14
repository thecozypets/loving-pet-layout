import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useRouter, useRouterState, Link, type ErrorComponentProps } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-display font-bold text-gradient-warm">404</h1>
        <p className="mt-3 text-muted-foreground">This page ran off chasing a squirrel.</p>
        <Link to="/" className="inline-block mt-6 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-display font-bold">Something went sideways</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-5 rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { property: "og:site_name", content: "The Cozy Pets" },
      { name: "twitter:card", content: "summary" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "The Cozy Pets",
          url: "https://thecozyypets-co.lovable.app",
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
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "The Cozy Pets",
          url: "https://thecozyypets-co.lovable.app",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main><Outlet /></main>
      <SiteFooter />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
