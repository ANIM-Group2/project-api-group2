# AERONEXIS Dynamics — ERP System

> **"Precision Beyond Limits"**

A full-stack industrial ERP built for AERONEXIS Dynamics, an aerospace precision components manufacturer. Designed to replace Excel-based operations with a centralized, traceable, and scalable system across production, inventory, sales, and management — including an embedded AI assistant (ARIA).

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles & Apps](#user-roles--apps)
- [Getting Started](#getting-started)
- [Running with Docker](#running-with-docker)
- [Running Locally](#running-locally)
- [AI Agent — ARIA](#ai-agent--aria)
- [API Gateway & RBAC](#api-gateway--rbac)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Default Users](#default-users)

---

## Overview

AERONEXIS Dynamics manufactures high-precision mechanical parts for civil aviation and long-range drones. This ERP system covers:

- **Production** — manufacturing orders, batch lifecycle, quality incident reporting
- **Inventory** — raw material stock, reservations, shipments, stock alerts
- **Sales** — customer orders, approval workflows, revenue analytics
- **Management** — executive dashboards, KPI reporting, AI-powered assistant (ARIA)

---

## Architecture

```
Browser (5 React apps)
        |
        | JWT Bearer token
        v
API Gateway :4000  ──  JWT verification + RBAC + dynamic proxy
        |
        |── /api/production/*    ──>  ms-production   :4001
        |── /api/inventory/*     ──>  ms-inventory    :4002
        |── /api/orders/*        ──>  ms-orders       :4003
        |── /api/traceability/*  ──>  ms-traceability :4004
        |── /api/agent/*         ──>  ms-agent        :5000  (admin only)
        |
        v
PostgreSQL (relational data)  +  MongoDB (traceability event logs)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Redux Toolkit, Tailwind CSS, shadcn/ui |
| Gateway | Node.js, Express, http-proxy-middleware |
| Microservices | Node.js, Express, Sequelize ORM |
| Databases | PostgreSQL 16, MongoDB 7 |
| Authentication | JWT (HS256), bcrypt |
| AI Agent | Python 3.12, FastAPI, Ollama (llama3.1), MCP, ChromaDB, sentence-transformers |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```
awproject/
├── apps/
│   ├── login/          # Authentication app          :3000
│   ├── operator/       # Production operator app     :3001
│   ├── logistics/      # Inventory & shipments app   :3002
│   ├── sales/          # Orders & analytics app      :3003
│   └── admin/          # Executive dashboard + ARIA  :3004
├── services/
│   ├── api-gateway/    # JWT auth, RBAC, proxy        :4000
│   ├── ms-production/  # Batches, orders, incidents   :4001
│   ├── ms-inventory/   # Stock, reservations, alerts  :4002
│   ├── ms-orders/      # Customer orders, shipments   :4003
│   ├── ms-traceability/# Event logs, audit trail      :4004
│   └── ms-agent/       # ARIA AI assistant            :5000
└── docker-compose.yml
```

---

## User Roles & Apps

| Role | User | App Port | Access |
|---|---|---|---|
| Operator | Karim Aït-Ouali | :3001 | Production orders, batches, incidents, history |
| Logistics | Claire Dupont | :3002 | Stock, reservations, shipments, alerts |
| Sales | Sophie Martin | :3003 | Customer orders, approvals, analytics |
| Admin | Philippe Laurent | :3004 | All modules + ARIA AI assistant |

---

## Running with Docker

### Prerequisites
- Docker Desktop installed and running

### First time setup

```bash
# 1. Build and start all services
docker compose up --build -d

# 2. Run the database schema
docker compose cp services/api-gateway/seed/aeronexis_schema.sql postgres:/tmp/aeronexis_schema.sql
docker compose exec postgres psql -U postgres -d aeronexisdb -f /tmp/aeronexis_schema.sql

# 3. Seed initial data
docker compose exec api-gateway node seed/seed.js

# 4. Ingest RAG docs for ARIA (one time only)
docker compose exec ms-agent python -m rag.ingest

# 5. Pull the Ollama model (~4.7GB, one time only)
docker compose exec ollama ollama pull llama3.1
```

### Daily usage

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Full reset (deletes all data)
docker compose down -v
```

Open **http://localhost:3000** to access the login page.

---

## Running Locally

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- PostgreSQL
- MongoDB
- Ollama

### 1. Database Setup

```bash
psql -U postgres -c "CREATE DATABASE aeronexisdb;"
psql -U postgres -d aeronexisdb -f services/api-gateway/seed/aeronexis_schema.sql
cd services/api-gateway && node seed/seed.js
```

### 2. Install Dependencies

```bash
# Services
for svc in api-gateway ms-production ms-inventory ms-orders ms-traceability; do
  cd services/$svc && npm install && cd ../..
done

# Frontend apps
for app in login operator logistics sales admin; do
  cd apps/$app && npm install && cd ../..
done

# AI Agent
cd services/ms-agent && pip install -r requirements.txt
python -m rag.ingest  # one time only
```

### 3. Start All Services

```bash
# Services (each in its own terminal)
cd services/api-gateway    && node index.js
cd services/ms-production  && npm start
cd services/ms-inventory   && npm start
cd services/ms-orders      && npm start
cd services/ms-traceability && npm start
cd services/ms-agent       && python index.py

# Frontend apps (each in its own terminal)
cd apps/login     && npm run dev
cd apps/operator  && npm run dev
cd apps/logistics && npm run dev
cd apps/sales     && npm run dev
cd apps/admin     && npm run dev

# Ollama (in a separate terminal)
ollama serve
ollama pull llama3.1
```

---

## AI Agent — ARIA

ARIA (Aeronexis Real-time Intelligence Assistant) is accessible exclusively to the admin (Philippe). It uses a **ReAct loop** with 11 MCP tools to query live ERP data.

**Example queries:**
```
"What are the current open critical incidents?"
"Which products are below safety stock threshold?"
"Show me the top customers by revenue this year."
"Are there any urgent orders not yet in production?"
"What is the batch completion rate this month?"
```

ARIA runs entirely locally — no data is sent to external APIs.

---

## API Gateway & RBAC

| Role | ms-production | ms-inventory | ms-orders | ms-traceability | ms-agent |
|---|---|---|---|---|---|
| operator | ✅ | ❌ | ❌ | ✅ | ❌ |
| logistics | ❌ | ✅ | Read only | ✅ | ❌ |
| sales | ❌ | ❌ | ✅ | ✅ | ❌ |
| admin | ✅ | ✅ | ✅ | ✅ | ✅ |

All requests must include:
```
Authorization: Bearer <jwt_token>
```

---

## Database

### PostgreSQL — Key Tables

| Table | Description |
|---|---|
| `user` | All ERP users with role and site |
| `production_order` | Manufacturing orders |
| `batch` | Batch lifecycle tracking |
| `incident` | Quality incidents |
| `raw_material` | Inventory with safety thresholds |
| `material_reservation` | Material allocations |
| `customer_order` | Customer orders |
| `shipment` | Outbound shipments |
| `kpi_report` | Saved KPI snapshots |
| `ai_agent_log` | ARIA interaction logs |

### MongoDB — Collections

| Collection | Description |
|---|---|
| `batch_action_logs` | Batch status changes (inter-service) |
| `incident_logs` | Incident events (inter-service) |
| `stock_movements` | Stock adjustments |
| `stock_alerts` | Low stock / out of stock alerts |
| `kpi_reports` | Saved executive reports |

---

## Environment Variables

**api-gateway/.env**
```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aeronexisdb
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=8h
MS_PRODUCTION_URL=http://localhost:4001
MS_INVENTORY_URL=http://localhost:4002
MS_ORDERS_URL=http://localhost:4003
MS_TRACEABILITY_URL=http://localhost:4004
MS_AGENT_URL=http://localhost:5000
```

**ms-agent/.env**
```
GATEWAY_URL=http://localhost:4000
OLLAMA_HOST=http://localhost:11434
AGENT_PORT=5000
OLLAMA_MODEL=llama3.1
```

---

## Default Users

| Name | Email | Password | Role |
|---|---|---|---|
| Karim Aït-Ouali | karim@aeronexis.com | password | operator |
| Claire Dupont | claire@aeronexis.com | password | logistics |
| Sophie Martin | sophie@aeronexis.com | password | sales |
| Philippe Laurent | philippe@aeronexis.com | password | admin |

---

*AERONEXIS Dynamics — Digital Transformation Project — 2025–2026*
*CESI École d'Ingénieurs — PGE FISE/FISA*
