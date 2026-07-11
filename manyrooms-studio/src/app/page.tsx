// app/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  StarIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Chatbot from '@/components/Chatbot';
import Footer from '@/components/Footer';
import './home.css';

// Brand Colors - Fresh Clean Palette
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  coral: '#FF6B6B',
  dark: '#0f172a',
  purple: '#A78BFA',
  green: '#34D399',
  orange: '#FB923C',
  pink: '#F472B6',
  red: '#EF4444',
  indigo: '#818CF8',
  teal: '#2DD4BF',
  rose: '#FB7185',
};

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
}

interface ChatMessage {
  text: string;
  type: 'user' | 'owner';
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

function CountUp({
  end,
  duration = 1800,
  suffix = '',
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
            else setValue(end);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [phoneMessages, setPhoneMessages] = useState<ChatMessage[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // const chatSequence: ChatMessage[] = [
  //   { text: "Hi! Is the studio available for a 4-hour shoot this Friday?", type: "user" },
  //   { text: "Hey! Yes, we have a slot from 2 PM - 6 PM. Want me to book you in?", type: "owner" },
  //   { text: "Perfect, sending the request now!", type: "user" },
  // ];

  // In your component, update the chatSequence for two different conversations:
const chatSequence: ChatMessage[] = [
  // Thread 1 - Studio Booking
  { text: "Hi! Is the studio available for a 4-hour shoot this Friday?", type: "user" },
  { text: "Hey! Yes, we have a slot from 2 PM - 6 PM. Want me to book you in?", type: "owner" },
  { text: "Perfect, sending the request now!", type: "user" },
];

// For Thread 2 - Production Inquiry  
const chatSequence2: ChatMessage[] = [
  { text: "Is the studio free next Thursday?", type: "user" },
  { text: "Yes! 10am - 6pm available.", type: "owner" },
];

  const allReviews = [
    { text: "ManyRooms transformed how we book studio spaces. The search is incredibly accurate!", name: "Sarah Chen", role: "Creative Director, Vogue", initials: "SC", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { text: "I've saved countless hours on booking coordination. The automation is a game-changer.", name: "Marcus Thorne", role: "Editorial Photographer", initials: "MT", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { text: "The quality of studios on this platform is unmatched. Every space exceeds expectations.", name: "Elena Rodriguez", role: "Independent Filmmaker", initials: "ER", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" },
    { text: "Finally, a platform that understands creative professionals. Booking is seamless.", name: "James Wilson", role: "Art Director, Nike", initials: "JW", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
    { text: "From podcast studios to photo lofts, ManyRooms has every space we need.", name: "Amara Okafor", role: "Content Creator", initials: "AO", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
    { text: "The matching is scary good. Found exactly the industrial loft we needed.", name: "David Park", role: "Creative Lead, Adobe", initials: "DP", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
    { text: "We've increased studio bookings by 300% since listing on ManyRooms.", name: "Lisa Thompson", role: "Studio Owner, DTLA", initials: "LT", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
    { text: "Transparent pricing and instant confirmations make my job so much easier!", name: "Alex Rivera", role: "Production Manager", initials: "AR", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" },
    { text: "I love messaging studio owners directly. No more endless email chains!", name: "Nina Patel", role: "Fashion Photographer", initials: "NP", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150" },
    { text: "ManyRooms is essential to our creative workflow. Can't imagine working without it.", name: "Chris Mendoza", role: "Music Producer", initials: "CM", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=150" },
    { text: "The curated categories are spot on. Found a brutalist loft perfect for our shoot.", name: "Keisha Williams", role: "Brand Strategist", initials: "KW", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150" },
    { text: "As a studio owner, the dashboard gives me complete control. So smooth.", name: "Robert Kim", role: "Studio Owner, Brooklyn", initials: "RK", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
  ];

  // TV Switch-On Effect
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutIds: NodeJS.Timeout[] = [];
    const animateMessages = async () => {
      setPhoneMessages([]);
      for (const msg of chatSequence) {
        if (!isMounted) return;
        await new Promise<void>(resolve => {
          const id = setTimeout(() => { setPhoneMessages(prev => [...prev, msg]); resolve(); }, 1500);
          timeoutIds.push(id);
        });
      }
      if (isMounted) {
        const id = setTimeout(() => animateMessages(), 3500);
        timeoutIds.push(id);
      }
    };
    animateMessages();
    return () => { isMounted = false; timeoutIds.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [phoneMessages]);

  useEffect(() => { fetchApprovedStudios(); setTimeout(() => setIsVisible(true), 100); }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const fetchApprovedStudios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('studios').select('*').eq('status', 'approved').limit(6);
      if (error) throw error;
      setFeaturedSpaces(data || []);
    } catch (error) { console.error('Error fetching studios:', error); }
    finally { setLoading(false); }
  };

  const getFirstImage = (images: string[]) => (!images || images.length === 0 ? null : images[0]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() && !searchLocation.trim()) return;
    setIsSearching(true);
    try {
      let query = supabase.from('studios').select('*').eq('status', 'approved');
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%,city.ilike.%${searchQuery.trim()}%`);
      }
      if (searchLocation.trim()) {
        const locLower = searchLocation.trim().toLowerCase();
        query = query.or(`city.ilike.%${locLower}%,state.ilike.%${locLower}%,country.ilike.%${locLower}%`);
      }
      query = query.limit(20);
      const { data, error } = await query;
      if (error) throw error;
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (searchLocation.trim()) params.set('location', searchLocation.trim());
      router.push(`/spaces?${params.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // TV Switch-On Overlay
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0f172a] flex items-center justify-center">
        <div className="tv-switch">
          <div className="tv-screen">
            <div className="tv-scanline"></div>
            <div className="tv-static"></div>
            <div className="tv-content">
              <span className="text-6xl font-extrabold text-white animate-pulse">
                Many<span className="text-[#F1CB81]">Rooms</span>
              </span>
              <div className="mt-4 flex gap-2 justify-center">
                <span className="w-3 h-3 rounded-full bg-[#FF6B6B] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-3 h-3 rounded-full bg-[#F1CB81] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-3 h-3 rounded-full bg-[#A78BFA] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                <span className="w-3 h-3 rounded-full bg-[#34D399] animate-bounce" style={{ animationDelay: '450ms' }}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page bg-white text-[#0f172a] overflow-x-hidden">

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[70] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#F1CB81] via-[#FF6B6B] to-[#A78BFA] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="group flex-shrink-0">
              <span className={`text-xl md:text-2xl font-extrabold tracking-tighter transition-all duration-300 group-hover:tracking-tight inline-block ${scrolled ? 'text-[#0f172a]' : 'text-white'}`}>
                Many<span className="text-[#F1CB81] inline-block transition-transform duration-300 group-hover:rotate-6">Rooms</span>
              </span>
            </Link>
            <div className="hidden lg:flex gap-6 items-center">
              {['Marketplace', 'Studios', 'Spaces', 'Journal', 'Services'].map((item) => (
                <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`}
                  className={`relative py-1 font-bold text-sm transition-colors group/link ${
                    scrolled ? 'text-slate-600 hover:text-[#0f172a]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item}
                  <span className={`absolute -bottom-0.5 left-0 h-[2px] bg-current transition-all duration-300 ${
                    item === 'Marketplace' ? 'w-full' : 'w-0 group-hover/link:w-full'
                  }`}></span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/signup?role=owner" className="btn-shine hidden md:block px-6 py-2 bg-[#F1CB81] text-[#0f172a] font-bold text-sm rounded-full hover:bg-[#FF6B6B] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF6B6B]/30 transition-all duration-300">List Your Space</Link>
            <div className="hidden md:flex items-center gap-3">
              <span className={`material-symbols-outlined cursor-pointer hover:scale-125 active:scale-95 transition-transform duration-200 ${scrolled ? 'text-[#0f172a]' : 'text-white/80'}`}>favorite</span>
              <span className={`material-symbols-outlined cursor-pointer hover:scale-125 active:scale-95 transition-transform duration-200 ${scrolled ? 'text-[#0f172a]' : 'text-white/80'}`}>account_circle</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 ${scrolled ? 'hover:bg-slate-100 text-[#0f172a]' : 'text-white hover:bg-white/10'}`}>
              <Bars3Icon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-10">
              <span className="text-2xl font-bold text-[#0f172a]">ManyRooms</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-transform duration-200 hover:rotate-90"><XMarkIcon className="w-6 h-6 text-[#0f172a]" /></button>
            </div>
            <nav className="flex flex-col gap-6">
              {['Marketplace', 'Studios', 'Journal'].map((item, i) => (
                <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`}
                  className="text-base font-semibold text-[#0f172a] hover:text-[#FF6B6B] hover:translate-x-1 transition-all duration-200"
                  style={{ transitionDelay: isMobileMenuOpen ? `${i * 40}ms` : '0ms' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >{item}</Link>
              ))}
              <div className="border-t border-slate-200 pt-6 mt-2">
                <Link href="/signup?role=owner" className="block text-base font-semibold text-[#0f172a] hover:text-[#FF6B6B] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Your Space</Link>
                <Link href="/login" className="block text-base font-semibold text-[#0f172a] hover:text-[#FF6B6B] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                <Link href="/signup" className="block text-base font-semibold text-[#0f172a] hover:text-[#FF6B6B] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* ============ HERO SECTION - No Phone Mockup ============ */}
      {/* <header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000"
            alt="Creative studio space"
            className="w-full h-full object-cover opacity-40 animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/70 to-transparent"></div>
        </div>

        {/* Animated background blobs */}
        <div className="absolute top-16 right-[8%] w-72 h-72 rounded-full bg-[#A78BFA]/20 blur-[100px] animate-float-slow pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-[2%] w-96 h-96 rounded-full bg-[#34D399]/15 blur-[120px] animate-float-slower pointer-events-none z-0"></div>
        <div className="absolute top-1/3 left-[35%] w-56 h-56 rounded-full bg-[#FF6B6B]/10 blur-[90px] animate-float-slow pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-start gap-6">
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#F1CB81] to-[#FB923C] text-[#0f172a] font-bold text-sm uppercase tracking-wider mb-4 pulse-dot">The Creative Evolution</span>
              <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-white tracking-tighter">
                Space <span className="text-[#F1CB81] italic">smarter</span>,<br/>not harder.
              </h1>
            </div>
            <p className={`text-lg text-white/80 max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
            </p>

            {/* Search Bar */}
            <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-[32px] flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-xl transition-shadow duration-500 focus-within:shadow-[0_0_0_4px_rgba(241,203,129,0.25)] focus-within:border-[#F1CB81]/50">
                <div className="flex-grow flex items-center px-4">
                  <MagnifyingGlassIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60"
                    placeholder="Describe the aesthetic (e.g. '70s synth-wave desert loft')"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="hidden md:block w-px h-8 bg-white/20"></div>
                <div className="flex-grow flex items-center px-4">
                  <MapPinIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60"
                    placeholder="Location or country"
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn-shine bg-[#F1CB81] text-[#0f172a] px-8 py-4 rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-[#FF6B6B] hover:text-white hover:shadow-lg hover:shadow-[#FF6B6B]/40 transition-all whitespace-nowrap disabled:opacity-50"
                >
                  <MagnifyingGlassIcon className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </form>
              <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
                <span className="text-white/60 text-sm font-bold">Popular:</span>
                <button onClick={() => { setSearchQuery('photography studio'); setSearchLocation('London'); handleSearch(); }} className="text-[#F1CB81] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F1CB81] pulse-dot"></span>#PhotographyStudios
                </button>
                <button onClick={() => { setSearchQuery('music recording'); handleSearch(); }} className="text-[#A78BFA] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] pulse-dot" style={{ animationDelay: '0.6s' }}></span>#MusicRooms
                </button>
                <button onClick={() => { setSearchQuery('podcast space'); handleSearch(); }} className="text-[#34D399] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] pulse-dot" style={{ animationDelay: '1.2s' }}></span>#PodcastSpaces
                </button>
              </div>
            </div>
          </div>

          {/* Floating Chat Messages - No Phone Mockup */}
          <div className="hidden lg:flex flex-col items-center justify-center relative h-[500px]">
            <div className="relative w-full max-w-sm">
              {/* Floating chat bubbles */}
              {phoneMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`absolute chat-bubble animate-float-chat ${
                    msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-owner'
                  }`}
                  style={{
                    animationDelay: `${idx * 1.5}s`,
                    top: `${20 + (idx * 80)}px`,
                    left: msg.type === 'user' ? '40%' : '5%',
                  }}
                >
                  <div className={`px-4 py-2.5 rounded-2xl text-xs font-medium shadow-lg ${
                    msg.type === 'user' 
                      ? 'bg-[#91ADCD] text-white rounded-tr-none' 
                      : 'bg-[#F1CB81] text-[#0f172a] rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {phoneMessages.length === 0 && (
                <div className="flex items-center justify-center gap-1.5 h-full">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header> */}


    {/* ============ HERO SECTION - No Phone Mockup ============ */}
<header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]">
  <div className="absolute inset-0 z-0">
    <img
      src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000"
      alt="Creative studio space"
      className="w-full h-full object-cover opacity-40 animate-kenburns"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/70 to-transparent"></div>
  </div>

  {/* Animated background blobs */}
  <div className="absolute top-16 right-[8%] w-72 h-72 rounded-full bg-[#A78BFA]/20 blur-[100px] animate-float-slow pointer-events-none z-0"></div>
  <div className="absolute bottom-0 left-[2%] w-96 h-96 rounded-full bg-[#34D399]/15 blur-[120px] animate-float-slower pointer-events-none z-0"></div>
  <div className="absolute top-1/3 left-[35%] w-56 h-56 rounded-full bg-[#FF6B6B]/10 blur-[90px] animate-float-slow pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

  <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
    <div className="flex flex-col items-start gap-6">
      <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#F1CB81] to-[#FB923C] text-[#0f172a] font-bold text-sm uppercase tracking-wider mb-4 pulse-dot">The Creative Evolution</span>
        <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-white tracking-tighter">
          Space <span className="text-[#F1CB81] italic">smarter</span>,<br/>not harder.
        </h1>
      </div>
      <p className={`text-lg text-white/80 max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
      </p>

      {/* Search Bar with Date */}
      <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-[32px] flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-xl transition-shadow duration-500 focus-within:shadow-[0_0_0_4px_rgba(241,203,129,0.25)] focus-within:border-[#F1CB81]/50">
          {/* Search Input */}
          <div className="flex-grow flex items-center px-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60"
              placeholder="Describe the aesthetic (e.g. '70s synth-wave desert loft')"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="hidden md:block w-px h-8 bg-white/20"></div>
          
          {/* Location Input */}
          <div className="flex-grow flex items-center px-4">
            <MapPinIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60"
              placeholder="Location or country"
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          
          <div className="hidden md:block w-px h-8 bg-white/20"></div>
          
          {/* Date Input */}
          <div className="flex-grow flex items-center px-4">
            <span className="material-symbols-outlined text-[#F1CB81] mr-3 text-xl">calendar_today</span>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60 [color-scheme:dark]"
              placeholder="Select date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                // Handle date selection
                console.log('Selected date:', e.target.value);
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={isSearching}
            className="btn-shine bg-[#F1CB81] text-[#0f172a] px-8 py-4 rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-[#FF6B6B] hover:text-white hover:shadow-lg hover:shadow-[#FF6B6B]/40 transition-all whitespace-nowrap disabled:opacity-50"
          >
            <MagnifyingGlassIcon className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
          <span className="text-white/60 text-sm font-bold">Popular:</span>
          <button onClick={() => { setSearchQuery('photography studio'); setSearchLocation('London'); handleSearch(); }} className="text-[#F1CB81] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1CB81] pulse-dot"></span>#PhotographyStudios
          </button>
          <button onClick={() => { setSearchQuery('music recording'); handleSearch(); }} className="text-[#A78BFA] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] pulse-dot" style={{ animationDelay: '0.6s' }}></span>#MusicRooms
          </button>
          <button onClick={() => { setSearchQuery('podcast space'); handleSearch(); }} className="text-[#34D399] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] pulse-dot" style={{ animationDelay: '1.2s' }}></span>#PodcastSpaces
          </button>
        </div>
      </div>
    </div>

    {/* Premium Chat Animation - Two Threads */}
    <div className="hidden lg:flex flex-col items-center justify-center relative h-[550px]">
      <div className="relative w-full max-w-sm">
        
        {/* Chat Thread 1 - Studio Owner (Top) */}
        <div className="absolute top-0 left-0 right-0">
          {phoneMessages.slice(0, 2).map((msg, idx) => (
            <div
              key={`thread1-${idx}`}
              className={`absolute chat-bubble-premium ${
                msg.type === 'user' ? 'chat-bubble-user-premium' : 'chat-bubble-owner-premium'
              }`}
              style={{
                animationDelay: `${idx * 2.2}s`,
                top: `${10 + (idx * 70)}px`,
                left: msg.type === 'user' ? '45%' : '5%',
              }}
            >
              <div className={`px-4 py-2.5 rounded-2xl text-xs font-medium shadow-lg ${
                msg.type === 'user' 
                  ? 'bg-[#91ADCD] text-white rounded-tr-none' 
                  : 'bg-[#F1CB81] text-[#0f172a] rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Thread 2 - Production Manager (Bottom) */}
        <div className="absolute top-[180px] left-0 right-0">
          {phoneMessages.slice(0, 2).map((msg, idx) => (
            <div
              key={`thread2-${idx}`}
              className={`absolute chat-bubble-premium ${
                msg.type === 'user' ? 'chat-bubble-user-premium' : 'chat-bubble-owner-premium'
              }`}
              style={{
                animationDelay: `${1.5 + (idx * 2.2)}s`,
                top: `${10 + (idx * 70)}px`,
                left: msg.type === 'user' ? '10%' : '40%',
              }}
            >
              <div className={`px-4 py-2.5 rounded-2xl text-xs font-medium shadow-lg ${
                msg.type === 'user' 
                  ? 'bg-[#A78BFA] text-white rounded-tl-none' 
                  : 'bg-[#34D399] text-white rounded-tr-none'
              }`}>
                {msg.type === 'user' ? "Is the studio free next Thursday?" : "Yes! 10am - 6pm available."}
              </div>
            </div>
          ))}
        </div>

        {/* Loading dots */}
        {phoneMessages.length === 0 && (
          <div className="flex items-center justify-center gap-1.5 h-full">
            <span className="w-2.5 h-2.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        )}

        {/* Decorative connecting lines */}
        <div className="absolute top-[170px] left-[30%] w-[120px] h-[2px] bg-gradient-to-r from-[#F1CB81]/20 to-[#A78BFA]/20 animate-pulse"></div>
        <div className="absolute top-[170px] right-[30%] w-[120px] h-[2px] bg-gradient-to-l from-[#F1CB81]/20 to-[#34D399]/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  </div>
</header>

      {/* Reviews Section */}
      {/* <section className="py-16 md:py-20 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 mb-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F1CB81]/30 text-[#0f172a] font-bold text-xs uppercase tracking-wider">Trusted by Creators</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">
                  What our <span className="text-[#FF6B6B] italic">community</span> says
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F1CB81] to-[#FB923C] border-2 border-white flex items-center justify-center text-xs font-bold text-[#0f172a] shadow-sm hover:-translate-y-1 hover:z-10 transition-transform">★</div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f172a]">4.9 out of 5</p>
                  <p className="text-xs text-slate-500">from 2,000+ reviews</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10"></div>
          <div className="flex gap-4 animate-scroll-right hover:pause-animation pb-4 px-4">
            {[...allReviews, ...allReviews].map((review, i) => (
              <div
                key={`review-${i}`}
                className="min-w-[260px] max-w-[260px] md:min-w-[300px] md:max-w-[300px] bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-[#F1CB81]/60 hover:shadow-xl hover:shadow-[#F1CB81]/10 hover:-translate-y-1 transition-all duration-300 flex-shrink-0 flex flex-col"
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className="material-symbols-outlined text-[#F1CB81] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-[#0f172a] text-xs leading-relaxed mb-4 flex-grow line-clamp-4">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#F1CB81]/20 ring-2 ring-transparent hover:ring-[#F1CB81]/50 transition-all">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#0f172a] bg-[#F1CB81]/30">
                        {review.initials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-[#0f172a] truncate">{review.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{review.role}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#F1CB81] text-base shrink-0">format_quote</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}



{/* Reviews Section - Classic Black & White */}
<section className="py-12 md:py-16 bg-white overflow-hidden">
  <div className="max-w-[1440px] mx-auto px-4 md:px-16 mb-8">
    <Reveal>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 border border-[#0f172a]/20 text-[#0f172a] font-mono text-[10px] uppercase tracking-wider mb-2">
            Trusted by Creators
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] font-mono">
            What our <span className="text-[#0f172a] border-b-2 border-[#0f172a]">community</span> says
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-7 h-7 rounded-full border border-[#0f172a]/20 bg-white flex items-center justify-center text-[8px] font-bold text-[#0f172a] shadow-sm hover:-translate-y-1 hover:z-10 transition-transform font-mono">
                ★
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-bold text-[#0f172a] font-mono">4.9 / 5.0</p>
            <p className="text-[10px] text-[#0f172a]/50 font-mono">from 2,000+ reviews</p>
          </div>
        </div>
      </div>
    </Reveal>
  </div>

  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10"></div>
    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10"></div>
    <div className="flex gap-4 animate-scroll-right hover:pause-animation pb-4 px-4">
      {[...allReviews, ...allReviews].map((review, i) => (
        <div
          key={`review-${i}`}
          className="min-w-[220px] max-w-[220px] md:min-w-[260px] md:max-w-[260px] bg-white rounded-xl p-4 border border-[#0f172a]/10 hover:border-[#0f172a]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex-shrink-0 flex flex-col animate-card"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(5)].map((_, s) => (
              <span key={s} className="text-[#0f172a] text-xs font-mono">★</span>
            ))}
          </div>
          
          <p className="text-[#0f172a]/80 text-[11px] leading-relaxed mb-3 flex-grow line-clamp-3 font-mono">
            "{review.text}"
          </p>
          
          <div className="flex items-center gap-2.5 pt-2.5 border-t border-[#0f172a]/10">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#0f172a]/20 bg-[#0f172a]/5 transition-all hover:border-[#0f172a]/40">
              {review.avatar ? (
                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover grayscale" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-[#0f172a]/60 font-mono">
                  {review.initials}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[11px] text-[#0f172a] truncate font-mono">{review.name}</p>
              <p className="text-[9px] text-[#0f172a]/40 truncate font-mono">{review.role}</p>
            </div>
            <span className="text-[#0f172a]/20 text-sm font-mono">"</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      
      {/* ============ EVERYWHERE SECTION - 3 ROWS ============ */}
      <section className="py-20 md:py-24 bg-[#91ADCD]/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#0f172a]">
                  Everywhere your <span className="text-[#FF6B6B]">audience</span> is.
                </h2>
                <p className="text-base md:text-lg text-slate-600">
                  Turn comments into sales. Book spaces that inspire. Scale your brand.
                </p>
              </div>
              <Link href="/spaces" className="group flex items-center gap-2 text-[#0f172a] font-bold text-sm uppercase shrink-0 border-2 border-[#0f172a] px-5 py-2.5 rounded-full hover:bg-[#0f172a] hover:text-white hover:shadow-lg transition-all duration-300">
                Explore all <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </Reveal>

          {/* ROW 1 */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            
            {/* Card 1: IMAGE on LEFT taking 2/3 */}
            <Reveal className="md:col-span-2">
              <div className="group relative rounded-[32px] overflow-hidden h-[340px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                <img 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800" 
                  alt="ManyChat" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-[#FF6B6B]/40 rounded-[32px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FF6B6B] text-white font-bold text-xs mb-3 uppercase">ManyChat</span>
                  <h4 className="text-white text-2xl md:text-3xl font-bold mb-2">Turn comments into sales</h4>
                  <p className="text-white/70 text-sm max-w-md">"How much is this?" Instant reply. Boom — wallets open, money lands.</p>
                  <p className="text-white/40 text-xs mt-2">Auto-reply on every comment</p>
                </div>
              </div>
            </Reveal>

            {/* Card 2: MIDDLE - Text + Image together (purple theme) */}
            <Reveal delay={120}>
              <div className="group relative rounded-[32px] overflow-hidden h-[340px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#A78BFA] to-[#7c5cbf]">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                  <img 
                    className="w-full h-full object-cover rounded-full blur-sm" 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
                    alt="Scouty" 
                  />
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-white/30 rounded-[32px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-3 uppercase backdrop-blur-sm">Scouty</span>
                  <h4 className="text-white text-2xl font-bold mb-2">Booked on Scouty</h4>
                  <p className="text-white/80 text-sm">See what production teams are creating in locations booked through Scouty</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {['The New Yorker', 'Kodak', 'Haim'].map((brand) => (
                      <span key={brand} className="text-[10px] bg-white/20 text-white/90 px-2.5 py-1 rounded-full backdrop-blur-sm">{brand}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ROW 2 */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            
            {/* Card 3: LEFT - Text only (1/3) - Green theme */}
            <Reveal delay={240}>
              <div className="group relative rounded-[32px] overflow-hidden h-[340px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#34D399] to-[#1fa86f]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-white/30 rounded-[32px] pointer-events-none"></div>
                <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-3 uppercase backdrop-blur-sm">Integrated</span>
                  <h4 className="text-white text-2xl font-bold mb-2">Everywhere your audience is</h4>
                  <p className="text-white/80 text-sm">Connect, create, and convert across all platforms.</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-white/60 text-xs">manychat.com</span>
                    <span className="w-px h-3 bg-white/30"></span>
                    <span className="text-white/60 text-xs">scouty.com</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 4: MIDDLE - Text + Image (orange/coral theme) */}
            <Reveal delay={360}>
              <div className="group relative rounded-[32px] overflow-hidden h-[340px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#FF8A5C] to-[#e06a3a]">
                <div className="absolute bottom-0 right-0 w-40 h-40 opacity-20">
                  <img 
                    className="w-full h-full object-cover rounded-full blur-sm" 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
                    alt="Production" 
                  />
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-white/30 rounded-[32px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-3 uppercase backdrop-blur-sm">Production</span>
                  <h4 className="text-white text-2xl font-bold mb-2">Visual Arts Spaces</h4>
                  <p className="text-white/80 text-sm">Natural light lofts and cyc walls for photo & film.</p>
                  <p className="text-white/60 text-xs mt-2">The New Yorker • Kodak Apparel</p>
                </div>
              </div>
            </Reveal>

            {/* Card 5: IMAGE on RIGHT taking 2/3 (yellow theme) */}
            <Reveal delay={480} className="md:col-span-2 md:col-start-3">
              <div className="group relative rounded-[32px] overflow-hidden h-[340px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                <img 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
                  alt="Creative" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-[#F1CB81]/40 rounded-[32px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F1CB81] text-[#0f172a] font-bold text-xs mb-3 uppercase">Creative Hubs</span>
                  <h4 className="text-white text-2xl md:text-3xl font-bold mb-2">Design & Pop-ups</h4>
                  <p className="text-white/70 text-sm">Dynamic spaces for teams to create, collaborate, and launch.</p>
                  <p className="text-white/40 text-xs mt-2">Booked through Scouty</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ROW 3 */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Card 6: LEFT - IMAGE (blue/indigo theme) */}
            <Reveal delay={600}>
              <div className="group relative rounded-[32px] overflow-hidden h-[340px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                <img 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                  alt="Visual Arts" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-[#A78BFA]/40 rounded-[32px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#A78BFA] text-white font-bold text-xs mb-3 uppercase">Photo & Film</span>
                  <h4 className="text-white text-2xl md:text-3xl font-bold mb-2">Production-Ready Studios</h4>
                  <p className="text-white/70 text-sm">Acoustically perfect environments for music, podcasts, and more.</p>
                  <p className="text-white/40 text-xs mt-2">Booked through Scouty</p>
                </div>
              </div>
            </Reveal>

            {/* Card 7: MIDDLE - Text only (pink/rose theme) */}
            <Reveal delay={720}>
              <div className="group relative rounded-[32px] overflow-hidden h-[340px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#F472B6] to-[#FB7185]">
                <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-white/30 rounded-[32px] pointer-events-none"></div>
                <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-3 uppercase backdrop-blur-sm">Community</span>
                  <h4 className="text-white text-2xl font-bold mb-2">Join 1M+ Creators</h4>
                  <p className="text-white/80 text-sm">Connect with the world's largest creative community.</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-white/60 text-xs">Global network</span>
                    <span className="w-px h-3 bg-white/30"></span>
                    <span className="text-white/60 text-xs">24/7 support</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 8: RIGHT - Text + Image (teal/indigo theme) */}
            <Reveal delay={840}>
              <div className="group relative rounded-[32px] overflow-hidden h-[340px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#2DD4BF] to-[#14B8A6]">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                  <img 
                    className="w-full h-full object-cover rounded-full blur-sm" 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200" 
                    alt="Community" 
                  />
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-white/30 rounded-[32px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-3 uppercase backdrop-blur-sm">Innovation</span>
                  <h4 className="text-white text-2xl font-bold mb-2">AI-Powered Matching</h4>
                  <p className="text-white/80 text-sm">Smart algorithms that find the perfect space for you.</p>
                  <p className="text-white/60 text-xs mt-2">Trusted by 10,000+ studios</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bottom CTA Row */}
          <Reveal delay={960} className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <div className="group relative rounded-[32px] overflow-hidden bg-[#0f172a] shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FF6B6B]/20 flex items-center justify-center text-2xl">★</div>
                    <div>
                      <p className="text-white font-bold">Ready to scale your brand?</p>
                      <p className="text-white/40 text-sm">Join thousands of creators using ManyChat and Scouty</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 rounded-full bg-[#FF6B6B] text-white font-bold text-sm hover:bg-[#ff5252] transition-all duration-300 shadow-lg shadow-[#FF6B6B]/20">
                      Get started →
                    </button>
                    <button className="px-6 py-2.5 rounded-full border border-white/20 text-white/60 font-bold text-sm hover:bg-white/10 transition-all duration-300">
                      Learn more
                    </button>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-2 ring-white/10 rounded-[32px] pointer-events-none"></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The Crew Collective */}
      <section className="py-20 md:py-24 bg-[#F1CB81] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f172a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1 rounded-full bg-[#0f172a] text-[#F1CB81] font-bold text-sm uppercase tracking-wider mb-4">The Crew Collective</span>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#0f172a]">Hire the <span className="italic text-[#FF6B6B]">pros</span> who make it happen.</h2>
                <p className="text-base md:text-lg text-[#0f172a]/70">Don't just book a space--build your dream team.</p>
              </div>
              <Link href="/services" className="group flex items-center gap-2 text-[#0f172a] font-bold text-sm uppercase shrink-0 border-2 border-[#0f172a] px-6 py-3 rounded-full hover:bg-[#0f172a] hover:text-[#F1CB81] hover:shadow-lg transition-all duration-300">
                Browse all pros <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Photographers', subtitle: 'Editorial & Commercial', image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=600', stat: '2,400+ available', accent: '#0f172a', badge: '#0f172a' },
              { title: 'Videographers', subtitle: 'DPs & Drone Pilots', image: 'https://images.unsplash.com/photo-1585646794396-3c34d6f3ea4e?auto=format&fit=crop&q=80&w=600', stat: '1,800+ available', accent: '#FF6B6B', badge: '#FF6B6B' },
              { title: 'HMU Artists', subtitle: 'Beauty & SFX', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600', stat: '950+ available', accent: '#A78BFA', badge: '#A78BFA' },
              { title: 'Studio Support', subtitle: 'PAs & Set Builders', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600', stat: '1,200+ available', accent: '#34D399', badge: '#34D399' },
            ].map((service, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4] bg-white shadow-md group-hover:shadow-2xl transition-shadow duration-500">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      <p className="text-white/90 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{service.subtitle}</p>
                      <p className="text-sm font-bold mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200 text-[#F1CB81]">{service.stat}</p>
                    </div>
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                      <span className="inline-block px-3 py-1 rounded-full font-bold text-xs uppercase" style={{ backgroundColor: service.badge, color: '#fff' }}>{service.title.split(' ')[0]}</span>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                      <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-[#0f172a] text-lg">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-[#0f172a] group-hover:text-[#FF6B6B] transition-colors">{service.title}</h4>
                    <p className="text-sm text-[#0f172a]/60">{service.subtitle}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t-2 border-[#0f172a]/20 pt-8">
              {[
                { value: 6350, suffix: '+', label: 'Vetted Professionals', color: '#FF6B6B' },
                { value: 98, suffix: '%', label: 'Client Satisfaction', color: '#34D399' },
                { value: 48, suffix: 'h', label: 'Avg. Response Time', color: '#91ADCD' },
                { value: 50, suffix: '+', label: 'Creative Categories', color: '#A78BFA' },
              ].map((stat, i) => (
                <div key={i} className="text-center hover:-translate-y-1 transition-transform duration-300">
                  <p className="text-2xl md:text-3xl font-extrabold" style={{ color: stat.color }}>
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-[#0f172a]/70 font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-[#FF6B6B]/10 to-[#A78BFA]/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal>
              <div className="bg-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center border-2 border-slate-200 h-full">
                <span className="text-sm font-bold text-slate-400 uppercase mb-8">Before ManyRooms</span>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#0f172a]">All work<br/>and no play.</h2>
                <ul className="w-full space-y-6 text-left">
                  {['Manual booking coordination.', 'Hidden studio fees.', 'Inconsistent space matching.', 'Slow creative output.'].map((item) => (
                    <li key={item} className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <span className="text-lg font-bold text-[#0f172a]">{item}</span>
                      <span className="material-symbols-outlined text-[#FF6B6B]">close</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-8">
                  <span className="material-symbols-outlined text-[#F1CB81] text-6xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                </div>
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#A78BFA]/10 blur-3xl animate-float-slow pointer-events-none"></div>
                <span className="text-sm font-bold text-[#F1CB81] uppercase mb-8 relative z-10">After ManyRooms</span>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white relative z-10">Less grind<br/>and more pay.</h2>
                <ul className="w-full space-y-6 text-left relative z-10">
                  {['Auto-pilot studio management.', 'Transparent fixed pricing.', 'Smart space matching.', '24/7 revenue generation.'].map((item) => (
                    <li key={item} className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-lg font-bold">{item}</span>
                      <span className="material-symbols-outlined text-[#34D399]">check_circle</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="btn-shine mt-12 w-full bg-[#F1CB81] text-[#0f172a] py-5 rounded-2xl font-extrabold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-[#F1CB81]/30 transition-all duration-300 relative z-10 text-center">Get Started for Free</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Steps */}
      {/* <section className="py-20 md:py-24 bg-white">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#0f172a]">Get up and running in <span className="italic text-[#FF6B6B]">3 simple steps</span>.</h2>
          </div>
        </Reveal>
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {[
            { icon: 'add_photo_alternate', title: 'List your space', desc: 'Upload photos and define your hours. Takes less than 5 minutes.', bg: 'bg-[#91ADCD]/30', color: '#91ADCD' },
            { icon: 'smart_toy', title: 'Automate bookings', desc: 'Let our AI handle inquiries and scheduling while you create.', bg: 'bg-[#F1CB81]', color: '#0f172a' },
            { icon: 'account_balance_wallet', title: 'Collect revenue', desc: 'Instant payouts directly to your account. No chasing invoices.', bg: 'bg-[#A78BFA]/30', color: '#A78BFA' },
          ].map((step, i) => (
            <Reveal key={i} delay={i * 130}>
              <div className="flex flex-col items-center gap-5 text-center group">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${step.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-md group-hover:shadow-xl`}>
                  <span className="material-symbols-outlined text-3xl md:text-4xl" style={{ color: step.color, fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0f172a]">{step.title}</h3>
                <p className="text-base md:text-lg text-slate-600 max-w-xs">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section> */}


{/* Why ManyRooms - 3 Steps Section */}
<section className="py-20 md:py-24 bg-[#F1CB81] relative overflow-hidden">
  {/* Background Image with Overlay */}
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-[#F1CB81]/85 mix-blend-multiply"></div>
    <img 
      src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=2000" 
      alt="Woman looking forward confidently" 
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* Decorative elements */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B6B]/10 rounded-full blur-3xl animate-float-slow pointer-events-none z-0"></div>
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0f172a]/5 rounded-full blur-3xl animate-float-slower pointer-events-none z-0"></div>
  
  <div className="max-w-[1440px] mx-auto px-4 md:px-16 relative z-10">
    <Reveal>
      <div className="text-center mb-12 md:mb-16">
        <span className="inline-block px-4 py-1 rounded-full bg-[#0f172a] text-[#F1CB81] font-bold text-xs uppercase tracking-wider mb-4">
          Why ManyRooms
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#0f172a]">
          Get up and running in <span className="italic text-[#FF6B6B]">3 simple steps</span>.
        </h2>
        <p className="text-base md:text-lg text-[#0f172a]/70 max-w-2xl mx-auto">
          The most creative spaces, handled with care, no hidden costs.
        </p>
      </div>
    </Reveal>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      {[
        { 
          icon: 'search', 
          title: 'Search & Book', 
          desc: 'We host the most sought after spaces in your city. Find and book the most creative spaces in the world.',
          color: '#FF6B6B',
          delay: 0
        },
        { 
          icon: 'handshake', 
          title: 'We handle the hard part', 
          desc: 'No need to chase studios for availability. LIVE availability of all studios and creatives. Insurance and comprehensive support included.',
          color: '#A78BFA',
          delay: 130
        },
        { 
          icon: 'payments', 
          title: 'No hidden costs', 
          desc: 'What you see is what you pay! Complete cost breakdown including add-ons, extra time and site fees. Budgeting made easy.',
          color: '#34D399',
          delay: 260
        },
      ].map((step, i) => (
        <Reveal key={i} delay={step.delay}>
          <div className="group relative bg-white/90 backdrop-blur-sm rounded-[32px] p-8 md:p-10 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-white/20 h-full flex flex-col items-start">
            {/* Icon Circle */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: step.color + '20' }}>
              <span className="material-symbols-outlined text-3xl" style={{ color: step.color, fontVariationSettings: "'FILL' 1" }}>
                {step.icon}
              </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-extrabold text-[#0f172a] mb-3 group-hover:text-[#FF6B6B] transition-colors">
              {step.title}
            </h3>
            <p className="text-[#0f172a]/70 text-sm md:text-base leading-relaxed">
              {step.desc}
            </p>
            
            {/* Step number badge */}
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[#0f172a] text-[#F1CB81] text-sm font-bold flex items-center justify-center shadow-lg">
              {String(i + 1).padStart(2, '0')}
            </div>
          </div>
        </Reveal>
      ))}
    </div>

    {/* Bottom CTA */}
    <Reveal delay={400}>
      <div className="mt-12 text-center">
        <Link href="/spaces" className="inline-flex items-center gap-3 bg-[#0f172a] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#FF6B6B] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF6B6B]/30 transition-all duration-300">
          Start searching now
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </div>
    </Reveal>
  </div>
</section>

      

      {/* Featured Studios */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-[#F1CB81]/20 to-[#91ADCD]/20 overflow-hidden">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex justify-between items-end mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">Featured Studios <span className="text-[#0f172a] bg-[#F1CB81] px-3 py-1 rounded-lg text-sm">New This Week</span></h2>
            <div className="flex gap-2">
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:-translate-x-0.5 transition-all">
                <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-[#0f172a]" />
              </button>
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:translate-x-0.5 transition-all">
                <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-[#0f172a]" />
              </button>
            </div>
          </div>
        </Reveal>
        <div className="flex gap-5 px-4 md:px-16 overflow-x-auto pb-4 scrollbar-hide">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[300px] md:min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-md flex-shrink-0">
                <div className="h-52 md:h-64 skeleton-shimmer"></div>
                <div className="p-5 md:p-6 space-y-3">
                  <div className="h-5 w-2/3 rounded-md skeleton-shimmer"></div>
                  <div className="h-4 w-1/2 rounded-md skeleton-shimmer"></div>
                  <div className="flex gap-2 pt-1">
                    <div className="h-6 w-16 rounded-md skeleton-shimmer"></div>
                    <div className="h-6 w-16 rounded-md skeleton-shimmer"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            featuredSpaces.map((space, i) => {
              const coverImage = getFirstImage(space.images);
              return (
                <Reveal key={space.id} delay={i * 90} className="min-w-[300px] md:min-w-[380px] flex-shrink-0 snap-start">
                  <Link href={`/spaces/${space.id}`} className="group block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1.5 transition-all duration-400">
                    <div className="h-52 md:h-64 relative overflow-hidden">
                      {coverImage ? (
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverImage} alt={space.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100"><span className="material-symbols-outlined text-4xl text-slate-300">image</span></div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm group-hover:scale-105 transition-transform">
                        <StarIcon className="w-4 h-4 text-[#F1CB81] fill-current" /><span className="font-bold text-sm text-[#0f172a]">4.9</span>
                      </div>
                    </div>
                    <div className="p-5 md:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="text-lg md:text-xl font-bold text-[#0f172a] group-hover:text-[#FF6B6B] transition-colors">{space.name}</h5>
                        <p className="font-bold text-[#FF6B6B] text-sm">${space.hourly_rate}/hr</p>
                      </div>
                      <p className="text-slate-500 text-sm mb-4 flex items-center gap-1"><MapPinIcon className="w-4 h-4" />{space.city || 'Location'}{space.state ? `, ${space.state}` : ''}</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-[#F1CB81]/20 rounded-md text-xs font-bold text-[#0f172a]">#Creative</span>
                        <span className="px-2 py-1 bg-[#91ADCD]/20 rounded-md text-xs font-bold text-[#0f172a]">#Studio</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })
          )}
        </div>
      </section>

      <Footer />
      <Chatbot />

      <style jsx>{`
        @keyframes messageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-message { animation: messageIn 0.4s ease-out forwards; }
        .chat-container::-webkit-scrollbar { display: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-right { animation: scrollRight 50s linear infinite; }
        .hover\\:pause-animation:hover { animation-play-state: paused; }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-visible { opacity: 1; transform: translateY(0); }

        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -30px); }
        }
        @keyframes floatSlower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(25px); }
        }
        .animate-float-slow { animation: floatSlow 9s ease-in-out infinite; }
        .animate-float-slower { animation: floatSlower 12s ease-in-out infinite; }

        @keyframes floatPhone {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        .animate-float-phone { animation: floatPhone 6s ease-in-out infinite; }

        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        .animate-kenburns { animation: kenburns 22s ease-in-out infinite alternate; }

        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(241, 203, 129, 0.55); }
          70% { box-shadow: 0 0 0 10px rgba(241, 203, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(241, 203, 129, 0); }
        }
        .pulse-dot { animation: pulseRing 2.2s infinite; border-radius: 9999px; }

        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 40%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: translateX(-150%) skewX(-20deg);
        }
        .btn-shine:hover::after {
          animation: shine 0.9s ease forwards;
        }
        @keyframes shine {
          to { transform: translateX(280%) skewX(-20deg); }
        }

        .skeleton-shimmer {
          background: linear-gradient(90deg, rgba(241,203,129,0.18) 25%, rgba(241,203,129,0.38) 37%, rgba(241,203,129,0.18) 63%);
          background-size: 400% 100%;
          animation: shimmerMove 1.4s ease infinite;
        }
        @keyframes shimmerMove {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        /* TV Switch-On Effect */
        .tv-switch {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        .tv-screen {
          position: relative;
          background: #0f172a;
          border-radius: 20px;
          padding: 40px;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 4px solid #1e293b;
          box-shadow: 0 0 60px rgba(241, 203, 129, 0.15), inset 0 0 60px rgba(241, 203, 129, 0.05);
          animation: tvOn 0.8s ease-out;
        }
        .tv-scanline {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          );
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
        .tv-static {
          position: absolute;
          inset: 0;
          background: repeating-conic-gradient(
            rgba(255, 255, 255, 0.02) 0% 25%,
            transparent 0% 50%
          );
          background-size: 4px 4px;
          animation: staticNoise 0.5s steps(2) infinite;
          opacity: 0.3;
          pointer-events: none;
        }
        .tv-content {
          position: relative;
          z-index: 2;
          text-align: center;
          animation: contentFade 1.2s ease-out;
        }

        @keyframes tvOn {
          0% { transform: scale(0.8); opacity: 0; filter: brightness(0) blur(10px); }
          30% { transform: scale(1.02); opacity: 1; filter: brightness(0.3) blur(3px); }
          50% { filter: brightness(1.5) blur(0px); }
          70% { filter: brightness(0.7); }
          100% { transform: scale(1); opacity: 1; filter: brightness(1) blur(0px); }
        }
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        @keyframes staticNoise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2px, -1px); }
          20% { transform: translate(2px, 1px); }
          30% { transform: translate(-1px, 2px); }
          40% { transform: translate(1px, -2px); }
          50% { transform: translate(-3px, 1px); }
          60% { transform: translate(3px, -1px); }
          70% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 2px); }
          90% { transform: translate(-2px, 1px); }
        }
        @keyframes contentFade {
          0% { opacity: 0; transform: scale(0.9); }
          50% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Floating Chat Bubbles */
        .chat-bubble {
          position: absolute;
          animation: floatChat 12s ease-in-out infinite;
          opacity: 0;
        }
        .chat-bubble-user {
          animation-delay: 0s;
        }
        .chat-bubble-owner {
          animation-delay: 1.5s;
        }

        @keyframes floatChat {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          85% { opacity: 1; transform: translateY(0) scale(1); }
          95% { opacity: 0; transform: translateY(-20px) scale(0.9); }
          100% { opacity: 0; transform: translateY(-30px) scale(0.8); }
        }

        /* Premium Chat Bubble Animations */
@keyframes slideUpChat {
  0% { 
    opacity: 0; 
    transform: translateY(30px) scale(0.85) rotate(-2deg);
  }
  15% { 
    opacity: 1; 
    transform: translateY(-5px) scale(1.02) rotate(0.5deg);
  }
  25% { 
    transform: translateY(2px) scale(0.98) rotate(0deg);
  }
  35% { 
    transform: translateY(0) scale(1) rotate(0deg);
  }
  85% { 
    opacity: 1; 
    transform: translateY(0) scale(1) rotate(0deg);
  }
  95% { 
    opacity: 0.5; 
    transform: translateY(-10px) scale(0.95);
  }
  100% { 
    opacity: 0; 
    transform: translateY(-20px) scale(0.9);
  }
}

.chat-bubble-premium {
  position: absolute;
  animation: slideUpChat 8s ease-in-out infinite;
  opacity: 0;
}

.chat-bubble-user-premium {
  animation-delay: 0s;
}

.chat-bubble-owner-premium {
  animation-delay: 1.2s;
}

/* For date input styling */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.8);
  cursor: pointer;
}
input[type="date"]::-webkit-datetime-edit {
  color: white;
}
input[type="date"]::-webkit-datetime-edit-fields-wrapper {
  color: white;
}
input[type="date"]::-webkit-datetime-edit-text {
  color: rgba(255,255,255,0.5);
}
input[type="date"]::-webkit-datetime-edit-month-field {
  color: white;
}
input[type="date"]::-webkit-datetime-edit-day-field {
  color: white;
}
input[type="date"]::-webkit-datetime-edit-year-field {
  color: white;
}

        @media (prefers-reduced-motion: reduce) {
          .reveal, .animate-float-slow, .animate-float-slower, .animate-float-phone,
          .animate-kenburns, .pulse-dot, .btn-shine::after, .skeleton-shimmer,
          .animate-scroll-right, .animate-message, .tv-screen, .tv-scanline,
          .tv-static, .chat-bubble {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}






// // app/page.tsx ..
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   Bars3Icon,
//   XMarkIcon,
//   StarIcon,
//   MapPinIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';
// import './home.css';

// // Brand Colors - Fresh Clean Palette
// const brand = {
//   yellow: '#F1CB81',
//   blue: '#91ADCD',
//   coral: '#FF6B6B',
//   dark: '#0f172a',
//   purple: '#A78BFA',
//   green: '#34D399',
//   orange: '#FB923C',
//   pink: '#F472B6',
// };

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
// }

// interface ChatMessage {
//   text: string;
//   type: 'user' | 'owner';
// }

// function Reveal({
//   children,
//   delay = 0,
//   className = '',
// }: {
//   children: React.ReactNode;
//   delay?: number;
//   className?: string;
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div
//       ref={ref}
//       className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
//       style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
//     >
//       {children}
//     </div>
//   );
// }

// function CountUp({
//   end,
//   duration = 1800,
//   suffix = '',
// }: {
//   end: number;
//   duration?: number;
//   suffix?: string;
// }) {
//   const ref = useRef<HTMLSpanElement>(null);
//   const [value, setValue] = useState(0);
//   const startedRef = useRef(false);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !startedRef.current) {
//           startedRef.current = true;
//           const startTime = performance.now();
//           const animate = (now: number) => {
//             const progress = Math.min((now - startTime) / duration, 1);
//             const eased = 1 - Math.pow(1 - progress, 3);
//             setValue(Math.floor(eased * end));
//             if (progress < 1) requestAnimationFrame(animate);
//             else setValue(end);
//           };
//           requestAnimationFrame(animate);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.4 }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [end, duration]);

//   return (
//     <span ref={ref}>
//       {value.toLocaleString()}
//       {suffix}
//     </span>
//   );
// }

// export default function HomePage() {
//   const router = useRouter();
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [phoneMessages, setPhoneMessages] = useState<ChatMessage[]>([]);
//   const [scrolled, setScrolled] = useState(false);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchLocation, setSearchLocation] = useState('');
//   const [isSearching, setIsSearching] = useState(false);

//   const chatSequence: ChatMessage[] = [
//     { text: "Hi! Is the studio available for a 4-hour shoot this Friday?", type: "user" },
//     { text: "Hey! Yes, we have a slot from 2 PM - 6 PM. Want me to book you in?", type: "owner" },
//     { text: "Perfect, sending the request now!", type: "user" },
//   ];

//   const allReviews = [
//     { text: "ManyRooms transformed how we book studio spaces. The search is incredibly accurate!", name: "Sarah Chen", role: "Creative Director, Vogue", initials: "SC", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
//     { text: "I've saved countless hours on booking coordination. The automation is a game-changer.", name: "Marcus Thorne", role: "Editorial Photographer", initials: "MT", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
//     { text: "The quality of studios on this platform is unmatched. Every space exceeds expectations.", name: "Elena Rodriguez", role: "Independent Filmmaker", initials: "ER", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" },
//     { text: "Finally, a platform that understands creative professionals. Booking is seamless.", name: "James Wilson", role: "Art Director, Nike", initials: "JW", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
//     { text: "From podcast studios to photo lofts, ManyRooms has every space we need.", name: "Amara Okafor", role: "Content Creator", initials: "AO", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
//     { text: "The matching is scary good. Found exactly the industrial loft we needed.", name: "David Park", role: "Creative Lead, Adobe", initials: "DP", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
//     { text: "We've increased studio bookings by 300% since listing on ManyRooms.", name: "Lisa Thompson", role: "Studio Owner, DTLA", initials: "LT", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
//     { text: "Transparent pricing and instant confirmations make my job so much easier!", name: "Alex Rivera", role: "Production Manager", initials: "AR", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" },
//     { text: "I love messaging studio owners directly. No more endless email chains!", name: "Nina Patel", role: "Fashion Photographer", initials: "NP", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150" },
//     { text: "ManyRooms is essential to our creative workflow. Can't imagine working without it.", name: "Chris Mendoza", role: "Music Producer", initials: "CM", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=150" },
//     { text: "The curated categories are spot on. Found a brutalist loft perfect for our shoot.", name: "Keisha Williams", role: "Brand Strategist", initials: "KW", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150" },
//     { text: "As a studio owner, the dashboard gives me complete control. So smooth.", name: "Robert Kim", role: "Studio Owner, Brooklyn", initials: "RK", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//       const docHeight = document.documentElement.scrollHeight - window.innerHeight;
//       setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
//     let timeoutIds: NodeJS.Timeout[] = [];
//     const animateMessages = async () => {
//       setPhoneMessages([]);
//       for (const msg of chatSequence) {
//         if (!isMounted) return;
//         await new Promise<void>(resolve => {
//           const id = setTimeout(() => { setPhoneMessages(prev => [...prev, msg]); resolve(); }, 1500);
//           timeoutIds.push(id);
//         });
//       }
//       if (isMounted) {
//         const id = setTimeout(() => animateMessages(), 3500);
//         timeoutIds.push(id);
//       }
//     };
//     animateMessages();
//     return () => { isMounted = false; timeoutIds.forEach(clearTimeout); };
//   }, []);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
//     }
//   }, [phoneMessages]);

//   useEffect(() => { fetchApprovedStudios(); setTimeout(() => setIsVisible(true), 100); }, []);

//   useEffect(() => {
//     document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
//     return () => { document.body.style.overflow = 'unset'; };
//   }, [isMobileMenuOpen]);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.from('studios').select('*').eq('status', 'approved').limit(6);
//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) { console.error('Error fetching studios:', error); }
//     finally { setLoading(false); }
//   };

//   const getFirstImage = (images: string[]) => (!images || images.length === 0 ? null : images[0]);

//   const handleSearch = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (!searchQuery.trim() && !searchLocation.trim()) return;
//     setIsSearching(true);
//     try {
//       let query = supabase.from('studios').select('*').eq('status', 'approved');
//       if (searchQuery.trim()) {
//         query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%,city.ilike.%${searchQuery.trim()}%`);
//       }
//       if (searchLocation.trim()) {
//         const locLower = searchLocation.trim().toLowerCase();
//         query = query.or(`city.ilike.%${locLower}%,state.ilike.%${locLower}%,country.ilike.%${locLower}%`);
//       }
//       query = query.limit(20);
//       const { data, error } = await query;
//       if (error) throw error;
//       const params = new URLSearchParams();
//       if (searchQuery.trim()) params.set('q', searchQuery.trim());
//       if (searchLocation.trim()) params.set('location', searchLocation.trim());
//       router.push(`/spaces?${params.toString()}`);
//     } catch (error) {
//       console.error('Search error:', error);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   return (
//     <div className="home-page bg-white text-[#0f172a] overflow-x-hidden">

//       {/* Scroll progress bar */}
//       <div className="fixed top-0 left-0 w-full h-[3px] z-[70] pointer-events-none">
//         <div
//           className="h-full bg-gradient-to-r from-[#F1CB81] via-[#FF6B6B] to-[#A78BFA] transition-[width] duration-150 ease-out"
//           style={{ width: `${scrollProgress}%` }}
//         />
//       </div>

//       {/* Navigation */}
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'bg-transparent'
//       }`}>
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <span className={`text-xl md:text-2xl font-extrabold tracking-tighter transition-all duration-300 group-hover:tracking-tight inline-block ${scrolled ? 'text-[#0f172a]' : 'text-white'}`}>
//                 Many<span className="text-[#F1CB81] inline-block transition-transform duration-300 group-hover:rotate-6">Rooms</span>
//               </span>
//             </Link>
//             <div className="hidden lg:flex gap-6 items-center">
//               {['Marketplace', 'Studios', 'Spaces', 'Journal', 'Services'].map((item) => (
//                 <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`}
//                   className={`relative py-1 font-bold text-sm transition-colors group/link ${
//                     scrolled ? 'text-slate-600 hover:text-[#0f172a]' : 'text-white/80 hover:text-white'
//                   }`}
//                 >
//                   {item}
//                   <span className={`absolute -bottom-0.5 left-0 h-[2px] bg-current transition-all duration-300 ${
//                     item === 'Marketplace' ? 'w-full' : 'w-0 group-hover/link:w-full'
//                   }`}></span>
//                 </Link>
//               ))}
//             </div>
//           </div>
//           <div className="flex items-center gap-3 md:gap-4">
//             <Link href="/signup?role=owner" className="btn-shine hidden md:block px-6 py-2 bg-[#F1CB81] text-[#0f172a] font-bold text-sm rounded-full hover:bg-[#FF6B6B] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF6B6B]/30 transition-all duration-300">List Your Space</Link>
//             <div className="hidden md:flex items-center gap-3">
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-125 active:scale-95 transition-transform duration-200 ${scrolled ? 'text-[#0f172a]' : 'text-white/80'}`}>favorite</span>
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-125 active:scale-95 transition-transform duration-200 ${scrolled ? 'text-[#0f172a]' : 'text-white/80'}`}>account_circle</span>
//             </div>
//             <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 ${scrolled ? 'hover:bg-slate-100 text-[#0f172a]' : 'text-white hover:bg-white/10'}`}>
//               <Bars3Icon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
//         <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-[#0f172a]">ManyRooms</span>
//               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-transform duration-200 hover:rotate-90"><XMarkIcon className="w-6 h-6 text-[#0f172a]" /></button>
//             </div>
//             <nav className="flex flex-col gap-6">
//               {['Marketplace', 'Studios', 'Journal'].map((item, i) => (
//                 <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`}
//                   className="text-base font-semibold text-[#0f172a] hover:text-[#FF6B6B] hover:translate-x-1 transition-all duration-200"
//                   style={{ transitionDelay: isMobileMenuOpen ? `${i * 40}ms` : '0ms' }}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >{item}</Link>
//               ))}
//               <div className="border-t border-slate-200 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-base font-semibold text-[#0f172a] hover:text-[#FF6B6B] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Your Space</Link>
//                 <Link href="/login" className="block text-base font-semibold text-[#0f172a] hover:text-[#FF6B6B] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-base font-semibold text-[#0f172a] hover:text-[#FF6B6B] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81]">
//         <div className="absolute inset-0 z-0">
//           <img
//             src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000"
//             alt="Creative studio space"
//             className="w-full h-full object-cover opacity-40 animate-kenburns"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/70 to-transparent"></div>
//         </div>

//         <div className="absolute top-16 right-[8%] w-72 h-72 rounded-full bg-[#A78BFA]/20 blur-[100px] animate-float-slow pointer-events-none z-0"></div>
//         <div className="absolute bottom-0 left-[2%] w-96 h-96 rounded-full bg-[#34D399]/15 blur-[120px] animate-float-slower pointer-events-none z-0"></div>
//         <div className="absolute top-1/3 left-[35%] w-56 h-56 rounded-full bg-[#FF6B6B]/10 blur-[90px] animate-float-slow pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

//         <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
//           <div className="lg:col-span-7 flex flex-col items-start gap-6">
//             <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#F1CB81] to-[#FB923C] text-[#0f172a] font-bold text-sm uppercase tracking-wider mb-4 pulse-dot">The Creative Evolution</span>
//               <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-white tracking-tighter">
//                 Space <span className="text-[#F1CB81] italic">smarter</span>,<br/>not harder.
//               </h1>
//             </div>
//             <p className={`text-lg text-white/80 max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
//             </p>

//             {/* Search Bar */}
//             <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-[32px] flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-xl transition-shadow duration-500 focus-within:shadow-[0_0_0_4px_rgba(241,203,129,0.25)] focus-within:border-[#F1CB81]/50">
//                 <div className="flex-grow flex items-center px-4">
//                   <MagnifyingGlassIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
//                   <input
//                     className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60"
//                     placeholder="Describe the aesthetic (e.g. '70s synth-wave desert loft')"
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <div className="hidden md:block w-px h-8 bg-white/20"></div>
//                 <div className="flex-grow flex items-center px-4">
//                   <MapPinIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
//                   <input
//                     className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60"
//                     placeholder="Location or country"
//                     type="text"
//                     value={searchLocation}
//                     onChange={(e) => setSearchLocation(e.target.value)}
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={isSearching}
//                   className="btn-shine bg-[#F1CB81] text-[#0f172a] px-8 py-4 rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-[#FF6B6B] hover:text-white hover:shadow-lg hover:shadow-[#FF6B6B]/40 transition-all whitespace-nowrap disabled:opacity-50"
//                 >
//                   <MagnifyingGlassIcon className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
//                   {isSearching ? 'Searching...' : 'Search'}
//                 </button>
//               </form>
//               <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
//                 <span className="text-white/60 text-sm font-bold">Popular:</span>
//                 <button onClick={() => { setSearchQuery('photography studio'); setSearchLocation('London'); handleSearch(); }} className="text-[#F1CB81] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#F1CB81] pulse-dot"></span>#PhotographyStudios
//                 </button>
//                 <button onClick={() => { setSearchQuery('music recording'); handleSearch(); }} className="text-[#A78BFA] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] pulse-dot" style={{ animationDelay: '0.6s' }}></span>#MusicRooms
//                 </button>
//                 <button onClick={() => { setSearchQuery('podcast space'); handleSearch(); }} className="text-[#34D399] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] pulse-dot" style={{ animationDelay: '1.2s' }}></span>#PodcastSpaces
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Phone Mockup */}
//           <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[650px]">
//             <div className="animate-float-phone w-72 h-[580px] bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] rounded-[3rem] border-[12px] border-slate-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
//               <div className="h-10 bg-black/50 flex justify-center items-end pb-1"><div className="w-20 h-4 bg-white/20 rounded-full"></div></div>
//               <div className="flex-grow bg-white p-4 flex flex-col overflow-hidden">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
//                   <div className="w-10 h-10 rounded-full bg-[#F1CB81] flex items-center justify-center text-[#0f172a]"><span className="material-symbols-outlined">person</span></div>
//                   <div>
//                     <div className="font-bold text-[#0f172a] text-sm">Studio Manager</div>
//                     <div className="text-[10px] text-[#34D399] font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-pulse"></span> Online</div>
//                   </div>
//                 </div>
//                 <div ref={chatContainerRef} className="flex flex-col gap-4 overflow-y-auto flex-grow chat-container" style={{ scrollbarWidth: 'none' }}>
//                   {phoneMessages.map((msg, idx) => (
//                     <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-message`}>
//                       <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs font-medium shadow-sm ${msg.type === 'user' ? 'bg-[#91ADCD]/30 text-[#0f172a] rounded-tr-none' : 'bg-[#F1CB81] text-[#0f172a] rounded-tl-none'}`}>{msg.text}</div>
//                     </div>
//                   ))}
//                   {phoneMessages.length === 0 && (
//                     <div className="flex items-center justify-center h-full gap-1.5">
//                       <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
//                       <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
//                       <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="h-16 bg-white p-3 border-t border-slate-200 flex items-center gap-2">
//                 <div className="flex-grow h-8 bg-slate-100 rounded-full px-4 text-[10px] flex items-center text-slate-400">Message...</div>
//                 <div className="w-8 h-8 rounded-full bg-[#F1CB81] flex items-center justify-center text-[#0f172a] hover:scale-110 transition-transform cursor-pointer"><span className="material-symbols-outlined text-sm">send</span></div>
//               </div>
//             </div>
//             <div className="absolute -bottom-6 w-56 h-10 bg-[#A78BFA]/30 blur-3xl rounded-full"></div>
//           </div>
//         </div>
//       </header>

//       {/* Reviews Section */}
//       <section className="py-16 md:py-20 bg-white overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 mb-10">
//           <Reveal>
//             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="inline-block px-3 py-1 rounded-full bg-[#F1CB81]/30 text-[#0f172a] font-bold text-xs uppercase tracking-wider">Trusted by Creators</span>
//                 </div>
//                 <h3 className="text-3xl md:text-4xl font-extrabold text-[#0f172a]">
//                   What our <span className="text-[#FF6B6B] italic">community</span> says
//                 </h3>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="flex -space-x-2">
//                   {[1,2,3,4,5].map(i => (
//                     <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F1CB81] to-[#FB923C] border-2 border-white flex items-center justify-center text-xs font-bold text-[#0f172a] shadow-sm hover:-translate-y-1 hover:z-10 transition-transform">★</div>
//                   ))}
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-[#0f172a]">4.9 out of 5</p>
//                   <p className="text-xs text-slate-500">from 2,000+ reviews</p>
//                 </div>
//               </div>
//             </div>
//           </Reveal>
//         </div>

//         <div className="relative">
//           <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10"></div>
//           <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10"></div>
//           <div className="flex gap-4 animate-scroll-right hover:pause-animation pb-4 px-4">
//             {[...allReviews, ...allReviews].map((review, i) => (
//               <div
//                 key={`review-${i}`}
//                 className="min-w-[260px] max-w-[260px] md:min-w-[300px] md:max-w-[300px] bg-white rounded-2xl p-5 border-2 border-slate-200 hover:border-[#F1CB81]/60 hover:shadow-xl hover:shadow-[#F1CB81]/10 hover:-translate-y-1 transition-all duration-300 flex-shrink-0 flex flex-col"
//               >
//                 <div className="flex items-center gap-0.5 mb-3">
//                   {[...Array(5)].map((_, s) => (
//                     <span key={s} className="material-symbols-outlined text-[#F1CB81] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                   ))}
//                 </div>
//                 <p className="text-[#0f172a] text-xs leading-relaxed mb-4 flex-grow line-clamp-4">
//                   "{review.text}"
//                 </p>
//                 <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200">
//                   <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#F1CB81]/20 ring-2 ring-transparent hover:ring-[#F1CB81]/50 transition-all">
//                     {review.avatar ? (
//                       <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#0f172a] bg-[#F1CB81]/30">
//                         {review.initials}
//                       </div>
//                     )}
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="font-bold text-xs text-[#0f172a] truncate">{review.name}</p>
//                     <p className="text-[10px] text-slate-500 truncate">{review.role}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-[#F1CB81] text-base shrink-0">format_quote</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Everywhere Section */}
//       {/* <section className="py-20 md:py-24 bg-[#91ADCD]/10">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <Reveal>
//             <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
//               <div className="max-w-2xl">
//                 <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#0f172a]">Everywhere your <span className="text-[#FF6B6B]">vision</span> lives.</h2>
//                 <p className="text-base md:text-lg text-slate-600">The most sophisticated network of creative square footage on the planet.</p>
//               </div>
//               <Link href="/spaces" className="group flex items-center gap-2 text-[#0f172a] font-bold text-sm uppercase shrink-0 border-2 border-[#0f172a] px-5 py-2.5 rounded-full hover:bg-[#0f172a] hover:text-white hover:shadow-lg transition-all duration-300">
//                 Explore all <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//               </Link>
//             </div>
//           </Reveal>
//           <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
//             {[
//               { image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800', badge: 'Music & Podcast', badgeColor: 'bg-[#A78BFA] text-white', title: 'Recording Studios', desc: 'Acoustically perfect environments.' },
//               { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', badge: 'Photo & Film', badgeColor: 'bg-[#F1CB81] text-[#0f172a]', title: 'Visual Arts Spaces', desc: 'Natural light lofts and cyc walls.' },
//               { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', badge: 'Creative Hubs', badgeColor: 'bg-[#34D399] text-white', title: 'Design & Pop-ups', desc: 'Dynamic spaces for teams.' },
//             ].map((card, i) => (
//               <Reveal key={i} delay={i * 120} className="min-w-[85vw] md:min-w-0 snap-center flex-shrink-0">
//                 <div className="group relative rounded-[32px] overflow-hidden h-[400px] md:h-[500px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
//                   <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={card.image} alt={card.title} />
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent"></div>
//                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-[#F1CB81]/40 rounded-[32px] pointer-events-none"></div>
//                   <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
//                     <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs mb-3 md:mb-4 uppercase transition-transform duration-500 group-hover:-translate-y-1 ${card.badgeColor}`}>{card.badge}</span>
//                     <h4 className="text-white text-xl md:text-2xl font-bold mb-2 transition-transform duration-500 group-hover:-translate-y-1">{card.title}</h4>
//                     <p className="text-white/70 text-sm transition-transform duration-500 group-hover:-translate-y-1">{card.desc}</p>
//                   </div>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section> */}


// <section className="py-20 md:py-24 bg-[#91ADCD]/10">
//   <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//     <Reveal>
//       <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
//         <div className="max-w-2xl">
//           <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#0f172a]">
//             Everywhere your <span className="text-[#FF6B6B]">audience</span> is.
//           </h2>
//           <p className="text-base md:text-lg text-slate-600">
//             Turn comments into sales. Book spaces that inspire. Scale your brand.
//           </p>
//         </div>
//         <Link href="/spaces" className="group flex items-center gap-2 text-[#0f172a] font-bold text-sm uppercase shrink-0 border-2 border-[#0f172a] px-5 py-2.5 rounded-full hover:bg-[#0f172a] hover:text-white hover:shadow-lg transition-all duration-300">
//           Explore all <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//         </Link>
//       </div>
//     </Reveal>

//     {/* Row 1: Image | Text+Image | Text+Image */}
//     <div className="grid md:grid-cols-3 gap-4 mb-4">
      
//       {/* Card 1: IMAGE - ManyChat (full image) */}
//       <Reveal>
//         <div className="group relative rounded-2xl overflow-hidden h-[320px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
//           <img 
//             className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
//             src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800" 
//             alt="ManyChat" 
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent"></div>
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-2 ring-[#FF6B6B]/40 rounded-2xl pointer-events-none"></div>
//           <div className="absolute bottom-0 left-0 p-6 w-full">
//             <span className="inline-block px-3 py-1 rounded-full bg-[#FF6B6B] text-white font-bold text-xs mb-2 uppercase">ManyChat</span>
//             <h4 className="text-white text-xl font-bold mb-1">Turn comments into sales</h4>
//             <p className="text-white/70 text-sm">"How much is this?" Instant reply. Boom — wallets open.</p>
//             <p className="text-white/40 text-xs mt-2">⚡ Auto-reply on every comment</p>
//           </div>
//         </div>
//       </Reveal>

//       {/* Card 2: TEXT+IMAGE - Scouty (Purple) */}
//       <Reveal delay={120}>
//         <div className="group relative rounded-2xl overflow-hidden h-[320px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#A78BFA] to-[#7c5cbf]">
//           <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
//             <img 
//               className="w-full h-full object-cover rounded-full blur-sm" 
//               src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
//               alt="Scouty" 
//             />
//           </div>
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-2 ring-white/30 rounded-2xl pointer-events-none"></div>
//           <div className="absolute bottom-0 left-0 p-6 w-full">
//             <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-2 uppercase backdrop-blur-sm">Scouty</span>
//             <h4 className="text-white text-xl font-bold mb-1">Booked on Scouty</h4>
//             <p className="text-white/80 text-sm">See what production teams are creating</p>
//             <div className="flex flex-wrap gap-1.5 mt-2">
//               {['The New Yorker', 'Kodak', 'Haim'].map((brand) => (
//                 <span key={brand} className="text-[10px] bg-white/20 text-white/90 px-2.5 py-1 rounded-full backdrop-blur-sm">{brand}</span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </Reveal>

//       {/* Card 3: TEXT+IMAGE - Creative (Yellow) */}
//       <Reveal delay={240}>
//         <div className="group relative rounded-2xl overflow-hidden h-[320px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#F1CB81] to-[#d4a843]">
//           <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
//             <img 
//               className="w-full h-full object-cover rounded-full blur-sm" 
//               src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200" 
//               alt="Creative" 
//             />
//           </div>
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-2 ring-white/30 rounded-2xl pointer-events-none"></div>
//           <div className="absolute bottom-0 left-0 p-6 w-full">
//             <span className="inline-block px-3 py-1 rounded-full bg-[#0f172a]/20 text-[#0f172a] font-bold text-xs mb-2 uppercase backdrop-blur-sm">Creative Hubs</span>
//             <h4 className="text-[#0f172a] text-xl font-bold mb-1">Design & Pop-ups</h4>
//             <p className="text-[#0f172a]/70 text-sm">Dynamic spaces for teams to create</p>
//             <p className="text-[#0f172a]/50 text-xs mt-2">📍 Booked through Scouty</p>
//           </div>
//         </div>
//       </Reveal>
//     </div>

//     {/* Row 2: Text Only | Text+Image | Image */}
//     <div className="grid md:grid-cols-3 gap-4 mb-4">
      
//       {/* Card 4: TEXT ONLY - Integrated (Green) - Even size */}
//       <Reveal delay={360}>
//         <div className="group relative rounded-2xl overflow-hidden h-[320px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#34D399] to-[#1fa86f]">
//           <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
//           <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-2 ring-white/30 rounded-2xl pointer-events-none"></div>
//           <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
//             <span className="text-4xl mb-3">🌐</span>
//             <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-3 uppercase backdrop-blur-sm">Integrated</span>
//             <h4 className="text-white text-2xl font-bold mb-2">Everywhere your audience is</h4>
//             <p className="text-white/80 text-sm max-w-xs">Connect, create, and convert across all platforms.</p>
//             <div className="flex items-center gap-3 mt-3">
//               <span className="text-white/60 text-xs">manychat.com</span>
//               <span className="w-px h-3 bg-white/30"></span>
//               <span className="text-white/60 text-xs">scouty.com</span>
//             </div>
//           </div>
//         </div>
//       </Reveal>

//       {/* Card 5: TEXT+IMAGE - Production (Orange) */}
//       <Reveal delay={480}>
//         <div className="group relative rounded-2xl overflow-hidden h-[320px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#FF8A5C] to-[#e06a3a]">
//           <div className="absolute bottom-0 right-0 w-40 h-40 opacity-20">
//             <img 
//               className="w-full h-full object-cover rounded-full blur-sm" 
//               src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
//               alt="Production" 
//             />
//           </div>
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-2 ring-white/30 rounded-2xl pointer-events-none"></div>
//           <div className="absolute bottom-0 left-0 p-6 w-full">
//             <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-2 uppercase backdrop-blur-sm">Production</span>
//             <h4 className="text-white text-xl font-bold mb-1">Visual Arts Spaces</h4>
//             <p className="text-white/80 text-sm">Natural light lofts and cyc walls</p>
//             <p className="text-white/60 text-xs mt-2">🎬 The New Yorker • Kodak Apparel</p>
//           </div>
//         </div>
//       </Reveal>

//       {/* Card 6: IMAGE - Visual Arts (full image) */}
//       <Reveal delay={600}>
//         <div className="group relative rounded-2xl overflow-hidden h-[320px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
//           <img 
//             className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
//             src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
//             alt="Visual Arts" 
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent"></div>
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-2 ring-[#A78BFA]/40 rounded-2xl pointer-events-none"></div>
//           <div className="absolute bottom-0 left-0 p-6 w-full">
//             <span className="inline-block px-3 py-1 rounded-full bg-[#A78BFA] text-white font-bold text-xs mb-2 uppercase">Photo & Film</span>
//             <h4 className="text-white text-xl font-bold mb-1">Production-Ready Studios</h4>
//             <p className="text-white/70 text-sm">Acoustically perfect environments</p>
//             <p className="text-white/40 text-xs mt-2">📍 Booked through Scouty</p>
//           </div>
//         </div>
//       </Reveal>
//     </div>

//     {/* Row 3: Full-width CTA */}
//     <Reveal delay={720}>
//       <div className="grid md:grid-cols-1 gap-4">
//         <div className="group relative rounded-2xl overflow-hidden bg-[#0f172a] shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 p-6 flex flex-wrap items-center justify-between gap-4 border border-white/10">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-full bg-[#FF6B6B]/20 flex items-center justify-center text-2xl">🚀</div>
//             <div>
//               <p className="text-white font-bold">Ready to scale your brand?</p>
//               <p className="text-white/40 text-sm">Join thousands of creators using ManyChat and Scouty</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <button className="px-6 py-2.5 rounded-full bg-[#FF6B6B] text-white font-bold text-sm hover:bg-[#ff5252] transition-all duration-300 shadow-lg shadow-[#FF6B6B]/20">
//               Get started →
//             </button>
//             <button className="px-6 py-2.5 rounded-full border border-white/20 text-white/60 font-bold text-sm hover:bg-white/10 transition-all duration-300">
//               Learn more
//             </button>
//           </div>
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-2 ring-white/10 rounded-2xl pointer-events-none"></div>
//         </div>
//       </div>
//     </Reveal>
//   </div>
// </section>


//       {/* The Crew Collective */}
// {/* The Crew Collective */}
// <section className="py-20 md:py-24 bg-[#F1CB81] relative overflow-hidden">
//   <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
//     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f172a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//   }}></div>
//   <div className="max-w-[1440px] mx-auto px-4 md:px-16 relative z-10">
//     <Reveal>
//       <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
//         <div className="max-w-2xl">
//           <span className="inline-block px-4 py-1 rounded-full bg-[#0f172a] text-[#F1CB81] font-bold text-sm uppercase tracking-wider mb-4">The Crew Collective</span>
//           <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#0f172a]">Hire the <span className="italic text-[#FF6B6B]">pros</span> who make it happen.</h2>
//           <p className="text-base md:text-lg text-[#0f172a]/70">Don't just book a space--build your dream team.</p>
//         </div>
//         <Link href="/services" className="group flex items-center gap-2 text-[#0f172a] font-bold text-sm uppercase shrink-0 border-2 border-[#0f172a] px-6 py-3 rounded-full hover:bg-[#0f172a] hover:text-[#F1CB81] hover:shadow-lg transition-all duration-300">
//           Browse all pros <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//         </Link>
//       </div>
//     </Reveal>
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//       {[
//         { title: 'Photographers', subtitle: 'Editorial & Commercial', image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=600', stat: '2,400+ available', accent: '#0f172a', badge: '#0f172a' },
//         { title: 'Videographers', subtitle: 'DPs & Drone Pilots', image: 'https://images.unsplash.com/photo-1585646794396-3c34d6f3ea4e?auto=format&fit=crop&q=80&w=600', stat: '1,800+ available', accent: '#FF6B6B', badge: '#FF6B6B' },
//         { title: 'HMU Artists', subtitle: 'Beauty & SFX', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600', stat: '950+ available', accent: '#A78BFA', badge: '#A78BFA' },
//         { title: 'Studio Support', subtitle: 'PAs & Set Builders', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600', stat: '1,200+ available', accent: '#34D399', badge: '#34D399' },
//       ].map((service, i) => (
//         <Reveal key={i} delay={i * 100}>
//           <div className="group cursor-pointer">
//             <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4] bg-white shadow-md group-hover:shadow-2xl transition-shadow duration-500">
//               <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105" />
//               <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
//                 <p className="text-white/90 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{service.subtitle}</p>
//                 <p className="text-sm font-bold mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200 text-[#F1CB81]">{service.stat}</p>
//               </div>
//               <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
//                 <span className="inline-block px-3 py-1 rounded-full font-bold text-xs uppercase" style={{ backgroundColor: service.badge, color: '#fff' }}>{service.title.split(' ')[0]}</span>
//               </div>
//               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
//                 <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
//                   <span className="material-symbols-outlined text-[#0f172a] text-lg">arrow_forward</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <h4 className="text-lg font-extrabold text-[#0f172a] group-hover:text-[#FF6B6B] transition-colors">{service.title}</h4>
//               <p className="text-sm text-[#0f172a]/60">{service.subtitle}</p>
//             </div>
//           </div>
//         </Reveal>
//       ))}
//     </div>
//     <Reveal delay={150}>
//       <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t-2 border-[#0f172a]/20 pt-8">
//         {[
//           { value: 6350, suffix: '+', label: 'Vetted Professionals', color: '#FF6B6B' },
//           { value: 98, suffix: '%', label: 'Client Satisfaction', color: '#34D399' },
//           { value: 48, suffix: 'h', label: 'Avg. Response Time', color: '#91ADCD' },
//           { value: 50, suffix: '+', label: 'Creative Categories', color: '#A78BFA' },
//         ].map((stat, i) => (
//           <div key={i} className="text-center hover:-translate-y-1 transition-transform duration-300">
//             <p className="text-2xl md:text-3xl font-extrabold" style={{ color: stat.color }}>
//               <CountUp end={stat.value} suffix={stat.suffix} />
//             </p>
//             <p className="text-sm text-[#0f172a]/70 font-medium mt-1">{stat.label}</p>
//           </div>
//         ))}
//       </div>
//     </Reveal>
//   </div>
// </section>

//       {/* Before/After */}
//       <section className="py-20 md:py-24 bg-gradient-to-br from-[#FF6B6B]/10 to-[#A78BFA]/10">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Reveal>
//               <div className="bg-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center border-2 border-slate-200 h-full">
//                 <span className="text-sm font-bold text-slate-400 uppercase mb-8">Before ManyRooms</span>
//                 <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#0f172a]">All work<br/>and no play.</h2>
//                 <ul className="w-full space-y-6 text-left">
//                   {['Manual booking coordination.', 'Hidden studio fees.', 'Inconsistent space matching.', 'Slow creative output.'].map((item) => (
//                     <li key={item} className="flex items-center justify-between border-b border-slate-200 pb-4">
//                       <span className="text-lg font-bold text-[#0f172a]">{item}</span>
//                       <span className="material-symbols-outlined text-[#FF6B6B]">close</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </Reveal>
//             <Reveal delay={150}>
//               <div className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden h-full">
//                 <div className="absolute top-0 right-0 p-8">
//                   <span className="material-symbols-outlined text-[#F1CB81] text-6xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
//                 </div>
//                 <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#A78BFA]/10 blur-3xl animate-float-slow pointer-events-none"></div>
//                 <span className="text-sm font-bold text-[#F1CB81] uppercase mb-8 relative z-10">After ManyRooms</span>
//                 <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white relative z-10">Less grind<br/>and more pay.</h2>
//                 <ul className="w-full space-y-6 text-left relative z-10">
//                   {['Auto-pilot studio management.', 'Transparent fixed pricing.', 'Smart space matching.', '24/7 revenue generation.'].map((item) => (
//                     <li key={item} className="flex items-center justify-between border-b border-white/10 pb-4">
//                       <span className="text-lg font-bold">{item}</span>
//                       <span className="material-symbols-outlined text-[#34D399]">check_circle</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <Link href="/signup" className="btn-shine mt-12 w-full bg-[#F1CB81] text-[#0f172a] py-5 rounded-2xl font-extrabold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-[#F1CB81]/30 transition-all duration-300 relative z-10 text-center">Get Started for Free</Link>
//               </div>
//             </Reveal>
//           </div>
//         </div>
//       </section>

//       {/* Steps */}
//       <section className="py-20 md:py-24 bg-white">
//         <Reveal>
//           <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center mb-12 md:mb-16">
//             <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#0f172a]">Get up and running in <span className="italic text-[#FF6B6B]">3 simple steps</span>.</h2>
//           </div>
//         </Reveal>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
//           {[
//             { icon: 'add_photo_alternate', title: 'List your space', desc: 'Upload photos and define your hours. Takes less than 5 minutes.', bg: 'bg-[#91ADCD]/30', color: '#91ADCD' },
//             { icon: 'smart_toy', title: 'Automate bookings', desc: 'Let our AI handle inquiries and scheduling while you create.', bg: 'bg-[#F1CB81]', color: '#0f172a' },
//             { icon: 'account_balance_wallet', title: 'Collect revenue', desc: 'Instant payouts directly to your account. No chasing invoices.', bg: 'bg-[#A78BFA]/30', color: '#A78BFA' },
//           ].map((step, i) => (
//             <Reveal key={i} delay={i * 130}>
//               <div className="flex flex-col items-center gap-5 text-center group">
//                 <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${step.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-md group-hover:shadow-xl`}>
//                   <span className="material-symbols-outlined text-3xl md:text-4xl" style={{ color: step.color, fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
//                 </div>
//                 <h3 className="text-xl md:text-2xl font-bold text-[#0f172a]">{step.title}</h3>
//                 <p className="text-base md:text-lg text-slate-600 max-w-xs">{step.desc}</p>
//               </div>
//             </Reveal>
//           ))}
//         </div>
//       </section>

//       {/* Featured Studios */}
//       <section className="py-20 md:py-24 bg-gradient-to-br from-[#F1CB81]/20 to-[#91ADCD]/20 overflow-hidden">
//         <Reveal>
//           <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex justify-between items-end mb-10 md:mb-12">
//             <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">Featured Studios <span className="text-[#0f172a] bg-[#F1CB81] px-3 py-1 rounded-lg text-sm">New This Week</span></h2>
//             <div className="flex gap-2">
//               <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:-translate-x-0.5 transition-all">
//                 <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-[#0f172a]" />
//               </button>
//               <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:translate-x-0.5 transition-all">
//                 <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-[#0f172a]" />
//               </button>
//             </div>
//           </div>
//         </Reveal>
//         <div className="flex gap-5 px-4 md:px-16 overflow-x-auto pb-4 scrollbar-hide">
//           {loading ? (
//             [...Array(3)].map((_, i) => (
//               <div key={i} className="min-w-[300px] md:min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-md flex-shrink-0">
//                 <div className="h-52 md:h-64 skeleton-shimmer"></div>
//                 <div className="p-5 md:p-6 space-y-3">
//                   <div className="h-5 w-2/3 rounded-md skeleton-shimmer"></div>
//                   <div className="h-4 w-1/2 rounded-md skeleton-shimmer"></div>
//                   <div className="flex gap-2 pt-1">
//                     <div className="h-6 w-16 rounded-md skeleton-shimmer"></div>
//                     <div className="h-6 w-16 rounded-md skeleton-shimmer"></div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             featuredSpaces.map((space, i) => {
//               const coverImage = getFirstImage(space.images);
//               return (
//                 <Reveal key={space.id} delay={i * 90} className="min-w-[300px] md:min-w-[380px] flex-shrink-0 snap-start">
//                   <Link href={`/spaces/${space.id}`} className="group block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1.5 transition-all duration-400">
//                     <div className="h-52 md:h-64 relative overflow-hidden">
//                       {coverImage ? (
//                         <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverImage} alt={space.name} />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-slate-100"><span className="material-symbols-outlined text-4xl text-slate-300">image</span></div>
//                       )}
//                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm group-hover:scale-105 transition-transform">
//                         <StarIcon className="w-4 h-4 text-[#F1CB81] fill-current" /><span className="font-bold text-sm text-[#0f172a]">4.9</span>
//                       </div>
//                     </div>
//                     <div className="p-5 md:p-6">
//                       <div className="flex justify-between items-start mb-2">
//                         <h5 className="text-lg md:text-xl font-bold text-[#0f172a] group-hover:text-[#FF6B6B] transition-colors">{space.name}</h5>
//                         <p className="font-bold text-[#FF6B6B] text-sm">${space.hourly_rate}/hr</p>
//                       </div>
//                       <p className="text-slate-500 text-sm mb-4 flex items-center gap-1"><MapPinIcon className="w-4 h-4" />{space.city || 'Location'}{space.state ? `, ${space.state}` : ''}</p>
//                       <div className="flex gap-2">
//                         <span className="px-2 py-1 bg-[#F1CB81]/20 rounded-md text-xs font-bold text-[#0f172a]">#Creative</span>
//                         <span className="px-2 py-1 bg-[#91ADCD]/20 rounded-md text-xs font-bold text-[#0f172a]">#Studio</span>
//                       </div>
//                     </div>
//                   </Link>
//                 </Reveal>
//               );
//             })
//           )}
//         </div>
//       </section>

//       <Footer />
//       <Chatbot />

//       <style jsx>{`
//         @keyframes messageIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-message { animation: messageIn 0.4s ease-out forwards; }
//         .chat-container::-webkit-scrollbar { display: none; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

//         @keyframes scrollRight {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-scroll-right { animation: scrollRight 50s linear infinite; }
//         .hover\\:pause-animation:hover { animation-play-state: paused; }

//         .reveal {
//           opacity: 0;
//           transform: translateY(28px);
//           transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
//         }
//         .reveal-visible { opacity: 1; transform: translateY(0); }

//         @keyframes floatSlow {
//           0%, 100% { transform: translate(0, 0); }
//           50% { transform: translate(15px, -30px); }
//         }
//         @keyframes floatSlower {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(25px); }
//         }
//         .animate-float-slow { animation: floatSlow 9s ease-in-out infinite; }
//         .animate-float-slower { animation: floatSlower 12s ease-in-out infinite; }

//         @keyframes floatPhone {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-14px); }
//         }
//         .animate-float-phone { animation: floatPhone 6s ease-in-out infinite; }

//         @keyframes kenburns {
//           0% { transform: scale(1); }
//           100% { transform: scale(1.08); }
//         }
//         .animate-kenburns { animation: kenburns 22s ease-in-out infinite alternate; }

//         @keyframes pulseRing {
//           0% { box-shadow: 0 0 0 0 rgba(241, 203, 129, 0.55); }
//           70% { box-shadow: 0 0 0 10px rgba(241, 203, 129, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(241, 203, 129, 0); }
//         }
//         .pulse-dot { animation: pulseRing 2.2s infinite; border-radius: 9999px; }

//         .btn-shine { position: relative; overflow: hidden; }
//         .btn-shine::after {
//           content: '';
//           position: absolute;
//           top: 0; left: 0;
//           width: 40%; height: 100%;
//           background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
//           transform: translateX(-150%) skewX(-20deg);
//         }
//         .btn-shine:hover::after {
//           animation: shine 0.9s ease forwards;
//         }
//         @keyframes shine {
//           to { transform: translateX(280%) skewX(-20deg); }
//         }

//         .skeleton-shimmer {
//           background: linear-gradient(90deg, rgba(241,203,129,0.18) 25%, rgba(241,203,129,0.38) 37%, rgba(241,203,129,0.18) 63%);
//           background-size: 400% 100%;
//           animation: shimmerMove 1.4s ease infinite;
//         }
//         @keyframes shimmerMove {
//           0% { background-position: 100% 50%; }
//           100% { background-position: 0 50%; }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .reveal, .animate-float-slow, .animate-float-slower, .animate-float-phone,
//           .animate-kenburns, .pulse-dot, .btn-shine::after, .skeleton-shimmer,
//           .animate-scroll-right, .animate-message {
//             animation: none !important;
//             transition: none !important;
//             opacity: 1 !important;
//             transform: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }



// // app/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   Bars3Icon,
//   XMarkIcon,
//   StarIcon,
//   MapPinIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';
// import './home.css';

// // Brand Colors
// const brand = {
//   yellow: '#F1CB81',
//   blue: '#91ADCD',
//   brown: '#DB8B8C',
//   dark: '#3C291C',
// };

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
// }

// interface ChatMessage {
//   text: string;
//   type: 'user' | 'owner';
// }

// /**
//  * Reveal — wraps content and fades/rises it into view the first time it
//  * crosses into the viewport. Used throughout for scroll-triggered motion.
//  */
// function Reveal({
//   children,
//   delay = 0,
//   className = '',
// }: {
//   children: React.ReactNode;
//   delay?: number;
//   className?: string;
// }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div
//       ref={ref}
//       className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
//       style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
//     >
//       {children}
//     </div>
//   );
// }

// /**
//  * CountUp — animates a number counting up from 0 once it scrolls into view.
//  */
// function CountUp({
//   end,
//   duration = 1800,
//   suffix = '',
// }: {
//   end: number;
//   duration?: number;
//   suffix?: string;
// }) {
//   const ref = useRef<HTMLSpanElement>(null);
//   const [value, setValue] = useState(0);
//   const startedRef = useRef(false);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !startedRef.current) {
//           startedRef.current = true;
//           const startTime = performance.now();
//           const animate = (now: number) => {
//             const progress = Math.min((now - startTime) / duration, 1);
//             const eased = 1 - Math.pow(1 - progress, 3);
//             setValue(Math.floor(eased * end));
//             if (progress < 1) requestAnimationFrame(animate);
//             else setValue(end);
//           };
//           requestAnimationFrame(animate);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.4 }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [end, duration]);

//   return (
//     <span ref={ref}>
//       {value.toLocaleString()}
//       {suffix}
//     </span>
//   );
// }

// export default function HomePage() {
//   const router = useRouter();
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [phoneMessages, setPhoneMessages] = useState<ChatMessage[]>([]);
//   const [scrolled, setScrolled] = useState(false);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   // Search states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchLocation, setSearchLocation] = useState('');
//   const [isSearching, setIsSearching] = useState(false);

//   const chatSequence: ChatMessage[] = [
//     { text: "Hi! Is the studio available for a 4-hour shoot this Friday?", type: "user" },
//     { text: "Hey! Yes, we have a slot from 2 PM - 6 PM. Want me to book you in?", type: "owner" },
//     { text: "Perfect, sending the request now!", type: "user" },
//   ];

//   const allReviews = [
//     {
//       text: "ManyRooms transformed how we book studio spaces. The search is incredibly accurate!",
//       name: "Sarah Chen",
//       role: "Creative Director, Vogue",
//       initials: "SC",
//       avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "I've saved countless hours on booking coordination. The automation is a game-changer.",
//       name: "Marcus Thorne",
//       role: "Editorial Photographer",
//       initials: "MT",
//       avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "The quality of studios on this platform is unmatched. Every space exceeds expectations.",
//       name: "Elena Rodriguez",
//       role: "Independent Filmmaker",
//       initials: "ER",
//       avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "Finally, a platform that understands creative professionals. Booking is seamless.",
//       name: "James Wilson",
//       role: "Art Director, Nike",
//       initials: "JW",
//       avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "From podcast studios to photo lofts, ManyRooms has every space we need.",
//       name: "Amara Okafor",
//       role: "Content Creator",
//       initials: "AO",
//       avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "The matching is scary good. Found exactly the industrial loft we needed.",
//       name: "David Park",
//       role: "Creative Lead, Adobe",
//       initials: "DP",
//       avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "We've increased studio bookings by 300% since listing on ManyRooms.",
//       name: "Lisa Thompson",
//       role: "Studio Owner, DTLA",
//       initials: "LT",
//       avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "Transparent pricing and instant confirmations make my job so much easier!",
//       name: "Alex Rivera",
//       role: "Production Manager",
//       initials: "AR",
//       avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "I love messaging studio owners directly. No more endless email chains!",
//       name: "Nina Patel",
//       role: "Fashion Photographer",
//       initials: "NP",
//       avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "ManyRooms is essential to our creative workflow. Can't imagine working without it.",
//       name: "Chris Mendoza",
//       role: "Music Producer",
//       initials: "CM",
//       avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "The curated categories are spot on. Found a brutalist loft perfect for our shoot.",
//       name: "Keisha Williams",
//       role: "Brand Strategist",
//       initials: "KW",
//       avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150"
//     },
//     {
//       text: "As a studio owner, the dashboard gives me complete control. So smooth.",
//       name: "Robert Kim",
//       role: "Studio Owner, Brooklyn",
//       initials: "RK",
//       avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
//     },
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//       const docHeight = document.documentElement.scrollHeight - window.innerHeight;
//       setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
//     let timeoutIds: NodeJS.Timeout[] = [];
//     const animateMessages = async () => {
//       setPhoneMessages([]);
//       for (const msg of chatSequence) {
//         if (!isMounted) return;
//         await new Promise<void>(resolve => {
//           const id = setTimeout(() => { setPhoneMessages(prev => [...prev, msg]); resolve(); }, 1500);
//           timeoutIds.push(id);
//         });
//       }
//       if (isMounted) {
//         const id = setTimeout(() => animateMessages(), 3500);
//         timeoutIds.push(id);
//       }
//     };
//     animateMessages();
//     return () => { isMounted = false; timeoutIds.forEach(clearTimeout); };
//   }, []);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
//     }
//   }, [phoneMessages]);

//   useEffect(() => { fetchApprovedStudios(); setTimeout(() => setIsVisible(true), 100); }, []);

//   useEffect(() => {
//     document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
//     return () => { document.body.style.overflow = 'unset'; };
//   }, [isMobileMenuOpen]);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.from('studios').select('*').eq('status', 'approved').limit(6);
//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) { console.error('Error fetching studios:', error); }
//     finally { setLoading(false); }
//   };

//   const getFirstImage = (images: string[]) => (!images || images.length === 0 ? null : images[0]);

//   // Search function - searches by query, location, and country
//   const handleSearch = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (!searchQuery.trim() && !searchLocation.trim()) return;

//     setIsSearching(true);

//     try {
//       let query = supabase.from('studios').select('*').eq('status', 'approved');

//       // Search by name or description matching the query
//       if (searchQuery.trim()) {
//         query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%,city.ilike.%${searchQuery.trim()}%`);
//       }

//       // Filter by location/country
//       if (searchLocation.trim()) {
//         const locLower = searchLocation.trim().toLowerCase();
//         query = query.or(`city.ilike.%${locLower}%,state.ilike.%${locLower}%,country.ilike.%${locLower}%`);
//       }

//       query = query.limit(20);

//       const { data, error } = await query;

//       if (error) throw error;

//       // Store results and navigate to spaces page with search params
//       const params = new URLSearchParams();
//       if (searchQuery.trim()) params.set('q', searchQuery.trim());
//       if (searchLocation.trim()) params.set('location', searchLocation.trim());

//       router.push(`/spaces?${params.toString()}`);
//     } catch (error) {
//       console.error('Search error:', error);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   return (
//     <div className="home-page bg-[#FFFBF5] text-[#3C291C] overflow-x-hidden">

//       {/* Scroll progress bar */}
//       <div className="fixed top-0 left-0 w-full h-[3px] z-[70] pointer-events-none">
//         <div
//           className="h-full bg-gradient-to-r from-[#F1CB81] via-[#DB8B8C] to-[#91ADCD] transition-[width] duration-150 ease-out"
//           style={{ width: `${scrollProgress}%` }}
//         />
//       </div>

//       {/* Navigation */}
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-[#3C291C]/10 shadow-sm' : 'bg-transparent'
//       }`}>
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <span className={`text-xl md:text-2xl font-extrabold tracking-tighter transition-all duration-300 group-hover:tracking-tight inline-block ${scrolled ? 'text-[#3C291C]' : 'text-white'}`}>
//                 Many<span className="text-[#F1CB81] inline-block transition-transform duration-300 group-hover:rotate-6">Rooms</span>
//               </span>
//             </Link>
//             <div className="hidden lg:flex gap-6 items-center">
//               {['Marketplace', 'Studios', 'Spaces', 'Journal', 'Services'].map((item) => (
//                 <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`}
//                   className={`relative py-1 font-bold text-sm transition-colors group/link ${
//                     scrolled ? 'text-[#3C291C]/70 hover:text-[#3C291C]' : 'text-white/80 hover:text-white'
//                   }`}
//                 >
//                   {item}
//                   <span className={`absolute -bottom-0.5 left-0 h-[2px] bg-current transition-all duration-300 ${
//                     item === 'Marketplace' ? 'w-full' : 'w-0 group-hover/link:w-full'
//                   }`}></span>
//                 </Link>
//               ))}
//             </div>
//           </div>
//           <div className="flex items-center gap-3 md:gap-4">
//             <Link href="/signup?role=owner" className="btn-shine hidden md:block px-6 py-2 bg-[#F1CB81] text-[#3C291C] font-bold text-sm rounded-full hover:bg-[#DB8B8C] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#DB8B8C]/30 transition-all duration-300">List Your Space</Link>
//             <div className="hidden md:flex items-center gap-3">
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-125 active:scale-95 transition-transform duration-200 ${scrolled ? 'text-[#3C291C]' : 'text-white/80'}`}>favorite</span>
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-125 active:scale-95 transition-transform duration-200 ${scrolled ? 'text-[#3C291C]' : 'text-white/80'}`}>account_circle</span>
//             </div>
//             <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 ${scrolled ? 'hover:bg-gray-100 text-[#3C291C]' : 'text-white hover:bg-white/10'}`}>
//               <Bars3Icon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
//         <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-[#3C291C]">ManyRooms</span>
//               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-transform duration-200 hover:rotate-90"><XMarkIcon className="w-6 h-6 text-[#3C291C]" /></button>
//             </div>
//             <nav className="flex flex-col gap-6">
//               {['Marketplace', 'Studios', 'Journal'].map((item, i) => (
//                 <Link
//                   key={item}
//                   href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`}
//                   className="text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] hover:translate-x-1 transition-all duration-200"
//                   style={{ transitionDelay: isMobileMenuOpen ? `${i * 40}ms` : '0ms' }}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >{item}</Link>
//               ))}
//               <div className="border-t border-gray-200 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Your Space</Link>
//                 <Link href="/login" className="block text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#3C291C]">
//         <div className="absolute inset-0 z-0">
//           <img
//             src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000"
//             alt="Creative studio space"
//             className="w-full h-full object-cover opacity-60 animate-kenburns"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-[#3C291C] via-[#3C291C]/80 to-transparent"></div>
//         </div>

//         {/* Ambient floating orbs for depth */}
//         <div className="absolute top-16 right-[8%] w-72 h-72 rounded-full bg-[#F1CB81]/20 blur-[100px] animate-float-slow pointer-events-none z-0"></div>
//         <div className="absolute bottom-0 left-[2%] w-96 h-96 rounded-full bg-[#91ADCD]/15 blur-[120px] animate-float-slower pointer-events-none z-0"></div>
//         <div className="absolute top-1/3 left-[35%] w-56 h-56 rounded-full bg-[#DB8B8C]/10 blur-[90px] animate-float-slow pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

//         <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
//           <div className="lg:col-span-7 flex flex-col items-start gap-6">
//             <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <span className="inline-block px-4 py-1 rounded-full bg-[#F1CB81] text-[#3C291C] font-bold text-sm uppercase tracking-wider mb-4 pulse-dot">The Creative Evolution</span>
//               <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-white tracking-tighter">
//                 Space <span className="text-[#F1CB81] italic">smarter</span>,<br/>not harder.
//               </h1>
//             </div>
//             <p className={`text-lg text-white/80 max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
//             </p>

//             {/* Search Bar - Full working search */}
//             <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-[32px] flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-xl transition-shadow duration-500 focus-within:shadow-[0_0_0_4px_rgba(241,203,129,0.25)] focus-within:border-[#F1CB81]/50">
//                 <div className="flex-grow flex items-center px-4">
//                   <MagnifyingGlassIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
//                   <input
//                     className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60"
//                     placeholder="Describe the aesthetic (e.g. '70s synth-wave desert loft')"
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <div className="hidden md:block w-px h-8 bg-white/20"></div>
//                 <div className="flex-grow flex items-center px-4">
//                   <MapPinIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
//                   <input
//                     className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60"
//                     placeholder="Location or country"
//                     type="text"
//                     value={searchLocation}
//                     onChange={(e) => setSearchLocation(e.target.value)}
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={isSearching}
//                   className="btn-shine bg-[#F1CB81] text-[#3C291C] px-8 py-4 rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-[#DB8B8C] hover:text-white hover:shadow-lg hover:shadow-[#DB8B8C]/40 transition-all whitespace-nowrap disabled:opacity-50"
//                 >
//                   <MagnifyingGlassIcon className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
//                   {isSearching ? 'Searching...' : 'Search'}
//                 </button>
//               </form>
//               <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
//                 <span className="text-white/60 text-sm font-bold">Popular:</span>
//                 <button onClick={() => { setSearchQuery('photography studio'); setSearchLocation('London'); handleSearch(); }} className="text-[#F1CB81] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#F1CB81] pulse-dot"></span>#PhotographyStudios
//                 </button>
//                 <button onClick={() => { setSearchQuery('music recording'); handleSearch(); }} className="text-[#F1CB81] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#F1CB81] pulse-dot" style={{ animationDelay: '0.6s' }}></span>#MusicRooms
//                 </button>
//                 <button onClick={() => { setSearchQuery('podcast space'); handleSearch(); }} className="text-[#F1CB81] hover:underline text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#F1CB81] pulse-dot" style={{ animationDelay: '1.2s' }}></span>#PodcastSpaces
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Phone Mockup */}
//           <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[650px]">
//             <div className="animate-float-phone w-72 h-[580px] bg-[#3C291C] rounded-[3rem] border-[12px] border-[#3C291C]/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
//               <div className="h-10 bg-[#3C291C]/90 flex justify-center items-end pb-1"><div className="w-20 h-4 bg-[#3C291C]/60 rounded-full"></div></div>
//               <div className="flex-grow bg-[#FFFBF5] p-4 flex flex-col overflow-hidden">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3C291C]/10">
//                   <div className="w-10 h-10 rounded-full bg-[#F1CB81] flex items-center justify-center text-[#3C291C]"><span className="material-symbols-outlined">person</span></div>
//                   <div>
//                     <div className="font-bold text-[#3C291C] text-sm">Studio Manager</div>
//                     <div className="text-[10px] text-green-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span> Online</div>
//                   </div>
//                 </div>
//                 <div ref={chatContainerRef} className="flex flex-col gap-4 overflow-y-auto flex-grow chat-container" style={{ scrollbarWidth: 'none' }}>
//                   {phoneMessages.map((msg, idx) => (
//                     <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-message`}>
//                       <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs font-medium shadow-sm ${msg.type === 'user' ? 'bg-[#91ADCD]/30 text-[#3C291C] rounded-tr-none' : 'bg-[#F1CB81] text-[#3C291C] rounded-tl-none'}`}>{msg.text}</div>
//                     </div>
//                   ))}
//                   {phoneMessages.length === 0 && (
//                     <div className="flex items-center justify-center h-full gap-1.5">
//                       <span className="w-2 h-2 rounded-full bg-[#3C291C]/30 animate-bounce" style={{ animationDelay: '0ms' }}></span>
//                       <span className="w-2 h-2 rounded-full bg-[#3C291C]/30 animate-bounce" style={{ animationDelay: '150ms' }}></span>
//                       <span className="w-2 h-2 rounded-full bg-[#3C291C]/30 animate-bounce" style={{ animationDelay: '300ms' }}></span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="h-16 bg-white p-3 border-t border-[#3C291C]/10 flex items-center gap-2">
//                 <div className="flex-grow h-8 bg-[#3C291C]/5 rounded-full px-4 text-[10px] flex items-center text-[#3C291C]/40">Message...</div>
//                 <div className="w-8 h-8 rounded-full bg-[#F1CB81] flex items-center justify-center text-[#3C291C] hover:scale-110 transition-transform cursor-pointer"><span className="material-symbols-outlined text-sm">send</span></div>
//               </div>
//             </div>
//             {/* Glow beneath phone */}
//             <div className="absolute -bottom-6 w-56 h-10 bg-[#F1CB81]/30 blur-3xl rounded-full"></div>
//           </div>
//         </div>
//       </header>

//       {/* Reviews Section */}
//       <section className="py-16 md:py-20 bg-white overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 mb-10">
//           <Reveal>
//             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="inline-block px-3 py-1 rounded-full bg-[#F1CB81]/30 text-[#3C291C] font-bold text-xs uppercase tracking-wider">Trusted by Creators</span>
//                 </div>
//                 <h3 className="text-3xl md:text-4xl font-extrabold text-[#3C291C]">
//                   What our <span className="text-[#DB8B8C] italic">community</span> says
//                 </h3>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="flex -space-x-2">
//                   {[1,2,3,4,5].map(i => (
//                     <div key={i} className="w-9 h-9 rounded-full bg-[#F1CB81] border-2 border-white flex items-center justify-center text-xs font-bold text-[#3C291C] shadow-sm hover:-translate-y-1 hover:z-10 transition-transform">★</div>
//                   ))}
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-[#3C291C]">4.9 out of 5</p>
//                   <p className="text-xs text-[#3C291C]/60">from 2,000+ reviews</p>
//                 </div>
//               </div>
//             </div>
//           </Reveal>
//         </div>

//         <div className="relative">
//           <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10"></div>
//           <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10"></div>
//           <div className="flex gap-4 animate-scroll-right hover:pause-animation pb-4 px-4">
//             {[...allReviews, ...allReviews].map((review, i) => (
//               <div
//                 key={`review-${i}`}
//                 className="min-w-[260px] max-w-[260px] md:min-w-[300px] md:max-w-[300px] bg-white rounded-2xl p-5 border-2 border-[#3C291C]/10 hover:border-[#F1CB81]/60 hover:shadow-xl hover:shadow-[#F1CB81]/10 hover:-translate-y-1 transition-all duration-300 flex-shrink-0 flex flex-col"
//               >
//                 <div className="flex items-center gap-0.5 mb-3">
//                   {[...Array(5)].map((_, s) => (
//                     <span key={s} className="material-symbols-outlined text-[#F1CB81] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                   ))}
//                 </div>

//                 <p className="text-[#3C291C] text-xs leading-relaxed mb-4 flex-grow line-clamp-4">
//                   "{review.text}"
//                 </p>

//                 <div className="flex items-center gap-2.5 pt-3 border-t border-[#3C291C]/10">
//                   <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#F1CB81]/20 ring-2 ring-transparent hover:ring-[#F1CB81]/50 transition-all">
//                     {review.avatar ? (
//                       <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#3C291C] bg-[#F1CB81]/30">
//                         {review.initials}
//                       </div>
//                     )}
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="font-bold text-xs text-[#3C291C] truncate">{review.name}</p>
//                     <p className="text-[10px] text-[#3C291C]/50 truncate">{review.role}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-[#F1CB81] text-base shrink-0">format_quote</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Everywhere Section */}
//       <section className="py-20 md:py-24 bg-[#91ADCD]/10">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <Reveal>
//             <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
//               <div className="max-w-2xl">
//                 <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#3C291C]">Everywhere your <span className="text-[#DB8B8C]">vision</span> lives.</h2>
//                 <p className="text-base md:text-lg text-[#3C291C]/70">The most sophisticated network of creative square footage on the planet.</p>
//               </div>
//               <Link href="/spaces" className="group flex items-center gap-2 text-[#3C291C] font-bold text-sm uppercase shrink-0 border-2 border-[#3C291C] px-5 py-2.5 rounded-full hover:bg-[#3C291C] hover:text-white hover:shadow-lg transition-all duration-300">
//                 Explore all <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//               </Link>
//             </div>
//           </Reveal>
//           <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
//             {[
//               { image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800', badge: 'Music & Podcast', badgeColor: 'bg-[#F1CB81] text-[#3C291C]', title: 'Recording Studios', desc: 'Acoustically perfect environments.' },
//               { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', badge: 'Photo & Film', badgeColor: 'bg-[#91ADCD] text-[#3C291C]', title: 'Visual Arts Spaces', desc: 'Natural light lofts and cyc walls.' },
//               { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', badge: 'Creative Hubs', badgeColor: 'bg-[#DB8B8C] text-white', title: 'Design & Pop-ups', desc: 'Dynamic spaces for teams.' },
//             ].map((card, i) => (
//               <Reveal key={i} delay={i * 120} className="min-w-[85vw] md:min-w-0 snap-center flex-shrink-0">
//                 <div className="group relative rounded-[32px] overflow-hidden h-[400px] md:h-[500px] shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
//                   <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={card.image} alt={card.title} />
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#3C291C]/90 via-transparent to-transparent"></div>
//                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ring-inset ring-4 ring-[#F1CB81]/40 rounded-[32px] pointer-events-none"></div>
//                   <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
//                     <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs mb-3 md:mb-4 uppercase transition-transform duration-500 group-hover:-translate-y-1 ${card.badgeColor}`}>{card.badge}</span>
//                     <h4 className="text-white text-xl md:text-2xl font-bold mb-2 transition-transform duration-500 group-hover:-translate-y-1">{card.title}</h4>
//                     <p className="text-white/70 text-sm transition-transform duration-500 group-hover:-translate-y-1">{card.desc}</p>
//                   </div>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* The Crew Collective */}
//       <section className="py-20 md:py-24 bg-[#F1CB81] relative overflow-hidden">
//         <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233C291C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//         }}></div>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 relative z-10">
//           <Reveal>
//             <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
//               <div className="max-w-2xl">
//                 <span className="inline-block px-4 py-1 rounded-full bg-[#3C291C] text-[#F1CB81] font-bold text-sm uppercase tracking-wider mb-4">The Crew Collective</span>
//                 <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#3C291C]">Hire the <span className="italic">pros</span> who make it happen.</h2>
//                 <p className="text-base md:text-lg text-[#3C291C]/70">Don't just book a space—build your dream team.</p>
//               </div>
//               <Link href="/services" className="group flex items-center gap-2 text-[#3C291C] font-bold text-sm uppercase shrink-0 border-2 border-[#3C291C] px-6 py-3 rounded-full hover:bg-[#3C291C] hover:text-[#F1CB81] hover:shadow-lg transition-all duration-300">
//                 Browse all pros <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//               </Link>
//             </div>
//           </Reveal>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { title: 'Photographers', subtitle: 'Editorial & Commercial', image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=600', stat: '2,400+ available' },
//               { title: 'Videographers', subtitle: 'DPs & Drone Pilots', image: 'https://images.unsplash.com/photo-1585646794396-3c34d6f3ea4e?auto=format&fit=crop&q=80&w=600', stat: '1,800+ available' },
//               { title: 'HMU Artists', subtitle: 'Beauty & SFX', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600', stat: '950+ available' },
//               { title: 'Studio Support', subtitle: 'PAs & Set Builders', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600', stat: '1,200+ available' },
//             ].map((service, i) => (
//               <Reveal key={i} delay={i * 100}>
//                 <div className="group cursor-pointer">
//                   <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4] bg-[#3C291C]/5 shadow-md group-hover:shadow-2xl transition-shadow duration-500">
//                     <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 group-hover:scale-105" />
//                     <div className="absolute inset-0 bg-gradient-to-t from-[#3C291C]/90 via-[#3C291C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
//                       <p className="text-white/90 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{service.subtitle}</p>
//                       <p className="text-[#F1CB81] text-xs font-bold mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">{service.stat}</p>
//                     </div>
//                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
//                       <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
//                         <span className="material-symbols-outlined text-[#3C291C] text-lg">arrow_forward</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-extrabold text-[#3C291C] group-hover:text-[#DB8B8C] transition-colors">{service.title}</h4>
//                     <p className="text-sm text-[#3C291C]/60">{service.subtitle}</p>
//                   </div>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//           <Reveal delay={150}>
//             <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t-2 border-[#3C291C]/20 pt-8">
//               {[
//                 { value: 6350, suffix: '+', label: 'Vetted Professionals' },
//                 { value: 98, suffix: '%', label: 'Client Satisfaction' },
//                 { value: 48, suffix: 'h', label: 'Avg. Response Time' },
//                 { value: 50, suffix: '+', label: 'Creative Categories' },
//               ].map((stat, i) => (
//                 <div key={i} className="text-center hover:-translate-y-1 transition-transform duration-300">
//                   <p className="text-2xl md:text-3xl font-extrabold text-[#3C291C]">
//                     <CountUp end={stat.value} suffix={stat.suffix} />
//                   </p>
//                   <p className="text-sm text-[#3C291C]/60 font-medium mt-1">{stat.label}</p>
//                 </div>
//               ))}
//             </div>
//           </Reveal>
//         </div>
//       </section>

//       {/* Before/After */}
//       <section className="py-20 md:py-24 bg-[#DB8B8C]/10">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Reveal>
//               <div className="bg-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center border-2 border-[#3C291C]/10 h-full">
//                 <span className="text-sm font-bold text-[#3C291C]/60 uppercase mb-8">Before ManyRooms</span>
//                 <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#3C291C]">All work<br/>and no play.</h2>
//                 <ul className="w-full space-y-6 text-left">
//                   {['Manual booking coordination.', 'Hidden studio fees.', 'Inconsistent space matching.', 'Slow creative output.'].map((item) => (
//                     <li key={item} className="flex items-center justify-between border-b border-[#3C291C]/10 pb-4">
//                       <span className="text-lg font-bold text-[#3C291C]">{item}</span>
//                       <span className="material-symbols-outlined text-[#DB8B8C]">close</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </Reveal>
//             <Reveal delay={150}>
//               <div className="bg-[#3C291C] text-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden h-full">
//                 <div className="absolute top-0 right-0 p-8">
//                   <span className="material-symbols-outlined text-[#F1CB81] text-6xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
//                 </div>
//                 <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#F1CB81]/10 blur-3xl animate-float-slow pointer-events-none"></div>
//                 <span className="text-sm font-bold text-[#F1CB81] uppercase mb-8 relative z-10">After ManyRooms</span>
//                 <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white relative z-10">Less grind<br/>and more pay.</h2>
//                 <ul className="w-full space-y-6 text-left relative z-10">
//                   {['Auto-pilot studio management.', 'Transparent fixed pricing.', 'Smart space matching.', '24/7 revenue generation.'].map((item) => (
//                     <li key={item} className="flex items-center justify-between border-b border-white/10 pb-4">
//                       <span className="text-lg font-bold">{item}</span>
//                       <span className="material-symbols-outlined text-[#F1CB81]">check_circle</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <Link href="/signup" className="btn-shine mt-12 w-full bg-[#F1CB81] text-[#3C291C] py-5 rounded-2xl font-extrabold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-[#F1CB81]/30 transition-all duration-300 relative z-10 text-center">Get Started for Free</Link>
//               </div>
//             </Reveal>
//           </div>
//         </div>
//       </section>

//       {/* Steps */}
//       <section className="py-20 md:py-24 bg-white">
//         <Reveal>
//           <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center mb-12 md:mb-16">
//             <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#3C291C]">Get up and running in <span className="italic text-[#DB8B8C]">3 simple steps</span>.</h2>
//           </div>
//         </Reveal>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
//           {[
//             { icon: 'add_photo_alternate', title: 'List your space', desc: 'Upload photos and define your hours. Takes less than 5 minutes.', bg: 'bg-[#91ADCD]/30' },
//             { icon: 'smart_toy', title: 'Automate bookings', desc: 'Let our AI handle inquiries and scheduling while you create.', bg: 'bg-[#F1CB81]' },
//             { icon: 'account_balance_wallet', title: 'Collect revenue', desc: 'Instant payouts directly to your account. No chasing invoices.', bg: 'bg-[#DB8B8C]/30' },
//           ].map((step, i) => (
//             <Reveal key={i} delay={i * 130}>
//               <div className="flex flex-col items-center gap-5 text-center group">
//                 <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${step.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-md group-hover:shadow-xl`}>
//                   <span className="material-symbols-outlined text-3xl md:text-4xl text-[#3C291C]" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
//                 </div>
//                 <h3 className="text-xl md:text-2xl font-bold text-[#3C291C]">{step.title}</h3>
//                 <p className="text-base md:text-lg text-[#3C291C]/70 max-w-xs">{step.desc}</p>
//               </div>
//             </Reveal>
//           ))}
//         </div>
//       </section>

//       {/* Featured Studios */}
//       <section className="py-20 md:py-24 bg-[#F1CB81]/20 overflow-hidden">
//         <Reveal>
//           <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex justify-between items-end mb-10 md:mb-12">
//             <h2 className="text-2xl md:text-3xl font-bold text-[#3C291C]">Featured Studios <span className="text-[#3C291C] bg-[#F1CB81] px-3 py-1 rounded-lg text-sm">New This Week</span></h2>
//             <div className="flex gap-2">
//               <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#3C291C]/20 flex items-center justify-center hover:bg-white hover:-translate-x-0.5 transition-all">
//                 <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-[#3C291C]" />
//               </button>
//               <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#3C291C]/20 flex items-center justify-center hover:bg-white hover:translate-x-0.5 transition-all">
//                 <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-[#3C291C]" />
//               </button>
//             </div>
//           </div>
//         </Reveal>
//         <div className="flex gap-5 px-4 md:px-16 overflow-x-auto pb-4 scrollbar-hide">
//           {loading ? (
//             [...Array(3)].map((_, i) => (
//               <div key={i} className="min-w-[300px] md:min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-md flex-shrink-0">
//                 <div className="h-52 md:h-64 skeleton-shimmer"></div>
//                 <div className="p-5 md:p-6 space-y-3">
//                   <div className="h-5 w-2/3 rounded-md skeleton-shimmer"></div>
//                   <div className="h-4 w-1/2 rounded-md skeleton-shimmer"></div>
//                   <div className="flex gap-2 pt-1">
//                     <div className="h-6 w-16 rounded-md skeleton-shimmer"></div>
//                     <div className="h-6 w-16 rounded-md skeleton-shimmer"></div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             featuredSpaces.map((space, i) => {
//               const coverImage = getFirstImage(space.images);
//               return (
//                 <Reveal key={space.id} delay={i * 90} className="min-w-[300px] md:min-w-[380px] flex-shrink-0 snap-start">
//                   <Link href={`/spaces/${space.id}`} className="group block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-[#3C291C]/10 hover:-translate-y-1.5 transition-all duration-400">
//                     <div className="h-52 md:h-64 relative overflow-hidden">
//                       {coverImage ? (
//                         <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverImage} alt={space.name} />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-[#3C291C]/5"><span className="material-symbols-outlined text-4xl text-[#3C291C]/20">image</span></div>
//                       )}
//                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm group-hover:scale-105 transition-transform">
//                         <StarIcon className="w-4 h-4 text-[#F1CB81] fill-current" /><span className="font-bold text-sm text-[#3C291C]">4.9</span>
//                       </div>
//                     </div>
//                     <div className="p-5 md:p-6">
//                       <div className="flex justify-between items-start mb-2">
//                         <h5 className="text-lg md:text-xl font-bold text-[#3C291C] group-hover:text-[#DB8B8C] transition-colors">{space.name}</h5>
//                         <p className="font-bold text-[#DB8B8C] text-sm">${space.hourly_rate}/hr</p>
//                       </div>
//                       <p className="text-[#3C291C]/60 text-sm mb-4 flex items-center gap-1"><MapPinIcon className="w-4 h-4" />{space.city || 'Location'}{space.state ? `, ${space.state}` : ''}</p>
//                       <div className="flex gap-2">
//                         <span className="px-2 py-1 bg-[#F1CB81]/20 rounded-md text-xs font-bold text-[#3C291C]">#Creative</span>
//                         <span className="px-2 py-1 bg-[#91ADCD]/20 rounded-md text-xs font-bold text-[#3C291C]">#Studio</span>
//                       </div>
//                     </div>
//                   </Link>
//                 </Reveal>
//               );
//             })
//           )}
//         </div>
//       </section>

//       <Footer />
//       <Chatbot />

//       <style jsx>{`
//         @keyframes messageIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-message { animation: messageIn 0.4s ease-out forwards; }
//         .chat-container::-webkit-scrollbar { display: none; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

//         @keyframes scrollRight {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-scroll-right { animation: scrollRight 50s linear infinite; }
//         .hover\\:pause-animation:hover { animation-play-state: paused; }

//         /* Scroll reveal */
//         .reveal {
//           opacity: 0;
//           transform: translateY(28px);
//           transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
//         }
//         .reveal-visible { opacity: 1; transform: translateY(0); }

//         /* Ambient floating orbs */
//         @keyframes floatSlow {
//           0%, 100% { transform: translate(0, 0); }
//           50% { transform: translate(15px, -30px); }
//         }
//         @keyframes floatSlower {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(25px); }
//         }
//         .animate-float-slow { animation: floatSlow 9s ease-in-out infinite; }
//         .animate-float-slower { animation: floatSlower 12s ease-in-out infinite; }

//         /* Phone gentle bob */
//         @keyframes floatPhone {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-14px); }
//         }
//         .animate-float-phone { animation: floatPhone 6s ease-in-out infinite; }

//         /* Hero Ken Burns */
//         @keyframes kenburns {
//           0% { transform: scale(1); }
//           100% { transform: scale(1.08); }
//         }
//         .animate-kenburns { animation: kenburns 22s ease-in-out infinite alternate; }

//         /* Badge / dot pulse in brand yellow */
//         @keyframes pulseRing {
//           0% { box-shadow: 0 0 0 0 rgba(241, 203, 129, 0.55); }
//           70% { box-shadow: 0 0 0 10px rgba(241, 203, 129, 0); }
//           100% { box-shadow: 0 0 0 0 rgba(241, 203, 129, 0); }
//         }
//         .pulse-dot { animation: pulseRing 2.2s infinite; border-radius: 9999px; }

//         /* Button shine sweep */
//         .btn-shine { position: relative; overflow: hidden; }
//         .btn-shine::after {
//           content: '';
//           position: absolute;
//           top: 0; left: 0;
//           width: 40%; height: 100%;
//           background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
//           transform: translateX(-150%) skewX(-20deg);
//         }
//         .btn-shine:hover::after {
//           animation: shine 0.9s ease forwards;
//         }
//         @keyframes shine {
//           to { transform: translateX(280%) skewX(-20deg); }
//         }

//         /* Shimmer skeleton loaders in brand yellow */
//         .skeleton-shimmer {
//           background: linear-gradient(90deg, rgba(241,203,129,0.18) 25%, rgba(241,203,129,0.38) 37%, rgba(241,203,129,0.18) 63%);
//           background-size: 400% 100%;
//           animation: shimmerMove 1.4s ease infinite;
//         }
//         @keyframes shimmerMove {
//           0% { background-position: 100% 50%; }
//           100% { background-position: 0 50%; }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .reveal, .animate-float-slow, .animate-float-slower, .animate-float-phone,
//           .animate-kenburns, .pulse-dot, .btn-shine::after, .skeleton-shimmer,
//           .animate-scroll-right, .animate-message {
//             animation: none !important;
//             transition: none !important;
//             opacity: 1 !important;
//             transform: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }



// // app/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   Bars3Icon,
//   XMarkIcon,
//   StarIcon,
//   MapPinIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';
// import './home.css';

// // Brand Colors
// const brand = {
//   yellow: '#F1CB81',
//   blue: '#91ADCD',
//   brown: '#DB8B8C',
//   dark: '#3C291C',
// };

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
// }

// interface ChatMessage {
//   text: string;
//   type: 'user' | 'owner';
// }

// export default function HomePage() {
//   const router = useRouter();
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [phoneMessages, setPhoneMessages] = useState<ChatMessage[]>([]);
//   const [scrolled, setScrolled] = useState(false);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   // Search states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchLocation, setSearchLocation] = useState('');
//   const [isSearching, setIsSearching] = useState(false);

//   const chatSequence: ChatMessage[] = [
//     { text: "Hi! Is the studio available for a 4-hour shoot this Friday?", type: "user" },
//     { text: "Hey! Yes, we have a slot from 2 PM - 6 PM. Want me to book you in?", type: "owner" },
//     { text: "Perfect, sending the request now! 🚀", type: "user" },
//   ];

//   // const allReviews = [
//   //   { text: "ManyRooms transformed how we book studio spaces. The search is incredibly accurate and saves us hours every week.", name: "Sarah Chen", role: "Creative Director, Vogue", initials: "SC" },
//   //   { text: "I've saved countless hours on booking coordination. The automation is a game-changer for our production team.", name: "Marcus Thorne", role: "Editorial Photographer", initials: "MT" },
//   //   { text: "The quality of studios on this platform is unmatched. Every space I've booked has exceeded expectations.", name: "Elena Rodriguez", role: "Independent Filmmaker", initials: "ER" },
//   //   { text: "Finally, a platform that understands creative professionals. The booking process is seamless.", name: "James Wilson", role: "Art Director, Nike", initials: "JW" },
//   //   { text: "From podcast studios to photography lofts, ManyRooms has every space we need for our productions.", name: "Amara Okafor", role: "Content Creator", initials: "AO" },
//   //   { text: "The matching is scary good. It found exactly the industrial loft we needed for our campaign shoot.", name: "David Park", role: "Creative Lead, Adobe", initials: "DP" },
//   //   { text: "We've increased our studio bookings by 300% since listing on ManyRooms. Best decision ever.", name: "Lisa Thompson", role: "Studio Owner, DTLA", initials: "LT" },
//   //   { text: "Transparent pricing and instant booking confirmations make my job so much easier. Highly recommend!", name: "Alex Rivera", role: "Production Manager", initials: "AR" },
//   //   { text: "I love messaging studio owners directly and getting quick responses. No more endless email chains!", name: "Nina Patel", role: "Fashion Photographer", initials: "NP" },
//   //   { text: "ManyRooms has become essential to our creative workflow. Can't imagine working without it.", name: "Chris Mendoza", role: "Music Producer", initials: "CM" },
//   //   { text: "The curated categories are spot on. Found a brutalist loft perfect for our streetwear shoot.", name: "Keisha Williams", role: "Brand Strategist", initials: "KW" },
//   //   { text: "As a studio owner, the dashboard gives me complete control. Managing bookings has never been smoother.", name: "Robert Kim", role: "Studio Owner, Brooklyn", initials: "RK" },
//   // ];


//   const allReviews = [
//   { 
//     text: "ManyRooms transformed how we book studio spaces. The search is incredibly accurate!", 
//     name: "Sarah Chen", 
//     role: "Creative Director, Vogue", 
//     initials: "SC",
//     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "I've saved countless hours on booking coordination. The automation is a game-changer.", 
//     name: "Marcus Thorne", 
//     role: "Editorial Photographer", 
//     initials: "MT",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "The quality of studios on this platform is unmatched. Every space exceeds expectations.", 
//     name: "Elena Rodriguez", 
//     role: "Independent Filmmaker", 
//     initials: "ER",
//     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "Finally, a platform that understands creative professionals. Booking is seamless.", 
//     name: "James Wilson", 
//     role: "Art Director, Nike", 
//     initials: "JW",
//     avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "From podcast studios to photo lofts, ManyRooms has every space we need.", 
//     name: "Amara Okafor", 
//     role: "Content Creator", 
//     initials: "AO",
//     avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "The matching is scary good. Found exactly the industrial loft we needed.", 
//     name: "David Park", 
//     role: "Creative Lead, Adobe", 
//     initials: "DP",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "We've increased studio bookings by 300% since listing on ManyRooms.", 
//     name: "Lisa Thompson", 
//     role: "Studio Owner, DTLA", 
//     initials: "LT",
//     avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "Transparent pricing and instant confirmations make my job so much easier!", 
//     name: "Alex Rivera", 
//     role: "Production Manager", 
//     initials: "AR",
//     avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "I love messaging studio owners directly. No more endless email chains!", 
//     name: "Nina Patel", 
//     role: "Fashion Photographer", 
//     initials: "NP",
//     avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "ManyRooms is essential to our creative workflow. Can't imagine working without it.", 
//     name: "Chris Mendoza", 
//     role: "Music Producer", 
//     initials: "CM",
//     avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "The curated categories are spot on. Found a brutalist loft perfect for our shoot.", 
//     name: "Keisha Williams", 
//     role: "Brand Strategist", 
//     initials: "KW",
//     avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&q=80&w=150"
//   },
//   { 
//     text: "As a studio owner, the dashboard gives me complete control. So smooth.", 
//     name: "Robert Kim", 
//     role: "Studio Owner, Brooklyn", 
//     initials: "RK",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
//   },
// ];

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
//     let timeoutIds: NodeJS.Timeout[] = [];
//     const animateMessages = async () => {
//       setPhoneMessages([]);
//       for (const msg of chatSequence) {
//         if (!isMounted) return;
//         await new Promise<void>(resolve => {
//           const id = setTimeout(() => { setPhoneMessages(prev => [...prev, msg]); resolve(); }, 1500);
//           timeoutIds.push(id);
//         });
//       }
//       if (isMounted) {
//         const id = setTimeout(() => animateMessages(), 3500);
//         timeoutIds.push(id);
//       }
//     };
//     animateMessages();
//     return () => { isMounted = false; timeoutIds.forEach(clearTimeout); };
//   }, []);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
//     }
//   }, [phoneMessages]);

//   useEffect(() => { fetchApprovedStudios(); setTimeout(() => setIsVisible(true), 100); }, []);

//   useEffect(() => {
//     document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
//     return () => { document.body.style.overflow = 'unset'; };
//   }, [isMobileMenuOpen]);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.from('studios').select('*').eq('status', 'approved').limit(6);
//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) { console.error('Error fetching studios:', error); }
//     finally { setLoading(false); }
//   };

//   const getFirstImage = (images: string[]) => (!images || images.length === 0 ? null : images[0]);

//   // Search function - searches by query, location, and country
//   const handleSearch = async (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (!searchQuery.trim() && !searchLocation.trim()) return;
    
//     setIsSearching(true);
    
//     try {
//       let query = supabase.from('studios').select('*').eq('status', 'approved');
      
//       // Search by name or description matching the query
//       if (searchQuery.trim()) {
//         query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%,city.ilike.%${searchQuery.trim()}%`);
//       }
      
//       // Filter by location/country
//       if (searchLocation.trim()) {
//         const locLower = searchLocation.trim().toLowerCase();
//         query = query.or(`city.ilike.%${locLower}%,state.ilike.%${locLower}%,country.ilike.%${locLower}%`);
//       }
      
//       query = query.limit(20);
      
//       const { data, error } = await query;
      
//       if (error) throw error;
      
//       // Store results and navigate to spaces page with search params
//       const params = new URLSearchParams();
//       if (searchQuery.trim()) params.set('q', searchQuery.trim());
//       if (searchLocation.trim()) params.set('location', searchLocation.trim());
      
//       router.push(`/spaces?${params.toString()}`);
//     } catch (error) {
//       console.error('Search error:', error);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   return (
//     <div className="home-page bg-[#FFFBF5] text-[#3C291C] overflow-x-hidden">
      
//       {/* Navigation */}
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-[#3C291C]/10 shadow-sm' : 'bg-transparent'
//       }`}>
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <span className={`text-xl md:text-2xl font-extrabold tracking-tighter transition-colors ${scrolled ? 'text-[#3C291C]' : 'text-white'}`}>
//                 Many<span className="text-[#F1CB81]">Rooms</span>
//               </span>
//             </Link>
//             <div className="hidden lg:flex gap-6 items-center">
//               {['Marketplace', 'Studios', 'Spaces', 'Journal', 'Services'].map((item) => (
//                 <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} 
//                   className={`py-1 font-bold text-sm transition-colors ${
//                     scrolled ? 'text-[#3C291C]/70 hover:text-[#3C291C]' : 'text-white/80 hover:text-white'
//                   } ${item === 'Marketplace' && scrolled ? 'border-b-2 border-[#DB8B8C]' : ''} ${item === 'Marketplace' && !scrolled ? 'border-b-2 border-[#F1CB81]' : ''}`}
//                 >{item}</Link>
//               ))}
//             </div>
//           </div>
//           <div className="flex items-center gap-3 md:gap-4">
//             <Link href="/signup?role=owner" className="hidden md:block px-6 py-2 bg-[#F1CB81] text-[#3C291C] font-bold text-sm rounded-full hover:bg-[#DB8B8C] hover:text-white transition-all">List Your Space</Link>
//             <div className="hidden md:flex items-center gap-3">
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-105 transition-transform ${scrolled ? 'text-[#3C291C]' : 'text-white/80'}`}>favorite</span>
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-105 transition-transform ${scrolled ? 'text-[#3C291C]' : 'text-white/80'}`}>account_circle</span>
//             </div>
//             <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 rounded-full ${scrolled ? 'hover:bg-gray-100 text-[#3C291C]' : 'text-white hover:bg-white/10'}`}>
//               <Bars3Icon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
//         <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-[#3C291C]">ManyRooms</span>
//               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><XMarkIcon className="w-6 h-6 text-[#3C291C]" /></button>
//             </div>
//             <nav className="flex flex-col gap-6">
//               {['Marketplace', 'Studios', 'Spaces', 'Journal', 'Services'].map((item) => (
//                 <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} className="text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C]" onClick={() => setIsMobileMenuOpen(false)}>{item}</Link>
//               ))}
//               <div className="border-t border-gray-200 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Your Space</Link>
//                 <Link href="/login" className="block text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#3C291C]">
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000"
//             alt="Creative studio space"
//             className="w-full h-full object-cover opacity-60"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-[#3C291C] via-[#3C291C]/80 to-transparent"></div>
//         </div>

//         <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
//           <div className="lg:col-span-7 flex flex-col items-start gap-6">
//             <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <span className="inline-block px-4 py-1 rounded-full bg-[#F1CB81] text-[#3C291C] font-bold text-sm uppercase tracking-wider mb-4">The Creative Evolution</span>
//               <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-white tracking-tighter">
//                 Space <span className="text-[#F1CB81] italic">smarter</span>,<br/>not harder.
//               </h1>
//             </div>
//             <p className={`text-lg text-white/80 max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
//             </p>
            
//             {/* Search Bar - Full working search */}
//             <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-[32px] flex flex-col md:flex-row items-stretch md:items-center gap-2 shadow-xl">
//                 <div className="flex-grow flex items-center px-4">
//                   <MagnifyingGlassIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
//                   <input 
//                     className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60" 
//                     placeholder="Describe the aesthetic (e.g. '70s synth-wave desert loft')" 
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>
//                 <div className="hidden md:block w-px h-8 bg-white/20"></div>
//                 <div className="flex-grow flex items-center px-4">
//                   <MapPinIcon className="w-5 h-5 text-[#F1CB81] mr-3 flex-shrink-0" />
//                   <input 
//                     className="w-full bg-transparent border-none focus:ring-0 text-base outline-none text-white placeholder:text-white/60" 
//                     placeholder="Location or country" 
//                     type="text"
//                     value={searchLocation}
//                     onChange={(e) => setSearchLocation(e.target.value)}
//                   />
//                 </div>
//                 <button 
//                   type="submit"
//                   disabled={isSearching}
//                   className="bg-[#F1CB81] text-[#3C291C] px-8 py-4 rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-[#DB8B8C] hover:text-white transition-all whitespace-nowrap disabled:opacity-50"
//                 >
//                   <MagnifyingGlassIcon className="w-4 h-4" />
//                   {isSearching ? 'Searching...' : 'Search'}
//                 </button>
//               </form>
//               <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
//                 <span className="text-white/60 text-sm font-bold">Popular:</span>
//                 <button onClick={() => { setSearchQuery('photography studio'); setSearchLocation('London'); handleSearch(); }} className="text-[#F1CB81] hover:underline text-sm">#PhotographyStudios</button>
//                 <button onClick={() => { setSearchQuery('music recording'); handleSearch(); }} className="text-[#F1CB81] hover:underline text-sm">#MusicRooms</button>
//                 <button onClick={() => { setSearchQuery('podcast space'); handleSearch(); }} className="text-[#F1CB81] hover:underline text-sm">#PodcastSpaces</button>
//               </div>
//             </div>
//           </div>

//           {/* Phone Mockup */}
//           <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[650px]">
//             <div className="w-72 h-[580px] bg-[#3C291C] rounded-[3rem] border-[12px] border-[#3C291C]/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
//               <div className="h-10 bg-[#3C291C]/90 flex justify-center items-end pb-1"><div className="w-20 h-4 bg-[#3C291C]/60 rounded-full"></div></div>
//               <div className="flex-grow bg-[#FFFBF5] p-4 flex flex-col overflow-hidden">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#3C291C]/10">
//                   <div className="w-10 h-10 rounded-full bg-[#F1CB81] flex items-center justify-center text-[#3C291C]"><span className="material-symbols-outlined">person</span></div>
//                   <div>
//                     <div className="font-bold text-[#3C291C] text-sm">Studio Manager</div>
//                     <div className="text-[10px] text-green-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span> Online</div>
//                   </div>
//                 </div>
//                 <div ref={chatContainerRef} className="flex flex-col gap-4 overflow-y-auto flex-grow chat-container" style={{ scrollbarWidth: 'none' }}>
//                   {phoneMessages.map((msg, idx) => (
//                     <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-message`}>
//                       <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs font-medium shadow-sm ${msg.type === 'user' ? 'bg-[#91ADCD]/30 text-[#3C291C] rounded-tr-none' : 'bg-[#F1CB81] text-[#3C291C] rounded-tl-none'}`}>{msg.text}</div>
//                     </div>
//                   ))}
//                   {phoneMessages.length === 0 && <div className="flex items-center justify-center h-full text-[#3C291C]/40 text-xs">Loading...</div>}
//                 </div>
//               </div>
//               <div className="h-16 bg-white p-3 border-t border-[#3C291C]/10 flex items-center gap-2">
//                 <div className="flex-grow h-8 bg-[#3C291C]/5 rounded-full px-4 text-[10px] flex items-center text-[#3C291C]/40">Message...</div>
//                 <div className="w-8 h-8 rounded-full bg-[#F1CB81] flex items-center justify-center text-[#3C291C]"><span className="material-symbols-outlined text-sm">send</span></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Reviews Section */}
//       {/* <section className="py-16 md:py-20 bg-white overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 mb-10">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="inline-block px-3 py-1 rounded-full bg-[#F1CB81]/30 text-[#3C291C] font-bold text-xs uppercase tracking-wider">★ Trusted by Creators</span>
//               </div>
//               <h3 className="text-3xl md:text-4xl font-extrabold text-[#3C291C]">
//                 What our <span className="text-[#DB8B8C] italic">community</span> says
//               </h3>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex -space-x-2">
//                 {[1,2,3,4,5].map(i => (
//                   <div key={i} className="w-9 h-9 rounded-full bg-[#F1CB81] border-2 border-white flex items-center justify-center text-xs font-bold text-[#3C291C] shadow-sm">★</div>
//                 ))}
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-[#3C291C]">4.9 out of 5</p>
//                 <p className="text-xs text-[#3C291C]/60">from 2,000+ reviews</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-5 animate-scroll-right hover:pause-animation pb-4">
//           {[...allReviews, ...allReviews].map((review, i) => (
//             <div key={`review-${i}`} className="min-w-[320px] md:min-w-[380px] bg-white rounded-2xl p-6 border-2 border-[#3C291C]/10 hover:border-[#F1CB81]/60 transition-all duration-300 flex-shrink-0 flex flex-col justify-between">
//               <div className="flex items-center gap-0.5 mb-4">
//                 {[...Array(5)].map((_, s) => (
//                   <span key={s} className="material-symbols-outlined text-[#F1CB81] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//                 ))}
//               </div>
//               <p className="text-[#3C291C] text-sm leading-relaxed mb-5 flex-grow">"{review.text}"</p>
//               <div className="flex items-center gap-3 pt-4 border-t border-[#3C291C]/10">
//                 <div className="w-10 h-10 rounded-full bg-[#F1CB81]/30 flex items-center justify-center font-bold text-sm text-[#3C291C] shrink-0">{review.initials}</div>
//                 <div className="min-w-0">
//                   <p className="font-bold text-sm text-[#3C291C] truncate">{review.name}</p>
//                   <p className="text-xs text-[#3C291C]/60 truncate">{review.role}</p>
//                 </div>
//                 <span className="material-symbols-outlined text-[#F1CB81] ml-auto text-lg shrink-0">format_quote</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section> */}

//       {/* Reviews Section */}
// <section className="py-16 md:py-20 bg-white overflow-hidden">
//   <div className="max-w-[1440px] mx-auto px-4 md:px-16 mb-10">
//     <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//       <div>
//         <div className="flex items-center gap-2 mb-2">
//           <span className="inline-block px-3 py-1 rounded-full bg-[#F1CB81]/30 text-[#3C291C] font-bold text-xs uppercase tracking-wider">★ Trusted by Creators</span>
//         </div>
//         <h3 className="text-3xl md:text-4xl font-extrabold text-[#3C291C]">
//           What our <span className="text-[#DB8B8C] italic">community</span> says
//         </h3>
//       </div>
//       <div className="flex items-center gap-3">
//         <div className="flex -space-x-2">
//           {[1,2,3,4,5].map(i => (
//             <div key={i} className="w-9 h-9 rounded-full bg-[#F1CB81] border-2 border-white flex items-center justify-center text-xs font-bold text-[#3C291C] shadow-sm">★</div>
//           ))}
//         </div>
//         <div>
//           <p className="text-sm font-bold text-[#3C291C]">4.9 out of 5</p>
//           <p className="text-xs text-[#3C291C]/60">from 2,000+ reviews</p>
//         </div>
//       </div>
//     </div>
//   </div>
  
//   <div className="flex gap-4 animate-scroll-right hover:pause-animation pb-4 px-4">
//     {[...allReviews, ...allReviews].map((review, i) => (
//       <div 
//         key={`review-${i}`} 
//         className="min-w-[260px] max-w-[260px] md:min-w-[300px] md:max-w-[300px] bg-white rounded-2xl p-5 border-2 border-[#3C291C]/10 hover:border-[#F1CB81]/60 hover:shadow-lg transition-all duration-300 flex-shrink-0 flex flex-col"
//       >
//         {/* Stars */}
//         <div className="flex items-center gap-0.5 mb-3">
//           {[...Array(5)].map((_, s) => (
//             <span key={s} className="material-symbols-outlined text-[#F1CB81] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
//           ))}
//         </div>
        
//         {/* Review Text */}
//         <p className="text-[#3C291C] text-xs leading-relaxed mb-4 flex-grow line-clamp-4">
//           "{review.text}"
//         </p>
        
//         {/* Reviewer Info with Image */}
//         <div className="flex items-center gap-2.5 pt-3 border-t border-[#3C291C]/10">
//           <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#F1CB81]/20">
//             {review.avatar ? (
//               <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#3C291C] bg-[#F1CB81]/30">
//                 {review.initials}
//               </div>
//             )}
//           </div>
//           <div className="min-w-0 flex-1">
//             <p className="font-bold text-xs text-[#3C291C] truncate">{review.name}</p>
//             <p className="text-[10px] text-[#3C291C]/50 truncate">{review.role}</p>
//           </div>
//           <span className="material-symbols-outlined text-[#F1CB81] text-base shrink-0">format_quote</span>
//         </div>
//       </div>
//     ))}
//   </div>
// </section>

//       {/* Everywhere Section */}
//       <section className="py-20 md:py-24 bg-[#91ADCD]/10">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
//             <div className="max-w-2xl">
//               <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#3C291C]">Everywhere your <span className="text-[#DB8B8C]">vision</span> lives.</h2>
//               <p className="text-base md:text-lg text-[#3C291C]/70">The most sophisticated network of creative square footage on the planet.</p>
//             </div>
//             <Link href="/spaces" className="group flex items-center gap-2 text-[#3C291C] font-bold text-sm uppercase shrink-0 border-2 border-[#3C291C] px-5 py-2.5 rounded-full hover:bg-[#3C291C] hover:text-white transition-all">
//               Explore all <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
//             {[
//               { image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800', badge: 'Music & Podcast', badgeColor: 'bg-[#F1CB81] text-[#3C291C]', title: 'Recording Studios', desc: 'Acoustically perfect environments.' },
//               { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', badge: 'Photo & Film', badgeColor: 'bg-[#91ADCD] text-[#3C291C]', title: 'Visual Arts Spaces', desc: 'Natural light lofts and cyc walls.' },
//               { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', badge: 'Creative Hubs', badgeColor: 'bg-[#DB8B8C] text-white', title: 'Design & Pop-ups', desc: 'Dynamic spaces for teams.' },
//             ].map((card, i) => (
//               <div key={i} className="group relative rounded-[32px] overflow-hidden h-[400px] md:h-[500px] shadow-xl hover:-translate-y-2 transition-transform duration-500 min-w-[85vw] md:min-w-0 snap-center flex-shrink-0">
//                 <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={card.image} alt={card.title} />
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#3C291C]/90 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
//                   <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs mb-3 md:mb-4 uppercase ${card.badgeColor}`}>{card.badge}</span>
//                   <h4 className="text-white text-xl md:text-2xl font-bold mb-2">{card.title}</h4>
//                   <p className="text-white/70 text-sm">{card.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* The Crew Collective */}
//       <section className="py-20 md:py-24 bg-[#F1CB81] relative overflow-hidden">
//         <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233C291C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//         }}></div>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 relative z-10">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
//             <div className="max-w-2xl">
//               <span className="inline-block px-4 py-1 rounded-full bg-[#3C291C] text-[#F1CB81] font-bold text-sm uppercase tracking-wider mb-4">The Crew Collective</span>
//               <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#3C291C]">Hire the <span className="italic">pros</span> who make it happen.</h2>
//               <p className="text-base md:text-lg text-[#3C291C]/70">Don't just book a space—build your dream team.</p>
//             </div>
//             <Link href="/services" className="group flex items-center gap-2 text-[#3C291C] font-bold text-sm uppercase shrink-0 border-2 border-[#3C291C] px-6 py-3 rounded-full hover:bg-[#3C291C] hover:text-[#F1CB81] transition-all duration-300">
//               Browse all pros <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { title: 'Photographers', subtitle: 'Editorial & Commercial', image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=600', stat: '2,400+ available' },
//               { title: 'Videographers', subtitle: 'DPs & Drone Pilots', image: 'https://images.unsplash.com/photo-1585646794396-3c34d6f3ea4e?auto=format&fit=crop&q=80&w=600', stat: '1,800+ available' },
//               { title: 'HMU Artists', subtitle: 'Beauty & SFX', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600', stat: '950+ available' },
//               { title: 'Studio Support', subtitle: 'PAs & Set Builders', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600', stat: '1,200+ available' },
//             ].map((service, i) => (
//               <div key={i} className="group cursor-pointer">
//                 <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4] bg-[#3C291C]/5">
//                   <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 group-hover:scale-105" />
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#3C291C]/90 via-[#3C291C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
//                     <p className="text-white/90 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{service.subtitle}</p>
//                     <p className="text-[#F1CB81] text-xs font-bold mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">{service.stat}</p>
//                   </div>
//                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
//                     <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
//                       <span className="material-symbols-outlined text-[#3C291C] text-lg">arrow_forward</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="text-lg font-extrabold text-[#3C291C] group-hover:text-[#DB8B8C] transition-colors">{service.title}</h4>
//                   <p className="text-sm text-[#3C291C]/60">{service.subtitle}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t-2 border-[#3C291C]/20 pt-8">
//             {[
//               { value: '6,350+', label: 'Vetted Professionals' },
//               { value: '98%', label: 'Client Satisfaction' },
//               { value: '48h', label: 'Avg. Response Time' },
//               { value: '50+', label: 'Creative Categories' },
//             ].map((stat, i) => (
//               <div key={i} className="text-center">
//                 <p className="text-2xl md:text-3xl font-extrabold text-[#3C291C]">{stat.value}</p>
//                 <p className="text-sm text-[#3C291C]/60 font-medium mt-1">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Before/After */}
//       <section className="py-20 md:py-24 bg-[#DB8B8C]/10">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center border-2 border-[#3C291C]/10">
//               <span className="text-sm font-bold text-[#3C291C]/60 uppercase mb-8">Before ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#3C291C]">All work<br/>and no play.</h2>
//               <ul className="w-full space-y-6 text-left">
//                 {['Manual booking coordination.', 'Hidden studio fees.', 'Inconsistent space matching.', 'Slow creative output.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-[#3C291C]/10 pb-4">
//                     <span className="text-lg font-bold text-[#3C291C]">{item}</span>
//                     <span className="material-symbols-outlined text-[#DB8B8C]">close</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="bg-[#3C291C] text-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-8">
//                 <span className="material-symbols-outlined text-[#F1CB81] text-6xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
//               </div>
//               <span className="text-sm font-bold text-[#F1CB81] uppercase mb-8 relative z-10">After ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white relative z-10">Less grind<br/>and more pay.</h2>
//               <ul className="w-full space-y-6 text-left relative z-10">
//                 {['Auto-pilot studio management.', 'Transparent fixed pricing.', 'Smart space matching.', '24/7 revenue generation.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-white/10 pb-4">
//                     <span className="text-lg font-bold">{item}</span>
//                     <span className="material-symbols-outlined text-[#F1CB81]">check_circle</span>
//                   </li>
//                 ))}
//               </ul>
//               <Link href="/signup" className="mt-12 w-full bg-[#F1CB81] text-[#3C291C] py-5 rounded-2xl font-extrabold text-lg hover:scale-105 transition-transform duration-200 relative z-10 text-center">Get Started for Free</Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Steps */}
//       <section className="py-20 md:py-24 bg-white">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center mb-12 md:mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#3C291C]">Get up and running in <span className="italic text-[#DB8B8C]">3 simple steps</span>.</h2>
//         </div>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
//           {[
//             { icon: 'add_photo_alternate', title: 'List your space', desc: 'Upload photos and define your hours. Takes less than 5 minutes.', bg: 'bg-[#91ADCD]/30' },
//             { icon: 'smart_toy', title: 'Automate bookings', desc: 'Let our AI handle inquiries and scheduling while you create.', bg: 'bg-[#F1CB81]' },
//             { icon: 'account_balance_wallet', title: 'Collect revenue', desc: 'Instant payouts directly to your account. No chasing invoices.', bg: 'bg-[#DB8B8C]/30' },
//           ].map((step, i) => (
//             <div key={i} className="flex flex-col items-center gap-5 text-center group">
//               <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${step.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
//                 <span className="material-symbols-outlined text-3xl md:text-4xl text-[#3C291C]" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
//               </div>
//               <h3 className="text-xl md:text-2xl font-bold text-[#3C291C]">{step.title}</h3>
//               <p className="text-base md:text-lg text-[#3C291C]/70 max-w-xs">{step.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Featured Studios */}
//       <section className="py-20 md:py-24 bg-[#F1CB81]/20 overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex justify-between items-end mb-10 md:mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold text-[#3C291C]">Featured Studios <span className="text-[#3C291C] bg-[#F1CB81] px-3 py-1 rounded-lg text-sm">New This Week</span></h2>
//           <div className="flex gap-2">
//             <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#3C291C]/20 flex items-center justify-center hover:bg-white transition-colors">
//               <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-[#3C291C]" />
//             </button>
//             <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#3C291C]/20 flex items-center justify-center hover:bg-white transition-colors">
//               <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-[#3C291C]" />
//             </button>
//           </div>
//         </div>
//         <div className="flex gap-5 px-4 md:px-16 overflow-x-auto pb-4 scrollbar-hide">
//           {loading ? (
//             <div className="flex justify-center w-full py-20"><div className="animate-pulse text-center"><div className="w-16 h-16 bg-[#F1CB81]/40 rounded-full mx-auto mb-4"></div><p className="text-[#3C291C]/60">Loading studios...</p></div></div>
//           ) : (
//             featuredSpaces.map((space) => {
//               const coverImage = getFirstImage(space.images);
//               return (
//                 <Link key={space.id} href={`/spaces/${space.id}`} className="min-w-[300px] md:min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-md group flex-shrink-0 snap-start">
//                   <div className="h-52 md:h-64 relative overflow-hidden">
//                     {coverImage ? (
//                       <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverImage} alt={space.name} />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-[#3C291C]/5"><span className="material-symbols-outlined text-4xl text-[#3C291C]/20">image</span></div>
//                     )}
//                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
//                       <StarIcon className="w-4 h-4 text-[#F1CB81] fill-current" /><span className="font-bold text-sm text-[#3C291C]">4.9</span>
//                     </div>
//                   </div>
//                   <div className="p-5 md:p-6">
//                     <div className="flex justify-between items-start mb-2">
//                       <h5 className="text-lg md:text-xl font-bold text-[#3C291C]">{space.name}</h5>
//                       <p className="font-bold text-[#DB8B8C] text-sm">${space.hourly_rate}/hr</p>
//                     </div>
//                     <p className="text-[#3C291C]/60 text-sm mb-4 flex items-center gap-1"><MapPinIcon className="w-4 h-4" />{space.city || 'Location'}{space.state ? `, ${space.state}` : ''}</p>
//                     <div className="flex gap-2">
//                       <span className="px-2 py-1 bg-[#F1CB81]/20 rounded-md text-xs font-bold text-[#3C291C]">#Creative</span>
//                       <span className="px-2 py-1 bg-[#91ADCD]/20 rounded-md text-xs font-bold text-[#3C291C]">#Studio</span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })
//           )}
//         </div>
//       </section>

//       <Footer />
//       <Chatbot />

//       <style jsx>{`
//         @keyframes messageIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-message { animation: messageIn 0.4s ease-out forwards; }
//         .chat-container::-webkit-scrollbar { display: none; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
//         @keyframes scrollRight {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-scroll-right { animation: scrollRight 50s linear infinite; }
//         .hover\\:pause-animation:hover { animation-play-state: paused; }
//       `}</style>
//     </div>
//   );
// }

// // app/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   Bars3Icon,
//   XMarkIcon,
//   StarIcon,
//   MapPinIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';
// import './home.css';

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

// interface ChatMessage {
//   text: string;
//   type: 'user' | 'owner';
// }

// export default function HomePage() {
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [phoneMessages, setPhoneMessages] = useState<ChatMessage[]>([]);
//   const [scrolled, setScrolled] = useState(false);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const chatSequence: ChatMessage[] = [
//     { text: "Hi! Is Studio A available for a 4-hour shoot this Friday?", type: "user" },
//     { text: "Hey! Yes, we have a slot from 2 PM - 6 PM. Would you like to book?", type: "owner" },
//     { text: "Perfect, sending the request now! 🚀", type: "user" },
//   ];

//   // Track scroll for nav
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Phone chat animation
//   useEffect(() => {
//     let isMounted = true;
//     let timeoutIds: NodeJS.Timeout[] = [];

//     const animateMessages = async () => {
//       setPhoneMessages([]);
//       for (const msg of chatSequence) {
//         if (!isMounted) return;
//         await new Promise<void>(resolve => {
//           const id = setTimeout(() => { setPhoneMessages(prev => [...prev, msg]); resolve(); }, 1500);
//           timeoutIds.push(id);
//         });
//       }
//       if (isMounted) {
//         const id = setTimeout(() => animateMessages(), 3500);
//         timeoutIds.push(id);
//       }
//     };
//     animateMessages();
//     return () => { isMounted = false; timeoutIds.forEach(clearTimeout); };
//   }, []);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
//     }
//   }, [phoneMessages]);

//   useEffect(() => { fetchApprovedStudios(); setTimeout(() => setIsVisible(true), 100); }, []);

//   useEffect(() => {
//     document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
//     return () => { document.body.style.overflow = 'unset'; };
//   }, [isMobileMenuOpen]);

//   const fetchApprovedStudios = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.from('studios').select('*').eq('status', 'approved').limit(6);
//       if (error) throw error;
//       setFeaturedSpaces(data || []);
//     } catch (error) { console.error('Error fetching studios:', error); }
//     finally { setLoading(false); }
//   };

//   const getFirstImage = (images: string[]) => (!images || images.length === 0 ? null : images[0]);

//   return (
//     <div className="home-page bg-[#f8f9fa] text-[#191c1d] overflow-x-hidden">
      
//       {/* Navigation */}
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm' : 'bg-transparent'
//       }`}>
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-6 md:h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
//                 src={scrolled 
//                   ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCj4l-7dKP6wsFLJVaha-0y6angmGBQIrc_25ZvzO4pYfo99ccX_Ez1Cr3eaBLwN7TpKfnyO2bQjSn2zi9-LvZwbIx095MYCOY5NMW4gv_1xZDjSqd1yOSaZpl9UPmKSQzsq3wUOQRyBffYS8_CHESXwD6FVa7gSAvRkqKad5Z2VLh7D8rkyBc0urG8eBfXgU2XyL9Ohy0_XdDvhHwLburvvSENjkI-jy9_qsIBmEaKAXA32QCjHabBj5ySLxFjbMrCKn3Im8WkmVQ0"
//                   : "https://lh3.googleusercontent.com/aida-public/AB6AXuD5FLM8-4gkEVM-BXx2UavjnDgn6M0FUmJ6Bk1w3CULYHwEX1fOAaY-QphGbvgWSrB3RdVSpj3WrMC49P5iq6kl_vvHgpx_AuSLcJdlbRg09aHWQXJyQam7RlSurFiTj8YJh0OS6zJ-1jzmoj2ULwUcna7EU19o2ir6INe3VobDCmoxjzy0hCxI9hlFSu2xfImBjxGupSYCnc6M2u0WDsUzVSt91gIHe23DbN4VUj7cutX0oFDmtMkhCcFZ0InWTn7MbEKfslaxFyis"
//                 }
//               />
//             </Link>
//             <div className="hidden lg:flex gap-6 items-center">
//               {['Marketplace', 'Studios', 'Vibes', 'Journal', 'Services'].map((item) => (
//                 <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} 
//                   className={`py-1 font-bold text-sm transition-colors ${
//                     scrolled ? 'text-[#424937] hover:text-[#446900]' : 'text-white/80 hover:text-white'
//                   } ${item === 'Marketplace' && scrolled ? 'border-b-2 border-[#446900]' : ''} ${item === 'Marketplace' && !scrolled ? 'border-b-2 border-[#beff5f]' : ''}`}
//                 >{item}</Link>
//               ))}
//             </div>
//           </div>
//           <div className="flex items-center gap-3 md:gap-4">
//             <div className="hidden md:flex relative items-center">
//               <MagnifyingGlassIcon className={`absolute left-3 w-4 h-4 ${scrolled ? 'text-[#737a65]' : 'text-white/60'}`} />
//               <input className={`pl-10 pr-4 py-2 border-none rounded-full w-48 lg:w-64 focus:ring-2 focus:ring-[#beff5f] text-sm outline-none transition-all ${
//                 scrolled ? 'bg-[#f3f4f5] text-[#191c1d]' : 'bg-white/10 text-white placeholder:text-white/50'
//               }`} placeholder="Search by vibe..." type="text" />
//             </div>
//             <Link href="/signup?role=owner" className="hidden md:block px-6 py-2 bg-[#beff5f] text-[#111f00] font-bold text-sm rounded-full hover:brightness-105 transition-all">List Studio</Link>
//             <div className="hidden md:flex items-center gap-3">
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-105 transition-transform ${scrolled ? 'text-[#424937]' : 'text-white/80'}`}>favorite</span>
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-105 transition-transform ${scrolled ? 'text-[#424937]' : 'text-white/80'}`}>account_circle</span>
//             </div>
//             <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 rounded-full ${scrolled ? 'hover:bg-gray-100 text-[#191c1d]' : 'text-white hover:bg-white/10'}`}>
//               <Bars3Icon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
//         <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-[#446900]">ManyRooms</span>
//               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><XMarkIcon className="w-6 h-6 text-[#191c1d]" /></button>
//             </div>
//             <nav className="flex flex-col gap-6">
//               {['Marketplace', 'Studios', 'Vibes', 'Journal', 'Services'].map((item) => (
//                 <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>{item}</Link>
//               ))}
//               <div className="border-t border-gray-200 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Studio</Link>
//                 <Link href="/login" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Hero - NO white fade at bottom, just left gradient */}
//       <header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#0a0a0a]">
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000"
//             alt="Professional photography studio"
//             className="w-full h-full object-cover"
//           />
//           {/* Only left gradient for text readability, NO bottom white fade */}
//           <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20"></div>
//         </div>

//         <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
//           <div className="lg:col-span-7 flex flex-col items-start gap-6">
//             <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <span className="inline-block px-4 py-1 rounded-full bg-[#beff5f] text-[#111f00] font-bold text-sm uppercase tracking-wider mb-4">The Creative Evolution</span>
//               <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-white tracking-tighter drop-shadow-lg">
//                 Space <span className="text-[#beff5f] italic">smarter</span>,<br/>not harder.
//               </h1>
//             </div>
//             <p className={`text-lg text-white/80 max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
//             </p>
//             <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-[32px] flex items-center shadow-xl">
//                 <div className="flex-grow flex items-center px-4">
//                   <span className="material-symbols-outlined text-[#beff5f] mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>temp_preferences_custom</span>
//                   <input className="w-full bg-transparent border-none focus:ring-0 text-lg outline-none text-white placeholder:text-white/60" placeholder="Describe the aesthetic..." type="text" />
//                 </div>
//                 <Link href="/spaces" className="bg-[#beff5f] text-[#111f00] px-8 py-4 rounded-[24px] font-bold flex items-center gap-2 hover:brightness-110 transition-all whitespace-nowrap">
//                   <span className="material-symbols-outlined">auto_awesome</span>Search by Vibe
//                 </Link>
//               </div>
//               <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
//                 <span className="text-white/60 text-sm font-bold">Trending:</span>
//                 <Link href="/spaces?vibe=concrete" className="text-[#beff5f] hover:underline text-sm">#ConcreteMinimalism</Link>
//                 <Link href="/spaces?vibe=music" className="text-[#beff5f] hover:underline text-sm">#SoftGlowMusic</Link>
//                 <Link href="/spaces?vibe=podcast" className="text-[#beff5f] hover:underline text-sm">#PodcastNook</Link>
//               </div>
//             </div>
//           </div>

//           {/* Phone Mockup */}
//           <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[650px]">
//             <div className="w-72 h-[580px] bg-slate-900 rounded-[3rem] border-[12px] border-slate-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
//               <div className="h-10 bg-slate-800 flex justify-center items-end pb-1"><div className="w-20 h-4 bg-slate-900 rounded-full"></div></div>
//               <div className="flex-grow bg-slate-50 p-4 flex flex-col overflow-hidden">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
//                   <div className="w-10 h-10 rounded-full bg-[#beff5f] flex items-center justify-center text-[#111f00]"><span className="material-symbols-outlined">person</span></div>
//                   <div>
//                     <div className="font-bold text-slate-900 text-sm">Studio Manager</div>
//                     <div className="text-[10px] text-green-500 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online</div>
//                   </div>
//                 </div>
//                 <div ref={chatContainerRef} className="flex flex-col gap-4 overflow-y-auto flex-grow chat-container" style={{ scrollbarWidth: 'none' }}>
//                   {phoneMessages.map((msg, idx) => (
//                     <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-message`}>
//                       <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs font-medium shadow-sm ${msg.type === 'user' ? 'bg-[#e4d7fd] text-[#1f1732] rounded-tr-none' : 'bg-[#beff5f] text-[#111f00] rounded-tl-none'}`}>{msg.text}</div>
//                     </div>
//                   ))}
//                   {phoneMessages.length === 0 && <div className="flex items-center justify-center h-full text-slate-400 text-xs">Loading...</div>}
//                 </div>
//               </div>
//               <div className="h-16 bg-white p-3 border-t border-slate-200 flex items-center gap-2">
//                 <div className="flex-grow h-8 bg-slate-100 rounded-full px-4 text-[10px] flex items-center text-slate-400">Message...</div>
//                 <div className="w-8 h-8 rounded-full bg-[#beff5f] flex items-center justify-center text-[#111f00]"><span className="material-symbols-outlined text-sm">send</span></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Social Proof - Animated Marquee */}
//       <section className="py-14 bg-[#111] border-y border-white/10 overflow-hidden">
//         <div className="flex gap-16 animate-marquee whitespace-nowrap items-center py-2">
//           {['Meta', 'TikTok', 'Instagram', 'YouTube', 'Spotify', 'Netflix', 'Adobe', 'Vogue', 'Nike', 'Samsung', 'Meta', 'TikTok', 'Instagram', 'YouTube', 'Spotify', 'Netflix', 'Adobe', 'Vogue'].map((brand, i) => (
//             <span key={i} className="text-xl md:text-2xl font-extrabold text-white/40 hover:text-[#beff5f] transition-all duration-300 cursor-default">{brand}</span>
//           ))}
//         </div>
//       </section>

//       {/* Everywhere Section - Horizontal scroll on mobile */}
//       <section className="py-20 md:py-24 bg-[#f8f9fa]">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
//             <div className="max-w-2xl">
//               <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">Everywhere your <span className="text-[#a43c12]">vision</span> lives.</h2>
//               <p className="text-base md:text-lg text-[#424937]">The most sophisticated network of creative square footage on the planet. Specialized for every niche.</p>
//             </div>
//             <Link href="/spaces" className="group flex items-center gap-2 text-[#446900] font-bold text-sm uppercase shrink-0">
//               Explore all <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
//           {/* Horizontal scroll on mobile, grid on desktop */}
//           <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
//             {[
//               { image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800', badge: 'Audio Production', badgeColor: 'bg-[#635979] text-white', title: 'Music & Podcast Studios', desc: 'Acoustically perfect environments for your next hit.' },
//               { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', badge: 'Visual Arts', badgeColor: 'bg-[#beff5f] text-[#111f00]', title: 'Photography & Film', desc: 'Natural light lofts and professional cyc walls.' },
//               { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', badge: 'Co-Creation', badgeColor: 'bg-[#ffe6de] text-[#b4471d]', title: 'Pop-up & Design Hubs', desc: 'Dynamic spaces for teams to build the future.' },
//             ].map((card, i) => (
//               <div key={i} className="group relative rounded-[32px] overflow-hidden h-[400px] md:h-[500px] shadow-xl hover:-translate-y-2 transition-transform duration-500 min-w-[85vw] md:min-w-0 snap-center flex-shrink-0">
//                 <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={card.image} alt={card.title} />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
//                   <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs mb-3 md:mb-4 uppercase ${card.badgeColor}`}>{card.badge}</span>
//                   <h4 className="text-white text-xl md:text-2xl font-bold mb-2">{card.title}</h4>
//                   <p className="text-white/70 text-sm">{card.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* The Crew Collective - Horizontal scroll on mobile */}
//       <section className="py-20 md:py-24 bg-white">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-8">
//             <div className="max-w-2xl">
//               <span className="inline-block px-4 py-1 rounded-full bg-[#beff5f] text-[#111f00] font-bold text-sm uppercase tracking-wider mb-4">The Crew Collective</span>
//               <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">Hire the <span className="text-[#446900]">pros</span> who make it happen.</h2>
//               <p className="text-base md:text-lg text-[#424937]">Don't just book a space—build your dream team. Access our vetted network of creative professionals ready to elevate your production.</p>
//             </div>
//             <Link href="/services" className="group flex items-center gap-2 text-[#446900] font-bold text-sm uppercase shrink-0">
//               Browse all pros <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="flex md:grid md:grid-cols-4 gap-5 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
//             {[
//               { title: 'Photographers', desc: 'Editorial, Commercial & Portrait', image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=800' },
//               { title: 'Videographers', desc: 'DPs, Editors & Drone Pilots', image: 'https://images.unsplash.com/photo-1585646794396-3c34d6f3ea4e?auto=format&fit=crop&q=80&w=800' },
//               { title: 'HMU Artists', desc: 'Beauty, SFX & High-Fashion', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800' },
//               { title: 'Studio Support', desc: 'Cleaners, PAs & Set Builders', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800' },
//             ].map((service, i) => (
//               <div key={i} className="group relative rounded-[32px] overflow-hidden h-[350px] md:h-[400px] shadow-lg hover:-translate-y-2 transition-transform duration-500 cursor-pointer min-w-[75vw] md:min-w-0 snap-center flex-shrink-0">
//                 <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={service.image} alt={service.title} />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full">
//                   <h4 className="text-white text-lg md:text-xl font-bold mb-1">{service.title}</h4>
//                   <p className="text-white/70 text-sm">{service.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Before/After */}
//       <section className="py-20 md:py-24 bg-[#f3f4f5]">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-[#e1e3e4] rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center">
//               <span className="text-sm font-bold text-[#424937] uppercase mb-8">Before ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#191c1d]">All work<br/>and no play.</h2>
//               <ul className="w-full space-y-6 text-left">
//                 {['Manual booking coordination.', 'Hidden studio fees.', 'Inconsistent vibe matching.', 'Slow creative output.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-[#c2c9b1]/30 pb-4">
//                     <span className="text-lg font-bold text-[#191c1d]">{item}</span>
//                     <span className="material-symbols-outlined text-[#ba1a1a]">close</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="bg-[#446900] text-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-8">
//                 <span className="material-symbols-outlined text-[#beff5f] text-6xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
//               </div>
//               <span className="text-sm font-bold text-[#beff5f] uppercase mb-8 relative z-10">After ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white relative z-10">Less grind<br/>and more pay.</h2>
//               <ul className="w-full space-y-6 text-left relative z-10">
//                 {['Auto-pilot studio management.', 'Transparent fixed pricing.', 'AI Vibe Search technology.', '24/7 revenue generation.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-white/20 pb-4">
//                     <span className="text-lg font-bold">{item}</span>
//                     <span className="material-symbols-outlined text-[#beff5f]">check_circle</span>
//                   </li>
//                 ))}
//               </ul>
//               <Link href="/signup" className="mt-12 w-full bg-[#beff5f] text-[#111f00] py-5 rounded-2xl font-extrabold text-lg hover:scale-105 transition-transform duration-200 relative z-10 text-center">Get Started for Free</Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Steps */}
//       <section className="py-20 md:py-24 bg-white">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center mb-12 md:mb-16">
//           <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">Get up and running in <span className="italic text-[#446900]">3 simple steps</span>.</h2>
//         </div>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
//           {[
//             { icon: 'add_photo_alternate', title: 'List your space', desc: 'Upload photos, set your vibe tokens, and define your hours. Takes less than 5 minutes.', bg: 'bg-[#e4d7fd]' },
//             { icon: 'smart_toy', title: 'Automate bookings', desc: 'Let our Studio AI handle inquiries, vetting, and scheduling while you focus on creating.', bg: 'bg-[#beff5f]' },
//             { icon: 'account_balance_wallet', title: 'Collect revenue', desc: 'Instant payouts directly to your account. No more chasing invoices.', bg: 'bg-[#ffe6de]' },
//           ].map((step, i) => (
//             <div key={i} className="flex flex-col items-center gap-5 text-center group">
//               <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${step.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
//                 <span className="material-symbols-outlined text-3xl md:text-4xl text-[#446900]" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
//               </div>
//               <h3 className="text-xl md:text-2xl font-bold text-[#191c1d]">{step.title}</h3>
//               <p className="text-base md:text-lg text-[#424937] max-w-xs">{step.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Featured Studios - Horizontal scroll */}
//       <section className="py-20 md:py-24 bg-[#f3f4f5] overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex justify-between items-end mb-10 md:mb-12">
//           <h2 className="text-2xl md:text-3xl font-bold text-[#191c1d]">Featured Studios <span className="text-[#446900] bg-[#beff5f]/30 px-3 py-1 rounded-lg text-sm">New This Week</span></h2>
//           <div className="flex gap-2">
//             <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-[#191c1d]" />
//             </button>
//             <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-[#191c1d]" />
//             </button>
//           </div>
//         </div>
//         <div className="flex gap-5 px-4 md:px-16 overflow-x-auto pb-4 scrollbar-hide">
//           {loading ? (
//             <div className="flex justify-center w-full py-20"><div className="animate-pulse text-center"><div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div><p className="text-[#424937]">Loading studios...</p></div></div>
//           ) : (
//             featuredSpaces.map((space) => {
//               const coverImage = getFirstImage(space.images);
//               return (
//                 <Link key={space.id} href={`/spaces/${space.id}`} className="min-w-[300px] md:min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-md group flex-shrink-0 snap-start">
//                   <div className="h-52 md:h-64 relative overflow-hidden">
//                     {coverImage ? (
//                       <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverImage} alt={space.name} />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-[#edeeef]"><span className="material-symbols-outlined text-4xl text-[#c2c9b1]">image</span></div>
//                     )}
//                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
//                       <StarIcon className="w-4 h-4 text-[#446900] fill-current" /><span className="font-bold text-sm text-[#191c1d]">4.9</span>
//                     </div>
//                   </div>
//                   <div className="p-5 md:p-6">
//                     <div className="flex justify-between items-start mb-2">
//                       <h5 className="text-lg md:text-xl font-bold text-[#191c1d]">{space.name}</h5>
//                       <p className="font-bold text-[#446900] text-sm">${space.hourly_rate}/hr</p>
//                     </div>
//                     <p className="text-[#424937] text-sm mb-4 flex items-center gap-1"><MapPinIcon className="w-4 h-4" />{space.city || 'Location'}{space.state ? `, ${space.state}` : ''}</p>
//                     <div className="flex gap-2">
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Creative</span>
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Studio</span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })
//           )}
//         </div>
//       </section>

//       <Footer />
//       <Chatbot />

//       <style jsx>{`
//         @keyframes messageIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-message { animation: messageIn 0.4s ease-out forwards; }
//         .chat-container::-webkit-scrollbar { display: none; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
//         @keyframes marquee {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-marquee { animation: marquee 30s linear infinite; }
//         .animate-marquee:hover { animation-play-state: paused; }
//       `}</style>
//     </div>
//   );
// }






// // app/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   Bars3Icon,
//   XMarkIcon,
//   StarIcon,
//   MapPinIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';
// import './home.css';

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

// interface ChatMessage {
//   text: string;
//   type: 'user' | 'owner';
// }

// export default function HomePage() {
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [phoneMessages, setPhoneMessages] = useState<ChatMessage[]>([]);
//   const [scrolled, setScrolled] = useState(false);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const chatSequence: ChatMessage[] = [
//     { text: "Hi! Is Studio A available for a 4-hour shoot this Friday?", type: "user" },
//     { text: "Hey! Yes, we have a slot from 2 PM - 6 PM. Would you like to book?", type: "owner" },
//     { text: "Perfect, sending the request now! 🚀", type: "user" },
//   ];

//   // Track scroll for nav transparency
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Animate phone chat
//   useEffect(() => {
//     let isMounted = true;
//     let timeoutIds: NodeJS.Timeout[] = [];

//     const animateMessages = async () => {
//       setPhoneMessages([]);
//       for (const msg of chatSequence) {
//         if (!isMounted) return;
//         await new Promise<void>(resolve => {
//           const id = setTimeout(() => {
//             setPhoneMessages(prev => [...prev, msg]);
//             resolve();
//           }, 1500);
//           timeoutIds.push(id);
//         });
//       }
//       if (isMounted) {
//         const id = setTimeout(() => animateMessages(), 3500);
//         timeoutIds.push(id);
//       }
//     };

//     animateMessages();
//     return () => {
//       isMounted = false;
//       timeoutIds.forEach(clearTimeout);
//     };
//   }, []);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({
//         top: chatContainerRef.current.scrollHeight,
//         behavior: 'smooth',
//       });
//     }
//   }, [phoneMessages]);

//   useEffect(() => {
//     fetchApprovedStudios();
//     setTimeout(() => setIsVisible(true), 100);
//   }, []);

//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => { document.body.style.overflow = 'unset'; };
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

//   return (
//     <div className="home-page bg-[#f8f9fa] text-[#191c1d] overflow-x-hidden">
      
//       {/* Navigation - Transparent on top, white on scroll */}
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         scrolled 
//           ? 'bg-white/95 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm' 
//           : 'bg-transparent border-b border-transparent'
//       }`}>
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-6 md:h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
//                 src={scrolled 
//                   ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCj4l-7dKP6wsFLJVaha-0y6angmGBQIrc_25ZvzO4pYfo99ccX_Ez1Cr3eaBLwN7TpKfnyO2bQjSn2zi9-LvZwbIx095MYCOY5NMW4gv_1xZDjSqd1yOSaZpl9UPmKSQzsq3wUOQRyBffYS8_CHESXwD6FVa7gSAvRkqKad5Z2VLh7D8rkyBc0urG8eBfXgU2XyL9Ohy0_XdDvhHwLburvvSENjkI-jy9_qsIBmEaKAXA32QCjHabBj5ySLxFjbMrCKn3Im8WkmVQ0"
//                   : "https://lh3.googleusercontent.com/aida-public/AB6AXuD5FLM8-4gkEVM-BXx2UavjnDgn6M0FUmJ6Bk1w3CULYHwEX1fOAaY-QphGbvgWSrB3RdVSpj3WrMC49P5iq6kl_vvHgpx_AuSLcJdlbRg09aHWQXJyQam7RlSurFiTj8YJh0OS6zJ-1jzmoj2ULwUcna7EU19o2ir6INe3VobDCmoxjzy0hCxI9hlFSu2xfImBjxGupSYCnc6M2u0WDsUzVSt91gIHe23DbN4VUj7cutX0oFDmtMkhCcFZ0InWTn7MbEKfslaxFyis"
//                 }
//               />
//             </Link>
//             <div className="hidden lg:flex gap-6 items-center">
//               {['Marketplace', 'Studios', 'Vibes', 'Journal', 'Services'].map((item) => (
//                 <Link 
//                   key={item}
//                   href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} 
//                   className={`py-1 font-bold text-sm transition-colors ${
//                     item === 'Marketplace' 
//                       ? scrolled ? 'text-[#446900] border-b-2 border-[#446900]' : 'text-white border-b-2 border-[#beff5f]'
//                       : scrolled ? 'text-[#424937] hover:text-[#446900]' : 'text-white/80 hover:text-white'
//                   }`}
//                 >
//                   {item}
//                 </Link>
//               ))}
//             </div>
//           </div>
//           <div className="flex items-center gap-3 md:gap-4">
//             <div className={`hidden md:flex relative items-center ${scrolled ? '' : 'hidden'}`}>
//               <MagnifyingGlassIcon className="absolute left-3 w-4 h-4 text-[#737a65]" />
//               <input className="pl-10 pr-4 py-2 bg-[#f3f4f5] border-none rounded-full w-48 lg:w-64 focus:ring-2 focus:ring-[#beff5f] text-sm outline-none text-[#191c1d]" placeholder="Search by vibe..." type="text" />
//             </div>
//             <Link 
//               href="/signup?role=owner" 
//               className="hidden md:block px-6 py-2 bg-[#beff5f] text-[#111f00] font-bold text-sm rounded-full hover:brightness-105 transition-all"
//             >
//               List Studio
//             </Link>
//             <div className="hidden md:flex items-center gap-3">
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-105 transition-transform ${scrolled ? 'text-[#424937]' : 'text-white/80'}`}>favorite</span>
//               <span className={`material-symbols-outlined cursor-pointer hover:scale-105 transition-transform ${scrolled ? 'text-[#424937]' : 'text-white/80'}`}>account_circle</span>
//             </div>
//             <button onClick={() => setIsMobileMenuOpen(true)} className={`md:hidden p-2 rounded-full ${scrolled ? 'hover:bg-gray-100 text-[#191c1d]' : 'text-white hover:bg-white/10'}`}>
//               <Bars3Icon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
//         <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-[#446900]">ManyRooms</span>
//               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
//                 <XMarkIcon className="w-6 h-6 text-[#191c1d]" />
//               </button>
//             </div>
//             <nav className="flex flex-col gap-6">
//               {['Marketplace', 'Studios', 'Vibes', 'Journal', 'Services'].map((item) => (
//                 <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>{item}</Link>
//               ))}
//               <div className="border-t border-gray-200 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Studio</Link>
//                 <Link href="/login" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <header className="relative min-h-screen flex items-center pt-24 overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000"
//             alt="Professional photography studio with creative team"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent"></div>
//           <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent to-transparent"></div>
//         </div>

//         <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
//           <div className="lg:col-span-7 flex flex-col items-start gap-6">
//             <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <span className="inline-block px-4 py-1 rounded-full bg-[#beff5f] text-[#111f00] font-bold text-sm uppercase tracking-wider mb-4">
//                 The Creative Evolution
//               </span>
//               <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-white tracking-tighter drop-shadow-lg">
//                 Space <span className="text-[#beff5f] italic">smarter</span>,<br/>not harder.
//               </h1>
//             </div>
//             <p className={`text-lg text-white/80 max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
//             </p>
//             <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-[32px] flex items-center shadow-xl">
//                 <div className="flex-grow flex items-center px-4">
//                   <span className="material-symbols-outlined text-[#beff5f] mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>temp_preferences_custom</span>
//                   <input className="w-full bg-transparent border-none focus:ring-0 text-lg outline-none text-white placeholder:text-white/60" placeholder="Describe the aesthetic (e.g. '70s synth-wave desert loft')" type="text" />
//                 </div>
//                 <Link href="/spaces" className="bg-[#beff5f] text-[#111f00] px-8 py-4 rounded-[24px] font-bold flex items-center gap-2 hover:brightness-110 transition-all whitespace-nowrap">
//                   <span className="material-symbols-outlined">auto_awesome</span>Search by Vibe
//                 </Link>
//               </div>
//               <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
//                 <span className="text-white/60 text-sm font-bold">Trending:</span>
//                 <Link href="/spaces?vibe=concrete" className="text-[#beff5f] hover:underline text-sm">#ConcreteMinimalism</Link>
//                 <Link href="/spaces?vibe=music" className="text-[#beff5f] hover:underline text-sm">#SoftGlowMusic</Link>
//                 <Link href="/spaces?vibe=podcast" className="text-[#beff5f] hover:underline text-sm">#PodcastNook</Link>
//               </div>
//             </div>
//           </div>

//           {/* Phone Mockup */}
//           <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[650px]">
//             <div className="w-72 h-[580px] bg-slate-900 rounded-[3rem] border-[12px] border-slate-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
//               <div className="h-10 bg-slate-800 flex justify-center items-end pb-1">
//                 <div className="w-20 h-4 bg-slate-900 rounded-full"></div>
//               </div>
//               <div className="flex-grow bg-slate-50 p-4 flex flex-col overflow-hidden">
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
//                   <div className="w-10 h-10 rounded-full bg-[#beff5f] flex items-center justify-center text-[#111f00]">
//                     <span className="material-symbols-outlined">person</span>
//                   </div>
//                   <div>
//                     <div className="font-bold text-slate-900 text-sm">Studio Manager</div>
//                     <div className="text-[10px] text-green-500 font-bold flex items-center gap-1">
//                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
//                     </div>
//                   </div>
//                 </div>
//                 <div ref={chatContainerRef} className="flex flex-col gap-4 overflow-y-auto flex-grow chat-container" style={{ scrollbarWidth: 'none' }}>
//                   {phoneMessages.map((msg, idx) => (
//                     <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-message`}>
//                       <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs font-medium shadow-sm ${
//                         msg.type === 'user' ? 'bg-[#e4d7fd] text-[#1f1732] rounded-tr-none' : 'bg-[#beff5f] text-[#111f00] rounded-tl-none'
//                       }`}>{msg.text}</div>
//                     </div>
//                   ))}
//                   {phoneMessages.length === 0 && (
//                     <div className="flex items-center justify-center h-full text-slate-400 text-xs">Loading...</div>
//                   )}
//                 </div>
//               </div>
//               <div className="h-16 bg-white p-3 border-t border-slate-200 flex items-center gap-2">
//                 <div className="flex-grow h-8 bg-slate-100 rounded-full px-4 text-[10px] flex items-center text-slate-400">Message...</div>
//                 <div className="w-8 h-8 rounded-full bg-[#beff5f] flex items-center justify-center text-[#111f00]">
//                   <span className="material-symbols-outlined text-sm">send</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Social Proof Marquee */}
//       <section className="py-12 bg-white border-y border-[#c2c9b1]/30 overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row items-center gap-12">
//           <div className="flex flex-col gap-2 shrink-0 z-10 pr-8">
//             <h3 className="text-5xl font-extrabold leading-tight text-[#446900]">1M+</h3>
//             <p className="font-bold text-sm text-[#424937] uppercase">Creators Trust Us</p>
//           </div>
//           <div className="relative flex-grow overflow-hidden">
//             <div className="flex gap-16 animate-marquee whitespace-nowrap items-center py-4">
//               {['Meta', 'TikTok', 'Instagram', 'YouTube', 'Spotify', 'Netflix', 'Adobe', 'Vogue', 'Nike', 'Samsung', 'Meta', 'TikTok', 'Instagram', 'YouTube', 'Spotify'].map((brand, i) => (
//                 <span key={i} className="text-xl font-extrabold text-[#191c1d] opacity-50 hover:opacity-100 transition-all duration-300">{brand}</span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Everywhere Section */}
//       <section className="py-24 bg-[#f8f9fa]">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
//             <div className="max-w-2xl">
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">Everywhere your <span className="text-[#a43c12]">vision</span> lives.</h2>
//               <p className="text-lg text-[#424937]">The most sophisticated network of creative square footage on the planet. Specialized for every niche.</p>
//             </div>
//             <Link href="/spaces" className="group flex items-center gap-2 text-[#446900] font-bold text-sm uppercase">
//               Explore all <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               { image: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800', badge: 'Audio Production', badgeColor: 'bg-[#635979] text-white', title: 'Music & Podcast Studios', desc: 'Acoustically perfect environments for your next hit.' },
//               { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', badge: 'Visual Arts', badgeColor: 'bg-[#beff5f] text-[#111f00]', title: 'Photography & Film', desc: 'Natural light lofts and professional cyc walls.' },
//               { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', badge: 'Co-Creation', badgeColor: 'bg-[#ffe6de] text-[#b4471d]', title: 'Pop-up & Design Hubs', desc: 'Dynamic spaces for teams to build the future.' },
//             ].map((card, i) => (
//               <div key={i} className="group relative rounded-[32px] overflow-hidden h-[500px] shadow-xl hover:-translate-y-2 transition-transform duration-500">
//                 <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={card.image} alt={card.title} />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-8 w-full">
//                   <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs mb-4 uppercase ${card.badgeColor}`}>{card.badge}</span>
//                   <h4 className="text-white text-2xl font-bold mb-2">{card.title}</h4>
//                   <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity">{card.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* The Crew Collective */}
//       <section className="py-24 bg-white">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
//             <div className="max-w-2xl">
//               <span className="inline-block px-4 py-1 rounded-full bg-[#beff5f] text-[#111f00] font-bold text-sm uppercase tracking-wider mb-4">The Crew Collective</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">Hire the <span className="text-[#446900]">pros</span> who make it happen.</h2>
//               <p className="text-lg text-[#424937]">Don't just book a space—build your dream team. Access our vetted network of creative professionals ready to elevate your production.</p>
//             </div>
//             <Link href="/services" className="group flex items-center gap-2 text-[#446900] font-bold text-sm uppercase">
//               Browse all pros <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { title: 'Photographers', desc: 'Editorial, Commercial & Portrait', image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=800' },
//               { title: 'Videographers', desc: 'DPs, Editors & Drone Pilots', image: 'https://images.unsplash.com/photo-1585646794396-3c34d6f3ea4e?auto=format&fit=crop&q=80&w=800' },
//               { title: 'HMU Artists', desc: 'Beauty, SFX & High-Fashion', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800' },
//               { title: 'Studio Support', desc: 'Cleaners, PAs & Set Builders', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800' },
//             ].map((service, i) => (
//               <div key={i} className="group relative rounded-[32px] overflow-hidden h-[400px] shadow-lg hover:-translate-y-2 transition-transform duration-500 cursor-pointer">
//                 <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={service.image} alt={service.title} />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-6 w-full">
//                   <h4 className="text-white text-xl font-bold mb-1">{service.title}</h4>
//                   <p className="text-white/70 text-sm">{service.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Before/After */}
//       <section className="py-24 bg-[#f3f4f5]">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-[#e1e3e4] rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center">
//               <span className="text-sm font-bold text-[#424937] uppercase mb-8">Before ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#191c1d]">All work<br/>and no play.</h2>
//               <ul className="w-full space-y-6 text-left">
//                 {['Manual booking coordination.', 'Hidden studio fees.', 'Inconsistent vibe matching.', 'Slow creative output.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-[#c2c9b1]/30 pb-4">
//                     <span className="text-lg font-bold text-[#191c1d]">{item}</span>
//                     <span className="material-symbols-outlined text-[#ba1a1a]">close</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="bg-[#446900] text-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-8">
//                 <span className="material-symbols-outlined text-[#beff5f] text-6xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
//               </div>
//               <span className="text-sm font-bold text-[#beff5f] uppercase mb-8 relative z-10">After ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white relative z-10">Less grind<br/>and more pay.</h2>
//               <ul className="w-full space-y-6 text-left relative z-10">
//                 {['Auto-pilot studio management.', 'Transparent fixed pricing.', 'AI Vibe Search technology.', '24/7 revenue generation.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-white/20 pb-4">
//                     <span className="text-lg font-bold">{item}</span>
//                     <span className="material-symbols-outlined text-[#beff5f]">check_circle</span>
//                   </li>
//                 ))}
//               </ul>
//               <Link href="/signup" className="mt-12 w-full bg-[#beff5f] text-[#111f00] py-5 rounded-2xl font-extrabold text-lg hover:scale-105 transition-transform duration-200 relative z-10 text-center">
//                 Get Started for Free
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Steps */}
//       <section className="py-24 bg-white">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">Get up and running in <span className="italic text-[#446900]">3 simple steps</span>.</h2>
//         </div>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
//           {[
//             { icon: 'add_photo_alternate', title: 'List your space', desc: 'Upload photos, set your vibe tokens, and define your hours. It takes less than 5 minutes.', bg: 'bg-[#e4d7fd]' },
//             { icon: 'smart_toy', title: 'Automate bookings', desc: 'Let our Studio AI handle inquiries, vetting, and scheduling while you focus on creating.', bg: 'bg-[#beff5f]' },
//             { icon: 'account_balance_wallet', title: 'Collect revenue', desc: 'Instant payouts directly to your account. No more chasing invoices or "exposure" deals.', bg: 'bg-[#ffe6de]' },
//           ].map((step, i) => (
//             <div key={i} className="flex flex-col items-center gap-6 text-center">
//               <div className={`w-24 h-24 rounded-full ${step.bg} flex items-center justify-center mb-2`}>
//                 <span className="material-symbols-outlined text-4xl text-[#446900]" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
//               </div>
//               <h3 className="text-2xl font-bold text-[#191c1d]">{step.title}</h3>
//               <p className="text-lg text-[#424937]">{step.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Featured Studios */}
//       <section className="py-24 bg-[#f3f4f5] overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex justify-between items-end mb-12">
//           <h2 className="text-3xl font-bold text-[#191c1d]">Featured Studios <span className="text-[#446900] bg-[#beff5f]/30 px-3 py-1 rounded-lg text-sm">New This Week</span></h2>
//           <div className="flex gap-2">
//             <button className="w-12 h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronLeftIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//             <button className="w-12 h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronRightIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//           </div>
//         </div>
//         <div className="flex gap-6 px-4 md:px-16 overflow-x-auto pb-8">
//           {loading ? (
//             <div className="flex justify-center w-full py-20"><div className="animate-pulse text-center"><div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div><p className="text-[#424937]">Loading studios...</p></div></div>
//           ) : (
//             featuredSpaces.map((space) => {
//               const coverImage = getFirstImage(space.images);
//               return (
//                 <Link key={space.id} href={`/spaces/${space.id}`} className="min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-md group flex-shrink-0">
//                   <div className="h-64 relative overflow-hidden">
//                     {coverImage ? (
//                       <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverImage} alt={space.name} />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-[#edeeef]"><span className="material-symbols-outlined text-4xl text-[#c2c9b1]">image</span></div>
//                     )}
//                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
//                       <StarIcon className="w-4 h-4 text-[#446900] fill-current" />
//                       <span className="font-bold text-sm text-[#191c1d]">4.9</span>
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-2">
//                       <h5 className="text-xl font-bold text-[#191c1d]">{space.name}</h5>
//                       <p className="font-bold text-[#446900]">${space.hourly_rate}/hr</p>
//                     </div>
//                     <p className="text-[#424937] text-sm mb-4 flex items-center gap-1">
//                       <MapPinIcon className="w-4 h-4" />{space.city || 'Location'}{space.state ? `, ${space.state}` : ''}
//                     </p>
//                     <div className="flex gap-2">
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Creative</span>
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Studio</span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })
//           )}
//         </div>
//       </section>

//       <Footer />
//       <Chatbot />

//       <style jsx>{`
//         @keyframes messageIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-message { animation: messageIn 0.4s ease-out forwards; }
//         .chat-container::-webkit-scrollbar { display: none; }
//         @keyframes marquee {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-marquee { animation: marquee 30s linear infinite; }
//       `}</style>
//     </div>
//   );
// }



// // ..app/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   Bars3Icon,
//   XMarkIcon,
//   StarIcon,
//   MapPinIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';
// import './home.css';

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

// interface ChatMessage {
//   text: string;
//   type: 'user' | 'owner';
// }

// export default function HomePage() {
//   const [featuredSpaces, setFeaturedSpaces] = useState<Studio[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [phoneMessages, setPhoneMessages] = useState<ChatMessage[]>([]);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const chatSequence: ChatMessage[] = [
//     { text: "Hi! Is Studio A available for a 4-hour shoot this Friday?", type: "user" },
//     { text: "Hey! Yes, we have a slot from 2 PM - 6 PM. Would you like to book?", type: "owner" },
//     { text: "Perfect, sending the request now! 🚀", type: "user" },
//   ];

//   // Animate phone chat messages
//   useEffect(() => {
//     let isMounted = true;
//     let timeoutIds: NodeJS.Timeout[] = [];

//     const animateMessages = async () => {
//       setPhoneMessages([]);
      
//       for (const msg of chatSequence) {
//         if (!isMounted) return;
//         await new Promise<void>(resolve => {
//           const id = setTimeout(() => {
//             setPhoneMessages(prev => [...prev, msg]);
//             resolve();
//           }, 1500);
//           timeoutIds.push(id);
//         });
//       }
      
//       // Wait and restart
//       if (isMounted) {
//         const id = setTimeout(() => {
//           animateMessages();
//         }, 3500);
//         timeoutIds.push(id);
//       }
//     };

//     animateMessages();

//     return () => {
//       isMounted = false;
//       timeoutIds.forEach(clearTimeout);
//     };
//   }, []);

//   // Scroll to bottom of phone chat
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({
//         top: chatContainerRef.current.scrollHeight,
//         behavior: 'smooth',
//       });
//     }
//   }, [phoneMessages]);

//   useEffect(() => {
//     fetchApprovedStudios();
//     setTimeout(() => setIsVisible(true), 100);
//   }, []);

//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => { document.body.style.overflow = 'unset'; };
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

//   return (
//     <div className="home-page bg-[#f8f9fa] text-[#191c1d] overflow-x-hidden">
      
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-8 md:h-10 w-auto object-contain" 
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj4l-7dKP6wsFLJVaha-0y6angmGBQIrc_25ZvzO4pYfo99ccX_Ez1Cr3eaBLwN7TpKfnyO2bQjSn2zi9-LvZwbIx095MYCOY5NMW4gv_1xZDjSqd1yOSaZpl9UPmKSQzsq3wUOQRyBffYS8_CHESXwD6FVa7gSAvRkqKad5Z2VLh7D8rkyBc0urG8eBfXgU2XyL9Ohy0_XdDvhHwLburvvSENjkI-jy9_qsIBmEaKAXA32QCjHabBj5ySLxFjbMrCKn3Im8WkmVQ0"
//               />
//             </Link>
//             <div className="hidden lg:flex gap-6 items-center">
//               <Link href="/" className="text-[#446900] font-bold border-b-2 border-[#446900] py-1">Marketplace</Link>
//               <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Studios</Link>
//               <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Vibes</Link>
//               <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Journal</Link>
//               <Link href="/services" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Services</Link>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 md:gap-4">
//             <div className="hidden md:flex relative items-center">
//               <MagnifyingGlassIcon className="absolute left-3 w-4 h-4 text-[#737a65]" />
//               <input className="pl-10 pr-4 py-2 bg-[#f3f4f5] border-none rounded-full w-48 lg:w-64 focus:ring-2 focus:ring-[#beff5f] text-sm outline-none text-[#191c1d]" placeholder="Search by vibe..." type="text" />
//             </div>
//             <Link href="/signup?role=owner" className="hidden md:block px-6 py-2 bg-[#beff5f] text-[#111f00] font-bold text-sm rounded-full hover:scale-105 transition-transform">List Studio</Link>
//             <div className="hidden md:flex items-center gap-3">
//               <span className="material-symbols-outlined text-[#424937] cursor-pointer hover:scale-105 transition-transform">favorite</span>
//               <span className="material-symbols-outlined text-[#424937] cursor-pointer hover:scale-105 transition-transform">account_circle</span>
//             </div>
//             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
//               <Bars3Icon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
//         <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-[#446900]">ManyRooms</span>
//               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
//                 <XMarkIcon className="w-6 h-6 text-[#191c1d]" />
//               </button>
//             </div>
//             <nav className="flex flex-col gap-6">
//               <Link href="/" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
//               <Link href="/spaces" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Studios</Link>
//               <Link href="/cities" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Vibes</Link>
//               <Link href="/about" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Journal</Link>
//               <Link href="/services" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
//               <div className="border-t border-gray-200 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Studio</Link>
//                 <Link href="/login" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section with Dark Background + Animated Phone */}
//       <header className="relative min-h-screen flex items-center pt-24 overflow-hidden">
//         {/* Solid dark background image */}
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://lh3.googleusercontent.com/aida/AP1WRLtEc8Jdj7-pew_Z-y9BIERr8FgqdMMZ1XE92TFeJawsBAEipOOAC05OebLve_NSjKvsMZXMahvRlApQhJg9Hd_th3KAPSylYQlt9g7hKGav64ZvezV9UUIOvKC_Xp_k0Dj3W022I8pbiW1NxOgWGGCgfH6QZTWVGr67anw2zZQ-wDn8-Lu-n8QLjbPn8Ev2FoWHg_4VGMoAgdVIQN_eLNgSqjEQe-g-Q-kJb1CvTmXpi0rL1gerY04D_1vz"
//             alt="High-end professional studio"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent"></div>
//           <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent to-transparent"></div>
//         </div>

//         <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
//           {/* Left Content */}
//           <div className="lg:col-span-7 flex flex-col items-start gap-6">
//             <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <span className="inline-block px-4 py-1 rounded-full bg-[#beff5f] text-[#111f00] font-bold text-sm uppercase tracking-wider mb-4">
//                 The Creative Evolution
//               </span>
//               <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-white tracking-tighter drop-shadow-lg">
//                 Space <span className="text-[#beff5f] italic">smarter</span>,<br/>not harder.
//               </h1>
//             </div>
//             <p className={`text-lg text-white/80 max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
//             </p>
            
//             {/* Search by Vibe */}
//             <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-[32px] flex items-center shadow-xl">
//                 <div className="flex-grow flex items-center px-4">
//                   <span className="material-symbols-outlined text-[#beff5f] mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>
//                     temp_preferences_custom
//                   </span>
//                   <input 
//                     className="w-full bg-transparent border-none focus:ring-0 text-lg outline-none text-white placeholder:text-white/60" 
//                     placeholder="Describe the aesthetic (e.g. '70s synth-wave desert loft')" 
//                     type="text" 
//                   />
//                 </div>
//                 <Link 
//                   href="/spaces"
//                   className="bg-[#beff5f] text-[#111f00] px-8 py-4 rounded-[24px] font-bold flex items-center gap-2 hover:brightness-110 transition-all whitespace-nowrap"
//                 >
//                   <span className="material-symbols-outlined">auto_awesome</span>
//                   Search by Vibe
//                 </Link>
//               </div>
//               <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
//                 <span className="text-white/60 text-sm font-bold">Trending:</span>
//                 <Link href="/spaces?vibe=concrete" className="text-[#beff5f] hover:underline text-sm">#ConcreteMinimalism</Link>
//                 <Link href="/spaces?vibe=music" className="text-[#beff5f] hover:underline text-sm">#SoftGlowMusic</Link>
//                 <Link href="/spaces?vibe=podcast" className="text-[#beff5f] hover:underline text-sm">#PodcastNook</Link>
//               </div>
//             </div>
//           </div>

//           {/* Right: Animated Phone Mockup */}
//           <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[650px]">
//             <div className="w-72 h-[580px] bg-slate-900 rounded-[3rem] border-[12px] border-slate-800 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative">
//               {/* Status Bar */}
//               <div className="h-10 bg-slate-800 flex justify-center items-end pb-1">
//                 <div className="w-20 h-4 bg-slate-900 rounded-full"></div>
//               </div>
//               {/* Content */}
//               <div className="flex-grow bg-slate-50 p-4 flex flex-col overflow-hidden">
//                 {/* Chat Header */}
//                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
//                   <div className="w-10 h-10 rounded-full bg-[#beff5f] flex items-center justify-center text-[#111f00]">
//                     <span className="material-symbols-outlined">person</span>
//                   </div>
//                   <div>
//                     <div className="font-bold text-slate-900 text-sm">Studio Manager</div>
//                     <div className="text-[10px] text-green-500 font-bold flex items-center gap-1">
//                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
//                     </div>
//                   </div>
//                 </div>
//                 {/* Messages */}
//                 <div ref={chatContainerRef} className="flex flex-col gap-4 overflow-y-auto flex-grow chat-container" style={{ scrollbarWidth: 'none' }}>
//                   {phoneMessages.map((msg, idx) => (
//                     <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-message`}>
//                       <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs font-medium shadow-sm ${
//                         msg.type === 'user' 
//                           ? 'bg-[#e4d7fd] text-[#1f1732] rounded-tr-none' 
//                           : 'bg-[#beff5f] text-[#111f00] rounded-tl-none'
//                       }`}>
//                         {msg.text}
//                       </div>
//                     </div>
//                   ))}
//                   {phoneMessages.length === 0 && (
//                     <div className="flex items-center justify-center h-full text-slate-400 text-xs">
//                       Loading messages...
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {/* Input Area */}
//               <div className="h-16 bg-white p-3 border-t border-slate-200 flex items-center gap-2">
//                 <div className="flex-grow h-8 bg-slate-100 rounded-full px-4 text-[10px] flex items-center text-slate-400">Message...</div>
//                 <div className="w-8 h-8 rounded-full bg-[#beff5f] flex items-center justify-center text-[#111f00]">
//                   <span className="material-symbols-outlined text-sm">send</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Social Proof - Marquee */}
//       <section className="py-12 bg-white border-y border-[#c2c9b1]/30 overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row items-center gap-12">
//           <div className="flex flex-col gap-2 shrink-0 bg-white z-10 pr-8">
//             <h3 className="text-5xl font-extrabold leading-tight text-[#446900]">1M+</h3>
//             <p className="font-bold text-sm text-[#424937] uppercase">Creators Trust Us</p>
//           </div>
//           <div className="relative flex-grow overflow-hidden">
//             <div className="flex gap-16 animate-marquee whitespace-nowrap items-center py-4">
//               {['Meta', 'TikTok', 'Instagram', 'Facebook', 'WhatsApp', 'Meta', 'TikTok', 'Instagram', 'Facebook', 'WhatsApp'].map((brand, i) => (
//                 <span key={i} className="text-xl font-extrabold text-[#191c1d] opacity-50 hover:opacity-100 transition-all">{brand}</span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Everywhere Section */}
//       <section className="py-24 bg-[#f8f9fa] relative overflow-hidden reveal">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
//             <div className="max-w-2xl reveal-item">
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">
//                 Everywhere your <span className="text-[#a43c12]">vision</span> lives.
//               </h2>
//               <p className="text-lg text-[#424937]">The most sophisticated network of creative square footage on the planet. Specialized for every niche.</p>
//             </div>
//             <Link href="/spaces" className="group flex items-center gap-2 text-[#446900] font-bold text-sm uppercase">
//               Explore all categories <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDSHg0tkd_xlXbd8XLxjvdWaUgh-Wgi_B2ogcGWvBQHu5itBc6wfvLL7Uks_ztfZQAqK7lWfTx4O_i13JCWPmO7gTmeYzxQaPrG_tsy3pbEsLcTdP08ztwgndHP1-Jt9pOad3BL9ib-gPyEx0GUvwlrJA2niuV8FD2JBh6h_ZsS8F0VriH2HZEpRKhFr-IScJrOEIwiePqm4kvFD-P41nwFMfMsU0MPd9kycWXkGl_DsOrZfIzoQzj7KEuW1hAx2iGIw-gZyhNPqb', badge: 'Audio Production', badgeColor: 'bg-[#635979] text-white', title: 'Music & Podcast Studios', desc: 'Acoustically perfect environments for your next hit.' },
//               { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB74YlBwI2kAzcpnrBVppH7dn6wM8Dpt5QmxAEKu3ImGGFSmPvz6AFW8tpeSIuKjkVDfRNSBFlNTxyizEu5zu2dstawrNFjmsy9aWG2giHSpNp1bHh_sCvEe5wjmkhOdFYNouCLbm00PkvPtRPTZWCftj0Qxhkuxy7jcfAt-TXbLa6CQgrvS2k7EUCcOSdozHLPPI_JNZQU11IxT7PtjMXuob_u02TdqLxb-Y2FgGONZYZcn5a5vXzDcb3hO1WGokfGXEgRAX-JP-cy', badge: 'Visual Arts', badgeColor: 'bg-[#beff5f] text-[#111f00]', title: 'Photography & Film', desc: 'Natural light lofts and professional cyc walls.' },
//               { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRVPUuNYkbGYO_2TrCnEpkpXhaEJChhEI1eKHDnEIWVrkbPKAsranLkrOZncliRk2uhvXtaFPKcbz4MDlHZgYT5SqCiqkSOQlMb8D0s5WK-43lw61XoC26Wo5ZXj5cObwwVxdLO7jO_S2PtrSDCCWz86klSzEz1ZMJjL30RdAsth_8VUnAUTAcHYJ97bykBsJXrEtN7fy9JWeS_BGScrktCVk56-UDJeEfuZPAjY8aMOKHsQBQ2n4Q7S6CWgXnIbM2U5dXgpxB1_VI', badge: 'Co-Creation', badgeColor: 'bg-[#ffe6de] text-[#b4471d]', title: 'Pop-up & Design Hubs', desc: 'Dynamic spaces for teams to build the future.' },
//             ].map((card, i) => (
//               <div key={i} className="group relative rounded-[32px] overflow-hidden h-[500px] shadow-xl hover:-translate-y-2 transition-transform duration-500 reveal-item">
//                 <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={card.image} alt={card.title} />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-8 w-full">
//                   <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs mb-4 uppercase ${card.badgeColor}`}>{card.badge}</span>
//                   <h4 className="text-white text-2xl font-bold mb-2">{card.title}</h4>
//                   <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity">{card.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* The Crew Collective */}
//       <section className="py-24 bg-white relative overflow-hidden reveal">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
//             <div className="max-w-2xl reveal-item">
//               <span className="inline-block px-4 py-1 rounded-full bg-[#beff5f] text-[#111f00] font-bold text-sm uppercase tracking-wider mb-4">The Crew Collective</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">Hire the <span className="text-[#446900]">pros</span> who make it happen.</h2>
//               <p className="text-lg text-[#424937]">Don't just book a space—build your dream team. Access our vetted network of creative professionals ready to elevate your production.</p>
//             </div>
//             <Link href="/services" className="group flex items-center gap-2 text-[#446900] font-bold text-sm uppercase">
//               Browse all professionals <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { title: 'Photographers', desc: 'Editorial, Commercial & Portrait', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF34mH1t1b_daE_tPfalnXue-edqeUxW6ZdSQHyUia5HkQLuaxRVZTGw6key5E1aNH6llJm60epDwbwPGlLp0MpM5nxMsC4MvJln_jXC-fXkFzEGnEOFWPi5oicJCtWfnNQapDjjoZEvJiSPCTWyT89dJz510YTnT4eHAbF6czlaxio6i25fmcGSTySWAkkDu8rwx_u-vSBh2ntypJoGOoOs18krdxinNWFSX3WPUrFxMdf_sInX75YdcAgoWIgv1WGBKAHS03H-wQ' },
//               { title: 'Videographers', desc: 'DPs, Editors & Drone Pilots', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAeGmZn-h3NqKJmOFCV08OAQIQZnzBDjE-B2TGHIbXWF21fuXnPz4eXVYCp18cyGj9YGiH0bTDbk5WvW9GnfPRb8pPsBMJd6t-piAg7cUQTKQgvyJPAve6seIBQ3WJjUj3jsSL_0vwg8iZqoI7ueq2AWfqSgGq4y00xRIzRJ29-rq1aBt1no4gQyHNGylyR-223_HLjbATDhUEVIJEH9VPMjnvHPZcIC1PxyPubgROVyQx7GOuMIPSIVQ4m48iHWHP25ub-vc9T3fo' },
//               { title: 'HMU Artists', desc: 'Beauty, SFX & High-Fashion', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBstEwTZGxzOlMuMKJ3DIM7MTew8MzXavTguvPG6Q6OtUL2HFiIaNEQsmnJ4Boo8lFZzIbrdn0WsxMIiC45hCpwSAZOeK5bgouxKE12-YJH_YsoTLSK7fqlHKxI4a5hzH4GfOdg523fswnoXigircuZcUwOea3UoxtbmQzoJbmHENjid4Ea-vV-hc93EQAL9mu4VkZybGbrNyPBddDggCMsUoqsNxZZImAFyy9SfygG0o2SzHtnT4NvjOkId_PAEplmViI_aaPFePSU' },
//               { title: 'Studio Support', desc: 'Cleaners, PAs & Set Builders', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8pzzl2d32DJ1X_9dyOqcq2S584fvfzY_KEO2hkhnioVHc4TqPjWKg4m-N_-f-QXUdomuCQP1UwRQ1lvMZHkWFUJNUSlGlFmBcQkRgRuxTgyq0NOI_nLEbrzpdDsfFsEDbG46qLSobd70yjlCWF0ps2LwdwuAb49EcEejXsxYh14rwoAFK30LW6MGQfhQhh_FXlJlQA9dQfgPIDaZRd1ZisonE2y370NS24Pwz_6gdKcAhvTlFRzhlHXiLCR2BhGsqTMrA5tevUi6m' },
//             ].map((service, i) => (
//               <div key={i} className="group relative rounded-[32px] overflow-hidden h-[400px] shadow-lg hover:-translate-y-2 transition-transform duration-500 cursor-pointer reveal-item">
//                 <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={service.image} alt={service.title} />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-6 w-full">
//                   <h4 className="text-white text-xl font-bold mb-1">{service.title}</h4>
//                   <p className="text-white/70 text-sm">{service.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Before/After */}
//       <section className="py-24 bg-[#f3f4f5] reveal">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-[#e1e3e4] rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center reveal-item">
//               <span className="text-sm font-bold text-[#424937] uppercase mb-8">Before ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#191c1d]">All work<br/>and no play.</h2>
//               <ul className="w-full space-y-6 text-left">
//                 {['Manual booking coordination.', 'Hidden studio fees.', 'Inconsistent vibe matching.', 'Slow creative output.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-[#c2c9b1]/30 pb-4">
//                     <span className="text-lg font-bold text-[#191c1d]">{item}</span>
//                     <span className="material-symbols-outlined text-[#ba1a1a]">close</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="bg-[#446900] text-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden reveal-item">
//               <div className="absolute top-0 right-0 p-8">
//                 <span className="material-symbols-outlined text-[#beff5f] text-6xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
//               </div>
//               <span className="text-sm font-bold text-[#beff5f] uppercase mb-8 relative z-10">After ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white relative z-10">Less grind<br/>and more pay.</h2>
//               <ul className="w-full space-y-6 text-left relative z-10">
//                 {['Auto-pilot studio management.', 'Transparent fixed pricing.', 'AI Vibe Search technology.', '24/7 revenue generation.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-white/20 pb-4">
//                     <span className="text-lg font-bold">{item}</span>
//                     <span className="material-symbols-outlined text-[#beff5f]">check_circle</span>
//                   </li>
//                 ))}
//               </ul>
//               <Link href="/signup" className="mt-12 w-full bg-[#beff5f] text-[#111f00] py-5 rounded-2xl font-extrabold text-lg hover:scale-105 transition-transform duration-200 relative z-10 text-center">
//                 Get Started for Free
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Steps */}
//       <section className="py-24 bg-white reveal">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d] reveal-item">
//             Get up and running in <span className="italic text-[#446900]">3 simple steps</span>.
//           </h2>
//         </div>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
//           {[
//             { icon: 'add_photo_alternate', title: 'List your space', desc: 'Upload photos, set your vibe tokens, and define your hours. It takes less than 5 minutes.', bg: 'bg-[#e4d7fd]' },
//             { icon: 'smart_toy', title: 'Automate bookings', desc: 'Let our Studio AI handle inquiries, vetting, and scheduling while you focus on creating.', bg: 'bg-[#beff5f]' },
//             { icon: 'account_balance_wallet', title: 'Collect revenue', desc: 'Instant payouts directly to your account. No more chasing invoices or "exposure" deals.', bg: 'bg-[#ffe6de]' },
//           ].map((step, i) => (
//             <div key={i} className="flex flex-col items-center gap-6 text-center reveal-item">
//               <div className={`w-24 h-24 rounded-full ${step.bg} flex items-center justify-center mb-2`}>
//                 <span className="material-symbols-outlined text-4xl text-[#446900]" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
//               </div>
//               <h3 className="text-2xl font-bold text-[#191c1d]">{step.title}</h3>
//               <p className="text-lg text-[#424937]">{step.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Featured Studios */}
//       <section className="py-24 bg-[#f3f4f5] overflow-hidden reveal">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex justify-between items-end mb-12">
//           <h2 className="text-3xl font-bold text-[#191c1d] reveal-item">
//             Featured Studios <span className="text-[#446900] bg-[#beff5f]/30 px-3 py-1 rounded-lg text-sm">New This Week</span>
//           </h2>
//           <div className="flex gap-2">
//             <button className="w-12 h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronLeftIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//             <button className="w-12 h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronRightIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//           </div>
//         </div>
//         <div className="flex gap-6 px-4 md:px-16 overflow-x-auto pb-8">
//           {loading ? (
//             <div className="flex justify-center w-full py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-[#424937]">Loading studios...</p>
//               </div>
//             </div>
//           ) : (
//             featuredSpaces.map((space) => {
//               const coverImage = getFirstImage(space.images);
//               return (
//                 <Link key={space.id} href={`/spaces/${space.id}`} className="min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-md group flex-shrink-0 reveal-item">
//                   <div className="h-64 relative overflow-hidden">
//                     {coverImage ? (
//                       <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverImage} alt={space.name} />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-[#edeeef]">
//                         <span className="material-symbols-outlined text-4xl text-[#c2c9b1]">image</span>
//                       </div>
//                     )}
//                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
//                       <StarIcon className="w-4 h-4 text-[#446900] fill-current" />
//                       <span className="font-bold text-sm text-[#191c1d]">4.9</span>
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-2">
//                       <h5 className="text-xl font-bold text-[#191c1d]">{space.name}</h5>
//                       <p className="font-bold text-[#446900]">${space.hourly_rate}/hr</p>
//                     </div>
//                     <p className="text-[#424937] text-sm mb-4 flex items-center gap-1">
//                       <MapPinIcon className="w-4 h-4" />
//                       {space.city || 'Location'}{space.state ? `, ${space.state}` : ''}
//                     </p>
//                     <div className="flex gap-2">
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Creative</span>
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Studio</span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })
//           )}
//         </div>
//       </section>

//       <Footer />
//       <Chatbot />

//       <style jsx>{`
//         @keyframes messageIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-message {
//           animation: messageIn 0.4s ease-out forwards;
//         }
//         .chat-container::-webkit-scrollbar { display: none; }
        
//         @keyframes marquee {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-marquee {
//           animation: marquee 30s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// }



// // app/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   Bars3Icon,
//   XMarkIcon,
//   StarIcon,
//   MapPinIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';
// import './home.css';

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
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     fetchApprovedStudios();
//     setTimeout(() => setIsVisible(true), 100);
//   }, []);

//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => { document.body.style.overflow = 'unset'; };
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

//   return (
//     <div className="home-page bg-[#f8f9fa] text-[#191c1d] overflow-x-hidden">
      
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-8 md:h-10 w-auto object-contain" 
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj4l-7dKP6wsFLJVaha-0y6angmGBQIrc_25ZvzO4pYfo99ccX_Ez1Cr3eaBLwN7TpKfnyO2bQjSn2zi9-LvZwbIx095MYCOY5NMW4gv_1xZDjSqd1yOSaZpl9UPmKSQzsq3wUOQRyBffYS8_CHESXwD6FVa7gSAvRkqKad5Z2VLh7D8rkyBc0urG8eBfXgU2XyL9Ohy0_XdDvhHwLburvvSENjkI-jy9_qsIBmEaKAXA32QCjHabBj5ySLxFjbMrCKn3Im8WkmVQ0"
//               />
//             </Link>
//             <div className="hidden lg:flex gap-6 items-center">
//               <Link href="/" className="text-[#446900] font-bold border-b-2 border-[#446900] py-1">Marketplace</Link>
//               <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Studios</Link>
//               <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Vibes</Link>
//               <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Journal</Link>
//               <Link href="/services" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Services</Link>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 md:gap-4">
//             <div className="hidden md:flex relative items-center">
//               <MagnifyingGlassIcon className="absolute left-3 w-4 h-4 text-[#737a65]" />
//               <input 
//                 className="pl-10 pr-4 py-2 bg-[#f3f4f5] border-none rounded-full w-48 lg:w-64 focus:ring-2 focus:ring-[#beff5f] text-sm outline-none text-[#191c1d]" 
//                 placeholder="Search by vibe..." 
//                 type="text" 
//               />
//             </div>
//             <Link 
//               href="/signup?role=owner" 
//               className="hidden md:block px-6 py-2 bg-[#beff5f] text-[#111f00] font-bold text-sm rounded-full hover:scale-105 transition-transform"
//             >
//               List Studio
//             </Link>
//             <div className="hidden md:flex items-center gap-3">
//               <span className="material-symbols-outlined text-[#424937] cursor-pointer hover:scale-105 transition-transform">favorite</span>
//               <span className="material-symbols-outlined text-[#424937] cursor-pointer hover:scale-105 transition-transform">account_circle</span>
//             </div>
//             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
//               <Bars3Icon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
//         <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-[#446900]">ManyRooms</span>
//               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
//                 <XMarkIcon className="w-6 h-6 text-[#191c1d]" />
//               </button>
//             </div>
//             <nav className="flex flex-col gap-6">
//               <Link href="/" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
//               <Link href="/spaces" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Studios</Link>
//               <Link href="/cities" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Vibes</Link>
//               <Link href="/about" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Journal</Link>
//               <Link href="/services" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
//               <div className="border-t border-gray-200 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Studio</Link>
//                 <Link href="/login" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section with Background Image */}
//       <header className="relative min-h-screen flex items-center pt-24 overflow-hidden">
//         {/* Hero Background Image - Person in Studio */}
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&q=80&w=2000"
//             alt="Creative professional in studio"
//             className="w-full h-full object-cover object-center"
//           />
//           {/* Gradient Overlays */}
//           <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa]/85 to-[#f8f9fa]/40"></div>
//           <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent to-transparent"></div>
//         </div>

//         <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
//           <div className="lg:col-span-7 flex flex-col items-start gap-6">
//             <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <span className="inline-block px-4 py-1 rounded-full bg-[#e4d7fd]/90 backdrop-blur-sm text-[#665c7c] font-bold text-sm uppercase tracking-wider mb-4">
//                 The Creative Evolution
//               </span>
//               <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-[#191c1d] tracking-tighter">
//                 Space <span className="text-[#446900] italic">smarter</span>,<br/>not harder.
//               </h1>
//             </div>
//             <p className={`text-lg text-[#424937] max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
//             </p>
            
//             <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <div className="bg-white/90 backdrop-blur-xl border border-white/60 p-2 rounded-[32px] flex items-center shadow-2xl">
//                 <div className="flex-grow flex items-center px-4">
//                   <span className="material-symbols-outlined text-[#446900] mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>
//                     temp_preferences_custom
//                   </span>
//                   <input 
//                     className="w-full bg-transparent border-none focus:ring-0 text-lg outline-none text-[#191c1d] placeholder:text-[#737a65]" 
//                     placeholder="Describe the aesthetic (e.g. '70s synth-wave desert loft')" 
//                     type="text" 
//                   />
//                 </div>
//                 <Link 
//                   href="/spaces"
//                   className="bg-[#beff5f] text-[#111f00] px-8 py-4 rounded-[24px] font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(190,255,95,0.6)] transition-all whitespace-nowrap"
//                 >
//                   <span className="material-symbols-outlined">auto_awesome</span>
//                   Search by Vibe
//                 </Link>
//               </div>
//               <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
//                 <span className="text-[#424937] text-sm font-bold">Trending:</span>
//                 <Link href="/spaces?vibe=concrete" className="text-[#446900] hover:underline text-sm">#ConcreteMinimalism</Link>
//                 <Link href="/spaces?vibe=music" className="text-[#446900] hover:underline text-sm">#SoftGlowMusic</Link>
//                 <Link href="/spaces?vibe=podcast" className="text-[#446900] hover:underline text-sm">#PodcastNook</Link>
//               </div>
//             </div>
//           </div>

//           {/* Right side - subtle glass effect area for depth */}
//           <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[600px]">
//             <div className="absolute top-10 right-0 bg-white/85 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-2xl max-w-[280px] border-l-8 border-[#beff5f]" style={{ animation: 'float 6s ease-in-out infinite' }}>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-10 h-10 rounded-full bg-[#e4d7fd] flex items-center justify-center">
//                   <span className="material-symbols-outlined text-[#665c7c]">camera_enhance</span>
//                 </div>
//                 <span className="font-bold text-sm text-[#191c1d]">Studio Bot</span>
//               </div>
//               <p className="text-sm italic text-[#191c1d]">"Hey! Do you sell production hours?"</p>
//             </div>
            
//             <div className="absolute bottom-20 left-0 bg-white/85 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-2xl max-w-[280px] border-r-8 border-[#ffe6de]" style={{ animation: 'float 6s ease-in-out infinite 1s' }}>
//               <div className="flex items-center gap-3 mb-2 flex-row-reverse">
//                 <div className="w-10 h-10 rounded-full bg-[#beff5f] flex items-center justify-center">
//                   <span className="material-symbols-outlined text-[#111f00]">done_all</span>
//                 </div>
//                 <span className="font-bold text-sm text-[#191c1d]">ManyRooms</span>
//               </div>
//               <p className="text-sm font-bold text-[#446900]">"Hey! Yes, we do! Want me to send you the link to book? 🚀"</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Social Proof */}
//       <section className="py-12 bg-white border-y border-[#c2c9b1]/30">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row items-center gap-12">
//           <div className="flex flex-col gap-2 shrink-0">
//             <h3 className="text-5xl font-extrabold leading-tight text-[#446900]">1M+</h3>
//             <p className="font-bold text-sm text-[#424937] uppercase">Creators Trust Us</p>
//           </div>
//           <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-12 opacity-50 hover:opacity-100 transition-all duration-500 flex-grow">
//             {['Meta', 'TikTok', 'Instagram', 'Facebook', 'WhatsApp'].map((brand) => (
//               <span key={brand} className="text-xl md:text-2xl font-extrabold text-[#191c1d]">{brand}</span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Everywhere Section */}
//       <section className="py-24 bg-[#f8f9fa] relative overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
//             <div className="max-w-2xl">
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">
//                 Everywhere your <span className="text-[#a43c12]">vision</span> lives.
//               </h2>
//               <p className="text-lg text-[#424937]">The most sophisticated network of creative square footage on the planet. Specialized for every niche.</p>
//             </div>
//             <Link href="/spaces" className="group flex items-center gap-2 text-[#446900] font-bold text-sm uppercase">
//               Explore all categories 
//               <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDSHg0tkd_xlXbd8XLxjvdWaUgh-Wgi_B2ogcGWvBQHu5itBc6wfvLL7Uks_ztfZQAqK7lWfTx4O_i13JCWPmO7gTmeYzxQaPrG_tsy3pbEsLcTdP08ztwgndHP1-Jt9pOad3BL9ib-gPyEx0GUvwlrJA2niuV8FD2JBh6h_ZsS8F0VriH2HZEpRKhFr-IScJrOEIwiePqm4kvFD-P41nwFMfMsU0MPd9kycWXkGl_DsOrZfIzoQzj7KEuW1hAx2iGIw-gZyhNPqb', badge: 'Audio Production', badgeColor: 'bg-[#635979] text-white', title: 'Music & Podcast Studios', desc: 'Acoustically perfect environments for your next hit.' },
//               { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB74YlBwI2kAzcpnrBVppH7dn6wM8Dpt5QmxAEKu3ImGGFSmPvz6AFW8tpeSIuKjkVDfRNSBFlNTxyizEu5zu2dstawrNFjmsy9aWG2giHSpNp1bHh_sCvEe5wjmkhOdFYNouCLbm00PkvPtRPTZWCftj0Qxhkuxy7jcfAt-TXbLa6CQgrvS2k7EUCcOSdozHLPPI_JNZQU11IxT7PtjMXuob_u02TdqLxb-Y2FgGONZYZcn5a5vXzDcb3hO1WGokfGXEgRAX-JP-cy', badge: 'Visual Arts', badgeColor: 'bg-[#beff5f] text-[#111f00]', title: 'Photography & Film', desc: 'Natural light lofts and professional cyc walls.' },
//               { image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRVPUuNYkbGYO_2TrCnEpkpXhaEJChhEI1eKHDnEIWVrkbPKAsranLkrOZncliRk2uhvXtaFPKcbz4MDlHZgYT5SqCiqkSOQlMb8D0s5WK-43lw61XoC26Wo5ZXj5cObwwVxdLO7jO_S2PtrSDCCWz86klSzEz1ZMJjL30RdAsth_8VUnAUTAcHYJ97bykBsJXrEtN7fy9JWeS_BGScrktCVk56-UDJeEfuZPAjY8aMOKHsQBQ2n4Q7S6CWgXnIbM2U5dXgpxB1_VI', badge: 'Co-Creation', badgeColor: 'bg-[#ffe6de] text-[#b4471d]', title: 'Pop-up & Design Hubs', desc: 'Dynamic spaces for teams to build the future.' },
//             ].map((card, i) => (
//               <div key={i} className="group relative rounded-[32px] overflow-hidden h-[500px] shadow-xl hover:-translate-y-2 transition-transform duration-500">
//                 <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={card.image} alt={card.title} />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-8 w-full">
//                   <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs mb-4 uppercase ${card.badgeColor}`}>{card.badge}</span>
//                   <h4 className="text-white text-2xl font-bold mb-2">{card.title}</h4>
//                   <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity">{card.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* The Crew Collective */}
//       <section className="py-24 bg-white relative overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
//             <div className="max-w-2xl">
//               <span className="inline-block px-4 py-1 rounded-full bg-[#beff5f] text-[#111f00] font-bold text-sm uppercase tracking-wider mb-4">The Crew Collective</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">
//                 Hire the <span className="text-[#446900]">pros</span> who make it happen.
//               </h2>
//               <p className="text-lg text-[#424937]">Don't just book a space—build your dream team. Access our vetted network of creative professionals ready to elevate your production.</p>
//             </div>
//             <Link href="/services" className="group flex items-center gap-2 text-[#446900] font-bold text-sm uppercase">
//               Browse all professionals <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { title: 'Photographers', desc: 'Editorial, Commercial & Portrait', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800' },
//               { title: 'Videographers', desc: 'DPs, Editors & Drone Pilots', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800' },
//               { title: 'HMU Artists', desc: 'Beauty, SFX & High-Fashion', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800' },
//               { title: 'Studio Support', desc: 'Cleaners, PAs & Set Builders', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800' },
//             ].map((service, i) => (
//               <div key={i} className="group relative rounded-[32px] overflow-hidden h-[400px] shadow-lg hover:-translate-y-2 transition-transform duration-500 cursor-pointer">
//                 <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={service.image} alt={service.title} />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//                 <div className="absolute bottom-0 left-0 p-6 w-full">
//                   <h4 className="text-white text-xl font-bold mb-1">{service.title}</h4>
//                   <p className="text-white/70 text-sm">{service.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Before/After Comparison */}
//       <section className="py-24 bg-[#f3f4f5]">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-[#e1e3e4] rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center">
//               <span className="text-sm font-bold text-[#424937] uppercase mb-8">Before ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#191c1d]">All work<br/>and no play.</h2>
//               <ul className="w-full space-y-6 text-left">
//                 {['Manual booking coordination.', 'Hidden studio fees.', 'Inconsistent vibe matching.', 'Slow creative output.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-[#c2c9b1]/30 pb-4">
//                     <span className="text-lg font-bold text-[#191c1d]">{item}</span>
//                     <span className="material-symbols-outlined text-[#ba1a1a]">close</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="bg-[#446900] text-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-8">
//                 <span className="material-symbols-outlined text-[#beff5f] text-6xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
//               </div>
//               <span className="text-sm font-bold text-[#beff5f] uppercase mb-8 relative z-10">After ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white relative z-10">Less grind<br/>and more pay.</h2>
//               <ul className="w-full space-y-6 text-left relative z-10">
//                 {['Auto-pilot studio management.', 'Transparent fixed pricing.', 'AI Vibe Search technology.', '24/7 revenue generation.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-white/20 pb-4">
//                     <span className="text-lg font-bold">{item}</span>
//                     <span className="material-symbols-outlined text-[#beff5f]">check_circle</span>
//                   </li>
//                 ))}
//               </ul>
//               <Link href="/signup" className="mt-12 w-full bg-[#beff5f] text-[#111f00] py-5 rounded-2xl font-extrabold text-lg hover:scale-105 transition-transform duration-200 relative z-10 text-center">
//                 Get Started for Free
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Steps Section */}
//       <section className="py-24 bg-white">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">
//             Get up and running in <span className="italic text-[#446900]">3 simple steps</span>.
//           </h2>
//         </div>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
//           {[
//             { icon: 'add_photo_alternate', title: 'List your space', desc: 'Upload photos, set your vibe tokens, and define your hours. It takes less than 5 minutes.', bg: 'bg-[#e4d7fd]' },
//             { icon: 'smart_toy', title: 'Automate bookings', desc: 'Let our Studio AI handle inquiries, vetting, and scheduling while you focus on creating.', bg: 'bg-[#beff5f]' },
//             { icon: 'account_balance_wallet', title: 'Collect revenue', desc: 'Instant payouts directly to your account. No more chasing invoices or "exposure" deals.', bg: 'bg-[#ffe6de]' },
//           ].map((step, i) => (
//             <div key={i} className="flex flex-col items-center gap-6 text-center">
//               <div className={`w-24 h-24 rounded-full ${step.bg} flex items-center justify-center mb-2`}>
//                 <span className="material-symbols-outlined text-4xl text-[#446900]" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
//               </div>
//               <h3 className="text-2xl font-bold text-[#191c1d]">{step.title}</h3>
//               <p className="text-lg text-[#424937]">{step.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Featured Studios Gallery */}
//       <section className="py-24 bg-[#f3f4f5] overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex justify-between items-end mb-12">
//           <h2 className="text-3xl font-bold text-[#191c1d]">
//             Featured Studios <span className="text-[#446900] bg-[#beff5f]/30 px-3 py-1 rounded-lg text-sm">New This Week</span>
//           </h2>
//           <div className="flex gap-2">
//             <button className="w-12 h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronLeftIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//             <button className="w-12 h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronRightIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//           </div>
//         </div>
//         <div className="flex gap-6 px-4 md:px-16 overflow-x-auto pb-8">
//           {loading ? (
//             <div className="flex justify-center w-full py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-[#424937]">Loading studios...</p>
//               </div>
//             </div>
//           ) : (
//             featuredSpaces.map((space) => {
//               const coverImage = getFirstImage(space.images);
//               return (
//                 <Link key={space.id} href={`/spaces/${space.id}`} className="min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-md group flex-shrink-0">
//                   <div className="h-64 relative overflow-hidden">
//                     {coverImage ? (
//                       <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverImage} alt={space.name} />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-[#edeeef]">
//                         <span className="material-symbols-outlined text-4xl text-[#c2c9b1]">image</span>
//                       </div>
//                     )}
//                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
//                       <StarIcon className="w-4 h-4 text-[#446900] fill-current" />
//                       <span className="font-bold text-sm text-[#191c1d]">4.9</span>
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-2">
//                       <h5 className="text-xl font-bold text-[#191c1d]">{space.name}</h5>
//                       <p className="font-bold text-[#446900]">${space.hourly_rate}/hr</p>
//                     </div>
//                     <p className="text-[#424937] text-sm mb-4 flex items-center gap-1">
//                       <MapPinIcon className="w-4 h-4" />
//                       {space.city || 'Location'}{space.state ? `, ${space.state}` : ''}
//                     </p>
//                     <div className="flex gap-2">
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Creative</span>
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Studio</span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })
//           )}
//         </div>
//       </section>

//       <Footer />
//       <Chatbot />

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
//       `}</style>
//     </div>
//   );
// }



// // app/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   Bars3Icon,
//   XMarkIcon,
//   StarIcon,
//   MapPinIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';
// import './home.css';

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
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     fetchApprovedStudios();
//     setTimeout(() => setIsVisible(true), 100);
//   }, []);

//   useEffect(() => {
//     if (isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => { document.body.style.overflow = 'unset'; };
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

//   return (
//     <div className="home-page bg-[#f8f9fa] text-[#191c1d] overflow-x-hidden">
      
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-8 md:h-10 w-auto object-contain" 
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj4l-7dKP6wsFLJVaha-0y6angmGBQIrc_25ZvzO4pYfo99ccX_Ez1Cr3eaBLwN7TpKfnyO2bQjSn2zi9-LvZwbIx095MYCOY5NMW4gv_1xZDjSqd1yOSaZpl9UPmKSQzsq3wUOQRyBffYS8_CHESXwD6FVa7gSAvRkqKad5Z2VLh7D8rkyBc0urG8eBfXgU2XyL9Ohy0_XdDvhHwLburvvSENjkI-jy9_qsIBmEaKAXA32QCjHabBj5ySLxFjbMrCKn3Im8WkmVQ0"
//               />
//             </Link>
//             <div className="hidden lg:flex gap-6 items-center">
//               <Link href="/" className="text-[#446900] font-bold border-b-2 border-[#446900] py-1">Marketplace</Link>
//               <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Studios</Link>
//               <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Vibes</Link>
//               <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors py-1">Journal</Link>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 md:gap-4">
//             <div className="hidden md:flex relative items-center">
//               <MagnifyingGlassIcon className="absolute left-3 w-4 h-4 text-[#737a65]" />
//               <input 
//                 className="pl-10 pr-4 py-2 bg-[#f3f4f5] border-none rounded-full w-48 lg:w-64 focus:ring-2 focus:ring-[#beff5f] text-sm outline-none text-[#191c1d]" 
//                 placeholder="Search by vibe..." 
//                 type="text" 
//               />
//             </div>
//             <Link 
//               href="/signup?role=owner" 
//               className="hidden md:block px-6 py-2 bg-[#beff5f] text-[#111f00] font-bold text-sm rounded-full hover:scale-105 transition-transform"
//             >
//               List Studio
//             </Link>
//             <div className="hidden md:flex items-center gap-3">
//               <span className="material-symbols-outlined text-[#424937] cursor-pointer hover:scale-105 transition-transform">favorite</span>
//               <span className="material-symbols-outlined text-[#424937] cursor-pointer hover:scale-105 transition-transform">account_circle</span>
//             </div>
//             <button 
//               onClick={() => setIsMobileMenuOpen(true)}
//               className="md:hidden p-2 hover:bg-gray-100 rounded-full"
//             >
//               <Bars3Icon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
//         <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-[#446900]">ManyRooms</span>
//               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
//                 <XMarkIcon className="w-6 h-6 text-[#191c1d]" />
//               </button>
//             </div>
//             <nav className="flex flex-col gap-6">
//               <Link href="/" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
//               <Link href="/spaces" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Studios</Link>
//               <Link href="/cities" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Vibes</Link>
//               <Link href="/about" className="text-base font-semibold text-[#191c1d] hover:text-[#446900]" onClick={() => setIsMobileMenuOpen(false)}>Journal</Link>
//               <div className="border-t border-gray-200 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Studio</Link>
//                 <Link href="/login" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-base font-semibold text-[#191c1d] hover:text-[#446900] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <header className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-[#f8f9fa]">
//         <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
//           {/* Left Content */}
//           <div className="lg:col-span-7 flex flex-col items-start gap-6">
//             <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <span className="inline-block px-4 py-1 rounded-full bg-[#e4d7fd] text-[#665c7c] font-bold text-sm uppercase tracking-wider mb-4">
//                 The Creative Evolution
//               </span>
//               <h1 className="text-[56px] leading-[62px] md:text-[84px] md:leading-[92px] font-extrabold text-[#191c1d] tracking-tighter">
//                 Space <span className="text-[#446900] italic">smarter</span>,<br/>not harder.
//               </h1>
//             </div>
//             <p className={`text-lg text-[#424937] max-w-xl transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               Monetize your creative square footage with powerful automations for booking, lighting, and access. Join 1M+ creators worldwide.
//             </p>
            
//             {/* Search by Vibe */}
//             <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//               <div className="bg-white/80 backdrop-blur-xl border border-white/40 p-2 rounded-[32px] flex items-center shadow-xl">
//                 <div className="flex-grow flex items-center px-4">
//                   <span className="material-symbols-outlined text-[#446900] mr-3" style={{ fontVariationSettings: "'FILL' 1" }}>
//                     temp_preferences_custom
//                   </span>
//                   <input 
//                     className="w-full bg-transparent border-none focus:ring-0 text-lg outline-none text-[#191c1d] placeholder:text-[#737a65]" 
//                     placeholder="Describe the aesthetic (e.g. '70s synth-wave desert loft')" 
//                     type="text" 
//                   />
//                 </div>
//                 <Link 
//                   href="/spaces"
//                   className="bg-[#beff5f] text-[#111f00] px-8 py-4 rounded-[24px] font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(190,255,95,0.6)] transition-all"
//                 >
//                   <span className="material-symbols-outlined">auto_awesome</span>
//                   Search by Vibe
//                 </Link>
//               </div>
//               <div className="flex gap-4 mt-4 px-4 overflow-x-auto whitespace-nowrap">
//                 <span className="text-[#424937] text-sm font-bold">Trending:</span>
//                 <Link href="/spaces?vibe=concrete" className="text-[#446900] hover:underline text-sm">#ConcreteMinimalism</Link>
//                 <Link href="/spaces?vibe=music" className="text-[#446900] hover:underline text-sm">#SoftGlowMusic</Link>
//                 <Link href="/spaces?vibe=podcast" className="text-[#446900] hover:underline text-sm">#PodcastNook</Link>
//               </div>
//             </div>
//           </div>

//           {/* Right: Floating UI Elements */}
//           <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center h-[600px]">
//             {/* Chat Bubble 1 */}
//             <div className="absolute top-10 right-0 bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-2xl max-w-[280px] border-l-8 border-[#beff5f] animate-float" style={{ animation: 'float 6s ease-in-out infinite' }}>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-10 h-10 rounded-full bg-[#e4d7fd] flex items-center justify-center">
//                   <span className="material-symbols-outlined text-[#665c7c]">camera_enhance</span>
//                 </div>
//                 <span className="font-bold text-sm text-[#191c1d]">Studio Bot</span>
//               </div>
//               <p className="text-sm italic text-[#191c1d]">"Hey! Do you sell production hours?"</p>
//             </div>
            
//             {/* Chat Bubble 2 */}
//             <div className="absolute bottom-20 left-0 bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-2xl max-w-[280px] border-r-8 border-[#ffe6de] animate-float" style={{ animation: 'float 6s ease-in-out infinite 1s' }}>
//               <div className="flex items-center gap-3 mb-2 flex-row-reverse">
//                 <div className="w-10 h-10 rounded-full bg-[#beff5f] flex items-center justify-center">
//                   <span className="material-symbols-outlined text-[#111f00]">done_all</span>
//                 </div>
//                 <span className="font-bold text-sm text-[#191c1d]">ManyRooms</span>
//               </div>
//               <p className="text-sm font-bold text-[#446900]">"Hey! Yes, we do! Want me to send you the link to book? 🚀"</p>
//             </div>
            
//             {/* Central Phone Mockup */}
//             <div className="w-64 h-[450px] bg-[#2e3132] rounded-[40px] border-[8px] border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col">
//               <div className="h-32 bg-[#beff5f] relative">
//                 <img 
//                   className="w-full h-full object-cover opacity-80" 
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEcneV5lcUlFeZUcm_ff4qQxqjQbzN4o3_U3hJzWCH-eW-VnGPuYNa-SYcgEmQD3I_7ZS7Oac3wtaeHrgoVfqdIKAKj_5jt7kTg05Ug5XdTexBYAFwvmqJt_j7O209SKskNelZw1BSN_76BQc_Osj4SgpFgcAxUKyJdrILXfnUd0q4779LgFWEe8V-uLciwLOgYG5ExzeMHC2QQzJga_eOX-B928C1wuEoobocnGSkN6dpk2Hc8gMy2lkCryDiOxnKOA4DeyjJh7cD"
//                   alt="Studio preview"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
//               </div>
//               <div className="flex-grow p-4 flex flex-col gap-3">
//                 <div className="h-2 w-20 bg-[#e1e3e4] rounded-full"></div>
//                 <div className="h-4 w-full bg-[#e1e3e4] rounded-full"></div>
//                 <div className="h-4 w-3/4 bg-[#e1e3e4] rounded-full"></div>
//                 <div className="mt-auto h-12 w-full bg-[#beff5f] rounded-xl flex items-center justify-center">
//                   <span className="font-bold text-[#111f00] text-sm">Confirm Booking</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Social Proof */}
//       <section className="py-12 bg-white border-y border-[#c2c9b1]/30">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row items-center gap-12">
//           <div className="flex flex-col gap-2 shrink-0">
//             <h3 className="text-5xl font-extrabold leading-tight text-[#446900]">1M+</h3>
//             <p className="font-bold text-sm text-[#424937] uppercase">Creators Trust Us</p>
//           </div>
//           <div className="flex flex-wrap justify-center md:justify-start gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 flex-grow">
//             <span className="text-2xl font-extrabold text-[#191c1d]">Meta</span>
//             <span className="text-2xl font-extrabold text-[#191c1d]">TikTok</span>
//             <span className="text-2xl font-extrabold text-[#191c1d]">Instagram</span>
//             <span className="text-2xl font-extrabold text-[#191c1d]">Facebook</span>
//             <span className="text-2xl font-extrabold text-[#191c1d]">WhatsApp</span>
//           </div>
//         </div>
//       </section>

//       {/* Everywhere Section */}
//       <section className="py-24 bg-[#f8f9fa] relative overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
//             <div className="max-w-2xl">
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">
//                 Everywhere your <span className="text-[#a43c12]">vision</span> lives.
//               </h2>
//               <p className="text-lg text-[#424937]">The most sophisticated network of creative square footage on the planet. Specialized for every niche.</p>
//             </div>
//             <Link href="/spaces" className="group flex items-center gap-2 text-[#446900] font-bold text-sm uppercase">
//               Explore all categories 
//               <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
//             </Link>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Audio Production */}
//             <div className="group relative rounded-[32px] overflow-hidden h-[500px] shadow-xl hover:-translate-y-2 transition-transform duration-500">
//               <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDSHg0tkd_xlXbd8XLxjvdWaUgh-Wgi_B2ogcGWvBQHu5itBc6wfvLL7Uks_ztfZQAqK7lWfTx4O_i13JCWPmO7gTmeYzxQaPrG_tsy3pbEsLcTdP08ztwgndHP1-Jt9pOad3BL9ib-gPyEx0GUvwlrJA2niuV8FD2JBh6h_ZsS8F0VriH2HZEpRKhFr-IScJrOEIwiePqm4kvFD-P41nwFMfMsU0MPd9kycWXkGl_DsOrZfIzoQzj7KEuW1hAx2iGIw-gZyhNPqb"
//                 alt="Audio Production" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//               <div className="absolute bottom-0 left-0 p-8 w-full">
//                 <span className="inline-block px-3 py-1 bg-[#635979] text-white rounded-full font-bold text-xs mb-4 uppercase">Audio Production</span>
//                 <h4 className="text-white text-2xl font-bold mb-2">Music & Podcast Studios</h4>
//                 <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Acoustically perfect environments for your next hit.</p>
//               </div>
//             </div>
            
//             {/* Visual Arts */}
//             <div className="group relative rounded-[32px] overflow-hidden h-[500px] shadow-xl hover:-translate-y-2 transition-transform duration-500">
//               <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuB74YlBwI2kAzcpnrBVppH7dn6wM8Dpt5QmxAEKu3ImGGFSmPvz6AFW8tpeSIuKjkVDfRNSBFlNTxyizEu5zu2dstawrNFjmsy9aWG2giHSpNp1bHh_sCvEe5wjmkhOdFYNouCLbm00PkvPtRPTZWCftj0Qxhkuxy7jcfAt-TXbLa6CQgrvS2k7EUCcOSdozHLPPI_JNZQU11IxT7PtjMXuob_u02TdqLxb-Y2FgGONZYZcn5a5vXzDcb3hO1WGokfGXEgRAX-JP-cy"
//                 alt="Visual Arts" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//               <div className="absolute bottom-0 left-0 p-8 w-full">
//                 <span className="inline-block px-3 py-1 bg-[#beff5f] text-[#111f00] rounded-full font-bold text-xs mb-4 uppercase">Visual Arts</span>
//                 <h4 className="text-white text-2xl font-bold mb-2">Photography & Film</h4>
//                 <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Natural light lofts and professional cyc walls.</p>
//               </div>
//             </div>
            
//             {/* Co-Creation */}
//             <div className="group relative rounded-[32px] overflow-hidden h-[500px] shadow-xl hover:-translate-y-2 transition-transform duration-500">
//               <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRVPUuNYkbGYO_2TrCnEpkpXhaEJChhEI1eKHDnEIWVrkbPKAsranLkrOZncliRk2uhvXtaFPKcbz4MDlHZgYT5SqCiqkSOQlMb8D0s5WK-43lw61XoC26Wo5ZXj5cObwwVxdLO7jO_S2PtrSDCCWz86klSzEz1ZMJjL30RdAsth_8VUnAUTAcHYJ97bykBsJXrEtN7fy9JWeS_BGScrktCVk56-UDJeEfuZPAjY8aMOKHsQBQ2n4Q7S6CWgXnIbM2U5dXgpxB1_VI"
//                 alt="Co-Creation" />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
//               <div className="absolute bottom-0 left-0 p-8 w-full">
//                 <span className="inline-block px-3 py-1 bg-[#ffe6de] text-[#b4471d] rounded-full font-bold text-xs mb-4 uppercase">Co-Creation</span>
//                 <h4 className="text-white text-2xl font-bold mb-2">Pop-up & Design Hubs</h4>
//                 <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Dynamic spaces for teams to build the future.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Before/After Comparison */}
//       <section className="py-24 bg-[#f3f4f5]">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Before */}
//             <div className="bg-[#e1e3e4] rounded-[40px] p-12 flex flex-col items-center text-center">
//               <span className="text-sm font-bold text-[#424937] uppercase mb-8">Before ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-[#191c1d]">All work<br/>and no play.</h2>
//               <ul className="w-full space-y-6 text-left">
//                 {['Manual booking coordination.', 'Hidden studio fees.', 'Inconsistent vibe matching.', 'Slow creative output.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-[#c2c9b1]/30 pb-4">
//                     <span className="text-lg font-bold text-[#191c1d]">{item}</span>
//                     <span className="material-symbols-outlined text-[#ba1a1a]">close</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             {/* After */}
//             <div className="bg-[#446900] text-white rounded-[40px] p-12 flex flex-col items-center text-center relative overflow-hidden">
//               <div className="absolute top-0 right-0 p-8">
//                 <span className="material-symbols-outlined text-[#beff5f] text-6xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
//               </div>
//               <span className="text-sm font-bold text-[#beff5f] uppercase mb-8 relative z-10">After ManyRooms</span>
//               <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-white relative z-10">Less grind<br/>and more pay.</h2>
//               <ul className="w-full space-y-6 text-left relative z-10">
//                 {['Auto-pilot studio management.', 'Transparent fixed pricing.', 'AI Vibe Search technology.', '24/7 revenue generation.'].map((item) => (
//                   <li key={item} className="flex items-center justify-between border-b border-white/20 pb-4">
//                     <span className="text-lg font-bold">{item}</span>
//                     <span className="material-symbols-outlined text-[#beff5f]">check_circle</span>
//                   </li>
//                 ))}
//               </ul>
//               <Link href="/signup" className="mt-12 w-full bg-[#beff5f] text-[#111f00] py-5 rounded-2xl font-extrabold text-lg hover:scale-105 transition-transform duration-200 relative z-10 text-center">
//                 Get Started for Free
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Steps Section */}
//       <section className="py-24 bg-white">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#191c1d]">
//             Get up and running in <span className="italic text-[#446900]">3 simple steps</span>.
//           </h2>
//         </div>
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
//           {[
//             { icon: 'add_photo_alternate', title: 'List your space', desc: 'Upload photos, set your vibe tokens, and define your hours. It takes less than 5 minutes.', bg: 'bg-[#e4d7fd]' },
//             { icon: 'smart_toy', title: 'Automate bookings', desc: 'Let our Studio AI handle inquiries, vetting, and scheduling while you focus on creating.', bg: 'bg-[#beff5f]' },
//             { icon: 'account_balance_wallet', title: 'Collect revenue', desc: 'Instant payouts directly to your account. No more chasing invoices or "exposure" deals.', bg: 'bg-[#ffe6de]' },
//           ].map((step, i) => (
//             <div key={i} className="flex flex-col items-center gap-6 text-center">
//               <div className={`w-24 h-24 rounded-full ${step.bg} flex items-center justify-center mb-2`}>
//                 <span className="material-symbols-outlined text-4xl text-[#446900]" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
//               </div>
//               <h3 className="text-2xl font-bold text-[#191c1d]">{step.title}</h3>
//               <p className="text-lg text-[#424937]">{step.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Featured Studios Gallery */}
//       <section className="py-24 bg-[#f3f4f5] overflow-hidden">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex justify-between items-end mb-12">
//           <h2 className="text-3xl font-bold text-[#191c1d]">
//             Featured Studios <span className="text-[#446900] bg-[#beff5f]/30 px-3 py-1 rounded-lg text-sm">New This Week</span>
//           </h2>
//           <div className="flex gap-2">
//             <button className="w-12 h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronLeftIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//             <button className="w-12 h-12 rounded-full border border-[#c2c9b1] flex items-center justify-center hover:bg-[#edeeef] transition-colors">
//               <ChevronRightIcon className="w-5 h-5 text-[#191c1d]" />
//             </button>
//           </div>
//         </div>
        
//         <div className="flex gap-6 px-4 md:px-16 overflow-x-auto pb-8">
//           {loading ? (
//             <div className="flex justify-center w-full py-20">
//               <div className="animate-pulse text-center">
//                 <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//                 <p className="text-[#424937]">Loading studios...</p>
//               </div>
//             </div>
//           ) : (
//             featuredSpaces.map((space) => {
//               const coverImage = getFirstImage(space.images);
//               return (
//                 <Link key={space.id} href={`/spaces/${space.id}`} className="min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-md group flex-shrink-0">
//                   <div className="h-64 relative overflow-hidden">
//                     {coverImage ? (
//                       <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={coverImage} alt={space.name} />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-[#edeeef]">
//                         <span className="material-symbols-outlined text-4xl text-[#c2c9b1]">image</span>
//                       </div>
//                     )}
//                     <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
//                       <StarIcon className="w-4 h-4 text-[#446900] fill-current" />
//                       <span className="font-bold text-sm text-[#191c1d]">4.9</span>
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-2">
//                       <h5 className="text-xl font-bold text-[#191c1d]">{space.name}</h5>
//                       <p className="font-bold text-[#446900]">${space.hourly_rate}/hr</p>
//                     </div>
//                     <p className="text-[#424937] text-sm mb-4 flex items-center gap-1">
//                       <MapPinIcon className="w-4 h-4" />
//                       {space.city || 'Location'}{space.state ? `, ${space.state}` : ''}
//                     </p>
//                     <div className="flex gap-2">
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Creative</span>
//                       <span className="px-2 py-1 bg-[#f3f4f5] rounded-md text-xs font-bold text-[#424937]">#Studio</span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })
//           )}
//         </div>
//       </section>

//       <Footer />
//       <Chatbot />

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }



// // nee chnage


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
//   const animationFrameRef = useRef<number | null>(null);
//   const [textColor, setTextColor] = useState('#191c1d');
//   const [isMobile, setIsMobile] = useState(false);

//   const heroImages = [
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDo9P8cWMtlxC-vTKW_d789xE15ySyxsMb_U8Qe2iYrUWUJBlZ11z5sKoQQW5e-jeLwqaQOM0Kgb7ebgD6PqdUAKnW2S18GHubom8jAuDBqLBKkgP-ja77FpNibRKYP2eTFbt1LWmw_r-Tcwy29nP0kT3ERHsQ7AALtSKG623o-AmbEdIQSysiYVdkv3wzhPfpeuqsQUGNGfe0yYSqFPrzrb85t6zX4hO_Sp7K94b89goSxv0XdXC3e8wP-E5VGz5gk57zVVUbwzSDM',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDSwmSKLUnWOMsQ3GugJdlOZS5BByKJaiEs61TyG209DcA2Bqys9Or3aAbjaOFLiR8KH9xts5is8WOCU89o8TxY4EuPTx3Y7eINF0W0JjMW8ZZ5xYUZB5ThUYmjzzq6EERLeNzzD0U1o50RoOSqZqR1kCc67u55wSoCa7qKpALt43g75uDvONV3VOrCUDZoDHw_1nvmvMdKyGSZQvV-ffQc-yIuf-LaLoT3SWHaSi85V5-kEkwfNlO-MZv8WnnM-HWMlBvx5TYjJB6F',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuAtaHsD_Ee0OXgccRwyuBHMMGBF5R9Wv7zL6xdfFmVFYNTibEc531TN2DKYpRcRHkWa6LNR-2FEaFzFCKoH7alTA6ZN4q7jb2vYuVe8qo4dKOIRupQxXdeWuFfgP-ZD-bYdZ4y83gObwQRQga8Gb2f8GOaemUrFtQcqt_0rcQZ_GS3KH-aiNPL50ZBFTzVERvqcftQZLBU1XEGVqm59af7kBpaAV0rreAUxgHeTcLcawMQ__wUXvyFc0Ko9pGwkWWs9A1g6uMKIjl5F',
//     'https://lh3.googleusercontent.com/aida-public/AB6AXuDLkL_S-dw1DwN3C_25Bg1DkuiE4eStzko3W4oDgh-uQKrWWmbQNb8qx0xEEcqWJ2UrtMJl3GF2rbvtvt2G6yyZf0PyFp7G6J-gkcEkNv8m_KbQUky3KfZmt1R18XEJJlqQe5VKA1HgbLcaAmUHy0nM7zSTyaMh6MSTiVto7EjDhv1SPZ4x0RuvmLu7w532bPBwYZ9IyoSjxBUn8v77ZUSe_yE-mHRWCYYoqLKUQc2mEqxLKKTXlIUP3oYmxWXzVhnkz0EXuhLHLU9U'
//   ];

//   // Check if mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Animate cards continuously - adjusted for mobile
//   useEffect(() => {
//     let time = 0;
    
//     const animateCards = () => {
//       time += 0.008;
      
//       if (isMobile) {
//         // Smaller movements for mobile
//         setCardPositions([
//           {
//             x: -25 + Math.sin(time * 0.7) * 15,
//             y: -5 + Math.cos(time * 0.5) * 20,
//             rotate: -4 + Math.sin(time * 0.4) * 3,
//             scale: 0.7,
//             opacity: 0.8 + Math.sin(time * 0.6) * 0.1,
//             zIndex: Math.sin(time * 0.3) > 0 ? 2 : 1
//           },
//           {
//             x: Math.sin(time * 0.6) * 15,
//             y: 8 + Math.cos(time * 0.45) * 18,
//             rotate: Math.sin(time * 0.35) * 2,
//             scale: 0.82,
//             opacity: 1,
//             zIndex: 3
//           },
//           {
//             x: 22 + Math.cos(time * 0.65) * 15,
//             y: -3 + Math.sin(time * 0.55) * 20,
//             rotate: 4 + Math.cos(time * 0.45) * 2,
//             scale: 0.72,
//             opacity: 0.8 + Math.cos(time * 0.5) * 0.1,
//             zIndex: Math.cos(time * 0.3) > 0 ? 2 : 1
//           },
//           {
//             x: -15 + Math.cos(time * 0.75) * 18,
//             y: 15 + Math.sin(time * 0.6) * 22,
//             rotate: -2 + Math.cos(time * 0.5) * 2,
//             scale: 0.65,
//             opacity: 0.75 + Math.sin(time * 0.7) * 0.1,
//             zIndex: 1
//           },
//           {
//             x: 15 + Math.sin(time * 0.8) * 18,
//             y: -12 + Math.cos(time * 0.7) * 20,
//             rotate: 3 + Math.sin(time * 0.55) * 2,
//             scale: 0.68,
//             opacity: 0.75 + Math.cos(time * 0.65) * 0.1,
//             zIndex: 1
//           },
//         ]);
//       } else {
//         // Full movements for desktop
//         setCardPositions([
//           {
//             x: -35 + Math.sin(time * 0.7) * 25,
//             y: -10 + Math.cos(time * 0.5) * 30,
//             rotate: -6 + Math.sin(time * 0.4) * 4,
//             scale: 0.85,
//             opacity: 0.85 + Math.sin(time * 0.6) * 0.1,
//             zIndex: Math.sin(time * 0.3) > 0 ? 2 : 1
//           },
//           {
//             x: Math.sin(time * 0.6) * 20,
//             y: 10 + Math.cos(time * 0.45) * 25,
//             rotate: Math.sin(time * 0.35) * 3,
//             scale: 0.95 + Math.sin(time * 0.5) * 0.05,
//             opacity: 1,
//             zIndex: 3
//           },
//           {
//             x: 30 + Math.cos(time * 0.65) * 25,
//             y: -5 + Math.sin(time * 0.55) * 30,
//             rotate: 5 + Math.cos(time * 0.45) * 3,
//             scale: 0.87,
//             opacity: 0.85 + Math.cos(time * 0.5) * 0.1,
//             zIndex: Math.cos(time * 0.3) > 0 ? 2 : 1
//           },
//           {
//             x: -20 + Math.cos(time * 0.75) * 30,
//             y: 20 + Math.sin(time * 0.6) * 35,
//             rotate: -3 + Math.cos(time * 0.5) * 3,
//             scale: 0.8,
//             opacity: 0.8 + Math.sin(time * 0.7) * 0.1,
//             zIndex: 1
//           },
//           {
//             x: 20 + Math.sin(time * 0.8) * 28,
//             y: -18 + Math.cos(time * 0.7) * 32,
//             rotate: 4 + Math.sin(time * 0.55) * 3,
//             scale: 0.83,
//             opacity: 0.8 + Math.cos(time * 0.65) * 0.1,
//             zIndex: 1
//           },
//         ]);
//       }
      
//       animationFrameRef.current = requestAnimationFrame(animateCards);
//     };
    
//     animationFrameRef.current = requestAnimationFrame(animateCards);
    
//     return () => {
//       if (animationFrameRef.current !== null) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, [isMobile]);

//   // Check if text overlaps with dark images and invert text color
//   useEffect(() => {
//     const checkOverlap = () => {
//       if (!textRef.current || !heroRef.current) return;
      
//       const textRect = textRef.current.getBoundingClientRect();
      
//       const cards = heroRef.current.querySelectorAll('.hero-card');
//       let isOverDarkArea = false;
      
//       cards.forEach((card) => {
//         const cardRect = card.getBoundingClientRect();
//         const cardZIndex = parseInt(card.getAttribute('data-zindex') || '0');
        
//         const overlapX = textRect.left < cardRect.right && textRect.right > cardRect.left;
//         const overlapY = textRect.top < cardRect.bottom && textRect.bottom > cardRect.top;
        
//         if (overlapX && overlapY && cardZIndex >= 2) {
//           isOverDarkArea = true;
//         }
//       });
      
//       setTextColor(isOverDarkArea ? '#ffffff' : '#191c1d');
//     };
    
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
//       {/* Navigation - solid background on mobile */}
//       <nav className="fixed top-0 w-full z-50 bg-white/95 md:bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300">
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <img 
//                 alt="ManyRooms Logo" 
//                 className="h-8 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
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
//           <div className="flex items-center gap-2 md:gap-4">
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
//               className="material-symbols-outlined text-primary cursor-pointer hover:scale-110 transition-transform p-2 hover:bg-primary-container/20 rounded-full hidden md:block"
//             >
//               account_circle
//             </button>
//             {/* Mobile menu button - solid background */}
//             <button 
//               onClick={() => setIsMobileMenuOpen(true)}
//               className="md:hidden p-2 hover:bg-primary/10 rounded-full transition-all bg-surface-container-lowest shadow-sm border border-outline-variant/20"
//             >
//               <Bars3Icon className="w-5 h-5 text-on-surface" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu - solid white background */}
//       <div 
//         className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
//           isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div 
//           className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//         <div 
//           className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${
//             isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           }`}
//         >
//           <div className="p-6">
//             <div className="flex justify-between items-center mb-10">
//               <span className="text-2xl font-bold text-primary">ManyRooms</span>
//               <button 
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-all"
//               >
//                 <XMarkIcon className="w-6 h-6 text-on-surface" />
//               </button>
//             </div>

//             <nav className="flex flex-col gap-6">
//               <Link href="/" className="text-base font-semibold text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
//               <Link href="/spaces" className="text-base font-semibold text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Studios</Link>
//               <Link href="/cities" className="text-base font-semibold text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Vibes</Link>
//               <Link href="/about" className="text-base font-semibold text-on-surface hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Journal</Link>
              
//               <div className="border-t border-gray-200 pt-6 mt-2">
//                 <Link href="/signup?role=owner" className="block text-base font-semibold text-on-surface hover:text-primary transition-colors mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Studio</Link>
//                 <Link href="/login" className="block text-base font-semibold text-on-surface hover:text-primary transition-colors mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
//                 <Link href="/signup" className="block text-base font-semibold text-on-surface hover:text-primary transition-colors mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
//                 <Link href="/support" className="block text-base font-semibold text-on-surface hover:text-primary transition-colors mb-4" onClick={() => setIsMobileMenuOpen(false)}>Contact Support</Link>
//                 <button className="flex items-center gap-2 text-base font-semibold text-on-surface hover:text-primary transition-colors">
//                   <GlobeAltIcon className="w-4 h-4" />
//                   Language
//                 </button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Login/Signup Modal - solid white background */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
//           <div 
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={() => setIsModalOpen(false)}
//           />
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 border border-gray-100">
//             <button 
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all"
//             >
//               <XMarkIcon className="w-5 h-5 text-gray-600" />
//             </button>
            
//             <div className="text-center mb-8">
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ManyRooms</h3>
//               <p className="text-sm text-gray-600">Find and book the perfect creative space</p>
//             </div>

//             <div className="space-y-4">
//               <Link 
//                 href="/login" 
//                 className="block w-full text-center bg-primary text-white py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-md"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Log in
//               </Link>
//               <Link 
//                 href="/signup" 
//                 className="block w-full text-center border-2 border-gray-200 py-3 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-900"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Sign up
//               </Link>
//               <div className="border-t border-gray-200 pt-4 mt-2">
//                 <Link 
//                   href="/signup?role=owner" 
//                   className="block w-full text-center text-xs uppercase tracking-widest text-gray-500 hover:text-primary transition-colors"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   List your space
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 3D Animated Hero Section - fixed mobile spacing */}
//       <section 
//         ref={heroRef} 
//         className="relative min-h-[85vh] md:h-[95vh] flex items-center justify-center px-4 md:px-16 overflow-hidden bg-surface pt-20 md:pt-0"
//       >
//         {/* Moving image cards */}
//         <div className="absolute inset-0 z-0 pointer-events-none" style={{ perspective: isMobile ? '800px' : '1500px' }}>
//           <div className="relative w-full h-full flex items-center justify-center">
//             {cardPositions.map((pos, index) => (
//               <div
//                 key={index}
//                 className="hero-card absolute w-[160px] h-[220px] md:w-[300px] md:h-[400px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-white/20"
//                 data-zindex={pos.zIndex}
//                 style={{
//                   backgroundImage: `url('${heroImages[index % heroImages.length]}')`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   transform: `translate(${pos.x}%, ${pos.y}%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
//                   zIndex: pos.zIndex,
//                   opacity: pos.opacity,
//                   transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
//                   boxShadow: pos.zIndex >= 3 ? '0 30px 60px rgba(0,0,0,0.4)' : '0 15px 30px rgba(0,0,0,0.2)',
//                 }}
//               />
//             ))}
//           </div>
//           {/* Gradient overlay for text readability */}
//           <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-surface/90 pointer-events-none" />
//         </div>

//         {/* Hero text content with dynamic color */}
//         <div 
//           ref={textRef}
//           className={`relative z-20 text-center max-w-4xl mx-auto transition-all duration-1000 ${
//             isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
//           } ${isMobile ? 'pt-8 pb-12' : 'pt-20'}`}
//         >
//           <div className="mb-4 md:mb-6 inline-block bg-secondary-container/95 backdrop-blur-sm px-4 md:px-5 py-1.5 md:py-2 rounded-full text-on-secondary-container font-label-bold pulse-glow text-sm md:text-base">
//             ✨ NEW: AI SPACE DISCOVERY
//           </div>
//           <h1 
//             className="text-[40px] md:text-[84px] font-display-lg leading-[1.1] mb-4 md:mb-8 tracking-tighter transition-colors duration-500 px-2"
//             style={{ 
//               color: textColor,
//               textShadow: textColor === '#ffffff' ? '0 2px 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(255,255,255,0.8)'
//             }}
//           >
//             Your Creative <span className="text-primary italic">Stage</span>,<br/>Redefined.
//           </h1>
//           <p 
//             className="text-base md:text-[18px] max-w-md md:max-w-xl mx-auto mb-8 md:mb-12 font-body-lg transition-colors duration-500 px-4"
//             style={{ 
//               color: textColor === '#ffffff' ? 'rgba(255,255,255,0.9)' : '#424937',
//               textShadow: textColor === '#ffffff' ? '0 1px 10px rgba(0,0,0,0.5)' : 'none'
//             }}
//           >
//             Discover extraordinary spaces. Book instantly. Create without limits.
//           </p>
          
//           {/* AI Visual Search Bar */}
//           <div className="glass max-w-md md:max-w-2xl mx-auto rounded-2xl md:rounded-3xl p-2 flex flex-col md:flex-row items-center shadow-2xl mt-8 md:mt-12 border-2 border-white/60 hover:border-primary/30 transition-all duration-500 mx-4 md:mx-auto">
//             <div className="flex-1 px-4 md:px-6 flex items-center gap-2 md:gap-3 w-full">
//               <MagnifyingGlassIcon className="w-5 h-5 md:w-6 md:h-6 text-outline flex-shrink-0" />
//               <input 
//                 className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 md:py-4 text-sm md:text-base font-body-md placeholder:text-outline/60 outline-none" 
//                 placeholder="Describe the mood, aesthetic, or upload an image..." 
//                 type="text"
//               />
//             </div>
//             <div className="flex items-center gap-2 w-full md:w-auto p-2 md:p-0 border-t md:border-t-0 border-white/20 mt-2 md:mt-0 pt-2 md:pt-0">
//               <label className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-surface-container-high cursor-pointer hover:bg-secondary-container transition-all group relative" title="Upload reference image">
//                 <input className="hidden" type="file" accept="image/*"/>
//                 <PhotoIcon className="w-5 h-5 md:w-6 md:h-6 text-on-surface-variant group-hover:text-secondary transition-colors" />
//               </label>
//               <Link 
//                 href="/spaces"
//                 className="flex-1 md:flex-none bg-primary-fixed text-on-primary-fixed px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-label-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl whitespace-nowrap flex items-center gap-2 justify-center text-sm md:text-base"
//               >
//                 FIND SPACE
//                 <span className="text-sm">→</span>
//               </Link>
//             </div>
//           </div>
          
//           {/* Quick Stats */}
//           <div className="flex justify-center gap-6 md:gap-12 mt-12 md:mt-16 text-center">
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
//                 <p className="text-3xl md:text-4xl font-display-sm text-primary">{stat.value}</p>
//                 <p 
//                   className="font-label-bold text-[10px] md:text-xs tracking-wider transition-colors duration-500"
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
//       <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1440px] mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-16 gap-4">
//           <div>
//             <span className="font-label-bold text-primary tracking-widest uppercase text-xs">DISCOVER</span>
//             <h2 className="text-[36px] md:text-[48px] font-display-sm tracking-tighter mt-2">Search by Vibe</h2>
//           </div>
//           <p className="text-base md:text-[18px] text-on-surface-variant max-w-md">Our curated categories move beyond utility, focusing on the architectural soul of the space.</p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 h-auto md:h-[600px]">
//           <Link href="/spaces?vibe=brutalist" className="group relative overflow-hidden rounded-2xl md:rounded-3xl md:col-span-2 min-h-[250px] md:min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[0]}')` }}></div>
//             <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20">
//               <span className="bg-primary-container text-on-primary-container px-3 md:px-4 py-1 rounded-full font-label-bold mb-3 md:mb-4 inline-block text-xs md:text-sm">🔥 TRENDING</span>
//               <h3 className="text-white text-2xl md:text-3xl font-display-sm mb-2">Brutalist</h3>
//               <p className="text-white/80 font-body-md text-sm md:text-base">Raw concrete, dramatic scale, and uncompromising geometry.</p>
//               <p className="text-primary-fixed font-label-bold mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm">Explore 45 spaces <span>→</span></p>
//             </div>
//           </Link>

//           <Link href="/spaces?vibe=organic" className="group relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[250px] md:min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-tertiary-container/40 mix-blend-overlay z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[3]}')` }}></div>
//             <div className="absolute inset-0 flex items-center justify-center z-20">
//               <div className="text-center">
//                 <h3 className="text-tertiary text-2xl md:text-3xl -rotate-6 bg-white/95 px-6 md:px-8 py-2 md:py-3 shadow-2xl rounded-2xl font-display-sm">Organic</h3>
//                 <p className="text-tertiary/80 font-label-bold mt-3 md:mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-sm">Nature-meets-design</p>
//               </div>
//             </div>
//           </Link>

//           <Link href="/spaces?vibe=scifi" className="group relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[250px] md:min-h-[300px] floating-interaction cursor-pointer">
//             <div className="absolute inset-0 bg-primary-fixed/30 mix-blend-color z-10"></div>
//             <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${heroImages[4]}')` }}></div>
//             <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-20 text-right">
//               <h3 className="text-primary-fixed neon-accent text-3xl md:text-4xl font-headline-lg">Sci-Fi</h3>
//               <p className="text-white font-label-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm">Futuristic & cyberpunk</p>
//               <span className="text-white text-3xl md:text-4xl mt-2 block">↗</span>
//             </div>
//           </Link>
//         </div>
//       </section>

//       {/* Featured Studios Section */}
//       <section className="bg-surface-container py-16 md:py-24 px-4 md:px-16 overflow-hidden">
//         <div className="max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 mb-8 md:mb-12">
//             <div className="h-px bg-outline-variant flex-1"></div>
//             <h2 className="font-label-bold text-primary tracking-widest uppercase text-sm md:text-base">Curated Collections</h2>
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
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
//               {featuredSpaces.map((space, index) => {
//                 const coverImage = getFirstImage(space.images);
//                 return (
//                   <Link 
//                     key={space.id} 
//                     href={`/spaces/${space.id}`}
//                     className={`group card-hover bg-surface-container-lowest rounded-[32px] md:rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 ${index === 1 ? 'md:mt-12 md:-mt-8' : ''}`}
//                   >
//                     <div className="h-[300px] md:h-[400px] relative overflow-hidden">
//                       {coverImage ? (
//                         <img src={coverImage} alt={space.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
//                         </div>
//                       )}
//                       <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-primary-fixed text-on-primary-fixed px-3 md:px-4 py-1.5 md:py-2 rounded-2xl font-label-bold shadow-lg text-sm md:text-base">
//                         ${space.hourly_rate}<span className="text-xs md:text-sm font-normal">/hr</span>
//                       </div>
//                       <div className="absolute top-4 md:top-6 right-4 md:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <span className="material-symbols-outlined text-white text-2xl md:text-3xl drop-shadow-lg cursor-pointer hover:scale-110 transition-transform">favorite</span>
//                       </div>
//                     </div>
//                     <div className="p-6 md:p-8">
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <h3 className="font-headline-lg text-xl md:text-2xl mb-1">{space.name}</h3>
//                           <p className="text-on-surface-variant font-body-md flex items-center gap-1 text-sm md:text-base">
//                             <span className="material-symbols-outlined text-sm">location_on</span> 
//                             {space.city || 'Location TBD'}{space.state ? `, ${space.state}` : ''}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <span className="material-symbols-outlined text-primary text-lg md:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
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
//       <section className="py-16 md:py-24 px-4 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
//         <div className="max-w-[1440px] mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
//             <div className="order-2 lg:order-1">
//               <div className="flex items-center gap-4 mb-4 md:mb-6">
//                 <span className="h-1 w-8 md:w-12 bg-primary"></span>
//                 <span className="font-label-bold text-primary tracking-widest uppercase text-xs md:text-sm">Direct Talent Access</span>
//               </div>
//               <h2 className="text-[36px] md:text-[48px] font-display-sm mb-6 md:mb-8 leading-tight">Elevate Your Production with <span className="text-secondary italic">Pro Talent.</span></h2>
//               <p className="text-base md:text-[18px] text-on-surface-variant mb-8 md:mb-12 max-w-xl">
//                 Don't just book a room. Book a crew. Browse our verified roster of world-class photographers, award-winning videographers, and visionary stylists available to hire directly for your ManyRooms session.
//               </p>
//               <div className="flex flex-wrap gap-3 md:gap-4">
//                 <Link href="/talent" className="bg-on-surface text-surface-bright px-8 md:px-10 py-3 md:py-4 rounded-2xl font-label-bold hover:bg-primary transition-all flex items-center gap-2 group text-sm md:text-base">
//                   BOOK TALENT <span className="group-hover:translate-x-1 transition-transform">→</span>
//                 </Link>
//                 <Link href="/talent/roster" className="border-2 border-outline-variant px-8 md:px-10 py-3 md:py-4 rounded-2xl font-label-bold hover:bg-surface-container transition-all text-sm md:text-base">VIEW ROSTER</Link>
//               </div>
//             </div>
//             <div className="order-1 lg:order-2 grid grid-cols-2 gap-3 md:gap-4">
//               <div className="space-y-3 md:space-y-4">
//                 <div className="rounded-2xl md:rounded-3xl overflow-hidden h-48 md:h-64 grayscale hover:grayscale-0 transition-all duration-700">
//                   <img alt="Cinematographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl"/>
//                 </div>
//                 <div className="bg-secondary-container p-4 md:p-6 rounded-2xl md:rounded-3xl">
//                   <h4 className="font-headline-lg text-on-secondary-container text-lg md:text-xl">Styling</h4>
//                   <p className="text-on-secondary-container/70 font-body-md mt-1 md:mt-2 text-sm md:text-base">Avant-garde vision for every frame.</p>
//                 </div>
//               </div>
//               <div className="space-y-3 md:space-y-4 pt-8 md:pt-12">
//                 <div className="bg-primary-container p-4 md:p-6 rounded-2xl md:rounded-3xl">
//                   <h4 className="font-headline-lg text-on-primary-container text-lg md:text-xl">Capture</h4>
//                   <p className="text-on-primary-container/70 font-body-md mt-1 md:mt-2 text-sm md:text-base">Industry-leading technical precision.</p>
//                 </div>
//                 <div className="rounded-2xl md:rounded-3xl overflow-hidden h-48 md:h-64 grayscale hover:grayscale-0 transition-all duration-700">
//                   <img alt="Photographer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD"/>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Creator Stories */}
//       <section className="py-16 md:py-24 px-4 md:px-16 bg-surface overflow-hidden border-t border-outline-variant/20">
//         <div className="max-w-[1440px] mx-auto relative">
//           <div className="absolute -right-20 top-0 opacity-10 rotate-12 pointer-events-none hidden md:block">
//             <span className="text-[200px] text-primary font-display-lg">VOICES</span>
//           </div>
//           <h2 className="text-[36px] md:text-[48px] font-display-sm mb-12 md:mb-20 relative z-10">Creator Stories</h2>
//           <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 relative">
//             <div className="relative w-full md:w-1/2">
//               <div className="relative aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl">
//                 <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqVRpxo4MhgCJTOmoLFJrMhBb1Zp8u-Og4AZO-FKWm45UON77VQtBK1ETybSUriwPcMrydY3nXUhMP-ATH8yc-LkYDteZmR5Nc2yFii_kw0U0OsMOI0ATjehe1voRB6VaU-WaTLGLjDTr7of3uTpnYlIitA1Lu91XpSPC9soqhlB2IOAsXTqYhGkSARrDmJEPayjOw0VKs1s69Ssvu0JgdV3gp03GcbYzXJN7r5lccz5qRllgLRD7YqeX42bZpvlXNXcwrtE3KdtTl" alt="Amara Chen"/>
//                 <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
//                 <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 right-8 md:right-12 text-white">
//                   <h4 className="text-2xl md:text-3xl font-display-sm mb-1">Amara Chen</h4>
//                   <p className="font-label-bold text-primary-fixed uppercase tracking-widest text-xs md:text-sm">Global Cinematographer</p>
//                 </div>
//               </div>
//               <div className="absolute -bottom-6 md:-bottom-10 -right-2 md:-right-10 glass p-6 md:p-8 rounded-2xl md:rounded-3xl max-w-[250px] md:max-w-xs shadow-2xl border-t-4 border-primary">
//                 <p className="text-sm md:font-body-lg italic text-on-surface-variant mb-3 md:mb-4">
//                   "ManyRooms doesn't just provide a space; it provides the canvas that pushes my vision further."
//                 </p>
//                 <span className="text-primary text-3xl md:text-4xl">❝</span>
//               </div>
//             </div>

//             <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
//               <div className="bg-secondary-container p-8 md:p-12 rounded-[40px] md:rounded-[50px] flex flex-col justify-center gap-4 md:gap-6 floating-interaction">
//                 <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-T3HwNPMOA4YzbZR15IXhJ6gaezh08zz4_hjk4kVXJ5plrO5bqilKuMQT0dgh_6pjcfPfW1Ijmv4ec5S7IHs4DetsdeqS_MQgyg8-KncC9Q1uXIcOE5nNSi0Fyv8xSmyNZZ20v0FPBjq3p3WWIhH1_PXUD2sfc7sIeAQke3PdsHv9Wk-pA1Ey4Uv1uI38Dpk4RRQzRT5Jmi06U01jufLPPZ07rof2JTBfd2YtAayHEjhmONuGFo9wvdfEVPubAdLZq9LC6DeBdfhD" alt="Marcus Vane"/>
//                 </div>
//                 <h4 className="font-headline-lg text-on-secondary-container text-lg md:text-xl">Marcus Vane</h4>
//                 <p className="font-body-md text-on-secondary-container opacity-80 text-sm md:text-base">Editorial Photography Legend</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-secondary-container group text-sm md:text-base">
//                   READ STORY <span className="group-hover:translate-x-2 transition-transform">→</span>
//                 </button>
//               </div>
//               <div className="bg-primary-container p-8 md:p-12 rounded-[40px] md:rounded-[50px] flex flex-col justify-center gap-4 md:gap-6 sm:mt-8 md:mt-12 floating-interaction">
//                 <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full overflow-hidden shadow-lg border-4 border-white">
//                   <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8yR0fx9aF-smQaY2NFdyOzW0frJaoqEFJf23bKJn6HmD6AMnL4b8s6uK6LJXX0pE5R0eozRdwNA6UMijGqPrTugvgOyVqvuhN8M3ueGqEfXgV8Lsq2ZUm48_11dtRBWZXgflk8aTDHzf5gFWgpOzKL5mNgp3Z2qhQn-s75gRTCXCt93F2EBXd8jLzQBMODpb85NkV6ZjJY4pTpzUuaVo15E3XfCUkZs080wIYIyqtR2sqU9BflPf2DXsyReE3NfjTiTEt74-tqC2T" alt="Sofia Rossi"/>
//                 </div>
//                 <h4 className="font-headline-lg text-on-primary-container text-lg md:text-xl">Sofia Rossi</h4>
//                 <p className="font-body-md text-on-primary-container opacity-80 text-sm md:text-base">Creative Director, Aura Studio</p>
//                 <button className="flex items-center gap-2 font-label-bold text-on-primary-container group text-sm md:text-base">
//                   WATCH TOUR <span className="group-hover:translate-x-2 transition-transform">▶</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 md:py-24 px-4 md:px-16">
//         <div className="max-w-[1440px] mx-auto bg-gradient-to-br from-primary to-secondary rounded-[40px] md:rounded-[60px] p-8 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
//           <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at center, var(--tw-gradient-from) 0%, transparent 70%)' }}></div>
//           <div className="relative z-10">
//             <h2 className="text-white mb-6 md:mb-8 text-[36px] md:text-[84px] font-display-lg leading-tight">Ready to launch your next masterpiece?</h2>
//             <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8 md:mb-12">Join the world's most innovative creative collective. From brutalist lofts to neon-soaked labs, your perfect stage is waiting.</p>
//             <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
//               <Link href="/signup" className="bg-primary-fixed text-on-primary-fixed px-10 md:px-12 py-4 md:py-5 rounded-2xl font-label-bold text-base md:text-lg hover:scale-105 transition-transform shadow-xl">Join the Collective</Link>
//               <button className="glass text-white px-10 md:px-12 py-4 md:py-5 rounded-2xl font-label-bold text-base md:text-lg hover:bg-white/10 transition-colors">Speak to an Agent</button>
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
