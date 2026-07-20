import { ShieldCheck, Zap, Headset, BadgeCheck, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/home/SectionHeading";

const ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  zap: Zap,
  headset: Headset,
  badge: BadgeCheck,
};

interface WhyChooseUsItem {
  icon?: string;
  title: string;
  description?: string;
}

const DEFAULT_ITEMS: WhyChooseUsItem[] = [
  { icon: "zap", title: "Instant Processing", description: "Most orders are processed within minutes of payment verification." },
  { icon: "shield", title: "Secure & Trusted", description: "Every order is manually verified before delivery — no bots, no scams." },
  { icon: "headset", title: "24/7 Support", description: "Real humans ready to help with your order, any time." },
  { icon: "badge", title: "Best Prices", description: "Competitive pricing on every game top-up and gift card." },
];

export function WhyChooseUs({
  title,
  subtitle,
  items,
}: {
  title?: string | null;
  subtitle?: string | null;
  items?: WhyChooseUsItem[];
}) {
  const list = items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <section>
      <SectionHeading title={title ?? "Why Choose Us"} subtitle={subtitle} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((item, i) => {
          const Icon = ICONS[item.icon ?? ""] ?? BadgeCheck;
          return (
            <div key={i} className="bg-card rounded-xl border p-5">
              <Icon className="text-primary size-6" />
              <p className="mt-3 font-medium">{item.title}</p>
              {item.description && (
                <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
