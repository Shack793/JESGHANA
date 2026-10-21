import { useQuery } from "convex/react";
import { CheckCircle2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import Reveal from "@/components/reveal.tsx";
import TiltCard from "@/components/tilt-card.tsx";
import CtaBand from "@/components/cta-band.tsx";
import BannerCarousel from "../_components/banner-carousel.tsx";

export default function ServicesPage() {
  const home = useQuery(api.site.getHome, {});
  if (home === undefined) return <Skeleton className="h-[60vh] rounded-none" />;
  return (
    <>
      <BannerCarousel compact banners={home.banners.filter((b) => b.page === "services")} />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.features.map((f, i) => (
            <Reveal key={f._id} delay={i * 0.06}>
              <TiltCard className="rounded-xl border-t-4 border-accent bg-card p-5">
                <h3 className="mb-1 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-3">
          {home.scopes.map((sc, i) => (
            <Reveal key={sc._id} delay={i * 0.1}>
              <TiltCard className="rounded-xl bg-card p-6">
                <h2 className="mb-4 text-2xl font-bold text-accent">{sc.title}</h2>
                <ul className="space-y-2 text-sm">
                  {sc.description.split("\n").filter(Boolean).map((line) => (
                    <li key={line} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />{line}</li>
                  ))}
                </ul>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20">
        <Reveal className="mb-12 text-center">
          <h2 className="text-3xl font-bold">All in one engineering services</h2>
          <p className="mt-2 text-muted-foreground">How we take a project from idea to handover.</p>
        </Reveal>
        <ol className="relative space-y-8 border-l-2 border-accent/30 pl-8">
          {home.process.map((p, i) => (
            <Reveal key={p._id} delay={i * 0.08}>
              <li className="relative">
                <span className="absolute -left-[3.15rem] flex size-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">{i + 1}</span>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
      <CtaBand phones={home.settings?.phones} />
    </>
  );
}
