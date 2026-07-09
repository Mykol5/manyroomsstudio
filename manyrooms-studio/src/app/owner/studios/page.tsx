// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import {
//   PlusCircleIcon,
//   PencilIcon,
//   ChartBarIcon,
//   MapPinIcon,
//   CurrencyDollarIcon,
//   HomeIcon,
//   ArrowTrendingUpIcon,
//   CheckCircleIcon,
//   ClockIcon,
// } from '@heroicons/react/24/outline';

// // Types
// interface Studio {
//   id: string;
//   name: string;
//   location: string;
//   address: string;
//   image: string;
//   status: 'active' | 'draft' | 'pending';
//   occupancy: number;
//   monthly_revenue: number;
//   total_bookings: number;
//   is_featured?: boolean;
// }

// export default function OwnerStudios() {
//   const [studios, setStudios] = useState<Studio[]>([
//     {
//       id: '1',
//       name: 'The North Studio',
//       location: 'Brooklyn, New York',
//       address: '123 Industrial Way, Brooklyn, NY 11222',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ0OBOavY0FKXf_EMsibr6U6SbCoFfxj_lJt4X10gLu6kRMZpYBpuluXxmeR1uRUxsqG8n4Qmz7xdDCTfhXb6i05Jcvdyo1068Fwm3ds7yqHwiBsx1vd2oAKmQF0_KBOJ-vzK5nBUb9XjFzUqQfmXBP5aEh1DUrX-5nKtru-wvUGTm4BCm7ivreDJs4HhbNTfTj-BZ_DpIh8FRMUkAUPGJ11kqTL1FCCLdqAqxklAAhZ-vJJ7Gl193YYbntjkXljUhttJeMIFDLmZS',
//       status: 'active',
//       occupancy: 84,
//       monthly_revenue: 12480,
//       total_bookings: 156,
//       is_featured: true,
//     },
//     {
//       id: '2',
//       name: 'Industrial Loft B',
//       location: 'Downtown Arts District, LA',
//       address: '456 Arts Ave, Los Angeles, CA 90013',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAqqBObVeKGPWNBkarSwoSjOb_8jdm-kxV2JLgldG4Qvm17tLb3-GXqx1MmicQQZ6jSRodspMr45BPWGRKVZb2o-laegPpjyWanYuqhyfmHud1D5n6vnxnT2G3GiEWrJ1xEwoNqQyDVPC64gOq7XN2iYqdO-CWpEXH12W6zZTx_FUW8vRf7uclr422hECfIc5WogeTghAOrs0SZuhCB-ydnavlhF92VYOAE7he8854oLbDr0c3I74oemNGFJaoCQZujPYOxF8Klkee',
//       status: 'active',
//       occupancy: 92,
//       monthly_revenue: 18200,
//       total_bookings: 98,
//     },
//     {
//       id: '3',
//       name: 'White Space Atelier',
//       location: 'Shoreditch, London',
//       address: '789 Creative Lane, London E1 6AW',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmszfPzgLGhKuxLS3msiKMOpXeMHWCqwS6zfsimoW_FT41pCSnQWaL2Ncrigj3Wp1dTbYBn6AswVht5ZaWlTMwtfFyP-SFsun4rPRGAQ_0yQCw-gWoMDEZEi_BKzm5w3mU-ASlB1UnqTgjRY2etqr0PFTZcBldugHTxmg_yUtBG45t1KFBLwJX_zIV5ll9OkSF_1Vv_6vgvgyI8zIF0-D3h69tra_YubneXr1y3faPNkzNr_wVSVPRMpYG5louHfjjBYiBBBIJ_MSu',
//       status: 'draft',
//       occupancy: 0,
//       monthly_revenue: 0,
//       total_bookings: 0,
//     },
//     {
//       id: '4',
//       name: 'The Canvas Room',
//       location: 'Montmartre, Paris',
//       address: '32 Rue des Arts, Paris 75018',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjrsoQOG5B3__M5L-1XQiWvwIeXEZxu5JuEd_k6zayLy8hd18Z3PjD3NaV8jEmdrk9j0hylGTOfWTgRNJvK-pDlYA3SuIl4_tKbn3B1wPSyqFB2dcYOHNK-X2LQJyKUz-jbjqdl9Ul6B2NvzbsStrctUhu_-ycoOSJxY4UXYPBYvqsKy7TXVokKLmsgaSElesZhVFeZvf50XbXV3el3q7GtxdZ9kRfb69RavWeZ04B_zyFkd0wdruxqa6UcyIL2RnynZj8wKu_IrmZ',
//       status: 'active',
//       occupancy: 67,
//       monthly_revenue: 9800,
//       total_bookings: 67,
//     },
//   ]);

//   // Portfolio stats
//   const totalProperties = studios.length;
//   const activeListings = studios.filter(s => s.status === 'active').length;
//   const portfolioValue = studios.reduce((sum, s) => sum + s.monthly_revenue, 0);
//   const avgOccupancy = studios
//     .filter(s => s.status === 'active')
//     .reduce((sum, s) => sum + s.occupancy, 0) / (activeListings || 1);

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'active':
//         return <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><CheckCircleIcon className="w-3 h-3" /> ACTIVE</span>;
//       case 'draft':
//         return <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><ClockIcon className="w-3 h-3" /> DRAFT</span>;
//       default:
//         return null;
//     }
//   };

//   const handleEditStudio = (studioId: string) => {
//     console.log('Edit studio:', studioId);
//   };

//   const handleViewAnalytics = (studioId: string) => {
//     console.log('View analytics:', studioId);
//   };

//   const handleStartDraft = () => {
//     console.log('Start new studio draft');
//   };

//   return (
//     <div className="p-8 max-w-[1600px] mx-auto">
//       {/* Page Header */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-black tracking-tight">My Studios</h2>
//         <p className="text-slate-400 text-sm mt-1">
//           Curate your physical spaces. Manage listings, track analytics, and adjust availability for your creative ateliers across the city.
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
//               <HomeIcon className="w-5 h-5 text-primary" />
//             </div>
//             <span className="text-xs font-bold text-slate-400">TOTAL PROPERTIES</span>
//           </div>
//           <p className="text-4xl font-black text-white">{totalProperties.toString().padStart(2, '0')}</p>
//           <p className="text-xs text-slate-500 mt-2">Across {studios.map(s => s.location.split(',')[1]?.trim() || s.location.split(',')[0]).filter((v,i,a)=>a.indexOf(v)===i).length} cities</p>
//         </div>

//         <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
//               <CheckCircleIcon className="w-5 h-5 text-primary" />
//             </div>
//             <span className="text-xs font-bold text-slate-400">ACTIVE LISTINGS</span>
//           </div>
//           <p className="text-4xl font-black text-white">{activeListings.toString().padStart(2, '0')}</p>
//           <p className="text-xs text-slate-500 mt-2">{studios.length - activeListings} studio(s) in draft</p>
//         </div>

//         <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
//               <CurrencyDollarIcon className="w-5 h-5 text-primary" />
//             </div>
//             <span className="text-xs font-bold text-slate-400">PORTFOLIO VALUE</span>
//           </div>
//           <p className="text-4xl font-black text-white">${(portfolioValue / 1000).toFixed(1)}k</p>
//           <p className="text-xs text-slate-500 mt-2">Monthly Avg. Revenue</p>
//         </div>
//       </div>

//       {/* Avg Occupancy Card */}
//       <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6 mb-10">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-slate-400 text-sm mb-1">AVG. OCCUPANCY</p>
//             <p className="text-5xl font-black text-white">{Math.round(avgOccupancy)}%</p>
//             <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
//               <ArrowTrendingUpIcon className="w-3 h-3" />
//               +12% from last month
//             </p>
//           </div>
//           <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center">
//             <div className="text-2xl font-bold text-primary">{Math.round(avgOccupancy)}%</div>
//           </div>
//         </div>
//       </div>

//       {/* Studios Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {studios.map((studio) => (
//           <div
//             key={studio.id}
//             className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300"
//           >
//             <div className="flex">
//               {/* Studio Image */}
//               <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden flex-shrink-0">
//                 <img
//                   src={studio.image}
//                   alt={studio.name}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                 />
//               </div>

