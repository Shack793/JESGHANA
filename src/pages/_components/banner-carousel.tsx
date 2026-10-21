import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type Banner = {
  _id: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaLink?: string;
  image: string | null;
};

export default function BannerCarousel({ banners, compact = false }: { banners: Banner[]; compact?: boolean }) {
  const [index, setIndex] = useState(0);
  const count = banners.length;

  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);
  const banner = banners[index % Math.max(count, 1)];
  if (!banner) return <div className="h-64 bg-zinc-900" />;

  return (
    <section className={`relative flex ${compact ? "min-h-[320px]" : "min-h-[75vh]"} items-center overflow-hidden bg-zinc-900 text-white`}>
      <AnimatePresence mode="sync">
        <motion.div
          key={banner._id}
          initial={{ opacity: 0, scale: 1.12, rotateY: 8 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center [transform-style:preserve-3d]"
          style={banner.image ? { backgroundImage: `url(${banner.image})` } : undefined}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20">
        <motion.div
          key={`t-${banner._id}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl space-y-6"
        >
          <h1 className={`text-balance text-4xl font-extrabold leading-tight ${compact ? "md:text-5xl" : "md:text-6xl"}`}>{banner.title}</h1>
          <p className="text-lg text-white/85">{banner.subtitle}</p>
          {banner.ctaLabel && (
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to={banner.ctaLink || "/contact"}>
                {banner.ctaLabel} <ArrowRight />
              </Link>
            </Button>
          )}
        </motion.div>
        {count > 1 && (
          <div className="mt-10 flex items-center gap-2">
            <button aria-label="Previous" onClick={prev} className="cursor-pointer rounded-full bg-white/15 p-2 hover:bg-white/30"><ChevronLeft className="size-4" /></button>
            {banners.map((b, i) => (
              <button
                key={b._id}
                aria-label={`Show banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 cursor-pointer rounded-full transition-all ${i === index ? "w-10 bg-accent" : "w-5 bg-white/40"}`}
              />
            ))}
            <button aria-label="Next" onClick={next} className="cursor-pointer rounded-full bg-white/15 p-2 hover:bg-white/30"><ChevronRight className="size-4" /></button>
          </div>
        )}
      </div>
    </section>
  );
}
