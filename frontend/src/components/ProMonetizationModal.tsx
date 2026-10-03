import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Check,
  Sparkles,
  ShieldCheck,
  Coffee,
  Copy,
  ExternalLink,
  Key,
  QrCode,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getPaymentSettings,
  saveOrder,
  redeemLicenseKey,
  type PaymentSettings,
} from '../data/adminPaymentStore';

interface ProMonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProMonetizationModal({ isOpen, onClose }: ProMonetizationModalProps) {
  const { user, isPro, upgradeToPro, openAuthModal } = useAuth();
  const [settings, setSettings] = useState<PaymentSettings>(getPaymentSettings());
  const [selectedPlan, setSelectedPlan] = useState<'lifetime' | 'coffee'>('lifetime');
  const [paymentTab, setPaymentTab] = useState<'qr' | 'card' | 'key'>('qr');

  // Form states
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [licenseInput, setLicenseInput] = useState('');
  const [keyError, setKeyError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getPaymentSettings());
      if (user) {
        setBuyerEmail(user.email);
        setBuyerName(user.name);
      }
      setSubmitted(false);
      setKeyError('');
      setValidationError('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const currentPrice = selectedPlan === 'lifetime'
    ? (settings.currency === 'INR' ? `₹${settings.inrPrice}` : `$${settings.usdPrice}`)
    : (settings.currency === 'INR' ? `₹${settings.supporterInr}` : `$${settings.supporterUsd}`);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleQrOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const email = (buyerEmail || user?.email || '').trim();
    if (!email) {
      setValidationError('Please enter your email address so we can activate Pro on your account.');
      return;
    }

    if (!transactionRef.trim()) {
      setValidationError('Please enter the 12-digit UPI reference (UTR) or Transaction ID from your payment app.');
      return;
    }

    // Save order in admin queue
    saveOrder({
      userEmail: email,
      userName: (buyerName || user?.name || email.split('@')[0]).trim(),
      plan: selectedPlan,
      amount: currentPrice,
      paymentMethod: 'qr_upi',
      transactionRef: transactionRef.trim(),
    });

    // Also automatically upgrade in session so buyer gets instant gratification
    upgradeToPro(email);
    setSubmitted(true);
  };

