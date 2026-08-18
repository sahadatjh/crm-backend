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
- `phone`: VARCHAR(50)
- `department`: VARCHAR(100)
- `job_title`: VARCHAR(100)
- `bio`: TEXT
- `location`: VARCHAR(255)
- `timezone`: VARCHAR(100)
- `start_date`: DATE
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
- `website`: VARCHAR(255)
- `industry`: VARCHAR(100)
- `address`: TEXT
- `tags`: VARCHAR[] (Array of tags, e.g., ['VIP', 'Enterprise'])
- `status`: ENUM ('LEAD', 'ACTIVE', 'INACTIVE') (Default: 'LEAD')
- `notes`: TEXT
- Timestamps & Soft Delete

### `client_communications`
- `id`: UUID (PK)
- `client_id`: UUID (FK -> `clients.id`, Cascade Delete)
- `type`: ENUM ('EMAIL', 'CALL', 'MEETING', 'OTHER') (Not Null)
- `title`: VARCHAR(255) (Not Null)
- `communication_date`: TIMESTAMP (Not Null)
- `summary`: TEXT
- Timestamps

---

## 3. Project & Task Management

### `projects`
- `id`: UUID (PK)
- `client_id`: UUID (FK -> `clients.id`, Not Null)
- `title`: VARCHAR(255) (Not Null)
- `description`: TEXT
- `budget`: NUMERIC(12, 2) (Default: 0.00)
- `priority`: ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT') (Default: 'MEDIUM')
- `status`: ENUM ('ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED') (Default: 'ACTIVE')
- `progress`: INT (Default: 0)
- `start_date`: DATE
- `due_date`: DATE
- Timestamps & Soft Delete

### `project_milestones`
- `id`: UUID (PK)
- `project_id`: UUID (FK -> `projects.id`, Cascade Delete)
- `title`: VARCHAR(255) (Not Null)
- `due_date`: DATE
- `status`: ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED') (Default: 'PENDING')
- Timestamps

### `project_members` (Pivot)
- `project_id`: UUID (FK -> `projects.id`, PK)
- `user_id`: UUID (FK -> `users.id`, PK)

### `tasks`
- `id`: UUID (PK)
- `project_id`: UUID (FK -> `projects.id`, Not Null)
- `assignee_id`: UUID (FK -> `users.id`, Nullable - Single Assignee)
- `title`: VARCHAR(255) (Not Null)
- `description`: TEXT
- `priority`: ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') (Default: 'MEDIUM')
- `status`: ENUM ('TODO', 'IN_PROGRESS', 'DONE') (Default: 'TODO')
- `due_date`: DATE
- `tags`: VARCHAR[] (Array of tags)
- Timestamps & Soft Delete

### `subtasks`
- `id`: UUID (PK)
- `task_id`: UUID (FK -> `tasks.id`, Cascade Delete)
- `title`: VARCHAR(255) (Not Null)
- `is_completed`: BOOLEAN (Default: false)
- Timestamps

### `task_activities`
- `id`: UUID (PK)
- `task_id`: UUID (FK -> `tasks.id`, Cascade Delete)
- `user_id`: UUID (FK -> `users.id`, Nullable)
- `action_description`: VARCHAR(255) (Not Null)
- Timestamps

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
- `tax_amount`: NUMERIC(12, 2) (Calculated)
- `total_amount`: NUMERIC(12, 2) (Not Null)
- `status`: ENUM ('DRAFT', 'UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE') (Default: 'DRAFT')
- `issue_date`: DATE (Not Null)
- `due_date`: DATE (Not Null)
- `notes`: TEXT
- `pdf_url`: VARCHAR(500) (Cloudinary URL)
- Timestamps & Soft Delete

### `invoice_items`
- `id`: UUID (PK)
- `invoice_id`: UUID (FK -> `invoices.id`, Cascade Delete)
- `description`: VARCHAR(255) (Not Null)
- `quantity`: INT (Not Null, Default: 1)
- `unit_price`: NUMERIC(12, 2) (Not Null)
- `tax_percentage`: NUMERIC(5, 2) (Default: 0.00)
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
- `event_type`: VARCHAR(100) (e.g., 'task_assigned', 'mention', 'invoice_paid', 'task_due_soon')
- `link_id`: UUID (Nullable, ID of the related resource)
- `link_type`: ENUM ('TASK', 'INVOICE', 'PROJECT', 'CLIENT') (Nullable)
- `is_read`: BOOLEAN (Default: false)
- Timestamps

### `user_notification_preferences`
- `id`: UUID (PK)
- `user_id`: UUID (FK -> `users.id`, Unique)
- `email_task_assigned`: BOOLEAN (Default: true)
- `email_task_due`: BOOLEAN (Default: true)
- `email_invoice_paid`: BOOLEAN (Default: true)
- `email_new_comment`: BOOLEAN (Default: true)
- `email_project_update`: BOOLEAN (Default: true)
- `email_new_client`: BOOLEAN (Default: false)
- `in_app_desktop`: BOOLEAN (Default: true)
- `in_app_sound`: BOOLEAN (Default: true)
- Timestamps

### `subscriptions`
- `id`: UUID (PK)
- `plan_name`: VARCHAR(100) (e.g., 'Professional Plan')
- `status`: ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE')
- `billing_cycle`: ENUM ('MONTHLY', 'YEARLY')
- `price`: NUMERIC(10, 2)
- `current_period_start`: TIMESTAMP
- `current_period_end`: TIMESTAMP
- `cancel_at_period_end`: BOOLEAN
- Timestamps

### `billing_information`
- `id`: UUID (PK)
- `billing_name`: VARCHAR(255)
- `billing_email`: VARCHAR(255)
- `address`: TEXT
- `city`: VARCHAR(100)
- `state`: VARCHAR(100)
- `country`: VARCHAR(100)
- `tax_id`: VARCHAR(50)
- Timestamps

### `api_keys`
- `id`: UUID (PK)
- `user_id`: UUID (FK -> `users.id`, Nullable - if organization level)
- `name`: VARCHAR(100) (e.g., 'Zapier Key')
- `key`: VARCHAR(255) (Hashed or encrypted, Not Null)
- `last_used_at`: TIMESTAMP
- `is_active`: BOOLEAN (Default: true)
- Timestamps

### `webhooks`
- `id`: UUID (PK)
- `url`: VARCHAR(500) (Not Null)
- `events`: VARCHAR[] (e.g., `['task.created', 'project.updated']`)
- `secret`: VARCHAR(255) (For payload signature)
- `is_active`: BOOLEAN (Default: true)
- Timestamps

### `integrations`
- `id`: UUID (PK)
- `provider`: VARCHAR(100) (e.g., 'SLACK', 'GOOGLE_CALENDAR', 'GITHUB')
- `status`: ENUM ('CONNECTED', 'DISCONNECTED')
- `access_token`: TEXT (Encrypted)
- `refresh_token`: TEXT (Encrypted)
- `config`: JSONB (Provider-specific settings)
- Timestamps