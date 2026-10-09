"use client";

import { useSyncExternalStore } from "react";

import type { CurrencyCode, MediaAsset } from "@/lib/types";

/**
 * Client-side commerce state: bag (cart), wishlist and display currency
 * (audit §4 cart/wishlist; §5.13 currency). Persisted to localStorage so it
 * survives reloads; the server snapshot is always empty, which keeps
 * hydration consistent.
 *
 * When customer accounts are introduced (TRD §8 auth), these stores are the
 * seam to sync with a server-side bag and wishlist.
 */

function createPersistedStore<T>(key: string, initial: T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      // Storage unavailable or corrupt — fall back to the initial state.
    }
  }

  function emit() {
    listeners.forEach((l) => l());
  }

  return {
    get(): T {
      load();
      return state;
    },
    set(update: (prev: T) => T) {
      load();
      state = update(state);
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Ignore quota / privacy-mode errors; state still updates in memory.
      }
      emit();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        loaded = false;
        load();
        listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    serverSnapshot: initial,
  };
}

function useStore<T>(store: ReturnType<typeof createPersistedStore<T>>) {
  return useSyncExternalStore(store.subscribe, store.get, () => store.serverSnapshot);
}

/* ── Bag ─────────────────────────────────────────────────────────────── */

/** Snapshot of the product at the time it was added, so the bag renders without the full catalog. */
export type BagItem = {
  slug: string;
  name: string;
  sku: string;
  priceUsd: number;
  image?: MediaAsset;
  quantity: number;
  /** Tracked stock limit, if any. */
  maxQuantity?: number;
};

const EMPTY_BAG: BagItem[] = [];
const bagStore = createPersistedStore<BagItem[]>("agbons:bag", EMPTY_BAG);

const clampQty = (qty: number, max?: number) =>
  Math.max(1, Math.min(qty, max ?? 99));

export const bag = {
  add(item: Omit<BagItem, "quantity">, quantity = 1) {
    bagStore.set((items) => {
      const existing = items.find((i) => i.slug === item.slug);
      if (existing) {
        return items.map((i) =>
          i.slug === item.slug
            ? { ...i, ...item, quantity: clampQty(i.quantity + quantity, item.maxQuantity) }
            : i,
        );
      }
      return [...items, { ...item, quantity: clampQty(quantity, item.maxQuantity) }];
    });
  },
  setQuantity(slug: string, quantity: number) {
    bagStore.set((items) =>
      items.map((i) =>
        i.slug === slug ? { ...i, quantity: clampQty(quantity, i.maxQuantity) } : i,
      ),
    );
  },
  remove(slug: string) {
    bagStore.set((items) => items.filter((i) => i.slug !== slug));
  },
  clear() {
    bagStore.set(() => EMPTY_BAG);
  },
};

export function useBag() {
  const items = useStore(bagStore);
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotalUsd = items.reduce((n, i) => n + i.priceUsd * i.quantity, 0);
  return { items, count, subtotalUsd };
}

/* ── Wishlist ────────────────────────────────────────────────────────── */

export type WishlistItem = Omit<BagItem, "quantity" | "maxQuantity">;

const EMPTY_WISHLIST: WishlistItem[] = [];
const wishlistStore = createPersistedStore<WishlistItem[]>(
  "agbons:wishlist",
  EMPTY_WISHLIST,
);

export const wishlist = {
  toggle(item: WishlistItem) {
    wishlistStore.set((items) =>
      items.some((i) => i.slug === item.slug)
        ? items.filter((i) => i.slug !== item.slug)
        : [...items, item],
    );
  },
  remove(slug: string) {
    wishlistStore.set((items) => items.filter((i) => i.slug !== slug));
  },
};

export function useWishlist() {
  const items = useStore(wishlistStore);
  return {
    items,
    count: items.length,
    has: (slug: string) => items.some((i) => i.slug === slug),
  };
}

/* ── Currency ────────────────────────────────────────────────────────── */

const currencyStore = createPersistedStore<CurrencyCode>("agbons:currency", "USD");

export const currency = {
  set(code: CurrencyCode) {
    currencyStore.set(() => code);
  },
};

export function useCurrency(): CurrencyCode {
  return useStore(currencyStore);
}
