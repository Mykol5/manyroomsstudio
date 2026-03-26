'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircleIcon,
  PencilIcon,
  ChartBarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Types
interface Studio {
  id: string;
  name: string;
  location: string;
  address: string;
  image: string;
  status: 'active' | 'draft' | 'pending';
  occupancy: number;
  monthly_revenue: number;
  total_bookings: number;
  is_featured?: boolean;
}

export default function OwnerStudios() {
  const [studios, setStudios] = useState<Studio[]>([
    {
      id: '1',
      name: 'The North Studio',
      location: 'Brooklyn, New York',
      address: '123 Industrial Way, Brooklyn, NY 11222',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ0OBOavY0FKXf_EMsibr6U6SbCoFfxj_lJt4X10gLu6kRMZpYBpuluXxmeR1uRUxsqG8n4Qmz7xdDCTfhXb6i05Jcvdyo1068Fwm3ds7yqHwiBsx1vd2oAKmQF0_KBOJ-vzK5nBUb9XjFzUqQfmXBP5aEh1DUrX-5nKtru-wvUGTm4BCm7ivreDJs4HhbNTfTj-BZ_DpIh8FRMUkAUPGJ11kqTL1FCCLdqAqxklAAhZ-vJJ7Gl193YYbntjkXljUhttJeMIFDLmZS',
      status: 'active',
      occupancy: 84,
      monthly_revenue: 12480,
      total_bookings: 156,
      is_featured: true,
    },
    {
      id: '2',
      name: 'Industrial Loft B',
      location: 'Downtown Arts District, LA',
      address: '456 Arts Ave, Los Angeles, CA 90013',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAqqBObVeKGPWNBkarSwoSjOb_8jdm-kxV2JLgldG4Qvm17tLb3-GXqx1MmicQQZ6jSRodspMr45BPWGRKVZb2o-laegPpjyWanYuqhyfmHud1D5n6vnxnT2G3GiEWrJ1xEwoNqQyDVPC64gOq7XN2iYqdO-CWpEXH12W6zZTx_FUW8vRf7uclr422hECfIc5WogeTghAOrs0SZuhCB-ydnavlhF92VYOAE7he8854oLbDr0c3I74oemNGFJaoCQZujPYOxF8Klkee',
      status: 'active',
      occupancy: 92,
      monthly_revenue: 18200,
      total_bookings: 98,
    },
    {
      id: '3',
      name: 'White Space Atelier',
      location: 'Shoreditch, London',
      address: '789 Creative Lane, London E1 6AW',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmszfPzgLGhKuxLS3msiKMOpXeMHWCqwS6zfsimoW_FT41pCSnQWaL2Ncrigj3Wp1dTbYBn6AswVht5ZaWlTMwtfFyP-SFsun4rPRGAQ_0yQCw-gWoMDEZEi_BKzm5w3mU-ASlB1UnqTgjRY2etqr0PFTZcBldugHTxmg_yUtBG45t1KFBLwJX_zIV5ll9OkSF_1Vv_6vgvgyI8zIF0-D3h69tra_YubneXr1y3faPNkzNr_wVSVPRMpYG5louHfjjBYiBBBIJ_MSu',
      status: 'draft',
      occupancy: 0,
      monthly_revenue: 0,
      total_bookings: 0,
    },
    {
      id: '4',
      name: 'The Canvas Room',
      location: 'Montmartre, Paris',
      address: '32 Rue des Arts, Paris 75018',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjrsoQOG5B3__M5L-1XQiWvwIeXEZxu5JuEd_k6zayLy8hd18Z3PjD3NaV8jEmdrk9j0hylGTOfWTgRNJvK-pDlYA3SuIl4_tKbn3B1wPSyqFB2dcYOHNK-X2LQJyKUz-jbjqdl9Ul6B2NvzbsStrctUhu_-ycoOSJxY4UXYPBYvqsKy7TXVokKLmsgaSElesZhVFeZvf50XbXV3el3q7GtxdZ9kRfb69RavWeZ04B_zyFkd0wdruxqa6UcyIL2RnynZj8wKu_IrmZ',
      status: 'active',
      occupancy: 67,
      monthly_revenue: 9800,
      total_bookings: 67,
    },
  ]);

  // Portfolio stats
  const totalProperties = studios.length;
  const activeListings = studios.filter(s => s.status === 'active').length;
  const portfolioValue = studios.reduce((sum, s) => sum + s.monthly_revenue, 0);
  const avgOccupancy = studios
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.occupancy, 0) / (activeListings || 1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><CheckCircleIcon className="w-3 h-3" /> ACTIVE</span>;
      case 'draft':
        return <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><ClockIcon className="w-3 h-3" /> DRAFT</span>;
      default:
        return null;
    }
  };

  const handleEditStudio = (studioId: string) => {
    console.log('Edit studio:', studioId);
  };

  const handleViewAnalytics = (studioId: string) => {
    console.log('View analytics:', studioId);
  };

  const handleStartDraft = () => {
    console.log('Start new studio draft');
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight">My Studios</h2>
        <p className="text-slate-400 text-sm mt-1">
          Curate your physical spaces. Manage listings, track analytics, and adjust availability for your creative ateliers across the city.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-bold text-slate-400">TOTAL PROPERTIES</span>
          </div>
          <p className="text-4xl font-black text-white">{totalProperties.toString().padStart(2, '0')}</p>
          <p className="text-xs text-slate-500 mt-2">Across {studios.map(s => s.location.split(',')[1]?.trim() || s.location.split(',')[0]).filter((v,i,a)=>a.indexOf(v)===i).length} cities</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-bold text-slate-400">ACTIVE LISTINGS</span>
          </div>
          <p className="text-4xl font-black text-white">{activeListings.toString().padStart(2, '0')}</p>
          <p className="text-xs text-slate-500 mt-2">{studios.length - activeListings} studio(s) in draft</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-bold text-slate-400">PORTFOLIO VALUE</span>
          </div>
          <p className="text-4xl font-black text-white">${(portfolioValue / 1000).toFixed(1)}k</p>
          <p className="text-xs text-slate-500 mt-2">Monthly Avg. Revenue</p>
        </div>
      </div>

      {/* Avg Occupancy Card */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-1">AVG. OCCUPANCY</p>
            <p className="text-5xl font-black text-white">{Math.round(avgOccupancy)}%</p>
            <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-3 h-3" />
              +12% from last month
            </p>
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center">
            <div className="text-2xl font-bold text-primary">{Math.round(avgOccupancy)}%</div>
          </div>
        </div>
      </div>

      {/* Studios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studios.map((studio) => (
          <div
            key={studio.id}
            className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex">
              {/* Studio Image */}
              <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden flex-shrink-0">
                <img
                  src={studio.image}
                  alt={studio.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Studio Info */}
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{studio.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <MapPinIcon className="w-3 h-3" />
                      {studio.location}
                    </div>
                  </div>
                  {getStatusBadge(studio.status)}
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{studio.address}</p>

                {studio.status === 'active' && (
                  <div className="flex gap-4 mt-3 text-xs">
                    <div>
                      <span className="text-slate-500">Occupancy</span>
                      <p className="text-sm font-bold text-white">{studio.occupancy}%</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Monthly</span>
                      <p className="text-sm font-bold text-primary">${studio.monthly_revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Bookings</span>
                      <p className="text-sm font-bold text-white">{studio.total_bookings}</p>
                    </div>
                  </div>
                )}

                {studio.status === 'draft' && (
                  <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-500">Complete your listing to start accepting bookings</p>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  {studio.status === 'draft' ? (
                    <button
                      onClick={() => handleEditStudio(studio.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-all"
                    >
                      <PencilIcon className="w-4 h-4" />
                      FINISH LISTING
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditStudio(studio.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
                    >
                      <PencilIcon className="w-4 h-4" />
                      EDIT STUDIO
                    </button>
                  )}
                  <button
                    onClick={() => handleViewAnalytics(studio.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
                  >
                    <ChartBarIcon className="w-4 h-4" />
                    ANALYTICS
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expand Portfolio Card */}
      <div className="mt-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <PlusCircleIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Expand Your Portfolio</h3>
          <p className="text-slate-400 mb-6">
            Have a new space? Start a new listing in minutes and reach creative professionals worldwide.
          </p>
          <button
            onClick={handleStartDraft}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold transition-all"
          >
            <PlusCircleIcon className="w-5 h-5" />
            START DRAFTING
          </button>
        </div>
      </div>
    </div>
  );
}