//               {/* Studio Info */}
//               <div className="flex-1 p-5">
//                 <div className="flex items-start justify-between mb-2">
//                   <div>
//                     <h3 className="text-lg font-bold text-white">{studio.name}</h3>
//                     <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
//                       <MapPinIcon className="w-3 h-3" />
//                       {studio.location}
//                     </div>
//                   </div>
//                   {getStatusBadge(studio.status)}
//                 </div>

//                 <p className="text-xs text-slate-500 mt-2 line-clamp-2">{studio.address}</p>

//                 {studio.status === 'active' && (
//                   <div className="flex gap-4 mt-3 text-xs">
//                     <div>
//                       <span className="text-slate-500">Occupancy</span>
//                       <p className="text-sm font-bold text-white">{studio.occupancy}%</p>
//                     </div>
//                     <div>
//                       <span className="text-slate-500">Monthly</span>
//                       <p className="text-sm font-bold text-primary">${studio.monthly_revenue.toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <span className="text-slate-500">Bookings</span>
//                       <p className="text-sm font-bold text-white">{studio.total_bookings}</p>
//                     </div>
//                   </div>
//                 )}

//                 {studio.status === 'draft' && (
//                   <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
//                     <p className="text-xs text-amber-500">Complete your listing to start accepting bookings</p>
//                   </div>
//                 )}

//                 <div className="flex gap-3 mt-4">
//                   {studio.status === 'draft' ? (
//                     <button
//                       onClick={() => handleEditStudio(studio.id)}
//                       className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-all"
//                     >
//                       <PencilIcon className="w-4 h-4" />
//                       FINISH LISTING
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleEditStudio(studio.id)}
//                       className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
//                     >
//                       <PencilIcon className="w-4 h-4" />
//                       EDIT STUDIO
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleViewAnalytics(studio.id)}
//                     className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
//                   >
//                     <ChartBarIcon className="w-4 h-4" />
//                     ANALYTICS
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Expand Portfolio Card */}
//       <div className="mt-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-8 text-center">
//         <div className="max-w-2xl mx-auto">
//           <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
//             <PlusCircleIcon className="w-8 h-8 text-primary" />
//           </div>
//           <h3 className="text-2xl font-bold mb-2">Expand Your Portfolio</h3>
//           <p className="text-slate-400 mb-6">
//             Have a new space? Start a new listing in minutes and reach creative professionals worldwide.
//           </p>
//           <button
//             onClick={handleStartDraft}
//             className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold transition-all"
//           >
//             <PlusCircleIcon className="w-5 h-5" />
//             START DRAFTING
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }





// app/owner/studios/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  PlusCircleIcon,
  PencilIcon,
  MapPinIcon,
  HomeIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Brand Colors
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  brown: '#DB8B8C',
  dark: '#3C291C',
};

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface Studio {
  id: string;
  name: string;
  city: string;
  state: string;
  street_address: string;
  images: string[];
  status: string;
  hourly_rate: number;
  capacity: number;
  created_at: string;
}

