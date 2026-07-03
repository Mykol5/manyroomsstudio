'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, GlobeAltIcon, PhotoIcon } from '@heroicons/react/24/outline';
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

interface CardPosition {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

export default function HomePage() {
  const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cardPositions, setCardPositions] = useState<CardPosition[]>([
    { x: -40, y: -10, rotate: -8, scale: 0.85, opacity: 0.9, zIndex: 1 },
    { x: 0, y: 15, rotate: 2, scale: 1, opacity: 1, zIndex: 3 },
    { x: 40, y: -5, rotate: 6, scale: 0.88, opacity: 0.9, zIndex: 2 },
    { x: -25, y: 25, rotate: -4, scale: 0.82, opacity: 0.85, zIndex: 1 },
    { x: 25, y: -20, rotate: 3, scale: 0.87, opacity: 0.85, zIndex: 2 },
  ]);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const [textColor, setTextColor] = useState('#191c1d');
  const [isMobile, setIsMobile] = useState(false);

  const heroImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDo9P8cWMtlxC-vTKW_d789xE15ySyxsMb_U8Qe2iYrUWUJBlZ11z5sKoQQW5e-jeLwqaQOM0Kgb7ebgD6PqdUAKnW2S18GHubom8jAuDBqLBKkgP-ja77FpNibRKYP2eTFbt1LWmw_r-Tcwy29nP0kT3ERHsQ7AALtSKG623o-AmbEdIQSysiYVdkv3wzhPfpeuqsQUGNGfe0yYSqFPrzrb85t6zX4hO_Sp7K94b89goSxv0XdXC3e8wP-E5VGz5gk57zVVUbwzSDM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDSwmSKLUnWOMsQ3GugJdlOZS5BByKJaiEs61TyG209DcA2Bqys9Or3aAbjaOFLiR8KH9xts5is8WOCU89o8TxY4EuPTx3Y7eINF0W0JjMW8ZZ5xYUZB5ThUYmjzzq6EERLeNzzD0U1o50RoOSqZqR1kCc67u55wSoCa7qKpALt43g75uDvONV3VOrCUDZoDHw_1nvmvMdKyGSZQvV-ffQc-yIuf-LaLoT3SWHaSi85V5-kEkwfNlO-MZv8WnnM-HWMlBvx5TYjJB6F',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAtaHsD_Ee0OXgccRwyuBHMMGBF5R9Wv7zL6xdfFmVFYNTibEc531TN2DKYpRcRHkWa6LNR-2FEaFzFCKoH7alTA6ZN4q7jb2vYuVe8qo4dKOIRupQxXdeWuFfgP-ZD-bYdZ4y83gObwQRQga8Gb2f8GOaemUrFtQcqt_0rcQZ_GS3KH-aiNPL50ZBFTzVERvqcftQZLBU1XEGVqm59af7kBpaAV0rreAUxgHeTcLcawMQ__wUXvyFc0Ko9pGwkWWs9A1g6uMKIjl5F',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDLkL_S-dw1DwN3C_25Bg1DkuiE4eStzko3W4oDgh-uQKrWWmbQNb8qx0xEEcqWJ2UrtMJl3GF2rbvtvt2G6yyZf0PyFp7G6J-gkcEkNv8m_KbQUky3KfZmt1R18XEJJlqQe5VKA1HgbLcaAmUHy0nM7zSTyaMh6MSTiVto7EjDhv1SPZ4x0RuvmLu7w532bPBwYZ9IyoSjxBUn8v77ZUSe_yE-mHRWCYYoqLKUQc2mEqxLKKTXlIUP3oYmxWXzVhnkz0EXuhLHLU9U'
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animate cards continuously - adjusted for mobile
  useEffect(() => {
    let time = 0;
    
    const animateCards = () => {
      time += 0.008;
      
      if (isMobile) {
        // Smaller movements for mobile
        setCardPositions([
          {
            x: -25 + Math.sin(time * 0.7) * 15,
            y: -5 + Math.cos(time * 0.5) * 20,
            rotate: -4 + Math.sin(time * 0.4) * 3,
            scale: 0.7,
            opacity: 0.8 + Math.sin(time * 0.6) * 0.1,
            zIndex: Math.sin(time * 0.3) > 0 ? 2 : 1
          },
          {
            x: Math.sin(time * 0.6) * 15,
            y: 8 + Math.cos(time * 0.45) * 18,
            rotate: Math.sin(time * 0.35) * 2,
            scale: 0.82,
            opacity: 1,
            zIndex: 3
          },
          {
            x: 22 + Math.cos(time * 0.65) * 15,
            y: -3 + Math.sin(time * 0.55) * 20,
            rotate: 4 + Math.cos(time * 0.45) * 2,
            scale: 0.72,
            opacity: 0.8 + Math.cos(time * 0.5) * 0.1,
            zIndex: Math.cos(time * 0.3) > 0 ? 2 : 1
          },
          {
            x: -15 + Math.cos(time * 0.75) * 18,
            y: 15 + Math.sin(time * 0.6) * 22,
            rotate: -2 + Math.cos(time * 0.5) * 2,
            scale: 0.65,
            opacity: 0.75 + Math.sin(time * 0.7) * 0.1,
            zIndex: 1
          },
          {
            x: 15 + Math.sin(time * 0.8) * 18,
            y: -12 + Math.cos(time * 0.7) * 20,
            rotate: 3 + Math.sin(time * 0.55) * 2,
            scale: 0.68,
            opacity: 0.75 + Math.cos(time * 0.65) * 0.1,
            zIndex: 1
          },
        ]);
      } else {
        // Full movements for desktop
        setCardPositions([
          {
            x: -35 + Math.sin(time * 0.7) * 25,
            y: -10 + Math.cos(time * 0.5) * 30,
            rotate: -6 + Math.sin(time * 0.4) * 4,
            scale: 0.85,
            opacity: 0.85 + Math.sin(time * 0.6) * 0.1,
            zIndex: Math.sin(time * 0.3) > 0 ? 2 : 1
          },
          {
            x: Math.sin(time * 0.6) * 20,
            y: 10 + Math.cos(time * 0.45) * 25,
            rotate: Math.sin(time * 0.35) * 3,
            scale: 0.95 + Math.sin(time * 0.5) * 0.05,
            opacity: 1,
            zIndex: 3
          },
          {
            x: 30 + Math.cos(time * 0.65) * 25,
            y: -5 + Math.sin(time * 0.55) * 30,
            rotate: 5 + Math.cos(time * 0.45) * 3,
            scale: 0.87,
            opacity: 0.85 + Math.cos(time * 0.5) * 0.1,
            zIndex: Math.cos(time * 0.3) > 0 ? 2 : 1
          },
          {
            x: -20 + Math.cos(time * 0.75) * 30,
            y: 20 + Math.sin(time * 0.6) * 35,
            rotate: -3 + Math.cos(time * 0.5) * 3,
            scale: 0.8,
            opacity: 0.8 + Math.sin(time * 0.7) * 0.1,
            zIndex: 1
          },
          {
            x: 20 + Math.sin(time * 0.8) * 28,
            y: -18 + Math.cos(time * 0.7) * 32,
            rotate: 4 + Math.sin(time * 0.55) * 3,
            scale: 0.83,
            opacity: 0.8 + Math.cos(time * 0.65) * 0.1,
            zIndex: 1
          },
        ]);
      }
      
      animationFrameRef.current = requestAnimationFrame(animateCards);
    };
    
    animationFrameRef.current = requestAnimationFrame(animateCards);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile]);

  // Check if text overlaps with dark images and invert text color
  useEffect(() => {
    const checkOverlap = () => {
      if (!textRef.current || !heroRef.current) return;
      
      const textRect = textRef.current.getBoundingClientRect();
      
      const cards = heroRef.current.querySelectorAll('.hero-card');
      let isOverDarkArea = false;
      
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardZIndex = parseInt(card.getAttribute('data-zindex') || '0');
        
        const overlapX = textRect.left < cardRect.right && textRect.right > cardRect.left;
        const overlapY = textRect.top < cardRect.bottom && textRect.bottom > cardRect.top;
        
        if (overlapX && overlapY && cardZIndex >= 2) {
          isOverDarkArea = true;
        }
      });
      
      setTextColor(isOverDarkArea ? '#ffffff' : '#191c1d');
    };
    
    const interval = setInterval(checkOverlap, 100);
    
