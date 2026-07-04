// app/dashboard/saved/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  PlusIcon,
  ShareIcon,
  BoltIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface Collection {
  id: string;
  name: string;
  description: string;
  studioCount: number;
  image: string;
  curatedBy: string;
  isFeatured?: boolean;
}

export default function SavedCollectionsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const collections: Collection[] = [
    {
      id: '1',
      name: 'Brooklyn Brutalist',
      description: 'Raw concrete, dramatic scale, and uncompromising geometry across 12 handpicked studios.',
      studioCount: 12,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABpWey5r21b3IyYdtkEYmv8iNl0tQAKf_qa3bcflc3MeDfLQKUUxwS7lxf5Uiyf_H-K9SBCNsY2ljSg17ao4xJ7RdrbaIAZyg-7q1e40y_-tpLLTGgVtij0JuGOy9xQMyau9WTRH0w2CSbixGnxqLnRINV2bkJ1onYqV59HmAV5A5k61k7szyiSD3rrYLuV0fjSJvituevM_1whOyA880d-grxZyLiynPY9EgRXqBqMFRuiGU4Rozc7OVyKuc5J3_pMUa0fOMboCYr',
      curatedBy: 'Creative Collective',
      isFeatured: true,
    },
    {
      id: '2',
      name: 'Vogue Vibes',
      description: 'High-fashion editorial spaces with professional lighting and luxury backdrops.',
      studioCount: 8,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbYYebLg84UM5YMrZb5axGYcXU30n-SMYewhE7Fb5Mc4R_TWFkTw1eCsyNNyG99O5kUhX2omqeBHXHtQ3hxKCWeLj_ZlL577t8_6i_P_1cbYsD5ro81T41ZjEO_Yim2w4hrBLaD9nbfaFhw5i3RdVG_Ywjr-5FfUhAjGaBJ-qURi4MQadlEVqoD85TwOpd_dLQiZDYBRMUK20aueuNsMI3TGu2ERGacrVE_WEBCHoNHAQDYctH-EO8hyU_lniI3XvHaDTcggoz4SId',
      curatedBy: 'Editorial Team',
    },
    {
      id: '3',
      name: 'Sunset Rooftops',
      description: 'Golden hour rooftop studios with panoramic city views and glass architecture.',
      studioCount: 6,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcxDposyF8UhL5KsaSqNckIr_vGXUT64cOqxXJKS1K6wPv7ccRanEgYDehv2pwi9JkvMyIscDiCjn9fd-mDZLfoG8brnzTlnGZoYfG7TNK43vslZIqAL2e2ocRNjfPZmq4i2qYvs6bfBWroT0OXpJdtkwJ-W2snCe9nDqnGTjISq0bDGajrnFIYQq3cd0vqImeKHTAt1gpDVio68TuGymda8GhThD_QwS-XZj0Hw2bNlv84x-CElI_PHtp6vTKfkynM4RgyRukWexe',
      curatedBy: 'Community',
    },
    {
      id: '4',
      name: 'Cyberpunk Neon',
      description: 'Futuristic experimental media labs with neon lighting and digital aesthetics.',
      studioCount: 10,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn584l8E-IydMyg7ON9kkpR6xdeWuAYvyXft3XfP5zQSVAXoazoWW3NPU6onTvc_QFZQ3SDfPuxePxkAiSPVmS-qOFcd9smjE_9vL70QTNQMcmZveXKbmitAocn4kLEemJ2T5oynWKVrEIvSIFQ4ikf-K--EtPuBPSmjzUGmEisVDEmTsOyIZkiUisu0DC1WGsLAy1B4ztmDi69ufbrWA6s2rgHx9nqr6jFiR1jHkzwM2nRYgr6KO28DDgGnBOfMbAYuTNFOg5-vsE',
      curatedBy: 'Tech Team',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-8 pb-24">
        
        {/* Header Section */}
        <header className="mb-14 relative">
          {/* Decorative blur */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#beff5f]/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#a43c12] uppercase tracking-[0.2em] mb-2 block">
                Curated Spaces
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-[#191c1d] leading-none">
                Saved Collections
              </h1>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/40 px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#e7e8e9] transition-all shadow-sm">
                <MaterialIcon icon="filter_list" />
                Sort By
              </button>
              <button className="flex items-center gap-2 bg-[#beff5f] text-[#111f00] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95">
                <PlusIcon className="w-5 h-5" />
                New Collection
              </button>
            </div>
          </div>
        </header>

        {/* Immersive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Collection 1: Brooklyn Brutalist (Hero Card - spans 8 cols) */}
          <div className="md:col-span-8 group relative overflow-hidden rounded-3xl cursor-pointer">
            <div className="aspect-[16/10] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${collections[0].image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Glass card overlay */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex items-end justify-between">
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 md:p-8 rounded-2xl max-w-sm -mb-4 shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h2 className="text-2xl md:text-3xl font-bold text-[#191c1d] mb-2">{collections[0].name}</h2>
                <p className="text-[#424937] text-sm mb-5">
                  {collections[0].studioCount} Studios • Curated by {collections[0].curatedBy}
                </p>
                <div className="flex gap-3">
                  <Link
                    href={`/spaces?vibe=brutalist`}
                    className="bg-[#beff5f] text-[#111f00] px-6 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <BoltIcon className="w-4 h-4" />
                    Book Now
                  </Link>
                  <button className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/80 transition-all">
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <span className="text-white font-bold text-sm flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 hidden md:flex">
                <MaterialIcon icon="imagesmode" />
                Full View
              </span>
            </div>
          </div>

          {/* Collection 2: Vogue Vibes (4 cols) */}
          <div className="md:col-span-4 group relative overflow-hidden rounded-3xl cursor-pointer">
            <div className="aspect-square md:aspect-auto md:h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${collections[1].image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#446900]/40 to-transparent mix-blend-overlay"></div>
            
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-[#191c1d] mb-1">{collections[1].name}</h3>
                <p className="text-[#424937] text-sm mb-4">{collections[1].studioCount} Studios • Photography Ready</p>
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#e1e3e4]"></div>
                    ))}
                  </div>
                  <Link href={`/spaces?vibe=vogue`} className="text-[#446900] font-bold text-sm hover:underline">
                    View All
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Collection 3: Sunset Rooftops (5 cols, offset up) */}
          <div className="md:col-span-5 group relative overflow-hidden rounded-3xl cursor-pointer mt-0 md:-mt-12">
            <div className="aspect-[4/5] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${collections[2].image}')` }}
            />
            <div className="absolute top-6 left-6 bg-[#beff5f] text-[#111f00] px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest">
              Top Rated
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 translate-y-8 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-[#191c1d]">{collections[2].name}</h3>
                <div className="mt-4 flex gap-2">
                  <Link href={`/spaces?vibe=rooftop`} className="bg-[#beff5f] text-[#111f00] flex-1 py-3 rounded-xl font-bold text-sm text-center">
                    Quick Book
                  </Link>
                  <button className="bg-[#191c1d] text-white px-4 rounded-xl">
                    <MaterialIcon icon="favorite" className="mt-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Collection 4: Cyberpunk Neon (7 cols) */}
          <div className="md:col-span-7 group relative overflow-hidden rounded-3xl cursor-pointer">
            <div className="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${collections[3].image}')` }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
            <div className="absolute bottom-8 right-8 text-right">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
                Cyberpunk<br/>Neon
              </h2>
              <p className="text-white/80 text-lg mt-2">Experimental Media Labs</p>
            </div>
          </div>
        </div>

        {/* Floating Alert Element */}
        <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 w-48 animate-float z-10">
          <div className="bg-white/80 backdrop-blur-xl border border-[#beff5f]/20 p-6 rounded-3xl shadow-2xl rotate-12">
            <SparklesIcon className="w-8 h-8 text-[#446900] mb-3" />
            <p className="font-bold text-sm text-[#446900]">New Studio Alert!</p>
            <p className="text-xs text-[#424937] mt-1">A Brutalist Loft just opened in SoHo.</p>
          </div>
        </div>

        {/* Pagination / Load More */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center gap-6">
            <p className="text-lg text-[#424937] italic">Showing 4 of 28 Curated Moodboards</p>
            <button className="group flex items-center gap-4 bg-transparent border-2 border-[#446900] text-[#446900] px-12 py-5 rounded-full text-2xl font-extrabold hover:bg-[#446900] hover:text-white transition-all duration-300">
              Explore More
              <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom animation */}
      <style jsx>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-15px) rotate(12deg); }
        }
        .animate-float {
          animation: subtle-float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}


// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import {
//   FolderOpenIcon,
//   PlusIcon,
//   ShareIcon,
//   PencilIcon,
//   EllipsisHorizontalIcon,
//   PlusCircleIcon,
//   MagnifyingGlassIcon,
//   BellIcon,
//   UserCircleIcon,
// } from '@heroicons/react/24/outline';

// // Material Icon component for icons not in Heroicons
// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface Collection {
//   id: string;
//   name: string;
//   description?: string;
//   itemCount: number;
//   image: string;
//   modifiedAt: string;
//   isFeatured?: boolean;
//   tags?: string[];
// }

// export default function ClientStudios() {
//   const [activeTab, setActiveTab] = useState('collections');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Featured collection data
//   const featuredCollection = {
//     id: 'featured',
//     name: 'Summer Campaign 2024',
//     description: 'A curated selection of minimalist urban lofts and brutalist concrete spaces for the upcoming seasonal brand photoshoot.',
//     itemCount: 24,
//     image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWUoG_4LBt8RJmdfsqIxmMpMPpdsF5mKJrPQsy6wRWspm4WkL1RWT4jp5X2bET3H5hpiUVDihiBtkU8BdcLjh8PA_De6NItr9bxSQISwFlHuoHRS2SjFvnPOY_W3oo5cBz9oEVSrziU4RT4ZB--Ki4IcStRzaoNS7LLpuPD7nAkljkLVC3q9RPNbUHTsenszCo4JxE2P-bho91Qxzn7WmtftpIF_r3ILec7-LSpECBTtVI2woE6kFnWI0tcnNkTKkWUMxUJ_0uZDX0',
//     modifiedAt: 'Today',
//     isFeatured: true,
//     tags: ['Updated Today', '24 Elements'],
//   };

