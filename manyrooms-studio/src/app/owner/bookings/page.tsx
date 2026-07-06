// app/owner/bookings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  UsersIcon,
  ArrowRightIcon,
  StarIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface Enquiry {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  event_date: string;
  guests_count: number;
  brief: string;
  status: string;
  studio_id: string;
  studio_name: string;
  studio_image: string;
  studio_city: string;
  studio_state: string;
  created_at: string;
}

export default function OwnerBookingsPage() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (user) fetchEnquiries();
  }, [user]);

  const fetchEnquiries = async () => {
    try {
      const { data: studiosData } = await supabase.from('studios').select('id').eq('owner_id', user?.id);
      if (!studiosData || studiosData.length === 0) { setEnquiries([]); setLoading(false); return; }

      const studioIds = studiosData.map(s => s.id);
      const { data, error } = await supabase
        .from('enquiries')
        .select('*, studios(name, images, city, state)')
        .in('studio_id', studioIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((enq: any) => ({
        id: enq.id,
        guest_name: enq.guest_name,
        guest_email: enq.guest_email,
        guest_phone: enq.guest_phone,
        event_date: enq.event_date,
        guests_count: enq.guests_count,
        brief: enq.brief,
        status: enq.status,
        studio_id: enq.studio_id,
        studio_name: enq.studios?.name || 'Unknown Studio',
        studio_image: enq.studios?.images?.[0] || '',
        studio_city: enq.studios?.city || '',
        studio_state: enq.studios?.state || '',
        created_at: enq.created_at,
      }));

      setEnquiries(mapped);
    } catch (err) { console.error('Error:', err); } finally { setLoading(false); }
  };

  const handleApprove = async (id: string) => {
    await supabase.from('enquiries').update({ status: 'approved' }).eq('id', id);
    await supabase.from('messages').insert({
      enquiry_id: id,
      sender_id: user?.id,
      sender_type: 'system',
      message: '✅ BOOKING APPROVED: Your enquiry has been approved! The studio is confirmed for your session.',
      read: false,
      created_at: new Date().toISOString(),
    });
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
    setToastMessage('Booking approved!'); setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleDecline = async (id: string) => {
    await supabase.from('enquiries').update({ status: 'declined' }).eq('id', id);
    await supabase.from('messages').insert({
      enquiry_id: id,
      sender_id: user?.id,
      sender_type: 'system',
      message: '❌ BOOKING DECLINED: Unfortunately your enquiry could not be accommodated.',
      read: false,
      created_at: new Date().toISOString(),
    });
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'declined' } : e));
    setToastMessage('Booking declined.'); setShowSuccessToast(true); setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const pendingEnquiries = enquiries.filter(e => e.status === 'pending');
  const approvedEnquiries = enquiries.filter(e => e.status === 'approved');
  const totalBookings = enquiries.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-[#446900]/20 rounded-full mx-auto mb-3"></div>
          <p className="text-[#446900] font-bold text-sm">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-[#beff5f] border border-[#446900]/20 rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg">
            <CheckCircleSolid className="w-5 h-5 text-[#111f00]" />
            <span className="text-sm font-bold text-[#111f00]">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1d] tracking-tight">Bookings & Schedule</h2>
          <p className="text-[#424937] text-sm mt-1">Manage your studio bookings and approve requests.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c2c9b1]/20">
            <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-2">Total Bookings</p>
            <p className="text-3xl font-extrabold text-[#191c1d]">{totalBookings}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c2c9b1]/20">
            <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-2">Pending</p>
            <p className="text-3xl font-extrabold text-amber-600">{pendingEnquiries.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c2c9b1]/20">
            <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-2">Approved</p>
            <p className="text-3xl font-extrabold text-green-600">{approvedEnquiries.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c2c9b1]/20">
            <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-2">Studios</p>
            <p className="text-3xl font-extrabold text-[#191c1d]">—</p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#c2c9b1]/20 overflow-hidden mb-8">
          <div className="p-6 border-b border-[#c2c9b1]/20 flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#191c1d]">Pending Requests</h3>
          </div>
          <div className="divide-y divide-[#c2c9b1]/10">
            {pendingEnquiries.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircleIcon className="w-12 h-12 text-[#c2c9b1] mx-auto mb-3" />
                <p className="text-[#424937] font-bold">No pending requests</p>
              </div>
            ) : (
              pendingEnquiries.map((enq) => (
                <div key={enq.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-[#f3f4f5] transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#e4d7fd] flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-[#665c7c]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#191c1d]">{enq.guest_name}</p>
                      <p className="text-sm text-[#424937]">{enq.studio_name}</p>
                      <p className="text-xs text-[#737a65] flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />{enq.event_date} • {enq.guests_count} guests
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-16 md:ml-0">
                    <button onClick={() => handleApprove(enq.id)}
                      className="px-5 py-2.5 bg-[#beff5f] text-[#111f00] rounded-xl font-bold text-sm hover:scale-105 transition-all">
                      Approve
                    </button>
                    <button onClick={() => handleDecline(enq.id)}
                      className="px-5 py-2.5 bg-red-50 text-[#ba1a1a] border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-all">
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Approved Bookings */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#c2c9b1]/20 overflow-hidden">
          <div className="p-6 border-b border-[#c2c9b1]/20 flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#191c1d]">Approved Bookings</h3>
          </div>
          <div className="divide-y divide-[#c2c9b1]/10">
            {approvedEnquiries.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircleIcon className="w-12 h-12 text-[#c2c9b1] mx-auto mb-3" />
                <p className="text-[#424937] font-bold">No approved bookings yet</p>
              </div>
            ) : (
              approvedEnquiries.map((enq) => (
                <div key={enq.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-[#f3f4f5] transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-[#191c1d]">{enq.guest_name}</p>
                      <p className="text-sm text-[#424937]">{enq.studio_name}</p>
                      <p className="text-xs text-[#737a65] flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />{enq.event_date} • {enq.guests_count} guests
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-16 md:ml-0">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Approved</span>
                    <Link href={`/owner/messages`}
                      className="px-4 py-2 bg-[#191c1d] text-white rounded-xl font-bold text-sm hover:bg-[#2e3132] transition-all">
                      Message
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





// // app/owner/bookings/page.tsx
// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   XMarkIcon,
//   CheckCircleIcon,
//   UsersIcon,
//   DocumentArrowDownIcon,
//   ArrowRightIcon,
//   StarIcon,
//   CalendarIcon,
//   ClockIcon,
//   CurrencyDollarIcon,
// } from '@heroicons/react/24/outline';
// import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface BookingSlot {
//   id: string;
//   time: string;
//   date: string;
//   title?: string;
//   client?: string;
//   type: 'booking' | 'maintenance' | 'available';
//   status: 'confirmed' | 'pending' | 'blocked';
//   amount?: number;
// }

// interface BookingRequest {
//   id: string;
//   clientName: string;
//   sessionType: string;
//   date: string;
//   time: string;
//   amount: number;
//   status: 'pending' | 'approved' | 'declined';
// }

// interface StudioHealth {
//   occupancyRate: number;
//   netRevenue: number;
//   totalBookings: number;
//   averageRating: number;
// }

// export default function OwnerBookingsPage() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
//   const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');

//   const [health] = useState<StudioHealth>({
//     occupancyRate: 84,
//     netRevenue: 12450,
//     totalBookings: 156,
//     averageRating: 4.9,
//   });

//   const [bookingSlots] = useState<BookingSlot[]>([
//     { id: '1', time: '09:00 AM', date: '2024-10-21', type: 'booking', status: 'confirmed', title: 'Product Launch', client: 'H&M Creative', amount: 1200 },
//     { id: '2', time: '01:30 PM', date: '2024-10-21', type: 'booking', status: 'confirmed', title: 'Portrait Session', client: 'Sarah Jenkins', amount: 450 },
//     { id: '3', time: '05:00 PM', date: '2024-10-21', type: 'available', status: 'confirmed' },
//     { id: '4', time: '01:00 PM', date: '2024-10-22', type: 'maintenance', status: 'blocked', title: 'MAINTENANCE' },
//     { id: '5', time: '09:00 AM', date: '2024-10-22', type: 'available', status: 'confirmed' },
//     { id: '6', time: '03:00 PM', date: '2024-10-22', type: 'booking', status: 'pending', title: 'Video Campaign', client: 'Studio Alpha', amount: 800 },
//     { id: '7', time: '09:00 AM', date: '2024-10-23', type: 'booking', status: 'confirmed', title: 'Fashion Editorial', client: 'Vogue', amount: 2500 },
//     { id: '8', time: '02:00 PM', date: '2024-10-23', type: 'available', status: 'confirmed' },
//     { id: '9', time: '05:00 PM', date: '2024-10-23', type: 'booking', status: 'confirmed', title: 'Music Video', client: 'Lunar Records', amount: 1800 },
//     { id: '10', time: '10:00 AM', date: '2024-10-24', type: 'available', status: 'confirmed' },
//     { id: '11', time: '01:00 PM', date: '2024-10-24', type: 'booking', status: 'pending', title: 'Product Photography', client: 'Nike', amount: 1500 },
//     { id: '12', time: '04:00 PM', date: '2024-10-24', type: 'available', status: 'confirmed' },
//   ]);

//   const [pendingRequests, setPendingRequests] = useState<BookingRequest[]>([
//     { id: '1', clientName: 'Sarah Jenkins', sessionType: 'Portrait Session', date: 'Oct 28', time: '2:00 PM - 5:00 PM', amount: 450, status: 'pending' },
//     { id: '2', clientName: 'Marco Valenti', sessionType: 'Video Campaign', date: 'Oct 29', time: '10:00 AM - 4:00 PM', amount: 1200, status: 'pending' },
//     { id: '3', clientName: 'Studio Alpha Corp', sessionType: 'Workshop', date: 'Nov 02', time: '9:00 AM - 6:00 PM', amount: 800, status: 'pending' },
//   ]);

//   const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
//   const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
  
//   const getWeekDates = () => {
//     const dates = [];
//     const start = new Date(selectedDate);
//     const day = start.getDay();
//     const diff = start.getDate() - day + (day === 0 ? -6 : 1);
//     const monday = new Date(start.setDate(diff));
    
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(monday);
//       date.setDate(monday.getDate() + i);
//       dates.push(date);
//     }
//     return dates;
//   };

//   const weekDates = getWeekDates();
//   const weekRange = `${weekDates[0].toLocaleString('default', { month: 'short' })} ${weekDates[0].getDate()} – ${weekDates[6].getDate()}, ${weekDates[0].getFullYear()}`;

//   const handleApproveRequest = (id: string) => {
//     setPendingRequests(prev => prev.filter(req => req.id !== id));
//     setToastMessage('Booking request approved successfully!');
//     setShowSuccessToast(true);
//     setTimeout(() => setShowSuccessToast(false), 3000);
//   };

//   const handleDeclineRequest = (id: string) => {
//     setPendingRequests(prev => prev.filter(req => req.id !== id));
//     setToastMessage('Booking request declined.');
//     setShowSuccessToast(true);
//     setTimeout(() => setShowSuccessToast(false), 3000);
//   };

//   const toggleTimeSlot = (slotId: string) => {
//     setSelectedTimeSlots(prev => 
//       prev.includes(slotId) 
//         ? prev.filter(id => id !== slotId)
//         : [...prev, slotId]
//     );
//   };

//   const getSlotStyle = (slot: BookingSlot) => {
//     if (slot.type === 'maintenance') {
//       return 'bg-red-50 border-red-200 cursor-not-allowed';
//     }
//     if (slot.type === 'booking') {
//       if (slot.status === 'confirmed') {
//         return 'bg-[#beff5f]/20 border-[#beff5f]/30 cursor-pointer hover:bg-[#beff5f]/30';
//       }
//       if (slot.status === 'pending') {
//         return 'bg-amber-50 border-amber-200 cursor-pointer hover:bg-amber-100';
//       }
//     }
//     return 'bg-white border-[#c2c9b1]/20 hover:bg-[#f3f4f5] cursor-pointer';
//   };

//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       {/* Success Toast */}
//       {showSuccessToast && (
//         <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
//           <div className="bg-[#beff5f] border border-[#446900]/20 rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg">
//             <CheckCircleSolid className="w-5 h-5 text-[#111f00]" />
//             <span className="text-sm font-bold text-[#111f00]">{toastMessage}</span>
//           </div>
//         </div>
//       )}

//       <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        
//         {/* Page Header */}
//         <div className="mb-8">
//           <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1d] tracking-tight">Bookings & Schedule</h2>
//           <p className="text-[#424937] text-sm mt-1">
//             Manage your studio availability, approve booking requests, and track your calendar.
//           </p>
//         </div>

//         {/* Studio Health Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c2c9b1]/20">
//             <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-2">Occupancy</p>
//             <p className="text-3xl font-extrabold text-[#191c1d]">{health.occupancyRate}%</p>
//             <div className="w-full bg-[#edeeef] rounded-full h-1.5 mt-3">
//               <div className="bg-[#446900] h-1.5 rounded-full" style={{ width: `${health.occupancyRate}%` }}></div>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c2c9b1]/20">
//             <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-2">Revenue (Oct)</p>
//             <p className="text-3xl font-extrabold text-[#446900]">${health.netRevenue.toLocaleString()}</p>
//           </div>
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c2c9b1]/20">
//             <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-2">Total Bookings</p>
//             <p className="text-3xl font-extrabold text-[#191c1d]">{health.totalBookings}</p>
//           </div>
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#c2c9b1]/20">
//             <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-2">Avg Rating</p>
//             <p className="text-3xl font-extrabold text-[#191c1d] flex items-center gap-1">
//               {health.averageRating} <StarIcon className="w-6 h-6 text-[#446900] fill-current" />
//             </p>
//           </div>
//         </div>

//         {/* Action Bar */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-1 bg-[#edeeef] rounded-xl p-1">
//               <button
//                 onClick={() => setViewMode('weekly')}
//                 className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
//                   viewMode === 'weekly' ? 'bg-white text-[#191c1d] shadow-sm' : 'text-[#424937] hover:text-[#191c1d]'
//                 }`}
//               >
//                 Weekly
//               </button>
//               <button
//                 onClick={() => setViewMode('monthly')}
//                 className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
//                   viewMode === 'monthly' ? 'bg-white text-[#191c1d] shadow-sm' : 'text-[#424937] hover:text-[#191c1d]'
//                 }`}
//               >
//                 Monthly
//               </button>
//             </div>
//             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c2c9b1] rounded-xl text-sm font-bold hover:bg-[#edeeef] transition-all">
//               <DocumentArrowDownIcon className="w-4 h-4" />
//               Export
//             </button>
//             {selectedTimeSlots.length > 0 && (
//               <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-[#ba1a1a] border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">
//                 <XMarkIcon className="w-4 h-4" />
//                 Mark Unavailable ({selectedTimeSlots.length})
//               </button>
//             )}
//           </div>

//           {/* Week Navigation */}
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={() => {
//                 const newDate = new Date(selectedDate);
//                 newDate.setDate(selectedDate.getDate() - 7);
//                 setSelectedDate(newDate);
//               }}
//               className="p-2 hover:bg-[#edeeef] rounded-lg transition-all"
//             >
//               <ChevronLeftIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//             <h3 className="text-lg font-extrabold text-[#191c1d] min-w-[200px] text-center">{weekRange}</h3>
//             <button 
//               onClick={() => {
//                 const newDate = new Date(selectedDate);
//                 newDate.setDate(selectedDate.getDate() + 7);
//                 setSelectedDate(newDate);
//               }}
//               className="p-2 hover:bg-[#edeeef] rounded-lg transition-all"
//             >
//               <ChevronRightIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#c2c9b1]/20 mb-8">
//           {/* Week Days Header */}
//           <div className="grid grid-cols-7 border-b border-[#c2c9b1]/20">
//             {weekDays.map((day, idx) => (
//               <div key={idx} className="p-4 text-center border-r border-[#c2c9b1]/20 last:border-r-0">
//                 <p className="text-xs text-[#737a65] font-bold mb-1">{day}</p>
//                 <p className={`text-2xl font-extrabold ${weekDates[idx].getDate() === new Date().getDate() ? 'text-[#446900] bg-[#beff5f]/30 rounded-full w-10 h-10 flex items-center justify-center mx-auto' : 'text-[#191c1d]'}`}>
//                   {weekDates[idx].getDate()}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Time Slots Grid */}
//           <div className="grid grid-cols-7">
//             {weekDays.map((_, dayIdx) => (
//               <div key={dayIdx} className="border-r border-[#c2c9b1]/20 last:border-r-0">
//                 {timeSlots.map((time, timeIdx) => {
//                   const dateStr = weekDates[dayIdx].toISOString().split('T')[0];
//                   const slot = bookingSlots.find(s => s.time === time && s.date === dateStr);
//                   return (
//                     <div
//                       key={`${dayIdx}-${timeIdx}`}
//                       onClick={() => slot && slot.type !== 'maintenance' && toggleTimeSlot(slot.id)}
//                       className={`min-h-[90px] p-3 border-b border-[#c2c9b1]/10 last:border-b-0 transition-all ${
//                         slot ? getSlotStyle(slot) : 'bg-white border-[#c2c9b1]/10'
//                       } ${selectedTimeSlots.includes(slot?.id || '') ? 'ring-2 ring-[#446900]' : ''}`}
//                     >
//                       {timeIdx === 0 && (
//                         <div className="text-[10px] text-[#737a65] font-bold mb-2">{time}</div>
//                       )}
//                       {slot && slot.type === 'maintenance' && (
//                         <div className="space-y-1">
//                           <p className="text-xs font-bold text-[#ba1a1a]">{slot.title}</p>
//                         </div>
//                       )}
//                       {slot && slot.type === 'booking' && (
//                         <div className="space-y-1">
//                           <p className="text-xs font-bold text-[#191c1d]">{slot.title}</p>
//                           {slot.client && (
//                             <p className="text-[10px] text-[#424937]">{slot.client}</p>
//                           )}
//                           {slot.amount && (
//                             <p className="text-[10px] font-bold text-[#446900]">${slot.amount}</p>
//                           )}
//                           <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
//                             slot.status === 'confirmed' ? 'bg-[#beff5f]/30 text-[#111f00]' : 'bg-amber-100 text-amber-700'
//                           }`}>
//                             {slot.status}
//                           </span>
//                         </div>
//                       )}
//                       {slot && slot.type === 'available' && selectedTimeSlots.includes(slot.id) && (
//                         <div className="flex items-center gap-1 mt-1">
//                           <CheckCircleIcon className="w-3 h-3 text-[#446900]" />
//                           <span className="text-[10px] font-bold text-[#446900]">Selected</span>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pending Requests */}
//         <div className="bg-white rounded-2xl shadow-lg border border-[#c2c9b1]/20 overflow-hidden">
//           <div className="p-6 border-b border-[#c2c9b1]/20 flex items-center justify-between">
//             <h3 className="text-xl font-extrabold text-[#191c1d]">Pending Requests</h3>
//             <Link href="/owner/bookings/requests" className="text-[#446900] font-bold text-sm hover:underline flex items-center gap-1">
//               View All <ArrowRightIcon className="w-3 h-3" />
//             </Link>
//           </div>
//           <div className="divide-y divide-[#c2c9b1]/10">
//             {pendingRequests.map((request) => (
//               <div key={request.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-[#f3f4f5] transition-all gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-[#e4d7fd] flex items-center justify-center">
//                     <UsersIcon className="w-6 h-6 text-[#665c7c]" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-[#191c1d]">{request.clientName}</p>
//                     <p className="text-sm text-[#424937]">{request.sessionType} • {request.date}</p>
//                     <p className="text-xs text-[#737a65] flex items-center gap-1">
//                       <ClockIcon className="w-3 h-3" />
//                       {request.time}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 ml-16 md:ml-0">
//                   <span className="text-lg font-extrabold text-[#446900]">${request.amount}</span>
//                   <button
//                     onClick={() => handleApproveRequest(request.id)}
//                     className="px-5 py-2.5 bg-[#beff5f] text-[#111f00] rounded-xl font-bold text-sm hover:scale-105 transition-all"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleDeclineRequest(request.id)}
//                     className="px-5 py-2.5 bg-red-50 text-[#ba1a1a] border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
//                   >
//                     Decline
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {pendingRequests.length === 0 && (
//               <div className="p-8 text-center">
//                 <CheckCircleIcon className="w-12 h-12 text-[#c2c9b1] mx-auto mb-3" />
//                 <p className="text-[#424937] font-bold">No pending requests</p>
//                 <p className="text-sm text-[#737a65]">All booking requests have been processed.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   XMarkIcon,
//   CheckCircleIcon,
//   UsersIcon,
//   DocumentArrowDownIcon,
//   ArrowRightIcon,
// } from '@heroicons/react/24/outline';
// import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

// // Types
// interface BookingSlot {
//   id: string;
//   time: string;
//   date: string;
//   title?: string;
//   client?: string;
//   type: 'booking' | 'maintenance' | 'available';
//   status: 'confirmed' | 'pending' | 'blocked';
//   amount?: number;
// }

// interface BookingRequest {
//   id: string;
//   clientName: string;
//   sessionType: string;
//   date: string;
//   time: string;
//   amount: number;
//   status: 'pending' | 'approved' | 'declined';
// }

// interface StudioHealth {
//   occupancyRate: number;
//   netRevenue: number;
//   totalBookings: number;
//   averageRating: number;
// }

// export default function OwnerBookings() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
//   const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');

//   // Studio Health Data
//   const [health] = useState<StudioHealth>({
//     occupancyRate: 84,
//     netRevenue: 12450,
//     totalBookings: 156,
//     averageRating: 4.9,
//   });

//   // Booking slots for the week
//   const [bookingSlots] = useState<BookingSlot[]>([
//     { id: '1', time: '09:00 AM', date: '2024-10-21', type: 'booking', status: 'confirmed', title: 'Product Launch', client: 'H&M Creative', amount: 1200 },
//     { id: '2', time: '01:30 PM', date: '2024-10-21', type: 'booking', status: 'confirmed', title: 'Portrait Session', client: 'Sarah Jenkins', amount: 450 },
//     { id: '3', time: '05:00 PM', date: '2024-10-21', type: 'available', status: 'confirmed' },
//     { id: '4', time: '01:00 PM', date: '2024-10-22', type: 'maintenance', status: 'blocked', title: 'MAINTENANCE' },
//     { id: '5', time: '09:00 AM', date: '2024-10-22', type: 'available', status: 'confirmed' },
//     { id: '6', time: '03:00 PM', date: '2024-10-22', type: 'booking', status: 'pending', title: 'Video Campaign', client: 'Studio Alpha', amount: 800 },
//     { id: '7', time: '09:00 AM', date: '2024-10-23', type: 'booking', status: 'confirmed', title: 'Fashion Editorial', client: 'Vogue', amount: 2500 },
//     { id: '8', time: '02:00 PM', date: '2024-10-23', type: 'available', status: 'confirmed' },
//     { id: '9', time: '05:00 PM', date: '2024-10-23', type: 'booking', status: 'confirmed', title: 'Music Video', client: 'Lunar Records', amount: 1800 },
//     { id: '10', time: '10:00 AM', date: '2024-10-24', type: 'available', status: 'confirmed' },
//     { id: '11', time: '01:00 PM', date: '2024-10-24', type: 'booking', status: 'pending', title: 'Product Photography', client: 'Nike', amount: 1500 },
//     { id: '12', time: '04:00 PM', date: '2024-10-24', type: 'available', status: 'confirmed' },
//     { id: '13', time: '09:00 AM', date: '2024-10-25', type: 'booking', status: 'confirmed', title: 'Interview Setup', client: 'Netflix', amount: 2000 },
//     { id: '14', time: '01:00 PM', date: '2024-10-25', type: 'booking', status: 'confirmed', title: 'Podcast Recording', client: 'Creative Minds', amount: 600 },
//     { id: '15', time: '05:00 PM', date: '2024-10-25', type: 'available', status: 'confirmed' },
//     { id: '16', time: '11:00 AM', date: '2024-10-26', type: 'booking', status: 'confirmed', title: 'Wedding Shoot', client: 'Johnson Wedding', amount: 3000 },
//     { id: '17', time: '03:00 PM', date: '2024-10-26', type: 'available', status: 'confirmed' },
//     { id: '18', time: '12:00 PM', date: '2024-10-27', type: 'available', status: 'confirmed' },
//     { id: '19', time: '04:00 PM', date: '2024-10-27', type: 'booking', status: 'confirmed', title: 'Portfolio Shoot', client: 'Emma Watson', amount: 750 },
//   ]);

//   // Pending Booking Requests
//   const [pendingRequests, setPendingRequests] = useState<BookingRequest[]>([
//     {
//       id: '1',
//       clientName: 'Sarah Jenkins',
//       sessionType: 'Portrait Session',
//       date: 'Oct 28',
//       time: '2:00 PM - 5:00 PM',
//       amount: 450,
//       status: 'pending',
//     },
//     {
//       id: '2',
//       clientName: 'Marco Valenti',
//       sessionType: 'Video Campaign',
//       date: 'Oct 29',
//       time: '10:00 AM - 4:00 PM',
//       amount: 1200,
//       status: 'pending',
//     },
//     {
//       id: '3',
//       clientName: 'Studio Alpha Corp',
//       sessionType: 'Workshop',
//       date: 'Nov 02',
//       time: '9:00 AM - 6:00 PM',
//       amount: 800,
//       status: 'pending',
//     },
//   ]);

//   const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
//   const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
  
//   // Get current week dates
//   const getWeekDates = () => {
//     const dates = [];
//     const start = new Date(selectedDate);
//     const day = start.getDay();
//     const diff = start.getDate() - day + (day === 0 ? -6 : 1);
//     const monday = new Date(start.setDate(diff));
    
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(monday);
//       date.setDate(monday.getDate() + i);
//       dates.push(date);
//     }
//     return dates;
//   };

//   const weekDates = getWeekDates();
//   const weekRange = `${weekDates[0].getDate()} – ${weekDates[6].getDate()}, ${weekDates[0].toLocaleString('default', { month: 'long' })} ${weekDates[0].getFullYear()}`;

//   const handleApproveRequest = (id: string) => {
//     setPendingRequests(prev => prev.filter(req => req.id !== id));
//     setToastMessage('Booking request approved successfully!');
//     setShowSuccessToast(true);
//     setTimeout(() => setShowSuccessToast(false), 3000);
//   };

//   const handleDeclineRequest = (id: string) => {
//     setPendingRequests(prev => prev.filter(req => req.id !== id));
//     setToastMessage('Booking request declined.');
//     setShowSuccessToast(true);
//     setTimeout(() => setShowSuccessToast(false), 3000);
//   };

//   const handleMarkUnavailable = () => {
//     if (selectedTimeSlots.length > 0) {
//       setToastMessage(`${selectedTimeSlots.length} time slot(s) marked as unavailable`);
//       setShowSuccessToast(true);
//       setTimeout(() => setShowSuccessToast(false), 3000);
//       setSelectedTimeSlots([]);
//     }
//   };

//   const handleExportSchedule = () => {
//     setToastMessage('Schedule exported successfully!');
//     setShowSuccessToast(true);
//     setTimeout(() => setShowSuccessToast(false), 3000);
//   };

//   const toggleTimeSlot = (slotId: string) => {
//     setSelectedTimeSlots(prev => 
//       prev.includes(slotId) 
//         ? prev.filter(id => id !== slotId)
//         : [...prev, slotId]
//     );
//   };

//   const getSlotStyle = (slot: BookingSlot) => {
//     if (slot.type === 'maintenance') {
//       return 'bg-red-500/20 border-red-500/30 cursor-not-allowed';
//     }
//     if (slot.type === 'booking') {
//       if (slot.status === 'confirmed') {
//         return 'bg-primary/20 border-primary/30 cursor-pointer';
//       }
//       if (slot.status === 'pending') {
//         return 'bg-amber-500/20 border-amber-500/30 cursor-pointer';
//       }
//     }
//     return 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer';
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

//       {/* Page Content */}
//       <div className="p-8">
//         {/* Page Header */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-black tracking-tight">Dashboard</h2>
//           <p className="text-slate-400 text-sm mt-1">
//             Availability & Calendar — Manage your studio slots, approvals, and maintenance windows.
//           </p>
//         </div>

//         {/* Action Bar */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
//               <button
//                 onClick={() => setViewMode('weekly')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'weekly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
//               >
//                 WEEKLY
//               </button>
//               <button
//                 onClick={() => setViewMode('monthly')}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'monthly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
//               >
//                 MONTHLY
//               </button>
//             </div>
//             <button
//               onClick={handleExportSchedule}
//               className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
//             >
//               <DocumentArrowDownIcon className="w-4 h-4" />
//               EXPORT SCHEDULE
//             </button>
//             <button
//               onClick={handleMarkUnavailable}
//               className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg text-sm font-medium transition-all"
//             >
//               <XMarkIcon className="w-4 h-4" />
//               MARK UNAVAILABLE
//             </button>
//           </div>
//         </div>

//         {/* Week Navigation */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={() => {
//                 const newDate = new Date(selectedDate);
//                 newDate.setDate(selectedDate.getDate() - 7);
//                 setSelectedDate(newDate);
//               }}
//               className="p-2 hover:bg-white/5 rounded-lg transition-all"
//             >
//               <ChevronLeftIcon className="w-5 h-5" />
//             </button>
//             <h3 className="text-xl font-bold">{weekRange}</h3>
//             <button 
//               onClick={() => {
//                 const newDate = new Date(selectedDate);
//                 newDate.setDate(selectedDate.getDate() + 7);
//                 setSelectedDate(newDate);
//               }}
//               className="p-2 hover:bg-white/5 rounded-lg transition-all"
//             >
//               <ChevronRightIcon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
//           {/* Week Days Header */}
//           <div className="grid grid-cols-7 border-b border-white/10">
//             {weekDays.map((day, idx) => (
//               <div key={idx} className="p-4 text-center border-r border-white/10 last:border-r-0">
//                 <p className="text-xs text-slate-400 font-medium mb-1">{day}</p>
//                 <p className="text-xl font-bold">{weekDates[idx].getDate()}</p>
//               </div>
//             ))}
//           </div>

//           {/* Time Slots */}
//           <div className="grid grid-cols-7">
//             {weekDays.map((_, dayIdx) => (
//               <div key={dayIdx} className="border-r border-white/10 last:border-r-0">
//                 {timeSlots.map((time, timeIdx) => {
//                   const dateStr = weekDates[dayIdx].toISOString().split('T')[0];
//                   const slot = bookingSlots.find(s => s.time === time && s.date === dateStr);
//                   return (
//                     <div
//                       key={`${dayIdx}-${timeIdx}`}
//                       onClick={() => slot && slot.type !== 'maintenance' && toggleTimeSlot(slot.id)}
//                       className={`min-h-[100px] p-3 border-b border-white/5 last:border-b-0 transition-all ${slot ? getSlotStyle(slot) : 'bg-white/5 border-white/10'}`}
//                     >
//                       {timeIdx === 0 && (
//                         <div className="text-[10px] text-slate-500 mb-2">{time}</div>
//                       )}
//                       {slot && slot.type !== 'available' && (
//                         <div className="space-y-1">
//                           <p className="text-xs font-bold">{slot.title}</p>
//                           {slot.client && (
//                             <p className="text-[10px] text-slate-400">{slot.client}</p>
//                           )}
//                           {slot.amount && (
//                             <p className="text-[10px] text-primary font-bold">${slot.amount}</p>
//                           )}
//                         </div>
//                       )}
//                       {slot && slot.type === 'available' && selectedTimeSlots.includes(slot.id) && (
//                         <div className="flex items-center gap-1 mt-1">
//                           <CheckCircleIcon className="w-3 h-3 text-primary" />
//                           <span className="text-[10px] text-primary">Selected</span>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pending Requests & Studio Health */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Pending Requests */}
//           <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold">Pending Requests</h3>
//               <Link href="/owner/requests" className="text-primary text-sm hover:underline flex items-center gap-1">
//                 VIEW ALL REQUESTS
//                 <ArrowRightIcon className="w-3 h-3" />
//               </Link>
//             </div>
//             <div className="space-y-4">
//               {pendingRequests.map((request) => (
//                 <div key={request.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
//                       <UsersIcon className="w-6 h-6 text-primary" />
//                     </div>
//                     <div>
//                       <p className="font-bold">{request.clientName}</p>
//                       <p className="text-sm text-slate-400">{request.sessionType} • {request.date}</p>
//                       <p className="text-xs text-slate-500">{request.time}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="text-right mr-4">
//                       <p className="text-primary font-bold">${request.amount}</p>
//                     </div>
//                     <button
//                       onClick={() => handleApproveRequest(request.id)}
//                       className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 rounded-lg text-sm font-medium transition-all"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleDeclineRequest(request.id)}
//                       className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg text-sm font-medium transition-all"
//                     >
//                       Decline
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Studio Health */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-xl font-bold mb-6">Studio Health</h3>
//             <div className="space-y-6">
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="text-sm text-slate-400">Occupancy Rate</p>
//                   <p className="text-2xl font-bold">{health.occupancyRate}%</p>
//                 </div>
//                 <div className="w-full bg-white/10 rounded-full h-2">
//                   <div className="bg-primary h-2 rounded-full" style={{ width: `${health.occupancyRate}%` }}></div>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="text-sm text-slate-400">Net Revenue (Oct)</p>
//                   <p className="text-2xl font-bold text-primary">${health.netRevenue.toLocaleString()}</p>
//                 </div>
//               </div>
//               <div className="pt-4 border-t border-white/10">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-slate-500">Total Bookings</p>
//                     <p className="text-lg font-bold">{health.totalBookings}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500">Avg. Rating</p>
//                     <p className="text-lg font-bold">{health.averageRating} ★</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="mt-12 pt-6 border-t border-white/5 text-center">
//           <p className="text-xs text-slate-500">© 2024 ManyRooms Digital Atelier. All rights reserved.</p>
//         </footer>
//       </div>
//     </>
//   );
// }