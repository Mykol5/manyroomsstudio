// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import {
//   HomeIcon,
//   CurrencyDollarIcon,
//   ChartBarIcon,
//   StarIcon,
//   CalendarIcon,
//   PlusCircleIcon,
//   ArrowRightIcon,
//   BellIcon,
//   Cog6ToothIcon,
// } from '@heroicons/react/24/outline';
// import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
// import './owner.css';

// // Types
// interface Studio {
//   id: string;
//   name: string;
//   location: string;
//   capacity: number;
//   hourly_rate: number;
//   rating: number;
//   total_bookings: number;
//   total_earnings: number;
//   image: string;
// }

// interface Booking {
//   id: string;
//   studio_id: string;
//   studio_name: string;
//   client_name: string;
//   date: string;
//   start_time: string;
//   end_time: string;
//   status: 'confirmed' | 'pending' | 'blocked';
//   amount: number;
// }

// interface Activity {
//   id: string;
//   type: 'payment' | 'review' | 'booking';
//   title: string;
//   description: string;
//   time: string;
//   action?: string;
// }

// export default function OwnerDashboard() {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');

//   // Owner stats
//   const [stats, setStats] = useState({
//     total_earnings: 12480.00,
//     earnings_growth: 12,
//     booking_rate: 84,
//     average_rating: 4.9,
//     total_reviews: 128,
//   });

//   // Studios owned by this owner
//   const [studios] = useState<Studio[]>([
//     {
//       id: '1',
//       name: 'Studio A — North Wing',
//       location: 'Downtown Manhattan, NY',
//       capacity: 12,
//       hourly_rate: 180,
//       rating: 4.9,
//       total_bookings: 156,
//       total_earnings: 28450,
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ0OBOavY0FKXf_EMsibr6U6SbCoFfxj_lJt4X10gLu6kRMZpYBpuluXxmeR1uRUxsqG8n4Qmz7xdDCTfhXb6i05Jcvdyo1068Fwm3ds7yqHwiBsx1vd2oAKmQF0_KBOJ-vzK5nBUb9XjFzUqQfmXBP5aEh1DUrX-5nKtru-wvUGTm4BCm7ivreDJs4HhbNTfTj-BZ_DpIh8FRMUkAUPGJ11kqTL1FCCLdqAqxklAAhZ-vJJ7Gl193YYbntjkXljUhttJeMIFDLmZS',
//     },
//     {
//       id: '2',
//       name: 'The Warehouse Loft',
//       location: 'Brooklyn, NY',
//       capacity: 24,
//       hourly_rate: 240,
//       rating: 4.8,
//       total_bookings: 98,
//       total_earnings: 42150,
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAqqBObVeKGPWNBkarSwoSjOb_8jdm-kxV2JLgldG4Qvm17tLb3-GXqx1MmicQQZ6jSRodspMr45BPWGRKVZb2o-laegPpjyWanYuqhyfmHud1D5n6vnxnT2G3GiEWrJ1xEwoNqQyDVPC64gOq7XN2iYqdO-CWpEXH12W6zZTx_FUW8vRf7uclr422hECfIc5WogeTghAOrs0SZuhCB-ydnavlhF92VYOAE7he8854oLbDr0c3I74oemNGFJaoCQZujPYOxF8Klkee',
//     },
//   ]);

//   // Upcoming bookings
//   const [bookings] = useState<Booking[]>([
//     {
//       id: '1',
//       studio_id: '1',
//       studio_name: 'Studio A — North Wing',
//       client_name: 'Julian Foster',
//       date: '2024-03-15',
//       start_time: '10:00 AM',
//       end_time: '6:00 PM',
//       status: 'confirmed',
//       amount: 1440,
//     },
//     {
//       id: '2',
//       studio_id: '2',
//       studio_name: 'The Warehouse Loft',
//       client_name: 'Mia Chen',
//       date: '2024-03-18',
//       start_time: '2:00 PM',
//       end_time: '8:00 PM',
//       status: 'pending',
//       amount: 1440,
//     },
//     {
//       id: '3',
//       studio_id: '1',
//       studio_name: 'Studio A — North Wing',
//       client_name: 'Marcus Taylor',
//       date: '2024-03-20',
//       start_time: '12:00 PM',
//       end_time: '5:00 PM',
//       status: 'blocked',
//       amount: 900,
//     },
//   ]);

//   // Recent activities
//   const [activities] = useState<Activity[]>([
//     {
//       id: '1',
//       type: 'payment',
//       title: 'Payment Received',
//       description: 'Invoice #8841 was paid by Julian Foster.',
//       time: '2 hours ago',
//     },
//     {
//       id: '2',
//       type: 'review',
//       title: 'New Review',
//       description: '"The lighting was perfect for our bridal shoot. Highly recommended."',
//       time: '5 hours ago',
//     },
//     {
//       id: '3',
//       type: 'booking',
//       title: 'New Booking Request',
//       description: 'Studio B - Modern Loft for 3 days next month.',
//       time: '1 day ago',
//       action: 'APPROVE | DECLINE',
//     },
//   ]);

//   // Calendar data
//   const calendarDays = [
//     { day: 28, month: 'SUN' },
//     { day: 29, month: 'MON' },
//     { day: 30, month: 'TUE' },
//     { day: 1, month: 'WED' },
//     { day: 2, month: 'THU' },
//     { day: 3, month: 'FRI' },
//     { day: 4, month: 'SAT' },
//     { day: 5, month: 'SUN' },
//     { day: 6, month: 'MON' },
//     { day: 7, month: 'TUE' },
//     { day: 8, month: 'WED' },
//     { day: 9, month: 'THU' },
//     { day: 10, month: 'FRI' },
//     { day: 11, month: 'SAT' },
//   ];