//   // Collections data
//   const [collections] = useState<Collection[]>([
//     {
//       id: '1',
//       name: 'Podcast Ideas',
//       itemCount: 8,
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI9VPN3qRMrnmJf6-dtleYvlub7AUkzBgWiqk3rGhpT68lM8VtZXb4n2JR8OeOPOfg6VXpRgGzW7sJzb6BBUF45OYexBX1HDfBTG2TZB6_hjANhnnlXBmezXuGvXIOoLGrfuzuEUe97vQiT01v-6JAIAnZRGuaZjopI8bMmuZ9Mg3rS3QMaZrzjYIat6hCH7HsqZfLVKabXaK6Gayx5_XgtUAvvYhA-ZDz54_JUk3kGc7wrDNtDOmYgPQUSuGZZb8JddYTgJBO6b1Y',
//       modifiedAt: '2 days ago',
//     },
//     {
//       id: '2',
//       name: 'Tech Launch Event',
//       itemCount: 14,
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd1ivrnRofQAQ2knux0r1QUAWwvNoHHZ3RgTE3gP5bqkYURQkQryErRzZrF7vBqzYBWbhpOF5FGgB-rfClKS9wlzt5Q70tsZy78yQNVgGrrXFPJO30FN5gTcBSiOOFTLT-0vGn71aZi8_K74zjQld5EqZ6Y9smupILj7kFEpEDjlaG8H-qRldQ0QrwYDwdr2hBxYJ9V0lnfC_kLEE2zq7bp3YS1nzNO3ABc_A5IHSmROuVSxgy276kg6HSlTszsw6hsEAxcmMJyUvN',
//       modifiedAt: '1 week ago',
//     },
//     {
//       id: '3',
//       name: 'Interview Series',
//       itemCount: 5,
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD48uH3-NXPHBsFO99Dydii3qDGUwJqhyksK32WDDMy5nRp0ifsjF0v_UBrzxKs5TK-OyGCv4__Lu2Xom6RLumgYypq25B7lT0tzlcHYk8pj8rGs994yEkxfKLrBmuFtrjnWUCWRx6QC5nLt2n--qjyT3sxdmYoZjBlXmeFVRE774KQB4aMAdFMrK6i8fQvgl12_I0wzmb9Gf_ZykmFMEa3Yu22D2jr7_EtMJRbBIBoGFSjGtmp8K7RTAT6PY5yKLSbgA33ZsvGDL3P',
//       modifiedAt: '3 weeks ago',
//     },
//   ]);

//   const tabs = [
//     { id: 'collections', label: 'All Collections', count: collections.length + 1 },
//     { id: 'individual', label: 'Individual Studios', count: 0 },
//     { id: 'collaborative', label: 'Collaborative', count: 0 },
//     { id: 'recent', label: 'Recently Viewed', count: 0 },
//   ];

//   const handleCreateCollection = () => {
//     alert('Create new collection feature coming soon!');
//   };

//   const handleShare = (collectionId: string) => {
//     console.log('Share collection:', collectionId);
//   };

//   const handleEdit = (collectionId: string) => {
//     console.log('Edit collection:', collectionId);
//   };

