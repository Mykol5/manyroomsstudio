'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [greeting, setGreeting] = useState('');
  const [notifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const navItems = [
    { href: '/owner/dashboard', icon: HomeIcon, label: 'Studio Overview' },
    { href: '/owner/studios', icon: () => <span className="material-symbols-outlined">meeting_room</span>, label: 'My Studios' },
    { href: '/owner/bookings', icon: CalendarIcon, label: 'Bookings' },
    { href: '/owner/earnings', icon: CurrencyDollarIcon, label: 'Earnings' },
    { href: '/owner/reviews', icon: StarIcon, label: 'Reviews' },
    { href: '/owner/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
          <div className="text-primary font-bold">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark text-white">
      <div className="flex">
        {/* Sidebar - Consistent */}
        <aside className="w-72 border-r border-white/5 bg-background-dark/50 backdrop-blur-sm h-screen sticky top-0">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white">meeting_room</span>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">ManyRooms</h1>
                <p className="text-[10px] text-primary font-bold tracking-widest">STUDIO OWNER</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {typeof IconComponent === 'function' && IconComponent !== HomeIcon && IconComponent !== CalendarIcon ? (
                      <IconComponent />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-8">
              <Link
                href="/owner/list-new"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 transition-all text-white font-bold py-3 rounded-lg text-sm"
              >
                <PlusCircleIcon className="w-5 h-5" />
                LIST NEW ROOM
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <Link href="/support" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
                <ChatBubbleLeftIcon className="w-5 h-5" />
                <span className="text-sm">Support</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Header - Consistent */}
          <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-white placeholder:text-slate-600"
                  placeholder="Search studios, bookings, or clients..."
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                <button className="size-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white relative transition-all">
                  <BellIcon className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-background-dark"></span>
                  )}
                </button>
                <button className="size-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-xs text-slate-400">{greeting}</p>
                  <p className="text-sm font-medium">{user?.user_metadata?.name || 'Studio Owner'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {user?.user_metadata?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
}