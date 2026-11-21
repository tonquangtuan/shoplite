# Biên Bản Phản Biện Tính Năng: Mã Giảm Giá (Coupon) — ShopLite

> Ghi nhận từ phiên thảo luận **BMad Party Mode** ngày 2026-11-21 giữa John (PM), Sally (UX), Winston (Architect), Amelia (Dev) và Mary (Analyst).

---

## 1. Top 5 Rủi Ro Kèm Agent Nêu Ra

| # | Rủi ro | Agent nêu ra | Chi tiết phân tích |
| :-: | :--- | :--- | :--- |
| **1** | **Bẫy tâm lý "Lỗ đen Coupon" gây bỏ giỏ hàng** | 🎨 **Sally (UX Designer)** | Đặt một ô nhập mã giảm giá trống trơn ở trang `/checkout` mà không có gợi ý sẽ kích thích khách hàng rời khỏi luồng mua sắm để sang Google tìm mã. Khi không tìm thấy, khách hàng cảm thấy bị mua hớ và sẵn sàng bỏ giỏ hàng, làm phản tác dụng mục tiêu tăng conversion rate. |
| **2** | **"Cắt máu" xói mòn biên lợi nhuận** | 📊 **Mary (Business Analyst)** | Khuyến mãi coupon chồng lấn trực tiếp lên chính sách Free Shipping (cùng mốc 500.000₫). Khách hàng vốn đã có động lực bù thêm hàng để freeship, nay lại được giảm thêm 50k, khiến shop chịu thiệt hại kép trên các đơn hàng mà đáng lẽ khách vẫn sẽ mua. |
| **3** | **Lạm dụng / Spam mã không kiểm soát** | 🏗️ **Winston (System Architect)** | ShopLite không có hệ thống đăng nhập tài khoản (No Auth) và lưu trữ đơn hàng dạng JSON cục bộ (không hỗ trợ lock concurrency). Do đó, một cá nhân có thể liên tục đặt nhiều đơn hàng dùng cùng một mã ưu đãi mà hệ thống không thể ngăn chặn ở tầng dữ liệu. |
| **4** | **Nợ vận hành do Catalog tĩnh (Operational Debt)** | 🏗️ **Winston (System Architect)** | Việc lưu danh mục mã trong `src/data/coupons.ts` giúp hệ thống tinh gọn, nhưng buộc đội ngũ phát triển phải can thiệp mã nguồn, chạy lại test và redeploy toàn bộ website mỗi khi bộ phận Marketing muốn thêm, sửa hoặc vô hiệu hóa một mã giảm giá. |
| **5** | **Regression Test & Bẫy Múi Giờ (Timezone Trap)** | 💻 **Amelia (Senior Dev)** | Sửa đổi logic tính toán trong `src/features/checkout/pricing.ts` rất dễ gây gãy test suite của `OrderService`. Đồng thời, quy định hết hạn lúc 23:59:59 UTC+7 nếu xử lý bằng `new Date()` thuần sẽ gây lệch pha múi giờ giữa máy dev (UTC+7) và môi trường CI/Server (UTC). |

---

## 2. Các Điểm Bất Đồng Chưa Giải Quyết (Unresolved Disagreements)

1. **Trải nghiệm người dùng vs Tối giản Scope (Sally vs John)**:
   - **Sally** kiên quyết yêu cầu đưa *"Khay gợi ý mã 1-chạm"* lên danh sách **Must-Have** để bảo vệ tỷ lệ chốt đơn.
   - **John** kiên định lập trường giữ nguyên phạm vi 5 mục tối giản để kịp tiến độ MVP của bài lab, chấp nhận để ô nhập mã đơn thuần.
2. **Kiểm soát lạm dụng vs Ràng buộc Kiến trúc (Mary & Winston vs Đội ngũ)**:
   - **Mary** và **Winston** cảnh báo nguy cơ bị bòn rút ngân sách khuyến mãi do thiếu cơ chế giới hạn số lượt dùng.
   - Tuy nhiên, kiến trúc ShopLite (không Database, không Auth) chưa có giải pháp kỹ thuật triệt để mà không phá vỡ tính đơn giản của dự án.
3. **Mục tiêu Định lượng vs Thiếu hụt Công cụ Đo lường (John vs Đội ngũ)**:
   - Đặt mục tiêu tăng Conversion Rate và AOV nhưng ShopLite hoàn toàn chưa tích hợp Analytics / Tracking Event để đo lường hiệu quả thực tế sau khi tính năng lên sóng.

---

## 3. Các Quyết Định Đã Chốt Trong Buổi Thảo Luận

1. **Chốt cứng 5 tiêu chí Must-Have theo MoSCoW**:
   - (1) Giao diện Checkout có nhập mã, áp dụng và gỡ mã tức thì;
   - (2) Server tính toán lại 100% từ catalog `coupons.ts`, client chỉ gửi chuỗi `couponCode`;
   - (3) Bất biến giá: tiền giảm tối đa bằng `subtotal` (không âm), không trừ vào phí ship, freeship tính trước giảm giá;
   - (4) Snapshot thông tin `couponCode` và `discountAmount` vào schema `Order` trong `storage/orders.json` và hiển thị lịch sử ở `/orders/[id]`;
   - (5) Chuẩn hóa mã nhập case-insensitive, tự động trim khoảng trắng và thông báo lỗi rõ ràng.
2. **Chấp nhận sự đánh đổi về kiến trúc**:
   - Tiếp tục duy trì danh mục mã tĩnh tại `src/data/coupons.ts` cho MVP nhằm tuân thủ quy tắc không dùng external database của ShopLite.
3. **Bảo vệ toàn vẹn dữ liệu đơn hàng**:
   - Dữ liệu đơn hàng sau khi tạo phải độc lập hoàn toàn với vòng đời của coupon trong catalog — dù mã sau này có hết hạn hay bị xóa, đơn hàng cũ vẫn giữ nguyên giá trị đã thanh toán.