//   const filteredCollections = collections.filter(collection =>
//     collection.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="flex-1 pt-24 pb-12 px-6 lg:px-12">
//       {/* Hero Title Section */}
//       <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
//         <div>
//           <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
//             Premium Curation
//           </span>
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none">
//             Saved Studios<br />
//             <span className="text-white/40">&amp; Collections</span>
//           </h1>
//         </div>
//         <div className="flex gap-3">
//           <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/10">
//             <FolderOpenIcon className="w-5 h-5" />
//             Archive
//           </button>
//           <button
//             onClick={handleCreateCollection}
//             className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-lg shadow-primary/20"
//           >
//             <PlusIcon className="w-5 h-5" />
//             New Collection
//           </button>
//         </div>
//       </section>

//       {/* Featured Large Card */}
//       <section className="mb-12 group">
//         <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
//           <div
//             className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
//             style={{ backgroundImage: `url('${featuredCollection.image}')` }}
//           ></div>
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-dark/90"></div>
//           <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
//             <div>
//               <div className="flex items-center gap-2 mb-3">
//                 <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
//                   Updated Today
//                 </span>
//                 <span className="text-white/60 text-xs font-medium uppercase tracking-widest">
//                   • {featuredCollection.itemCount} Elements
//                 </span>
//               </div>
//               <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{featuredCollection.name}</h2>
//               <p className="text-white/60 max-w-xl text-sm md:text-base leading-relaxed">
//                 {featuredCollection.description}
//               </p>
//             </div>
//             <button className="whitespace-nowrap flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-background-dark font-extrabold text-sm hover:scale-105 transition-transform">
//               Open Collection
//               <MaterialIcon icon="arrow_forward" />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Search Bar (Mobile/Tablet) */}
//       <div className="lg:hidden mb-8">
//         <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2">
//           <MagnifyingGlassIcon className="w-5 h-5 text-white/40" />
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Quick search..."
//             className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-white/30 w-full ml-2 text-white outline-none"
//           />
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="flex items-center gap-10 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
//               activeTab === tab.id
//                 ? 'border-primary text-white'
//                 : 'border-transparent text-white/40 hover:text-white/70'
//             }`}
//           >
//             {tab.label}
//             <span className="bg-white/10 px-2 py-0.5 rounded text-[10px]">
//               {tab.count}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Collections Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {filteredCollections.map((collection) => (
//           <div key={collection.id} className="group flex flex-col gap-4">
//             <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/5 shadow-lg group-hover:shadow-primary/5 transition-all">
//               <div
//                 className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
//                 style={{ backgroundImage: `url('${collection.image}')` }}
//               ></div>
//               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
//               <div className="absolute top-4 right-4 flex gap-2">
//                 <button
//                   onClick={() => handleShare(collection.id)}
//                   className="size-10 rounded-full bg-background-dark/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300"
//                 >
//                   <ShareIcon className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => handleEdit(collection.id)}
//                   className="size-10 rounded-full bg-background-dark/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 delay-75 duration-300"
//                 >
//                   <PencilIcon className="w-5 h-5" />
//                 </button>
//               </div>
//               <div className="absolute bottom-4 left-4">
//                 <span className="bg-background-dark/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5">
//                   <MaterialIcon icon="grid_view" className="text-sm" />
//                   {collection.itemCount} Items
//                 </span>
//               </div>
//             </div>
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">
//                   {collection.name}
//                 </h3>
//                 <p className="text-white/40 text-xs font-medium uppercase tracking-tighter mt-1">
//                   Modified {collection.modifiedAt}
//                 </p>
//               </div>
//               <button className="text-white/20 hover:text-white/40 transition-colors">
//                 <EllipsisHorizontalIcon className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         ))}

//         {/* Empty State / New Card Style */}
//         <button
//           onClick={handleCreateCollection}
//           className="group relative aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer"
//         >
//           <div className="size-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
//             <PlusCircleIcon className="w-8 h-8 text-white/40 group-hover:text-primary transition-colors" />
//           </div>
//           <div className="text-center">
//             <p className="text-white/60 font-bold">Create New Folder</p>
//             <p className="text-white/20 text-[10px] font-medium uppercase tracking-widest mt-1">
//               Start fresh curation
//             </p>
//           </div>
//         </button>
//       </div>

//       {/* Empty State Message */}
//       {filteredCollections.length === 0 && (
//         <div className="text-center py-16">
//           <MaterialIcon icon="folder_open" className="text-6xl text-white/20 mb-4" />
//           <p className="text-white/60">No collections found</p>
//           <button
//             onClick={handleCreateCollection}
//             className="mt-4 text-primary hover:text-primary/80 text-sm font-medium"
//           >
//             Create your first collection
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }