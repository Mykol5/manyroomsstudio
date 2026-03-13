'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  GridViewIcon, 
  DashboardIcon, 
  VideoCameraIcon, 
  UsersIcon, 
  PaymentsIcon, 
  SettingsIcon,
  SearchIcon,
  NotificationsIcon,
  DownloadIcon,
  MonetizationOnIcon,
  AccountBalanceWalletIcon,
  PersonCelebrateIcon,
  AssignmentLateIcon,
  PsychologyIcon,
  CheckCircleIcon,
  CloseIcon,
  VisibilityIcon,
  LogoutIcon,
  TrendingUpIcon
} from '@/components/icons'; // We'll create this
import './admin.css';

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="admin-dashboard flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-50">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image
                src="/manyroomlogo.png"
                alt="ManyRooms"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </div>
            <h1 className="font-bold text-lg tracking-tight">ManyRooms</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
            Admin Control Panel
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setActiveNav('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeNav === 'dashboard'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveNav('moderation')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeNav === 'moderation'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-xl">camera_video</span>
            <span className="text-sm font-medium">Studio Moderation</span>
          </button>

          <button
            onClick={() => setActiveNav('users')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeNav === 'users'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-xl">group</span>
            <span className="text-sm font-medium">User Management</span>
          </button>

          <button
            onClick={() => setActiveNav('financials')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeNav === 'financials'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-xl">payments</span>
            <span className="text-sm font-medium">Financials</span>
          </button>

          <div className="pt-4 pb-2">
            <span className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              Configuration
            </span>
          </div>

          <button
            onClick={() => setActiveNav('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeNav === 'settings'
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="text-sm font-medium">System Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">Alex Rivera</p>
              <p className="text-[10px] text-slate-500 truncate">System Architect</p>
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col">
        {/* Top Nav */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Search analytics, studios, or users..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-700"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold hidden md:block">Dashboard Overview</span>
              <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">download</span>
                Export Report
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              System Performance
            </h2>
            <p className="text-slate-500 font-medium">
              Platform health and revenue metrics for the current billing cycle.
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* GMV */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <span className="material-symbols-outlined">monetization_on</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +12.5%
                </span>
              </div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total GMV</p>
              <h3 className="text-2xl font-black mt-1">$425,000.00</h3>
            </div>

            {/* Commission */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +8.2%
                </span>
              </div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Net Commission</p>
              <h3 className="text-2xl font-black mt-1">$63,750.00</h3>
            </div>

            {/* Active Users */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <span className="material-symbols-outlined">person_celebrate</span>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  +5.4%
                </span>
              </div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Active Users</p>
              <h3 className="text-2xl font-black mt-1">12,840</h3>
            </div>

            {/* Applications */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <span className="material-symbols-outlined">assignment_late</span>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  -2.1%
                </span>
              </div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Studio Applications</p>
              <h3 className="text-2xl font-black mt-1">48</h3>
            </div>
          </div>

          {/* AI Market Insights Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-400 text-white">
                <span className="material-symbols-outlined text-xl">psychology</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">AI-Powered Market Insights</h2>
                <p className="text-sm text-slate-500">
                  Real-time predictive analysis based on global studio performance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden group">
                {/* Abstract Gradient Decoration */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                      Live Projection
                    </span>
                    <span className="text-xs text-slate-400">Updated 5 mins ago</span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-l-4 border-primary">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        Recommended Studio Expansion: Visual Arts
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Our AI suggests a 24% increase in demand for 'Mixed Media' studio spaces in the EMEA region for Q4. 
                        Incentivizing new applications in this category could yield an additional $12k in monthly net commission.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Revenue Confidence</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">92.4%</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Risk Assessment</p>
                        <p className="text-xl font-black text-green-600">LOW</p>
                      </div>
                    </div>
                  </div>

                  <button className="mt-6 w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2">
                    View Full Market Forecast
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                {/* AI Visualizer Pattern */}
                <div 
                  className="absolute inset-0 opacity-10" 
                  style={{ 
                    backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                ></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Neural Network Status
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-black mb-4">Optimization Suggestions</h3>
                  
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-indigo-400">check_circle</span>
                      <p className="text-sm text-slate-300">
                        Lower platform fee for studios with &gt;98% uptime to increase retention by 15%.
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-indigo-400">check_circle</span>
                      <p className="text-sm text-slate-300">
                        Auto-approve Tier 1 applicants from Verified Creative Partner pools.
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-indigo-400">trending_up</span>
                      <p className="text-sm text-slate-300">
                        Adjust dynamic pricing for Peak Hours in London/New York hubs.
                      </p>
                    </li>
                  </ul>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Algorithm Efficiency</p>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div 
                        className="bg-primary h-full rounded-full w-[88%] shadow-[0_0_10px_rgba(17,82,212,0.8)]"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity / Studio Moderation */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="font-bold text-lg">Pending Studio Moderation</h2>
              <button className="text-primary text-sm font-bold hover:underline">View All Queue</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4">Studio Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Requested Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Luminary Digital Labs */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                          L
                        </div>
                        <span className="text-sm font-semibold">Luminary Digital Labs</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">Post-Production</td>
                    <td className="px-6 py-4 text-sm text-slate-500">Berlin, Germany</td>
                    <td className="px-6 py-4 text-sm font-bold">$120/hr</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50">
                          <span className="material-symbols-outlined text-lg">check</span>
                        </button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Vantage Sound Design */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
                          V
                        </div>
                        <span className="text-sm font-semibold">Vantage Sound Design</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">Audio Engineering</td>
                    <td className="px-6 py-4 text-sm text-slate-500">London, UK</td>
                    <td className="px-6 py-4 text-sm font-bold">$95/hr</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50">
                          <span className="material-symbols-outlined text-lg">check</span>
                        </button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Skyline Visuals */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          S
                        </div>
                        <span className="text-sm font-semibold">Skyline Visuals</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">CGI & VFX</td>
                    <td className="px-6 py-4 text-sm text-slate-500">Los Angeles, USA</td>
                    <td className="px-6 py-4 text-sm font-bold">$250/hr</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50">
                          <span className="material-symbols-outlined text-lg">check</span>
                        </button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
