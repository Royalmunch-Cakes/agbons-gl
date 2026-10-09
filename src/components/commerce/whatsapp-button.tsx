"use client";

import { MessageCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { whatsappUrl, type WhatsAppIntent } from "@/lib/whatsapp";

/**
 * The single WhatsApp CTA used site-wide (TRD §8: first-class component, not
 * a hand-made link per product). Clicks are tracked per intent.
 */
export function WhatsAppButton({
  message,
  intent,
  children,
  variant = "default",
  size = "xl",
  className,
}: {
  message: string;
  intent: WhatsAppIntent;
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      nativeButton={false}
      render={
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { intent })}
        />
      }
    >
      <MessageCircleIcon data-icon="inline-start" />
      {children}
    </Button>
  );
}
