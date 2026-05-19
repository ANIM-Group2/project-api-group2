// Raw materials data
export interface RawMaterial {
  id: string
  code: string
  description: string
  supplier: string
  unit: string
  currentStock: number
  reserved: number
  safetyThreshold: number
  lastReplenishment: string
  stockHistory: { month: string; stock: number }[]
}

export const rawMaterials: RawMaterial[] = [
  {
    id: 'mat-1',
    code: 'MAT-ALU-6061',
    description: 'Aluminum 6061-T6 bar',
    supplier: 'MetalSupply France',
    unit: 'kg',
    currentStock: 2500,
    reserved: 450,
    safetyThreshold: 500,
    lastReplenishment: '2026-02-10',
    stockHistory: [
      { month: 'Sep', stock: 2200 },
      { month: 'Oct', stock: 2400 },
      { month: 'Nov', stock: 2100 },
      { month: 'Dec', stock: 2300 },
      { month: 'Jan', stock: 2600 },
      { month: 'Feb', stock: 2500 },
    ],
  },
  {
    id: 'mat-2',
    code: 'MAT-STEEL-304',
    description: '304L stainless steel plate',
    supplier: 'ArcelorMittal',
    unit: 'kg',
    currentStock: 1800,
    reserved: 320,
    safetyThreshold: 400,
    lastReplenishment: '2026-02-05',
    stockHistory: [
      { month: 'Sep', stock: 1500 },
      { month: 'Oct', stock: 1700 },
      { month: 'Nov', stock: 1600 },
      { month: 'Dec', stock: 1900 },
      { month: 'Jan', stock: 2000 },
      { month: 'Feb', stock: 1800 },
    ],
  },
  {
    id: 'mat-3',
    code: 'MAT-TITAN-GR5',
    description: 'Grade 5 titanium billet',
    supplier: 'TIMET Europe',
    unit: 'kg',
    currentStock: 350,
    reserved: 85,
    safetyThreshold: 100,
    lastReplenishment: '2026-01-28',
    stockHistory: [
      { month: 'Sep', stock: 280 },
      { month: 'Oct', stock: 320 },
      { month: 'Nov', stock: 290 },
      { month: 'Dec', stock: 380 },
      { month: 'Jan', stock: 400 },
      { month: 'Feb', stock: 350 },
    ],
  },
  {
    id: 'mat-4',
    code: 'MAT-VITON-75',
    description: 'Viton hardness 75 Shore',
    supplier: 'DuPont Polymers',
    unit: 'kg',
    currentStock: 180,
    reserved: 25,
    safetyThreshold: 50,
    lastReplenishment: '2026-02-01',
    stockHistory: [
      { month: 'Sep', stock: 150 },
      { month: 'Oct', stock: 140 },
      { month: 'Nov', stock: 160 },
      { month: 'Dec', stock: 200 },
      { month: 'Jan', stock: 190 },
      { month: 'Feb', stock: 180 },
    ],
  },
  {
    id: 'mat-5',
    code: 'MAT-ELECT-PCB',
    description: 'Multilayer PCB',
    supplier: 'Eurocircuits',
    unit: 'units',
    currentStock: 850,
    reserved: 180,
    safetyThreshold: 200,
    lastReplenishment: '2026-02-08',
    stockHistory: [
      { month: 'Sep', stock: 700 },
      { month: 'Oct', stock: 750 },
      { month: 'Nov', stock: 680 },
      { month: 'Dec', stock: 900 },
      { month: 'Jan', stock: 920 },
      { month: 'Feb', stock: 850 },
    ],
  },
  {
    id: 'mat-6',
    code: 'MAT-COMPO-RES',
    description: 'SMD resistors kit',
    supplier: 'RS Components',
    unit: 'sets',
    currentStock: 120,
    reserved: 15,
    safetyThreshold: 30,
    lastReplenishment: '2026-01-15',
    stockHistory: [
      { month: 'Sep', stock: 100 },
      { month: 'Oct', stock: 90 },
      { month: 'Nov', stock: 110 },
      { month: 'Dec', stock: 130 },
      { month: 'Jan', stock: 140 },
      { month: 'Feb', stock: 120 },
    ],
  },
  {
    id: 'mat-7',
    code: 'MAT-VIS-M8',
    description: 'M8 aerospace titanium screws',
    supplier: 'Lisi Aerospace',
    unit: 'units',
    currentStock: 15000,
    reserved: 2500,
    safetyThreshold: 3000,
    lastReplenishment: '2026-02-12',
    stockHistory: [
      { month: 'Sep', stock: 12000 },
      { month: 'Oct', stock: 13500 },
      { month: 'Nov', stock: 14000 },
      { month: 'Dec', stock: 16000 },
      { month: 'Jan', stock: 15500 },
      { month: 'Feb', stock: 15000 },
    ],
  },
  {
    id: 'mat-8',
    code: 'MAT-OIL-HYD',
    description: 'Skydrol hydraulic oil',
    supplier: 'Shell Aviation',
    unit: 'L',
    currentStock: 450,
    reserved: 60,
    safetyThreshold: 100,
    lastReplenishment: '2026-02-03',
    stockHistory: [
      { month: 'Sep', stock: 380 },
      { month: 'Oct', stock: 420 },
      { month: 'Nov', stock: 400 },
      { month: 'Dec', stock: 500 },
      { month: 'Jan', stock: 480 },
      { month: 'Feb', stock: 450 },
    ],
  },
]

