'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  FunnelIcon,
  BoltIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
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
  ownerStudios: number;
}

export default function AdminModeration() {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  const applications: Application[] = [
    {
      id: '1',
      studioName: 'Sunset Sound',
      studioId: 'app_892347',
      category: 'Recording',
      categoryIcon: 'mic',
      location: 'Los Angeles, CA',
      submissionDate: 'Oct 24, 2023',
      timeAgo: '2 hours ago',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBAKI0GcZT2d2wkOa6sLzp--5mIQwZ360RHLGM5NkbHd9L121Wn0GyuIUP6PnURFqaFwdwXvzgy_xOCh77bz3RvIPRIyR04Y2f22AYTHqLvvxwywfMBPYB1zXVI6Ist_ATEZA1-JrkLYyWF_eTYOmjzo02ejG3MiYF78VIOXxqlt8lqJY2r5PonZaAPli2zr0HIb_X9P50qowM4UjEBPoEzg-v-35w1Q5jGoPtWCZsNYnoerUCz4vMjv4sjBNGB50dgfvbcDoIGw_Fb',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC6zWUI_LeFsTgaxEwjEwZbmA0WimRc2PdY-KBZp61YXf60ksXCyJiJ3oflABlWb11xNn_77tnm-mYfc1REe-WHE1E-1EiYS0LI47zw_0P7M7iLC1afMIu9rrQ7N3V1uttkq2BIT13VJJwVUg6KAVpWS6yZfblySgbzqULy8DXDURc7nuy99Tlyya7Uy5gfVdrx04uVWGVNCj6LLJYR9i0u3qwVsCMPTX2Auolww2EEiIoAfRX_XCGMYS9ddsV3DsszOPWhrq6oMtJ_',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDzHJZWrfwBzCbzM07InGKrT79eIVa0JwLBo6uApsN63cW9EWi_jHgm3cd-JfErmTyEgdT4jMQMzMd15q32OLioWt5FQjb5FZomeqx3cDkW_FN1r_oZ-T5T-fIvXwG3lY-m9xktBZ_kN95NAtuoKImYD6fLKUACE25EX0IDFj4gujx-WBYeodFhNmf-Eu75bZhds-_BkJxk9uNWE8AYYJe2ul6P_MlYDxLcuPZARLB07NN7RsLXI13YKTs6y8Gyz9MFL4V3tDnNL14_',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBv5XAXdAZ1MR_r-Q1Pu_NpSV9cCam6RFhB79ZXhyxfU0zzTk7C5RR2UX-rJskyn0J6Uxr6p3Bux69uP1W6cOkG1UPP8-Hjawd8riCrqbEEE5ypcwiz6ygObo-59Lss-LDuUWhJ8_rkIQJqOPfdbHySxIr6c84FpZMy0IpVvShvNpUP9cyeYIM_7tZKpFeowo89RCLhsKRxkn5OlgB_4pa1ZEvo-j2-9I5hT4M_ip_HKRKkj4UwoHwFWtzao7ttMrZi9wVwV0RJ_46x',
      ],
      description: 'Legacy recording studio located in the heart of Hollywood. Features a vintage Neve console and a spacious live room with excellent acoustics. Perfect for bands and large ensembles.',
      hourlyRate: 120,
      capacity: 12,
      equipment: ['Neve 8068', 'U87 Mics (4x)', 'Steinway B'],
      ownerName: 'Marcus Sterling',
      ownerStudios: 3,
    },
    {
      id: '2',
      studioName: 'The Blue Room',
      studioId: 'app_892348',
      category: 'Photography',
      categoryIcon: 'photo_camera',
      location: 'Brooklyn, NY',
      submissionDate: 'Oct 24, 2023',
      timeAgo: '5 hours ago',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDiLSJxx-JHP0NCl05p6LmS1CPKZi4X1XnyVc-ovuxK7BA8wXhljkrgqX1hLWHNbVTOZ10qWFadBw18fQ6em3y2CVzYQt6Dn6_f3c-U6RXYjR1Pb93X0aV9d9cXbdTX8m16i0PYAgD8eIyblJnEyasYjoi0-U8BSopx5UW2nWZTL92okKUZY34wybwUhx4qPiJZ0Sj9PT88U4imqY7T-mTWALO008NiF7T-fOIpNq7Ycy2UEGrfcrbURwMlhaqwCmfxBlYXrmUnhSmL',
      ],
      description: 'Minimalist photography studio with natural light and white cyclorama wall. Ideal for fashion and portrait photography.',
      hourlyRate: 95,
      capacity: 8,
      equipment: ['Profoto Lights', 'Backdrop System', 'C-Stands'],
      ownerName: 'Elena Rossi',
      ownerStudios: 1,
    },
    {
      id: '3',
      studioName: 'Echo Studios',
      studioId: 'app_892349',
      category: 'Rehearsal',
      categoryIcon: 'music_note',
      location: 'London, UK',
      submissionDate: 'Oct 23, 2023',
      timeAgo: '1 day ago',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCY60-gsr7AqZzikT5ZViN86WXAKU3D6NNf917UwHt711pr5I2Vi_Eu_CHoZgjq2qNXTVJz2a5FQzEPLkHXU055Q5YnEPapwYwMnnXNCsg94Fwr2QuQCDyYNV8RuMPYSwWvTwVp2xY5oTbUt5kYy7abiKpcBPrmK77P5rD9zaxnHuybR3FGW_9yE0UdPQ8ZPu8YOHC_fev7mA3awsK1bRC99q2AFHhjuO3bGPGbJxE6nCVoyjk032qQxR6e21XLo24L2KkiDioFbZ8M',
      ],
      description: 'Fully equipped rehearsal space with backline, PA system, and climate control. Perfect for bands and solo artists.',
      hourlyRate: 45,
      capacity: 10,
      equipment: ['Ampeg Bass Rig', 'Pearl Drums', 'Marshall Amps'],
      ownerName: 'James Chen',
      ownerStudios: 2,
    },
    {
      id: '4',
      studioName: 'Neon Lights Video',
      studioId: 'app_892350',
      category: 'Video',
      categoryIcon: 'videocam',
      location: 'Toronto, CAN',
      submissionDate: 'Oct 22, 2023',
      timeAgo: '2 days ago',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUygV54k5_jnQ2PKtCOl1U3ySZ4KVytZ-yWVjUvBCjl07usMddrq4qlOTo9ZY9HLCymFmlXfV3Z3e_zxP6SXXMwFr2aDcLssC925Jc7JK2ZGmij5EADi36QAHY8-R8X54qn52K5BkfEpFXuAGwQshZ4DKNadLpKPSI1aESsRW980meDNKP03IXbh9_VXyZlu4-VI2MSYFhetfdXgUiQgNoo08yLoZESJ6tznK2QUnSyKGMsU3bm6so0K6pWIUQyNVBIc5_SsNdUMYL',
      ],
      description: 'Professional video production studio with green screen, studio lighting, and 4K monitoring capabilities.',
      hourlyRate: 150,
      capacity: 15,
      equipment: ['Arri Lights', 'Green Screen', '4K Monitors'],
      ownerName: 'Sofia Martinez',
      ownerStudios: 1,
    },
  ];

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Recording':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Photography':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Rehearsal':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      case 'Video':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400';
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending Applications', count: applications.length },
    { id: 'review', label: 'Under Review', count: 0 },
    { id: 'approved', label: 'Recently Approved', count: 0 },
    { id: 'rejected', label: 'Rejected', count: 0 },
  ];

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
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Review and manage pending applications for the ManyRooms platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
            <BoltIcon className="w-4 h-4" />
            Bulk Approve
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-1 py-4 text-sm font-semibold transition-colors relative ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table Content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Studio Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Location</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Submission Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group ${
                    selectedApp?.id === app.id ? 'bg-slate-50/20 dark:bg-slate-800/20' : ''
                  }`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
                        <img src={app.images[0]} alt={app.studioName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{app.studioName}</p>
                        <p className="text-[11px] text-slate-500">{app.studioId}</p>
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">{app.location}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{app.submissionDate}</p>
                      <p className="text-xs text-slate-400">{app.timeAgo}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-primary hover:bg-primary/10 px-4 py-1.5 rounded-lg text-sm font-bold transition-all border border-transparent hover:border-primary/20">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing 1 to 4 of 12 pending applications</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Application Details Sidebar - This will be rendered by the layout? You might want to handle this differently */}
      {selectedApp && (
        <div className="fixed right-0 top-0 h-full w-[400px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto z-50">
          <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Review Application</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">Application #{selectedApp.studioId}</p>
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
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{selectedApp.images.length} Photos</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 aspect-video bg-slate-100 rounded-xl overflow-hidden group relative">
                  <img src={selectedApp.images[0]} alt={selectedApp.studioName} className="w-full h-full object-cover" />
                </div>
                {selectedApp.images.slice(1, 3).map((img, idx) => (
                  <div key={idx} className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative group">
                    <img src={img} alt={`${selectedApp.studioName} ${idx + 2}`} className="w-full h-full object-cover" />
                    {idx === 1 && selectedApp.images.length > 3 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">+{selectedApp.images.length - 3} more</span>
                      </div>
                    )}
                  </div>
                ))}
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Equipment Highlights</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedApp.equipment.map((item) => (
                      <span key={item} className="px-2 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Applicant Profile */}
            <section className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Owner Profile</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {selectedApp.ownerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedApp.ownerName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Verified Owner • {selectedApp.ownerStudios} Studios</p>
                </div>
                <button className="ml-auto text-primary">
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                </button>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 sticky bottom-0">
            <div className="flex flex-col gap-3">
              <button className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                Approve Studio
              </button>
              <div className="flex gap-3">
                <button className="flex-1 border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 py-2.5 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center justify-center gap-2">
                  <XCircleIcon className="w-4 h-4" />
                  Reject
                </button>
                <button className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                  <PencilIcon className="w-4 h-4" />
                  Flag
                </button>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-tight">
              Studio will be live immediately upon approval
            </p>
          </div>
        </div>
      )}
    </div>
  );
}