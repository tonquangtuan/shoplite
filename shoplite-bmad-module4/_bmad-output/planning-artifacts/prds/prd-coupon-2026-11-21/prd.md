---
title: "PRD: Tính Năng Mã Giảm Giá (Coupon) — ShopLite"
status: draft
created: 2026-11-21
updated: 2026-11-21
---

# PRD: Tính Năng Mã Giảm Giá (Coupon) — ShopLite

## 0. Document Purpose

Tài liệu Đặc tả Yêu cầu Sản phẩm (PRD) này định nghĩa chi tiết phạm vi tính năng, luồng trải nghiệm người dùng, các yêu cầu chức năng (FR) và phi chức năng (NFR) cho tính năng **Mã Giảm Giá (Coupon)** trên hệ thống thương mại điện tử **ShopLite**. 

Tài liệu được xây dựng phục vụ Product Manager, System Architect, Software Engineer và QA Engineer. Tài liệu kế thừa trực tiếp từ [brief.md](file:///C:/ai-sdlc/shoplite-bmad-module4/_bmad-output/planning-artifacts/briefs/brief-coupon-2026-11-21/brief.md) và biên bản phản biện đa vai trò [phan-bien.md](file:///C:/ai-sdlc/shoplite-bmad-module4/_bmad-output/brainstorming/brainstorm-coupon-2026-11-21/phan-bien.md), đồng thời tuân thủ nghiêm ngặt các quy ước kiến trúc hiện có trong [AGENTS.md](file:///C:/ai-sdlc/shoplite-bmad-module4/AGENTS.md).

---

## 1. Vision

ShopLite là cửa hàng công nghệ mini đang vận hành hiệu quả trên nền tảng Next.js 16 (App Router), cung cấp trải nghiệm mua sắm nhanh chóng và mượt mà. Tuy nhiên, luồng thanh toán hiện tại thiếu vắng đòn bẩy khuyến mãi, khiến tỷ lệ chuyển đổi phụ thuộc đơn điệu vào một chính sách miễn phí vận chuyển duy nhất và không tạo được cảm giác "chiến thắng" cho khách hàng khi mua sắm các đơn hàng giá trị cao.

Tính năng **Mã Giảm Giá (Coupon)** bổ sung năng lực khuyến mãi linh hoạt trực tiếp tại trang thanh toán (`/checkout`), hỗ trợ cả mã giảm theo số tiền cố định và mã giảm theo phần trăm có khống chế trần tối đa. Tính năng này trao quyền cho đội ngũ kinh doanh tạo ra các chiến dịch kích cầu có định hướng, thúc đẩy khách hàng nâng cao giá trị giỏ hàng để đạt ngưỡng ưu đãi.

Giải pháp được thiết kế theo tôn chỉ **"Zero-External Infrastructure"**: hoạt động 100% trên nền tảng code và lưu trữ JSON cục bộ sẵn có của ShopLite, không phát sinh chi phí SaaS, không thêm external database, đồng thời thực thi nguyên tắc bảo mật phòng vệ (Server-Side Determinism) để bảo vệ tuyệt đối biên lợi nhuận và sự toàn vẹn của dữ liệu đơn hàng.

---

## 2. Target User

### 2.1 Jobs To Be Done (JTBD)
- **Functional (Chức năng)**: Khi thanh toán đơn hàng đồ công nghệ, tôi muốn nhập mã giảm giá hợp lệ để được trừ tiền trực tiếp vào tổng thanh toán một cách minh bạch và nhanh chóng.
- **Emotional (Cảm xúc)**: Tôi muốn cảm thấy mình mua được món đồ với giá hời, được tưởng thưởng xứng đáng khi mua đơn hàng giá trị cao, và yên tâm rằng số tiền hiển thị trên màn hình là con số chính xác cuối cùng.
- **Contextual (Ngữ cảnh)**: Tôi đang thao tác trên thiết bị di động hoặc máy tính tại trang `/checkout`, không muốn phải chuyển qua lại các trang khác để tìm mã và không muốn gặp lỗi gõ phím ngớ ngẩn (như viết hoa/thường hoặc thừa dấu cách).

### 2.2 Non-Users (v1)
- **Người dùng tìm kiếm mã tích hợp tự động qua ví điện tử / thẻ ngân hàng liên kết**: Phiên bản v1 chỉ hỗ trợ mã ký tự nhập tay; không tích hợp cổng thanh toán bên thứ ba (ShopLite hiện chỉ có COD và Chuyển khoản ngân hàng).
- **Quản trị viên cần CMS/Dashboard tạo mã trực quan**: Phiên bản v1 dành cho nhà phát triển cấu hình trực tiếp qua file danh mục mã mã nguồn tĩnh `src/data/coupons.ts`.

### 2.3 Key User Journeys (UJ)

#### UJ-1. Khách hàng áp mã hợp lệ và hoàn tất đặt hàng
- **Persona & Context**: Minh, một kỹ sư IT đang mua 1 tai nghe Bluetooth và 1 củ sạc nhanh với tổng tiền hàng là 650.000₫. Minh có mã `GIAM50K`.
- **Entry state**: Minh đã thêm hàng vào giỏ và đang ở bước điền thông tin thanh toán tại `/checkout`.
- **Path**:
  1. Minh cuộn xuống phần tóm tắt đơn hàng, thấy ô *"Mã giảm giá"* với placeholder *"Nhập mã ưu đãi"*.
  2. Minh gõ `giam50k ` (chữ thường kèm dấu cách thừa ở cuối do bàn phím di động tự điền).
  3. Minh bấm nút *"Áp dụng"*.
  4. Hệ thống lập tức chuẩn hóa chuỗi, xác thực điều kiện (đơn $\ge$ 500k), tính toán và hiển thị dòng: *"Giảm giá (GIAM50K): -50.000₫"* màu xanh lá, tổng tiền cập nhật từ 650.000₫ xuống 600.000₫ (phí giao hàng vẫn là 0₫ vì đơn gốc $\ge$ 500k).
  5. Cạnh ô mã xuất hiện nút *"Gỡ mã"* (biểu tượng x).
  6. Minh điền thông tin người nhận và bấm *"Đặt hàng"*.
- **Climax**: Màn hình chuyển hướng về `/orders/[id]?placed=1`. Trang chi tiết đơn hàng hiển thị đầy đủ thông tin đơn hàng, bao gồm dòng snapshot: *"Mã giảm giá: GIAM50K (-50.000₫)"*.
- **Resolution**: Minh hài lòng vì tiết kiệm được 50k, đơn hàng được lưu an toàn vào `storage/orders.json`.

#### UJ-2. Khách hàng nhập mã không đủ điều kiện tối thiểu hoặc đã hết hạn
- **Persona & Context**: Lan mua 1 ốp lưng điện thoại giá 250.000₫, thử nhập mã `SHOPLITE10` (yêu cầu đơn từ 300.000₫).
- **Entry state**: Lan đang ở trang `/checkout`.
- **Path**:
  1. Lan nhập `SHOPLITE10` và bấm *"Áp dụng"*.
  2. Hệ thống kiểm tra thấy `subtotal` (250.000₫) < `minOrderValue` (300.000₫).
  3. Form thanh toán giữ nguyên giá trị, không giảm trừ tiền.
  4. Xuất hiện thông báo lỗi màu đỏ ngay dưới ô nhập: *"Đơn hàng chưa đạt giá trị tối thiểu 300.000₫ (cần mua thêm 50.000₫)"*.
- **Climax**: Lan nhận biết rõ ràng lý do mã không hợp lệ và số tiền cụ thể cần mua thêm thay vì nhận thông báo lỗi chung chung.
- **Resolution**: Lan bấm quay lại giỏ hàng `/cart` để chọn thêm 1 món phụ kiện, hoặc tiếp tục thanh toán với đơn giá hiện tại.

#### UJ-3. Khách hàng chủ động gỡ mã giảm giá
- **Persona & Context**: Hoàng đã áp dụng mã `GIAM50K` cho đơn hàng 550.000₫ nhưng muốn đổi ý không dùng mã này.
- **Entry state**: Mã `GIAM50K` đang ở trạng thái áp dụng thành công trên trang `/checkout`.
- **Path**:
  1. Hoàng bấm nút *"Gỡ mã"* cạnh ô coupon.
  2. Hệ thống xóa mã đang áp dụng, chuyển số tiền giảm về 0₫.
  3. Bảng tổng kết đơn hàng tính lại tổng tiền về nguyên bản 550.000₫ tức thì.
- **Climax**: Trạng thái đơn hàng trở lại nguyên trạng không có mã giảm giá mà không cần người dùng phải tải lại trang (F5).
- **Resolution**: Hoàng có thể nhập một mã khác hoặc tiến hành đặt hàng bình thường.

#### UJ-4. Khách hàng hủy đơn hàng "Chờ xác nhận" có chứa mã giảm giá (Hành vi hiện có + Mới)
- **Persona & Context**: Nam vừa đặt một đơn hàng có áp mã `SHOPLITE10`, đơn đang ở trạng thái `pending` ("Chờ xác nhận").
- **Entry state**: Nam truy cập trang chi tiết đơn hàng `/orders/[id]`.
- **Path**:
  1. Nam bấm nút *"Hủy đơn hàng"*.
  2. Hệ thống kiểm tra `order.status === "pending"` -> cho phép hủy đơn.
  3. Trạng thái đơn chuyển sang `"cancelled"`, cập nhật thời gian `updatedAt`.
- **Climax**: Đơn hàng hiển thị badge đỏ *"Đã hủy"*. Thông tin coupon (`couponCode` và `discountAmount`) cùng tổng tiền thực trả vẫn được lưu vết nguyên vẹn trong đơn hàng, không bị xóa.
- **Resolution**: Nam xác nhận đơn đã hủy; dữ liệu lịch sử đối soát của cửa hàng được bảo toàn trọn vẹn.

---

## 3. Glossary

Các thuật ngữ nghiệp vụ chuẩn mực được sử dụng thống nhất trong toàn bộ tài liệu và mã nguồn:

- **Coupon (Mã giảm giá)**: Mã định danh dạng chuỗi ký tự quy định quyền được giảm trừ tiền hàng khi thỏa mãn các điều kiện đặt ra.
- **Fixed Coupon (Mã tiền cố định)**: Loại mã giảm một số tiền cụ thể (VNĐ) trực tiếp vào tạm tính của đơn hàng (ví dụ: giảm 50.000₫).
- **Percentage Coupon (Mã phần trăm)**: Loại mã giảm theo tỷ lệ phần trăm (1% – 100%) trên tạm tính của đơn hàng.
- **Max Discount Amount (Mức giảm tối đa / Trần giảm giá)**: Số tiền tối đa được phép giảm đối với mã phần trăm, nhằm khống chế ngân sách khuyến mãi trên các đơn hàng giá trị lớn.
- **Min Order Value (Giá trị đơn hàng tối thiểu)**: Ngưỡng tạm tính (`subtotal`) tối thiểu của đơn hàng để mã có hiệu lực kích hoạt.
- **Subtotal (Tạm tính)**: Tổng giá trị tiền hàng của các sản phẩm trong giỏ/đơn hàng, tính bằng $\sum (\text{unitPrice} \times \text{quantity})$, chưa bao gồm phí vận chuyển và chưa trừ giảm giá.
- **Discount Amount (Số tiền giảm giá)**: Số tiền thực tế được khấu trừ từ coupon vào tạm tính của đơn hàng.
- **Shipping Fee (Phí vận chuyển)**: Cước phí giao hàng tính theo phương thức giao hàng (`standard`: 30.000₫, `express`: 60.000₫), được miễn phí cho `standard` khi `subtotal` $\ge$ 500.000₫.
- **Total (Tổng thanh toán)**: Số tiền cuối cùng khách hàng phải trả, tính bằng $\text{subtotal} - \text{discountAmount} + \text{shippingFee}$.
- **Order Snapshot**: Bản ghi bất biến lưu lại toàn bộ trạng thái sản phẩm, giá bán, phí ship và coupon tại thời điểm đặt hàng vào file `storage/orders.json`.

---

## 4. Features & Requirements

Phần này phân tách rành mạch giữa **Hành vi MỚI** và **Hành vi HIỆN CÓ PHẢI GIỮ NGUYÊN** theo kiến trúc ShopLite.

---

### 4.1 Quản Lý Danh Mục Mã Giảm Giá Phía Server (MỚI)

**Description**: Định nghĩa cấu trúc dữ liệu và danh mục mã tĩnh tại `src/data/coupons.ts` để phục vụ tra cứu và kiểm thực phía server.

#### FR-1: Cấu trúc dữ liệu và Danh mục mã tĩnh
Hệ thống cung cấp danh mục mã coupon tĩnh tại `src/data/coupons.ts` với đầy đủ các thuộc tính quy định loại giảm giá và điều kiện áp dụng.

**Consequences (testable):**
- Mã coupon hỗ trợ 2 trường hợp: `type: "fixed"` (bắt buộc có `value > 0`) và `type: "percentage"` (bắt buộc có `value` từ 1 đến 100 kèm `maxDiscountAmount > 0`).
- Điều kiện tùy chọn gồm `minOrderValue` (số nguyên dương) và `expiryDate` (chuỗi ngày `YYYY-MM-DD`).
- Seed sẵn 3 mã tiêu chuẩn phục vụ kiểm thử:
  - `SHOPLITE10`: giảm 10%, tối đa 100.000₫, đơn tối thiểu 300.000₫, không hết hạn.
  - `GIAM50K`: giảm 50.000₫, đơn tối thiểu 500.000₫, không hết hạn.
  - `TET2026`: giảm 15%, tối đa 200.000₫, hết hạn ngày 28/02/2026.

**Out of Scope:**
- Lưu trữ danh mục coupon trong cơ sở dữ liệu động hoặc cho phép chỉnh sửa qua API/Admin UI.

---

### 4.2 Tương Tác Áp Dụng Mã Trên Giao Diện Thanh Toán (MỚI)

**Description**: Cung cấp thành phần UI tại trang `/checkout` cho phép khách hàng nhập mã, kích hoạt ưu đãi, xem chi tiết giảm giá và gỡ mã linh hoạt. Realizes UJ-1, UJ-2, UJ-3.

#### FR-2: Ô nhập mã và Nút Áp dụng / Gỡ mã tại Checkout
Khách hàng tại trang `/checkout` có thể nhập mã giảm giá vào ô input và nhấn *"Áp dụng"*, hoặc bấm *"Gỡ mã"* để hủy bỏ.

**Consequences (testable):**
- Hệ thống tự động chuyển chuỗi nhập thành chữ hoa và cắt khoảng trắng thừa hai đầu (`input.trim().toUpperCase()`) trước khi đối soát.
- Khi mã hợp lệ: hiển thị tên mã kèm badge xanh, dòng giảm giá `-[Số tiền]₫` trong bảng tổng kết, và xuất hiện nút gỡ mã `(x)`.
- Khi gỡ mã: giá trị giảm giá trở về `0₫`, tổng thanh toán phục hồi về mức ban đầu tức thì.
- Khi mã không hợp lệ: hiển thị thông báo lỗi chi tiết bằng tiếng Việt ngay dưới ô input mà không làm xóa dữ liệu khách hàng đã điền:
  - Mã không tồn tại: *"Mã giảm giá không hợp lệ"*.
  - Mã hết hạn: *"Mã giảm giá đã hết hạn"*.
  - Chưa đủ đơn tối thiểu: *"Đơn hàng chưa đạt giá trị tối thiểu [X]₫ (cần mua thêm [Y]₫)"*.

---

### 4.3 Quy Tắc Tính Toán Giá & Bất Biến Kế Toán (MỚI KẾT HỢP GIỮ NGUYÊN)

**Description**: Nâng cấp module tính tiền `src/features/checkout/pricing.ts` để tích hợp giảm giá coupon nhưng bảo toàn 100% các bất biến tài chính của ShopLite. Realizes UJ-1.

#### FR-3: Tính toán số tiền giảm và Tổng thanh toán (MỚI)
Mở rộng hàm tính toán tài chính để xác định số tiền giảm trừ hợp lệ từ coupon.

**Consequences (testable):**
- Đối với mã cố định: $\text{discountAmount} = \min(\text{coupon.value}, \text{subtotal})$.
- Đối với mã phần trăm: $\text{discountAmount} = \min(\lfloor \text{subtotal} \times \frac{\text{value}}{100} \rfloor, \text{maxDiscountAmount}, \text{subtotal})$.
- Tổng tiền thanh toán cuối cùng: $\text{total} = \text{subtotal} - \text{discountAmount} + \text{shippingFee}$.
- Số tiền giảm tối đa chỉ bằng `subtotal`; giá trị $\text{subtotal} - \text{discountAmount}$ luôn $\ge 0$. Tổng thanh toán không bao giờ âm.

#### FR-4: Bảo vệ Phí vận chuyển và Ngưỡng Free Shipping (HIỆN CÓ PHẢI GIỮ NGUYÊN)
Hệ thống bắt buộc giữ nguyên quy tắc tính phí giao hàng hiện hành của ShopLite đã quy định trong `AGENTS.md`.

**Consequences (testable):**
- Giảm giá coupon CHỈ áp dụng lên tạm tính (`subtotal`), tuyệt đối không được trừ vào phí vận chuyển (`shippingFee`).
- Ngưỡng miễn phí giao hàng (`FREE_SHIPPING_THRESHOLD = 500_000` đối với phương thức `standard`) được xét trên `subtotal` **trước khi trừ giảm giá coupon**.
  *(Ví dụ: Đơn hàng có `subtotal = 520.000₫`, áp mã giảm 50.000₫ -> tạm tính sau giảm là 470.000₫ nhưng phí ship tiêu chuẩn vẫn là 0₫; tổng trả là 470.000₫).*
- Phương thức `express` luôn có phí cố định 60.000₫, không được miễn phí dù đơn hàng có giá trị bao nhiêu.

---

### 4.4 Xác Thực Phía Server & Lưu Trữ Đơn Hàng (MỚI KẾT HỢP GIỮ NGUYÊN)

**Description**: Nâng cấp API `POST /api/orders` và `OrderService` để chống gian lận và ghi vết đơn hàng an toàn. Realizes UJ-1, UJ-4.

#### FR-5: Xác thực và Tính toán lại tại Server (MỚI)
Server tại `order-service.ts` độc lập xác thực và tính toán lại toàn bộ đơn giá và giảm giá; tuyệt đối không tin tưởng bất kỳ số tiền nào client gửi lên.

**Consequences (testable):**
- Mở rộng schema `placeOrderSchema` tại `checkout-schema.ts` chấp nhận trường tùy chọn: `couponCode: z.string().trim().optional()`.
- Client chỉ gửi chuỗi `couponCode`; nếu client gửi kèm `discountAmount` hay `total`, server bỏ qua và tự tính lại từ `src/data/products.ts` và `src/data/coupons.ts`.
- Nếu mã gửi lên không tồn tại, hết hạn, hoặc đơn không đạt giá trị tối thiểu, server ném `OrderError` tương ứng (`COUPON_NOT_FOUND`, `COUPON_EXPIRED`, `COUPON_MIN_ORDER_NOT_MET`) với mã HTTP phù hợp (400 hoặc 422).
- Thời điểm hết hạn được tính chính xác đến 23:59:59 của ngày hết hạn theo giờ Việt Nam (UTC+7).

#### FR-6: Snapshot Coupon vào Đơn Hàng (MỚI)
Mở rộng cấu trúc đối tượng `Order` trong `src/features/orders/types.ts` để lưu vết khuyến mãi.

**Consequences (testable):**
- Schema `Order` bổ sung hai trường tùy chọn: `couponCode?: string` và `discountAmount?: number`.
- Khi tạo đơn hàng thành công, hai trường này được ghi vĩnh viễn vào file `storage/orders.json`.
- Trang chi tiết đơn hàng `/orders/[id]` hiển thị rõ dòng thông tin mã đã dùng và số tiền giảm giá lấy từ snapshot này.

#### FR-7: Chính sách Hủy Đơn Hàng (HIỆN CÓ PHẢI GIỮ NGUYÊN)
Duy trì nguyên vẹn quy tắc chuyển đổi trạng thái đơn hàng của ShopLite đã nêu trong `AGENTS.md`.

**Consequences (testable):**
- Khách hàng chỉ được phép hủy đơn hàng khi `order.status === "pending"`.
- Nếu đơn hàng ở trạng thái khác (`confirmed`, `shipping`, `delivered`, `cancelled`), hàm `cancelOrder()` bắt buộc ném lỗi `OrderError("INVALID_STATUS_TRANSITION")` (HTTP 409).
- Hủy đơn không xóa bỏ đơn hàng, chỉ cập nhật `status: "cancelled"` và thời gian `updatedAt`; thông tin `couponCode` và `discountAmount` vẫn được lưu nguyên vẹn để phục vụ báo cáo đối soát.

#### FR-8: Giới hạn Giỏ Hàng & Tồn Kho (HIỆN CÓ PHẢI GIỮ NGUYÊN)
Duy trì nguyên vẹn các ràng buộc số lượng giỏ hàng của ShopLite.

**Consequences (testable):**
- Mỗi mặt hàng trong giỏ/đơn tối đa 10 sản phẩm (`MAX_QUANTITY_PER_ITEM = 10`) và không vượt quá tồn kho `product.stock`.
- Sản phẩm hết hàng (`stock === 0`) tuyệt đối không cho phép thêm vào giỏ hoặc đặt hàng.

---

## 5. Non-Goals (Explicit)

Để bảo vệ sự tinh gọn của hệ thống ShopLite và đảm bảo khả năng bàn giao đúng hạn:

- **Không xây dựng trang quản trị Admin**: Không tạo UI tạo/sửa/xóa mã giảm giá; toàn bộ mã được quản lý trong file code tĩnh `src/data/coupons.ts`.
- **Không giới hạn số lượt sử dụng toàn hệ thống**: Không xây dựng bộ đếm số lượt dùng mã (do kiến trúc file JSON không hỗ trợ khóa giao dịch đồng thời an toàn).
- **Không gắn mã theo tài khoản người dùng**: Không hỗ trợ mã riêng cho từng khách hàng vì ShopLite chưa có hệ thống đăng nhập tài khoản (Authentication).
- **Không hỗ trợ gộp nhiều mã (No Stacking)**: Mỗi đơn hàng chỉ được phép áp dụng tối đa duy nhất 1 mã giảm giá.
- **Không hỗ trợ mã giảm giá cho phí vận chuyển**: Chỉ hỗ trợ giảm giá trên tiền hàng (`subtotal`); miễn phí vận chuyển vẫn do chính sách Freeship 500k đảm nhiệm.

---

## 6. MVP Scope

### 6.1 In Scope
- Danh mục mã tĩnh `src/data/coupons.ts` với 3 mã mẫu (`SHOPLITE10`, `GIAM50K`, `TET2026`).
- Ô nhập mã, áp dụng và gỡ mã tại trang `/checkout`.
- Phản hồi tính toán tiền giảm tức thì trên UI Checkout.
- Tự động chuẩn hóa mã (case-insensitive, auto-trim).
- Mở rộng hàm tính toán tại `pricing.ts` bảo đảm các bất biến tài chính.
- Mở rộng schema `placeOrderSchema` tại `checkout-schema.ts`.
- Logic xác thực coupon và tính toán lại độc lập tại `order-service.ts`.
- Lưu snapshot `couponCode` và `discountAmount` vào `storage/orders.json`.
- Hiển thị thông tin giảm giá trên trang chi tiết đơn hàng `/orders/[id]`.
- Toàn bộ thông báo lỗi hiển thị bằng tiếng Việt chuẩn hóa qua `OrderError`.

### 6.2 Out of Scope for MVP
- Khay gợi ý mã công khai 1-chạm (Public coupon tray) — *Dời sang Sprint tiếp theo*.
- Thanh tiến trình kích cầu "Mua thêm X đ để mở khóa mã" — *Dời sang Sprint tiếp theo*.
- Tự động lưu mã vào `sessionStorage` khi chuyển trang — *Dời sang Sprint tiếp theo*.
- Tự động gỡ mã khi sửa giỏ hàng làm tụt dưới giá trị tối thiểu — *Dời sang Sprint tiếp theo*.
- Tự động đề xuất mã có lợi nhất (Best coupon auto-apply) — *Dời sang Giai đoạn sau*.
- Đồng hồ đếm ngược FOMO cho mã sắp hết hạn — *Dời sang Giai đoạn sau*.

---

## 7. Success Metrics

Mỗi chỉ số thành công liên kết trực tiếp với các yêu cầu chức năng (FR) tương ứng:

### Primary Metrics
- **SM-1 (Tỷ lệ áp dụng coupon)**: Tỷ lệ đơn hàng hoàn tất có sử dụng mã giảm giá đạt từ **25% đến 35%** trong các đợt chạy chiến dịch khuyến mãi. (Validates FR-1, FR-2, FR-5).
- **SM-2 (Kích thích giá trị đơn hàng)**: Giá trị đơn hàng trung bình (AOV) của các đơn hàng có sử dụng mã cao hơn ít nhất **15%** so với các đơn hàng không sử dụng mã trong cùng kỳ. (Validates FR-1, FR-3, FR-4).

### Secondary Metrics
- **SM-3 (Độ tin cậy tính toán)**: Tỷ lệ lỗi tính sai tiền hoặc sai lệch kế toán đối soát đạt **0.0%**. (Validates FR-3, FR-4, FR-5).
- **SM-4 (Chất lượng kỹ thuật)**: Lệnh `npm run check` vượt qua **100%** (bao gồm toàn bộ unit test mới cho logic coupon và regression test của giỏ hàng/đơn hàng). (Validates FR-3, FR-4, FR-5, FR-7).

### Counter-metrics (Chỉ số kiểm soát — Không đánh đổi)
- **SM-C1 (Bảo vệ biên lợi nhuận ròng)**: Biên lợi nhuận gộp trung bình của cửa hàng sau khi trừ số tiền giảm giá coupon và bù lỗ phí ship không được sụt giảm quá **5%** so với giai đoạn trước khi triển khai tính năng. Ngăn chặn tình trạng "bán lỗ để lấy doanh số". (Counterbalances SM-1, SM-2).

---

## 8. Open Questions

1. **[OQ-1]**: *Cách xử lý trải nghiệm khi mã hết hạn đúng lúc bấm "Đặt hàng"?* 
   - Đã chốt hướng giải quyết: Server trả lỗi `COUPON_EXPIRED`, UI giữ nguyên 100% dữ liệu form khách hàng đã nhập, chỉ đánh dấu lỗi đỏ ở ô mã và mời gỡ mã.
2. **[OQ-2]**: *Xử lý múi giờ hết hạn thế nào để không phụ thuộc cấu hình server?*
   - Cần quy định trong Architecture: Hàm so sánh ngày phải parse chuỗi ngày hết hạn thành mốc `23:59:59.999` với offset cố định `+07:00` (Giờ Việt Nam) thay vì lấy theo múi giờ local của máy chạy test.

---

## 9. Assumptions Index

Các giả định ngầm được đưa vào thiết kế tài liệu để đội ngũ tiếp tục theo dõi:

- `[ASSUMPTION: Đo lường qua JSON]`: Do ShopLite chưa có hệ thống Analytics bên ngoài, việc đo lường các chỉ số SM-1 và SM-2 sẽ được thực hiện bằng script trích xuất dữ liệu trực tiếp từ `storage/orders.json`.
- `[ASSUMPTION: Khách hàng chấp nhận nhập tay]`: Trong bản MVP, việc chưa có khay gợi ý mã 1-chạm được chấp nhận vì các mã khuyến mãi sẽ được truyền thông qua banner trang chủ hoặc chiến dịch marketing bên ngoài.
- `[ASSUMPTION: Không có gian lận quy mô lớn]`: Chấp nhận không giới hạn số lượt dùng mỗi mã vì ShopLite hiện tại là mô hình cửa hàng đồ công nghệ mini phục vụ bài học thực hành, lưu lượng truy cập ở mức vừa phải.