export function getAvailableStock(material: RawMaterial): number {
  return material.currentStock - material.reserved
}

export function getStockStatus(material: RawMaterial): 'ok' | 'low' | 'critical' {
  const available = getAvailableStock(material)
  if (available <= material.safetyThreshold * 0.5) return 'critical'
  if (available <= material.safetyThreshold * 1.2) return 'low'
  return 'ok'
}

// Shipments data
export interface ShipmentItem {
  code: string
  quantity: number
  unit: string
}

export interface Shipment {
  id: string
  number: string
  type: 'inbound' | 'outbound'
  status: 'scheduled' | 'in-transit' | 'delivered' | 'delayed'
  origin: string
  destination: string
  carrier: string
  eta: string
  priority: 'standard' | 'express' | 'critical'
  items: ShipmentItem[]
}

export const shipments: Shipment[] = [
  {
    id: 'shp-1',
    number: 'SHP-IN-2026-001',
    type: 'inbound',
    status: 'in-transit',
    origin: 'TIMET Europe Munich',
    destination: 'AERONEXIS Toulouse',
    carrier: 'DB Schenker',
    eta: '2026-02-22',
    priority: 'express',
    items: [{ code: 'MAT-TITAN-GR5', quantity: 200, unit: 'kg' }],
  },
  {
    id: 'shp-2',
    number: 'SHP-OUT-2026-002',
    type: 'outbound',
    status: 'scheduled',
    origin: 'AERONEXIS Lyon',
    destination: 'Lufthansa Technik Hamburg',
    carrier: 'DB Schenker',
    eta: '2026-02-25',
    priority: 'critical',
    items: [
      { code: 'PROD-AX-2402', quantity: 150, unit: 'units' },
      { code: 'PROD-AX-2401', quantity: 50, unit: 'units' },
    ],
  },
  {
    id: 'shp-3',
    number: 'SHP-IN-2026-002',
    type: 'inbound',
    status: 'delayed',
    origin: 'ArcelorMittal Dunkirk',
    destination: 'AERONEXIS Lyon',
    carrier: 'Geodis',
    eta: '2026-02-15',
    priority: 'standard',
    items: [{ code: 'MAT-STEEL-304', quantity: 500, unit: 'kg' }],
  },
  {
    id: 'shp-4',
    number: 'SHP-OUT-2026-003',
    type: 'outbound',
    status: 'in-transit',
    origin: 'AERONEXIS Lyon',
    destination: 'Boeing Seattle',
    carrier: 'FedEx Freight',
    eta: '2026-02-28',
    priority: 'express',
    items: [{ code: 'PROD-ST-7801', quantity: 500, unit: 'units' }],
  },
  {
    id: 'shp-5',
    number: 'SHP-IN-2026-003',
    type: 'inbound',
    status: 'scheduled',
    origin: 'Eurocircuits Ghent',
    destination: 'AERONEXIS Lyon',
    carrier: 'TNT',
    eta: '2026-02-26',
    priority: 'express',
    items: [{ code: 'MAT-ELECT-PCB', quantity: 500, unit: 'units' }],
  },
]

