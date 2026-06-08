# AERONEXIS Dynamics   ERP System

> **"Precision Beyond Limits"**

A full-stack industrial ERP built for AERONEXIS Dynamics, an aerospace precision components manufacturer. Designed to replace Excel-based operations with a centralized, traceable, and scalable system across production, inventory, sales, and management.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles & Apps](#user-roles--apps)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [AI Agent   ARIA](#ai-agent--aria)
- [API Gateway & RBAC](#api-gateway--rbac)
- [Database](#database)
- [Environment Variables](#environment-variables)

---

## Overview

AERONEXIS Dynamics manufactures high-precision mechanical parts for civil aviation and long-range drones. This ERP system covers:

- **Production**   manufacturing orders, batch lifecycle, quality incident reporting
- **Inventory**   raw material stock, reservations, shipments, stock alerts
- **Sales**   customer orders, approval workflows, revenue analytics
- **Management**   executive dashboards, KPI reporting, AI-powered assistant (ARIA)

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
        |── /chat/*              ──>  ms-agent        :5000  (admin only)
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
| Databases | PostgreSQL, MongoDB |
| Authentication | JWT (HS256), bcrypt |
| AI Agent | Python, FastAPI, Ollama (llama3.2), MCP, ChromaDB, sentence-transformers |

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
└── services/
    ├── api-gateway/    # JWT auth, RBAC, proxy        :4000
    ├── ms-production/  # Batches, orders, incidents   :4001
    ├── ms-inventory/   # Stock, reservations, alerts  :4002
    ├── ms-orders/      # Customer orders, shipments   :4003
    ├── ms-traceability/# Event logs, audit trail      :4004
    └── ms-agent/       # ARIA AI assistant            :5000
        ├── agent/
        │   ├── agent.py          # ConversationAgent (ReAct loop)
        │   └── prompts/system.md # ARIA system prompt
        ├── mcp_server/server.py  # 11 ERP tools via MCP
        ├── rag/
        │   ├── ingest.py         # ChromaDB ingestion
        │   └── retriever.py      # Semantic search
        ├── docs/                 # Knowledge base documents
        ├── index.py              # FastAPI HTTP server
        └── requirements.txt
```

---

## User Roles & Apps

| Role | User | App Port | Access |
|---|---|---|---|
| Operator | Karim Aït-Ouali | :3001 | Production orders, batches, incidents |
| Logistics | Claire Dupont | :3002 | Stock, reservations, shipments, alerts |
| Sales | Sophie Martin | :3003 | Customer orders, approvals, analytics |
| Admin | Philippe Laurent | :3004 | All modules + ARIA AI assistant |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.10
- PostgreSQL
- MongoDB
- [Ollama](https://ollama.ai) (for the AI agent)

### 1. Database Setup

Create a PostgreSQL database and run the schema:

```bash
psql -U postgres -c "CREATE DATABASE aeronexis;"
psql -U postgres -d aeronexis -f services/api-gateway/seed/aeronexis_schema.sql
```

Seed initial data:

```bash
cd services/api-gateway
node seed/seed.js
```

### 2. Install Dependencies

Run this from the project root to install all Node.js dependencies:

```bash
# Gateway
cd services/api-gateway && npm install

# Microservices
cd services/ms-production  && npm install
cd services/ms-inventory   && npm install
cd services/ms-orders      && npm install
cd services/ms-traceability && npm install

# Frontend apps
cd apps/login     && npm install
cd apps/operator  && npm install
cd apps/logistics && npm install
cd apps/sales     && npm install
cd apps/admin     && npm install
```

### 3. AI Agent Setup

```bash
cd services/ms-agent

# Install Python dependencies
pip install -r requirements.txt

# Pull the Ollama model (first time only, ~2GB)
ollama pull llama3.2

# Ingest business documents into ChromaDB (first time only)
python -m rag.ingest
```

---

## Running the Project

Open a terminal for each service:

```bash
# Services
cd services/api-gateway    && node index.js          # :4000
cd services/ms-production  && npm start              # :4001
cd services/ms-inventory   && npm start              # :4002
cd services/ms-orders      && npm start              # :4003
cd services/ms-traceability && npm start             # :4004
cd services/ms-agent       && python index.py        # :5000

# Frontend apps
cd apps/login     && npm run dev   # :3000
cd apps/operator  && npm run dev   # :3001
cd apps/logistics && npm run dev   # :3002
cd apps/sales     && npm run dev   # :3003
cd apps/admin     && npm run dev   # :3004
```

Make sure Ollama is running before starting the agent:

```bash
ollama serve
```

Then open **http://localhost:3000** and log in with one of the seeded users.

---

## AI Agent   ARIA

ARIA (Aeronexis Real-time Intelligence Assistant) is an AI agent accessible exclusively to the admin. It uses a **ReAct (Reason + Act)** loop:

1. Admin types a question in the chat widget (bottom-right of the admin app)
2. ARIA retrieves relevant business procedures from ChromaDB (RAG)
3. ARIA reasons which ERP data it needs and calls the appropriate MCP tool
4. MCP tools query the live microservices via the API gateway using the admin's JWT
5. ARIA synthesizes a data-backed answer

**Example queries:**
```
"What are the current open critical incidents?"
"Which products are below safety stock threshold?"
"Show me the top customers by revenue this year."
"Are there any urgent orders not yet in production?"
"What is the batch completion rate this month?"
```

ARIA runs entirely locally   no data is sent to external APIs.

---

## API Gateway & RBAC

The gateway enforces role-based access control on every request:

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

### PostgreSQL   Key Tables

| Table | Description |
|---|---|
| `users` | All ERP users with role and site assignment |
| `production_orders` | Manufacturing orders with status and priority |
| `production_batches` | Batch lifecycle tracking per order |
| `incidents` | Quality incidents reported on batches |
| `raw_materials` | Inventory items with stock and safety threshold |
| `material_reservations` | Material allocations per production order |
| `customer_orders` | Customer orders with status and delivery dates |
| `shipments` | Outbound shipments linked to customer orders |
| `sites` | Production sites (Lyon, Toulouse) |

### MongoDB   Traceability

All state changes (batch updates, stock movements, shipment events) are logged as documents for full audit trail and traceability reconstruction.

---

## Environment Variables

Each service uses a `.env` file. Key variables:

**api-gateway/.env**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aeronexis
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=4000
```

**ms-agent/.env**
```
GATEWAY_URL=http://localhost:4000
OLLAMA_HOST=http://localhost:11434
AGENT_PORT=5000
OLLAMA_MODEL=llama3.2
```

---

## Default Users (after seeding)

| Name | Email | Password | Role |
|---|---|---|---|
| Karim Aït-Ouali | karim@aeronexis.com | password123 | operator |
| Claire Dupont | claire@aeronexis.com | password123 | logistics |
| Sophie Martin | sophie@aeronexis.com | password123 | sales |
| Philippe Laurent | philippe@aeronexis.com | password123 | admin |

---

*AERONEXIS Dynamics   Digital Transformation Project   2025*
