# Mini Reconciliation Dashboard

Dashboard đối soát đơn hàng TMĐT với file thanh toán từ sàn.

## Requirements

Recommended local versions:

```bash
node -v  # v24.16.0
npm -v   # 11.13.0
```

PostgreSQL cần chạy local hoặc có connection string tương đương.

## Backend

```bash
cd backend
npm install
```

Tạo `backend/.env`:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mini_reconciliation
```

Tạo database nếu chưa có và chạy migration:

```bash
npm run db:migrate
```

Import dữ liệu từ `backend/scripts/data/orders.csv` và `backend/scripts/data/income.csv`:

```bash
npm run db:import
```

Chạy backend:

```bash
npm run dev
```

Chạy unit test backend:

```bash
npm test
```

Backend chạy ở:

```bash
http://localhost:8080
```

API:

```bash
GET /api/kpi
GET /api/reconciliation?page=1&limit=25
```

Reset DB khi cần chạy lại từ đầu:

```bash
npm run db:reset
npm run db:migrate
npm run db:import
```

## Frontend

```bash
cd frontend
npm install
```

Tạo `frontend/.env`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

Chạy frontend:

```bash
npm run dev
```

Chạy unit test frontend:

```bash
npm test
```

Mở:

```bash
http://localhost:3000
```

## AI đã sinh code sai chỗ nào và bạn phát hiện/sửa thế nào

AI ban đầu sinh schema PostgreSQL có `income.order_code` là foreign key sang `orders`, nhưng dữ liệu thực tế có dòng thanh toán orphan không tồn tại trong file orders. Lỗi này lộ ra khi chạy `npm run db:import` và PostgreSQL báo vi phạm FK. Cách sửa là bỏ foreign key cứng, giữ join bằng `order_code`, để dashboard vẫn hiển thị được trạng thái `orphan`.

AI cũng sinh import cho `income` cho phép trùng `order_code`, trong khi yêu cầu sau đó là `order_code` unique và nếu trùng chỉ lấy một dòng. Lỗi được phát hiện từ file income có duplicate `ORD-2026-0003`. Cách sửa là thêm `UNIQUE` cho `income.order_code` và đổi import sang `ON CONFLICT (order_code) DO NOTHING`.
