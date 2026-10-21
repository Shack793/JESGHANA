import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import Reveal from "@/components/reveal.tsx";
import TestimonialSlider from "@/components/testimonial-slider.tsx";
import BannerCarousel from "../_components/banner-carousel.tsx";

export default function ContactPage() {
  const home = useQuery(api.site.getHome, {});
  const submit = useMutation(api.site.submitInquiry);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    try {
      await submit({
        name: String(data.get("name")),
        email: String(data.get("email")),
        phone: String(data.get("phone") || "") || undefined,
        message: String(data.get("message")),
      });
      toast.success("Message sent. We will get back to you soon.");
      form.reset();
    } catch {
      toast.error("Could not send your message. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (home === undefined) return <Skeleton className="h-[60vh] rounded-none" />;
  const s = home.settings;
  return (
    <>
      <BannerCarousel compact banners={home.banners.filter((b) => b.page === "contact")} />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2">
        <Reveal className="space-y-6">
          <h2 className="text-3xl font-bold">Drop us a line. Better yet, see us in person</h2>
          <p className="text-muted-foreground">We look forward to hearing from your inquiry.</p>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><MapPin className="size-5 shrink-0 text-accent" />{s?.address}</li>
            <li className="flex gap-3"><Phone className="size-5 shrink-0 text-accent" />{s?.phones}</li>
            <li className="flex gap-3"><Clock className="size-5 shrink-0 text-accent" />{s?.hours}</li>
            {s?.email && <li className="flex gap-3"><Mail className="size-5 shrink-0 text-accent" />{s.email}</li>}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
            <Input name="name" placeholder="John Smith" required maxLength={120} />
            <Input name="email" type="email" placeholder="example@gmail.com" required />
            <Input name="phone" placeholder="0240000000" />
            <Textarea name="message" placeholder="How can we help?" rows={5} required maxLength={3000} />
            <Button type="submit" disabled={busy} className="w-full">{busy && <Spinner />} Send message</Button>
          </form>
        </Reveal>
      </div>

      {home.faqs.length > 0 && (
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-3xl px-4">
            <Reveal><h2 className="mb-8 text-center text-3xl font-bold">Frequently asked questions</h2></Reveal>
            <Accordion type="single" collapsible className="rounded-xl bg-card px-6 shadow-sm">
              {home.faqs.map((f) => (
                <AccordionItem key={f._id} value={f._id}>
                  <AccordionTrigger>{f.title}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
      {home.testimonials.length > 0 && (
        <section className="py-20">
          <Reveal><h2 className="mb-10 text-center text-3xl font-bold">Our mission is to lead our clients to their goals</h2></Reveal>
          <TestimonialSlider items={home.testimonials} />
        </section>
      )}
    </>
  );
}