  const handleRedeemKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseInput.trim()) return;

    const email = buyerEmail.trim() || user?.email || 'buyer@sdp.dev';
    const success = redeemLicenseKey(licenseInput.trim(), email);
    if (success) {
      upgradeToPro();
      setSubmitted(true);
      setKeyError('');
    } else {
      setKeyError('Invalid or already redeemed activation code.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-surface border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors"
            title="Close modal"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 uppercase tracking-wider">
              {isPro ? '✨ Active Pro Member' : 'System Design Prep Pro'}
            </span>
            <span className="flex items-center text-xs text-yellow-300 font-semibold gap-1">
              <Sparkles size={13} /> High-ROI Engineering Investment
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {isPro ? 'You Have Full Pro Access!' : 'Upgrade to System Design Prep Pro'}
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            Instant access to 5 FAANG Architecture Blueprints (PDF), Staff Capacity Formula Sheets & Bottleneck Simulators.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Plan Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lifetime Pass */}
            <div
              onClick={() => setSelectedPlan('lifetime')}
              className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                selectedPlan === 'lifetime'
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/40'
                  : 'border-gray-700 hover:border-gray-600 bg-surface-light'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/20 text-primary">
                  Lifetime Pass
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-white font-mono">
                    {settings.currency === 'INR' ? `₹${settings.inrPrice}` : `$${settings.usdPrice}`}
                  </span>
                  <span className="text-xs text-gray-500 line-through block font-mono">
                    {settings.currency === 'INR' ? '₹2,999' : '$89'}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-white text-sm">Full Pro Architecture Vault</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Pay once. Get lifetime updates for every new case study, capacity calculator & vector blueprint.
              </p>
            </div>

            {/* Coffee Supporter */}
            <div
              onClick={() => setSelectedPlan('coffee')}
              className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                selectedPlan === 'coffee'
                  ? 'border-yellow-500 bg-yellow-500/10 ring-2 ring-yellow-500/40'
                  : 'border-gray-700 hover:border-gray-600 bg-surface-light'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                  Supporter Pass
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-white font-mono">
                    {settings.currency === 'INR' ? `₹${settings.supporterInr}` : `$${settings.supporterUsd}`}
                  </span>
                  <span className="text-xs text-gray-500 block">one-time tip</span>
                </div>
              </div>
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Coffee size={15} className="text-yellow-400" /> Buy Me a Coffee
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Support independent engineering tutorials, domain, and server hosting costs.
              </p>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="border border-gray-700/80 rounded-2xl bg-surface-light p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentTab('qr')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  paymentTab === 'qr'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <QrCode size={14} /> Scan Payment QR / UPI
              </button>

              {settings.stripeCheckoutUrl && (
                <button
                  type="button"
                  onClick={() => setPaymentTab('card')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                    paymentTab === 'card'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <CreditCard size={14} /> Credit Card / Stripe
                </button>
              )}

              <button
                type="button"
                onClick={() => setPaymentTab('key')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                  paymentTab === 'key'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Key size={14} /> Redeem Code
              </button>
            </div>

            {/* TAB: QR Code / UPI */}
            {paymentTab === 'qr' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* QR Image */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-md border border-gray-200">
                    <img
                      src={settings.qrCodeImage}
                      alt="Scan to Pay"
                      className="w-40 h-40 object-contain"
                    />
                    <span className="text-[10px] text-gray-600 font-semibold mt-1">
                      Scan via GPay / PhonePe / Paytm / Any App
                    </span>
                  </div>

                  {/* QR Payment Instructions */}
                  <div className="sm:col-span-7 space-y-2.5 text-xs">
                    <div className="bg-black/30 p-3 rounded-xl border border-gray-800 space-y-1.5">
                      <div className="text-[11px] text-gray-400">Total Amount to Pay:</div>
                      <div className="text-xl font-black text-green-400 font-mono">
                        {currentPrice}
                      </div>
                      <div className="text-[11px] text-gray-400 pt-1">
                        Payee: <span className="text-white font-medium">{settings.upiPayeeName}</span>
                      </div>
                      <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-gray-700 font-mono text-purple-300">
                        <span className="truncate">{settings.upiId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2 py-0.5 rounded bg-primary/20 hover:bg-primary/30 text-primary text-[11px] font-sans font-bold flex items-center gap-1 ml-2 shrink-0 transition-colors"
                        >
                          <Copy size={11} /> {copiedUpi ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-line">
                      {settings.instructions}
                    </p>
                  </div>
                </div>

                {/* Submit Verification Form */}
                {!submitted ? (
                  <form onSubmit={handleQrOrderSubmit} className="space-y-3 pt-2 border-t border-gray-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-gray-400 block mb-1">Your Email (for Pro access)</label>
                        <input
                          type="email"
                          required
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          placeholder="engineer@domain.com"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Transaction Ref / UTR Number</label>
                        <input
                          type="text"
                          required
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          placeholder="e.g. 412890123891 or Ref ID"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gray-700 text-white font-mono focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {validationError && (
                      <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{validationError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-green-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check size={15} />
                      <span>I've Paid — Confirm & Activate Pro</span>
                    </button>
                  </form>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center space-y-3 animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto text-xl">
                      <Check size={24} />
                    </div>
                    <h4 className="text-white font-bold text-base">Payment Submitted & Pro Activated!</h4>
                    <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                      Thank you! Reference <span className="font-mono text-green-300 font-bold">{transactionRef}</span> was recorded. Pro privileges have been unlocked on this account!
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                      <Link
                        to="/hld-case-studies"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-primary/25 transition-all flex items-center gap-1.5"
                      >
                        <Sparkles size={14} className="text-yellow-300" />
                        <span>Open Pro Blueprints & Staff Math</span>
                      </Link>
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Card / Stripe */}
            {paymentTab === 'card' && settings.stripeCheckoutUrl && (
              <div className="space-y-4 text-center py-2">
                <p className="text-xs text-gray-300">
                  Pay securely with Credit Card, Apple Pay, Google Pay, or International Banking via Stripe.
                </p>
                <a
                  href={settings.stripeCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-primary/25 transition-all"
                >
                  <span>Open Stripe Secure Checkout ({currentPrice})</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* TAB: Redeem Code */}
            {paymentTab === 'key' && (
              <form onSubmit={handleRedeemKey} className="space-y-3 py-1">
                <label className="text-xs text-gray-300 block">
                  Have an activation key or promo code? Enter it below:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={licenseInput}
                    onChange={(e) => setLicenseInput(e.target.value)}
                    placeholder="SDP-PRO-XXXX-XXXX"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-mono uppercase focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs transition-colors shrink-0"
                  >
                    Redeem Code
                  </button>
                </div>
                {keyError && <span className="text-xs text-red-400 block">{keyError}</span>}
              </form>
            )}
          </div>

          {/* Social Proof & Guarantee */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 pt-2 border-t border-gray-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-green-400" />
              100% Secure Transaction · Direct creator verification
            </span>
            {!user && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal();
                }}
                className="text-primary hover:underline text-xs"
              >
                Sign In to link account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
