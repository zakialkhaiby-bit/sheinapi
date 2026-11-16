import { CartPricing, SheinProduct } from "@/types";

export const DEFAULT_SETTINGS = {
  exchangeRate: typeof process !== "undefined" && process.env.EXCHANGE_RATE ? parseFloat(process.env.EXCHANGE_RATE) : 10.09,
  underCents: 5000,     // $50.00
  feeCents: 544,        // $5.44
  freeThresholdUsd: 50,
  dubaiFeeUsd: 5.44,
  libyaShippingFee: 0,
};

/**
 * Rounds an amount in Libyan Dirhams (represented in cent-units * 100 or standard float) to the nearest 5 LYD.
 * Formula extracted from Wasla: 5 * Math.floor((exactCents + 250) / 500)
 */
export function roundTo5LYD(exactCents: number): number {
  return 5 * Math.floor((exactCents + 250) / 500);
}

/**
 * Calculates cart pricing according to Wasla's exact rules.
 */
export function calculatePricing(
  products: SheinProduct[],
  exchangeRate: number = DEFAULT_SETTINGS.exchangeRate,
  dubaiFeeCents: number = DEFAULT_SETTINGS.feeCents,
  freeThresholdCents: number = DEFAULT_SETTINGS.underCents
): CartPricing {
  let originalTotalCents = 0;
  let productTotalCents = 0;
  let availableCount = 0;
  let unavailableCount = 0;
  let units = 0;

  for (const product of products) {
    if (product.available) {
      availableCount += 1;
      units += product.quantity;
      originalTotalCents += (product.originalUnitCents || product.productUnitCents) * product.quantity;
      productTotalCents += product.productUnitCents * product.quantity;
    } else {
      unavailableCount += 1;
    }
  }

  // Dubai delivery fee: $5.44 if < $50.00, $0 if >= $50.00
  const dubaiDeliveryCents = (availableCount > 0 && productTotalCents < freeThresholdCents) 
    ? dubaiFeeCents 
    : 0;

  const payableCents = productTotalCents + dubaiDeliveryCents;
  const savingsCents = Math.max(0, originalTotalCents - productTotalCents);

  // Exact LYD calculation: payableCents (USD cents) * exchangeRate = exact LYD cents
  const exactLydCents = Math.round(payableCents * exchangeRate);
  const roundedLyd = roundTo5LYD(exactLydCents);

  return {
    productCount: availableCount + unavailableCount,
    availableCount,
    unavailableCount,
    units,
    originalTotalCents,
    productTotalCents,
    savingsCents,
    dubaiDeliveryCents,
    payableCents,
    estimated: true,
    exchangeRate,
    lyd: {
      exactCents: exactLydCents,
      roundedLyd,
    },
  };
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatLyd(amount: number): string {
  return `${amount.toLocaleString("en-US")} د.ل`;
}
