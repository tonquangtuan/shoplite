# Ý định Tính năng & Phạm vi MVP: Mã giảm giá (Coupon) — ShopLite

> Tài liệu tổng hợp từ phiên Brainstorming ngày 2026-11-21.
> Làm đầu vào trực tiếp cho `bmad-prd` và `bmad-architecture`.

---

## 1. Bối cảnh & Mục tiêu

- **Mục tiêu**: Bổ sung tính năng áp dụng mã giảm giá khi thanh toán nhằm tăng tỷ lệ chốt đơn (conversion rate) và kích thích giá trị đơn hàng trung bình (AOV).
- **Ràng buộc kỹ thuật**: Triển khai hoàn toàn trên nền tảng ShopLite hiện có (Next.js 16 App Router, TypeScript, Tailwind CSS v4, dữ liệu lưu file JSON cục bộ, không dùng external database hay dịch vụ ngoài).

---

## 2. Phân loại Phạm vi MVP theo MoSCoW

### Must-Have (Tối đa 5 mục cốt lõi cho MVP)

1. **Nhập mã & Phản hồi trực quan tại trang Thanh toán (`/checkout`)**:
   - Ô nhập mã kèm nút "Áp dụng" và nút "Gỡ mã" (x).
   - Hỗ trợ 2 loại mã: giảm theo phần trăm (có mức giảm tối đa `maxDiscountAmount`) và giảm số tiền cố định (VNĐ).
   - Hiển thị ngay số tiền được giảm và tổng tiền thanh toán mới trong bảng tóm tắt đơn hàng.
2. **Server tính toán lại 100% để bảo mật chống gian lận (`POST /api/orders`)**:
   - Client chỉ gửi `couponCode` dạng chuỗi lên server; tuyệt đối không gửi số tiền giảm.
   - Server tự tra cứu dữ liệu gốc từ `src/data/coupons.ts`, tự tính lại `discountAmount` và tổng tiền cuối cùng.
   - Từ chối tạo đơn với `OrderError` nếu mã không tồn tại, hết hạn, hoặc đơn hàng chưa đạt giá trị tối thiểu.
3. **Bất biến tính toán giá & Bảo vệ biên lợi nhuận**:
   - Số tiền giảm tối đa chỉ bằng tạm tính (`discountAmount <= subtotal`), tổng tiền không bao giờ nhỏ hơn 0.
   - Giảm giá coupon CHỈ áp dụng lên tạm tính (`subtotal`), tuyệt đối không trừ vào phí vận chuyển (`shippingFee`).
   - Ngưỡng miễn phí giao hàng (500.000₫) được xét trên tạm tính **trước** khi trừ giảm giá coupon.
4. **Snapshot thông tin coupon vào đơn hàng và hiển thị lịch sử**:
   - Bổ sung trường `couponCode` và `discountAmount` vào schema `Order` trong `storage/orders.json`.
   - Trang chi tiết đơn hàng `/orders/[id]` hiển thị rõ mã đã dùng và số tiền giảm, bất kể mã gốc sau này có hết hạn hoặc bị xóa khỏi catalog.
5. **Chuẩn hóa input & Xử lý lỗi thân thiện**:
   - Chuẩn hóa mã nhập không phân biệt chữ hoa/chữ thường (case-insensitive) và tự động cắt bỏ khoảng trắng hai đầu (`trim()`).
   - Thông báo lỗi rõ ràng theo từng trường hợp cụ thể: mã không tồn tại, mã đã hết hạn, hoặc đơn chưa đạt giá trị tối thiểu (cho biết cụ thể cần mua thêm bao nhiêu).

### Should-Have (Giai đoạn tiếp theo / Sprint sau)

- Khay gợi ý mã giảm giá công khai 1-chạm (Public coupon tray) ngay tại form thanh toán.
- Thanh tiến trình kích cầu: "Mua thêm X đ để mở khóa mã coupon".
- Lưu coupon đã áp dụng vào `sessionStorage` / `localStorage` để giữ nguyên khi người dùng F5 hoặc quay lại giỏ hàng.
- Tự động gỡ mã (auto-detach) khi giỏ hàng bị thay đổi không còn đạt điều kiện tối thiểu.

### Could-Have (Tương lai khi có nhu cầu mở rộng)

- Tự động gợi ý và áp dụng mã tốt nhất (Auto-apply best coupon).
- Đồng hồ đếm ngược FOMO cho các mã giảm giá sắp hết hạn trong 24 giờ.
- Thông báo hiệu ứng chúc mừng (confetti / toast) khi áp mã thành công.

### Won't-Have (Ngoài phạm vi MVP)

- Trang quản trị Admin để tạo/sửa mã giảm giá (dùng danh mục khai báo tĩnh `src/data/coupons.ts`).
- Giới hạn số lượt dùng của mỗi mã (tránh rủi ro race condition trên file JSON cục bộ).
- Mã giảm giá cá nhân hóa theo từng người dùng (ShopLite chưa có hệ thống đăng nhập tài khoản).
- Cho phép áp dụng gộp nhiều mã trong một đơn hàng (chỉ cho phép 1 mã/đơn).

---

## 3. Danh mục Mã Giảm Giá Ban Đầu (Mock Catalog)

Định nghĩa trong `src/data/coupons.ts`:

| Mã | Loại | Giá trị | Giảm tối đa | Đơn tối thiểu | Ngày hết hạn | Mục đích kiểm thử |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SHOPLITE10` | Phần trăm | 10% | 100.000₫ | 300.000₫ | Không thời hạn | Test mã phần trăm + trần giảm |
| `GIAM50K` | Cố định | 50.000₫ | - | 500.000₫ | Không thời hạn | Test mã tiền cố định |
| `TET2026` | Phần trăm | 15% | 200.000₫ | 0₫ | 28/02/2026 | Test mã đã hết hạn |

---

## 4. Các câu hỏi then chốt & Rủi ro cần giải quyết ở bước PRD

1. **Thời điểm hết hạn**: Mã hết hạn tính chính xác đến 23:59:59 của ngày hết hạn theo múi giờ Việt Nam (`Asia/Ho_Chi_Minh` - UTC+7).
2. **Xử lý race condition khi submit**: Nếu lúc bấm "Áp dụng" mã hợp lệ nhưng khi bấm "Đặt hàng" mã vừa hết hạn, server sẽ từ chối đơn hàng với lỗi `COUPON_EXPIRED` và giữ nguyên thông tin form để khách nhập mã khác.
3. **Chính sách hủy đơn**: Khi đơn hàng ở trạng thái `pending` bị hủy, đơn hàng ghi nhận trạng thái `cancelled`, snapshot coupon vẫn lưu vết lại để phục vụ đối soát.
