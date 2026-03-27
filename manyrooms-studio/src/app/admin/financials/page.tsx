'use client';

import { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  EyeIcon,
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

interface Payout {
  id: string;
  date: string;
  studioName: string;
  studioId: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: 'paid' | 'pending' | 'failed';
  payoutId: string;
}

export default function AdminFinancials() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Financial metrics
  const [metrics] = useState({
    totalRevenue: 2845000,
    revenueGrowth: 12.4,
    totalCommission: 483650,
    commissionGrowth: 8.2,
    activeStudios: 142,
    studioGrowth: 5.4,
    pendingPayouts: 28450,
    pendingChange: -2.1,
  });

  // Monthly revenue data
  const monthlyData = [
    { month: 'JAN', revenue: 185000, commission: 31450 },
    { month: 'FEB', revenue: 198000, commission: 33660 },
    { month: 'MAR', revenue: 212000, commission: 36040 },
    { month: 'APR', revenue: 225000, commission: 38250 },
    { month: 'MAY', revenue: 241000, commission: 40970 },
    { month: 'JUN', revenue: 258000, commission: 43860 },
    { month: 'JUL', revenue: 272000, commission: 46240 },
    { month: 'AUG', revenue: 285000, commission: 48450 },
    { month: 'SEP', revenue: 298000, commission: 50660 },
    { month: 'OCT', revenue: 312000, commission: 53040 },
    { month: 'NOV', revenue: 328000, commission: 55760 },
    { month: 'DEC', revenue: 345000, commission: 58650 },
  ];

  // Payout history
  const [payouts] = useState<Payout[]>([
    {
      id: '1',
      date: 'Oct 15, 2024',
      studioName: 'Sunset Sound',
      studioId: 'STU-001',
      amount: 12450,
      commission: 2116.50,
      netAmount: 10333.50,
      status: 'paid',
      payoutId: 'PY-2024-1015-01',
    },
    {
      id: '2',
      date: 'Oct 14, 2024',
      studioName: 'The Blue Room',
      studioId: 'STU-002',
      amount: 8900,
      commission: 1513,
      netAmount: 7387,
      status: 'paid',
      payoutId: 'PY-2024-1014-02',
    },
    {
      id: '3',
      date: 'Oct 12, 2024',
      studioName: 'Echo Studios',
      studioId: 'STU-003',
      amount: 15400,
      commission: 2618,
      netAmount: 12782,
      status: 'pending',
      payoutId: 'PY-2024-1012-03',
    },
    {
      id: '4',
      date: 'Oct 10, 2024',
      studioName: 'Neon Lights Video',
      studioId: 'STU-004',
      amount: 22100,
      commission: 3757,
      netAmount: 18343,
      status: 'paid',
      payoutId: 'PY-2024-1010-04',
    },
    {
      id: '5',
      date: 'Oct 08, 2024',
      studioName: 'The Zenith Loft',
      studioId: 'STU-005',
      amount: 18750,
      commission: 3187.50,
      netAmount: 15562.50,
      status: 'paid',
      payoutId: 'PY-2024-1008-05',
    },
  ]);

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const totalPages = Math.ceil(payouts.length / itemsPerPage);
  const paginatedPayouts = payouts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  const handleExport = () => {
    alert('Export functionality coming soon!');
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Financial Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor platform revenue, commissions, and payout history.</p>
        </div>

        {/* Period Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1">
            <button
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === 'monthly'
                  ? 'bg-primary text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === 'yearly'
                  ? 'bg-primary text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary'
              }`}
            >
              Yearly
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <MaterialIcon icon="monetization_on" className="text-primary text-3xl" />
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                +{metrics.revenueGrowth}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Total Revenue (YTD)</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ${(metrics.totalRevenue / 1000).toFixed(0)}k
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <MaterialIcon icon="account_balance_wallet" className="text-primary text-3xl" />
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                +{metrics.commissionGrowth}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Total Commission</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ${(metrics.totalCommission / 1000).toFixed(0)}k
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <MaterialIcon icon="meeting_room" className="text-primary text-3xl" />
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                +{metrics.studioGrowth}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Active Studios</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.activeStudios}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <MaterialIcon icon="payments" className="text-primary text-3xl" />
              <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                {metrics.pendingChange}%
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">Pending Payouts</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ${(metrics.pendingPayouts / 1000).toFixed(0)}k
            </p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Revenue Trends</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs text-slate-500">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                <span className="text-xs text-slate-500">Commission</span>
              </div>
            </div>
          </div>

          <div className="relative h-80 w-full">
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400">
              <span>$350k</span>
              <span>$262k</span>
              <span>$175k</span>
              <span>$87k</span>
              <span>$0</span>
            </div>
            <div className="ml-16 h-full relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-slate-200 dark:border-slate-700 w-full"></div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-end justify-between gap-2">
                {monthlyData.slice(0, 6).map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="relative w-full flex flex-col items-center gap-1">
                      <div
                        className="w-6 bg-primary rounded-t transition-all"
                        style={{ height: `${(data.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-white whitespace-nowrap">
                          ${(data.revenue / 1000).toFixed(0)}k
                        </div>
                      </div>
                      <div
                        className="w-6 bg-primary/30 rounded-t transition-all"
                        style={{ height: `${(data.commission / maxRevenue) * 100}%`, minHeight: '4px' }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payout History Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold">Payout History</h3>
            <button className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              <DocumentArrowDownIcon className="w-4 h-4" />
              Export All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Studio</th>
                  <th className="px-6 py-4">Payout ID</th>
                  <th className="px-6 py-4">Gross Amount</th>
                  <th className="px-6 py-4">Commission (17%)</th>
                  <th className="px-6 py-4">Net Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm">{payout.date}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{payout.studioName}</p>
                        <p className="text-xs text-slate-500">{payout.studioId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{payout.payoutId}</td>
                    <td className="px-6 py-4 text-sm font-medium">${payout.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-amber-600">-${payout.commission.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">${payout.netAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(payout.status)}`}>
                        {payout.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, payouts.length)} of {payouts.length} payouts
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary disabled:opacity-50 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary disabled:opacity-50 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}