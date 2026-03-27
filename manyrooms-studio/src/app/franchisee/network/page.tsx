'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPinIcon,
  WifiIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

// Types
interface Studio {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  yield: number | null;
  efficiency: number | null;
  trend: 'up' | 'down' | 'stable';
  lastSync: string;
  lastSyncMinutes?: number | null; // Fixed: Allow null
}

interface Alert {
  id: string;
  type: 'connection' | 'yield' | 'maintenance' | 'update';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface LocationStats {
  city: string;
  count: number;
  avgYield: number;
}

export default function FranchiseeNetwork() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'offline'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Network metrics
  const [metrics] = useState({
    totalStudios: 24,
    totalGrowth: 2,
    networkYield: 92.4,
    yieldGrowth: 1.5,
    avgEfficiency: 88,
    efficiencyGrowth: 4,
    activeAlerts: 2,
    alertChange: -1,
  });

  // Studios data
  const [studios, setStudios] = useState<Studio[]>([
    {
      id: '1',
      name: 'Chelsea Loft Studio',
      location: 'New York, NY',
      status: 'online',
      yield: 96.8,
      efficiency: 92,
      trend: 'up',
      lastSync: '2 mins ago',
      lastSyncMinutes: 2,
    },
    {
      id: '2',
      name: 'Berlin Mitte Hub',
      location: 'Berlin, Germany',
      status: 'online',
      yield: 89.2,
      efficiency: 84,
      trend: 'up',
      lastSync: '14 mins ago',
      lastSyncMinutes: 14,
    },
    {
      id: '3',
      name: 'Shoreditch Works',
      location: 'London, UK',
      status: 'offline',
      yield: null,
      efficiency: null,
      trend: 'up',
      lastSync: 'Down for 4h',
      lastSyncMinutes: null,
    },
    {
      id: '4',
      name: 'Tokyo Ginza Creative',
      location: 'Tokyo, Japan',
      status: 'online',
      yield: 94.1,
      efficiency: 90,
      trend: 'up',
      lastSync: 'Just now',
      lastSyncMinutes: 0,
    },
    {
      id: '5',
      name: 'Paris Le Marais Atelier',
      location: 'Paris, France',
      status: 'online',
      yield: 91.5,
      efficiency: 88,
      trend: 'stable',
      lastSync: '5 mins ago',
      lastSyncMinutes: 5,
    },
    {
      id: '6',
      name: 'Melbourne Creative Hub',
      location: 'Melbourne, Australia',
      status: 'online',
      yield: 87.3,
      efficiency: 82,
      trend: 'down',
      lastSync: '23 mins ago',
      lastSyncMinutes: 23,
    },
    {
      id: '7',
      name: 'Barcelona Studio',
      location: 'Barcelona, Spain',
      status: 'maintenance',
      yield: 0,
      efficiency: 0,
      trend: 'stable',
      lastSync: '1 hour ago',
      lastSyncMinutes: 60,
    },
    {
      id: '8',
      name: 'Amsterdam Canal Works',
      location: 'Amsterdam, Netherlands',
      status: 'online',
      yield: 93.2,
      efficiency: 89,
      trend: 'up',
      lastSync: '8 mins ago',
      lastSyncMinutes: 8,
    },
    {
      id: '9',
      name: 'Singapore Loft',
      location: 'Singapore',
      status: 'online',
      yield: 90.8,
      efficiency: 86,
      trend: 'stable',
      lastSync: '12 mins ago',
      lastSyncMinutes: 12,
    },
    {
      id: '10',
      name: 'Los Angeles Arts District',
      location: 'Los Angeles, CA',
      status: 'offline',
      yield: null,
      efficiency: null,
      trend: 'down',
      lastSync: 'Down for 2h',
      lastSyncMinutes: null,
    },
  ]);

  // Alerts data
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'connection',
      title: 'Connection Lost',
      message: 'Shoreditch Works has been offline for 4 hours. Check hardware.',
      severity: 'high',
      timestamp: '4 hours ago',
    },
    {
      id: '2',
      type: 'yield',
      title: 'Low Yield Warning',
      message: 'Berlin Mitte Hub yield dropped below 85% this morning.',
      severity: 'medium',
      timestamp: '2 hours ago',
    },
    {
      id: '3',
      type: 'update',
      title: 'Update Scheduled',
      message: 'System firmware v4.2 will roll out to 12 studios tonight at 02:00 AM.',
      severity: 'low',
      timestamp: '5 hours ago',
    },
  ]);

  // Location distribution data
  const [locationStats] = useState<LocationStats[]>([
    { city: 'New York', count: 6, avgYield: 94.2 },
    { city: 'London', count: 4, avgYield: 88.5 },
    { city: 'Tokyo', count: 3, avgYield: 92.1 },
    { city: 'Berlin', count: 2, avgYield: 87.3 },
    { city: 'Paris', count: 2, avgYield: 90.4 },
  ]);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates (in production, this would come from Supabase)
      console.log('Refreshing network data...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'offline':
        return 'text-red-500 bg-red-500/10';
      case 'maintenance':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-slate-500 bg-white/5';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <span className="text-slate-500">—</span>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'connection':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'yield':
        return <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />;
      case 'update':
        return <ClockIcon className="w-5 h-5 text-primary" />;
      default:
        return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-amber-500';
      default:
        return 'border-l-primary';
    }
  };

  const filteredStudios = studios.filter(studio => {
    if (selectedFilter === 'active' && studio.status !== 'online') return false;
    if (selectedFilter === 'offline' && studio.status !== 'offline') return false;
    if (searchTerm && !studio.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !studio.location.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredStudios.length / itemsPerPage);
  const paginatedStudios = filteredStudios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight">Studio Network</h2>
        <p className="text-slate-400 text-sm mt-1">
          Manage and monitor your portfolio performance across all {metrics.totalStudios} locations in real-time.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <MapPinIcon className="w-8 h-8 text-primary" />
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              +{metrics.totalGrowth}%
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Studios</p>
          <p className="text-3xl font-black text-white">{metrics.totalStudios}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <SignalIcon className="w-8 h-8 text-primary" />
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              +{metrics.yieldGrowth}%
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Network Yield</p>
          <p className="text-3xl font-black text-white">{metrics.networkYield}%</p>
          <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${metrics.networkYield}%` }}></div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <WifiIcon className="w-8 h-8 text-primary" />
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              +{metrics.efficiencyGrowth}%
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Avg. Efficiency</p>
          <p className="text-3xl font-black text-white">{metrics.avgEfficiency}/100</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-primary" />
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              {metrics.alertChange}%
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">Active Alerts</p>
          <p className="text-3xl font-black text-white">{metrics.activeAlerts}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All Studios
          </button>
          <button
            onClick={() => setSelectedFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedFilter === 'active'
                ? 'bg-primary text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setSelectedFilter('offline')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedFilter === 'offline'
                ? 'bg-primary text-white'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Offline
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search studios..."
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none w-64"
          />
        </div>
      </div>

      {/* Studios Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-6 py-4">STUDIO NAME & LOCATION</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">YIELD</th>
                <th className="px-6 py-4">EFFICIENCY</th>
                <th className="px-6 py-4">7-DAY TREND</th>
                <th className="px-6 py-4">LAST SYNC</th>
                <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedStudios.map((studio) => (
                <tr key={studio.id} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{studio.name}</p>
                      <p className="text-xs text-slate-500">{studio.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(studio.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${studio.status === 'online' ? 'bg-emerald-500' : studio.status === 'offline' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                      {studio.status === 'online' ? 'Online' : studio.status === 'offline' ? 'Offline' : 'Maintenance'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {studio.yield !== null ? (
                      <span className="font-medium text-white">{studio.yield}%</span>
                    ) : (
                      <span className="text-slate-500">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {studio.efficiency !== null ? (
                      <span className="font-medium text-white">{studio.efficiency}/100</span>
                    ) : (
                      <span className="text-slate-500">--/100</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getTrendIcon(studio.trend)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">{studio.lastSync}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs font-medium transition-all">
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
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStudios.length)} of {filteredStudios.length} studios
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Geographic Distribution & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6">Geographic Distribution</h3>
          <p className="text-sm text-slate-400 mb-6">Studio performance by location density</p>

          <div className="space-y-4">
            {locationStats.map((location) => (
              <div key={location.city}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-primary" />
                    <span className="font-medium text-white">{location.city}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-slate-400">{location.city}</span>
                    <span className="text-primary font-bold">{location.avgYield}% avg yield</span>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(location.count / metrics.totalStudios) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{location.count} studios</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Total Coverage</span>
              <span className="text-lg font-bold text-white">{locationStats.reduce((sum, loc) => sum + loc.count, 0)} cities</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-slate-400">International Presence</span>
              <span className="text-lg font-bold text-white">{locationStats.length} countries</span>
            </div>
          </div>
        </div>

        {/* Network Health Alerts */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Network Health Alerts</h3>
            <span className="text-xs text-primary">{alerts.length} Active</span>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 bg-white/5 rounded-lg border-l-4 ${getAlertSeverityColor(alert.severity)} hover:bg-white/10 transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white">{alert.title}</h4>
                      <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-400">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-all">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
}