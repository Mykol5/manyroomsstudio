'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(studio =>
        studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // City filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(studio => studio.city === selectedCity);
    }

    // Price filter
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
  };

  const getFirstImage = (images: string[]) => {
    if (!images || images.length === 0) return null;
    return images[0];
  };

  const formatPrice = (price: number) => {
    return `£${price}`;
  };

  const formatLocation = (city: string, state: string) => {
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    return 'Location TBD';
  };

  return (
    <div className="home-page min-h-screen bg-brand-light text-brand-dark">
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-xl font-medium tracking-widest uppercase">ManyRooms</Link>
          <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
            <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
            <Link href="/spaces" className="hover:opacity-60 transition-opacity text-primary border-b border-primary">Spaces</Link>
            <Link href="/cities" className="hover:opacity-60 transition-opacity">Cities</Link>
            <Link href="/how-it-works" className="hover:opacity-60 transition-opacity">How it works</Link>
            <Link href="/about" className="hover:opacity-60 transition-opacity">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signup?role=owner" className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity">List your space</Link>
            <button className="bg-brand-dark text-white px-6 py-2 rounded-full text-xs uppercase tracking-widest">FIND A SPACE</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-brand-light border-b border-brand-dark/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif mb-6">All Creative Spaces</h1>
          <p className="text-lg text-brand-dark/60 max-w-2xl mx-auto">
            Discover and book the world's most beautiful creative spaces. From photography studios to podcast rooms, find the perfect environment for your next project.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-16 z-40 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, city, or description..."
                className="w-full pl-10 pr-4 py-2 border border-brand-dark/10 rounded-full bg-white/50 focus:outline-none focus:border-primary text-sm"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-brand-dark/10 rounded-full hover:bg-white/50 transition-colors text-sm"
            >
              <FunnelIcon className="w-4 h-4" />
              Filters
              {(selectedCity !== 'all' || priceRange !== 'all') && (
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              )}
            </button>

            {/* Clear Filters */}
            {(searchTerm || selectedCity !== 'all' || priceRange !== 'all') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-brand-dark/50 hover:text-primary transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-brand-dark/10 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">City:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="text-xs border border-brand-dark/10 rounded-full px-3 py-1 bg-white/50"
                >
                  <option value="all">All Cities</option>
                  {cities.filter(c => c !== 'all').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Price per hour:</span>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="text-xs border border-brand-dark/10 rounded-full px-3 py-1 bg-white/50"
                >
                  <option value="all">All</option>
                  <option value="under-100">Under £100</option>
                  <option value="100-200">£100 - £200</option>
                  <option value="200-300">£200 - £300</option>
                  <option value="above-300">Above £300</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Studios Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          {/* Results count */}
          <div className="mb-8 text-sm text-brand-dark/50">
            Showing {filteredStudios.length} {filteredStudios.length === 1 ? 'space' : 'spaces'}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500">Loading spaces...</p>
              </div>
            </div>
          ) : filteredStudios.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-xl font-serif mb-2">No spaces found</h4>
              <p className="text-slate-500 max-w-md mx-auto">
                Try adjusting your filters or search terms to find more spaces.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredStudios.map((studio) => {
                const coverImage = getFirstImage(studio.images);
                return (
                  <Link key={studio.id} href={`/spaces/${studio.id}`} className="space-y-4 group cursor-pointer">
                    <div className="aspect-[4/5] overflow-hidden bg-gray-200 rounded-2xl">
                      {coverImage ? (
                        <img
                          alt={studio.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          src={coverImage}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50">{formatLocation(studio.city, studio.state)}</p>
                        <h4 className="text-2xl mt-1">{studio.name}</h4>
                        <p className="text-sm font-light opacity-60 mt-2 line-clamp-2">{studio.description || 'A beautiful creative space ready for your next project.'}</p>
                        <div className="flex gap-2 mt-4">
                          <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">
                            {studio.category || 'Creative Space'}
                          </span>
                          <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">
                            {studio.capacity}+ Cap
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest opacity-50">From</p>
                        <p className="text-xl">{formatPrice(studio.hourly_rate)}</p>
                        <p className="text-[10px] opacity-40">/ Hour</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}