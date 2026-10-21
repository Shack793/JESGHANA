import { useQuery } from "convex/react";
import { CheckCircle2 } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import Reveal from "@/components/reveal.tsx";
import CtaBand from "@/components/cta-band.tsx";
import TestimonialSlider from "@/components/testimonial-slider.tsx";
import BannerCarousel from "../_components/banner-carousel.tsx";

export default function AboutPage() {
  const home = useQuery(api.site.getHome, {});
  if (home === undefined) return <Skeleton className="h-[60vh] rounded-none" />;
  const s = home.settings;
  return (
    <>
      <BannerCarousel compact banners={home.banners.filter((b) => b.page === "about")} />
      <section className="mx-auto max-w-4xl space-y-6 px-4 py-20">
        <Reveal className="space-y-4">
          <h2 className="text-balance text-3xl font-bold">{s?.companyName} is providing contractual engineering services</h2>
          <p className="text-muted-foreground">{s?.about}</p>
        </Reveal>
        <Reveal className="grid gap-6 pt-6 md:grid-cols-2">
          <div className="rounded-xl border-l-4 border-accent bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-bold">Our Mission</h3>
            <p className="text-muted-foreground">{s?.mission}</p>
          </div>
          <div className="rounded-xl border-l-4 border-accent bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-bold">Our Vision</h3>
            <p className="text-muted-foreground">{s?.vision}</p>
          </div>
        </Reveal>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Experts at building large-scale works</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              We focus on meeting the needs and expectations of our customers, ensuring the highest standards of safety, quality and transparency.
            </p>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {home.scopes.map((sc, i) => (
              <Reveal key={sc._id} delay={i * 0.1}>
                <div className="h-full rounded-xl bg-card p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-bold text-accent">{sc.title}</h3>
                  <ul className="space-y-2 text-sm">
                    {sc.description.split("\n").filter(Boolean).map((line) => (
                      <li key={line} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />{line}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal><h2 className="mb-10 text-center text-3xl font-bold">What we stand for</h2></Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {home.values.map((v, i) => (
            <Reveal key={v._id} delay={i * 0.05}>
              <div className="h-full rounded-lg border bg-card p-5">
                <h3 className="font-semibold">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {home.testimonials.length > 0 && (
        <section className="bg-muted py-16"><TestimonialSlider items={home.testimonials} /></section>
      )}
      <CtaBand phones={s?.phones} />
    </>
  );
}
