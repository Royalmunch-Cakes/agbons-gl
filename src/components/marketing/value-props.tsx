import { GemIcon, GlobeIcon, SparklesIcon } from "lucide-react";

import { Container, Section } from "@/components/site/section";
import { valueProps } from "@/content/site";

const icons = [GemIcon, GlobeIcon, SparklesIcon];

/** 3-column value props (audit §3.1 item 6, repeated on §3.3). */
export function ValueProps() {
  return (
    <Section className="border-y bg-secondary py-14 md:py-20">
      <Container className="grid gap-10 md:grid-cols-3">
        {valueProps.map((v, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={v.title}
              className="flex flex-col items-center gap-3 text-center"
            >
              <Icon
                className="size-7 text-brand-ink"
                strokeWidth={1.25}
                aria-hidden
              />
              <h3 className="text-2xl">{v.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {v.body}
              </p>
            </div>
          );
        })}
      </Container>
    </Section>
  );
}
