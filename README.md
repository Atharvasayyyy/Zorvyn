# Finance Data Processing and Access Control (MERN)

A full MERN stack project built for the assignment requirements, with focus on backend architecture, role-based access control, financial record processing, and dashboard summary APIs.

## Tech Stack

- MongoDB + Mongoose
- Express.js (REST API)
- React + Vite
- Node.js
- JWT authentication
- Role-based access control (Viewer, Analyst, Admin)

## Project Structure

```
.
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middlewares/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ utils/
│  │  ├─ app.js
│  │  ├─ server.js
│  │  └─ seed.js
│  ├─ .env.example
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ pages/
│  │  ├─ styles/
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ .env.example
│  └─ package.json
└─ README.md
```

## Implemented Requirements

### Requirement Compliance Checklist

- Core Requirement 1 (User and Role Management): Implemented
- Core Requirement 2 (Financial Records Management): Implemented
- Core Requirement 3 (Dashboard Summary APIs): Implemented
- Core Requirement 4 (Access Control Logic): Implemented
- Core Requirement 5 (Validation and Error Handling): Implemented
- Core Requirement 6 (Data Persistence): Implemented

### Role Permission Matrix

- Viewer
  - Can access dashboard summary
  - Cannot view/create/update/delete records
  - Cannot manage users
- Analyst
  - Can access dashboard summary
  - Can view records with filters and pagination
  - Cannot create/update/delete records
  - Cannot manage users
- Admin
  - Can access dashboard summary
  - Can create/view/update/delete records
  - Can create/list/update users

### 1. User and Role Management

- Admin-only user management APIs.
- User fields include `name`, `email`, `password`, `role`, `status`.
- Roles supported:
  - `viewer`: dashboard only
  - `analyst`: dashboard + record viewing
  - `admin`: full access (users + records CRUD)

### 2. Financial Records Management

- Create, read, update, delete financial records.
- Record fields:
  - `amount`
  - `type` (`income` or `expense`)
  - `category`
  - `date`
  - `notes`
- Filtering support:
  - type
  - category
  - date range
  - pagination
- Soft delete implemented using `isDeleted` flag.

### 3. Dashboard Summary APIs

`GET /api/dashboard/summary?range=month|week`

Returns:

- total income
- total expenses
- net balance
- category-wise totals
- recent activity
- trend data

### 4. Access Control Logic

Implemented with middleware:

- `protect`: JWT + active user check
- `authorize(...roles)`: role validation

Examples:

- Viewer cannot access records or user management.
- Analyst can read records and summary.
- Admin has full management access.

### 5. Validation and Error Handling

- Input validation via `express-validator`.
- Standardized JSON error responses.
- Proper HTTP status codes.
- Handles invalid ObjectId/cast errors.

### 6. Data Persistence

- MongoDB persistence through Mongoose models.

## API Endpoints

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Users (Admin only)

- `POST /api/users`
- `GET /api/users`
- `PATCH /api/users/:id`

### Records

- `GET /api/records` (Analyst/Admin)
- `POST /api/records` (Admin)
- `PATCH /api/records/:id` (Admin)
- `DELETE /api/records/:id` (Admin)

### Dashboard

- `GET /api/dashboard/summary` (Viewer/Analyst/Admin)

## Setup Instructions

## 1) Backend

```bash
cd backend
npm install
# Windows PowerShell
Copy-Item .env.example .env
# macOS/Linux
# cp .env.example .env
npm run seed
npm run dev
```

Backend runs at: `http://localhost:5000`

## 2) Frontend

```bash
cd frontend
npm install
# Windows PowerShell
Copy-Item .env.example .env
# macOS/Linux
# cp .env.example .env
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Default Admin (from seed)

- Email: `admin@finance.local`
- Password: `Admin@123`

## Assumptions and Tradeoffs

- A single organization scope is assumed.
- Viewer is intentionally restricted to summary dashboard data only.
- Record delete is soft delete for safer audit behavior.
- Update user password flow is not included (can be extended).
- No refresh token flow, suitable for assignment-level implementation.

## Optional Enhancements You Can Add Later

- Refresh token + logout invalidation
- Rate limiting and brute-force protections
- Unit and integration tests
- Swagger/OpenAPI docs
- Export reports (CSV/PDF)

## Included Enhancements in This Submission

- JWT authentication (`/api/auth/login`, `/api/auth/me`)
- Pagination and filtering in record listing
- Search-like category filtering for records
- Soft delete for records (`isDeleted`)
- Improved frontend UX for dashboard, records, and users
