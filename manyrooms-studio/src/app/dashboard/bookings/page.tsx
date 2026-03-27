'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ChartBarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MegaphoneIcon,
  EnvelopeIcon,
  ShareIcon,
  DocumentIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

// Material Icon component for icons not in Heroicons
const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface Booking {
  id: string;
  date: string;
  duration: string;
  studio: string;
  service: string;
  status: 'confirmed' | 'completed' | 'pending';
  amount: number;
  time?: string;
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  dueDate?: string;
  paidDate?: string;
  status: 'pending' | 'paid';
}

export default function ClientBookings() {
  const [filterOpen, setFilterOpen] = useState(false);

  // Stats data
  const stats = {
    activeBookings: 4,
    bookingsChange: 1,
    totalInvested: 12400,
    investedChange: 12,
    pendingInvoices: 1,
    pendingDue: '2d',
  };

  // Upcoming session
  const upcomingSession = {
    id: '#MRS-9281',
    studio: 'Studio A - Neon Suite',
    description: 'Full-day production with lighting technician and 8K monitor calibration suite included.',
    date: 'Oct 24',
    time: '10:00 AM — 06:00 PM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdltYvw_my_CR9YLlegZYOfeKMPIF5OFj6DkKP_-SEAkx8cT0INUsjVoQ1ZPSFN7uLJ-Su_paWLmM03KEfMnqoGNGvKKuNoMvxEgEcU8dfwRtTtR_1gk2lnXH23rTRRuMvmLdSp_4t_54jmqDBoMV6bRlZzZJEfuXijcE2qm06OPImogptwNnKTB4nl4HL6BORyRwRhkLV150IM1kEc6d1G3o9WbxA03s9yIsbgl-MKYGJrls1gNsJIz3GAlxHJb_sMV12rkZOFev6',
    status: 'confirmed',
  };

  // Past sessions
  const [pastSessions] = useState<Booking[]>([
    {
      id: '1',
      date: 'Oct 12, 2023',
      duration: '4 Hours',
      studio: 'Podcast Booth B',
      service: 'Audio Only + Engineer',
      status: 'completed',
      amount: 450,
    },
    {
      id: '2',
      date: 'Sep 28, 2023',
      duration: '8 Hours',
      studio: 'The Glass Room',
      service: 'Video Campaign Shoot',
      status: 'completed',
      amount: 2200,
    },
    {
      id: '3',
      date: 'Sep 15, 2023',
      duration: '2 Hours',
      studio: 'Mixing Suite 2',
      service: 'Mastering Session',
      status: 'completed',
      amount: 300,
    },
  ]);

  // Invoices
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-4921-OCT',
      amount: 1850,
      dueDate: 'October 26, 2023',
      status: 'pending',
    },
    {
      id: '2',
      number: 'INV-4882-SEP',
      amount: 2200,
      paidDate: 'Sep 30',
      status: 'paid',
    },
    {
      id: '3',
      number: 'INV-4751-SEP',
      amount: 450,
      paidDate: 'Sep 16',
      status: 'paid',
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'border-primary/40 text-primary bg-primary/5';
      case 'completed':
        return 'border-slate-700 text-slate-400 bg-slate-800/30';
      case 'pending':
        return 'border-primary/40 text-primary bg-primary/5';
      case 'paid':
        return 'border-slate-700 text-slate-400 bg-slate-800/30';
      default:
        return 'border-slate-700 text-slate-400 bg-slate-800/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'paid': return 'Paid';
      default: return status;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-primary font-bold tracking-[0.2em] text-xs uppercase">Welcome back</p>
            <h2 className="text-4xl md:text-6xl font-extralight tracking-tight text-white italic">
              Your Creative <span className="font-black not-italic">Workspace.</span>
            </h2>
          </div>
          <div className="flex gap-4">
            <button className="bg-surface-dark hover:bg-border-dark text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded transition-all border border-border-dark">
              Studio Map
            </button>
            <button className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded shadow-lg shadow-primary/20 transition-all">
              New Booking
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-dark border border-border-dark p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MaterialIcon icon="event_available" className="text-6xl" />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Active Bookings</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-5xl font-extralight text-white">{stats.activeBookings.toString().padStart(2, '0')}</h3>
            <span className="text-emerald-500 text-sm font-bold flex items-center">
              <ArrowUpIcon className="w-4 h-4" /> {stats.bookingsChange}
            </span>
          </div>
        </div>

        <div className="bg-surface-dark border border-border-dark p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MaterialIcon icon="account_balance_wallet" className="text-6xl" />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Total Invested</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-5xl font-extralight text-white">${(stats.totalInvested / 1000).toFixed(1)}k</h3>
            <span className="text-emerald-500 text-sm font-bold flex items-center">
              <ChartBarIcon className="w-4 h-4" /> {stats.investedChange}%
            </span>
          </div>
        </div>

        <div className="bg-surface-dark border border-border-dark p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MaterialIcon icon="receipt_long" className="text-6xl" />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Pending Invoices</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-5xl font-extralight text-white">{stats.pendingInvoices.toString().padStart(2, '0')}</h3>
            <span className="text-primary text-sm font-bold">Due in {stats.pendingDue}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* Upcoming Highlight */}
          <div>
            <h4 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Next Session
            </h4>
            <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden flex flex-col md:flex-row group cursor-pointer">
              <div className="md:w-2/5 relative overflow-hidden">
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={upcomingSession.image}
                  alt={upcomingSession.studio}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/40 to-transparent"></div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusBadge(upcomingSession.status)}`}>
                      {getStatusText(upcomingSession.status)}
                    </span>
                    <span className="text-slate-500 text-xs font-medium italic">ID: {upcomingSession.id}</span>
                  </div>
                  <h5 className="text-2xl font-bold text-white mb-2">{upcomingSession.studio}</h5>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{upcomingSession.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border-dark">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{upcomingSession.date.split(' ')[0]}</p>
                      <p className="text-lg font-bold text-white">{upcomingSession.date.split(' ')[1]}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-border-dark"></div>
                    <p className="text-sm font-medium text-slate-300">{upcomingSession.time}</p>
                  </div>
                  <button className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                    Manage <MaterialIcon icon="arrow_forward" className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Past Sessions Table */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-white text-lg font-bold uppercase tracking-tighter">Past Sessions</h4>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                Filter By Date <FunnelIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-dark">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Studio / Service</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                  {pastSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="px-6 py-6">
                        <p className="text-white font-medium text-sm">{session.date}</p>
                        <p className="text-[10px] text-slate-500">{session.duration}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-white font-bold text-sm">{session.studio}</p>
                        <p className="text-[10px] text-slate-500">{session.service}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusBadge(session.status)}`}>
                          {getStatusText(session.status)}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <p className="text-white font-bold text-sm">${session.amount.toLocaleString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 bg-background-dark/30 flex justify-center">
                <button className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
                  View All History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content Area */}
        <div className="space-y-12">
          {/* Invoices List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-white text-lg font-bold uppercase tracking-tighter">Invoices</h4>
              <CreditCardIcon className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-4">
              {/* Pending Invoice Card */}
              {invoices.filter(inv => inv.status === 'pending').map((invoice) => (
                <div key={invoice.id} className="bg-surface-dark border border-primary/30 p-5 rounded-xl group relative">
                  <div className="absolute -left-[1px] top-4 bottom-4 w-1 bg-primary rounded-r"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Upcoming Payment</p>
                      <h6 className="text-white font-bold">{invoice.number}</h6>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusBadge(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-light text-white">${invoice.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500 italic mt-1 font-medium">Due: {invoice.dueDate}</p>
                    </div>
                    <button className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded hover:bg-primary/80 transition-all">
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}

              {/* Paid Invoices */}
              {invoices.filter(inv => inv.status === 'paid').map((invoice) => (
                <div key={invoice.id} className="bg-surface-dark border border-border-dark p-5 rounded-xl flex items-center justify-between group hover:border-slate-600 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-background-dark flex items-center justify-center text-slate-500">
                      <DocumentTextIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h6 className="text-sm font-bold text-white leading-none mb-1">{invoice.number}</h6>
                      <p className="text-[10px] text-slate-500">Paid {invoice.paidDate} • ${invoice.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button className="w-full py-4 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest border border-dashed border-border-dark rounded-xl transition-colors">
                Download Billing Archive (ZIP)
              </button>
            </div>
          </div>

          {/* Support/Action Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <MegaphoneIcon className="w-8 h-8" />
            </div>
            <h6 className="text-white text-lg font-bold">Concierge Support</h6>
            <p className="text-slate-400 text-sm">
              Need a custom equipment list or special technician for your next session?
            </p>
            <button className="w-full bg-white text-background-dark font-bold text-xs uppercase tracking-widest py-3 rounded hover:bg-slate-200 transition-colors">
              Message Account Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}