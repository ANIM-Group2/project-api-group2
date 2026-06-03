"""
AERONEXIS MCP Server
Exposes ERP microservices as tools callable by the AI agent.
Communicates through the API Gateway using the admin JWT token.
"""
import os
import httpx
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv

load_dotenv()

mcp     = FastMCP("AeronexisERP")
GATEWAY = os.getenv("GATEWAY_URL", "http://localhost:4000")

def _headers():
    token = os.getenv("ADMIN_TOKEN", "")  # read fresh on every call
    return {"Authorization": f"Bearer {token}"}

def _get(path: str):
    try:
        r = httpx.get(f"{GATEWAY}{path}", headers=_headers(), timeout=10)
        return r.json()
    except Exception as e:
        return {"error": str(e)}


# ── PRODUCTION TOOLS ───────────────────────────────────────────────────────────

@mcp.tool()
def get_production_kpis() -> dict:
    """Get production KPIs: total orders, active batches, completed batches, critical count."""
    return _get("/api/production/orders/kpis")

@mcp.tool()
def list_production_orders(status: str = None, priority: str = None) -> list:
    """
    List production orders with optional filters.
    status: planned | in_progress | completed | cancelled
    priority: low | normal | medium | high | urgent | critical
    """
    params = []
    if status:   params.append(f"status={status}")
    if priority: params.append(f"priority={priority}")
    q = "?" + "&".join(params) if params else ""
    return _get(f"/api/production/orders{q}")

@mcp.tool()
def list_incidents(status: str = None, severity: str = None) -> list:
    """
    List production quality incidents.
    status: open | investigating | resolved | closed
    severity: low | medium | high | critical
    """
    params = []
    if status:   params.append(f"status={status}")
    if severity: params.append(f"severity={severity}")
    q = "?" + "&".join(params) if params else ""
    return _get(f"/api/production/incidents{q}")

@mcp.tool()
def get_incident_stats() -> dict:
    """Get incident statistics: count by status and severity. Returns open, investigating, critical counts."""
    return _get("/api/production/incidents/stats")

@mcp.tool()
def list_batches(status: str = None) -> list:
    """
    List production batches.
    status: planned | in_progress | completed | quarantined | rejected
    """
    q = f"?status={status}" if status else ""
    return _get(f"/api/production/batches{q}")


# ── INVENTORY TOOLS ────────────────────────────────────────────────────────────

@mcp.tool()
def get_stock_overview() -> list:
    """Get full inventory: all raw materials with current quantity, reserved amount, and safety threshold."""
    return _get("/api/inventory/stock")

@mcp.tool()
def get_low_stock_items() -> list:
    """Get all raw materials where available stock (quantity minus reserved) is below the safety threshold."""
    return _get("/api/inventory/stock/low-stock")

@mcp.tool()
def get_active_stock_alerts() -> list:
    """Get all active stock alerts (low_stock or out_of_stock status)."""
    return _get("/api/inventory/stock/alerts?status=active")


# ── SALES / ORDERS TOOLS ───────────────────────────────────────────────────────

@mcp.tool()
def get_sales_stats() -> dict:
    """Get sales statistics: revenue YTD, revenue MTD, active orders, pending approvals, top customers."""
    return _get("/api/orders/stats")

@mcp.tool()
def list_customer_orders(status: str = None) -> list:
    """
    List customer orders with optional status filter.
    status: draft | confirmed | in_production | shipped | delivered | cancelled
    """
    q = f"?status={status}" if status else ""
    return _get(f"/api/orders/orders{q}")

@mcp.tool()
def list_urgent_orders() -> list:
    """List all urgent customer orders that are not yet delivered or cancelled."""
    return _get("/api/orders/orders?urgent=true")


if __name__ == "__main__":
    mcp.run(transport="stdio")
