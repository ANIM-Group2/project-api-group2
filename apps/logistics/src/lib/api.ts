const GATEWAY = 'http://localhost:4000'

function getToken(): string {
  return localStorage.getItem('aeronexis_token') || ''
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${GATEWAY}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── Types ─────────────────────────────────────────────────────

export interface RawMaterial {
  material_id: number
  reference: string
  name: string
  stock_quantity: number
  reserved_quantity: number
  safety_threshold: number
  unit: string
  supplier?: { company_name: string; country: string }
}

export interface MaterialReservation {
  reservation_id: number
  material_id: number
  production_order_id: number
  quantity_reserved: number
  reserved_at: string
  released_at: string | null
  is_active: boolean
  material?: { reference: string; name: string; unit: string }
}

export interface StockMovement {
  _id: string
  product_id: number
  product_ref: string
  site_id: number
  movement_type: string
  quantity: number
  previous_qty: number
  new_qty: number
  reason: string
  reference_doc: string
  performed_by: number
  performed_at: string
}

export interface StockAlert {
  _id: string
  product_id: number
  product_ref: string
  alert_type: string
  current_qty: number
  threshold: number
  status: string
  created_at: string
}

export interface Shipment {
  shipment_id?: number
  customer_order_id: number
  site_id?: number
  carrier?: string
  tracking_number?: string
  status: string
  estimated_delivery?: string
  delivered_at?: string | null
  created_at?: string
  customer_name?: string
  site_name?: string
}

// ── Stock / Inventory ─────────────────────────────────────────

export const stockApi = {
  getAll: () =>
    request<RawMaterial[]>('GET', '/api/inventory/stock'),

  getLowStock: () =>
    request<RawMaterial[]>('GET', '/api/inventory/stock/low-stock'),

  getLog: (material_id?: number) => {
    const q = material_id ? `?material_id=${material_id}` : ''
    return request<StockMovement[]>('GET', `/api/inventory/stock/log${q}`)
  },

  adjust: (material_id: number, delta: number, reason: string, reference_doc?: string) =>
    request('POST', '/api/inventory/stock/adjust', { material_id, delta, reason, reference_doc }),
}

// ── Alerts ────────────────────────────────────────────────────

export const alertsApi = {
  getAll: (status?: string) => {
    const q = status ? `?status=${status}` : ''
    return request<StockAlert[]>('GET', `/api/inventory/stock/alerts${q}`)
  },

  acknowledge: (id: string) =>
    request('PATCH', `/api/inventory/stock/alerts/${id}/ack`, {}),
}

// ── Reservations ──────────────────────────────────────────────

export const reservationsApi = {
  getAll: () =>
    request<MaterialReservation[]>('GET', '/api/inventory/stock/reservations'),

  create: (material_id: number, production_order_id: number, quantity: number) =>
    request<MaterialReservation>('POST', '/api/inventory/stock/reservations', {
      material_id, production_order_id, quantity,
    }),

  release: (id: number) =>
    request('DELETE', `/api/inventory/stock/reservations/${id}`, undefined),
}

// ── Shipments ─────────────────────────────────────────────────

export const shipmentsApi = {
  getAll: () =>
    request<{ data?: Shipment[]; success?: boolean } | Shipment[]>('GET', '/api/orders/shipments'),
}

export interface CustomerOrder {
  customer_order_id: number
  status: string
  total_amount: number
  order_date: string
  is_urgent: boolean
  customer?: { company_name: string; country: string }
}

export const ordersApi = {
  getConfirmed: () =>
    request<CustomerOrder[]>('GET', '/api/orders/orders?status=confirmed'),
  getAll: () =>
    request<CustomerOrder[]>('GET', '/api/orders/orders'),
}

export const createShipmentApi = {
  create: (data: {
    customer_order_id: number
    site_id?: number
    shipment_type?: string
    tracking_number?: string
    shipment_date?: string
  }) => request<Shipment>('POST', '/api/orders/shipments', data),
}