// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';

// export default function AdminDashboard() {
//   return (
//     <div className="p-8 space-y-8">
//       <div className="flex flex-col gap-1">
//         <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
//           System Performance
//         </h2>
//         <p className="text-slate-500 font-medium">
//           Platform health and revenue metrics for the current billing cycle.
//         </p>
//       </div>

//       {/* KPIs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* GMV */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex justify-between items-start mb-4">
//             <div className="p-2 bg-primary/10 text-primary rounded-lg">
//               <span className="material-symbols-outlined">monetization_on</span>
//             </div>
//             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
//               +12.5%
//             </span>
//           </div>
//           <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total GMV</p>
//           <h3 className="text-2xl font-black mt-1">$425,000.00</h3>
//         </div>

//         {/* Commission */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex justify-between items-start mb-4">
//             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
//               <span className="material-symbols-outlined">account_balance_wallet</span>
//             </div>
//             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
//               +8.2%
//             </span>
//           </div>
//           <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Net Commission</p>
//           <h3 className="text-2xl font-black mt-1">$63,750.00</h3>
//         </div>

//         {/* Active Users */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex justify-between items-start mb-4">
//             <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
//               <span className="material-symbols-outlined">person_celebrate</span>
//             </div>
//             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
//               +5.4%
//             </span>
//           </div>
//           <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Active Users</p>
//           <h3 className="text-2xl font-black mt-1">12,840</h3>
//         </div>

//         {/* Applications */}
//         <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
//           <div className="flex justify-between items-start mb-4">
//             <div className="p-2 bg-red-100 text-red-600 rounded-lg">
//               <span className="material-symbols-outlined">assignment_late</span>
//             </div>
//             <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
//               -2.1%
//             </span>
//           </div>
//           <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Studio Applications</p>
//           <h3 className="text-2xl font-black mt-1">48</h3>
//         </div>
//       </div>

//       {/* AI Market Insights Section */}
//       <section>
//         <div className="flex items-center gap-3 mb-6">
//           <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-400 text-white">
//             <span className="material-symbols-outlined text-xl">psychology</span>
//           </div>
//           <div>
//             <h2 className="text-xl font-bold">AI-Powered Market Insights</h2>
//             <p className="text-sm text-slate-500">
//               Real-time predictive analysis based on global studio performance.
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden group">
//             {/* Abstract Gradient Decoration */}
//             <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            
//             <div className="relative z-10 flex flex-col h-full">
//               <div className="flex justify-between items-center mb-6">
//                 <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
//                   Live Projection
//                 </span>
//                 <span className="text-xs text-slate-400">Updated 5 mins ago</span>
//               </div>

//               <div className="flex-1 space-y-4">
//                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-l-4 border-primary">
//                   <h4 className="font-bold text-slate-900 dark:text-white mb-1">
//                     Recommended Studio Expansion: Visual Arts
//                   </h4>
//                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
//                       Our AI suggests a 24% increase in demand for 'Mixed Media' studio spaces in the EMEA region for Q4. 
//                       Incentivizing new applications in this category could yield an additional $12k in monthly net commission.
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
//                     <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Revenue Confidence</p>
//                     <p className="text-xl font-black text-slate-900 dark:text-white">92.4%</p>
//                   </div>
//                   <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
//                     <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Risk Assessment</p>
//                     <p className="text-xl font-black text-green-600">LOW</p>
//                   </div>
//                 </div>
//               </div>

//               <button className="mt-6 w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2">
//                 View Full Market Forecast
//                 <span className="material-symbols-outlined text-sm">arrow_forward</span>
//               </button>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
//             {/* AI Visualizer Pattern */}
//             <div 
//               className="absolute inset-0 opacity-10" 
//               style={{ 
//                 backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
//                 backgroundSize: '20px 20px'
//               }}
//             ></div>
            
//             <div className="relative z-10">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
//                 <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
//                   Neural Network Status
//                 </span>
//               </div>
              
//               <h3 className="text-2xl font-black mb-4">Optimization Suggestions</h3>
              
//               <ul className="space-y-4">
//                 <li className="flex gap-3">
//                   <span className="material-symbols-outlined text-indigo-400">check_circle</span>
//                   <p className="text-sm text-slate-300">
//                     Lower platform fee for studios with &gt;98% uptime to increase retention by 15%.
//                   </p>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="material-symbols-outlined text-indigo-400">check_circle</span>
//                   <p className="text-sm text-slate-300">
//                     Auto-approve Tier 1 applicants from Verified Creative Partner pools.
//                   </p>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="material-symbols-outlined text-indigo-400">trending_up</span>
//                   <p className="text-sm text-slate-300">
//                     Adjust dynamic pricing for Peak Hours in London/New York hubs.
//                   </p>
//                 </li>
//               </ul>

