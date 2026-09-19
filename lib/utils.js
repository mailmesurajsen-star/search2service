import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Pricing is opt-in for providers. Listings saved before the option existed
// (no showPricing field) keep showing pricing if they already have a price set.
export function pricingVisible(p) {
  if (!p) return false;
  if (typeof p.showPricing === 'boolean') return p.showPricing;
  return Boolean(p.priceFrom || p.priceTo || p.fees);
}
