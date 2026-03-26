'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  CalendarIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

// Types
interface Studio {
  id: string;
  name: string;
  location: string;
  occupancy: number;
  status: 'active' | 'maintenance' | 'onboarding';
  daily_revenue: number;
  studio_code: string;
}

interface Metrics {
  network_revenue: number;
  projected_revenue: number;
  active_studios: number;
  studios_onboarding: number;
  system_pulse: number;
  revenue_growth: number;
}

export default function FranchiseeDashboard() {
  const { user } = useAuth();
  const [metrics] = useState<Metrics>({
    network_revenue: 1240500,
    projected_revenue: 1400000,
    active_studios: 142,
    studios_onboarding: 8,
    system_pulse: 98.2,
    revenue_growth: 12.4,
  });
  const [studios, setStudios] = useState<Studio[]>([
    {
      id: '1',
      studio_code: 'MR-2041',
      name: 'Downtown Manhattan',
      location: 'New York, NY',
      occupancy: 85,
      status: 'active',
      daily_revenue: 12450,
    },
    {
      id: '2',
      studio_code: 'MR-2089',
      name: 'Beverly Hills',
      location: 'Los Angeles, CA',
      occupancy: 92,
      status: 'active',
      daily_revenue: 18200,
    },
    {
      id: '3',
      studio_code: 'MR-3112',
      name: 'Shoreditch High St',
      location: 'London, UK',
      occupancy: 45,
      status: 'maintenance',
      daily_revenue: 4120,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod] = useState('Last 30 Days');

  // Fix the useEffect - wrap the subscription cleanup properly
  useEffect(() => {
    const subscription = supabase
      .channel('studio-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'studios' },
        (payload) => {
          console.log('Studio update:', payload);
        }
      )
      .subscribe();

    // Return a cleanup function that removes the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Add dependency array if needed

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'maintenance':
        return 'bg-amber-500/10 text-amber-500';
      case 'onboarding':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 80) return 'bg-emerald-500';
    if (occupancy >= 50) return 'bg-primary';
    return 'bg-amber-400';
  };

  const filteredStudios = studios.filter(studio =>
    studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    studio.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    studio.studio_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-10 py-10 max-w-7xl mx-auto space-y-10">
      {/* Dashboard Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tight leading-none">Overview</h2>
          <p className="text-slate-400 mt-4 text-lg font-medium">
            Real-time performance metrics across your {metrics.active_studios} active studios.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <CalendarIcon className="w-5 h-5" />
            {selectedPeriod}
          </button>
          <button className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Network Revenue</p>
            <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-[10px] font-bold">
              +{metrics.revenue_growth}%
            </span>
          </div>
          <h3 className="text-4xl font-black text-white tracking-tighter">
            ${metrics.network_revenue.toLocaleString()}
          </h3>
          <p className="mt-4 text-xs font-medium text-slate-400">
            Projected: ${metrics.projected_revenue.toLocaleString()} by year end
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Studios</p>
            <span className="text-primary bg-primary/10 px-2 py-1 rounded text-[10px] font-bold">
              +{metrics.studios_onboarding} NEW
            </span>
          </div>
          <h3 className="text-4xl font-black text-white tracking-tighter">
            {metrics.active_studios}
          </h3>
          <p className="mt-4 text-xs font-medium text-slate-400">
            {metrics.studios_onboarding} currently in onboarding
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Pulse</p>
            <div className="flex items-center gap-1.5">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <h3 className="text-4xl font-black text-white tracking-tighter">
            {metrics.system_pulse}%
          </h3>
          <p className="mt-4 text-xs font-medium text-slate-400">Operational efficiency peak</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trends Chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-bold tracking-tight">Revenue Trends</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-primary rounded-full"></span>
                <span className="text-xs font-medium text-slate-400">Gross</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 bg-slate-600 rounded-full"></span>
                <span className="text-xs font-medium text-slate-400">Target</span>
              </div>
            </div>
          </div>

          <div className="relative h-72 w-full bg-slate-900/50 rounded-lg overflow-hidden group">
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none">
              <div className="border-b border-slate-800 w-full h-px"></div>
              <div className="border-b border-slate-800 w-full h-px"></div>
              <div className="border-b border-slate-800 w-full h-px"></div>
              <div className="border-b border-slate-800 w-full h-px"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-primary/5 to-transparent">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
                <path
                  d="M0,150 C100,120 200,180 300,140 C400,100 500,110 600,60 C700,20 800,80 1000,40"
                  fill="none"
                  stroke="#1152d4"
                  strokeWidth="3"
                />
              </svg>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
              <div className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl">
                Nov: $412,000 (+8%)
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6 px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase">July</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Aug</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sept</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Oct</span>
            <span className="text-[10px] font-bold text-primary uppercase">Nov</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Dec</span>
          </div>
        </div>

        {/* System Pulse/Alerts */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 h-full flex flex-col">
          <h4 className="text-xl font-bold tracking-tight mb-8">System Pulse</h4>

          <div className="space-y-6 flex-1">
            <div className="flex gap-4">
              <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              </div>
              <div>
                <p className="text-sm font-bold">Booking System: Optimal</p>
                <p className="text-xs text-slate-400 mt-1">Global uptime at 99.9% for current period.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-amber-500">warning</span>
              </div>
              <div>
                <p className="text-sm font-bold">Latency Warning: London Hub</p>
                <p className="text-xs text-slate-400 mt-1">High traffic detected at Kensington Studio.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">update</span>
              </div>
              <div>
                <p className="text-sm font-bold">Planned Maintenance</p>
                <p className="text-xs text-slate-400 mt-1">API v2.4 roll out scheduled for Sunday 2AM.</p>
              </div>
            </div>
          </div>

          <button className="mt-8 w-full py-3 bg-white/5 rounded-lg text-xs font-bold text-slate-400 uppercase tracking-widest hover:bg-white/10 transition-all">
            View Full Health Report
          </button>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <h4 className="text-xl font-bold tracking-tight">Recent Studio Activities</h4>
          <button className="text-primary text-xs font-bold hover:underline">View All Network Activity</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-8 py-4">Studio ID</th>
                <th className="px-8 py-4">Location</th>
                <th className="px-8 py-4 text-center">Occupancy</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Revenue (Daily)</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudios.map((studio) => (
                <tr key={studio.id} className="hover:bg-white/5 transition-all">
                  <td className="px-8 py-5 text-sm font-bold text-white">
                    {studio.studio_code}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium block">{studio.name}</span>
                        <span className="text-xs text-slate-400">{studio.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="w-24 bg-white/10 h-1.5 rounded-full mx-auto">
                      <div
                        className={`${getOccupancyColor(studio.occupancy)} h-full rounded-full`}
                        style={{ width: `${studio.occupancy}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                      {studio.occupancy}% Capacity
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 ${getStatusColor(studio.status)} text-[10px] font-bold rounded-full uppercase tracking-tighter`}>
                      {studio.status === 'active' ? 'Fully Active' : 
                       studio.status === 'maintenance' ? 'Maintenance' : 'Onboarding'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-white">
                    ${studio.daily_revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}