export default function OwnerStudiosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) fetchStudios();
  }, [user, authLoading]);

  const fetchStudios = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('studios').select('*').eq('owner_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setStudios(data || []);
    } catch (error) { console.error('Error fetching studios:', error); }
    finally { setLoading(false); }
  };

  const activeStudios = studios.filter(s => s.status === 'approved' || s.status === 'active');
  const draftStudios = studios.filter(s => s.status === 'pending' || s.status === 'draft');
  const estimatedRevenue = studios.reduce((sum, s) => sum + (s.hourly_rate * 50), 0);
  const uniqueCities = [...new Set(studios.map(s => s.city))].length;

  const getCoverImage = (images: string[]) => (!images || images.length === 0 ? null : images[0]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': case 'active':
        return (
          <span className="px-3 py-1 bg-[#F1CB81]/30 text-[#3C291C] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#F1CB81]/50">
            Active
          </span>
        );
      case 'pending': case 'draft':
        return (
          <span className="px-3 py-1 bg-[#DB8B8C]/20 text-[#3C291C] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#DB8B8C]/30">
            {status === 'pending' ? 'Pending' : 'Draft'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-[#3C291C]/5 text-[#3C291C]/60 text-[10px] font-bold uppercase tracking-wider rounded-full">
            {status || 'Draft'}
          </span>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-16 h-16 bg-[#F1CB81]/40 rounded-full mx-auto"></div>
          <p className="text-[#3C291C] font-bold">Loading Studios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#3C291C] leading-tight">My Studios</h1>
            <p className="text-lg text-[#3C291C]/60 mt-2 max-w-lg">
              Manage your creative spaces, view booking schedules, and optimize your listings.
            </p>
          </div>
          <Link href="/owner/list-new"
            className="bg-[#F1CB81] text-[#3C291C] flex items-center gap-2 px-6 md:px-8 py-4 md:py-5 rounded-2xl font-extrabold text-lg hover:bg-[#DB8B8C] hover:text-white transition-all duration-300 shadow-lg active:scale-95">
            <PlusCircleIcon className="w-6 h-6" />
            List New Room
          </Link>
        </header>

        {/* Studio Grid */}
        {studios.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-[#3C291C]/10">
            <div className="w-20 h-20 bg-[#F1CB81]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <PlusCircleIcon className="w-10 h-10 text-[#3C291C]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">No Studios Yet</h3>
            <p className="text-[#3C291C]/60 mb-8 max-w-md mx-auto">Get started by listing your first creative space.</p>
            <Link href="/owner/list-new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#F1CB81] text-[#3C291C] rounded-2xl font-extrabold text-lg hover:bg-[#DB8B8C] hover:text-white transition-all shadow-lg">
              <PlusCircleIcon className="w-5 h-5" /> List Your First Studio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {studios.map((studio) => (
              <div key={studio.id}
                className="group relative flex flex-col bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#3C291C]/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg">
                
                <div className="relative h-[320px] md:h-[400px] overflow-hidden">
                  {getCoverImage(studio.images) ? (
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={getCoverImage(studio.images)!} alt={studio.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#3C291C]/5">
                      <HomeIcon className="w-16 h-16 text-[#3C291C]/20" />
                    </div>
                  )}
                  <div className="absolute top-6 right-6">{getStatusBadge(studio.status)}</div>
                </div>

                <div className="p-6 md:p-8 -mt-16 bg-white border border-[#3C291C]/10 relative mx-4 md:mx-6 mb-4 md:mb-6 rounded-2xl shadow-sm">
                  <h2 className="text-2xl font-extrabold text-[#3C291C] mb-1">{studio.name}</h2>
                  <p className="text-[#3C291C]/60 text-sm mb-5 flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4 text-[#DB8B8C]" /> {studio.city}, {studio.state}
                  </p>
                  <div className="flex items-center gap-3">
                    <Link href={`/owner/studios/${studio.id}/edit`}
                      className="flex-grow bg-[#3C291C] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#DB8B8C] transition-colors flex items-center justify-center gap-2">
                      <PencilIcon className="w-4 h-4" /> Edit Profile
                    </Link>
                    <Link href={`/owner/studios/${studio.id}/bookings`}
                      className="w-12 h-12 flex items-center justify-center bg-[#3C291C]/5 text-[#3C291C] rounded-xl hover:bg-[#F1CB81]/30 transition-colors"
                      title="View Bookings">
                      <MaterialIcon icon="calendar_today" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Bar */}
        {studios.length > 0 && (
          <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: studios.length, label: 'Total Studios', color: 'text-[#3C291C]' },
              { value: activeStudios.length, label: 'Active Listings', color: 'text-[#3C291C]' },
              { value: `$${(estimatedRevenue / 1000).toFixed(1)}k`, label: 'Monthly Revenue', color: 'text-[#DB8B8C]' },
              { value: uniqueCities, label: 'Cities', color: 'text-[#3C291C]' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-[#3C291C]/10 flex flex-col items-center text-center">
                <span className={`text-4xl md:text-5xl font-extrabold mb-1 ${stat.color}`}>{stat.value}</span>
                <span className="text-xs font-bold text-[#3C291C]/40 tracking-widest uppercase">{stat.label}</span>
              </div>
            ))}
          </section>
        )}

        {/* Expand Portfolio CTA */}
        <div className="mt-12 bg-white rounded-[32px] p-8 md:p-12 text-center shadow-sm border border-[#3C291C]/10">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-[#F1CB81]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <PlusCircleIcon className="w-8 h-8 text-[#3C291C]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">Expand Your Portfolio</h3>
            <p className="text-[#3C291C]/60 mb-8">Have a new space? Start a new listing in minutes and reach creative professionals worldwide.</p>
            <Link href="/owner/list-new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#F1CB81] text-[#3C291C] rounded-2xl font-extrabold text-lg hover:bg-[#DB8B8C] hover:text-white transition-all shadow-lg">
              <PlusCircleIcon className="w-5 h-5" /> Start Drafting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



// // app/owner/studios/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';
// import {
//   PlusCircleIcon,
//   PencilIcon,
//   MapPinIcon,
//   HomeIcon,
//   CurrencyDollarIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   StarIcon,
//   ChatBubbleLeftIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   street_address: string;
//   images: string[];
//   status: string;
//   hourly_rate: number;
//   capacity: number;
//   created_at: string;
// }

// export default function OwnerStudiosPage() {
//   const { user, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [studios, setStudios] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push('/login');
//       return;
//     }
//     if (user) {
//       fetchStudios();
//     }
//   }, [user, authLoading]);

//   const fetchStudios = async () => {
//     if (!user?.id) return;
//     setLoading(true);
    
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('owner_id', user.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setStudios(data || []);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const activeStudios = studios.filter(s => s.status === 'approved' || s.status === 'active');
//   const draftStudios = studios.filter(s => s.status === 'pending' || s.status === 'draft');
//   const estimatedRevenue = studios.reduce((sum, s) => sum + (s.hourly_rate * 50), 0);
//   const uniqueCities = [...new Set(studios.map(s => s.city))].length;

//   const getCoverImage = (images: string[]) => {
//     if (!images || images.length === 0) return null;
//     return images[0];
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'approved':
//       case 'active':
//         return (
//           <span className="px-3 py-1 bg-[#beff5f] text-[#111f00] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#446900]/20">
//             Active
//           </span>
//         );
//       case 'pending':
//         return (
//           <span className="px-3 py-1 bg-[#ffdbcf] text-[#822800] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#a43c12]/20">
//             Draft
//           </span>
//         );
//       case 'draft':
//         return (
//           <span className="px-3 py-1 bg-[#ffdbcf] text-[#822800] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#a43c12]/20">
//             Draft
//           </span>
//         );
//       default:
//         return (
//           <span className="px-3 py-1 bg-[#edeeef] text-[#424937] text-[10px] font-bold uppercase tracking-wider rounded-full">
//             {status || 'Draft'}
//           </span>
//         );
//     }
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="animate-pulse space-y-4 text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto"></div>
//           <p className="text-[#446900] font-bold">Loading Studios...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        
//         {/* Header Section */}
//         <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//           <div>
//             <h1 className="text-4xl md:text-6xl font-extrabold text-[#191c1d] leading-tight">My Studios</h1>
//             <p className="text-lg text-[#424937] mt-2 max-w-lg">
//               Manage your creative spaces, view booking schedules, and optimize your listings.
//             </p>
//           </div>
//           <Link
//             href="/owner/list-new"
//             className="bg-[#beff5f] text-[#111f00] flex items-center gap-2 px-6 md:px-8 py-4 md:py-5 rounded-2xl font-extrabold text-lg hover:scale-105 transition-all duration-300 shadow-lg active:scale-95 group"
//           >
//             <PlusCircleIcon className="w-6 h-6" />
//             List New Room
//           </Link>
//         </header>

//         {/* Studio Grid */}
//         {studios.length === 0 ? (
//           <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[32px] p-12 text-center shadow-lg">
//             <div className="w-20 h-20 bg-[#beff5f]/30 rounded-full flex items-center justify-center mx-auto mb-6">
//               <PlusCircleIcon className="w-10 h-10 text-[#446900]" />
//             </div>
//             <h3 className="text-2xl font-extrabold text-[#191c1d] mb-2">No Studios Yet</h3>
//             <p className="text-[#424937] mb-8 max-w-md mx-auto">
//               Get started by listing your first creative space. Reach creative professionals worldwide.
//             </p>
//             <Link
//               href="/owner/list-new"
//               className="inline-flex items-center gap-2 px-8 py-4 bg-[#beff5f] text-[#111f00] rounded-2xl font-extrabold text-lg hover:scale-105 transition-all shadow-lg"
//             >
//               <PlusCircleIcon className="w-5 h-5" />
//               List Your First Studio
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//             {studios.map((studio) => (
//               <div
//                 key={studio.id}
//                 className="group relative flex flex-col bg-white/80 backdrop-blur-xl border border-white/40 rounded-[32px] overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2"
//               >
//                 {/* Image */}
//                 <div className="relative h-[320px] md:h-[400px] overflow-hidden">
//                   {getCoverImage(studio.images) ? (
//                     <img
//                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                       src={getCoverImage(studio.images)!}
//                       alt={studio.name}
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-[#edeeef]">
//                       <HomeIcon className="w-16 h-16 text-[#c2c9b1]" />
//                     </div>
//                   )}
//                   <div className="absolute top-6 right-6">
//                     {getStatusBadge(studio.status)}
//                   </div>
//                 </div>

//                 {/* Glass Card Overlay */}
//                 <div className="p-6 md:p-8 -mt-16 bg-white/80 backdrop-blur-xl border border-white/40 relative mx-4 md:mx-6 mb-4 md:mb-6 rounded-2xl shadow-lg">
//                   <h2 className="text-2xl font-extrabold text-[#191c1d] mb-1">{studio.name}</h2>
//                   <p className="text-[#424937] text-sm mb-5 flex items-center gap-1">
//                     <MapPinIcon className="w-4 h-4" />
//                     {studio.city}, {studio.state}
//                   </p>
//                   <div className="flex items-center gap-3">
//                     <Link
//                       href={`/owner/studios/${studio.id}/edit`}
//                       className="flex-grow bg-[#2e3132] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#446900] transition-colors flex items-center justify-center gap-2"
//                     >
//                       <PencilIcon className="w-4 h-4" />
//                       Edit Profile
//                     </Link>
//                     <Link
//                       href={`/owner/studios/${studio.id}/bookings`}
//                       className="w-12 h-12 flex items-center justify-center bg-[#e7e8e9] text-[#191c1d] rounded-xl hover:bg-[#e4d7fd] transition-colors"
//                       title="View Bookings"
//                     >
//                       <MaterialIcon icon="calendar_today" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Stats Bar */}
//         {studios.length > 0 && (
//           <section className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//             <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
//               <span className="text-4xl md:text-5xl font-extrabold text-[#446900] mb-1">{studios.length}</span>
//               <span className="text-xs font-bold text-[#424937] tracking-widest uppercase">Total Studios</span>
//             </div>
//             <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
//               <span className="text-4xl md:text-5xl font-extrabold text-[#446900] mb-1">{activeStudios.length}</span>
//               <span className="text-xs font-bold text-[#424937] tracking-widest uppercase">Active Listings</span>
//             </div>
//             <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
//               <span className="text-4xl md:text-5xl font-extrabold text-[#446900] mb-1">${(estimatedRevenue / 1000).toFixed(1)}k</span>
//               <span className="text-xs font-bold text-[#424937] tracking-widest uppercase">Monthly Revenue</span>
//             </div>
//             <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
//               <span className="text-4xl md:text-5xl font-extrabold text-[#446900] mb-1">{uniqueCities}</span>
//               <span className="text-xs font-bold text-[#424937] tracking-widest uppercase">Cities</span>
//             </div>
//           </section>
//         )}

//         {/* Expand Portfolio CTA */}
//         <div className="mt-12 bg-white/80 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 md:p-12 text-center shadow-lg">
//           <div className="max-w-2xl mx-auto">
//             <div className="w-16 h-16 bg-[#beff5f]/30 rounded-full flex items-center justify-center mx-auto mb-6">
//               <PlusCircleIcon className="w-8 h-8 text-[#446900]" />
//             </div>
//             <h3 className="text-2xl font-extrabold text-[#191c1d] mb-2">Expand Your Portfolio</h3>
//             <p className="text-[#424937] mb-8">
//               Have a new space? Start a new listing in minutes and reach creative professionals worldwide.
//             </p>
//             <Link
//               href="/owner/list-new"
//               className="inline-flex items-center gap-2 px-8 py-4 bg-[#beff5f] text-[#111f00] rounded-2xl font-extrabold text-lg hover:scale-105 transition-all shadow-lg"
//             >
//               <PlusCircleIcon className="w-5 h-5" />
//               Start Drafting
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';
// import {
//   PlusCircleIcon,
//   PencilIcon,
//   ChartBarIcon,
//   MapPinIcon,
//   CurrencyDollarIcon,
//   HomeIcon,
//   ArrowTrendingUpIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   EyeIcon,
// } from '@heroicons/react/24/outline';

// // Types based on your database schema
// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   street_address: string;
//   images: string[];
//   status: string;
//   hourly_rate: number;
//   capacity: number;
//   created_at: string;
// }

// export default function OwnerStudios() {
//   const { user, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [studios, setStudios] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch studios from Supabase
//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push('/login');
//       return;
//     }
//     if (user) {
//       fetchStudios();
//     }
//   }, [user, authLoading]);

//   const fetchStudios = async () => {
//     if (!user?.id) return;
    
//     setLoading(true);
    
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('owner_id', user.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
      
//       setStudios(data || []);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Portfolio stats from real data
//   const totalProperties = studios.length;
//   const activeListings = studios.filter(s => s.status === 'approved' || s.status === 'active').length;
//   const draftListings = studios.filter(s => s.status === 'pending' || s.status === 'draft').length;
//   const portfolioValue = studios.reduce((sum, s) => sum + (s.hourly_rate * 50), 0); // Estimate monthly revenue
//   const uniqueCities = [...new Set(studios.map(s => s.city))].length;

//   // Calculate average occupancy (would come from bookings in real app)
//   const avgOccupancy = activeListings > 0 ? Math.floor(Math.random() * 30) + 70 : 0;

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'approved':
//       case 'active':
//         return <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><CheckCircleIcon className="w-3 h-3" /> ACTIVE</span>;
//       case 'pending':
//         return <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><ClockIcon className="w-3 h-3" /> PENDING</span>;
//       case 'draft':
//         return <span className="flex items-center gap-1 text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold"><ClockIcon className="w-3 h-3" /> DRAFT</span>;
//       default:
//         return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-400">{status || 'DRAFT'}</span>;
//     }
//   };

//   const getCoverImage = (images: string[]) => {
//     if (!images || images.length === 0) return '/placeholder-studio.jpg';
//     return images[0];
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background-dark">
//         <div className="animate-pulse space-y-4">
//           <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
//           <div className="text-primary font-bold">Loading Studios...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-[1600px] mx-auto">
//       {/* Page Header */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-black tracking-tight">My Studios</h2>
//         <p className="text-slate-400 text-sm mt-1">
//           Curate your physical spaces. Manage listings, track analytics, and adjust availability for your creative ateliers across the city.
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
//               <HomeIcon className="w-5 h-5 text-primary" />
//             </div>
//             <span className="text-xs font-bold text-slate-400">TOTAL PROPERTIES</span>
//           </div>
//           <p className="text-4xl font-black text-white">{totalProperties.toString().padStart(2, '0')}</p>
//           <p className="text-xs text-slate-500 mt-2">Across {uniqueCities} cities</p>
//         </div>

//         <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
//               <CheckCircleIcon className="w-5 h-5 text-primary" />
//             </div>
//             <span className="text-xs font-bold text-slate-400">ACTIVE LISTINGS</span>
//           </div>
//           <p className="text-4xl font-black text-white">{activeListings.toString().padStart(2, '0')}</p>
//           <p className="text-xs text-slate-500 mt-2">{draftListings} studio(s) in draft/pending</p>
//         </div>

//         <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
//               <CurrencyDollarIcon className="w-5 h-5 text-primary" />
//             </div>
//             <span className="text-xs font-bold text-slate-400">PORTFOLIO VALUE</span>
//           </div>
//           <p className="text-4xl font-black text-white">${(portfolioValue / 1000).toFixed(1)}k</p>
//           <p className="text-xs text-slate-500 mt-2">Est. Monthly Revenue</p>
//         </div>
//       </div>

//       {/* Avg Occupancy Card */}
//       {activeListings > 0 && (
//         <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6 mb-10">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-slate-400 text-sm mb-1">AVG. OCCUPANCY</p>
//               <p className="text-5xl font-black text-white">{avgOccupancy}%</p>
//               <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
//                 <ArrowTrendingUpIcon className="w-3 h-3" />
//                 +12% from last month
//               </p>
//             </div>
//             <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center">
//               <div className="text-2xl font-bold text-primary">{avgOccupancy}%</div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Studios Grid */}
//       {studios.length === 0 ? (
//         <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
//           <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
//             <PlusCircleIcon className="w-8 h-8 text-primary" />
//           </div>
//           <h3 className="text-2xl font-bold mb-2">No Studios Yet</h3>
//           <p className="text-slate-400 mb-6">Get started by listing your first creative space.</p>
//           <Link
//             href="/owner/list-new"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold transition-all"
//           >
//             <PlusCircleIcon className="w-5 h-5" />
//             LIST YOUR FIRST STUDIO
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {studios.map((studio) => (
//             <div
//               key={studio.id}
//               className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300"
//             >
//               <div className="flex">
//                 {/* Studio Image */}
//                 <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden flex-shrink-0">
//                   <img
//                     src={getCoverImage(studio.images)}
//                     alt={studio.name}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                 </div>

//                 {/* Studio Info */}
//                 <div className="flex-1 p-5">
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <h3 className="text-lg font-bold text-white line-clamp-1">{studio.name}</h3>
//                       <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
//                         <MapPinIcon className="w-3 h-3" />
//                         {studio.city}, {studio.state}
//                       </div>
//                     </div>
//                     {getStatusBadge(studio.status)}
//                   </div>

//                   <p className="text-xs text-slate-500 mt-2 line-clamp-2">{studio.street_address}</p>

//                   {(studio.status === 'approved' || studio.status === 'active') && (
//                     <div className="flex gap-4 mt-3 text-xs">
//                       <div>
//                         <span className="text-slate-500">Hourly Rate</span>
//                         <p className="text-sm font-bold text-primary">${studio.hourly_rate}/hr</p>
//                       </div>
//                       <div>
//                         <span className="text-slate-500">Capacity</span>
//                         <p className="text-sm font-bold text-white">{studio.capacity} people</p>
//                       </div>
//                     </div>
//                   )}

//                   {studio.status === 'pending' && (
//                     <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
//                       <p className="text-xs text-amber-500">Under review by our team. You'll be notified once approved.</p>
//                     </div>
//                   )}

//                   {studio.status === 'draft' && (
//                     <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
//                       <p className="text-xs text-amber-500">Complete your listing to submit for review.</p>
//                     </div>
//                   )}

//                   <div className="flex gap-3 mt-4">
//                     {studio.status === 'draft' ? (
//                       <Link
//                         href={`/owner/list-new?edit=${studio.id}`}
//                         className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-all"
//                       >
//                         <PencilIcon className="w-4 h-4" />
//                         FINISH LISTING
//                       </Link>
//                     ) : (
//                       <Link
//                         href={`/owner/studios/${studio.id}/edit`}
//                         className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
//                       >
//                         <PencilIcon className="w-4 h-4" />
//                         EDIT STUDIO
//                       </Link>
//                     )}
//                     <Link
//                       href={`/owner/studios/${studio.id}`}
//                       className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
//                     >
//                       <EyeIcon className="w-4 h-4" />
//                       VIEW DETAILS
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Expand Portfolio Card */}
//       <div className="mt-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-8 text-center">
//         <div className="max-w-2xl mx-auto">
//           <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
//             <PlusCircleIcon className="w-8 h-8 text-primary" />
//           </div>
//           <h3 className="text-2xl font-bold mb-2">Expand Your Portfolio</h3>
//           <p className="text-slate-400 mb-6">
//             Have a new space? Start a new listing in minutes and reach creative professionals worldwide.
//           </p>
//           <Link
//             href="/owner/list-new"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg font-bold transition-all"
//           >
//             <PlusCircleIcon className="w-5 h-5" />
//             START DRAFTING
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }