# Phụ Lục Kỹ Thuật & Nghiệp Vụ (Addendum): Mã Giảm Giá — ShopLite

> Tài liệu lưu giữ các thông tin kỹ thuật sâu, ma trận đánh đổi và phân tích rủi ro được kế thừa từ phiên Brainstorming và Party Mode ngày 2026-11-21.
> Dành cho các bước tiếp theo: `bmad-prd` và `bmad-architecture`.

---

## 1. Chi Tiết Danh Mục Mã Mẫu Ban Đầu (Mock Catalog)

Định nghĩa tại `src/data/coupons.ts`:

```typescript
export interface Coupon {
  code: string;
  type: "fixed" | "percentage";
  value: number; // Số tiền (VNĐ) hoặc phần trăm (1-100)
  maxDiscountAmount?: number; // Bắt buộc đối với type === "percentage"
  minOrderValue?: number; // Ngưỡng giá trị đơn hàng tối thiểu
  expiryDate?: string; // Định dạng YYYY-MM-DD
  description: string;
}
```

Dữ liệu seed ban đầu:
- **`SHOPLITE10`**: Type `percentage`, value `10`, `maxDiscountAmount: 100_000`, `minOrderValue: 300_000`. Dùng để kiểm thử logic tính phần trăm và chặn trần.
- **`GIAM50K`**: Type `fixed`, value `50_000`, `minOrderValue: 500_000`. Dùng để kiểm thử mã tiền cố định.
- **`TET2026`**: Type `percentage`, value `15`, `maxDiscountAmount: 200_000`, `expiryDate: "2026-02-28"`. Dùng để kiểm thử trường hợp mã đã hết hạn.

---

## 2. Các Rủi Ro Kỹ Thuật & Giải Pháp Thiết Kế (Từ Party Mode)

1. **Xử lý Múi giờ Hết hạn (Timezone Handling)**:
   - *Rủi ro*: Môi trường CI chạy UTC, trong khi người dùng ở Việt Nam (UTC+7). So sánh chuỗi ngày đơn giản sẽ gây lệch 7 giờ.
   - *Giải pháp*: Quy ước ngày hết hạn `YYYY-MM-DD` kết thúc vào 23:59:59.999 giờ Việt Nam (`+07:00`). Kiểm tra bằng cách parse ra timestamp milliseconds chuẩn hoặc so sánh có bù múi giờ trong hàm pure function.
2. **Khả năng gãy Regression Test tại `pricing.ts`**:
   - *Rủi ro*: Hàm `calculateOrderTotals` đang là nền tảng cho cả giỏ hàng và đơn hàng.
   - *Giải pháp*: Không sửa đổi làm hỏng signature cũ. Có thể mở rộng tham số tùy chọn hoặc tách helper: `calculateCouponDiscount(subtotal, coupon)` -> trả về số tiền giảm an toàn (`<= subtotal`), sau đó trừ vào `subtotal`.
3. **Bảo toàn trạng thái Form khi mã hết hạn ở phút chót**:
   - *Rủi ro*: Khi bấm Đặt hàng, nếu mã hết hạn, server từ chối làm mất toàn bộ thông tin người mua (tên, điện thoại, địa chỉ).
   - *Giải pháp*: API trả về `OrderError("COUPON_EXPIRED")` (HTTP 422). Client bắt lỗi này và chỉ đánh dấu lỗi vào trường coupon, giữ nguyên dữ liệu các trường khác trên `CheckoutForm`.
4. **Bảo vệ biên lợi nhuận & Free Shipping**:
   - *Quy tắc bất biến*: Ngưỡng Free Shipping (500k) được tính trên `subtotal` gốc. Ví dụ: đơn hàng 520k áp mã giảm 50k -> tiền hàng sau giảm còn 470k -> tiền ship vẫn là 0₫ (tổng thanh toán 470k).

---

## 3. Ma Trận Đánh Đổi Tính Năng (Trade-Off Matrix)

| Quyết định | Lựa chọn thực hiện | Lý do lựa chọn | Phương án bị từ chối & Lý do |
| :--- | :--- | :--- | :--- |
| **Lưu trữ mã** | File code tĩnh `src/data/coupons.ts` | Không cần external database, deploy nhanh, an toàn | Lưu trong `storage/coupons.json` bị từ chối vì rủi ro ghi đè đồng thời |
| **Giới hạn số lần dùng** | Không giới hạn trong MVP | Hệ thống không có Auth/Database, không thể lock số lượt dùng tin cậy | Giới hạn theo IP/Cookie bị từ chối vì dễ bị vượt qua và gây phức tạp |
| **Số lượng mã / đơn** | Tối đa 1 mã / 1 đơn hàng | Tránh xung đột thứ tự áp mã và bảo vệ biên lợi nhuận cửa hàng | Gộp nhiều mã bị từ chối vì logic tính toán quá phức tạp cho MVP |
