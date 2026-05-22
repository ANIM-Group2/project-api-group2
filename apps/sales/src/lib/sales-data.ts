export interface Customer {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  type: 'Key Account' | 'Medium' | 'SME';
  totalRevenue: number;
  orderCount: number;
  contact?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface OrderLine {
  quantity: number;
  product: string;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  country: string;
  countryFlag: string;
  deliveryDate: string;
  amount: number;
  priority: 'Normal' | 'High' | 'Urgent';
  status: 'In Production' | 'Scheduled' | 'Completed';
  manager: string;
  orderLines?: OrderLine[];
}

export interface Approval {
  orderId: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export const customers: Customer[] = [
  { id: 'CLI001', name: 'Lufthansa Technik', country: 'Germany', countryFlag: '🇩🇪', type: 'Key Account', totalRevenue: 2850000, orderCount: 2, contact: { name: 'Hans Mueller', email: 'h.mueller@lht.com', phone: '+49 40 5070 0' } },
  { id: 'CLI002', name: 'Air France Industries', country: 'France', countryFlag: '🇫🇷', type: 'Key Account', totalRevenue: 1950000, orderCount: 1, contact: { name: 'Pierre Dupont', email: 'p.dupont@afiklm.com', phone: '+33 1 41 56 78 00' } },
  { id: 'CLI003', name: 'Boeing Supply Chain', country: 'USA', countryFlag: '🇺🇸', type: 'Key Account', totalRevenue: 3200000, orderCount: 2, contact: { name: 'John Smith', email: 'j.smith@boeing.com', phone: '+1 312 544 2000' } },
  { id: 'CLI004', name: 'Safran Aircraft Engines', country: 'France', countryFlag: '🇫🇷', type: 'Key Account', totalRevenue: 2100000, orderCount: 1, contact: { name: 'Marie Laurent', email: 'm.laurent@safrangroup.com', phone: '+33 1 40 60 80 00' } },
  { id: 'CLI005', name: 'Airbus Operations', country: 'France', countryFlag: '🇫🇷', type: 'Key Account', totalRevenue: 4500000, orderCount: 1, contact: { name: 'Jean-Claude Martin', email: 'jc.martin@airbus.com', phone: '+33 5 61 93 33 33' } },
  { id: 'CLI006', name: 'DroneTech Industries', country: 'UK', countryFlag: '🇬🇧', type: 'SME', totalRevenue: 450000, orderCount: 1, contact: { name: 'James Wilson', email: 'j.wilson@dronetech.co.uk', phone: '+44 20 7946 0958' } },
  { id: 'CLI007', name: 'AeroSystems Canada', country: 'Canada', countryFlag: '🇨🇦', type: 'Medium', totalRevenue: 780000, orderCount: 1, contact: { name: 'Michael Brown', email: 'm.brown@aerosystems.ca', phone: '+1 514 422 6000' } },
  { id: 'CLI008', name: 'Nordic Aviation Parts', country: 'Sweden', countryFlag: '🇸🇪', type: 'Medium', totalRevenue: 650000, orderCount: 1, contact: { name: 'Erik Lindqvist', email: 'e.lindqvist@nordicaviation.se', phone: '+46 8 797 0000' } },
  { id: 'CLI009', name: 'Iberia Maintenance', country: 'Spain', countryFlag: '🇪🇸', type: 'Medium', totalRevenue: 890000, orderCount: 1, contact: { name: 'Carlos Rodriguez', email: 'c.rodriguez@iberia.es', phone: '+34 91 587 8787' } },
  { id: 'CLI010', name: 'Emirates Engineering', country: 'UAE', countryFlag: '🇦🇪', type: 'Key Account', totalRevenue: 1650000, orderCount: 1, contact: { name: 'Ahmed Al-Rashid', email: 'a.alrashid@emirates.com', phone: '+971 4 708 1111' } },
];

export const orders: Order[] = [
  { id: 'CMD-2026-001', customerId: 'CLI001', customerName: 'Lufthansa Technik', country: 'Germany', countryFlag: '🇩🇪', deliveryDate: '2026-03-20', amount: 125000, priority: 'High', status: 'In Production', manager: 'Sophie Martin', orderLines: [{ quantity: 50, product: 'AX hydraulic valve', unitPrice: 1250 }, { quantity: 150, product: 'High-pressure fitting', unitPrice: 340 }] },
  { id: 'CMD-2026-002', customerId: 'CLI003', customerName: 'Boeing Supply Chain', country: 'USA', countryFlag: '🇺🇸', deliveryDate: '2026-03-05', amount: 89000, priority: 'Urgent', status: 'In Production', manager: 'Marc Dubois', orderLines: [{ quantity: 20, product: 'Reinforced drive shaft', unitPrice: 2890 }, { quantity: 5, product: 'Engine control module', unitPrice: 4200 }] },
  { id: 'CMD-2026-003', customerId: 'CLI005', customerName: 'Airbus Operations', country: 'France', countryFlag: '🇫🇷', deliveryDate: '2026-04-15', amount: 245000, priority: 'Normal', status: 'Scheduled', manager: 'Sophie Martin' },
  { id: 'CMD-2026-004', customerId: 'CLI002', customerName: 'Air France Industries', country: 'France', countryFlag: '🇫🇷', deliveryDate: '2026-03-15', amount: 67000, priority: 'High', status: 'In Production', manager: 'Julie Leroux' },
  { id: 'CMD-2026-005', customerId: 'CLI006', customerName: 'DroneTech Industries', country: 'UK', countryFlag: '🇬🇧', deliveryDate: '2026-03-01', amount: 34500, priority: 'Normal', status: 'Completed', manager: 'Marc Dubois' },
  { id: 'CMD-2026-006', customerId: 'CLI010', customerName: 'Emirates Engineering', country: 'UAE', countryFlag: '🇦🇪', deliveryDate: '2026-03-27', amount: 156000, priority: 'High', status: 'In Production', manager: 'Sophie Martin' },
  { id: 'CMD-2026-007', customerId: 'CLI004', customerName: 'Safran Aircraft Engines', country: 'France', countryFlag: '🇫🇷', deliveryDate: '2026-03-10', amount: 98000, priority: 'Urgent', status: 'In Production', manager: 'Julie Leroux', orderLines: [{ quantity: 15, product: 'Engine control module', unitPrice: 4200 }, { quantity: 100, product: 'High-pressure fitting', unitPrice: 340 }] },
  { id: 'CMD-2026-008', customerId: 'CLI007', customerName: 'AeroSystems Canada', country: 'Canada', countryFlag: '🇨🇦', deliveryDate: '2026-04-11', amount: 52000, priority: 'Normal', status: 'Scheduled', manager: 'Marc Dubois' },
  { id: 'CMD-2026-009', customerId: 'CLI008', customerName: 'Nordic Aviation Parts', country: 'Sweden', countryFlag: '🇸🇪', deliveryDate: '2026-03-25', amount: 71000, priority: 'Normal', status: 'In Production', manager: 'Julie Leroux' },
  { id: 'CMD-2026-010', customerId: 'CLI009', customerName: 'Iberia Maintenance', country: 'Spain', countryFlag: '🇪🇸', deliveryDate: '2026-04-09', amount: 89500, priority: 'High', status: 'Scheduled', manager: 'Sophie Martin' },
  { id: 'CMD-2026-011', customerId: 'CLI001', customerName: 'Lufthansa Technik', country: 'Germany', countryFlag: '🇩🇪', deliveryDate: '2026-03-30', amount: 142000, priority: 'Urgent', status: 'In Production', manager: 'Sophie Martin' },
  { id: 'CMD-2026-012', customerId: 'CLI003', customerName: 'Boeing Supply Chain', country: 'USA', countryFlag: '🇺🇸', deliveryDate: '2026-04-05', amount: 198000, priority: 'Normal', status: 'Scheduled', manager: 'Marc Dubois' },
];

export const revenueTrend = [
  { month: 'Oct', revenue: 1340000 },
  { month: 'Nov', revenue: 1290000 },
  { month: 'Dec', revenue: 1250000 },
  { month: 'Jan', revenue: 1180000 },
  { month: 'Feb', revenue: 1167000 },
];

export const salesMix = [
  { name: 'Hydraulic', value: 35, color: '#3b82f6' },
  { name: 'Mechanical', value: 28, color: '#8b5cf6' },
  { name: 'Electronics', value: 18, color: '#06b6d4' },
  { name: 'Drone', value: 13, color: '#10b981' },
  { name: 'Accessory', value: 6, color: '#f59e0b' },
];

export const managerPerformance = [
  { name: 'Sophie Martin', orders: 5, revenue: 757500 },
  { name: 'Marc Dubois', orders: 4, revenue: 368500 },
  { name: 'Julie Leroux', orders: 3, revenue: 236000 },
];

export const kpis = {
  otd: 88.5,
  activeOrders: 9,
  revenueThisMonth: 1167000,
  pendingApprovals: 4,
  revenueYTD: 6257000,
  avgOrder: 92000,
  keyAccounts: 5,
};

export const pendingApprovalIds = ['CMD-2026-002', 'CMD-2026-006', 'CMD-2026-007', 'CMD-2026-011'];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
