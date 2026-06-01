// Central API client — all calls go through the gateway on :4000
// Token is read from localStorage (set by the login app)

const GATEWAY = 'http://localhost:4000'

function getToken(): string {
  return localStorage.getItem('aeronexis_token') || ''
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('aeronexis_user') || '{}')
  } catch {
    return {}
  }
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

// ── Types matching the real DB schema ─────────────────────────

export interface ProductionOrder {
  production_order_id: number
  order_number: string
  status: string
  priority: string
  quantity_ordered: number
  planned_start: string | null
  planned_end: string | null
  creation_date: string
  product?: { name: string; reference: string; unit_price: number }
  site?: { name: string; country: string }
  creator?: { first_name: string; last_name: string }
  batches?: Batch[]
}

export interface Batch {
  batch_id: number
  batch_number: string
  status: string
  quantity_produced: number
  manufacturing_date: string
  notes: string | null
  production_order_id: number
  operator_id: number | null
  operator?: { first_name: string; last_name: string }
  production_order?: ProductionOrder
  incidents?: Incident[]
}

export interface Incident {
  incident_id: number
  batch_id: number
  title: string
  description: string | null
  severity: string
  status: string
  detected_at: string
  resolved_at: string | null
  reported_by: number
  reporter?: { first_name: string; last_name: string }
  batch?: Batch
}

export interface BatchActionLog {
  _id: string
  batch_id: number
  batch_number: string
  action: string
  previous_status?: string
  new_status?: string
  operator_id?: number
  notes?: string
  timestamp: string
}

export interface ProductionKPIs {
  active_orders: number
  completed_orders: number
  critical_orders: number
  total_orders: number
}

// ── Production Orders ─────────────────────────────────────────

export const ordersApi = {
  getAll: (params?: { status?: string; priority?: string }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
    return request<ProductionOrder[]>('GET', `/api/production/orders${q}`)
  },
  getById: (id: number) =>
    request<ProductionOrder>('GET', `/api/production/orders/${id}`),
  getKPIs: () =>
    request<ProductionKPIs>('GET', '/api/production/orders/kpis'),
  updateStatus: (id: number, status: string) =>
    request<ProductionOrder>('PATCH', `/api/production/orders/${id}/status`, { status }),
}

// ── Batches ───────────────────────────────────────────────────

export const batchesApi = {
  getAll: (params?: { status?: string; production_order_id?: number }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
    return request<Batch[]>('GET', `/api/production/batches${q}`)
  },
  getById: (id: number) =>
    request<Batch>('GET', `/api/production/batches/${id}`),
  getHistory: (id: number) =>
    request<BatchActionLog[]>('GET', `/api/production/batches/${id}/history`),
  updateStatus: (id: number, status: string, notes?: string) =>
    request<Batch>('PATCH', `/api/production/batches/${id}/status`, { status, notes }),
  updateQuantity: (id: number, quantity_produced: number) =>
    request<Batch>('PATCH', `/api/production/batches/${id}/quantity`, { quantity_produced }),
}

// ── Incidents ─────────────────────────────────────────────────

export const incidentsApi = {
  getAll: (params?: { status?: string; severity?: string }) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : ''
    return request<Incident[]>('GET', `/api/production/incidents${q}`)
  },
  getById: (id: number) =>
    request<Incident>('GET', `/api/production/incidents/${id}`),
  getStats: () =>
    request<{ open: number; critical: number; investigating: number; resolved: number }>(
      'GET', '/api/production/incidents/stats'
    ),
  create: (data: { batch_id: number; title: string; description?: string; severity: string }) =>
    request<Incident>('POST', '/api/production/incidents', {
      ...data,
      reported_by: getUser().userId,
    }),
  updateStatus: (id: number, status: string, resolution?: string) =>
    request<Incident>('PATCH', `/api/production/incidents/${id}/status`, { status, resolution }),
}

// ── Traceability (history page) ───────────────────────────────

export const traceApi = {
  getBatchHistory: (batchId: number) =>
    request<BatchActionLog[]>('GET', `/api/production/batches/${batchId}/history`),
}

export { getUser }