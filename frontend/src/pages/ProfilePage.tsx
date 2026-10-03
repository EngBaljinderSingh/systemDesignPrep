import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Shield,
  Sparkles,
  Lock,
  Mail,
  Linkedin,
  Github,
  CheckCircle2,
  AlertCircle,
  Key,
  Download,
  Palette,
  FileText,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProMonetizationModal from '../components/ProMonetizationModal';
import { redeemLicenseKey } from '../data/adminPaymentStore';

export default function ProfilePage() {
  const { user, isPro, isAdmin, updateUserProfile, changePassword, openAuthModal, upgradeToPro } = useAuth();
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // License redemption state
  const [licenseCode, setLicenseCode] = useState('');
  const [licenseSuccess, setLicenseSuccess] = useState(false);
  const [licenseError, setLicenseError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTitle(user.title || '');
      setBio(user.bio || '');
      setLinkedinUrl(user.linkedinUrl || '');
      setGithubUrl(user.githubUrl || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-surface border border-gray-700/80 rounded-2xl p-8 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto text-2xl">
            <UserIcon size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">Sign In to View Your Profile</h2>
          <p className="text-xs text-gray-400">
            Sign in or create an account to manage your profile, view your Pro credentials, and save study progress.
          </p>
          <button
            onClick={openAuthModal}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-primary/25 transition-all"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setSavingProfile(true);

    try {
      await updateUserProfile({
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim(),
        linkedinUrl: linkedinUrl.trim(),
        githubUrl: githubUrl.trim(),
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    }
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    setLicenseError(null);

    if (!licenseCode.trim()) return;

    const ok = redeemLicenseKey(licenseCode.trim(), user.email);
    if (ok) {
      upgradeToPro();
      setLicenseSuccess(true);
      setLicenseCode('');
      setTimeout(() => setLicenseSuccess(false), 4000);
    } else {
      setLicenseError('Invalid or already redeemed activation code.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* ── Profile Hero Header ── */}
      <div className="bg-gradient-to-r from-surface-light via-surface to-surface-light border border-gray-700/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Avatar initial badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary via-indigo-600 to-purple-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                {isAdmin ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-mono">
                    <Shield size={11} /> MASTER ADMIN
                  </span>
                ) : isPro ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1 font-mono">
                    <Sparkles size={11} /> PRO MEMBER
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700 font-mono">
                    FREE COMMUNITY
                  </span>
                )}
              </div>

              <p className="text-xs text-primary font-medium">
                {user.title || 'System Design Candidate & Software Engineer'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-gray-500" /> {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-gray-500" /> Joined {new Date(user.joinedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {!isPro && (
            <button
              onClick={() => setIsProModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-primary/25 transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <Sparkles size={14} className="text-yellow-300" />
              <span>Upgrade to Pro ($29)</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Details & Social (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserIcon size={16} className="text-primary" /> Profile Information
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Update your public engineer profile and professional links.
              </p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Professional Headline / Target Role
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer targeting Meta/Google"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Bio & Prep Goals</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your tech stack and interview timeline..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1 flex items-center gap-1.5">
                    <Linkedin size={13} className="text-[#0A66C2]" /> LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1 flex items-center gap-1.5">
                    <Github size={13} className="text-gray-300" /> GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {profileError && (
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/20 transition-all disabled:opacity-60"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card (for email users) */}
          {user.provider === 'email' && (
            <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock size={16} className="text-purple-400" /> Change Password
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update your secret password for account security.
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-xs flex items-center gap-2">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>Password changed successfully!</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-surface hover:bg-white/10 text-white font-bold text-xs border border-gray-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Pro Tier, License Redemption, Tools (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pro Status Card */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isPro
              ? 'bg-gradient-to-b from-yellow-950/20 to-surface-light border-yellow-500/30'
              : 'bg-surface-light border-gray-700/80'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full font-mono border ${
                isPro
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}>
                {isPro ? 'Pro Membership Active' : 'Free Community Plan'}
              </span>
              <Sparkles size={16} className={isPro ? 'text-yellow-400' : 'text-gray-500'} />
            </div>

            <h3 className="text-lg font-bold text-white">
              {isPro ? 'System Design Prep Pro' : 'Unlock Pro Blueprints & Sizing'}
            </h3>

            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              {isPro
                ? 'You have unlimited lifetime access to all 5 FAANG architecture blueprints, full capacity formulas, and staff follow-up answers.'
                : 'Get full access to downloadable high-res vector blueprints, capacity Excel formulas, and Staff Q&A.'}
            </p>

            {/* Perks list */}
            <ul className="space-y-2 text-xs text-gray-300 my-4 pt-2 border-t border-gray-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-green-400 shrink-0" />
                <span>5 Complete FAANG Architecture Blueprints</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-green-400 shrink-0" />
                <span>Live Bottleneck & Capacity Simulators</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-green-400 shrink-0" />
                <span>50 Staff-Level Interview Follow-Ups</span>
              </li>
            </ul>

            {isPro ? (
              <Link
                to="/hld-case-studies"
                className="w-full py-2.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Download size={14} /> Open HLD Blueprints & Math
              </Link>
            ) : (
              <button
                onClick={() => setIsProModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} className="text-yellow-300" />
                <span>Upgrade to Pro Lifetime ($29)</span>
              </button>
            )}
          </div>

          {/* License Key Redemption */}
          {!isPro && (
            <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Key size={15} className="text-primary" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Redeem Pro License Code
                </h4>
              </div>
              <p className="text-xs text-gray-400">
                Have an activation code or giveaway key? Enter it below to unlock Pro instantly.
              </p>

              <form onSubmit={handleRedeemCode} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={licenseCode}
                    onChange={(e) => setLicenseCode(e.target.value)}
                    placeholder="SDP-PRO-XXXX-XXXX"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-gray-700 text-white font-mono uppercase focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs transition-colors shrink-0"
                  >
                    Redeem
                  </button>
                </div>

                {licenseError && (
                  <span className="text-[11px] text-red-400 block">{licenseError}</span>
                )}

                {licenseSuccess && (
                  <span className="text-[11px] text-green-400 block font-semibold">
                    ✓ Code redeemed successfully! Pro activated.
                  </span>
                )}
              </form>
            </div>
          )}

          {/* Shortcuts to Work Tools */}
          <div className="bg-surface-light border border-gray-700/80 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Quick Shortcuts
            </h4>

            <div className="space-y-2 text-xs">
              <Link
                to="/canvas"
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-gray-800 hover:border-primary/40 text-gray-300 hover:text-white transition-all"
              >
                <div className="flex items-center gap-2">
                  <Palette size={14} className="text-purple-400" />
                  <span>Architecture Canvas</span>
                </div>
                <span className="text-gray-500 text-[11px]">Open →</span>
              </Link>

              <Link
                to="/resume"
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-gray-800 hover:border-primary/40 text-gray-300 hover:text-white transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-400" />
                  <span>Resume Builder</span>
                </div>
                <span className="text-gray-500 text-[11px]">Open →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ProMonetizationModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </div>
  );
}
