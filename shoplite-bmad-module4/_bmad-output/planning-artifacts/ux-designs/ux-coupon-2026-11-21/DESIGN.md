---
name: "ShopLite Design System (Coupon Delta)"
description: "Visual identity and design tokens for ShopLite, capturing existing conventions plus delta specifications for the Coupon feature."
colors:
  primary: "#4f46e5" # indigo-600
  primary-hover: "#6366f1" # indigo-500
  primary-light: "#eef2ff" # indigo-50
  neutral-bg: "#f8fafc" # slate-50
  neutral-surface: "#ffffff" # white
  neutral-text: "#0f172a" # slate-900
  neutral-muted: "#64748b" # slate-500
  neutral-border: "#e2e8f0" # slate-200
  neutral-ring: "#cbd5e1" # slate-300
  success: "#10b981" # emerald-500
  success-surface: "#ecfdf5" # emerald-50
  success-text: "#065f46" # emerald-800
  success-border: "#a7f3d0" # emerald-200
  danger: "#e11d48" # rose-600
  danger-surface: "#fff1f2" # rose-50
  danger-text: "#9f1239" # rose-800
  danger-border: "#fecdd3" # rose-200
  warning: "#b45309" # amber-700
  warning-surface: "#fffbeb" # amber-50
  warning-border: "#fde68a" # amber-200
typography:
  font-family: "var(--font-be-vietnam-pro), ui-sans-serif, system-ui, sans-serif"
  headline:
    fontSize: "1.125rem" # text-lg (18px)
    fontWeight: "600"
    lineHeight: "1.75rem"
  body:
    fontSize: "0.875rem" # text-sm (14px)
    fontWeight: "400"
    lineHeight: "1.25rem"
  caption:
    fontSize: "0.75rem" # text-xs (12px)
    fontWeight: "500"
    lineHeight: "1rem"
  code:
    fontSize: "0.875rem"
    fontWeight: "700"
    letterSpacing: "0.05em"
rounded:
  sm: "0.375rem" # rounded-md
  md: "0.5rem" # rounded-lg
  lg: "0.75rem" # rounded-xl (nút, input)
  xl: "1rem" # rounded-2xl (card, panel)
  full: "9999px" # badge
spacing:
  mobile-gutter: "1rem" # px-4 (16px)
  card-padding: "1.25rem" # p-5 (20px)
  element-gap: "0.75rem" # gap-3 (12px)
  inline-gap: "0.5rem" # gap-2 (8px)
components:
  card:
    bg: "{colors.neutral-surface}"
    rounded: "{rounded.xl}"
    ring: "1px solid {colors.neutral-border}"
    shadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  button-primary:
    bg: "{colors.primary}"
    color: "#ffffff"
    rounded: "{rounded.lg}"
    height: "2.5rem" # h-10
  button-secondary:
    bg: "{colors.neutral-surface}"
    color: "{colors.neutral-text}"
    ring: "1px inset {colors.neutral-ring}"
    rounded: "{rounded.lg}"
    height: "2.5rem"
  coupon-input:
    height: "2.5rem" # h-10 (40px)
    bg: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
    ring: "1px inset {colors.neutral-ring}"
    text-transform: "uppercase"
  coupon-pill:
    bg: "{colors.success-surface}"
    color: "{colors.success-text}"
    ring: "1px inset {colors.success-border}"
    rounded: "{rounded.lg}"
---

# Brand & Style

ShopLite sở hữu ngôn ngữ thiết kế tinh giản, thân thiện và đậm chất công nghệ hiện đại. Giao diện ưu tiên tính thực dụng, sạch sẽ với tone nền sáng (`bg-slate-50`), các khối nội dung được đóng gói trong thẻ bo góc mềm mại (`rounded-2xl`) cùng viền mảnh tinh tế (`ring-1 ring-slate-200`). Tính năng Mã giảm giá (Coupon) kế thừa 100% phong cách này và chỉ bổ sung các chi tiết giao diện vi mô (micro-components) tại trang thanh toán và chi tiết đơn hàng, tuyệt đối không tạo ra sự phân mảnh thị giác.

---

# Colors

Hệ thống màu sắc tuân thủ bảng màu chuẩn của Tailwind CSS v4 đã có trong dự án:

