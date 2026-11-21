<!-- bmad:context -->
<!-- Verified 2026-11-21 against 3e69103. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## ShopLite

Cửa hàng công nghệ mini viết bằng Next.js 16 (App Router), React 19, TypeScript và Tailwind CSS v4. Dữ liệu catalog tĩnh, giỏ hàng lưu client, đơn hàng lưu JSON cục bộ không dùng external database. Tài liệu lập kế hoạch BMad nằm tại `_bmad-output/planning-artifacts/`.

## Policy

- Toàn bộ nhãn form, văn bản UI và thông báo lỗi hiển thị bằng tiếng Việt.
- Server tại `POST /api/orders` luôn tính lại toàn bộ đơn giá và tổng tiền từ `src/data/products.ts`; tuyệt đối không tin giá client gửi lên.
- Giỏ hàng tối đa 10 sản phẩm mỗi loại (`MAX_QUANTITY_PER_ITEM = 10`) và không vượt quá `product.stock`; sản phẩm hết hàng (`stock === 0`) cấm thêm.
- Chỉ cho phép hủy đơn hàng khi `order.status === "pending"`; trạng thái khác ném `OrderError("INVALID_STATUS_TRANSITION")`.
- Cấm import `server.ts` hoặc các module Node (`fs`, `path`) vào Client Component (`'use client'`).
- Cấm đưa business logic, tính toán giá hoặc truy cập dữ liệu trực tiếp trong `src/app/`; `src/app/` chỉ làm routing và nhận request HTTP.
- Không sửa file trong `storage/` bằng tay (được bảo vệ bởi hook).

## Where things are

- Catalog tĩnh: `src/data/products.ts` và danh mục `src/data/categories.ts`.
- Logic giỏ hàng (client): `src/features/cart/` (store dùng key `CART_STORAGE_KEY = "shoplite:cart"`).
- Đặt hàng & lưu trữ JSON: `src/features/orders/` (lưu tại `storage/orders.json`, cấu hình qua biến môi trường `ORDERS_FILE`).
- Quy tắc tính tiền & phí giao hàng: `src/features/checkout/pricing.ts`.
- Validation schemas: `src/features/checkout/checkout-schema.ts`.
- Route handlers API: `src/app/api/orders/` và `src/app/api/products/`.

## Running and verifying

- Trước khi hoàn tất hoặc commit: luôn chạy `npm run check` (tổng hợp lint, typecheck và unit test); phải pass 100%.
- Khi đang phát triển, chỉ chạy test trên file đang sửa để tiết kiệm thời gian: `npx vitest run src/features/<feature>/...`.
- Viết test cho `OrderService`: dùng `createInMemoryOrderRepository(seed)` để cô lập nghiệp vụ, không đụng I/O đĩa (tham khảo `order-service.test.ts`).

## Conventions that differ from defaults

- Feature-based co-location: Logic, types, component và test đặt chung trong `src/features/<feature>/`.
- Đặt tên file kebab-case (`order-service.ts`, `cart-view.tsx`); React component export tên PascalCase.
- Mặc định là Server Component; chỉ khai báo `'use client'` khi có hook (`useState`, `useSyncExternalStore`), event handler hoặc truy cập API browser.
- Validate toàn bộ input qua schema Zod; chuẩn hóa lỗi field trả về qua `toFieldErrors()`.
- Xử lý lỗi API: Service ném `OrderError`; Route Handler bọc qua `handleRouteError(error)` để trả về JSON chuẩn `{ error: { code, message, details? } }`.
- Phí vận chuyển: Tiêu chuẩn 30.000₫ (miễn phí khi `subtotal >= 500.000₫`), giao nhanh 60.000₫ (không miễn phí).

## Known pitfalls

- Môi trường Vitest mặc định là `jsdom`: Các file test có thao tác filesystem (`order-repository.test.ts`) bắt buộc phải có chú thích `// @vitest-environment node` ở đầu file, tạo thư mục tạm bằng `mkdtemp` trong `beforeEach()`, và dọn dẹp sạch bằng `rm(dir, { recursive: true, force: true })` trong `afterEach()`.
- Không tự ý thêm jest matchers: Codebase sử dụng cú pháp matchers chuẩn của Vitest.

<!-- /bmad:context -->
