// src/features/coupons/types.ts
export type CouponType = "percentage" | "fixed";

export interface Coupon {
  code: string;
  type: CouponType;
  value: number;               // % (e.g., 10) or fixed amount (đồng)
  maxDiscount?: number;        // only for percentage
  minOrderSubtotal?: number;   // required subtotal (đồng)
  expiresAt?: string;          // ISO date string, optional
  isActive?: boolean;
}