- **Màu chủ đạo (Primary - Indigo)**:
  - `{colors.primary}` (`#4f46e5` - `indigo-600`): Dùng cho nút kêu gọi hành động chính (Đặt hàng), link tương tác, và điểm nhấn tổng tiền thanh toán.
  - `{colors.primary-light}` (`#eef2ff` - `indigo-50`): Nền phụ trợ cho các vùng trạng thái tích cực nhẹ.
- **Màu trung tính (Neutral - Slate)**:
  - `{colors.neutral-bg}` (`#f8fafc` - `slate-50`): Màu nền toàn trang.
  - `{colors.neutral-surface}` (`#ffffff`): Màu nền các khối thẻ sản phẩm và tổng kết đơn hàng.
  - `{colors.neutral-text}` (`#0f172a` - `slate-900`): Màu chữ nội dung chính.
  - `{colors.neutral-muted}` (`#64748b` - `slate-500`): Màu chữ phụ đề, nhãn mô tả, placeholder.
  - `{colors.neutral-border}` (`#e2e8f0` - `slate-200`): Đường viền thẻ và đường phân cách.
- **Màu trạng thái thành công (Success - Emerald - DELTA CHO COUPON)**:
  - `{colors.success-surface}` (`#ecfdf5` - `emerald-50`): Nền thẻ thông báo mã áp dụng thành công.
  - `{colors.success-text}` (`#065f46` - `emerald-800`): Chữ tên mã coupon và số tiền được giảm.
  - `{colors.success-border}` (`#a7f3d0` - `emerald-200`): Viền thẻ mã giảm giá hợp lệ.
  - `emerald-600` (`#059669`): Dòng hiển thị số tiền giảm `-[Số tiền]₫` trong bảng tổng kết.
- **Màu cảnh báo & Lỗi (Danger - Rose)**:
  - `{colors.danger}` (`#e11d48` - `rose-600`): Màu viền input khi lỗi và chữ thông báo lỗi mã coupon.
  - `{colors.danger-surface}` (`#fff1f2` - `rose-50`): Nền highlight lỗi nếu có.

---

# Typography

- **Phông chữ**: `Be Vietnam Pro` (`--font-be-vietnam-pro`) với các độ dày chuẩn: Regular (400), Medium (500), SemiBold (600), Bold (700).
- **Quy tắc hiển thị mã Coupon**: Mã coupon luôn hiển thị bằng chữ in hoa (`uppercase`), font chữ đậm (`font-bold` hoặc `font-semibold`), khoảng cách ký tự hơi giãn nhẹ (`tracking-wider` hoặc `letterSpacing: 0.05em`) để phân biệt rõ với văn bản thông thường.

---

# Layout & Spacing (Mobile 390px Viewport)

- **Cấu trúc màn hình di động (390px)**:
  - Lề hai bên (Gutter): `16px` (`px-4`).
  - Khoảng cách giữa các thẻ: `16px` (`gap-4`).
  - Đệm trong của thẻ tóm tắt đơn hàng (`CheckoutSummary`): `20px` (`p-5`).
- **Khối nhập mã giảm giá**:
  - Đặt ngay bên dưới danh sách sản phẩm và ngay phía trên khối tính toán tạm tính / phí vận chuyển.
  - Tỷ lệ lưới hàng ngang: Ô input chiếm toàn bộ chiều ngang còn lại (`flex-1`), nút "Áp dụng" giữ kích thước cố định (`shrink-0`).

---

# Elevation & Depth

- **Thẻ nội dung (Cards)**: Sử dụng hiệu ứng phẳng tinh tế (`shadow-sm`) kết hợp viền mờ 1px bao quanh (`ring-1 ring-slate-200`). Không dùng đổ bóng đậm (drop shadow lớn) nhằm duy trì giao diện phẳng hiện đại.
- **Phân tách tầng thông tin**: Khối mã đã áp dụng (`coupon-pill`) chìm nhẹ trong bảng tổng kết nhờ màu nền xanh ngọc (`bg-emerald-50`) tạo cảm giác ưu đãi đã được khóa chặt vào đơn hàng.

---

# Shapes

- **Góc bo thẻ lớn**: `16px` (`rounded-2xl`) cho toàn bộ thẻ chứa `CheckoutSummary` và các section đơn hàng.
- **Góc bo nút bấm & ô nhập**: `12px` (`rounded-xl` - tương đương `src/components/ui/button.tsx`) đồng bộ xuyên suốt từ ô input đến nút "Áp dụng".
- **Góc bo huy hiệu (Badge)**: `rounded-full` cho các nhãn trạng thái và biểu tượng số lượng sản phẩm.

