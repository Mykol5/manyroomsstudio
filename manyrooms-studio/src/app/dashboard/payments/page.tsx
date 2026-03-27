'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Material Icon component for icons not in Heroicons
const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
  <span 
    className={`material-symbols-outlined ${className}`} 
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {icon}
  </span>
);

interface Invoice {
  id: string;
  date: string;
  studioName: string;
  studioIcon: string;
  invoiceId: string;
  amount: number;
  status: 'paid' | 'pending';
}

export default function ClientPayments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Stats data
  const stats = {
    totalInvestment: 42850,
    totalGrowth: 12,
    upcomingAmount: 3200,
    upcomingDue: 'Oct 24, 2023',
    activeRetainers: 4,
  };

  // Invoices data
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      date: 'Oct 12, 2023',
      studioName: 'Lumière Daylight Studio',
      studioIcon: 'architecture',
      invoiceId: 'INV-882910',
      amount: 1250.00,
      status: 'paid',
    },
    {
      id: '2',
      date: 'Oct 05, 2023',
      studioName: 'Vogue Content Hub',
      studioIcon: 'camera',
      invoiceId: 'INV-882745',
      amount: 2800.00,
      status: 'pending',
    },
    {
      id: '3',
      date: 'Sep 28, 2023',
      studioName: 'The Craft Factory',
      studioIcon: 'brush',
      invoiceId: 'INV-881290',
      amount: 450.00,
      status: 'paid',
    },
    {
      id: '4',
      date: 'Sep 15, 2023',
      studioName: 'Echo Sound Labs',
      studioIcon: 'podcasts',
      invoiceId: 'INV-881002',
      amount: 920.00,
      status: 'paid',
    },
  ]);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.studioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`Downloading invoice ${invoiceId}`);
  };

  const handleUpgradeAccount = () => {
    alert('Upgrade account feature coming soon!');
  };

  const handleTalkToFinance = () => {
    alert('Talk to finance feature coming soon!');
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black">
      <div className="lg:ml-64 pt-24 px-8 pb-16 min-h-screen">
        {/* Hero Header */}
        <header className="mb-20">
          <div className="max-w-4xl">
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6">
              Payments &amp; <br />Invoices.
            </h1>
            <div className="editorial-line mb-8 opacity-20"></div>
            <p className="font-body text-on-surface-variant max-w-xl text-lg leading-relaxed">
              Manage your creative investments and track studio expenditures. Your digital paper trail, curated for clarity.
            </p>
          </div>
        </header>

        {/* Summary Grid (Bento Style) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Total Spent */}
          <div className="bg-surface-container-low p-8 rounded-sm group hover:bg-zinc-900 transition-colors duration-300">
            <span className="font-label uppercase tracking-widest text-[10px] font-semibold text-zinc-500 mb-6 block">
              Total Investment
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-headline font-bold text-white">
                ${stats.totalInvestment.toLocaleString()}
              </span>
              <span className="text-sm font-label text-zinc-400">USD</span>
            </div>
            <div className="mt-8 flex items-center gap-2 text-zinc-500">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              <span className="text-[11px] font-label uppercase tracking-widest">
                +{stats.totalGrowth}% from last quarter
              </span>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-surface-container-low p-8 rounded-sm group hover:bg-zinc-900 transition-colors duration-300">
            <span className="font-label uppercase tracking-widest text-[10px] font-semibold text-zinc-500 mb-6 block">
              Upcoming Next 30D
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-headline font-bold text-white">
                ${stats.upcomingAmount.toLocaleString()}
              </span>
              <span className="text-sm font-label text-zinc-400">USD</span>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
              <span className="text-[11px] font-label uppercase tracking-widest text-zinc-400">
                Next due: {stats.upcomingDue}
              </span>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-surface-container-low p-8 rounded-sm group hover:bg-zinc-900 transition-colors duration-300">
            <span className="font-label uppercase tracking-widest text-[10px] font-semibold text-zinc-500 mb-6 block">
              Active Retainers
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-headline font-bold text-white">
                {stats.activeRetainers.toString().padStart(2, '0')}
              </span>
              <span className="text-sm font-label text-zinc-400">Studios</span>
            </div>
            <div className="mt-8 flex items-center gap-2 text-zinc-500">
              <MaterialIcon icon="verified" className="text-sm" />
              <span className="text-[11px] font-label uppercase tracking-widest">
                All contracts verified
              </span>
            </div>
          </div>
        </section>

        {/* Detailed List Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-headline text-2xl font-bold text-white">Invoice History</h2>
            <p className="text-zinc-500 text-sm mt-1">Export your data for accounting purposes.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoices..."
                className="bg-transparent border-b border-zinc-800 focus:border-white focus:ring-0 text-sm pl-10 pr-4 py-2 text-white w-64 transition-all outline-none"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="p-2 border border-white/10 hover:bg-zinc-900 transition-colors rounded-sm"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-6 font-manrope uppercase tracking-widest text-[10px] font-semibold text-zinc-500 px-4">Date</th>
                <th className="pb-6 font-manrope uppercase tracking-widest text-[10px] font-semibold text-zinc-500 px-4">Studio Name</th>
                <th className="pb-6 font-manrope uppercase tracking-widest text-[10px] font-semibold text-zinc-500 px-4">Invoice ID</th>
                <th className="pb-6 font-manrope uppercase tracking-widest text-[10px] font-semibold text-zinc-500 px-4">Amount</th>
                <th className="pb-6 font-manrope uppercase tracking-widest text-[10px] font-semibold text-zinc-500 px-4 text-center">Status</th>
                <th className="pb-6 font-manrope uppercase tracking-widest text-[10px] font-semibold text-zinc-500 px-4 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="group hover:bg-zinc-900/40 transition-colors">
                  <td className="py-8 px-4 font-body text-sm text-zinc-300">{invoice.date}</td>
                  <td className="py-8 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-zinc-800 flex items-center justify-center">
                        <MaterialIcon icon={invoice.studioIcon} className="text-xs text-white" />
                      </div>
                      <span className="font-headline font-bold text-white text-sm">{invoice.studioName}</span>
                    </div>
                  </td>
                  <td className="py-8 px-4 font-body text-xs text-zinc-500">{invoice.invoiceId}</td>
                  <td className="py-8 px-4 font-headline font-bold text-white">${invoice.amount.toLocaleString()}</td>
                  <td className="py-8 px-4 text-center">
                    {invoice.status === 'paid' ? (
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-label uppercase tracking-widest text-white border border-white/10">
                        Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-white text-black rounded-full text-[10px] font-label uppercase tracking-widest font-bold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-8 px-4 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="group/btn inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
                    >
                      <span className="font-manrope uppercase tracking-widest text-[10px] font-bold">Download</span>
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="text-center py-16">
            <MaterialIcon icon="receipt_long" className="text-6xl text-zinc-600 mb-4" />
            <p className="text-zinc-500">No invoices found</p>
          </div>
        )}

        {/* Pagination / Load More */}
        <div className="mt-12 flex justify-center">
          <button className="group flex items-center gap-4 text-zinc-500 hover:text-white transition-colors py-4">
            <div className="editorial-line w-12 opacity-20 group-hover:w-20 group-hover:opacity-100 transition-all"></div>
            <span className="font-manrope uppercase tracking-widest text-[10px] font-bold">View full archive</span>
            <div className="editorial-line w-12 opacity-20 group-hover:w-20 group-hover:opacity-100 transition-all"></div>
          </button>
        </div>

        {/* Transactional Card Section */}
        <section className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square md:aspect-video rounded-sm overflow-hidden bg-zinc-900">
            <img
              className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHNTOeM8Sm1UVQW-laQ1kFxFXtNNymXArBlXIIOAQsIndjjhy0ihR2-KcB6rwmBHq_UD0DqsUu4c9qDqizJaEgSbXIV0cHbQaUicHyhuOix5OyIA7791J4bVD8GDNANCuQq8M2hBHJhNHCKVmTrVDACADTDFuM5ob-MGINqsbi4rtIOUzdPamwYhbvhV01KJxqkSM5u4Moy6nYtw9Du96IyduScezE5yNTIb8fjunxHvqRynw3aZdrjlfcJJcoGkhJ2wc4LIytlwnT"
              alt="The Black Room Collective"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <span className="font-label uppercase tracking-widest text-[10px] font-semibold text-zinc-400 block mb-2">
                Exclusive Partner
              </span>
              <h3 className="font-headline text-2xl font-bold text-white">The Black Room Collective</h3>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="font-headline text-3xl font-bold text-white leading-tight">
              Need custom billing solutions?
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              We offer enterprise-level account management for agencies booking more than 20 sessions per month. 
              Consolidate your invoices and get net-30 terms.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={handleUpgradeAccount}
                className="bg-white text-black px-8 py-4 rounded-sm font-manrope uppercase tracking-widest text-[10px] font-bold hover:bg-zinc-200 transition-all"
              >
                Upgrade Account
              </button>
              <button
                onClick={handleTalkToFinance}
                className="border border-white/20 text-white px-8 py-4 rounded-sm font-manrope uppercase tracking-widest text-[10px] font-bold hover:bg-white hover:text-black transition-all"
              >
                Talk to Finance
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}