# AERONEXIS Dynamics — ERP System

> *Precision Beyond Limits*

A modular, role-based ERP platform for an aerospace precision manufacturing company. Built as a monorepo with 5 independent React frontends, an Express API gateway, and a PostgreSQL database.

---

## Project Context

AERONEXIS Dynamics manufactures high-precision mechanical components for civil aviation and long-range drones. This ERP system was designed to replace a fragmented Excel/email-based workflow with a centralized, traceable, and scalable platform covering production, logistics, sales, and executive management.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend Apps                       │
│  Login  │  Admin  │  Operator  │  Logistics  │  Sales   │
│ :3000   │  :3004  │   :3001    │    :3002    │  :3003   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / JWT
                         ▼
              ┌─────────────────────┐
              │    API Gateway      │
              │    Express :4000    │
              │  Auth · Routing     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     PostgreSQL      │
              │   aeronexis_erp     │
              └─────────────────────┘
```

---

## Apps

| App | Port | Role | Description |
|-----|------|------|-------------|
| `login` | 3000 | All users | Shared authentication entry point. Redirects users to their role-specific app after login |
| `operator` | 3001 | Production Operator | Manage manufacturing batches, work orders, report incidents, consult action history |
| `logistics` | 3002 | Logistics Manager | Monitor stock levels, manage reservations, plan shipments, receive shortage alerts |
| `sales` | 3003 | Sales Manager | Track customer orders, approve urgent orders, access sales analytics and customer history |
| `admin` | 3004 | CEO / Management | Executive dashboards, consolidated KPIs, production mix, OTD trends, critical incident monitoring |

---

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite
- React Router v7
- Tailwind CSS v4
- shadcn/ui (Radix UI primitives)
- Recharts (data visualization)
- next-themes (dark/light mode)
- Lucide React (icons)

**Backend**
- Node.js + Express
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- PostgreSQL (`pg`)

**Tooling**
- Docker / Docker Compose
- pnpm

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL running locally (or via Docker)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/aeronexis-dynamics.git
cd aeronexis-dynamics
```

### 2. Set up the API Gateway

```bash
cd services/api-gateway
cp .env.example .env   # fill in your DB credentials and JWT secret
npm install
node index.js
```

The gateway runs on **port 4000**.

**Required `.env` variables:**

```env
PORT=4000
JWT_SECRET=your_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aeronexis_erp
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Start the frontend apps

Each app is independent. Open a terminal for each:

```bash
# Login
cd apps/login && npm install && npm run dev       # :3000

# Operator
cd apps/operator && npm install && npm run dev    # :3001

# Logistics
cd apps/logistics && npm install && npm run dev   # :3002

# Sales
cd apps/sales && npm install && npm run dev       # :3003

# Admin
cd apps/admin && npm install && npm run dev       # :3004
```

### 4. (Optional) Run with Docker Compose

```bash
docker-compose up
```

---

## Authentication Flow

1. All users land on the **Login app** (`localhost:3000`)
2. Credentials are sent to the API Gateway (`POST /auth/login`)
3. The gateway validates against PostgreSQL, returns a **JWT + role**
4. The frontend stores `aeronexis_token` and `aeronexis_role` in `localStorage`
5. Each app's `AuthGuard` checks for a valid token and matching role on every route — unauthorized users are redirected back to the login page
6. JWT expires after **8 hours**

---

## Project Structure

```
aeronexis-dynamics/
├── apps/
│   ├── login/            # Shared auth UI
│   ├── operator/         # Production operator dashboard
│   ├── logistics/        # Logistics manager dashboard
│   ├── sales/            # Sales manager dashboard
│   └── admin/            # Executive dashboard
│       ├── src/
│       │   ├── components/
│       │   │   ├── AdminLayout.tsx
│       │   │   └── theme-provider.tsx
│       │   ├── pages/
│       │   │   ├── Overview.tsx
│       │   │   ├── Production.tsx
│       │   │   ├── Incidents.tsx
│       │   │   ├── Sites.tsx
│       │   │   └── Reports.tsx
│       │   ├── lib/
│       │   │   └── admin-data.ts
│       │   ├── main.tsx
│       │   └── index.css
│       └── ...
├── services/
│   └── api-gateway/      # Express auth + routing service
│       ├── index.js
│       └── .env
└── docker-compose.yml
```

---

## Key Features

- **Role-based routing** — each user role has a dedicated app with its own navigation and feature set
- **JWT authentication** — stateless token auth with 8-hour expiry, verified on every protected route
- **Dark / Light mode** — powered by `next-themes`, persisted across sessions, consistent across all apps
- **Responsive layout** — desktop sidebar + mobile sheet drawer on all dashboards
- **KPI dashboards** — revenue vs target charts, production mix pie charts, OTD trend lines, top customer tables
- **Incident tracking** — critical incident badges in navigation, alert banners on the overview page
- **Stock & reservation management** — logistics app tracks inventory levels and flags shortages

---

## Development Notes

- Each frontend app is fully independent — they share no code at runtime, only design conventions
- All apps use the same `shadcn/ui` component library and Tailwind CSS v4 setup
- The `@/` path alias resolves to each app's `src/` directory
- Mock data lives in `src/lib/*-data.ts` files — replace with real API calls as backend endpoints are added

---

## Team

Built as part of an academic ERP project — AERONEXIS Dynamics (Project 1).
