
// app/admin/studios/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Brand Colors
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  brown: '#DB8B8C',
  dark: '#3C291C',
};

const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>{icon}</span>
);

interface Studio {
  id: string;
  name: string;
  owner_id: string;
  owner_name?: string;
  category: string;
  city: string;
  state: string;
  hourly_rate: number;
  status: string;
  images: string[];
  created_at: string;
}

export default function AdminStudios() {
  const router = useRouter();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => { fetchStudios(); }, []);

  const fetchStudios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('studios').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      const studiosWithOwners = await Promise.all((data || []).map(async (studio) => {
        if (studio.owner_id) {
          const { data: userData } = await supabase.from('users').select('name').eq('id', studio.owner_id).single();
          return { ...studio, owner_name: userData?.name || 'Unknown' };
        }
        return { ...studio, owner_name: 'Unknown' };
      }));
      setStudios(studiosWithOwners);
    } catch (error) { console.error('Error fetching studios:', error); }
    finally { setLoading(false); }
  };

  const handleDeleteStudio = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try { await supabase.from('studios').delete().eq('id', id); fetchStudios(); }
    catch (error) { alert('Failed to delete studio'); }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try { await supabase.from('studios').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id); fetchStudios(); }
    catch (error) { alert('Failed to update status'); }
  };

  const categories = ['all', ...new Set(studios.map(s => s.category).filter(Boolean))];
  const statuses = ['all', 'pending', 'approved', 'rejected', 'draft'];

  const filteredStudios = studios.filter(s => {
    return (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.city?.toLowerCase().includes(searchTerm.toLowerCase())) &&
           (selectedCategory === 'all' || s.category === selectedCategory) && (selectedStatus === 'all' || s.status === selectedStatus);
  });

  const totalPages = Math.ceil(filteredStudios.length / itemsPerPage);
  const paginatedStudios = filteredStudios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'rejected': return 'bg-red-100 text-red-600';
      case 'draft': return 'bg-[#3C291C]/5 text-[#3C291C]/60';
      default: return 'bg-[#3C291C]/5 text-[#3C291C]/60';
    }
  };

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, string> = {
      'Photography & Stills': 'bg-[#91ADCD]/20 text-[#3C291C]',
      'Video Production': 'bg-[#DB8B8C]/20 text-[#3C291C]',
      'Audio Recording': 'bg-[#F1CB81]/20 text-[#3C291C]',
      'Fashion & Editorial': 'bg-pink-100 text-pink-700',
      'Art Studio': 'bg-amber-100 text-amber-700',
      'Creative Office': 'bg-cyan-100 text-cyan-700',
      'Event Space': 'bg-orange-100 text-orange-700',
    };
    return styles[category] || 'bg-[#3C291C]/5 text-[#3C291C]/60';
  };

  const getCoverImage = (images: string[]) => (!images || images.length === 0 ? null : images[0]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-8">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-[#F1CB81]/40 rounded-full mx-auto mb-4"></div>
          <p className="text-[#3C291C] font-bold">Loading studios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#3C291C] tracking-tight">Studio Listings</h1>
            <p className="text-[#3C291C]/60 text-sm mt-1">Manage and moderate all studios on the platform.</p>
          </div>
          <Link href="/admin/studios/add"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F1CB81] px-5 py-3 text-sm font-bold text-[#3C291C] hover:bg-[#DB8B8C] hover:text-white transition-all shadow-lg">
            <PlusCircleIcon className="w-5 h-5" /> Add New Studio
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C291C]/30" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name, owner, or location..."
              className="w-full rounded-xl border border-[#3C291C]/10 bg-white py-3 pl-10 text-sm focus:border-[#F1CB81] focus:ring-[#F1CB81] outline-none text-[#3C291C] placeholder:text-[#3C291C]/30" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-[#3C291C]/10 bg-white px-4 py-3 text-sm font-bold text-[#3C291C] outline-none">
            {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-[#3C291C]/10 bg-white px-4 py-3 text-sm font-bold text-[#3C291C] outline-none">
            {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {/* Studios Grid */}
        {filteredStudios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#3C291C]/10">
            <MaterialIcon icon="apartment" className="text-6xl text-[#3C291C]/20 mb-4" />
            <h4 className="text-xl font-extrabold text-[#3C291C] mb-2">No studios found</h4>
            <p className="text-[#3C291C]/60">Try adjusting your filters or add a new studio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedStudios.map((studio) => {
              const coverImage = getCoverImage(studio.images);
              return (
                <div key={studio.id} className="bg-white rounded-2xl border border-[#3C291C]/10 overflow-hidden hover:shadow-lg transition-all group shadow-sm">
                  <div className="relative h-48 overflow-hidden">
                    {coverImage ? (
                      <img src={coverImage} alt={studio.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#3C291C]/5">
                        <MaterialIcon icon="image" className="text-4xl text-[#3C291C]/20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(studio.status)}`}>{studio.status}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-extrabold text-[#3C291C] line-clamp-1 mb-1">{studio.name}</h3>
                    <p className="text-sm text-[#3C291C]/40 mb-2">{studio.owner_name} • {studio.city}, {studio.state}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getCategoryStyle(studio.category)}`}>{studio.category || 'Uncategorized'}</span>
                      <span className="text-xs text-[#3C291C]/40">${studio.hourly_rate}/hr</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#3C291C]/5">
                      <div className="flex gap-2">
                        <button onClick={() => router.push(`/admin/studios/${studio.id}`)} className="p-2 text-[#3C291C]/30 hover:text-[#3C291C] transition-colors rounded-lg hover:bg-[#3C291C]/5" title="View"><EyeIcon className="w-4 h-4" /></button>
                        <button onClick={() => router.push(`/admin/studios/${studio.id}/edit`)} className="p-2 text-[#3C291C]/30 hover:text-[#3C291C] transition-colors rounded-lg hover:bg-[#3C291C]/5" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteStudio(studio.id, studio.name)} className="p-2 text-[#3C291C]/30 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Delete"><TrashIcon className="w-4 h-4" /></button>
                      </div>
                      {studio.status === 'pending' && (
                        <div className="flex gap-1">
                          <button onClick={() => handleUpdateStatus(studio.id, 'approved')} className="text-[10px] px-2 py-1.5 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition-colors">Approve</button>
                          <button onClick={() => handleUpdateStatus(studio.id, 'rejected')} className="text-[10px] px-2 py-1.5 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#3C291C]/10">
            <p className="text-xs text-[#3C291C]/40">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStudios.length)} of {filteredStudios.length}</p>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#3C291C]/10 text-[#3C291C]/40 hover:text-[#3C291C] disabled:opacity-50 transition-colors"><ChevronLeftIcon className="w-4 h-4" /></button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[#3C291C]/10 text-[#3C291C]/40 hover:text-[#3C291C] disabled:opacity-50 transition-colors"><ChevronRightIcon className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   EyeIcon,
//   PencilIcon,
//   TrashIcon,
//   PlusCircleIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
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

// interface Studio {
//   id: string;
//   name: string;
//   owner_id: string;
//   owner_name?: string;
//   category: string;
//   city: string;
//   state: string;
//   hourly_rate: number;
//   status: string;
//   images: string[];
//   created_at: string;
// }

// export default function AdminStudios() {
//   const router = useRouter();
//   const [studios, setStudios] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 12;

//   // Fetch studios from Supabase
//   useEffect(() => {
//     fetchStudios();
//   }, []);

//   const fetchStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
      
//       // Fetch owner names for each studio
//       const studiosWithOwners = await Promise.all(
//         (data || []).map(async (studio) => {
//           if (studio.owner_id) {
//             const { data: userData } = await supabase
//               .from('users')
//               .select('name')
//               .eq('id', studio.owner_id)
//               .single();
//             return { ...studio, owner_name: userData?.name || 'Unknown' };
//           }
//           return { ...studio, owner_name: 'Unknown' };
//         })
//       );
      
//       setStudios(studiosWithOwners);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteStudio = async (id: string, name: string) => {
//     if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
//       try {
//         const { error } = await supabase
//           .from('studios')
//           .delete()
//           .eq('id', id);
        
//         if (error) throw error;
        
//         // Refresh the list
//         fetchStudios();
//       } catch (error) {
//         console.error('Error deleting studio:', error);
//         alert('Failed to delete studio');
//       }
//     }
//   };

//   const handleUpdateStatus = async (id: string, newStatus: string) => {
//     try {
//       const { error } = await supabase
//         .from('studios')
//         .update({ status: newStatus, updated_at: new Date().toISOString() })
//         .eq('id', id);
      
//       if (error) throw error;
      
//       // Refresh the list
//       fetchStudios();
//     } catch (error) {
//       console.error('Error updating studio status:', error);
//       alert('Failed to update studio status');
//     }
//   };

//   // Get unique categories from studios
//   const categories = ['all', ...new Set(studios.map(s => s.category).filter(Boolean))];
//   const statuses = ['all', 'pending', 'approved', 'rejected', 'draft'];

//   const filteredStudios = studios.filter(studio => {
//     const matchesSearch = studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           (studio.owner_name && studio.owner_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//                           studio.city?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || studio.category === selectedCategory;
//     const matchesStatus = selectedStatus === 'all' || studio.status === selectedStatus;
//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredStudios.length / itemsPerPage);
//   const paginatedStudios = filteredStudios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return 'bg-emerald-500/10 text-emerald-500';
//       case 'pending':
//         return 'bg-amber-500/10 text-amber-500';
//       case 'rejected':
//         return 'bg-red-500/10 text-red-500';
//       case 'draft':
//         return 'bg-slate-500/10 text-slate-500';
//       default:
//         return 'bg-slate-500/10 text-slate-500';
//     }
//   };

//   const getCategoryStyle = (category: string) => {
//     const styles: Record<string, string> = {
//       'Photography & Stills': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
//       'Video Production': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
//       'Audio Recording': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
//       'Fashion & Editorial': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
//       'Art Studio': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
//       'Creative Office': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
//       'Event Space': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
//     };
//     return styles[category] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
//   };

//   const getCoverImage = (images: string[]) => {
//     if (!images || images.length === 0) return null;
//     return images[0];
//   };

//   if (loading) {
//     return (
//       <div className="p-8 flex justify-center items-center min-h-[400px]">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-slate-500">Loading studios...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//           <div>
//             <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Studio Listings</h1>
//             <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and moderate all studios on the platform.</p>
//           </div>
//           <Link
//             href="/admin/studios/add"
//             className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
//           >
//             <PlusCircleIcon className="w-5 h-5" />
//             Add New Studio
//           </Link>
//         </div>

//         {/* Filters */}
//         <div className="mb-6 flex flex-wrap items-center gap-4">
//           <div className="relative flex-1 min-w-[300px]">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by name, owner, or location..."
//               className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 text-sm focus:border-primary focus:ring-primary dark:border-slate-800 dark:bg-background-dark dark:text-white outline-none"
//             />
//           </div>
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-slate-800 dark:bg-background-dark dark:text-white"
//           >
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
//             ))}
//           </select>
//           <select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-slate-800 dark:bg-background-dark dark:text-white"
//           >
//             {statuses.map((status) => (
//               <option key={status} value={status}>{status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}</option>
//             ))}
//           </select>
//         </div>

//         {/* Studios Grid */}
//         {filteredStudios.length === 0 ? (
//           <div className="text-center py-20 bg-white/5 rounded-xl">
//             <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
//               <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//               </svg>
//             </div>
//             <h4 className="text-xl font-serif mb-2">No studios found</h4>
//             <p className="text-slate-500">Try adjusting your filters or add a new studio.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {paginatedStudios.map((studio) => {
//               const coverImage = getCoverImage(studio.images);
//               return (
//                 <div key={studio.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all group">
//                   <div className="relative h-48 overflow-hidden">
//                     {coverImage ? (
//                       <img
//                         src={coverImage}
//                         alt={studio.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
//                         <MaterialIcon icon="image" className="text-4xl text-slate-400" />
//                       </div>
//                     )}
//                     <div className="absolute top-3 right-3">
//                       <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(studio.status)}`}>
//                         {studio.status}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="p-5">
//                     <div className="flex items-start justify-between mb-2">
//                       <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{studio.name}</h3>
//                     </div>
//                     <p className="text-sm text-slate-500 mb-2">{studio.owner_name} • {studio.city}, {studio.state}</p>
//                     <div className="flex items-center gap-2 mb-3">
//                       <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getCategoryStyle(studio.category)}`}>
//                         {studio.category || 'Uncategorized'}
//                       </span>
//                       <span className="text-xs text-slate-500">${studio.hourly_rate}/hr</span>
//                     </div>
//                     <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => router.push(`/admin/studios/${studio.id}`)}
//                           className="p-1.5 text-slate-400 hover:text-primary transition-colors"
//                           title="View Details"
//                         >
//                           <EyeIcon className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => router.push(`/admin/studios/${studio.id}/edit`)}
//                           className="p-1.5 text-slate-400 hover:text-primary transition-colors"
//                           title="Edit Studio"
//                         >
//                           <PencilIcon className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteStudio(studio.id, studio.name)}
//                           className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
//                           title="Delete Studio"
//                         >
//                           <TrashIcon className="w-4 h-4" />
//                         </button>
//                       </div>
//                       {studio.status === 'pending' && (
//                         <div className="flex gap-1">
//                           <button
//                             onClick={() => handleUpdateStatus(studio.id, 'approved')}
//                             className="text-[10px] px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20 transition-colors"
//                           >
//                             Approve
//                           </button>
//                           <button
//                             onClick={() => handleUpdateStatus(studio.id, 'rejected')}
//                             className="text-[10px] px-2 py-1 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
//             <p className="text-xs text-slate-500">
//               Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStudios.length)} of {filteredStudios.length} studios
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary disabled:opacity-50 transition-colors"
//               >
//                 <ChevronLeftIcon className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                 disabled={currentPage === totalPages}
//                 className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary disabled:opacity-50 transition-colors"
//               >
//                 <ChevronRightIcon className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }