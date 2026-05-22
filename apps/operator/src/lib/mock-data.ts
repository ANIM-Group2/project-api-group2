// Production Orders
export interface ProductionOrder {
  id: string
  product: string
  partNumber: string
  quantity: number
  completed: number
  status: 'pending' | 'in_progress' | 'quality_check' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  startDate: string
  dueDate: string
  workstation: string
}

export const productionOrders: ProductionOrder[] = [
  {
    id: 'PO-2026-0045',
    product: 'AX hydraulic valve',
    partNumber: 'PROD-AX-2401',
    quantity: 50,
    completed: 32,
    status: 'in_progress',
    priority: 'high',
    startDate: '2026-02-06',
    dueDate: '2026-02-20',
    workstation: 'Hydraulic-Cell-A',
  },
  {
    id: 'PO-2026-0046',
    product: 'High-pressure fitting',
    partNumber: 'PROD-AX-2402',
    quantity: 150,
    completed: 150,
    status: 'quality_check',
    priority: 'high',
    startDate: '2026-02-07',
    dueDate: '2026-02-17',
    workstation: 'Hydraulic-Cell-B',
  },
  {
    id: 'PO-2026-0047',
    product: 'Reinforced drive shaft',
    partNumber: 'PROD-MT-1105',
    quantity: 20,
    completed: 11,
    status: 'in_progress',
    priority: 'critical',
    startDate: '2026-02-08',
    dueDate: '2026-02-25',
    workstation: 'CNC-Mill-1',
  },
  {
    id: 'PO-2026-0048',
    product: 'Engine control module v2',
    partNumber: 'PROD-EL-3301',
    quantity: 5,
    completed: 0,
    status: 'pending',
    priority: 'medium',
    startDate: '2026-02-10',
    dueDate: '2026-02-23',
    workstation: 'Electronics-Lab-1',
  },
  {
    id: 'PO-2026-0049',
    product: 'CNC aluminum housing',
    partNumber: 'PROD-MT-1106',
    quantity: 80,
    completed: 0,
    status: 'pending',
    priority: 'medium',
    startDate: '2026-02-15',
    dueDate: '2026-03-05',
    workstation: 'CNC-Mill-2',
  },
  {
    id: 'PO-2026-0050',
    product: 'Drone camera mount',
    partNumber: 'PROD-DR-5501',
    quantity: 80,
    completed: 55,
    status: 'in_progress',
    priority: 'high',
    startDate: '2026-02-06',
    dueDate: '2026-02-19',
    workstation: 'Assembly-Line-2',
  },
  {
    id: 'PO-2026-0054',
    product: 'AX hydraulic valve',
    partNumber: 'PROD-AX-2401',
    quantity: 60,
    completed: 18,
    status: 'in_progress',
    priority: 'critical',
    startDate: '2026-02-13',
    dueDate: '2026-02-27',
    workstation: 'Hydraulic-Cell-A',
  },
  {
    id: 'PO-2026-0055',
    product: 'Reinforced drive shaft',
    partNumber: 'PROD-MT-1105',
    quantity: 25,
    completed: 8,
    status: 'in_progress',
    priority: 'critical',
    startDate: '2026-02-14',
    dueDate: '2026-03-02',
    workstation: 'CNC-Mill-1',
  },
]

// Batches
export interface Batch {
  id: string
  orderId: string
  product: string
  quantity: number
  status: 'planned' | 'in_progress' | 'quality_check' | 'completed'
  operator: string
  date: string
}

export const batches: Batch[] = [
  {
    id: 'BAT-2026-0188',
    orderId: 'PO-2026-0045',
    product: 'AX hydraulic valve',
    quantity: 25,
    status: 'in_progress',
    operator: 'Karim A.',
    date: '2026-02-06',
  },
  {
    id: 'BAT-2026-0189',
    orderId: 'PO-2026-0045',
    product: 'AX hydraulic valve',
    quantity: 25,
    status: 'planned',
    operator: 'Karim A.',
    date: '2026-02-14',
  },
  {
    id: 'BAT-2026-0185',
    orderId: 'PO-2026-0047',
    product: 'Reinforced drive shaft',
    quantity: 11,
    status: 'in_progress',
    operator: 'Karim A.',
    date: '2026-02-08',
  },
  {
    id: 'BAT-2026-0180',
    orderId: 'PO-2026-0046',
    product: 'High-pressure fitting',
    quantity: 150,
    status: 'quality_check',
    operator: 'Marie B.',
    date: '2026-02-07',
  },
  {
    id: 'BAT-2026-0172',
    orderId: 'PO-2026-0050',
    product: 'Drone camera mount',
    quantity: 55,
    status: 'in_progress',
    operator: 'Luc B.',
    date: '2026-02-06',
  },
  {
    id: 'BAT-2026-0165',
    orderId: 'PO-2026-0054',
    product: 'AX hydraulic valve',
    quantity: 18,
    status: 'in_progress',
    operator: 'Karim A.',
    date: '2026-02-13',
  },
]

// Incidents
export interface Incident {
  id: string
  batchId: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  reportedBy: string
  date: string
}

export const incidents: Incident[] = [
  {
    id: 'INC-2026-001',
    batchId: 'BAT-2026-0180',
    title: 'Dimension out of tolerance — Hydraulic valve',
    severity: 'medium',
    status: 'resolved',
    reportedBy: 'John Smith',
    date: '2026-02-02',
  },
  {
    id: 'INC-2026-002',
    batchId: 'BAT-2026-0185',
    title: 'Surface roughness non-conformance — Drive shaft',
    severity: 'low',
    status: 'investigating',
    reportedBy: 'Karim A.',
    date: '2026-02-07',
  },
  {
    id: 'INC-2026-003',
    batchId: 'BAT-2026-0165',
    title: 'Hydraulic leak test failure at 350 bar',
    severity: 'critical',
    status: 'open',
    reportedBy: 'Karim A.',
    date: '2026-02-15',
  },
]

// History
export interface HistoryEntry {
  timestamp: string
  actionType: 'incident' | 'batch' | 'order'
  description: string
}

export const historyEntries: HistoryEntry[] = [
  {
    timestamp: '2026-02-15 10:32',
    actionType: 'incident',
    description: 'Incident declared | INC-2026-003 on BAT-2026-0165',
  },
  {
    timestamp: '2026-02-14 09:15',
    actionType: 'batch',
    description: 'Batch started | BAT-2026-0165 for PO-2026-0054',
  },
  {
    timestamp: '2026-02-13 16:45',
    actionType: 'batch',
    description: 'Batch completed | BAT-2026-0172 qty 55',
  },
  {
    timestamp: '2026-02-12 11:20',
    actionType: 'order',
    description: 'Status updated | PO-2026-0050 → In Progress',
  },
  {
    timestamp: '2026-02-11 14:30',
    actionType: 'incident',
    description: 'Incident declared | INC-2026-002 on BAT-2026-0185',
  },
  {
    timestamp: '2026-02-10 08:00',
    actionType: 'batch',
    description: 'Batch started | BAT-2026-0185 for PO-2026-0047',
  },
  {
    timestamp: '2026-02-09 17:00',
    actionType: 'batch',
    description: 'Batch completed | BAT-2026-0189 qty 25',
  },
  {
    timestamp: '2026-02-08 09:30',
    actionType: 'order',
    description: 'Status updated | PO-2026-0045 → In Progress',
  },
  {
    timestamp: '2026-02-07 13:00',
    actionType: 'batch',
    description: 'Batch started | BAT-2026-0188 for PO-2026-0045',
  },
  {
    timestamp: '2026-02-06 08:00',
    actionType: 'order',
    description: 'Order received | PO-2026-0045 AX hydraulic valve',
  },
]

// Helper functions
export function getOpenIncidentsCount(): number {
  return incidents.filter((i) => i.status === 'open').length
}

export function getActiveOrdersCount(): number {
  return productionOrders.filter((o) => o.status === 'in_progress').length
}

export function getBatchesInProgressCount(): number {
  return batches.filter((b) => b.status === 'in_progress').length
}

export function getCompletedTodayCount(): number {
  // For demo purposes, return 1
  return 1
}

export function getCriticalIncident(): Incident | undefined {
  return incidents.find((i) => i.status === 'open' && i.severity === 'critical')
}
