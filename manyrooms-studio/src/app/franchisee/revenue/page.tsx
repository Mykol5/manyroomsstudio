'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

// Types
interface MonthlyData {
  month: string;
  amount: number;
  growth?: number;
}

interface LocationRevenue {
  id: string;
  name: string;
  amount: number;
  growth?: number;
}

interface Settlement {
  id: string;
  payoutId: string;
  period: string;
  processingDate: string;
  volume: number;
  netSettlement: number;
  status: 'paid' | 'pending' | 'failed';
}

export default function FranchiseeRevenue() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Financial metrics
  const [metrics] = useState({
    totalNetworkVolume: 1284500,
    volumeGrowth: 12.4,
    grossRevenue: 1284500,
    feeDeductions: 0,
    netPayout: 1284500,
  });

  // Monthly growth data
  const [monthlyData] = useState<MonthlyData[]>([
    { month: 'JAN', amount: 38400, growth: 8.2 },
    { month: 'FEB', amount: 41200, growth: 7.3 },
    { month: 'MAR', amount: 39800, growth: -3.4 },
    { month: 'APR', amount: 42400, growth: 6.5 },
    { month: 'MAY', amount: 42400, growth: 0 },
    { month: 'JUN', amount: 28150, growth: -33.6 },
    { month: 'JUL', amount: 35920, growth: 27.6 },
    { month: 'AUG', amount: 15200, growth: -57.7 },
    { month: 'SEP', amount: 42800, growth: 181.6 },
    { month: 'OCT', amount: 46800, growth: 9.3 },
    { month: 'NOV', amount: 49200, growth: 5.1 },
    { month: 'DEC', amount: 52400, growth: 6.5 },
  ]);

  // Revenue by location data
  const [locationRevenue] = useState<LocationRevenue[]>([
    { id: '1', name: 'Downtown Atelier', amount: 42400, growth: 12.4 },
    { id: '2', name: 'Westside Heights', amount: 28150, growth: -5.2 },
    { id: '3', name: 'East Loft Studio', amount: 35920, growth: 8.7 },
    { id: '4', name: 'Soho Creative Hub', amount: 42800, growth: 15.3 },
    { id: '5', name: 'Chelsea Arts Space', amount: 31200, growth: 4.2 },
    { id: '6', name: 'Williamsburg Loft', amount: 29800, growth: -2.1 },
    { id: '7', name: 'Tribeca Studio', amount: 35600, growth: 6.8 },
    { id: '8', name: 'Midtown Creative', amount: 38900, growth: 9.4 },
    { id: '9', name: 'Brooklyn Yards', amount: 24500, growth: -1.5 },
    { id: '10', name: 'Harlem Arts', amount: 27800, growth: 3.2 },
    { id: '11', name: 'Upper East Side', amount: 34200, growth: 5.6 },
    { id: '12', name: 'Financial District', amount: 40500, growth: 11.2 },
  ]);

  // Settlement history data
  const [settlements] = useState<Settlement[]>([
    {
      id: '1',
      payoutId: '#PY-2024-09',
      period: 'Sept 2024',
      processingDate: 'Oct 01, 2024',
      volume: 142204.12,
      netSettlement: 142204.12,
      status: 'paid',
    },
    {
      id: '2',
      payoutId: '#PY-2024-08',
      period: 'Aug 2024',
      processingDate: 'Sept 01, 2024',
      volume: 121550.00,
      netSettlement: 121550.00,
      status: 'paid',
    },
    {
      id: '3',
      payoutId: '#PY-2024-07',
      period: 'July 2024',
      processingDate: 'Aug 01, 2024',
      volume: 128902.50,
      netSettlement: 128902.50,
      status: 'paid',
    },
    {
      id: '4',
      payoutId: '#PY-2024-06',
      period: 'June 2024',
      processingDate: 'July 01, 2024',
      volume: 115200.00,
      netSettlement: 115200.00,
      status: 'paid',
    },
    {
      id: '5',
      payoutId: '#PY-2024-05',
      period: 'May 2024',
      processingDate: 'June 01, 2024',
      volume: 108450.00,
      netSettlement: 108450.00,
      status: 'paid',
    },
    {
      id: '6',
      payoutId: '#PY-2024-04',
      period: 'Apr 2024',
      processingDate: 'May 01, 2024',
      volume: 98200.00,
      netSettlement: 98200.00,
      status: 'paid',
    },
  ]);

  const maxAmount = Math.max(...monthlyData.map(d => d.amount));
  const displayedLocations = locationRevenue.slice(0, 3);
  const paginatedSettlements = settlements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(settlements.length / itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-emerald-500';
    if (growth < 0) return 'text-red-500';
    return 'text-slate-400';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowTrendingUpIcon className="w-3 h-3" />;
    if (growth < 0) return <ArrowTrendingDownIcon className="w-3 h-3" />;
    return null;
  };

  const getStatusColor = (status: string) => {
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

  const handleExportReport = () => {
    console.log('Exporting financial report...');
    alert('Export functionality will be implemented soon!');
  };

  const handleViewLocation = (locationId: string) => {
    console.log('View location details:', locationId);
  };

  const handleViewSettlement = (settlementId: string) => {
    console.log('View settlement details:', settlementId);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CurrencyDollarIcon className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-3xl font-black tracking-tight">Revenue & Financials</h2>
            <p className="text-slate-400 text-sm mt-1">
              Transparent reporting on your regional network's financial performance. Real-time insights into gross volume and franchisee settlements.
            </p>
          </div>
        </div>
      </div>

      {/* Total Network Volume Card */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-2">TOTAL NETWORK VOLUME (YTD)</p>
            <p className="text-5xl font-black text-white">{formatCurrency(metrics.totalNetworkVolume)}</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full">
            <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 font-bold">+{metrics.volumeGrowth}% vs previous period</span>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">GROSS REVENUE</p>
          <p className="text-3xl font-black text-white">{formatCurrency(metrics.grossRevenue / 1000000).replace('$', '$')}M</p>
          <p className="text-xs text-slate-500 mt-2">Year to Date</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-slate-400 text-sm mb-2">FEE DEDUCTIONS</p>
          <p className="text-3xl font-black text-white">{formatCurrency(metrics.feeDeductions)}</p>
          <p className="text-xs text-slate-500 mt-2">Platform fees & commissions</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 bg-gradient-to-br from-primary/10 to-transparent">
          <p className="text-slate-400 text-sm mb-2">NET PAYOUT</p>
          <p className="text-3xl font-black text-primary">{formatCurrency(metrics.netPayout / 1000000).replace('$', '$')}M</p>
          <p className="text-xs text-slate-500 mt-2">Available for settlement</p>
        </div>
      </div>

      {/* Monthly Growth & Location Revenue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Growth Performance */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Monthly Growth Performance</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white">
              <option>{selectedYear}</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>

          <div className="space-y-4">
            {monthlyData.slice(0, 8).map((data, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-white">{data.month}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{formatCurrency(data.amount)}</span>
                    {data.growth !== undefined && (
                      <div className={`flex items-center gap-1 text-xs ${getGrowthColor(data.growth)}`}>
                        {getGrowthIcon(data.growth)}
                        <span>{data.growth > 0 ? '+' : ''}{data.growth}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500 group-hover:bg-primary/80"
                    style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Location */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Revenue by Location</h3>
            <Link 
              href="/franchisee/locations"
              className="text-primary text-sm hover:underline flex items-center gap-1"
            >
              VIEW ALL 12 LOCATIONS
              <ArrowTrendingUpIcon className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {displayedLocations.map((location) => (
              <div key={location.id} className="group cursor-pointer" onClick={() => handleViewLocation(location.id)}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-white">{location.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{formatCurrency(location.amount)}</span>
                    {location.growth && (
                      <div className={`flex items-center gap-1 text-xs ${getGrowthColor(location.growth)}`}>
                        {getGrowthIcon(location.growth)}
                        <span>{location.growth > 0 ? '+' : ''}{location.growth}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500 group-hover:bg-primary/80"
                    style={{ width: `${(location.amount / maxAmount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Locations Summary */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Remaining 8 locations</span>
              <span className="text-primary font-bold">
                {formatCurrency(locationRevenue.slice(3).reduce((sum, loc) => sum + loc.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settlement History Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-bold">Settlement History</h3>
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-all"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-6 py-4">PAYOUT ID</th>
                <th className="px-6 py-4">PERIOD</th>
                <th className="px-6 py-4">PROCESSING DATE</th>
                <th className="px-6 py-4">VOLUME</th>
                <th className="px-6 py-4">NET SETTLEMENT</th>
                <th className="px-6 py-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedSettlements.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-white">{settlement.payoutId}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">{settlement.period}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{settlement.processingDate}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {formatCurrency(settlement.volume)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(settlement.status)}`}>
                      {formatCurrency(settlement.netSettlement)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleViewSettlement(settlement.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs font-medium transition-all"
                    >
                      <EyeIcon className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <p className="text-sm text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, settlements.length)} of {settlements.length} settlements
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}