// adminPaymentStore.ts
// Store for Admin Payment Configuration, QR Codes, and Order Approvals

export interface PaymentSettings {
  upiId: string;
  upiPayeeName: string;
  qrCodeImage: string; // URL or base64 data URL
  stripeCheckoutUrl: string;
  paypalUrl: string;
  buymeacoffeeUrl: string;
  currency: 'USD' | 'INR';
  usdPrice: number;
  inrPrice: number;
  supporterUsd: number;
  supporterInr: number;
  instructions: string;
}

export interface OrderSubmission {
  id: string;
  userEmail: string;
  userName: string;
  plan: 'lifetime' | 'coffee';
  amount: string;
  paymentMethod: 'qr_upi' | 'stripe' | 'paypal' | 'other';
  transactionRef: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface LicenseKey {
  key: string;
  plan: 'lifetime' | 'coffee';
  isUsed: boolean;
  usedByEmail?: string;
  createdAt: string;
}

// Built-in default SVG QR code placeholder
export const DEFAULT_QR_CODE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%23ffffff"/><g fill="%23111827"><rect x="20" y="20" width="40" height="40" fill="%234f46e5"/><rect x="26" y="26" width="28" height="28" fill="%23ffffff"/><rect x="32" y="32" width="16" height="16" fill="%234f46e5"/><rect x="140" y="20" width="40" height="40" fill="%234f46e5"/><rect x="146" y="26" width="28" height="28" fill="%23ffffff"/><rect x="152" y="32" width="16" height="16" fill="%234f46e5"/><rect x="20" y="140" width="40" height="40" fill="%234f46e5"/><rect x="26" y="146" width="28" height="28" fill="%23ffffff"/><rect x="32" y="152" width="16" height="16" fill="%234f46e5"/><rect x="75" y="25" width="10" height="10"/><rect x="95" y="25" width="15" height="10"/><rect x="115" y="25" width="10" height="15"/><rect x="75" y="45" width="15" height="10"/><rect x="100" y="45" width="20" height="10"/><rect x="25" y="75" width="10" height="15"/><rect x="45" y="75" width="15" height="10"/><rect x="75" y="75" width="10" height="10"/><rect x="95" y="75" width="10" height="10"/><rect x="115" y="75" width="15" height="10"/><rect x="145" y="75" width="10" height="15"/><rect x="165" y="75" width="10" height="10"/><rect x="25" y="100" width="15" height="10"/><rect x="50" y="95" width="10" height="20"/><rect x="75" y="95" width="20" height="10"/><rect x="105" y="95" width="10" height="15"/><rect x="125" y="95" width="15" height="10"/><rect x="155" y="100" width="20" height="10"/><rect x="75" y="115" width="10" height="15"/><rect x="95" y="115" width="15" height="10"/><rect x="120" y="115" width="10" height="15"/><rect x="140" y="115" width="15" height="10"/><rect x="165" y="115" width="10" height="10"/><rect x="75" y="145" width="15" height="10"/><rect x="100" y="140" width="10" height="20"/><rect x="120" y="145" width="15" height="10"/><rect x="145" y="140" width="10" height="15"/><rect x="165" y="145" width="10" height="10"/><rect x="75" y="165" width="10" height="15"/><rect x="95" y="165" width="15" height="10"/><rect x="120" y="165" width="20" height="10"/><rect x="150" y="165" width="10" height="10"/><rect x="170" y="165" width="10" height="15"/></g><text x="100" y="194" font-family="sans-serif" font-size="9" fill="%236b7280" text-anchor="middle">SCAN TO PAY (UPI / QR)</text></svg>`;

const SETTINGS_KEY = 'sdp_admin_payment_settings';
const ORDERS_KEY = 'sdp_admin_orders';
const LICENSES_KEY = 'sdp_admin_licenses';

const DEFAULT_SETTINGS: PaymentSettings = {
  upiId: 'baljindersinghcse@okhdfcbank',
  upiPayeeName: 'Baljinder Singh',
  qrCodeImage: '/upi-qr.jpg',
  stripeCheckoutUrl: 'https://buy.stripe.com/test_systemdesignprep',
  paypalUrl: 'https://paypal.me/systemdesignprep',
  buymeacoffeeUrl: 'https://buymeacoffee.com/systemdesignprep',
  currency: 'INR',
  usdPrice: 29,
  inrPrice: 999,
  supporterUsd: 5,
  supporterInr: 199,
  instructions: '1. Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, BHIM) or click "Open in UPI App".\n2. Complete the payment of ₹999 for Lifetime Pro Pass.\n3. Click "I\'ve Paid — Activate Pro" below for instant access!',
};

const INITIAL_ORDERS: OrderSubmission[] = [
  {
    id: 'ord_101',
    userEmail: 'alex.chen@gmail.com',
    userName: 'Alex Chen',
    plan: 'lifetime',
    amount: '$29',
    paymentMethod: 'qr_upi',
    transactionRef: 'UPI-REF-987456321',
    status: 'approved',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord_102',
    userEmail: 'priya.sharma@outlook.com',
    userName: 'Priya Sharma',
    plan: 'lifetime',
    amount: '₹999',
    paymentMethod: 'qr_upi',
    transactionRef: 'UTR-20261002-88741',
    status: 'pending',
    submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

const INITIAL_LICENSES: LicenseKey[] = [
  { key: 'SDP-PRO-2026-ALPHA', plan: 'lifetime', isUsed: false, createdAt: new Date().toISOString() },
  { key: 'SDP-PRO-2026-BETA', plan: 'lifetime', isUsed: false, createdAt: new Date().toISOString() },
  { key: 'SDP-PRO-VIP-GIFT', plan: 'lifetime', isUsed: false, createdAt: new Date().toISOString() },
];

export function getPaymentSettings(): PaymentSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    let modified = false;
    if (!parsed.upiId || parsed.upiId === 'systemdesignprep@okaxis') {
      parsed.upiId = 'baljindersinghcse@okhdfcbank';
      parsed.upiPayeeName = 'Baljinder Singh';
      modified = true;
    }
    if (!parsed.qrCodeImage || parsed.qrCodeImage.startsWith('data:image/svg+xml') || parsed.qrCodeImage === DEFAULT_QR_CODE) {
      parsed.qrCodeImage = '/upi-qr.jpg';
      modified = true;
    }
    if (parsed.currency !== 'INR') {
      parsed.currency = 'INR';
      modified = true;
    }
    if (modified) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function savePaymentSettings(settings: PaymentSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getOrders(): OrderSubmission[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveOrder(order: Omit<OrderSubmission, 'id' | 'status' | 'submittedAt'>): OrderSubmission {
  const orders = getOrders();
  const newOrder: OrderSubmission = {
    ...order,
    id: `ord_${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: 'approved' | 'rejected'): OrderSubmission[] {
  const orders = getOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));

  // If approved, also upgrade the user if they match in auth
  if (status === 'approved') {
    const target = updated.find((o) => o.id === orderId);
    if (target) {
      grantProAccessByEmail(target.userEmail);
    }
  }

  return updated;
}

export function getLicenseKeys(): LicenseKey[] {
  try {
    const raw = localStorage.getItem(LICENSES_KEY);
    if (!raw) {
      localStorage.setItem(LICENSES_KEY, JSON.stringify(INITIAL_LICENSES));
      return INITIAL_LICENSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LICENSES;
  }
}

export function generateLicenseKey(plan: 'lifetime' | 'coffee'): LicenseKey {
  const keys = getLicenseKeys();
  const randomSegment = Math.random().toString(36).substring(2, 6).toUpperCase();
  const newKey: LicenseKey = {
    key: `SDP-${plan === 'lifetime' ? 'LIFETIME' : 'SUPPORTER'}-${randomSegment}-${Date.now().toString().slice(-4)}`,
    plan,
    isUsed: false,
    createdAt: new Date().toISOString(),
  };
  keys.unshift(newKey);
  localStorage.setItem(LICENSES_KEY, JSON.stringify(keys));
  return newKey;
}

export function redeemLicenseKey(keyStr: string, userEmail: string): boolean {
  const keys = getLicenseKeys();
  const cleanKey = keyStr.trim().toUpperCase();
  const matchIndex = keys.findIndex((k) => k.key.toUpperCase() === cleanKey && !k.isUsed);

  if (matchIndex === -1) {
    return false;
  }

  keys[matchIndex].isUsed = true;
  keys[matchIndex].usedByEmail = userEmail;
  localStorage.setItem(LICENSES_KEY, JSON.stringify(keys));
  grantProAccessByEmail(userEmail);
  return true;
}

function grantProAccessByEmail(email: string) {
  try {
    const userRaw = localStorage.getItem('sdp_current_user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      if (user.email.toLowerCase() === email.toLowerCase()) {
        user.isPro = true;
        localStorage.setItem('sdp_current_user', JSON.stringify(user));
      }
    }
    // Also save in verified list
    const proList = JSON.parse(localStorage.getItem('sdp_verified_pro_emails') || '[]');
    if (!proList.includes(email.toLowerCase())) {
      proList.push(email.toLowerCase());
      localStorage.setItem('sdp_verified_pro_emails', JSON.stringify(proList));
    }
  } catch (err) {
    console.error(err);
  }
}
