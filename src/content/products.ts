import type { Product } from "@/lib/types";

import data from "./products.json";

/**
 * Product catalog, migrated from WooCommerce (42 products, audit §2.4, §6).
 * Regenerate with `npm run import:catalog -- --insecure`.
 */
export const products = data as Product[];
