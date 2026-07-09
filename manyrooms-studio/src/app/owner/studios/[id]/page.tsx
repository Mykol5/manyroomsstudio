// app/owner/studios/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

// Brand Colors
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  brown: '#DB8B8C',
  dark: '#3C291C',
};

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface Studio {
  id: string;
  name: string;
  category: string;
  capacity: number;
  description: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  hourly_rate: number;
  daily_rate: number;
  weekly_rate: number;
  cleaning_fee: number;
  amenities: string[];
  availability: {
    monday: boolean; tuesday: boolean; wednesday: boolean; thursday: boolean;
    friday: boolean; saturday: boolean; sunday: boolean;
    startTime: string; endTime: string;
  };
  images: string[];
  status: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export default function OwnerStudioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const studioId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (studioId) fetchStudio();
  }, [studioId, user, authLoading]);

  const fetchStudio = async () => {
    setLoading(true); setError('');
    try {
      const { data, error: fetchError } = await supabase.from('studios').select('*').eq('id', studioId).single();
      if (fetchError) throw fetchError;
      if (!data) { setError('Studio not found'); return; }
      if (data.owner_id !== user?.id) { setError('You do not have permission to view this studio'); return; }
      setStudio(data);
    } catch (err: any) { setError(err.message || 'Failed to load studio'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this studio? This action cannot be undone.')) return;
    try {
      const { error: deleteError } = await supabase.from('studios').delete().eq('id', studioId);
      if (deleteError) throw deleteError;
      router.push('/owner/studios');
    } catch (err: any) { alert('Failed to delete studio'); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#F1CB81]/30 text-[#3C291C]">
            <CheckCircleIcon className="w-3 h-3" /> Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#DB8B8C]/20 text-[#3C291C]">
            <ClockIcon className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
            <XCircleIcon className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3C291C]/5 text-[#3C291C]/60">{status || 'Draft'}</span>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-16 h-16 bg-[#F1CB81]/40 rounded-full mx-auto"></div>
          <p className="text-[#3C291C] font-bold">Loading Studio Details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFBF5]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/owner/studios" className="text-[#DB8B8C] font-bold hover:underline">← Back to My Studios</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen bg-[#FFFBF5]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 text-center">
          <PhotoIcon className="w-16 h-16 text-[#3C291C]/20 mx-auto mb-4" />
          <p className="text-[#3C291C]/60 mb-4">Studio not found</p>
          <Link href="/owner/studios" className="text-[#DB8B8C] font-bold hover:underline">← Back to My Studios</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        
        {/* Back Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/owner/studios" className="flex items-center gap-2 text-[#3C291C]/60 hover:text-[#3C291C] transition-colors font-bold text-sm">
            <ArrowLeftIcon className="w-4 h-4" /> Back to My Studios
          </Link>
          <div className="flex gap-3">
            <Link href={`/owner/studios/${studio.id}/edit`}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3C291C] text-white rounded-xl font-bold text-sm hover:bg-[#DB8B8C] transition-colors">
              <PencilIcon className="w-4 h-4" /> Edit Studio
            </Link>
            <button onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
              <TrashIcon className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="aspect-[16/9] md:aspect-[21/9] bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-[#3C291C]/10">
            {studio.images && studio.images.length > 0 ? (
              <img src={studio.images[selectedImage]} alt={studio.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#3C291C]/5">
                <PhotoIcon className="w-16 h-16 text-[#3C291C]/20" />
              </div>
            )}
          </div>
          {studio.images && studio.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {studio.images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === idx ? 'border-[#F1CB81] ring-2 ring-[#F1CB81]/30' : 'border-[#3C291C]/10 opacity-60 hover:opacity-100'
                  }`}>
                  <img src={img} alt={`${studio.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Studio Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Name & Status */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#3C291C] tracking-tight">{studio.name}</h1>
                {getStatusBadge(studio.status)}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#3C291C]/60">
                <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-[#DB8B8C]" /> {studio.city}, {studio.state}{studio.country ? `, ${studio.country}` : ''}</span>
                <span className="flex items-center gap-1"><UsersIcon className="w-4 h-4 text-[#DB8B8C]" /> Up to {studio.capacity} people</span>
                <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4 text-[#DB8B8C]" /> Listed {new Date(studio.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
              <h3 className="text-xl font-extrabold text-[#3C291C] mb-3">About This Space</h3>
              <p className="text-[#3C291C]/60 leading-relaxed">{studio.description || 'No description provided yet.'}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
              <h3 className="text-xl font-extrabold text-[#3C291C] mb-4">Amenities & Features</h3>
              {studio.amenities && studio.amenities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {studio.amenities.map((item) => (
                    <span key={item} className="px-4 py-2 bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-full text-sm font-medium text-[#3C291C]">{item}</span>
                  ))}
                </div>
              ) : (
                <p className="text-[#3C291C]/60 text-sm">No amenities listed yet.</p>
              )}
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
              <h3 className="text-xl font-extrabold text-[#3C291C] mb-4">Availability</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#3C291C]/5 rounded-xl p-5">
                  <p className="text-xs font-bold text-[#3C291C]/40 uppercase tracking-widest mb-3">Open Days</p>
                  <div className="flex flex-wrap gap-2">
                    {studio.availability && ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
                      .filter(day => (studio.availability as any)[day] === true)
                      .map((day) => (
                        <span key={day} className="px-3 py-1 bg-[#F1CB81]/30 text-[#3C291C] rounded-lg text-sm font-bold capitalize">{day.slice(0, 3)}</span>
                      ))}
                  </div>
                </div>
                <div className="bg-[#3C291C]/5 rounded-xl p-5">
                  <p className="text-xs font-bold text-[#3C291C]/40 uppercase tracking-widest mb-3">Operating Hours</p>
                  <p className="text-lg font-bold text-[#3C291C]">{studio.availability?.startTime || '09:00'} — {studio.availability?.endTime || '22:00'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
              <h3 className="text-xl font-extrabold text-[#3C291C] mb-5 flex items-center gap-2">
                <CurrencyDollarIcon className="w-6 h-6 text-[#DB8B8C]" /> Pricing
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[#3C291C]/10">
                  <span className="text-[#3C291C]/60">Hourly Rate</span>
                  <span className="text-2xl font-extrabold text-[#DB8B8C]">${studio.hourly_rate}<span className="text-sm font-normal text-[#3C291C]/60">/hr</span></span>
                </div>
                {studio.daily_rate > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#3C291C]/60">Daily Rate</span>
                    <span className="font-bold text-[#3C291C]">${studio.daily_rate}<span className="text-xs text-[#3C291C]/60">/day</span></span>
                  </div>
                )}
                {studio.weekly_rate > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#3C291C]/60">Weekly Rate</span>
                    <span className="font-bold text-[#3C291C]">${studio.weekly_rate}<span className="text-xs text-[#3C291C]/60">/week</span></span>
                  </div>
                )}
                {studio.cleaning_fee > 0 && (
                  <div className="flex justify-between items-center pt-4 border-t border-[#3C291C]/10">
                    <span className="text-[#3C291C]/60">Cleaning Fee</span>
                    <span className="font-bold text-[#3C291C]">${studio.cleaning_fee}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
              <h3 className="text-xl font-extrabold text-[#3C291C] mb-5 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-[#DB8B8C]" /> Location
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Address', studio.street_address],
                  ['City', studio.city],
                  ['State', studio.state],
                  ['Postal Code', studio.postal_code],
                  ['Country', studio.country],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <p key={label} className="flex justify-between">
                    <span className="text-[#3C291C]/40">{label}</span>
                    <span className="font-medium text-[#3C291C]">{value}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Studio Info */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
              <h3 className="text-xl font-extrabold text-[#3C291C] mb-5">Studio Info</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Category', studio.category || 'General'],
                  ['Created', new Date(studio.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
                  ['Updated', new Date(studio.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
                ].map(([label, value]) => (
                  <p key={label} className="flex justify-between">
                    <span className="text-[#3C291C]/40">{label}</span>
                    <span className="font-medium text-[#3C291C] capitalize">{value}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link href={`/owner/studios/${studio.id}/bookings`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#3C291C] text-white rounded-xl font-bold text-sm hover:bg-[#DB8B8C] transition-colors">
                <CalendarIcon className="w-4 h-4" /> View Bookings
              </Link>
              <Link href="/owner/messages"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#3C291C]/10 text-[#3C291C] rounded-xl font-bold text-sm hover:bg-[#3C291C]/5 transition-colors">
                <ChatBubbleLeftIcon className="w-4 h-4" /> View Messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// // app/owner/studios/[id]/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import {
//   ArrowLeftIcon,
//   PencilIcon,
//   TrashIcon,
//   CalendarIcon,
//   UsersIcon,
//   MapPinIcon,
//   CurrencyDollarIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   PhotoIcon,
//   StarIcon,
//   ChatBubbleLeftIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface Studio {
//   id: string;
//   name: string;
//   category: string;
//   capacity: number;
//   description: string;
//   street_address: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country: string;
//   hourly_rate: number;
//   daily_rate: number;
//   weekly_rate: number;
//   cleaning_fee: number;
//   amenities: string[];
//   availability: {
//     monday: boolean;
//     tuesday: boolean;
//     wednesday: boolean;
//     thursday: boolean;
//     friday: boolean;
//     saturday: boolean;
//     sunday: boolean;
//     startTime: string;
//     endTime: string;
//   };
//   images: string[];
//   status: string;
//   owner_id: string;
//   created_at: string;
//   updated_at: string;
// }

// export default function OwnerStudioDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [studio, setStudio] = useState<Studio | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedImage, setSelectedImage] = useState(0);

//   const studioId = params.id as string;

//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push('/login');
//       return;
//     }
//     if (studioId) {
//       fetchStudio();
//     }
//   }, [studioId, user, authLoading]);

//   const fetchStudio = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const { data, error: fetchError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('id', studioId)
//         .single();

//       if (fetchError) throw fetchError;

//       if (!data) {
//         setError('Studio not found');
//         return;
//       }

//       if (data.owner_id !== user?.id) {
//         setError('You do not have permission to view this studio');
//         return;
//       }

//       setStudio(data);
//     } catch (err: any) {
//       console.error('Error fetching studio:', err);
//       setError(err.message || 'Failed to load studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm('Are you sure you want to delete this studio? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const { error: deleteError } = await supabase
//         .from('studios')
//         .delete()
//         .eq('id', studioId);

//       if (deleteError) throw deleteError;

//       router.push('/owner/studios');
//     } catch (err: any) {
//       console.error('Error deleting studio:', err);
//       alert('Failed to delete studio');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'approved':
//       case 'active':
//         return (
//           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#beff5f] text-[#111f00]">
//             <CheckCircleIcon className="w-3 h-3" /> Active
//           </span>
//         );
//       case 'pending':
//         return (
//           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#ffdbcf] text-[#822800]">
//             <ClockIcon className="w-3 h-3" /> Pending Review
//           </span>
//         );
//       case 'rejected':
//         return (
//           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#ffdad6] text-[#ba1a1a]">
//             <XCircleIcon className="w-3 h-3" /> Rejected
//           </span>
//         );
//       default:
//         return (
//           <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#edeeef] text-[#424937]">
//             {status || 'Draft'}
//           </span>
//         );
//     }
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="animate-pulse space-y-4 text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto"></div>
//           <p className="text-[#446900] font-bold">Loading Studio Details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa]">
//         <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
//           <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
//             <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             <p className="text-red-600 mb-4">{error}</p>
//             <Link href="/owner/studios" className="text-[#446900] font-bold hover:underline">
//               ← Back to My Studios
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!studio) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa]">
//         <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 text-center">
//           <PhotoIcon className="w-16 h-16 text-[#c2c9b1] mx-auto mb-4" />
//           <p className="text-[#424937] mb-4">Studio not found</p>
//           <Link href="/owner/studios" className="text-[#446900] font-bold hover:underline">
//             ← Back to My Studios
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        
//         {/* Back Navigation & Actions */}
//         <div className="flex items-center justify-between mb-8">
//           <Link 
//             href="/owner/studios" 
//             className="flex items-center gap-2 text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm"
//           >
//             <ArrowLeftIcon className="w-4 h-4" />
//             Back to My Studios
//           </Link>
//           <div className="flex gap-3">
//             <Link
//               href={`/owner/studios/${studio.id}/edit`}
//               className="flex items-center gap-2 px-5 py-2.5 bg-[#2e3132] text-white rounded-xl font-bold text-sm hover:bg-[#446900] transition-colors"
//             >
//               <PencilIcon className="w-4 h-4" />
//               Edit Studio
//             </Link>
//             <button
//               onClick={handleDelete}
//               className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-[#ba1a1a] border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
//             >
//               <TrashIcon className="w-4 h-4" />
//               Delete
//             </button>
//           </div>
//         </div>

//         {/* Image Gallery */}
//         <div className="mb-8">
//           <div className="aspect-[16/9] md:aspect-[21/9] bg-white rounded-2xl overflow-hidden mb-4 shadow-lg border border-[#c2c9b1]/20">
//             {studio.images && studio.images.length > 0 ? (
//               <img
//                 src={studio.images[selectedImage]}
//                 alt={studio.name}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-[#edeeef]">
//                 <PhotoIcon className="w-16 h-16 text-[#c2c9b1]" />
//               </div>
//             )}
//           </div>
//           {studio.images && studio.images.length > 1 && (
//             <div className="flex gap-3 overflow-x-auto pb-2">
//               {studio.images.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedImage(idx)}
//                   className={`w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
//                     selectedImage === idx 
//                       ? 'border-[#446900] ring-2 ring-[#beff5f]/50' 
//                       : 'border-white/40 opacity-60 hover:opacity-100'
//                   }`}
//                 >
//                   <img src={img} alt={`${studio.name} view ${idx + 1}`} className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Studio Info Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
            
//             {/* Name & Status */}
//             <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//               <div className="flex flex-wrap items-center gap-3 mb-3">
//                 <h1 className="text-3xl md:text-4xl font-extrabold text-[#191c1d] tracking-tight">{studio.name}</h1>
//                 {getStatusBadge(studio.status)}
//               </div>
//               <div className="flex flex-wrap items-center gap-4 text-sm text-[#424937]">
//                 <span className="flex items-center gap-1">
//                   <MapPinIcon className="w-4 h-4 text-[#446900]" />
//                   {studio.city}, {studio.state}{studio.country ? `, ${studio.country}` : ''}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <UsersIcon className="w-4 h-4 text-[#446900]" />
//                   Up to {studio.capacity} people
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <CalendarIcon className="w-4 h-4 text-[#446900]" />
//                   Listed {new Date(studio.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                 </span>
//               </div>
//             </div>

//             {/* Description */}
//             <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//               <h3 className="text-xl font-extrabold text-[#191c1d] mb-3">About This Space</h3>
//               <p className="text-[#424937] leading-relaxed">
//                 {studio.description || 'No description provided yet. Add a compelling description to attract more bookings.'}
//               </p>
//             </div>

//             {/* Amenities */}
//             <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//               <h3 className="text-xl font-extrabold text-[#191c1d] mb-4">Amenities & Features</h3>
//               {studio.amenities && studio.amenities.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {studio.amenities.map((item) => (
//                     <span key={item} className="px-4 py-2 bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-full text-sm font-medium text-[#191c1d]">
//                       {item}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-[#424937] text-sm">No amenities listed yet.</p>
//               )}
//             </div>

//             {/* Availability */}
//             <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//               <h3 className="text-xl font-extrabold text-[#191c1d] mb-4">Availability</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="bg-[#f3f4f5] rounded-xl p-5">
//                   <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-3">Open Days</p>
//                   <div className="flex flex-wrap gap-2">
//                     {studio.availability && ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
//                       .filter(day => (studio.availability as any)[day] === true)
//                       .map((day) => (
//                         <span key={day} className="px-3 py-1 bg-[#beff5f]/30 text-[#111f00] rounded-lg text-sm font-bold capitalize">
//                           {day.slice(0, 3)}
//                         </span>
//                       ))}
//                     {(!studio.availability || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
//                       .filter(day => (studio.availability as any)?.[day] === true).length === 0) && (
//                       <span className="text-[#424937] text-sm">Not set</span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="bg-[#f3f4f5] rounded-xl p-5">
//                   <p className="text-xs font-bold text-[#737a65] uppercase tracking-widest mb-3">Operating Hours</p>
//                   <p className="text-lg font-bold text-[#191c1d]">
//                     {studio.availability?.startTime || '09:00'} — {studio.availability?.endTime || '22:00'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
            
//             {/* Pricing Card */}
//             <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//               <h3 className="text-xl font-extrabold text-[#191c1d] mb-5 flex items-center gap-2">
//                 <CurrencyDollarIcon className="w-6 h-6 text-[#446900]" />
//                 Pricing
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center pb-4 border-b border-[#c2c9b1]/20">
//                   <span className="text-[#424937]">Hourly Rate</span>
//                   <span className="text-2xl font-extrabold text-[#446900]">${studio.hourly_rate}<span className="text-sm font-normal text-[#424937]">/hr</span></span>
//                 </div>
//                 {studio.daily_rate > 0 && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#424937]">Daily Rate</span>
//                     <span className="font-bold text-[#191c1d]">${studio.daily_rate}<span className="text-xs text-[#424937]">/day</span></span>
//                   </div>
//                 )}
//                 {studio.weekly_rate > 0 && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-[#424937]">Weekly Rate</span>
//                     <span className="font-bold text-[#191c1d]">${studio.weekly_rate}<span className="text-xs text-[#424937]">/week</span></span>
//                   </div>
//                 )}
//                 {studio.cleaning_fee > 0 && (
//                   <div className="flex justify-between items-center pt-4 border-t border-[#c2c9b1]/20">
//                     <span className="text-[#424937]">Cleaning Fee</span>
//                     <span className="font-bold text-[#191c1d]">${studio.cleaning_fee}</span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Location Card */}
//             <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//               <h3 className="text-xl font-extrabold text-[#191c1d] mb-5 flex items-center gap-2">
//                 <MapPinIcon className="w-6 h-6 text-[#446900]" />
//                 Location
//               </h3>
//               <div className="space-y-2 text-sm">
//                 {studio.street_address && (
//                   <p className="flex justify-between">
//                     <span className="text-[#737a65]">Address</span>
//                     <span className="font-medium text-[#191c1d]">{studio.street_address}</span>
//                   </p>
//                 )}
//                 <p className="flex justify-between">
//                   <span className="text-[#737a65]">City</span>
//                   <span className="font-medium text-[#191c1d]">{studio.city}</span>
//                 </p>
//                 <p className="flex justify-between">
//                   <span className="text-[#737a65]">State</span>
//                   <span className="font-medium text-[#191c1d]">{studio.state}</span>
//                 </p>
//                 {studio.postal_code && (
//                   <p className="flex justify-between">
//                     <span className="text-[#737a65]">Postal Code</span>
//                     <span className="font-medium text-[#191c1d]">{studio.postal_code}</span>
//                   </p>
//                 )}
//                 {studio.country && (
//                   <p className="flex justify-between">
//                     <span className="text-[#737a65]">Country</span>
//                     <span className="font-medium text-[#191c1d]">{studio.country}</span>
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Quick Info Card */}
//             <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//               <h3 className="text-xl font-extrabold text-[#191c1d] mb-5">Studio Info</h3>
//               <div className="space-y-2 text-sm">
//                 <p className="flex justify-between">
//                   <span className="text-[#737a65]">Category</span>
//                   <span className="font-medium text-[#191c1d] capitalize">{studio.category || 'General'}</span>
//                 </p>
//                 <p className="flex justify-between">
//                   <span className="text-[#737a65]">Created</span>
//                   <span className="font-medium text-[#191c1d]">
//                     {new Date(studio.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                   </span>
//                 </p>
//                 <p className="flex justify-between">
//                   <span className="text-[#737a65]">Updated</span>
//                   <span className="font-medium text-[#191c1d]">
//                     {new Date(studio.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="space-y-3">
//               <Link
//                 href={`/owner/studios/${studio.id}/bookings`}
//                 className="flex items-center justify-center gap-2 w-full py-3 bg-[#2e3132] text-white rounded-xl font-bold text-sm hover:bg-[#446900] transition-colors"
//               >
//                 <CalendarIcon className="w-4 h-4" />
//                 View Bookings
//               </Link>
//               <Link
//                 href={`/owner/messages`}
//                 className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#c2c9b1] text-[#191c1d] rounded-xl font-bold text-sm hover:bg-[#edeeef] transition-colors"
//               >
//                 <ChatBubbleLeftIcon className="w-4 h-4" />
//                 View Messages
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import {
//   ArrowLeftIcon,
//   PencilIcon,
//   TrashIcon,
//   CalendarIcon,
//   UsersIcon,
//   MapPinIcon,
//   CurrencyDollarIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   PhotoIcon,
// } from '@heroicons/react/24/outline';

// interface Studio {
//   id: string;
//   name: string;
//   category: string;
//   capacity: number;
//   description: string;
//   street_address: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country: string;
//   hourly_rate: number;
//   daily_rate: number;
//   weekly_rate: number;
//   cleaning_fee: number;
//   amenities: string[];
//   availability: {
//     monday: boolean;
//     tuesday: boolean;
//     wednesday: boolean;
//     thursday: boolean;
//     friday: boolean;
//     saturday: boolean;
//     sunday: boolean;
//     startTime: string;
//     endTime: string;
//   };
//   images: string[];
//   status: string;
//   created_at: string;
//   updated_at: string;
// }

// export default function OwnerStudioDetail() {
//   const params = useParams();
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [studio, setStudio] = useState<Studio | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedImage, setSelectedImage] = useState(0);

//   const studioId = params.id as string;

//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push('/login');
//       return;
//     }
//     if (studioId) {
//       fetchStudio();
//     }
//   }, [studioId, user, authLoading]);

//   const fetchStudio = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const { data, error: fetchError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('id', studioId)
//         .single();

//       if (fetchError) throw fetchError;

//       if (!data) {
//         setError('Studio not found');
//         return;
//       }

//       // Check if the logged-in user owns this studio
//       if (data.owner_id !== user?.id) {
//         setError('You do not have permission to view this studio');
//         return;
//       }

//       setStudio(data);
//     } catch (err: any) {
//       console.error('Error fetching studio:', err);
//       setError(err.message || 'Failed to load studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm('Are you sure you want to delete this studio? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const { error: deleteError } = await supabase
//         .from('studios')
//         .delete()
//         .eq('id', studioId);

//       if (deleteError) throw deleteError;

//       router.push('/owner/studios');
//     } catch (err: any) {
//       console.error('Error deleting studio:', err);
//       alert('Failed to delete studio');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'approved':
//       case 'active':
//         return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500"><CheckCircleIcon className="w-3 h-3" /> Approved</span>;
//       case 'pending':
//         return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500"><ClockIcon className="w-3 h-3" /> Pending Review</span>;
//       case 'rejected':
//         return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500"><XCircleIcon className="w-3 h-3" /> Rejected</span>;
//       default:
//         return <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-400">{status || 'Draft'}</span>;
//     }
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background-dark">
//         <div className="animate-pulse space-y-4">
//           <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
//           <div className="text-primary font-bold">Loading Studio Details...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 max-w-4xl mx-auto">
//         <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
//           <p className="text-red-500 mb-4">{error}</p>
//           <Link href="/owner/studios" className="text-primary hover:underline">
//             ← Back to My Studios
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (!studio) {
//     return (
//       <div className="p-8 max-w-4xl mx-auto">
//         <div className="text-center">
//           <p className="text-slate-400 mb-4">Studio not found</p>
//           <Link href="/owner/studios" className="text-primary hover:underline">
//             ← Back to My Studios
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <Link href="/owner/studios" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
//           <ArrowLeftIcon className="w-4 h-4" />
//           Back to My Studios
//         </Link>
//         <div className="flex gap-3">
//           <Link
//             href={`/owner/studios/${studio.id}/edit`}
//             className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
//           >
//             <PencilIcon className="w-4 h-4" />
//             Edit Studio
//           </Link>
//           <button
//             onClick={handleDelete}
//             className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors"
//           >
//             <TrashIcon className="w-4 h-4" />
//             Delete
//           </button>
//         </div>
//       </div>

//       {/* Image Gallery */}
//       <div className="mb-8">
//         <div className="aspect-video bg-white/5 rounded-xl overflow-hidden mb-4">
//           {studio.images && studio.images.length > 0 ? (
//             <img
//               src={studio.images[selectedImage]}
//               alt={studio.name}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center">
//               <PhotoIcon className="w-16 h-16 text-slate-600" />
//             </div>
//           )}
//         </div>
//         {studio.images && studio.images.length > 1 && (
//           <div className="flex gap-3 overflow-x-auto pb-2">
//             {studio.images.map((img, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setSelectedImage(idx)}
//                 className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
//                   selectedImage === idx ? 'border-primary' : 'border-white/10 opacity-60 hover:opacity-100'
//                 }`}
//               >
//                 <img src={img} alt={`${studio.name} view ${idx + 1}`} className="w-full h-full object-cover" />
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Studio Info */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <h1 className="text-3xl font-black tracking-tight">{studio.name}</h1>
//               {getStatusBadge(studio.status)}
//             </div>
//             <div className="flex items-center gap-4 text-sm text-slate-400">
//               <span className="flex items-center gap-1">
//                 <MapPinIcon className="w-4 h-4" />
//                 {studio.city}, {studio.state}
//               </span>
//               <span className="flex items-center gap-1">
//                 <UsersIcon className="w-4 h-4" />
//                 Up to {studio.capacity} people
//               </span>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-bold mb-2">Description</h3>
//             <p className="text-slate-400 leading-relaxed">{studio.description || 'No description provided.'}</p>
//           </div>

//           <div>
//             <h3 className="text-lg font-bold mb-3">Amenities</h3>
//             <div className="flex flex-wrap gap-2">
//               {studio.amenities && studio.amenities.length > 0 ? (
//                 studio.amenities.map((item) => (
//                   <span key={item} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
//                     {item}
//                   </span>
//                 ))
//               ) : (
//                 <span className="text-slate-500 text-sm">No amenities listed</span>
//               )}
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-bold mb-3">Availability</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-white/5 rounded-lg p-4">
//                 <p className="text-xs text-slate-500 mb-2">Days Available</p>
//                 <div className="flex flex-wrap gap-2">
//                   {studio.availability && Object.entries(studio.availability)
//                     .filter(([key, value]) => value === true && ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(key))
//                     .map(([day]) => (
//                       <span key={day} className="text-sm capitalize">{day.slice(0, 3)}</span>
//                     ))}
//                 </div>
//               </div>
//               <div className="bg-white/5 rounded-lg p-4">
//                 <p className="text-xs text-slate-500 mb-2">Operating Hours</p>
//                 <p className="text-sm">{studio.availability?.startTime || '09:00'} - {studio.availability?.endTime || '22:00'}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Pricing Card */}
//         <div className="space-y-6">
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-lg font-bold mb-4">Pricing</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-slate-400">Hourly Rate</span>
//                 <span className="text-xl font-bold text-primary">${studio.hourly_rate}/hr</span>
//               </div>
//               {studio.daily_rate > 0 && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-400">Daily Rate</span>
//                   <span className="font-medium">${studio.daily_rate}/day</span>
//                 </div>
//               )}
//               {studio.weekly_rate > 0 && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-400">Weekly Rate</span>
//                   <span className="font-medium">${studio.weekly_rate}/week</span>
//                 </div>
//               )}
//               {studio.cleaning_fee > 0 && (
//                 <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-2">
//                   <span className="text-slate-400">Cleaning Fee</span>
//                   <span className="font-medium">${studio.cleaning_fee}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-lg font-bold mb-4">Location Details</h3>
//             <div className="space-y-2 text-sm">
//               <p><span className="text-slate-400">Address:</span> {studio.street_address}</p>
//               <p><span className="text-slate-400">City:</span> {studio.city}</p>
//               <p><span className="text-slate-400">State:</span> {studio.state}</p>
//               <p><span className="text-slate-400">Postal Code:</span> {studio.postal_code}</p>
//               <p><span className="text-slate-400">Country:</span> {studio.country}</p>
//             </div>
//           </div>

//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-lg font-bold mb-4">Studio Information</h3>
//             <div className="space-y-2 text-sm">
//               <p><span className="text-slate-400">Category:</span> {studio.category}</p>
//               <p><span className="text-slate-400">Created:</span> {new Date(studio.created_at).toLocaleDateString()}</p>
//               <p><span className="text-slate-400">Last Updated:</span> {new Date(studio.updated_at).toLocaleDateString()}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }