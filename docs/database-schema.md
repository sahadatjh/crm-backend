# CRM/ERP System - Database Schema (PostgreSQL + TypeORM)

## Global Table Conventions
- **Primary Key:** `id` (UUID v4, `@PrimaryGeneratedColumn('uuid')`)
- **Audit Timestamps:** `created_at` (`@CreateDateColumn()`), `updated_at` (`@UpdateDateColumn()`)
- **Soft Delete:** `deleted_at` (`@DeleteDateColumn({ nullable: true })`)

---

## 1. Authentication & RBAC

### `users`
- `id`: UUID (PK)
- `email`: VARCHAR(255) (Unique, Not Null)
- `password`: VARCHAR(255) (Nullable for Google OAuth users)
- `first_name`: VARCHAR(100) (Not Null)
- `last_name`: VARCHAR(100)
- `avatar_url`: VARCHAR(500) (Cloudinary URL)
- `google_id`: VARCHAR(255) (Nullable, Unique)
- `is_active`: BOOLEAN (Default: true)
- `role_id`: UUID (FK -> `roles.id`, Nullable)
- Timestamps & Soft Delete

### `roles`
- `id`: UUID (PK)
- `name`: VARCHAR(100) (Unique, e.g., 'Super Admin', 'Admin', 'Client', 'Employee')
- `description`: TEXT
- `is_system`: BOOLEAN (Default: false, true for immutable system roles)
- Timestamps & Soft Delete

### `permissions`
- `id`: UUID (PK)
- `slug`: VARCHAR(100) (Unique, e.g., 'tasks.create', 'invoices.read')
- `module`: VARCHAR(50) (e.g., 'tasks', 'invoices', 'users')
- `description`: VARCHAR(255)
- Timestamps

### `role_permissions` (Pivot)
- `role_id`: UUID (FK -> `roles.id`, PK)
- `permission_id`: UUID (FK -> `permissions.id`, PK)

---

## 2. Client Management

### `clients`
- `id`: UUID (PK)
- `user_id`: UUID (FK -> `users.id`, Nullable - if client portal is activated)
- `company_name`: VARCHAR(255) (Not Null)
- `contact_person`: VARCHAR(150)
- `email`: VARCHAR(255) (Not Null)
- `phone`: VARCHAR(50)
- `address`: TEXT
- `tags`: VARCHAR[] (Array of tags, e.g., ['VIP', 'Enterprise'])
- Timestamps & Soft Delete

---

## 3. Project & Task Management

### `projects`
- `id`: UUID (PK)
- `client_id`: UUID (FK -> `clients.id`, Not Null)
- `title`: VARCHAR(255) (Not Null)
- `description`: TEXT
- `budget`: NUMERIC(12, 2) (Default: 0.00)
- `priority`: ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT') (Default: 'MEDIUM')
- `status`: ENUM ('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED') (Default: 'PLANNING')
- `start_date`: DATE
- `due_date`: DATE
- Timestamps & Soft Delete

### `project_members` (Pivot)
- `project_id`: UUID (FK -> `projects.id`, PK)
- `user_id`: UUID (FK -> `users.id`, PK)

### `tasks`
- `id`: UUID (PK)
- `project_id`: UUID (FK -> `projects.id`, Not Null)
- `assignee_id`: UUID (FK -> `users.id`, Nullable - Single Assignee)
- `title`: VARCHAR(255) (Not Null)
- `description`: TEXT
- `priority`: ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT') (Default: 'MEDIUM')
- `status`: ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE') (Default: 'TODO')
- `due_date`: DATE
- Timestamps & Soft Delete

### `task_comments`
- `id`: UUID (PK)
- `task_id`: UUID (FK -> `tasks.id`, Not Null)
- `user_id`: UUID (FK -> `users.id`, Not Null)
- `content`: TEXT (Not Null)
- Timestamps & Soft Delete

### `attachments` (Generic for Tasks/Projects)
- `id`: UUID (PK)
- `resource_type`: ENUM ('TASK', 'PROJECT') (Not Null)
- `resource_id`: UUID (Not Null)
- `uploaded_by`: UUID (FK -> `users.id`, Not Null)
- `file_url`: VARCHAR(500) (Not Null, Cloudinary Secure URL)
- `public_id`: VARCHAR(255) (Cloudinary Public ID for deletion)
- `file_name`: VARCHAR(255)
- `file_size`: INT (Bytes)
- `mime_type`: VARCHAR(100)
- Timestamps

---

## 4. Invoice & Billing

### `invoices`
- `id`: UUID (PK)
- `invoice_number`: VARCHAR(50) (Unique, Not Null, e.g., 'INV-2026-0001')
- `client_id`: UUID (FK -> `clients.id`, Not Null)
- `project_id`: UUID (FK -> `projects.id`, Nullable)
- `subtotal`: NUMERIC(12, 2) (Not Null)
- `tax_percentage`: NUMERIC(5, 2) (Dynamic from settings at creation, e.g., 7.50)
- `tax_amount`: NUMERIC(12, 2) (Calculated)
- `total_amount`: NUMERIC(12, 2) (Not Null)
- `status`: ENUM ('DRAFT', 'UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE') (Default: 'DRAFT')
- `issue_date`: DATE (Not Null)
- `due_date`: DATE (Not Null)
- `pdf_url`: VARCHAR(500) (Cloudinary URL)
- Timestamps & Soft Delete

### `invoice_items`
- `id`: UUID (PK)
- `invoice_id`: UUID (FK -> `invoices.id`, Cascade Delete)
- `description`: VARCHAR(255) (Not Null)
- `quantity`: INT (Not Null, Default: 1)
- `unit_price`: NUMERIC(12, 2) (Not Null)
- `total`: NUMERIC(12, 2) (Not Null)
- Timestamps

---

## 5. System Settings & Notifications

### `settings`
- `id`: UUID (PK)
- `key`: VARCHAR(100) (Unique, e.g., 'DEFAULT_TAX_PERCENTAGE', 'COMPANY_NAME')
- `value`: TEXT (Not Null)
- `description`: VARCHAR(255)
- Timestamps

### `notifications`
- `id`: UUID (PK)
- `user_id`: UUID (FK -> `users.id`, Not Null)
- `title`: VARCHAR(255) (Not Null)
- `message`: TEXT (Not Null)
- `type`: ENUM ('INFO', 'WARNING', 'SUCCESS', 'ALERT')
- `is_read`: BOOLEAN (Default: false)
- Timestamps