'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPinIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  WifiIcon,
  SignalIcon,
  UserCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

// Types
interface Studio {
  id: string;
  name: string;
  location: string;
  address: string;
  status: 'active' | 'offline' | 'maintenance';
  occupancy: number;
  yield: number;
  revenue: number;
  performance?: 'above' | 'below' | 'target';
}

interface Region {
  id: string;
  name: string;
  location: string;
  studios: Studio[];
  avgOccupancy: number;
  totalYield: number;
}

interface RegionalDirector {
  name: string;
  title: string;
  avatar?: string;
}

export default function FranchiseeStudios() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null);

  // Regional metrics
  const [metrics] = useState({
    avgOccupancy: 84.2,
    occupancyGrowth: 2.4,
    monthlyYield: 342000,
    yieldGrowth: 12000,
    activeStudios: 22,
    totalStudios: 24,
    incidentRate: 0.8,
    incidentStatus: 'low',
  });

  // Regional data
  const [regions] = useState<Region[]>([
    {
      id: '1',
      name: 'Soho Central',
      location: 'Lexington St, New York',
      studios: [
        { id: 's1', name: 'Studio 04', location: 'Soho Central', address: 'Lexington St', status: 'active', occupancy: 92, yield: 94.5, revenue: 28400, performance: 'above' },
        { id: 's2', name: 'Studio 01', location: 'Soho Central', address: 'Lexington St', status: 'active', occupancy: 64, yield: 78.2, revenue: 19200, performance: 'below' },
      ],
      avgOccupancy: 78,
      totalYield: 86300,
    },
    {
      id: '2',
      name: 'Brooklyn Yards',
      location: 'Kent Ave, Brooklyn',
      studios: [
        { id: 's3', name: 'Studio 01', location: 'Brooklyn Yards', address: 'Kent Ave', status: 'offline', occupancy: 0, yield: 0, revenue: 0, performance: 'below' },
      ],
      avgOccupancy: 0,
      totalYield: 0,
    },
    {
      id: '3',
      name: 'Chelsea Arts',
      location: 'West 25th St, New York',
      studios: [
        { id: 's4', name: 'Main Studio', location: 'Chelsea Arts', address: 'West 25th St', status: 'active', occupancy: 88, yield: 91.2, revenue: 31200, performance: 'above' },
        { id: 's5', name: 'Loft B', location: 'Chelsea Arts', address: 'West 25th St', status: 'active', occupancy: 76, yield: 82.5, revenue: 24500, performance: 'target' },
      ],
      avgOccupancy: 82,
      totalYield: 55700,
    },
    {
      id: '4',
      name: 'Williamsburg Creative',
      location: 'Wythe Ave, Brooklyn',
      studios: [
        { id: 's6', name: 'Warehouse Studio', location: 'Williamsburg', address: 'Wythe Ave', status: 'active', occupancy: 94, yield: 96.8, revenue: 35800, performance: 'above' },
      ],
      avgOccupancy: 94,
      totalYield: 35800,
    },
  ]);

  // Regional Director
  const [director] = useState<RegionalDirector>({
    name: 'Julian Voss',
    title: 'Regional Director',
  });

  // Network Intelligence insights
  const [insights] = useState([
    {
      id: '1',
      title: 'Performance Insight',
      message: 'Based on your regional data, Studio 12 remains your highest performing unit. We recommend mirroring its current pricing model in the Upper West sector to optimize the 11% yield gap identified this quarter.',
      type: 'recommendation',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'offline':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'maintenance':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  const getPerformanceIcon = (performance?: string) => {
    switch (performance) {
      case 'above':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />;
      case 'below':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 80) return 'text-emerald-500';
    if (occupancy >= 60) return 'text-primary';
    if (occupancy >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const allStudios = regions.flatMap(region => region.studios);
  const filteredStudios = selectedRegion === 'all' 
    ? allStudios 
    : regions.find(r => r.id === selectedRegion)?.studios || [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BuildingOfficeIcon className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-3xl font-black tracking-tight">Regional Overview</h2>
            <p className="text-slate-400 text-sm mt-1">
              Studio Network Management — Oversight and operational metrics for your {metrics.totalStudios} regional locations.
              Manage yields and studio status across the Metropolitan sector.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <ChartBarIcon className="w-8 h-8 text-primary" />
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              +{metrics.occupancyGrowth}%
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">AVERAGE OCCUPANCY</p>
          <p className="text-3xl font-black text-white">{metrics.avgOccupancy}%</p>
          <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${metrics.avgOccupancy}%` }}></div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <SignalIcon className="w-8 h-8 text-primary" />
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              +${(metrics.yieldGrowth / 1000).toFixed(0)}k
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">MONTHLY YIELD</p>
          <p className="text-3xl font-black text-white">${(metrics.monthlyYield / 1000).toFixed(0)}k</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <WifiIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-slate-400 text-sm mb-1">ACTIVE STUDIOS</p>
          <p className="text-3xl font-black text-white">{metrics.activeStudios} / {metrics.totalStudios}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-primary" />
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              metrics.incidentStatus === 'low' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'
            }`}>
              {metrics.incidentStatus.toUpperCase()}
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">INCIDENT RATE</p>
          <p className="text-3xl font-black text-white">{metrics.incidentRate}%</p>
        </div>
      </div>

      {/* Regional Units Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Active Studios Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Regional Units</h3>
          <div className="space-y-6">
            {regions.map((region) => (
              <div key={region.id} className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white">{region.name}</h4>
                    <p className="text-xs text-slate-500">{region.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs text-slate-400">{region.studios.length} units</span>
                    {region.avgOccupancy > 0 && (
                      <span className="text-xs text-primary">{region.avgOccupancy}% avg</span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {region.studios.map((studio) => (
                    <div 
                      key={studio.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                      onClick={() => setSelectedStudio(studio.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          studio.status === 'active' ? 'bg-emerald-500' : 
                          studio.status === 'offline' ? 'bg-red-500' : 'bg-amber-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-white text-sm">{studio.name}</p>
                          <p className="text-xs text-slate-500">{studio.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {studio.status === 'active' ? (
                          <>
                            <div className="flex items-center gap-1">
                              <ChartBarIcon className="w-3 h-3 text-primary" />
                              <span className={`text-sm font-medium ${getOccupancyColor(studio.occupancy)}`}>
                                {studio.occupancy}%
                              </span>
                            </div>
                            {getPerformanceIcon(studio.performance)}
                          </>
                        ) : (
                          <span className="text-xs text-red-500">Offline</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Director & Performance */}
        <div className="space-y-8">
          {/* Director Card */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                {director.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{director.name}</h3>
                <p className="text-sm text-slate-400">{director.title}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Offline Studio 04</span>
                <span className="text-sm text-red-500">0% occupancy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Studio 01 Revenue</span>
                <span className="text-sm text-amber-500">$19,200 Below Target (75%)</span>
              </div>
            </div>
          </div>

          {/* Selected Studio Details (if any) */}
          {selectedStudio && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-in slide-in-from-left-5 duration-300">
              <h3 className="text-lg font-bold mb-4">Studio Performance Details</h3>
              {(() => {
                const studio = allStudios.find(s => s.id === selectedStudio);
                if (!studio) return null;
                return (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Studio Name</span>
                      <span className="text-white font-medium">{studio.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location</span>
                      <span className="text-white">{studio.location}</span>
                    </div>
                    {studio.status === 'active' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Occupancy</span>
                          <span className={`font-medium ${getOccupancyColor(studio.occupancy)}`}>{studio.occupancy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Yield</span>
                          <span className="text-white">{studio.yield}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Monthly Revenue</span>
                          <span className="text-primary font-bold">${studio.revenue.toLocaleString()}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <button className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-all">
                            View Full Analytics
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Network Intelligence */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Network Intelligence</h3>
            {insights.map((insight) => (
              <p key={insight.id} className="text-slate-400 leading-relaxed">
                {insight.message}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Audit Button */}
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-all">
          <DocumentTextIcon className="w-5 h-5" />
          GENERATE FULL NETWORK AUDIT
        </button>
      </div>
    </div>
  );
}