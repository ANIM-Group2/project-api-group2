export type MaterialStatus = 'OK' | 'Low' | 'Critical'

export interface StockHistoryPoint {
  month: string
  stock: number
}

export interface Material {
  id: string
  code: string
  description: string
  stock: number
  unit: string
  reserved: number
  safetyThreshold: number
  supplier: string
  status: MaterialStatus
  stockHistory: StockHistoryPoint[]
}

export interface Reservation {
  id: string
  materialId: string
  materialCode: string
  productionOrder: string
  quantity: number
  unit: string
  reservedAt: string
  status: 'active' | 'released'
}

export type ShipmentType = 'Inbound' | 'Outbound'
export type ShipmentStatus = 'Scheduled' | 'In transit' | 'Delivered' | 'Delayed'
export type ShipmentPriority = 'standard' | 'express' | 'critical'

export interface Shipment {
  id: string
  type: ShipmentType
  status: ShipmentStatus
  origin: string
  destination: string
  carrier: string
  eta: string
  priority: ShipmentPriority
  items: string
}

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type AlertType = 'stock' | 'shipment' | 'reservation'

export interface Alert {
  id: string
  severity: AlertSeverity
  title: string
  description: string
  type: AlertType
  timestamp: string
  acknowledged: boolean
}

export const materials: Material[] = [
  {
    id: '1',
    code: 'MAT-ALU-6061',
    description: 'Aluminum 6061-T6 bar',
    stock: 2500,
    unit: 'kg',
    reserved: 450,
    safetyThreshold: 500,
    supplier: 'MetalSupply France',
    status: 'OK',
    stockHistory: [
      { month: 'Sep', stock: 2200 },
      { month: 'Oct', stock: 2400 },
      { month: 'Nov', stock: 2100 },
      { month: 'Dec', stock: 2600 },
      { month: 'Jan', stock: 2300 },
      { month: 'Feb', stock: 2500 },
    ],
  },
  {
    id: '2',
    code: 'MAT-STEEL-304',
    description: '304L stainless steel plate',
    stock: 1800,
    unit: 'kg',
    reserved: 320,
    safetyThreshold: 400,
    supplier: 'ArcelorMittal',
    status: 'OK',
    stockHistory: [
      { month: 'Sep', stock: 1600 },
      { month: 'Oct', stock: 1900 },
      { month: 'Nov', stock: 1700 },
      { month: 'Dec', stock: 2000 },
      { month: 'Jan', stock: 1850 },
      { month: 'Feb', stock: 1800 },
    ],
  },
  {
    id: '3',
    code: 'MAT-TITAN-GR5',
    description: 'Grade 5 titanium billet',
    stock: 350,
    unit: 'kg',
    reserved: 85,
    safetyThreshold: 100,
    supplier: 'TIMET Europe',
    status: 'Low',
    stockHistory: [
      { month: 'Sep', stock: 500 },
      { month: 'Oct', stock: 450 },
      { month: 'Nov', stock: 400 },
      { month: 'Dec', stock: 380 },
      { month: 'Jan', stock: 360 },
      { month: 'Feb', stock: 350 },
    ],
  },
  {
    id: '4',
    code: 'MAT-VITON-75',
    description: 'Viton hardness 75 Shore',
    stock: 180,
    unit: 'kg',
    reserved: 25,
    safetyThreshold: 50,
    supplier: 'DuPont Polymers',
    status: 'OK',
    stockHistory: [
      { month: 'Sep', stock: 200 },
      { month: 'Oct', stock: 190 },
      { month: 'Nov', stock: 185 },
      { month: 'Dec', stock: 195 },
      { month: 'Jan', stock: 180 },
      { month: 'Feb', stock: 180 },
    ],
  },
  {
    id: '5',
    code: 'MAT-ELECT-PCB',
    description: 'Multilayer PCB',
    stock: 850,
    unit: 'units',
    reserved: 180,
    safetyThreshold: 200,
    supplier: 'Eurocircuits',
    status: 'OK',
    stockHistory: [
      { month: 'Sep', stock: 700 },
      { month: 'Oct', stock: 800 },
      { month: 'Nov', stock: 750 },
      { month: 'Dec', stock: 900 },
      { month: 'Jan', stock: 820 },
      { month: 'Feb', stock: 850 },
    ],
  },
  {
    id: '6',
    code: 'MAT-COMPO-RES',
    description: 'SMD resistors kit',
    stock: 120,
    unit: 'sets',
    reserved: 15,
    safetyThreshold: 30,
    supplier: 'RS Components',
    status: 'Critical',
    stockHistory: [
      { month: 'Sep', stock: 200 },
      { month: 'Oct', stock: 180 },
      { month: 'Nov', stock: 160 },
      { month: 'Dec', stock: 150 },
      { month: 'Jan', stock: 130 },
      { month: 'Feb', stock: 120 },
    ],
  },
  {
    id: '7',
    code: 'MAT-VIS-M8',
    description: 'M8 aerospace titanium screws',
    stock: 15000,
    unit: 'units',
    reserved: 2500,
    safetyThreshold: 3000,
    supplier: 'Lisi Aerospace',
    status: 'OK',
    stockHistory: [
      { month: 'Sep', stock: 14000 },
      { month: 'Oct', stock: 16000 },
      { month: 'Nov', stock: 15500 },
      { month: 'Dec', stock: 14500 },
      { month: 'Jan', stock: 15200 },
      { month: 'Feb', stock: 15000 },
    ],
  },
  {
    id: '8',
    code: 'MAT-OIL-HYD',
    description: 'Skydrol hydraulic oil',
    stock: 450,
    unit: 'L',
    reserved: 60,
    safetyThreshold: 100,
    supplier: 'Shell Aviation',
    status: 'OK',
    stockHistory: [
      { month: 'Sep', stock: 500 },
      { month: 'Oct', stock: 480 },
      { month: 'Nov', stock: 460 },
      { month: 'Dec', stock: 490 },
      { month: 'Jan', stock: 470 },
      { month: 'Feb', stock: 450 },
    ],
  },
]

