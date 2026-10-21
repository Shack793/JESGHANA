import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { CheckCircle2, Cog, ShieldCheck, Sparkles, Users, Leaf, Handshake, ArrowRight } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import Reveal from "@/components/reveal.tsx";
import TiltCard from "@/components/tilt-card.tsx";
import CtaBand from "@/components/cta-band.tsx";
import TestimonialSlider from "@/components/testimonial-slider.tsx";
import BannerCarousel from "./_components/banner-carousel.tsx";
import PostCard from "./blog/_components/post-card.tsx";

const VALUE_ICONS = [ShieldCheck, Sparkles, Cog, Users, Leaf, Handshake];

export default function Index() {
  const home = useQuery(api.site.getHome, {});
  if (home === undefined) return <Skeleton className="h-[75vh] w-full rounded-none" />;

  return (
    <>
      <BannerCarousel banners={home.banners.filter((b) => b.page === "home")} />

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">What we do</p>
          <h2 className="text-balance text-3xl font-bold md:text-4xl">{home.settings?.tagline}</h2>
          <p className="text-muted-foreground">{home.settings?.intro}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {home.services.map((s, i) => (
            <Reveal key={s._id} delay={i * 0.06}>
              <TiltCard className="rounded-xl border bg-card p-6">
                <div className="mb-4 h-1 w-10 rounded bg-accent" />
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild><Link to="/services">All services <ArrowRight /></Link></Button>
        </div>
      </section>

      <section className="bg-zinc-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal><h2 className="mb-12 text-center text-3xl font-bold">Our core values</h2></Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {home.values.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <Reveal key={v._id} delay={i * 0.05} className="space-y-2">
                  <Icon className="size-7 text-accent" />
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="text-sm text-white/70">{v.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border-l-4 border-accent bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-bold">Mission</h3>
            <p className="text-muted-foreground">{home.settings?.mission}</p>
          </div>
          <div className="rounded-xl border-l-4 border-accent bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-bold">Vision</h3>
            <p className="text-muted-foreground">{home.settings?.vision}</p>
          </div>
        </Reveal>
        <Reveal className="mt-16 text-center">
          <h2 className="mb-3 text-3xl font-bold">Our OEM partners</h2>
          <p className="mb-8 text-muted-foreground">We have worked with renowned OEMs in these industries.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {home.partners.map((p) => (
              <span key={p._id} className="flex items-center gap-2 rounded-full border bg-card px-5 py-2 text-sm font-medium">
                <CheckCircle2 className="size-4 text-accent" /> {p.title}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {home.testimonials.length > 0 && (
        <section className="bg-muted py-20">
          <Reveal><h2 className="mb-10 text-center text-3xl font-bold">What our clients say</h2></Reveal>
          <TestimonialSlider items={home.testimonials} />
        </section>
      )}

      {home.latestPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-bold">News and insights</h2>
            <Button asChild variant="ghost"><Link to="/blog">View all <ArrowRight /></Link></Button>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {home.latestPosts.map((p, i) => <Reveal key={p._id} delay={i * 0.08}><PostCard post={p} /></Reveal>)}
          </div>
        </section>
      )}

      <CtaBand phones={home.settings?.phones} />
    </>
  );
}
