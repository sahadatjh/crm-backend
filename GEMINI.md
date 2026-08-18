# CRM/ERP System - AI Development Rules & Context

## 1. Tech Stack & Core Libraries
- **Framework:** NestJS (Node.js with TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (JSON Web Token) with Passport-JWT & Refresh Token strategy
- **API Documentation:** Swagger / OpenAPI (`@nestjs/swagger`)
- **Validation:** `class-validator`, `class-transformer`

---

## 2. Architectural Guidelines & Directory Structure
Follow a strictly modular architecture using the **Controller-Service-DAO/Repository-DTO** pattern:

```text
src/
├── common/             # Interceptors, filters, decorators, constants, interfaces
│   ├── decorators/     # CurrentUser, Roles, Public, etc.
│   ├── filters/        # Global HttpExceptionFilter
│   ├── interceptors/   # TransformResponseInterceptor, LoggingInterceptor
│   └── interfaces/     # ApiResponse, Pagination interfaces
├── config/             # Environment configs (database, jwt, app configs)
├── shared/             # Global/Shared modules (Mailer, Logger, Storage/Upload, Redis)
├── modules/            # Feature modules (Auth, Users, Roles, Clients, Tasks, Invoices, etc.)
│   └── [module-name]/
│       ├── controllers/
│       ├── services/
│       ├── dao/        # Custom Data Access Objects / Repositories
│       ├── dto/        # Request & Response DTOs
│       ├── entities/   # TypeORM entities
│       └── [module-name].module.ts
├── app.module.ts
└── main.ts

3. Layer Responsibilities
Controller: Handles HTTP requests, Swagger annotations, request routing, and input DTO mapping. No business logic.

Service: Implements business logic, validation checks, orchestration, and business errors.

DAO / Repository: Direct database operations via TypeORM query runners/repositories.

DTO (Data Transfer Object): Strict validation using class-validator and decorated with Swagger properties (@ApiProperty()).

Entity: Database table definitions mapped using TypeORM decorators.

4. Standard API Response & Error Handling
All API responses must pass through an interceptor to maintain this uniform format:

Success Response Format:
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

Error Response Format:
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed / Error message",
  "errors": []
}

5. Code Quality & AI Generation Rules
No Incomplete Code: Never generate placeholders like // implement later, // add your logic here, or TODOs.

Swagger Coverage: Every endpoint must include @ApiOperation(), @ApiResponse(), and @ApiBearerAuth() where applicable.

Type Safety: Strict TypeScript usage. Never use any unless strictly justified.

Security: Use password hashing (bcrypt), sanitize user inputs, and protect routes using Guards (JwtAuthGuard, RolesGuard).

Pagination: All listing/collection endpoints must support pagination (page, limit), sorting, and filtering.