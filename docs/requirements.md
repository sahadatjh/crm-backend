# CRM/ERP System - Functional Requirements Specification

## 1. Authentication & Access Control
- **User Registration & Login:** 
  - Standard email/password registration and login.
  - OAuth2 Social Login: "Continue with Google".
  - Password reset via secure email token.
  - JWT token-based authentication (Access Token & Refresh Token).
  - Session management and multi-device login control.
- **Dynamic RBAC (Role-Based Access Control):**
  - **Super Admin:** Can create, edit, and delete Roles & Permissions dynamically; assign roles to users.
  - **Admin:** Can edit existing roles and assign/reassign permissions to roles and users.
  - Granular CRUD permissions per module (View, Create, Edit, Delete).
- **Client Portal Access:** 
  - Clients have their own dedicated access view to track projects, task statuses, and view/download invoices.

---

## 2. Dashboard Module
- **Metrics & KPIs:** Total Clients, Total Revenue, Active Projects, Pending/Completed Tasks.
- **Analytics & Charts:** Monthly sales performance, team activity timeline.
- **Activity Feeds:** Real-time log of recent client interactions, task status changes, and invoice payments.

---

## 3. Client Management
- **CRUD Operations:** Full client lifecycle (Create, Read, Update, Delete/Archive).
- **Profile & Metadata:** Company Name, Contact Name, Email, Phone, Website, Industry, Address, Custom Tags, Status (Lead, Active, Inactive), and Notes.
- **Communication & Timeline:** Activity logs, notes, and direct communication history attached to the client.

---

## 4. Project Management
- **Project Setup:** Project Name, Description, Client Mapping, Budget, Priority (Low, Medium, High, Urgent).
- **Timeline & Milestones:** Start date, deadline tracking, milestone tracking with status (Pending, In Progress, Completed), and project status transitions (Active, On Hold, Completed).
- **Progress Tracking:** Overall project progress percentage tracker.
- **Team Assignment:** Assign multiple team members to a project.
- **Project Files:** File attachments linked directly to the project.

---

## 5. Task Management
- **Task Lifecycle:** Task creation, description, due date, priority (Low, Medium, High, Critical), and status (To Do, In Progress, Done).
- **Assignee Structure:** **Single Assignee** per task for clear accountability.
- **Interactive Features:**
  - Nested comments thread per task.
  - Subtasks with completion checkboxes.
  - File attachments / uploads.
  - Task tags for categorization (comma separated).
  - Audit/activity log for status and assignment changes.
  - Data structure support for Kanban Board view.

---

## 6. Invoice & Billing
- **Invoice Generation:** Linked to Client and/or Project with custom Invoice Numbering.
- **Line Items & Calculation:** Multiple line items with individual Description, Quantity, Unit Price, and Tax %.
- **Status & Tracking:** Draft, Unpaid, Partially Paid, Paid, Overdue.
- **Interactive Features:** Add optional notes/payment instructions and send payment reminders.
- **Export:** Server-side PDF generation and direct download capability.

---

## 7. Team Management
- **Team Directory:** View and filter team members by department and role (e.g., Managers, Staff).
- **Member Profiles:** Detailed profiles showing contact info, joined date, assigned tasks, and active projects progress.
- **Team Analytics:** Dashboard with team productivity, average score, task completion rates, department performance, and skills assessment radar.
- **Onboarding:** "Add Team Member" capability assigning role, department, start date, and explicit permissions.

---

## 8. Reports & Analytics
- **Sales & Revenue:** Sales report, Revenue analytics.
- **Performance:** Client growth metrics, Task completion rate.
- **Data Export:** Export data functionality for all reports.

---

## 9. Notifications Module
- **In-app Notifications:** Real-time bell notification for task assignments, mentions, status updates, and invoice alerts.
- **Email Notifications:** Automated transactional emails for password resets, client invoices, and urgent alerts.

---

## 10. Settings & System Configuration
- **Profile Settings:** Personal information (Name, Email, Phone, Job Title, Bio, Location, Timezone), profile picture upload, and password management.
- **Company Profile:** Company logo, Basic Info (Name, Legal Name, Industry, Size, Tax ID), Address, and Contact Information (Support/Sales emails).
- **Notifications Preferences:** Granular toggles for Email and In-App notifications (e.g., Task assignments, Invoice payments, Project updates, Sound alerts).
- **Security & Roles:** Manage Roles & Permissions, create custom roles, and view role member counts.
- **Billing & Subscription:** 
  - View Current Plan and usage limits (Team members, Storage, API calls).
  - Manage Payment Methods and Billing Information.
  - View Payment History and download past invoices.
  - Subscription management (Upgrade, Change, Cancel).
- **Integrations:** Third-party app connections.