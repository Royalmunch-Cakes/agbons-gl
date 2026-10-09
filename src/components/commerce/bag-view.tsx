"use client";

import { LockIcon, ShoppingBagIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Price } from "@/components/commerce/price";
import { WhatsAppButton } from "@/components/commerce/whatsapp-button";
import { Media } from "@/components/site/media";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { bag, useBag, useCurrency } from "@/lib/store";
import { cartOrderMessage } from "@/lib/whatsapp";

/**
 * Bag + checkout (audit §4, §5.12). WhatsApp is the confirmed checkout path
 * today: the order is sent as an itemised message and the atelier confirms
 * measurements, delivery and payment. Online card payment is a pending PRD
 * decision (audit §7) and is shown as such rather than half-built.
 */
export function BagView() {
  const { items, count, subtotalUsd } = useBag();
  const currency = useCurrency();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  if (!items.length) {
    return (
      <Empty className="border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingBagIcon />
          </EmptyMedia>
          <EmptyTitle>Your bag is empty</EmptyTitle>
          <EmptyDescription>
            Discover couture pieces ready to order, or commission one made for you.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          <Button nativeButton={false} render={<Link href="/shop" />}>
            Shop now
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/consultation" />}>
            Book a consultation
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
      <ul className="flex flex-col divide-y border-y" aria-label="Items in your bag">
        {items.map((item) => (
          <li key={item.slug} className="flex gap-4 py-5">
            <Link href={`/product/${item.slug}`} className="w-24 shrink-0 sm:w-28">
              <Media asset={item.image} sizes="112px" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-heading text-xl leading-snug hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{item.sku}</p>
                </div>
                <Price usd={item.priceUsd * item.quantity} className="shrink-0" />
              </div>
              <div className="mt-auto flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Qty</span>
                  <Input
                    type="number"
                    min={1}
                    max={item.maxQuantity ?? 99}
                    value={item.quantity}
                    onChange={(e) => bag.setQuantity(item.slug, Number(e.target.value) || 1)}
                    className="h-10 w-16 text-center text-base md:text-sm"
                    aria-label={`Quantity for ${item.name}`}
                  />
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => bag.remove(item.slug)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2Icon data-icon="inline-start" />
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Card className="lg:sticky lg:top-32 lg:self-start">
        <CardHeader>
          <CardTitle className="font-heading text-2xl font-normal">Order summary</CardTitle>
          <CardDescription>
            {count} {count === 1 ? "item" : "items"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <Price usd={subtotalUsd} className="text-lg font-medium" />
          </div>
          <p className="text-xs text-muted-foreground">
            Delivery, duties and final fitting are confirmed by our team when
            you place your order.
          </p>
          <Separator />
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="bag-name">Your name (optional)</FieldLabel>
              <Input
                id="bag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="h-11 bg-card text-base md:text-sm"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bag-note">Note for the atelier (optional)</FieldLabel>
              <Textarea
                id="bag-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Event date, delivery city, sizing notes…"
                className="bg-card text-base md:text-sm"
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <WhatsAppButton
            intent="cart-order"
            className="w-full"
            message={cartOrderMessage(items, currency, { name, note })}
          >
            Place order via WhatsApp
          </WhatsAppButton>
          <Alert>
            <LockIcon />
            <AlertTitle>Online card payment coming soon</AlertTitle>
            <AlertDescription>
              For now our team confirms every order personally and shares secure
              payment details on WhatsApp.
            </AlertDescription>
          </Alert>
          <Button
            variant="link"
            size="sm"
            onClick={() => bag.clear()}
          >
            I&apos;ve sent my order — clear my bag
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
