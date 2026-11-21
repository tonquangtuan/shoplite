// src/features/coupons/coupon-service.ts
import { formatCurrency } from "@/lib/format";
import type { Coupon } from "./types";

export class CouponError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

/** Normalize input: trim, uppercase */
export function normalizeCouponCode(raw: string): string {
  return raw.trim().toUpperCase();
}

/** Find a coupon from the static list (src/data/coupons.ts) */
export async function getCouponByCode(code: string): Promise<Coupon | undefined> {
  const { coupons } = await import("@/data/coupons"); // lazy import to avoid circular deps
  return coupons.find((c) => c.code === normalizeCouponCode(code));
}

/** Calculate discount amount based on coupon & current subtotal */
export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === "percentage") {
    const raw = (subtotal * coupon.value) / 100;
    const max = coupon.maxDiscount ?? Infinity;
    return Math.min(raw, max);
  }
  // fixed amount
  return Math.min(coupon.value, subtotal);
}

/** Validate a coupon against the current subtotal */
export async function validateCoupon(
  rawCode: string,
  subtotal: number,
) {
  const code = normalizeCouponCode(rawCode);
  const coupon = await getCouponByCode(code);
  if (!coupon || coupon.isActive === false) {
    throw new CouponError("INVALID_CODE", "Mã giảm giá không tồn tại");
  }

  // Expiration
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw new CouponError("EXPIRED", "Mã giảm giá đã hết hạn sử dụng");
  }

  // Minimum order subtotal
  if (coupon.minOrderSubtotal && subtotal < coupon.minOrderSubtotal) {
    const needed = coupon.minOrderSubtotal - subtotal;
    throw new CouponError(
      "MIN_SUBTOTAL",
      `Đơn hàng chưa đạt giá trị tối thiểu ${formatCurrency(
        coupon.minOrderSubtotal,
      )} (cần mua thêm ${formatCurrency(needed)})`,
    );
  }

  const discountAmount = calculateDiscount(coupon, subtotal);
  return { coupon, discountAmount };
}