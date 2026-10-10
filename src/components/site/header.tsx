"use client";

import { HeartIcon, MenuIcon, SearchIcon, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CurrencySwitcher } from "@/components/commerce/currency-switcher";
import { Container } from "@/components/site/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav } from "@/config/site";
import { brandMedia } from "@/content/site";
import { useBag, useWishlist } from "@/lib/store";

type CollectionLink = { slug: string; name: string; tagline: string };

/**
 * Global header — rendered exactly once per page (fixes audit §5.1, where
 * the Elementor header rendered 3× with 3 stacked hidden modal triggers).
 */
export function Header({
  collections,
  announcement,
}: {
  collections: CollectionLink[];
  announcement: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="hidden bg-primary text-primary-foreground md:block">
        <Container className="flex h-9 items-center justify-between text-xs tracking-wide">
          <p>{announcement}</p>
          <Link href="/consultation" className="underline-offset-4 hover:underline">
            Book a consultation
          </Link>
        </Container>
      </div>
      <Container className="flex h-16 items-center gap-4 md:h-20">
        <MobileNav collections={collections} />
        <Link href="/" className="shrink-0" aria-label="AGBONS-GL home">
          <Image
            src={brandMedia.logo.src}
            alt={brandMedia.logo.alt}
            width={350}
            height={100}
            priority
            className="h-10 w-auto md:h-12"
          />
        </Link>
        <DesktopNav collections={collections} />
        <div className="ml-auto flex items-center gap-1">
          <CurrencySwitcher className="mr-2 hidden lg:flex" />
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Search the shop"
            nativeButton={false}
            render={<Link href="/shop" />}
          >
            <SearchIcon />
          </Button>
          <WishlistLink />
          <BagLink />
        </div>
      </Container>
    </header>
  );
}

function DesktopNav({ collections }: { collections: CollectionLink[] }) {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {mainNav.map((item) =>
          item.href === "/collections" ? (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[36rem] grid-cols-2 gap-1 p-2">
                  <li className="col-span-2">
                    <NavigationMenuLink
                      render={<Link href="/collections" />}
                      className="flex-col items-start gap-0.5 bg-secondary p-3"
                    >
                      <span className="font-medium">All collections</span>
                      <span className="text-xs text-muted-foreground">
                        Explore every signature and seasonal collection.
                      </span>
                    </NavigationMenuLink>
                  </li>
                  {collections.map((c) => (
                    <li key={c.slug}>
                      <NavigationMenuLink
                        render={<Link href={`/collections/${c.slug}`} />}
                        className="flex-col items-start gap-0.5 p-3"
                      >
                        <span className="font-medium">{c.name}</span>
                        <span className="line-clamp-1 text-xs text-muted-foreground">
                          {c.tagline}
                        </span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                render={<Link href={item.href} />}
                className={navigationMenuTriggerStyle()}
              >
                {item.title}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav({ collections }: { collections: CollectionLink[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open menu" />
        }
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 pb-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="py-2 font-heading text-2xl"
            >
              {item.title}
            </Link>
          ))}
          <Separator className="my-3" />
          <p className="eyebrow mb-1">Collections</p>
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              onClick={close}
              className="py-1.5 text-sm text-muted-foreground"
            >
              {c.name}
            </Link>
          ))}
          <Separator className="my-3" />
          <Link href="/wishlist" onClick={close} className="py-1.5 text-sm">
            Wishlist
          </Link>
          <Link href="/consultation" onClick={close} className="py-1.5 text-sm">
            Book a consultation
          </Link>
          <CurrencySwitcher className="mt-4" />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <Badge
      variant="brand"
      className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[0.6rem] tabular-nums"
    >
      {count}
    </Badge>
  );
}

function WishlistLink() {
  const { count } = useWishlist();
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="relative"
      aria-label={`Wishlist (${count} ${count === 1 ? "item" : "items"})`}
      nativeButton={false}
      render={<Link href="/wishlist" />}
    >
      <HeartIcon />
      <CountBadge count={count} />
    </Button>
  );
}

function BagLink() {
  const { count } = useBag();
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="relative"
      aria-label={`Shopping bag (${count} ${count === 1 ? "item" : "items"})`}
      nativeButton={false}
      render={<Link href="/bag" />}
    >
      <ShoppingBagIcon />
      <CountBadge count={count} />
    </Button>
  );
}
