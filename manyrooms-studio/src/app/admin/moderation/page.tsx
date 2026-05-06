// 'use client';

// import { useState } from 'react';
// import {
//   MagnifyingGlassIcon,
//   BellIcon,
//   Cog6ToothIcon,
//   FunnelIcon,
//   BoltIcon,
//   CheckCircleIcon,
//   XMarkIcon,
//   ChatBubbleLeftIcon,
//   PencilIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   XCircleIcon,
// } from '@heroicons/react/24/outline';

// // Material Icon component
// const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
//   <span 
//     className={`material-symbols-outlined ${className}`} 
//     style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
//   >
//     {icon}
//   </span>
// );

// interface Application {
//   id: string;
//   studioName: string;
//   studioId: string;
//   category: string;
//   categoryIcon: string;
//   location: string;
//   submissionDate: string;
//   timeAgo: string;
//   images: string[];
//   description: string;
//   hourlyRate: number;
//   capacity: number;
//   equipment: string[];
//   ownerName: string;
//   ownerStudios: number;
// }

// export default function AdminModeration() {
//   const [selectedApp, setSelectedApp] = useState<Application | null>(null);
//   const [activeTab, setActiveTab] = useState('pending');

//   const applications: Application[] = [
//     {
//       id: '1',
//       studioName: 'Sunset Sound',
//       studioId: 'app_892347',
//       category: 'Recording',
//       categoryIcon: 'mic',
//       location: 'Los Angeles, CA',
//       submissionDate: 'Oct 24, 2023',
//       timeAgo: '2 hours ago',
//       images: [
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuBAKI0GcZT2d2wkOa6sLzp--5mIQwZ360RHLGM5NkbHd9L121Wn0GyuIUP6PnURFqaFwdwXvzgy_xOCh77bz3RvIPRIyR04Y2f22AYTHqLvvxwywfMBPYB1zXVI6Ist_ATEZA1-JrkLYyWF_eTYOmjzo02ejG3MiYF78VIOXxqlt8lqJY2r5PonZaAPli2zr0HIb_X9P50qowM4UjEBPoEzg-v-35w1Q5jGoPtWCZsNYnoerUCz4vMjv4sjBNGB50dgfvbcDoIGw_Fb',
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuC6zWUI_LeFsTgaxEwjEwZbmA0WimRc2PdY-KBZp61YXf60ksXCyJiJ3oflABlWb11xNn_77tnm-mYfc1REe-WHE1E-1EiYS0LI47zw_0P7M7iLC1afMIu9rrQ7N3V1uttkq2BIT13VJJwVUg6KAVpWS6yZfblySgbzqULy8DXDURc7nuy99Tlyya7Uy5gfVdrx04uVWGVNCj6LLJYR9i0u3qwVsCMPTX2Auolww2EEiIoAfRX_XCGMYS9ddsV3DsszOPWhrq6oMtJ_',
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuDzHJZWrfwBzCbzM07InGKrT79eIVa0JwLBo6uApsN63cW9EWi_jHgm3cd-JfErmTyEgdT4jMQMzMd15q32OLioWt5FQjb5FZomeqx3cDkW_FN1r_oZ-T5T-fIvXwG3lY-m9xktBZ_kN95NAtuoKImYD6fLKUACE25EX0IDFj4gujx-WBYeodFhNmf-Eu75bZhds-_BkJxk9uNWE8AYYJe2ul6P_MlYDxLcuPZARLB07NN7RsLXI13YKTs6y8Gyz9MFL4V3tDnNL14_',
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuBv5XAXdAZ1MR_r-Q1Pu_NpSV9cCam6RFhB79ZXhyxfU0zzTk7C5RR2UX-rJskyn0J6Uxr6p3Bux69uP1W6cOkG1UPP8-Hjawd8riCrqbEEE5ypcwiz6ygObo-59Lss-LDuUWhJ8_rkIQJqOPfdbHySxIr6c84FpZMy0IpVvShvNpUP9cyeYIM_7tZKpFeowo89RCLhsKRxkn5OlgB_4pa1ZEvo-j2-9I5hT4M_ip_HKRKkj4UwoHwFWtzao7ttMrZi9wVwV0RJ_46x',
//       ],
//       description: 'Legacy recording studio located in the heart of Hollywood. Features a vintage Neve console and a spacious live room with excellent acoustics. Perfect for bands and large ensembles.',
//       hourlyRate: 120,
//       capacity: 12,
//       equipment: ['Neve 8068', 'U87 Mics (4x)', 'Steinway B'],
//       ownerName: 'Marcus Sterling',
//       ownerStudios: 3,
//     },
//     {
//       id: '2',
//       studioName: 'The Blue Room',
//       studioId: 'app_892348',
//       category: 'Photography',
//       categoryIcon: 'photo_camera',
//       location: 'Brooklyn, NY',
//       submissionDate: 'Oct 24, 2023',
//       timeAgo: '5 hours ago',
//       images: [
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuDiLSJxx-JHP0NCl05p6LmS1CPKZi4X1XnyVc-ovuxK7BA8wXhljkrgqX1hLWHNbVTOZ10qWFadBw18fQ6em3y2CVzYQt6Dn6_f3c-U6RXYjR1Pb93X0aV9d9cXbdTX8m16i0PYAgD8eIyblJnEyasYjoi0-U8BSopx5UW2nWZTL92okKUZY34wybwUhx4qPiJZ0Sj9PT88U4imqY7T-mTWALO008NiF7T-fOIpNq7Ycy2UEGrfcrbURwMlhaqwCmfxBlYXrmUnhSmL',
//       ],
//       description: 'Minimalist photography studio with natural light and white cyclorama wall. Ideal for fashion and portrait photography.',
//       hourlyRate: 95,
//       capacity: 8,
//       equipment: ['Profoto Lights', 'Backdrop System', 'C-Stands'],
//       ownerName: 'Elena Rossi',
//       ownerStudios: 1,
//     },
//     {
//       id: '3',
//       studioName: 'Echo Studios',
//       studioId: 'app_892349',
//       category: 'Rehearsal',
//       categoryIcon: 'music_note',
//       location: 'London, UK',
//       submissionDate: 'Oct 23, 2023',
//       timeAgo: '1 day ago',
//       images: [
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuCY60-gsr7AqZzikT5ZViN86WXAKU3D6NNf917UwHt711pr5I2Vi_Eu_CHoZgjq2qNXTVJz2a5FQzEPLkHXU055Q5YnEPapwYwMnnXNCsg94Fwr2QuQCDyYNV8RuMPYSwWvTwVp2xY5oTbUt5kYy7abiKpcBPrmK77P5rD9zaxnHuybR3FGW_9yE0UdPQ8ZPu8YOHC_fev7mA3awsK1bRC99q2AFHhjuO3bGPGbJxE6nCVoyjk032qQxR6e21XLo24L2KkiDioFbZ8M',
//       ],
//       description: 'Fully equipped rehearsal space with backline, PA system, and climate control. Perfect for bands and solo artists.',
//       hourlyRate: 45,
//       capacity: 10,
//       equipment: ['Ampeg Bass Rig', 'Pearl Drums', 'Marshall Amps'],
//       ownerName: 'James Chen',
//       ownerStudios: 2,
//     },
//     {
//       id: '4',
//       studioName: 'Neon Lights Video',
//       studioId: 'app_892350',
//       category: 'Video',
//       categoryIcon: 'videocam',
//       location: 'Toronto, CAN',
//       submissionDate: 'Oct 22, 2023',
//       timeAgo: '2 days ago',
//       images: [
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuCUygV54k5_jnQ2PKtCOl1U3ySZ4KVytZ-yWVjUvBCjl07usMddrq4qlOTo9ZY9HLCymFmlXfV3Z3e_zxP6SXXMwFr2aDcLssC925Jc7JK2ZGmij5EADi36QAHY8-R8X54qn52K5BkfEpFXuAGwQshZ4DKNadLpKPSI1aESsRW980meDNKP03IXbh9_VXyZlu4-VI2MSYFhetfdXgUiQgNoo08yLoZESJ6tznK2QUnSyKGMsU3bm6so0K6pWIUQyNVBIc5_SsNdUMYL',
//       ],
//       description: 'Professional video production studio with green screen, studio lighting, and 4K monitoring capabilities.',
//       hourlyRate: 150,
//       capacity: 15,
//       equipment: ['Arri Lights', 'Green Screen', '4K Monitors'],
//       ownerName: 'Sofia Martinez',
//       ownerStudios: 1,
//     },
//   ];

