import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Shield,
  QrCode,
  CheckCircle,
  Key,
  DollarSign,
  RefreshCw,
  Copy,
  Sparkles,
  UserCheck,
  Check,
  Users,
  Search,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getPaymentSettings,
  savePaymentSettings,
  getOrders,
  updateOrderStatus,
  getLicenseKeys,
  generateLicenseKey,
  getActiveProUsers,
  revokeProAccessByEmail,
  type PaymentSettings,
  type OrderSubmission,
  type LicenseKey,
  type ActiveProUser,
} from '../data/adminPaymentStore';

export default function AdminPage() {
  const { user } = useAuth();
  const isOwner = user?.email?.toLowerCase() === 'baljindersinghcse@gmail.com';
  const [activeTab, setActiveTab] = useState<'payments' | 'orders' | 'licenses' | 'users'>('users');

  // Settings State
  const [settings, setSettings] = useState<PaymentSettings>(getPaymentSettings());
  const [orders, setOrders] = useState<OrderSubmission[]>(getOrders());
  const [licenses, setLicenses] = useState<LicenseKey[]>(getLicenseKeys());
  const [activeUsers, setActiveUsers] = useState<ActiveProUser[]>(getActiveProUsers());
  const [userSearch, setUserSearch] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualSuccess, setManualSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setSettings(getPaymentSettings());
    setOrders(getOrders());
    setLicenses(getLicenseKeys());
    setActiveUsers(getActiveProUsers());
  }, []);

  // QR Code Image Upload Handler (converts to base64 Data URL)
  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({ ...prev, qrCodeImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleStatusUpdate = (orderId: string, status: 'approved' | 'rejected') => {
    const updated = updateOrderStatus(orderId, status);
    setOrders([...updated]);
  };

  const handleGenerateKey = (plan: 'lifetime' | 'coffee') => {
    generateLicenseKey(plan);
    setLicenses([...getLicenseKeys()]);
  };

  const handleManualGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;

    try {
      const proList = JSON.parse(localStorage.getItem('sdp_verified_pro_emails') || '[]');
      if (!proList.includes(manualEmail.trim().toLowerCase())) {
        proList.push(manualEmail.trim().toLowerCase());
        localStorage.setItem('sdp_verified_pro_emails', JSON.stringify(proList));
      }
      setManualSuccess(true);
      setManualEmail('');
      setTimeout(() => setManualSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Non-owners cannot see or access this page at all: silently redirect to home
  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const approvedCount = orders.filter((o) => o.status === 'approved').length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Admin Top Header */}
      <div className="bg-gradient-to-r from-purple-950/40 via-surface to-surface-light border border-purple-500/30 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Shield size={13} /> Master Admin
            </span>
            <span className="text-xs text-gray-400 font-mono">Logged in as {user?.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Creator & Payment Control Center
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Set up receiving payment QR codes, UPI handles, Stripe links, and approve customer orders.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-black/30 border border-gray-800 rounded-xl px-3.5 py-2 text-center">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Pending Verifications</div>
            <div className="text-lg font-black text-yellow-400 font-mono">{pendingCount}</div>
          </div>
          <div className="bg-black/30 border border-gray-800 rounded-xl px-3.5 py-2 text-center">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Active Pro Orders</div>
            <div className="text-lg font-black text-green-400 font-mono">{approvedCount}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'users'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users size={14} />
          <span>Active Pro Members</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">
            {activeUsers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'orders'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <DollarSign size={14} />
          <span>Customer Orders & Approvals</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-yellow-400 text-black">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payments'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <QrCode size={14} />
          <span>Payment & QR Setup</span>
        </button>

        <button
          onClick={() => setActiveTab('licenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'licenses'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Key size={14} />
          <span>License Keys & Manual Grants</span>
        </button>
      </div>

      {/* ── TAB 0: Active Pro Members Directory ── */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Top Info & Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                Total Active Pro Members
              </span>
              <div className="text-3xl font-black text-white font-mono flex items-center gap-2">
                <Users size={22} className="text-primary" />
                <span>{activeUsers.length}</span>
              </div>
              <span className="text-[11px] text-green-400">All features & Q&A unlocked</span>
            </div>

            <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 space-y-1">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                Est. Paid Revenue
              </span>
              <div className="text-3xl font-black text-green-400 font-mono">
                ₹{activeUsers.length * 999}
              </div>
              <span className="text-[11px] text-gray-400">Direct via Google Pay & UPI</span>
            </div>

            <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                  Firebase Cloud Directory
                </span>
                <p className="text-[11px] text-gray-300 mt-1">
                  View all Google OAuth accounts in real time.
                </p>
              </div>
              <a
                href="https://console.firebase.google.com/project/sdp-prep/authentication/users"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-bold"
              >
                <span>Open Firebase Users Console</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Directory Table */}
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-primary" /> Active Pro Customer Directory
                </h3>
                <p className="text-xs text-gray-400">
                  Real-time list of members with lifetime access to all blueprints and staff solutions.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search member email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveUsers(getActiveProUsers())}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-gray-700 transition-colors"
                  title="Refresh users"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-800 bg-black/20 text-gray-400 uppercase font-semibold">
                    <th className="text-left px-4 py-3">Member</th>
                    <th className="text-left px-4 py-3">Access Tier</th>
                    <th className="text-left px-4 py-3">Amount</th>
                    <th className="text-left px-4 py-3">Source</th>
                    <th className="text-left px-4 py-3">Activated Date</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {activeUsers
                    .filter((u) =>
                      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase()))
                    )
                    .map((member, i) => (
                      <tr key={i} className="hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white font-bold flex items-center justify-center text-xs uppercase shrink-0">
                              {member.name ? member.name[0] : member.email[0]}
                            </div>
                            <div>
                              <div className="font-bold text-white">{member.name || 'Pro Candidate'}</div>
                              <div className="text-[11px] text-gray-400 font-mono">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-primary text-[11px] uppercase">
                            {member.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-green-400 font-semibold">
                          {member.amount || '₹999'}
                        </td>
                        <td className="px-4 py-3.5 text-gray-300 font-mono text-[11px]">
                          {member.source}
                        </td>
                        <td className="px-4 py-3.5 text-gray-400">
                          {new Date(member.activatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/40">
                            <Sparkles size={10} className="text-yellow-300" />
                            <span>Active Pro</span>
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Revoke Pro access for ${member.email}?`)) {
                                revokeProAccessByEmail(member.email);
                                setActiveUsers(getActiveProUsers());
                                setOrders(getOrders());
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800 transition-colors"
                            title="Revoke Pro Access"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {activeUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500 text-xs">
                        No active Pro members recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 1: Payment & QR Setup ── */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: QR Code Upload & Live Preview (5 cols) */}
            <div className="lg:col-span-5 bg-surface-light border border-gray-700/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode size={16} className="text-primary" /> Your Receiving Payment QR Code
              </h3>
              <p className="text-xs text-gray-400">
                Upload your UPI QR code (GooglePay, PhonePe, Paytm, BHIM) or PayPal QR. Buyers will see this directly when checking out!
              </p>

              {/* QR Image Box */}
              <div className="bg-black/40 border border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3">
                <img
                  src={settings.qrCodeImage}
                  alt="Payment QR Code Preview"
                  className="w-48 h-48 object-contain rounded-xl bg-white p-2 shadow-lg"
                />
                <div className="text-xs text-gray-400 font-mono">
                  {settings.upiId || 'No UPI ID set'}
                </div>
              </div>

              {/* Upload Button */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Upload New QR Code Image (from your device):
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer bg-black/30 rounded-xl p-1 border border-gray-700"
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  PNG, JPG, or SVG. Stored instantly in your browser session.
                </span>
              </div>
            </div>

            {/* Right: Payment Handles & Pricing (7 cols) */}
            <div className="lg:col-span-7 bg-surface-light border border-gray-700/80 rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign size={16} className="text-green-400" /> Payment Handles & Pricing Options
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UPI ID */}
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">
                    Your UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    placeholder="e.g. yourname@okaxis"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Payee Name */}
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">
                    Payee Name (displayed to user)
                  </label>
                  <input
                    type="text"
                    value={settings.upiPayeeName}
                    onChange={(e) => setSettings({ ...settings, upiPayeeName: e.target.value })}
                    placeholder="e.g. System Design Prep"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Stripe Link */}
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">
                    Stripe / LemonSqueezy Checkout URL (optional)
                  </label>
                  <input
                    type="url"
                    value={settings.stripeCheckoutUrl}
                    onChange={(e) => setSettings({ ...settings, stripeCheckoutUrl: e.target.value })}
                    placeholder="https://buy.stripe.com/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                {/* PayPal / BuyMeACoffee */}
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">
                    PayPal / BuyMeACoffee Link
                  </label>
                  <input
                    type="url"
                    value={settings.paypalUrl}
                    onChange={(e) => setSettings({ ...settings, paypalUrl: e.target.value })}
                    placeholder="https://buymeacoffee.com/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Lifetime Price USD */}
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">
                    Lifetime Price (USD $)
                  </label>
                  <input
                    type="number"
                    value={settings.usdPrice}
                    onChange={(e) => setSettings({ ...settings, usdPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Lifetime Price INR */}
                <div>
                  <label className="text-xs text-gray-300 font-semibold block mb-1">
                    Lifetime Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={settings.inrPrice}
                    onChange={(e) => setSettings({ ...settings, inrPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Authenticated Owner Account */}
                <div className="sm:col-span-2 bg-purple-950/20 border border-purple-500/30 p-3.5 rounded-xl space-y-1">
                  <div className="text-xs text-purple-200 font-bold flex items-center gap-1.5">
                    <Shield size={14} className="text-purple-400" />
                    <span>Authenticated Owner Account</span>
                  </div>
                  <p className="text-xs text-white font-mono font-semibold">
                    baljindersinghcse@gmail.com
                  </p>
                  <span className="text-[10px] text-gray-400 block">
                    Admin access is securely linked to your verified Google account. No manual passwords required.
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="text-xs text-gray-300 font-semibold block mb-1">
                  Customer Payment Instructions
                </label>
                <textarea
                  rows={3}
                  value={settings.instructions}
                  onChange={(e) => setSettings({ ...settings, instructions: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-sans focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <span className="text-xs text-gray-400">
                  Settings are active instantly across all checkout modals.
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-primary/25 transition-all"
                >
                  Save Payment Settings
                </button>
              </div>

              {saveSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={15} /> Payment settings and QR code updated successfully!
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 2: Customer Orders & Approvals ── */}
      {activeTab === 'orders' && (
        <div className="space-y-4 bg-surface-light border border-gray-700/80 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Payment Verification Requests</h3>
              <p className="text-xs text-gray-400">
                When buyers pay via QR code or UPI, they submit their transaction reference here for 1-click approval.
              </p>
            </div>
            <button
              onClick={() => setOrders(getOrders())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium border border-gray-700 transition-colors"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 bg-black/20 text-gray-400 uppercase font-semibold">
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Plan / Amount</th>
                  <th className="text-left px-4 py-3">Payment Method</th>
                  <th className="text-left px-4 py-3">Transaction Reference</th>
                  <th className="text-left px-4 py-3">Submitted</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{order.userName || 'Buyer'}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{order.userEmail}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-primary uppercase text-[11px]">
                        {order.plan}
                      </span>
                      <span className="block text-gray-300 font-mono">{order.amount}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-300 font-mono">
                      {order.paymentMethod === 'qr_upi' ? '📱 UPI / QR' : '💳 Stripe / Web'}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-purple-300 font-semibold select-all">
                      {order.transactionRef}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400">
                      {new Date(order.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'approved'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : order.status === 'rejected'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {order.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'approved')}
                            className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            Approve Pro
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 font-medium text-xs transition-all border border-red-800"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-gray-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: License Keys & Manual Grants ── */}
      {activeTab === 'licenses' && (
        <div className="space-y-6">
          {/* Manual Email Grant */}
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck size={16} className="text-primary" /> Manually Grant Pro Access by Email
            </h3>
            <p className="text-xs text-gray-400">
              Enter any candidate or colleague's email address to immediately grant them lifetime Pro access.
            </p>
            <form onSubmit={handleManualGrant} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                placeholder="colleague@google.com"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs transition-colors"
              >
                Grant Pro
              </button>
            </form>
            {manualSuccess && (
              <span className="text-xs text-green-400 font-semibold block">
                ✓ Pro access successfully granted!
              </span>
            )}
          </div>

          {/* License Key Generator */}
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key size={16} className="text-yellow-400" /> One-Time License Activation Codes
                </h3>
                <p className="text-xs text-gray-400">
                  Generate gift or redeemable promo codes for giveaways, beta testers, or manual sales.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerateKey('lifetime')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={13} /> Generate Lifetime Key
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-800 bg-black/20 text-gray-400 uppercase font-semibold">
                    <th className="text-left px-4 py-3">License Key</th>
                    <th className="text-left px-4 py-3">Plan</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Created</th>
                    <th className="text-right px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {licenses.map((lic, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-white select-all">
                        {lic.key}
                      </td>
                      <td className="px-4 py-3 font-semibold uppercase text-primary text-[11px]">
                        {lic.plan}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            lic.isUsed
                              ? 'bg-gray-800 text-gray-400'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}
                        >
                          {lic.isUsed ? `Used by ${lic.usedByEmail || 'user'}` : 'Active / Ready'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(lic.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleCopy(lic.key)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          {copiedKey === lic.key ? (
                            <>
                              <Check size={12} className="text-green-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Copy Key
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
