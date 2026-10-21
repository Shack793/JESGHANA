import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

const FIELDS = [
  { name: "companyName", label: "Company name", long: false },
  { name: "tagline", label: "Tagline", long: false },
  { name: "intro", label: "Homepage introduction", long: true },
  { name: "about", label: "About the company", long: true },
  { name: "mission", label: "Mission", long: true },
  { name: "vision", label: "Vision", long: true },
  { name: "address", label: "Address", long: false },
  { name: "hours", label: "Opening hours", long: false },
  { name: "phones", label: "Phone numbers", long: false },
  { name: "email", label: "Email", long: false },
] as const;

export default function SettingsPage() {
  const settings = useQuery(api.admin.getSettings, {});
  const save = useMutation(api.admin.saveSettings);

  if (settings === undefined) return <Skeleton className="h-96" />;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "");
    await save({
      companyName: get("companyName"), tagline: get("tagline"), intro: get("intro"),
      about: get("about"), mission: get("mission"), vision: get("vision"),
      address: get("address"), hours: get("hours"), phones: get("phones"), email: get("email"),
    });
    toast.success("Settings saved");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site settings</h1>
        <p className="text-muted-foreground">Company text and contact details used across the site.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {FIELDS.map((f) => (
          <div key={f.name} className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor={f.name}>{f.label}</label>
            {f.long ? (
              <Textarea id={f.name} name={f.name} rows={4} defaultValue={settings?.[f.name] ?? ""} />
            ) : (
              <Input id={f.name} name={f.name} defaultValue={settings?.[f.name] ?? ""} />
            )}
          </div>
        ))}
        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
}
