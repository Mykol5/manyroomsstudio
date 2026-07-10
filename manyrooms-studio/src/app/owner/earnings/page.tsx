// app/owner/earnings/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowTrendingUpIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
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

interface Transaction {
  id: string;
  date: string;
  studio: string;
  image?: string;
  reference: string;
  type: 'Booking' | 'Payout';
  status: 'Completed' | 'Processing' | 'Pending';
  amount: number;
}

export default function EarningsPage() {
  const [timeframe, setTimeframe] = useState<'6months' | 'year'>('6months');

  const monthlyData = [
    { month: 'JAN', amount: 4200, height: 60 },
    { month: 'FEB', amount: 3100, height: 45 },
    { month: 'MAR', amount: 6800, height: 85 },
    { month: 'APR', amount: 5500, height: 70 },
    { month: 'MAY', amount: 4000, height: 55 },
    { month: 'JUN', amount: 7200, height: 90 },
  ];

  const [transactions] = useState<Transaction[]>([
    {
      id: '1', date: 'Oct 12, 2024', studio: 'Neon Loft A',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2OT5WE-Ca1v81hoFresvEphe-opFhsFwrUnzjl9s7mO6sWcdBKinIW47nHnN6iSTzGeKfcEJr_2b6R91fFUwnDMaiuoqVJW9qSyEqAURgMjt7QkH5eGoYKwQ7XLonL5UmghGqiEB4DH9mFvJIS0WnapDsTiNkQKYkDMFHUD4ZlYQZICu08CLh7ezR182dqIA6Qb-i6_sYd3-AS0HLFpz59kpofdL6Q4DQtEoApA1V-kbfuHCXGU1KVjGM4q8Yw4e0V8jFfbza00xs',
      reference: '#45922', type: 'Booking', status: 'Completed', amount: 850.00,
    },
    {
      id: '2', date: 'Oct 10, 2024', studio: 'Bank Transfer',
      reference: 'PAY-9921', type: 'Payout', status: 'Processing', amount: -4200.00,
    },
    {
      id: '3', date: 'Oct 08, 2024', studio: 'The Green Screen Suite',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpjX5rJRzNUMgNQxrWfQtv1fOayAPmI8lgl-kHPjLZLLoJjwGMYDlWgEVWmav10Y5jqCqCot0sm6zpZXNER16Q0HRWG3vivhFt2AXdQ7CPzPeE1WWH8gKExltRP2m92nVcMZ5SxciqvtOop8aNJX3ooNZ-XuXP73JVieVIvZV6mG2ibNy8wNR4kIAas34VQ2_wHrq8xZbSOWE5YX_OPq2-2erhO1petCN4geU7w9wx6WEqfwOjkv_QeY6WJRlkGoNHCiURnJ0EsqJm',
      reference: '#45910', type: 'Booking', status: 'Completed', amount: 1200.00,
    },
    {
      id: '4', date: 'Oct 05, 2024', studio: 'Creative Commons',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjBKCUK_Ds0TtT9QByrsuWY2rLJAv-nILfPNuNIT_pob9DHibpu5hz2h9pYB6Duu5SU-OvIl98qPRngJhk1m4fjY1ToaKgo2APAWitXa7nF7Jm0cVEn2hrZGrwPWAtsF2DlHYDk-EcZTyacxONBvJQkgnMBa54AUV6Q6HPxv1DX8Y-SMkx2prLDPoqAFxjgs6eD-gYQBqG-2ORBcRkNDnLaLWAmjJIkb2xP2eK58M7WahWN8-vjA8ugx2bK9LZXYfz9EdcxsDcwrns',
      reference: '#45899', type: 'Booking', status: 'Completed', amount: 450.00,
    },
  ]);

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <header className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-[#3C291C]/10 px-4 md:px-8 py-5">
        <div className="flex justify-between items-center max-w-[1440px] mx-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#3C291C]">Earnings & Payouts</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-[#3C291C]/5 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[#3C291C]">favorite</span>
            </button>
            <button className="p-2 hover:bg-[#3C291C]/5 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[#3C291C]">account_circle</span>
            </button>
            <Link href="/owner/list-new"
              className="bg-[#F1CB81] text-[#3C291C] px-6 py-2 rounded-full font-bold text-sm hover:bg-[#DB8B8C] hover:text-white transition-all">
              List Your Space
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Earnings */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#3C291C]/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#F1CB81]/20 rounded-full blur-3xl group-hover:bg-[#F1CB81]/30 transition-colors"></div>
            <p className="text-xs font-bold text-[#3C291C]/40 mb-4 uppercase tracking-widest">Total Earnings</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#3C291C]">$42,850.00</h2>
            <div className="mt-6 flex items-center gap-2 text-[#DB8B8C] font-bold">
              <ArrowTrendingUpIcon className="w-5 h-5" />
              <span className="text-sm">+12% from last month</span>
            </div>
          </div>

          {/* Pending Payouts */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#3C291C]/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#91ADCD]/20 rounded-full blur-3xl group-hover:bg-[#91ADCD]/30 transition-colors"></div>
            <p className="text-xs font-bold text-[#3C291C]/40 mb-4 uppercase tracking-widest">Pending Payouts</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#3C291C]">$3,240.50</h2>
            <div className="mt-6 text-[#3C291C]/60 font-medium text-sm">Expected processing: 2-3 business days</div>
          </div>

          {/* Next Payout Date */}
          <div className="bg-[#F1CB81] rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
            <p className="text-xs font-bold text-[#3C291C] mb-4 uppercase tracking-widest">Next Payout Date</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#3C291C]">Oct 24, 2024</h2>
            <div className="mt-6 flex items-center gap-2 text-[#3C291C] font-bold">
              <CalendarIcon className="w-5 h-5" />
              <span className="text-sm">Scheduled Automatic Transfer</span>
            </div>
          </div>
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Revenue Bar Chart */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#3C291C]/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-extrabold text-[#3C291C]">Monthly Revenue</h3>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#F1CB81] rounded-full"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#3C291C]/40">2024 Performance</span>
              </div>
            </div>
            <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-2">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex flex-col items-center flex-1 group cursor-pointer">
                  <div className="w-full relative rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${data.height * 2.5}px`, backgroundColor: data.month === 'MAR' || data.month === 'JUN' ? '#F1CB81' : 'rgba(60, 41, 28, 0.1)' }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#3C291C] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">${data.amount.toLocaleString()}k</div>
                  </div>
                  <span className="mt-4 text-xs font-bold text-[#3C291C]/40">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payout Volume Graph */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#3C291C]/10 overflow-hidden relative">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-extrabold text-[#3C291C]">Payout Volume</h3>
              <select value={timeframe} onChange={(e) => setTimeframe(e.target.value as any)}
                className="bg-[#3C291C]/5 border-none rounded-full px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]">
                <option value="6months">Last 6 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <div className="relative h-64 w-full">
              <svg className="w-full h-full" viewBox="0 0 400 150">
                <defs>
                  <linearGradient id="lineGrad2" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#F1CB81', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: '#F1CB81', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <path d="M0,130 Q50,110 100,120 T200,60 T300,80 T400,20" fill="transparent" stroke="#F1CB81" strokeLinecap="round" strokeWidth="4" />
                <path d="M0,130 Q50,110 100,120 T200,60 T300,80 T400,20 V150 H0 Z" fill="url(#lineGrad2)" />
                <circle cx="100" cy="120" fill="#F1CB81" r="5" />
                <circle cx="200" cy="60" fill="#F1CB81" r="5" />
                <circle cx="300" cy="80" fill="#F1CB81" r="5" />
                <circle cx="400" cy="20" fill="#F1CB81" r="5" />
              </svg>
              <div className="absolute top-10 right-20 bg-[#3C291C] text-white text-[10px] p-2 rounded-lg shadow-xl">Peak Month: $8.4k</div>
            </div>
          </div>
        </section>

        {/* Transaction Ledger */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-[#3C291C]/10 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-[#3C291C]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold text-[#3C291C]">Transaction Ledger</h3>
              <p className="text-[#3C291C]/60 text-sm">Detailed breakdown of all studio bookings and payout events.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-2 border-2 border-[#3C291C]/10 text-[#3C291C] font-bold rounded-full hover:bg-[#3C291C]/5 transition-all text-sm">
                <FunnelIcon className="w-4 h-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-[#3C291C] text-white font-bold rounded-full hover:bg-[#DB8B8C] transition-all text-sm">
                <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#3C291C]/5">
                <tr>
                  <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#3C291C]/40 uppercase tracking-widest">DATE</th>
                  <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#3C291C]/40 uppercase tracking-widest">STUDIO / ITEM</th>
                  <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#3C291C]/40 uppercase tracking-widest">TYPE</th>
                  <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#3C291C]/40 uppercase tracking-widest">STATUS</th>
                  <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#3C291C]/40 uppercase tracking-widest text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3C291C]/5">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#3C291C]/[0.02] transition-colors">
                    <td className="px-6 md:px-8 py-5 font-medium text-sm text-[#3C291C]">{txn.date}</td>
                    <td className="px-6 md:px-8 py-5">
                      <div className="flex items-center gap-3">
                        {txn.image ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"><img className="w-full h-full object-cover" src={txn.image} alt={txn.studio} /></div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#3C291C]/5 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[#3C291C]">account_balance</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-[#3C291C]">{txn.studio}</p>
                          <p className="text-xs text-[#3C291C]/40">{txn.type} {txn.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${txn.type === 'Booking' ? 'bg-[#DB8B8C]/20 text-[#3C291C]' : 'bg-[#91ADCD]/20 text-[#3C291C]'}`}>{txn.type}</span>
                    </td>
                    <td className="px-6 md:px-8 py-5">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <span className={`w-2 h-2 rounded-full ${txn.status === 'Completed' ? 'bg-[#3C291C]' : txn.status === 'Processing' ? 'bg-[#F1CB81]' : 'bg-amber-500'}`}></span>
                        <span className="text-[#3C291C]">{txn.status}</span>
                      </div>
                    </td>
                    <td className={`px-6 md:px-8 py-5 text-right font-bold text-sm ${txn.amount > 0 ? 'text-[#3C291C]' : 'text-[#DB8B8C]'}`}>
                      {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString()}.00
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 md:p-8 bg-[#3C291C]/5 flex justify-center">
            <button className="text-[#3C291C] font-bold flex items-center gap-2 hover:underline transition-all text-sm">
              Load More Transactions <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}


// // app/owner/earnings/page.tsx
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import {
//   ArrowTrendingUpIcon,
//   CalendarIcon,
//   FunnelIcon,
//   ArrowDownTrayIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface Transaction {
//   id: string;
//   date: string;
//   studio: string;
//   image?: string;
//   reference: string;
//   type: 'Booking' | 'Payout';
//   status: 'Completed' | 'Processing' | 'Pending';
//   amount: number;
// }

// export default function EarningsPage() {
//   const [timeframe, setTimeframe] = useState<'6months' | 'year'>('6months');

//   const monthlyData = [
//     { month: 'JAN', amount: 4200, height: 60 },
//     { month: 'FEB', amount: 3100, height: 45 },
//     { month: 'MAR', amount: 6800, height: 85 },
//     { month: 'APR', amount: 5500, height: 70 },
//     { month: 'MAY', amount: 4000, height: 55 },
//     { month: 'JUN', amount: 7200, height: 90 },
//   ];

//   const [transactions] = useState<Transaction[]>([
//     {
//       id: '1',
//       date: 'Oct 12, 2024',
//       studio: 'Neon Loft A',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2OT5WE-Ca1v81hoFresvEphe-opFhsFwrUnzjl9s7mO6sWcdBKinIW47nHnN6iSTzGeKfcEJr_2b6R91fFUwnDMaiuoqVJW9qSyEqAURgMjt7QkH5eGoYKwQ7XLonL5UmghGqiEB4DH9mFvJIS0WnapDsTiNkQKYkDMFHUD4ZlYQZICu08CLh7ezR182dqIA6Qb-i6_sYd3-AS0HLFpz59kpofdL6Q4DQtEoApA1V-kbfuHCXGU1KVjGM4q8Yw4e0V8jFfbza00xs',
//       reference: '#45922',
//       type: 'Booking',
//       status: 'Completed',
//       amount: 850.00,
//     },
//     {
//       id: '2',
//       date: 'Oct 10, 2024',
//       studio: 'Bank Transfer',
//       reference: 'PAY-9921',
//       type: 'Payout',
//       status: 'Processing',
//       amount: -4200.00,
//     },
//     {
//       id: '3',
//       date: 'Oct 08, 2024',
//       studio: 'The Green Screen Suite',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpjX5rJRzNUMgNQxrWfQtv1fOayAPmI8lgl-kHPjLZLLoJjwGMYDlWgEVWmav10Y5jqCqCot0sm6zpZXNER16Q0HRWG3vivhFt2AXdQ7CPzPeE1WWH8gKExltRP2m92nVcMZ5SxciqvtOop8aNJX3ooNZ-XuXP73JVieVIvZV6mG2ibNy8wNR4kIAas34VQ2_wHrq8xZbSOWE5YX_OPq2-2erhO1petCN4geU7w9wx6WEqfwOjkv_QeY6WJRlkGoNHCiURnJ0EsqJm',
//       reference: '#45910',
//       type: 'Booking',
//       status: 'Completed',
//       amount: 1200.00,
//     },
//     {
//       id: '4',
//       date: 'Oct 05, 2024',
//       studio: 'Creative Commons',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjBKCUK_Ds0TtT9QByrsuWY2rLJAv-nILfPNuNIT_pob9DHibpu5hz2h9pYB6Duu5SU-OvIl98qPRngJhk1m4fjY1ToaKgo2APAWitXa7nF7Jm0cVEn2hrZGrwPWAtsF2DlHYDk-EcZTyacxONBvJQkgnMBa54AUV6Q6HPxv1DX8Y-SMkx2prLDPoqAFxjgs6eD-gYQBqG-2ORBcRkNDnLaLWAmjJIkb2xP2eK58M7WahWN8-vjA8ugx2bK9LZXYfz9EdcxsDcwrns',
//       reference: '#45899',
//       type: 'Booking',
//       status: 'Completed',
//       amount: 450.00,
//     },
//   ]);

//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       {/* Header */}
//       <header className="sticky top-16 z-30 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 px-4 md:px-8 py-5">
//         <div className="flex justify-between items-center max-w-[1440px] mx-auto">
//           <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1d]">Earnings & Payouts</h1>
//           <div className="flex items-center gap-3">
//             <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//               <span className="material-symbols-outlined text-[#191c1d]">favorite</span>
//             </button>
//             <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//               <span className="material-symbols-outlined text-[#191c1d]">account_circle</span>
//             </button>
//             <Link
//               href="/owner/list-new"
//               className="bg-[#446900] text-white px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform active:scale-95"
//             >
//               List Studio
//             </Link>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-8">
        
//         {/* Summary Cards */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Total Earnings */}
//           <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem] shadow-lg relative overflow-hidden group">
//             <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#beff5f]/20 rounded-full blur-3xl group-hover:bg-[#beff5f]/40 transition-colors"></div>
//             <p className="text-xs font-bold text-[#424937] mb-4 uppercase tracking-widest">Total Earnings</p>
//             <h2 className="text-4xl md:text-5xl font-extrabold text-[#446900]">$42,850.00</h2>
//             <div className="mt-6 flex items-center gap-2 text-[#446900] font-bold">
//               <ArrowTrendingUpIcon className="w-5 h-5" />
//               <span className="text-sm">+12% from last month</span>
//             </div>
//           </div>

//           {/* Pending Payouts */}
//           <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem] shadow-lg relative overflow-hidden group">
//             <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#e4d7fd]/20 rounded-full blur-3xl group-hover:bg-[#e4d7fd]/40 transition-colors"></div>
//             <p className="text-xs font-bold text-[#424937] mb-4 uppercase tracking-widest">Pending Payouts</p>
//             <h2 className="text-4xl md:text-5xl font-extrabold text-[#665c7c]">$3,240.50</h2>
//             <div className="mt-6 text-[#424937] font-medium text-sm">
//               Expected processing: 2-3 business days
//             </div>
//           </div>

//           {/* Next Payout Date */}
//           <div className="bg-[#beff5f] p-8 rounded-[2rem] shadow-lg relative overflow-hidden group">
//             <p className="text-xs font-bold text-[#111f00] mb-4 uppercase tracking-widest">Next Payout Date</p>
//             <h2 className="text-4xl md:text-5xl font-extrabold text-[#111f00]">Oct 24, 2024</h2>
//             <div className="mt-6 flex items-center gap-2 text-[#111f00] font-bold">
//               <CalendarIcon className="w-5 h-5" />
//               <span className="text-sm">Scheduled Automatic Transfer</span>
//             </div>
//           </div>
//         </section>

//         {/* Charts Row */}
//         <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
//           {/* Monthly Revenue Bar Chart */}
//           <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-lg">
//             <div className="flex justify-between items-center mb-10">
//               <h3 className="text-2xl font-extrabold text-[#191c1d]">Monthly Revenue</h3>
//               <div className="flex items-center gap-2">
//                 <span className="w-3 h-3 bg-[#446900] rounded-full"></span>
//                 <span className="text-xs font-bold uppercase tracking-widest text-[#424937]">2024 Performance</span>
//               </div>
//             </div>
//             <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-2">
//               {monthlyData.map((data) => (
//                 <div key={data.month} className="flex flex-col items-center flex-1 group cursor-pointer">
//                   <div className="w-full relative rounded-t-lg transition-all duration-300 hover:opacity-80"
//                     style={{
//                       height: `${data.height * 2.5}px`,
//                       backgroundColor: data.month === 'MAR' || data.month === 'JUN' ? '#446900' : '#edeeef'
//                     }}
//                   >
//                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2e3132] text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
//                       ${data.amount.toLocaleString()}k
//                     </div>
//                   </div>
//                   <span className="mt-4 text-xs font-bold text-[#424937]">{data.month}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Payout Volume Graph */}
//           <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-lg overflow-hidden relative">
//             <div className="flex justify-between items-center mb-10">
//               <h3 className="text-2xl font-extrabold text-[#191c1d]">Payout Volume</h3>
//               <select
//                 value={timeframe}
//                 onChange={(e) => setTimeframe(e.target.value as any)}
//                 className="bg-[#edeeef] border-none rounded-full px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-[#446900] outline-none"
//               >
//                 <option value="6months">Last 6 Months</option>
//                 <option value="year">Last Year</option>
//               </select>
//             </div>
//             <div className="relative h-64 w-full">
//               <svg className="w-full h-full" viewBox="0 0 400 150">
//                 <defs>
//                   <linearGradient id="lineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
//                     <stop offset="0%" style={{ stopColor: '#446900', stopOpacity: 0.2 }} />
//                     <stop offset="100%" style={{ stopColor: '#446900', stopOpacity: 0 }} />
//                   </linearGradient>
//                 </defs>
//                 <path d="M0,130 Q50,110 100,120 T200,60 T300,80 T400,20" fill="transparent" stroke="#446900" strokeLinecap="round" strokeWidth="4" />
//                 <path d="M0,130 Q50,110 100,120 T200,60 T300,80 T400,20 V150 H0 Z" fill="url(#lineGrad)" />
//                 <circle cx="100" cy="120" fill="#446900" r="5" />
//                 <circle cx="200" cy="60" fill="#446900" r="5" />
//                 <circle cx="300" cy="80" fill="#446900" r="5" />
//                 <circle cx="400" cy="20" fill="#446900" r="5" />
//               </svg>
//               <div className="absolute top-10 right-20 bg-[#2e3132] text-white text-[10px] p-2 rounded-lg shadow-xl">
//                 Peak Month: $8.4k
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Transaction Ledger */}
//         <section className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-lg overflow-hidden">
//           <div className="p-6 md:p-8 border-b border-[#c2c9b1]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h3 className="text-2xl font-extrabold text-[#191c1d]">Transaction Ledger</h3>
//               <p className="text-[#424937] text-sm">Detailed breakdown of all studio bookings and payout events.</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button className="flex items-center gap-2 px-6 py-2 border-2 border-[#c2c9b1] text-[#191c1d] font-bold rounded-full hover:bg-[#edeeef] transition-all text-sm">
//                 <FunnelIcon className="w-4 h-4" />
//                 Filter
//               </button>
//               <button className="flex items-center gap-2 px-6 py-2 bg-[#2e3132] text-white font-bold rounded-full hover:scale-105 transition-transform active:scale-95 text-sm">
//                 <ArrowDownTrayIcon className="w-4 h-4" />
//                 Export CSV
//               </button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-[#f3f4f5]">
//                 <tr>
//                   <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#424937] uppercase tracking-widest">DATE</th>
//                   <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#424937] uppercase tracking-widest">STUDIO / ITEM</th>
//                   <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#424937] uppercase tracking-widest">TYPE</th>
//                   <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#424937] uppercase tracking-widest">STATUS</th>
//                   <th className="px-6 md:px-8 py-4 text-xs font-bold text-[#424937] uppercase tracking-widest text-right">AMOUNT</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#c2c9b1]/20">
//                 {transactions.map((txn) => (
//                   <tr key={txn.id} className="hover:bg-white/50 transition-colors">
//                     <td className="px-6 md:px-8 py-5 font-medium text-sm">{txn.date}</td>
//                     <td className="px-6 md:px-8 py-5">
//                       <div className="flex items-center gap-3">
//                         {txn.image ? (
//                           <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
//                             <img className="w-full h-full object-cover" src={txn.image} alt={txn.studio} />
//                           </div>
//                         ) : (
//                           <div className="w-10 h-10 rounded-lg bg-[#edeeef] flex items-center justify-center flex-shrink-0">
//                             <span className="material-symbols-outlined text-[#446900]">account_balance</span>
//                           </div>
//                         )}
//                         <div>
//                           <p className="font-bold text-sm">{txn.studio}</p>
//                           <p className="text-xs text-[#424937]">{txn.type} {txn.reference}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 md:px-8 py-5">
//                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                         txn.type === 'Booking'
//                           ? 'bg-[#ffe6de] text-[#b4471d]'
//                           : 'bg-[#e4d7fd] text-[#665c7c]'
//                       }`}>
//                         {txn.type}
//                       </span>
//                     </td>
//                     <td className="px-6 md:px-8 py-5">
//                       <div className="flex items-center gap-2 font-bold text-sm">
//                         <span className={`w-2 h-2 rounded-full ${
//                           txn.status === 'Completed' ? 'bg-[#446900]' :
//                           txn.status === 'Processing' ? 'bg-[#424937]' : 'bg-amber-500'
//                         }`}></span>
//                         <span className={txn.status === 'Completed' ? 'text-[#446900]' : 'text-[#424937]'}>
//                           {txn.status}
//                         </span>
//                       </div>
//                     </td>
//                     <td className={`px-6 md:px-8 py-5 text-right font-bold text-sm ${
//                       txn.amount > 0 ? 'text-[#191c1d]' : 'text-[#ba1a1a]'
//                     }`}>
//                       {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString()}.00
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="p-6 md:p-8 bg-[#f3f4f5] flex justify-center">
//             <button className="text-[#446900] font-bold flex items-center gap-2 hover:underline transition-all text-sm">
//               Load More Transactions
//               <span className="material-symbols-outlined">expand_more</span>
//             </button>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import {
//   CurrencyDollarIcon,
//   ChartBarIcon,
//   ArrowTrendingUpIcon,
//   ArrowTrendingDownIcon,
//   ArrowPathIcon,
//   DocumentArrowDownIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';

// // Types
// interface Payout {
//   id: string;
//   date: string;
//   reference: string;
//   status: 'pending' | 'paid' | 'failed';
//   amount: number;
// }

// interface MonthlyData {
//   month: string;
//   earnings: number;
//   fullName: string;
// }

// export default function OwnerEarnings() {
//   const [timeframe, setTimeframe] = useState<'monthly' | 'yearly'>('monthly');
//   const [selectedMonth, setSelectedMonth] = useState(5); // June index
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [filterStatus, setFilterStatus] = useState<string>('all');
//   const [filterAmount, setFilterAmount] = useState<string>('all');

//   // Monthly earnings data
//   const monthlyData: MonthlyData[] = [
//     { month: 'JAN', earnings: 12400, fullName: 'January' },
//     { month: 'FEB', earnings: 14800, fullName: 'February' },
//     { month: 'MAR', earnings: 16200, fullName: 'March' },
//     { month: 'APR', earnings: 17800, fullName: 'April' },
//     { month: 'MAY', earnings: 19400, fullName: 'May' },
//     { month: 'JUN', earnings: 18200, fullName: 'June' },
//   ];

//   // Payout history
//   const [payouts, setPayouts] = useState<Payout[]>([
//     {
//       id: '1',
//       date: 'Oct 12, 2024',
//       reference: 'MR-PAY-44021',
//       status: 'pending',
//       amount: 4820.00,
//     },
//     {
//       id: '2',
//       date: 'Sep 28, 2024',
//       reference: 'MR-PAY-43892',
//       status: 'paid',
//       amount: 5140.45,
//     },
//     {
//       id: '3',
//       date: 'Sep 15, 2024',
//       reference: 'MR-PAY-43551',
//       status: 'paid',
//       amount: 3905.00,
//     },
//     {
//       id: '4',
//       date: 'Aug 30, 2024',
//       reference: 'MR-PAY-43109',
//       status: 'paid',
//       amount: 6230.10,
//     },
//   ]);

//   // Financial calculations
//   const grossEarnings = 21450.00;
//   const commissionRate = 0.17;
//   const commissionAmount = grossEarnings * commissionRate;
//   const netPayout = grossEarnings - commissionAmount;
//   const averageBalance = 14820.45;

//   const maxEarning = Math.max(...monthlyData.map(d => d.earnings));
//   const minEarning = Math.min(...monthlyData.map(d => d.earnings));
//   const selectedEarnings = monthlyData[selectedMonth]?.earnings || 18200;

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'paid':
//         return <span className="text-emerald-500">✓</span>;
//       case 'pending':
//         return <span className="text-amber-500">⏳</span>;
//       case 'failed':
//         return <span className="text-red-500">✗</span>;
//       default:
//         return null;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'paid':
//         return 'text-emerald-500 bg-emerald-500/10';
//       case 'pending':
//         return 'text-amber-500 bg-amber-500/10';
//       case 'failed':
//         return 'text-red-500 bg-red-500/10';
//       default:
//         return 'text-slate-400 bg-white/5';
//     }
//   };

//   const filteredPayouts = payouts.filter(payout => {
//     if (filterStatus !== 'all' && payout.status !== filterStatus) return false;
//     if (filterAmount !== 'all') {
//       if (filterAmount === 'high' && payout.amount < 5000) return false;
//       if (filterAmount === 'medium' && (payout.amount < 2000 || payout.amount >= 5000)) return false;
//       if (filterAmount === 'low' && payout.amount >= 2000) return false;
//     }
//     return true;
//   });

//   const handleWithdraw = () => {
//     alert('Withdraw functionality will be implemented soon!');
//   };

//   const handleExport = () => {
//     alert('Export functionality will be implemented soon!');
//   };

//   return (
//     <div className="p-8 max-w-[1600px] mx-auto">
//       {/* Page Header */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-black tracking-tight">Earnings & Atelier Capital</h2>
//         <p className="text-slate-400 text-sm mt-1">
//           Track your studio revenue, payouts, and financial performance.
//         </p>
//       </div>

//       {/* Timeframe Toggle */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
//           <button
//             onClick={() => setTimeframe('monthly')}
//             className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
//               timeframe === 'monthly'
//                 ? 'bg-primary text-white'
//                 : 'text-slate-400 hover:text-white'
//             }`}
//           >
//             MONTHLY
//           </button>
//           <button
//             onClick={() => setTimeframe('yearly')}
//             className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
//               timeframe === 'yearly'
//                 ? 'bg-primary text-white'
//                 : 'text-slate-400 hover:text-white'
//             }`}
//           >
//             YEARLY
//           </button>
//         </div>
//         <button
//           onClick={handleExport}
//           className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
//         >
//           <DocumentArrowDownIcon className="w-4 h-4" />
//           EXPORT REPORT
//         </button>
//       </div>

//       {/* Chart Section */}
//       <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <p className="text-slate-400 text-sm mb-1">Total Revenue</p>
//             <div className="flex items-baseline gap-2">
//               <p className="text-4xl font-black text-white">
//                 ${selectedEarnings.toLocaleString()}
//               </p>
//               <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
//                 +12.5%
//               </span>
//             </div>
//           </div>
//           <div className="flex gap-4 text-xs">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-primary rounded-full"></div>
//               <span className="text-slate-400">Revenue</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
//               <span className="text-slate-400">Target</span>
//             </div>
//           </div>
//         </div>

//         {/* Bar Chart */}
//         <div className="relative h-64 mt-8">
//           <div className="absolute inset-0 flex items-end justify-between gap-4">
//             {monthlyData.map((data, index) => {
//               const heightPercent = (data.earnings / maxEarning) * 100;
//               const isSelected = selectedMonth === index;
//               return (
//                 <button
//                   key={data.month}
//                   onClick={() => setSelectedMonth(index)}
//                   className="flex-1 flex flex-col items-center gap-2 group"
//                 >
//                   <div className="relative w-full">
//                     <div
//                       className={`w-full rounded-t-lg transition-all duration-300 ${
//                         isSelected ? 'bg-primary' : 'bg-primary/40 hover:bg-primary/60'
//                       }`}
//                       style={{ height: `${heightPercent * 2}px`, minHeight: '4px' }}
//                     />
//                     <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
//                       ${data.earnings.toLocaleString()}
//                     </div>
//                   </div>
//                   <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-slate-500'}`}>
//                     {data.month}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Chart Legend - Monthly labels */}
//         <div className="flex justify-between mt-6 px-4">
//           <span className="text-[10px] text-slate-500">JAN</span>
//           <span className="text-[10px] text-slate-500">FEB</span>
//           <span className="text-[10px] text-slate-500">MAR</span>
//           <span className="text-[10px] text-slate-500">APR</span>
//           <span className="text-[10px] text-slate-500">MAY</span>
//           <span className="text-[10px] text-slate-500">JUN</span>
//         </div>
//       </div>

//       {/* Average Balance & Withdraw */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//         {/* Average Balance Card */}
//         <div className="lg:col-span-2 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-8">
//           <p className="text-slate-400 text-sm mb-2">AVERAGE BALANCE</p>
//           <p className="text-5xl font-black text-white mb-6">
//             ${averageBalance.toLocaleString()}
//           </p>
//           <button
//             onClick={handleWithdraw}
//             className="px-6 py-3 bg-primary hover:bg-primary/90 transition-all rounded-lg font-bold text-white"
//           >
//             WITHDRAW FUNDS
//           </button>
//         </div>

//         {/* Payout Breakdown */}
//         <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//           <h3 className="text-lg font-bold mb-4">PAYOUT BREAKDOWN</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between">
//               <span className="text-slate-400">Gross Earnings</span>
//               <span className="font-medium">${grossEarnings.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-slate-400">ManyRooms Commission (17%)</span>
//               <span className="font-medium text-amber-500">-${commissionAmount.toLocaleString()}</span>
//             </div>
//             <div className="pt-3 mt-3 border-t border-white/10 flex justify-between">
//               <span className="text-white font-bold">Net Payout</span>
//               <span className="text-primary font-bold text-lg">${netPayout.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payout History */}
//       <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
//         <div className="flex items-center justify-between p-6 border-b border-white/10">
//           <h3 className="text-xl font-bold">Payout History</h3>
//           <div className="relative">
//             <button
//               onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//               className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
//             >
//               <ArrowPathIcon className="w-4 h-4" />
//               FILTER HISTORY
//             </button>
//             {showFilterDropdown && (
//               <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-10">
//                 <div className="p-4 space-y-4">
//                   <div>
//                     <p className="text-xs text-slate-400 mb-2">STATUS</p>
//                     <div className="space-y-2">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="status"
//                           value="all"
//                           checked={filterStatus === 'all'}
//                           onChange={(e) => setFilterStatus(e.target.value)}
//                           className="text-primary"
//                         />
//                         <span className="text-sm">All</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="status"
//                           value="paid"
//                           checked={filterStatus === 'paid'}
//                           onChange={(e) => setFilterStatus(e.target.value)}
//                           className="text-primary"
//                         />
//                         <span className="text-sm">Paid</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="status"
//                           value="pending"
//                           checked={filterStatus === 'pending'}
//                           onChange={(e) => setFilterStatus(e.target.value)}
//                           className="text-primary"
//                         />
//                         <span className="text-sm">Pending</span>
//                       </label>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-400 mb-2">AMOUNT</p>
//                     <div className="space-y-2">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="amount"
//                           value="all"
//                           checked={filterAmount === 'all'}
//                           onChange={(e) => setFilterAmount(e.target.value)}
//                           className="text-primary"
//                         />
//                         <span className="text-sm">All</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="amount"
//                           value="high"
//                           checked={filterAmount === 'high'}
//                           onChange={(e) => setFilterAmount(e.target.value)}
//                           className="text-primary"
//                         />
//                         <span className="text-sm">High ($5k+)</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="amount"
//                           value="medium"
//                           checked={filterAmount === 'medium'}
//                           onChange={(e) => setFilterAmount(e.target.value)}
//                           className="text-primary"
//                         />
//                         <span className="text-sm">Medium ($2k - $5k)</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="amount"
//                           value="low"
//                           checked={filterAmount === 'low'}
//                           onChange={(e) => setFilterAmount(e.target.value)}
//                           className="text-primary"
//                         />
//                         <span className="text-sm">Low (Under $2k)</span>
//                       </label>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowFilterDropdown(false)}
//                     className="w-full py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium"
//                   >
//                     Apply Filters
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-wider">
//                 <th className="px-6 py-4">DATE</th>
//                 <th className="px-6 py-4">REFERENCE</th>
//                 <th className="px-6 py-4">STATUS</th>
//                 <th className="px-6 py-4 text-right">AMOUNT</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {filteredPayouts.map((payout) => (
//                 <tr key={payout.id} className="hover:bg-white/5 transition-all">
//                   <td className="px-6 py-4 text-sm">{payout.date}</td>
//                   <td className="px-6 py-4 text-sm font-mono text-slate-400">{payout.reference}</td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
//                       {getStatusIcon(payout.status)}
//                       {payout.status.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-right font-medium">
//                     ${payout.amount.toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {filteredPayouts.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-slate-500">No payouts found matching your filters.</p>
//           </div>
//         )}

//         {/* Pagination (simplified) */}
//         {payouts.length > 5 && (
//           <div className="flex items-center justify-between p-6 border-t border-white/10">
//             <p className="text-sm text-slate-500">
//               Showing {filteredPayouts.length} of {payouts.length} payouts
//             </p>
//             <div className="flex gap-2">
//               <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50">
//                 <ChevronLeftIcon className="w-4 h-4" />
//               </button>
//               <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50">
//                 <ChevronRightIcon className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
