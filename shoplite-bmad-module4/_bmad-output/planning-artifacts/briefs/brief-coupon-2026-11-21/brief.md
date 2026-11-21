---
title: "Product Brief: Tính Năng Mã Giảm Giá (Coupon) — ShopLite"
status: draft
created: 2026-11-21
updated: 2026-11-21
---

# Product Brief: Tính Năng Mã Giảm Giá (Coupon) — ShopLite

## Executive Summary

ShopLite hiện đang vận hành ổn định như một cửa hàng đồ công nghệ mini hiện đại trên nền tảng Next.js 16 (App Router), cung cấp trải nghiệm mượt mà từ duyệt danh mục, quản lý giỏ hàng đến thanh toán và lưu trữ đơn hàng cục bộ. Tuy nhiên, luồng thanh toán hiện tại hoàn toàn thiếu vắng các đòn bẩy khuyến mãi, khiến tỷ lệ chuyển đổi (conversion rate) phụ thuộc đơn điệu vào một ngưỡng miễn phí vận chuyển duy nhất (500.000₫), trong khi người mua sắm đồ công nghệ luôn có tâm lý tìm kiếm ưu đãi trước khi bấm nút chốt đơn.

Tính năng **Mã Giảm Giá (Coupon)** được phát triển nhằm bổ sung năng lực khuyến mãi linh hoạt trực tiếp tại trang thanh toán (`/checkout`). Tính năng cho phép áp dụng cả hai hình thức ưu đãi phổ biến: giảm theo số tiền cố định (VNĐ) và giảm theo phần trăm có khống chế trần tối đa (`maxDiscountAmount`). Giải pháp này giúp kích thích giá trị đơn hàng trung bình (AOV) bằng các điều kiện giá trị đơn tối thiểu, đồng thời giảm thiểu tỷ lệ bỏ rơi giỏ hàng.

Điểm đặc biệt của giải pháp là sự tương thích tuyệt đối với kiến trúc sẵn có của ShopLite: **không phát sinh chi phí dịch vụ bên ngoài, không bổ sung external database, không yêu cầu hệ thống đăng nhập tài khoản phức tạp**. Toàn bộ cơ chế tính toán được bảo vệ nghiêm ngặt ở phía server theo nguyên tắc *"Never trust client input"*, đảm bảo độ tin cậy tuyệt đối về mặt kế toán và trải nghiệm khách hàng.

---

## The Problem

1. **Khách hàng thiếu động lực chốt đơn & dễ do dự phút chót**:
   Khách hàng mua đồ công nghệ thường có thói quen so sánh giá và tìm kiếm ưu đãi. Khi bước vào trang thanh toán và thấy giá giữ nguyên 100%, họ dễ nảy sinh tâm lý chần chừ hoặc rời khỏi trang để tìm kiếm khuyến mãi ở nơi khác, dẫn đến tỷ lệ bỏ rơi giỏ hàng (`abandoned checkout`) tăng cao.
2. **Cửa hàng thiếu công cụ kích thích giá trị đơn hàng (AOV)**:
   Ngoài chính sách miễn phí vận chuyển cho đơn từ 500.000₫, đội ngũ kinh doanh hoàn toàn không có công cụ nào để khuyến khích khách hàng mua thêm (up-sell/cross-sell) đối với các giỏ hàng ở phân khúc 300k–400k hoặc các đơn hàng giá trị cao.
3. **Ràng buộc hạ tầng không cho phép triển khai giải pháp cồng kềnh**:
   ShopLite là hệ thống tinh gọn, dữ liệu đơn hàng lưu trữ cục bộ trong file JSON (`storage/orders.json`). Cửa hàng không có ngân sách duy trì dịch vụ SaaS bên ngoài và không muốn biến một tính năng bán hàng thành gánh nặng vận hành hay rủi ro bảo mật dữ liệu.

---

## The Solution

Tính năng Coupon mang lại trải nghiệm ưu đãi tinh tế và minh bạch nhưng được xây dựng trên một bộ khung kỹ thuật vững chắc:

- **Giao diện Thanh toán Trực quan (`/checkout`)**:
  Cung cấp ô nhập mã giảm giá tinh gọn kèm nút "Áp dụng" và nút "Gỡ mã" (x). Hệ thống lập tức phản hồi kết quả: hiển thị rõ ràng số tiền được giảm, cập nhật tổng thanh toán mới, hoặc thông báo lý do cụ thể nếu mã không hợp lệ (hết hạn, chưa đạt giá trị tối thiểu, sai mã).
- **Chuẩn hóa thông minh**:
  Hệ thống tự động xử lý mã không phân biệt chữ hoa/chữ thường (case-insensitive) và tự cắt bỏ khoảng trắng hai đầu (`trim()`), loại bỏ hoàn toàn các lỗi gõ phím ngớ ngẩn của khách hàng trên thiết bị di động.
- **Cơ chế Bảo mật & Kế toán Bất biến (Server-Side Determinism)**:
  Client chỉ gửi duy nhất chuỗi ký tự `couponCode` lên API `POST /api/orders`. Server tại `order-service.ts` độc lập tra cứu catalog `src/data/coupons.ts` và tính toán lại 100% số tiền giảm.
  - Số tiền giảm tối đa chỉ bằng tạm tính (`discountAmount <= subtotal`), tổng tiền không bao giờ âm.
  - Giảm giá chỉ trừ vào tiền hàng (`subtotal`), tuyệt đối không cấn trừ vào phí vận chuyển (`shippingFee`).
  - Ngưỡng miễn phí vận chuyển (500.000₫) được bảo toàn tính trên giá trị đơn trước giảm giá.
