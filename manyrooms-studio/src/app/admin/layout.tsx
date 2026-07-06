// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
  <span 
    className={`material-symbols-outlined ${className}`} 
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {icon}
  </span>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    { href: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { href: '/admin/moderation', icon: 'gavel', label: 'Moderation' },
    { href: '/admin/studios', icon: 'apartment', label: 'Studio Listings' },
    { href: '/admin/users', icon: 'group', label: 'Users' },
    { href: '/admin/messages', icon: 'forum', label: 'Chat Queue' },
    { href: '/admin/financials', icon: 'payments', label: 'Financials' },
    { href: '/admin/settings', icon: 'settings', label: 'Settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
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
          <p className="text-[#446900] font-bold">Loading Admin Panel...</p>
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
            <span className="hidden md:inline-block px-3 py-1 bg-[#beff5f]/20 text-[#446900] text-xs font-bold rounded-full">
              Admin Control Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-[#edeeef] rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-[#737a65] text-xl">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-40 outline-none text-[#191c1d] placeholder:text-[#737a65]" 
                placeholder="Global search..." 
                type="text" 
              />
            </div>
            <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors relative">
              <span className="material-symbols-outlined text-[#191c1d]">notifications</span>
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
              )}
            </button>
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
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
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
          <div className="px-4 mb-8">
            <h1 className="text-2xl font-extrabold text-[#446900] leading-none">Admin Panel</h1>
            <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mt-1">Creative Control</p>
          </div>

          <nav className="flex-grow space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
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
              </Link>
            ))}
          </nav>

          <div className="mt-auto px-4 mb-8">
            <button className="w-full py-4 bg-[#beff5f] text-[#111f00] rounded-xl font-extrabold text-sm uppercase tracking-widest hover:scale-105 transition-transform duration-200 shadow-lg">
              Generate Report
            </button>
          </div>

          <div className="pt-6 border-t border-[#c2c9b1]/30 space-y-1">
            <Link
              href="/support"
              className="flex items-center gap-3 px-4 py-2 text-[#424937] hover:text-[#446900] transition-all text-sm"
            >
              <span className="material-symbols-outlined text-xl">help</span>
              <span>Help Center</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-[#ba1a1a] hover:text-[#ba1a1a]/80 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:pl-0">
          {children}
        </main>
      </div>
    </div>
  );
}




// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import {
//   HomeIcon,
//   CurrencyDollarIcon,
//   UserGroupIcon,
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

// // Material Icon component for icons not in Heroicons
// const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
//   <span 
//     className={`material-symbols-outlined ${className}`} 
//     style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
//   >
//     {icon}
//   </span>
// );

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, loading } = useAuth();
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
//     { href: '/admin', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
//     { href: '/admin/moderation', icon: <MaterialIcon icon="pending_actions" />, label: 'Moderation Queue' },
//     { href: '/admin/studios', icon: <MaterialIcon icon="meeting_room" />, label: 'Studio Listings' },
//     { href: '/admin/users', icon: <UserGroupIcon className="w-5 h-5" />, label: 'User Management' },
//     { href: '/admin/financials', icon: <CurrencyDollarIcon className="w-5 h-5" />, label: 'Financials' },
//     { href: '/admin/settings', icon: <Cog6ToothIcon className="w-5 h-5" />, label: 'System Settings' },
//   ];

//   const isActive = (href: string) => pathname === href;

//   const getInitials = (name: string) => {
//     if (!name) return 'AR';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
//     <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
//       <div className="flex">
//         {/* Sidebar - Collapsible */}
//         <aside
//           className={`fixed lg:relative z-50 transition-all duration-300 ease-in-out ${
//             isCollapsed ? 'w-20' : 'w-72'
//           } border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 ${
//             isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//           }`}
//         >
//           <div className={`p-6 ${isCollapsed ? 'px-4' : 'px-6'}`}>
//             <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
//               {!isCollapsed && (
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 relative">
//                     <Image
//                       src="/manyroomlogo.png"
//                       alt="ManyRooms"
//                       width={32}
//                       height={32}
//                       className="rounded-lg"
//                     />
//                   </div>
//                   <div>
//                     <h1 className="font-bold text-lg tracking-tight">ManyRooms</h1>
//                     <p className="text-[10px] text-primary font-bold tracking-widest">ADMIN PANEL</p>
//                   </div>
//                 </div>
//               )}
//               {isCollapsed && (
//                 <div className="w-8 h-8 relative mx-auto">
//                   <Image
//                     src="/manyroomlogo.png"
//                     alt="ManyRooms"
//                     width={32}
//                     height={32}
//                     className="rounded-lg"
//                   />
//                 </div>
//               )}
//               <button
//                 onClick={() => setIsCollapsed(!isCollapsed)}
//                 className="hidden lg:flex p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
//               >
//                 {isCollapsed ? (
//                   <ChevronRightIcon className="w-4 h-4" />
//                 ) : (
//                   <ChevronLeftIcon className="w-4 h-4" />
//                 )}
//               </button>
//             </div>

//             <nav className="space-y-1">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
//                     isActive(item.href)
//                       ? 'bg-primary/10 text-primary'
//                       : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
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
//                 href="/admin/studio/add"
//                 className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center gap-2'} w-full bg-primary hover:bg-primary/90 transition-all text-white font-bold py-3 rounded-lg text-sm`}
//                 title={isCollapsed ? 'Add Studio' : ''}
//               >
//                 <PlusCircleIcon className="w-5 h-5" />
//                 {!isCollapsed && <span>ADD STUDIO</span>}
//               </Link>
//             </div>

//             <div className={`mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 ${isCollapsed ? 'text-center' : ''}`}>
//               <Link
//                 href="/admin/support"
//                 className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors`}
//                 title={isCollapsed ? 'Support' : ''}
//               >
//                 <ChatBubbleLeftIcon className="w-5 h-5 flex-shrink-0" />
//                 {!isCollapsed && <span className="text-sm font-medium">Support</span>}
//               </Link>
//               <button
//                 onClick={async () => {
//                   // Add logout logic here
//                   router.push('/login');
//                 }}
//                 className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors w-full`}
//                 title={isCollapsed ? 'Sign Out' : ''}
//               >
//                 <MaterialIcon icon="logout" className="text-xl" />
//                 {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
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
//           <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
//             <div className="flex items-center gap-4 flex-1">
//               <div className="relative max-w-md w-full md:w-auto">
//                 <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
//                   placeholder="Search analytics, studios, or users..."
//                 />
//               </div>
//             </div>
//             <div className="flex items-center gap-4 md:gap-6">
//               <div className="flex gap-2">
//                 <button className="size-9 md:size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary relative transition-all">
//                   <BellIcon className="w-4 h-4 md:w-5 md:h-5" />
//                   {notifications > 0 && (
//                     <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
//                   )}
//                 </button>
//                 <button className="size-9 md:size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-all">
//                   <ChatBubbleLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
//                 </button>
//               </div>
//               <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
//               <div className="flex items-center gap-2 md:gap-3">
//                 <div className="text-right hidden sm:block">
//                   <p className="text-[10px] md:text-xs text-slate-500">{greeting}</p>
//                   <p className="text-xs md:text-sm font-medium truncate max-w-[100px] md:max-w-none text-slate-900 dark:text-white">
//                     {user?.user_metadata?.name || 'Alex Rivera'}
//                   </p>
//                 </div>
//                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm md:text-lg">
//                   {user?.user_metadata?.name ? getInitials(user.user_metadata.name) : 'AR'}
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