//               <div className="mt-8 pt-6 border-t border-white/10">
//                 <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Algorithm Efficiency</p>
//                 <div className="w-full bg-white/10 rounded-full h-1.5">
//                   <div 
//                     className="bg-primary h-full rounded-full w-[88%] shadow-[0_0_10px_rgba(17,82,212,0.8)]"
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Recent Activity / Studio Moderation */}
//       <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
//         <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
//           <h2 className="font-bold text-lg">Pending Studio Moderation</h2>
//           <button className="text-primary text-sm font-bold hover:underline">View All Queue</button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="text-xs text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
//                 <th className="px-6 py-4">Studio Name</th>
//                 <th className="px-6 py-4">Category</th>
//                 <th className="px-6 py-4">Location</th>
//                 <th className="px-6 py-4">Requested Price</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//                </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//               {/* Luminary Digital Labs */}
//               <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
//                       L
//                     </div>
//                     <span className="text-sm font-semibold">Luminary Digital Labs</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-sm">Post-Production</td>
//                 <td className="px-6 py-4 text-sm text-slate-500">Berlin, Germany</td>
//                 <td className="px-6 py-4 text-sm font-bold">$120/hr</td>
//                 <td className="px-6 py-4 text-right">
//                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50">
//                       <span className="material-symbols-outlined text-lg">check</span>
//                     </button>
//                     <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
//                       <span className="material-symbols-outlined text-lg">close</span>
//                     </button>
//                     <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
//                       <span className="material-symbols-outlined text-lg">visibility</span>
//                     </button>
//                   </div>
//                 </td>
//               </tr>

//               {/* Vantage Sound Design */}
//               <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">
//                       V
//                     </div>
//                     <span className="text-sm font-semibold">Vantage Sound Design</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-sm">Audio Engineering</td>
//                 <td className="px-6 py-4 text-sm text-slate-500">London, UK</td>
//                 <td className="px-6 py-4 text-sm font-bold">$95/hr</td>
//                 <td className="px-6 py-4 text-right">
//                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50">
//                       <span className="material-symbols-outlined text-lg">check</span>
//                     </button>
//                     <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
//                       <span className="material-symbols-outlined text-lg">close</span>
//                     </button>
//                     <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
//                       <span className="material-symbols-outlined text-lg">visibility</span>
//                     </button>
//                   </div>
//                 </td>
//               </tr>

