<h1 align="center">CRM Backend API</h1>

<p align="center">
  A highly modular and scalable Enterprise CRM (Customer Relationship Management) backend built with NestJS, TypeORM, and PostgreSQL.
</p>

## 🚀 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (Node.js + TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (JSON Web Token) with Passport
- **Real-time:** Socket.io (WebSockets)
- **API Documentation:** Swagger OpenAPI
- **Validation:** `class-validator` & `class-transformer`

---

## 🎯 Features & Modules

- **Authentication & Authorization (RBAC)**
  - JWT-based Auth (Access & Refresh tokens).
  - Role-Based Access Control (RBAC) with granular permissions (e.g., `tasks.create`, `invoices.read`).
  - Roles and Permissions seeders.
- **Team & User Management**
  - Manage users, profiles, and assign roles.
  - Department management (CRUD) and assignment.
- **Client Management**
  - Manage clients, company details, and linked users.
- **Project & Task Management**
  - Create and manage projects (status, budget, milestones).
  - Task assignment, priority, status tracking, and subtasks.
  - Polymorphic file attachments and task commenting.
- **Invoices & Billing**
  - Invoice generation, line items, and dynamic balance calculation.
  - Payment tracking (Partial & Full payments).
- **Settings & Analytics**
  - Global system settings (Key-Value pairs).
  - Real-time team analytics, productivity rates, and top performers.
- **Event-Driven Notifications (WebSockets)**
  - Event Emitter integrated for internal system events (e.g., Task Assigned, Invoice Paid).
  - Real-time push notifications using `Socket.io`.

---

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** (v18 or higher recommended)
- **NPM** or **Yarn**
- **PostgreSQL** running locally or via Docker.

---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fbintbd-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   > Ensure your PostgreSQL credentials and JWT secrets are correctly set in the `.env` file.

4. **Database Seeding (Required for Initial Setup)**
   The system requires default roles (Super Admin, Admin, Manager) and default permissions to function properly.
   ```bash
   npm run seed
   ```

---

## 🚦 Running the Application

**Development Mode (Watch mode):**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run build
npm run start:prod
```

---

## 📖 API Documentation (Swagger)

Once the application is running, the API documentation will be available at:
👉 **[http://localhost:3000/api](http://localhost:3000/api)**

The Swagger UI provides interactive documentation for all endpoints. To test secured endpoints, use the `Authorize` button to inject your Bearer JWT token.

---

## 🔌 WebSocket Integration

The system uses WebSockets for real-time notifications.
- **Event:** `joinUserRoom` (Frontend emits this with their `userId` upon login).
- **Event:** `newNotification` (Backend pushes live notifications to this listener).

---

## 📝 Available Scripts

- `npm run build` - Build the application into the `dist` folder.
- `npm run start:dev` - Run the app in development watch mode.
- `npm run seed` - Run the database seeder to populate roles & permissions.
- `npm run lint` - Run ESLint to check for code issues.
- `npm run format` - Format the code using Prettier.

---
*Maintained by the Development Team.*