//   const calendarEvents = [
//     { day: 8, status: 'confirmed', title: 'ART EXHIBIT' },
//     { day: 10, status: 'pending', title: 'Photoshoot' },
//     { day: 5, status: 'blocked', title: 'Maintenance' },
//   ];

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   const handleAction = (action: string, activityId: string) => {
//     setToastMessage(`${action} booking request`);
//     setShowSuccessToast(true);
//     setTimeout(() => setShowSuccessToast(false), 3000);
//   };

//   const getCalendarStatusColor = (status: string) => {
//     switch (status) {
//       case 'confirmed': return 'bg-emerald-500';
//       case 'pending': return 'bg-amber-500';
//       case 'blocked': return 'bg-red-500';
//       default: return '';
//     }
//   };

//   const getEventForDay = (day: number) => {
//     return calendarEvents.find(event => event.day === day);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background-dark">
//         <div className="animate-pulse space-y-4">
//           <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
//           <div className="text-primary font-bold">Loading Dashboard...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Success Toast */}
//       {showSuccessToast && (
//         <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
//           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-6 py-4 flex items-center gap-3 backdrop-blur-lg">
//             <CheckCircleSolid className="w-5 h-5 text-emerald-500" />
//             <span className="text-sm text-white">{toastMessage}</span>
//           </div>
//         </div>
//       )}

//       {/* Content */}
//       <div className="p-8 max-w-[1600px] mx-auto">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-black tracking-tight">Studio Overview</h2>
//           <p className="text-sm text-slate-400 mt-1">
//             Welcome back to the Atelier. Your studios are performing at <span className="text-primary">{stats.booking_rate}%</span> capacity this month.
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <CurrencyDollarIcon className="w-8 h-8 text-primary" />
//               <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
//                 +{stats.earnings_growth}% vs last month
//               </span>
//             </div>
//             <p className="text-slate-400 text-sm mb-1">TOTAL EARNINGS</p>
//             <p className="text-3xl font-black">${stats.total_earnings.toLocaleString()}</p>
//           </div>

//           <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <ChartBarIcon className="w-8 h-8 text-primary" />
//             </div>
//             <p className="text-slate-400 text-sm mb-1">BOOKING RATE</p>
//             <p className="text-3xl font-black">{stats.booking_rate}%</p>
//             <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
//               <div className="bg-primary h-1.5 rounded-full" style={{ width: `${stats.booking_rate}%` }}></div>
//             </div>
//           </div>

//           <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <StarIcon className="w-8 h-8 text-primary" />
//             </div>
//             <p className="text-slate-400 text-sm mb-1">AVERAGE RATING</p>
//             <p className="text-3xl font-black">
//               {stats.average_rating} <span className="text-lg text-slate-400">★</span>
//               <span className="text-sm text-slate-500 ml-2">({stats.total_reviews} reviews)</span>
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Availability Calendar */}
//           <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold">AVAILABILITY CALENDAR</h3>
//               <div className="flex gap-4 text-xs">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
//                   <span className="text-slate-400">CONFIRMED</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
//                   <span className="text-slate-400">PENDING</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                   <span className="text-slate-400">BLOCKED</span>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-7 gap-2 text-center">
//               {calendarDays.map((day, idx) => {
//                 const event = getEventForDay(day.day);
//                 return (
//                   <div key={idx} className="relative">
//                     <div className="text-center p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
//                       <div className="text-xs text-slate-500 mb-1">{day.month}</div>
//                       <div className="text-xl font-bold">{day.day}</div>
//                       {event && (
//                         <div className={`mt-2 w-2 h-2 rounded-full ${getCalendarStatusColor(event.status)} mx-auto`}></div>
//                       )}
//                     </div>
//                     {event && event.day === 8 && (
//                       <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-primary whitespace-nowrap">
//                         {event.title}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-xl font-bold mb-6">RECENT ACTIVITY</h3>
//             <div className="space-y-6">
//               {activities.map((activity) => (
//                 <div key={activity.id} className="border-l-2 border-primary/30 pl-4">
//                   <div className="flex items-center gap-2 mb-1">
//                     {activity.type === 'payment' && <CurrencyDollarIcon className="w-4 h-4 text-emerald-500" />}
//                     {activity.type === 'review' && <StarIcon className="w-4 h-4 text-amber-500" />}
//                     {activity.type === 'booking' && <CalendarIcon className="w-4 h-4 text-primary" />}
//                     <p className="text-sm font-medium text-white">{activity.title}</p>
//                   </div>
//                   <p className="text-xs text-slate-400 mb-2">{activity.description}</p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-[10px] text-slate-500">{activity.time}</span>
//                     {activity.action && (
//                       <div className="flex gap-2">
//                         <button 
//                           onClick={() => handleAction('Approved', activity.id)}
//                           className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold"
//                         >
//                           APPROVE
//                         </button>
//                         <span className="text-slate-600">|</span>
//                         <button 
//                           onClick={() => handleAction('Declined', activity.id)}
//                           className="text-[10px] text-red-500 hover:text-red-400 font-bold"
//                         >
//                           DECLINE
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Your Top Performing Spaces */}
//         <div className="mt-8">
//           <h3 className="text-xl font-bold mb-6">YOUR TOP PERFORMING SPACES</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {studios.map((studio) => (
//               <div key={studio.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group">
//                 <div className="flex">
//                   <div className="w-32 h-32 overflow-hidden">
//                     <img 
//                       src={studio.image} 
//                       alt={studio.name}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                   </div>
//                   <div className="flex-1 p-5">
//                     <div className="flex items-start justify-between mb-2">
//                       <h4 className="font-bold text-lg">{studio.name}</h4>
//                       <div className="flex items-center gap-1">
//                         <StarIcon className="w-4 h-4 text-primary fill-primary" />
//                         <span className="text-sm font-medium">{studio.rating}</span>
//                       </div>
//                     </div>
//                     <p className="text-xs text-slate-400 mb-3">{studio.location}</p>
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-primary font-bold">${studio.hourly_rate}/hr</span>
//                       <span className="text-slate-400">{studio.total_bookings} bookings</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Maximize Revenue Banner */}
//         <div className="mt-8 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-xl p-8">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//             <div className="flex-1">
//               <h3 className="text-2xl font-bold mb-2">Maximize Your Revenue with Pro-Listing</h3>
//               <p className="text-slate-400">
//                 Studio owners who use our premium listing services see a <span className="text-primary font-bold">24% increase</span> in booking inquiries within the first 30 days.
//               </p>
//             </div>
//             <Link href="/owner/pro-listing" className="px-6 py-3 bg-primary hover:bg-primary/90 transition-all rounded-lg font-bold whitespace-nowrap">
//               LEARN MORE
//               <ArrowRightIcon className="w-4 h-4 inline-block ml-2" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// app/owner/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ArrowRightIcon,
  StarIcon,
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
  capacity: number;
  hourly_rate: number;
  images: string[];
  status: string;
  created_at: string;
}

