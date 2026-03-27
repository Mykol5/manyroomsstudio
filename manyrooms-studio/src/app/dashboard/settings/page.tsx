'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheckIcon,
  BellIcon,
  UserCircleIcon,
  KeyIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

// Material Icon component for icons not in Heroicons
const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

export default function ClientSettings() {
  const [activeTab, setActiveTab] = useState('security');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [newLoginAlerts, setNewLoginAlerts] = useState(true);
  const [securityReport, setSecurityReport] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const activeSessions = [
    {
      id: 1,
      device: 'MacBook Pro 16"',
      type: 'laptop_mac',
      browser: 'Chrome',
      location: 'Los Angeles, USA',
      isCurrent: true,
    },
    {
      id: 2,
      device: 'iPhone 15 Pro',
      type: 'smartphone',
      browser: 'Studio App',
      location: 'New York, USA',
      isCurrent: false,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Password changed',
      time: '2 hours ago',
      details: 'Chrome/Mac',
      isImportant: true,
    },
    {
      id: 2,
      action: 'New login detected',
      time: 'Yesterday',
      details: 'NYC, USA',
      isImportant: false,
    },
    {
      id: 3,
      action: '2FA Method Added',
      time: 'Oct 12, 2023',
      details: '',
      isImportant: false,
    },
  ];

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSignOutAll = () => {
    alert('Signed out of all other sessions');
  };

  const handleSignOutSession = (sessionId: number) => {
    alert(`Signed out of session ${sessionId}`);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-5xl mx-auto">
        {/* Title & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4 text-white">
              Security & Access
            </h2>
            <p className="text-slate-400 max-w-md">
              Refine your creative sanctuary. Manage how your team accesses studio resources and keep your intellectual property safe.
            </p>
          </div>
          <div className="flex bg-surface-dark border border-border-dark p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-sm font-medium transition-all rounded-lg ${
                  activeTab === tab.id
                    ? 'text-white bg-white/5 border border-white/10 shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* 2FA Card */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 group hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <MaterialIcon icon="vibration" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-400">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border-dark bg-background-dark/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs font-bold">SMS Codes</p>
                      <p className="text-[10px] text-slate-500">+1 ••• ••• 4492</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-primary hover:underline">Change</button>
                </div>
                <div className="p-4 rounded-xl border border-border-dark bg-background-dark/50 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <KeyIcon className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs font-bold">Security Key</p>
                      <p className="text-[10px] text-slate-500">Not configured</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-primary hover:underline">Setup</button>
                </div>
              </div>
            </div>

            {/* Password Management */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Update Password</h3>
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-background-dark border-0 border-b-2 border-border-dark focus:border-primary focus:ring-0 text-white py-3 transition-all placeholder:text-slate-700 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create new password"
                      className="w-full bg-background-dark border-0 border-b-2 border-border-dark focus:border-primary focus:ring-0 text-white py-3 transition-all placeholder:text-slate-700 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 block">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full bg-background-dark border-0 border-b-2 border-border-dark focus:border-primary focus:ring-0 text-white py-3 transition-all placeholder:text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSavePassword}
                    className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Save Password
                  </button>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden">
              <div className="p-8 pb-4">
                <h3 className="text-xl font-bold text-white">Active Sessions</h3>
                <p className="text-sm text-slate-400">Manage the devices where you're currently logged in.</p>
              </div>
              <div className="divide-y divide-border-dark">
                {activeSessions.map((session) => (
                  <div key={session.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <MaterialIcon icon={session.type} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">{session.device}</p>
                          {session.isCurrent && (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {session.browser} • {session.location}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSignOutSession(session.id)}
                      className={`text-xs font-bold transition-colors ${
                        session.isCurrent
                          ? 'text-slate-400 hover:text-white'
                          : 'text-red-400 hover:text-red-500'
                      }`}
                    >
                      {session.isCurrent ? 'Details' : 'Sign Out'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-background-dark/50 text-center">
                <button
                  onClick={handleSignOutAll}
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  Sign out of all other sessions
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar / Audit Log */}
          <div className="space-y-8">
            {/* Security Score Card */}
            <div className="bg-primary rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">Security Score</h3>
                <p className="text-white/70 text-sm mb-6">Your account is 85% secure.</p>
                <div className="w-full h-2 bg-white/20 rounded-full mb-8">
                  <div className="w-[85%] h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-xs">
                    <CheckCircleIcon className="w-4 h-4" />
                    2FA is enabled
                  </li>
                  <li className="flex items-center gap-2 text-xs">
                    <CheckCircleIcon className="w-4 h-4" />
                    Password is strong
                  </li>
                  <li className="flex items-center gap-2 text-xs text-white/50">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    Verify secondary email
                  </li>
                </ul>
              </div>
              <div className="absolute -right-10 -bottom-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Quick Audit Log */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white">Recent Activity</h3>
                <button className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Full Log
                </button>
              </div>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <div className={`size-2 rounded-full ${activity.isImportant ? 'bg-primary' : 'bg-slate-700'}`}></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{activity.action}</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase">
                        {activity.time} {activity.details && `• ${activity.details}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Toggles */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
              <h3 className="font-bold text-white mb-6">Privacy Alerts</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">New sign-in alerts</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newLoginAlerts}
                      onChange={(e) => setNewLoginAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Security monthly report</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityReport}
                      onChange={(e) => setSecurityReport(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-border-dark flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto pb-12">
          <p className="text-xs text-slate-500">© 2024 ManyRooms Studios. All creative rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-white transition-colors">
              Security Ethics
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}