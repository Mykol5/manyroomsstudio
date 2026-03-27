'use client';

import { useState } from 'react';
import {
  ChevronRightIcon,
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

// Material Icon component
const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
  <span 
    className={`material-symbols-outlined ${className}`} 
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {icon}
  </span>
);

export default function AdminSettings() {
  const [globalRate, setGlobalRate] = useState('17');
  const [franchiseOverride, setFranchiseOverride] = useState(false);
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSaveChanges = () => {
    alert('Settings saved successfully!');
  };

  const handleCancel = () => {
    setGlobalRate('17');
    setFranchiseOverride(false);
    setBroadcastActive(false);
    setAlertMessage('');
  };

  const handleResetToFactory = () => {
    if (confirm('Are you sure you want to reset all settings to factory defaults? This action cannot be undone.')) {
      setGlobalRate('17');
      setFranchiseOverride(false);
      setBroadcastActive(false);
      setAlertMessage('');
      alert('Settings reset to factory defaults');
    }
  };

  return (
    <div className="flex flex-col min-w-0">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Settings</span>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-slate-900 dark:text-white font-medium">System & Commission</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </header>

      <div className="p-8 max-w-5xl mx-auto w-full">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">System & Commission Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage global platform rates, franchisee overrides, and system-wide broadcast alerts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Settings Groups */}
          <div className="md:col-span-2 space-y-6">
            {/* Financial Settings */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <MaterialIcon icon="account_balance_wallet" className="text-primary" />
                <h3 className="font-bold text-lg">Financial Settings</h3>
              </div>
              <div className="p-6 space-y-8">
                {/* Global Rate */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">Global Commission Rate</label>
                      <p className="text-xs text-slate-500">Standard platform fee applied to every studio booking globally.</p>
                    </div>
                    <div className="relative w-32">
                      <input
                        type="number"
                        value={globalRate}
                        onChange={(e) => setGlobalRate(e.target.value)}
                        className="w-full pl-4 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border-0 rounded-lg font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                      <span className="absolute right-3 top-2 text-slate-400 font-medium">%</span>
                    </div>
                  </div>
                </div>

                {/* Franchisee Overrides */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">Franchisee Overrides</label>
                      <p className="text-xs text-slate-500">Allow master franchise accounts to set local commission rates.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={franchiseOverride}
                        onChange={(e) => setFranchiseOverride(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className={`p-4 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between ${!franchiseOverride ? 'opacity-50' : ''}`}>
                    <span className="text-sm font-medium text-slate-500 italic">Override limit currently set to 0%</span>
                    <button className="text-xs text-slate-400 font-bold uppercase tracking-wider" disabled={!franchiseOverride}>
                      Configure Limits
                    </button>
                  </div>
                </div>

                {/* Payment Gateway */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Payment Gateway Status</label>
                  <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#635BFF] rounded flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13.911 8.012c-1.03-.47-2.177-.634-2.627-.634-.523 0-.825.242-.825.61 0 .43.385.572 1.293.913 1.155.429 2.75.957 2.75 2.629 0 1.76-1.403 2.75-3.08 2.75-1.293 0-2.42-.33-3.053-.616v-2.09c.715.396 1.953.77 2.888.77.688 0 .963-.264.963-.66 0-.528-.495-.682-1.375-1.012-1.238-.462-2.668-1.034-2.668-2.53 0-1.606 1.293-2.618 2.888-2.618 1.073 0 1.98.242 2.846.616v2.282zM4.002 4h16c1.104 0 2 .896 2 2v12c0 1.104-.896 2-2 2h-16c-1.104 0-2-.896-2-2V6c0-1.104.896-2 2-2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm">Stripe Payments</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase">Active & Connected</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-primary text-sm font-semibold hover:underline">Manage API Keys</button>
                  </div>
                </div>
              </div>
            </div>

            {/* System Broadcast Alerts */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MaterialIcon icon="campaign" className="text-amber-500" />
                  <h3 className="font-bold text-lg">System-wide Alerts</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Broadcast Active</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={broadcastActive}
                      onChange={(e) => setBroadcastActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
              <div className="p-6">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Alert Message</label>
                <textarea
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Enter maintenance message or platform update..."
                  rows={3}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm resize-none outline-none"
                />
                <p className="text-xs text-slate-500 mt-2">This message will appear as a banner on all host and guest dashboards.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Audit & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/10">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Platform Revenue</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Monthly Volume</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">$428,500</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Net Commission ({globalRate}%)</p>
                  <p className="text-2xl font-black text-primary">${(428500 * (parseInt(globalRate) / 100)).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h4 className="font-bold text-sm mb-4">Recent Changes</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1 h-8 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Rate Updated to {globalRate}%</p>
                    <p className="text-[10px] text-slate-500">By Alex Rivera • 2h ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Franchise Override {franchiseOverride ? 'On' : 'Off'}</p>
                    <p className="text-[10px] text-slate-500">By System Bot • 1d ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Stripe Gateway Re-synced</p>
                    <p className="text-[10px] text-slate-500">By Alex Rivera • 3d ago</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 py-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors border-t border-slate-100 dark:border-slate-800 pt-4">
                VIEW FULL LOG
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">System Recovery</h4>
              <p className="text-[11px] text-red-600/80 mb-4">Resetting global rates will immediately affect all pending payouts.</p>
              <button
                onClick={handleResetToFactory}
                className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline"
              >
                RESET TO FACTORY DEFAULTS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Info */}
      <footer className="mt-auto py-6 px-8 text-center border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-400">© 2024 ManyRooms Studios | Enterprise Control Panel v4.1.2</p>
      </footer>
    </div>
  );
}