    return () => clearInterval(interval);
  }, [cardPositions]);

  // Fetch approved studios from Supabase
  useEffect(() => {
    fetchApprovedStudios();
    setTimeout(() => setIsVisible(true), 100);
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
      {/* Navigation - solid background on mobile */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 md:bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="group flex-shrink-0">
              <img 
                alt="ManyRooms Logo" 
                className="h-8 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
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
          <div className="flex items-center gap-2 md:gap-4">
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
              className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full hidden md:block"
            >
              account_circle
            </button>
            {/* Mobile menu button - solid background */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-primary/10 rounded-full transition-all bg-surface-container-lowest shadow-sm border border-outline-variant/20"
            >
              <Bars3Icon className="w-5 h-5 text-on-surface" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - solid white background */}
      <div 
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div 
          className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-10">
              <span className="text-2xl font-bold text-primary">ManyRooms</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <XMarkIcon className="w-6 h-6 text-on-surface" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              <Link href="/" className="text-base font-semibold text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
              <Link href="/spaces" className="text-base font-semibold text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Studios</Link>
              <Link href="/cities" className="text-base font-semibold text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Vibes</Link>
              <Link href="/about" className="text-base font-semibold text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Journal</Link>
              
              <div className="border-t border-gray-200 pt-6 mt-2">
                <Link href="/signup?role=owner" className="block text-base font-semibold text-on-surface hover:text-primary transition-colors mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Studio</Link>
                <Link href="/login" className="block text-base font-semibold text-on-surface hover:text-primary transition-colors mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                <Link href="/signup" className="block text-base font-semibold text-on-surface hover:text-primary transition-colors mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
                <Link href="/support" className="block text-base font-semibold text-on-surface hover:text-primary transition-colors mb-4" onClick={() => setIsMobileMenuOpen(false)}>Contact Support</Link>
                <button className="flex items-center gap-2 text-base font-semibold text-on-surface hover:text-primary transition-colors">
                  <GlobeAltIcon className="w-4 h-4" />
                  Language
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Login/Signup Modal - solid white background */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 border border-gray-100">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ManyRooms</h3>
              <p className="text-sm text-gray-600">Find and book the perfect creative space</p>
            </div>

            <div className="space-y-4">
              <Link 
                href="/login" 
                className="block w-full text-center bg-primary text-white py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md"
                onClick={() => setIsModalOpen(false)}
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="block w-full text-center border-2 border-gray-200 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-900"
                onClick={() => setIsModalOpen(false)}
              >
                Sign up
              </Link>
              <div className="border-t border-gray-200 pt-4 mt-2">
                <Link 
                  href="/signup?role=owner" 
                  className="block w-full text-center text-xs uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  List your space
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Animated Hero Section - fixed mobile spacing */}
      <section 
        ref={heroRef} 
        className="relative min-h-[85vh] md:h-[95vh] flex items-center justify-center px-4 md:px-16 overflow-hidden bg-surface pt-20 md:pt-0"
      >
        {/* Moving image cards */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ perspective: isMobile ? '800px' : '1500px' }}>
          <div className="relative w-full h-full flex items-center justify-center">
            {cardPositions.map((pos, index) => (
              <div
                key={index}
                className="hero-card absolute w-[160px] h-[220px] md:w-[300px] md:h-[400px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-white/20"
                data-zindex={pos.zIndex}
                style={{
                  backgroundImage: `url('${heroImages[index % heroImages.length]}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: `translate(${pos.x}%, ${pos.y}%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                  zIndex: pos.zIndex,
                  opacity: pos.opacity,
                  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                  boxShadow: pos.zIndex >= 3 ? '0 30px 60px rgba(0,0,0,0.4)' : '0 15px 30px rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </div>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-surface/90 pointer-events-none" />
        </div>

        {/* Hero text content with dynamic color */}
        <div 
          ref={textRef}
          className={`relative z-20 text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } ${isMobile ? 'pt-8 pb-12' : 'pt-20'}`}
        >
          <div className="mb-4 md:mb-6 inline-block bg-secondary-container/95 backdrop-blur-sm px-4 md:px-5 py-1.5 md:py-2 rounded-full text-on-secondary-container font-label-bold pulse-glow text-sm md:text-base">
            ✨ NEW: AI SPACE DISCOVERY
          </div>
          <h1 
            className="text-[40px] md:text-[84px] font-display-lg leading-[1.1] mb-4 md:mb-8 tracking-tighter transition-colors duration-500 px-2"
            style={{ 
              color: textColor,
              textShadow: textColor === '#ffffff' ? '0 2px 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(255,255,255,0.8)'
            }}
          >
            Your Creative <span className="text-primary italic">Stage</span>,<br/>Redefined.
          </h1>
          <p 
            className="text-base md:text-[18px] max-w-md md:max-w-xl mx-auto mb-8 md:mb-12 font-body-lg transition-colors duration-500 px-4"
            style={{ 
              color: textColor === '#ffffff' ? 'rgba(255,255,255,0.9)' : '#424937',
              textShadow: textColor === '#ffffff' ? '0 1px 10px rgba(0,0,0,0.5)' : 'none'
            }}
          >
            Discover extraordinary spaces. Book instantly. Create without limits.
          </p>
          
          {/* AI Visual Search Bar */}
          <div className="glass max-w-md md:max-w-2xl mx-auto rounded-2xl md:rounded-3xl p-2 flex flex-col md:flex-row items-center shadow-2xl mt-8 md:mt-12 border-2 border-white/60 hover:border-primary/30 transition-all duration-500 mx-4 md:mx-auto">
            <div className="flex-1 px-4 md:px-6 flex items-center gap-2 md:gap-3 w-full">
              <MagnifyingGlassIcon className="w-5 h-5 md:w-6 md:h-6 text-outline flex-shrink-0" />
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 md:py-4 text-sm md:text-base font-body-md placeholder:text-outline/60 outline-none" 
                placeholder="Describe the mood, aesthetic, or upload an image..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto p-2 md:p-0 border-t md:border-t-0 border-white/20 mt-2 md:mt-0 pt-2 md:pt-0">
              <label className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-surface-container-high cursor-pointer hover:bg-secondary-container transition-all group relative" title="Upload reference image">
                <input className="hidden" type="file" accept="image/*"/>
                <PhotoIcon className="w-5 h-5 md:w-6 md:h-6 text-on-surface-variant group-hover:text-secondary transition-colors" />
              </label>
              <Link 
                href="/spaces"
                className="flex-1 md:flex-none bg-primary-fixed text-on-primary-fixed px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-label-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex items-center gap-2 justify-center text-sm md:text-base"
              >
                FIND SPACE
                <span className="text-sm">→</span>
              </Link>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-6 md:gap-12 mt-12 md:mt-16 text-center">
            {[
              { value: '500+', label: 'UNIQUE SPACES', delay: 300, translateX: -50 },
              { value: '50+', label: 'CITIES', delay: 500, translateX: 0 },
              { value: '10K+', label: 'CREATORS', delay: 700, translateX: 50 }
            ].map((stat, i) => (
              <div 
                key={i}
                className="transition-all duration-700"
                style={{ 
                  opacity: isVisible ? 1 : 0, 
                  transform: isVisible ? 'translateX(0)' : `translateX(${stat.translateX}px)`,
                  transitionDelay: `${stat.delay}ms`
                }}
              >
                <p className="text-3xl md:text-4xl font-display-sm text-primary">{stat.value}</p>
                <p 
                  className="font-label-bold text-[10px] md:text-xs tracking-wider transition-colors duration-500"
                  style={{ color: textColor === '#ffffff' ? 'rgba(255,255,255,0.8)' : '#424937' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search by Vibe Section */}
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-4">
          <div>
            <span className="font-label-bold text-primary tracking-widest uppercase text-xs">DISCOVER</span>
            <h2 className="text-[36px] md:text-[48px] font-display-sm tracking-tighter mt-2">Search by Vibe</h2>
          </div>
          <p className="text-base md:text-[18px] text-on-surface-variant max-w-md">Our curated categories move beyond utility, focusing on the architectural soul of the space.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 h-auto md:h-[600px]">
          <Link href="/spaces?vibe=brutalist" className="group relative overflow-hidden rounded-2xl md:rounded-3xl md:col-span-2 min-h-[250px] md:min-h-[300px] floating-interaction cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[0]}')` }}></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20">
              <span className="bg-primary-container text-on-primary-container px-3 md:px-4 py-1 rounded-full font-label-bold mb-3 md:mb-4 inline-block text-xs md:text-sm">🔥 TRENDING</span>
              <h3 className="text-white text-2xl md:text-3xl font-display-sm mb-2">Brutalist</h3>
              <p className="text-white/80 font-body-md text-sm md:text-base">Raw concrete, dramatic scale, and uncompromising geometry.</p>
              <p className="text-primary-fixed font-label-bold mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm">Explore 45 spaces <span>→</span></p>
            </div>
          </Link>

          <Link href="/spaces?vibe=organic" className="group relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[250px] md:min-h-[300px] floating-interaction cursor-pointer">
            <div className="absolute inset-0 bg-tertiary-container/40 mix-blend-overlay z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[3]}')` }}></div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <h3 className="text-tertiary text-2xl md:text-3xl -rotate-6 bg-white/95 px-6 md:px-8 py-2 md:py-3 shadow-2xl rounded-2xl font-display-sm">Organic</h3>
                <p className="text-tertiary/80 font-label-bold mt-3 md:mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-sm">Nature-meets-design</p>
              </div>
            </div>
          </Link>

          <Link href="/spaces?vibe=scifi" className="group relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[250px] md:min-h-[300px] floating-interaction cursor-pointer">
            <div className="absolute inset-0 bg-primary-fixed/30 mix-blend-color z-10"></div>
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[4]}')` }}></div>
            <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-20 text-right">
              <h3 className="text-primary-fixed neon-accent text-3xl md:text-4xl font-headline-lg">Sci-Fi</h3>
              <p className="text-white font-label-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm">Futuristic & cyberpunk</p>
              <span className="text-white text-3xl md:text-4xl mt-2 block">↗</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Studios Section */}
      <section className="bg-surface-container py-16 md:py-24 px-4 md:px-16 overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="h-px bg-outline-variant flex-1"></div>
            <h2 className="font-label-bold text-primary tracking-widest uppercase text-sm md:text-base">Curated Collections</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {featuredSpaces.map((space, index) => {
                const coverImage = getFirstImage(space.images);
                return (
                  <Link 
                    key={space.id} 
                    href={`/spaces/${space.id}`}
                    className={`group card-hover bg-surface-container-lowest rounded-[32px] md:rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 ${index === 1 ? 'md:mt-12 md:-mt-8' : ''}`}
                  >
                    <div className="h-[300px] md:h-[400px] relative overflow-hidden">
                      {coverImage ? (
                        <img src={coverImage} alt={space.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
                        </div>
                      )}
                      <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-primary-fixed text-on-primary-fixed px-3 md:px-4 py-1.5 md:py-2 rounded-2xl font-label-bold shadow-lg text-sm md:text-base">
                        ${space.hourly_rate}<span className="text-xs md:text-sm font-normal">/hr</span>
                      </div>
                      <div className="absolute top-4 md:top-6 right-4 md:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-2xl md:text-3xl drop-shadow-lg cursor-pointer hover:scale-110 transition-transform">favorite</span>
                      </div>
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-headline-lg text-xl md:text-2xl mb-1">{space.name}</h3>
                          <p className="text-on-surface-variant font-body-md flex items-center gap-1 text-sm md:text-base">
                            <span className="material-symbols-outlined text-sm">location_on</span> 
                            {space.city || 'Location TBD'}{space.state ? `, ${space.state}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-primary text-lg md:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
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
      <section className="py-16 md:py-24 px-4 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <span className="h-1 w-8 md:w-12 bg-primary"></span>
                <span className="font-label-bold text-primary tracking-widest uppercase text-xs md:text-sm">Direct Talent Access</span>
              </div>
              <h2 className="text-[36px] md:text-[48px] font-display-sm mb-6 md:mb-8 leading-tight">Elevate Your Production with <span className="text-secondary italic">Pro Talent.</span></h2>
              <p className="text-base md:text-[18px] text-on-surface-variant mb-8 md:mb-12 max-w-xl">
                Don't just book a room. Book a crew. Browse our verified roster of world-class photographers, award-winning videographers, and visionary stylists available to hire directly for your ManyRooms session.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link href="/talent" className="bg-on-surface text-surface-bright px-8 md:px-10 py-3 md:py-4 rounded-2xl font-label-bold hover:bg-primary transition-all flex items-center gap-2 group text-sm md:text-base">
                  BOOK TALENT <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/talent/roster" className="border-2 border-outline-variant px-8 md:px-10 py-3 md:py-4 rounded-2xl font-label-bold hover:bg-surface-container transition-all text-sm md:text-base">VIEW ROSTER</Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-3 md:space-y-4">
                <div className="rounded-2xl md:rounded-3xl overflow-hidden h-48 md:h-64 grayscale hover:grayscale-0 transition-all duration-700">
                  <img alt="Cinematographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl"/>
                </div>
                <div className="bg-secondary-container p-4 md:p-6 rounded-2xl md:rounded-3xl">
                  <h4 className="font-headline-lg text-on-secondary-container text-lg md:text-xl">Styling</h4>
                  <p className="text-on-secondary-container/70 font-body-md mt-1 md:mt-2 text-sm md:text-base">Avant-garde vision for every frame.</p>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4 pt-8 md:pt-12">
                <div className="bg-primary-container p-4 md:p-6 rounded-2xl md:rounded-3xl">
                  <h4 className="font-headline-lg text-on-primary-container text-lg md:text-xl">Capture</h4>
                  <p className="text-on-primary-container/70 font-body-md mt-1 md:mt-2 text-sm md:text-base">Industry-leading technical precision.</p>
                </div>
                <div className="rounded-2xl md:rounded-3xl overflow-hidden h-48 md:h-64 grayscale hover:grayscale-0 transition-all duration-700">
                  <img alt="Photographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Stories */}
      <section className="py-16 md:py-24 px-4 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
        <div className="max-w-[1440px] mx-auto relative">
          <div className="absolute -right-20 top-0 opacity-10 rotate-12 pointer-events-none hidden md:block">
            <span className="text-[200px] text-primary font-display-lg">VOICES</span>
          </div>
          <h2 className="text-[36px] md:text-[48px] font-display-sm mb-12 md:mb-20 relative z-10">Creator Stories</h2>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 relative">
            <div className="relative w-full md:w-1/2">
              <div className="relative aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl" alt="Amara Chen"/>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 right-8 md:right-12 text-white">
                  <h4 className="text-2xl md:text-3xl font-display-sm mb-1">Amara Chen</h4>
                  <p className="font-label-bold text-primary-fixed uppercase tracking-widest text-xs md:text-sm">Global Cinematographer</p>
                </div>
              </div>
              <div className="absolute -bottom-6 md:-bottom-10 -right-2 md:-right-10 glass p-6 md:p-8 rounded-2xl md:rounded-3xl max-w-[250px] md:max-w-xs shadow-2xl border-t-4 border-primary">
                <p className="text-sm md:font-body-lg italic text-on-surface-variant mb-3 md:mb-4">
                  "ManyRooms doesn't just provide a space; it provides the canvas that pushes my vision further."
                </p>
                <span className="text-primary text-3xl md:text-4xl">❝</span>
              </div>
            </div>

            <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-secondary-container p-8 md:p-12 rounded-[40px] md:rounded-[50px] flex flex-col justify-center gap-4 md:gap-6 floating-interaction">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD" alt="Marcus Vane"/>
                </div>
                <h4 className="font-headline-lg text-on-secondary-container text-lg md:text-xl">Marcus Vane</h4>
                <p className="font-body-md text-on-secondary-container opacity-80 text-sm md:text-base">Editorial Photography Legend</p>
                <button className="flex items-center gap-2 font-label-bold text-on-secondary-container group text-sm md:text-base">
                  READ STORY <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
              </div>
              <div className="bg-primary-container p-8 md:p-12 rounded-[40px] md:rounded-[50px] flex flex-col justify-center gap-4 md:gap-6 sm:mt-8 md:mt-12 floating-interaction">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8yR0fx9aF-smQaY2NFdyOzW0frJaoqEFJf23bKJn6HmD6AMnL4b8s6uK6LJXX0pE5R0eozRdwNA6UMijGqPrTugvgOyVqvuhN8M3ueGqEfXgV8Lsq2ZUm48_11dtRBWZXgflk8aTDHzf5gFWgpOzKL5mNgp3Z2qhQn-s75gRTCXCt93F2EBXd8jLzQBMODpb85NkV6ZjJY4pTpzUuaVo15E3XfCUkZs080wIYIyqtR2sqU9BflPf2DXsyReE3NfjTiTEt74-tqC2T" alt="Sofia Rossi"/>
                </div>
                <h4 className="font-headline-lg text-on-primary-container text-lg md:text-xl">Sofia Rossi</h4>
                <p className="font-body-md text-on-primary-container opacity-80 text-sm md:text-base">Creative Director, Aura Studio</p>
                <button className="flex items-center gap-2 font-label-bold text-on-primary-container group text-sm md:text-base">
                  WATCH TOUR <span className="group-hover:translate-x-2 transition-transform">▶</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-[1440px] mx-auto bg-gradient-to-br from-primary to-secondary rounded-[40px] md:rounded-[60px] p-8 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, transparent 70%)' }}></div>
          <div className="relative z-10">
            <h2 className="text-white mb-6 md:mb-8 text-[36px] md:text-[84px] font-display-lg leading-tight">Ready to launch your next masterpiece?</h2>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8 md:mb-12">Join the world's most innovative creative collective. From brutalist lofts to neon-soaked labs, your perfect stage is waiting.</p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
              <Link href="/signup" className="bg-primary-fixed text-on-primary-fixed px-10 md:px-12 py-4 md:py-5 rounded-2xl font-label-bold text-base md:text-lg hover:scale-105 transition-transform shadow-xl">Join the Collective</Link>
              <button className="glass text-white px-10 md:px-12 py-4 md:py-5 rounded-2xl font-label-bold text-base md:text-lg hover:bg-white/10 transition-colors">Speak to an Agent</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
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
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(181, 246, 87, 0.3); }
          50% { box-shadow: 0 0 40px rgba(181, 246, 87, 0.6); }
        }
        .hero-card {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}



// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, GlobeAltIcon, PhotoIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import './home.css';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   hourly_rate: number;
//   images: string[];
//   status: string;
//   description: string;
// }

// interface CardPosition {
//   x: number;
//   y: number;
//   rotate: number;
//   scale: number;
//   opacity: number;
//   zIndex: number;
// }

// export default function HomePage() {
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [cardPositions, setCardPositions] = useState<CardPosition[]>([
//     { x: -40, y: -10, rotate: -8, scale: 0.85, opacity: 0.9, zIndex: 1 },
//     { x: 0, y: 15, rotate: 2, scale: 1, opacity: 1, zIndex: 3 },
//     { x: 40, y: -5, rotate: 6, scale: 0.88, opacity: 0.9, zIndex: 2 },
//     { x: -25, y: 25, rotate: -4, scale: 0.82, opacity: 0.85, zIndex: 1 },
//     { x: 25, y: -20, rotate: 3, scale: 0.87, opacity: 0.85, zIndex: 2 },
//   ]);
  
//   const heroRef = useRef<HTMLDivElement>(null);
//   const textRef = useRef<HTMLDivElement>(null);
//   const animationFrameRef = useRef<number>();
//   const [textColor, setTextColor] = useState('#191c1d'); // Default dark text

//   const heroImages = [
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDo9P8cWMtlxC-vTKW_d789xE15ySyxsMb_U8Qe2iYrUWUJBlZ11z5sKoQQW5e-jeLwqaQOM0Kgb7ebgD6PqdUAKnW2S18GHubom8jAuDBqLBKkgP-ja77FpNibRKYP2eTFbt1LWmw_r-Tcwy29nP0kT3ERHsQ7AALtSKG623o-AmbEdIQSysiYVdkv3wzhPfpeuqsQUGNGfe0yYSqFPrzrb85t6zX4hO_Sp7K94b89goSxv0XdXC3e8wP-E5VGz5gk57zVVUbwzSDM',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDSwmSKLUnWOMsQ3GugJdlOZS5BByKJaiEs61TyG209DcA2Bqys9Or3aAbjaOFLiR8KH9xts5is8WOCU89o8TxY4EuPTx3Y7eINF0W0JjMW8ZZ5xYUZB5ThUYmjzzq6EERLeNzzD0U1o50RoOSqZqR1kCc67u55wSoCa7qKpALt43g75uDvONV3VOrCUDZoDHw_1nvmvMdKyGSZQvV-ffQc-yIuf-LaLoT3SWHaSi85V5-kEkwfNlO-MZv8WnnM-HWMlBvx5TYjJB6F',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuAtaHsD_Ee0OXgccRwyuBHMMGBF5R9Wv7zL6xdfFmVFYNTibEc531TN2DKYpRcRHkWa6LNR-2FEaFzFCKoH7alTA6ZN4q7jb2vYuVe8qo4dKOIRupQxXdeWuFfgP-ZD-bYdZ4y83gObwQRQga8Gb2f8GOaemUrFtQcqt_0rcQZ_GS3KH-aiNPL50ZBFTzVERvqcftQZLBU1XEGVqm59af7kBpaAV0rreAUxgHeTcLcawMQ__wUXvyFc0Ko9pGwkWWs9A1g6uMKIjl5F',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDLkL_S-dw1DwN3C_25Bg1DkuiE4eStzko3W4oDgh-uQKrWWmbQNb8qx0xEEcqWJ2UrtMJl3GF2rbvtvt2G6yyZf0PyFp7G6J-gkcEkNv8m_KbQUky3KfZmt1R18XEJJlqQe5VKA1HgbLcaAmUHy0nM7zSTyaMh6MSTiVto7EjDhv1SPZ4x0RuvmLu7w532bPBwYZ9IyoSjxBUn8v77ZUSe_yE-mHRWCYYoqLKUQc2mEqxLKKTXlIUP3oYmxWXzVhnkz0EXuhLHLU9U'
//   ];

//   // Animate cards continuously
//   useEffect(() => {
//     let time = 0;
    
//     const animateCards = () => {
//       time += 0.008;
      
//       setCardPositions([
//         {
//           x: -35 + Math.sin(time * 0.7) * 25,
//           y: -10 + Math.cos(time * 0.5) * 30,
//           rotate: -6 + Math.sin(time * 0.4) * 4,
//           scale: 0.85,
//           opacity: 0.85 + Math.sin(time * 0.6) * 0.1,
//           zIndex: Math.sin(time * 0.3) > 0 ? 2 : 1
//         },
//         {
//           x: Math.sin(time * 0.6) * 20,
//           y: 10 + Math.cos(time * 0.45) * 25,
//           rotate: Math.sin(time * 0.35) * 3,
//           scale: 0.95 + Math.sin(time * 0.5) * 0.05,
//           opacity: 1,
//           zIndex: 3
//         },
//         {
//           x: 30 + Math.cos(time * 0.65) * 25,
//           y: -5 + Math.sin(time * 0.55) * 30,
//           rotate: 5 + Math.cos(time * 0.45) * 3,
//           scale: 0.87,
//           opacity: 0.85 + Math.cos(time * 0.5) * 0.1,
//           zIndex: Math.cos(time * 0.3) > 0 ? 2 : 1
//         },
//         {
//           x: -20 + Math.cos(time * 0.75) * 30,
//           y: 20 + Math.sin(time * 0.6) * 35,
//           rotate: -3 + Math.cos(time * 0.5) * 3,
//           scale: 0.8,
//           opacity: 0.8 + Math.sin(time * 0.7) * 0.1,
//           zIndex: 1
//         },
//         {
//           x: 20 + Math.sin(time * 0.8) * 28,
//           y: -18 + Math.cos(time * 0.7) * 32,
//           rotate: 4 + Math.sin(time * 0.55) * 3,
//           scale: 0.83,
//           opacity: 0.8 + Math.cos(time * 0.65) * 0.1,
//           zIndex: 1
//         },
//       ]);
      
//       animationFrameRef.current = requestAnimationFrame(animateCards);
//     };
    
//     animationFrameRef.current = requestAnimationFrame(animateCards);
    
//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, []);

//   // Check if text overlaps with dark images and invert text color
//   useEffect(() => {
//     const checkOverlap = () => {
//       if (!textRef.current || !heroRef.current) return;
      
//       const textRect = textRef.current.getBoundingClientRect();
//       const heroRect = heroRef.current.getBoundingClientRect();
      
//       // Get all card elements
//       const cards = heroRef.current.querySelectorAll('.hero-card');
//       let isOverDarkArea = false;
      
//       cards.forEach((card) => {
//         const cardRect = card.getBoundingClientRect();
//         const cardZIndex = parseInt(card.getAttribute('data-zindex') || '0');
        
//         // Check if card overlaps with text area and is in front (zIndex >= 2)
//         const overlapX = textRect.left < cardRect.right && textRect.right > cardRect.left;
//         const overlapY = textRect.top < cardRect.bottom && textRect.bottom > cardRect.top;
        
//         if (overlapX && overlapY && cardZIndex >= 2) {
//           isOverDarkArea = true;
//         }
//       });
      
//       setTextColor(isOverDarkArea ? '#ffffff' : '#191c1d');
//     };
    
//     // Run check on every animation frame
//     const interval = setInterval(checkOverlap, 100);
    
//     return () => clearInterval(interval);
//   }, [cardPositions]);

//   // Fetch approved studios from Supabase
//   useEffect(() => {
//     fetchApprovedStudios();
//     setTimeout(() => setIsVisible(true), 100);
//   }, []);

//   // Prevent body scroll when mobile menu is open
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isMobileMenuOpen]);

//   // Scroll animation
//   useEffect(() => {
//     const handleScroll = () => {
//       const nav = document.querySelector('nav');
//       if (nav) {
//         if (window.scrollY > 50) {
//           nav.classList.add('py-2', 'shadow-md');
//           nav.classList.remove('py-4', 'shadow-sm');
//         } else {
//           nav.classList.add('py-4', 'shadow-sm');
//           nav.classList.remove('py-2', 'shadow-md');
//         }
//       }
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .limit(3);

//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFirstImage = (images: string[]) => {
//     if (!images || images.length === 0) return null;
//     return images[0];
//   };

//   return (
//     <div className="home-page bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
//         <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-8">
//             <Link href="/" className="group">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9DZnYRdMuRfh66s2y0aufTN6zhyFmIsA5aK66cuCBeLINs4QoP8IyjpBAQjHuPpHixsYPB1HMPOBhT7mUKu2qy7il9h__oTnAUvQ8EU5qv270iXUsGRbz-PlJjGMU5ixs4CUyHd9GoHjR9KulnOy4sz-3QN2VkRzW39ONL6ynO2nSLAUh3VRvj_U51r7i6CxOGm9pnjSOVDUTZd2P3m_LTCAchKE5VwHb0k6YYjDoduMHQU4iyejUYtTsGr0VhJR4tasKZ-e6qrWQ"
//               />
//             </Link>
//             <div className="hidden md:flex gap-6">
//               <Link href="/" className="text-primary font-bold border-b-2 border-primary py-1 transition-all hover:scale-105">Marketplace</Link>
//               <Link href="/spaces" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Studios</Link>
//               <Link href="/cities" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Vibes</Link>
//               <Link href="/about" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Journal</Link>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/signup?role=owner" 
//               className="hidden md:flex bg-primary-container text-on-primary-container font-label-bold px-6 py-2 rounded-full hover:scale-105 transition-all hover:shadow-lg active:scale-95"
//             >
//               List Studio
//             </Link>
//             <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full hidden md:block">
//               favorite
//             </span>
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full"
//             >
//               account_circle
//             </button>
//             <button 
//               onClick={() => setIsMobileMenuOpen(true)}
//               className="md:hidden p-2 hover:bg-primary/5 rounded-full transition-all"
//             >
//               <Bars3Icon className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div 
//         className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
//           isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div 
//           className="absolute inset-0 bg-black/50"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//         <div 
//           className={`absolute top-0 right-0 h-full w-[300px] bg-surface shadow-2xl transition-transform duration-300 ${
//             isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           }`}
//         >
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-primary">ManyRooms</span>
//               <button 
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-2 hover:bg-primary/5 rounded-full transition-all"
//               >
//                 <XMarkIcon className="w-6 h-6" />
//               </button>
//             </div>

//             <nav className="flex flex-col gap-6">
//               <Link href="/" className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
//               <Link href="/spaces" className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>Studios</Link>
//               <Link href="/cities" className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>Vibes</Link>
//               <Link href="/about" className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>Journal</Link>
              
//               <div className="border-t border-outline-variant/30 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Studio</Link>
//                 <Link href="/login" className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//                 <Link href="/support" className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4" onClick={() => setIsMobileMenuOpen(false)}>Contact Support</Link>
//                 <button className="flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
//                   <GlobeAltIcon className="w-4 h-4" />
//                   Language
//                 </button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Login/Signup Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
//           <div className="relative bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
//             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-primary/5 rounded-full transition-all">
//               <XMarkIcon className="w-5 h-5" />
//             </button>
            
//             <div className="text-center mb-8">
//               <h3 className="text-2xl font-bold text-on-surface mb-2">Welcome to ManyRooms</h3>
//               <p className="text-sm text-on-surface-variant">Find and book the perfect creative space</p>
//             </div>

//             <div className="space-y-4">
//               <Link href="/login" className="block w-full text-center bg-primary text-on-primary py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all" onClick={() => setIsModalOpen(false)}>Log in</Link>
//               <Link href="/signup" className="block w-full text-center border border-outline/30 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/5 transition-all" onClick={() => setIsModalOpen(false)}>Sign up</Link>
//               <div className="border-t border-outline-variant/30 pt-4 mt-2">
//                 <Link href="/signup?role=owner" className="block w-full text-center text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setIsModalOpen(false)}>List your space</Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 3D Animated Hero Section with moving cards */}
//       <section ref={heroRef} className="relative h-[90vh] md:h-[95vh] flex items-center justify-center px-6 md:px-16 overflow-hidden bg-surface">
//         {/* Moving image cards */}
//         <div className="absolute inset-0 z-0 pointer-events-none" style={{ perspective: '1500px' }}>
//           <div className="relative w-full h-full flex items-center justify-center">
//             {cardPositions.map((pos, index) => (
//               <div
//                 key={index}
//                 className="hero-card absolute w-[200px] h-[280px] md:w-[300px] md:h-[400px] rounded-[32px] overflow-hidden shadow-2xl border border-white/20"
//                 data-zindex={pos.zIndex}
//                 style={{
//                   backgroundImage: `url('${heroImages[index % heroImages.length]}')`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   transform: `translate(${pos.x}%, ${pos.y}%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
//                   zIndex: pos.zIndex,
//                   opacity: pos.opacity,
//                   transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
//                   boxShadow: pos.zIndex >= 3 ? '0 40px 80px rgba(0,0,0,0.4)' : '0 20px 40px rgba(0,0,0,0.2)',
//                 }}
//               />
//             ))}
//           </div>
//           {/* Gradient overlay for text readability */}
//           <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-surface/80 pointer-events-none" />
//         </div>

//         {/* Hero text content with dynamic color */}
//         <div 
//           ref={textRef}
//           className={`relative z-20 text-center max-w-4xl mx-auto pt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
//         >
//           <div className="mb-6 inline-block bg-secondary-container/90 backdrop-blur-sm px-5 py-2 rounded-full text-on-secondary-container font-label-bold pulse-glow">
//             ✨ NEW: AI SPACE DISCOVERY
//           </div>
//           <h1 
//             className="text-[56px] md:text-[84px] font-display-lg leading-none mb-8 tracking-tighter transition-colors duration-500"
//             style={{ 
//               color: textColor,
//               textShadow: textColor === '#ffffff' ? '0 2px 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(255,255,255,0.8)'
//             }}
//           >
//             Your Creative <span className="text-primary italic">Stage</span>,<br/>Redefined.
//           </h1>
//           <p 
//             className="text-[18px] md:text-[18px] max-w-xl mx-auto mb-12 font-body-lg transition-colors duration-500"
//             style={{ 
//               color: textColor === '#ffffff' ? 'rgba(255,255,255,0.9)' : '#424937',
//               textShadow: textColor === '#ffffff' ? '0 1px 10px rgba(0,0,0,0.5)' : 'none'
//             }}
//           >
//             Discover extraordinary spaces. Book instantly. Create without limits.
//           </p>
          
//           {/* AI Visual Search Bar */}
//           <div className="glass max-w-2xl mx-auto rounded-3xl p-2 flex flex-col md:flex-row items-center shadow-2xl mt-12 border-2 border-white/60 hover:border-primary/30 transition-all duration-500">
//             <div className="flex-1 px-6 flex items-center gap-3 w-full">
//               <MagnifyingGlassIcon className="w-6 h-6 text-outline flex-shrink-0" />
//               <input 
//                 className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 font-body-md placeholder:text-outline/60 outline-none" 
//                 placeholder="Describe the mood, aesthetic, or upload an image..." 
//                 type="text"
//               />
//             </div>
//             <div className="flex items-center gap-2 w-full md:w-auto p-2 md:p-0">
//               <label className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-high cursor-pointer hover:bg-secondary-container transition-all group relative" title="Upload reference image">
//                 <input className="hidden" type="file" accept="image/*"/>
//                 <PhotoIcon className="w-6 h-6 text-on-surface-variant group-hover:text-secondary transition-colors" />
//               </label>
//               <Link 
//                 href="/spaces"
//                 className="flex-1 md:flex-none bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-2xl font-label-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex items-center gap-2 justify-center"
//               >
//                 FIND SPACE
//                 <span className="text-sm">→</span>
//               </Link>
//             </div>
//           </div>
          
//           {/* Quick Stats */}
//           <div className="flex justify-center gap-8 md:gap-12 mt-16 text-center">
//             {[
//               { value: '500+', label: 'UNIQUE SPACES', delay: 300, translateX: -50 },
//               { value: '50+', label: 'CITIES', delay: 500, translateX: 0 },
//               { value: '10K+', label: 'CREATORS', delay: 700, translateX: 50 }
//             ].map((stat, i) => (
//               <div 
//                 key={i}
//                 className="transition-all duration-700"
//                 style={{ 
//                   opacity: isVisible ? 1 : 0, 
//                   transform: isVisible ? 'translateX(0)' : `translateX(${stat.translateX}px)`,
//                   transitionDelay: `${stat.delay}ms`
//                 }}
//               >
//                 <p className="text-4xl font-display-sm text-primary">{stat.value}</p>
//                 <p 
//                   className="font-label-bold text-xs tracking-wider transition-colors duration-500"
//                   style={{ color: textColor === '#ffffff' ? 'rgba(255,255,255,0.8)' : '#424937' }}
//                 >
//                   {stat.label}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Search by Vibe Section */}
//       <section className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
//           <div>
//             <span className="font-label-bold text-primary tracking-widest uppercase text-xs">DISCOVER</span>
//             <h2 className="text-[48px] font-display-sm tracking-tighter mt-2">Search by Vibe</h2>
//           </div>
//           <p className="text-[18px] text-on-surface-variant max-w-md">Our curated categories move beyond utility, focusing on the architectural soul of the space.</p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
//           <Link href="/spaces?vibe=brutalist" className="group relative overflow-hidden rounded-3xl md:col-span-2 min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[0]}')` }}></div>
//             <div className="absolute bottom-0 left-0 p-10 z-20">
//               <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-bold mb-4 inline-block">🔥 TRENDING</span>
//               <h3 className="text-white text-3xl font-display-sm mb-2">Brutalist</h3>
//               <p className="text-white/80 font-body-md">Raw concrete, dramatic scale, and uncompromising geometry.</p>
//               <p className="text-primary-fixed font-label-bold mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">Explore 45 spaces <span>→</span></p>
//             </div>
//           </Link>

//           <Link href="/spaces?vibe=organic" className="group relative overflow-hidden rounded-3xl min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-tertiary-container/40 mix-blend-overlay z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[3]}')` }}></div>
//             <div className="absolute inset-0 flex items-center justify-center z-20">
//               <div className="text-center">
//                 <h3 className="text-tertiary text-3xl -rotate-6 bg-white/95 px-8 py-3 shadow-2xl rounded-2xl font-display-sm">Organic</h3>
//                 <p className="text-tertiary/80 font-label-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Nature-meets-design</p>
//               </div>
//             </div>
//           </Link>

//           <Link href="/spaces?vibe=scifi" className="group relative overflow-hidden rounded-3xl min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-primary-fixed/30 mix-blend-color z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[4]}')` }}></div>
//             <div className="absolute bottom-8 right-8 z-20 text-right">
//               <h3 className="text-primary-fixed neon-accent text-4xl font-headline-lg">Sci-Fi</h3>
//               <p className="text-white font-label-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Futuristic & cyberpunk</p>
//               <span className="text-white text-4xl mt-2 block">↗</span>
//             </div>
//           </Link>
//         </div>
//       </section>

//       {/* Featured Studios Section */}
//       <section className="bg-surface-container py-24 px-6 md:px-16 overflow-hidden">
//         <div className="max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 mb-12">
//             <div className="h-px bg-outline-variant flex-1"></div>
//             <h2 className="font-label-bold text-primary tracking-widest uppercase">Curated Collections</h2>
//             <div className="h-px bg-outline-variant flex-1"></div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-slate-500">Loading featured spaces...</p>
//               </div>
//             </div>
//           ) : featuredSpaces.length === 0 ? (
//             <div className="text-center py-20">
//               <h4 className="text-xl font-serif mb-2">No studios available yet</h4>
//               <p className="text-slate-500 max-w-md mx-auto">We're currently curating new creative spaces. Please check back soon.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//               {featuredSpaces.map((space, index) => {
//                 const coverImage = getFirstImage(space.images);
//                 return (
//                   <Link 
//                     key={space.id} 
//                     href={`/spaces/${space.id}`}
//                     className={`group card-hover bg-surface-container-lowest rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 ${index === 1 ? 'mt-12 md:-mt-8' : ''}`}
//                   >
//                     <div className="h-[400px] relative overflow-hidden">
//                       {coverImage ? (
//                         <img src={coverImage} alt={space.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
//                         </div>
//                       )}
//                       <div className="absolute top-6 left-6 bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-2xl font-label-bold shadow-lg">
//                         ${space.hourly_rate}<span className="text-sm font-normal">/hr</span>
//                       </div>
//                       <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg cursor-pointer hover:scale-110 transition-transform">favorite</span>
//                       </div>
//                     </div>
//                     <div className="p-8">
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <h3 className="font-headline-lg mb-1">{space.name}</h3>
//                           <p className="text-on-surface-variant font-body-md flex items-center gap-1">
//                             <span className="material-symbols-outlined text-sm">location_on</span> 
//                             {space.city || 'Location TBD'}{space.state ? `, ${space.state}` : ''}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                           <span className="font-label-bold text-on-surface">4.9</span>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 flex-wrap">
//                         <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">DAYLIGHT</span>
//                         <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">CREATIVE</span>
//                         {space.description && (
//                           <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">
//                             {space.description.length > 20 ? space.description.substring(0, 20) + '...' : space.description}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Creative Talent Section */}
//       <section className="py-24 px-6 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
//         <div className="max-w-[1440px] mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             <div className="order-2 lg:order-1">
//               <div className="flex items-center gap-4 mb-6">
//                 <span className="h-1 w-12 bg-primary"></span>
//                 <span className="font-label-bold text-primary tracking-widest uppercase">Direct Talent Access</span>
//               </div>
//               <h2 className="text-[48px] font-display-sm mb-8 leading-tight">Elevate Your Production with <span className="text-secondary italic">Pro Talent.</span></h2>
//               <p className="text-[18px] text-on-surface-variant mb-12 max-w-xl">Don't just book a room. Book a crew. Browse our verified roster of world-class photographers, award-winning videographers, and visionary stylists available to hire directly for your ManyRooms session.</p>
//               <div className="flex flex-wrap gap-4">
//                 <Link href="/talent" className="bg-on-surface text-surface-bright px-10 py-4 rounded-2xl font-label-bold hover:bg-primary transition-all flex items-center gap-2 group">
//                   BOOK TALENT <span className="group-hover:translate-x-1 transition-transform">→</span>
//                 </Link>
//                 <Link href="/talent/roster" className="border-2 border-outline-variant px-10 py-4 rounded-2xl font-label-bold hover:bg-surface-container transition-all">VIEW ROSTER</Link>
//               </div>
//             </div>
//             <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
//               <div className="space-y-4">
//                 <div className="rounded-3xl overflow-hidden h-64 grayscale hover:grayscale-0 transition-all duration-700">
//                   <img alt="Cinematographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl"/>
//                 </div>
//                 <div className="bg-secondary-container p-6 rounded-3xl">
//                   <h4 className="font-headline-lg text-on-secondary-container text-xl">Styling</h4>
//                   <p className="text-on-secondary-container/70 font-body-md mt-2">Avant-garde vision for every frame.</p>
//                 </div>
//               </div>
//               <div className="space-y-4 pt-12">
//                 <div className="bg-primary-container p-6 rounded-3xl">
//                   <h4 className="font-headline-lg text-on-primary-container text-xl">Capture</h4>
//                   <p className="text-on-primary-container/70 font-body-md mt-2">Industry-leading technical precision.</p>
//                 </div>
//                 <div className="rounded-3xl overflow-hidden h-64 grayscale hover:grayscale-0 transition-all duration-700">
//                   <img alt="Photographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD"/>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Creator Stories */}
//       <section className="py-24 px-6 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
//         <div className="max-w-[1440px] mx-auto relative">
//           <div className="absolute -right-20 top-0 opacity-10 rotate-12 pointer-events-none">
//             <span className="text-[200px] text-primary font-display-lg">VOICES</span>
//           </div>
//           <h2 className="text-[48px] font-display-sm mb-20 relative z-10">Creator Stories</h2>
//           <div className="flex flex-col md:flex-row items-center gap-16 relative">
//             <div className="relative w-full md:w-1/2">
//               <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
//                 <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl" alt="Amara Chen"/>
//                 <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
//                 <div className="absolute bottom-12 left-12 right-12 text-white">
//                   <h4 className="text-3xl font-display-sm mb-1">Amara Chen</h4>
//                   <p className="font-label-bold text-primary-fixed uppercase tracking-widest">Global Cinematographer</p>
//                 </div>
//               </div>
//               <div className="absolute -bottom-10 -right-4 md:-right-10 glass p-8 rounded-3xl max-w-xs shadow-2xl border-t-4 border-primary">
//                 <p className="font-body-lg italic text-on-surface-variant mb-4">"ManyRooms doesn't just provide a space; it provides the canvas that pushes my vision further."</p>
//                 <span className="text-primary text-4xl">❝</span>
//               </div>
//             </div>

//             <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
//               <div className="bg-secondary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 floating-interaction">
//                 <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD" alt="Marcus Vane"/>
//                 </div>
//                 <h4 className="font-headline-lg text-on-secondary-container">Marcus Vane</h4>
//                 <p className="font-body-md text-on-secondary-container opacity-80">Editorial Photography Legend</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-secondary-container group">READ STORY <span className="group-hover:translate-x-2 transition-transform">→</span></button>
//               </div>
//               <div className="bg-primary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 mt-0 sm:mt-12 floating-interaction">
//                 <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8yR0fx9aF-smQaY2NFdyOzW0frJaoqEFJf23bKJn6HmD6AMnL4b8s6uK6LJXX0pE5R0eozRdwNA6UMijGqPrTugvgOyVqvuhN8M3ueGqEfXgV8Lsq2ZUm48_11dtRBWZXgflk8aTDHzf5gFWgpOzKL5mNgp3Z2qhQn-s75gRTCXCt93F2EBXd8jLzQBMODpb85NkV6ZjJY4pTpzUuaVo15E3XfCUkZs080wIYIyqtR2sqU9BflPf2DXsyReE3NfjTiTEt74-tqC2T" alt="Sofia Rossi"/>
//                 </div>
//                 <h4 className="font-headline-lg text-on-primary-container">Sofia Rossi</h4>
//                 <p className="font-body-md text-on-primary-container opacity-80">Creative Director, Aura Studio</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-primary-container group">WATCH TOUR <span className="group-hover:translate-x-2 transition-transform">▶</span></button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 px-6 md:px-16">
//         <div className="max-w-[1440px] mx-auto bg-gradient-to-br from-primary to-secondary rounded-[60px] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
//           <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, transparent 70%)' }}></div>
//           <div className="relative z-10">
//             <h2 className="text-white mb-8 text-[48px] md:text-[84px] font-display-lg leading-tight">Ready to launch your next masterpiece?</h2>
//             <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">Join the world's most innovative creative collective. From brutalist lofts to neon-soaked labs, your perfect stage is waiting.</p>
//             <div className="flex flex-col md:flex-row gap-6 justify-center">
//               <Link href="/signup" className="bg-primary-fixed text-on-primary-fixed px-12 py-5 rounded-2xl font-label-bold text-lg hover:scale-105 transition-transform shadow-xl">Join the Collective</Link>
//               <button className="glass text-white px-12 py-5 rounded-2xl font-label-bold text-lg hover:bg-white/10 transition-colors">Speak to an Agent</button>
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer />
//       <Chatbot />

//       <style jsx>{`
//         .glass { 
//           background: rgba(255, 255, 255, 0.75); 
//           backdrop-filter: blur(20px); 
//           border: 1px solid rgba(255, 255, 255, 0.3); 
//         }
//         .neon-accent { 
//           text-shadow: 0 0 15px rgba(181, 246, 87, 0.6); 
//         }
//         .floating-interaction { 
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
//         }
//         .floating-interaction:hover { 
//           transform: translateY(-8px) scale(1.02); 
//           z-index: 30; 
//         }
//         .card-hover { 
//           transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
//         }
//         .card-hover:hover { 
//           transform: translateY(-12px); 
//           box-shadow: 0 30px 60px rgba(0,0,0,0.15); 
//         }
//         .pulse-glow {
//           animation: pulse-glow 3s ease-in-out infinite;
//         }
//         @keyframes pulse-glow {
//           0%, 100% { box-shadow: 0 0 20px rgba(181, 246, 87, 0.3); }
//           50% { box-shadow: 0 0 40px rgba(181, 246, 87, 0.6); }
//         }
//         .hero-card {
//           will-change: transform;
//         }
//       `}</style>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, Bars3Icon, XMarkIcon, GlobeAltIcon, PlayIcon, StarIcon, PhotoIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import './home.css';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   hourly_rate: number;
//   images: string[];
//   status: string;
//   description: string;
// }

// export default function HomePage() {
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   const heroImages = [
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDo9P8cWMtlxC-vTKW_d789xE15ySyxsMb_U8Qe2iYrUWUJBlZ11z5sKoQQW5e-jeLwqaQOM0Kgb7ebgD6PqdUAKnW2S18GHubom8jAuDBqLBKkgP-ja77FpNibRKYP2eTFbt1LWmw_r-Tcwy29nP0kT3ERHsQ7AALtSKG623o-AmbEdIQSysiYVdkv3wzhPfpeuqsQUGNGfe0yYSqFPrzrb85t6zX4hO_Sp7K94b89goSxv0XdXC3e8wP-E5VGz5gk57zVVUbwzSDM',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDSwmSKLUnWOMsQ3GugJdlOZS5BByKJaiEs61TyG209DcA2Bqys9Or3aAbjaOFLiR8KH9xts5is8WOCU89o8TxY4EuPTx3Y7eINF0W0JjMW8ZZ5xYUZB5ThUYmjzzq6EERLeNzzD0U1o50RoOSqZqR1kCc67u55wSoCa7qKpALt43g75uDvONV3VOrCUDZoDHw_1nvmvMdKyGSZQvV-ffQc-yIuf-LaLoT3SWHaSi85V5-kEkwfNlO-MZv8WnnM-HWMlBvx5TYjJB6F'
//   ];

//   // Fetch approved studios from Supabase
//   useEffect(() => {
//     fetchApprovedStudios();
//     setTimeout(() => setIsVisible(true), 100);
//   }, []);

//   // Prevent body scroll when mobile menu is open
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isMobileMenuOpen]);

//   // Scroll animation
//   useEffect(() => {
//     const handleScroll = () => {
//       const nav = document.querySelector('nav');
//       if (nav) {
//         if (window.scrollY > 50) {
//           nav.classList.add('py-2', 'shadow-md');
//           nav.classList.remove('py-4', 'shadow-sm');
//         } else {
//           nav.classList.add('py-4', 'shadow-sm');
//           nav.classList.remove('py-2', 'shadow-md');
//         }
//       }
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .limit(3);

//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFirstImage = (images: string[]) => {
//     if (!images || images.length === 0) return null;
//     return images[0];
//   };

//   return (
//     <div className="home-page bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
//         <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-8">
//             <Link href="/" className="group">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9DZnYRdMuRfh66s2y0aufTN6zhyFmIsA5aK66cuCBeLINs4QoP8IyjpBAQjHuPpHixsYPB1HMPOBhT7mUKu2qy7il9h__oTnAUvQ8EU5qv270iXUsGRbz-PlJjGMU5ixs4CUyHd9GoHjR9KulnOy4sz-3QN2VkRzW39ONL6ynO2nSLAUh3VRvj_U51r7i6CxOGm9pnjSOVDUTZd2P3m_LTCAchKE5VwHb0k6YYjDoduMHQU4iyejUYtTsGr0VhJR4tasKZ-e6qrWQ"
//               />
//             </Link>
//             <div className="hidden md:flex gap-6">
//               <Link href="/" className="text-primary font-bold border-b-2 border-primary py-1 transition-all hover:scale-105">Marketplace</Link>
//               <Link href="/spaces" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Studios</Link>
//               <Link href="/cities" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Vibes</Link>
//               <Link href="/about" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Journal</Link>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/signup?role=owner" 
//               className="hidden md:flex bg-primary-container text-on-primary-container font-label-bold px-6 py-2 rounded-full hover:scale-105 transition-all hover:shadow-lg active:scale-95"
//             >
//               List Studio
//             </Link>
//             <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full hidden md:block">
//               favorite
//             </span>
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full"
//             >
//               account_circle
//             </button>
//             {/* Mobile Menu Button */}
//             <button 
//               onClick={() => setIsMobileMenuOpen(true)}
//               className="md:hidden p-2 hover:bg-primary/5 rounded-full transition-all"
//             >
//               <Bars3Icon className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div 
//         className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
//           isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div 
//           className="absolute inset-0 bg-black/50"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//         <div 
//           className={`absolute top-0 right-0 h-full w-[300px] bg-surface shadow-2xl transition-transform duration-300 ${
//             isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           }`}
//         >
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-primary">ManyRooms</span>
//               <button 
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-2 hover:bg-primary/5 rounded-full transition-all"
//               >
//                 <XMarkIcon className="w-6 h-6" />
//               </button>
//             </div>

//             <nav className="flex flex-col gap-6">
//               <Link 
//                 href="/" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Marketplace
//               </Link>
//               <Link 
//                 href="/spaces" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Studios
//               </Link>
//               <Link 
//                 href="/cities" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Vibes
//               </Link>
//               <Link 
//                 href="/about" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Journal
//               </Link>
              
//               <div className="border-t border-outline-variant/30 pt-6 mt-2">
//                 <Link 
//                   href="/signup?role=owner" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   List Studio
//                 </Link>
//                 <Link 
//                   href="/login" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Log in
//                 </Link>
//                 <Link 
//                   href="/signup" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Sign up
//                 </Link>
//                 <Link 
//                   href="/support" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Contact Support
//                 </Link>
//                 <button className="flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
//                   <GlobeAltIcon className="w-4 h-4" />
//                   Language
//                 </button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Login/Signup Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
//           <div 
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setIsModalOpen(false)}
//           />
//           <div className="relative bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
//             <button 
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-4 p-2 hover:bg-primary/5 rounded-full transition-all"
//             >
//               <XMarkIcon className="w-5 h-5" />
//             </button>
            
//             <div className="text-center mb-8">
//               <h3 className="text-2xl font-bold text-on-surface mb-2">Welcome to ManyRooms</h3>
//               <p className="text-sm text-on-surface-variant">Find and book the perfect creative space</p>
//             </div>

//             <div className="space-y-4">
//               <Link 
//                 href="/login" 
//                 className="block w-full text-center bg-primary text-on-primary py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Log in
//               </Link>
//               <Link 
//                 href="/signup" 
//                 className="block w-full text-center border border-outline/30 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/5 transition-all"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Sign up
//               </Link>
//               <div className="border-t border-outline-variant/30 pt-4 mt-2">
//                 <Link 
//                   href="/signup?role=owner" 
//                   className="block w-full text-center text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   List your space
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 3D Animated Hero Section */}
//       <section className="relative h-[90vh] md:h-[95vh] flex items-center justify-center px-6 md:px-16 overflow-hidden bg-surface">
//         {/* 3D moving images container */}
//         <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
//           <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center">
//             {/* Card 1 - back left */}
//             <div 
//               className="absolute w-[220px] h-[300px] md:w-[320px] md:h-[420px] rounded-[32px] overflow-hidden shadow-2xl border border-white/40"
//               style={{
//                 backgroundImage: `url('${heroImages[0]}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 transform: 'translateX(-180px) translateY(-20px) rotate(-6deg) scale(0.9)',
//                 zIndex: 1,
//                 opacity: 0.9,
//                 animation: 'floatSlow 8s ease-in-out infinite alternate'
//               }}
//             />
//             {/* Card 2 - front center main */}
//             <div 
//               className="absolute w-[220px] h-[300px] md:w-[320px] md:h-[420px] rounded-[32px] overflow-hidden shadow-2xl border border-white/40"
//               style={{
//                 backgroundImage: `url('${heroImages[1]}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 transform: 'translateX(0px) translateY(10px) rotate(0deg) scale(1)',
//                 zIndex: 3,
//                 boxShadow: '0 40px 70px rgba(0,0,0,0.3)',
//                 animation: 'floatMedium 10s ease-in-out infinite alternate'
//               }}
//             />
//             {/* Card 3 - right back */}
//             <div 
//               className="absolute w-[220px] h-[300px] md:w-[320px] md:h-[420px] rounded-[32px] overflow-hidden shadow-2xl border border-white/40"
//               style={{
//                 backgroundImage: `url('${heroImages[2]}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 transform: 'translateX(180px) translateY(-15px) rotate(6deg) scale(0.92)',
//                 zIndex: 2,
//                 opacity: 0.9,
//                 animation: 'floatFast 7s ease-in-out infinite alternate'
//               }}
//             />
//           </div>
//           {/* subtle gradient overlay to maintain text readability */}
//           <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-surface/90 pointer-events-none"></div>
//         </div>

//         {/* Hero text content */}
//         <div className={`relative z-10 text-center max-w-4xl mx-auto pt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//           <div className="mb-6 inline-block bg-secondary-container px-5 py-2 rounded-full text-on-secondary-container font-label-bold pulse-glow">
//             ✨ NEW: AI SPACE DISCOVERY
//           </div>
//           <h1 className="text-[56px] md:text-[84px] font-display-lg text-on-surface leading-none mb-8 tracking-tighter">
//             Your Creative <span className="text-primary italic">Stage</span>,<br/>Redefined.
//           </h1>
//           <p className="text-[18px] md:text-[18px] text-on-surface-variant max-w-xl mx-auto mb-12 font-body-lg">
//             Discover extraordinary spaces. Book instantly. Create without limits.
//           </p>
          
//           {/* AI Visual Search Bar */}
//           <div className="glass max-w-2xl mx-auto rounded-3xl p-2 flex flex-col md:flex-row items-center shadow-2xl mt-12 border-2 border-white/60 hover:border-primary/30 transition-all duration-500">
//             <div className="flex-1 px-6 flex items-center gap-3 w-full">
//               <MagnifyingGlassIcon className="w-6 h-6 text-outline flex-shrink-0" />
//               <input 
//                 className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 font-body-md placeholder:text-outline/60 outline-none" 
//                 placeholder="Describe the mood, aesthetic, or upload an image..." 
//                 type="text"
//               />
//             </div>
//             <div className="flex items-center gap-2 w-full md:w-auto p-2 md:p-0">
//               <label className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-high cursor-pointer hover:bg-secondary-container transition-all group relative" title="Upload reference image">
//                 <input className="hidden" type="file" accept="image/*"/>
//                 <PhotoIcon className="w-6 h-6 text-on-surface-variant group-hover:text-secondary transition-colors" />
//               </label>
//               <Link 
//                 href="/spaces"
//                 className="flex-1 md:flex-none bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-2xl font-label-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex items-center gap-2 justify-center"
//               >
//                 FIND SPACE
//                 <span className="text-sm">→</span>
//               </Link>
//             </div>
//           </div>
          
//           {/* Quick Stats */}
//           <div className="flex justify-center gap-8 md:gap-12 mt-16 text-center">
//             <div className="transition-all duration-700 delay-300" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-50px)' }}>
//               <p className="text-4xl font-display-sm text-primary">500+</p>
//               <p className="font-label-bold text-on-surface-variant text-xs tracking-wider">UNIQUE SPACES</p>
//             </div>
//             <div className="transition-all duration-700 delay-500" style={{ opacity: isVisible ? 1 : 0 }}>
//               <p className="text-4xl font-display-sm text-primary">50+</p>
//               <p className="font-label-bold text-on-surface-variant text-xs tracking-wider">CITIES</p>
//             </div>
//             <div className="transition-all duration-700 delay-700" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(50px)' }}>
//               <p className="text-4xl font-display-sm text-primary">10K+</p>
//               <p className="font-label-bold text-on-surface-variant text-xs tracking-wider">CREATORS</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Search by Vibe Section */}
//       <section className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
//           <div>
//             <span className="font-label-bold text-primary tracking-widest uppercase text-xs">DISCOVER</span>
//             <h2 className="text-[48px] font-display-sm tracking-tighter mt-2">Search by Vibe</h2>
//           </div>
//           <p className="text-[18px] text-on-surface-variant max-w-md">Our curated categories move beyond utility, focusing on the architectural soul of the space.</p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
//           {/* Brutalist */}
//           <Link href="/spaces?vibe=brutalist" className="group relative overflow-hidden rounded-3xl md:col-span-2 min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[0]}')` }}></div>
//             <div className="absolute bottom-0 left-0 p-10 z-20">
//               <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-bold mb-4 inline-block">🔥 TRENDING</span>
//               <h3 className="text-white text-3xl font-display-sm mb-2">Brutalist</h3>
//               <p className="text-white/80 font-body-md">Raw concrete, dramatic scale, and uncompromising geometry.</p>
//               <p className="text-primary-fixed font-label-bold mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 Explore 45 spaces <span>→</span>
//               </p>
//             </div>
//           </Link>

//           {/* Organic */}
//           <Link href="/spaces?vibe=organic" className="group relative overflow-hidden rounded-3xl min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-tertiary-container/40 mix-blend-overlay z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtaHsD_Ee0OXgccRwyuBHMMGBF5R9Wv7zL6xdfFmVFYNTibEc531TN2DKYpRcRHkWa6LNR-2FEaFzFCKoH7alTA6ZN4q7jb2vYuVe8qo4dKOIRupQxXdeWuFfgP-ZD-bYdZ4y83gObwQRQga8Gb2f8GOaemUrFtQcqt_0rcQZ_GS3KH-aiNPL50ZBFTzVERvqcftQZLBU1XEGVqm59af7kBpaAV0rreAUxgHeTcLcawMQ__wUXvyFc0Ko9pGwkWWs9A1g6uMKIjl5F')" }}></div>
//             <div className="absolute inset-0 flex items-center justify-center z-20">
//               <div className="text-center">
//                 <h3 className="text-tertiary text-3xl -rotate-6 bg-white/95 px-8 py-3 shadow-2xl rounded-2xl font-display-sm">Organic</h3>
//                 <p className="text-tertiary/80 font-label-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Nature-meets-design</p>
//               </div>
//             </div>
//           </Link>

//           {/* Sci-Fi */}
//           <Link href="/spaces?vibe=scifi" className="group relative overflow-hidden rounded-3xl min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-primary-fixed/30 mix-blend-color z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[2]}')` }}></div>
//             <div className="absolute bottom-8 right-8 z-20 text-right">
//               <h3 className="text-primary-fixed neon-accent text-4xl font-headline-lg">Sci-Fi</h3>
//               <p className="text-white font-label-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Futuristic & cyberpunk</p>
//               <span className="text-white text-4xl mt-2 block">↗</span>
//             </div>
//           </Link>
//         </div>
//       </section>

//       {/* Featured Studios - YOUR ORIGINAL STUDIO SECTION */}
//       <section className="bg-surface-container py-24 px-6 md:px-16 overflow-hidden">
//         <div className="max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 mb-12">
//             <div className="h-px bg-outline-variant flex-1"></div>
//             <h2 className="font-label-bold text-primary tracking-widest uppercase">Curated Collections</h2>
//             <div className="h-px bg-outline-variant flex-1"></div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-slate-500">Loading featured spaces...</p>
//               </div>
//             </div>
//           ) : featuredSpaces.length === 0 ? (
//             <div className="text-center py-20">
//               <h4 className="text-xl font-serif mb-2">No studios available yet</h4>
//               <p className="text-slate-500 max-w-md mx-auto">We're currently curating new creative spaces. Please check back soon.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//               {featuredSpaces.map((space, index) => {
//                 const coverImage = getFirstImage(space.images);
//                 return (
//                   <Link 
//                     key={space.id} 
//                     href={`/spaces/${space.id}`}
//                     className={`group card-hover bg-surface-container-lowest rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 ${index === 1 ? 'mt-12 md:-mt-8' : ''}`}
//                   >
//                     <div className="h-[400px] relative overflow-hidden">
//                       {coverImage ? (
//                         <img 
//                           src={coverImage}
//                           alt={space.name}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
//                         </div>
//                       )}
//                       <div className="absolute top-6 left-6 bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-2xl font-label-bold shadow-lg">
//                         ${space.hourly_rate}<span className="text-sm font-normal">/hr</span>
//                       </div>
//                       <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg cursor-pointer hover:scale-110 transition-transform">favorite</span>
//                       </div>
//                     </div>
//                     <div className="p-8">
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <h3 className="font-headline-lg mb-1">{space.name}</h3>
//                           <p className="text-on-surface-variant font-body-md flex items-center gap-1">
//                             <span className="material-symbols-outlined text-sm">location_on</span> 
//                             {space.city || 'Location TBD'}{space.state ? `, ${space.state}` : ''}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                           <span className="font-label-bold text-on-surface">4.9</span>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 flex-wrap">
//                         <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">DAYLIGHT</span>
//                         <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">CREATIVE</span>
//                         {space.description && (
//                           <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">
//                             {space.description.length > 20 ? space.description.substring(0, 20) + '...' : space.description}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Creative Talent Section */}
//       <section className="py-24 px-6 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
//         <div className="max-w-[1440px] mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             <div className="order-2 lg:order-1">
//               <div className="flex items-center gap-4 mb-6">
//                 <span className="h-1 w-12 bg-primary"></span>
//                 <span className="font-label-bold text-primary tracking-widest uppercase">Direct Talent Access</span>
//               </div>
//               <h2 className="text-[48px] font-display-sm mb-8 leading-tight">Elevate Your Production with <span className="text-secondary italic">Pro Talent.</span></h2>
//               <p className="text-[18px] text-on-surface-variant mb-12 max-w-xl">
//                 Don't just book a room. Book a crew. Browse our verified roster of world-class photographers, award-winning videographers, and visionary stylists available to hire directly for your ManyRooms session.
//               </p>
//               <div className="flex flex-wrap gap-4">
//                 <Link 
//                   href="/talent"
//                   className="bg-on-surface text-surface-bright px-10 py-4 rounded-2xl font-label-bold hover:bg-primary transition-all flex items-center gap-2 group"
//                 >
//                   BOOK TALENT <span className="group-hover:translate-x-1 transition-transform">→</span>
//                 </Link>
//                 <Link 
//                   href="/talent/roster"
//                   className="border-2 border-outline-variant px-10 py-4 rounded-2xl font-label-bold hover:bg-surface-container transition-all"
//                 >
//                   VIEW ROSTER
//                 </Link>
//               </div>
//             </div>
//             <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
//               <div className="space-y-4">
//                 <div className="rounded-3xl overflow-hidden h-64 grayscale hover:grayscale-0 transition-all duration-700">
//                   <img alt="Cinematographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl"/>
//                 </div>
//                 <div className="bg-secondary-container p-6 rounded-3xl">
//                   <h4 className="font-headline-lg text-on-secondary-container text-xl">Styling</h4>
//                   <p className="text-on-secondary-container/70 font-body-md mt-2">Avant-garde vision for every frame.</p>
//                 </div>
//               </div>
//               <div className="space-y-4 pt-12">
//                 <div className="bg-primary-container p-6 rounded-3xl">
//                   <h4 className="font-headline-lg text-on-primary-container text-xl">Capture</h4>
//                   <p className="text-on-primary-container/70 font-body-md mt-2">Industry-leading technical precision.</p>
//                 </div>
//                 <div className="rounded-3xl overflow-hidden h-64 grayscale hover:grayscale-0 transition-all duration-700">
//                   <img alt="Photographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD"/>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Creator Stories */}
//       <section className="py-24 px-6 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
//         <div className="max-w-[1440px] mx-auto relative">
//           <div className="absolute -right-20 top-0 opacity-10 rotate-12 pointer-events-none">
//             <span className="text-[200px] text-primary font-display-lg">VOICES</span>
//           </div>
//           <h2 className="text-[48px] font-display-sm mb-20 relative z-10">Creator Stories</h2>
//           <div className="flex flex-col md:flex-row items-center gap-16 relative">
//             <div className="relative w-full md:w-1/2">
//               <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
//                 <img 
//                   className="w-full h-full object-cover" 
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl" 
//                   alt="Amara Chen"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
//                 <div className="absolute bottom-12 left-12 right-12 text-white">
//                   <h4 className="text-3xl font-display-sm mb-1">Amara Chen</h4>
//                   <p className="font-label-bold text-primary-fixed uppercase tracking-widest">Global Cinematographer</p>
//                 </div>
//               </div>
//               <div className="absolute -bottom-10 -right-4 md:-right-10 glass p-8 rounded-3xl max-w-xs shadow-2xl border-t-4 border-primary">
//                 <p className="font-body-lg italic text-on-surface-variant mb-4">
//                   "ManyRooms doesn't just provide a space; it provides the canvas that pushes my vision further."
//                 </p>
//                 <span className="text-primary text-4xl">❝</span>
//               </div>
//             </div>

//             <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
//               <div className="bg-secondary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 floating-interaction">
//                 <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD" alt="Marcus Vane" />
//                 </div>
//                 <h4 className="font-headline-lg text-on-secondary-container">Marcus Vane</h4>
//                 <p className="font-body-md text-on-secondary-container opacity-80">Editorial Photography Legend</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-secondary-container group">
//                   READ STORY <span className="group-hover:translate-x-2 transition-transform">→</span>
//                 </button>
//               </div>

//               <div className="bg-primary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 mt-0 sm:mt-12 floating-interaction">
//                 <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8yR0fx9aF-smQaY2NFdyOzW0frJaoqEFJf23bKJn6HmD6AMnL4b8s6uK6LJXX0pE5R0eozRdwNA6UMijGqPrTugvgOyVqvuhN8M3ueGqEfXgV8Lsq2ZUm48_11dtRBWZXgflk8aTDHzf5gFWgpOzKL5mNgp3Z2qhQn-s75gRTCXCt93F2EBXd8jLzQBMODpb85NkV6ZjJY4pTpzUuaVo15E3XfCUkZs080wIYIyqtR2sqU9BflPf2DXsyReE3NfjTiTEt74-tqC2T" alt="Sofia Rossi" />
//                 </div>
//                 <h4 className="font-headline-lg text-on-primary-container">Sofia Rossi</h4>
//                 <p className="font-body-md text-on-primary-container opacity-80">Creative Director, Aura Studio</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-primary-container group">
//                   WATCH TOUR <span className="group-hover:translate-x-2 transition-transform">▶</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 px-6 md:px-16">
//         <div className="max-w-[1440px] mx-auto bg-gradient-to-br from-primary to-secondary rounded-[60px] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
//           <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, transparent 70%)' }}></div>
//           <div className="relative z-10">
//             <h2 className="text-white mb-8 text-[48px] md:text-[84px] font-display-lg leading-tight">Ready to launch your next masterpiece?</h2>
//             <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">Join the world's most innovative creative collective. From brutalist lofts to neon-soaked labs, your perfect stage is waiting.</p>
//             <div className="flex flex-col md:flex-row gap-6 justify-center">
//               <Link 
//                 href="/signup"
//                 className="bg-primary-fixed text-on-primary-fixed px-12 py-5 rounded-2xl font-label-bold text-lg hover:scale-105 transition-transform shadow-xl"
//               >
//                 Join the Collective
//               </Link>
//               <button className="glass text-white px-12 py-5 rounded-2xl font-label-bold text-lg hover:bg-white/10 transition-colors">
//                 Speak to an Agent
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />

//       {/* Chatbot */}
//       <Chatbot />

//       <style jsx>{`
//         .glass { 
//           background: rgba(255, 255, 255, 0.75); 
//           backdrop-filter: blur(20px); 
//           border: 1px solid rgba(255, 255, 255, 0.3); 
//         }
//         .neon-accent { 
//           text-shadow: 0 0 15px rgba(181, 246, 87, 0.6); 
//         }
//         .floating-interaction { 
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
//         }
//         .floating-interaction:hover { 
//           transform: translateY(-8px) scale(1.02); 
//           z-index: 30; 
//         }
//         .card-hover { 
//           transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
//         }
//         .card-hover:hover { 
//           transform: translateY(-12px); 
//           box-shadow: 0 30px 60px rgba(0,0,0,0.15); 
//         }
//         .pulse-glow {
//           animation: pulse-glow 3s ease-in-out infinite;
//         }
        
//         @keyframes floatSlow {
//           0% { transform: translateX(-180px) translateY(-20px) rotate(-6deg) scale(0.9); }
//           100% { transform: translateX(-180px) translateY(-45px) rotate(-4deg) scale(0.9); }
//         }
//         @keyframes floatMedium {
//           0% { transform: translateX(0px) translateY(10px) rotate(0deg) scale(1); }
//           100% { transform: translateX(0px) translateY(-15px) rotate(1deg) scale(1); }
//         }
//         @keyframes floatFast {
//           0% { transform: translateX(180px) translateY(-15px) rotate(6deg) scale(0.92); }
//           100% { transform: translateX(180px) translateY(-35px) rotate(5deg) scale(0.92); }
//         }
//         @keyframes pulse-glow {
//           0%, 100% { box-shadow: 0 0 20px rgba(181, 246, 87, 0.3); }
//           50% { box-shadow: 0 0 40px rgba(181, 246, 87, 0.6); }
//         }
//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .duration-1500 {
//           transition-duration: 1500ms;
//         }
//       `}</style>
//     </div>
//   );
// }




// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, Bars3Icon, XMarkIcon, GlobeAltIcon, PlayIcon, StarIcon, PhotoIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import './home.css';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   hourly_rate: number;
//   images: string[];
//   status: string;
//   description: string;
// }

// export default function HomePage() {
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const heroImages = [
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDo9P8cWMtlxC-vTKW_d789xE15ySyxsMb_U8Qe2iYrUWUJBlZ11z5sKoQQW5e-jeLwqaQOM0Kgb7ebgD6PqdUAKnW2S18GHubom8jAuDBqLBKkgP-ja77FpNibRKYP2eTFbt1LWmw_r-Tcwy29nP0kT3ERHsQ7AALtSKG623o-AmbEdIQSysiYVdkv3wzhPfpeuqsQUGNGfe0yYSqFPrzrb85t6zX4hO_Sp7K94b89goSxv0XdXC3e8wP-E5VGz5gk57zVVUbwzSDM',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDSwmSKLUnWOMsQ3GugJdlOZS5BByKJaiEs61TyG209DcA2Bqys9Or3aAbjaOFLiR8KH9xts5is8WOCU89o8TxY4EuPTx3Y7eINF0W0JjMW8ZZ5xYUZB5ThUYmjzzq6EERLeNzzD0U1o50RoOSqZqR1kCc67u55wSoCa7qKpALt43g75uDvONV3VOrCUDZoDHw_1nvmvMdKyGSZQvV-ffQc-yIuf-LaLoT3SWHaSi85V5-kEkwfNlO-MZv8WnnM-HWMlBvx5TYjJB6F'
//   ];

//   // Fetch approved studios from Supabase
//   useEffect(() => {
//     fetchApprovedStudios();
//     setTimeout(() => setIsVisible(true), 100);
//   }, []);

//   // Hero carousel
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % heroImages.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // Prevent body scroll when mobile menu is open
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isMobileMenuOpen]);

//   // Scroll animation
//   useEffect(() => {
//     const handleScroll = () => {
//       const nav = document.querySelector('nav');
//       if (nav) {
//         if (window.scrollY > 50) {
//           nav.classList.add('py-2', 'shadow-md');
//           nav.classList.remove('py-4', 'shadow-sm');
//         } else {
//           nav.classList.add('py-4', 'shadow-sm');
//           nav.classList.remove('py-2', 'shadow-md');
//         }
//       }
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .limit(3);

//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFirstImage = (images: string[]) => {
//     if (!images || images.length === 0) return null;
//     return images[0];
//   };

//   return (
//     <div className="home-page bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
//         <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-8">
//             <Link href="/" className="group">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9DZnYRdMuRfh66s2y0aufTN6zhyFmIsA5aK66cuCBeLINs4QoP8IyjpBAQjHuPpHixsYPB1HMPOBhT7mUKu2qy7il9h__oTnAUvQ8EU5qv270iXUsGRbz-PlJjGMU5ixs4CUyHd9GoHjR9KulnOy4sz-3QN2VkRzW39ONL6ynO2nSLAUh3VRvj_U51r7i6CxOGm9pnjSOVDUTZd2P3m_LTCAchKE5VwHb0k6YYjDoduMHQU4iyejUYtTsGr0VhJR4tasKZ-e6qrWQ"
//               />
//             </Link>
//             <div className="hidden md:flex gap-6">
//               <Link href="/" className="text-primary font-bold border-b-2 border-primary py-1 transition-all hover:scale-105">Marketplace</Link>
//               <Link href="/spaces" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Studios</Link>
//               <Link href="/cities" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Vibes</Link>
//               <Link href="/about" className="text-on-surface-variant hover:text-primary transition-all py-1 hover:scale-105">Journal</Link>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/signup?role=owner" 
//               className="hidden md:flex bg-primary-container text-on-primary-container font-label-bold px-6 py-2 rounded-full hover:scale-105 transition-all hover:shadow-lg active:scale-95"
//             >
//               List Studio
//             </Link>
//             <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full hidden md:block">
//               favorite
//             </span>
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full"
//             >
//               account_circle
//             </button>
//             {/* Mobile Menu Button */}
//             <button 
//               onClick={() => setIsMobileMenuOpen(true)}
//               className="md:hidden p-2 hover:bg-primary/5 rounded-full transition-all"
//             >
//               <Bars3Icon className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div 
//         className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
//           isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div 
//           className="absolute inset-0 bg-black/50"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//         <div 
//           className={`absolute top-0 right-0 h-full w-[300px] bg-surface shadow-2xl transition-transform duration-300 ${
//             isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           }`}
//         >
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-primary">ManyRooms</span>
//               <button 
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-2 hover:bg-primary/5 rounded-full transition-all"
//               >
//                 <XMarkIcon className="w-6 h-6" />
//               </button>
//             </div>

//             <nav className="flex flex-col gap-6">
//               <Link 
//                 href="/" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Marketplace
//               </Link>
//               <Link 
//                 href="/spaces" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Studios
//               </Link>
//               <Link 
//                 href="/cities" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Vibes
//               </Link>
//               <Link 
//                 href="/about" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Journal
//               </Link>
              
//               <div className="border-t border-outline-variant/30 pt-6 mt-2">
//                 <Link 
//                   href="/signup?role=owner" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   List Studio
//                 </Link>
//                 <Link 
//                   href="/login" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Log in
//                 </Link>
//                 <Link 
//                   href="/signup" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Sign up
//                 </Link>
//                 <Link 
//                   href="/support" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Contact Support
//                 </Link>
//                 <button className="flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
//                   <GlobeAltIcon className="w-4 h-4" />
//                   Language
//                 </button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Login/Signup Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
//           <div 
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setIsModalOpen(false)}
//           />
//           <div className="relative bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
//             <button 
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-4 p-2 hover:bg-primary/5 rounded-full transition-all"
//             >
//               <XMarkIcon className="w-5 h-5" />
//             </button>
            
//             <div className="text-center mb-8">
//               <h3 className="text-2xl font-bold text-on-surface mb-2">Welcome to ManyRooms</h3>
//               <p className="text-sm text-on-surface-variant">Find and book the perfect creative space</p>
//             </div>

//             <div className="space-y-4">
//               <Link 
//                 href="/login" 
//                 className="block w-full text-center bg-primary text-on-primary py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Log in
//               </Link>
//               <Link 
//                 href="/signup" 
//                 className="block w-full text-center border border-outline/30 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/5 transition-all"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Sign up
//               </Link>
//               <div className="border-t border-outline-variant/30 pt-4 mt-2">
//                 <Link 
//                   href="/signup?role=owner" 
//                   className="block w-full text-center text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   List your space
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Hero Section with Carousel */}
//       <section className="relative h-[90vh] md:h-[95vh] flex items-center justify-center px-6 md:px-16 overflow-hidden">
//         {/* Hero Gallery Background */}
//         <div className="absolute inset-0 z-0 bg-surface">
//           <div className="relative w-full h-full">
//             {heroImages.map((image, index) => (
//               <div
//                 key={index}
//                 className={`absolute inset-0 transition-opacity duration-1500 ease-in-out bg-cover bg-center ${
//                   index === currentSlide ? 'opacity-100' : 'opacity-0'
//                 }`}
//                 style={{
//                   backgroundImage: `url('${image}')`,
//                   animation: index === currentSlide ? 'hero-zoom 12s linear infinite alternate' : 'none'
//                 }}
//               />
//             ))}
//             <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/15 to-surface"></div>
//           </div>
//         </div>

//         <div className={`relative z-10 text-center max-w-4xl mx-auto pt-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//           <div className="mb-6 inline-block bg-secondary-container px-5 py-2 rounded-full text-on-secondary-container font-label-bold pulse-glow">
//             ✨ NEW: AI SPACE DISCOVERY
//           </div>
//           <h1 className="text-[56px] md:text-[84px] font-display-lg text-on-surface leading-none mb-8 tracking-tighter">
//             Your Creative <span className="text-primary italic">Stage</span>,<br/>Redefined.
//           </h1>
//           <p className="text-[18px] md:text-[18px] text-on-surface-variant max-w-xl mx-auto mb-12 font-body-lg">
//             Discover extraordinary spaces. Book instantly. Create without limits.
//           </p>
          
//           {/* AI Visual Search Bar */}
//           <div className="glass max-w-2xl mx-auto rounded-3xl p-2 flex flex-col md:flex-row items-center shadow-2xl mt-12 border-2 border-white/60 hover:border-primary/30 transition-all duration-500">
//             <div className="flex-1 px-6 flex items-center gap-3 w-full">
//               <MagnifyingGlassIcon className="w-6 h-6 text-outline flex-shrink-0" />
//               <input 
//                 className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 font-body-md placeholder:text-outline/60 outline-none" 
//                 placeholder="Describe the mood, aesthetic, or upload an image..." 
//                 type="text"
//               />
//             </div>
//             <div className="flex items-center gap-2 w-full md:w-auto p-2 md:p-0">
//               <label className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-high cursor-pointer hover:bg-secondary-container transition-all group relative" title="Upload reference image">
//                 <input className="hidden" type="file" accept="image/*"/>
//                 <PhotoIcon className="w-6 h-6 text-on-surface-variant group-hover:text-secondary transition-colors" />
//               </label>
//               <Link 
//                 href="/spaces"
//                 className="flex-1 md:flex-none bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-2xl font-label-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex items-center gap-2 justify-center"
//               >
//                 FIND SPACE
//                 <span className="text-sm">→</span>
//               </Link>
//             </div>
//           </div>
          
//           {/* Quick Stats */}
//           <div className="flex justify-center gap-8 md:gap-12 mt-16 text-center">
//             <div className="transition-all duration-700 delay-300" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(-50px)' }}>
//               <p className="text-4xl font-display-sm text-primary">500+</p>
//               <p className="font-label-bold text-on-surface-variant text-xs tracking-wider">UNIQUE SPACES</p>
//             </div>
//             <div className="transition-all duration-700 delay-500" style={{ opacity: isVisible ? 1 : 0 }}>
//               <p className="text-4xl font-display-sm text-primary">50+</p>
//               <p className="font-label-bold text-on-surface-variant text-xs tracking-wider">CITIES</p>
//             </div>
//             <div className="transition-all duration-700 delay-700" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(50px)' }}>
//               <p className="text-4xl font-display-sm text-primary">10K+</p>
//               <p className="font-label-bold text-on-surface-variant text-xs tracking-wider">CREATORS</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Search by Vibe Section */}
//       <section className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
//           <div>
//             <span className="font-label-bold text-primary tracking-widest uppercase text-xs">DISCOVER</span>
//             <h2 className="text-[48px] font-display-sm tracking-tighter mt-2">Search by Vibe</h2>
//           </div>
//           <p className="text-[18px] text-on-surface-variant max-w-md">Our curated categories move beyond utility, focusing on the architectural soul of the space.</p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
//           {/* Brutalist */}
//           <Link href="/spaces?vibe=brutalist" className="group relative overflow-hidden rounded-3xl md:col-span-2 min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2')" }}></div>
//             <div className="absolute bottom-0 left-0 p-10 z-20">
//               <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-bold mb-4 inline-block">🔥 TRENDING</span>
//               <h3 className="text-white text-3xl font-display-sm mb-2">Brutalist</h3>
//               <p className="text-white/80 font-body-md">Raw concrete, dramatic scale, and uncompromising geometry.</p>
//               <p className="text-primary-fixed font-label-bold mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 Explore 45 spaces <span>→</span>
//               </p>
//             </div>
//           </Link>

//           {/* Organic */}
//           <Link href="/spaces?vibe=organic" className="group relative overflow-hidden rounded-3xl min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-tertiary-container/40 mix-blend-overlay z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtaHsD_Ee0OXgccRwyuBHMMGBF5R9Wv7zL6xdfFmVFYNTibEc531TN2DKYpRcRHkWa6LNR-2FEaFzFCKoH7alTA6ZN4q7jb2vYuVe8qo4dKOIRupQxXdeWuFfgP-ZD-bYdZ4y83gObwQRQga8Gb2f8GOaemUrFtQcqt_0rcQZ_GS3KH-aiNPL50ZBFTzVERvqcftQZLBU1XEGVqm59af7kBpaAV0rreAUxgHeTcLcawMQ__wUXvyFc0Ko9pGwkWWs9A1g6uMKIjl5F')" }}></div>
//             <div className="absolute inset-0 flex items-center justify-center z-20">
//               <div className="text-center">
//                 <h3 className="text-tertiary text-3xl -rotate-6 bg-white/95 px-8 py-3 shadow-2xl rounded-2xl font-display-sm">Organic</h3>
//                 <p className="text-tertiary/80 font-label-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">Nature-meets-design</p>
//               </div>
//             </div>
//           </Link>

//           {/* Sci-Fi */}
//           <Link href="/spaces?vibe=scifi" className="group relative overflow-hidden rounded-3xl min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-primary-fixed/30 mix-blend-color z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLkL_S-dw1DwN3C_25Bg1DkuiE4eStzko3W4oDgh-uQKrWWmbQNb8qx0xEEcqWJ2UrtMJl3GF2rbvtvt2G6yyZf0PyFp7G6J-gkcEkNv8m_KbQUky3KfZmt1R18XEJJlqQe5VKA1HgbLcaAmUHy0nM7zSTyaMh6MSTiVto7EjDhv1SPZ4x0RuvmLu7w532bPBwYZ9IyoSjxBUn8v77ZUSe_yE-mHRWCYYoqLKUQc2mEqxLKKTXlIUP3oYmxWXzVhnkz0EXuhLHLU9U')" }}></div>
//             <div className="absolute bottom-8 right-8 z-20 text-right">
//               <h3 className="text-primary-fixed neon-accent text-4xl font-headline-lg">Sci-Fi</h3>
//               <p className="text-white font-label-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Futuristic & cyberpunk</p>
//               <span className="text-white text-4xl mt-2 block">↗</span>
//             </div>
//           </Link>
//         </div>
//       </section>

//       {/* Featured Studios - YOUR ORIGINAL STUDIO SECTION */}
//       <section className="bg-surface-container py-24 px-6 md:px-16 overflow-hidden">
//         <div className="max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 mb-12">
//             <div className="h-px bg-outline-variant flex-1"></div>
//             <h2 className="font-label-bold text-primary tracking-widest uppercase">Curated Collections</h2>
//             <div className="h-px bg-outline-variant flex-1"></div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-slate-500">Loading featured spaces...</p>
//               </div>
//             </div>
//           ) : featuredSpaces.length === 0 ? (
//             <div className="text-center py-20">
//               <h4 className="text-xl font-serif mb-2">No studios available yet</h4>
//               <p className="text-slate-500 max-w-md mx-auto">We're currently curating new creative spaces. Please check back soon.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//               {featuredSpaces.map((space, index) => {
//                 const coverImage = getFirstImage(space.images);
//                 return (
//                   <Link 
//                     key={space.id} 
//                     href={`/spaces/${space.id}`}
//                     className={`group card-hover bg-surface-container-lowest rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 ${index === 1 ? 'mt-12 md:-mt-8' : ''}`}
//                   >
//                     <div className="h-[400px] relative overflow-hidden">
//                       {coverImage ? (
//                         <img 
//                           src={coverImage}
//                           alt={space.name}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
//                         </div>
//                       )}
//                       <div className="absolute top-6 left-6 bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-2xl font-label-bold shadow-lg">
//                         ${space.hourly_rate}<span className="text-sm font-normal">/hr</span>
//                       </div>
//                       <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg cursor-pointer hover:scale-110 transition-transform">favorite</span>
//                       </div>
//                     </div>
//                     <div className="p-8">
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <h3 className="font-headline-lg mb-1">{space.name}</h3>
//                           <p className="text-on-surface-variant font-body-md flex items-center gap-1">
//                             <span className="material-symbols-outlined text-sm">location_on</span> 
//                             {space.city || 'Location TBD'}{space.state ? `, ${space.state}` : ''}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                           <span className="font-label-bold text-on-surface">4.9</span>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 flex-wrap">
//                         <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">DAYLIGHT</span>
//                         <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">CREATIVE</span>
//                         {space.description && (
//                           <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">
//                             {space.description.length > 20 ? space.description.substring(0, 20) + '...' : space.description}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Creative Talent Section */}
//       <section className="py-24 px-6 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
//         <div className="max-w-[1440px] mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             <div className="order-2 lg:order-1">
//               <div className="flex items-center gap-4 mb-6">
//                 <span className="h-1 w-12 bg-primary"></span>
//                 <span className="font-label-bold text-primary tracking-widest uppercase">Direct Talent Access</span>
//               </div>
//               <h2 className="text-[48px] font-display-sm mb-8 leading-tight">Elevate Your Production with <span className="text-secondary italic">Pro Talent.</span></h2>
//               <p className="text-[18px] text-on-surface-variant mb-12 max-w-xl">
//                 Don't just book a room. Book a crew. Browse our verified roster of world-class photographers, award-winning videographers, and visionary stylists available to hire directly for your ManyRooms session.
//               </p>
//               <div className="flex flex-wrap gap-4">
//                 <Link 
//                   href="/talent"
//                   className="bg-on-surface text-surface-bright px-10 py-4 rounded-2xl font-label-bold hover:bg-primary transition-all flex items-center gap-2 group"
//                 >
//                   BOOK TALENT <span className="group-hover:translate-x-1 transition-transform">→</span>
//                 </Link>
//                 <Link 
//                   href="/talent/roster"
//                   className="border-2 border-outline-variant px-10 py-4 rounded-2xl font-label-bold hover:bg-surface-container transition-all"
//                 >
//                   VIEW ROSTER
//                 </Link>
//               </div>
//             </div>
//             <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
//               <div className="space-y-4">
//                 <div className="rounded-3xl overflow-hidden h-64 grayscale hover:grayscale-0 transition-all duration-700">
//                   <img alt="Cinematographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl"/>
//                 </div>
//                 <div className="bg-secondary-container p-6 rounded-3xl">
//                   <h4 className="font-headline-lg text-on-secondary-container text-xl">Styling</h4>
//                   <p className="text-on-secondary-container/70 font-body-md mt-2">Avant-garde vision for every frame.</p>
//                 </div>
//               </div>
//               <div className="space-y-4 pt-12">
//                 <div className="bg-primary-container p-6 rounded-3xl">
//                   <h4 className="font-headline-lg text-on-primary-container text-xl">Capture</h4>
//                   <p className="text-on-primary-container/70 font-body-md mt-2">Industry-leading technical precision.</p>
//                 </div>
//                 <div className="rounded-3xl overflow-hidden h-64 grayscale hover:grayscale-0 transition-all duration-700">
//                   <img alt="Photographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD"/>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Creator Stories */}
//       <section className="py-24 px-6 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
//         <div className="max-w-[1440px] mx-auto relative">
//           <div className="absolute -right-20 top-0 opacity-10 rotate-12 pointer-events-none">
//             <span className="text-[200px] text-primary font-display-lg">VOICES</span>
//           </div>
//           <h2 className="text-[48px] font-display-sm mb-20 relative z-10">Creator Stories</h2>
//           <div className="flex flex-col md:flex-row items-center gap-16 relative">
//             <div className="relative w-full md:w-1/2">
//               <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
//                 <img 
//                   className="w-full h-full object-cover" 
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl" 
//                   alt="Amara Chen"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
//                 <div className="absolute bottom-12 left-12 right-12 text-white">
//                   <h4 className="text-3xl font-display-sm mb-1">Amara Chen</h4>
//                   <p className="font-label-bold text-primary-fixed uppercase tracking-widest">Global Cinematographer</p>
//                 </div>
//               </div>
//               <div className="absolute -bottom-10 -right-4 md:-right-10 glass p-8 rounded-3xl max-w-xs shadow-2xl border-t-4 border-primary">
//                 <p className="font-body-lg italic text-on-surface-variant mb-4">
//                   "ManyRooms doesn't just provide a space; it provides the canvas that pushes my vision further."
//                 </p>
//                 <span className="text-primary text-4xl">❝</span>
//               </div>
//             </div>

//             <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
//               <div className="bg-secondary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 floating-interaction">
//                 <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD" alt="Marcus Vane" />
//                 </div>
//                 <h4 className="font-headline-lg text-on-secondary-container">Marcus Vane</h4>
//                 <p className="font-body-md text-on-secondary-container opacity-80">Editorial Photography Legend</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-secondary-container group">
//                   READ STORY <span className="group-hover:translate-x-2 transition-transform">→</span>
//                 </button>
//               </div>

//               <div className="bg-primary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 mt-0 sm:mt-12 floating-interaction">
//                 <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8yR0fx9aF-smQaY2NFdyOzW0frJaoqEFJf23bKJn6HmD6AMnL4b8s6uK6LJXX0pE5R0eozRdwNA6UMijGqPrTugvgOyVqvuhN8M3ueGqEfXgV8Lsq2ZUm48_11dtRBWZXgflk8aTDHzf5gFWgpOzKL5mNgp3Z2qhQn-s75gRTCXCt93F2EBXd8jLzQBMODpb85NkV6ZjJY4pTpzUuaVo15E3XfCUkZs080wIYIyqtR2sqU9BflPf2DXsyReE3NfjTiTEt74-tqC2T" alt="Sofia Rossi" />
//                 </div>
//                 <h4 className="font-headline-lg text-on-primary-container">Sofia Rossi</h4>
//                 <p className="font-body-md text-on-primary-container opacity-80">Creative Director, Aura Studio</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-primary-container group">
//                   WATCH TOUR <span className="group-hover:translate-x-2 transition-transform">▶</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 px-6 md:px-16">
//         <div className="max-w-[1440px] mx-auto bg-gradient-to-br from-primary to-secondary rounded-[60px] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
//           <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, transparent 70%)' }}></div>
//           <div className="relative z-10">
//             <h2 className="text-white mb-8 text-[48px] md:text-[84px] font-display-lg leading-tight">Ready to launch your next masterpiece?</h2>
//             <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">Join the world's most innovative creative collective. From brutalist lofts to neon-soaked labs, your perfect stage is waiting.</p>
//             <div className="flex flex-col md:flex-row gap-6 justify-center">
//               <Link 
//                 href="/signup"
//                 className="bg-primary-fixed text-on-primary-fixed px-12 py-5 rounded-2xl font-label-bold text-lg hover:scale-105 transition-transform shadow-xl"
//               >
//                 Join the Collective
//               </Link>
//               <button className="glass text-white px-12 py-5 rounded-2xl font-label-bold text-lg hover:bg-white/10 transition-colors">
//                 Speak to an Agent
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />

//       {/* Chatbot */}
//       <Chatbot />

//       <style jsx>{`
//         .glass { 
//           background: rgba(255, 255, 255, 0.75); 
//           backdrop-filter: blur(20px); 
//           border: 1px solid rgba(255, 255, 255, 0.3); 
//         }
//         .neon-accent { 
//           text-shadow: 0 0 15px rgba(181, 246, 87, 0.6); 
//         }
//         .floating-interaction { 
//           transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
//         }
//         .floating-interaction:hover { 
//           transform: translateY(-8px) scale(1.02); 
//           z-index: 30; 
//         }
//         .card-hover { 
//           transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
//         }
//         .card-hover:hover { 
//           transform: translateY(-12px); 
//           box-shadow: 0 30px 60px rgba(0,0,0,0.15); 
//         }
//         .pulse-glow {
//           animation: pulse-glow 3s ease-in-out infinite;
//         }
        
//         @keyframes hero-zoom {
//           0% { transform: scale(1); }
//           100% { transform: scale(1.12); }
//         }
//         @keyframes pulse-glow {
//           0%, 100% { box-shadow: 0 0 20px rgba(181, 246, 87, 0.3); }
//           50% { box-shadow: 0 0 40px rgba(181, 246, 87, 0.6); }
//         }
//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .duration-1500 {
//           transition-duration: 1500ms;
//         }
//       `}</style>
//     </div>
//   );
// }





// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, Bars3Icon, XMarkIcon, GlobeAltIcon, PlayIcon, StarIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import './home.css';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   hourly_rate: number;
//   images: string[];
//   status: string;
//   description: string;
// }

// export default function HomePage() {
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   // Fetch approved studios from Supabase
//   useEffect(() => {
//     fetchApprovedStudios();
//     setTimeout(() => setIsVisible(true), 100);
//   }, []);

//   // Prevent body scroll when mobile menu is open
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isMobileMenuOpen]);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .limit(3);

//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFirstImage = (images: string[]) => {
//     if (!images || images.length === 0) return null;
//     return images[0];
//   };

//   const formatPrice = (price: number) => {
//     return `$${price}`;
//   };

//   return (
//     <div className="home-page bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
//         <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-8">
//             <Link href="/" className="text-[48px] font-display-sm tracking-tighter text-primary leading-none">
//               ManyRooms
//             </Link>
//             <div className="hidden md:flex gap-6">
//               <Link href="/" className="text-primary font-bold border-b-2 border-primary py-1">Marketplace</Link>
//               <Link href="/spaces" className="text-on-surface-variant hover:text-primary transition-colors py-1">Studios</Link>
//               <Link href="/cities" className="text-on-surface-variant hover:text-primary transition-colors py-1">Vibes</Link>
//               <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors py-1">Journal</Link>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/signup?role=owner" 
//               className="hidden md:flex bg-primary-container text-on-primary-container font-label-bold px-6 py-2 rounded-full hover:scale-105 transition-transform"
//             >
//               List Studio
//             </Link>
//             <span className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform hidden md:block">favorite</span>
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform"
//             >
//               account_circle
//             </button>
//             {/* Mobile Menu Button */}
//             <button 
//               onClick={() => setIsMobileMenuOpen(true)}
//               className="md:hidden p-2 hover:bg-primary/5 rounded-full transition-all"
//             >
//               <Bars3Icon className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div 
//         className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
//           isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div 
//           className="absolute inset-0 bg-black/50"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//         <div 
//           className={`absolute top-0 right-0 h-full w-[300px] bg-surface shadow-2xl transition-transform duration-300 ${
//             isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           }`}
//         >
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-primary">ManyRooms</span>
//               <button 
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-2 hover:bg-primary/5 rounded-full transition-all"
//               >
//                 <XMarkIcon className="w-6 h-6" />
//               </button>
//             </div>

//             <nav className="flex flex-col gap-6">
//               <Link 
//                 href="/" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Marketplace
//               </Link>
//               <Link 
//                 href="/spaces" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Studios
//               </Link>
//               <Link 
//                 href="/cities" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Vibes
//               </Link>
//               <Link 
//                 href="/about" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Journal
//               </Link>
              
//               <div className="border-t border-outline-variant/30 pt-6 mt-2">
//                 <Link 
//                   href="/signup?role=owner" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   List Studio
//                 </Link>
//                 <Link 
//                   href="/login" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Log in
//                 </Link>
//                 <Link 
//                   href="/signup" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Sign up
//                 </Link>
//                 <Link 
//                   href="/support" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Contact Support
//                 </Link>
//                 <button className="flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-60 transition-opacity">
//                   <GlobeAltIcon className="w-4 h-4" />
//                   Language
//                 </button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Login/Signup Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
//           <div 
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setIsModalOpen(false)}
//           />
//           <div className="relative bg-surface rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
//             <button 
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-4 p-2 hover:bg-primary/5 rounded-full transition-all"
//             >
//               <XMarkIcon className="w-5 h-5" />
//             </button>
            
//             <div className="text-center mb-8">
//               <h3 className="text-2xl font-bold text-on-surface mb-2">Welcome to ManyRooms</h3>
//               <p className="text-sm text-on-surface-variant">Find and book the perfect creative space</p>
//             </div>

//             <div className="space-y-4">
//               <Link 
//                 href="/login" 
//                 className="block w-full text-center bg-primary text-on-primary py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Log in
//               </Link>
//               <Link 
//                 href="/signup" 
//                 className="block w-full text-center border border-outline/30 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/5 transition-all"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Sign up
//               </Link>
//               <div className="border-t border-outline-variant/30 pt-4 mt-2">
//                 <Link 
//                   href="/signup?role=owner" 
//                   className="block w-full text-center text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   List your space
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Hero Section */}
//       <section className="relative min-h-[921px] flex items-center justify-center px-6 md:px-16 bg-surface overflow-hidden pt-24">
//         <div className="relative z-10 text-center max-w-4xl mx-auto">
//           <div className="mb-6 inline-block bg-secondary-container px-4 py-1 rounded-full text-on-secondary-container font-label-bold animate-pulse">
//             NEW: AI SPACE DISCOVERY
//           </div>
//           <h1 className="text-[64px] md:text-[84px] font-display-lg text-on-surface leading-none mb-8 tracking-tighter">
//             Your Creative <span className="text-primary italic">Stage</span>, Redefined.
//           </h1>
          
//           {/* AI Visual Search Bar */}
//           <div className="glass max-w-2xl mx-auto rounded-3xl p-2 flex items-center shadow-2xl mt-12 border-2 border-white/40">
//             <div className="flex-1 px-6 flex items-center gap-3">
//               <span className="material-symbols-outlined text-outline">search</span>
//               <input 
//                 className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-4 font-body-md outline-none" 
//                 placeholder="Describe the mood or upload an image..." 
//                 type="text"
//               />
//             </div>
//             <label className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-high cursor-pointer hover:bg-secondary-container transition-colors group">
//               <input className="hidden" type="file"/>
//               <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary">add_a_photo</span>
//             </label>
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-2xl font-label-bold ml-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
//             >
//               FIND SPACE
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Search by Vibe Section */}
//       <section className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
//           <h2 className="text-[48px] font-display-sm tracking-tighter">Search by Vibe</h2>
//           <p className="text-[18px] text-on-surface-variant max-w-md">Our curated categories move beyond utility, focusing on the architectural soul of the space.</p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[800px] md:h-[600px]">
//           {/* Brutalist */}
//           <div className="group relative overflow-hidden rounded-3xl md:col-span-2 floating-interaction">
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2')" }}></div>
//             <div className="absolute bottom-0 left-0 p-10 z-20">
//               <span className="bg-primary-container text-on-primary-container px-4 py-1 rounded-full font-label-bold mb-4 inline-block">TRENDING</span>
//               <h3 className="text-white text-3xl font-display-sm mb-2">Brutalist</h3>
//               <p className="text-white/80 font-body-md">Raw concrete and dramatic scale.</p>
//             </div>
//           </div>

//           {/* Organic */}
//           <div className="group relative overflow-hidden rounded-3xl floating-interaction">
//             <div className="absolute inset-0 bg-tertiary-container/30 mix-blend-overlay z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtaHsD_Ee0OXgccRwyuBHMMGBF5R9Wv7zL6xdfFmVFYNTibEc531TN2DKYpRcRHkWa6LNR-2FEaFzFCKoH7alTA6ZN4q7jb2vYuVe8qo4dKOIRupQxXdeWuFfgP-ZD-bYdZ4y83gObwQRQga8Gb2f8GOaemUrFtQcqt_0rcQZ_GS3KH-aiNPL50ZBFTzVERvqcftQZLBU1XEGVqm59af7kBpaAV0rreAUxgHeTcLcawMQ__wUXvyFc0Ko9pGwkWWs9A1g6uMKIjl5F')" }}></div>
//             <div className="absolute inset-0 flex items-center justify-center z-20">
//               <h3 className="text-tertiary text-2xl -rotate-12 bg-white/90 px-6 py-2 shadow-xl font-display-sm">Organic</h3>
//             </div>
//           </div>

//           {/* Sci-Fi */}
//           <div className="group relative overflow-hidden rounded-3xl floating-interaction">
//             <div className="absolute inset-0 bg-primary-fixed/20 mix-blend-color z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLkL_S-dw1DwN3C_25Bg1DkuiE4eStzko3W4oDgh-uQKrWWmbQNb8qx0xEEcqWJ2UrtMJl3GF2rbvtvt2G6yyZf0PyFp7G6J-gkcEkNv8m_KbQUky3KfZmt1R18XEJJlqQe5VKA1HgbLcaAmUHy0nM7zSTyaMh6MSTiVto7EjDhv1SPZ4x0RuvmLu7w532bPBwYZ9IyoSjxBUn8v77ZUSe_yE-mHRWCYYoqLKUQc2mEqxLKKTXlIUP3oYmxWXzVhnkz0EXuhLHLU9U')" }}></div>
//             <div className="absolute bottom-8 right-8 z-20 text-right">
//               <h3 className="text-primary-fixed neon-accent text-2xl font-headline-lg">Sci-Fi</h3>
//               <span className="material-symbols-outlined text-white text-4xl">arrow_outward</span>
//             </div>
//           </div>

//           {/* Minimalist */}
//           <div className="group relative overflow-hidden rounded-3xl floating-interaction md:col-span-1">
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBS5Mwje3_GYAeel8EU2Me7SdXpZbHslQXtuwNN2iRmHePhXZgwx4krYuuqM8RTtWwwBsqPUbyev8qhGgnfkA7ELXc0JYKdxy-WHfGK0chiBq_Ldii3EdenhsnLBLlg3vGZPruKG09s_V4W7uxyaV-pgErJCojebcoiKsLuqh5NqjIGg0eRuPU4QAxfx4bI0Lat44VgH-w8fzl5PJ6Lh8sZro7P8QzC4KSbom8AQ1jaHIhCDgucrkX0fQh_vKl1IetEKNJyI2Zr0AZN')" }}></div>
//             <div className="absolute top-10 left-10 z-20">
//               <h3 className="text-on-surface text-2xl font-display-sm">Minimalist</h3>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Studios */}
//       <section className="bg-surface-container py-24 px-6 md:px-16 overflow-hidden">
//         <div className="max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 mb-12">
//             <div className="h-px bg-outline-variant flex-1"></div>
//             <h2 className="font-label-bold text-primary tracking-widest uppercase">Curated Collections</h2>
//             <div className="h-px bg-outline-variant flex-1"></div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-slate-500">Loading featured spaces...</p>
//               </div>
//             </div>
//           ) : featuredSpaces.length === 0 ? (
//             <div className="text-center py-20">
//               <h4 className="text-xl font-serif mb-2">No studios available yet</h4>
//               <p className="text-slate-500 max-w-md mx-auto">We're currently curating new creative spaces. Please check back soon.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//               {featuredSpaces.map((space, index) => {
//                 const coverImage = getFirstImage(space.images);
//                 return (
//                   <Link 
//                     key={space.id} 
//                     href={`/spaces/${space.id}`}
//                     className={`group relative bg-surface-container-lowest rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-4 ${index === 1 ? 'mt-12 md:-mt-8' : ''}`}
//                   >
//                     <div className="h-[400px] relative overflow-hidden">
//                       {coverImage ? (
//                         <img 
//                           src={coverImage}
//                           alt={space.name}
//                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
//                         </div>
//                       )}
//                       <div className="absolute top-6 left-6 bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-2xl font-label-bold shadow-lg">
//                         ${space.hourly_rate}/hr
//                       </div>
//                     </div>
//                     <div className="p-8">
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <h3 className="font-headline-lg mb-1">{space.name}</h3>
//                           <p className="text-on-surface-variant font-body-md flex items-center gap-1">
//                             <span className="material-symbols-outlined text-sm">location_on</span> 
//                             {space.city || 'Location TBD'}, {space.state || ''}
//                           </p>
//                         </div>
//                         <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                       </div>
//                       <div className="flex gap-2">
//                         <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">DAYLIGHT</span>
//                         <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-label-bold">CREATIVE</span>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Creator Stories */}
//       <section className="py-24 px-6 md:px-16 bg-surface overflow-hidden">
//         <div className="max-w-[1440px] mx-auto relative">
//           <div className="absolute -right-20 top-0 opacity-10 rotate-12">
//             <span className="text-[200px] text-primary font-display-lg">VOICES</span>
//           </div>
//           <h2 className="text-[48px] font-display-sm mb-20 relative z-10">Creator Stories</h2>
//           <div className="flex flex-col md:flex-row items-center gap-16 relative">
//             <div className="relative w-full md:w-1/2">
//               <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
//                 <img 
//                   className="w-full h-full object-cover" 
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl" 
//                   alt="Amara Chen"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
//                 <div className="absolute bottom-12 left-12 right-12 text-white">
//                   <h4 className="text-3xl font-display-sm mb-1">Amara Chen</h4>
//                   <p className="font-label-bold text-primary-fixed uppercase tracking-widest">Global Cinematographer</p>
//                 </div>
//               </div>
//               <div className="absolute -bottom-10 -right-4 md:-right-10 glass p-8 rounded-3xl max-w-xs shadow-2xl border-t-4 border-primary">
//                 <p className="font-body-lg italic text-on-surface-variant mb-4">
//                   "ManyRooms doesn't just provide a space; it provides the canvas that pushes my vision further than I imagined."
//                 </p>
//                 <span className="material-symbols-outlined text-primary text-4xl">format_quote</span>
//               </div>
//             </div>

//             <div className="w-full md:w-1/2 grid grid-cols-2 gap-8">
//               <div className="bg-secondary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 floating-interaction">
//                 <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD" alt="Marcus Vane" />
//                 </div>
//                 <h4 className="font-headline-lg text-on-secondary-container">Marcus Vane</h4>
//                 <p className="font-body-md text-on-secondary-container opacity-80">Editorial Photography Legend</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-secondary-container group">
//                   READ STORY <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
//                 </button>
//               </div>

//               <div className="bg-primary-container p-12 rounded-[50px] flex flex-col justify-center gap-6 mt-12 floating-interaction">
//                 <div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8yR0fx9aF-smQaY2NFdyOzW0frJaoqEFJf23bKJn6HmD6AMnL4b8s6uK6LJXX0pE5R0eozRdwNA6UMijGqPrTugvgOyVqvuhN8M3ueGqEfXgV8Lsq2ZUm48_11dtRBWZXgflk8aTDHzf5gFWgpOzKL5mNgp3Z2qhQn-s75gRTCXCt93F2EBXd8jLzQBMODpb85NkV6ZjJY4pTpzUuaVo15E3XfCUkZs080wIYIyqtR2sqU9BflPf2DXsyReE3NfjTiTEt74-tqC2T" alt="Sofia Rossi" />
//                 </div>
//                 <h4 className="font-headline-lg text-on-primary-container">Sofia Rossi</h4>
//                 <p className="font-body-md text-on-primary-container opacity-80">Creative Director, Aura Studio</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-primary-container group">
//                   WATCH TOUR <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">play_circle</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 px-6 md:px-16">
//         <div className="max-w-[1440px] mx-auto bg-gradient-to-br from-primary to-secondary rounded-[60px] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
//           <div className="relative z-10">
//             <h2 className="text-white mb-8 text-[48px] md:text-[84px] font-display-lg leading-tight">Ready to launch your next masterpiece?</h2>
//             <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">Join the world's most innovative creative collective. From brutalist lofts to neon-soaked labs, your perfect stage is waiting.</p>
//             <div className="flex flex-col md:flex-row gap-6 justify-center">
//               <Link 
//                 href="/signup"
//                 className="bg-primary-fixed text-on-primary-fixed px-12 py-5 rounded-2xl font-label-bold text-lg hover:scale-105 transition-transform shadow-xl"
//               >
//                 Join the Collective
//               </Link>
//               <button className="glass text-white px-12 py-5 rounded-2xl font-label-bold text-lg hover:bg-white/10 transition-colors">
//                 Speak to an Agent
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />

//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// }






// // new adjustmnet

// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, Bars3Icon, XMarkIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import './home.css';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   hourly_rate: number;
//   images: string[];
//   status: string;
//   description: string;
// }

// export default function HomePage() {
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);

//   const cities = [
//     { name: "London", country: "United Kingdom", spaces: 42, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQzGsNM6tt8bra9e6JJuvlzW5F-dY10kFOEoEPU82FFtKfbK0kBoI6ZwAK3W6tA2KPRvxhORyfk6ePqy6fh1fjy1WSY_MY54q1Xa-Hi8rIF4p5Zr4BAo7dKPyKmq_FrTJGouZdP_jw_99cNPj5oLhpBXYXcNDlpiJVVhaexjhLDMWZnnRoWymsjmR8dAM-EFq9RXwEH-X0ImvpmWcifVN6zInI9MCboIYThAIPbXP6IrdDiaPsUBylZo9ADtszhphSu6aNq-hha2j5" },
//     { name: "Dubai", country: "United Arab Emirates", spaces: 18, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmJAT1sfbhr48irtVxV4uxCCnvMiVwtxv_fZy5TbZIOdspOMUhjfDYC5JbVMv0eGAmtIVvAVQZLL3Fp0G7Ba2rL_8bJuXLh0Jphe6kz0SGgE1bUY6C-DqZS-ESmTH3oXyMZ98tQYw4fidLR6V4Zy5R5ZFm_1FjKx4CDlkrMbLlJ1l3A0068fVa5fxvgnWSbukBakc6Sy-DicUkgzUg01htnR7Zx7GmNyeiELEdhb0uNy0KbT8qyQouloyS_x5Ela1abgUCXmtQ2esS" },
//     { name: "Paris", country: "France", spaces: 28, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Dxm5KX8FSFBgwkgzKpBu-05kwpVuPBMJzcfshXnXkn5NVxdLODVdBHuu3EMOqQvhDyobH4A_F8L157J1jQh9HoL9nuzE8Pu87j-Av0y-jX6ANXxy2zOnbvcOwkwlZW-54GszbvG-GxPFWORoEid1ezlxs1s8zOi0XzjZoS-xb0BqP1oZSQrftxNT2KkvSiJmKGHvHPRIEcySzSGnmtZ_NR6ovjqU63AVxYrDSip4PITJcVZ4mlSBy6QJTGTpYrVFsDecwIvEcvhf" },
//   ];

//   // Fetch approved studios from Supabase
//   useEffect(() => {
//     fetchApprovedStudios();
//     // Trigger animation on mount
//     setTimeout(() => setIsVisible(true), 100);
//   }, []);

//   // Prevent body scroll when mobile menu is open
//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isMobileMenuOpen]);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .limit(6);

//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFirstImage = (images: string[]) => {
//     if (!images || images.length === 0) return null;
//     return images[0];
//   };

//   const formatPrice = (price: number) => {
//     return `£${price}`;
//   };

//   const formatLocation = (city: string, state: string) => {
//     if (city && state) return `${city} • ${state}`;
//     if (city) return city;
//     return 'Location TBD';
//   };

//   return (
//     <div className="home-page bg-brand-light text-brand-dark">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
//         <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
//           <Link href="/" className="text-xl font-medium tracking-widest uppercase">ManyRooms</Link>
          
//           {/* Desktop Navigation */}
//           <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
//             <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
//             <Link href="/spaces" className="hover:opacity-60 transition-opacity">Spaces</Link>
//             <Link href="/cities" className="hover:opacity-60 transition-opacity">Cities</Link>
//             <Link href="/how-it-works" className="hover:opacity-60 transition-opacity">How it works</Link>
//             <Link href="/about" className="hover:opacity-60 transition-opacity">About</Link>
//           </div>

//           <div className="flex items-center gap-4">
//             <Link href="/signup?role=owner" className="hidden md:block text-xs uppercase tracking-widest hover:opacity-60 transition-opacity">List your space</Link>
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="hidden md:block bg-brand-dark text-white px-6 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-black transition-all"
//             >
//               FIND A SPACE
//             </button>
            
//             {/* Mobile Menu Button */}
//             <button 
//               onClick={() => setIsMobileMenuOpen(true)}
//               className="md:hidden p-2 hover:bg-brand-dark/5 rounded-full transition-all"
//             >
//               <Bars3Icon className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu - Slide from right */}
//       <div 
//         className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
//           isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         {/* Backdrop */}
//         <div 
//           className="absolute inset-0 bg-black/50"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
        
//         {/* Menu Panel */}
//         <div 
//           className={`absolute top-0 right-0 h-full w-[300px] bg-brand-light shadow-2xl transition-transform duration-300 ${
//             isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           }`}
//         >
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-xl font-medium tracking-widest uppercase">ManyRooms</span>
//               <button 
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-2 hover:bg-brand-dark/5 rounded-full transition-all"
//               >
//                 <XMarkIcon className="w-6 h-6" />
//               </button>
//             </div>

//             <nav className="flex flex-col gap-6">
//               <Link 
//                 href="/" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Home
//               </Link>
//               <Link 
//                 href="/spaces" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Spaces
//               </Link>
//               <Link 
//                 href="/cities" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 Cities
//               </Link>
//               <Link 
//                 href="/how-it-works" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 How it works
//               </Link>
//               <Link 
//                 href="/about" 
//                 className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 About
//               </Link>
              
//               <div className="border-t border-brand-dark/10 pt-6 mt-2">
//                 <Link 
//                   href="/signup?role=owner" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   List your space
//                 </Link>
//                 <Link 
//                   href="/login" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Log in
//                 </Link>
//                 <Link 
//                   href="/signup" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Sign up
//                 </Link>
//                 <Link 
//                   href="/support" 
//                   className="block text-sm uppercase tracking-widest hover:opacity-60 transition-opacity mb-4"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   Contact Support
//                 </Link>
//                 <button 
//                   className="flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
//                 >
//                   <GlobeAltIcon className="w-4 h-4" />
//                   Language
//                 </button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Modal - Desktop */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
//           <div 
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setIsModalOpen(false)}
//           />
//           <div className="relative bg-brand-light rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
//             <button 
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-4 p-2 hover:bg-brand-dark/5 rounded-full transition-all"
//             >
//               <XMarkIcon className="w-5 h-5" />
//             </button>
            
//             <div className="text-center mb-8">
//               <h3 className="text-2xl font-serif mb-2">Welcome to ManyRooms</h3>
//               <p className="text-sm text-brand-dark/60">Find and book the perfect creative space</p>
//             </div>

//             <div className="space-y-4">
//               <Link 
//                 href="/login" 
//                 className="block w-full text-center bg-brand-dark text-white py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Log in
//               </Link>
//               <Link 
//                 href="/signup" 
//                 className="block w-full text-center border border-brand-dark/20 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-brand-dark/5 transition-all"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Sign up
//               </Link>
//               <div className="border-t border-brand-dark/10 pt-4 mt-2">
//                 <Link 
//                   href="/signup?role=owner" 
//                   className="block w-full text-center text-xs uppercase tracking-widest text-brand-dark/60 hover:text-brand-dark transition-colors"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   List your space
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Hero Section with Animation */}
//       <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-brand-dark pt-20">
//         <div className="absolute inset-0 z-0">
//           <Image
//             alt="Creative Space"
//             className="w-full h-full object-cover opacity-60 scale-105"
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjL4_jjm2DcmHEaTKr1ky0ZMJTk4_nyQUen_87485kCgDWc-4MO5Yg4JP7yarEnVVFEUHjgp1rd-mlL_-RG5QDV82v7o-I1Z0MtsCqFN7n-Q2JKjap5pgLjdR5dIU5xTKTYwaBRuytY5ss4i7pJHqZ-2526pmlkwykJG28wyAyzzEYAnVOAAD6tEpVtm8KqJZ-NxqjwAzz5P44wxTPpWhJCwUGWDJHO_ImknqeLHF_euz2odHHv9xPJuQdWLoWLYKWcbdcdnHMaivR"
//             width={1920}
//             height={1080}
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/30 to-brand-dark"></div>
//         </div>

//         <div className="relative z-10 container mx-auto px-6 text-center">
//           <p className={`uppercase text-xs tracking-widest mb-6 opacity-70 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             The Global Marketplace for Creative Spaces
//           </p>
//           <h1 className={`text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight max-w-5xl mx-auto tracking-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             Find and book the perfect creative space, anywhere in the world.
//           </h1>
//           <p className={`text-lg md:text-xl font-light opacity-80 max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             For creators, brands and production teams who need beautiful spaces - fast. Studios, podcast rooms and editorial locations across London, Dubai, Paris and beyond.
//           </p>

//           {/* Search Component */}
//           <div className={`max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 pl-6 flex items-center gap-4">
//               <MagnifyingGlassIcon className="w-5 h-5 text-white/60" />
//               <input
//                 className="bg-transparent border-none focus:ring-0 text-white placeholder-white/50 w-full text-sm outline-none"
//                 placeholder="Warm natural studio in London for a fashion shoot tomorrow"
//                 type="text"
//               />
//               <button 
//                 onClick={() => setIsModalOpen(true)}
//                 className="bg-white text-brand-dark px-8 py-3 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all uppercase tracking-wider"
//               >
//                 Discover
//               </button>
//             </div>
//             <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs opacity-60 uppercase tracking-widest">
//               <span>Try:</span>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Daylight studio in Shoreditch</a>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Podcast room in Mayfair</a>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Penthouse with skyline view</a>
//             </div>
//           </div>

//           <div className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="bg-white text-brand-dark px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest flex items-center justify-center group hover:bg-opacity-90 transition-all"
//             >
//               Find a space
//               <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//             </button>
//             <button className="border border-white/30 bg-white/5 backdrop-blur-sm px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-white/10 transition-all">
//               Explore Cities
//             </button>
//           </div>
//         </div>

//         <div className="absolute bottom-8 left-8 text-[10px] tracking-widest opacity-40 uppercase">
//           Est. 2019 • London
//         </div>
//       </section>

//       {/* Rest of your sections remain the same */}
//       {/* Intro Section */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl max-w-4xl mx-auto leading-tight">
//             A new home for the world's most beautiful creative spaces. Designed for the people who shape <span className="italic font-bold">culture.</span>
//           </h2>
//           <div className="mt-16 text-xs tracking-widest opacity-40 uppercase">01 / Studio</div>
//         </div>
//       </section>

//       {/* Featured Spaces */}
//       <section className="bg-brand-light pb-32 px-6">
//         <div className="container mx-auto">
//           <div className="flex justify-between items-end mb-12">
//             <div>
//               <p className="text-xs uppercase tracking-widest opacity-40 mb-2">• Featured Spaces</p>
//               <h3 className="text-4xl md:text-5xl">Hand-picked, this season.</h3>
//             </div>
//             <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-brand-dark/20 pb-1 hover:opacity-60 transition-opacity">View All ↗</Link>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-slate-500">Loading featured spaces...</p>
//               </div>
//             </div>
//           ) : featuredSpaces.length === 0 ? (
//             <div className="text-center py-20">
//               <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
//                 <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//               </div>
//               <h4 className="text-xl font-serif mb-2">No studios available yet</h4>
//               <p className="text-slate-500 max-w-md mx-auto">
//                 We're currently curating new creative spaces. Please check back soon for beautiful studios from around the world.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
//               {featuredSpaces.map((space) => {
//                 const coverImage = getFirstImage(space.images);
//                 return (
//                   <Link key={space.id} href={`/spaces/${space.id}`} className="space-y-4 group cursor-pointer">
//                     <div className="aspect-[4/5] overflow-hidden bg-gray-200 rounded-2xl">
//                       {coverImage ? (
//                         <img
//                           alt={space.name}
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
//                         <p className="text-[10px] uppercase tracking-widest opacity-50">{formatLocation(space.city, space.state)}</p>
//                         <h4 className="text-2xl mt-1">{space.name}</h4>
//                         <p className="text-sm font-light opacity-60 mt-2 line-clamp-2">{space.description || 'A beautiful creative space ready for your next project.'}</p>
//                         <div className="flex gap-2 mt-4">
//                           <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">Natural Light</span>
//                           <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">Creative</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[10px] uppercase tracking-widest opacity-50">From</p>
//                         <p className="text-xl">{formatPrice(space.hourly_rate)}</p>
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

//       {/* Rest of your sections (Cities, Process, AI Discovery, Testimonials, Host CTA) remain exactly the same */}
//       <section className="bg-[#ECEAE6] py-32 px-6">
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
//             <div>
//               <p className="text-xs uppercase tracking-widest opacity-40 mb-2">02 / Cities</p>
//               <h2 className="text-5xl md:text-7xl leading-none">Six cities.<br />A growing world.</h2>
//             </div>
//             <p className="max-w-xs text-sm font-light opacity-60 leading-relaxed">
//               From the warm light of London townhouses to the sculpted skylines of Dubai – Many Rooms is curating the most beautiful creative spaces, city by city.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {cities.map((city) => (
//               <div key={city.name} className="relative group aspect-[4/3] overflow-hidden cursor-pointer rounded-2xl">
//                 <Image
//                   alt={city.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                   src={city.image}
//                   width={600}
//                   height={450}
//                 />
//                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
//                 <div className="absolute bottom-8 left-8 text-white">
//                   <p className="text-[10px] uppercase tracking-widest opacity-70">{city.country}</p>
//                   <h4 className="text-3xl">{city.name}</h4>
//                   <p className="text-[10px] uppercase tracking-widest mt-1">{city.spaces} curated spaces</p>
//                 </div>
//                 <div className="absolute bottom-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-24">
//             <p className="text-xs uppercase tracking-widest opacity-40 mb-4">03 / Process</p>
//             <h2 className="text-5xl md:text-6xl">A simpler way to find the room.</h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
//             {[
//               { step: "01", title: "Describe your vision", desc: "Search by city, style or tell us what you're shooting. Our AI surfaces spaces that match the brief.", icon: "search" },
//               { step: "02", title: "Discover the right room", desc: "Editorial cards, full galleries, vibe tags and transparent capacity - so you know exactly what you're booking.", icon: "calendar" },
//               { step: "03", title: "Enquire and create", desc: "Message hosts in seconds, confirm dates, and arrive on shoot day with everything in place.", icon: "chat" }
//             ].map((item) => (
//               <div key={item.step} className="space-y-6">
//                 <div className="flex justify-between items-baseline border-b border-brand-dark/10 pb-4">
//                   <span className="w-6 h-6 opacity-40">
//                     {item.icon === "search" && <MagnifyingGlassIcon className="w-5 h-5" />}
//                     {item.icon === "calendar" && <ChevronLeftIcon className="w-5 h-5" />}
//                     {item.icon === "chat" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>}
//                   </span>
//                   <span className="font-serif text-5xl italic opacity-20">{item.step}</span>
//                 </div>
//                 <h4 className="text-xl font-medium">{item.title}</h4>
//                 <p className="text-sm opacity-60 leading-relaxed font-light">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="bg-[#1a1a1a] text-white py-32 px-6 overflow-hidden">
//         <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
//           <div className="space-y-8">
//             <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
//               <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
//               AI-Powered Discovery
//             </div>
//             <h2 className="text-5xl md:text-6xl leading-tight">Tell us the vibe.<br />We'll find the room.</h2>
//             <p className="text-lg font-light opacity-60 max-w-md">
//               Describe your shoot in your own words - light, mood, surfaces, city, timing - and let Many Rooms surface the spaces that fit. Smarter discovery for creators on the move.
//             </p>
//             <div className="space-y-4">
//               {[
//                 "A warm wood-panelled podcast room in central London for Thursday.",
//                 "Daylight studio with high ceilings in Paris, suitable for fashion film."
//               ].map((text, i) => (
//                 <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors">
//                   <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//                   <p className="text-sm font-light italic">{text}</p>
//                 </div>
//               ))}
//             </div>
//             <button className="bg-white text-brand-dark px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest flex items-center gap-2 group">
//               Try AI-Discovery
//               <svg className="w-4 h-4 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//             </button>
//           </div>
//           <div className="relative">
//             <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
//               <Image
//                 alt="AI Match Result"
//                 className="w-full h-full object-cover"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5MIZnoTzW-CyTF8G-EW9VeUjZffOY10npkSON7JaZ0EBgE-_jtmwMUMDaUNqK4VZetLgC2b-1VlXzIRMzlYh69VMyKLqZuL16Kamy1KN_KCcbciQlJxErNvSmahXpT2s8lidXQx4h9EuREKh20lSV2mFuw0k3ZNFjtvlns4Pu6b8n8gkHyOQP61jLmbqasRBMSCdpiQJ_xEg1Bg0_XgXzSA7_2g0Mj7w0tjk1QzYMwmr9ss6zBzmElV6iGEA-43GU1xUae7wkdCQB"
//                 width={600}
//                 height={750}
//               />
//             </div>
//             <div className="absolute -bottom-6 -left-6 bg-white text-brand-dark p-6 shadow-xl max-w-xs rounded-lg">
//               <div className="flex justify-between items-start mb-4">
//                 <span className="text-[9px] uppercase tracking-widest font-bold text-green-600">Match • 96%</span>
//               </div>
//               <h5 className="text-lg font-serif">The Arch House</h5>
//               <p className="text-[10px] uppercase tracking-widest opacity-40">London • Shoreditch</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-24">
//             <h2 className="text-5xl md:text-6xl max-w-3xl mx-auto">Loved by creators and the brands they shape.</h2>
//             <div className="mt-8 text-xs tracking-widest opacity-40 uppercase">04 / Trust</div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-brand-dark/10 pt-16">
//             {[
//               { text: "Many Rooms has quietly become our first call for any shoot in London. The spaces are always the right kind of beautiful.", by: "Editorial Director • Independent Fashion Title" },
//               { text: "We needed a podcast room in 48 hours. They surfaced three perfect options - booked, shot, edited within the week.", by: "Head of Brand • Consumer Tech Company" },
//               { text: "The curation is what sets it apart. Every space feels like it belongs in a magazine.", by: "Photographer • London / New York" }
//             ].map((testimonial, i) => (
//               <div key={i} className="space-y-6">
//                 <p className="text-xl font-light leading-relaxed">"{testimonial.text}"</p>
//                 <div>
//                   <p className="text-[10px] uppercase tracking-widest font-bold">{testimonial.by}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-32 text-center border-t border-brand-dark/10 pt-16">
//             {[
//               { stat: "154", label: "Curated Spaces" },
//               { stat: "6", label: "Cities" },
//               { stat: "1.2k+", label: "Creators" },
//               { stat: "4.9", label: "Avg. Rating" }
//             ].map((item) => (
//               <div key={item.label}>
//                 <p className="text-5xl font-serif italic mb-2">{item.stat}</p>
//                 <p className="text-[10px] uppercase tracking-widest opacity-50">{item.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="bg-brand-light pb-32 px-6">
//         <div className="container mx-auto bg-white p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//           <div className="aspect-[16/9] lg:aspect-square overflow-hidden rounded-xl">
//             <Image
//               alt="Studio Host"
//               className="w-full h-full object-cover"
//               src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsMV2AON7Y2XYvsfBp4TE0_7CAjGklIVLBwFyU_gGpYEUGUn3nMtxYNBbJSsNKcIhZQU3q2f71G54sTtM0egSR9cbEkH1uCTt8c1rzW--hUtrLoxtbENZ5pzOxh_A445FkVoPqRqaVvJ3JHkuPpai458SE0H1zMQ_WZFdwL5hCZAAiC5t65iRg0kexGomRWgER0NjkA4LZT2wKbkwXV4woooyuqa34HNzVkZgifS_Kmy-iyOlUGHGqL4XvBvToiDDZIUg7RSNoV5K"
//               width={600}
//               height={600}
//             />
//           </div>
//           <div className="space-y-8">
//             <p className="text-xs uppercase tracking-widest opacity-40">• For Hosts</p>
//             <h2 className="text-5xl md:text-6xl leading-tight">Own a creative space? Get seen. Get booked.</h2>
//             <p className="text-lg font-light opacity-60">
//               List your studio, location or apartment alongside the world's most beautiful creative spaces. We handle the curation, the audience and the bookings.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Link href="/signup?role=owner" className="bg-brand-dark text-white px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all">
//                 List your space
//               </Link>
//               <button className="border border-brand-dark/10 px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-gray-50 transition-all">
//                 Learn more
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />

//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// }





// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import './home.css';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   hourly_rate: number;
//   images: string[];
//   status: string;
//   description: string;
// }

// export default function HomePage() {
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);

//   const cities = [
//     { name: "London", country: "United Kingdom", spaces: 42, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQzGsNM6tt8bra9e6JJuvlzW5F-dY10kFOEoEPU82FFtKfbK0kBoI6ZwAK3W6tA2KPRvxhORyfk6ePqy6fh1fjy1WSY_MY54q1Xa-Hi8rIF4p5Zr4BAo7dKPyKmq_FrTJGouZdP_jw_99cNPj5oLhpBXYXcNDlpiJVVhaexjhLDMWZnnRoWymsjmR8dAM-EFq9RXwEH-X0ImvpmWcifVN6zInI9MCboIYThAIPbXP6IrdDiaPsUBylZo9ADtszhphSu6aNq-hha2j5" },
//     { name: "Dubai", country: "United Arab Emirates", spaces: 18, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmJAT1sfbhr48irtVxV4uxCCnvMiVwtxv_fZy5TbZIOdspOMUhjfDYC5JbVMv0eGAmtIVvAVQZLL3Fp0G7Ba2rL_8bJuXLh0Jphe6kz0SGgE1bUY6C-DqZS-ESmTH3oXyMZ98tQYw4fidLR6V4Zy5R5ZFm_1FjKx4CDlkrMbLlJ1l3A0068fVa5fxvgnWSbukBakc6Sy-DicUkgzUg01htnR7Zx7GmNyeiELEdhb0uNy0KbT8qyQouloyS_x5Ela1abgUCXmtQ2esS" },
//     { name: "Paris", country: "France", spaces: 28, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Dxm5KX8FSFBgwkgzKpBu-05kwpVuPBMJzcfshXnXkn5NVxdLODVdBHuu3EMOqQvhDyobH4A_F8L157J1jQh9HoL9nuzE8Pu87j-Av0y-jX6ANXxy2zOnbvcOwkwlZW-54GszbvG-GxPFWORoEid1ezlxs1s8zOi0XzjZoS-xb0BqP1oZSQrftxNT2KkvSiJmKGHvHPRIEcySzSGnmtZ_NR6ovjqU63AVxYrDSip4PITJcVZ4mlSBy6QJTGTpYrVFsDecwIvEcvhf" },
//   ];

//   // Fetch approved studios from Supabase
//   useEffect(() => {
//     fetchApprovedStudios();
//   }, []);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .limit(6);

//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) {
//       console.error('Error fetching studios:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFirstImage = (images: string[]) => {
//     if (!images || images.length === 0) return null;
//     return images[0];
//   };

//   const formatPrice = (price: number) => {
//     return `£${price}`;
//   };

//   const formatLocation = (city: string, state: string) => {
//     if (city && state) return `${city} • ${state}`;
//     if (city) return city;
//     return 'Location TBD';
//   };

//   return (
//     <div className="home-page bg-brand-light text-brand-dark">
//       {/* Navigation - Same as spaces detail page */}
//       <nav className="fixed top-0 w-full z-50 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
//         <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
//           <Link href="/" className="text-xl font-medium tracking-widest uppercase">ManyRooms</Link>
//           <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
//             <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
//             <Link href="/spaces" className="hover:opacity-60 transition-opacity">Spaces</Link>
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
//       <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-brand-dark pt-20">
//         <div className="absolute inset-0 z-0">
//           <Image
//             alt="Creative Space"
//             className="w-full h-full object-cover opacity-60"
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjL4_jjm2DcmHEaTKr1ky0ZMJTk4_nyQUen_87485kCgDWc-4MO5Yg4JP7yarEnVVFEUHjgp1rd-mlL_-RG5QDV82v7o-I1Z0MtsCqFN7n-Q2JKjap5pgLjdR5dIU5xTKTYwaBRuytY5ss4i7pJHqZ-2526pmlkwykJG28wyAyzzEYAnVOAAD6tEpVtm8KqJZ-NxqjwAzz5P44wxTPpWhJCwUGWDJHO_ImknqeLHF_euz2odHHv9xPJuQdWLoWLYKWcbdcdnHMaivR"
//             width={1920}
//             height={1080}
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/20 to-brand-dark"></div>
//         </div>

//         <div className="relative z-10 container mx-auto px-6 text-center">
//           <p className="uppercase text-xs tracking-widest mb-6 opacity-70">The Global Marketplace for Creative Spaces</p>
//           <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight max-w-5xl mx-auto tracking-tight">
//             Find and book the perfect creative space, anywhere in the world.
//           </h1>
//           <p className="text-lg md:text-xl font-light opacity-80 max-w-2xl mx-auto mb-12">
//             For creators, brands and production teams who need beautiful spaces - fast. Studios, podcast rooms and editorial locations across London, Dubai, Paris and beyond.
//           </p>

//           {/* Search Component */}
//           <div className="max-w-3xl mx-auto mb-12">
//             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 pl-6 flex items-center gap-4">
//               <MagnifyingGlassIcon className="w-5 h-5 text-white/60" />
//               <input
//                 className="bg-transparent border-none focus:ring-0 text-white placeholder-white/50 w-full text-sm outline-none"
//                 placeholder="Warm natural studio in London for a fashion shoot tomorrow"
//                 type="text"
//               />
//               <button className="bg-white text-brand-dark px-8 py-3 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all uppercase tracking-wider">
//                 Discover
//               </button>
//             </div>
//             <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs opacity-60 uppercase tracking-widest">
//               <span>Try:</span>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Daylight studio in Shoreditch</a>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Podcast room in Mayfair</a>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Penthouse with skyline view</a>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button className="bg-white text-brand-dark px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest flex items-center justify-center group">
//               Find a space
//               <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//             </button>
//             <button className="border border-white/30 bg-white/5 backdrop-blur-sm px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-white/10 transition-all">
//               Explore Cities
//             </button>
//           </div>
//         </div>

//         <div className="absolute bottom-8 left-8 text-[10px] tracking-widest opacity-40 uppercase">
//           Est. 2019 • London
//         </div>
//       </section>

//       {/* Intro Section */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl max-w-4xl mx-auto leading-tight">
//             A new home for the world's most beautiful creative spaces. Designed for the people who shape <span className="italic font-bold">culture.</span>
//           </h2>
//           <div className="mt-16 text-xs tracking-widest opacity-40 uppercase">01 / Studio</div>
//         </div>
//       </section>

//       {/* Featured Spaces */}
//       <section className="bg-brand-light pb-32 px-6">
//         <div className="container mx-auto">
//           <div className="flex justify-between items-end mb-12">
//             <div>
//               <p className="text-xs uppercase tracking-widest opacity-40 mb-2">• Featured Spaces</p>
//               <h3 className="text-4xl md:text-5xl">Hand-picked, this season.</h3>
//             </div>
//             <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-brand-dark/20 pb-1 hover:opacity-60 transition-opacity">View All ↗</Link>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-slate-500">Loading featured spaces...</p>
//               </div>
//             </div>
//           ) : featuredSpaces.length === 0 ? (
//             <div className="text-center py-20">
//               <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
//                 <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//               </div>
//               <h4 className="text-xl font-serif mb-2">No studios available yet</h4>
//               <p className="text-slate-500 max-w-md mx-auto">
//                 We're currently curating new creative spaces. Please check back soon for beautiful studios from around the world.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
//               {featuredSpaces.map((space) => {
//                 const coverImage = getFirstImage(space.images);
//                 return (
//                   <Link key={space.id} href={`/spaces/${space.id}`} className="space-y-4 group cursor-pointer">
//                     <div className="aspect-[4/5] overflow-hidden bg-gray-200 rounded-2xl">
//                       {coverImage ? (
//                         <img
//                           alt={space.name}
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
//                         <p className="text-[10px] uppercase tracking-widest opacity-50">{formatLocation(space.city, space.state)}</p>
//                         <h4 className="text-2xl mt-1">{space.name}</h4>
//                         <p className="text-sm font-light opacity-60 mt-2 line-clamp-2">{space.description || 'A beautiful creative space ready for your next project.'}</p>
//                         <div className="flex gap-2 mt-4">
//                           <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">Natural Light</span>
//                           <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">Creative</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[10px] uppercase tracking-widest opacity-50">From</p>
//                         <p className="text-xl">{formatPrice(space.hourly_rate)}</p>
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

//       {/* Cities Section */}
//       <section className="bg-[#ECEAE6] py-32 px-6">
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
//             <div>
//               <p className="text-xs uppercase tracking-widest opacity-40 mb-2">02 / Cities</p>
//               <h2 className="text-5xl md:text-7xl leading-none">Six cities.<br />A growing world.</h2>
//             </div>
//             <p className="max-w-xs text-sm font-light opacity-60 leading-relaxed">
//               From the warm light of London townhouses to the sculpted skylines of Dubai – Many Rooms is curating the most beautiful creative spaces, city by city.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {cities.map((city) => (
//               <div key={city.name} className="relative group aspect-[4/3] overflow-hidden cursor-pointer rounded-2xl">
//                 <Image
//                   alt={city.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                   src={city.image}
//                   width={600}
//                   height={450}
//                 />
//                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
//                 <div className="absolute bottom-8 left-8 text-white">
//                   <p className="text-[10px] uppercase tracking-widest opacity-70">{city.country}</p>
//                   <h4 className="text-3xl">{city.name}</h4>
//                   <p className="text-[10px] uppercase tracking-widest mt-1">{city.spaces} curated spaces</p>
//                 </div>
//                 <div className="absolute bottom-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Process Section */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-24">
//             <p className="text-xs uppercase tracking-widest opacity-40 mb-4">03 / Process</p>
//             <h2 className="text-5xl md:text-6xl">A simpler way to find the room.</h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
//             {[
//               { step: "01", title: "Describe your vision", desc: "Search by city, style or tell us what you're shooting. Our AI surfaces spaces that match the brief.", icon: "search" },
//               { step: "02", title: "Discover the right room", desc: "Editorial cards, full galleries, vibe tags and transparent capacity - so you know exactly what you're booking.", icon: "calendar" },
//               { step: "03", title: "Enquire and create", desc: "Message hosts in seconds, confirm dates, and arrive on shoot day with everything in place.", icon: "chat" }
//             ].map((item) => (
//               <div key={item.step} className="space-y-6">
//                 <div className="flex justify-between items-baseline border-b border-brand-dark/10 pb-4">
//                   <span className="w-6 h-6 opacity-40">
//                     {item.icon === "search" && <MagnifyingGlassIcon className="w-5 h-5" />}
//                     {item.icon === "calendar" && <ChevronLeftIcon className="w-5 h-5" />}
//                     {item.icon === "chat" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>}
//                   </span>
//                   <span className="font-serif text-5xl italic opacity-20">{item.step}</span>
//                 </div>
//                 <h4 className="text-xl font-medium">{item.title}</h4>
//                 <p className="text-sm opacity-60 leading-relaxed font-light">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Discovery */}
//       <section className="bg-[#1a1a1a] text-white py-32 px-6 overflow-hidden">
//         <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
//           <div className="space-y-8">
//             <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
//               <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
//               AI-Powered Discovery
//             </div>
//             <h2 className="text-5xl md:text-6xl leading-tight">Tell us the vibe.<br />We'll find the room.</h2>
//             <p className="text-lg font-light opacity-60 max-w-md">
//               Describe your shoot in your own words - light, mood, surfaces, city, timing - and let Many Rooms surface the spaces that fit. Smarter discovery for creators on the move.
//             </p>
//             <div className="space-y-4">
//               {[
//                 "A warm wood-panelled podcast room in central London for Thursday.",
//                 "Daylight studio with high ceilings in Paris, suitable for fashion film."
//               ].map((text, i) => (
//                 <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors">
//                   <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//                   <p className="text-sm font-light italic">{text}</p>
//                 </div>
//               ))}
//             </div>
//             <button className="bg-white text-brand-dark px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest flex items-center gap-2 group">
//               Try AI-Discovery
//               <svg className="w-4 h-4 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//             </button>
//           </div>
//           <div className="relative">
//             <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
//               <Image
//                 alt="AI Match Result"
//                 className="w-full h-full object-cover"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5MIZnoTzW-CyTF8G-EW9VeUjZffOY10npkSON7JaZ0EBgE-_jtmwMUMDaUNqK4VZetLgC2b-1VlXzIRMzlYh69VMyKLqZuL16Kamy1KN_KCcbciQlJxErNvSmahXpT2s8lidXQx4h9EuREKh20lSV2mFuw0k3ZNFjtvlns4Pu6b8n8gkHyOQP61jLmbqasRBMSCdpiQJ_xEg1Bg0_XgXzSA7_2g0Mj7w0tjk1QzYMwmr9ss6zBzmElV6iGEA-43GU1xUae7wkdCQB"
//                 width={600}
//                 height={750}
//               />
//             </div>
//             <div className="absolute -bottom-6 -left-6 bg-white text-brand-dark p-6 shadow-xl max-w-xs rounded-lg">
//               <div className="flex justify-between items-start mb-4">
//                 <span className="text-[9px] uppercase tracking-widest font-bold text-green-600">Match • 96%</span>
//               </div>
//               <h5 className="text-lg font-serif">The Arch House</h5>
//               <p className="text-[10px] uppercase tracking-widest opacity-40">London • Shoreditch</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-24">
//             <h2 className="text-5xl md:text-6xl max-w-3xl mx-auto">Loved by creators and the brands they shape.</h2>
//             <div className="mt-8 text-xs tracking-widest opacity-40 uppercase">04 / Trust</div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-brand-dark/10 pt-16">
//             {[
//               { text: "Many Rooms has quietly become our first call for any shoot in London. The spaces are always the right kind of beautiful.", by: "Editorial Director • Independent Fashion Title" },
//               { text: "We needed a podcast room in 48 hours. They surfaced three perfect options - booked, shot, edited within the week.", by: "Head of Brand • Consumer Tech Company" },
//               { text: "The curation is what sets it apart. Every space feels like it belongs in a magazine.", by: "Photographer • London / New York" }
//             ].map((testimonial, i) => (
//               <div key={i} className="space-y-6">
//                 <p className="text-xl font-light leading-relaxed">"{testimonial.text}"</p>
//                 <div>
//                   <p className="text-[10px] uppercase tracking-widest font-bold">{testimonial.by}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-32 text-center border-t border-brand-dark/10 pt-16">
//             {[
//               { stat: "154", label: "Curated Spaces" },
//               { stat: "6", label: "Cities" },
//               { stat: "1.2k+", label: "Creators" },
//               { stat: "4.9", label: "Avg. Rating" }
//             ].map((item) => (
//               <div key={item.label}>
//                 <p className="text-5xl font-serif italic mb-2">{item.stat}</p>
//                 <p className="text-[10px] uppercase tracking-widest opacity-50">{item.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Host CTA */}
//       <section className="bg-brand-light pb-32 px-6">
//         <div className="container mx-auto bg-white p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//           <div className="aspect-[16/9] lg:aspect-square overflow-hidden rounded-xl">
//             <Image
//               alt="Studio Host"
//               className="w-full h-full object-cover"
//               src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsMV2AON7Y2XYvsfBp4TE0_7CAjGklIVLBwFyU_gGpYEUGUn3nMtxYNBbJSsNKcIhZQU3q2f71G54sTtM0egSR9cbEkH1uCTt8c1rzW--hUtrLoxtbENZ5pzOxh_A445FkVoPqRqaVvJ3JHkuPpai458SE0H1zMQ_WZFdwL5hCZAAiC5t65iRg0kexGomRWgER0NjkA4LZT2wKbkwXV4woooyuqa34HNzVkZgifS_Kmy-iyOlUGHGqL4XvBvToiDDZIUg7RSNoV5K"
//               width={600}
//               height={600}
//             />
//           </div>
//           <div className="space-y-8">
//             <p className="text-xs uppercase tracking-widest opacity-40">• For Hosts</p>
//             <h2 className="text-5xl md:text-6xl leading-tight">Own a creative space? Get seen. Get booked.</h2>
//             <p className="text-lg font-light opacity-60">
//               List your studio, location or apartment alongside the world's most beautiful creative spaces. We handle the curation, the audience and the bookings.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Link href="/signup?role=owner" className="bg-brand-dark text-white px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all">
//                 List your space
//               </Link>
//               <button className="border border-brand-dark/10 px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-gray-50 transition-all">
//                 Learn more
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />

//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// }



// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// import './home.css';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// export default function HomePage() {
//   const [currentMonth] = useState('April 2026');

//   const featuredSpaces = [
//     {
//       name: "The Arch House",
//       location: "London • Shoreditch",
//       description: "Vaulted natural-light studio with arched windows and warm oak floors.",
//       price: "£280",
//       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq",
//       href: "/spaces/arch-house"
//     },
//     {
//       name: "The Listening Room",
//       location: "London • Mayfair",
//       description: "Walnut-panelled podcast suite with broadcast-grade acoustics.",
//       price: "£180",
//       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3uo9sJREVsvu55f7nYUN4U39aW_z8KVHJogKwCcF74e4qO3um1Vm8L0GNdnC-7qad2ww2ddmQ_NyD4jxu53Urbe728k136lK_MylNvq6GgTep-4C-bErsAl8krw_FjL78x1a4dEfs6e1h6HOMXjZ2sj0AGRr_708J4LzQujsrKe-gtw3ZQrXb1uffQnvMMOsr7bx8QQHvHe9a-G6QRNQ9ffp1z28Z6IGZ-EDJoN6Ej9ecKRdg96wxQWY_5eLsQmE1ID3wQFC90aBW",
//       href: "/spaces/listening-room"
//     },
//     {
//       name: "Skyline Suite",
//       location: "Dubai • Downtown",
//       description: "Minimal penthouse content space with marble floors and 270° views.",
//       price: "£540",
//       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd2EelDPKVJ7xPXWWjsxwfWBr7ckj1_BbhrkhbAcoZsZ-G_AmImWhGW7Q_0nA4NaXl8xLOntklDIQ3BX1QUwjgaItBwbl2FQ416yEBPCSdZtmpDrmaB03yMXu2E0bGrl9bovp8DAaPrL5NawayEECeqWxrdT5_pd8nGO_JrlKl7pMUkoUiyvyawmiPzkjBSKpxMZ9xBDVVCufHtyvQkHo01_sq9H2N746US0KF1WOWxeZrNSIweyt_NCapBxLOOe98-vfR3GpY7baK",
//       href: "/spaces/skyline-suite"
//     },
//   ];

//   const cities = [
//     { name: "London", country: "United Kingdom", spaces: 42, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQzGsNM6tt8bra9e6JJuvlzW5F-dY10kFOEoEPU82FFtKfbK0kBoI6ZwAK3W6tA2KPRvxhORyfk6ePqy6fh1fjy1WSY_MY54q1Xa-Hi8rIF4p5Zr4BAo7dKPyKmq_FrTJGouZdP_jw_99cNPj5oLhpBXYXcNDlpiJVVhaexjhLDMWZnnRoWymsjmR8dAM-EFq9RXwEH-X0ImvpmWcifVN6zInI9MCboIYThAIPbXP6IrdDiaPsUBylZo9ADtszhphSu6aNq-hha2j5" },
//     { name: "Dubai", country: "United Arab Emirates", spaces: 18, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmJAT1sfbhr48irtVxV4uxCCnvMiVwtxv_fZy5TbZIOdspOMUhjfDYC5JbVMv0eGAmtIVvAVQZLL3Fp0G7Ba2rL_8bJuXLh0Jphe6kz0SGgE1bUY6C-DqZS-ESmTH3oXyMZ98tQYw4fidLR6V4Zy5R5ZFm_1FjKx4CDlkrMbLlJ1l3A0068fVa5fxvgnWSbukBakc6Sy-DicUkgzUg01htnR7Zx7GmNyeiELEdhb0uNy0KbT8qyQouloyS_x5Ela1abgUCXmtQ2esS" },
//     { name: "Paris", country: "France", spaces: 28, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Dxm5KX8FSFBgwkgzKpBu-05kwpVuPBMJzcfshXnXkn5NVxdLODVdBHuu3EMOqQvhDyobH4A_F8L157J1jQh9HoL9nuzE8Pu87j-Av0y-jX6ANXxy2zOnbvcOwkwlZW-54GszbvG-GxPFWORoEid1ezlxs1s8zOi0XzjZoS-xb0BqP1oZSQrftxNT2KkvSiJmKGHvHPRIEcySzSGnmtZ_NR6ovjqU63AVxYrDSip4PITJcVZ4mlSBy6QJTGTpYrVFsDecwIvEcvhf" },
//   ];

//   return (
//     <div className="home-page bg-brand-light text-brand-dark">
//       {/* Navigation - Same as spaces detail page */}
//       <nav className="fixed top-0 w-full z-50 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
//         <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
//           <Link href="/" className="text-xl font-medium tracking-widest uppercase">ManyRooms</Link>
//           <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
//             <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
//             <Link href="/spaces" className="hover:opacity-60 transition-opacity">Spaces</Link>
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
//       <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-brand-dark pt-20">
//         <div className="absolute inset-0 z-0">
//           <Image
//             alt="Creative Space"
//             className="w-full h-full object-cover opacity-60"
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjL4_jjm2DcmHEaTKr1ky0ZMJTk4_nyQUen_87485kCgDWc-4MO5Yg4JP7yarEnVVFEUHjgp1rd-mlL_-RG5QDV82v7o-I1Z0MtsCqFN7n-Q2JKjap5pgLjdR5dIU5xTKTYwaBRuytY5ss4i7pJHqZ-2526pmlkwykJG28wyAyzzEYAnVOAAD6tEpVtm8KqJZ-NxqjwAzz5P44wxTPpWhJCwUGWDJHO_ImknqeLHF_euz2odHHv9xPJuQdWLoWLYKWcbdcdnHMaivR"
//             width={1920}
//             height={1080}
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/20 to-brand-dark"></div>
//         </div>

//         <div className="relative z-10 container mx-auto px-6 text-center">
//           <p className="uppercase text-xs tracking-widest mb-6 opacity-70">The Global Marketplace for Creative Spaces</p>
//           <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight max-w-5xl mx-auto tracking-tight">
//             Find and book the perfect creative space, anywhere in the world.
//           </h1>
//           <p className="text-lg md:text-xl font-light opacity-80 max-w-2xl mx-auto mb-12">
//             For creators, brands and production teams who need beautiful spaces - fast. Studios, podcast rooms and editorial locations across London, Dubai, Paris and beyond.
//           </p>

//           {/* Search Component */}
//           <div className="max-w-3xl mx-auto mb-12">
//             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 pl-6 flex items-center gap-4">
//               <MagnifyingGlassIcon className="w-5 h-5 text-white/60" />
//               <input
//                 className="bg-transparent border-none focus:ring-0 text-white placeholder-white/50 w-full text-sm outline-none"
//                 placeholder="Warm natural studio in London for a fashion shoot tomorrow"
//                 type="text"
//               />
//               <button className="bg-white text-brand-dark px-8 py-3 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all uppercase tracking-wider">
//                 Discover
//               </button>
//             </div>
//             <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs opacity-60 uppercase tracking-widest">
//               <span>Try:</span>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Daylight studio in Shoreditch</a>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Podcast room in Mayfair</a>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Penthouse with skyline view</a>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button className="bg-white text-brand-dark px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest flex items-center justify-center group">
//               Find a space
//               <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//             </button>
//             <button className="border border-white/30 bg-white/5 backdrop-blur-sm px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-white/10 transition-all">
//               Explore Cities
//             </button>
//           </div>
//         </div>

//         <div className="absolute bottom-8 left-8 text-[10px] tracking-widest opacity-40 uppercase">
//           Est. 2019 • London
//         </div>
//       </section>

//       {/* Intro Section */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl max-w-4xl mx-auto leading-tight">
//             A new home for the world's most beautiful creative spaces. Designed for the people who shape <span className="italic font-bold">culture.</span>
//           </h2>
//           <div className="mt-16 text-xs tracking-widest opacity-40 uppercase">01 / Studio</div>
//         </div>
//       </section>

//       {/* Featured Spaces */}
//       <section className="bg-brand-light pb-32 px-6">
//         <div className="container mx-auto">
//           <div className="flex justify-between items-end mb-12">
//             <div>
//               <p className="text-xs uppercase tracking-widest opacity-40 mb-2">• Featured Spaces</p>
//               <h3 className="text-4xl md:text-5xl">Hand-picked, this season.</h3>
//             </div>
//             <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-brand-dark/20 pb-1 hover:opacity-60 transition-opacity">View All ↗</Link>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
//             {featuredSpaces.map((space, idx) => (
//               <Link key={idx} href={space.href} className="space-y-4 group cursor-pointer">
//                 <div className="aspect-[4/5] overflow-hidden bg-gray-200">
//                   <Image
//                     alt={space.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                     src={space.image}
//                     width={600}
//                     height={750}
//                   />
//                 </div>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-[10px] uppercase tracking-widest opacity-50">{space.location}</p>
//                     <h4 className="text-2xl mt-1">{space.name}</h4>
//                     <p className="text-sm font-light opacity-60 mt-2 line-clamp-2">{space.description}</p>
//                     <div className="flex gap-2 mt-4">
//                       <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">Natural Light</span>
//                       <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">Editorial</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[10px] uppercase tracking-widest opacity-50">From</p>
//                     <p className="text-xl">{space.price}</p>
//                     <p className="text-[10px] opacity-40">/ Hour</p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Cities Section */}
//       <section className="bg-[#ECEAE6] py-32 px-6">
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
//             <div>
//               <p className="text-xs uppercase tracking-widest opacity-40 mb-2">02 / Cities</p>
//               <h2 className="text-5xl md:text-7xl leading-none">Six cities.<br />A growing world.</h2>
//             </div>
//             <p className="max-w-xs text-sm font-light opacity-60 leading-relaxed">
//               From the warm light of London townhouses to the sculpted skylines of Dubai – Many Rooms is curating the most beautiful creative spaces, city by city.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {cities.map((city) => (
//               <div key={city.name} className="relative group aspect-[4/3] overflow-hidden cursor-pointer">
//                 <Image
//                   alt={city.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                   src={city.image}
//                   width={600}
//                   height={450}
//                 />
//                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
//                 <div className="absolute bottom-8 left-8 text-white">
//                   <p className="text-[10px] uppercase tracking-widest opacity-70">{city.country}</p>
//                   <h4 className="text-3xl">{city.name}</h4>
//                   <p className="text-[10px] uppercase tracking-widest mt-1">{city.spaces} curated spaces</p>
//                 </div>
//                 <div className="absolute bottom-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Process Section */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-24">
//             <p className="text-xs uppercase tracking-widest opacity-40 mb-4">03 / Process</p>
//             <h2 className="text-5xl md:text-6xl">A simpler way to find the room.</h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
//             {[
//               { step: "01", title: "Describe your vision", desc: "Search by city, style or tell us what you're shooting. Our AI surfaces spaces that match the brief.", icon: "search" },
//               { step: "02", title: "Discover the right room", desc: "Editorial cards, full galleries, vibe tags and transparent capacity - so you know exactly what you're booking.", icon: "calendar" },
//               { step: "03", title: "Enquire and create", desc: "Message hosts in seconds, confirm dates, and arrive on shoot day with everything in place.", icon: "chat" }
//             ].map((item) => (
//               <div key={item.step} className="space-y-6">
//                 <div className="flex justify-between items-baseline border-b border-brand-dark/10 pb-4">
//                   <span className="w-6 h-6 opacity-40">
//                     {item.icon === "search" && <MagnifyingGlassIcon className="w-5 h-5" />}
//                     {item.icon === "calendar" && <ChevronLeftIcon className="w-5 h-5" />}
//                     {item.icon === "chat" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>}
//                   </span>
//                   <span className="font-serif text-5xl italic opacity-20">{item.step}</span>
//                 </div>
//                 <h4 className="text-xl font-medium">{item.title}</h4>
//                 <p className="text-sm opacity-60 leading-relaxed font-light">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Discovery */}
//       <section className="bg-[#1a1a1a] text-white py-32 px-6 overflow-hidden">
//         <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
//           <div className="space-y-8">
//             <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
//               <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
//               AI-Powered Discovery
//             </div>
//             <h2 className="text-5xl md:text-6xl leading-tight">Tell us the vibe.<br />We'll find the room.</h2>
//             <p className="text-lg font-light opacity-60 max-w-md">
//               Describe your shoot in your own words - light, mood, surfaces, city, timing - and let Many Rooms surface the spaces that fit. Smarter discovery for creators on the move.
//             </p>
//             <div className="space-y-4">
//               {[
//                 "A warm wood-panelled podcast room in central London for Thursday.",
//                 "Daylight studio with high ceilings in Paris, suitable for fashion film."
//               ].map((text, i) => (
//                 <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors">
//                   <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//                   <p className="text-sm font-light italic">{text}</p>
//                 </div>
//               ))}
//             </div>
//             <button className="bg-white text-brand-dark px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest flex items-center gap-2 group">
//               Try AI-Discovery
//               <svg className="w-4 h-4 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//             </button>
//           </div>
//           <div className="relative">
//             <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
//               <Image
//                 alt="AI Match Result"
//                 className="w-full h-full object-cover"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5MIZnoTzW-CyTF8G-EW9VeUjZffOY10npkSON7JaZ0EBgE-_jtmwMUMDaUNqK4VZetLgC2b-1VlXzIRMzlYh69VMyKLqZuL16Kamy1KN_KCcbciQlJxErNvSmahXpT2s8lidXQx4h9EuREKh20lSV2mFuw0k3ZNFjtvlns4Pu6b8n8gkHyOQP61jLmbqasRBMSCdpiQJ_xEg1Bg0_XgXzSA7_2g0Mj7w0tjk1QzYMwmr9ss6zBzmElV6iGEA-43GU1xUae7wkdCQB"
//                 width={600}
//                 height={750}
//               />
//             </div>
//             <div className="absolute -bottom-6 -left-6 bg-white text-brand-dark p-6 shadow-xl max-w-xs rounded-lg">
//               <div className="flex justify-between items-start mb-4">
//                 <span className="text-[9px] uppercase tracking-widest font-bold text-green-600">Match • 96%</span>
//               </div>
//               <h5 className="text-lg font-serif">The Arch House</h5>
//               <p className="text-[10px] uppercase tracking-widest opacity-40">London • Shoreditch</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-24">
//             <h2 className="text-5xl md:text-6xl max-w-3xl mx-auto">Loved by creators and the brands they shape.</h2>
//             <div className="mt-8 text-xs tracking-widest opacity-40 uppercase">04 / Trust</div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-brand-dark/10 pt-16">
//             {[
//               { text: "Many Rooms has quietly become our first call for any shoot in London. The spaces are always the right kind of beautiful.", by: "Editorial Director • Independent Fashion Title" },
//               { text: "We needed a podcast room in 48 hours. They surfaced three perfect options - booked, shot, edited within the week.", by: "Head of Brand • Consumer Tech Company" },
//               { text: "The curation is what sets it apart. Every space feels like it belongs in a magazine.", by: "Photographer • London / New York" }
//             ].map((testimonial, i) => (
//               <div key={i} className="space-y-6">
//                 <p className="text-xl font-light leading-relaxed">"{testimonial.text}"</p>
//                 <div>
//                   <p className="text-[10px] uppercase tracking-widest font-bold">{testimonial.by}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-32 text-center border-t border-brand-dark/10 pt-16">
//             {[
//               { stat: "154", label: "Curated Spaces" },
//               { stat: "6", label: "Cities" },
//               { stat: "1.2k+", label: "Creators" },
//               { stat: "4.9", label: "Avg. Rating" }
//             ].map((item) => (
//               <div key={item.label}>
//                 <p className="text-5xl font-serif italic mb-2">{item.stat}</p>
//                 <p className="text-[10px] uppercase tracking-widest opacity-50">{item.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Host CTA */}
//       <section className="bg-brand-light pb-32 px-6">
//         <div className="container mx-auto bg-white p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//           <div className="aspect-[16/9] lg:aspect-square overflow-hidden rounded-xl">
//             <Image
//               alt="Studio Host"
//               className="w-full h-full object-cover"
//               src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsMV2AON7Y2XYvsfBp4TE0_7CAjGklIVLBwFyU_gGpYEUGUn3nMtxYNBbJSsNKcIhZQU3q2f71G54sTtM0egSR9cbEkH1uCTt8c1rzW--hUtrLoxtbENZ5pzOxh_A445FkVoPqRqaVvJ3JHkuPpai458SE0H1zMQ_WZFdwL5hCZAAiC5t65iRg0kexGomRWgER0NjkA4LZT2wKbkwXV4woooyuqa34HNzVkZgifS_Kmy-iyOlUGHGqL4XvBvToiDDZIUg7RSNoV5K"
//               width={600}
//               height={600}
//             />
//           </div>
//           <div className="space-y-8">
//             <p className="text-xs uppercase tracking-widest opacity-40">• For Hosts</p>
//             <h2 className="text-5xl md:text-6xl leading-tight">Own a creative space? Get seen. Get booked.</h2>
//             <p className="text-lg font-light opacity-60">
//               List your studio, location or apartment alongside the world's most beautiful creative spaces. We handle the curation, the audience and the bookings.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Link href="/signup?role=owner" className="bg-brand-dark text-white px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all">
//                 List your space
//               </Link>
//               <button className="border border-brand-dark/10 px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-gray-50 transition-all">
//                 Learn more
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>




//             {/* Footer */}
//       <Footer />

//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// }




// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// import './home.css';

// export default function HomePage() {
//   const [currentMonth] = useState('April 2026');

//   const featuredSpaces = [
//     {
//       name: "The Arch House",
//       location: "London • Shoreditch",
//       description: "Vaulted natural-light studio with arched windows and warm oak floors.",
//       price: "£280",
//       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq",
//       href: "/spaces/arch-house"
//     },
//     {
//       name: "The Listening Room",
//       location: "London • Mayfair",
//       description: "Walnut-panelled podcast suite with broadcast-grade acoustics.",
//       price: "£180",
//       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3uo9sJREVsvu55f7nYUN4U39aW_z8KVHJogKwCcF74e4qO3um1Vm8L0GNdnC-7qad2ww2ddmQ_NyD4jxu53Urbe728k136lK_MylNvq6GgTep-4C-bErsAl8krw_FjL78x1a4dEfs6e1h6HOMXjZ2sj0AGRr_708J4LzQujsrKe-gtw3ZQrXb1uffQnvMMOsr7bx8QQHvHe9a-G6QRNQ9ffp1z28Z6IGZ-EDJoN6Ej9ecKRdg96wxQWY_5eLsQmE1ID3wQFC90aBW",
//       href: "/spaces/listening-room"
//     },
//     {
//       name: "Skyline Suite",
//       location: "Dubai • Downtown",
//       description: "Minimal penthouse content space with marble floors and 270° views.",
//       price: "£540",
//       image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDd2EelDPKVJ7xPXWWjsxwfWBr7ckj1_BbhrkhbAcoZsZ-G_AmImWhGW7Q_0nA4NaXl8xLOntklDIQ3BX1QUwjgaItBwbl2FQ416yEBPCSdZtmpDrmaB03yMXu2E0bGrl9bovp8DAaPrL5NawayEECeqWxrdT5_pd8nGO_JrlKl7pMUkoUiyvyawmiPzkjBSKpxMZ9xBDVVCufHtyvQkHo01_sq9H2N746US0KF1WOWxeZrNSIweyt_NCapBxLOOe98-vfR3GpY7baK",
//       href: "/spaces/skyline-suite"
//     },
//   ];

//   const cities = [
//     { name: "London", country: "United Kingdom", spaces: 42, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQzGsNM6tt8bra9e6JJuvlzW5F-dY10kFOEoEPU82FFtKfbK0kBoI6ZwAK3W6tA2KPRvxhORyfk6ePqy6fh1fjy1WSY_MY54q1Xa-Hi8rIF4p5Zr4BAo7dKPyKmq_FrTJGouZdP_jw_99cNPj5oLhpBXYXcNDlpiJVVhaexjhLDMWZnnRoWymsjmR8dAM-EFq9RXwEH-X0ImvpmWcifVN6zInI9MCboIYThAIPbXP6IrdDiaPsUBylZo9ADtszhphSu6aNq-hha2j5" },
//     { name: "Dubai", country: "United Arab Emirates", spaces: 18, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmJAT1sfbhr48irtVxV4uxCCnvMiVwtxv_fZy5TbZIOdspOMUhjfDYC5JbVMv0eGAmtIVvAVQZLL3Fp0G7Ba2rL_8bJuXLh0Jphe6kz0SGgE1bUY6C-DqZS-ESmTH3oXyMZ98tQYw4fidLR6V4Zy5R5ZFm_1FjKx4CDlkrMbLlJ1l3A0068fVa5fxvgnWSbukBakc6Sy-DicUkgzUg01htnR7Zx7GmNyeiELEdhb0uNy0KbT8qyQouloyS_x5Ela1abgUCXmtQ2esS" },
//     { name: "Paris", country: "France", spaces: 28, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7Dxm5KX8FSFBgwkgzKpBu-05kwpVuPBMJzcfshXnXkn5NVxdLODVdBHuu3EMOqQvhDyobH4A_F8L157J1jQh9HoL9nuzE8Pu87j-Av0y-jX6ANXxy2zOnbvcOwkwlZW-54GszbvG-GxPFWORoEid1ezlxs1s8zOi0XzjZoS-xb0BqP1oZSQrftxNT2KkvSiJmKGHvHPRIEcySzSGnmtZ_NR6ovjqU63AVxYrDSip4PITJcVZ4mlSBy6QJTGTpYrVFsDecwIvEcvhf" },
//   ];

//   return (
//     <div className="home-page bg-brand-light text-brand-dark">
//       {/* Navigation */}
//       <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-8 py-6">
//         <div className="text-xl font-medium tracking-widest uppercase">ManyRooms</div>
//         <div className="hidden md:flex gap-12 text-sm font-light opacity-80">
//           <span className="border-b border-brand-dark/40 pb-1">154 SPACES</span>
//           <span>6 CITIES</span>
//           <span>1.2K+ CREATORS</span>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden bg-brand-dark">
//         <div className="absolute inset-0 z-0">
//           <Image
//             alt="Creative Space"
//             className="w-full h-full object-cover opacity-60"
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjL4_jjm2DcmHEaTKr1ky0ZMJTk4_nyQUen_87485kCgDWc-4MO5Yg4JP7yarEnVVFEUHjgp1rd-mlL_-RG5QDV82v7o-I1Z0MtsCqFN7n-Q2JKjap5pgLjdR5dIU5xTKTYwaBRuytY5ss4i7pJHqZ-2526pmlkwykJG28wyAyzzEYAnVOAAD6tEpVtm8KqJZ-NxqjwAzz5P44wxTPpWhJCwUGWDJHO_ImknqeLHF_euz2odHHv9xPJuQdWLoWLYKWcbdcdnHMaivR"
//             width={1920}
//             height={1080}
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-brand-dark/20 to-brand-dark"></div>
//         </div>

//         <div className="relative z-10 container mx-auto px-6 text-center pt-20">
//           <p className="uppercase text-xs tracking-widest mb-6 opacity-70">The Global Marketplace for Creative Spaces</p>
//           <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight max-w-5xl mx-auto tracking-tight">
//             Find and book the perfect creative space, anywhere in the world.
//           </h1>
//           <p className="text-lg md:text-xl font-light opacity-80 max-w-2xl mx-auto mb-12">
//             For creators, brands and production teams who need beautiful spaces - fast. Studios, podcast rooms and editorial locations across London, Dubai, Paris and beyond.
//           </p>

//           {/* Search Component */}
//           <div className="max-w-3xl mx-auto mb-12">
//             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 pl-6 flex items-center gap-4">
//               <MagnifyingGlassIcon className="w-5 h-5 text-white/60" />
//               <input
//                 className="bg-transparent border-none focus:ring-0 text-white placeholder-white/50 w-full text-sm outline-none"
//                 placeholder="Warm natural studio in London for a fashion shoot tomorrow"
//                 type="text"
//               />
//               <button className="bg-white text-brand-dark px-8 py-3 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all uppercase tracking-wider">
//                 Discover
//               </button>
//             </div>
//             <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs opacity-60 uppercase tracking-widest">
//               <span>Try:</span>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Daylight studio in Shoreditch</a>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Podcast room in Mayfair</a>
//               <a href="#" className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4">Penthouse with skyline view</a>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <button className="bg-white text-brand-dark px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest flex items-center justify-center group">
//               Find a space
//               <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//             </button>
//             <button className="border border-white/30 bg-white/5 backdrop-blur-sm px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-white/10 transition-all">
//               Explore Cities
//             </button>
//           </div>
//         </div>

//         <div className="absolute bottom-8 left-8 text-[10px] tracking-widest opacity-40 uppercase">
//           Est. 2019 • London
//         </div>
//       </section>

//       {/* Intro Section */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto text-center">
//           <h2 className="text-4xl md:text-6xl max-w-4xl mx-auto leading-tight">
//             A new home for the world's most beautiful creative spaces. Designed for the people who shape <span className="italic font-bold">culture.</span>
//           </h2>
//           <div className="mt-16 text-xs tracking-widest opacity-40 uppercase">01 / Studio</div>
//         </div>
//       </section>

//       {/* Featured Spaces */}
//       <section className="bg-brand-light pb-32 px-6">
//         <div className="container mx-auto">
//           <div className="flex justify-between items-end mb-12">
//             <div>
//               <p className="text-xs uppercase tracking-widest opacity-40 mb-2">• Featured Spaces</p>
//               <h3 className="text-4xl md:text-5xl">Hand-picked, this season.</h3>
//             </div>
//             <a href="#" className="text-xs uppercase tracking-widest border-b border-brand-dark/20 pb-1 hover:opacity-60 transition-opacity">View All ↗</a>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
//             {featuredSpaces.map((space, idx) => (
//               <Link key={idx} href={space.href} className="space-y-4 group cursor-pointer">
//                 <div className="aspect-[4/5] overflow-hidden bg-gray-200">
//                   <Image
//                     alt={space.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                     src={space.image}
//                     width={600}
//                     height={750}
//                   />
//                 </div>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-[10px] uppercase tracking-widest opacity-50">{space.location}</p>
//                     <h4 className="text-2xl mt-1">{space.name}</h4>
//                     <p className="text-sm font-light opacity-60 mt-2 line-clamp-2">{space.description}</p>
//                     <div className="flex gap-2 mt-4">
//                       <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">Natural Light</span>
//                       <span className="text-[9px] uppercase border border-brand-dark/10 px-2 py-1 tracking-tighter opacity-50">Editorial</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[10px] uppercase tracking-widest opacity-50">From</p>
//                     <p className="text-xl">{space.price}</p>
//                     <p className="text-[10px] opacity-40">/ Hour</p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Cities Section */}
//       <section className="bg-[#ECEAE6] py-32 px-6">
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
//             <div>
//               <p className="text-xs uppercase tracking-widest opacity-40 mb-2">02 / Cities</p>
//               <h2 className="text-5xl md:text-7xl leading-none">Six cities.<br />A growing world.</h2>
//             </div>
//             <p className="max-w-xs text-sm font-light opacity-60 leading-relaxed">
//               From the warm light of London townhouses to the sculpted skylines of Dubai – Many Rooms is curating the most beautiful creative spaces, city by city.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {cities.map((city) => (
//               <div key={city.name} className="relative group aspect-[4/3] overflow-hidden cursor-pointer">
//                 <Image
//                   alt={city.name}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                   src={city.image}
//                   width={600}
//                   height={450}
//                 />
//                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
//                 <div className="absolute bottom-8 left-8 text-white">
//                   <p className="text-[10px] uppercase tracking-widest opacity-70">{city.country}</p>
//                   <h4 className="text-3xl">{city.name}</h4>
//                   <p className="text-[10px] uppercase tracking-widest mt-1">{city.spaces} curated spaces</p>
//                 </div>
//                 <div className="absolute bottom-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Process Section */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-24">
//             <p className="text-xs uppercase tracking-widest opacity-40 mb-4">03 / Process</p>
//             <h2 className="text-5xl md:text-6xl">A simpler way to find the room.</h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
//             {[
//               { step: "01", title: "Describe your vision", desc: "Search by city, style or tell us what you're shooting. Our AI surfaces spaces that match the brief.", icon: "search" },
//               { step: "02", title: "Discover the right room", desc: "Editorial cards, full galleries, vibe tags and transparent capacity - so you know exactly what you're booking.", icon: "calendar" },
//               { step: "03", title: "Enquire and create", desc: "Message hosts in seconds, confirm dates, and arrive on shoot day with everything in place.", icon: "chat" }
//             ].map((item) => (
//               <div key={item.step} className="space-y-6">
//                 <div className="flex justify-between items-baseline border-b border-brand-dark/10 pb-4">
//                   <span className="w-6 h-6 opacity-40">
//                     {item.icon === "search" && <MagnifyingGlassIcon className="w-5 h-5" />}
//                     {item.icon === "calendar" && <ChevronLeftIcon className="w-5 h-5" />}
//                     {item.icon === "chat" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>}
//                   </span>
//                   <span className="font-serif text-5xl italic opacity-20">{item.step}</span>
//                 </div>
//                 <h4 className="text-xl font-medium">{item.title}</h4>
//                 <p className="text-sm opacity-60 leading-relaxed font-light">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Discovery */}
//       <section className="bg-[#1a1a1a] text-white py-32 px-6 overflow-hidden">
//         <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
//           <div className="space-y-8">
//             <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
//               <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
//               AI-Powered Discovery
//             </div>
//             <h2 className="text-5xl md:text-6xl leading-tight">Tell us the vibe.<br />We'll find the room.</h2>
//             <p className="text-lg font-light opacity-60 max-w-md">
//               Describe your shoot in your own words - light, mood, surfaces, city, timing - and let Many Rooms surface the spaces that fit. Smarter discovery for creators on the move.
//             </p>
//             <div className="space-y-4">
//               {[
//                 "A warm wood-panelled podcast room in central London for Thursday.",
//                 "Daylight studio with high ceilings in Paris, suitable for fashion film."
//               ].map((text, i) => (
//                 <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors">
//                   <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//                   <p className="text-sm font-light italic">{text}</p>
//                 </div>
//               ))}
//             </div>
//             <button className="bg-white text-brand-dark px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest flex items-center gap-2 group">
//               Try AI-Discovery
//               <svg className="w-4 h-4 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//             </button>
//           </div>
//           <div className="relative">
//             <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
//               <Image
//                 alt="AI Match Result"
//                 className="w-full h-full object-cover"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5MIZnoTzW-CyTF8G-EW9VeUjZffOY10npkSON7JaZ0EBgE-_jtmwMUMDaUNqK4VZetLgC2b-1VlXzIRMzlYh69VMyKLqZuL16Kamy1KN_KCcbciQlJxErNvSmahXpT2s8lidXQx4h9EuREKh20lSV2mFuw0k3ZNFjtvlns4Pu6b8n8gkHyOQP61jLmbqasRBMSCdpiQJ_xEg1Bg0_XgXzSA7_2g0Mj7w0tjk1QzYMwmr9ss6zBzmElV6iGEA-43GU1xUae7wkdCQB"
//                 width={600}
//                 height={750}
//               />
//             </div>
//             <div className="absolute -bottom-6 -left-6 bg-white text-brand-dark p-6 shadow-xl max-w-xs rounded-lg">
//               <div className="flex justify-between items-start mb-4">
//                 <span className="text-[9px] uppercase tracking-widest font-bold text-green-600">Match • 96%</span>
//               </div>
//               <h5 className="text-lg font-serif">The Arch House</h5>
//               <p className="text-[10px] uppercase tracking-widest opacity-40">London • Shoreditch</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="bg-brand-light py-32 px-6">
//         <div className="container mx-auto">
//           <div className="text-center mb-24">
//             <h2 className="text-5xl md:text-6xl max-w-3xl mx-auto">Loved by creators and the brands they shape.</h2>
//             <div className="mt-8 text-xs tracking-widest opacity-40 uppercase">04 / Trust</div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-brand-dark/10 pt-16">
//             {[
//               { text: "Many Rooms has quietly become our first call for any shoot in London. The spaces are always the right kind of beautiful.", by: "Editorial Director • Independent Fashion Title" },
//               { text: "We needed a podcast room in 48 hours. They surfaced three perfect options - booked, shot, edited within the week.", by: "Head of Brand • Consumer Tech Company" },
//               { text: "The curation is what sets it apart. Every space feels like it belongs in a magazine.", by: "Photographer • London / New York" }
//             ].map((testimonial, i) => (
//               <div key={i} className="space-y-6">
//                 <p className="text-xl font-light leading-relaxed">"{testimonial.text}"</p>
//                 <div>
//                   <p className="text-[10px] uppercase tracking-widest font-bold">{testimonial.by}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-32 text-center border-t border-brand-dark/10 pt-16">
//             {[
//               { stat: "154", label: "Curated Spaces" },
//               { stat: "6", label: "Cities" },
//               { stat: "1.2k+", label: "Creators" },
//               { stat: "4.9", label: "Avg. Rating" }
//             ].map((item) => (
//               <div key={item.label}>
//                 <p className="text-5xl font-serif italic mb-2">{item.stat}</p>
//                 <p className="text-[10px] uppercase tracking-widest opacity-50">{item.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Host CTA */}
//       <section className="bg-brand-light pb-32 px-6">
//         <div className="container mx-auto bg-white p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//           <div className="aspect-[16/9] lg:aspect-square overflow-hidden rounded-xl">
//             <Image
//               alt="Studio Host"
//               className="w-full h-full object-cover"
//               src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsMV2AON7Y2XYvsfBp4TE0_7CAjGklIVLBwFyU_gGpYEUGUn3nMtxYNBbJSsNKcIhZQU3q2f71G54sTtM0egSR9cbEkH1uCTt8c1rzW--hUtrLoxtbENZ5pzOxh_A445FkVoPqRqaVvJ3JHkuPpai458SE0H1zMQ_WZFdwL5hCZAAiC5t65iRg0kexGomRWgER0NjkA4LZT2wKbkwXV4woooyuqa34HNzVkZgifS_Kmy-iyOlUGHGqL4XvBvToiDDZIUg7RSNoV5K"
//               width={600}
//               height={600}
//             />
//           </div>
//           <div className="space-y-8">
//             <p className="text-xs uppercase tracking-widest opacity-40">• For Hosts</p>
//             <h2 className="text-5xl md:text-6xl leading-tight">Own a creative space? Get seen. Get booked.</h2>
//             <p className="text-lg font-light opacity-60">
//               List your studio, location or apartment alongside the world's most beautiful creative spaces. We handle the curation, the audience and the bookings.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Link href="/signup?role=owner" className="bg-brand-dark text-white px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all">
//                 List your space
//               </Link>
//               <button className="border border-brand-dark/10 px-10 py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-gray-50 transition-all">
//                 Learn more
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Pre-Footer Nav */}
//       <section className="bg-brand-light border-t border-brand-dark/10 py-12 px-6">
//         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
//           <div className="text-xl tracking-widest uppercase">ManyRooms</div>
//           <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest font-medium">
//             <a href="#" className="hover:opacity-50 transition-opacity">Home</a>
//             <a href="#" className="hover:opacity-50 transition-opacity">Spaces</a>
//             <a href="#" className="hover:opacity-50 transition-opacity">Cities</a>
//             <a href="#" className="hover:opacity-50 transition-opacity">How it works</a>
//             <a href="#" className="hover:opacity-50 transition-opacity">About</a>
//           </div>
//           <div className="flex items-center gap-6">
//             <a href="#" className="text-[10px] uppercase tracking-widest hover:opacity-50 transition-opacity">List your space</a>
//             <button className="bg-brand-dark text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest">Find a Space</button>
//           </div>
//         </div>
//       </section>