export const reservations: Reservation[] = [
  {
    id: 'RES-001',
    materialId: '1',
    materialCode: 'MAT-ALU-6061',
    productionOrder: 'OF-2026-0045',
    quantity: 450,
    unit: 'kg',
    reservedAt: '2026-02-01',
    status: 'active',
  },
  {
    id: 'RES-002',
    materialId: '2',
    materialCode: 'MAT-STEEL-304',
    productionOrder: 'OF-2026-0047',
    quantity: 320,
    unit: 'kg',
    reservedAt: '2026-02-03',
    status: 'active',
  },
  {
    id: 'RES-003',
    materialId: '3',
    materialCode: 'MAT-TITAN-GR5',
    productionOrder: 'OF-2026-0047',
    quantity: 85,
    unit: 'kg',
    reservedAt: '2026-02-04',
    status: 'active',
  },
  {
    id: 'RES-004',
    materialId: '5',
    materialCode: 'MAT-ELECT-PCB',
    productionOrder: 'OF-2026-0048',
    quantity: 90,
    unit: 'units',
    reservedAt: '2026-02-05',
    status: 'active',
  },
  {
    id: 'RES-005',
    materialId: '5',
    materialCode: 'MAT-ELECT-PCB',
    productionOrder: 'OF-2026-0056',
    quantity: 90,
    unit: 'units',
    reservedAt: '2026-02-10',
    status: 'active',
  },
  {
    id: 'RES-006',
    materialId: '7',
    materialCode: 'MAT-VIS-M8',
    productionOrder: 'OF-2026-0045',
    quantity: 1200,
    unit: 'units',
    reservedAt: '2026-02-06',
    status: 'active',
  },
  {
    id: 'RES-007',
    materialId: '7',
    materialCode: 'MAT-VIS-M8',
    productionOrder: 'OF-2026-0050',
    quantity: 1300,
    unit: 'units',
    reservedAt: '2026-02-08',
    status: 'active',
  },
  {
    id: 'RES-008',
    materialId: '8',
    materialCode: 'MAT-OIL-HYD',
    productionOrder: 'OF-2026-0045',
    quantity: 35,
    unit: 'L',
    reservedAt: '2026-02-06',
    status: 'active',
  },
  {
    id: 'RES-009',
    materialId: '8',
    materialCode: 'MAT-OIL-HYD',
    productionOrder: 'OF-2026-0054',
    quantity: 25,
    unit: 'L',
    reservedAt: '2026-02-09',
    status: 'active',
  },
]

