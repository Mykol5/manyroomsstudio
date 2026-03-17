'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
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
  const { user, loading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics>({
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
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Real-time subscription for studio updates
  useEffect(() => {
    const subscription = supabase
      .channel('studio-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'studios' },
        (payload) => {
          // Handle real-time updates
          console.log('Studio update:', payload);
          // Refresh studios data
          fetchStudios();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchStudios = async () => {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('franchisee_id', user?.id);

    if (!error && data) {
      setStudios(data);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600';
      case 'maintenance':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600';
      case 'onboarding':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-slate-50 dark:bg-slate-700 text-slate-600';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
          <div className="text-primary font-bold">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar Navigation */}
      <aside className="w-72 flex-shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-background-dark h-full flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl font-bold">domain</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">ManyRooms</h1>
              <p className="text-[10px] font-bold tracking-widest text-primary uppercase mt-1">Franchisee Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-1">
          <Link href="/franchisee/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white transition-all group">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-semibold text-sm">Dashboard</span>
          </Link>
          <Link href="/franchisee/studios" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined">storefront</span>
            <span className="font-medium text-sm">Studios</span>
          </Link>
          <Link href="/franchisee/revenue" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined">payments</span>
            <span className="font-medium text-sm">Revenue</span>
          </Link>
          <Link href="/franchisee/system-pulse" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined">monitoring</span>
            <span className="font-medium text-sm">System Pulse</span>
          </Link>
          <Link href="/franchisee/network" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined">hub</span>
            <span className="font-medium text-sm">Network</span>
          </Link>
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800">
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-lg text-sm hover:opacity-90 transition-all">
            <PlusCircleIcon className="w-5 h-5" />
            New Studio
          </button>
          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="size-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.user_metadata?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold">{user?.user_metadata?.name || 'Alex Sterling'}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Lead Partner</span>
            </div>
            <button className="ml-auto text-slate-400 hover:text-slate-600">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-background-dark/95">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-10 py-5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="relative w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Search analytics, studios, or reports..."
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <button className="size-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 relative">
                <BellIcon className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-white"></span>
                )}
              </button>
              <button className="size-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500">
                <ChatBubbleLeftIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Current Period</span>
              <span className="text-[10px] font-bold text-primary">Q4 2023 RECAP</span>
            </div>
          </div>
        </header>

        <div className="px-10 py-10 max-w-7xl mx-auto space-y-10">
          {/* Dashboard Hero Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Overview</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium">
                Real-time performance metrics across your {metrics.active_studios} active studios.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
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
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-100 dark:border-slate-700 shadow-[0_4px_20px_-2px_rgba(17,82,212,0.05)]">
              <div className="flex justify-between items-start mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Network Revenue</p>
                <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded text-[10px] font-bold">
                  +{metrics.revenue_growth}%
                </span>
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                ${metrics.network_revenue.toLocaleString()}
              </h3>
              <p className="mt-4 text-xs font-medium text-slate-400">
                Projected: ${metrics.projected_revenue.toLocaleString()} by year end
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-100 dark:border-slate-700 shadow-[0_4px_20px_-2px_rgba(17,82,212,0.05)]">
              <div className="flex justify-between items-start mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Studios</p>
                <span className="text-primary bg-primary/10 px-2 py-1 rounded text-[10px] font-bold">
                  +{metrics.studios_onboarding} NEW
                </span>
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                {metrics.active_studios}
              </h3>
              <p className="mt-4 text-xs font-medium text-slate-400">
                {metrics.studios_onboarding} currently in onboarding
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-100 dark:border-slate-700 shadow-[0_4px_20px_-2px_rgba(17,82,212,0.05)] border-l-4 border-l-primary">
              <div className="flex justify-between items-start mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Pulse</p>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
                </div>
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                {metrics.system_pulse}%
              </h3>
              <p className="mt-4 text-xs font-medium text-slate-400">Operational efficiency peak</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Trends Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-100 dark:border-slate-700 shadow-[0_4px_20px_-2px_rgba(17,82,212,0.05)]">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-bold tracking-tight">Revenue Trends</h4>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-primary rounded-full"></span>
                    <span className="text-xs font-medium text-slate-500">Gross</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-slate-200 rounded-full"></span>
                    <span className="text-xs font-medium text-slate-500">Target</span>
                  </div>
                </div>
              </div>

              <div className="relative h-72 w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg overflow-hidden group">
                {/* Chart Background Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 pointer-events-none">
                  <div className="border-b border-slate-200 dark:border-slate-800 w-full h-px"></div>
                  <div className="border-b border-slate-200 dark:border-slate-800 w-full h-px"></div>
                  <div className="border-b border-slate-200 dark:border-slate-800 w-full h-px"></div>
                  <div className="border-b border-slate-200 dark:border-slate-800 w-full h-px"></div>
                </div>

                {/* Mock Data Visualization */}
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

                {/* Hover Tooltip */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-[2px]">
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
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-100 dark:border-slate-700 shadow-[0_4px_20px_-2px_rgba(17,82,212,0.05)] h-full flex flex-col">
              <h4 className="text-xl font-bold tracking-tight mb-8">System Pulse</h4>

              <div className="space-y-6 flex-1">
                <div className="flex gap-4">
                  <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Booking System: Optimal</p>
                    <p className="text-xs text-slate-400 mt-1">Global uptime at 99.9% for current period.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="size-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
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

              <button className="mt-8 w-full py-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all">
                View Full Health Report
              </button>
            </div>
          </div>

          {/* Recent Activities Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-[0_4px_20px_-2px_rgba(17,82,212,0.05)] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h4 className="text-xl font-bold tracking-tight">Recent Studio Activities</h4>
              <button className="text-primary text-xs font-bold hover:underline">View All Network Activity</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <th className="px-8 py-4">Studio ID</th>
                    <th className="px-8 py-4">Location</th>
                    <th className="px-8 py-4 text-center">Occupancy</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Revenue (Daily)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  {filteredStudios.map((studio) => (
                    <tr key={studio.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all">
                      <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-white">
                        {studio.studio_code}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium block">{studio.name}</span>
                            <span className="text-xs text-slate-400">{studio.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="w-24 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mx-auto">
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
                      <td className="px-8 py-5 text-right font-black text-slate-900 dark:text-white">
                        ${studio.daily_revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}