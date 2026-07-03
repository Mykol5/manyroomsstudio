'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, HeartIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import Chatbot from '@/components/Chatbot';
import Footer from '@/components/Footer';

interface Studio {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  hourly_rate: number;
  images: string[];
  status: string;
  description: string;
  category: string;
  capacity: number;
}

export default function AllSpacesPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique cities from studios
  const cities = ['all', ...new Set(studios.map(s => s.city).filter(Boolean))];

  useEffect(() => {
    fetchApprovedStudios();
  }, []);

  useEffect(() => {
    filterStudios();
  }, [searchTerm, selectedCity, priceRange, studios]);

  const fetchApprovedStudios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('studios')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudios(data || []);
      setFilteredStudios(data || []);
    } catch (error) {
      console.error('Error fetching studios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudios = () => {
    let filtered = [...studios];

    if (searchTerm) {
      filtered = filtered.filter(studio =>
        studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(studio => studio.city === selectedCity);
    }

    if (priceRange !== 'all') {
      if (priceRange === 'under-100') {
        filtered = filtered.filter(studio => studio.hourly_rate < 100);
      } else if (priceRange === '100-200') {
        filtered = filtered.filter(studio => studio.hourly_rate >= 100 && studio.hourly_rate <= 200);
      } else if (priceRange === '200-300') {
        filtered = filtered.filter(studio => studio.hourly_rate > 200 && studio.hourly_rate <= 300);
      } else if (priceRange === 'above-300') {
        filtered = filtered.filter(studio => studio.hourly_rate > 300);
      }
    }

    setFilteredStudios(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setPriceRange('all');
    setShowFilters(false);
  };

  const getFirstImage = (images: string[]) => {
    if (!images || images.length === 0) return null;
    return images[0];
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  const formatLocation = (city: string, state: string) => {
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    return 'Location TBD';
  };

  const vibeTags = [
    'Brutalist',
    'Organic',
    'Sci-Fi Neon',
    'Minimalist',
    'High-Key'
  ];

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] font-body-md overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
        <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-display-sm tracking-tighter text-[#446900]">
              ManyRooms
            </Link>
            <div className="hidden md:flex gap-6 items-center">
              <Link href="/" className="text-[#424937] hover:text-[#446900] transition-colors font-label-bold text-sm">
                Marketplace
              </Link>
              <Link href="/spaces" className="text-[#446900] font-bold border-b-2 border-[#446900] font-label-bold text-sm">
                Studios
              </Link>
              <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors font-label-bold text-sm">
                Vibes
              </Link>
              <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors font-label-bold text-sm">
                Journal
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden lg:flex material-symbols-outlined text-[#424937] hover:scale-105 transition-transform">
              favorite
            </button>
            <button className="material-symbols-outlined text-[#424937] hover:scale-105 transition-transform">
              account_circle
            </button>
            <Link 
              href="/signup?role=owner"
              className="bg-[#446900] text-white px-6 py-2 rounded-full font-label-bold text-sm hover:scale-105 transition-transform duration-200 active:scale-95"
            >
              List Studio
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 md:px-16 max-w-[1440px] mx-auto">
        {/* Header & AI Visual Search */}
        <section className="mb-12 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <h1 className="font-display-lg text-4xl md:text-[84px] text-[#191c1d] leading-tight">
                Find your next <span className="text-[#446900] italic">Creative Era.</span>
              </h1>
              <p className="text-lg text-[#424937] mt-4">
                Discover production-ready spaces designed for the next generation of digital creators.
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex items-center gap-2 bg-[#e7e8e9] px-4 py-2 rounded-full font-label-bold text-sm hover:bg-[#beff5f] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">{viewMode === 'grid' ? 'grid_view' : 'list'}</span>
                {viewMode === 'grid' ? 'Grid View' : 'List View'}
              </button>
            </div>
          </div>

          {/* AI Image Search Bar */}
          <div className="relative group max-w-4xl mx-auto md:mx-0">
            <div className="flex items-center bg-white shadow-xl rounded-2xl p-2 border border-[#c2c9b1]/30 hover:border-[#beff5f] transition-all duration-300">
              <span className="material-symbols-outlined px-4 text-[#737a65]">search</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-base py-4 outline-none" 
                placeholder="Search by vibe, mood, or equipment..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="h-8 w-px bg-[#c2c9b1] mx-2"></div>
              <button className="flex items-center gap-2 bg-[#e4d7fd] text-[#665c7c] px-6 py-3 rounded-xl font-label-bold text-sm hover:bg-[#beff5f] transition-colors shrink-0">
                <span className="material-symbols-outlined">add_a_photo</span>
                <span className="hidden md:inline">Visual Search</span>
              </button>
            </div>

            {/* Vibe Chips */}
            <div className="flex flex-wrap gap-2 mt-6">
              {vibeTags.map((tag) => (
                <span 
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-[#b5f657] text-[#111f00] font-label-bold text-[10px] tracking-[0.1em] uppercase cursor-pointer hover:scale-105 transition-transform"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Area: Filter + Asymmetric Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-72 shrink-0 space-y-10">
            <div className="space-y-6">
              <h3 className="font-headline-lg text-xl text-[#191c1d]">Filters</h3>
              
              {/* Availability */}
              <div className="space-y-3">
                <p className="font-label-bold text-sm text-[#424937] uppercase tracking-widest">Availability</p>
                <div className="flex items-center gap-3 bg-[#f3f4f5] p-3 rounded-xl border border-[#c2c9b1]/30">
                  <span className="material-symbols-outlined text-[#446900]">calendar_today</span>
                  <span className="text-base">Pick a Date</span>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <p className="font-label-bold text-sm text-[#424937] uppercase tracking-widest">Price / Hour</p>
                <div className="px-2">
                  <input 
                    type="range" 
                    className="w-full h-1 bg-[#c2c9b1] rounded-lg appearance-none cursor-pointer accent-[#446900]" 
                    min="20" 
                    max="500" 
                    value="200"
                  />
                  <div className="flex justify-between mt-2 font-label-bold text-xs text-[#424937]">
                    <span>$20</span>
                    <span>$500+</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <p className="font-label-bold text-sm text-[#424937] uppercase tracking-widest">Equipment</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded text-[#446900] focus:ring-[#446900] h-5 w-5 border-[#737a65]" />
                    <span className="text-base group-hover:text-[#446900] transition-colors">Continuous Lighting</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded text-[#446900] focus:ring-[#446900] h-5 w-5 border-[#737a65]" />
                    <span className="text-base group-hover:text-[#446900] transition-colors">Green Screen</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="rounded text-[#446900] focus:ring-[#446900] h-5 w-5 border-[#737a65]" />
                    <span className="text-base group-hover:text-[#446900] transition-colors">Makeup Station</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={clearFilters}
                className="w-full bg-[#191c1d] text-[#f8f9fa] py-4 rounded-xl font-label-bold text-sm hover:scale-[1.02] active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </div>

            {/* Featured Highlight */}
            <div className="relative group rounded-3xl overflow-hidden bg-[#635979] text-white p-6 h-96 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <img 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPNY0T4vIaki9tKiv9eGEIHCWM1oGvCu6tz6v-f8mneuQX38csFXQhsLxScQrdRjjZGH56wQ3oVY_0QDrzEA_RawlFn29OYQlT0Y9rt4XWjf-SlFKUp1wacLEu7DC_NZlpThkoXn0Doqte1pXDkP4yXLJRJ045vmDV0MHeczfw1A7ubctQc-CuBzIYWXXPwodv2vjmfH7fMnvHHS0_Rdma-f5pd79k2i_wczhmHcsBe0HYMcLBVZ78xubQA2vX09nuIw9iToSV13NA"
                  alt="The Concrete Vault"
                />
              </div>
              <div className="relative z-10">
                <span className="bg-[#b5f657] text-[#111f00] px-3 py-1 rounded-full font-label-bold text-[10px] mb-4 inline-block uppercase tracking-tighter">
                  Spotlight
                </span>
                <h4 className="font-headline-lg text-xl leading-tight mb-2">The Concrete Vault</h4>
                <p className="text-base opacity-80 mb-4">Brutalist aesthetics for high-fashion campaigns.</p>
                <button className="flex items-center gap-2 font-label-bold text-sm group-hover:gap-4 transition-all">
                  View Space <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Listing Grid */}
          <div className="flex-1">
            {/* Results count */}
            <div className="mb-8 text-sm text-[#424937]">
              Showing {filteredStudios.length} {filteredStudios.length === 1 ? 'space' : 'spaces'}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-pulse text-center">
                  <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
                  <p className="text-[#424937]">Loading spaces...</p>
                </div>
              </div>
            ) : filteredStudios.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 text-[#737a65]">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-xl font-medium mb-2">No spaces found</h4>
                <p className="text-[#424937] max-w-md mx-auto">
                  Try adjusting your filters or search terms to find more spaces.
                </p>
                <button onClick={clearFilters} className="mt-6 text-[#446900] hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-12">
                {filteredStudios.map((studio, index) => {
                  const coverImage = getFirstImage(studio.images);
                  const isEven = index % 2 === 1;
                  
                  return (
                    <div key={studio.id} className={`group relative flex flex-col h-full ${isEven ? 'mt-0 md:mt-12' : ''}`}>
                      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-lg mb-0 transition-all duration-500 group-hover:shadow-2xl">
                        {coverImage ? (
                          <img 
                            src={coverImage}
                            alt={studio.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
                          </div>
                        )}
                        <div className="absolute top-6 right-6 z-10">
                          <button className="bg-white/80 backdrop-blur-md p-3 rounded-full hover:bg-[#beff5f] transition-colors shadow-sm">
                            <HeartIcon className="w-5 h-5 text-[#191c1d]" />
                          </button>
                        </div>
                      </div>

                      {/* Glass Card Overlay */}
                      <div className="bg-white/70 backdrop-blur-[20px] border border-white/40 -mt-8 p-8 mx-4 rounded-3xl shadow-xl relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-headline-lg text-xl text-[#191c1d] leading-none mb-1">{studio.name}</h3>
                            <div className="flex items-center gap-1 text-[#424937]">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                              <span className="font-label-bold text-xs uppercase tracking-wider">
                                {formatLocation(studio.city, studio.state)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-display-sm text-2xl text-[#446900]">
                              {formatPrice(studio.hourly_rate)}
                              <span className="text-sm font-body-md text-[#424937]">/hr</span>
                            </div>
                            <div className="flex items-center gap-1 justify-end mt-1 text-[#424937]">
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              <span className="font-label-bold text-xs">4.9 (124)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-6">
                          <span className="bg-[#e4d7fd] text-[#665c7c] px-3 py-1 rounded-full font-label-bold text-[10px] tracking-[0.1em] uppercase">
                            {studio.category || 'Creative'}
                          </span>
                          <span className="bg-[#e7e8e9] text-[#424937] px-3 py-1 rounded-full font-label-bold text-[10px] tracking-[0.1em] uppercase">
                            {studio.capacity} Cap
                          </span>
                        </div>

                        <Link 
                          href={`/spaces/${studio.id}`}
                          className="w-full bg-[#446900] text-white py-4 rounded-2xl font-label-bold text-sm hover:scale-[1.02] active:scale-95 transition-all block text-center"
                        >
                          Quick Book
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {filteredStudios.length > 0 && (
              <div className="mt-20 flex justify-center">
                <button className="group flex items-center gap-4 bg-[#e1e3e4] px-12 py-4 rounded-full font-label-bold text-sm hover:bg-[#191c1d] hover:text-[#f8f9fa] transition-all duration-300">
                  Discover More Spaces
                  <span className="material-symbols-outlined group-hover:rotate-45 transition-transform">add</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      <Chatbot />

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}




// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   country: string;
//   hourly_rate: number;
//   images: string[];
//   status: string;
//   description: string;
//   category: string;
//   capacity: number;
// }

// export default function AllSpacesPage() {
//   const [studios, setStudios] = useState<Studio[]>([]);
//   const [filteredStudios, setFilteredStudios] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCity, setSelectedCity] = useState('all');
//   const [priceRange, setPriceRange] = useState('all');
//   const [showFilters, setShowFilters] = useState(false);

//   // Get unique cities from studios
//   const cities = ['all', ...new Set(studios.map(s => s.city).filter(Boolean))];

//   useEffect(() => {
//     fetchApprovedStudios();
//   }, []);

//   useEffect(() => {
//     filterStudios();
//   }, [searchTerm, selectedCity, priceRange, studios]);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setStudios(data || []);
//       setFilteredStudios(data || []);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterStudios = () => {
//     let filtered = [...studios];

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(studio =>
//         studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         studio.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         studio.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // City filter
//     if (selectedCity !== 'all') {
//       filtered = filtered.filter(studio => studio.city === selectedCity);
//     }

//     // Price filter
//     if (priceRange !== 'all') {
//       if (priceRange === 'under-100') {
//         filtered = filtered.filter(studio => studio.hourly_rate < 100);
//       } else if (priceRange === '100-200') {
//         filtered = filtered.filter(studio => studio.hourly_rate >= 100 && studio.hourly_rate <= 200);
//       } else if (priceRange === '200-300') {
//         filtered = filtered.filter(studio => studio.hourly_rate > 200 && studio.hourly_rate <= 300);
//       } else if (priceRange === 'above-300') {
//         filtered = filtered.filter(studio => studio.hourly_rate > 300);
//       }
//     }

//     setFilteredStudios(filtered);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedCity('all');
//     setPriceRange('all');
//   };

//   const getFirstImage = (images: string[]) => {
//     if (!images || images.length === 0) return null;
//     return images[0];
//   };

//   const formatPrice = (price: number) => {
//     return `£${price}`;
//   };

//   const formatLocation = (city: string, state: string) => {
//     if (city && state) return `${city}, ${state}`;
//     if (city) return city;
//     return 'Location TBD';
//   };

//   return (
//     <div className="home-page min-h-screen bg-brand-light text-brand-dark">
//       {/* Navigation */}
//       <nav className="sticky top-0 w-full z-50 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
//         <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
//           <Link href="/" className="text-xl font-medium tracking-widest uppercase">ManyRooms</Link>
//           <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
//             <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
//             <Link href="/spaces" className="hover:opacity-60 transition-opacity text-primary border-b border-primary">Spaces</Link>
//             <Link href="/cities" className="hover:opacity-60 transition-opacity">Cities</Link>
//             <Link href="/how-it-works" className="hover:opacity-60 transition-opacity">How it works</Link>
//             <Link href="/about" className="hover:opacity-60 transition-opacity">About</Link>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link href="/signup?role=owner" className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity">List your space</Link>
//             <button className="bg-brand-dark text-white px-6 py-2 rounded-full text-xs uppercase tracking-widest">FIND A SPACE</button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="py-20 px-6 bg-brand-light border-b border-brand-dark/5">
//         <div className="container mx-auto text-center max-w-4xl">
//           <h1 className="text-5xl md:text-6xl font-serif mb-6">All Creative Spaces</h1>
//           <p className="text-lg text-brand-dark/60 max-w-2xl mx-auto">
//             Discover and book the world's most beautiful creative spaces. From photography studios to podcast rooms, find the perfect environment for your next project.
//           </p>
//         </div>
//       </section>

//       {/* Search and Filters */}
//       <section className="sticky top-16 z-40 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             {/* Search Bar */}
//             <div className="relative flex-1 max-w-md w-full">
//               <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/40" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by name, city, or description..."
//                 className="w-full pl-10 pr-4 py-2 border border-brand-dark/10 rounded-full bg-white/50 focus:outline-none focus:border-primary text-sm"
//               />
//             </div>

//             {/* Filter Toggle Button */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 px-4 py-2 border border-brand-dark/10 rounded-full hover:bg-white/50 transition-colors text-sm"
//             >
//               <FunnelIcon className="w-4 h-4" />
//               Filters
//               {(selectedCity !== 'all' || priceRange !== 'all') && (
//                 <span className="w-2 h-2 bg-primary rounded-full"></span>
//               )}
//             </button>

//             {/* Clear Filters */}
//             {(searchTerm || selectedCity !== 'all' || priceRange !== 'all') && (
//               <button
//                 onClick={clearFilters}
//                 className="flex items-center gap-1 text-xs text-brand-dark/50 hover:text-primary transition-colors"
//               >
//                 <XMarkIcon className="w-3 h-3" />
//                 Clear all
//               </button>
//             )}
//           </div>

//           {/* Filter Panel */}
//           {showFilters && (
//             <div className="mt-4 pt-4 border-t border-brand-dark/10 flex flex-wrap gap-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-xs font-medium">City:</span>
//                 <select
//                   value={selectedCity}
//                   onChange={(e) => setSelectedCity(e.target.value)}
//                   className="text-xs border border-brand-dark/10 rounded-full px-3 py-1 bg-white/50"
//                 >
//                   <option value="all">All Cities</option>
//                   {cities.filter(c => c !== 'all').map(city => (
//                     <option key={city} value={city}>{city}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="text-xs font-medium">Price per hour:</span>
//                 <select
//                   value={priceRange}
//                   onChange={(e) => setPriceRange(e.target.value)}
//                   className="text-xs border border-brand-dark/10 rounded-full px-3 py-1 bg-white/50"
//                 >
//                   <option value="all">All</option>
//                   <option value="under-100">Under £100</option>
//                   <option value="100-200">£100 - £200</option>
//                   <option value="200-300">£200 - £300</option>
//                   <option value="above-300">Above £300</option>
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Studios Grid */}
//       <section className="py-16 px-6">
//         <div className="container mx-auto">
//           {/* Results count */}
//           <div className="mb-8 text-sm text-brand-dark/50">
//             Showing {filteredStudios.length} {filteredStudios.length === 1 ? 'space' : 'spaces'}
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-slate-500">Loading spaces...</p>
//               </div>
//             </div>
//           ) : filteredStudios.length === 0 ? (
//             <div className="text-center py-20">
//               <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
//                 <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//               </div>
//               <h4 className="text-xl font-serif mb-2">No spaces found</h4>
//               <p className="text-slate-500 max-w-md mx-auto">
//                 Try adjusting your filters or search terms to find more spaces.
//               </p>
//               <button
//                 onClick={clearFilters}
//                 className="mt-6 text-primary hover:underline"
//               >
//                 Clear all filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
//               {filteredStudios.map((studio) => {
//                 const coverImage = getFirstImage(studio.images);
//                 return (
//                   <Link key={studio.id} href={`/spaces/${studio.id}`} className="space-y-4 group cursor-pointer">
//                     <div className="aspect-[4/5] overflow-hidden bg-gray-200 rounded-2xl">
//                       {coverImage ? (
//                         <img
//                           alt={studio.name}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                           src={coverImage}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-widest opacity-50">{formatLocation(studio.city, studio.state)}</p>
//                         <h4 className="text-2xl mt-1">{studio.name}</h4>
//                         <p className="text-sm font-light opacity-60 mt-2 line-clamp-2">{studio.description || 'A beautiful creative space ready for your next project.'}</p>
//                         <div className="flex gap-2 mt-4">
//                           <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">
//                             {studio.category || 'Creative Space'}
//                           </span>
//                           <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">
//                             {studio.capacity}+ Cap
//                           </span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[10px] uppercase tracking-widest opacity-50">From</p>
//                         <p className="text-xl">{formatPrice(studio.hourly_rate)}</p>
//                         <p className="text-[10px] opacity-40">/ Hour</p>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />

//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// }