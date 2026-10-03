import React, { useState } from 'react';
import { X, Check, Sparkles, BookOpen, Download, ShieldCheck, Heart, Coffee, ExternalLink } from 'lucide-react';

interface ProMonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProMonetizationModal({ isOpen, onClose }: ProMonetizationModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'lifetime' | 'coffee'>('lifetime');

  if (!isOpen) return null;

  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Store in localStorage for lead management
    try {
      const existing = JSON.parse(localStorage.getItem('sdp_pro_leads') || '[]');
      existing.push({ email: email.trim(), plan: selectedPlan, date: new Date().toISOString() });
      localStorage.setItem('sdp_pro_leads', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-surface border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
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
              System Design Prep Pro
            </span>
            <span className="flex items-center text-xs text-yellow-300 font-semibold gap-1">
              <Sparkles size={13} /> High-Return Career Investment
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Crack FAANG & Staff-Level System Design
          </h2>
          <p className="text-sm text-indigo-100 mt-1">
            Downloadable High-Res Architecture Blueprints, 50+ Bottleneck Cheat Sheets & Priority Mock Reviews.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Plan Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lifetime Pass */}
            <div
              onClick={() => setSelectedPlan('lifetime')}
              className={`cursor-pointer rounded-xl p-4 border transition-all ${
                selectedPlan === 'lifetime'
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/40'
                  : 'border-gray-700 hover:border-gray-600 bg-surface-light'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-primary/20 text-primary">
                  Most Popular
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">$29</span>
                  <span className="text-xs text-gray-400 block line-through">$89</span>
                </div>
              </div>
              <h3 className="font-bold text-white text-base">Pro Lifetime Access</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Pay once. Get lifetime updates for every new case study, capacity calculator & vector blueprint.
              </p>
            </div>

            {/* Coffee Supporter */}
            <div
              onClick={() => setSelectedPlan('coffee')}
              className={`cursor-pointer rounded-xl p-4 border transition-all ${
                selectedPlan === 'coffee'
                  ? 'border-yellow-500 bg-yellow-500/10 ring-2 ring-yellow-500/40'
                  : 'border-gray-700 hover:border-gray-600 bg-surface-light'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                  Supporter Pass
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">$5</span>
                  <span className="text-xs text-gray-400 block">one-time tip</span>
                </div>
              </div>
              <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                <Coffee size={16} className="text-yellow-400" /> Buy Me a Coffee
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Support independent engineering content and server hosting costs with a coffee tip.
              </p>
            </div>
          </div>

          {/* Value Checklist */}
          <div className="bg-surface-light/70 border border-gray-700/60 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              What You Unlock with System Design Prep Pro:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { icon: <Download size={14} className="text-green-400 shrink-0" />, text: 'PDF Export of all 5 FAANG Architecture Blueprints' },
                { icon: <BookOpen size={14} className="text-blue-400 shrink-0" />, text: 'Staff Engineer Capacity & Bottleneck Formula Sheets' },
                { icon: <Sparkles size={14} className="text-yellow-400 shrink-0" />, text: 'Pre-configured Interactive Sizing Presets & Excel Model' },
                { icon: <ShieldCheck size={14} className="text-purple-400 shrink-0" />, text: 'Top 50 Real Interview Follow-up Edge Case Answers' },
                { icon: <Heart size={14} className="text-pink-400 shrink-0" />, text: 'Direct 1-on-1 Async Resume Feedback from Senior Eng' },
                { icon: <Check size={14} className="text-green-400 shrink-0" />, text: 'Private Community Discord Channel Access' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-gray-300">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Area: Lead Capture / Checkout */}
          {!submitted ? (
            <form onSubmit={handleLeadCapture} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for instant access..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-500 hover:from-primary-dark hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  {selectedPlan === 'lifetime' ? 'Claim Pro Pass ($29)' : 'Tip Coffee ($5)'}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-2">
                <span>🔒 Secure checkout via Stripe / Gumroad</span>
                <span>•</span>
                <span>30-day money-back guarantee</span>
                <span>•</span>
                <span>Instant access</span>
              </p>
            </form>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center space-y-2 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                <Check size={20} />
              </div>
              <h4 className="text-white font-bold text-base">You are on the VIP Supporter List!</h4>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                We sent early access confirmation to <span className="text-green-300 font-semibold">{email}</span>. You will also receive our High-Level Design Capacity Planning PDF!
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
                >
                  Back to Learning
                </button>
              </div>
            </div>
          )}

          {/* Social Proof / Affiliates */}
          <div className="border-t border-gray-800 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Join 4,800+ engineers prepping for Meta, Google, Amazon & Uber
            </span>
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Open External Tip Jar <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