//   const getCategoryStyle = (category: string) => {
//     switch (category) {
//       case 'Recording':
//         return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
//       case 'Photography':
//         return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
//       case 'Rehearsal':
//         return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
//       case 'Video':
//         return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
//       default:
//         return 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400';
//     }
//   };

//   const tabs = [
//     { id: 'pending', label: 'Pending Applications', count: applications.length },
//     { id: 'review', label: 'Under Review', count: 0 },
//     { id: 'approved', label: 'Recently Approved', count: 0 },
//     { id: 'rejected', label: 'Rejected', count: 0 },
//   ];

//   return (
//     <div className="p-8 pb-4">
//       {/* Page Header */}
//       <div className="flex justify-between items-end mb-6">
//         <div>
//           <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-1">
//             <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
//             Live Queue
//           </div>
//           <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Studio Moderation Queue</h2>
//           <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Review and manage pending applications for the ManyRooms platform.</p>
//         </div>
//         <div className="flex gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">
//             <FunnelIcon className="w-4 h-4" />
//             Filters
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
//             <BoltIcon className="w-4 h-4" />
//             Bulk Approve
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 mb-8">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-1 py-4 text-sm font-semibold transition-colors relative ${
//               activeTab === tab.id
//                 ? 'text-primary border-b-2 border-primary'
//                 : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
//             }`}
//           >
//             {tab.label}
//             {tab.count > 0 && (
//               <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
//                 {tab.count}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Table Content */}
//       <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50 dark:bg-slate-800/50">
//                 <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Studio Name</th>
//                 <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Category</th>
//                 <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Location</th>
//                 <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Submission Date</th>
//                 <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 text-right">Actions</th>
//                 </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//               {applications.map((app) => (
//                 <tr
//                   key={app.id}
//                   onClick={() => setSelectedApp(app)}
//                   className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group ${
//                     selectedApp?.id === app.id ? 'bg-slate-50/20 dark:bg-slate-800/20' : ''
//                   }`}
//                 >
//                   <td className="px-6 py-5">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
//                         <img src={app.images[0]} alt={app.studioName} className="w-full h-full object-cover" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{app.studioName}</p>
//                         <p className="text-[11px] text-slate-500">{app.studioId}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5">
//                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getCategoryStyle(app.category)}`}>
//                       <MaterialIcon icon={app.categoryIcon} className="text-sm" />
//                       {app.category}
//                     </span>
//                   </td>
//                   <td className="px-6 py-5">
//                     <p className="text-sm text-slate-600 dark:text-slate-400">{app.location}</p>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="text-sm text-slate-600 dark:text-slate-400">
//                       <p className="font-medium text-slate-900 dark:text-slate-100">{app.submissionDate}</p>
//                       <p className="text-xs text-slate-400">{app.timeAgo}</p>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 text-right">
//                     <button className="text-primary hover:bg-primary/10 px-4 py-1.5 rounded-lg text-sm font-bold transition-all border border-transparent hover:border-primary/20">
//                       Review
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
//           <p className="text-xs text-slate-500 font-medium">Showing 1 to 4 of 12 pending applications</p>
//           <div className="flex gap-2">
//             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
//               <ChevronLeftIcon className="w-4 h-4" />
//             </button>
//             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
//               <ChevronRightIcon className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Application Details Sidebar - This will be rendered by the layout? You might want to handle this differently */}
//       {selectedApp && (
//         <div className="fixed right-0 top-0 h-full w-[400px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto z-50">
//           <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
//             <div>
//               <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Review Application</h3>
//               <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">Application #{selectedApp.studioId}</p>
//             </div>
//             <button
//               onClick={() => setSelectedApp(null)}
//               className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
//             >
//               <XMarkIcon className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="p-6 space-y-8">
//             {/* Media Gallery */}
//             <section>
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Media Preview</h4>
//                 <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{selectedApp.images.length} Photos</span>
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="col-span-2 aspect-video bg-slate-100 rounded-xl overflow-hidden group relative">
//                   <img src={selectedApp.images[0]} alt={selectedApp.studioName} className="w-full h-full object-cover" />
//                 </div>
//                 {selectedApp.images.slice(1, 3).map((img, idx) => (
//                   <div key={idx} className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative group">
//                     <img src={img} alt={`${selectedApp.studioName} ${idx + 2}`} className="w-full h-full object-cover" />
//                     {idx === 1 && selectedApp.images.length > 3 && (
//                       <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//                         <span className="text-white text-sm font-bold">+{selectedApp.images.length - 3} more</span>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Studio Details */}
//             <section className="space-y-4">
//               <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Studio Information</h4>
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
//                   <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1">{selectedApp.description}</p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-[10px] font-bold text-slate-400 uppercase">Hourly Rate</label>
//                     <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">${selectedApp.hourlyRate}/hr</p>
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-slate-400 uppercase">Capacity</label>
//                     <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{selectedApp.capacity} Persons</p>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold text-slate-400 uppercase">Equipment Highlights</label>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {selectedApp.equipment.map((item) => (
//                       <span key={item} className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">
//                         {item}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Applicant Profile */}
//             <section className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
//               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Owner Profile</h4>
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
//                   {selectedApp.ownerName.charAt(0)}
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedApp.ownerName}</p>
//                   <p className="text-[10px] text-slate-500 font-medium">Verified Owner • {selectedApp.ownerStudios} Studios</p>
//                 </div>
//                 <button className="ml-auto text-primary">
//                   <ChatBubbleLeftIcon className="w-5 h-5" />
//                 </button>
//               </div>
//             </section>
//           </div>