//       {/* Main Footer */}
//       <footer className="bg-brand-dark text-white py-32 px-6">
//         <div className="container mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-32">
//             <div className="lg:col-span-2 space-y-8">
//               <h2 className="text-4xl max-w-xs leading-tight">Stay close to the world's best spaces.</h2>
//               <p className="text-sm font-light opacity-60 max-w-sm">Early access to new cities, featured spaces and creator stories - once a month, beautifully curated.</p>
//               <form className="flex max-w-md">
//                 <input className="bg-white/5 border border-white/10 rounded-l-full px-6 py-4 w-full focus:ring-0 focus:border-white/30 text-sm" placeholder="Your email" type="email" />
//                 <button className="bg-white text-brand-dark px-8 rounded-r-full hover:bg-opacity-90 transition-all flex items-center justify-center">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
//                 </button>
//               </form>
//             </div>
//             <div>
//               <p className="text-[10px] uppercase tracking-widest opacity-40 mb-8">Discover</p>
//               <ul className="space-y-4 text-xs opacity-70">
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">All spaces</a></li>
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">Cities</a></li>
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">How it works</a></li>
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">AI discovery</a></li>
//               </ul>
//             </div>
//             <div>
//               <p className="text-[10px] uppercase tracking-widest opacity-40 mb-8">Cities</p>
//               <ul className="space-y-4 text-xs opacity-70">
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">London</a></li>
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">Dubai</a></li>
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">Paris</a></li>
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">New York</a></li>
//               </ul>
//             </div>
//             <div>
//               <p className="text-[10px] uppercase tracking-widest opacity-40 mb-8">Hosts</p>
//               <ul className="space-y-4 text-xs opacity-70">
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">List your space</a></li>
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">Why Many Rooms</a></li>
//                 <li><a href="#" className="hover:opacity-100 transition-opacity">Host stories</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-12 gap-8">
//             <div className="text-xl font-medium tracking-widest uppercase">Many Rooms</div>
//             <div className="text-[10px] uppercase tracking-widest opacity-40">
//               © 2024 MANY ROOMS STUDIOS • CRAFTED GLOBALLY
//             </div>
//             <div className="flex gap-8 text-[10px] uppercase tracking-widest opacity-40">
//               <a href="#" className="hover:opacity-100">Privacy</a>
//               <a href="#" className="hover:opacity-100">Terms</a>
//               <a href="#" className="hover:opacity-100">Instagram</a>
//             </div>
//           </div>
//         </div>
//       </footer>

//       {/* Fixed Chat Button */}
//       <div className="fixed bottom-8 right-8 z-[100]">
//         <div className="group relative">
//           <button className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
//           </button>
//           <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//             <div className="bg-white text-brand-dark text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded shadow-2xl whitespace-nowrap">
//               How can we help?
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
// import './home.css';

// export default function HomePage() {
//   const [currentMonth] = useState('March 2026');

//   return (
//     <div className="home-page">
//       {/* BEGIN: Navigation */}
//       <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
//         <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="text-2xl font-extrabold tracking-tighter">
//             MANYROOMS<span className="text-gray-400">.</span>
//           </Link>

//           {/* Navigation Links */}
//           <div className="hidden md:flex items-center space-x-10 text-sm font-medium uppercase tracking-widest">
//             <Link href="#studios" className="hover:opacity-60 transition-opacity">Studios</Link>
//             <Link href="#services" className="hover:opacity-60 transition-opacity">Services</Link>
//             <Link href="#about" className="hover:opacity-60 transition-opacity">About</Link>
//             <Link href="#contact" className="hover:opacity-60 transition-opacity">Contact</Link>
//           </div>

//           {/* CTA */}
//           <div className="flex items-center">
//             <Link
//               href="/booking"
//               className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-opacity-80 transition-all uppercase tracking-tight"
//             >
//               Book a Tour
//             </Link>
//           </div>
//         </nav>
//       </header>
//       {/* END: Navigation */}

//       {/* BEGIN: Hero Section */}
//       <section className="relative pt-32 pb-20 min-h-screen flex flex-col justify-center overflow-hidden">
//         {/* Background Imagery */}
//         <div className="absolute inset-0 z-0">
//           <Image
//             alt="Minimalist Studio Space"
//             className="w-full h-full object-cover opacity-10"
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2JfhXTeapUY-u7Gau6BCQcrlkoiCZfJhB2AQMeW9PFSfjJQbLn5NQ2JsLlG9FZ-gPLNdfD4RnRj2eJ1PzwpQeyKIZgT1Yt956NC9xowg5rg7_AMAH74NxgaHBXBQZkZuNi9cA7MeTicdVjVblfpkTe__2avioRr3gxaZSDYzT8OTRpRkGyp5B_TxnUdbqh0pZp-3hkWE3Y2KS_dqqhE7KvrmDaLjJS4fWJBdMFJObN6ylIY0aYCvJ-4i3XnrexrEgO9JNE1TzrrgJ"
//             width={1920}
//             height={1080}
//           />
//         </div>

//         <div className="container mx-auto px-6 relative z-10">
//           {/* Search Interface */}
//           <div className="max-w-5xl mx-auto mb-16">
//             <div className="bg-white border border-gray-200 p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2">
//               <div className="w-full flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Studio Type</label>
//                 <input
//                   className="w-full border-none p-0 focus:ring-0 text-sm font-semibold placeholder-gray-300 outline-none"
//                   placeholder="Fashion, Music, Film..."
//                   type="text"
//                 />
//               </div>
//               <div className="w-full flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Where?</label>
//                 <input
//                   className="w-full border-none p-0 focus:ring-0 text-sm font-semibold placeholder-gray-300 outline-none"
//                   placeholder="City or Region"
//                   type="text"
//                 />
//               </div>
//               <div className="w-full flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</label>
//                 <input
//                   className="w-full border-none p-0 focus:ring-0 text-sm font-semibold text-gray-500 outline-none"
//                   type="date"
//                 />
//               </div>
//               <div className="w-full flex-1 px-6 py-3">
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time Range</label>
//                 <select className="w-full border-none p-0 focus:ring-0 text-sm font-semibold text-gray-500 bg-transparent outline-none">
//                   <option>Full Day</option>
//                   <option>Half Day (AM)</option>
//                   <option>Half Day (PM)</option>
//                   <option>Hourly</option>
//                 </select>
//               </div>
//               <button className="w-full md:w-auto bg-black text-white p-4 md:p-5 rounded-full hover:scale-105 transition-transform">
//                 <MagnifyingGlassIcon className="h-6 w-6 mx-auto" />
//               </button>
//             </div>
//           </div>

//           {/* Bold Headline */}
//           <div className="text-center">
//             <h1 className="hero-title text-[clamp(3rem,12vw,10rem)] font-extrabold uppercase mb-8">
//               Space For<br />Visionaries.
//             </h1>
//             <p className="max-w-xl mx-auto text-lg text-gray-500 font-medium leading-relaxed">
//               Premium production environments curated for the world's most ambitious creative agencies and independent makers.
//             </p>
//           </div>
//         </div>
//       </section>
//       {/* END: Hero Section */}

//       {/* BEGIN: Portfolio Section */}
//       <section className="py-24 bg-white">
//         <div className="container mx-auto px-6">
//           <div className="flex justify-between items-end mb-16">
//             <div>
//               <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Our Work</h2>
//               <h3 className="text-5xl font-extrabold">The Portfolio</h3>
//             </div>
//             <Link href="/portfolio" className="text-sm font-bold underline underline-offset-8">
//               VIEW ALL PROJECTS
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Project 1 */}
//             <div className="group cursor-pointer">
//               <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
//                 <Image
//                   alt="Fashion shoot"
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6H2Fw4On5Ax2Ql4j1hHDRKR9Yoko5LZKysMxFIzyYp2OkY_pzr_T2aQBW5lWj-9nDVC387WjwKOGeST-5fj2Ik-1KWlBg86gU2BQNdavfu4WX5ZRjBCIPgzVYP0HSxMZ9aBYz56fyLwaLpq75DPi04J7LFkaRoIvmG-Tll8K59gbDMMs9q-fF6JWhCftyrM48XT4dVJhCbmYTjrbW6OU-uE-Ec_YBOT28NmYJWe50Mpp7yog1Y2x6EB0l9UzwIGT3qyB0IRy0a0nZ"
//                   width={600}
//                   height={750}
//                 />
//                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                   <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
//                     <PlayIcon className="w-6 h-6 ml-1" />
//                   </div>
//                 </div>
//               </div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Fashion Editorial</p>
//               <h4 className="text-xl font-bold italic">Vogue x House of Marra</h4>
//             </div>

//             {/* Project 2 */}
//             <div className="group cursor-pointer">
//               <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
//                 <Image
//                   alt="Music video"
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl-g1O1-ldnmCmAN2asF6zE-OY2wUuyUyZq4rif2SlpBWksqE3xSubgs7jJcT1n79j5-BYwLrvFM1XzPur1lRNooAa-NE1AKlvsi90plsWgQ8XKLVDvmEU-ybpWMf7XxjAT0U_aUCoMj_fvXV4k3FpX9vAXaNafpTr_tZHloklpzFtn6_EDeCBXG0e3wyU8lMmJWIfmy0xsvU3_XGrH0fh5JlCBoXYLJ-qzyZDsViSuuWiJFLc1VHabJsD2bAcTr7toqfayqJNT2Mv"
//                   width={600}
//                   height={750}
//                 />
//                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                   <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
//                     <PlayIcon className="w-6 h-6 ml-1" />
//                   </div>
//                 </div>
//               </div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Music Video</p>
//               <h4 className="text-xl font-bold italic">Lunar Echoes — Official Film</h4>
//             </div>

//             {/* Project 3 */}
//             <div className="group cursor-pointer">
//               <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
//                 <Image
//                   alt="Interview"
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3qTtbdx84VTXlEx_wwcDHFUgzMal_n9hg3_d7O-jIY_l3dgsQh1cnAruQqWfX3QL89CYU7PmKXhUIAK90uAxqmmay_ksRBLB7wiAxRfSiyCCrYO3pzE3ZN56OexDY71n19g0srXven_NryTLiUNkVtrwwrH31TWtGkZNV0DvXpFfbChmSBW-ttqBW2nnC__CoFP43PQj11LKP12E9jo5fLEuDMOg_8vNG-iF48kcGgoWHwUXsiKuqpj1neLZj-aJOKKjCbtoBuJeR"
//                   width={600}
//                   height={750}
//                 />
//                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                   <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
//                     <PlayIcon className="w-6 h-6 ml-1" />
//                   </div>
//                 </div>
//               </div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Branded Content</p>
//               <h4 className="text-xl font-bold italic">The Architects Series</h4>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* END: Portfolio Section */}

//       {/* BEGIN: Global Footprint */}
//       <section className="py-24 bg-gray-50 overflow-hidden">
//         <div className="container mx-auto px-6">
//           <div className="mb-16">
//             <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Locations</h2>
//             <h3 className="text-5xl font-extrabold">Global Footprint</h3>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//             {/* NYC */}
//             <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
//               <Image
//                 alt="NYC"
//                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxF9KiXpmr47byjlIR1OxHP3kpCxV0__PBCKlFHTRoc1SQAIItuYlfmDr1Q_jwEB7VUNICPizER9XgXErCTmQx6PtRmVWAw8mtfsAw1oZpB_RwC8Pljvfntzy_Hjwu5HtevCqxoEBl1RYIUeyvW866mpHcgI2dbuStMC7H2fD_TqfCTOxQ9VBl0G-RF6WoZM8FYur9CxyA_YtgdZfk3MIQS7eFriS9cp7dmul_L26hrajzG3rT19VA1fxvGWtyoJVNobVRm8a28oIg"
//                 width={400}
//                 height={400}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
//                 <span className="text-white font-bold text-lg">NYC</span>
//               </div>
//             </div>

//             {/* London */}
//             <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
//               <Image
//                 alt="London"
//                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF388dNc5LzjoMDNI4m1SB6JoLpUscTPSYMXCrJlLV_mIcaHOq00KR1Hs-sCsM238ejZWATi6_UOC390ZevRvhu7oGw-iA9dpbarnFK_SqnmrdGu8Z91065sP1KVT7eOddAzdYkZhmYX7P_tjHmdrD67fdfA5QQXq8AgsywbQvVwb7kLv4PFvMhS7IIBDTta36eOmVGkhsnRiA3pMR2C_ger8oZmS0QY7GO-sXzEFcLf1q3g5EbwheqzdLXiT_wEKnNoGH0kSbuMmY"
//                 width={400}
//                 height={400}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
//                 <span className="text-white font-bold text-lg">LONDON</span>
//               </div>
//             </div>

//             {/* Paris */}
//             <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
//               <Image
//                 alt="Paris"
//                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuThCWC0giax8u8XkKWOy-dHMF5q325dcfq8zJn_VjABGkdF3FewlXKfF8bQsn-_s4t-a4aNMWtqjDJeKiVutkqbtuieOC0XTVVObJlcy55nQnsEdpsJNQk_qehaXZFf9oKnB0CyHfDKDeJB9AJPQgVxdmt0EZykseVGQwYcl2W6UIYtJV9bovcLC9sIgk72r4JOd8qFy2BzjPF1RjRvUkCqpvE2byITeDgWhAcdUHINUCydOl1yH82y0ZmQP-tokTrZCj6HUO3dkO"
//                 width={400}
//                 height={400}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
//                 <span className="text-white font-bold text-lg">PARIS</span>
//               </div>
//             </div>

//             {/* Berlin */}
//             <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
//               <Image
//                 alt="Berlin"
//                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTXQeg62oRcSwobcv8ciy1Rxztq-jjVwYHYzA8Dv6kEHHnKT_toal4cqhjxnDEIAl6I33J6SXi1_P_1FH1YgmClpnbQtGty86drNI-B36hhz2pCJ3JlUyIrPE4AZOdMrGFRmRWvmAwlxTySskUvzSFdfO2ouH8f6WW1GYvB_f7PNylICCeDm6hpXsXE4GSiaWjkQ_2waauCsgRQ3kxYdq6aBJ8yn-X3UTY1FU_3_cMAZtimekni5ASEQbfyoKaeXgrdq7dRiaEPI8t"
//                 width={400}
//                 height={400}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
//                 <span className="text-white font-bold text-lg">BERLIN</span>
//               </div>
//             </div>

//             {/* Tokyo */}
//             <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
//               <Image
//                 alt="Tokyo"
//                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdLPuH-mWUPpDEyQRs5BWstk6PQKiAeP5aoX0K_kAVZmg0MAxE5ILeFhSOYL_pzqnSz0fhjiOnDjJMtUsuIDLhVuOnd2LZocLT8ytnhFhKCGma8tBSrl_A2AxE_HdwPsquhr9gzkhUfpUedqHfjH87MeWL7DtKpZuB4fGK7P9ooO44PTHhM3s6teYozk23RAkvadKewmc4p4AQTEoEW9csNIzSrBB7MisR4j9mvVIZoHi9xWvr2PB5z9EvnBH2TaDccPHRHJ2Bbtq5"
//                 width={400}
//                 height={400}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
//                 <span className="text-white font-bold text-lg">TOKYO</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* END: Global Footprint */}

//       {/* BEGIN: Availability Section */}
//       <section className="py-24 bg-white border-y border-gray-100">
//         <div className="container mx-auto px-6">
//           <div className="grid lg:grid-cols-12 gap-16 items-start">
//             <div className="lg:col-span-5">
//               <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Booking</h2>
//               <h3 className="text-5xl font-extrabold mb-8 leading-tight">Live<br />Availability</h3>
//               <p className="text-gray-500 mb-10 max-w-sm">
//                 Select a date and studio type to see real-time availability across our network. No more back-and-forth emails.
//               </p>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="w-4 h-4 rounded-full bg-green-500"></div>
//                   <span className="text-sm font-bold">Studio A (Cyclorama) — Available</span>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="w-4 h-4 rounded-full bg-orange-400"></div>
//                   <span className="text-sm font-bold">Studio B (Loft) — Limited</span>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="w-4 h-4 rounded-full bg-red-500"></div>
//                   <span className="text-sm font-bold">Studio C (Green Screen) — Booked</span>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:col-span-7 bg-white p-8 border border-gray-200 shadow-xl rounded-3xl">
//               {/* Calendar UI */}
//               <div className="flex justify-between items-center mb-8">
//                 <h4 className="font-bold text-xl uppercase tracking-tighter">{currentMonth}</h4>
//                 <div className="flex gap-2">
//                   <button className="p-2 border rounded-full hover:bg-gray-50">
//                     <ChevronLeftIcon className="w-5 h-5" />
//                   </button>
//                   <button className="p-2 border rounded-full hover:bg-gray-50">
//                     <ChevronRightIcon className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
//                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
//               </div>

//               <div className="grid grid-cols-7 gap-2">
//                 {/* Previous month days */}
//                 {[1, 2, 3, 4, 5].map((day) => (
//                   <div key={`prev-${day}`} className="aspect-square flex items-center justify-center text-gray-200">
//                     {26 + day - 1}
//                   </div>
//                 ))}

//                 {/* Current month days with indicators */}
//                 {[1, 2].map((day) => (
//                   <button key={`day-${day}`} className="aspect-square flex items-center justify-center rounded-xl border border-gray-100 font-bold hover:bg-black hover:text-white transition-colors">
//                     {day}
//                   </button>
//                 ))}

//                 {[3, 4, 5, 6, 7, 8, 9].map((day) => (
//                   <button key={`day-${day}`} className="aspect-square flex flex-col items-center justify-center rounded-xl border border-gray-100 font-bold hover:bg-black hover:text-white transition-colors">
//                     <span>{day}</span>
//                     <div className="w-1 h-1 bg-green-500 rounded-full mt-1"></div>
//                   </button>
//                 ))}

//                 <button className="aspect-square flex flex-col items-center justify-center rounded-xl bg-black text-white font-bold">
//                   <span>10</span>
//                   <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
//                 </button>

//                 {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].map((day) => (
//                   <button key={`day-${day}`} className="aspect-square flex flex-col items-center justify-center rounded-xl border border-gray-100 font-bold hover:bg-black hover:text-white transition-colors">
//                     <span>{day}</span>
//                     <div className="w-1 h-1 bg-gray-300 rounded-full mt-1"></div>
//                   </button>
//                 ))}
//               </div>

//               <button className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm">
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* END: Availability Section */}

//       {/* BEGIN: CTA Section */}
//       {/* <section className="flex flex-col md:flex-row">
//         <div className="flex-1 bg-black text-white p-20 flex flex-col justify-center items-start border-r border-white/10 group cursor-pointer relative overflow-hidden">
//           <div className="relative z-10">
//             <h3 className="text-4xl font-extrabold mb-6">List Your Studio</h3>
//             <p className="text-gray-400 mb-8 max-w-xs">Join our network of premium production spaces and reach high-tier clients.</p>
//             <span className="text-sm font-bold border-b-2 border-white pb-2">PARTNER WITH US</span>
//           </div>
//           <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 scale-150 group-hover:scale-125 transition-transform duration-1000">
//             <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path>
//             </svg>
//           </div>
//         </div>

//         <div className="flex-1 bg-white text-black p-20 flex flex-col justify-center items-start group cursor-pointer relative overflow-hidden">
//           <div className="relative z-10">
//             <h3 className="text-4xl font-extrabold mb-6">Become a Franchisee</h3>
//             <p className="text-gray-500 mb-8 max-w-xs">Bring the ManyRooms standard to your city with our end-to-end management system.</p>
//             <span className="text-sm font-bold border-b-2 border-black pb-2">LEARN MORE</span>
//           </div>
//           <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4 scale-150 group-hover:scale-125 transition-transform duration-1000">
//             <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
//             </svg>
//           </div>
//         </div>
//       </section> */}
//       {/* BEGIN: CTA Section */}
// <section className="flex flex-col md:flex-row">
//   <Link 
//     href="/signup?role=owner" 
//     className="flex-1 bg-black text-white p-20 flex flex-col justify-center items-start border-r border-white/10 group cursor-pointer relative overflow-hidden"
//   >
//     <div className="relative z-10">
//       <h3 className="text-4xl font-extrabold mb-6">List Your Studio</h3>
//       <p className="text-gray-400 mb-8 max-w-xs">Join our network of premium production spaces and reach high-tier clients.</p>
//       <span className="text-sm font-bold border-b-2 border-white pb-2">PARTNER WITH US</span>
//     </div>
//     <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 scale-150 group-hover:scale-125 transition-transform duration-1000">
//       <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path>
//       </svg>
//     </div>
//   </Link>

//   <Link 
//     href="/signup?role=franchisee" 
//     className="flex-1 bg-white text-black p-20 flex flex-col justify-center items-start group cursor-pointer relative overflow-hidden"
//   >
//     <div className="relative z-10">
//       <h3 className="text-4xl font-extrabold mb-6">Become a Franchisee</h3>
//       <p className="text-gray-500 mb-8 max-w-xs">Bring the ManyRooms standard to your city with our end-to-end management system.</p>
//       <span className="text-sm font-bold border-b-2 border-black pb-2">LEARN MORE</span>
//     </div>
//     <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4 scale-150 group-hover:scale-125 transition-transform duration-1000">
//       <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
//       </svg>
//     </div>
//   </Link>
// </section>
// {/* END: CTA Section */}
//       {/* END: CTA Section */}

//       {/* BEGIN: Footer */}
//       <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
//         <div className="container mx-auto px-6">
//           <div className="grid md:grid-cols-4 gap-12 mb-24">
//             <div className="col-span-2">
//               <div className="text-3xl font-extrabold tracking-tighter mb-8">MANYROOMS.</div>
//               <p className="text-xl font-medium text-gray-500 max-w-md">
//                 The modern standard for creative production spaces. Globally available, locally curated.
//               </p>
//             </div>

//             <div>
//               <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Inquiries</h5>
//               <a href="mailto:hello@manyrooms.io" className="text-lg font-bold hover:opacity-60 transition-opacity">
//                 hello@manyrooms.io
//               </a>
//               <div className="mt-4 text-gray-500 text-sm">
//                 +1 (555) 902-8800<br />
//                 224 W 30th St, New York, NY
//               </div>
//             </div>

//             <div>
//               <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Social</h5>
//               <div className="flex flex-col gap-2">
//                 <a href="#" className="text-sm font-bold hover:translate-x-1 transition-transform">Instagram</a>
//                 <a href="#" className="text-sm font-bold hover:translate-x-1 transition-transform">LinkedIn</a>
//                 <a href="#" className="text-sm font-bold hover:translate-x-1 transition-transform">Vimeo</a>
//                 <a href="#" className="text-sm font-bold hover:translate-x-1 transition-transform">Twitter</a>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100 gap-6">
//             <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
//               <a href="#" className="hover:text-black">Privacy Policy</a>
//               <a href="#" className="hover:text-black">Terms of Service</a>
//               <a href="#" className="hover:text-black">Cookies</a>
//             </div>
//             <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
//               © 2023 ManyRooms Agency Group.
//             </div>
//           </div>
//         </div>
//       </footer>
//       {/* END: Footer */}
//     </div>
//   );
// }








// import LoginPage from './components/LoginPage';

// export default function Home() {
//   return <LoginPage />;
// }




// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
