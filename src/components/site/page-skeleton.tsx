import { Container, Section } from "@/components/site/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Fallback while a dynamic page's params resolve (Cache Components). */
export function PageSkeleton() {
  return (
    <Section className="pt-8 md:pt-12">
      <Container className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Skeleton className="aspect-[4/5] w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Container>
    </Section>
  );
}