- **Snapshot Lịch sử Bền vững**:
  Khi đơn hàng được tạo, thông tin mã và số tiền giảm được ghi nhận trực tiếp vào đối tượng đơn hàng trong `storage/orders.json`. Trang chi tiết đơn hàng `/orders/[id]` luôn hiển thị chính xác lịch sử ưu đãi kể cả khi mã gốc sau này hết hạn hoặc bị gỡ khỏi hệ thống.

---

## What Makes This Different

- **Zero-External Infrastructure (Không phụ thuộc hạ tầng ngoài)**:
  Khác với các nền tảng thương mại điện tử đòi hỏi Redis, microservice khuyến mãi hay database quan hệ phức tạp, giải pháp của ShopLite tận dụng sức mạnh của TypeScript pure functions và cấu trúc file JSON an toàn, triển khai nhanh và bảo trì gần như bằng 0.
- **Triết lý "Bảo mật phòng vệ" (Defensive by Design)**:
  Loại bỏ hoàn toàn nguy cơ gian lận giá từ client bằng cơ chế tính toán lại độc lập tại server, đồng thời khống chế mức giảm trần (`maxDiscountAmount`) trên các mã phần trăm để triệt tiêu nguy cơ "vỡ quỹ khuyến mãi" trên các đơn hàng giá trị lớn.

---

## Who This Serves

- **Khách hàng cá nhân (Shoppers)**: Những người mua sắm đồ công nghệ yêu thích cảm giác tiết kiệm được tiền, cần sự phản hồi tức thì và minh bạch về giá tiền ngay trước khi đưa ra quyết định thanh toán.
- **Người vận hành / Quản lý cửa hàng (Shop Operator)**: Cần một công cụ khuyến mãi đáng tin cậy để chạy các chiến dịch thúc đẩy doanh số ngắn hạn (như dịp lễ Tết, xả kho) mà không sợ sai lệch dòng tiền đối soát với bên vận chuyển.

---

## Success Criteria

1. **Hiệu quả chuyển đổi**: Tỷ lệ đơn hàng hoàn tất thanh toán có sử dụng mã coupon đạt [ASSUMPTION: 25% – 35% tổng số đơn phát sinh] trong các đợt chạy khuyến mãi.
2. **Kích thích giá trị đơn hàng (AOV)**: Tỷ lệ các đơn hàng có giá trị tiệm cận ngưỡng mã (ví dụ từ 250k nâng lên 300k để dùng mã `SHOPLITE10`) tăng trưởng ít nhất [ASSUMPTION: 15%].
3. **Độ tin cậy & Toàn vẹn hệ thống**:
   - Tỷ lệ lỗi tính sai tiền hoặc sai lệch kế toán đạt **0.0%**.
   - 100% các đơn hàng có mã coupon hiển thị chính xác thông tin giảm giá khi truy cập lại trang `/orders/[id]`.
   - Toàn bộ test suite liên quan (`pricing.test.ts`, `order-service.test.ts`) vượt qua `npm run check` 100%.

---

## Scope & Boundaries (Ranh giới phạm vi MVP)

### Trong phạm vi MVP (In-Scope)
- Hỗ trợ 2 định dạng mã: Số tiền cố định (`fixed`) và Phần trăm có chặn trần (`percentage` + `maxDiscountAmount`).
- Hỗ trợ các điều kiện: Giá trị đơn hàng tối thiểu (`minOrderValue`) và Ngày hết hạn (`expiryDate`).
- Ô nhập mã, áp dụng, gỡ mã tại trang `/checkout`.
- Hiển thị giảm giá và cập nhật tổng tiền tức thì trên UI Checkout.
- Xác thực và tính toán lại 100% tại `POST /api/orders` từ catalog tĩnh `src/data/coupons.ts`.
- Bổ sung `couponCode` và `discountAmount` vào `Order` schema và hiển thị ở `/orders/[id]`.
- Bộ 3 mã thử nghiệm ban đầu: `SHOPLITE10` (10% tối đa 100k cho đơn từ 300k), `GIAM50K` (50k cho đơn từ 500k), `TET2026` (15% tối đa 200k, test mã hết hạn).

### Ngoài phạm vi MVP (Out-of-Scope)
- Giao diện Admin quản trị mã (mã được định nghĩa tĩnh trong mã nguồn `src/data/coupons.ts`).
- Giới hạn số lượt sử dụng trên từng mã (tránh rủi ro race condition trên file JSON cục bộ).
- Khuyến mãi cá nhân hóa gắn theo tài khoản người dùng [ASSUMPTION: ShopLite chưa có Auth].
- Áp dụng gộp nhiều mã trên cùng một đơn hàng (chỉ cho phép tối đa 1 mã/đơn).
- Khay gợi ý mã công khai và thanh tiến trình kích cầu (chuyển sang Sprint sau).

---

## Vision

- **Giai đoạn 2 (Trải nghiệm nâng cao)**: Bổ sung khay gợi ý mã 1-chạm thông minh, thanh tiến trình đo lường khoảng cách đến ngưỡng ưu đãi, và cơ chế tự động lưu mã vào phiên duyệt web để không bị mất khi tải lại trang.
- **Giai đoạn 3 (Hệ thống Khuyến mãi Toàn diện)**: Khi ShopLite phát triển hệ thống tài khoản và cơ sở dữ liệu chuyên dụng, tính năng sẽ nâng cấp thành ví voucher cá nhân, tích điểm hội viên (Loyalty Points) và tự động đề xuất mã giảm giá tối ưu nhất cho khách hàng.