export const shipments: Shipment[] = [
  {
    id: 'SHP-IN-2026-001',
    type: 'Inbound',
    status: 'In transit',
    origin: 'TIMET Europe Munich',
    destination: 'AERONEXIS Toulouse',
    carrier: 'DB Schenker',
    eta: '2026-02-22',
    priority: 'express',
    items: '200kg MAT-TITAN-GR5',
  },
  {
    id: 'SHP-OUT-2026-002',
    type: 'Outbound',
    status: 'Scheduled',
    origin: 'AERONEXIS Lyon',
    destination: 'Lufthansa Technik Hamburg',
    carrier: 'DB Schenker',
    eta: '2026-02-25',
    priority: 'critical',
    items: '150x PROD-AX-2402 + 50x PROD-AX-2401',
  },
  {
    id: 'SHP-IN-2026-002',
    type: 'Inbound',
    status: 'Delayed',
    origin: 'ArcelorMittal Dunkirk',
    destination: 'AERONEXIS Lyon',
    carrier: 'Geodis',
    eta: '2026-02-15',
    priority: 'standard',
    items: '500kg MAT-STEEL-304',
  },
  {
    id: 'SHP-OUT-2026-003',
    type: 'Outbound',
    status: 'In transit',
    origin: 'AERONEXIS Lyon',
    destination: 'Boeing Seattle',
    carrier: 'FedEx Freight',
    eta: '2026-02-28',
    priority: 'express',
    items: '500x PROD-ST-7801',
  },
  {
    id: 'SHP-IN-2026-003',
    type: 'Inbound',
    status: 'Scheduled',
    origin: 'Eurocircuits Ghent',
    destination: 'AERONEXIS Lyon',
    carrier: 'TNT',
    eta: '2026-02-26',
    priority: 'express',
    items: '500x MAT-ELECT-PCB',
  },
]

export const alerts: Alert[] = [
  {
    id: 'ALERT-001',
    severity: 'critical',
    title: 'Critical Stock Level',
    description:
      'MAT-COMPO-RES available stock (105 sets) approaching safety threshold — reorder recommended',
    type: 'stock',
    timestamp: '2026-02-18T09:30:00Z',
    acknowledged: false,
  },
  {
    id: 'ALERT-002',
    severity: 'high',
    title: 'Shipment Delayed',
    description:
      'SHP-IN-2026-002 delayed — MAT-STEEL-304 replenishment overdue since 2026-02-15',
    type: 'shipment',
    timestamp: '2026-02-16T14:00:00Z',
    acknowledged: false,
  },
  {
    id: 'ALERT-003',
    severity: 'medium',
    title: 'Low Stock Warning',
    description:
      'MAT-TITAN-GR5 available stock (265 kg) low relative to 3 active production orders',
    type: 'stock',
    timestamp: '2026-02-17T11:15:00Z',
    acknowledged: false,
  },
  {
    id: 'ALERT-004',
    severity: 'low',
    title: 'Reservation Review',
    description:
      'MAT-ELECT-PCB reservation utilization at 21% — review if reservations still needed',
    type: 'reservation',
    timestamp: '2026-02-18T08:00:00Z',
    acknowledged: false,
  },
]

export function getActiveAlerts() {
  return alerts.filter((a) => !a.acknowledged)
}

export function getMaterialById(id: string) {
  return materials.find((m) => m.id === id)
}

export function getMaterialByCode(code: string) {
  return materials.find((m) => m.code === code)
}
