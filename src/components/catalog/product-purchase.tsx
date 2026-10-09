"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AddToBagButton } from "@/components/commerce/add-to-bag-button";
import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { WishlistButton } from "@/components/commerce/wishlist-button";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { ProductSnapshot } from "@/lib/commerce";
import { useCurrency } from "@/lib/store";
import { productEnquiryMessage, productOrderMessage } from "@/lib/whatsapp";

/**
 * PDP purchase panel (audit §3.5 items 7–9). Two explicit, parallel paths
 * (audit §5.12): "Complete order via WhatsApp" (primary, as today) and
 * "Add to bag". Commission-only pieces route to the consultation flow.
 */
export function ProductPurchase({
  product,
  collectionName,
}: {
  product: ProductSnapshot;
  collectionName?: string;
}) {
  const currency = useCurrency();
  const max = product.maxQuantity ?? 10;
  const [qty, setQty] = useState(1);
  const purchasable = product.inStock && !product.madeToOrder;

  if (!purchasable) {
    const consult = `/consultation${collectionName ? `?collection=${encodeURIComponent(collectionName)}` : ""}`;
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          {product.madeToOrder
            ? "This piece is created to commission in your measurements. Start with a consultation and our atelier will guide you through design, fitting and timeline."
            : "This piece has sold out — we can create it again in your measurements."}
        </p>
        <Button size="xl" nativeButton={false} render={<Link href={consult} />}>
          Commission this piece
        </Button>
        <WhatsAppButton
          variant="outline"
          intent="enquiry"
          message={productEnquiryMessage(product)}
        >
          Enquire via WhatsApp
        </WhatsAppButton>
        <WishlistButton product={product} withLabel className="self-start" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <InputGroup className="h-12 w-36 bg-card">
          <InputGroupAddon>
            <InputGroupButton
              size="icon-sm"
              aria-label="Decrease quantity"
              disabled={qty <= 1}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <MinusIcon />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Quantity"
            inputMode="numeric"
            value={qty}
            onChange={(e) => {
              const n = Number.parseInt(e.target.value, 10);
              if (!Number.isNaN(n)) setQty(Math.min(max, Math.max(1, n)));
            }}
            className="text-center text-base tabular-nums"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              aria-label="Increase quantity"
              disabled={qty >= max}
              onClick={() => setQty((q) => Math.min(max, q + 1))}
            >
              <PlusIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <WishlistButton product={product} withLabel />
      </div>
      <WhatsAppButton
        intent="product-order"
        message={productOrderMessage(product, currency, qty)}
      >
        Complete order via WhatsApp
      </WhatsAppButton>
      <AddToBagButton product={product} quantity={qty} />
    </div>
  );
}
