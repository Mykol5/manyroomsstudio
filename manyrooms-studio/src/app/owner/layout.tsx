// app/owner/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const sidebarItems = [
    { href: '/owner/dashboard', icon: 'home', label: 'Home' },
    { href: '/owner/explore', icon: 'document_scanner', label: 'Explore AI' },
    { href: '/owner/studios', icon: 'meeting_room', label: 'My Studios' },
    { href: '/owner/bookings', icon: 'event_available', label: 'Bookings' },
    { href: '/owner/messages', icon: 'chat_bubble', label: 'Messages' },
    { href: '/owner/earnings', icon: 'payments', label: 'Earnings' },
    { href: '/owner/settings', icon: 'settings', label: 'Settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/owner/dashboard') return pathname === '/owner/dashboard';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto"></div>
          <p className="text-[#446900] font-bold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
        <div className="flex justify-between items-center px-4 md:px-8 py-3 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/">
              <img 
                alt="ManyRooms Logo" 
                className="h-8 md:h-10 w-auto hover:scale-105 transition-transform" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9DZnYRdMuRfh66s2y0aufTN6zhyFmIsA5aK66cuCBeLINs4QoP8IyjpBAQjHuPpHixsYPB1HMPOBhT7mUKu2qy7il9h__oTnAUvQ8EU5qv270iXUsGRbz-PlJjGMU5ixs4CUyHd9GoHjR9KulnOy4sz-3QN2VkRzW39ONL6ynO2nSLAUh3VRvj_U51r7i6CxOGm9pnjSOVDUTZd2P3m_LTCAchKE5VwHb0k6YYjDoduMHQU4iyejUYtTsGr0VhJR4tasKZ-e6qrWQ"
              />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm">Marketplace</Link>
              <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm">Studios</Link>
              <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm">Vibes</Link>
              <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm">Journal</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/owner/messages" className="relative p-2 hover:bg-[#edeeef] rounded-full hidden md:block">
              <span className="material-symbols-outlined text-[#191c1d]">chat_bubble</span>
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
              )}
            </Link>
            <span className="material-symbols-outlined text-[#191c1d] cursor-pointer p-2 hover:bg-[#edeeef] rounded-full hidden md:block">notifications</span>
            <Link 
              href="/owner/list-new"
              className="hidden md:block bg-[#beff5f] text-[#111f00] px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
            >
              List Studio
            </Link>
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-[#edeeef] rounded-full"
            >
              <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          h-screen fixed left-0 top-0 z-40
          flex flex-col bg-white border-r border-[#c2c9b1]/20 shadow-xl
          pt-20 pb-8 px-4
          w-72
          transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:sticky lg:top-0
        `}>
          {/* Profile Section */}
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#e7e8e9] border-2 border-[#beff5f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#446900] text-2xl">person</span>
            </div>
            <div>
              <p className="font-bold text-[#191c1d] text-sm leading-none">Studio Admin</p>
              <p className="text-[#424937] text-xs">
                {user?.user_metadata?.role === 'franchisee' ? 'Franchisee' : 'Creative Director'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1 mb-8">
            <div className="px-4 py-2">
              <h3 className="text-xs font-bold text-[#737a65] uppercase tracking-widest">Dashboard</h3>
            </div>
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl font-bold transition-all ${
                  isActive(item.href)
                    ? 'bg-[#beff5f] text-[#4c7500]'
                    : 'text-[#424937] hover:bg-[#e7e8e9]'
                }`}
              >
                <span 
                  className="material-symbols-outlined"
                  style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.label === 'Messages' && (
                  <span className="ml-auto bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                )}
              </Link>
            ))}
          </div>

          {/* Upgrade Card */}
          <div className="mt-auto p-4 bg-[#e4d7fd] rounded-2xl flex flex-col gap-3">
            <p className="font-bold text-[#665c7c]">Upgrade to Pro</p>
            <p className="text-xs text-[#665c7c]/80">Get unlimited access to premium vibes and priority booking.</p>
            <Link
              href="/dashboard/upgrade"
              className="w-full py-2 bg-[#665c7c] text-white rounded-lg font-bold text-xs text-center hover:opacity-90 transition-opacity"
            >
              Unlock Now
            </Link>
          </div>

          {/* Bottom Links */}
          <div className="mt-6 flex flex-col gap-1 border-t border-[#c2c9b1]/30 pt-6">
            <Link
              href="/support"
              className="flex items-center gap-3 py-2 px-4 text-[#424937] hover:text-[#446900] transition-all"
            >
              <span className="material-symbols-outlined text-lg">help</span>
              <span className="text-sm">Help Center</span>
            </Link>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="flex items-center gap-3 py-2 px-4 text-[#ba1a1a] hover:text-[#ba1a1a]/80 transition-all"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-[#c2c9b1]/30 flex justify-around py-3 z-50">
        {sidebarItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${isActive(item.href) ? 'text-[#446900]' : 'text-[#424937]'}`}
          >
            <span 
              className="material-symbols-outlined text-xl"
              style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}




// // app/owner/layout.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import {
//   HomeIcon,
//   CalendarIcon,
//   CurrencyDollarIcon,
//   StarIcon,
//   Cog6ToothIcon,
//   PlusCircleIcon,
//   ChatBubbleLeftIcon,
//   BellIcon,
//   Bars3Icon,
//   XMarkIcon,
//   DocumentTextIcon,
//   BookmarkIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// export default function OwnerLayout({ children }: { children: React.ReactNode }) {
//   const { user, loading, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [notifications] = useState(3);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   const sidebarItems = [
//     { href: '/owner/dashboard', icon: 'home', label: 'Home' },
//     { href: '/owner/explore', icon: 'document_scanner', label: 'Explore AI' },
//     { href: '/owner/studios', icon: 'meeting_room', label: 'My Studios' },
//     { href: '/owner/bookings', icon: 'event_available', label: 'Bookings' },
//     { href: '/owner/messages', icon: 'chat_bubble', label: 'Messages' },
//     { href: '/owner/earnings', icon: 'payments', label: 'Earnings' },
//     { href: '/owner/settings', icon: 'settings', label: 'Settings' },
//   ];

//   const isActive = (href: string) => {
//     if (href === '/owner/dashboard') return pathname === '/owner/dashboard';
//     return pathname.startsWith(href);
//   };

//   const handleLogout = async () => {
//     await logout();
//     router.push('/');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="animate-pulse space-y-4 text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto"></div>
//           <p className="text-[#446900] font-bold">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       {/* Top Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
//         <div className="flex justify-between items-center px-4 md:px-8 py-3 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-8 md:h-10 w-auto hover:scale-105 transition-transform" 
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWrW8-SXrjmvwcmNW1EjFMw7Yp2jILWII_EEeBDieWgrATXmkmZWADKFuMfQvS4DIU_fk206d4I88zDVlaVwa1fWcC3K65mkXPTXcdCp9VcsEfzcDygfwUNF-oon1CZpX35XONCPWBdnTS8d1plwvA3OM0HYcw1z8-QxyUgjDuCUu_lNS4aL0gGIQJCQ1l6i8xr_PbZhUwRIG6b5uLoffNsj2Eri5O5YxmpjFVW4qF1gkk0k-XIABCsDZOkytkOom2apNaFhfK89Un"
//               />
//             </Link>
//             <div className="hidden md:flex items-center gap-6">
//               <Link href="/" className="text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm">Marketplace</Link>
//               <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm">Studios</Link>
//               <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm">Vibes</Link>
//               <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm">Journal</Link>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <Link href="/owner/messages" className="relative p-2 hover:bg-[#edeeef] rounded-full hidden md:block">
//               <span className="material-symbols-outlined text-[#191c1d]">chat_bubble</span>
//               {notifications > 0 && (
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
//               )}
//             </Link>
//             <span className="material-symbols-outlined text-[#191c1d] cursor-pointer p-2 hover:bg-[#edeeef] rounded-full hidden md:block">notifications</span>
//             <Link 
//               href="/owner/list-new"
//               className="hidden md:block bg-[#beff5f] text-[#111f00] px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
//             >
//               List Studio
//             </Link>
//             <button 
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="lg:hidden p-2 hover:bg-[#edeeef] rounded-full"
//             >
//               <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
//       )}

//       <div className="flex pt-16">
//         {/* Sidebar */}
//         <aside className={`
//           h-screen fixed left-0 top-0 z-40
//           flex flex-col bg-white border-r border-[#c2c9b1]/20 shadow-xl
//           pt-20 pb-8 px-4
//           w-72
//           transition-transform duration-300
//           ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//           lg:sticky lg:top-0
//         `}>
//           {/* Profile Section */}
//           <div className="flex items-center gap-3 px-4 mb-8">
//             <div className="w-12 h-12 rounded-full overflow-hidden bg-[#e7e8e9] border-2 border-[#beff5f] flex items-center justify-center">
//               <span className="material-symbols-outlined text-[#446900] text-2xl">person</span>
//             </div>
//             <div>
//               <p className="font-bold text-[#191c1d] text-sm leading-none">Studio Admin</p>
//               <p className="text-[#424937] text-xs">
//                 {user?.user_metadata?.role === 'franchisee' ? 'Franchisee' : 'Creative Director'}
//               </p>
//             </div>
//           </div>

//           <nav className="flex-grow space-y-1">
//             {sidebarItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
//                   isActive(item.href)
//                     ? 'bg-[#beff5f] text-[#4c7500]'
//                     : 'text-[#424937] hover:bg-[#e7e8e9]'
//                 }`}
//               >
//                 <span 
//                   className="material-symbols-outlined"
//                   style={isActive(item.href) ? { fontVariationSettings: "'FILL' 1" } : {}}
//                 >
//                   {item.icon}
//                 </span>
//                 <span>{item.label}</span>
//                 {item.label === 'Messages' && (
//                   <span className="ml-auto bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
//                 )}
//               </Link>
//             ))}
//           </nav>

//           {/* Upgrade Card */}
//           <div className="mt-auto px-4 mb-8">
//             <button className="w-full py-4 bg-[#beff5f] text-[#111f00] rounded-xl font-extrabold text-sm uppercase tracking-widest hover:scale-105 transition-transform duration-200 shadow-lg">
//               Upgrade to Pro
//             </button>
//           </div>

//           {/* Bottom Links */}
//           <div className="pt-6 border-t border-[#c2c9b1]/30 space-y-1">
//             <Link
//               href="/support"
//               className="flex items-center gap-3 px-4 py-2 text-[#424937] hover:text-[#446900] transition-all text-sm"
//             >
//               <span className="material-symbols-outlined text-xl">help</span>
//               <span>Help Center</span>
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-3 px-4 py-2 text-[#ba1a1a] hover:text-[#ba1a1a]/80 transition-all text-sm"
//             >
//               <span className="material-symbols-outlined text-xl">logout</span>
//               <span>Logout</span>
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 lg:pl-0">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import {
//   HomeIcon,
//   CalendarIcon,
//   CurrencyDollarIcon,
//   StarIcon,
//   Cog6ToothIcon,
//   PlusCircleIcon,
//   ChatBubbleLeftIcon,
//   BellIcon,
//   MagnifyingGlassIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   Bars3Icon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline';

// // Icon component for Material Icons
// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// export default function OwnerLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, loading, logout } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [greeting, setGreeting] = useState('');
//   const [notifications] = useState(3);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   useEffect(() => {
//     const hour = new Date().getHours();
//     if (hour < 12) setGreeting('Good Morning');
//     else if (hour < 18) setGreeting('Good Afternoon');
//     else setGreeting('Good Evening');
//   }, []);

//   const navItems = [
//     { href: '/owner/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Studio Overview' },
//     { href: '/owner/studios', icon: <MaterialIcon icon="meeting_room" />, label: 'My Studios' },
//     { href: '/owner/bookings', icon: <CalendarIcon className="w-5 h-5" />, label: 'Bookings' },
//     { href: '/owner/earnings', icon: <CurrencyDollarIcon className="w-5 h-5" />, label: 'Earnings' },
//     { href: '/owner/reviews', icon: <StarIcon className="w-5 h-5" />, label: 'Reviews' },
//     { href: '/owner/settings', icon: <Cog6ToothIcon className="w-5 h-5" />, label: 'Settings' },
//   ];

//   const isActive = (href: string) => pathname === href;

//   const handleLogout = async () => {
//     await logout();
//     router.push('/login');
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
//     <div className="min-h-screen bg-background-dark text-white">
//       <div className="flex">
//         {/* Sidebar - Collapsible */}
//         <aside
//           className={`fixed lg:relative z-50 transition-all duration-300 ease-in-out ${
//             isCollapsed ? 'w-20' : 'w-72'
//           } border-r border-white/5 bg-background-dark/95 backdrop-blur-sm h-screen sticky top-0 ${
//             isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//           }`}
//         >
//           <div className={`p-6 ${isCollapsed ? 'px-4' : 'px-6'}`}>
//             <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
//               {!isCollapsed && (
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
//                     <MaterialIcon icon="meeting_room" className="text-white text-xl" />
//                   </div>
//                   <div>
//                     <h1 className="text-xl font-black tracking-tight">ManyRooms</h1>
//                     <p className="text-[10px] text-primary font-bold tracking-widest">STUDIO OWNER</p>
//                   </div>
//                 </div>
//               )}
//               {isCollapsed && (
//                 <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mx-auto">
//                   <MaterialIcon icon="meeting_room" className="text-white text-xl" />
//                 </div>
//               )}
//               <button
//                 onClick={() => setIsCollapsed(!isCollapsed)}
//                 className="hidden lg:flex p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
//               >
//                 {isCollapsed ? (
//                   <ChevronRightIcon className="w-4 h-4" />
//                 ) : (
//                   <ChevronLeftIcon className="w-4 h-4" />
//                 )}
//               </button>
//             </div>

//             <nav className="space-y-2">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
//                     isActive(item.href)
//                       ? 'bg-primary/10 text-primary'
//                       : 'text-slate-400 hover:bg-white/5 hover:text-white'
//                   } ${isCollapsed ? 'justify-center' : ''}`}
//                   title={isCollapsed ? item.label : ''}
//                 >
//                   <span className="flex-shrink-0">{item.icon}</span>
//                   {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
//                 </Link>
//               ))}
//             </nav>

//             <div className="mt-auto pt-8">
//               <Link
//                 href="/owner/list-new"
//                 className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center gap-2'} w-full bg-primary hover:bg-primary/90 transition-all text-white font-bold py-3 rounded-lg text-sm`}
//                 title={isCollapsed ? 'List New Room' : ''}
//               >
//                 <PlusCircleIcon className="w-5 h-5" />
//                 {!isCollapsed && <span>LIST NEW ROOM</span>}
//               </Link>
//             </div>

//             <div className={`mt-8 pt-8 border-t border-white/5 ${isCollapsed ? 'text-center' : ''}`}>
//               <Link
//                 href="/support"
//                 className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-slate-400 hover:text-white transition-colors`}
//                 title={isCollapsed ? 'Support' : ''}
//               >
//                 <ChatBubbleLeftIcon className="w-5 h-5 flex-shrink-0" />
//                 {!isCollapsed && <span className="text-sm">Support</span>}
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-slate-400 hover:text-white transition-colors w-full`}
//                 title={isCollapsed ? 'Sign Out' : ''}
//               >
//                 <MaterialIcon icon="logout" className="text-xl" />
//                 {!isCollapsed && <span className="text-sm">Sign Out</span>}
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Mobile Menu Overlay */}
//         {isMobileMenuOpen && (
//           <div
//             className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
//         )}

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="fixed bottom-4 left-4 z-50 lg:hidden p-3 bg-primary rounded-full shadow-lg"
//         >
//           {isMobileMenuOpen ? (
//             <XMarkIcon className="w-5 h-5 text-white" />
//           ) : (
//             <Bars3Icon className="w-5 h-5 text-white" />
//           )}
//         </button>

//         {/* Main Content */}
//         <main className="flex-1 overflow-y-auto w-full">
//           {/* Header - Consistent */}
//           <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-5 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
//             <div className="flex items-center gap-4 flex-1">
//               <div className="relative max-w-md w-full md:w-auto">
//                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-white placeholder:text-slate-600"
//                   placeholder="Search studios, bookings, or clients..."
//                 />
//               </div>
//             </div>
//             <div className="flex items-center gap-4 md:gap-6">
//               <div className="flex gap-2">
//                 <button className="size-9 md:size-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white relative transition-all">
//                   <BellIcon className="w-4 h-4 md:w-5 md:h-5" />
//                   {notifications > 0 && (
//                     <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-background-dark"></span>
//                   )}
//                 </button>
//                 <button className="size-9 md:size-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
//                   <ChatBubbleLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
//                 </button>
//               </div>
//               <div className="h-6 w-px bg-white/10 hidden md:block"></div>
//               <div className="flex items-center gap-2 md:gap-3">
//                 <div className="text-right hidden sm:block">
//                   <p className="text-[10px] md:text-xs text-slate-400">{greeting}</p>
//                   <p className="text-xs md:text-sm font-medium truncate max-w-[100px] md:max-w-none">
//                     {user?.user_metadata?.name || 'Studio Owner'}
//                   </p>
//                 </div>
//                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm md:text-lg">
//                   {user?.user_metadata?.name?.charAt(0) || 'A'}
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* Page Content */}
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }