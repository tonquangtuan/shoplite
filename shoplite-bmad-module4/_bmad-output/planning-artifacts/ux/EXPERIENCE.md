# EXPERIENCE.md: Trải Nghiệm Tính Năng Mã Giảm Giá (Coupon) — ShopLite

## 1. Foundation

- **Nền tảng & Thiết bị mục tiêu**: Web App phản hồi đa màn hình, thiết kế ưu tiên chuẩn di động **Mobile 390px** (iPhone 13/14/15/16 tiêu chuẩn) và co giãn tự nhiên lên giao diện Desktop.
- **Hệ thống thiết kế kế thừa**: Hệ thống thiết kế ngầm định của ShopLite (Next.js 16 App Router, Tailwind CSS v4, Lucide icons, font Be Vietnam Pro).
- **Quy chiếu Thiết kế Thị giác**: Toàn bộ quy cách hiển thị, màu sắc, bo góc và kích thước tuân thủ các token định nghĩa tại [DESIGN.md](file:///C:/ai-sdlc/shoplite-bmad-module4/_bmad-output/planning-artifacts/ux/DESIGN.md).

---

## 2. Information Architecture (Kiến Trúc Thông Tin)

Tính năng Coupon xuất hiện tại hai điểm tiếp xúc chính trên hành trình mua sắm:

```
/checkout (Trang Thanh toán)
├── Thông tin người nhận (Họ tên, SĐT, Địa chỉ, Ghi chú)
├── Phương thức giao hàng (Tiêu chuẩn / Giao nhanh)
├── Phương thức thanh toán (COD / Chuyển khoản)
└── Bảng Tóm Tắt Đơn Hàng (CheckoutSummary)
    ├── Danh sách sản phẩm mua
    ├── [MỚI] KHỐI MÃ GIẢM GIÁ (Coupon Block)
    │   ├── Trạng thái Chưa áp dụng: Ô nhập mã + Nút Áp dụng
    │   └── Trạng thái Đã áp dụng: Thẻ mã (Pill) + Nút Gỡ (x)
    └── Chi tiết thanh toán (dl)
        ├── Tạm tính (Subtotal)
        ├── [MỚI] Giảm giá (Coupon Code): -XX.000₫
        ├── Phí giao hàng (Shipping Fee)
        └── Tổng thanh toán (Total)

/orders/[id] (Chi tiết Đơn hàng)
├── Trạng thái đơn hàng (OrderStatusBadge)
├── Danh sách sản phẩm đã mua
└── Chi tiết thanh toán
    ├── Tạm tính
    ├── [MỚI] Dòng Giảm giá từ mã: -XX.000₫ (nếu có coupon)
    ├── Phí giao hàng
    └── Tổng thanh toán thực trả
```

---

## 3. Voice and Tone (Microcopy Tiếng Việt)

Ngôn ngữ giao diện mang phong cách trung thực, rõ ràng, lịch sự và không dùng thuật ngữ kỹ thuật khó hiểu:

| Vị trí | Loại thông điệp | Nội dung hiển thị |
| :--- | :--- | :--- |
| Ô nhập mã | Placeholder | `"Nhập mã ưu đãi"` |
| Nút bấm | Hành động | `"Áp dụng"` |
| Nút gỡ | Trợ năng (A11y) | `"Gỡ mã giảm giá"` (`aria-label`) |
| Thẻ đã áp dụng | Trạng thái | `"{COUPON_CODE}"` kèm nhãn `"Đã áp dụng"` |
| Bảng tổng kết | Dòng chiết khấu | `"Giảm giá ({COUPON_CODE})"` $\rightarrow$ `"-50.000₫"` |
| Thông báo lỗi | Mã không tồn tại | `"Mã giảm giá không hợp lệ. Vui lòng kiểm tra lại."` |
| Thông báo lỗi | Mã hết hạn | `"Mã giảm giá đã hết hạn sử dụng."` |
| Thông báo lỗi | Chưa đạt đơn tối thiểu | `"Đơn hàng chưa đạt tối thiểu {MIN_ORDER} (cần mua thêm {AMOUNT_REMAINING})."` |
| Trang đơn hàng | Lịch sử giảm giá | `"Mã giảm giá ({COUPON_CODE}): -{DISCOUNT_AMOUNT}"` |

---

## 4. Component Patterns (Khuôn Mẫu Hành Vi)

### 4.1 Quy trình Nhập & Kích hoạt Mã
1. **Tiếp nhận thao tác**: Khi người dùng gõ vào ô input, ký tự lập tức hiển thị dưới dạng chữ hoa (`uppercase`). Khoảng trắng thừa ở đầu/cuối được tự động xử lý.
2. **Kích hoạt kiểm tra**: Bấm nút *"Áp dụng"* hoặc gõ phím `Enter` từ bàn phím di động.
3. **Phản hồi tức thì (Optimistic UI)**:
   - Nếu mã hợp lệ: Ô input biến mất, thay thế bằng thẻ `AppliedCouponPill` màu xanh ngọc `{colors.success-surface}`. Dòng "Giảm giá" xuất hiện trong bảng tính tiền, con số "Tổng thanh toán" được cập nhật giảm đi ngay lập tức.
   - Nếu mã không hợp lệ: Ô input viền đỏ `{colors.danger}`, thông báo lỗi chi tiết xuất hiện phía dưới, bảng tính tiền giữ nguyên không đổi.

### 4.2 Quy trình Gỡ Mã
- Người dùng bấm vào nút icon `(x)` trên thẻ mã đã áp dụng.
- Thẻ mã biến mất không cần xác nhận pop-up (giảm ma sát). Ô nhập mã rỗng xuất hiện trở lại.
- Dòng giảm giá trong bảng tổng kết biến mất, tổng tiền thanh toán hồi phục lại nguyên trạng.

---

## 5. State Patterns (Các Trạng Thái Giao Diện)

### Trạng thái 1: Trống / Mặc định (Empty / Idle)
- Ô input hiển thị placeholder `"Nhập mã ưu đãi"`.
- Nút *"Áp dụng"* ở trạng thái vô hiệu hóa (`disabled`) nếu ô input đang rỗng để tránh bấm nhầm.

### Trạng thái 2: Đang xác thực (Validating)
- Khi bấm "Áp dụng", nút chuyển sang trạng thái loading nhẹ (con trỏ chuyển `wait`, nút mờ nhẹ) trong thời gian đối soát với catalog.

### Trạng thái 3: Áp dụng thành công (Applied)
- Hiển thị thẻ `AppliedCouponPill` viền xanh ngọc `{colors.success-border}`.
- Có nút icon `(x)` để gỡ mã bất kỳ lúc nào.
- Dòng tiền giảm hiển thị số tiền âm màu xanh ngọc (`-50.000₫`).

### Trạng thái 4: Lỗi điều kiện (Error)
- Ô input hiển thị viền đỏ `{colors.danger}`.
- Thông báo lỗi xuất hiện ngay dưới ô nhập với icon cảnh báo `AlertCircle`.
- Khi người dùng bắt đầu chạm/sửa lại nội dung trong ô input, trạng thái lỗi tự động được xóa bỏ (clear error on change).

---

## 6. Interaction Primitives (Tương Tác Cơ Bản)

- **Xử lý phím Enter**: Nhấn phím `Enter` khi đang focus trong ô mã coupon sẽ kích hoạt hành động "Áp dụng mã" mà không kích hoạt submit toàn bộ form đặt hàng.
- **Xóa khoảng trắng ngầm**: Hàm xử lý tự động `trim()` chuỗi khi so khớp, giúp khách hàng sao chép mã từ tin nhắn/mạng xã hội có dính dấu cách vẫn áp dụng thành công 100%.
- **Mobile Touch Target**: Nút "Áp dụng" có chiều cao chuẩn `40px` (`h-10`), nút gỡ mã `(x)` có vùng chạm mở rộng tối thiểu `32x32px` bảo đảm bấm chính xác trên màn hình cảm ứng di động.

---

## 7. Accessibility Floor (Tiêu Chuẩn Tiếp Cận WCAG 2.1 AA)

- **Độ tương phản màu sắc**:
  - Chữ tên mã `{colors.success-text}` (`#065f46`) trên nền `{colors.success-surface}` (`#ecfdf5`) đạt tỷ lệ tương phản **7.2:1** (vượt chuẩn AAA).
  - Chữ thông báo lỗi `{colors.danger}` (`#e11d48`) trên nền trắng đạt tỷ lệ tương phản **4.8:1** (đạt chuẩn AA).
- **Hỗ trợ Screen Reader**:
  - Vùng thông báo lỗi/thành công có thuộc tính `role="status"` và `aria-live="polite"` để phần mềm đọc màn hình tự động đọc thông báo khi có thay đổi giá tiền mà không làm gián đoạn việc điền form của người khiếm thị.
  - Nút gỡ mã có nhãn ẩn `aria-label="Gỡ mã giảm giá {COUPON_CODE}"`.
- **Keyboard Navigation**: Người dùng có thể dùng phím `Tab` để di chuyển tuần tự qua ô nhập mã -> nút Áp dụng -> nút Đặt hàng một cách logic.

---

## 8. Key Flows (Hành Trình Chi Tiết Trên Mobile 390px)

### Flow 1: Áp dụng mã hợp lệ thành công (Minh - 390px Viewport)
1. **Màn hình Checkout**: Minh cuộn xuống phần thẻ tóm tắt đơn hàng (rộng 358px, cách lề 16px).
2. **Thao tác**: Nhập `giam50k` vào ô mã. Bấm *"Áp dụng"*.
3. **Phản hồi**: 
   - Ô nhập biến mất, thẻ xanh ngọc xuất hiện: `[🏷️ GIAM50K | Đã áp dụng] [✕]`.
   - Bảng tổng kết xuất hiện dòng:
     - Tạm tính: `650.000₫`
     - **Giảm giá (GIAM50K): -50.000₫**
     - Phí giao hàng: `Miễn phí` (do 650k $\ge$ 500k)
     - **Tổng thanh toán: 600.000₫**
4. **Chốt đơn**: Minh bấm nút *"Đặt hàng"*. Đơn hàng tạo thành công.

### Flow 2: Nhập mã chưa đủ điều kiện tối thiểu (Lan - 390px Viewport)
1. **Màn hình Checkout**: Lan có đơn hàng 250.000₫.
2. **Thao tác**: Nhập `SHOPLITE10` và bấm *"Áp dụng"*.
3. **Phản hồi**:
   - Viền ô nhập chuyển sang màu đỏ.
   - Dòng chữ đỏ xuất hiện bên dưới: *"Đơn hàng chưa đạt giá trị tối thiểu 300.000₫ (cần mua thêm 50.000₫)"*.
   - Tổng tiền không đổi: `280.000₫` (250k tiền hàng + 30k ship tiêu chuẩn).
4. **Hành động tiếp theo**: Lan nhận thông tin rõ ràng, không bị ức chế, bấm nút quay lại giỏ hàng mua thêm cáp sạc 60.000₫ để đạt điều kiện.

### Flow 3: Đổi ý gỡ mã đã áp dụng (Hoàng - 390px Viewport)
1. **Màn hình Checkout**: Đơn hàng 550.000₫ đang áp mã `GIAM50K`.
2. **Thao tác**: Hoàng chạm vào biểu tượng `(x)` trên thẻ mã xanh ngọc.
3. **Phản hồi**:
   - Thẻ xanh ngọc biến mất tức thì. Ô nhập mã trống quay trở lại.
   - Dòng chiết khấu `-50.000₫` biến mất khỏi bảng tính tiền.
   - Tổng thanh toán chuyển từ `500.000₫` về lại đúng `550.000₫`.
