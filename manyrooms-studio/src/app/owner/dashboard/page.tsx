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



'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
  CalendarIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  BellIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import './owner.css';

// Types based on your database schema
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

interface DashboardStats {
  total_earnings: number;
  earnings_growth: number;
  booking_rate: number;
  average_rating: number;
  total_reviews: number;
  active_studios: number;
  total_bookings: number;
}

export default function OwnerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [studios, setStudios] = useState<Studio[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_earnings: 0,
    earnings_growth: 0,
    booking_rate: 0,
    average_rating: 0,
    total_reviews: 0,
    active_studios: 0,
    total_bookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch studios from Supabase
  useEffect(() => {
    if (!loading && user) {
      fetchStudios();
    }
  }, [user, loading]);

  const fetchStudios = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Fetch studios owned by this user
      const { data: studiosData, error: studiosError } = await supabase
        .from('studios')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (studiosError) throw studiosError;
      
      setStudios(studiosData || []);
      
      // Calculate stats from studio data
      const activeCount = studiosData?.filter(s => s.status === 'approved' || s.status === 'active').length || 0;
      
      // For now, using calculated estimates based on studio data
      // In a real app, you'd fetch these from bookings/earnings tables
      setStats({
        total_earnings: studiosData?.reduce((sum, s) => sum + (s.hourly_rate * 50), 0) || 0, // Estimate
        earnings_growth: 12, // Would come from comparing periods
        booking_rate: activeCount > 0 ? Math.floor(Math.random() * 30) + 70 : 0, // Mock for now
        average_rating: 4.9, // Would come from reviews
        total_reviews: studiosData?.reduce((sum, s) => sum + Math.floor(Math.random() * 50) + 10, 0) || 0,
        active_studios: activeCount,
        total_bookings: studiosData?.reduce((sum, s) => sum + Math.floor(Math.random() * 100) + 10, 0) || 0,
      });
      
    } catch (error) {
      console.error('Error fetching studios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: string, activityId: string) => {
    setToastMessage(`${action} booking request`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
          <div className="text-primary font-bold">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  // Calendar data (keeping as is - this would come from bookings)
  const calendarDays = [
    { day: 28, month: 'SUN' }, { day: 29, month: 'MON' }, { day: 30, month: 'TUE' },
    { day: 1, month: 'WED' }, { day: 2, month: 'THU' }, { day: 3, month: 'FRI' },
    { day: 4, month: 'SAT' }, { day: 5, month: 'SUN' }, { day: 6, month: 'MON' },
    { day: 7, month: 'TUE' }, { day: 8, month: 'WED' }, { day: 9, month: 'THU' },
    { day: 10, month: 'FRI' }, { day: 11, month: 'SAT' },
  ];

  const calendarEvents = [
    { day: 8, status: 'confirmed', title: 'ART EXHIBIT' },
    { day: 10, status: 'pending', title: 'Photoshoot' },
    { day: 5, status: 'blocked', title: 'Maintenance' },
  ];

  const getEventForDay = (day: number) => {
    return calendarEvents.find(event => event.day === day);
  };

  const getCalendarStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500';
      case 'pending': return 'bg-amber-500';
      case 'blocked': return 'bg-red-500';
      default: return '';
    }
  };

  // Get cover image from studio images array
  const getCoverImage = (images: string[]) => {
    if (!images || images.length === 0) return '/placeholder-studio.jpg';
    return images[0];
  };

  return (
    <>
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-6 py-4 flex items-center gap-3 backdrop-blur-lg">
            <CheckCircleSolid className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-white">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight">Studio Overview</h2>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back to the Atelier. You have <span className="text-primary">{studios.length}</span> studio{studios.length !== 1 ? 's' : ''} in your portfolio.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <CurrencyDollarIcon className="w-8 h-8 text-primary" />
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                +{stats.earnings_growth}% vs last month
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">TOTAL EARNINGS</p>
            <p className="text-3xl font-black">${stats.total_earnings.toLocaleString()}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-slate-400 text-sm mb-1">BOOKING RATE</p>
            <p className="text-3xl font-black">{stats.booking_rate}%</p>
            <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${stats.booking_rate}%` }}></div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <StarIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-slate-400 text-sm mb-1">AVERAGE RATING</p>
            <p className="text-3xl font-black">
              {stats.average_rating} <span className="text-lg text-slate-400">★</span>
              <span className="text-sm text-slate-500 ml-2">({stats.total_reviews} reviews)</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Availability Calendar */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">AVAILABILITY CALENDAR</h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-400">CONFIRMED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-slate-400">PENDING</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-400">BLOCKED</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {calendarDays.map((day, idx) => {
                const event = getEventForDay(day.day);
                return (
                  <div key={idx} className="relative">
                    <div className="text-center p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                      <div className="text-xs text-slate-500 mb-1">{day.month}</div>
                      <div className="text-xl font-bold">{day.day}</div>
                      {event && (
                        <div className={`mt-2 w-2 h-2 rounded-full ${getCalendarStatusColor(event.status)} mx-auto`}></div>
                      )}
                    </div>
                    {event && event.day === 8 && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] text-primary whitespace-nowrap">
                        {event.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">RECENT ACTIVITY</h3>
            <div className="space-y-6">
              <div className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <CurrencyDollarIcon className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm font-medium text-white">Payment Received</p>
                </div>
                <p className="text-xs text-slate-400 mb-2">New booking payment processed for Studio A</p>
                <span className="text-[10px] text-slate-500">2 hours ago</span>
              </div>
              <div className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <StarIcon className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-medium text-white">New Review</p>
                </div>
                <p className="text-xs text-slate-400 mb-2">"Amazing space! Will definitely book again."</p>
                <span className="text-[10px] text-slate-500">5 hours ago</span>
              </div>
              {studios.length === 0 && (
                <div className="border-l-2 border-primary/30 pl-4">
                  <p className="text-xs text-slate-400">No recent activity. Create your first studio to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Your Studios */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">YOUR STUDIOS</h3>
            <Link href="/owner/list-new" className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              ADD NEW STUDIO <PlusCircleIcon className="w-4 h-4" />
            </Link>
          </div>
          
          {studios.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircleIcon className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">No Studios Yet</h4>
              <p className="text-slate-400 mb-6">Get started by listing your first creative space.</p>
              <Link href="/owner/list-new" className="inline-flex items-center gap-2 px-6 py-3 bg-primary rounded-lg text-white font-bold hover:bg-primary/90 transition-all">
                <PlusCircleIcon className="w-5 h-5" />
                List Your First Studio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studios.map((studio) => (
                <div key={studio.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all group">
                  <div className="flex">
                    <div className="w-32 h-32 overflow-hidden">
                      <img 
                        src={getCoverImage(studio.images)} 
                        alt={studio.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg">{studio.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          studio.status === 'approved' || studio.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : studio.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {studio.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{studio.city}, {studio.state}</p>
                      <p className="text-xs text-slate-400 mb-2">Capacity: {studio.capacity} people</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-bold">${studio.hourly_rate}/hr</span>
                        <Link href={`/owner/studios/${studio.id}`} className="text-slate-400 hover:text-primary transition-colors text-xs">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maximize Revenue Banner */}
        <div className="mt-8 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Maximize Your Revenue with Pro-Listing</h3>
              <p className="text-slate-400">
                Studio owners who use our premium listing services see a <span className="text-primary font-bold">24% increase</span> in booking inquiries within the first 30 days.
              </p>
            </div>
            <Link href="/owner/pro-listing" className="px-6 py-3 bg-primary hover:bg-primary/90 transition-all rounded-lg font-bold whitespace-nowrap">
              LEARN MORE
              <ArrowRightIcon className="w-4 h-4 inline-block ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}