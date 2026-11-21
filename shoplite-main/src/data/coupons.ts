// src/data/coupons.ts
import type { Coupon } from "@/features/coupons/types";

export const coupons: Coupon[] = [
  {
    code: "SHOPLITE10",
    type: "percentage",
    value: 10,
    maxDiscount: 100_000,
    minOrderSubtotal: 300_000,
    expiresAt: "2099-12-31T23:59:59.000Z",
    isActive: true,
  },
  {
    code: "GIAM50K",
    type: "fixed",
    value: 50_000,
    minOrderSubtotal: 500_000,
    expiresAt: "2099-12-31T23:59:59.000Z",
    isActive: true,
  },
  {
    code: "TET2026",
    type: "percentage",
    value: 15,
    maxDiscount: 200_000,
    expiresAt: "2026-02-28T23:59:59.000Z",
    isActive: true,
  },
];