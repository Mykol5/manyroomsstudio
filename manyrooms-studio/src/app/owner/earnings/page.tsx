'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Types
interface Payout {
  id: string;
  date: string;
  reference: string;
  status: 'pending' | 'paid' | 'failed';
  amount: number;
}

interface MonthlyData {
  month: string;
  earnings: number;
  fullName: string;
}

export default function OwnerEarnings() {
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(5); // June index
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAmount, setFilterAmount] = useState<string>('all');

  // Monthly earnings data
  const monthlyData: MonthlyData[] = [
    { month: 'JAN', earnings: 12400, fullName: 'January' },
    { month: 'FEB', earnings: 14800, fullName: 'February' },
    { month: 'MAR', earnings: 16200, fullName: 'March' },
    { month: 'APR', earnings: 17800, fullName: 'April' },
    { month: 'MAY', earnings: 19400, fullName: 'May' },
    { month: 'JUN', earnings: 18200, fullName: 'June' },
  ];

  // Payout history
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: '1',
      date: 'Oct 12, 2024',
      reference: 'MR-PAY-44021',
      status: 'pending',
      amount: 4820.00,
    },
    {
      id: '2',
      date: 'Sep 28, 2024',
      reference: 'MR-PAY-43892',
      status: 'paid',
      amount: 5140.45,
    },
    {
      id: '3',
      date: 'Sep 15, 2024',
      reference: 'MR-PAY-43551',
      status: 'paid',
      amount: 3905.00,
    },
    {
      id: '4',
      date: 'Aug 30, 2024',
      reference: 'MR-PAY-43109',
      status: 'paid',
      amount: 6230.10,
    },
  ]);

  // Financial calculations
  const grossEarnings = 21450.00;
  const commissionRate = 0.17;
  const commissionAmount = grossEarnings * commissionRate;
  const netPayout = grossEarnings - commissionAmount;
  const averageBalance = 14820.45;

  const maxEarning = Math.max(...monthlyData.map(d => d.earnings));
  const minEarning = Math.min(...monthlyData.map(d => d.earnings));
  const selectedEarnings = monthlyData[selectedMonth]?.earnings || 18200;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="text-emerald-500">✓</span>;
      case 'pending':
        return <span className="text-amber-500">⏳</span>;
      case 'failed':
        return <span className="text-red-500">✗</span>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'pending':
        return 'text-amber-500 bg-amber-500/10';
      case 'failed':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-slate-400 bg-white/5';
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    if (filterStatus !== 'all' && payout.status !== filterStatus) return false;
    if (filterAmount !== 'all') {
      if (filterAmount === 'high' && payout.amount < 5000) return false;
      if (filterAmount === 'medium' && (payout.amount < 2000 || payout.amount >= 5000)) return false;
      if (filterAmount === 'low' && payout.amount >= 2000) return false;
    }
    return true;
  });

  const handleWithdraw = () => {
    alert('Withdraw functionality will be implemented soon!');
  };

  const handleExport = () => {
    alert('Export functionality will be implemented soon!');
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight">Earnings & Atelier Capital</h2>
        <p className="text-slate-400 text-sm mt-1">
          Track your studio revenue, payouts, and financial performance.
        </p>
      </div>

      {/* Timeframe Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              timeframe === 'monthly'
                ? 'bg-primary text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              timeframe === 'yearly'
                ? 'bg-primary text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            YEARLY
          </button>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
        >
          <DocumentArrowDownIcon className="w-4 h-4" />
          EXPORT REPORT
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-400 text-sm mb-1">Total Revenue</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-white">
                ${selectedEarnings.toLocaleString()}
              </p>
              <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                +12.5%
              </span>
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-slate-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
              <span className="text-slate-400">Target</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="relative h-64 mt-8">
          <div className="absolute inset-0 flex items-end justify-between gap-4">
            {monthlyData.map((data, index) => {
              const heightPercent = (data.earnings / maxEarning) * 100;
              const isSelected = selectedMonth === index;
              return (
                <button
                  key={data.month}
                  onClick={() => setSelectedMonth(index)}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="relative w-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isSelected ? 'bg-primary' : 'bg-primary/40 hover:bg-primary/60'
                      }`}
                      style={{ height: `${heightPercent * 2}px`, minHeight: '4px' }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      ${data.earnings.toLocaleString()}
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-slate-500'}`}>
                    {data.month}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Legend - Monthly labels */}
        <div className="flex justify-between mt-6 px-4">
          <span className="text-[10px] text-slate-500">JAN</span>
          <span className="text-[10px] text-slate-500">FEB</span>
          <span className="text-[10px] text-slate-500">MAR</span>
          <span className="text-[10px] text-slate-500">APR</span>
          <span className="text-[10px] text-slate-500">MAY</span>
          <span className="text-[10px] text-slate-500">JUN</span>
        </div>
      </div>

      {/* Average Balance & Withdraw */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Average Balance Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-8">
          <p className="text-slate-400 text-sm mb-2">AVERAGE BALANCE</p>
          <p className="text-5xl font-black text-white mb-6">
            ${averageBalance.toLocaleString()}
          </p>
          <button
            onClick={handleWithdraw}
            className="px-6 py-3 bg-primary hover:bg-primary/90 transition-all rounded-lg font-bold text-white"
          >
            WITHDRAW FUNDS
          </button>
        </div>

        {/* Payout Breakdown */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">PAYOUT BREAKDOWN</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Gross Earnings</span>
              <span className="font-medium">${grossEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ManyRooms Commission (17%)</span>
              <span className="font-medium text-amber-500">-${commissionAmount.toLocaleString()}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-white/10 flex justify-between">
              <span className="text-white font-bold">Net Payout</span>
              <span className="text-primary font-bold text-lg">${netPayout.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-xl font-bold">Payout History</h3>
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
            >
              <ArrowPathIcon className="w-4 h-4" />
              FILTER HISTORY
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-10">
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-2">STATUS</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value="all"
                          checked={filterStatus === 'all'}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="text-primary"
                        />
                        <span className="text-sm">All</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value="paid"
                          checked={filterStatus === 'paid'}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="text-primary"
                        />
                        <span className="text-sm">Paid</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value="pending"
                          checked={filterStatus === 'pending'}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="text-primary"
                        />
                        <span className="text-sm">Pending</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-2">AMOUNT</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="amount"
                          value="all"
                          checked={filterAmount === 'all'}
                          onChange={(e) => setFilterAmount(e.target.value)}
                          className="text-primary"
                        />
                        <span className="text-sm">All</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="amount"
                          value="high"
                          checked={filterAmount === 'high'}
                          onChange={(e) => setFilterAmount(e.target.value)}
                          className="text-primary"
                        />
                        <span className="text-sm">High ($5k+)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="amount"
                          value="medium"
                          checked={filterAmount === 'medium'}
                          onChange={(e) => setFilterAmount(e.target.value)}
                          className="text-primary"
                        />
                        <span className="text-sm">Medium ($2k - $5k)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="amount"
                          value="low"
                          checked={filterAmount === 'low'}
                          onChange={(e) => setFilterAmount(e.target.value)}
                          className="text-primary"
                        />
                        <span className="text-sm">Low (Under $2k)</span>
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFilterDropdown(false)}
                    className="w-full py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">REFERENCE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4 text-sm">{payout.date}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">{payout.reference}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                      {getStatusIcon(payout.status)}
                      {payout.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    ${payout.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayouts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No payouts found matching your filters.</p>
          </div>
        )}

        {/* Pagination (simplified) */}
        {payouts.length > 5 && (
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <p className="text-sm text-slate-500">
              Showing {filteredPayouts.length} of {payouts.length} payouts
            </p>
            <div className="flex gap-2">
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50">
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50">
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}