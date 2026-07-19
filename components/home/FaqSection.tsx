import { SectionHeading } from "@/components/home/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmptyState } from "@/components/common/EmptyState";
import type { Faq } from "@/lib/types/catalog";

export function FaqSection({
  title,
  subtitle,
  faqs,
}: {
  title?: string | null;
  subtitle?: string | null;
  faqs: Faq[];
}) {
  return (
    <section>
      <SectionHeading title={title ?? "Frequently Asked Questions"} subtitle={subtitle} />
      {faqs.length === 0 ? (
        <EmptyState message="No FAQs yet." />
      ) : (
        <Accordion type="single" collapsible className="mx-auto w-full max-w-2xl">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
}
