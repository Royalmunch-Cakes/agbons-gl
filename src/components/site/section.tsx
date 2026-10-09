import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10", className)}
      {...props}
    />
  );
}

export function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return <section className={cn("py-16 md:py-24", className)} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="text-4xl leading-tight text-balance md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b bg-secondary">
      <Container className="flex flex-col items-center gap-5 py-16 text-center md:py-24">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="max-w-3xl text-5xl leading-[1.05] text-balance md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        )}
        {children}
      </Container>
    </div>
  );
}
