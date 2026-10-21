import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi,
} from "@/components/ui/carousel.tsx";

type Item = { _id: string; title: string; description: string; meta?: string };

export default function TestimonialSlider({ items }: { items: Item[] }) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const t = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(t);
  }, [api]);

  if (items.length === 0) return null;
  return (
    <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="mx-auto max-w-5xl px-10">
      <CarouselContent>
        {items.map((t) => (
          <CarouselItem key={t._id} className="md:basis-1/2 lg:basis-1/3">
            <div className="flex h-full flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
              <Quote className="size-7 text-accent" />
              <p className="flex-1 text-sm text-muted-foreground">&ldquo;{t.description}&rdquo;</p>
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.meta}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
