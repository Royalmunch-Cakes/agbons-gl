"use client";

import Link from "next/link";

import { AddToBagButton } from "@/components/commerce/add-to-bag-button";
import { Price } from "@/components/commerce/price";
import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { Media } from "@/components/site/media";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProductSnapshot } from "@/lib/commerce";
import { productEnquiryMessage, productOrderMessage } from "@/lib/whatsapp";

/** Quick view (audit §3.3 product card feature). */
export function QuickView({
  product,
  description,
  purchasable,
  className,
}: {
  product: ProductSnapshot;
  description: string;
  purchasable: boolean;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="secondary" size="lg" className={className} />}
      >
        Quick view
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl md:grid-cols-2 md:gap-8 md:p-6">
        <Media asset={product.image} sizes="(min-width: 768px) 360px, 90vw" />
        <div className="flex flex-col gap-4">
          <DialogTitle className="font-heading text-3xl font-normal">
            {product.name}
          </DialogTitle>
          <Price usd={product.priceUsd} className="text-lg" />
          <DialogDescription>{description}</DialogDescription>
          <div className="mt-auto flex flex-col gap-2">
            {purchasable ? (
              <>
                <WhatsAppButton
                  message={productOrderMessage(product)}
                  intent="product-order"
                >
                  Order via WhatsApp
                </WhatsAppButton>
                <AddToBagButton product={product} />
              </>
            ) : (
              <WhatsAppButton
                message={productEnquiryMessage(product)}
                intent="enquiry"
              >
                Commission this piece
              </WhatsAppButton>
            )}
            <Button
              variant="link"
              nativeButton={false}
              render={<Link href={`/product/${product.slug}`} />}
            >
              View full details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
