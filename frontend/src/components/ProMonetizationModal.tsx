import React, { useState, useEffect } from 'react';
import {
  X,
  Coffee,
  Copy,
  Heart,
  MessageSquareHeart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getPaymentSettings,
  saveOrder,
  type PaymentSettings,
} from '../data/adminPaymentStore';

interface ProMonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIP_TIERS = [
  { id: '1_coffee', label: '1 Coffee', amountINR: 99, amountUSD: 2, icon: '☕' },
  { id: '2_coffee', label: '2 Coffees', amountINR: 199, amountUSD: 5, icon: '☕☕', popular: true },
  { id: 'pizza', label: 'Coffee & Pizza', amountINR: 499, amountUSD: 10, icon: '🍕' },
  { id: 'patron', label: 'Patron Supporter', amountINR: 999, amountUSD: 25, icon: '🏆' },
];

export default function ProMonetizationModal({ isOpen, onClose }: ProMonetizationModalProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PaymentSettings>(getPaymentSettings());
  const [selectedTier, setSelectedTier] = useState(TIP_TIERS[1]); // 2 coffees default
  const [supporterName, setSupporterName] = useState('');
  const [supporterEmail, setSupporterEmail] = useState('');
  const [supporterNote, setSupporterNote] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submittedNote, setSubmittedNote] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEnlargedQr, setShowEnlargedQr] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getPaymentSettings());
      if (user) {
        setSupporterName(user.name);
        setSupporterEmail(user.email);
      }
      setSubmittedNote(false);
      setIsSendingEmail(false);
      setCopiedUpi(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const currentPrice = settings.currency === 'INR' ? `₹${selectedTier.amountINR}` : `$${selectedTier.amountUSD}`;
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.upiPayeeName)}&am=${selectedTier.amountINR}&cu=INR&tn=${encodeURIComponent('Coffee Tip - System Design Prep')}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);
    const email = supporterEmail || user?.email || 'supporter@sdp.dev';
    const name = supporterName || user?.name || 'Fellow Engineer';

    // 1. Record in local store
    saveOrder({
      userEmail: email,
      userName: name,
      plan: 'coffee',
      amount: currentPrice,
      paymentMethod: 'qr_upi',
      transactionRef: supporterNote ? `NOTE: ${supporterNote.slice(0, 50)}` : 'COFFEE-TIP-SENT',
    });

    // 2. Dispatch real-time email notification directly to Baljinder's inbox
    try {
      await fetch('https://formsubmit.co/ajax/baljindersinghcse@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `☕ New Coffee Tip (${currentPrice}) from ${name}`,
          SupporterName: name,
          SupporterEmail: email,
          TipAmount: currentPrice,
          SupportTier: selectedTier.label,
          PersonalNote: supporterNote || 'Sent coffee tip via Google Pay / UPI',
          SubmittedAt: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
        }),
      });
    } catch (err) {
      console.warn('FormSubmit notification error:', err);
    } finally {
      setIsSendingEmail(false);
      setSubmittedNote(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-surface border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient banner */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 uppercase tracking-wider flex items-center gap-1">
              <Coffee size={13} /> 100% Free & Open Platform
            </span>
            <span className="flex items-center text-xs text-yellow-200 font-semibold gap-1">
              <Heart size={13} className="text-red-300 fill-red-300" /> Community Supported
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Buy Me a Coffee ☕
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            All 5 architecture case studies, formulas & simulators are free. If this platform helped you, consider supporting server and domain costs!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Tip Tier Selector */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2.5">
              Select Your Support Tier
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TIP_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                    selectedTier.id === tier.id
                      ? 'border-yellow-400 bg-yellow-500/15 ring-2 ring-yellow-400/40 text-white'
                      : 'border-gray-700 hover:border-gray-600 bg-surface-light text-gray-400'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase px-2 py-0.2 rounded-full bg-yellow-400 text-gray-950 shadow-sm">
                      Popular
                    </span>
                  )}
                  <span className="text-xl block mb-1">{tier.icon}</span>
                  <div className="text-xs font-bold text-white">{tier.label}</div>
                  <div className="text-xs font-mono font-bold text-yellow-400 mt-0.5">
                    {settings.currency === 'INR' ? `₹${tier.amountINR}` : `$${tier.amountUSD}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Card / QR Code */}
          <div className="border border-gray-700/80 rounded-2xl bg-surface-light p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* QR Image Box */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 text-gray-900">
                <div className="text-center mb-1">
                  <span className="font-bold text-xs text-gray-900 block tracking-tight">
                    {settings.upiPayeeName}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">Verified Google Pay</span>
                </div>

                <div
                  className="cursor-pointer relative overflow-hidden rounded-xl bg-white p-1 shadow-inner border border-gray-200"
                  onClick={() => setShowEnlargedQr(!showEnlargedQr)}
                  title="Click to toggle large QR"
                >
                  <img
                    src={settings.qrCodeImage}
                    alt="Scan UPI QR"
                    className="w-36 h-36 object-contain rounded-lg transition-transform hover:scale-105"
                  />
                </div>

                <span className="text-[10px] text-gray-600 font-semibold mt-1.5 flex items-center gap-1">
                  <span>📸 Scan with any UPI App</span>
                </span>

                <a
                  href={upiDeepLink}
                  className="mt-2 w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold text-center shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>📱 Open in UPI App ({currentPrice})</span>
                </a>
              </div>

              {/* Instructions & Details */}
              <div className="sm:col-span-7 space-y-2.5 text-xs">
                <div className="bg-black/40 p-3 rounded-xl border border-gray-800 space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] text-gray-400">Coffee Amount:</span>
                    <span className="text-xl font-black text-yellow-400 font-mono">
                      {currentPrice}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Payee: <span className="text-white font-semibold">{settings.upiPayeeName}</span>
                  </div>
                  <div className="flex items-center justify-between bg-black/60 p-2 rounded-lg border border-gray-700 font-mono text-purple-300">
                    <span className="truncate select-all">{settings.upiId}</span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2 py-0.5 rounded bg-primary/20 hover:bg-primary/30 text-primary text-[11px] font-sans font-bold flex items-center gap-1 ml-2 shrink-0 transition-colors cursor-pointer"
                    >
                      <Copy size={11} /> {copiedUpi ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-gray-800">
                  Scan with Google Pay, PhonePe, Paytm, or BHIM. Every contribution directly funds cloud server compute, domain renewal, and creating new system design case studies!
                </p>
              </div>
            </div>

            {/* Leave a Note & Confirmation */}
            {!submittedNote ? (
              <form onSubmit={handleNoteSubmit} className="space-y-2.5 pt-3 border-t border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Your Name (optional)</label>
                    <input
                      type="text"
                      value={supporterName}
                      onChange={(e) => setSupporterName(e.target.value)}
                      placeholder="e.g. John / Fellow Engineer"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-gray-700 text-white focus:border-yellow-500 focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Your Email (optional)</label>
                    <input
                      type="email"
                      value={supporterEmail}
                      onChange={(e) => setSupporterEmail(e.target.value)}
                      placeholder="john@google.com"
                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-gray-700 text-white focus:border-yellow-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1 text-xs">Leave a short message / feedback (optional)</label>
                  <input
                    type="text"
                    value={supporterNote}
                    onChange={(e) => setSupporterNote(e.target.value)}
                    placeholder="e.g. Loved the Uber HLD case study! Keep it up."
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-gray-700 text-white focus:border-yellow-500 focus:outline-none text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:opacity-75 text-gray-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSendingEmail ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Notifying Baljinder...</span>
                    </span>
                  ) : (
                    <>
                      <MessageSquareHeart size={14} />
                      <span>I've Sent a Coffee — Notify Baljinder ❤️</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-center space-y-2 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto text-lg">
                  ❤️
                </div>
                <h4 className="text-white font-bold text-sm">Thank You for Supporting!</h4>
                <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Your notification has been dispatched directly to Baljinder's email (baljindersinghcse@gmail.com). Your support keeps System Design Prep 100% free and open for everyone!
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`mailto:baljindersinghcse@gmail.com?subject=${encodeURIComponent(`Coffee Tip from ${supporterName || 'A Supporter'}`)}&body=${encodeURIComponent(`Hi Baljinder,\n\nI just sent a ${currentPrice} coffee tip to support System Design Prep!\n\nNote: ${supporterNote || 'Great platform!'}\n\nBest,\n${supporterName || 'Fellow Engineer'}`)}`}
                    className="text-xs text-yellow-300 hover:text-yellow-200 underline font-medium"
                  >
                    Open direct email
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enlarged QR Modal */}
      {showEnlargedQr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setShowEnlargedQr(false)}
        >
          <div
            className="relative bg-white p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEnlargedQr(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              <X size={18} />
            </button>
            <h3 className="font-extrabold text-gray-900 text-lg">{settings.upiPayeeName}</h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{settings.upiId}</p>
            <div className="p-3 bg-white rounded-2xl border border-gray-200 my-4 shadow-sm inline-block">
              <img
                src={settings.qrCodeImage}
                alt="Enlarged QR Code"
                className="w-64 h-64 object-contain mx-auto"
              />
            </div>
            <p className="text-xs text-gray-600 font-semibold">
              Scan with Google Pay, PhonePe, Paytm, or BHIM
            </p>
            <button
              onClick={() => setShowEnlargedQr(false)}
              className="mt-4 w-full py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