//           {/* Footer Actions */}
//           <div className="mt-auto p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 sticky bottom-0">
//             <div className="flex flex-col gap-3">
//               <button className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
//                 <CheckCircleIcon className="w-4 h-4" />
//                 Approve Studio
//               </button>
//               <div className="flex gap-3">
//                 <button className="flex-1 border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 py-2.5 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center justify-center gap-2">
//                   <XCircleIcon className="w-4 h-4" />
//                   Reject
//                 </button>
//                 <button className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
//                   <PencilIcon className="w-4 h-4" />
//                   Flag
//                 </button>
//               </div>
//             </div>
//             <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-tight">
//               Studio will be live immediately upon approval
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BoltIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

// Material Icon component
const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
  <span 
    className={`material-symbols-outlined ${className}`} 
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {icon}
  </span>
);

interface Application {
  id: string;
  studioName: string;
  studioId: string;
  category: string;
  categoryIcon: string;
  location: string;
  submissionDate: string;
  timeAgo: string;
  images: string[];
  description: string;
  hourlyRate: number;
  capacity: number;
  equipment: string[];
  ownerName: string;
  ownerEmail: string;
  ownerId: string;
  status: string;
}

export default function AdminModeration() {
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [approvedApplications, setApprovedApplications] = useState<Application[]>([]);
  const [rejectedApplications, setRejectedApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all studios from Supabase
  useEffect(() => {
    fetchAllStudios();
  }, []);

  const fetchAllStudios = async () => {
    setLoading(true);
    try {
      // Fetch studios with different statuses
      const { data: studios, error } = await supabase
        .from('studios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Separate studios by status
      const pending: Application[] = [];
      const approved: Application[] = [];
      const rejected: Application[] = [];

      for (const studio of studios || []) {
        const formattedApp = await formatStudioApplication(studio);
        if (studio.status === 'pending') {
          pending.push(formattedApp);
        } else if (studio.status === 'approved') {
          approved.push(formattedApp);
        } else if (studio.status === 'rejected') {
          rejected.push(formattedApp);
        }
      }

      setPendingApplications(pending);
      setApprovedApplications(approved);
      setRejectedApplications(rejected);
    } catch (error) {
      console.error('Error fetching studios:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatStudioApplication = async (studio: any): Promise<Application> => {
    let ownerName = 'Unknown';
    let ownerEmail = '';
    
    if (studio.owner_id) {
      const { data: owner } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', studio.owner_id)
        .single();
      
      if (owner) {
        ownerName = owner.name || owner.email?.split('@')[0] || 'Unknown';
        ownerEmail = owner.email || '';
      }
    }

    const equipment = studio.amenities || [];
    
    const createdDate = new Date(studio.created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    let timeAgo;
    if (diffHours < 24) {
      timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      timeAgo = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }

    return {
      id: studio.id,
      studioName: studio.name,
      studioId: studio.id.slice(0, 8),
      category: studio.category || 'Other',
      categoryIcon: getCategoryIcon(studio.category),
      location: `${studio.city || ''}, ${studio.state || ''}`.replace(/^, /, ''),
      submissionDate: createdDate.toLocaleDateString(),
      timeAgo,
      images: studio.images || [],
      description: studio.description || 'No description provided.',
      hourlyRate: studio.hourly_rate || 0,
      capacity: studio.capacity || 0,
      equipment,
      ownerName,
      ownerEmail,
      ownerId: studio.owner_id,
      status: studio.status,
    };
  };

  const getCategoryIcon = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Photography & Stills': 'photo_camera',
      'Video Production': 'videocam',
      'Audio Recording': 'mic',
      'Fashion & Editorial': 'palette',
      'Art Studio': 'brush',
      'Creative Office': 'work',
      'Event Space': 'celebration',
      'Recording': 'mic',
      'Photography': 'photo_camera',
      'Rehearsal': 'music_note',
      'Video': 'videocam',
    };
    return categoryMap[category] || 'star';
  };

  const getCategoryStyle = (category: string) => {
    const styleMap: Record<string, string> = {
      'Recording': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'Photography': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      'Rehearsal': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
      'Video': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      'Photography & Stills': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      'Video Production': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      'Audio Recording': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };
    return styleMap[category] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
  };

  const handleApprove = async (id: string) => {
    if (updating) return;
    setUpdating(true);
    
    try {
      const { error } = await supabase
        .from('studios')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      // Move from pending to approved
      const approvedApp = pendingApplications.find(app => app.id === id);
      if (approvedApp) {
        setPendingApplications(prev => prev.filter(app => app.id !== id));
        setApprovedApplications(prev => [approvedApp, ...prev]);
      }
      setSelectedApp(null);
      alert('Studio approved successfully! It is now live on the marketplace.');
    } catch (error) {
      console.error('Error approving studio:', error);
      alert('Failed to approve studio');
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (id: string) => {
    if (updating) return;
    
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('studios')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      // Move from pending to rejected
      const rejectedApp = pendingApplications.find(app => app.id === id);
      if (rejectedApp) {
        setPendingApplications(prev => prev.filter(app => app.id !== id));
        setRejectedApplications(prev => [rejectedApp, ...prev]);
      }
      setSelectedApp(null);
      alert('Studio rejected successfully.');
    } catch (error) {
      console.error('Error rejecting studio:', error);
      alert('Failed to reject studio');
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkApprove = async () => {
    if (pendingApplications.length === 0) return;
    
    if (!confirm(`Are you sure you want to approve all ${pendingApplications.length} pending studios?`)) return;
    
    setUpdating(true);
    try {
      const ids = pendingApplications.map(app => app.id);
      
      const { error } = await supabase
        .from('studios')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .in('id', ids);
      
      if (error) throw error;
      
      setApprovedApplications(prev => [...pendingApplications, ...prev]);
      setPendingApplications([]);
      setSelectedApp(null);
      alert(`Successfully approved ${ids.length} studios!`);
    } catch (error) {
      console.error('Error bulk approving studios:', error);
      alert('Failed to bulk approve studios');
    } finally {
      setUpdating(false);
    }
  };

  const getCurrentApplications = () => {
    switch (activeTab) {
      case 'pending':
        return pendingApplications;
      case 'approved':
        return approvedApplications;
      case 'rejected':
        return rejectedApplications;
      default:
        return pendingApplications;
    }
  };

  const getTabCount = () => {
    switch (activeTab) {
      case 'pending':
        return pendingApplications.length;
      case 'approved':
        return approvedApplications.length;
      case 'rejected':
        return rejectedApplications.length;
      default:
        return pendingApplications.length;
    }
  };

  const filteredApplications = getCurrentApplications().filter(app => {
    return app.studioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           app.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
           app.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tabs = [
    { id: 'pending', label: 'Pending Applications', icon: 'schedule' },
    { id: 'approved', label: 'Recently Approved', icon: 'check_circle' },
    { id: 'rejected', label: 'Rejected', icon: 'cancel' },
  ];

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">Loading moderation queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-4">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Live Queue
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Studio Moderation Queue</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Review and manage all studio applications on the ManyRooms platform.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search studios..."
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <button 
            onClick={fetchAllStudios}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Refresh
          </button>
          {activeTab === 'pending' && pendingApplications.length > 0 && (
            <button 
              onClick={handleBulkApprove}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
            >
              <BoltIcon className="w-4 h-4" />
              Bulk Approve ({pendingApplications.length})
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentPage(1);
              setSelectedApp(null);
            }}
            className={`px-1 py-4 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <MaterialIcon icon={tab.icon} className="text-base" />
            {tab.label}
            <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id 
                ? 'bg-primary/10 text-primary' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {tab.id === 'pending' ? pendingApplications.length : 
               tab.id === 'approved' ? approvedApplications.length : 
               rejectedApplications.length}
            </span>
          </button>
        ))}
      </div>

      {/* Table Content */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
            <MaterialIcon icon={activeTab === 'pending' ? 'hourglass_empty' : activeTab === 'approved' ? 'check_circle' : 'cancel'} className="text-5xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {activeTab === 'pending' ? 'No pending applications' : 
             activeTab === 'approved' ? 'No approved studios yet' : 
             'No rejected studios'}
          </h3>
          <p className="text-slate-500">
            {activeTab === 'pending' ? 'All caught up! New applications will appear here.' : 
             activeTab === 'approved' ? 'Approved studios will appear here once approved.' : 
             'Rejected studios will appear here once rejected.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Studio Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Category</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Location</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Submitted</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group ${
                      selectedApp?.id === app.id ? 'bg-slate-50/20 dark:bg-slate-800/20' : ''
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                          {app.images && app.images[0] ? (
                            <img src={app.images[0]} alt={app.studioName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MaterialIcon icon="image" className="text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{app.studioName}</p>
                          <p className="text-[11px] text-slate-500">Owner: {app.ownerName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getCategoryStyle(app.category)}`}>
                        <MaterialIcon icon={app.categoryIcon} className="text-sm" />
                        {app.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600 dark:text-slate-400">{app.location || 'Location not specified'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{app.submissionDate}</p>
                        <p className="text-xs text-slate-400">{app.timeAgo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {activeTab === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(app.id);
                              }}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                              title="Approve"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(app.id);
                              }}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              title="Reject"
                            >
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length} applications
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors disabled:opacity-50"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors disabled:opacity-50"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Application Details Sidebar */}
      {selectedApp && (
        <div className="fixed right-0 top-0 h-full w-[450px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto z-50">
          <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Studio Details</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">{selectedApp.studioName}</p>
            </div>
            <button
              onClick={() => setSelectedApp(null)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Media Gallery */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Media Preview</h4>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{selectedApp.images?.length || 0} Photos</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {selectedApp.images && selectedApp.images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className={`${idx === 0 ? 'col-span-2' : ''} aspect-video bg-slate-100 rounded-xl overflow-hidden`}>
                    <img src={img} alt={`${selectedApp.studioName} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {(!selectedApp.images || selectedApp.images.length === 0) && (
                  <div className="col-span-2 aspect-video bg-slate-100 rounded-xl flex items-center justify-center">
                    <MaterialIcon icon="image" className="text-4xl text-slate-400" />
                    <span className="text-slate-500 ml-2">No images uploaded</span>
                  </div>
                )}
              </div>
            </section>

            {/* Studio Details */}
            <section className="space-y-4">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Studio Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1">{selectedApp.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Hourly Rate</label>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">${selectedApp.hourlyRate}/hr</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Capacity</label>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{selectedApp.capacity} Persons</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Amenities</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedApp.equipment && selectedApp.equipment.length > 0 ? (
                      selectedApp.equipment.map((item) => (
                        <span key={item} className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-medium">
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No amenities listed</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Owner Profile */}
            <section className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Owner Profile</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {selectedApp.ownerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedApp.ownerName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{selectedApp.ownerEmail}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Action Buttons (only show for pending) */}
          {selectedApp.status === 'pending' && (
            <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 sticky bottom-0">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleApprove(selectedApp.id)}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Approve Studio
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="flex-1 border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 py-2.5 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Reject
                  </button>
                  <button className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-tight">
                Studio will be live immediately upon approval
              </p>
            </div>
          )}

          {/* Status Badge for non-pending */}
          {selectedApp.status !== 'pending' && (
            <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 sticky bottom-0">
              <div className={`p-4 rounded-lg text-center ${
                selectedApp.status === 'approved' 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                <MaterialIcon icon={selectedApp.status === 'approved' ? 'check_circle' : 'cancel'} className="text-2xl mb-2" />
                <p className="font-semibold">
                  Studio {selectedApp.status === 'approved' ? 'Approved' : 'Rejected'}
                </p>
                <p className="text-xs mt-1 opacity-75">
                  {selectedApp.status === 'approved' 
                    ? 'This studio is live on the marketplace' 
                    : 'This studio has been rejected and is not visible to the public'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}