import { AppSettings, OrderSubmission } from "@/types";
import { DEFAULT_SETTINGS } from "./pricing";

// In-memory / file-based storage fallback
let currentSettings: AppSettings = {
  exchangeRate: DEFAULT_SETTINGS.exchangeRate,
  freeShippingDubaiThreshold: DEFAULT_SETTINGS.freeThresholdUsd,
  dubaiDeliveryFee: DEFAULT_SETTINGS.dubaiFeeUsd,
  libyaShippingFee: DEFAULT_SETTINGS.libyaShippingFee,
  whatsappNumber: "+218920064400",
  phoneNumber: "092 006 44 00",
  updatedAt: new Date().toISOString(),
};

const ordersStore: OrderSubmission[] = [];

export function getSettings(): AppSettings {
  return currentSettings;
}

export function updateSettings(newSettings: Partial<AppSettings>): AppSettings {
  currentSettings = {
    ...currentSettings,
    ...newSettings,
    updatedAt: new Date().toISOString(),
  };
  return currentSettings;
}

export function saveOrder(order: Omit<OrderSubmission, "id" | "createdAt" | "status">): OrderSubmission {
  const newOrder: OrderSubmission = {
    ...order,
    id: `ORD-${Date.now().toString().slice(-6)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  ordersStore.unshift(newOrder);
  return newOrder;
}

export function getOrders(): OrderSubmission[] {
  return ordersStore;
}
