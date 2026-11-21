---
status: draft
---

# ShopLite Coupon Feature – Epic & Story Breakdown

## Overview

Tài liệu này chuyển đổi các yêu cầu từ PRD, Architecture Spine và UX Design (DESIGN & EXPERIENCE) thành các Epic và Story chi tiết, sẵn sàng cho đội phát triển thực thi. Mỗi Story chứa mô tả, mục tiêu và Acceptance Criteria (Given/When/Then) viết bằng tiếng Việt. Các AD‑n được trích ra từ Architecture Spine để liên kết quyết định kiến trúc.

## Epic 1: Coupon Catalog Management

### Story 1.1: Tạo và duy trì danh sách mã giảm giá tĩnh
**Mô tả**: Như FR‑1 trong PRD, hệ thống phải có một catalog tĩnh `src/data/coupons.ts` chứa các mã coupon, kiểu, giá trị, và các ràng buộc.

**Acceptance Criteria**:
- **Given** danh sách `coupons.ts` hiện tại có ít nhất 3 mẫu mã (SHOPLITE10, GIAM50K, TET2026).
- **When** nhà phát triển thêm một đối tượng coupon mới trong file.
- **Then** TypeScript biên dịch không lỗi và các unit test `pricing.test.ts` vẫn chạy thành công.
- **And** AD‑7 (Static Coupon Catalog) được tuân thủ.

### Story 1.2: Định dạng và validation schema cho coupon
**Mô tả**: Áp dụng schema Zod để validate cấu trúc coupon khi được khai báo.

**Acceptance Criteria**:
- **Given** một coupon mới được thêm vào `coupons.ts`.
- **When** quá trình biên dịch chạy `npm run check`.
- **Then** nếu coupon không đáp ứng interface `Coupon` (thiếu field hoặc giá trị không hợp lệ) sẽ báo lỗi Zod.
- **And** AD‑6 (Standardized Error Hierarchy) được áp dụng.

## Epic 2: UI – Coupon Input & Feedback at Checkout

### Story 2.1: Thiết kế ô nhập mã coupon và nút Áp dụng
**Mô tả**: Theo DESIGN.md, tạo component `CouponInputField` với kiểu dáng, màu sắc, và hành vi chuyển thành chữ hoa.

**Acceptance Criteria**:
- **Given** người dùng đang ở trang `/checkout`.
- **When** họ nhập một chuỗi ký tự (ví dụ: `giam50k `) và nhấn nút *Áp dụng*.
- **Then** input tự động chuyển thành `GIAM50K` (uppercase, trim) và gửi `couponCode` tới server.
- **And** UI hiển thị trạng thái loading trong 500 ms.
- **And** đáp ứng AD‑2 (Pure Domain Functions) cho việc xử lý phía client.

### Story 2.2: Hiển thị thông báo thành công và pill coupon
**Mô tả**: Khi server trả về coupon hợp lệ, hiển thị `AppliedCouponPill` theo màu `success`.

**Acceptance Criteria**:
- **Given** server trả về `discountAmount` hợp lệ.
- **When** UI nhận phản hồi thành công.
- **Then** hiển thị pill với mã coupon in hoa, badge "Đã áp dụng", và số tiền giảm `-50.000₫`.
- **And** màu nền `success‑surface` và viền `success‑border` đúng theo DESIGN.md.
- **And** AD‑3 (UX Design Requirements) được đáp ứng.

### Story 2.3: Xử lý lỗi nhập mã không hợp lệ
**Mô tả**: Khi coupon không tồn tại, hết hạn hoặc không đáp ứng `minOrderValue`, hiển thị thông báo lỗi inline.

**Acceptance Criteria**:
- **Given** người dùng nhập `SHOPLITE10` với subtotal < 300 000₫.
- **When** server trả về lỗi `COUPON_MIN_ORDER_NOT_MET`.
- **Then** UI hiển thị tin lỗi: "Đơn hàng chưa đạt giá trị tối thiểu 300.000₫ (cần mua thêm 50.000₫)" dưới ô input.
- **And** màu chữ và nền sử dụng `danger` và `danger‑surface` từ DESIGN.md.
- **And** AD‑4 (Server‑Authoritative Price) được tuân thủ.

### Story 2.4: Gỡ mã coupon
**Mô tả**: Người dùng có thể bấm nút *Gỡ mã* để hủy áp dụng.

**Acceptance Criteria**:
- **Given** coupon đang được áp dụng và pill hiển thị.
- **When** người dùng nhấn nút “X” trên pill.
- **Then** UI gửi yêu cầu gỡ mã, server cập nhật `discountAmount = 0` và trả về tổng tiền gốc.
- **And** UI cập nhật lại bảng tổng kết ngay lập tức mà không reload trang.
- **And** AD‑5 (Order Snapshot) vẫn giữ lại thông tin coupon đã dùng trong lịch sử đơn.

## Epic 3: Server‑Side Coupon Validation & Pricing

### Story 3.1: Xác thực coupon tại `POST /api/orders`
**Mô tả**: Khi đặt hàng, server phải kiểm tra tính hợp lệ của coupon và tính lại giá.

