'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  UsersIcon,
  DocumentArrowDownIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

// Types
interface BookingSlot {
  id: string;
  time: string;
  date: string;
  title?: string;
  client?: string;
  type: 'booking' | 'maintenance' | 'available';
  status: 'confirmed' | 'pending' | 'blocked';
  amount?: number;
}

interface BookingRequest {
  id: string;
  clientName: string;
  sessionType: string;
  date: string;
  time: string;
  amount: number;
  status: 'pending' | 'approved' | 'declined';
}

interface StudioHealth {
  occupancyRate: number;
  netRevenue: number;
  totalBookings: number;
  averageRating: number;
}

export default function OwnerBookings() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Studio Health Data
  const [health] = useState<StudioHealth>({
    occupancyRate: 84,
    netRevenue: 12450,
    totalBookings: 156,
    averageRating: 4.9,
  });

  // Booking slots for the week
  const [bookingSlots] = useState<BookingSlot[]>([
    { id: '1', time: '09:00 AM', date: '2024-10-21', type: 'booking', status: 'confirmed', title: 'Product Launch', client: 'H&M Creative', amount: 1200 },
    { id: '2', time: '01:30 PM', date: '2024-10-21', type: 'booking', status: 'confirmed', title: 'Portrait Session', client: 'Sarah Jenkins', amount: 450 },
    { id: '3', time: '05:00 PM', date: '2024-10-21', type: 'available', status: 'confirmed' },
    { id: '4', time: '01:00 PM', date: '2024-10-22', type: 'maintenance', status: 'blocked', title: 'MAINTENANCE' },
    { id: '5', time: '09:00 AM', date: '2024-10-22', type: 'available', status: 'confirmed' },
    { id: '6', time: '03:00 PM', date: '2024-10-22', type: 'booking', status: 'pending', title: 'Video Campaign', client: 'Studio Alpha', amount: 800 },
    { id: '7', time: '09:00 AM', date: '2024-10-23', type: 'booking', status: 'confirmed', title: 'Fashion Editorial', client: 'Vogue', amount: 2500 },
    { id: '8', time: '02:00 PM', date: '2024-10-23', type: 'available', status: 'confirmed' },
    { id: '9', time: '05:00 PM', date: '2024-10-23', type: 'booking', status: 'confirmed', title: 'Music Video', client: 'Lunar Records', amount: 1800 },
    { id: '10', time: '10:00 AM', date: '2024-10-24', type: 'available', status: 'confirmed' },
    { id: '11', time: '01:00 PM', date: '2024-10-24', type: 'booking', status: 'pending', title: 'Product Photography', client: 'Nike', amount: 1500 },
    { id: '12', time: '04:00 PM', date: '2024-10-24', type: 'available', status: 'confirmed' },
    { id: '13', time: '09:00 AM', date: '2024-10-25', type: 'booking', status: 'confirmed', title: 'Interview Setup', client: 'Netflix', amount: 2000 },
    { id: '14', time: '01:00 PM', date: '2024-10-25', type: 'booking', status: 'confirmed', title: 'Podcast Recording', client: 'Creative Minds', amount: 600 },
    { id: '15', time: '05:00 PM', date: '2024-10-25', type: 'available', status: 'confirmed' },
    { id: '16', time: '11:00 AM', date: '2024-10-26', type: 'booking', status: 'confirmed', title: 'Wedding Shoot', client: 'Johnson Wedding', amount: 3000 },
    { id: '17', time: '03:00 PM', date: '2024-10-26', type: 'available', status: 'confirmed' },
    { id: '18', time: '12:00 PM', date: '2024-10-27', type: 'available', status: 'confirmed' },
    { id: '19', time: '04:00 PM', date: '2024-10-27', type: 'booking', status: 'confirmed', title: 'Portfolio Shoot', client: 'Emma Watson', amount: 750 },
  ]);

  // Pending Booking Requests
  const [pendingRequests, setPendingRequests] = useState<BookingRequest[]>([
    {
      id: '1',
      clientName: 'Sarah Jenkins',
      sessionType: 'Portrait Session',
      date: 'Oct 28',
      time: '2:00 PM - 5:00 PM',
      amount: 450,
      status: 'pending',
    },
    {
      id: '2',
      clientName: 'Marco Valenti',
      sessionType: 'Video Campaign',
      date: 'Oct 29',
      time: '10:00 AM - 4:00 PM',
      amount: 1200,
      status: 'pending',
    },
    {
      id: '3',
      clientName: 'Studio Alpha Corp',
      sessionType: 'Workshop',
      date: 'Nov 02',
      time: '9:00 AM - 6:00 PM',
      amount: 800,
      status: 'pending',
    },
  ]);

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
  
  // Get current week dates
  const getWeekDates = () => {
    const dates = [];
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekRange = `${weekDates[0].getDate()} – ${weekDates[6].getDate()}, ${weekDates[0].toLocaleString('default', { month: 'long' })} ${weekDates[0].getFullYear()}`;

  const handleApproveRequest = (id: string) => {
    setPendingRequests(prev => prev.filter(req => req.id !== id));
    setToastMessage('Booking request approved successfully!');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleDeclineRequest = (id: string) => {
    setPendingRequests(prev => prev.filter(req => req.id !== id));
    setToastMessage('Booking request declined.');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleMarkUnavailable = () => {
    if (selectedTimeSlots.length > 0) {
      setToastMessage(`${selectedTimeSlots.length} time slot(s) marked as unavailable`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      setSelectedTimeSlots([]);
    }
  };

  const handleExportSchedule = () => {
    setToastMessage('Schedule exported successfully!');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const toggleTimeSlot = (slotId: string) => {
    setSelectedTimeSlots(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const getSlotStyle = (slot: BookingSlot) => {
    if (slot.type === 'maintenance') {
      return 'bg-red-500/20 border-red-500/30 cursor-not-allowed';
    }
    if (slot.type === 'booking') {
      if (slot.status === 'confirmed') {
        return 'bg-primary/20 border-primary/30 cursor-pointer';
      }
      if (slot.status === 'pending') {
        return 'bg-amber-500/20 border-amber-500/30 cursor-pointer';
      }
    }
    return 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer';
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

      {/* Page Content */}
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight">Dashboard</h2>
          <p className="text-slate-400 text-sm mt-1">
            Availability & Calendar — Manage your studio slots, approvals, and maintenance windows.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'weekly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
              >
                WEEKLY
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'monthly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
              >
                MONTHLY
              </button>
            </div>
            <button
              onClick={handleExportSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              EXPORT SCHEDULE
            </button>
            <button
              onClick={handleMarkUnavailable}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg text-sm font-medium transition-all"
            >
              <XMarkIcon className="w-4 h-4" />
              MARK UNAVAILABLE
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() - 7);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-white/5 rounded-lg transition-all"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold">{weekRange}</h3>
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(selectedDate.getDate() + 7);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-white/5 rounded-lg transition-all"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 border-b border-white/10">
            {weekDays.map((day, idx) => (
              <div key={idx} className="p-4 text-center border-r border-white/10 last:border-r-0">
                <p className="text-xs text-slate-400 font-medium mb-1">{day}</p>
                <p className="text-xl font-bold">{weekDates[idx].getDate()}</p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-7">
            {weekDays.map((_, dayIdx) => (
              <div key={dayIdx} className="border-r border-white/10 last:border-r-0">
                {timeSlots.map((time, timeIdx) => {
                  const dateStr = weekDates[dayIdx].toISOString().split('T')[0];
                  const slot = bookingSlots.find(s => s.time === time && s.date === dateStr);
                  return (
                    <div
                      key={`${dayIdx}-${timeIdx}`}
                      onClick={() => slot && slot.type !== 'maintenance' && toggleTimeSlot(slot.id)}
                      className={`min-h-[100px] p-3 border-b border-white/5 last:border-b-0 transition-all ${slot ? getSlotStyle(slot) : 'bg-white/5 border-white/10'}`}
                    >
                      {timeIdx === 0 && (
                        <div className="text-[10px] text-slate-500 mb-2">{time}</div>
                      )}
                      {slot && slot.type !== 'available' && (
                        <div className="space-y-1">
                          <p className="text-xs font-bold">{slot.title}</p>
                          {slot.client && (
                            <p className="text-[10px] text-slate-400">{slot.client}</p>
                          )}
                          {slot.amount && (
                            <p className="text-[10px] text-primary font-bold">${slot.amount}</p>
                          )}
                        </div>
                      )}
                      {slot && slot.type === 'available' && selectedTimeSlots.includes(slot.id) && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircleIcon className="w-3 h-3 text-primary" />
                          <span className="text-[10px] text-primary">Selected</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests & Studio Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Requests */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Pending Requests</h3>
              <Link href="/owner/requests" className="text-primary text-sm hover:underline flex items-center gap-1">
                VIEW ALL REQUESTS
                <ArrowRightIcon className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{request.clientName}</p>
                      <p className="text-sm text-slate-400">{request.sessionType} • {request.date}</p>
                      <p className="text-xs text-slate-500">{request.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                      <p className="text-primary font-bold">${request.amount}</p>
                    </div>
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 rounded-lg text-sm font-medium transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg text-sm font-medium transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Studio Health */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">Studio Health</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-400">Occupancy Rate</p>
                  <p className="text-2xl font-bold">{health.occupancyRate}%</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${health.occupancyRate}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-400">Net Revenue (Oct)</p>
                  <p className="text-2xl font-bold text-primary">${health.netRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Total Bookings</p>
                    <p className="text-lg font-bold">{health.totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Avg. Rating</p>
                    <p className="text-lg font-bold">{health.averageRating} ★</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-slate-500">© 2024 ManyRooms Digital Atelier. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}