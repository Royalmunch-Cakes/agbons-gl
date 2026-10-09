"use client";

import { ShoppingBagIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { trackEvent } from "@/lib/analytics";
import type { ProductSnapshot } from "@/lib/commerce";
import { bag } from "@/lib/store";

export function AddToBagButton({
  product,
  quantity = 1,
  size = "xl",
  className,
}: {
  product: ProductSnapshot;
  quantity?: number;
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
}) {
  const { inStock, madeToOrder, ...item } = product;
  const disabled = !inStock || madeToOrder;

  return (
    <Button
      size={size}
      variant="outline"
      className={className}
      disabled={disabled}
      onClick={() => {
        bag.add(item, quantity);
        trackEvent("add_to_cart", {
          item_id: item.sku,
          item_name: item.name,
          value: item.priceUsd * quantity,
          currency: "USD",
        });
        toast.add({
          title: "Added to your bag",
          description: `${item.name} × ${quantity}`,
          type: "success",
        });
      }}
    >
      <ShoppingBagIcon data-icon="inline-start" />
      {inStock ? "Add to bag" : "Sold out"}
    </Button>
  );
}
