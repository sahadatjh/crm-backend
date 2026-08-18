# CRM/ERP System - API Specification

## 1. Base Configuration
- **Base URL:** `/api/v1`
- **Swagger Documentation URL:** `/api/docs`
- **Default Content-Type:** `application/json`
- **File Upload Content-Type:** `multipart/form-data`
- **Authentication Header:** `Authorization: Bearer <JWT_ACCESS_TOKEN>`

---

## 2. Authentication Module (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new account (Email, Password, Name) | Public |
| `POST` | `/auth/login` | Email & Password login, returns tokens & user profile | Public |
| `POST` | `/auth/google` | Google OAuth verification with ID Token | Public |
| `POST` | `/auth/refresh-tokens` | Get new Access Token via Refresh Token | Public |
| `POST` | `/auth/forgot-password` | Request password reset email | Public |
| `POST` | `/auth/reset-password` | Reset password using verified token | Public |
| `GET` | `/auth/me` | Retrieve currently logged-in user profile & permissions | Bearer Token |

---

## 3. RBAC & Roles Module (`/api/v1/roles`, `/api/v1/permissions`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/roles` | List all roles with attached permissions | Super Admin / Admin |
| `POST` | `/roles` | Create dynamic role | Super Admin |
| `PATCH` | `/roles/:id` | Update role details or permission assignments | Super Admin / Admin |
| `DELETE`| `/roles/:id` | Soft delete role (System roles cannot be deleted) | Super Admin |
| `GET` | `/permissions` | List all available system permissions | Super Admin / Admin |
| `POST` | `/roles/assign-user` | Assign or change role for a specific user | Super Admin / Admin |

---

## 4. Client Management (`/api/v1/clients`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/clients` | List clients with pagination, search & tag filter | Permission: `clients.read` |
| `POST` | `/clients` | Create new client profile | Permission: `clients.create` |
| `GET` | `/clients/:id` | Get detailed client profile & linked projects | Permission: `clients.read` |
| `PATCH` | `/clients/:id` | Update client details | Permission: `clients.update` |
| `DELETE`| `/clients/:id` | Soft delete client record | Permission: `clients.delete` |

---

## 5. Project Management (`/api/v1/projects`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/projects` | List projects (Filter by client, status, priority) | Permission: `projects.read` |
| `POST` | `/projects` | Create new project with assigned members | Permission: `projects.create` |
| `GET` | `/projects/:id` | Project details, tasks summary & file links | Permission: `projects.read` |
| `PATCH` | `/projects/:id` | Update project progress, dates, budget or status | Permission: `projects.update` |
| `DELETE`| `/projects/:id` | Soft delete project | Permission: `projects.delete` |

---

## 6. Task Management (`/api/v1/tasks`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | List tasks (Filter by project, assignee, status) | Permission: `tasks.read` |
| `POST` | `/tasks` | Create task and assign to a single user | Permission: `tasks.create` |
| `GET` | `/tasks/:id` | Task details with comments & attachments | Permission: `tasks.read` |
| `PATCH` | `/tasks/:id` | Update task details / status (Kanban drag-drop) | Permission: `tasks.update` |
| `DELETE`| `/tasks/:id` | Soft delete task | Permission: `tasks.delete` |
| `POST` | `/tasks/:id/comments` | Post comment on a task | Logged-in User |
| `POST` | `/tasks/:id/attachments` | Upload file to Cloudinary & link to task | Logged-in User |

---

## 7. Invoice & Billing (`/api/v1/invoices`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/invoices` | List invoices (Filter by client, status, date) | Permission: `invoices.read` |
| `POST` | `/invoices` | Create invoice with line items & dynamic tax | Permission: `invoices.create` |
| `GET` | `/invoices/:id` | Get invoice breakdown | Permission: `invoices.read` |
| `PATCH` | `/invoices/:id/status` | Update invoice status (e.g., PAID, OVERDUE) | Permission: `invoices.update` |
| `GET` | `/invoices/:id/download` | Download invoice PDF | Permission: `invoices.read` |

---

## 8. Settings & Dashboard (`/api/v1/settings`, `/api/v1/dashboard`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/metrics` | Summary cards (Total Clients, Revenue, Tasks) | Permission: `dashboard.read` |
| `GET` | `/dashboard/analytics` | Sales & team activity charts data | Permission: `dashboard.read` |
| `GET` | `/settings` | Fetch system settings (e.g., tax percentage) | Logged-in User |
| `PATCH` | `/settings` | Update system-wide configuration settings | Super Admin |