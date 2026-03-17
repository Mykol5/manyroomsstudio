'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  CameraIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

// Types
interface Booking {
  id: string;
  studio_name: string;
  studio_image: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  booking_id: string;
  studio_location: string;
}

interface Recommendation {
  id: string;
  name: string;
  description: string;
  image: string;
  price_per_hour: number;
  match_percentage: number;
  category: string;
}

interface UserStats {
  hours_booked: number;
  active_projects: number;
  credits: number;
}

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState<UserStats>({
    hours_booked: 124.5,
    active_projects: 8,
    credits: 1250,
  });
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      studio_name: 'Studio A — North Wing',
      studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ0OBOavY0FKXf_EMsibr6U6SbCoFfxj_lJt4X10gLu6kRMZpYBpuluXxmeR1uRUxsqG8n4Qmz7xdDCTfhXb6i05Jcvdyo1068Fwm3ds7yqHwiBsx1vd2oAKmQF0_KBOJ-vzK5nBUb9XjFzUqQfmXBP5aEh1DUrX-5nKtru-wvUGTm4BCm7ivreDJs4HhbNTfTj-BZ_DpIh8FRMUkAUPGJ11kqTL1FCCLdqAqxklAAhZ-vJJ7Gl193YYbntjkXljUhttJeMIFDLmZS',
      date: 'Oct 24, 2023',
      start_time: '10:00 AM',
      end_time: '6:00 PM',
      status: 'confirmed',
      booking_id: 'MR-9920',
      studio_location: 'North Wing, Manhattan',
    },
    {
      id: '2',
      studio_name: 'The Warehouse Loft',
      studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAqqBObVeKGPWNBkarSwoSjOb_8jdm-kxV2JLgldG4Qvm17tLb3-GXqx1MmicQQZ6jSRodspMr45BPWGRKVZb2o-laegPpjyWanYuqhyfmHud1D5n6vnxnT2G3GiEWrJ1xEwoNqQyDVPC64gOq7XN2iYqdO-CWpEXH12W6zZTx_FUW8vRf7uclr422hECfIc5WogeTghAOrs0SZuhCB-ydnavlhF92VYOAE7he8854oLbDr0c3I74oemNGFJaoCQZujPYOxF8Klkee',
      date: 'Oct 28, 2023',
      start_time: '2:00 PM',
      end_time: 'Late',
      status: 'pending',
      booking_id: 'MR-9941',
      studio_location: 'Brooklyn, NY',
    },
  ]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      name: 'Zenith Minimalist',
      description: 'Perfect for high-fashion editorial',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbF4rh2VXQDIyfmTC2ymtujkho5xuTgPcIVvmngrJzpoM-EHE0On0oB12pKI7xXU6GbehfMfkpZXMLOcyglEjNttTRMGxQ1fZrM4P69WBAn9CejpIBuSIRe5sXMybw_EYG3dzyfeN-o8Gbo6Uvz26QEqFxggxMr_N_gdFS3acCyCbp7ROuSOK28HmGKlrObHFAYGCfE-3YKlZgqkMY1XIu_VY7g2ZU_bat3aPrChq4obiR24ABlkfc9Blae_RV93-essksclx68yPY',
      price_per_hour: 180,
      match_percentage: 98,
      category: 'Editorial',
    },
    {
      id: '2',
      name: 'Obsidian Vault',
      description: 'Low-light, cinematic depth',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoHGz2mHMIVoh3Rw5xKSeOrjElzgFKRYZdtzEQWHq7GAR5_oSwJDGLWxHAA2WqrN390ODniIy27ycOgJouZTJh7Nqn9QNeye1rdyqpOa93exErHpzNlUahjwF4J1N28V0DEzm9kMJBuKo983zKzEBhE99UliIy6AaTYcfotbPmWZYJ8JFF9pgp2UcRT5Z5xuPqwvT4O5rszytc1A1PXuU7QXibZ6mcyWGc2tpI8B9gO6vqHYagEm2Mbkln0b0ABHsNSGdVEyeP2h7j',
      price_per_hour: 240,
      match_percentage: 94,
      category: 'Cinematic',
    },
    {
      id: '3',
      name: 'Solaris Attic',
      description: 'Natural light, organic textures',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmszfPzgLGhKuxLS3msiKMOpXeMHWCqwS6zfsimoW_FT41pCSnQWaL2Ncrigj3Wp1dTbYBn6AswVht5ZaWlTMwtfFyP-SFsun4rPRGAQ_0yQCw-gWoMDEZEi_BKzm5w3mU-ASlB1UnqTgjRY2etqr0PFTZcBldugHTxmg_yUtBG45t1KFBLwJX_zIV5ll9OkSF_1Vv_6vgvgyI8zIF0-D3h69tra_YubneXr1y3faPNkzNr_wVSVPRMpYG5louHfjjBYiBBBIJ_MSu',
      price_per_hour: 150,
      match_percentage: 89,
      category: 'Natural Light',
    },
    {
      id: '4',
      name: 'Neon Pulse',
      description: 'Experimental music video set',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjrsoQOG5B3__M5L-1XQiWvwIeXEZxu5JuEd_k6zayLy8hd18Z3PjD3NaV8jEmdrk9j0hylGTOfWTgRNJvK-pDlYA3SuIl4_tKbn3B1wPSyqFB2dcYOHNK-X2LQJyKUz-jbjqdl9Ul6B2NvzbsStrctUhu_-ycoOSJxY4UXYPBYvqsKy7TXVokKLmsgaSElesZhVFeZvf50XbXV3el3q7GtxdZ9kRfb69RavWeZ04B_zyFkd0wdruxqa6UcyIL2RnynZj8wKu_IrmZ',
      price_per_hour: 210,
      match_percentage: 85,
      category: 'Music',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Set greeting based on user's local time
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('GOOD MORNING');
      else if (hour < 18) setGreeting('GOOD AFTERNOON');
      else setGreeting('GOOD EVENING');

      // Format current time
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      };
      setCurrentTime(now.toLocaleTimeString('en-US', options));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Real-time subscription for bookings
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('bookings-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log('Booking update:', payload);
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (!error && data) {
      setBookings(data);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-primary/20 text-primary';
      case 'pending':
        return 'bg-amber-500/20 text-amber-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-slate-500/20 text-slate-500';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'CREATIVE';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
          <div className="text-primary font-bold">Loading Your Studio...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background-dark font-display text-slate-100 antialiased overflow-x-hidden">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-8 border-r border-white/5 bg-background-dark z-50">
        <div className="mb-12">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xl">
            M
          </div>
        </div>

        <nav className="flex flex-col gap-8 flex-1">
          <Link href="/dashboard" className="group relative flex items-center justify-center p-2 text-primary">
            <span className="material-symbols-outlined !text-3xl">dashboard</span>
            <span className="absolute left-16 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Dashboard
            </span>
          </Link>
          <Link href="/dashboard/bookings" className="group relative flex items-center justify-center p-2 text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-3xl">calendar_today</span>
            <span className="absolute left-16 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Bookings
            </span>
          </Link>
          <Link href="/dashboard/studios" className="group relative flex items-center justify-center p-2 text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-3xl">camera</span>
            <span className="absolute left-16 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Studios
            </span>
          </Link>
          <Link href="/dashboard/payments" className="group relative flex items-center justify-center p-2 text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-3xl">payments</span>
            <span className="absolute left-16 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Payments
            </span>
          </Link>
          <Link href="/dashboard/analytics" className="group relative flex items-center justify-center p-2 text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-3xl">analytics</span>
            <span className="absolute left-16 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Analytics
            </span>
          </Link>
        </nav>

        <div className="flex flex-col gap-6 mt-auto">
          <Link href="/dashboard/settings" className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-3xl">settings</span>
          </Link>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {user?.user_metadata?.name ? getInitials(user.user_metadata.name) : 'U'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-20 flex-1 flex flex-col">
        {/* Top Header with Search */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-12 py-5 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
          <div className="relative w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-dark border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-white placeholder:text-slate-600"
              placeholder="Search studios, bookings, or projects..."
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <button className="size-10 flex items-center justify-center rounded-lg bg-surface-dark border border-white/5 text-slate-400 hover:text-white relative">
                <BellIcon className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-background-dark"></span>
                )}
              </button>
              <button className="size-10 flex items-center justify-center rounded-lg bg-surface-dark border border-white/5 text-slate-400 hover:text-white">
                <ChatBubbleLeftIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="h-6 w-px bg-white/5"></div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{currentTime}</span>
              <span className="text-[10px] font-bold text-primary">SESSION ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Hero Header Section */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(10, 10, 10, 1) 10%, rgba(10, 10, 10, 0.4) 50%, rgba(10, 10, 10, 0.8) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJ8LheQbvDLa5tWz-xBoGVnWdcO5LTswcKR-F9_YFJeE4QpZTHPkS7dW8Zte0m8jZlfJDZ8eQPR4gghLxpgfcOPqu2HQl5cF1brU8FaQtCVg_lUvT8SZYm7HNjn5pn19NsnCz8Zn00fWrE5vy8huepMDxMpNaxD9rwNr8aphkdYoJgH6YbuF19PMCbgb3Q4eT75Vr1R_Q5kF5nbAq1bjmajODv9JrDSTuo1O4W3CrLAacNSt8DgGt8QgRva6D26-RH9fxKd-18GbTx')` 
            }}
          ></div>

          <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-24 max-w-7xl">
            <p className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-4">
              Creative Suite v2.4 • {currentTime}
            </p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-6">
              {greeting},<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">
                {firstName.toUpperCase()}.
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-xl font-light mb-10 leading-relaxed">
              Your creative projects are scaling. Ready to book your next session in our AI-optimized environments?
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary hover:bg-primary/90 transition-all text-white px-8 py-4 rounded-lg font-bold flex items-center gap-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                <PlusCircleIcon className="w-6 h-6" />
                CREATE NEW SESSION
              </button>
              <button className="bg-white/5 hover:bg-white/10 transition-all text-white backdrop-blur-md px-8 py-4 rounded-lg font-bold border border-white/10">
                VIEW ARCHIVES
              </button>
            </div>
          </div>

          {/* Stats overlay */}
          <div className="absolute bottom-12 right-12 lg:right-24 flex gap-12 z-20">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Hours Booked</span>
              <span className="text-3xl font-light text-white">{stats.hours_booked}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Active Projects</span>
              <span className="text-3xl font-light text-white">{stats.active_projects.toString().padStart(2, '0')}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Credits</span>
              <span className="text-3xl font-light text-primary">{stats.credits.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="px-12 lg:px-24 py-16 max-w-[1600px] w-full mx-auto">
          {/* Upcoming Bookings Section */}
          <section className="mb-24">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-white">NOW & NEXT</h2>
                <p className="text-slate-500 mt-2">Manage your upcoming studio residency sessions.</p>
              </div>
              <Link href="/dashboard/bookings" className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
                SEE ALL BOOKINGS <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {bookings.map((booking) => (
                <div key={booking.id} className="group relative overflow-hidden rounded-xl bg-surface-dark border border-white/5 flex h-72">
                  <div className="w-1/2 overflow-hidden">
                    <img 
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out" 
                      src={booking.studio_image}
                      alt={booking.studio_name}
                    />
                  </div>
                  <div className="w-1/2 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 ${getStatusStyle(booking.status)} text-[10px] font-bold rounded-full uppercase tracking-tighter`}>
                          {booking.status === 'confirmed' ? 'Confirmed' : 'Pending Approval'}
                        </span>
                        <span className="text-slate-500 text-xs">ID: {booking.booking_id}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{booking.studio_name}</h3>
                      <p className="text-slate-400 text-sm font-light">
                        {booking.date} | {booking.start_time} - {booking.end_time}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">{booking.studio_location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-white/5 hover:bg-primary transition-colors py-3 rounded text-xs font-bold text-white uppercase tracking-widest">
                        Specs
                      </button>
                      <button className="flex-1 border border-white/10 hover:border-white transition-colors py-3 rounded text-xs font-bold text-white uppercase tracking-widest">
                        {booking.status === 'confirmed' ? 'Modify' : 'Check-in'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Recommendations Section */}
          <section>
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold tracking-tight text-white">CURATED FOR YOUR STYLE</h2>
              <p className="text-slate-500 mt-2">AI-driven recommendations based on your architectural aesthetic.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <div key={rec.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-4">
                    <img 
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      src={rec.image}
                      alt={rec.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
                        {rec.match_percentage}% Match
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white">{rec.name}</h4>
                  <p className="text-slate-500 text-sm">{rec.description}</p>
                  <p className="text-primary text-sm font-bold mt-2">${rec.price_per_hour}/hr</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Global Footer */}
        <footer className="mt-auto px-12 lg:px-24 py-12 border-t border-white/5 bg-background-dark">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-white font-black text-sm tracking-tighter">
                MR
              </div>
              <p className="text-slate-500 text-sm font-light">
                © {new Date().getFullYear()} ManyRooms Studios. All rights reserved.
              </p>
            </div>
            <div className="flex gap-12">
              <Link href="/support" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                Support
              </Link>
              <Link href="/billing" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                Billing
              </Link>
              <Link href="/legal" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                Legal
              </Link>
              <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                Privacy
              </Link>
            </div>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">language</span>
              <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">dark_mode</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}