---

# Components (Delta cho tính năng Coupon)

### 1. Khối nhập mã giảm giá (`CouponInputField`)
- **Giải phẫu (Anatomy)**: Gồm ô input và nút "Áp dụng" nằm cùng một hàng ngang (`flex gap-2`).
- **Ô Input**:
  - Chiều cao: `40px` (`h-10`).
  - Nền: `bg-slate-50`, focus chuyển `bg-white`.
  - Viền: `ring-1 ring-inset ring-slate-300`, focus chuyển `ring-2 ring-indigo-600`.
  - Placeholder: `"Nhập mã ưu đãi"` (viết thường, màu `text-slate-400`).
  - Giá trị nhập: Tự động viết hoa (`uppercase font-semibold tracking-wider text-slate-800`).
- **Nút "Áp dụng"**:
  - Component: `<Button variant="secondary" size="md">`.
  - Kích thước: `h-10 px-4 text-sm font-semibold`.
  - Trạng thái vô hiệu hóa: Mờ 50% (`disabled:opacity-50`) khi ô input rỗng hoặc đang trong quá trình kiểm tra.

### 2. Thẻ hiển thị mã đã áp dụng (`AppliedCouponPill`)
- **Giải phẫu**: Thanh thông tin bo góc `rounded-xl`, nền `bg-emerald-50`, viền `ring-1 ring-emerald-200`, đệm `px-3 py-2.5`.
- **Nội dung trái**: Icon `Tag` (Lucide, size 16, màu emerald-700), mã coupon in hoa đậm `font-bold text-emerald-800 text-sm`, kèm tag nhỏ `Đã áp dụng`.
- **Nút gỡ mã bên phải**: Nút icon `X` dạng ghost (`hover:bg-emerald-100 rounded-lg p-1 text-emerald-700 hover:text-rose-600 transition-colors`), có `aria-label="Gỡ mã giảm giá"`.

### 3. Dòng chiết khấu trong bảng tổng kết (`SummaryDiscountRow`)
- **Vị trí**: Nằm giữa dòng "Tạm tính" và "Phí giao hàng".
- **Hiển thị**:
  - Nhãn trái: `"Giảm giá (MÃ_COUPON)"` màu `text-emerald-700 font-medium`.
  - Giá trị phải: `"-50.000₫"` màu `text-emerald-600 font-semibold`.

### 4. Thông báo lỗi mã coupon (`CouponErrorMessage`)
- **Vị trí**: Hiển thị ngay dưới ô input mã.
- **Phong cách**: Chữ nhỏ `text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1`.
- **Biểu tượng**: Icon `AlertCircle` (Lucide, size 14, màu rose-600).

---

# Do's and Don'ts

### DO's (Nên làm)
- **DO**: Luôn tự động chuyển mã người dùng gõ thành chữ in hoa và loại bỏ khoảng trắng thừa để tránh lỗi vụn vặt.
- **DO**: Giữ nguyên toàn bộ thông tin form thanh toán (họ tên, điện thoại, địa chỉ) khi việc áp mã gặp lỗi.
- **DO**: Sử dụng màu xanh ngọc (`emerald`) cho các tín hiệu tiết kiệm tiền để tạo cảm giác thưởng cho khách hàng.
- **DO**: Hiển thị rõ số tiền cần mua thêm khi chưa đủ điều kiện (ví dụ: *"Cần mua thêm 50.000₫"*).

### DON'Ts (Không được làm)
- **DON'T**: Không hiển thị số tiền âm trong bảng tổng kết (số tiền giảm tối đa chỉ bằng tạm tính).
- **DON'T**: Không dùng alert pop-up trình duyệt để báo lỗi coupon; toàn bộ thông báo phải hiển thị inline mượt mà trên form.
- **DON'T**: Không gộp dòng giảm giá vào phí ship hoặc tạm tính; bắt buộc phải tách riêng thành dòng chiết khấu độc lập.
- **DON'T**: Không tự ý đổi độ bo góc (`rounded-xl` / `rounded-2xl`) hoặc font chữ ngoài hệ thống hiện tại của ShopLite.