interface Booking {
  id: string;
  studio_name: string;
  studio_image: string;
  booking_id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  amount: number;
  status: 'confirmed' | 'pending';
}

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(14280);

  const [recentBookings] = useState<Booking[]>([
    {
      id: '1',
      studio_name: 'Vogue Editorial Campaign',
      studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW-AqUBfjGESGbrV5CTD7tTkJT5pZ6wWb87DF7-FfjhOs-vSfvtTHmuHDewQmy9FiA0pmP8KeNHh1kY8wAd47alD-L2FPA1K077iHfHlP9rKC05OaUazpMMfeY57fjN-1N8w4WYYUmAjxvoARXGq5PfisX19UfJAQsF6y8S8Dj4C5QLCwciRuodqhDQa3mY5y8ZK_1e3r9hP-COJGppyISwJzxt4c-Uv6P8kjS4VYgvPHcHhE3pkyIscmUIBZZ_kWpWOUnnHWFZl1g',
      booking_id: '#BK-9021',
      type: 'Photo Studio',
      title: 'Vogue Editorial Campaign',
      date: 'Tomorrow',
      time: '09:00 AM - 05:00 PM',
      amount: 1200,
      status: 'confirmed',
    },
    {
      id: '2',
      studio_name: 'Podcast Series Recording',
      studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbFm5TauRQR9FuVkSQA96M74Xj5ePO5J8959fqpuxVBWY4ZGCnkCsfWbOmPRSeIUbdQEb1DLaVhfCoc7QPpYjU_pn6cT1YR9Eecms_YeX0qfi6uudpS28n5MIEa1bKgxfQ31dzO_l07JVS1pEkpY7t1BB0RIFObraKQCJcf5gu_mPy1CEzUfrjfNWqBrfyIzS9OVILTUKFXWia3FCVXdbTqEKb1HU6UryzUHZ6CdfJuAChaY8qIDIeXdlvXn0XpH_9V6iEnrR2YEBI',
      booking_id: '#BK-8842',
      type: 'Sound Suite',
      title: 'Podcast Series Recording',
      date: 'Wed, Oct 24',
      time: '02:00 PM - 04:00 PM',
      amount: 450,
      status: 'pending',
    },
    {
      id: '3',
      studio_name: 'Team Strategy Workshop',
      studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpe28Oxj1qsM47T9VEMyWIJCrDeEg3WHJWylq5GlkowSGr2j_vbGDVfFbG_EyWIZMnXXS0WORV4XPXN3OMhkLRPRnNiVkJ_HamQDxq69h01L16pZG4bSjm9VV3ZY7nHd1Sl6AViZM9Gmd45UCio-BBblTkuJ7t4mgYdu75XCQ1XRmzGpaJMxl9tyCjEW3fovAM1F7osTmH_KM6FySb1lWIJYCDaMF_GFEWstiP4XqVO3SjIDzek1SlroYch0GHQRVgElnT00lambau',
      booking_id: '#BK-7719',
      type: 'Creative Loft',
      title: 'Team Strategy Workshop',
      date: 'Fri, Oct 26',
      time: '10:00 AM - 06:00 PM',
      amount: 2800,
      status: 'confirmed',
    },
  ]);

  useEffect(() => {
    if (user) fetchStudios();
  }, [user]);

  const fetchStudios = async () => {
    try {
      const { data, error } = await supabase
        .from('studios').select('*').eq('owner_id', user?.id).order('created_at', { ascending: false });
      if (!error && data) setStudios(data);
    } catch (err) { console.error('Error fetching studios:', err); }
    finally { setLoading(false); }
  };

  const getCoverImage = (images: string[]) => (!images || images.length === 0 ? null : images[0]);
  const chartData = [24, 36, 32, 48, 56, 40, 28, 44, 52, 36];

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <header className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-[#3C291C]/10 px-4 md:px-8 py-5">
        <div className="flex justify-between items-center max-w-[1440px] mx-auto">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#3C291C] tracking-tight">Studio Overview</h1>
            <p className="text-[#3C291C]/60 text-sm">Performance insights for your creative spaces.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-[#3C291C]/5 rounded-full transition-colors">
              <span className="material-symbols-outlined text-[#3C291C]">favorite</span>
            </button>
            <Link
              href="/owner/list-new"
              className="px-5 py-2 bg-[#F1CB81] text-[#3C291C] font-bold rounded-full text-sm hover:bg-[#DB8B8C] hover:text-white transition-all"
            >
              List Your Space
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-6">
        
        {/* Top Row: Performance & Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Studio Growth Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <span className="inline-block px-3 py-1 bg-[#F1CB81] text-[#3C291C] text-[10px] font-black uppercase tracking-widest rounded-full mb-2">Performance</span>
                <h2 className="text-2xl font-extrabold text-[#3C291C] leading-tight">Studio Growth</h2>
              </div>
              <div className="flex gap-1 bg-[#3C291C]/5 rounded-xl p-1">
                <span className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-[#3C291C] shadow-sm">Weekly</span>
                <span className="px-4 py-1.5 rounded-lg text-xs font-bold text-[#3C291C]/50 hover:text-[#3C291C] cursor-pointer">Monthly</span>
              </div>
            </div>

            <div className="h-56 w-full flex items-end gap-1 relative">
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F1CB81]/20 to-transparent rounded-b-3xl"></div>
              {chartData.map((height, i) => (
                <div key={i} className="flex-1 bg-[#F1CB81]/40 hover:bg-[#F1CB81]/70 rounded-t-lg transition-all cursor-pointer relative group" style={{ height: `${height * 3.5}px` }}>
                  {height === 56 && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#3C291C] text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Peak</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-[#3C291C]/40 tracking-widest px-1">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Revenue Snapshot */}
          <div className="bg-[#3C291C] text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F1CB81]/10 blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <span className="text-[#F1CB81] font-black text-[10px] uppercase tracking-[0.2em]">Live Revenue</span>
              <h3 className="text-5xl md:text-[56px] font-extrabold leading-none mt-2 tabular-nums tracking-tighter">
                ${revenue.toLocaleString()}
              </h3>
              <p className="text-[#91ADCD] text-sm mt-2">+24% from last month</p>
            </div>
            <div className="mt-8 space-y-3 relative z-10">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-sm text-white/70">Studio Rentals</span>
                <span className="font-bold">$9,400</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-sm text-white/70">Equipment Fees</span>
                <span className="font-bold">$3,120</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-white/70">Workshop Passes</span>
                <span className="font-bold">$1,760</span>
              </div>
            </div>
            <button className="w-full py-4 bg-[#F1CB81] text-[#3C291C] font-extrabold text-sm uppercase tracking-widest rounded-xl mt-6 hover:bg-[#DB8B8C] hover:text-white transition-all relative z-10">
              Payout Settings
            </button>
          </div>
        </div>

        {/* Second Row: Bookings & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Recent Bookings */}
          <div className="lg:col-span-3 bg-white rounded-3xl overflow-hidden shadow-sm border border-[#3C291C]/10">
            <div className="p-6 md:p-8 border-b border-[#3C291C]/10 flex justify-between items-center">
              <h3 className="text-2xl font-extrabold text-[#3C291C] tracking-tight">Recent Bookings</h3>
              <Link href="/owner/bookings" className="text-[#DB8B8C] font-bold text-sm hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-[#3C291C]/5">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:bg-[#3C291C]/[0.02] transition-colors cursor-pointer group">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-[#3C291C]/5">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={booking.studio_image} alt={booking.studio_name} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-[#91ADCD]/20 text-[#3C291C] text-[10px] font-bold rounded uppercase">{booking.type}</span>
                      <span className="text-[#3C291C]/50 text-xs font-medium">{booking.booking_id}</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#3C291C]">{booking.title}</h4>
                    <p className="text-[#3C291C]/60 text-sm">{booking.date} • {booking.time}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="font-extrabold text-lg text-[#3C291C]">${booking.amount.toLocaleString()}.00</p>
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                      booking.status === 'confirmed'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {booking.status === 'confirmed' ? 'CONFIRMED' : 'PENDING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Rating Card */}
            <div className="bg-[#F1CB81] rounded-3xl p-6 text-[#3C291C]">
              <div className="flex justify-between items-center mb-6">
                <StarIcon className="w-8 h-8" />
                <span className="text-xs font-black uppercase tracking-widest">Top Rated</span>
              </div>
              <p className="text-4xl font-extrabold leading-tight">4.92</p>
              <p className="text-sm font-bold opacity-70">Average Guest Rating</p>
              <div className="mt-4 pt-4 border-t border-[#3C291C]/10 flex justify-between">
                <span className="text-xs">98 Reviews</span>
                <span className="text-xs">+0.2 this week</span>
              </div>
            </div>

            {/* Expert Tip */}
            <div className="bg-white rounded-3xl p-6 relative group overflow-hidden shadow-sm border border-[#3C291C]/10">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#F1CB81] rounded-full opacity-20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <h5 className="text-sm font-bold text-[#DB8B8C] mb-3">EXPERT TIP</h5>
              <p className="text-base font-bold mb-4 italic text-[#3C291C]">
                "Natural light boosts booking conversion by up to 34% for creative studios."
              </p>
              <p className="text-xs text-[#3C291C]/60 leading-relaxed">
                Consider adding more mirror reflectors or cleaning windows to maximize morning light levels.
              </p>
              <button className="mt-6 flex items-center gap-2 text-[#3C291C] font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                Read Growth Guide <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Active Studios Count */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#3C291C]/10">
              <h5 className="text-xs font-bold text-[#3C291C]/40 uppercase tracking-widest mb-3">Active Studios</h5>
              <p className="text-4xl font-extrabold text-[#3C291C]">{studios.filter(s => s.status === 'approved').length}</p>
              <p className="text-sm text-[#3C291C]/60 mt-1">of {studios.length} total</p>
              <Link href="/owner/studios" className="mt-4 block text-[#DB8B8C] font-bold text-sm hover:underline">
                Manage Studios →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// // app/owner/dashboard/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import {
//   ArrowRightIcon,
//   StarIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   capacity: number;
//   hourly_rate: number;
//   images: string[];
//   status: string;
//   created_at: string;
// }

// interface Booking {
//   id: string;
//   studio_name: string;
//   studio_image: string;
//   booking_id: string;
//   type: string;
//   title: string;
//   date: string;
//   time: string;
//   amount: number;
//   status: 'confirmed' | 'pending';
// }

// export default function OwnerDashboardPage() {
//   const { user } = useAuth();
//   const [studios, setStudios] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [revenue, setRevenue] = useState(14280);

//   const [recentBookings] = useState<Booking[]>([
//     {
//       id: '1',
//       studio_name: 'Vogue Editorial Campaign',
//       studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW-AqUBfjGESGbrV5CTD7tTkJT5pZ6wWb87DF7-FfjhOs-vSfvtTHmuHDewQmy9FiA0pmP8KeNHh1kY8wAd47alD-L2FPA1K077iHfHlP9rKC05OaUazpMMfeY57fjN-1N8w4WYYUmAjxvoARXGq5PfisX19UfJAQsF6y8S8Dj4C5QLCwciRuodqhDQa3mY5y8ZK_1e3r9hP-COJGppyISwJzxt4c-Uv6P8kjS4VYgvPHcHhE3pkyIscmUIBZZ_kWpWOUnnHWFZl1g',
//       booking_id: '#BK-9021',
//       type: 'Photo Studio',
//       title: 'Vogue Editorial Campaign',
//       date: 'Tomorrow',
//       time: '09:00 AM - 05:00 PM',
//       amount: 1200,
//       status: 'confirmed',
//     },
//     {
//       id: '2',
//       studio_name: 'Podcast Series Recording',
//       studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbFm5TauRQR9FuVkSQA96M74Xj5ePO5J8959fqpuxVBWY4ZGCnkCsfWbOmPRSeIUbdQEb1DLaVhfCoc7QPpYjU_pn6cT1YR9Eecms_YeX0qfi6uudpS28n5MIEa1bKgxfQ31dzO_l07JVS1pEkpY7t1BB0RIFObraKQCJcf5gu_mPy1CEzUfrjfNWqBrfyIzS9OVILTUKFXWia3FCVXdbTqEKb1HU6UryzUHZ6CdfJuAChaY8qIDIeXdlvXn0XpH_9V6iEnrR2YEBI',
//       booking_id: '#BK-8842',
//       type: 'Sound Suite',
//       title: 'Podcast Series Recording',
//       date: 'Wed, Oct 24',
//       time: '02:00 PM - 04:00 PM',
//       amount: 450,
//       status: 'pending',
//     },
//     {
//       id: '3',
//       studio_name: 'Team Strategy Workshop',
//       studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpe28Oxj1qsM47T9VEMyWIJCrDeEg3WHJWylq5GlkowSGr2j_vbGDVfFbG_EyWIZMnXXS0WORV4XPXN3OMhkLRPRnNiVkJ_HamQDxq69h01L16pZG4bSjm9VV3ZY7nHd1Sl6AViZM9Gmd45UCio-BBblTkuJ7t4mgYdu75XCQ1XRmzGpaJMxl9tyCjEW3fovAM1F7osTmH_KM6FySb1lWIJYCDaMF_GFEWstiP4XqVO3SjIDzek1SlroYch0GHQRVgElnT00lambau',
//       booking_id: '#BK-7719',
//       type: 'Creative Loft',
//       title: 'Team Strategy Workshop',
//       date: 'Fri, Oct 26',
//       time: '10:00 AM - 06:00 PM',
//       amount: 2800,
//       status: 'confirmed',
//     },
//   ]);

//   useEffect(() => {
//     if (user) {
//       fetchStudios();
//     }
//   }, [user]);

//   const fetchStudios = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('owner_id', user?.id)
//         .order('created_at', { ascending: false });

//       if (!error && data) {
//         setStudios(data);
//       }
//     } catch (err) {
//       console.error('Error fetching studios:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCoverImage = (images: string[]) => {
//     if (!images || images.length === 0) return '/placeholder-studio.jpg';
//     return images[0];
//   };

//   const chartData = [24, 36, 32, 48, 56, 40, 28, 44, 52, 36];

//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       {/* Header */}
//       <header className="sticky top-16 z-30 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 px-4 md:px-8 py-5">
//         <div className="flex justify-between items-center max-w-[1440px] mx-auto">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1d] tracking-tight">Studio Overview</h1>
//             <p className="text-[#424937] text-sm">Performance insights for your creative spaces.</p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//               <span className="material-symbols-outlined text-[#191c1d]">favorite</span>
//             </button>
//             <Link
//               href="/owner/list-new"
//               className="px-5 py-2 bg-[#beff5f] text-[#111f00] font-bold rounded-full text-sm hover:scale-105 transition-transform"
//             >
//               List Studio
//             </Link>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 space-y-6">
        
//         {/* Top Row: Performance & Revenue */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* Studio Growth Chart */}
//           <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg">
//             <div className="flex justify-between items-start mb-8 relative z-10">
//               <div>
//                 <span className="inline-block px-3 py-1 bg-[#beff5f] text-[#111f00] text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
//                   Performance
//                 </span>
//                 <h2 className="text-2xl font-extrabold text-[#191c1d] leading-tight">Studio Growth</h2>
//               </div>
//               <div className="flex gap-2">
//                 <span className="px-4 py-1 rounded-full border border-[#c2c9b1] text-xs font-bold bg-white/50">Weekly</span>
//                 <span className="px-4 py-1 rounded-full text-xs font-bold text-[#424937] hover:bg-[#edeeef] cursor-pointer">Monthly</span>
//               </div>
//             </div>

//             {/* Bar Chart */}
//             <div className="h-56 w-full flex items-end gap-1 relative">
//               <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#beff5f]/30 to-transparent rounded-b-3xl"></div>
//               {chartData.map((height, i) => (
//                 <div
//                   key={i}
//                   className="flex-1 bg-[#beff5f]/40 hover:bg-[#beff5f]/70 rounded-t-lg transition-all cursor-pointer relative group"
//                   style={{ height: `${height * 3.5}px` }}
//                 >
//                   {height === 56 && (
//                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2e3132] text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                       Peak
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-[#424937] tracking-widest px-1">
//               <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
//             </div>
//           </div>

//           {/* Revenue Snapshot */}
//           <div className="bg-[#2e3132] text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-[#beff5f]/20 blur-3xl -mr-10 -mt-10"></div>
//             <div className="relative z-10">
//               <span className="text-[#beff5f] font-black text-[10px] uppercase tracking-[0.2em]">Live Revenue</span>
//               <h3 className="text-5xl md:text-[56px] font-extrabold leading-none mt-2 tabular-nums tracking-tighter">
//                 ${revenue.toLocaleString()}
//               </h3>
//               <p className="text-[#c2c9b1] text-sm mt-2">+24% from last month</p>
//             </div>
//             <div className="mt-8 space-y-3 relative z-10">
//               <div className="flex justify-between items-center py-3 border-b border-white/10">
//                 <span className="text-sm">Studio Rentals</span>
//                 <span className="font-bold">$9,400</span>
//               </div>
//               <div className="flex justify-between items-center py-3 border-b border-white/10">
//                 <span className="text-sm">Equipment Fees</span>
//                 <span className="font-bold">$3,120</span>
//               </div>
//               <div className="flex justify-between items-center py-3">
//                 <span className="text-sm">Workshop Passes</span>
//                 <span className="font-bold">$1,760</span>
//               </div>
//             </div>
//             <button className="w-full py-4 bg-[#beff5f] text-[#111f00] font-extrabold text-sm uppercase tracking-widest rounded-xl mt-6 hover:scale-[1.02] transition-transform relative z-10">
//               Payout Settings
//             </button>
//           </div>
//         </div>

//         {/* Second Row: Bookings & Sidebar */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
//           {/* Recent Bookings */}
//           <div className="lg:col-span-3 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-lg">
//             <div className="p-6 md:p-8 border-b border-[#c2c9b1]/30 flex justify-between items-center">
//               <h3 className="text-2xl font-extrabold text-[#191c1d] tracking-tight">Recent Bookings</h3>
//               <Link href="/owner/bookings" className="text-[#446900] font-bold text-sm hover:underline">View All</Link>
//             </div>
//             <div className="divide-y divide-[#c2c9b1]/30">
//               {recentBookings.map((booking) => (
//                 <div key={booking.id} className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:bg-white/50 transition-colors cursor-pointer group">
//                   <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
//                     <img
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                       src={booking.studio_image}
//                       alt={booking.studio_name}
//                     />
//                   </div>
//                   <div className="flex-grow">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="px-2 py-0.5 bg-[#e4d7fd] text-[#665c7c] text-[10px] font-bold rounded uppercase">{booking.type}</span>
//                       <span className="text-[#424937] text-xs font-medium">{booking.booking_id}</span>
//                     </div>
//                     <h4 className="text-lg font-bold text-[#191c1d]">{booking.title}</h4>
//                     <p className="text-[#424937] text-sm">{booking.date} • {booking.time}</p>
//                   </div>
//                   <div className="text-right flex flex-col items-end gap-2">
//                     <p className="font-extrabold text-lg text-[#191c1d]">${booking.amount.toLocaleString()}.00</p>
//                     <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
//                       booking.status === 'confirmed'
//                         ? 'bg-green-50 text-green-700 border-green-200'
//                         : 'bg-orange-50 text-orange-700 border-orange-200'
//                     }`}>
//                       {booking.status === 'confirmed' ? 'CONFIRMED' : 'PENDING'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Sidebar: Stats & Tips */}
//           <div className="lg:col-span-1 space-y-6">
            
//             {/* Rating Card */}
//             <div className="bg-[#beff5f] rounded-3xl p-6 text-[#111f00]">
//               <div className="flex justify-between items-center mb-6">
//                 <StarIcon className="w-8 h-8" />
//                 <span className="text-xs font-black uppercase tracking-widest">Top Rated</span>
//               </div>
//               <p className="text-4xl font-extrabold leading-tight">4.92</p>
//               <p className="text-sm font-bold opacity-70">Average Guest Rating</p>
//               <div className="mt-4 pt-4 border-t border-[#111f00]/10 flex justify-between">
//                 <span className="text-xs">98 Reviews</span>
//                 <span className="text-xs">+0.2 this week</span>
//               </div>
//             </div>

//             {/* Expert Tip */}
//             <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 relative group overflow-hidden shadow-lg">
//               <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#beff5f] rounded-full opacity-20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
//               <h5 className="text-sm font-bold text-[#446900] mb-3">EXPERT TIP</h5>
//               <p className="text-base font-bold mb-4 italic text-[#191c1d]">
//                 "Natural light boosts booking conversion by up to 34% for creative studios."
//               </p>
//               <p className="text-xs text-[#424937] leading-relaxed">
//                 Consider adding more mirror reflectors or cleaning windows to maximize morning light levels.
//               </p>
//               <button className="mt-6 flex items-center gap-2 text-[#191c1d] font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
//                 Read Growth Guide <ArrowRightIcon className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Active Studios Count */}
//             <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg">
//               <h5 className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-3">Active Studios</h5>
//               <p className="text-4xl font-extrabold text-[#191c1d]">{studios.filter(s => s.status === 'approved').length}</p>
//               <p className="text-sm text-[#424937] mt-1">of {studios.length} total</p>
//               <Link href="/owner/studios" className="mt-4 block text-[#446900] font-bold text-sm hover:underline">
//                 Manage Studios →
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';
// import {
//   HomeIcon,
//   CurrencyDollarIcon,
//   ChartBarIcon,
//   StarIcon,
//   CalendarIcon,
//   PlusCircleIcon,
//   ArrowRightIcon,
//   BellIcon,
//   Cog6ToothIcon,
// } from '@heroicons/react/24/outline';
// import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
// import './owner.css';

// // Types based on your database schema
// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   capacity: number;
//   hourly_rate: number;
//   images: string[];
//   status: string;
//   created_at: string;
// }

// interface DashboardStats {
//   total_earnings: number;
//   earnings_growth: number;
//   booking_rate: number;
//   average_rating: number;
//   total_reviews: number;
//   active_studios: number;
//   total_bookings: number;
// }

// export default function OwnerDashboard() {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [studios, setStudios] = useState<Studio[]>([]);
//   const [stats, setStats] = useState<DashboardStats>({
//     total_earnings: 0,
//     earnings_growth: 0,
//     booking_rate: 0,
//     average_rating: 0,
//     total_reviews: 0,
//     active_studios: 0,
//     total_bookings: 0,
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch studios from Supabase
//   useEffect(() => {
//     if (!loading && user) {
//       fetchStudios();
//     }
//   }, [user, loading]);

//   const fetchStudios = async () => {
//     if (!user?.id) return;
    
//     setIsLoading(true);
    
//     try {
//       // Fetch studios owned by this user
//       const { data: studiosData, error: studiosError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('owner_id', user.id)
//         .order('created_at', { ascending: false });

//       if (studiosError) throw studiosError;
      
//       setStudios(studiosData || []);
      
//       // Calculate stats from studio data
//       const activeCount = studiosData?.filter(s => s.status === 'approved' || s.status === 'active').length || 0;
      
//       // For now, using calculated estimates based on studio data
//       // In a real app, you'd fetch these from bookings/earnings tables
//       setStats({
//         total_earnings: studiosData?.reduce((sum, s) => sum + (s.hourly_rate * 50), 0) || 0, // Estimate
//         earnings_growth: 12, // Would come from comparing periods
//         booking_rate: activeCount > 0 ? Math.floor(Math.random() * 30) + 70 : 0, // Mock for now
//         average_rating: 4.9, // Would come from reviews
//         total_reviews: studiosData?.reduce((sum, s) => sum + Math.floor(Math.random() * 50) + 10, 0) || 0,
//         active_studios: activeCount,
//         total_bookings: studiosData?.reduce((sum, s) => sum + Math.floor(Math.random() * 100) + 10, 0) || 0,
//       });
      
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAction = (action: string, activityId: string) => {
//     setToastMessage(`${action} booking request`);
//     setShowSuccessToast(true);
//     setTimeout(() => setShowSuccessToast(false), 3000);
//   };

//   if (loading || isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background-dark">
//         <div className="animate-pulse space-y-4">
//           <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
//           <div className="text-primary font-bold">Loading Dashboard...</div>
//         </div>
//       </div>
//     );
//   }

//   // Calendar data (keeping as is - this would come from bookings)
//   const calendarDays = [
//     { day: 28, month: 'SUN' }, { day: 29, month: 'MON' }, { day: 30, month: 'TUE' },
//     { day: 1, month: 'WED' }, { day: 2, month: 'THU' }, { day: 3, month: 'FRI' },
//     { day: 4, month: 'SAT' }, { day: 5, month: 'SUN' }, { day: 6, month: 'MON' },
//     { day: 7, month: 'TUE' }, { day: 8, month: 'WED' }, { day: 9, month: 'THU' },
//     { day: 10, month: 'FRI' }, { day: 11, month: 'SAT' },
//   ];

//   const calendarEvents = [
//     { day: 8, status: 'confirmed', title: 'ART EXHIBIT' },
//     { day: 10, status: 'pending', title: 'Photoshoot' },
//     { day: 5, status: 'blocked', title: 'Maintenance' },
//   ];

//   const getEventForDay = (day: number) => {
//     return calendarEvents.find(event => event.day === day);
//   };

//   const getCalendarStatusColor = (status: string) => {
//     switch (status) {
//       case 'confirmed': return 'bg-emerald-500';
//       case 'pending': return 'bg-amber-500';
//       case 'blocked': return 'bg-red-500';
//       default: return '';
//     }
//   };

//   // Get cover image from studio images array
//   const getCoverImage = (images: string[]) => {
//     if (!images || images.length === 0) return '/placeholder-studio.jpg';
//     return images[0];
//   };

//   return (
//     <>
//       {/* Success Toast */}
//       {showSuccessToast && (
//         <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
//           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-6 py-4 flex items-center gap-3 backdrop-blur-lg">
//             <CheckCircleSolid className="w-5 h-5 text-emerald-500" />
//             <span className="text-sm text-white">{toastMessage}</span>
//           </div>
//         </div>
//       )}

//       {/* Content */}
//       <div className="p-8 max-w-[1600px] mx-auto">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-black tracking-tight">Studio Overview</h2>
//           <p className="text-sm text-slate-400 mt-1">
//             Welcome back to the Atelier. You have <span className="text-primary">{studios.length}</span> studio{studios.length !== 1 ? 's' : ''} in your portfolio.
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <CurrencyDollarIcon className="w-8 h-8 text-primary" />
//               <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
//                 +{stats.earnings_growth}% vs last month
//               </span>
//             </div>
//             <p className="text-slate-400 text-sm mb-1">TOTAL EARNINGS</p>
//             <p className="text-3xl font-black">${stats.total_earnings.toLocaleString()}</p>
//           </div>

//           <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <ChartBarIcon className="w-8 h-8 text-primary" />
//             </div>
//             <p className="text-slate-400 text-sm mb-1">BOOKING RATE</p>
//             <p className="text-3xl font-black">{stats.booking_rate}%</p>
//             <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
//               <div className="bg-primary h-1.5 rounded-full" style={{ width: `${stats.booking_rate}%` }}></div>
//             </div>
//           </div>

//           <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
//             <div className="flex items-center justify-between mb-4">
//               <StarIcon className="w-8 h-8 text-primary" />
//             </div>
//             <p className="text-slate-400 text-sm mb-1">AVERAGE RATING</p>
//             <p className="text-3xl font-black">
//               {stats.average_rating} <span className="text-lg text-slate-400">★</span>
//               <span className="text-sm text-slate-500 ml-2">({stats.total_reviews} reviews)</span>
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Availability Calendar */}
//           <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold">AVAILABILITY CALENDAR</h3>
//               <div className="flex gap-4 text-xs">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
//                   <span className="text-slate-400">CONFIRMED</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
//                   <span className="text-slate-400">PENDING</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                   <span className="text-slate-400">BLOCKED</span>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-7 gap-2 text-center">
//               {calendarDays.map((day, idx) => {
//                 const event = getEventForDay(day.day);
//                 return (
//                   <div key={idx} className="relative">
//                     <div className="text-center p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
//                       <div className="text-xs text-slate-500 mb-1">{day.month}</div>
//                       <div className="text-xl font-bold">{day.day}</div>
//                       {event && (
//                         <div className={`mt-2 w-2 h-2 rounded-full ${getCalendarStatusColor(event.status)} mx-auto`}></div>
//                       )}
//                     </div>
//                     {event && event.day === 8 && (
//                       <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-primary whitespace-nowrap">
//                         {event.title}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-xl font-bold mb-6">RECENT ACTIVITY</h3>
//             <div className="space-y-6">
//               <div className="border-l-2 border-primary/30 pl-4">
//                 <div className="flex items-center gap-2 mb-1">
//                   <CurrencyDollarIcon className="w-4 h-4 text-emerald-500" />
//                   <p className="text-sm font-medium text-white">Payment Received</p>
//                 </div>
//                 <p className="text-xs text-slate-400 mb-2">New booking payment processed for Studio A</p>
//                 <span className="text-[10px] text-slate-500">2 hours ago</span>
//               </div>
//               <div className="border-l-2 border-primary/30 pl-4">
//                 <div className="flex items-center gap-2 mb-1">
//                   <StarIcon className="w-4 h-4 text-amber-500" />
//                   <p className="text-sm font-medium text-white">New Review</p>
//                 </div>
//                 <p className="text-xs text-slate-400 mb-2">"Amazing space! Will definitely book again."</p>
//                 <span className="text-[10px] text-slate-500">5 hours ago</span>
//               </div>
//               {studios.length === 0 && (
//                 <div className="border-l-2 border-primary/30 pl-4">
//                   <p className="text-xs text-slate-400">No recent activity. Create your first studio to get started!</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Your Studios */}
//         <div className="mt-8">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-bold">YOUR STUDIOS</h3>
//             <Link href="/owner/list-new" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
//               ADD NEW STUDIO <PlusCircleIcon className="w-4 h-4" />
//             </Link>
//           </div>
          
//           {studios.length === 0 ? (
//             <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
//               <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <PlusCircleIcon className="w-8 h-8 text-primary" />
//               </div>
//               <h4 className="text-xl font-bold mb-2">No Studios Yet</h4>
//               <p className="text-slate-400 mb-6">Get started by listing your first creative space.</p>
//               <Link href="/owner/list-new" className="inline-flex items-center gap-2 px-6 py-3 bg-primary rounded-lg text-white font-bold hover:bg-primary/90 transition-all">
//                 <PlusCircleIcon className="w-5 h-5" />
//                 List Your First Studio
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {studios.map((studio) => (
//                 <div key={studio.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group">
//                   <div className="flex">
//                     <div className="w-32 h-32 overflow-hidden">
//                       <img 
//                         src={getCoverImage(studio.images)} 
//                         alt={studio.name}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                       />
//                     </div>
//                     <div className="flex-1 p-5">
//                       <div className="flex items-start justify-between mb-2">
//                         <h4 className="font-bold text-lg">{studio.name}</h4>
//                         <span className={`text-xs px-2 py-1 rounded-full ${
//                           studio.status === 'approved' || studio.status === 'active'
//                             ? 'bg-emerald-500/20 text-emerald-500'
//                             : studio.status === 'pending'
//                             ? 'bg-amber-500/20 text-amber-500'
//                             : 'bg-red-500/20 text-red-500'
//                         }`}>
//                           {studio.status || 'pending'}
//                         </span>
//                       </div>
//                       <p className="text-xs text-slate-400 mb-2">{studio.city}, {studio.state}</p>
//                       <p className="text-xs text-slate-400 mb-2">Capacity: {studio.capacity} people</p>
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-primary font-bold">${studio.hourly_rate}/hr</span>
//                         <Link href={`/owner/studios/${studio.id}`} className="text-slate-400 hover:text-primary transition-colors text-xs">
//                           View Details →
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Maximize Revenue Banner */}
//         <div className="mt-8 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-xl p-8">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//             <div className="flex-1">
//               <h3 className="text-2xl font-bold mb-2">Maximize Your Revenue with Pro-Listing</h3>
//               <p className="text-slate-400">
//                 Studio owners who use our premium listing services see a <span className="text-primary font-bold">24% increase</span> in booking inquiries within the first 30 days.
//               </p>
//             </div>
//             <Link href="/owner/pro-listing" className="px-6 py-3 bg-primary hover:bg-primary/90 transition-all rounded-lg font-bold whitespace-nowrap">
//               LEARN MORE
//               <ArrowRightIcon className="w-4 h-4 inline-block ml-2" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }