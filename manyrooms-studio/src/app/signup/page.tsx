'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, Bars3Icon, XMarkIcon, GlobeAltIcon, PlayIcon, StarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import './home.css';
import Chatbot from '@/components/Chatbot';
import Footer from '@/components/Footer';

interface Studio {
  id: string;
  name: string;
  city: string;
  state: string;
  hourly_rate: number;
  images: string[];
  status: string;
  description: string;
}

export default function HomePage() {
  const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDo9P8cWMtlxC-vTKW_d789xE15ySyxsMb_U8Qe2iYrUWUJBlZ11z5sKoQQW5e-jeLwqaQOM0Kgb7ebgD6PqdUAKnW2S18GHubom8jAuDBqLBKkgP-ja77FpNibRKYP2eTFbt1LWmw_r-Tcwy29nP0kT3ERHsQ7AALtSKG623o-AmbEdIQSysiYVdkv3wzhPfpeuqsQUGNGfe0yYSqFPrzrb85t6zX4hO_Sp7K94b89goSxv0XdXC3e8wP-E5VGz5gk57zVVUbwzSDM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDSwmSKLUnWOMsQ3GugJdlOZS5BByKJaiEs61TyG209DcA2Bqys9Or3aAbjaOFLiR8KH9xts5is8WOCU89o8TxY4EuPTx3Y7eINF0W0JjMW8ZZ5xYUZB5ThUYmjzzq6EERLeNzzD0U1o50RoOSqZqR1kCc67u55wSoCa7qKpALt43g75uDvONV3VOrCUDZoDHw_1nvmvMdKyGSZQvV-ffQc-yIuf-LaLoT3SWHaSi85V5-kEkwfNlO-MZv8WnnM-HWMlBvx5TYjJB6F'
  ];

  // Fetch approved studios from Supabase
  useEffect(() => {
    fetchApprovedStudios();
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add('py-2', 'shadow-md');
          nav.classList.remove('py-4', 'shadow-sm');
        } else {
          nav.classList.add('py-4', 'shadow-sm');
          nav.classList.remove('py-2', 'shadow-md');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchApprovedStudios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('studios')
        .select('*')
        .eq('status', 'approved')
        .limit(3);

      if (error) throw error;
      setFeaturedSpaces(data || []);
    } catch (error) {
      console.error('Error fetching studios:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFirstImage = (images: string[]) => {
    if (!images || images.length === 0) return null;
    return images[0];
  };

  return (
    <div className="home-page bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="group">
              <img 
                alt="ManyRooms Logo" 
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9DZnYRdMuRfh66s2y0aufTN6zhyFmIsA5aK66cuCBeLINs4QoP8IyjpBAQjHuPpHixsYPB1HMPOBhT7mUKu2qy7il9h__oTnAUvQ8EU5qv270iXUsGRbz-PlJjGMU5ixs4CUyHd9GoHjR9KulnOy4sz-3QN2VkRzW39ONL6ynO2nSLAUh3VRvj_U51r7i6CxOGm9pnjSOVDUTZd2P3m_LTCAchKE5VwHb0k6YYjDoduMHQU4iyejUYtTsGr0VhJR4tasKZ-e6qrWQ"
              />
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/" className="text-primary font-bold border-b-2 border-primary py-1 transition-all hover:scale-105">Marketplace</Link>
              <Link href="/spaces" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Studios</Link>
              <Link href="/cities" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Vibes</Link>
              <Link href="/about" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Journal</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/signup?role=owner" 
              className="hidden md:flex bg-primary-container text-on-primary-container font-label-bold px-6 py-2 rounded-full hover:scale-105 transition-all hover:shadow-lg active:scale-95"
            >
              List Studio
            </Link>
            <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full hidden md:block">
              favorite
            </span>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full"
            >
              account_circle
            </button>
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-primary/5 rounded-full transition-all"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div 
          className={`absolute top-0 right-0 h-full w-[300px] bg-surface shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-10">
              <span className="text-2xl font-bold text-primary">ManyRooms</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-primary/5 rounded-full transition-all"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              <Link 
                href="/" 
                className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="/spaces" 
                className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Studios
              </Link>
              <Link 
                href="/cities" 
                className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Vibes
              </Link>
              <Link 
                href="/about" 
                className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Journal
              </Link>
              
              <div className="border-t border-outline-variant/30 pt-6 mt-2">
                <Link 
                  href="/signup?role=owner" 
                  className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  List Studio
                </Link>
                <Link 
                  href="/login" 
                  className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  href="/signup" 
                  className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
                <Link 
                  href="/support" 
                  className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Support
                </Link>
                <button className="flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
                  <GlobeAltIcon className="w-4 h-4" />
                  Language
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Login/Signup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-primary/5 rounded-full transition-all"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-on-surface mb-2">Welcome to ManyRooms</h3>
              <p className="text-sm text-on-surface-variant">Find and book the perfect creative space</p>
            </div>

            <div className="space-y-4">
              <Link 
                href="/login" 
                className="block w-full text-center bg-primary text-on-primary py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="block w-full text-center border border-outline/30 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/5 transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                Sign up
              </Link>
              <div className="border-t border-outline-variant/30 pt-4 mt-2">
                <Link 
                  href="/signup?role=owner" 
                  className="block w-full text-center text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  List your space
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Carousel */}
      <section className="relative h-[90vh] md:h-[95vh] flex items-center justify-center px-6 md:px-16 overflow-hidden">
        {/* Hero Gallery Background */}
        <div className="absolute inset-0 z-0 bg-surface">
          <div className="relative w-full h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1500 ease-in-out bg-cover bg-center ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url('${image}')`,
                  animation: index === currentSlide ? 'hero-zoom 12s linear infinite alternate' : 'none'
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/15 to-surface"></div>
          </div>
        </div>

        <div className={`relative z-10 text-center max-w-4xl mx-auto pt-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6 inline-block bg-secondary-container px-5 py-2 rounded-full text-on-secondary-container font-label-bold pulse-glow">
            ✨ NEW: AI SPACE DISCOVERY
          </div>
          <h1 className="text-[56px] md:text-[84px] font-display-lg text-on-surface leading-none mb-8 tracking-tighter">
            Your Creative <span className="text-primary italic">Stage</span>,<br/>Redefined.
          </h1>
          <p className="text-[18px] md:text-[18px] text-on-surface-variant max-w-xl mx-auto mb-12 font-body-lg">
            Discover extraordinary spaces. Book instantly. Create without limits.
          </p>
          
          {/* AI Visual Search Bar */}
          <div className="glass max-w-2xl mx-auto rounded-3xl p-2 flex flex-col md:flex-row items-center shadow-2xl mt-12 border-2 border-white/60 hover:border-primary/30 transition-all duration-500">
            <div className="flex-1 px-6 flex items-center gap-3 w-full">
              <MagnifyingGlassIcon className="w-6 h-6 text-outline flex-shrink-0" />
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 font-body-md placeholder:text-outline/60 outline-none" 
                placeholder="Describe the mood, aesthetic, or upload an image..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto p-2 md:p-0">
              <label className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-high cursor-pointer hover:bg-secondary-container transition-all group relative" title="Upload reference image">
                <input className="hidden" type="file" accept="image/*"/>
                <PhotoIcon className="w-6 h-6 text-on-surface-variant group-hover:text-secondary transition-colors" />
              </label>
              <Link 
                href="/spaces"
                className="flex-1 md:flex-none bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-2xl font-label-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex items-center gap-2 justify-center"
              >
                FIND SPACE
                <span className="text-sm">→</span>
              </Link>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-8 md:gap-12 mt-16 text-center">
            <div className="transition-all duration-700 delay-300" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-50px)' }}>
              <p className="text-4xl font-display-sm text-primary">500+</p>
              <p className="font-label-bold text-on-surface-variant text-xs tracking-wider">UNIQUE SPACES</p>
            </div>
            <div className="transition-all duration-700 delay-500" style={{ opacity: isVisible ? 1 : 0 }}>
              <p className="text-4xl font-display-sm text-primary">50+</p>
              <p className="font-label-bold text-on-surface-variant text-xs tracking-wider">CITIES</p>
            </div>
            <div className="transition-all duration-700 delay-700" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(50px)' }}>
              <p className="text-4xl font-display-sm text-primary">10K+</p>
              <p className="font-label-bold text-on-surface-variant text-xs tracking-wider">CREATORS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search by Vibe Section */}
      <section className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <span className="font-label-bold text-primary tracking-widest uppercase text-xs">DISCOVER</span>
            <h2 className="text-[48px] font-display-sm tracking-tighter mt-2">Search by Vibe</h2>
          </div>
          <p className="text-[18px] text-on-surface-variant max-w-md">Our curated categories move beyond utility, focusing on the architectural soul of the space.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
          {/* Brutalist */}
          <Link href="/spaces?vibe=brutalist" className="group relative overflow-hidden rounded-3xl md:col-span-2 min-h-[300px] floating-interaction cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2')" }}></div>
            <div className="absolute bottom-0 left-0 p-10 z-20">
              <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-bold mb-4 inline-block">🔥 TRENDING</span>
              <h3 className="text-white text-3xl font-display-sm mb-2">Brutalist</h3>
              <p className="text-white/80 font-body-md">Raw concrete, dramatic scale, and uncompromising geometry.</p>
              <p className="text-primary-fixed font-label-bold mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore 45 spaces <span>→</span>
              </p>
            </div>
          </Link>

          {/* Organic */}
          <Link href="/spaces?vibe=organic" className="group relative overflow-hidden rounded-3xl min-h-[300px] floating-interaction cursor-pointer">
            <div className="absolute inset-0 bg-tertiary-container/40 mix-blend-overlay z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtaHsD_Ee0OXgccRwyuBHMMGBF5R9Wv7zL6xdfFmVFYNTibEc531TN2DKYpRcRHkWa6LNR-2FEaFzFCKoH7alTA6ZN4q7jb2vYuVe8qo4dKOIRupQxXdeWuFfgP-ZD-bYdZ4y83gObwQRQga8Gb2f8GOaemUrFtQcqt_0rcQZ_GS3KH-aiNPL50ZBFTzVERvqcftQZLBU1XEGVqm59af7kBpaAV0rreAUxgHeTcLcawMQ__wUXvyFc0Ko9pGwkWWs9A1g6uMKIjl5F')" }}></div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <h3 className="text-tertiary text-3xl -rotate-6 bg-white/95 px-8 py-3 shadow-2xl rounded-2xl font-display-sm">Organic</h3>
                <p className="text-tertiary/80 font-label-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Nature-meets-design</p>
              </div>
            </div>
          </Link>

          {/* Sci-Fi */}
          <Link href="/spaces?vibe=scifi" className="group relative overflow-hidden rounded-3xl min-h-[300px] floating-interaction cursor-pointer">
            <div className="absolute inset-0 bg-primary-fixed/30 mix-blend-color z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLkL_S-dw1DwN3C_25Bg1DkuiE4eStzko3W4oDgh-uQKrWWmbQNb8qx0xEEcqWJ2UrtMJl3GF2rbvtvt2G6yyZf0PyFp7G6J-gkcEkNv8m_KbQUky3KfZmt1R18XEJJlqQe5VKA1HgbLcaAmUHy0nM7zSTyaMh6MSTiVto7EjDhv1SPZ4x0RuvmLu7w532bPBwYZ9IyoSjxBUn8v77ZUSe_yE-mHRWCYYoqLKUQc2mEqxLKKTXlIUP3oYmxWXzVhnkz0EXuhLHLU9U')" }}></div>
            <div className="absolute bottom-8 right-8 z-20 text-right">
              <h3 className="text-primary-fixed neon-accent text-4xl font-headline-lg">Sci-Fi</h3>
              <p className="text-white font-label-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Futuristic & cyberpunk</p>
              <span className="text-white text-4xl mt-2 block">↗</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Studios - YOUR ORIGINAL STUDIO SECTION */}
      <section className="bg-surface-container py-24 px-6 md:px-16 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-outline-variant flex-1"></div>
            <h2 className="font-label-bold text-primary tracking-widest uppercase">Curated Collections</h2>
            <div className="h-px bg-outline-variant flex-1"></div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500">Loading featured spaces...</p>
              </div>
            </div>
          ) : featuredSpaces.length === 0 ? (
            <div className="text-center py-20">
              <h4 className="text-xl font-serif mb-2">No studios available yet</h4>
              <p className="text-slate-500 max-w-md mx-auto">We're currently curating new creative spaces. Please check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {featuredSpaces.map((space, index) => {
                const coverImage = getFirstImage(space.images);
                return (
                  <Link 
                    key={space.id} 
                    href={`/spaces/${space.id}`}
                    className={`group card-hover bg-surface-container-lowest rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 ${index === 1 ? 'mt-12 md:-mt-8' : ''}`}
                  >
                    <div className="h-[400px] relative overflow-hidden">
                      {coverImage ? (
                        <img 
                          src={coverImage}
                          alt={space.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
                        </div>
                      )}
                      <div className="absolute top-6 left-6 bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-2xl font-label-bold shadow-lg">
                        ${space.hourly_rate}<span className="text-sm font-normal">/hr</span>
                      </div>
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg cursor-pointer hover:scale-110 transition-transform">favorite</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-headline-lg mb-1">{space.name}</h3>
                          <p className="text-on-surface-variant font-body-md flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span> 
                            {space.city || 'Location TBD'}{space.state ? `, ${space.state}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="font-label-bold text-on-surface">4.9</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">DAYLIGHT</span>
                        <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">CREATIVE</span>
                        {space.description && (
                          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">
                            {space.description.length > 20 ? space.description.substring(0, 20) + '...' : space.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Creative Talent Section */}
      <section className="py-24 px-6 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-1 w-12 bg-primary"></span>
                <span className="font-label-bold text-primary tracking-widest uppercase">Direct Talent Access</span>
              </div>
              <h2 className="text-[48px] font-display-sm mb-8 leading-tight">Elevate Your Production with <span className="text-secondary italic">Pro Talent.</span></h2>
              <p className="text-[18px] text-on-surface-variant mb-12 max-w-xl">
                Don't just book a room. Book a crew. Browse our verified roster of world-class photographers, award-winning videographers, and visionary stylists available to hire directly for your ManyRooms session.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/talent"
                  className="bg-on-surface text-surface-bright px-10 py-4 rounded-2xl font-label-bold hover:bg-primary transition-all flex items-center gap-2 group"
                >
                  BOOK TALENT <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link 
                  href="/talent/roster"
                  className="border-2 border-outline-variant px-10 py-4 rounded-2xl font-label-bold hover:bg-surface-container transition-all"
                >
                  VIEW ROSTER
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden h-64 grayscale hover:grayscale-0 transition-all duration-700">
                  <img alt="Cinematographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl"/>
                </div>
                <div className="bg-secondary-container p-6 rounded-3xl">
                  <h4 className="font-headline-lg text-on-secondary-container text-xl">Styling</h4>
                  <p className="text-on-secondary-container/70 font-body-md mt-2">Avant-garde vision for every frame.</p>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="bg-primary-container p-6 rounded-3xl">
                  <h4 className="font-headline-lg text-on-primary-container text-xl">Capture</h4>
                  <p className="text-on-primary-container/70 font-body-md mt-2">Industry-leading technical precision.</p>
                </div>
                <div className="rounded-3xl overflow-hidden h-64 grayscale hover:grayscale-0 transition-all duration-700">
                  <img alt="Photographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Stories */}
      <section className="py-24 px-6 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
        <div className="max-w-[1440px] mx-auto relative">
          <div className="absolute -right-20 top-0 opacity-10 rotate-12 pointer-events-none">
            <span className="text-[200px] text-primary font-display-lg">VOICES</span>
          </div>
          <h2 className="text-[48px] font-display-sm mb-20 relative z-10">Creator Stories</h2>
          <div className="flex flex-col md:flex-row items-center gap-16 relative">
            <div className="relative w-full md:w-1/2">
              <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl" 
                  alt="Amara Chen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white">
                  <h4 className="text-3xl font-display-sm mb-1">Amara Chen</h4>
                  <p className="font-label-bold text-primary-fixed uppercase tracking-widest">Global Cinematographer</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-4 md:-right-10 glass p-8 rounded-3xl max-w-xs shadow-2xl border-t-4 border-primary">
                <p className="font-body-lg italic text-on-surface-variant mb-4">
                  "ManyRooms doesn't just provide a space; it provides the canvas that pushes my vision further."
                </p>
                <span className="text-primary text-4xl">❝</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-secondary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 floating-interaction">
                <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD" alt="Marcus Vane" />
                </div>
                <h4 className="font-headline-lg text-on-secondary-container">Marcus Vane</h4>
                <p className="font-body-md text-on-secondary-container opacity-80">Editorial Photography Legend</p>
                <button className="flex items-center gap-2 font-label-bold text-on-secondary-container group">
                  READ STORY <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
              </div>

              <div className="bg-primary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 mt-0 sm:mt-12 floating-interaction">
                <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8yR0fx9aF-smQaY2NFdyOzW0frJaoqEFJf23bKJn6HmD6AMnL4b8s6uK6LJXX0pE5R0eozRdwNA6UMijGqPrTugvgOyVqvuhN8M3ueGqEfXgV8Lsq2ZUm48_11dtRBWZXgflk8aTDHzf5gFWgpOzKL5mNgp3Z2qhQn-s75gRTCXCt93F2EBXd8jLzQBMODpb85NkV6ZjJY4pTpzUuaVo15E3XfCUkZs080wIYIyqtR2sqU9BflPf2DXsyReE3NfjTiTEt74-tqC2T" alt="Sofia Rossi" />
                </div>
                <h4 className="font-headline-lg text-on-primary-container">Sofia Rossi</h4>
                <p className="font-body-md text-on-primary-container opacity-80">Creative Director, Aura Studio</p>
                <button className="flex items-center gap-2 font-label-bold text-on-primary-container group">
                  WATCH TOUR <span className="group-hover:translate-x-2 transition-transform">▶</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-[1440px] mx-auto bg-gradient-to-br from-primary to-secondary rounded-[60px] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, transparent 70%)' }}></div>
          <div className="relative z-10">
            <h2 className="text-white mb-8 text-[48px] md:text-[84px] font-display-lg leading-tight">Ready to launch your next masterpiece?</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">Join the world's most innovative creative collective. From brutalist lofts to neon-soaked labs, your perfect stage is waiting.</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Link 
                href="/signup"
                className="bg-primary-fixed text-on-primary-fixed px-12 py-5 rounded-2xl font-label-bold text-lg hover:scale-105 transition-transform shadow-xl"
              >
                Join the Collective
              </Link>
              <button className="glass text-white px-12 py-5 rounded-2xl font-label-bold text-lg hover:bg-white/10 transition-colors">
                Speak to an Agent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      <Chatbot />

      <style jsx>{`
        .glass { 
          background: rgba(255, 255, 255, 0.75); 
          backdrop-filter: blur(20px); 
          border: 1px solid rgba(255, 255, 255, 0.3); 
        }
        .neon-accent { 
          text-shadow: 0 0 15px rgba(181, 246, 87, 0.6); 
        }
        .floating-interaction { 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .floating-interaction:hover { 
          transform: translateY(-8px) scale(1.02); 
          z-index: 30; 
        }
        .card-hover { 
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .card-hover:hover { 
          transform: translateY(-12px); 
          box-shadow: 0 30px 60px rgba(0,0,0,0.15); 
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        @keyframes hero-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.12); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(181, 246, 87, 0.3); }
          50% { box-shadow: 0 0 40px rgba(181, 246, 87, 0.6); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .duration-1500 {
          transition-duration: 1500ms;
        }
      `}</style>
    </div>
  );
}





// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import {
//   UserIcon,
//   EnvelopeIcon,
//   EyeIcon,
//   Square2StackIcon,
//   ArrowRightIcon,
//   CheckIcon,
// } from '@heroicons/react/24/outline';
// import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
// import { useAuth } from '@/context/AuthContext';

// export default function SignupPage() {
//   return (
//     <Suspense fallback={<div className="flex min-h-screen w-full bg-background" />}>
//       <SignupContent />
//     </Suspense>
//   );
// }

// function SignupContent() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedRole, setSelectedRole] = useState('client');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
  
//   const { signup } = useAuth();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Check for role in URL parameters on page load
//   useEffect(() => {
//     const roleParam = searchParams.get('role');
//     if (roleParam && ['client', 'owner', 'franchisee'].includes(roleParam)) {
//       setSelectedRole(roleParam);
//     }
//   }, [searchParams]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setLoading(true);

//     try {
//       await signup(name, email, password, selectedRole);
//       setSuccessMessage('Account created! Please check your email to confirm your account.');
      
//       setTimeout(() => {
//         router.push('/login');
//       }, 3000);
      
//     } catch (err: any) {
//       setError(err.message || 'Failed to create account');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate password strength
//   const getPasswordStrength = () => {
//     if (!password) return 0;
//     let strength = 0;
//     if (password.length >= 8) strength++;
//     if (/[A-Z]/.test(password)) strength++;
//     if (/[0-9]/.test(password)) strength++;
//     if (/[^A-Za-z0-9]/.test(password)) strength++;
//     return strength;
//   };

//   const passwordStrength = getPasswordStrength();
//   const strengthText = ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength] || 'Weak';

//   return (
//     <div className="flex min-h-screen w-full bg-background text-on-surface overflow-hidden">
//       {/* Left Side: Visual */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/5 via-surface to-secondary/5">
//         <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
//         <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-transparent to-surface/30"></div>
//         <div 
//           className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105 opacity-60" 
//           style={{ 
//             backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7vvEr3Fq76wjx7ExuPDt-oTMueyXJolQjXQgJgp3LoUAKxLpS9DT-z7xtEshbQcBcz6tqB4D9gV7xUN5Y1bJe9CalNm5F7477jeiEVidqhbTvnPvfPb17Nz0mPYZ47qutpfKZFMlCChGN9jdUX5gtOTpTdVDz1bRukW05HP9kalRCRB8R74-hhBpzMTopgXQIx2gHK4AdDPnqGatosyyJAkEVamr92-Gco4lpZjIcCmZITh54Y8-5W2D4eu4ygry97Ju6zRikXEn3')" 
//           }}
//         ></div>
        
//         <div className="relative z-20 flex flex-col justify-between p-16 w-full h-full">
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
//               <Square2StackIcon className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-extrabold tracking-tighter uppercase text-primary">ManyRooms</span>
//           </div>
          
//           <div className="max-w-md">
//             <h1 className="text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight text-on-surface">
//               Your vision, <br/>
//               <span className="text-primary">amplified.</span>
//             </h1>
//             <p className="text-xl text-on-surface-variant font-light leading-relaxed">
//               Access the world's most sophisticated creative spaces. Designed for artists, managed by pros, scaled by you.
//             </p>
//           </div>
          
//           <div className="flex gap-8 text-sm font-medium text-on-surface-variant/60 uppercase tracking-widest">
//             <span>Recording</span>
//             <span>Film</span>
//             <span>Photography</span>
//             <span>Podcast</span>
//           </div>
//         </div>
//       </div>

//       {/* Right Side: Registration Form */}
//       <div className="w-full lg:w-1/2 flex flex-col bg-surface overflow-y-auto custom-scrollbar">
//         {/* Top Nav */}
//         <div className="flex justify-between items-center px-8 lg:px-12 py-8">
//           <div className="lg:hidden flex items-center gap-2">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//               <Square2StackIcon className="w-4 h-4 text-white" />
//             </div>
//             <span className="text-sm font-extrabold text-primary">ManyRooms</span>
//           </div>
//           <div className="flex-1 flex justify-end">
//             <p className="text-sm text-on-surface-variant">
//               Already have an account? 
//               <Link href="/login" className="text-primary font-bold ml-1 hover:underline">
//                 Log in
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 max-w-2xl mx-auto w-full">
//           <div className="mb-10">
//             <h2 className="text-4xl font-extrabold mb-3 tracking-tight text-on-surface">Join the Studio.</h2>
//             <p className="text-on-surface-variant">Select your path to get started with ManyRooms.</p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-error-container border border-error/20 rounded-lg">
//               <p className="text-error text-sm font-medium">{error}</p>
//             </div>
//           )}

//           {/* Success Message */}
//           {successMessage && (
//             <div className="mb-6 p-4 bg-primary-container border border-primary/20 rounded-lg">
//               <p className="text-primary text-sm font-medium">{successMessage}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Role Selection */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Owner Role - KEPT ACTIVE */}
//               <label className="relative cursor-pointer group">
//                 <input 
//                   type="radio" 
//                   name="role" 
//                   value="owner" 
//                   checked={selectedRole === 'owner'}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="peer sr-only" 
//                   required
//                 />
//                 <div className={`h-full p-6 rounded-xl border-2 transition-all duration-200 
//                   ${selectedRole === 'owner' 
//                     ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
//                     : 'border-outline-variant/50 bg-surface-container hover:bg-primary/5'}`}>
//                   <svg className="w-10 h-10 text-primary mb-3 block group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                   <p className="text-lg font-bold text-on-surface mb-1">Studio Owner</p>
//                   <p className="text-sm text-on-surface-variant">List and manage your creative spaces.</p>
//                 </div>
//                 <div className={`absolute top-3 right-3 ${selectedRole === 'owner' ? 'opacity-100' : 'opacity-0'}`}>
//                   <CheckCircleSolid className="w-6 h-6 text-primary" />
//                 </div>
//               </label>

//               {/* Client Role - COMMENTED OUT
//               <label className="relative cursor-pointer group">
//                 <input 
//                   type="radio" 
//                   name="role" 
//                   value="client" 
//                   checked={selectedRole === 'client'}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="peer sr-only" 
//                 />
//                 <div className={`h-full p-6 rounded-xl border-2 transition-all duration-200 
//                   ${selectedRole === 'client' 
//                     ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
//                     : 'border-outline-variant/50 bg-surface-container hover:bg-primary/5'}`}>
//                   <UserIcon className="w-10 h-10 text-primary mb-3 block group-hover:scale-110 transition-transform" />
//                   <p className="text-lg font-bold text-on-surface mb-1">Client</p>
//                   <p className="text-sm text-on-surface-variant">Book creative spaces for your projects.</p>
//                 </div>
//                 <div className={`absolute top-3 right-3 ${selectedRole === 'client' ? 'opacity-100' : 'opacity-0'}`}>
//                   <CheckCircleSolid className="w-6 h-6 text-primary" />
//                 </div>
//               </label>
//               */}

//               {/* Franchisee Role - COMMENTED OUT
//               <label className="relative cursor-pointer group">
//                 <input 
//                   type="radio" 
//                   name="role" 
//                   value="franchisee"
//                   checked={selectedRole === 'franchisee'}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="peer sr-only" 
//                 />
//                 <div className={`h-full p-6 rounded-xl border-2 transition-all duration-200 
//                   ${selectedRole === 'franchisee' 
//                     ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
//                     : 'border-outline-variant/50 bg-surface-container hover:bg-primary/5'}`}>
//                   <svg className="w-10 h-10 text-primary mb-3 block group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                   <p className="text-lg font-bold text-on-surface mb-1">Franchisee</p>
//                   <p className="text-sm text-on-surface-variant">Scale the ManyRooms brand globally.</p>
//                 </div>
//                 <div className={`absolute top-3 right-3 ${selectedRole === 'franchisee' ? 'opacity-100' : 'opacity-0'}`}>
//                   <CheckCircleSolid className="w-6 h-6 text-primary" />
//                 </div>
//               </label>
//               */}
//             </div>

//             {/* Input Fields */}
//             <div className="space-y-5">
//               <div className="group">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 mb-2 transition-colors group-focus-within:text-primary">
//                   Full Name
//                 </label>
//                 <input 
//                   type="text" 
//                   placeholder="John Doe"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" 
//                   required
//                 />
//               </div>

//               <div className="group">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 mb-2 transition-colors group-focus-within:text-primary">
//                   Email Address
//                 </label>
//                 <input 
//                   type="email" 
//                   placeholder="john@manyrooms.studio"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" 
//                   required
//                 />
//               </div>

//               <div className="group">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 mb-2 transition-colors group-focus-within:text-primary">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input 
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full bg-surface-container border border-outline-variant/50 rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all pr-12" 
//                     required
//                     minLength={6}
//                   />
//                   <button 
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
//                   >
//                     <EyeIcon className="w-5 h-5" />
//                   </button>
//                 </div>
                
//                 {/* Password Strength Indicator */}
//                 {password && (
//                   <>
//                     <div className="mt-3 flex gap-1 h-1.5">
//                       {[0, 1, 2, 3].map((index) => (
//                         <div 
//                           key={index}
//                           className={`flex-1 rounded-full transition-all ${
//                             index < passwordStrength 
//                               ? 'bg-primary' 
//                               : 'bg-outline-variant/30'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <p className="text-xs text-on-surface-variant/60 mt-2 uppercase tracking-tighter">
//                       Strength: {strengthText}
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* CTA */}
//             <div className="pt-2">
//               <button 
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-5 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
//                 {!loading && <ArrowRightIcon className="w-5 h-5" />}
//               </button>
//             </div>

//             {/* Divider */}
//             <div className="relative flex py-2 items-center">
//               <div className="flex-grow border-t border-outline-variant/30"></div>
//               <span className="flex-shrink mx-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">or continue with</span>
//               <div className="flex-grow border-t border-outline-variant/30"></div>
//             </div>

//             {/* Social Auth */}
//             <div className="grid grid-cols-2 gap-4">
//               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-outline-variant/30 rounded-xl bg-surface-container hover:bg-primary/5 transition-colors">
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path
//                     fill="currentColor"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 <span className="text-sm font-bold text-on-surface">Google</span>
//               </button>
//               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-outline-variant/30 rounded-xl bg-surface-container hover:bg-primary/5 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.008-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.69 3.56-1.702z" />
//                 </svg>
//                 <span className="text-sm font-bold text-on-surface">Apple</span>
//               </button>
//             </div>
//           </form>

//           {/* Footer */}
//           <div className="mt-12 text-center">
//             <p className="text-xs text-on-surface-variant/60 leading-relaxed">
//               By clicking create account, you agree to our <br/>
//               <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a> and 
//               <a href="#" className="underline hover:text-primary transition-colors ml-1">Privacy Policy</a>.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import {
//   UserIcon,
//   EnvelopeIcon,
//   EyeIcon,
//   Square2StackIcon
// } from '@heroicons/react/24/outline';
// import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
// import { useAuth } from '@/context/AuthContext';

// export default function SignupPage() {
//   return (
//     <Suspense fallback={<div className="flex min-h-screen w-full bg-background-dark" />}>
//       <SignupContent />
//     </Suspense>
//   );
// }

// function SignupContent() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedRole, setSelectedRole] = useState('client');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
  
//   const { signup } = useAuth();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Check for role in URL parameters on page load
//   useEffect(() => {
//     const roleParam = searchParams.get('role');
//     if (roleParam && ['client', 'owner', 'franchisee'].includes(roleParam)) {
//       setSelectedRole(roleParam);
//     }
//   }, [searchParams]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setLoading(true);

//     try {
//       await signup(name, email, password, selectedRole);
//       setSuccessMessage('Account created! Please check your email to confirm your account.');
      
//       // Optional: Redirect to login after 3 seconds
//       setTimeout(() => {
//         router.push('/login');
//       }, 3000);
      
//     } catch (err: any) {
//       setError(err.message || 'Failed to create account');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate password strength
//   const getPasswordStrength = () => {
//     if (!password) return 0;
//     let strength = 0;
//     if (password.length >= 8) strength++;
//     if (/[A-Z]/.test(password)) strength++;
//     if (/[0-9]/.test(password)) strength++;
//     if (/[^A-Za-z0-9]/.test(password)) strength++;
//     return strength;
//   };

//   const passwordStrength = getPasswordStrength();
//   const strengthText = ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength] || 'Weak';

//   return (
//     <div className="flex min-h-screen w-full bg-background-dark text-white overflow-hidden">
//       {/* Left Side: Cinematic Visual */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background-dark">
//         <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
//         <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-transparent to-background-dark/30"></div>
//         <div 
//           className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" 
//           style={{ 
//             backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7vvEr3Fq76wjx7ExuPDt-oTMueyXJolQjXQgJgp3LoUAKxLpS9DT-z7xtEshbQcBcz6tqB4D9gV7xUN5Y1bJe9CalNm5F7477jeiEVidqhbTvnPvfPb17Nz0mPYZ47qutpfKZFMlCChGN9jdUX5gtOTpTdVDz1bRukW05HP9kalRCRB8R74-hhBpzMTopgXQIx2gHK4AdDPnqGatosyyJAkEVamr92-Gco4lpZjIcCmZITh54Y8-5W2D4eu4ygry97Ju6zRikXEn3')" 
//           }}
//         ></div>
        
//         <div className="relative z-20 flex flex-col justify-between p-16 w-full h-full">
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
//               <Square2StackIcon className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-extrabold tracking-tighter uppercase italic">ManyRooms</span>
//           </div>
          
//           <div className="max-w-md">
//             <h1 className="text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
//               Your vision, <br/>
//               <span className="text-primary">amplified.</span>
//             </h1>
//             <p className="text-xl text-slate-400 font-light leading-relaxed">
//               Access the world's most sophisticated creative spaces. Designed for artists, managed by pros, scaled by you.
//             </p>
//           </div>
          
//           <div className="flex gap-8 text-sm font-medium text-slate-500 uppercase tracking-widest">
//             <span>Recording</span>
//             <span>Film</span>
//             <span>Photography</span>
//             <span>Podcast</span>
//           </div>
//         </div>
//       </div>

//       {/* Right Side: Registration Form */}
//       <div className="w-full lg:w-1/2 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar">
//         {/* Top Nav */}
//         <div className="flex justify-between items-center px-8 lg:px-12 py-8">
//           <div className="lg:hidden flex items-center gap-2">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//               <Square2StackIcon className="w-4 h-4 text-white" />
//             </div>
//           </div>
//           <div className="flex-1 flex justify-end">
//             <p className="text-sm text-slate-500">
//               Already have an account? 
//               <Link href="/login" className="text-primary font-bold ml-1 hover:underline">
//                 Log in
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 max-w-2xl mx-auto w-full">
//           <div className="mb-10">
//             <h2 className="text-4xl font-extrabold mb-3 tracking-tight text-white">Join the Studio.</h2>
//             <p className="text-slate-500">Select your path to get started with ManyRooms.</p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
//               <p className="text-red-500 text-sm font-medium">{error}</p>
//             </div>
//           )}

//           {/* Success Message */}
//           {successMessage && (
//             <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
//               <p className="text-green-500 text-sm font-medium">{successMessage}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Role Selection */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Client Role */}
//               <label className="relative cursor-pointer group">
//                 <input 
//                   type="radio" 
//                   name="role" 
//                   value="client" 
//                   checked={selectedRole === 'client'}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="peer sr-only" 
//                   required
//                 />
//                 <div className={`h-full p-4 rounded-xl border transition-all duration-200 
//                   ${selectedRole === 'client' 
//                     ? 'border-primary bg-primary/5' 
//                     : 'border-[#262626] bg-[#161616] hover:bg-white/5'}`}>
//                   <UserIcon className="w-8 h-8 text-primary mb-3 block group-hover:scale-110 transition-transform" />
//                   <p className="text-sm font-bold text-white mb-1">Client</p>
//                   <p className="text-xs text-slate-500">Book a space.</p>
//                 </div>
//                 <div className={`absolute top-2 right-2 ${selectedRole === 'client' ? 'opacity-100' : 'opacity-0'}`}>
//                   <CheckCircleSolid className="w-5 h-5 text-primary" />
//                 </div>
//               </label>

//               {/* Owner Role */}
//               <label className="relative cursor-pointer group">
//                 <input 
//                   type="radio" 
//                   name="role" 
//                   value="owner"
//                   checked={selectedRole === 'owner'}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="peer sr-only" 
//                 />
//                 <div className={`h-full p-4 rounded-xl border transition-all duration-200 
//                   ${selectedRole === 'owner' 
//                     ? 'border-primary bg-primary/5' 
//                     : 'border-[#262626] bg-[#161616] hover:bg-white/5'}`}>
//                   <svg className="w-8 h-8 text-primary mb-3 block group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                   <p className="text-sm font-bold text-white mb-1">Owner</p>
//                   <p className="text-xs text-slate-500">Manage rooms.</p>
//                 </div>
//                 <div className={`absolute top-2 right-2 ${selectedRole === 'owner' ? 'opacity-100' : 'opacity-0'}`}>
//                   <CheckCircleSolid className="w-5 h-5 text-primary" />
//                 </div>
//               </label>

//               {/* Franchisee Role */}
//               <label className="relative cursor-pointer group">
//                 <input 
//                   type="radio" 
//                   name="role" 
//                   value="franchisee"
//                   checked={selectedRole === 'franchisee'}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="peer sr-only" 
//                 />
//                 <div className={`h-full p-4 rounded-xl border transition-all duration-200 
//                   ${selectedRole === 'franchisee' 
//                     ? 'border-primary bg-primary/5' 
//                     : 'border-[#262626] bg-[#161616] hover:bg-white/5'}`}>
//                   <svg className="w-8 h-8 text-primary mb-3 block group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                   <p className="text-sm font-bold text-white mb-1">Franchisee</p>
//                   <p className="text-xs text-slate-500">Scale the brand.</p>
//                 </div>
//                 <div className={`absolute top-2 right-2 ${selectedRole === 'franchisee' ? 'opacity-100' : 'opacity-0'}`}>
//                   <CheckCircleSolid className="w-5 h-5 text-primary" />
//                 </div>
//               </label>
//             </div>

//             {/* Input Fields */}
//             <div className="space-y-4">
//               <div className="group">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 transition-colors group-focus-within:text-primary">
//                   Full Name
//                 </label>
//                 <input 
//                   type="text" 
//                   placeholder="John Doe"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
//                   required
//                 />
//               </div>

//               <div className="group">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 transition-colors group-focus-within:text-primary">
//                   Email Address
//                 </label>
//                 <input 
//                   type="email" 
//                   placeholder="john@manyrooms.studio"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
//                   required
//                 />
//               </div>

//               <div className="group">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 transition-colors group-focus-within:text-primary">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input 
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all pr-12" 
//                     required
//                     minLength={6}
//                   />
//                   <button 
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
//                   >
//                     <EyeIcon className="w-5 h-5" />
//                   </button>
//                 </div>
                
//                 {/* Password Strength Indicator */}
//                 {password && (
//                   <>
//                     <div className="mt-2 flex gap-1 h-1">
//                       {[0, 1, 2, 3].map((index) => (
//                         <div 
//                           key={index}
//                           className={`flex-1 rounded-full transition-all ${
//                             index < passwordStrength 
//                               ? 'bg-primary' 
//                               : 'bg-[#262626]'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">
//                       Strength: {strengthText}
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* CTA */}
//             <div className="pt-4">
//               <button 
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-5 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
//               </button>
//             </div>

//             {/* Divider */}
//             <div className="relative flex py-2 items-center">
//               <div className="flex-grow border-t border-[#262626]"></div>
//               <span className="flex-shrink mx-4 text-xs font-bold text-slate-600 uppercase tracking-widest">or continue with</span>
//               <div className="flex-grow border-t border-[#262626]"></div>
//             </div>

//             {/* Social Auth */}
//             <div className="grid grid-cols-2 gap-4">
//               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-[#262626] rounded-lg bg-[#161616] hover:bg-white/5 transition-colors">
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path
//                     fill="currentColor"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 <span className="text-sm font-bold">Google</span>
//               </button>
//               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-[#262626] rounded-lg bg-[#161616] hover:bg-white/5 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.008-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.69 3.56-1.702z" />
//                 </svg>
//                 <span className="text-sm font-bold">Apple</span>
//               </button>
//             </div>
//           </form>

//           {/* Footer */}
//           <div className="mt-12 text-center">
//             <p className="text-xs text-slate-600 leading-relaxed">
//               By clicking create account, you agree to our <br/>
//               <a href="#" className="underline hover:text-slate-400">Terms of Service</a> and 
//               <a href="#" className="underline hover:text-slate-400 ml-1">Privacy Policy</a>.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   UserIcon,
//   EnvelopeIcon,
//   EyeIcon,
//   Square2StackIcon
// } from '@heroicons/react/24/outline';
// import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
// import { useAuth } from '@/context/AuthContext';

// export default function SignupPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedRole, setSelectedRole] = useState('client');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
  
//   const { signup } = useAuth();
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setLoading(true);

//     try {
//       await signup(name, email, password, selectedRole);
//       setSuccessMessage('Account created! Please check your email to confirm your account.');
      
//       // Optional: Redirect to login after 3 seconds
//       setTimeout(() => {
//         router.push('/login');
//       }, 3000);
      
//     } catch (err: any) {
//       setError(err.message || 'Failed to create account');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate password strength
//   const getPasswordStrength = () => {
//     if (!password) return 0;
//     let strength = 0;
//     if (password.length >= 8) strength++;
//     if (/[A-Z]/.test(password)) strength++;
//     if (/[0-9]/.test(password)) strength++;
//     if (/[^A-Za-z0-9]/.test(password)) strength++;
//     return strength;
//   };

//   const passwordStrength = getPasswordStrength();
//   const strengthText = ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength] || 'Weak';

//   return (
//     <div className="flex min-h-screen w-full bg-background-dark text-white overflow-hidden">
//       {/* Left Side: Cinematic Visual */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background-dark">
//         <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
//         <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-transparent to-background-dark/30"></div>
//         <div 
//           className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" 
//           style={{ 
//             backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7vvEr3Fq76wjx7ExuPDt-oTMueyXJolQjXQgJgp3LoUAKxLpS9DT-z7xtEshbQcBcz6tqB4D9gV7xUN5Y1bJe9CalNm5F7477jeiEVidqhbTvnPvfPb17Nz0mPYZ47qutpfKZFMlCChGN9jdUX5gtOTpTdVDz1bRukW05HP9kalRCRB8R74-hhBpzMTopgXQIx2gHK4AdDPnqGatosyyJAkEVamr92-Gco4lpZjIcCmZITh54Y8-5W2D4eu4ygry97Ju6zRikXEn3')" 
//           }}
//         ></div>
        
//         <div className="relative z-20 flex flex-col justify-between p-16 w-full h-full">
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
//               <Square2StackIcon className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-extrabold tracking-tighter uppercase italic">ManyRooms</span>
//           </div>
          
//           <div className="max-w-md">
//             <h1 className="text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
//               Your vision, <br/>
//               <span className="text-primary">amplified.</span>
//             </h1>
//             <p className="text-xl text-slate-400 font-light leading-relaxed">
//               Access the world's most sophisticated creative spaces. Designed for artists, managed by pros, scaled by you.
//             </p>
//           </div>
          
//           <div className="flex gap-8 text-sm font-medium text-slate-500 uppercase tracking-widest">
//             <span>Recording</span>
//             <span>Film</span>
//             <span>Photography</span>
//             <span>Podcast</span>
//           </div>
//         </div>
//       </div>

//       {/* Right Side: Registration Form */}
//       <div className="w-full lg:w-1/2 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar">
//         {/* Top Nav */}
//         <div className="flex justify-between items-center px-8 lg:px-12 py-8">
//           <div className="lg:hidden flex items-center gap-2">
//             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//               <Square2StackIcon className="w-4 h-4 text-white" />
//             </div>
//           </div>
//           <div className="flex-1 flex justify-end">
//             <p className="text-sm text-slate-500">
//               Already have an account? 
//               <Link href="/" className="text-primary font-bold ml-1 hover:underline">
//                 Log in
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 max-w-2xl mx-auto w-full">
//           <div className="mb-10">
//             <h2 className="text-4xl font-extrabold mb-3 tracking-tight text-white">Join the Studio.</h2>
//             <p className="text-slate-500">Select your path to get started with ManyRooms.</p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
//               <p className="text-red-500 text-sm font-medium">{error}</p>
//             </div>
//           )}

//           {/* Success Message */}
//           {successMessage && (
//             <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
//               <p className="text-green-500 text-sm font-medium">{successMessage}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Role Selection */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Client Role */}
//               <label className="relative cursor-pointer group">
//                 <input 
//                   type="radio" 
//                   name="role" 
//                   value="client" 
//                   checked={selectedRole === 'client'}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="peer sr-only" 
//                   required
//                 />
//                 <div className={`h-full p-4 rounded-xl border transition-all duration-200 
//                   ${selectedRole === 'client' 
//                     ? 'border-primary bg-primary/5' 
//                     : 'border-[#262626] bg-[#161616] hover:bg-white/5'}`}>
//                   <UserIcon className="w-8 h-8 text-primary mb-3 block group-hover:scale-110 transition-transform" />
//                   <p className="text-sm font-bold text-white mb-1">Client</p>
//                   <p className="text-xs text-slate-500">Book a space.</p>
//                 </div>
//                 <div className={`absolute top-2 right-2 ${selectedRole === 'client' ? 'opacity-100' : 'opacity-0'}`}>
//                   <CheckCircleSolid className="w-5 h-5 text-primary" />
//                 </div>
//               </label>

//               {/* Owner Role */}
//               <label className="relative cursor-pointer group">
//                 <input 
//                   type="radio" 
//                   name="role" 
//                   value="owner"
//                   checked={selectedRole === 'owner'}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="peer sr-only" 
//                 />
//                 <div className={`h-full p-4 rounded-xl border transition-all duration-200 
//                   ${selectedRole === 'owner' 
//                     ? 'border-primary bg-primary/5' 
//                     : 'border-[#262626] bg-[#161616] hover:bg-white/5'}`}>
//                   <svg className="w-8 h-8 text-primary mb-3 block group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                   <p className="text-sm font-bold text-white mb-1">Owner</p>
//                   <p className="text-xs text-slate-500">Manage rooms.</p>
//                 </div>
//                 <div className={`absolute top-2 right-2 ${selectedRole === 'owner' ? 'opacity-100' : 'opacity-0'}`}>
//                   <CheckCircleSolid className="w-5 h-5 text-primary" />
//                 </div>
//               </label>

//               {/* Franchisee Role */}
//               <label className="relative cursor-pointer group">
//                 <input 
//                   type="radio" 
//                   name="role" 
//                   value="franchisee"
//                   checked={selectedRole === 'franchisee'}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   className="peer sr-only" 
//                 />
//                 <div className={`h-full p-4 rounded-xl border transition-all duration-200 
//                   ${selectedRole === 'franchisee' 
//                     ? 'border-primary bg-primary/5' 
//                     : 'border-[#262626] bg-[#161616] hover:bg-white/5'}`}>
//                   <svg className="w-8 h-8 text-primary mb-3 block group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                   <p className="text-sm font-bold text-white mb-1">Franchisee</p>
//                   <p className="text-xs text-slate-500">Scale the brand.</p>
//                 </div>
//                 <div className={`absolute top-2 right-2 ${selectedRole === 'franchisee' ? 'opacity-100' : 'opacity-0'}`}>
//                   <CheckCircleSolid className="w-5 h-5 text-primary" />
//                 </div>
//               </label>
//             </div>

//             {/* Input Fields */}
//             <div className="space-y-4">
//               <div className="group">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 transition-colors group-focus-within:text-primary">
//                   Full Name
//                 </label>
//                 <input 
//                   type="text" 
//                   placeholder="John Doe"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
//                   required
//                 />
//               </div>

//               <div className="group">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 transition-colors group-focus-within:text-primary">
//                   Email Address
//                 </label>
//                 <input 
//                   type="email" 
//                   placeholder="john@manyrooms.studio"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
//                   required
//                 />
//               </div>

//               <div className="group">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 transition-colors group-focus-within:text-primary">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input 
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all pr-12" 
//                     required
//                     minLength={6}
//                   />
//                   <button 
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
//                   >
//                     <EyeIcon className="w-5 h-5" />
//                   </button>
//                 </div>
                
//                 {/* Password Strength Indicator */}
//                 {password && (
//                   <>
//                     <div className="mt-2 flex gap-1 h-1">
//                       {[0, 1, 2, 3].map((index) => (
//                         <div 
//                           key={index}
//                           className={`flex-1 rounded-full transition-all ${
//                             index < passwordStrength 
//                               ? 'bg-primary' 
//                               : 'bg-[#262626]'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">
//                       Strength: {strengthText}
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* CTA */}
//             <div className="pt-4">
//               <button 
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-5 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
//               </button>
//             </div>

//             {/* Divider */}
//             <div className="relative flex py-2 items-center">
//               <div className="flex-grow border-t border-[#262626]"></div>
//               <span className="flex-shrink mx-4 text-xs font-bold text-slate-600 uppercase tracking-widest">or continue with</span>
//               <div className="flex-grow border-t border-[#262626]"></div>
//             </div>

//             {/* Social Auth */}
//             <div className="grid grid-cols-2 gap-4">
//               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-[#262626] rounded-lg bg-[#161616] hover:bg-white/5 transition-colors">
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path
//                     fill="currentColor"
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                   />
//                   <path
//                     fill="currentColor"
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                   />
//                 </svg>
//                 <span className="text-sm font-bold">Google</span>
//               </button>
//               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-[#262626] rounded-lg bg-[#161616] hover:bg-white/5 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.008-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.69 3.56-1.702z" />
//                 </svg>
//                 <span className="text-sm font-bold">Apple</span>
//               </button>
//             </div>
//           </form>

//           {/* Footer */}
//           <div className="mt-12 text-center">
//             <p className="text-xs text-slate-600 leading-relaxed">
//               By clicking create account, you agree to our <br/>
//               <a href="#" className="underline hover:text-slate-400">Terms of Service</a> and 
//               <a href="#" className="underline hover:text-slate-400 ml-1">Privacy Policy</a>.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