//               {/* Skyline Visuals */}
//               <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
//                       S
//                     </div>
//                     <span className="text-sm font-semibold">Skyline Visuals</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-sm">CGI & VFX</td>
//                 <td className="px-6 py-4 text-sm text-slate-500">Los Angeles, USA</td>
//                 <td className="px-6 py-4 text-sm font-bold">$250/hr</td>
//                 <td className="px-6 py-4 text-right">
//                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button className="p-1.5 rounded-lg text-green-600 hover:bg-green-50">
//                       <span className="material-symbols-outlined text-lg">check</span>
//                     </button>
//                     <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50">
//                       <span className="material-symbols-outlined text-lg">close</span>
//                     </button>
//                     <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
//                       <span className="material-symbols-outlined text-lg">visibility</span>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueGrowth: 12.5,
    totalCommission: 0,
    commissionGrowth: 8.2,
    activeUsers: 0,
    userGrowth: 5.4,
    pendingApplications: 0,
    applicationsChange: -2.1,
  });
  
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all studios
      const { data: studios, error: studiosError } = await supabase
        .from('studios')
        .select('*');

      if (studiosError) throw studiosError;

      // Fetch all users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) throw usersError;

      // Calculate stats
      const totalRevenue = studios?.reduce((sum, studio) => sum + (studio.hourly_rate || 0), 0) || 0;
      const totalCommission = totalRevenue * 0.17; // Assuming 17% commission
      const activeUsers = users?.length || 0;
      const pendingApplications = studios?.filter(s => s.status === 'pending').length || 0;

      // Get recent pending applications
      const recentPending = studios
        ?.filter(s => s.status === 'pending')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3) || [];

      // Fetch owner names for recent applications
      const recentWithOwners = await Promise.all(
        recentPending.map(async (studio) => {
          let ownerName = 'Unknown';
          if (studio.owner_id) {
            const { data: owner } = await supabase
              .from('users')
              .select('name')
              .eq('id', studio.owner_id)
              .single();
            if (owner) ownerName = owner.name || ownerName;
          }
          return {
            id: studio.id,
            name: studio.name,
            category: studio.category || 'Other',
            location: `${studio.city || ''}, ${studio.state || ''}`.replace(/^, /, ''),
            price: studio.hourly_rate || 0,
            ownerName,
            image: studio.images?.[0] || null,
            created_at: studio.created_at,
          };
        })
      );

      setStats({
        totalRevenue: totalRevenue * 100, // Rough estimate for demo
        revenueGrowth: 12.5,
        totalCommission: totalCommission * 100,
        commissionGrowth: 8.2,
        activeUsers,
        userGrowth: 5.4,
        pendingApplications,
        applicationsChange: -2.1,
      });

      setRecentApplications(recentWithOwners);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Photography': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'Recording': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Video': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Rehearsal': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return colors[category] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          System Performance
        </h2>
        <p className="text-slate-500 font-medium">
          Platform health and revenue metrics for the current billing cycle.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <span className="material-symbols-outlined">monetization_on</span>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.revenueGrowth}%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
          <h3 className="text-2xl font-black mt-1">${stats.totalRevenue.toLocaleString()}</h3>
        </div>

        {/* Net Commission */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.commissionGrowth}%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Net Commission</p>
          <h3 className="text-2xl font-black mt-1">${stats.totalCommission.toLocaleString()}</h3>
        </div>

        {/* Active Users */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <span className="material-symbols-outlined">person_celebrate</span>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.userGrowth}%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Active Users</p>
          <h3 className="text-2xl font-black mt-1">{stats.activeUsers.toLocaleString()}</h3>
        </div>

        {/* Pending Applications */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <span className="material-symbols-outlined">assignment_late</span>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
              {stats.applicationsChange}%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Pending Applications</p>
          <h3 className="text-2xl font-black mt-1">{stats.pendingApplications}</h3>
        </div>
      </div>

      {/* AI Market Insights Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-400 text-white">
            <span className="material-symbols-outlined text-xl">psychology</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">AI-Powered Market Insights</h2>
            <p className="text-sm text-slate-500">
              Real-time predictive analysis based on global studio performance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                  Live Projection
                </span>
                <span className="text-xs text-slate-400">Updated just now</span>
              </div>

              <div className="flex-1 space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-l-4 border-primary">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    Recommended Studio Expansion: Photography
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Based on current demand trends, photography studios are seeing a 32% increase in bookings. 
                      Consider promoting this category to attract more listings.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Revenue Confidence</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">92.4%</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Risk Assessment</p>
                    <p className="text-xl font-black text-green-600">LOW</p>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2">
                View Full Market Forecast
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-10" 
              style={{ 
                backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            ></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Neural Network Status
                </span>
              </div>
              
              <h3 className="text-2xl font-black mb-4">Optimization Suggestions</h3>
              
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-indigo-400">check_circle</span>
                  <p className="text-sm text-slate-300">
                    Lower platform fee for studios with &gt;95% positive reviews to increase retention.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-indigo-400">check_circle</span>
                  <p className="text-sm text-slate-300">
                    Promote new studio listings in cities with high demand.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="material-symbols-outlined text-indigo-400">trending_up</span>
                  <p className="text-sm text-slate-300">
                    Adjust pricing recommendations based on local market rates.
                  </p>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Algorithm Efficiency</p>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div 
                    className="bg-primary h-full rounded-full w-[88%] shadow-[0_0_10px_rgba(17,82,212,0.8)]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity / Studio Moderation */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="font-bold text-lg">Pending Studio Moderation</h2>
          <Link href="/admin/moderation" className="text-primary text-sm font-bold hover:underline">
            View All Queue
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-slate-400">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <p className="text-slate-500">No pending applications</p>
            <p className="text-sm text-slate-400 mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Studio Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Requested Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                          {app.image ? (
                            <img src={app.image} alt={app.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold">
                              {app.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{app.name}</p>
                          <p className="text-[11px] text-slate-500">Owner: {app.ownerName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getCategoryColor(app.category)}`}>
                        {app.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{app.location || 'N/A'} </td>
                    <td className="px-6 py-4 text-sm font-bold">${app.price}/hr</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/moderation`}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          title="Review"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}