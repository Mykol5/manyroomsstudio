'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  HomeIcon,
  StarIcon,
  MapPinIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

// Types
interface RegionData {
  name: string;
  growth: number;
  revenue: number;
}

interface TopLocation {
  id: string;
  name: string;
  occupancy: number;
  rank: number;
}

interface PropertyPerformance {
  id: string;
  name: string;
  roomType: string;
  revpar: number;
  occupancy: number;
  marketVariance: number;
  location: string;
}

export default function FranchiseeSystemPulse() {
  const [lastSync] = useState('Today at 09:42 AM');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 Days');

  // Metrics
  const [metrics] = useState({
    totalRevenue: 128450,
    revenueGrowth: 12.4,
    avgOccupancy: 84.2,
    revpar: 214.50,
  });

  // Region data
  const [regions] = useState<RegionData[]>([
    { name: 'North America', growth: 5.8, revenue: 245000 },
    { name: 'Europe', growth: 15.3, revenue: 198000 },
    { name: 'Asia Pacific', growth: 8.2, revenue: 156000 },
    { name: 'Middle East', growth: 12.4, revenue: 89000 },
  ]);

  // Direct bookings percentage
  const [directBookings] = useState(41.8);

  // Top performing locations
  const [topLocations] = useState<TopLocation[]>([
    { id: '1', name: 'Chelsea Penthouse', occupancy: 98, rank: 1 },
    { id: '2', name: 'Williamsburg Loft', occupancy: 94, rank: 2 },
    { id: '3', name: 'Soho Artist Space', occupancy: 91, rank: 3 },
    { id: '4', name: 'Tribeca Creative Hub', occupancy: 89, rank: 4 },
  ]);

  // Property performance data
  const [properties] = useState<PropertyPerformance[]>([
    {
      id: '1',
      name: 'Suite 402 - Downtown',
      roomType: 'King Luxury',
      revpar: 242.00,
      occupancy: 92,
      marketVariance: 4.2,
      location: 'Downtown',
    },
    {
      id: '2',
      name: 'Garden Loft B',
      roomType: 'Queen Studio',
      revpar: 168.50,
      occupancy: 78,
      marketVariance: 0.0,
      location: 'Brooklyn',
    },
    {
      id: '3',
      name: 'The Atrium #12',
      roomType: 'Deluxe Double',
      revpar: 192.40,
      occupancy: 64,
      marketVariance: -2.1,
      location: 'Midtown',
    },
    {
      id: '4',
      name: 'Skyline Penthouse',
      roomType: 'Executive Suite',
      revpar: 324.50,
      occupancy: 96,
      marketVariance: 8.5,
      location: 'Financial District',
    },
    {
      id: '5',
      name: 'Industrial Loft',
      roomType: 'Creative Space',
      revpar: 185.00,
      occupancy: 82,
      marketVariance: 3.2,
      location: 'Williamsburg',
    },
  ]);

  // Market benchmark data
  const [marketBenchmark] = useState({
    averageADR: 184,
    marketLow: 140,
    marketAvg: 195,
    netPromoterScore: 8.4,
    regionAvg: 7.2,
  });

  // Chart data for revenue performance
  const chartData = [
    { month: 'JAN', revenue: 245000, target: 220000 },
    { month: 'MAR', revenue: 268000, target: 250000 },
    { month: 'MAY', revenue: 295000, target: 280000 },
    { month: 'JUL', revenue: 312000, target: 300000 },
    { month: 'SEP', revenue: 335000, target: 320000 },
    { month: 'NOV', revenue: 358000, target: 340000 },
  ];

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const maxTarget = Math.max(...chartData.map(d => d.target));
  const maxValue = Math.max(maxRevenue, maxTarget);

  // Calendar days for occupancy forecast
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const forecastData = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    occupancy: 65 + Math.sin(i * 0.5) * 15 + Math.random() * 10,
  }));

  const getOccupancyForDay = (day: number) => {
    const data = forecastData.find(d => d.day === day);
    return data ? Math.round(data.occupancy) : 70;
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 80) return 'bg-emerald-500/50 text-emerald-500';
    if (occupancy >= 60) return 'bg-primary/50 text-primary';
    if (occupancy >= 40) return 'bg-amber-500/50 text-amber-500';
    return 'bg-red-500/50 text-red-500';
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Network Analytics</h2>
            <p className="text-slate-400 text-sm mt-1">
              Last synchronized: {lastSync}
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia Pacific</option>
            </select>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CurrencyDollarIcon className="w-8 h-8 text-primary" />
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
              +{metrics.revenueGrowth}%
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-1">TOT Revenue</p>
          <p className="text-3xl font-black text-white">
            ${metrics.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <ChartBarIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-slate-400 text-sm mb-1">AVG. OCCUPANCY</p>
          <p className="text-3xl font-black text-white">{metrics.avgOccupancy}%</p>
          <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${metrics.avgOccupancy}%` }}></div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <HomeIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-slate-400 text-sm mb-1">REVPAR</p>
          <p className="text-3xl font-black text-white">${metrics.revpar}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400">REGIONS</span>
          </div>
          <div className="space-y-2">
            {regions.slice(0, 2).map((region, idx) => (
              <div key={region.name} className="flex justify-between items-center">
                <span className="text-sm text-slate-400">{region.name}</span>
                <span className={`text-sm font-bold ${region.growth > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {region.growth > 0 ? '+' : ''}{region.growth}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Direct Bookings Card */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-1">Last 30 Days</p>
            <p className="text-3xl font-black text-white">{directBookings}%</p>
            <p className="text-sm text-slate-400">DIRECT BOOKINGS</p>
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center">
            <div className="text-2xl font-bold text-primary">{directBookings}%</div>
          </div>
        </div>
      </div>

      {/* Revenue Performance Chart */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
        <h3 className="text-xl font-bold mb-6">Revenue Performance</h3>
        <p className="text-sm text-slate-400 mb-6">Realized vs. Target Revenue trend over the current fiscal year.</p>

        <div className="relative h-80 w-full">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-slate-400">
            <span>$500</span>
            <span>$400</span>
            <span>$300</span>
            <span>$200</span>
            <span>$100</span>
            <span>$0</span>
          </div>

          {/* Chart area */}
          <div className="ml-20 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-t border-white/10 w-full"></div>
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between gap-4">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex flex-col items-center gap-1">
                    <div
                      className="w-6 bg-primary/60 rounded-t transition-all duration-500 hover:bg-primary"
                      style={{ height: `${(data.revenue / maxValue) * 100}%`, minHeight: '4px' }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] text-white whitespace-nowrap">
                        ${(data.revenue / 1000).toFixed(0)}k
                      </div>
                    </div>
                    <div
                      className="w-6 bg-white/20 rounded-t transition-all duration-500"
                      style={{ height: `${(data.target / maxValue) * 100}%`, minHeight: '4px' }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-xs text-slate-400">Actual Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/20 rounded"></div>
            <span className="text-xs text-slate-400">Target</span>
          </div>
        </div>
      </div>

      {/* Occupancy Forecast Calendar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
        <h3 className="text-xl font-bold mb-6">Occupancy Forecast</h3>
        <p className="text-sm text-slate-400 mb-6">Predicted density for the next 4 weeks based on market trends.</p>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {[0, 7, 14, 21].map((weekStart) => (
          <div key={weekStart} className="grid grid-cols-7 gap-2 mb-2">
            {Array.from({ length: 7 }, (_, i) => {
              const day = weekStart + i + 1;
              if (day > 28) return null;
              const occupancy = getOccupancyForDay(day);
              return (
                <div key={day} className="relative group">
                  <div className={`p-3 text-center rounded-lg border border-white/10 hover:bg-white/5 transition-all ${getOccupancyColor(occupancy)}`}>
                    <div className="text-sm font-bold">{day}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{occupancy}%</div>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {occupancy}% Occupancy
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Market Benchmark Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-6">Market Benchmark</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">Your Average ADR</span>
                <span className="text-xl font-bold text-white">${marketBenchmark.averageADR}</span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full">
                <div
                  className="absolute h-2 bg-primary rounded-full"
                  style={{
                    width: `${((marketBenchmark.averageADR - marketBenchmark.marketLow) / (marketBenchmark.marketAvg - marketBenchmark.marketLow)) * 100}%`,
                  }}
                ></div>
                <div
                  className="absolute w-2 h-4 bg-white top-1/2 -translate-y-1/2 rounded-sm"
                  style={{
                    left: `${((marketBenchmark.marketAvg - marketBenchmark.marketLow) / (marketBenchmark.marketAvg - marketBenchmark.marketLow)) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Market Low: ${marketBenchmark.marketLow}</span>
                <span>Market Avg: ${marketBenchmark.marketAvg}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Net Promoter Score</p>
                  <p className="text-3xl font-bold text-white">{marketBenchmark.netPromoterScore}/10</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1">Region Avg</p>
                  <p className="text-lg font-medium text-primary">{marketBenchmark.regionAvg}/10</p>
                </div>
              </div>
              <div className="mt-3 w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(marketBenchmark.netPromoterScore / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-6">Top Performing Locations</h3>
          <div className="space-y-4">
            {topLocations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {location.rank}
                  </div>
                  <div>
                    <p className="font-medium text-white">{location.name}</p>
                    <p className="text-xs text-slate-400">{location.occupancy}% Occupancy</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${location.occupancy}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-primary">{location.occupancy}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Performance Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/10">
          <h3 className="text-xl font-bold">Property Performance Details</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-6 py-4">PROPERTY NAME</th>
                <th className="px-6 py-4">ROOM TYPE</th>
                <th className="px-6 py-4">REVPAR</th>
                <th className="px-6 py-4">OCCUPANCY</th>
                <th className="px-6 py-4">MARKET VARIANCE</th>
                <th className="px-6 py-4 text-right">ACTION</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{property.name}</p>
                      <p className="text-xs text-slate-500">{property.location}</p>
                    </div>
                   </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{property.roomType}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">${property.revpar.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/10 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${property.occupancy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{property.occupancy}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-sm ${property.marketVariance > 0 ? 'text-emerald-500' : property.marketVariance < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      {property.marketVariance > 0 ? <ArrowTrendingUpIcon className="w-3 h-3" /> : property.marketVariance < 0 ? <ArrowTrendingDownIcon className="w-3 h-3" /> : null}
                      {property.marketVariance > 0 ? '+' : ''}{property.marketVariance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs font-medium transition-all">
                      <EyeIcon className="w-3 h-3" />
                      View Assets
                    </button>
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