// Reservations data
export interface Reservation {
  id: string
  materialId: string
  materialCode: string
  productionOrder: string
  quantity: number
  reservedAt: string
  status: 'active' | 'released'
}

export const reservations: Reservation[] = [
  {
    id: 'res-1',
    materialId: 'mat-1',
    materialCode: 'MAT-ALU-6061',
    productionOrder: 'PO-2026-0145',
    quantity: 200,
    reservedAt: '2026-02-10',
    status: 'active',
  },
  {
    id: 'res-2',
    materialId: 'mat-1',
    materialCode: 'MAT-ALU-6061',
    productionOrder: 'PO-2026-0148',
    quantity: 250,
    reservedAt: '2026-02-12',
    status: 'active',
  },
  {
    id: 'res-3',
    materialId: 'mat-2',
    materialCode: 'MAT-STEEL-304',
    productionOrder: 'PO-2026-0142',
    quantity: 320,
    reservedAt: '2026-02-08',
    status: 'active',
  },
  {
    id: 'res-4',
    materialId: 'mat-3',
    materialCode: 'MAT-TITAN-GR5',
    productionOrder: 'PO-2026-0140',
    quantity: 85,
    reservedAt: '2026-02-05',
    status: 'active',
  },
  {
    id: 'res-5',
    materialId: 'mat-4',
    materialCode: 'MAT-VITON-75',
    productionOrder: 'PO-2026-0151',
    quantity: 25,
    reservedAt: '2026-02-14',
    status: 'active',
  },
  {
    id: 'res-6',
    materialId: 'mat-5',
    materialCode: 'MAT-ELECT-PCB',
    productionOrder: 'PO-2026-0138',
    quantity: 180,
    reservedAt: '2026-02-02',
    status: 'active',
  },
  {
    id: 'res-7',
    materialId: 'mat-6',
    materialCode: 'MAT-COMPO-RES',
    productionOrder: 'PO-2026-0150',
    quantity: 15,
    reservedAt: '2026-02-13',
    status: 'active',
  },
  {
    id: 'res-8',
    materialId: 'mat-7',
    materialCode: 'MAT-VIS-M8',
    productionOrder: 'PO-2026-0147',
    quantity: 2500,
    reservedAt: '2026-02-11',
    status: 'active',
  },
  {
    id: 'res-9',
    materialId: 'mat-8',
    materialCode: 'MAT-OIL-HYD',
    productionOrder: 'PO-2026-0143',
    quantity: 60,
    reservedAt: '2026-02-09',
    status: 'active',
  },
]

// Alerts data
export interface Alert {
  id: string
  type: 'stock-low' | 'shipment-delayed' | 'reservation-conflict'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  affectedItem: string
  timestamp: string
  acknowledged: boolean
}

export const alerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'stock-low',
    severity: 'critical',
    title: 'MAT-COMPO-RES approaching safety threshold',
    description:
      'Available stock (105 sets) approaching safety threshold (30 sets) — reorder recommended',
    affectedItem: 'MAT-COMPO-RES',
    timestamp: '2026-02-18T09:15:00',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    type: 'shipment-delayed',
    severity: 'high',
    title: 'SHP-IN-2026-002 delayed',
    description:
      'MAT-STEEL-304 replenishment overdue since 2026-02-15, 2 production orders affected',
    affectedItem: 'SHP-IN-2026-002',
    timestamp: '2026-02-15T14:30:00',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    type: 'stock-low',
    severity: 'medium',
    title: 'MAT-TITAN-GR5 available stock low',
    description:
      'Available stock (265 kg) low relative to 3 active production orders consuming this material',
    affectedItem: 'MAT-TITAN-GR5',
    timestamp: '2026-02-17T11:45:00',
    acknowledged: false,
  },
  {
    id: 'alert-4',
    type: 'reservation-conflict',
    severity: 'low',
    title: 'MAT-ELECT-PCB reservation utilization low',
    description:
      'Reservation utilization at 21% — review if reservations are still needed',
    affectedItem: 'MAT-ELECT-PCB',
    timestamp: '2026-02-16T08:00:00',
    acknowledged: false,
  },
]
