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
| `GET` | `/clients/:id/communications` | List client communication history | Permission: `clients.read` |
| `POST` | `/clients/:id/communications` | Add new communication log | Permission: `clients.update` |

---

## 5. Project Management (`/api/v1/projects`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/projects` | List projects (Filter by client, status, priority) | Permission: `projects.read` |
| `POST` | `/projects` | Create new project with assigned members | Permission: `projects.create` |
| `GET` | `/projects/:id` | Project details, tasks summary & file links | Permission: `projects.read` |
| `PATCH` | `/projects/:id` | Update project progress, dates, budget or status | Permission: `projects.update` |
| `DELETE`| `/projects/:id` | Soft delete project | Permission: `projects.delete` |
| `GET` | `/projects/:id/milestones` | List project milestones | Permission: `projects.read` |
| `POST` | `/projects/:id/milestones` | Create project milestone | Permission: `projects.update` |
| `PATCH` | `/projects/:id/milestones/:milestoneId` | Update milestone status/details | Permission: `projects.update` |
| `DELETE`| `/projects/:id/milestones/:milestoneId` | Delete project milestone | Permission: `projects.update` |

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
| `POST` | `/tasks/:id/subtasks` | Create a subtask | Permission: `tasks.update` |
| `PATCH` | `/tasks/:id/subtasks/:subtaskId` | Toggle subtask completion | Permission: `tasks.update` |
| `GET` | `/tasks/:id/activities` | List task activity log | Permission: `tasks.read` |

---

## 7. Invoice & Billing (`/api/v1/invoices`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/invoices` | List invoices (Filter by client, status, date) | Permission: `invoices.read` |
| `POST` | `/invoices` | Create invoice with line items (including individual tax) | Permission: `invoices.create` |
| `GET` | `/invoices/:id` | Get invoice breakdown | Permission: `invoices.read` |
| `PATCH` | `/invoices/:id/status` | Update invoice status (e.g., PAID, OVERDUE) | Permission: `invoices.update` |
| `GET` | `/invoices/:id/download` | Download invoice PDF | Permission: `invoices.read` |
| `POST` | `/invoices/:id/reminders` | Send payment reminder email | Permission: `invoices.read` |

---

## 8. Team Management (`/api/v1/team`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/team` | List team members with pagination and filters (role, department) | Permission: `team.read` |
| `POST` | `/team` | Invite/add a new team member | Permission: `team.create` |
| `GET` | `/team/:id` | Get team member profile, tasks, and projects | Permission: `team.read` |
| `GET` | `/team/analytics` | Get team productivity metrics, skills assessment, and top performers | Permission: `team.read` |

---

## 9. Reports & Analytics (`/api/v1/reports`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/reports/sales` | Generate sales report & revenue analytics | Permission: `reports.read` |
| `GET` | `/reports/clients` | Client growth metrics | Permission: `reports.read` |
| `GET` | `/reports/tasks` | Task completion rates | Permission: `reports.read` |
| `GET` | `/reports/export` | Export specified report data (CSV/Excel) | Permission: `reports.export` |

---

## 10. Notifications (`/api/v1/notifications`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/notifications` | List notifications (Filter by unread, mentions) | Logged-in User |
| `PATCH` | `/notifications/:id/read` | Mark a specific notification as read | Logged-in User |
| `POST` | `/notifications/mark-all-read` | Mark all notifications as read | Logged-in User |

---

## 11. Settings & Dashboard (`/api/v1/settings`, `/api/v1/dashboard`)

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/metrics` | Summary cards (Total Clients, Revenue, Tasks) | Permission: `dashboard.read` |
| `GET` | `/dashboard/analytics` | Sales & team activity charts data | Permission: `dashboard.read` |
| `GET` | `/settings` | Fetch system settings (e.g., tax percentage) | Logged-in User |
| `PATCH` | `/settings` | Update system-wide configuration settings | Super Admin |
| `GET` | `/settings/profile` | Get current user's profile settings | Logged-in User |
| `PATCH` | `/settings/profile` | Update profile information & picture | Logged-in User |
| `PATCH` | `/settings/profile/password` | Change user password | Logged-in User |
| `GET` | `/settings/company` | Get company profile details | Logged-in User |
| `PATCH` | `/settings/company` | Update company information | Super Admin |
| `GET` | `/settings/notifications` | Get user notification preferences | Logged-in User |
| `PATCH` | `/settings/notifications` | Update notification preferences | Logged-in User |
| `GET` | `/settings/billing` | Get subscription, usage, and billing info | Super Admin |
| `PATCH` | `/settings/billing/payment-method` | Update default payment method | Super Admin |
| `GET` | `/settings/billing/history` | List payment history / invoices | Super Admin |
| `GET` | `/settings/integrations/api-keys` | List API keys | Super Admin |
| `POST` | `/settings/integrations/api-keys` | Generate new API key | Super Admin |
| `DELETE` | `/settings/integrations/api-keys/:id` | Revoke API key | Super Admin |
| `GET` | `/settings/integrations/webhooks` | List registered webhooks | Super Admin |
| `POST` | `/settings/integrations/webhooks` | Add a new webhook | Super Admin |
| `PATCH` | `/settings/integrations/webhooks/:id` | Update webhook URL/events | Super Admin |
| `DELETE` | `/settings/integrations/webhooks/:id` | Delete webhook | Super Admin |
| `GET` | `/settings/integrations` | List available and connected integrations | Super Admin |
| `POST` | `/settings/integrations/:provider/connect` | Initiate OAuth/connection for a provider | Super Admin |
| `POST` | `/settings/integrations/:provider/disconnect` | Disconnect an integration | Super Admin |