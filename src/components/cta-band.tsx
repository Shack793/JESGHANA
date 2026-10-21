import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import Reveal from "@/components/reveal.tsx";

export default function CtaBand({ phones }: { phones?: string }) {
  return (
    <section className="bg-primary text-primary-foreground">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-14 md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-balance text-2xl font-bold md:text-3xl">Interested in partnering with us on your next project?</h2>
          {phones && (
            <p className="flex items-center justify-center gap-2 opacity-90 md:justify-start">
              <Phone className="size-4" /> Just a call away: {phones}
            </p>
          )}
        </div>
        <Button asChild size="lg" variant="secondary"><Link to="/contact">Talk to our engineers</Link></Button>
      </Reveal>
    </section>
  );
}
