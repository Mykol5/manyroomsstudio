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
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Icon component for Material Icons
const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { href: '/owner/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Studio Overview' },
    { href: '/owner/studios', icon: <MaterialIcon icon="meeting_room" />, label: 'My Studios' },
    { href: '/owner/bookings', icon: <CalendarIcon className="w-5 h-5" />, label: 'Bookings' },
    { href: '/owner/earnings', icon: <CurrencyDollarIcon className="w-5 h-5" />, label: 'Earnings' },
    { href: '/owner/reviews', icon: <StarIcon className="w-5 h-5" />, label: 'Reviews' },
    { href: '/owner/settings', icon: <Cog6ToothIcon className="w-5 h-5" />, label: 'Settings' },
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
        {/* Sidebar - Collapsible */}
        <aside
          className={`fixed lg:relative z-50 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-20' : 'w-72'
          } border-r border-white/5 bg-background-dark/95 backdrop-blur-sm h-screen sticky top-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className={`p-6 ${isCollapsed ? 'px-4' : 'px-6'}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <MaterialIcon icon="meeting_room" className="text-white text-xl" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black tracking-tight">ManyRooms</h1>
                    <p className="text-[10px] text-primary font-bold tracking-widest">STUDIO OWNER</p>
                  </div>
                </div>
              )}
              {isCollapsed && (
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto">
                  <MaterialIcon icon="meeting_room" className="text-white text-xl" />
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="w-4 h-4" />
                ) : (
                  <ChevronLeftIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-8">
              <Link
                href="/owner/list-new"
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center gap-2'} w-full bg-primary hover:bg-primary/90 transition-all text-white font-bold py-3 rounded-lg text-sm`}
                title={isCollapsed ? 'List New Room' : ''}
              >
                <PlusCircleIcon className="w-5 h-5" />
                {!isCollapsed && <span>LIST NEW ROOM</span>}
              </Link>
            </div>

            <div className={`mt-8 pt-8 border-t border-white/5 ${isCollapsed ? 'text-center' : ''}`}>
              <Link
                href="/support"
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-slate-400 hover:text-white transition-colors`}
                title={isCollapsed ? 'Support' : ''}
              >
                <ChatBubbleLeftIcon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">Support</span>}
              </Link>
              <button
                onClick={handleLogout}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-slate-400 hover:text-white transition-colors w-full`}
                title={isCollapsed ? 'Sign Out' : ''}
              >
                <MaterialIcon icon="logout" className="text-xl" />
                {!isCollapsed && <span className="text-sm">Sign Out</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed bottom-4 left-4 z-50 lg:hidden p-3 bg-primary rounded-full shadow-lg"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-5 h-5 text-white" />
          ) : (
            <Bars3Icon className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full">
          {/* Header - Consistent */}
          <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-5 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md w-full md:w-auto">
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
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex gap-2">
                <button className="size-9 md:size-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white relative transition-all">
                  <BellIcon className="w-4 h-4 md:w-5 md:h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-background-dark"></span>
                  )}
                </button>
                <button className="size-9 md:size-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
                  <ChatBubbleLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              <div className="h-6 w-px bg-white/10 hidden md:block"></div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] md:text-xs text-slate-400">{greeting}</p>
                  <p className="text-xs md:text-sm font-medium truncate max-w-[100px] md:max-w-none">
                    {user?.user_metadata?.name || 'Studio Owner'}
                  </p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm md:text-lg">
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