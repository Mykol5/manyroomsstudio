'use client';

import { useState } from 'react';
import Link from 'next/link';

// Material Icon component for Material Icons
const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
  <span 
    className={`material-symbols-outlined ${className}`} 
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {icon}
  </span>
);

interface Studio {
  id: string;
  name: string;
  location: string;
  image: string;
  bookings: number;
  hours: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  match?: string;
  badge?: string;
}

export default function ClientAnalytics() {
  const [searchTerm, setSearchTerm] = useState('');

  // Category distribution data
  const categories = [
    { name: 'Photo', percentage: 52, color: 'bg-white', height: '85%' },
    { name: 'Video', percentage: 31, color: 'bg-zinc-600', height: '60%' },
    { name: 'Podcast', percentage: 17, color: 'bg-zinc-800', height: '25%' },
  ];

  // Top studios data
  const topStudios: Studio[] = [
    {
      id: '1',
      name: 'Studio V — Minimalist Loft',
      location: 'London, Shoreditch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRC8JWUrAkLRCyG-hE6MRscKIP1N7CyafGu7SfXoG0QlqoDs6Tj9l5bj3-KeV-OPCHaJIPDCh48Zy4JV6ZxySvG_Ki926a2MxvNGV1irDO_fqOfQqcoiVS1CWLqcfQVxfQzZwl4WNhaQX6fpVPrBgrmU99sVhFDYZutn_ZsaT6E8tdUpIdAQ0ZH902cYJxhXTkTrXeGlXykeKDAeQLDmpSUdXwi1vE5JlH_YDxvyWVVpQxcHphNT3x3--IlyvW2hzFKElrbMyqXfQ2',
      bookings: 12,
      hours: 48,
    },
    {
      id: '2',
      name: 'The Vox Chamber',
      location: 'Berlin, Mitte',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC54deSVZ6i7UXGW8CGowmHoklG3PInS6bgL5muIe7BP6i1pALW9bq52d1Le-JMeaIC1AISNe1Bs6WhYbq0aSc0C_UdF4hgRujiZp7gCaYR8coxkHlT3c_CuMeLInp7yYjwGA_RB1mZdbr3Bc3fzBge5eDlb1T2p7KmSfQPoCfqnOnw8Au9BfOeRcUhIElWRW80AzKrsUyLfWhcaF0yZBeI862MFg9Mjxj9i5M9uK8iB0e1v_UgkLmovabnV0WbzeSag9-XqRg-6T6L',
      bookings: 8,
      hours: 16,
    },
    {
      id: '3',
      name: 'Motion Alpha',
      location: 'New York, Brooklyn',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVeothMZqbrEFqho_n9wQzrCIkczki1aHeQBU3KFyfgEQVMQ7Xx-0XObrhqfAsp_kuiYU52cEtXVAUZ0QG0wR3Rt5_djRx_GKgKSf4BQYatN7vwCeaQU6UBdmSxcQUUqa8O-aG5pQVje8p4WV0nxSdtLjXgofBuBz1jAmLaEkZfhZFWguUJCzC6-aFa9OG6gySHkPBvpPVGXDaqrQ8dUackXz46uIeOhV9bYcZm_oo_86w5OwKnV5O4fhnN4Wh3GrK5T--ffghw-xp',
      bookings: 5,
      hours: 40,
    },
  ];

  // AI Recommendations
  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Studio Prime — LX',
      description: 'Available next Tuesday. Optimized lighting rigs exactly matching your Studio V preferences but with 20% more square footage.',
      match: '98% Match',
    },
    {
      id: '2',
      title: 'The Daylight Annex',
      description: 'A new north-facing daylight studio just 2 blocks from your most frequented location in Mitte.',
      badge: 'New Arrival',
    },
  ];

  const handleExportReport = () => {
    alert('Export report feature coming soon!');
  };

  const handleForecast = () => {
    alert('Q3 Forecast feature coming soon!');
  };

  const handleExploreSuggestions = () => {
    alert('Explore suggestions feature coming soon!');
  };

  return (
    <div className="ml-64 pt-24 px-12 pb-24 editorial-gradient min-h-screen">
      {/* Header Section */}
      <section className="mb-16 flex justify-between items-end">
        <div className="max-w-2xl">
          <h2 className="font-headline text-5xl font-black tracking-tighter mb-4">Analytics &amp; Insights</h2>
          <p className="text-zinc-400 font-body text-lg leading-relaxed">
            A cinematic overview of your creative studio utilization and spending performance across the global Atelier network.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleExportReport}
            className="px-6 py-2 border border-white/10 rounded-sm font-label text-[10px] tracking-widest uppercase font-semibold hover:bg-white hover:text-black transition-all"
          >
            Export Report
          </button>
          <button
            onClick={handleForecast}
            className="px-6 py-2 bg-white text-black rounded-sm font-label text-[10px] tracking-widest uppercase font-semibold hover:bg-zinc-200 transition-all"
          >
            Q3 Forecast
          </button>
        </div>
      </section>

      {/* Bento Grid Insights */}
      <div className="grid grid-cols-12 gap-8 mb-16">
        {/* Category Breakdown (Photo/Video/Podcast) */}
        <div className="col-span-8 glass-panel p-8 flex flex-col justify-between min-h-[400px]">
          <div className="flex justify-between items-start mb-12">
            <div>
              <span className="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 mb-2 block">
                Studio Utilization
              </span>
              <h3 className="font-headline text-3xl font-bold tracking-tight">Category Distribution</h3>
            </div>
            <div className="flex gap-6">
              {categories.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cat.color === 'bg-white' ? 'bg-white' : cat.color === 'bg-zinc-600' ? 'bg-zinc-600' : 'bg-zinc-800'}`}></div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Abstract Visual Chart */}
          <div className="flex items-end gap-4 h-full">
            {categories.map((cat, idx) => (
              <div key={idx} className={`flex-1 ${cat.color} rounded-sm relative group`} style={{ height: cat.height }}>
                <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold whitespace-nowrap">
                  {cat.percentage}% {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Trends (Metric Card) */}
        <div className="col-span-4 flex flex-col gap-8">
          <div className="glass-panel p-8 flex-1">
            <span className="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 mb-6 block">
              Monthly Spend
            </span>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-headline text-5xl font-black">$12,480</span>
              <span className="text-xs text-zinc-400">+12.4%</span>
            </div>
            {/* Minimal Trend Line */}
            <div className="w-full h-16 relative mt-4 overflow-hidden">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <path
                  d="M0 50 Q 50 10, 100 45 T 200 20 T 300 40 T 400 5"
                  fill="transparent"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          <div className="glass-panel p-8 flex-1">
            <span className="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 mb-6 block">
              Total Hours
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-5xl font-black">142</span>
              <span className="text-xs text-zinc-400">hrs</span>
            </div>
            <p className="text-zinc-500 text-xs mt-4">
              Average 4.2 hrs per session across 34 bookings this month.
            </p>
          </div>
        </div>

        {/* Top Studios List */}
        <div className="col-span-7 glass-panel p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-headline text-2xl font-bold tracking-tight">Top Booking Destinations</h3>
            <MaterialIcon icon="more_horiz" className="text-zinc-500 cursor-pointer" />
          </div>
          <div className="space-y-8">
            {topStudios.map((studio) => (
              <div key={studio.id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-6">
                  <img
                    className="w-16 h-16 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500"
                    src={studio.image}
                    alt={studio.name}
                  />
                  <div>
                    <p className="font-headline font-bold text-sm">{studio.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{studio.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline font-bold text-sm">{studio.bookings} Bookings</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{studio.hours} Total Hours</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Driven Insights */}
        <div className="col-span-5 bg-white text-black p-8 rounded-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <MaterialIcon icon="auto_awesome" className="text-black" fill />
            <span className="font-label text-[10px] tracking-[0.2em] uppercase font-bold">Atelier AI Recommendations</span>
          </div>
          <h4 className="font-headline text-3xl font-black leading-tight mb-6">
            Based on your trend for High-Key Photography, we suggest:
          </h4>
          <div className="mb-auto space-y-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 bg-zinc-100 rounded-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-xs uppercase tracking-tighter">{rec.title}</span>
                  {rec.match && (
                    <span className="bg-black text-white text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {rec.match}
                    </span>
                  )}
                  {rec.badge && (
                    <span className="bg-black text-white text-[8px] px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {rec.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleExploreSuggestions}
            className="w-full mt-8 py-4 border border-black font-headline font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
          >
            Explore Suggestions
          </button>
        </div>
      </div>

      {/* Secondary Section: Performance Narrative */}
      <section className="grid grid-cols-12 gap-12 items-center border-t border-white/5 pt-16">
        <div className="col-span-5">
          <span className="font-label text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 mb-6 block">
            Efficiency Rating
          </span>
          <h3 className="font-headline text-4xl font-bold tracking-tight mb-6">
            Your Studio ROI is trending 15% higher than the industry average.
          </h3>
          <p className="text-zinc-400 font-body leading-relaxed">
            Your utilization of off-peak hours in Paris and London has significantly reduced your average hourly cost by $24.80 compared to last quarter.
          </p>
        </div>
        <div className="col-span-7 grid grid-cols-2 gap-8">
          <div className="p-8 border border-white/5 rounded-sm">
            <MaterialIcon icon="timer" className="text-zinc-500 mb-4 block" />
            <h5 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Avg Session Length</h5>
            <p className="text-2xl font-bold">5.4 Hours</p>
          </div>
          <div className="p-8 border border-white/5 rounded-sm">
            <MaterialIcon icon="pin_drop" className="text-zinc-500 mb-4 block" />
            <h5 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Cities Active</h5>
            <p className="text-2xl font-bold">6 Global Cities</p>
          </div>
          <div className="p-8 border border-white/5 rounded-sm">
            <MaterialIcon icon="groups" className="text-zinc-500 mb-4 block" />
            <h5 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Crew Members</h5>
            <p className="text-2xl font-bold">12 Registered</p>
          </div>
          <div className="p-8 border border-white/5 rounded-sm">
            <MaterialIcon icon="verified" className="text-zinc-500 mb-4 block" />
            <h5 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Member Status</h5>
            <p className="text-2xl font-bold">Diamond Tier</p>
          </div>
        </div>
      </section>
    </div>
  );
}