**Acceptance Criteria**:
- **Given** payload chứa `couponCode: "GIAM50K"` và subtotal = 650 000₫.
- **When** `order-service.placeOrder()` được gọi.
- **Then** server kiểm tra tồn tại mã, chưa hết hạn, và `subtotal >= minOrderValue`.
- **And** tính `discountAmount = 50.000₫` (fixed) và tổng tiền = 600.000₫.
- **And** trả về JSON với `couponCode`, `discountAmount`, và `total` đúng.
- **And** AD‑8 (Financial Invariant) được duy trì: `discountAmount ≤ subtotal`, `total ≥ 0`.

### Story 3.2: Tính giảm phần trăm với trần tối đa
**Mô tả**: Áp dụng coupon `%` như `SHOPLITE10` với `maxDiscountAmount`.

**Acceptance Criteria**:
- **Given** subtotal = 800 000₫, coupon `SHOPLITE10` (10%, max 100 000₫).
- **When** tính `discount = min(floor(800 000 × 10/100), 100 000) = 80 000₫`.
- **Then** tổng tiền = 720 000₫ (không âm).
- **And** AD‑8 và AD‑9 (Timezone) đều được áp dụng.

### Story 3.3: Bảo vệ phí vận chuyển và free‑ship
**Mô tả**: Phí ship không bị giảm bởi coupon; miễn phí khi `subtotal >= 500 000` trước khi giảm.

**Acceptance Criteria**:
- **Given** subtotal = 520 000₫, coupon giảm 50 000₫.
- **When** tính phí ship `standard`.
- **Then** phí ship vẫn = 0 (free‑ship), vì tiêu chuẩn được xét trên subtotal gốc.
- **And** total = 470 000₫.
- **And** AD‑8 (Shipping Protection) được tuân thủ.

## Epic 4: Order Snapshot & Cancellation

### Story 4.1: Lưu lại thông tin coupon trong `orders.json`
**Mô tả**: Khi đơn hàng thành công, lưu `couponCode` và `discountAmount` vào snapshot.

**Acceptance Criteria**:
- **Given** đơn hàng được tạo thành công với coupon `GIAM50K`.
- **When** file `storage/orders.json` được ghi.
- **Then** đối tượng order có trường `couponCode: "GIAM50K"` và `discountAmount: 50000`.
- **And** AD‑10 (Order Snapshot Immutability) được đáp ứng.

### Story 4.2: Hủy đơn hàng có coupon khi trạng thái pending
**Mô tả**: Theo FR‑7 và AD‑5, cho phép hủy nếu `status === "pending"`.

**Acceptance Criteria**:
- **Given** đơn hàng có trạng thái `pending` và chứa coupon.
- **When** người dùng gọi API `POST /api/orders/:id/cancel`.
- **Then** server chuyển `status` thành `cancelled` và không xóa `couponCode` hoặc `discountAmount` khỏi snapshot.
- **And** trả về JSON với thông tin cập nhật.
- **And** nếu trạng thái khác (`confirmed`, `shipping`, …) trả về lỗi `INVALID_STATUS_TRANSITION` (code 409).

## Epic 5: UX Experience – Interaction Flows

### Story 5.1: Flow áp dụng coupon thành công (UJ‑1)
**Mô tả**: Người dùng nhập mã hợp lệ và nhận giảm giá ngay.

**Acceptance Criteria**:
- **Given** người dùng Minh đã thêm sản phẩm, subtotal = 650 000₫.
- **When** nhập `giam50k ` và bấm *Áp dụng*.
- **Then** UI hiển thị dòng "Giảm giá (GIAM50K): -50.000₫" và tổng tiền cập nhật 600 000₫.
- **And** nút *Gỡ mã* xuất hiện.
- **And** AD‑1 (Feature‑Based Co‑Location) được thực hiện qua component trong `src/features/checkout`.

### Story 5.2: Flow lỗi coupon không đạt min‑order (UJ‑2)
**Mô tả**: Người dùng nhập mã nhưng chưa đủ giá trị đơn.

**Acceptance Criteria**:
- **Given** Lan có subtotal = 250 000₫, nhập `SHOPLITE10`.
- **When** server trả lỗi `COUPON_MIN_ORDER_NOT_MET`.
- **Then** UI hiển thị thông báo "Đơn hàng chưa đạt giá trị tối thiểu 300.000₫ (cần mua thêm 50.000₫)".
- **And** không thay đổi subtotal hay phí ship.

### Story 5.3: Flow gỡ mã (UJ‑3)
**Mô tả**: Người dùng muốn bỏ coupon đã áp dụng.

**Acceptance Criteria**:
- **Given** coupon đang hiển thị trong pill.
- **When** người dùng nhấn nút *Gỡ mã*.
- **Then** UI gọi API gỡ, server trả về `discountAmount = 0` và tổng tiền tính lại.
- **And** pill biến mất, bảng tổng kết cập nhật lại.

---

**AD References**
- AD‑1 — Feature‑Based Co‑Location Architecture
- AD‑2 — Pure Domain Functions
- AD‑3 — UX Design Requirements (DESIGN & EXPERIENCE)
- AD‑4 — Server‑Authoritative Price
- AD‑5 — Standardized Error Hierarchy
- AD‑6 — Zod Validation & Schema
- AD‑7 — Static Coupon Catalog
- AD‑8 — Financial Invariant & Shipping Protection
- AD‑9 — Timezone Determinism
- AD‑10 — Order Snapshot Immutability
