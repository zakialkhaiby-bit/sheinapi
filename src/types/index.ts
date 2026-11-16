export interface SheinProduct {
  id: string;
  sku: string;
  name: string;
  color?: string;
  size?: string;
  imageUrl: string;
  available: boolean;
  quantity: number;
  originalUnitCents: number; // In USD cents (e.g. 1950 = $19.50)
  productUnitCents: number;  // In USD cents (e.g. 1836 = $18.36)
  maxQuantity?: number;
}

export interface CartPricing {
  productCount: number;
  availableCount: number;
  unavailableCount: number;
  units: number;
  originalTotalCents: number;
  productTotalCents: number;
  savingsCents: number;
  dubaiDeliveryCents: number;
  payableCents: number;
  estimated: boolean;
  exchangeRate: number;
  lyd: {
    exactCents: number;
    roundedLyd: number;
  };
}

export interface SheinCart {
  kind: 'demo' | 'imported' | 'manual';
  country: string;
  currency: string;
  pricesConfirmed: boolean;
  updatedAt: string | null;
  source: string;
  shareUrl?: string;
  products: SheinProduct[];
  pricing: CartPricing;
}

export interface AppSettings {
  exchangeRate: number;              // e.g. 10.09
  freeShippingDubaiThreshold: number; // e.g. 50 ($50)
  dubaiDeliveryFee: number;           // e.g. 5.44 ($5.44)
  libyaShippingFee: number;           // e.g. 0.00
  whatsappNumber: string;             // e.g. "+218920064400"
  phoneNumber: string;                // e.g. "092 006 44 00"
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  color?: string;
  size?: string;
  unitPriceUsd: number;
  totalPriceUsd: number;
  imageUrl: string;
}

export interface OrderSubmission {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  deliveryType: 'branch' | 'home';
  branch?: string;
  address?: string;
  notes?: string;
  shareUrl?: string;
  items: OrderItem[];
  pricing: {
    productTotalUsd: number;
    dubaiDeliveryUsd: number;
    totalUsd: number;
    exchangeRate: number;
    totalLyd: number;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface ShippingRate {
  id: string;
  country: string;
  countryAr: string;
  flag: string;
  airRateUsd: number;
  seaRateUsd?: number;
  airDays: string;
  seaDays?: string;
}
