
// app/spaces/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MapPinIcon, ArrowRightIcon, PhotoIcon, StarIcon, XMarkIcon, CheckCircleIcon, EnvelopeIcon, UserIcon, LockClosedIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Chatbot from '@/components/Chatbot';
import Footer from '@/components/Footer';

// Brand Colors
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  brown: '#DB8B8C',
  dark: '#3C291C',
};

// Icon mapping for amenities
const amenityIcons: Record<string, string> = {
  'Natural Light': 'wb_sunny',
  'Studio Lighting Kit': 'lightbulb',
  'Backdrop Paper': 'wallpaper',
  'Changing Room': 'checkroom',
  'Makeup Station': 'face_6',
  'WiFi': 'wifi',
  'AC/Heating': 'ac_unit',
  'Parking': 'local_parking',
  'Kitchenette': 'countertops',
  'Bluetooth Speakers': 'speaker',
  'Projector': 'theaters',
  'Whiteboard': 'draw',
  'Cyclorama Wall': 'view_in_ar',
  'Green Screen': 'videocam',
  'Sound Treatment': 'hearing',
  'Freight Elevator': 'elevator',
  'Camera Kits': 'camera',
  'Lighting Grid': 'bolt',
  'High Ceilings': 'vertical_align_top',
  'Concrete Textures': 'texture',
  'Industrial Brutalist': 'foundation',
  'Natural North Light': 'north',
};

function getAmenityIcon(name: string): string {
  // Check exact match
  if (amenityIcons[name]) return amenityIcons[name];
  // Check partial match
  for (const [key, icon] of Object.entries(amenityIcons)) {
    if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
      return icon;
    }
  }
  return 'check_box_outline_blank';
}

interface Studio {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  description: string;
  hourly_rate: number;
  capacity: number;
  amenities: string[];
  images: string[];
  status: string;
  created_at: string;
  owner_id: string;
}

export default function StudioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, loading: authLoading } = useAuth();
  
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [relatedStudios, setRelatedStudios] = useState<Studio[]>([]);
  const [ownerName, setOwnerName] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<'login' | 'register' | 'details' | 'success'>('details');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(4);
  const [brief, setBrief] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (id) fetchStudio();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  useEffect(() => {
    if (user) {
      setGuestName(user.user_metadata?.name || '');
      setGuestEmail(user.email || '');
      setBookingStep('details');
    }
  }, [user]);

  const fetchStudio = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: studioData, error: studioError } = await supabase
        .from('studios').select('*').eq('id', id).single();
      if (studioError) throw studioError;
      if (!studioData) { setError('Studio not found'); setLoading(false); return; }
      if (studioData.status !== 'approved') { setError('This studio is not yet available for booking'); setLoading(false); return; }
      setStudio(studioData);

      if (studioData.owner_id) {
        const { data: owner } = await supabase.from('users').select('name').eq('id', studioData.owner_id).single();
        if (owner) setOwnerName(owner.name || 'Studio Owner');
      }

      const { data: relatedData } = await supabase.from('studios').select('*').eq('status', 'approved').eq('city', studioData.city).neq('id', id).limit(3);
      if (relatedData) setRelatedStudios(relatedData);
    } catch (err: any) {
      setError(err.message || 'Failed to load studio');
    } finally {
      setLoading(false);
    }
  };

  const getMainImage = () => studio?.images?.[0] || null;
  const formatPrice = (price: number) => `$${price}`;
  const formatLocation = () => studio ? [studio.city, studio.state].filter(Boolean).join(', ') : '';

  const handleBookingStart = () => {
    if (user) {
      setGuestName(user.user_metadata?.name || '');
      setGuestEmail(user.email || '');
      setBookingStep('details');
    } else {
      setBookingStep('login');
    }
    setShowBookingModal(true);
    setBookingError('');
  };

  const handleLogin = async () => {
    setBookingError('');
    if (!guestEmail || !password) { setBookingError('Please enter both email and password'); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: guestEmail, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      setGuestName(data.user?.user_metadata?.name || guestName);
      setGuestEmail(data.user?.email || guestEmail);
      setBookingStep('details');
      window.location.reload();
    } catch (err: any) {
      setBookingError(err.message || 'Login failed');
    } finally { setIsSubmitting(false); }
  };

  const handleRegister = async () => {
    setBookingError('');
    if (!guestName.trim()) { setBookingError('Please enter your full name'); return; }
    if (!guestEmail.trim()) { setBookingError('Please enter your email'); return; }
    if (!password || password.length < 6) { setBookingError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setBookingError('Passwords do not match'); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: guestName, email: guestEmail, password, phone: guestPhone, role: 'client' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setBookingStep('details');
      window.location.reload();
    } catch (err: any) {
      setBookingError(err.message || 'Registration failed');
    } finally { setIsSubmitting(false); }
  };

  const handleBookingSubmit = async () => {
    setBookingError('');
    if (!eventDate) { setBookingError('Please select an event date'); return; }
    if (!guestName.trim()) { setBookingError('Please enter your name'); return; }
    if (!guestEmail.trim()) { setBookingError('Please enter your email'); return; }
    setIsSubmitting(true);
    try {
      const enquiryData = {
        studio_id: studio?.id, guest_name: guestName, guest_email: guestEmail,
        guest_phone: guestPhone || null, event_date: eventDate, guests_count: guestsCount,
        brief: brief || `Booking enquiry for ${studio?.name}`, status: 'pending',
        created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      };
      const { data: enquiry, error: enquiryError } = await supabase.from('enquiries').insert(enquiryData).select().single();
      if (enquiryError) throw enquiryError;
      if (user) {
        const bookingCode = `MR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        await supabase.from('bookings').insert({ enquiry_id: enquiry.id, user_id: user.id, studio_id: studio?.id, booking_code: bookingCode, total_amount: studio ? studio.hourly_rate * 4 : 0, status: 'pending_payment', created_at: new Date().toISOString() });
      }
      setBookingStep('success');
    } catch (err: any) {
      setBookingError(err.message || 'Failed to complete booking');
    } finally { setIsSubmitting(false); }
  };

  const handleViewDashboard = () => { resetBooking(); router.push('/dashboard'); };
  const resetBooking = () => {
    setShowBookingModal(false); setBookingStep('details');
    setGuestName(user?.user_metadata?.name || ''); setGuestEmail(user?.email || '');
    setGuestPhone(''); setGuestsCount(4); setBrief(''); setPassword(''); setConfirmPassword(''); setBookingError('');
  };
  const switchToRegister = () => { setBookingError(''); setPassword(''); setConfirmPassword(''); setBookingStep('register'); };
  const switchToLogin = () => { setBookingError(''); setPassword(''); setBookingStep('login'); };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-[#F1CB81]/40 rounded-full mx-auto mb-4"></div>
          <p className="text-[#3C291C]">Loading studio...</p>
        </div>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 text-[#3C291C]/40">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#3C291C] mb-4">{error || 'Studio not found'}</h1>
          <p className="text-[#3C291C]/60 mb-8">The studio you're looking for doesn't exist or isn't available yet.</p>
          <Link href="/spaces" className="inline-block bg-[#F1CB81] text-[#3C291C] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#DB8B8C] hover:text-white transition-all">Browse all spaces</Link>
        </div>
      </div>
    );
  }

  const mainImage = getMainImage();

  return (
    <div className="bg-[#FFFBF5] text-[#3C291C] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-[#3C291C]/10 shadow-sm' : 'bg-white/95 backdrop-blur-xl border-b border-[#3C291C]/10'
      }`}>
        <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="group flex-shrink-0">
              <span className="text-xl md:text-2xl font-extrabold tracking-tighter text-[#3C291C]">
                Many<span className="text-[#F1CB81]">Rooms</span>
              </span>
            </Link>
            <div className="hidden lg:flex gap-6 items-center">
              {['Marketplace', 'Studios', 'Journal'].map((item) => (
                <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} 
                  className={`py-1 font-bold text-sm transition-colors text-[#3C291C]/70 hover:text-[#3C291C] ${
                    item === 'Studios' ? 'text-[#DB8B8C] border-b-2 border-[#DB8B8C]' : ''
                  }`}
                >{item}</Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#3C291C]/60 hidden md:block">{user.user_metadata?.name}</span>
                <Link href="/dashboard" className="hidden md:block bg-[#3C291C] text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#DB8B8C] transition-all">Dashboard</Link>
              </div>
            ) : (
              <button onClick={() => { setBookingStep('login'); setShowBookingModal(true); }} className="hidden md:block bg-[#F1CB81] text-[#3C291C] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#DB8B8C] hover:text-white transition-all">Sign In</button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16">
          
          {/* Header */}
          <header className="mb-6">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl md:text-5xl font-extrabold text-[#3C291C]">{studio.name}</h1>
              <div className="flex gap-3 shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm text-[#3C291C]/70 hover:text-[#3C291C] underline transition-colors">
                  <span className="material-symbols-outlined text-lg">share</span> Share
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm text-[#3C291C]/70 hover:text-[#3C291C] underline transition-colors">
                  <span className="material-symbols-outlined text-lg">favorite</span> Save
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#3C291C]/60 mt-2 flex-wrap">
              <span className="bg-[#F1CB81]/30 text-[#3C291C] font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                <StarIcon className="w-3 h-3 fill-current" /> 4.98
              </span>
              <span className="text-sm underline font-bold">305 reviews</span>
              <span className="text-sm">•</span>
              <span className="text-sm underline font-bold">{formatLocation()}</span>
            </div>
          </header>

          {/* Gallery */}
          <section className="relative mb-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[480px] rounded-2xl overflow-hidden">
              <div className="md:col-span-2 md:row-span-2 relative overflow-hidden">
                {mainImage ? (
                  <img alt="Main Studio View" className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer" src={mainImage} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#3C291C]/5"><PhotoIcon className="w-16 h-16 text-[#3C291C]/20" /></div>
                )}
              </div>
              {studio.images?.slice(1, 5).map((img, i) => (
                <div key={i} className="hidden md:block relative overflow-hidden">
                  <img alt={`Studio view ${i + 2}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer" src={img} />
                </div>
              ))}
            </div>
            <button className="absolute bottom-4 right-4 bg-white border border-[#3C291C]/20 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-[#F1CB81]/10 transition-colors">
              <span className="material-symbols-outlined text-lg">grid_view</span> Show all photos
            </button>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
            {/* Main Content Left */}
            <div className="md:col-span-7 lg:col-span-8 space-y-16">
              
              {/* The Vibe */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-[#3C291C]/10"></div>
                  <span className="font-bold text-xs uppercase tracking-[0.2em] text-[#3C291C]/50">The Vibe</span>
                  <div className="h-px flex-1 bg-[#3C291C]/10"></div>
                </div>
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-[#3C291C]">Industrial Brutalist meets High-Fashion.</h2>
                  <p className="text-base text-[#3C291C]/70 leading-relaxed max-w-2xl mb-6">
                    {studio.description || 'A beautiful creative space ready for your next project.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {studio.amenities?.slice(0, 5).map((item) => (
                      <span key={item} className="bg-[#3C291C]/5 px-4 py-2 rounded-full font-bold text-xs uppercase text-[#3C291C]/70">{item}</span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Gear & Essentials - with proper icons */}
              <section>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#3C291C]">Gear & Essentials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {studio.amenities?.map((item) => {
                    const iconName = getAmenityIcon(item);
                    return (
                      <div key={item} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#3C291C]/10 hover:border-[#F1CB81]/50 transition-all group">
                        <span className="material-symbols-outlined text-[#3C291C] bg-[#F1CB81]/30 p-3 rounded-xl group-hover:scale-110 transition-transform text-2xl">
                          {iconName}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm mb-1 text-[#3C291C]">{item}</h4>
                          <p className="text-xs text-[#3C291C]/50">Professional grade equipment included.</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Host */}
              <section className="py-6 border-b border-[#3C291C]/10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold mb-1 text-[#3C291C]">Hosted by {ownerName || 'Studio Owner'}</h2>
                    <p className="text-[#3C291C]/60 text-sm">Creative Director • 8 years hosting</p>
                  </div>
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[#F1CB81] flex items-center justify-center text-[#3C291C] font-bold text-lg">
                    {ownerName ? ownerName.charAt(0) : 'S'}
                  </div>
                </div>
              </section>

              {/* Location */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#3C291C]">Where you'll be</h2>
                  <span className="font-bold text-sm text-[#DB8B8C]">{formatLocation()}</span>
                </div>
                <div className="w-full h-80 rounded-3xl overflow-hidden border border-[#3C291C]/10 relative">
                  <div className="w-full h-full bg-[#91ADCD]/20 flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="w-12 h-12 text-[#DB8B8C] mx-auto mb-2" />
                      <p className="text-[#3C291C] font-bold">{formatLocation()}</p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-[#F1CB81] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <span className="material-symbols-outlined text-[#3C291C] font-bold">location_on</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[#3C291C]/60">Located in the heart of the creative hub. Walking distance from major stations.</p>
              </section>
            </div>

            {/* Booking Sidebar */}
            <aside className="md:col-span-5 lg:col-span-4">
              <div className="sticky top-28 space-y-5">
                <div className="bg-white/80 backdrop-blur-xl border border-[#3C291C]/10 shadow-lg p-6 md:p-8 rounded-[32px]">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <span className="text-[#3C291C]/50 font-bold text-xs uppercase tracking-widest block mb-1">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#3C291C]">{formatPrice(studio.hourly_rate)}</span>
                        <span className="text-[#3C291C]/50 text-sm">/ hour</span>
                      </div>
                    </div>
                    <div className="bg-[#F1CB81] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase text-[#3C291C]">Top Rated</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="font-bold text-xs uppercase text-[#3C291C]/50 ml-2">Date</label>
                      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-[#3C291C]/5 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#F1CB81] outline-none mt-1 text-[#3C291C]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-xs uppercase text-[#3C291C]/50 ml-2">Start</label>
                        <select value={startTime} onChange={(e) => setStartTime(e.target.value)}
                          className="w-full bg-[#3C291C]/5 border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]">
                          {['09:00','10:00','11:00','12:00','13:00','14:00'].map(t => <option key={t}>{t}:00</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-xs uppercase text-[#3C291C]/50 ml-2">End</label>
                        <select value={endTime} onChange={(e) => setEndTime(e.target.value)}
                          className="w-full bg-[#3C291C]/5 border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]">
                          {['13:00','14:00','15:00','16:00','17:00','18:00'].map(t => <option key={t}>{t}:00</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 border-t border-[#3C291C]/10 pt-5">
                    <div className="flex justify-between text-sm"><span className="text-[#3C291C]/50">${studio.hourly_rate} x 4 hours</span><span className="text-[#3C291C]">${studio.hourly_rate * 4}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#3C291C]/50">Cleaning Fee</span><span className="text-[#3C291C]">$45</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#3C291C]/50">Service Fee</span><span className="text-[#3C291C]">$32</span></div>
                    <div className="flex justify-between font-extrabold text-lg pt-2"><span className="text-[#3C291C]">Total</span><span className="text-[#DB8B8C]">${studio.hourly_rate * 4 + 77}</span></div>
                  </div>

                  <button onClick={handleBookingStart}
                    className="w-full bg-[#F1CB81] text-[#3C291C] font-extrabold text-lg py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-lg active:scale-95">
                    Request to Book
                  </button>
                  <p className="text-center text-[10px] text-[#3C291C]/40 mt-4 uppercase font-bold">You won't be charged yet</p>
                </div>

                <div className="bg-[#3C291C]/5 p-5 rounded-2xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#DB8B8C] text-2xl">verified_user</span>
                  <div className="text-xs">
                    <p className="font-bold text-[#3C291C] mb-0.5">ManyRooms Protection</p>
                    <p className="text-[#3C291C]/50">Every booking includes damage protection and host liability insurance.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Studios */}
          {relatedStudios.length > 0 && (
            <div className="mt-20">
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#3C291C] mb-8">You may also love</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedStudios.map((s) => (
                  <Link key={s.id} href={`/spaces/${s.id}`} className="group">
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4">
                      {s.images?.[0] ? (
                        <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-[#3C291C]/5 flex items-center justify-center"><PhotoIcon className="w-12 h-12 text-[#3C291C]/20" /></div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[10px] uppercase text-[#3C291C]/50">{s.city}, {s.state}</p>
                        <h4 className="text-lg font-bold text-[#3C291C] group-hover:text-[#DB8B8C] transition-colors">{s.name}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-[#3C291C]/50">From</p>
                        <p className="text-base font-bold text-[#DB8B8C]">{formatPrice(s.hourly_rate)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#3C291C]/60 backdrop-blur-sm" onClick={resetBooking} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <button onClick={resetBooking} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
              <XMarkIcon className="w-5 h-5 text-[#3C291C]" />
            </button>

            {bookingStep === 'login' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#F1CB81]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LockClosedIcon className="w-8 h-8 text-[#3C291C]" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">Sign In to Book</h3>
                  <p className="text-sm text-[#3C291C]/60">Sign in to your account or create one</p>
                </div>
                {bookingError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-1">Email</label>
                    <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
                  </div>
                </div>
                <button onClick={handleLogin} disabled={isSubmitting} className="w-full bg-[#3C291C] text-white py-4 rounded-2xl font-bold hover:bg-[#DB8B8C] transition-all disabled:opacity-50">
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
                <p className="text-center text-sm text-[#3C291C]/60">Don't have an account? <button onClick={switchToRegister} className="text-[#DB8B8C] font-bold hover:underline">Create one</button></p>
              </div>
            )}

            {bookingStep === 'register' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#F1CB81] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-8 h-8 text-[#3C291C]" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">Create Account</h3>
                  <p className="text-sm text-[#3C291C]/60">Register to book and track your enquiries</p>
                </div>
                {bookingError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-1">Full Name *</label>
                    <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your full name" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-1">Email Address *</label>
                    <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-1">Phone Number</label>
                    <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+1 234 567 890" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-1">Password * (min. 6 characters)</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-1">Confirm Password *</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
                  </div>
                </div>
                <button onClick={handleRegister} disabled={isSubmitting} className="w-full bg-[#F1CB81] text-[#3C291C] py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50">
                  {isSubmitting ? 'Creating...' : 'Create & Continue'}
                </button>
                <p className="text-center text-sm text-[#3C291C]/60">Already have an account? <button onClick={switchToLogin} className="text-[#DB8B8C] font-bold hover:underline">Sign in</button></p>
              </div>
            )}

            {bookingStep === 'details' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#F1CB81] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-[#3C291C]">event</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">Book {studio.name}</h3>
                  <p className="text-sm text-[#3C291C]/60">Review details and send enquiry</p>
                  {user && <p className="text-xs text-[#DB8B8C] mt-1">Signed in as {user.email}</p>}
                </div>
                {bookingError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>}
                <div className="space-y-4">
                  <div><label className="block text-sm font-bold text-[#3C291C] mb-1">Full Name *</label><input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" /></div>
                  <div><label className="block text-sm font-bold text-[#3C291C] mb-1">Email *</label><input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" /></div>
                  <div><label className="block text-sm font-bold text-[#3C291C] mb-1">Phone</label><input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" /></div>
                  <div><label className="block text-sm font-bold text-[#3C291C] mb-1">Brief / Message</label><textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Tell the host about your project..." rows={3} className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl p-4 focus:ring-2 focus:ring-[#F1CB81] outline-none resize-none text-[#3C291C]" /></div>
                  <div className="bg-[#3C291C]/5 p-4 rounded-xl text-sm text-[#3C291C]">
                    <p><strong>Date:</strong> {eventDate || 'Not selected'}</p>
                    <p><strong>Guests:</strong> {guestsCount}</p>
                    <p><strong>Studio:</strong> {studio?.name}</p>
                  </div>
                </div>
                <button onClick={handleBookingSubmit} disabled={isSubmitting} className="w-full bg-[#F1CB81] text-[#3C291C] py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50">
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>
              </div>
            )}

            {bookingStep === 'success' && (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-[#F1CB81] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-10 h-10 text-[#3C291C]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">Enquiry Sent! 🎉</h3>
                <p className="text-[#3C291C]/60">Your enquiry has been sent to <strong className="text-[#3C291C]">{ownerName || 'the studio owner'}</strong>.</p>
                <div className="bg-[#3C291C]/5 p-6 rounded-2xl text-left space-y-3">
                  <div className="flex items-center gap-3"><EnvelopeIcon className="w-5 h-5 text-[#DB8B8C]" /><p className="text-sm text-[#3C291C]">Check <strong>{guestEmail}</strong> for updates</p></div>
                  <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#DB8B8C]">schedule</span><p className="text-sm text-[#3C291C]">Awaiting response from studio owner</p></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={resetBooking} className="flex-1 border border-[#3C291C]/10 py-3 rounded-2xl font-bold text-sm text-[#3C291C] hover:bg-[#3C291C]/5">Close</button>
                  <button onClick={handleViewDashboard} className="flex-1 bg-[#3C291C] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#DB8B8C] text-center">View Dashboard</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <Chatbot />
    </div>
  );
}



// // app/spaces/[id]/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { MapPinIcon, ArrowRightIcon, PhotoIcon, StarIcon, XMarkIcon, CheckCircleIcon, EnvelopeIcon, UserIcon, LockClosedIcon, PhoneIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/context/AuthContext';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

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
//   description: string;
//   hourly_rate: number;
//   capacity: number;
//   amenities: string[];
//   images: string[];
//   status: string;
//   created_at: string;
//   owner_id: string;
// }

// export default function StudioDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id as string;
//   const { user, loading: authLoading } = useAuth();
  
//   const [studio, setStudio] = useState<Studio | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [eventDate, setEventDate] = useState('');
//   const [startTime, setStartTime] = useState('09:00');
//   const [endTime, setEndTime] = useState('13:00');
//   const [relatedStudios, setRelatedStudios] = useState<Studio[]>([]);
//   const [ownerName, setOwnerName] = useState('');
//   const [scrolled, setScrolled] = useState(false);

//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [bookingStep, setBookingStep] = useState<'login' | 'register' | 'details' | 'success'>('details');
//   const [guestName, setGuestName] = useState('');
//   const [guestEmail, setGuestEmail] = useState('');
//   const [guestPhone, setGuestPhone] = useState('');
//   const [guestsCount, setGuestsCount] = useState(4);
//   const [brief, setBrief] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [bookingError, setBookingError] = useState('');

//   useEffect(() => {
//     if (id) fetchStudio();
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [id]);

//   useEffect(() => {
//     if (user) {
//       setGuestName(user.user_metadata?.name || '');
//       setGuestEmail(user.email || '');
//       setBookingStep('details');
//     }
//   }, [user]);

//   const fetchStudio = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const { data: studioData, error: studioError } = await supabase
//         .from('studios').select('*').eq('id', id).single();
//       if (studioError) throw studioError;
//       if (!studioData) { setError('Studio not found'); setLoading(false); return; }
//       if (studioData.status !== 'approved') { setError('This studio is not yet available for booking'); setLoading(false); return; }
//       setStudio(studioData);

//       if (studioData.owner_id) {
//         const { data: owner } = await supabase.from('users').select('name').eq('id', studioData.owner_id).single();
//         if (owner) setOwnerName(owner.name || 'Studio Owner');
//       }

//       const { data: relatedData } = await supabase.from('studios').select('*').eq('status', 'approved').eq('city', studioData.city).neq('id', id).limit(3);
//       if (relatedData) setRelatedStudios(relatedData);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMainImage = () => studio?.images?.[0] || null;
//   const formatPrice = (price: number) => `$${price}`;
//   const formatLocation = () => studio ? [studio.city, studio.state].filter(Boolean).join(', ') : '';

//   const handleBookingStart = () => {
//     if (user) {
//       setGuestName(user.user_metadata?.name || '');
//       setGuestEmail(user.email || '');
//       setBookingStep('details');
//     } else {
//       setBookingStep('login');
//     }
//     setShowBookingModal(true);
//     setBookingError('');
//   };

//   const handleLogin = async () => {
//     setBookingError('');
//     if (!guestEmail || !password) { setBookingError('Please enter both email and password'); return; }
//     setIsSubmitting(true);
//     try {
//       const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: guestEmail, password }) });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Invalid credentials');
//       setGuestName(data.user?.user_metadata?.name || guestName);
//       setGuestEmail(data.user?.email || guestEmail);
//       setBookingStep('details');
//       window.location.reload();
//     } catch (err: any) {
//       setBookingError(err.message || 'Login failed');
//     } finally { setIsSubmitting(false); }
//   };

//   const handleRegister = async () => {
//     setBookingError('');
//     if (!guestName.trim()) { setBookingError('Please enter your full name'); return; }
//     if (!guestEmail.trim()) { setBookingError('Please enter your email'); return; }
//     if (!password || password.length < 6) { setBookingError('Password must be at least 6 characters'); return; }
//     if (password !== confirmPassword) { setBookingError('Passwords do not match'); return; }
//     setIsSubmitting(true);
//     try {
//       const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: guestName, email: guestEmail, password, phone: guestPhone, role: 'client' }) });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Registration failed');
//       setBookingStep('details');
//       window.location.reload();
//     } catch (err: any) {
//       setBookingError(err.message || 'Registration failed');
//     } finally { setIsSubmitting(false); }
//   };

//   const handleBookingSubmit = async () => {
//     setBookingError('');
//     if (!eventDate) { setBookingError('Please select an event date'); return; }
//     if (!guestName.trim()) { setBookingError('Please enter your name'); return; }
//     if (!guestEmail.trim()) { setBookingError('Please enter your email'); return; }
//     setIsSubmitting(true);
//     try {
//       const enquiryData = {
//         studio_id: studio?.id, guest_name: guestName, guest_email: guestEmail,
//         guest_phone: guestPhone || null, event_date: eventDate, guests_count: guestsCount,
//         brief: brief || `Booking enquiry for ${studio?.name}`, status: 'pending',
//         created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
//       };
//       const { data: enquiry, error: enquiryError } = await supabase.from('enquiries').insert(enquiryData).select().single();
//       if (enquiryError) throw enquiryError;
//       if (user) {
//         const bookingCode = `MR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
//         await supabase.from('bookings').insert({ enquiry_id: enquiry.id, user_id: user.id, studio_id: studio?.id, booking_code: bookingCode, total_amount: studio ? studio.hourly_rate * 4 : 0, status: 'pending_payment', created_at: new Date().toISOString() });
//       }
//       setBookingStep('success');
//     } catch (err: any) {
//       setBookingError(err.message || 'Failed to complete booking');
//     } finally { setIsSubmitting(false); }
//   };

//   const handleViewDashboard = () => { resetBooking(); router.push('/dashboard'); };
//   const resetBooking = () => {
//     setShowBookingModal(false); setBookingStep('details');
//     setGuestName(user?.user_metadata?.name || ''); setGuestEmail(user?.email || '');
//     setGuestPhone(''); setGuestsCount(4); setBrief(''); setPassword(''); setConfirmPassword(''); setBookingError('');
//   };
//   const switchToRegister = () => { setBookingError(''); setPassword(''); setConfirmPassword(''); setBookingStep('register'); };
//   const switchToLogin = () => { setBookingError(''); setPassword(''); setBookingStep('login'); };

//   if (loading || authLoading) {
//     return (
//       <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-[#F1CB81]/40 rounded-full mx-auto mb-4"></div>
//           <p className="text-[#3C291C]">Loading studio...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !studio) {
//     return (
//       <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-6">
//           <div className="w-20 h-20 mx-auto mb-6 text-[#3C291C]/40">
//             <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-[#3C291C] mb-4">{error || 'Studio not found'}</h1>
//           <p className="text-[#3C291C]/60 mb-8">The studio you're looking for doesn't exist or isn't available yet.</p>
//           <Link href="/spaces" className="inline-block bg-[#F1CB81] text-[#3C291C] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#DB8B8C] hover:text-white transition-all">Browse all spaces</Link>
//         </div>
//       </div>
//     );
//   }

//   const mainImage = getMainImage();

//   return (
//     <div className="bg-[#FFFBF5] text-[#3C291C] overflow-x-hidden">
//       {/* Navigation - Consistent brand style */}
//       <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-[#3C291C]/10 shadow-sm' : 'bg-white/95 backdrop-blur-xl border-b border-[#3C291C]/10'
//       }`}>
//         <div className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 w-full max-w-[1440px] mx-auto">
//           <div className="flex items-center gap-4 md:gap-8">
//             <Link href="/" className="group flex-shrink-0">
//               <span className="text-xl md:text-2xl font-extrabold tracking-tighter text-[#3C291C]">
//                 Many<span className="text-[#F1CB81]">Rooms</span>
//               </span>
//             </Link>
//             <div className="hidden lg:flex gap-6 items-center">
//               {['Marketplace', 'Studios', 'Spaces', 'Journal', 'Services'].map((item) => (
//                 <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} 
//                   className={`py-1 font-bold text-sm transition-colors text-[#3C291C]/70 hover:text-[#3C291C] ${
//                     item === 'Studios' ? 'text-[#DB8B8C] border-b-2 border-[#DB8B8C]' : ''
//                   }`}
//                 >{item}</Link>
//               ))}
//             </div>
//           </div>
//           <div className="flex items-center gap-3 md:gap-4">
//             {user ? (
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-[#3C291C]/60 hidden md:block">{user.user_metadata?.name}</span>
//                 <Link href="/dashboard" className="hidden md:block bg-[#3C291C] text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#DB8B8C] transition-all">Dashboard</Link>
//               </div>
//             ) : (
//               <button onClick={() => { setBookingStep('login'); setShowBookingModal(true); }} className="hidden md:block bg-[#F1CB81] text-[#3C291C] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#DB8B8C] hover:text-white transition-all">Sign In</button>
//             )}
//           </div>
//         </div>
//       </nav>

//       <main className="pt-24 pb-12">
//         <div className="max-w-[1440px] mx-auto px-4 md:px-16">
          
//           {/* Header */}
//           <header className="mb-6">
//             <div className="flex justify-between items-start gap-4">
//               <h1 className="text-3xl md:text-5xl font-extrabold text-[#3C291C]">{studio.name}</h1>
//               <div className="flex gap-3 shrink-0">
//                 <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm text-[#3C291C]/70 hover:text-[#3C291C] underline transition-colors">
//                   <span className="material-symbols-outlined text-lg">share</span> Share
//                 </button>
//                 <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm text-[#3C291C]/70 hover:text-[#3C291C] underline transition-colors">
//                   <span className="material-symbols-outlined text-lg">favorite</span> Save
//                 </button>
//               </div>
//             </div>
//             <div className="flex items-center gap-2 text-[#3C291C]/60 mt-2 flex-wrap">
//               <span className="bg-[#F1CB81]/30 text-[#3C291C] font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
//                 <StarIcon className="w-3 h-3 fill-current" /> 4.98
//               </span>
//               <span className="text-sm underline font-bold">305 reviews</span>
//               <span className="text-sm">•</span>
//               <span className="text-sm underline font-bold">{formatLocation()}</span>
//             </div>
//           </header>

//           {/* Gallery */}
//           <section className="relative mb-10">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[480px] rounded-2xl overflow-hidden">
//               <div className="md:col-span-2 md:row-span-2 relative overflow-hidden">
//                 {mainImage ? (
//                   <img alt="Main Studio View" className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer" src={mainImage} />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-[#3C291C]/5"><PhotoIcon className="w-16 h-16 text-[#3C291C]/20" /></div>
//                 )}
//               </div>
//               {studio.images?.slice(1, 5).map((img, i) => (
//                 <div key={i} className="hidden md:block relative overflow-hidden">
//                   <img alt={`Studio view ${i + 2}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer" src={img} />
//                 </div>
//               ))}
//             </div>
//             <button className="absolute bottom-4 right-4 bg-white border border-[#3C291C]/20 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-[#F1CB81]/10 transition-colors">
//               <span className="material-symbols-outlined text-lg">grid_view</span> Show all photos
//             </button>
//           </section>

//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
//             {/* Main Content Left */}
//             <div className="md:col-span-7 lg:col-span-8 space-y-16">
              
//               {/* The Vibe */}
//               <section>
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="h-px flex-1 bg-[#3C291C]/10"></div>
//                   <span className="font-bold text-xs uppercase tracking-[0.2em] text-[#3C291C]/50">The Vibe</span>
//                   <div className="h-px flex-1 bg-[#3C291C]/10"></div>
//                 </div>
//                 <div className="mb-8">
//                   <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-[#3C291C]">Industrial Brutalist meets High-Fashion.</h2>
//                   <p className="text-base text-[#3C291C]/70 leading-relaxed max-w-2xl mb-6">
//                     {studio.description || 'A beautiful creative space ready for your next project.'}
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {studio.amenities?.slice(0, 5).map((item) => (
//                       <span key={item} className="bg-[#3C291C]/5 px-4 py-2 rounded-full font-bold text-xs uppercase text-[#3C291C]/70">{item}</span>
//                     ))}
//                   </div>
//                 </div>
//               </section>

//               {/* Gear & Essentials */}
//               <section>
//                 <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-[#3C291C]">Gear & Essentials</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {studio.amenities?.map((item) => (
//                     <div key={item} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#3C291C]/10 hover:border-[#F1CB81]/50 transition-all group">
//                       <span className="material-symbols-outlined text-[#3C291C] bg-[#F1CB81]/30 p-3 rounded-xl group-hover:scale-110 transition-transform">check_box_outline_blank</span>
//                       <div>
//                         <h4 className="font-bold text-sm mb-1 text-[#3C291C]">{item}</h4>
//                         <p className="text-xs text-[#3C291C]/50">Professional grade.</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Host */}
//               <section className="py-6 border-b border-[#3C291C]/10">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h2 className="text-xl font-extrabold mb-1 text-[#3C291C]">Hosted by {ownerName || 'Studio Owner'}</h2>
//                     <p className="text-[#3C291C]/60 text-sm">Creative Director • 8 years hosting</p>
//                   </div>
//                   <div className="w-14 h-14 rounded-full overflow-hidden bg-[#F1CB81] flex items-center justify-center text-[#3C291C] font-bold text-lg">
//                     {ownerName ? ownerName.charAt(0) : 'S'}
//                   </div>
//                 </div>
//               </section>

//               {/* Location */}
//               <section>
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl md:text-3xl font-extrabold text-[#3C291C]">Where you'll be</h2>
//                   <span className="font-bold text-sm text-[#DB8B8C]">{formatLocation()}</span>
//                 </div>
//                 <div className="w-full h-80 rounded-3xl overflow-hidden border border-[#3C291C]/10 relative">
//                   <div className="w-full h-full bg-[#91ADCD]/20 flex items-center justify-center">
//                     <div className="text-center">
//                       <MapPinIcon className="w-12 h-12 text-[#DB8B8C] mx-auto mb-2" />
//                       <p className="text-[#3C291C] font-bold">{formatLocation()}</p>
//                     </div>
//                   </div>
//                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                     <div className="w-12 h-12 bg-[#F1CB81] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
//                       <span className="material-symbols-outlined text-[#3C291C] font-bold">location_on</span>
//                     </div>
//                   </div>
//                 </div>
//                 <p className="mt-4 text-sm text-[#3C291C]/60">Located in the heart of the creative hub. Walking distance from major stations.</p>
//               </section>
//             </div>

//             {/* Booking Sidebar */}
//             <aside className="md:col-span-5 lg:col-span-4">
//               <div className="sticky top-28 space-y-5">
//                 <div className="bg-white/80 backdrop-blur-xl border border-[#3C291C]/10 shadow-lg p-6 md:p-8 rounded-[32px]">
//                   <div className="flex justify-between items-end mb-6">
//                     <div>
//                       <span className="text-[#3C291C]/50 font-bold text-xs uppercase tracking-widest block mb-1">Starting from</span>
//                       <div className="flex items-baseline gap-1">
//                         <span className="text-3xl font-extrabold text-[#3C291C]">{formatPrice(studio.hourly_rate)}</span>
//                         <span className="text-[#3C291C]/50 text-sm">/ hour</span>
//                       </div>
//                     </div>
//                     <div className="bg-[#F1CB81] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase text-[#3C291C]">Top Rated</div>
//                   </div>

//                   <div className="space-y-4 mb-6">
//                     <div>
//                       <label className="font-bold text-xs uppercase text-[#3C291C]/50 ml-2">Date</label>
//                       <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
//                         className="w-full bg-[#3C291C]/5 border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#F1CB81] outline-none mt-1 text-[#3C291C]" />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="font-bold text-xs uppercase text-[#3C291C]/50 ml-2">Start</label>
//                         <select value={startTime} onChange={(e) => setStartTime(e.target.value)}
//                           className="w-full bg-[#3C291C]/5 border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]">
//                           {['09:00','10:00','11:00','12:00','13:00','14:00'].map(t => <option key={t}>{t}:00</option>)}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="font-bold text-xs uppercase text-[#3C291C]/50 ml-2">End</label>
//                         <select value={endTime} onChange={(e) => setEndTime(e.target.value)}
//                           className="w-full bg-[#3C291C]/5 border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]">
//                           {['13:00','14:00','15:00','16:00','17:00','18:00'].map(t => <option key={t}>{t}:00</option>)}
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-2 mb-6 border-t border-[#3C291C]/10 pt-5">
//                     <div className="flex justify-between text-sm"><span className="text-[#3C291C]/50">${studio.hourly_rate} x 4 hours</span><span className="text-[#3C291C]">${studio.hourly_rate * 4}</span></div>
//                     <div className="flex justify-between text-sm"><span className="text-[#3C291C]/50">Cleaning Fee</span><span className="text-[#3C291C]">$45</span></div>
//                     <div className="flex justify-between text-sm"><span className="text-[#3C291C]/50">Service Fee</span><span className="text-[#3C291C]">$32</span></div>
//                     <div className="flex justify-between font-extrabold text-lg pt-2"><span className="text-[#3C291C]">Total</span><span className="text-[#DB8B8C]">${studio.hourly_rate * 4 + 77}</span></div>
//                   </div>

//                   <button onClick={handleBookingStart}
//                     className="w-full bg-[#F1CB81] text-[#3C291C] font-extrabold text-lg py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-lg active:scale-95">
//                     Request to Book
//                   </button>
//                   <p className="text-center text-[10px] text-[#3C291C]/40 mt-4 uppercase font-bold">You won't be charged yet</p>
//                 </div>

//                 <div className="bg-[#3C291C]/5 p-5 rounded-2xl flex items-center gap-3">
//                   <span className="material-symbols-outlined text-[#DB8B8C] text-2xl">verified_user</span>
//                   <div className="text-xs">
//                     <p className="font-bold text-[#3C291C] mb-0.5">ManyRooms Protection</p>
//                     <p className="text-[#3C291C]/50">Every booking includes damage protection and host liability insurance.</p>
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {/* Related Studios */}
//           {relatedStudios.length > 0 && (
//             <div className="mt-20">
//               <h3 className="text-2xl md:text-3xl font-extrabold text-[#3C291C] mb-8">You may also love</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {relatedStudios.map((s) => (
//                   <Link key={s.id} href={`/spaces/${s.id}`} className="group">
//                     <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4">
//                       {s.images?.[0] ? (
//                         <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                       ) : (
//                         <div className="w-full h-full bg-[#3C291C]/5 flex items-center justify-center"><PhotoIcon className="w-12 h-12 text-[#3C291C]/20" /></div>
//                       )}
//                     </div>
//                     <div className="flex justify-between">
//                       <div>
//                         <p className="text-[10px] uppercase text-[#3C291C]/50">{s.city}, {s.state}</p>
//                         <h4 className="text-lg font-bold text-[#3C291C] group-hover:text-[#DB8B8C] transition-colors">{s.name}</h4>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[10px] uppercase text-[#3C291C]/50">From</p>
//                         <p className="text-base font-bold text-[#DB8B8C]">{formatPrice(s.hourly_rate)}</p>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Booking Modal - Same as before, just updated colors */}
//       {showBookingModal && (
//         <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-[#3C291C]/60 backdrop-blur-sm" onClick={resetBooking} />
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
//             <button onClick={resetBooking} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
//               <XMarkIcon className="w-5 h-5 text-[#3C291C]" />
//             </button>

//             {bookingStep === 'login' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#F1CB81]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <LockClosedIcon className="w-8 h-8 text-[#3C291C]" />
//                   </div>
//                   <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">Sign In to Book</h3>
//                   <p className="text-sm text-[#3C291C]/60">Sign in to your account or create one</p>
//                 </div>
//                 {bookingError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>}
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-bold text-[#3C291C] mb-1">Email</label>
//                     <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-[#3C291C] mb-1">Password</label>
//                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
//                   </div>
//                 </div>
//                 <button onClick={handleLogin} disabled={isSubmitting} className="w-full bg-[#3C291C] text-white py-4 rounded-2xl font-bold hover:bg-[#DB8B8C] transition-all disabled:opacity-50">
//                   {isSubmitting ? 'Signing in...' : 'Sign In'}
//                 </button>
//                 <p className="text-center text-sm text-[#3C291C]/60">Don't have an account? <button onClick={switchToRegister} className="text-[#DB8B8C] font-bold hover:underline">Create one</button></p>
//               </div>
//             )}

//             {bookingStep === 'register' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#F1CB81] rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <UserIcon className="w-8 h-8 text-[#3C291C]" />
//                   </div>
//                   <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">Create Account</h3>
//                   <p className="text-sm text-[#3C291C]/60">Register to book and track your enquiries</p>
//                 </div>
//                 {bookingError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>}
//                 <div className="space-y-4">
//                   {[
//                     { label: 'Full Name *', icon: UserIcon, value: guestName, setter: setGuestName, type: 'text', placeholder: 'Your full name' },
//                     { label: 'Email Address *', icon: EnvelopeIcon, value: guestEmail, setter: setGuestEmail, type: 'email', placeholder: 'you@example.com' },
//                     { label: 'Phone Number', icon: PhoneIcon, value: guestPhone, setter: setGuestPhone, type: 'tel', placeholder: '+1 234 567 890' },
//                   ].map((field, i) => (
//                     <div key={i}>
//                       <label className="block text-sm font-bold text-[#3C291C] mb-1">{field.label}</label>
//                       <div className="relative">
//                         <field.icon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#3C291C]/30" />
//                         <input type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)} placeholder={field.placeholder} className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
//                       </div>
//                     </div>
//                   ))}
//                   <div>
//                     <label className="block text-sm font-bold text-[#3C291C] mb-1">Password * (min. 6 characters)</label>
//                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-[#3C291C] mb-1">Confirm Password *</label>
//                     <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" />
//                   </div>
//                 </div>
//                 <button onClick={handleRegister} disabled={isSubmitting} className="w-full bg-[#F1CB81] text-[#3C291C] py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50">
//                   {isSubmitting ? 'Creating...' : 'Create & Continue'}
//                 </button>
//                 <p className="text-center text-sm text-[#3C291C]/60">Already have an account? <button onClick={switchToLogin} className="text-[#DB8B8C] font-bold hover:underline">Sign in</button></p>
//               </div>
//             )}

//             {bookingStep === 'details' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#F1CB81] rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <span className="material-symbols-outlined text-3xl text-[#3C291C]">event</span>
//                   </div>
//                   <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">Book {studio.name}</h3>
//                   <p className="text-sm text-[#3C291C]/60">Review details and send enquiry</p>
//                   {user && <p className="text-xs text-[#DB8B8C] mt-1">Signed in as {user.email}</p>}
//                 </div>
//                 {bookingError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>}
//                 <div className="space-y-4">
//                   <div><label className="block text-sm font-bold text-[#3C291C] mb-1">Full Name *</label><input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" /></div>
//                   <div><label className="block text-sm font-bold text-[#3C291C] mb-1">Email *</label><input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" /></div>
//                   <div><label className="block text-sm font-bold text-[#3C291C] mb-1">Phone</label><input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#F1CB81] outline-none text-[#3C291C]" /></div>
//                   <div><label className="block text-sm font-bold text-[#3C291C] mb-1">Brief / Message</label><textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Tell the host about your project..." rows={3} className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl p-4 focus:ring-2 focus:ring-[#F1CB81] outline-none resize-none text-[#3C291C]" /></div>
//                   <div className="bg-[#3C291C]/5 p-4 rounded-xl text-sm text-[#3C291C]">
//                     <p><strong>Date:</strong> {eventDate || 'Not selected'}</p>
//                     <p><strong>Guests:</strong> {guestsCount}</p>
//                     <p><strong>Studio:</strong> {studio?.name}</p>
//                   </div>
//                 </div>
//                 <button onClick={handleBookingSubmit} disabled={isSubmitting} className="w-full bg-[#F1CB81] text-[#3C291C] py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50">
//                   {isSubmitting ? 'Sending...' : 'Send Enquiry'}
//                 </button>
//               </div>
//             )}

//             {bookingStep === 'success' && (
//               <div className="text-center space-y-6 py-8">
//                 <div className="w-20 h-20 bg-[#F1CB81] rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircleIcon className="w-10 h-10 text-[#3C291C]" />
//                 </div>
//                 <h3 className="text-2xl font-extrabold text-[#3C291C] mb-2">Enquiry Sent! 🎉</h3>
//                 <p className="text-[#3C291C]/60">Your enquiry has been sent to <strong className="text-[#3C291C]">{ownerName || 'the studio owner'}</strong>.</p>
//                 <div className="bg-[#3C291C]/5 p-6 rounded-2xl text-left space-y-3">
//                   <div className="flex items-center gap-3"><EnvelopeIcon className="w-5 h-5 text-[#DB8B8C]" /><p className="text-sm text-[#3C291C]">Check <strong>{guestEmail}</strong> for updates</p></div>
//                   <div className="flex items-center gap-3"><span className="material-symbols-outlined text-[#DB8B8C]">schedule</span><p className="text-sm text-[#3C291C]">Awaiting response from studio owner</p></div>
//                 </div>
//                 <div className="flex gap-3">
//                   <button onClick={resetBooking} className="flex-1 border border-[#3C291C]/10 py-3 rounded-2xl font-bold text-sm text-[#3C291C] hover:bg-[#3C291C]/5">Close</button>
//                   <button onClick={handleViewDashboard} className="flex-1 bg-[#3C291C] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#DB8B8C] text-center">View Dashboard</button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <Footer />
//       <Chatbot />
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { MapPinIcon, ArrowRightIcon, PhotoIcon, StarIcon, XMarkIcon, CheckCircleIcon, EnvelopeIcon, UserIcon, LockClosedIcon, PhoneIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/context/AuthContext';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   country: string;
//   description: string;
//   hourly_rate: number;
//   capacity: number;
//   amenities: string[];
//   images: string[];
//   status: string;
//   created_at: string;
//   owner_id: string;
// }

// export default function StudioDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id as string;
//   const { user, loading: authLoading } = useAuth();
  
//   const [studio, setStudio] = useState<Studio | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [eventDate, setEventDate] = useState('');
//   const [relatedStudios, setRelatedStudios] = useState<Studio[]>([]);
//   const [ownerName, setOwnerName] = useState('');

//   // Booking modal states
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [bookingStep, setBookingStep] = useState<'login' | 'register' | 'details' | 'success'>('details');
//   const [guestName, setGuestName] = useState('');
//   const [guestEmail, setGuestEmail] = useState('');
//   const [guestPhone, setGuestPhone] = useState('');
//   const [guestsCount, setGuestsCount] = useState(4);
//   const [brief, setBrief] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [bookingError, setBookingError] = useState('');

//   useEffect(() => {
//     if (id) {
//       fetchStudio();
//     }
//   }, [id]);

//   // Pre-fill user data when authenticated
//   useEffect(() => {
//     if (user) {
//       setGuestName(user.user_metadata?.name || '');
//       setGuestEmail(user.email || '');
//       setBookingStep('details');
//     }
//   }, [user]);

//   const fetchStudio = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const { data: studioData, error: studioError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (studioError) throw studioError;
      
//       if (!studioData) {
//         setError('Studio not found');
//         setLoading(false);
//         return;
//       }

//       if (studioData.status !== 'approved') {
//         setError('This studio is not yet available for booking');
//         setLoading(false);
//         return;
//       }

//       setStudio(studioData);

//       if (studioData.owner_id) {
//         const { data: owner } = await supabase
//           .from('users')
//           .select('name')
//           .eq('id', studioData.owner_id)
//           .single();
//         if (owner) setOwnerName(owner.name || 'Studio Owner');
//       }

//       const { data: relatedData } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .eq('city', studioData.city)
//         .neq('id', id)
//         .limit(3);

//       if (relatedData) setRelatedStudios(relatedData);

//     } catch (err: any) {
//       console.error('Error fetching studio:', err);
//       setError(err.message || 'Failed to load studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMainImage = () => studio?.images?.[0] || null;
//   const getSmallImage1 = () => studio?.images?.[1] || null;
//   const getSmallImage2 = () => studio?.images?.[2] || null;
//   const formatPrice = (price: number) => `$${price}`;
  
//   const formatLocation = () => {
//     if (!studio) return '';
//     return [studio.city, studio.state].filter(Boolean).join(', ');
//   };

//   const handleBookingStart = () => {
//     if (user) {
//       setGuestName(user.user_metadata?.name || '');
//       setGuestEmail(user.email || '');
//       setBookingStep('details');
//     } else {
//       setBookingStep('login');
//     }
//     setShowBookingModal(true);
//     setBookingError('');
//   };

//   const handleLogin = async () => {
//     setBookingError('');
    
//     if (!guestEmail || !password) {
//       setBookingError('Please enter both email and password');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: guestEmail, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || 'Invalid credentials');
//       }

//       // AuthContext will pick up the cookie on next render
//       // But we can proceed with the details step immediately
//       setGuestName(data.user?.user_metadata?.name || guestName);
//       setGuestEmail(data.user?.email || guestEmail);
//       setBookingStep('details');
      
//       // Refresh the page to update auth state
//       window.location.reload();
//     } catch (err: any) {
//       setBookingError(err.message || 'Login failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleRegister = async () => {
//     setBookingError('');
    
//     if (!guestName.trim()) {
//       setBookingError('Please enter your full name');
//       return;
//     }
//     if (!guestEmail.trim()) {
//       setBookingError('Please enter your email');
//       return;
//     }
//     if (!password || password.length < 6) {
//       setBookingError('Password must be at least 6 characters');
//       return;
//     }
//     if (password !== confirmPassword) {
//       setBookingError('Passwords do not match');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const res = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           name: guestName, 
//           email: guestEmail, 
//           password, 
//           phone: guestPhone,
//           role: 'client' 
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || 'Registration failed');
//       }

//       setBookingStep('details');
      
//       // Refresh to update auth state
//       window.location.reload();
//     } catch (err: any) {
//       setBookingError(err.message || 'Registration failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBookingSubmit = async () => {
//     setBookingError('');
    
//     if (!eventDate) {
//       setBookingError('Please select an event date');
//       return;
//     }
//     if (!guestName.trim()) {
//       setBookingError('Please enter your name');
//       return;
//     }
//     if (!guestEmail.trim()) {
//       setBookingError('Please enter your email');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const enquiryData = {
//         studio_id: studio?.id,
//         guest_name: guestName,
//         guest_email: guestEmail,
//         guest_phone: guestPhone || null,
//         event_date: eventDate,
//         guests_count: guestsCount,
//         brief: brief || `Booking enquiry for ${studio?.name}`,
//         status: 'pending',
//         created_at: new Date().toISOString(),
//         expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
//       };

//       const { data: enquiry, error: enquiryError } = await supabase
//         .from('enquiries')
//         .insert(enquiryData)
//         .select()
//         .single();

//       if (enquiryError) throw enquiryError;

//       // If user is authenticated, create booking record
//       if (user) {
//         const bookingCode = `MR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
//         await supabase.from('bookings').insert({
//           enquiry_id: enquiry.id,
//           user_id: user.id,
//           studio_id: studio?.id,
//           booking_code: bookingCode,
//           total_amount: studio ? studio.hourly_rate * 4 : 0,
//           status: 'pending_payment',
//           created_at: new Date().toISOString()
//         });
//       }

//       setBookingStep('success');
//     } catch (err: any) {
//       console.error('Booking failed:', err);
//       setBookingError(err.message || 'Failed to complete booking');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleViewDashboard = () => {
//     resetBooking();
//     router.push('/dashboard');
//   };

//   const resetBooking = () => {
//     setShowBookingModal(false);
//     setBookingStep('details');
//     setGuestName(user?.user_metadata?.name || '');
//     setGuestEmail(user?.email || '');
//     setGuestPhone('');
//     setGuestsCount(4);
//     setBrief('');
//     setPassword('');
//     setConfirmPassword('');
//     setBookingError('');
//   };

//   const switchToRegister = () => {
//     setBookingError('');
//     setPassword('');
//     setConfirmPassword('');
//     setBookingStep('register');
//   };

//   const switchToLogin = () => {
//     setBookingError('');
//     setPassword('');
//     setBookingStep('login');
//   };

//   if (loading || authLoading) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-[#424937]">Loading studio...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !studio) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-6">
//           <div className="w-20 h-20 mx-auto mb-6 text-[#737a65]">
//             <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold mb-4">{error || 'Studio not found'}</h1>
//           <p className="text-[#424937] mb-8">The studio you're looking for doesn't exist or isn't available yet.</p>
//           <Link href="/spaces" className="inline-block bg-[#446900] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#446900]/90 transition-all">
//             Browse all spaces
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const mainImage = getMainImage();
//   const smallImage1 = getSmallImage1();
//   const smallImage2 = getSmallImage2();

//   return (
//     <div className="bg-[#f8f9fa] text-[#191c1d] font-body-md overflow-x-hidden">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
//         <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
//           <Link href="/" className="text-2xl font-display-sm tracking-tighter text-[#446900] hover:scale-105 transition-transform duration-200">
//             ManyRooms
//           </Link>
//           <div className="hidden md:flex gap-8 items-center">
//             <Link href="/" className="text-[#446900] font-bold border-b-2 border-[#446900] font-body-md">Marketplace</Link>
//             <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Studios</Link>
//             <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Vibes</Link>
//             <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Journal</Link>
//           </div>
//           <div className="flex items-center gap-4">
//             {user ? (
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-[#424937] hidden md:block">{user.user_metadata?.name}</span>
//                 <Link href="/dashboard" className="hidden md:block bg-[#191c1d] text-white font-label-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform">
//                   Dashboard
//                 </Link>
//               </div>
//             ) : (
//               <button onClick={() => { setBookingStep('login'); setShowBookingModal(true); }} className="hidden md:block bg-[#beff5f] text-[#111f00] font-label-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform">
//                 Sign In
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>

//       <main className="pt-24 pb-12">
//         <div className="max-w-[1440px] mx-auto px-6 md:px-16">
//           {/* Header */}
//           <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//             <div className="space-y-4">
//               <div className="flex flex-wrap gap-3">
//                 <span className="bg-[#beff5f] text-[#111f00] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">Featured Studio</span>
//                 <span className="bg-[#e4d7fd] text-[#665c7c] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
//                   <StarIcon className="w-3 h-3 fill-current" /> 4.98 (124 Reviews)
//                 </span>
//               </div>
//               <h1 className="text-[48px] md:text-[84px] font-extrabold leading-[56px] md:leading-[92px] tracking-tight">{studio.name}</h1>
//               <div className="flex items-center gap-2 text-[#424937]">
//                 <MapPinIcon className="w-5 h-5" />
//                 <span className="text-lg">{formatLocation()}</span>
//               </div>
//             </div>
//             <div className="flex gap-4">
//               <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
//                 <span className="material-symbols-outlined">share</span> Share
//               </button>
//               <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
//                 <span className="material-symbols-outlined">favorite</span> Save
//               </button>
//             </div>
//           </header>

//           {/* Gallery */}
//           <section className="grid grid-cols-12 gap-4 h-[500px] md:h-[750px] mb-24 overflow-hidden rounded-3xl">
//             <div className="col-span-12 md:col-span-8 relative overflow-hidden h-full">
//               {mainImage ? (
//                 <img src={mainImage} alt={studio.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100"><PhotoIcon className="w-16 h-16 text-gray-400" /></div>
//               )}
//             </div>
//             <div className="hidden md:grid col-span-4 grid-rows-2 gap-4 h-full">
//               <div className="relative overflow-hidden">
//                 {smallImage1 ? (
//                   <img src={smallImage1} alt={`${studio.name} view 2`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100"><PhotoIcon className="w-12 h-12 text-gray-400" /></div>
//                 )}
//               </div>
//               <div className="relative overflow-hidden">
//                 {smallImage2 ? (
//                   <img src={smallImage2} alt={`${studio.name} view 3`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100"><PhotoIcon className="w-12 h-12 text-gray-400" /></div>
//                 )}
//               </div>
//             </div>
//           </section>

//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
//             <div className="md:col-span-7 lg:col-span-8 space-y-24">
//               <section>
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
//                   <span className="font-label-bold uppercase tracking-[0.2em] text-[#424937]">The Vibe</span>
//                   <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
//                 </div>
//                 <div className="mb-12">
//                   <h2 className="text-[32px] font-bold mb-6">Industrial Brutalist meets High-Fashion.</h2>
//                   <p className="text-lg text-[#424937] leading-relaxed max-w-2xl mb-8">
//                     {studio.description || 'A beautiful creative space ready for your next project.'}
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {studio.amenities && studio.amenities.slice(0, 5).map((item) => (
//                       <span key={item} className="bg-[#e7e8e9] px-4 py-2 rounded-full font-label-bold text-xs uppercase">{item}</span>
//                     ))}
//                   </div>
//                 </div>
//               </section>

//               <section>
//                 <h2 className="text-[32px] font-bold mb-8">Gear & Essentials</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   {studio.amenities && studio.amenities.map((item) => (
//                     <div key={item} className="flex items-start gap-4 p-6 bg-[#f3f4f5] rounded-2xl border border-[#c2c9b1]/10 hover:border-[#446900]/30 transition-all">
//                       <span className="material-symbols-outlined text-[#446900] bg-[#beff5f] p-3 rounded-xl">check_box_outline_blank</span>
//                       <div><h4 className="font-bold mb-1">{item}</h4><p className="text-sm text-[#424937]">Professional grade.</p></div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               <section className="p-8 md:p-12 rounded-3xl bg-[#e4d7fd]/30 border border-[#e4d7fd]">
//                 <div className="flex flex-col md:flex-row gap-8 items-start">
//                   <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 ring-4 ring-white shadow-xl bg-[#446900] flex items-center justify-center text-white text-3xl font-bold">
//                     {ownerName ? ownerName.charAt(0) : 'S'}
//                   </div>
//                   <div className="space-y-4">
//                     <h2 className="text-[32px] font-bold">Hosted by {ownerName || 'Studio Owner'}</h2>
//                     <p className="text-base text-[#424937]">Creative Director & Curator.</p>
//                     <button className="bg-[#191c1d] text-[#f8f9fa] px-6 py-2.5 rounded-full font-bold text-sm">Contact Host</button>
//                   </div>
//                 </div>
//               </section>
//             </div>

//             <aside className="md:col-span-5 lg:col-span-4">
//               <div className="sticky top-28 space-y-6">
//                 <div className="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-lg p-8 rounded-[32px]">
//                   <div className="flex justify-between items-end mb-8">
//                     <div>
//                       <span className="text-[#424937] font-label-bold text-xs uppercase tracking-widest">Starting from</span>
//                       <div className="flex items-baseline gap-1">
//                         <span className="text-3xl font-extrabold">{formatPrice(studio.hourly_rate)}</span>
//                         <span className="text-[#424937]">/ hour</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4 mb-6">
//                     <div>
//                       <label className="font-bold text-xs uppercase text-[#424937] ml-2">Event Date</label>
//                       <input 
//                         type="date" 
//                         value={eventDate}
//                         onChange={(e) => setEventDate(e.target.value)}
//                         className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#beff5f] outline-none mt-1"
//                       />
//                     </div>
//                     <div>
//                       <label className="font-bold text-xs uppercase text-[#424937] ml-2">Number of Guests</label>
//                       <select 
//                         value={guestsCount}
//                         onChange={(e) => setGuestsCount(parseInt(e.target.value))}
//                         className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#beff5f] outline-none mt-1"
//                       >
//                         {[1,2,3,4,5,6,7,8,9,10,15,20].map(n => (
//                           <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <button 
//                     onClick={handleBookingStart}
//                     className="w-full bg-[#beff5f] text-[#111f00] font-bold text-lg py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-lg active:scale-95"
//                   >
//                     Request to Book
//                   </button>
//                   <p className="text-center text-[10px] text-[#424937] mt-4 uppercase">You won't be charged yet</p>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {relatedStudios.length > 0 && (
//             <div className="mt-24">
//               <h3 className="text-[32px] font-bold mb-8">You may also love</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {relatedStudios.map((s) => (
//                   <Link key={s.id} href={`/spaces/${s.id}`} className="group">
//                     <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
//                       {s.images?.[0] ? (
//                         <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
//                       ) : (
//                         <div className="w-full h-full bg-gray-100 flex items-center justify-center"><PhotoIcon className="w-12 h-12 text-gray-400" /></div>
//                       )}
//                     </div>
//                     <div className="flex justify-between">
//                       <div><p className="text-[10px] uppercase text-[#424937]">{s.city}, {s.state}</p><h4 className="text-xl font-bold">{s.name}</h4></div>
//                       <div className="text-right"><p className="text-[10px] uppercase text-[#424937]">From</p><p className="text-lg font-medium">{formatPrice(s.hourly_rate)}</p></div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Booking Modal */}
//       {showBookingModal && (
//         <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetBooking} />
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
//             <button onClick={resetBooking} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
//               <XMarkIcon className="w-5 h-5" />
//             </button>

//             {/* Login Step */}
//             {bookingStep === 'login' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#e4d7fd] rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <LockClosedIcon className="w-8 h-8 text-[#665c7c]" />
//                   </div>
//                   <h3 className="text-2xl font-bold mb-2">Sign In to Book</h3>
//                   <p className="text-sm text-gray-600">Sign in to your account or create one</p>
//                 </div>

//                 {bookingError && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Email</label>
//                     <div className="relative">
//                       <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Password</label>
//                     <div className="relative">
//                       <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                     </div>
//                   </div>
//                 </div>

//                 <button onClick={handleLogin} disabled={isSubmitting} className="w-full bg-[#191c1d] text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
//                   {isSubmitting ? 'Signing in...' : 'Sign In'}
//                 </button>

//                 <div className="text-center">
//                   <p className="text-sm text-gray-500">
//                     Don't have an account?{' '}
//                     <button onClick={switchToRegister} className="text-[#446900] font-semibold hover:underline">Create one</button>
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Register Step */}
//             {bookingStep === 'register' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#beff5f] rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <UserIcon className="w-8 h-8 text-[#111f00]" />
//                   </div>
//                   <h3 className="text-2xl font-bold mb-2">Create Account</h3>
//                   <p className="text-sm text-gray-600">Register to book and track your enquiries</p>
//                 </div>

//                 {bookingError && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Full Name *</label>
//                     <div className="relative">
//                       <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your full name" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Email Address *</label>
//                     <div className="relative">
//                       <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Phone Number</label>
//                     <div className="relative">
//                       <PhoneIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+1 234 567 890" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Password * (min. 6 characters)</label>
//                     <div className="relative">
//                       <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Confirm Password *</label>
//                     <div className="relative">
//                       <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                     </div>
//                   </div>
//                 </div>

//                 <button onClick={handleRegister} disabled={isSubmitting} className="w-full bg-[#beff5f] text-[#111f00] py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50">
//                   {isSubmitting ? 'Creating Account...' : 'Create Account & Continue'}
//                 </button>

//                 <p className="text-center text-sm text-gray-500">
//                   Already have an account?{' '}
//                   <button onClick={switchToLogin} className="text-[#446900] font-semibold hover:underline">Sign in</button>
//                 </p>
//               </div>
//             )}

//             {/* Details Step */}
//             {bookingStep === 'details' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#beff5f] rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <span className="material-symbols-outlined text-3xl text-[#111f00]">event</span>
//                   </div>
//                   <h3 className="text-2xl font-bold mb-2">Book {studio.name}</h3>
//                   <p className="text-sm text-gray-600">Review details and send enquiry</p>
//                   {user && <p className="text-xs text-[#446900] mt-1">Signed in as {user.email}</p>}
//                 </div>

//                 {bookingError && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Full Name *</label>
//                     <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Email *</label>
//                     <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Phone</label>
//                     <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Brief / Message</label>
//                     <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Tell the host about your project..." rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#beff5f] outline-none resize-none" />
//                   </div>
//                   <div className="bg-[#f3f4f5] p-4 rounded-xl text-sm">
//                     <p><strong>Date:</strong> {eventDate || 'Not selected'}</p>
//                     <p><strong>Guests:</strong> {guestsCount}</p>
//                     <p><strong>Studio:</strong> {studio?.name}</p>
//                   </div>
//                 </div>

//                 <button onClick={handleBookingSubmit} disabled={isSubmitting} className="w-full bg-[#beff5f] text-[#111f00] py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50">
//                   {isSubmitting ? 'Sending...' : 'Send Enquiry'}
//                 </button>
//               </div>
//             )}

//             {/* Success Step */}
//             {bookingStep === 'success' && (
//               <div className="text-center space-y-6 py-8">
//                 <div className="w-20 h-20 bg-[#beff5f] rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircleIcon className="w-10 h-10 text-[#111f00]" />
//                 </div>
//                 <h3 className="text-2xl font-bold mb-2">Enquiry Sent! 🎉</h3>
//                 <p className="text-gray-600">Your enquiry has been sent to <strong>{ownerName || 'the studio owner'}</strong>.</p>
//                 <div className="bg-[#f3f4f5] p-6 rounded-2xl text-left space-y-3">
//                   <div className="flex items-center gap-3">
//                     <EnvelopeIcon className="w-5 h-5 text-[#446900]" />
//                     <p className="text-sm">Check <strong>{guestEmail}</strong> for updates</p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="material-symbols-outlined text-[#446900]">schedule</span>
//                     <p className="text-sm">Awaiting response from studio owner</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <button onClick={resetBooking} className="flex-1 border border-gray-200 py-3 rounded-2xl font-semibold hover:bg-gray-50">Close</button>
//                   <button onClick={handleViewDashboard} className="flex-1 bg-[#191c1d] text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 text-center">
//                     View Dashboard
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <Footer />
//       <Chatbot />
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { MapPinIcon, ArrowRightIcon, PhotoIcon, StarIcon, XMarkIcon, CheckCircleIcon, EnvelopeIcon, UserIcon, LockClosedIcon, PhoneIcon, UsersIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   country: string;
//   description: string;
//   hourly_rate: number;
//   capacity: number;
//   amenities: string[];
//   images: string[];
//   status: string;
//   created_at: string;
//   owner_id: string;
// }

// export default function StudioDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id as string;
//   const [studio, setStudio] = useState<Studio | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [eventDate, setEventDate] = useState('');
//   const [relatedStudios, setRelatedStudios] = useState<Studio[]>([]);
//   const [ownerName, setOwnerName] = useState('');
//   const [ownerEmail, setOwnerEmail] = useState('');

//   // Booking modal states
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [bookingStep, setBookingStep] = useState<'details' | 'register' | 'success'>('details');
//   const [guestName, setGuestName] = useState('');
//   const [guestEmail, setGuestEmail] = useState('');
//   const [guestPhone, setGuestPhone] = useState('');
//   const [guestsCount, setGuestsCount] = useState(4);
//   const [brief, setBrief] = useState('');
//   const [password, setPassword] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [bookingError, setBookingError] = useState('');
//   const [bookingSuccess, setBookingSuccess] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchStudio();
//     }
//   }, [id]);

//   const fetchStudio = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const { data: studioData, error: studioError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (studioError) throw studioError;
      
//       if (!studioData) {
//         setError('Studio not found');
//         setLoading(false);
//         return;
//       }

//       if (studioData.status !== 'approved') {
//         setError('This studio is not yet available for booking');
//         setLoading(false);
//         return;
//       }

//       setStudio(studioData);

//       // Fetch owner details
//       if (studioData.owner_id) {
//         const { data: owner } = await supabase
//           .from('users')
//           .select('name, email')
//           .eq('id', studioData.owner_id)
//           .single();
//         if (owner) {
//           setOwnerName(owner.name || 'Studio Owner');
//           setOwnerEmail(owner.email || '');
//         }
//       }

//       const { data: relatedData } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .eq('city', studioData.city)
//         .neq('id', id)
//         .limit(3);

//       if (relatedData) {
//         setRelatedStudios(relatedData);
//       }

//     } catch (err: any) {
//       console.error('Error fetching studio:', err);
//       setError(err.message || 'Failed to load studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMainImage = () => {
//     if (!studio?.images || studio.images.length === 0) return null;
//     return studio.images[0];
//   };

//   const getSmallImage1 = () => {
//     if (!studio?.images || studio.images.length < 2) return null;
//     return studio.images[1];
//   };

//   const getSmallImage2 = () => {
//     if (!studio?.images || studio.images.length < 3) return null;
//     return studio.images[2];
//   };

//   const formatPrice = (price: number) => {
//     return `$${price}`;
//   };

//   const formatLocation = () => {
//     if (!studio) return '';
//     const parts = [studio.city, studio.state].filter(Boolean);
//     return parts.join(', ');
//   };

//   const handleBookingSubmit = async () => {
//     setBookingError('');
    
//     if (bookingStep === 'details') {
//       // Validate details
//       if (!eventDate) {
//         setBookingError('Please select an event date');
//         return;
//       }
//       if (!guestName.trim()) {
//         setBookingError('Please enter your name');
//         return;
//       }
//       if (!guestEmail.trim()) {
//         setBookingError('Please enter your email');
//         return;
//       }
//       setBookingStep('register');
//       return;
//     }

//     if (bookingStep === 'register') {
//       if (!password || password.length < 6) {
//         setBookingError('Password must be at least 6 characters');
//         return;
//       }

//       setIsSubmitting(true);

//       try {
//         // Step 1: Create user account with Supabase Auth
//         const { data: authData, error: authError } = await supabase.auth.signUp({
//           email: guestEmail,
//           password: password,
//           options: {
//             data: {
//               name: guestName,
//               phone: guestPhone,
//               role: 'renter'
//             }
//           }
//         });

//         if (authError) {
//           // If user already exists, try signing in
//           if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
//             const { error: signInError } = await supabase.auth.signInWithPassword({
//               email: guestEmail,
//               password: password,
//             });
            
//             if (signInError) {
//               setBookingError('Email already registered. Please use a different email or sign in with your existing account.');
//               setIsSubmitting(false);
//               return;
//             }
//           } else {
//             throw authError;
//           }
//         }

//         // Get current user
//         const { data: { user } } = await supabase.auth.getUser();
        
//         if (!user) {
//           throw new Error('Failed to authenticate');
//         }

//         // Step 2: Create user profile in users table
//         const { error: profileError } = await supabase
//           .from('users')
//           .upsert({
//             id: user.id,
//             email: guestEmail,
//             name: guestName,
//             phone: guestPhone || null,
//             role: 'renter',
//             created_at: new Date().toISOString()
//           }, {
//             onConflict: 'id'
//           });

//         if (profileError) {
//           console.error('Profile error:', profileError);
//           // Continue anyway - profile is not critical
//         }

//         // Step 3: Create enquiry (booking request)
//         const { data: enquiryData, error: enquiryError } = await supabase
//           .from('enquiries')
//           .insert({
//             studio_id: studio?.id,
//             guest_name: guestName,
//             guest_email: guestEmail,
//             guest_phone: guestPhone || null,
//             event_date: eventDate,
//             guests_count: guestsCount,
//             brief: brief || `Booking enquiry for ${studio?.name}`,
//             status: 'pending',
//             created_at: new Date().toISOString(),
//             expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days
//           })
//           .select()
//           .single();

//         if (enquiryError) {
//           console.error('Enquiry error:', enquiryError);
//           throw enquiryError;
//         }

//         // Step 4: Create booking record linked to enquiry
//         const bookingCode = `MR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
//         const { error: bookingError } = await supabase
//           .from('bookings')
//           .insert({
//             enquiry_id: enquiryData.id,
//             user_id: user.id,
//             studio_id: studio?.id,
//             booking_code: bookingCode,
//             total_amount: studio ? studio.hourly_rate * 4 : 0, // Estimate based on 4 hours
//             status: 'pending_payment',
//             created_at: new Date().toISOString()
//           });

//         if (bookingError) {
//           console.error('Booking error:', bookingError);
//           // Don't throw - enquiry was created successfully
//         }

//         // Success!
//         setBookingStep('success');
//         setBookingSuccess(true);

//       } catch (err: any) {
//         console.error('Booking failed:', err);
//         setBookingError(err.message || 'Failed to complete booking. Please try again.');
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   const resetBooking = () => {
//     setShowBookingModal(false);
//     setBookingStep('details');
//     setGuestName('');
//     setGuestEmail('');
//     setGuestPhone('');
//     setGuestsCount(4);
//     setBrief('');
//     setPassword('');
//     setBookingError('');
//     setBookingSuccess(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-[#424937]">Loading studio...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !studio) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-6">
//           <div className="w-20 h-20 mx-auto mb-6 text-[#737a65]">
//             <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold mb-4">{error || 'Studio not found'}</h1>
//           <p className="text-[#424937] mb-8">The studio you're looking for doesn't exist or isn't available yet.</p>
//           <Link href="/spaces" className="inline-block bg-[#446900] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#446900]/90 transition-all">
//             Browse all spaces
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const mainImage = getMainImage();
//   const smallImage1 = getSmallImage1();
//   const smallImage2 = getSmallImage2();

//   return (
//     <div className="bg-[#f8f9fa] text-[#191c1d] font-body-md overflow-x-hidden">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
//         <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
//           <Link href="/" className="text-2xl font-display-sm tracking-tighter text-[#446900] hover:scale-105 transition-transform duration-200">
//             ManyRooms
//           </Link>
//           <div className="hidden md:flex gap-8 items-center">
//             <Link href="/" className="text-[#446900] font-bold border-b-2 border-[#446900] font-body-md">Marketplace</Link>
//             <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Studios</Link>
//             <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Vibes</Link>
//             <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Journal</Link>
//           </div>
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/signup?role=owner"
//               className="hidden md:block bg-[#beff5f] text-[#111f00] font-label-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform active:scale-95"
//             >
//               List Studio
//             </Link>
//           </div>
//         </div>
//       </nav>

//       <main className="pt-24 pb-12">
//         <div className="max-w-[1440px] mx-auto px-6 md:px-16">
//           {/* Header */}
//           <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//             <div className="space-y-4">
//               <div className="flex flex-wrap gap-3">
//                 <span className="bg-[#beff5f] text-[#111f00] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">Featured Studio</span>
//                 <span className="bg-[#e4d7fd] text-[#665c7c] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
//                   <StarIcon className="w-3 h-3 fill-current" /> 4.98 (124 Reviews)
//                 </span>
//               </div>
//               <h1 className="text-[48px] md:text-[84px] font-extrabold leading-[56px] md:leading-[92px] tracking-tight">{studio.name}</h1>
//               <div className="flex items-center gap-2 text-[#424937]">
//                 <MapPinIcon className="w-5 h-5" />
//                 <span className="text-lg">{formatLocation()}</span>
//               </div>
//             </div>
//             <div className="flex gap-4">
//               <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
//                 <span className="material-symbols-outlined">share</span> Share
//               </button>
//               <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
//                 <span className="material-symbols-outlined">favorite</span> Save
//               </button>
//             </div>
//           </header>

//           {/* Gallery */}
//           <section className="grid grid-cols-12 gap-4 h-[500px] md:h-[750px] mb-24 overflow-hidden rounded-3xl">
//             <div className="col-span-12 md:col-span-8 relative overflow-hidden h-full">
//               {mainImage ? (
//                 <img src={mainImage} alt={studio.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100"><PhotoIcon className="w-16 h-16 text-gray-400" /></div>
//               )}
//             </div>
//             <div className="hidden md:grid col-span-4 grid-rows-2 gap-4 h-full">
//               <div className="relative overflow-hidden">
//                 {smallImage1 ? (
//                   <img src={smallImage1} alt={`${studio.name} view 2`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100"><PhotoIcon className="w-12 h-12 text-gray-400" /></div>
//                 )}
//               </div>
//               <div className="relative overflow-hidden">
//                 {smallImage2 ? (
//                   <img src={smallImage2} alt={`${studio.name} view 3`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100"><PhotoIcon className="w-12 h-12 text-gray-400" /></div>
//                 )}
//               </div>
//             </div>
//           </section>

//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
//             {/* Main Content */}
//             <div className="md:col-span-7 lg:col-span-8 space-y-24">
//               <section>
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
//                   <span className="font-label-bold uppercase tracking-[0.2em] text-[#424937]">The Vibe</span>
//                   <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
//                 </div>
//                 <div className="mb-12">
//                   <h2 className="text-[32px] font-bold mb-6">Industrial Brutalist meets High-Fashion.</h2>
//                   <p className="text-lg text-[#424937] leading-relaxed max-w-2xl mb-8">
//                     {studio.description || 'A beautiful creative space ready for your next project.'}
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {studio.amenities && studio.amenities.slice(0, 5).map((item) => (
//                       <span key={item} className="bg-[#e7e8e9] px-4 py-2 rounded-full font-label-bold text-xs uppercase">{item}</span>
//                     ))}
//                   </div>
//                 </div>
//               </section>

//               {/* Equipment & Amenities */}
//               <section>
//                 <h2 className="text-[32px] font-bold mb-8">Gear & Essentials</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   {studio.amenities && studio.amenities.map((item) => (
//                     <div key={item} className="flex items-start gap-4 p-6 bg-[#f3f4f5] rounded-2xl border border-[#c2c9b1]/10 hover:border-[#446900]/30 transition-all">
//                       <span className="material-symbols-outlined text-[#446900] bg-[#beff5f] p-3 rounded-xl">check_box_outline_blank</span>
//                       <div><h4 className="font-bold mb-1">{item}</h4><p className="text-sm text-[#424937]">Professional grade.</p></div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Host */}
//               <section className="p-8 md:p-12 rounded-3xl bg-[#e4d7fd]/30 border border-[#e4d7fd]">
//                 <div className="flex flex-col md:flex-row gap-8 items-start">
//                   <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 ring-4 ring-white shadow-xl bg-[#446900] flex items-center justify-center text-white text-3xl font-bold">
//                     {ownerName.charAt(0) || 'S'}
//                   </div>
//                   <div className="space-y-4">
//                     <h2 className="text-[32px] font-bold">Hosted by {ownerName || 'Studio Owner'}</h2>
//                     <p className="text-base text-[#424937]">Creative Director & Curator.</p>
//                     <button className="bg-[#191c1d] text-[#f8f9fa] px-6 py-2.5 rounded-full font-bold text-sm">Contact Host</button>
//                   </div>
//                 </div>
//               </section>
//             </div>

//             {/* Booking Sidebar */}
//             <aside className="md:col-span-5 lg:col-span-4">
//               <div className="sticky top-28 space-y-6">
//                 <div className="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-lg p-8 rounded-[32px]">
//                   <div className="flex justify-between items-end mb-8">
//                     <div>
//                       <span className="text-[#424937] font-label-bold text-xs uppercase tracking-widest">Starting from</span>
//                       <div className="flex items-baseline gap-1">
//                         <span className="text-3xl font-extrabold">{formatPrice(studio.hourly_rate)}</span>
//                         <span className="text-[#424937]">/ hour</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-4 mb-6">
//                     <div>
//                       <label className="font-bold text-xs uppercase text-[#424937] ml-2">Event Date</label>
//                       <input 
//                         type="date" 
//                         value={eventDate}
//                         onChange={(e) => setEventDate(e.target.value)}
//                         className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#beff5f] outline-none mt-1"
//                       />
//                     </div>
//                     <div>
//                       <label className="font-bold text-xs uppercase text-[#424937] ml-2">Number of Guests</label>
//                       <select 
//                         value={guestsCount}
//                         onChange={(e) => setGuestsCount(parseInt(e.target.value))}
//                         className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#beff5f] outline-none mt-1"
//                       >
//                         {[1,2,3,4,5,6,7,8,9,10,15,20].map(n => (
//                           <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <button 
//                     onClick={() => setShowBookingModal(true)}
//                     className="w-full bg-[#beff5f] text-[#111f00] font-bold text-lg py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-lg active:scale-95"
//                   >
//                     Request to Book
//                   </button>
//                   <p className="text-center text-[10px] text-[#424937] mt-4 uppercase">You won't be charged yet</p>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {/* Related Studios */}
//           {relatedStudios.length > 0 && (
//             <div className="mt-24">
//               <h3 className="text-[32px] font-bold mb-8">You may also love</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {relatedStudios.map((s) => (
//                   <Link key={s.id} href={`/spaces/${s.id}`} className="group">
//                     <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
//                       {s.images?.[0] ? (
//                         <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
//                       ) : (
//                         <div className="w-full h-full bg-gray-100 flex items-center justify-center"><PhotoIcon className="w-12 h-12 text-gray-400" /></div>
//                       )}
//                     </div>
//                     <div className="flex justify-between">
//                       <div>
//                         <p className="text-[10px] uppercase text-[#424937]">{s.city}, {s.state}</p>
//                         <h4 className="text-xl font-bold">{s.name}</h4>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[10px] uppercase text-[#424937]">From</p>
//                         <p className="text-lg font-medium">{formatPrice(s.hourly_rate)}</p>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Booking Modal */}
//       {showBookingModal && (
//         <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetBooking} />
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
//             <button onClick={resetBooking} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
//               <XMarkIcon className="w-5 h-5" />
//             </button>

//             {bookingStep === 'details' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#beff5f] rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <span className="material-symbols-outlined text-3xl text-[#111f00]">event</span>
//                   </div>
//                   <h3 className="text-2xl font-bold mb-2">Book {studio.name}</h3>
//                   <p className="text-sm text-gray-600">Fill in your details to send an enquiry</p>
//                 </div>

//                 {bookingError && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Full Name *</label>
//                     <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your name" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Email Address *</label>
//                     <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Phone Number</label>
//                     <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+1 234 567 890" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Brief / Message</label>
//                     <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Tell the host about your project..." rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#beff5f] outline-none resize-none" />
//                   </div>
//                 </div>

//                 <button onClick={handleBookingSubmit} className="w-full bg-[#191c1d] text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all">
//                   Continue
//                 </button>
//               </div>
//             )}

//             {bookingStep === 'register' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#e4d7fd] rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <LockClosedIcon className="w-8 h-8 text-[#665c7c]" />
//                   </div>
//                   <h3 className="text-2xl font-bold mb-2">Create Password</h3>
//                   <p className="text-sm text-gray-600">Set a password to create your account</p>
//                 </div>

//                 {bookingError && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{bookingError}</div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-semibold mb-1">Password (min. 6 characters)</label>
//                   <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#beff5f] outline-none" />
//                 </div>

//                 <button onClick={handleBookingSubmit} disabled={isSubmitting} className="w-full bg-[#beff5f] text-[#111f00] py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50">
//                   {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
//                 </button>
//               </div>
//             )}

//             {bookingStep === 'success' && (
//               <div className="text-center space-y-6 py-8">
//                 <div className="w-20 h-20 bg-[#beff5f] rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircleIcon className="w-10 h-10 text-[#111f00]" />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold mb-2">Enquiry Sent! 🎉</h3>
//                   <p className="text-gray-600">Your enquiry has been sent to <strong>{ownerName || 'the studio owner'}</strong>.</p>
//                 </div>
//                 <div className="bg-[#f3f4f5] p-6 rounded-2xl text-left space-y-3">
//                   <div className="flex items-center gap-3">
//                     <EnvelopeIcon className="w-5 h-5 text-[#446900]" />
//                     <p className="text-sm">Check <strong>{guestEmail}</strong> for updates</p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="material-symbols-outlined text-[#446900]">schedule</span>
//                     <p className="text-sm">Awaiting response from studio owner</p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="material-symbols-outlined text-[#446900]">notifications</span>
//                     <p className="text-sm">You'll be notified when the owner responds</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <button onClick={resetBooking} className="flex-1 border border-gray-200 py-3 rounded-2xl font-semibold hover:bg-gray-50">Close</button>
//                   <Link href="/dashboard" className="flex-1 bg-[#191c1d] text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 text-center">View Dashboard</Link>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <Footer />
//       <Chatbot />
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
// import { MapPinIcon, ArrowRightIcon, PhotoIcon, StarIcon, XMarkIcon, CheckCircleIcon, EnvelopeIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   country: string;
//   description: string;
//   hourly_rate: number;
//   capacity: number;
//   amenities: string[];
//   images: string[];
//   status: string;
//   created_at: string;
//   owner_id: string;
// }

// export default function StudioDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id as string;
//   const [studio, setStudio] = useState<Studio | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [date, setDate] = useState('');
//   const [startTime, setStartTime] = useState('09:00');
//   const [endTime, setEndTime] = useState('13:00');
//   const [relatedStudios, setRelatedStudios] = useState<Studio[]>([]);
//   const [ownerName, setOwnerName] = useState('');
//   const [ownerEmail, setOwnerEmail] = useState('');

//   // Booking modal states
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [bookingStep, setBookingStep] = useState<'details' | 'register' | 'success'>('details');
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [bookingMessage, setBookingMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [bookingError, setBookingError] = useState('');
//   const [bookingSuccess, setBookingSuccess] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchStudio();
//     }
//   }, [id]);

//   const fetchStudio = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const { data: studioData, error: studioError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (studioError) throw studioError;
      
//       if (!studioData) {
//         setError('Studio not found');
//         setLoading(false);
//         return;
//       }

//       if (studioData.status !== 'approved') {
//         setError('This studio is not yet available for booking');
//         setLoading(false);
//         return;
//       }

//       setStudio(studioData);

//       // Fetch owner details
//       if (studioData.owner_id) {
//         const { data: owner } = await supabase
//           .from('users')
//           .select('name, email')
//           .eq('id', studioData.owner_id)
//           .single();
//         if (owner) {
//           setOwnerName(owner.name || 'Studio Owner');
//           setOwnerEmail(owner.email || '');
//         }
//       }

//       const { data: relatedData } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .eq('city', studioData.city)
//         .neq('id', id)
//         .limit(3);

//       if (relatedData) {
//         setRelatedStudios(relatedData);
//       }

//     } catch (err: any) {
//       console.error('Error fetching studio:', err);
//       setError(err.message || 'Failed to load studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMainImage = () => {
//     if (!studio?.images || studio.images.length === 0) return null;
//     return studio.images[0];
//   };

//   const getSmallImage1 = () => {
//     if (!studio?.images || studio.images.length < 2) return null;
//     return studio.images[1];
//   };

//   const getSmallImage2 = () => {
//     if (!studio?.images || studio.images.length < 3) return null;
//     return studio.images[2];
//   };

//   const formatPrice = (price: number) => {
//     return `$${price}`;
//   };

//   const formatLocation = () => {
//     if (!studio) return '';
//     const parts = [studio.city, studio.state].filter(Boolean);
//     return parts.join(', ');
//   };

//   const calculateTotal = () => {
//     if (!studio) return 0;
//     const hours = parseInt(endTime) - parseInt(startTime);
//     return studio.hourly_rate * Math.max(hours, 1) + 45 + 32;
//   };

//   const handleBookingSubmit = async () => {
//     setBookingError('');
    
//     if (bookingStep === 'details') {
//       setBookingStep('register');
//       return;
//     }

//     if (bookingStep === 'register') {
//       if (!email || !username || !password) {
//         setBookingError('Please fill in all fields');
//         return;
//       }

//       if (password.length < 6) {
//         setBookingError('Password must be at least 6 characters');
//         return;
//       }

//       setIsSubmitting(true);

//       try {
//         // Step 1: Create user account
//         const { data: authData, error: authError } = await supabase.auth.signUp({
//           email: email,
//           password: password,
//           options: {
//             data: {
//               name: username,
//               role: 'renter'
//             }
//           }
//         });

//         if (authError) {
//           if (authError.message.includes('already registered')) {
//             // User exists, try signing in
//             const { error: signInError } = await supabase.auth.signInWithPassword({
//               email: email,
//               password: password,
//             });
            
//             if (signInError) {
//               setBookingError('Email already registered. Please use a different email or sign in.');
//               setIsSubmitting(false);
//               return;
//             }
//           } else {
//             throw authError;
//           }
//         }

//         // Get current user
//         const { data: { user } } = await supabase.auth.getUser();
        
//         if (!user) {
//           throw new Error('Failed to authenticate');
//         }

//         // Step 2: Create or update user profile
//         const { error: profileError } = await supabase
//           .from('users')
//           .upsert({
//             id: user.id,
//             email: email,
//             name: username,
//             role: 'renter',
//             created_at: new Date().toISOString()
//           });

//         if (profileError) {
//           console.error('Profile error:', profileError);
//         }

//         // Step 3: Create booking request
//         const { error: bookingError } = await supabase
//           .from('bookings')
//           .insert({
//             studio_id: studio?.id,
//             user_id: user.id,
//             owner_id: studio?.owner_id,
//             date: date,
//             start_time: startTime,
//             end_time: endTime,
//             message: bookingMessage || 'I would like to book this space for a creative session.',
//             status: 'pending',
//             total_amount: calculateTotal(),
//             created_at: new Date().toISOString()
//           });

//         if (bookingError) {
//           console.error('Booking error:', bookingError);
//           throw bookingError;
//         }

//         // Step 4: Send notification email to studio owner (would be handled by backend)
//         // For now, we'll just show success
//         setBookingStep('success');
//         setBookingSuccess(true);

//       } catch (err: any) {
//         console.error('Booking failed:', err);
//         setBookingError(err.message || 'Failed to complete booking. Please try again.');
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   const resetBooking = () => {
//     setShowBookingModal(false);
//     setBookingStep('details');
//     setEmail('');
//     setUsername('');
//     setPassword('');
//     setBookingMessage('');
//     setBookingError('');
//     setBookingSuccess(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-[#424937]">Loading studio...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !studio) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-6">
//           <div className="w-20 h-20 mx-auto mb-6 text-[#737a65]">
//             <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold mb-4">{error || 'Studio not found'}</h1>
//           <p className="text-[#424937] mb-8">The studio you're looking for doesn't exist or isn't available yet.</p>
//           <Link href="/spaces" className="inline-block bg-[#446900] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#446900]/90 transition-all">
//             Browse all spaces
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const mainImage = getMainImage();
//   const smallImage1 = getSmallImage1();
//   const smallImage2 = getSmallImage2();

//   return (
//     <div className="bg-[#f8f9fa] text-[#191c1d] font-body-md overflow-x-hidden">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
//         <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
//           <Link href="/" className="text-2xl font-display-sm tracking-tighter text-[#446900] hover:scale-105 transition-transform duration-200">
//             ManyRooms
//           </Link>
//           <div className="hidden md:flex gap-8 items-center">
//             <Link href="/" className="text-[#446900] font-bold border-b-2 border-[#446900] font-body-md">Marketplace</Link>
//             <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Studios</Link>
//             <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Vibes</Link>
//             <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Journal</Link>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="flex gap-2">
//               <button className="p-2 text-[#424937] hover:text-[#446900] transition-colors">
//                 <span className="material-symbols-outlined">favorite</span>
//               </button>
//               <button className="p-2 text-[#424937] hover:text-[#446900] transition-colors">
//                 <span className="material-symbols-outlined">account_circle</span>
//               </button>
//             </div>
//             <Link 
//               href="/signup?role=owner"
//               className="hidden md:block bg-[#beff5f] text-[#111f00] font-label-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform active:scale-95"
//             >
//               List Studio
//             </Link>
//           </div>
//         </div>
//       </nav>

//       <main className="pt-24 pb-12">
//         <div className="max-w-[1440px] mx-auto px-6 md:px-16">
//           {/* Dynamic Header & Quick Actions */}
//           <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//             <div className="space-y-4">
//               <div className="flex flex-wrap gap-3">
//                 <span className="bg-[#beff5f] text-[#111f00] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
//                   Featured Studio
//                 </span>
//                 <span className="bg-[#e4d7fd] text-[#665c7c] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
//                   <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.98 (124 Reviews)
//                 </span>
//               </div>
//               <h1 className="text-[48px] md:text-[84px] font-display-sm md:font-display-lg leading-[56px] md:leading-[92px] tracking-[-0.02em] md:tracking-[-0.04em] font-extrabold -ml-1">
//                 {studio.name}
//               </h1>
//               <div className="flex items-center gap-2 text-[#424937]">
//                 <span className="material-symbols-outlined">location_on</span>
//                 <span className="text-lg">{formatLocation()} • Creative Quarter</span>
//               </div>
//             </div>
//             <div className="flex gap-4">
//               <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
//                 <span className="material-symbols-outlined">share</span> Share
//               </button>
//               <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
//                 <span className="material-symbols-outlined">favorite</span> Save
//               </button>
//             </div>
//           </header>

//           {/* Immersive Hero Gallery */}
//           <section className="grid grid-cols-12 gap-4 h-[500px] md:h-[750px] mb-24 overflow-hidden rounded-3xl group">
//             <div className="col-span-12 md:col-span-8 relative overflow-hidden h-full">
//               {mainImage ? (
//                 <img 
//                   src={mainImage}
//                   alt={studio.name}
//                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                   <PhotoIcon className="w-16 h-16 text-gray-400" />
//                 </div>
//               )}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//             </div>
//             <div className="hidden md:grid col-span-4 grid-rows-2 gap-4 h-full">
//               <div className="relative overflow-hidden">
//                 {smallImage1 ? (
//                   <img 
//                     src={smallImage1}
//                     alt={`${studio.name} view 2`}
//                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                     <PhotoIcon className="w-12 h-12 text-gray-400" />
//                   </div>
//                 )}
//               </div>
//               <div className="relative overflow-hidden">
//                 {smallImage2 ? (
//                   <img 
//                     src={smallImage2}
//                     alt={`${studio.name} view 3`}
//                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                     <PhotoIcon className="w-12 h-12 text-gray-400" />
//                   </div>
//                 )}
//                 <button className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full font-label-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform active:scale-95">
//                   <span className="material-symbols-outlined">grid_view</span> View all {studio.images?.length || 0} photos
//                 </button>
//               </div>
//             </div>
//           </section>

//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
//             {/* Main Content Left */}
//             <div className="md:col-span-7 lg:col-span-8 space-y-24">
//               {/* Studio Story & Vibe */}
//               <section>
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
//                   <span className="font-label-bold uppercase tracking-[0.2em] text-[#424937]">The Vibe</span>
//                   <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
//                 </div>
//                 <div className="mb-12">
//                   <h2 className="text-[32px] font-headline-lg mb-6">Industrial Brutalist meets High-Fashion.</h2>
//                   <p className="text-lg text-[#424937] leading-relaxed max-w-2xl mb-8">
//                     {studio.description || 'A beautiful creative space ready for your next project. Designed for high-end editorial shoots, cinematic productions, and immersive brand activations.'}
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {studio.amenities && studio.amenities.slice(0, 5).map((item) => (
//                       <span key={item} className="bg-[#e7e8e9] px-4 py-2 rounded-full font-label-bold text-xs uppercase">
//                         {item}
//                       </span>
//                     ))}
//                     <span className="bg-[#e7e8e9] px-4 py-2 rounded-full font-label-bold text-xs uppercase">Premium Space</span>
//                   </div>
//                 </div>
//               </section>

//               {/* Equipment & Amenities */}
//               <section>
//                 <h2 className="text-[32px] font-headline-lg mb-8">Gear & Essentials</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   {studio.amenities && studio.amenities.map((item) => (
//                     <div key={item} className="flex items-start gap-4 p-6 bg-[#f3f4f5] rounded-2xl border border-[#c2c9b1]/10 hover:border-[#446900]/30 transition-all group">
//                       <span className="material-symbols-outlined text-[#446900] bg-[#beff5f] p-3 rounded-xl group-hover:scale-110 transition-transform">
//                         check_box_outline_blank
//                       </span>
//                       <div>
//                         <h4 className="font-label-bold mb-1">{item}</h4>
//                         <p className="text-sm text-[#424937]">Professional grade equipment included.</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Host Profile & Reviews */}
//               <section className="p-8 md:p-12 rounded-3xl bg-[#e4d7fd]/30 border border-[#e4d7fd]">
//                 <div className="flex flex-col md:flex-row gap-8 items-start">
//                   <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 ring-4 ring-white shadow-xl">
//                     <div className="w-full h-full bg-[#446900] flex items-center justify-center text-white text-3xl font-bold">
//                       {ownerName.charAt(0) || 'S'}
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <h2 className="text-[32px] font-headline-lg">Hosted by {ownerName || 'Studio Owner'}</h2>
//                     <p className="text-base text-[#424937]">Creative Director & Curator. Dedicated to ensuring every creator has the tools and atmosphere needed to excel.</p>
//                     <div className="flex gap-4">
//                       <button className="bg-[#191c1d] text-[#f8f9fa] px-6 py-2.5 rounded-full font-label-bold text-sm hover:opacity-90 transition-opacity">
//                         Contact Host
//                       </button>
//                       <div className="flex items-center gap-2 text-[#424937] font-label-bold">
//                         <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Identity Verified
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-12 space-y-8">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-1 text-[#446900]">
//                         {[...Array(5)].map((_, i) => (
//                           <StarIcon key={i} className="w-5 h-5 fill-current" />
//                         ))}
//                       </div>
//                       <p className="text-base italic">"The lighting in this space is unreal. We didn't even need our secondary rig for the first half of the shoot."</p>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-[#e1e3e4]"></div>
//                         <span className="font-label-bold text-xs uppercase">Marcus T., Vogue Italia</span>
//                       </div>
//                     </div>
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-1 text-[#446900]">
//                         {[...Array(5)].map((_, i) => (
//                           <StarIcon key={i} className="w-5 h-5 fill-current" />
//                         ))}
//                       </div>
//                       <p className="text-base italic">"Incredible textures. The brick and concrete mix is perfect for streetwear looks."</p>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-[#e1e3e4]"></div>
//                         <span className="font-label-bold text-xs uppercase">Sarah L., Creative Agency</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Location Map */}
//               <section>
//                 <div className="flex items-center justify-between mb-8">
//                   <h2 className="text-[32px] font-headline-lg">Where you'll be</h2>
//                   <span className="font-label-bold text-[#446900]">{studio.city}, {studio.state}</span>
//                 </div>
//                 <div className="w-full h-96 rounded-3xl overflow-hidden shadow-inner grayscale contrast-125 border border-[#c2c9b1] relative group">
//                   <div className="absolute inset-0 bg-[#446900]/5 pointer-events-none z-10"></div>
//                   <div className="w-full h-full bg-[#edeeef] flex items-center justify-center">
//                     <div className="text-center">
//                       <MapPinIcon className="w-12 h-12 text-[#446900] mx-auto mb-2" />
//                       <p className="text-[#424937]">{formatLocation()}</p>
//                     </div>
//                   </div>
//                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
//                     <div className="w-12 h-12 bg-[#beff5f] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
//                       <span className="material-symbols-outlined text-[#111f00] font-bold">location_on</span>
//                     </div>
//                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#446900]/20 rounded-full animate-ping"></div>
//                   </div>
//                 </div>
//                 <p className="mt-6 text-base text-[#424937]">Located in the heart of the creative hub. Walking distance from major stations.</p>
//               </section>
//             </div>

//             {/* Sticky Booking Sidebar */}
//             <aside className="md:col-span-5 lg:col-span-4">
//               <div className="sticky top-28 space-y-6">
//                 <div className="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_20px_40px_-15px_rgba(99,89,121,0.1)] p-8 rounded-[32px]">
//                   <div className="flex justify-between items-end mb-8">
//                     <div>
//                       <span className="text-[#424937] font-label-bold text-xs uppercase tracking-widest block mb-1">Starting from</span>
//                       <div className="flex items-baseline gap-1">
//                         <span className="text-3xl font-extrabold">{formatPrice(studio.hourly_rate)}</span>
//                         <span className="text-[#424937]">/ hour</span>
//                       </div>
//                     </div>
//                     <div className="bg-[#beff5f] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">Top Rated</div>
//                   </div>

//                   <div className="space-y-4 mb-8">
//                     <div className="grid grid-cols-1 gap-2">
//                       <label className="font-label-bold text-xs uppercase text-[#424937] ml-2">Date</label>
//                       <div className="relative">
//                         <input 
//                           type="date" 
//                           value={date}
//                           onChange={(e) => setDate(e.target.value)}
//                           className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#beff5f] transition-all outline-none"
//                         />
//                         <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#424937] pointer-events-none">calendar_today</span>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <label className="font-label-bold text-xs uppercase text-[#424937] ml-2">Start</label>
//                         <select 
//                           value={startTime}
//                           onChange={(e) => setStartTime(e.target.value)}
//                           className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#beff5f] appearance-none outline-none"
//                         >
//                           <option value="09:00">09:00 AM</option>
//                           <option value="10:00">10:00 AM</option>
//                           <option value="11:00">11:00 AM</option>
//                           <option value="12:00">12:00 PM</option>
//                           <option value="13:00">01:00 PM</option>
//                           <option value="14:00">02:00 PM</option>
//                         </select>
//                       </div>
//                       <div className="space-y-2">
//                         <label className="font-label-bold text-xs uppercase text-[#424937] ml-2">End</label>
//                         <select 
//                           value={endTime}
//                           onChange={(e) => setEndTime(e.target.value)}
//                           className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#beff5f] appearance-none outline-none"
//                         >
//                           <option value="13:00">01:00 PM</option>
//                           <option value="14:00">02:00 PM</option>
//                           <option value="15:00">03:00 PM</option>
//                           <option value="16:00">04:00 PM</option>
//                           <option value="17:00">05:00 PM</option>
//                           <option value="18:00">06:00 PM</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-3 mb-8 border-t border-[#c2c9b1]/20 pt-6">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-[#424937]">${studio.hourly_rate} x {Math.max(parseInt(endTime) - parseInt(startTime), 1)} hours</span>
//                       <span>${studio.hourly_rate * Math.max(parseInt(endTime) - parseInt(startTime), 1)}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-[#424937]">Cleaning Fee</span>
//                       <span>$45</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-[#424937]">ManyRooms Service Fee</span>
//                       <span>$32</span>
//                     </div>
//                     <div className="flex justify-between font-bold text-lg pt-2">
//                       <span>Total</span>
//                       <span className="text-[#446900]">${calculateTotal()}</span>
//                     </div>
//                   </div>

//                   <button 
//                     onClick={() => {
//                       if (!date) {
//                         alert('Please select a date first');
//                         return;
//                       }
//                       setShowBookingModal(true);
//                     }}
//                     className="w-full bg-[#beff5f] text-[#111f00] font-display-sm text-lg py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-[0_10px_30px_-5px_rgba(190,255,95,0.4)] active:scale-95"
//                   >
//                     Request to Book
//                   </button>
//                   <p className="text-center text-[10px] text-[#424937] mt-4 uppercase font-label-bold tracking-tighter">You won't be charged yet</p>
//                 </div>

//                 <div className="bg-[#edeeef] p-6 rounded-[24px] flex items-center gap-4">
//                   <span className="material-symbols-outlined text-[#446900] text-3xl">verified_user</span>
//                   <div className="text-xs">
//                     <p className="font-bold mb-1">ManyRooms Protection</p>
//                     <p className="text-[#424937]">Every booking includes damage protection and host liability insurance.</p>
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {/* You may also love section */}
//           {relatedStudios.length > 0 && (
//             <div className="mt-24">
//               <div className="flex items-center justify-between mb-8">
//                 <h3 className="text-[32px] font-headline-lg">You may also love</h3>
//                 <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-[#191c1d]/20 pb-1 hover:opacity-60 transition-opacity flex items-center gap-1">
//                   VIEW ALL <ArrowRightIcon className="w-3 h-3" />
//                 </Link>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {relatedStudios.map((s) => (
//                   <Link key={s.id} href={`/spaces/${s.id}`} className="group">
//                     <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
//                       {s.images && s.images[0] ? (
//                         <img
//                           src={s.images[0]}
//                           alt={s.name}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <PhotoIcon className="w-12 h-12 text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-widest text-[#424937]">{s.city}, {s.state}</p>
//                         <h4 className="text-xl font-bold mt-1 group-hover:opacity-70 transition-opacity">{s.name}</h4>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[10px] uppercase tracking-widest text-[#424937]">From</p>
//                         <p className="text-lg font-medium">{formatPrice(s.hourly_rate)}</p>
//                         <p className="text-[10px] text-[#424937]">/ hour</p>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* FAQ Section */}
//           <div className="mt-24 pt-12 border-t border-[#c2c9b1]/10">
//             <h3 className="text-[32px] font-headline-lg mb-8">Frequently Asked</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {[
//                 { q: "What's included in the hire fee?", a: "All standard equipment listed in the amenities section. Additional production support can be arranged separately." },
//                 { q: "Can I view the space before booking?", a: "Yes, viewing requests can be arranged with the host. Please mention this in your enquiry." },
//                 { q: "What's your cancellation policy?", a: "Cancellations made 48+ hours before booking are fully refundable." },
//                 { q: "Do you offer production support?", a: "Yes, experienced crew and equipment hire can be arranged upon request." }
//               ].map((faq) => (
//                 <div key={faq.q}>
//                   <p className="font-bold mb-2">{faq.q}</p>
//                   <p className="text-sm text-[#424937]">{faq.a}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Booking Modal */}
//       {showBookingModal && (
//         <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
//           <div 
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={resetBooking}
//           />
//           <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
//             <button 
//               onClick={resetBooking}
//               className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all z-10"
//             >
//               <XMarkIcon className="w-5 h-5 text-gray-600" />
//             </button>

//             {bookingStep === 'details' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#beff5f] rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <span className="material-symbols-outlined text-3xl text-[#111f00]">event</span>
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Book {studio.name}</h3>
//                   <p className="text-sm text-gray-600">
//                     {date} • {startTime}:00 - {endTime}:00 • ${calculateTotal()} total
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">Message to Host (Optional)</label>
//                     <textarea
//                       value={bookingMessage}
//                       onChange={(e) => setBookingMessage(e.target.value)}
//                       placeholder="Tell the host about your project..."
//                       rows={4}
//                       className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none resize-none"
//                     />
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleBookingSubmit}
//                   className="w-full bg-[#191c1d] text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
//                 >
//                   Continue to Register
//                 </button>
//                 <p className="text-xs text-center text-gray-500">You'll create an account in the next step</p>
//               </div>
//             )}

//             {bookingStep === 'register' && (
//               <div className="space-y-6">
//                 <div className="text-center mb-6">
//                   <div className="w-16 h-16 bg-[#e4d7fd] rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <UserIcon className="w-8 h-8 text-[#665c7c]" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h3>
//                   <p className="text-sm text-gray-600">Register to complete your booking request</p>
//                 </div>

//                 {bookingError && (
//                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
//                     {bookingError}
//                   </div>
//                 )}

//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
//                     <div className="relative">
//                       <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="you@example.com"
//                         className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
//                     <div className="relative">
//                       <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         placeholder="Choose a username"
//                         className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
//                     <div className="relative">
//                       <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//                       <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Min. 6 characters"
//                         className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleBookingSubmit}
//                   disabled={isSubmitting}
//                   className="w-full bg-[#beff5f] text-[#111f00] py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmitting ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                       Creating Account...
//                     </span>
//                   ) : (
//                     'Complete Booking'
//                   )}
//                 </button>
//                 <p className="text-xs text-center text-gray-500">Your details are secure and encrypted</p>
//               </div>
//             )}

//             {bookingStep === 'success' && (
//               <div className="text-center space-y-6 py-8">
//                 <div className="w-20 h-20 bg-[#beff5f] rounded-full flex items-center justify-center mx-auto">
//                   <CheckCircleIcon className="w-10 h-10 text-[#111f00]" />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent! 🎉</h3>
//                   <p className="text-gray-600">
//                     Your booking request has been sent to <strong>{ownerName || 'the studio owner'}</strong>.
//                   </p>
//                 </div>
//                 <div className="bg-[#f3f4f5] p-6 rounded-2xl text-left space-y-3">
//                   <div className="flex items-center gap-3">
//                     <EnvelopeIcon className="w-5 h-5 text-[#446900] flex-shrink-0" />
//                     <p className="text-sm text-gray-700">Check your email (<strong>{email}</strong>) for updates</p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="material-symbols-outlined text-[#446900]">schedule</span>
//                     <p className="text-sm text-gray-700">Awaiting response from studio owner</p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="material-symbols-outlined text-[#446900]">notifications</span>
//                     <p className="text-sm text-gray-700">You'll be notified when the owner responds</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={resetBooking}
//                     className="flex-1 border border-gray-200 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
//                   >
//                     Close
//                   </button>
//                   <Link
//                     href="/dashboard"
//                     className="flex-1 bg-[#191c1d] text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all text-center"
//                   >
//                     View Dashboard
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

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
// import { useParams } from 'next/navigation';
// import { MapPinIcon, UsersIcon, ArrowRightIcon, PhotoIcon, HeartIcon, ShareIcon, StarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   country: string;
//   description: string;
//   hourly_rate: number;
//   capacity: number;
//   amenities: string[];
//   images: string[];
//   status: string;
//   created_at: string;
//   owner_id: string;
// }

// export default function StudioDetailPage() {
//   const params = useParams();
//   const id = params.id as string;
//   const [studio, setStudio] = useState<Studio | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [date, setDate] = useState('');
//   const [guests, setGuests] = useState(4);
//   const [brief, setBrief] = useState('');
//   const [relatedStudios, setRelatedStudios] = useState<Studio[]>([]);
//   const [ownerName, setOwnerName] = useState('');

//   useEffect(() => {
//     if (id) {
//       fetchStudio();
//     }
//   }, [id]);

//   const fetchStudio = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const { data: studioData, error: studioError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (studioError) throw studioError;
      
//       if (!studioData) {
//         setError('Studio not found');
//         setLoading(false);
//         return;
//       }

//       if (studioData.status !== 'approved') {
//         setError('This studio is not yet available for booking');
//         setLoading(false);
//         return;
//       }

//       setStudio(studioData);

//       // Fetch owner name
//       if (studioData.owner_id) {
//         const { data: owner } = await supabase
//           .from('users')
//           .select('name')
//           .eq('id', studioData.owner_id)
//           .single();
//         if (owner) setOwnerName(owner.name || 'Studio Owner');
//       }

//       const { data: relatedData, error: relatedError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .eq('city', studioData.city)
//         .neq('id', id)
//         .limit(3);

//       if (!relatedError && relatedData) {
//         setRelatedStudios(relatedData);
//       }

//     } catch (err: any) {
//       console.error('Error fetching studio:', err);
//       setError(err.message || 'Failed to load studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMainImage = () => {
//     if (!studio?.images || studio.images.length === 0) return null;
//     return studio.images[0];
//   };

//   const getSmallImage1 = () => {
//     if (!studio?.images || studio.images.length < 2) return null;
//     return studio.images[1];
//   };

//   const getSmallImage2 = () => {
//     if (!studio?.images || studio.images.length < 3) return null;
//     return studio.images[2];
//   };

//   const formatPrice = (price: number) => {
//     return `$${price}`;
//   };

//   const formatLocation = () => {
//     if (!studio) return '';
//     const parts = [studio.city, studio.state].filter(Boolean);
//     return parts.join(', ');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-[#424937]">Loading studio...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !studio) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-6">
//           <div className="w-20 h-20 mx-auto mb-6 text-[#737a65]">
//             <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold mb-4">{error || 'Studio not found'}</h1>
//           <p className="text-[#424937] mb-8">The studio you're looking for doesn't exist or isn't available yet.</p>
//           <Link href="/spaces" className="inline-block bg-[#446900] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#446900]/90 transition-all">
//             Browse all spaces
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const mainImage = getMainImage();
//   const smallImage1 = getSmallImage1();
//   const smallImage2 = getSmallImage2();

//   return (
//     <div className="bg-[#f8f9fa] text-[#191c1d] font-body-md overflow-x-hidden">
//       {/* Navigation */}
//       <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
//         <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
//           <Link href="/" className="text-2xl font-display-sm tracking-tighter text-[#446900] hover:scale-105 transition-transform duration-200">
//             ManyRooms
//           </Link>
//           <div className="hidden md:flex gap-8 items-center">
//             <Link href="/" className="text-[#446900] font-bold border-b-2 border-[#446900] font-body-md">Marketplace</Link>
//             <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Studios</Link>
//             <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Vibes</Link>
//             <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Journal</Link>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="flex gap-2">
//               <button className="p-2 text-[#424937] hover:text-[#446900] transition-colors">
//                 <span className="material-symbols-outlined">favorite</span>
//               </button>
//               <button className="p-2 text-[#424937] hover:text-[#446900] transition-colors">
//                 <span className="material-symbols-outlined">account_circle</span>
//               </button>
//             </div>
//             <Link 
//               href="/signup?role=owner"
//               className="hidden md:block bg-[#beff5f] text-[#111f00] font-label-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform active:scale-95"
//             >
//               List Studio
//             </Link>
//           </div>
//         </div>
//       </nav>

//       <main className="pt-24 pb-12">
//         <div className="max-w-[1440px] mx-auto px-6 md:px-16">
//           {/* Dynamic Header & Quick Actions */}
//           <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//             <div className="space-y-4">
//               <div className="flex flex-wrap gap-3">
//                 <span className="bg-[#beff5f] text-[#111f00] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
//                   Featured Studio
//                 </span>
//                 <span className="bg-[#e4d7fd] text-[#665c7c] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
//                   <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.98 (124 Reviews)
//                 </span>
//               </div>
//               <h1 className="text-[48px] md:text-[84px] font-display-sm md:font-display-lg leading-[56px] md:leading-[92px] tracking-[-0.02em] md:tracking-[-0.04em] font-extrabold -ml-1">
//                 {studio.name}
//               </h1>
//               <div className="flex items-center gap-2 text-[#424937]">
//                 <span className="material-symbols-outlined">location_on</span>
//                 <span className="text-lg">{formatLocation()} • Creative Quarter</span>
//               </div>
//             </div>
//             <div className="flex gap-4">
//               <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
//                 <span className="material-symbols-outlined">share</span> Share
//               </button>
//               <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
//                 <span className="material-symbols-outlined">favorite</span> Save
//               </button>
//             </div>
//           </header>

//           {/* Immersive Hero Gallery */}
//           <section className="grid grid-cols-12 gap-4 h-[500px] md:h-[750px] mb-24 overflow-hidden rounded-3xl group">
//             <div className="col-span-12 md:col-span-8 relative overflow-hidden h-full">
//               {mainImage ? (
//                 <img 
//                   src={mainImage}
//                   alt={studio.name}
//                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                   <PhotoIcon className="w-16 h-16 text-gray-400" />
//                 </div>
//               )}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
//             </div>
//             <div className="hidden md:grid col-span-4 grid-rows-2 gap-4 h-full">
//               <div className="relative overflow-hidden">
//                 {smallImage1 ? (
//                   <img 
//                     src={smallImage1}
//                     alt={`${studio.name} view 2`}
//                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                     <PhotoIcon className="w-12 h-12 text-gray-400" />
//                   </div>
//                 )}
//               </div>
//               <div className="relative overflow-hidden">
//                 {smallImage2 ? (
//                   <img 
//                     src={smallImage2}
//                     alt={`${studio.name} view 3`}
//                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                     <PhotoIcon className="w-12 h-12 text-gray-400" />
//                   </div>
//                 )}
//                 <button className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full font-label-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform active:scale-95">
//                   <span className="material-symbols-outlined">grid_view</span> View all {studio.images?.length || 0} photos
//                 </button>
//               </div>
//             </div>
//           </section>

//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
//             {/* Main Content Left */}
//             <div className="md:col-span-7 lg:col-span-8 space-y-24">
//               {/* Studio Story & Vibe */}
//               <section>
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
//                   <span className="font-label-bold uppercase tracking-[0.2em] text-[#424937]">The Vibe</span>
//                   <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
//                 </div>
//                 <div className="mb-12">
//                   <h2 className="text-[32px] font-headline-lg mb-6">Industrial Brutalist meets High-Fashion.</h2>
//                   <p className="text-lg text-[#424937] leading-relaxed max-w-2xl mb-8">
//                     {studio.description || 'A beautiful creative space ready for your next project. Designed for high-end editorial shoots, cinematic productions, and immersive brand activations.'}
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {studio.amenities && studio.amenities.slice(0, 5).map((item) => (
//                       <span key={item} className="bg-[#e7e8e9] px-4 py-2 rounded-full font-label-bold text-xs uppercase">
//                         {item}
//                       </span>
//                     ))}
//                     <span className="bg-[#e7e8e9] px-4 py-2 rounded-full font-label-bold text-xs uppercase">Premium Space</span>
//                   </div>
//                 </div>
//               </section>

//               {/* Equipment & Amenities */}
//               <section>
//                 <h2 className="text-[32px] font-headline-lg mb-8">Gear & Essentials</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   {studio.amenities && studio.amenities.map((item) => (
//                     <div key={item} className="flex items-start gap-4 p-6 bg-[#f3f4f5] rounded-2xl border border-[#c2c9b1]/10 hover:border-[#446900]/30 transition-all group">
//                       <span className="material-symbols-outlined text-[#446900] bg-[#beff5f] p-3 rounded-xl group-hover:scale-110 transition-transform">
//                         check_box_outline_blank
//                       </span>
//                       <div>
//                         <h4 className="font-label-bold mb-1">{item}</h4>
//                         <p className="text-sm text-[#424937]">Professional grade equipment included.</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Host Profile & Reviews */}
//               <section className="p-8 md:p-12 rounded-3xl bg-[#e4d7fd]/30 border border-[#e4d7fd]">
//                 <div className="flex flex-col md:flex-row gap-8 items-start">
//                   <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 ring-4 ring-white shadow-xl">
//                     <div className="w-full h-full bg-[#446900] flex items-center justify-center text-white text-3xl font-bold">
//                       {ownerName.charAt(0) || 'S'}
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <h2 className="text-[32px] font-headline-lg">Hosted by {ownerName || 'Studio Owner'}</h2>
//                     <p className="text-base text-[#424937]">Creative Director & Curator. Dedicated to ensuring every creator has the tools and atmosphere needed to excel.</p>
//                     <div className="flex gap-4">
//                       <button className="bg-[#191c1d] text-[#f8f9fa] px-6 py-2.5 rounded-full font-label-bold text-sm hover:opacity-90 transition-opacity">
//                         Contact Host
//                       </button>
//                       <div className="flex items-center gap-2 text-[#424937] font-label-bold">
//                         <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Identity Verified
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-12 space-y-8">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-1 text-[#446900]">
//                         <StarIcon className="w-5 h-5 fill-current" />
//                         <StarIcon className="w-5 h-5 fill-current" />
//                         <StarIcon className="w-5 h-5 fill-current" />
//                         <StarIcon className="w-5 h-5 fill-current" />
//                         <StarIcon className="w-5 h-5 fill-current" />
//                       </div>
//                       <p className="text-base italic">"The lighting in this space is unreal. We didn't even need our secondary rig for the first half of the shoot."</p>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-[#e1e3e4]"></div>
//                         <span className="font-label-bold text-xs uppercase">Marcus T., Vogue Italia</span>
//                       </div>
//                     </div>
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-1 text-[#446900]">
//                         <StarIcon className="w-5 h-5 fill-current" />
//                         <StarIcon className="w-5 h-5 fill-current" />
//                         <StarIcon className="w-5 h-5 fill-current" />
//                         <StarIcon className="w-5 h-5 fill-current" />
//                         <StarIcon className="w-5 h-5 fill-current" />
//                       </div>
//                       <p className="text-base italic">"Incredible textures. The brick and concrete mix is perfect for streetwear looks. Efficient load-in and great coffee nearby!"</p>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-[#e1e3e4]"></div>
//                         <span className="font-label-bold text-xs uppercase">Sarah L., Creative Agency</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Location Map */}
//               <section>
//                 <div className="flex items-center justify-between mb-8">
//                   <h2 className="text-[32px] font-headline-lg">Where you'll be</h2>
//                   <span className="font-label-bold text-[#446900]">{studio.city}, {studio.state}</span>
//                 </div>
//                 <div className="w-full h-96 rounded-3xl overflow-hidden shadow-inner grayscale contrast-125 border border-[#c2c9b1] relative group">
//                   <div className="absolute inset-0 bg-[#446900]/5 pointer-events-none z-10"></div>
//                   <div className="w-full h-full bg-[#edeeef] flex items-center justify-center">
//                     <div className="text-center">
//                       <MapPinIcon className="w-12 h-12 text-[#446900] mx-auto mb-2" />
//                       <p className="text-[#424937]">{formatLocation()}</p>
//                     </div>
//                   </div>
//                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
//                     <div className="w-12 h-12 bg-[#beff5f] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
//                       <span className="material-symbols-outlined text-[#111f00] font-bold">location_on</span>
//                     </div>
//                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#446900]/20 rounded-full animate-ping"></div>
//                   </div>
//                 </div>
//                 <p className="mt-6 text-base text-[#424937]">Located in the heart of the creative hub. Walking distance from major stations. Surrounded by world-class coffee shops and supply stores.</p>
//               </section>
//             </div>

//             {/* Sticky Booking Sidebar */}
//             <aside className="md:col-span-5 lg:col-span-4">
//               <div className="sticky top-28 space-y-6">
//                 <div className="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_20px_40px_-15px_rgba(99,89,121,0.1)] p-8 rounded-[32px]">
//                   <div className="flex justify-between items-end mb-8">
//                     <div>
//                       <span className="text-[#424937] font-label-bold text-xs uppercase tracking-widest block mb-1">Starting from</span>
//                       <div className="flex items-baseline gap-1">
//                         <span className="text-3xl font-extrabold">{formatPrice(studio.hourly_rate)}</span>
//                         <span className="text-[#424937]">/ hour</span>
//                       </div>
//                     </div>
//                     <div className="bg-[#beff5f] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">Top Rated</div>
//                   </div>

//                   <div className="space-y-4 mb-8">
//                     <div className="grid grid-cols-1 gap-2">
//                       <label className="font-label-bold text-xs uppercase text-[#424937] ml-2">Date</label>
//                       <div className="relative">
//                         <input 
//                           type="date" 
//                           value={date}
//                           onChange={(e) => setDate(e.target.value)}
//                           className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#beff5f] transition-all outline-none"
//                         />
//                         <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#424937] pointer-events-none">calendar_today</span>
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <label className="font-label-bold text-xs uppercase text-[#424937] ml-2">Start</label>
//                         <select className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#beff5f] appearance-none outline-none">
//                           <option>09:00 AM</option>
//                           <option>10:00 AM</option>
//                           <option>11:00 AM</option>
//                         </select>
//                       </div>
//                       <div className="space-y-2">
//                         <label className="font-label-bold text-xs uppercase text-[#424937] ml-2">End</label>
//                         <select className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#beff5f] appearance-none outline-none">
//                           <option>01:00 PM</option>
//                           <option>02:00 PM</option>
//                           <option>03:00 PM</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-3 mb-8 border-t border-[#c2c9b1]/20 pt-6">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-[#424937]">${studio.hourly_rate} x 4 hours</span>
//                       <span>${studio.hourly_rate * 4}</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-[#424937]">Cleaning Fee</span>
//                       <span>$45</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-[#424937]">ManyRooms Service Fee</span>
//                       <span>$32</span>
//                     </div>
//                     <div className="flex justify-between font-bold text-lg pt-2">
//                       <span>Total</span>
//                       <span className="text-[#446900]">${studio.hourly_rate * 4 + 77}</span>
//                     </div>
//                   </div>

//                   <button className="w-full bg-[#beff5f] text-[#111f00] font-display-sm text-lg py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-[0_10px_30px_-5px_rgba(190,255,95,0.4)] active:scale-95">
//                     Request to Book
//                   </button>
//                   <p className="text-center text-[10px] text-[#424937] mt-4 uppercase font-label-bold tracking-tighter">You won't be charged yet</p>
//                 </div>

//                 <div className="bg-[#edeeef] p-6 rounded-[24px] flex items-center gap-4">
//                   <span className="material-symbols-outlined text-[#446900] text-3xl">verified_user</span>
//                   <div className="text-xs">
//                     <p className="font-bold mb-1">ManyRooms Protection</p>
//                     <p className="text-[#424937]">Every booking includes damage protection and host liability insurance.</p>
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           </div>

//           {/* You may also love section */}
//           {relatedStudios.length > 0 && (
//             <div className="mt-24">
//               <div className="flex items-center justify-between mb-8">
//                 <h3 className="text-[32px] font-headline-lg">You may also love</h3>
//                 <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-[#191c1d]/20 pb-1 hover:opacity-60 transition-opacity flex items-center gap-1">
//                   VIEW ALL <ArrowRightIcon className="w-3 h-3" />
//                 </Link>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {relatedStudios.map((s) => (
//                   <Link key={s.id} href={`/spaces/${s.id}`} className="group">
//                     <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
//                       {s.images && s.images[0] ? (
//                         <img
//                           src={s.images[0]}
//                           alt={s.name}
//                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                           <PhotoIcon className="w-12 h-12 text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-widest text-[#424937]">{s.city}, {s.state}</p>
//                         <h4 className="text-xl font-bold mt-1 group-hover:opacity-70 transition-opacity">{s.name}</h4>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[10px] uppercase tracking-widest text-[#424937]">From</p>
//                         <p className="text-lg font-medium">{formatPrice(s.hourly_rate)}</p>
//                         <p className="text-[10px] text-[#424937]">/ hour</p>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* FAQ Section */}
//           <div className="mt-24 pt-12 border-t border-[#c2c9b1]/10">
//             <h3 className="text-[32px] font-headline-lg mb-8">Frequently Asked</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {[
//                 { q: "What's included in the hire fee?", a: "All standard equipment listed in the amenities section. Additional production support can be arranged separately." },
//                 { q: "Can I view the space before booking?", a: "Yes, viewing requests can be arranged with the host. Please mention this in your enquiry." },
//                 { q: "What's your cancellation policy?", a: "Cancellations made 48+ hours before booking are fully refundable." },
//                 { q: "Do you offer production support?", a: "Yes, experienced crew and equipment hire can be arranged upon request." }
//               ].map((faq) => (
//                 <div key={faq.q}>
//                   <p className="font-bold mb-2">{faq.q}</p>
//                   <p className="text-sm text-[#424937]">{faq.a}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>

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
// import { useParams } from 'next/navigation';
// import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, UsersIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   location: string;
//   city: string;
//   area: string;
//   description: string;
//   longDescription: string;
//   pricePerHour: number;
//   minHours: number;
//   capacity: number;
//   floorArea: string;
//   amenities: string[];
//   useCases: string[];
//   images: string[];
//   availability: string;
//   rating: number;
//   reviews: number;
// }

// // In a real app, this would come from a database
// const getStudioData = (id: string): Studio | null => {
//   const studios: Record<string, Studio> = {
//     'atelier-marais': {
//       id: 'atelier-marais',
//       name: 'Atelier Marais',
//       location: 'Paris • Le Marais',
//       city: 'Paris',
//       area: 'Le Marais',
//       description: 'Warm Haussmannian apartment with terracotta tones and tall windows.',
//       longDescription: 'An intimate apartment-style location in the heart of Le Marais. Ochre walls, vintage Scandinavian furniture and tall industrial windows make this an editorial favourite for warm, lived-in storytelling.',
//       pricePerHour: 320,
//       minHours: 4,
//       capacity: 12,
//       floorArea: '980 sq ft',
//       amenities: ['Natural light', 'Kitchen', 'Wi-Fi'],
//       useCases: ['Editorial', 'Interiors', 'Lifestyle film', 'Lookbook'],
//       images: [
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq',
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuBvvDxan6ygQqPl_Dhs9Usx_F94qKvzJRQrP-lsB2UyU2zRDRBwGfWtWthQRfSJ2P82FmYUK8_AYoW7NaxTXV8J4dY0L2QhM1JqwUgkGVkL7YhWLmCtpO_1tGpRhq0bHqMxJ6tZk9pU9pU9pU9pU9pU',
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuCNhE3lE1X4w3rL7bJqF6qI5pZkL0sK1jD8fG9hH2jK3lL4zZ5xX6cC7vV8bB9nN0mM',
//       ],
//       availability: 'Available this week',
//       rating: 4.9,
//       reviews: 48,
//     },
//     'arch-house': {
//       id: 'arch-house',
//       name: 'The Arch House',
//       location: 'London • Shoreditch',
//       city: 'London',
//       area: 'Shoreditch',
//       description: 'Vaulted natural-light studio with arched windows and warm oak floors.',
//       longDescription: 'A stunning vaulted studio space with original arched windows and warm oak flooring. Perfect for editorial shoots, fashion campaigns, and lifestyle content.',
//       pricePerHour: 280,
//       minHours: 4,
//       capacity: 20,
//       floorArea: '1200 sq ft',
//       amenities: ['Natural light', 'High ceilings', 'Cyclorama wall', 'Wi-Fi'],
//       useCases: ['Editorial', 'Fashion', 'Campaign', 'Content day'],
//       images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq'],
//       availability: 'Available this week',
//       rating: 4.9,
//       reviews: 124,
//     },
//     'listening-room': {
//       id: 'listening-room',
//       name: 'The Listening Room',
//       location: 'London • Mayfair',
//       city: 'London',
//       area: 'Mayfair',
//       description: 'Walnut-panelled podcast suite with broadcast-grade acoustics.',
//       longDescription: 'A dedicated podcast and recording suite with walnut panelling and broadcast-grade acoustics. Ideal for interviews, voice-overs, and audio production.',
//       pricePerHour: 180,
//       minHours: 2,
//       capacity: 6,
//       floorArea: '450 sq ft',
//       amenities: ['Broadcast mic', 'Acoustic treatment', 'Soundproofing', 'Wi-Fi'],
//       useCases: ['Podcast', 'Voice-over', 'Interview', 'Audio production'],
//       images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC3uo9sJREVsvu55f7nYUN4U39aW_z8KVHJogKwCcF74e4qO3um1Vm8L0GNdnC-7qad2ww2ddmQ_NyD4jxu53Urbe728k136lK_MylNvq6GgTep-4C-bErsAl8krw_FjL78x1a4dEfs6e1h6HOMXjZ2sj0AGRr_708J4LzQujsrKe-gtw3ZQrXb1uffQnvMMOsr7bx8QQHvHe9a-G6QRNQ9ffp1z28Z6IGZ-EDJoN6Ej9ecKRdg96wxQWY_5eLsQmE1ID3wQFC90aBW'],
//       availability: 'Available this week',
//       rating: 4.8,
//       reviews: 67,
//     },
//     'skyline-suite': {
//       id: 'skyline-suite',
//       name: 'Skyline Suite',
//       location: 'Dubai • Downtown',
//       city: 'Dubai',
//       area: 'Downtown',
//       description: 'Minimal penthouse content space with marble floors and 270° views.',
//       longDescription: 'A breathtaking penthouse studio with marble floors and panoramic city views. Designed for luxury content, lookbooks, and high-end productions.',
//       pricePerHour: 540,
//       minHours: 3,
//       capacity: 15,
//       floorArea: '1500 sq ft',
//       amenities: ['Marble floors', 'Floor-to-ceiling windows', 'Skyline views', 'Wi-Fi'],
//       useCases: ['Luxury editorial', 'Lookbook', 'Campaign', 'Content day'],
//       images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDd2EelDPKVJ7xPXWWjsxwfWBr7ckj1_BbhrkhbAcoZsZ-G_AmImWhGW7Q_0nA4NaXl8xLOntklDIQ3BX1QUwjgaItBwbl2FQ416yEBPCSdZtmpDrmaB03yMXu2E0bGrl9bovp8DAaPrL5NawayEECeqWxrdT5_pd8nGO_JrlKl7pMUkoUiyvyawmiPzkjBSKpxMZ9xBDVVCufHtyvQkHo01_sq9H2N746US0KF1WOWxeZrNSIweyt_NCapBxLOOe98-vfR3GpY7baK'],
//       availability: 'Available this week',
//       rating: 4.9,
//       reviews: 89,
//     },
//   };

//   return studios[id] || null;
// };

// // Related studios
// const getRelatedStudios = (currentId: string, city: string) => {
//   const allStudios = [
//     { id: 'arch-house', name: 'The Arch House', location: 'London • Shoreditch', price: 280, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq' },
//     { id: 'listening-room', name: 'The Listening Room', location: 'London • Mayfair', price: 180, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3uo9sJREVsvu55f7nYUN4U39aW_z8KVHJogKwCcF74e4qO3um1Vm8L0GNdnC-7qad2ww2ddmQ_NyD4jxu53Urbe728k136lK_MylNvq6GgTep-4C-bErsAl8krw_FjL78x1a4dEfs6e1h6HOMXjZ2sj0AGRr_708J4LzQujsrKe-gtw3ZQrXb1uffQnvMMOsr7bx8QQHvHe9a-G6QRNQ9ffp1z28Z6IGZ-EDJoN6Ej9ecKRdg96wxQWY_5eLsQmE1ID3wQFC90aBW' },
//     { id: 'skyline-suite', name: 'Skyline Suite', location: 'Dubai • Downtown', price: 540, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd2EelDPKVJ7xPXWWjsxwfWBr7ckj1_BbhrkhbAcoZsZ-G_AmImWhGW7Q_0nA4NaXl8xLOntklDIQ3BX1QUwjgaItBwbl2FQ416yEBPCSdZtmpDrmaB03yMXu2E0bGrl9bovp8DAaPrL5NawayEECeqWxrdT5_pd8nGO_JrlKl7pMUkoUiyvyawmiPzkjBSKpxMZ9xBDVVCufHtyvQkHo01_sq9H2N746US0KF1WOWxeZrNSIweyt_NCapBxLOOe98-vfR3GpY7baK' },
//   ];
  
//   return allStudios.filter(s => s.id !== currentId && (city === 'Paris' ? s.location.includes('London') || s.location.includes('Dubai') : s.location.includes(city) || s.location.includes('Paris'))).slice(0, 3);
// };

// export default function StudioDetailPage() {
//   const params = useParams();
//   const id = params.id as string;
//   const studio = getStudioData(id);
//   const [date, setDate] = useState('');
//   const [guests, setGuests] = useState(4);
//   const [brief, setBrief] = useState('');
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   if (!studio) {
//     return (
//       <div className="min-h-screen bg-brand-light flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-serif mb-4">Studio not found</h1>
//           <Link href="/" className="text-brand-dark underline">Return to home</Link>
//         </div>
//       </div>
//     );
//   }

//   const relatedStudios = getRelatedStudios(id, studio.city);

//   return (
//     <div className="home-page min-h-screen bg-brand-light text-brand-dark">
//       {/* Navigation */}
//       <nav className="sticky top-0 w-full z-50 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
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

//       <div className="container mx-auto px-6 py-12">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-xs text-brand-dark/50 mb-8">
//           <Link href="/" className="hover:text-brand-dark">Home</Link>
//           <span>/</span>
//           <Link href="/spaces" className="hover:text-brand-dark">Spaces</Link>
//           <span>/</span>
//           <span className="text-brand-dark">{studio.city}</span>
//           <span>/</span>
//           <span className="text-brand-dark font-medium">{studio.area}</span>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
//           {/* Left Column - Image Gallery */}
//           <div>
//             <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
//               <Image
//                 src={studio.images[0]}
//                 alt={studio.name}
//                 className="w-full h-full object-cover"
//                 width={800}
//                 height={1000}
//               />
//               {/* Image navigation dots */}
//               {studio.images.length > 1 && (
//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//                   {studio.images.map((_, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => setCurrentImageIndex(idx)}
//                       className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-4' : 'bg-white/50'}`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//             {/* Thumbnails */}
//             {studio.images.length > 1 && (
//               <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
//                 {studio.images.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentImageIndex(idx)}
//                     className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${currentImageIndex === idx ? 'border-brand-dark' : 'border-transparent opacity-60 hover:opacity-100'}`}
//                   >
//                     <Image src={img} alt={`${studio.name} view ${idx + 1}`} width={80} height={80} className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right Column - Studio Info & Booking */}
//           <div>
//             {/* Location badge */}
//             <div className="text-[10px] uppercase tracking-widest text-brand-dark/50 mb-2">SPACES/{studio.city}</div>
//             <h1 className="text-4xl md:text-5xl font-serif mb-2">{studio.area}</h1>
//             <h2 className="text-3xl font-serif mb-4">{studio.name}</h2>
            
//             {/* Description */}
//             <p className="text-brand-dark/60 leading-relaxed mb-6">{studio.longDescription}</p>

//             {/* Availability badge */}
//             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mb-8">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
//               {studio.availability}
//             </div>

//             {/* Specs grid */}
//             <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-brand-dark/10">
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">CAPACITY</p>
//                 <p className="text-lg font-medium">{studio.capacity} people</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">FLOOR AREA</p>
//                 <p className="text-lg font-medium">{studio.floorArea}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">LOCATION</p>
//                 <p className="text-lg font-medium">{studio.area}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">RATING</p>
//                 <div className="flex items-center gap-1">
//                   <span className="text-yellow-500">★</span>
//                   <span className="font-medium">{studio.rating}</span>
//                   <span className="text-brand-dark/40 text-sm">({studio.reviews} reviews)</span>
//                 </div>
//               </div>
//             </div>

//             {/* Amenities */}
//             <div className="mb-8">
//               <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-3">AMENITIES</p>
//               <div className="flex flex-wrap gap-2">
//                 {studio.amenities.map((item) => (
//                   <span key={item} className="text-xs border border-brand-dark/10 px-3 py-1.5 rounded-full">{item}</span>
//                 ))}
//               </div>
//             </div>

//             {/* Use Cases */}
//             <div className="mb-8">
//               <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-3">USE CASES</p>
//               <div className="flex flex-wrap gap-2">
//                 {studio.useCases.map((useCase) => (
//                   <span key={useCase} className="text-xs text-brand-dark/60">{useCase}</span>
//                 ))}
//               </div>
//             </div>

//             {/* Booking Form */}
//             <div className="bg-brand-light border border-brand-dark/10 rounded-2xl p-6">
//               <div className="flex items-baseline justify-between mb-6">
//                 <div>
//                   <span className="text-3xl font-serif">£{studio.pricePerHour}</span>
//                   <span className="text-brand-dark/60"> / hour</span>
//                   <p className="text-xs text-brand-dark/50 mt-1">{studio.minHours} hour minimum</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">DATE</label>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="w-full border border-brand-dark/20 rounded-lg px-4 py-3 text-sm focus:border-brand-dark focus:ring-0 outline-none bg-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">GUESTS</label>
//                   <div className="flex items-center gap-4">
//                     <button
//                       onClick={() => setGuests(Math.max(1, guests - 1))}
//                       className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors"
//                     >-</button>
//                     <span className="text-lg font-medium w-8 text-center">{guests}</span>
//                     <button
//                       onClick={() => setGuests(Math.min(studio.capacity, guests + 1))}
//                       className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors"
//                     >+</button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">TELL US ABOUT YOUR SHOOT</label>
//                   <textarea
//                     value={brief}
//                     onChange={(e) => setBrief(e.target.value)}
//                     rows={3}
//                     placeholder="Brief, dates, mood, references..."
//                     className="w-full border border-brand-dark/20 rounded-lg px-4 py-3 text-sm focus:border-brand-dark focus:ring-0 outline-none bg-transparent resize-none"
//                   />
//                 </div>

//                 <button className="w-full bg-brand-dark text-white py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all">
//                   SEND ENQUIRY
//                 </button>
//                 <p className="text-center text-xs text-brand-dark/50 mt-3">Typical response within 2 hours</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* You may also love section */}
//         {relatedStudios.length > 0 && (
//           <div className="mt-24">
//             <div className="flex items-center justify-between mb-8">
//               <h3 className="text-2xl font-serif">You may also love</h3>
//               <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-brand-dark/20 pb-1 hover:opacity-60 transition-opacity flex items-center gap-1">
//                 VIEW ALL <ArrowRightIcon className="w-3 h-3" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {relatedStudios.map((studio) => (
//                 <Link key={studio.id} href={`/spaces/${studio.id}`} className="group">
//                   <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
//                     <Image
//                       src={studio.image}
//                       alt={studio.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                       width={400}
//                       height={500}
//                     />
//                   </div>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-widest text-brand-dark/50">{studio.location}</p>
//                       <h4 className="text-xl font-serif mt-1 group-hover:opacity-70 transition-opacity">{studio.name}</h4>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-[10px] uppercase tracking-widest text-brand-dark/50">From</p>
//                       <p className="text-lg font-medium">£{studio.price}</p>
//                       <p className="text-[10px] text-brand-dark/40">/ hour</p>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* FAQ Section */}
//         <div className="mt-24 pt-12 border-t border-brand-dark/10">
//           <h3 className="text-2xl font-serif mb-8">Frequently Asked</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {[
//               { q: "What's included in the hire fee?", a: "All standard equipment listed in the amenities section. Additional production support can be arranged separately." },
//               { q: "Can I view the space before booking?", a: "Yes, viewing requests can be arranged with the host. Please mention this in your enquiry." },
//               { q: "What's your cancellation policy?", a: "Cancellations made 48+ hours before booking are fully refundable." },
//               { q: "Do you offer production support?", a: "Yes, experienced crew and equipment hire can be arranged upon request." }
//             ].map((faq) => (
//               <div key={faq.q}>
//                 <p className="font-medium mb-2">{faq.q}</p>
//                 <p className="text-sm text-brand-dark/60">{faq.a}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//                     {/* Footer */}
//               <Footer />
        
//               {/* Chatbot */}
//               <Chatbot />
//     </div>
//   );
// }


// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useParams } from 'next/navigation';
// import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, UsersIcon, ArrowRightIcon, PhotoIcon } from '@heroicons/react/24/outline';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   location: string;
//   city: string;
//   area: string;
//   description: string;
//   longDescription: string;
//   pricePerHour: number;
//   minHours: number;
//   capacity: number;
//   floorArea: string;
//   amenities: string[];
//   useCases: string[];
//   images: string[];
//   availability: string;
//   rating: number;
//   reviews: number;
// }

// // In a real app, this would come from a database
// const getStudioData = (id: string): Studio | null => {
//   const studios: Record<string, Studio> = {
//     'atelier-marais': {
//       id: 'atelier-marais',
//       name: 'Atelier Marais',
//       location: 'Paris • Le Marais',
//       city: 'Paris',
//       area: 'Le Marais',
//       description: 'Warm Haussmannian apartment with terracotta tones and tall windows.',
//       longDescription: 'An intimate apartment-style location in the heart of Le Marais. Ochre walls, vintage Scandinavian furniture and tall industrial windows make this an editorial favourite for warm, lived-in storytelling.',
//       pricePerHour: 320,
//       minHours: 4,
//       capacity: 12,
//       floorArea: '980 sq ft',
//       amenities: ['Natural light', 'Kitchen', 'Wi-Fi'],
//       useCases: ['Editorial', 'Interiors', 'Lifestyle film', 'Lookbook'],
//       images: [
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq',
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuBvvDxan6ygQqPl_Dhs9Usx_F94qKvzJRQrP-lsB2UyU2zRDRBwGfWtWthQRfSJ2P82FmYUK8_AYoW7NaxTXV8J4dY0L2QhM1JqwUgkGVkL7YhWLmCtpO_1tGpRhq0bHqMxJ6tZk9pU9pU9pU9pU9pU',
//         'https://lh3.googleusercontent.com/aida-public/AB6AXuCNhE3lE1X4w3rL7bJqF6qI5pZkL0sK1jD8fG9hH2jK3lL4zZ5xX6cC7vV8bB9nN0mM',
//       ],
//       availability: 'Available this week',
//       rating: 4.9,
//       reviews: 48,
//     },
//     'arch-house': {
//       id: 'arch-house',
//       name: 'The Arch House',
//       location: 'London • Shoreditch',
//       city: 'London',
//       area: 'Shoreditch',
//       description: 'Vaulted natural-light studio with arched windows and warm oak floors.',
//       longDescription: 'A stunning vaulted studio space with original arched windows and warm oak flooring. Perfect for editorial shoots, fashion campaigns, and lifestyle content.',
//       pricePerHour: 280,
//       minHours: 4,
//       capacity: 20,
//       floorArea: '1200 sq ft',
//       amenities: ['Natural light', 'High ceilings', 'Cyclorama wall', 'Wi-Fi'],
//       useCases: ['Editorial', 'Fashion', 'Campaign', 'Content day'],
//       images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq'],
//       availability: 'Available this week',
//       rating: 4.9,
//       reviews: 124,
//     },
//     'listening-room': {
//       id: 'listening-room',
//       name: 'The Listening Room',
//       location: 'London • Mayfair',
//       city: 'London',
//       area: 'Mayfair',
//       description: 'Walnut-panelled podcast suite with broadcast-grade acoustics.',
//       longDescription: 'A dedicated podcast and recording suite with walnut panelling and broadcast-grade acoustics. Ideal for interviews, voice-overs, and audio production.',
//       pricePerHour: 180,
//       minHours: 2,
//       capacity: 6,
//       floorArea: '450 sq ft',
//       amenities: ['Broadcast mic', 'Acoustic treatment', 'Soundproofing', 'Wi-Fi'],
//       useCases: ['Podcast', 'Voice-over', 'Interview', 'Audio production'],
//       images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC3uo9sJREVsvu55f7nYUN4U39aW_z8KVHJogKwCcF74e4qO3um1Vm8L0GNdnC-7qad2ww2ddmQ_NyD4jxu53Urbe728k136lK_MylNvq6GgTep-4C-bErsAl8krw_FjL78x1a4dEfs6e1h6HOMXjZ2sj0AGRr_708J4LzQujsrKe-gtw3ZQrXb1uffQnvMMOsr7bx8QQHvHe9a-G6QRNQ9ffp1z28Z6IGZ-EDJoN6Ej9ecKRdg96wxQWY_5eLsQmE1ID3wQFC90aBW'],
//       availability: 'Available this week',
//       rating: 4.8,
//       reviews: 67,
//     },
//     'skyline-suite': {
//       id: 'skyline-suite',
//       name: 'Skyline Suite',
//       location: 'Dubai • Downtown',
//       city: 'Dubai',
//       area: 'Downtown',
//       description: 'Minimal penthouse content space with marble floors and 270° views.',
//       longDescription: 'A breathtaking penthouse studio with marble floors and panoramic city views. Designed for luxury content, lookbooks, and high-end productions.',
//       pricePerHour: 540,
//       minHours: 3,
//       capacity: 15,
//       floorArea: '1500 sq ft',
//       amenities: ['Marble floors', 'Floor-to-ceiling windows', 'Skyline views', 'Wi-Fi'],
//       useCases: ['Luxury editorial', 'Lookbook', 'Campaign', 'Content day'],
//       images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDd2EelDPKVJ7xPXWWjsxwfWBr7ckj1_BbhrkhbAcoZsZ-G_AmImWhGW7Q_0nA4NaXl8xLOntklDIQ3BX1QUwjgaItBwbl2FQ416yEBPCSdZtmpDrmaB03yMXu2E0bGrl9bovp8DAaPrL5NawayEECeqWxrdT5_pd8nGO_JrlKl7pMUkoUiyvyawmiPzkjBSKpxMZ9xBDVVCufHtyvQkHo01_sq9H2N746US0KF1WOWxeZrNSIweyt_NCapBxLOOe98-vfR3GpY7baK'],
//       availability: 'Available this week',
//       rating: 4.9,
//       reviews: 89,
//     },
//   };

//   return studios[id] || null;
// };

// // Related studios
// const getRelatedStudios = (currentId: string, city: string) => {
//   const allStudios = [
//     { id: 'arch-house', name: 'The Arch House', location: 'London • Shoreditch', price: 280, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq' },
//     { id: 'listening-room', name: 'The Listening Room', location: 'London • Mayfair', price: 180, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3uo9sJREVsvu55f7nYUN4U39aW_z8KVHJogKwCcF74e4qO3um1Vm8L0GNdnC-7qad2ww2ddmQ_NyD4jxu53Urbe728k136lK_MylNvq6GgTep-4C-bErsAl8krw_FjL78x1a4dEfs6e1h6HOMXjZ2sj0AGRr_708J4LzQujsrKe-gtw3ZQrXb1uffQnvMMOsr7bx8QQHvHe9a-G6QRNQ9ffp1z28Z6IGZ-EDJoN6Ej9ecKRdg96wxQWY_5eLsQmE1ID3wQFC90aBW' },
//     { id: 'skyline-suite', name: 'Skyline Suite', location: 'Dubai • Downtown', price: 540, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd2EelDPKVJ7xPXWWjsxwfWBr7ckj1_BbhrkhbAcoZsZ-G_AmImWhGW7Q_0nA4NaXl8xLOntklDIQ3BX1QUwjgaItBwbl2FQ416yEBPCSdZtmpDrmaB03yMXu2E0bGrl9bovp8DAaPrL5NawayEECeqWxrdT5_pd8nGO_JrlKl7pMUkoUiyvyawmiPzkjBSKpxMZ9xBDVVCufHtyvQkHo01_sq9H2N746US0KF1WOWxeZrNSIweyt_NCapBxLOOe98-vfR3GpY7baK' },
//   ];
  
//   return allStudios.filter(s => s.id !== currentId && (city === 'Paris' ? s.location.includes('London') || s.location.includes('Dubai') : s.location.includes(city) || s.location.includes('Paris'))).slice(0, 3);
// };

// export default function StudioDetailPage() {
//   const params = useParams();
//   const id = params.id as string;
//   const studio = getStudioData(id);
//   const [date, setDate] = useState('');
//   const [guests, setGuests] = useState(4);
//   const [brief, setBrief] = useState('');
//   const [selectedImage, setSelectedImage] = useState(0);

//   if (!studio) {
//     return (
//       <div className="min-h-screen bg-brand-light flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-serif mb-4">Studio not found</h1>
//           <Link href="/" className="text-brand-dark underline">Return to home</Link>
//         </div>
//       </div>
//     );
//   }

//   const relatedStudios = getRelatedStudios(id, studio.city);
  
//   // Get images: main image, then two smaller images (fill with placeholders if needed)
//   const mainImage = studio.images[0] || '';
//   const smallImage1 = studio.images[1] || '';
//   const smallImage2 = studio.images[2] || '';

//   return (
//     <div className="home-page min-h-screen bg-brand-light text-brand-dark">
//       {/* Navigation */}
//       <nav className="sticky top-0 w-full z-50 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
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

//       <div className="container mx-auto px-6 py-12">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-xs text-brand-dark/50 mb-8">
//           <Link href="/" className="hover:text-brand-dark">Home</Link>
//           <span>/</span>
//           <Link href="/spaces" className="hover:text-brand-dark">Spaces</Link>
//           <span>/</span>
//           <span className="text-brand-dark">{studio.city}</span>
//           <span>/</span>
//           <span className="text-brand-dark font-medium">{studio.area}</span>
//         </div>

//         {/* Image Gallery - 2 column layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16">
//           {/* Main Large Image - takes 2/3 of the space */}
//           <div className="lg:col-span-2">
//             <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
//               {mainImage ? (
//                 <Image
//                   src={mainImage}
//                   alt={studio.name}
//                   className="w-full h-full object-cover"
//                   width={800}
//                   height={1000}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                   <PhotoIcon className="w-16 h-16 text-gray-400" />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Two Smaller Images Stacked - takes 1/3 of the space */}
//           <div className="flex flex-col gap-4">
//             {/* Small Image 1 */}
//             <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
//               {smallImage1 ? (
//                 <Image
//                   src={smallImage1}
//                   alt={`${studio.name} view 2`}
//                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//                   width={400}
//                   height={500}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                   <PhotoIcon className="w-12 h-12 text-gray-400" />
//                 </div>
//               )}
//             </div>

//             {/* Small Image 2 */}
//             <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
//               {smallImage2 ? (
//                 <Image
//                   src={smallImage2}
//                   alt={`${studio.name} view 3`}
//                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//                   width={400}
//                   height={500}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                   <PhotoIcon className="w-12 h-12 text-gray-400" />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Studio Info & Booking Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
//           {/* Left Column - Studio Details */}
//           <div>
//             {/* Location badge */}
//             <div className="text-[10px] uppercase tracking-widest text-brand-dark/50 mb-2">SPACES/{studio.city}</div>
//             <h1 className="text-4xl md:text-5xl font-serif mb-2">{studio.area}</h1>
//             <h2 className="text-3xl font-serif mb-4">{studio.name}</h2>
            
//             {/* Description */}
//             <p className="text-brand-dark/60 leading-relaxed mb-6">{studio.longDescription}</p>

//             {/* Availability badge */}
//             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mb-8">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
//               {studio.availability}
//             </div>

//             {/* Specs grid */}
//             <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-brand-dark/10">
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">CAPACITY</p>
//                 <p className="text-lg font-medium">{studio.capacity} people</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">FLOOR AREA</p>
//                 <p className="text-lg font-medium">{studio.floorArea}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">LOCATION</p>
//                 <p className="text-lg font-medium">{studio.area}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">RATING</p>
//                 <div className="flex items-center gap-1">
//                   <span className="text-yellow-500">★</span>
//                   <span className="font-medium">{studio.rating}</span>
//                   <span className="text-brand-dark/40 text-sm">({studio.reviews} reviews)</span>
//                 </div>
//               </div>
//             </div>

//             {/* Amenities */}
//             <div className="mb-8">
//               <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-3">AMENITIES</p>
//               <div className="flex flex-wrap gap-2">
//                 {studio.amenities.map((item) => (
//                   <span key={item} className="text-xs border border-brand-dark/10 px-3 py-1.5 rounded-full">{item}</span>
//                 ))}
//               </div>
//             </div>

//             {/* Use Cases */}
//             <div className="mb-8">
//               <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-3">USE CASES</p>
//               <div className="flex flex-wrap gap-2">
//                 {studio.useCases.map((useCase) => (
//                   <span key={useCase} className="text-xs text-brand-dark/60">{useCase}</span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Booking Form */}
//           <div>
//             <div className="bg-brand-light border border-brand-dark/10 rounded-2xl p-6 sticky top-32">
//               <div className="flex items-baseline justify-between mb-6">
//                 <div>
//                   <span className="text-3xl font-serif">£{studio.pricePerHour}</span>
//                   <span className="text-brand-dark/60"> / hour</span>
//                   <p className="text-xs text-brand-dark/50 mt-1">{studio.minHours} hour minimum</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">DATE</label>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="w-full border border-brand-dark/20 rounded-lg px-4 py-3 text-sm focus:border-brand-dark focus:ring-0 outline-none bg-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">GUESTS</label>
//                   <div className="flex items-center gap-4">
//                     <button
//                       onClick={() => setGuests(Math.max(1, guests - 1))}
//                       className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors"
//                     >-</button>
//                     <span className="text-lg font-medium w-8 text-center">{guests}</span>
//                     <button
//                       onClick={() => setGuests(Math.min(studio.capacity, guests + 1))}
//                       className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors"
//                     >+</button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">TELL US ABOUT YOUR SHOOT</label>
//                   <textarea
//                     value={brief}
//                     onChange={(e) => setBrief(e.target.value)}
//                     rows={3}
//                     placeholder="Brief, dates, mood, references..."
//                     className="w-full border border-brand-dark/20 rounded-lg px-4 py-3 text-sm focus:border-brand-dark focus:ring-0 outline-none bg-transparent resize-none"
//                   />
//                 </div>

//                 <button className="w-full bg-brand-dark text-white py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all">
//                   SEND ENQUIRY
//                 </button>
//                 <p className="text-center text-xs text-brand-dark/50 mt-3">Typical response within 2 hours</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* You may also love section */}
//         {relatedStudios.length > 0 && (
//           <div className="mt-24">
//             <div className="flex items-center justify-between mb-8">
//               <h3 className="text-2xl font-serif">You may also love</h3>
//               <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-brand-dark/20 pb-1 hover:opacity-60 transition-opacity flex items-center gap-1">
//                 VIEW ALL <ArrowRightIcon className="w-3 h-3" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {relatedStudios.map((s) => (
//                 <Link key={s.id} href={`/spaces/${s.id}`} className="group">
//                   <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
//                     <Image
//                       src={s.image}
//                       alt={s.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                       width={400}
//                       height={500}
//                     />
//                   </div>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-widest text-brand-dark/50">{s.location}</p>
//                       <h4 className="text-xl font-serif mt-1 group-hover:opacity-70 transition-opacity">{s.name}</h4>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-[10px] uppercase tracking-widest text-brand-dark/50">From</p>
//                       <p className="text-lg font-medium">£{s.price}</p>
//                       <p className="text-[10px] text-brand-dark/40">/ hour</p>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* FAQ Section */}
//         <div className="mt-24 pt-12 border-t border-brand-dark/10">
//           <h3 className="text-2xl font-serif mb-8">Frequently Asked</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {[
//               { q: "What's included in the hire fee?", a: "All standard equipment listed in the amenities section. Additional production support can be arranged separately." },
//               { q: "Can I view the space before booking?", a: "Yes, viewing requests can be arranged with the host. Please mention this in your enquiry." },
//               { q: "What's your cancellation policy?", a: "Cancellations made 48+ hours before booking are fully refundable." },
//               { q: "Do you offer production support?", a: "Yes, experienced crew and equipment hire can be arranged upon request." }
//             ].map((faq) => (
//               <div key={faq.q}>
//                 <p className="font-medium mb-2">{faq.q}</p>
//                 <p className="text-sm text-brand-dark/60">{faq.a}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

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
// import { useParams } from 'next/navigation';
// import { MapPinIcon, UsersIcon, ArrowRightIcon, PhotoIcon } from '@heroicons/react/24/outline';
// import { supabase } from '@/lib/supabase';
// import Chatbot from '@/components/Chatbot';
// import Footer from '@/components/Footer';

// interface Studio {
//   id: string;
//   name: string;
//   city: string;
//   state: string;
//   country: string;
//   description: string;
//   hourly_rate: number;
//   capacity: number;
//   amenities: string[];
//   images: string[];
//   status: string;
//   created_at: string;
// }

// export default function StudioDetailPage() {
//   const params = useParams();
//   const id = params.id as string;
//   const [studio, setStudio] = useState<Studio | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [date, setDate] = useState('');
//   const [guests, setGuests] = useState(4);
//   const [brief, setBrief] = useState('');
//   const [relatedStudios, setRelatedStudios] = useState<Studio[]>([]);

//   // Fetch studio from Supabase
//   useEffect(() => {
//     if (id) {
//       fetchStudio();
//     }
//   }, [id]);

//   const fetchStudio = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       // Fetch the main studio
//       const { data: studioData, error: studioError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (studioError) throw studioError;
      
//       if (!studioData) {
//         setError('Studio not found');
//         setLoading(false);
//         return;
//       }

//       // Only show approved studios to the public
//       if (studioData.status !== 'approved') {
//         setError('This studio is not yet available for booking');
//         setLoading(false);
//         return;
//       }

//       setStudio(studioData);

//       // Fetch related studios (same city, different id)
//       const { data: relatedData, error: relatedError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('status', 'approved')
//         .eq('city', studioData.city)
//         .neq('id', id)
//         .limit(3);

//       if (!relatedError && relatedData) {
//         setRelatedStudios(relatedData);
//       }

//     } catch (err: any) {
//       console.error('Error fetching studio:', err);
//       setError(err.message || 'Failed to load studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMainImage = () => {
//     if (!studio?.images || studio.images.length === 0) return null;
//     return studio.images[0];
//   };

//   const getSmallImage1 = () => {
//     if (!studio?.images || studio.images.length < 2) return null;
//     return studio.images[1];
//   };

//   const getSmallImage2 = () => {
//     if (!studio?.images || studio.images.length < 3) return null;
//     return studio.images[2];
//   };

//   const formatPrice = (price: number) => {
//     return `£${price}`;
//   };

//   const formatLocation = () => {
//     if (!studio) return '';
//     const parts = [studio.city, studio.state].filter(Boolean);
//     return parts.join(', ');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-brand-light flex items-center justify-center">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-slate-500">Loading studio...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !studio) {
//     return (
//       <div className="min-h-screen bg-brand-light flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-6">
//           <div className="w-20 h-20 mx-auto mb-6 text-slate-400">
//             <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-serif mb-4">{error || 'Studio not found'}</h1>
//           <p className="text-slate-500 mb-8">The studio you're looking for doesn't exist or isn't available yet.</p>
//           <Link href="/spaces" className="inline-block bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all">
//             Browse all spaces
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const mainImage = getMainImage();
//   const smallImage1 = getSmallImage1();
//   const smallImage2 = getSmallImage2();

//   return (
//     <div className="home-page min-h-screen bg-brand-light text-brand-dark">
//       {/* Navigation */}
//       <nav className="sticky top-0 w-full z-50 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
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

//       <div className="container mx-auto px-6 py-12">
//         {/* Breadcrumb */}
//         <div className="flex items-center gap-2 text-xs text-brand-dark/50 mb-8">
//           <Link href="/" className="hover:text-brand-dark">Home</Link>
//           <span>/</span>
//           <Link href="/spaces" className="hover:text-brand-dark">Spaces</Link>
//           <span>/</span>
//           <span className="text-brand-dark font-medium">{studio.name}</span>
//         </div>

//         {/* Image Gallery - 2 column layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16">
//           {/* Main Large Image - takes 2/3 of the space */}
//           <div className="lg:col-span-2">
//             <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
//               {mainImage ? (
//                 <img
//                   src={mainImage}
//                   alt={studio.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                   <PhotoIcon className="w-16 h-16 text-gray-400" />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Two Smaller Images Stacked - takes 1/3 of the space */}
//           <div className="flex flex-col gap-4">
//             {/* Small Image 1 */}
//             <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
//               {smallImage1 ? (
//                 <img
//                   src={smallImage1}
//                   alt={`${studio.name} view 2`}
//                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                   <PhotoIcon className="w-12 h-12 text-gray-400" />
//                 </div>
//               )}
//             </div>

//             {/* Small Image 2 */}
//             <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
//               {smallImage2 ? (
//                 <img
//                   src={smallImage2}
//                   alt={`${studio.name} view 3`}
//                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                   <PhotoIcon className="w-12 h-12 text-gray-400" />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Studio Info & Booking Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
//           {/* Left Column - Studio Details */}
//           <div>
//             {/* Location badge */}
//             <div className="text-[10px] uppercase tracking-widest text-brand-dark/50 mb-2">SPACES/{studio.city || 'Location'}</div>
//             <h1 className="text-4xl md:text-5xl font-serif mb-4">{studio.name}</h1>
            
//             {/* Description */}
//             <p className="text-brand-dark/60 leading-relaxed mb-6">{studio.description || 'A beautiful creative space ready for your next project.'}</p>

//             {/* Availability badge */}
//             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mb-8">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
//               Available for booking
//             </div>

//             {/* Specs grid */}
//             <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-brand-dark/10">
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">CAPACITY</p>
//                 <p className="text-lg font-medium">{studio.capacity || 'N/A'} people</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">LOCATION</p>
//                 <p className="text-lg font-medium">{formatLocation()}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">HOURLY RATE</p>
//                 <p className="text-lg font-medium">{formatPrice(studio.hourly_rate)}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">STATUS</p>
//                 <p className="text-lg font-medium capitalize">{studio.status}</p>
//               </div>
//             </div>

//             {/* Amenities */}
//             {studio.amenities && studio.amenities.length > 0 && (
//               <div className="mb-8">
//                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-3">AMENITIES</p>
//                 <div className="flex flex-wrap gap-2">
//                   {studio.amenities.map((item) => (
//                     <span key={item} className="text-xs border border-brand-dark/10 px-3 py-1.5 rounded-full">{item}</span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Booking Form */}
//           <div>
//             <div className="bg-brand-light border border-brand-dark/10 rounded-2xl p-6 sticky top-32">
//               <div className="flex items-baseline justify-between mb-6">
//                 <div>
//                   <span className="text-3xl font-serif">{formatPrice(studio.hourly_rate)}</span>
//                   <span className="text-brand-dark/60"> / hour</span>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">DATE</label>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="w-full border border-brand-dark/20 rounded-lg px-4 py-3 text-sm focus:border-brand-dark focus:ring-0 outline-none bg-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">GUESTS</label>
//                   <div className="flex items-center gap-4">
//                     <button
//                       onClick={() => setGuests(Math.max(1, guests - 1))}
//                       className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors"
//                     >-</button>
//                     <span className="text-lg font-medium w-8 text-center">{guests}</span>
//                     <button
//                       onClick={() => setGuests(Math.min(studio.capacity || 50, guests + 1))}
//                       className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors"
//                     >+</button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">TELL US ABOUT YOUR SHOOT</label>
//                   <textarea
//                     value={brief}
//                     onChange={(e) => setBrief(e.target.value)}
//                     rows={3}
//                     placeholder="Brief, dates, mood, references..."
//                     className="w-full border border-brand-dark/20 rounded-lg px-4 py-3 text-sm focus:border-brand-dark focus:ring-0 outline-none bg-transparent resize-none"
//                   />
//                 </div>

//                 <button className="w-full bg-brand-dark text-white py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all">
//                   SEND ENQUIRY
//                 </button>
//                 <p className="text-center text-xs text-brand-dark/50 mt-3">Typical response within 2 hours</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* You may also love section */}
//         {relatedStudios.length > 0 && (
//           <div className="mt-24">
//             <div className="flex items-center justify-between mb-8">
//               <h3 className="text-2xl font-serif">You may also love</h3>
//               <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-brand-dark/20 pb-1 hover:opacity-60 transition-opacity flex items-center gap-1">
//                 VIEW ALL <ArrowRightIcon className="w-3 h-3" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {relatedStudios.map((s) => (
//                 <Link key={s.id} href={`/spaces/${s.id}`} className="group">
//                   <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
//                     {s.images && s.images[0] ? (
//                       <img
//                         src={s.images[0]}
//                         alt={s.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                         <PhotoIcon className="w-12 h-12 text-gray-400" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-[10px] uppercase tracking-widest text-brand-dark/50">{s.city}, {s.state}</p>
//                       <h4 className="text-xl font-serif mt-1 group-hover:opacity-70 transition-opacity">{s.name}</h4>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-[10px] uppercase tracking-widest text-brand-dark/50">From</p>
//                       <p className="text-lg font-medium">{formatPrice(s.hourly_rate)}</p>
//                       <p className="text-[10px] text-brand-dark/40">/ hour</p>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* FAQ Section */}
//         <div className="mt-24 pt-12 border-t border-brand-dark/10">
//           <h3 className="text-2xl font-serif mb-8">Frequently Asked</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {[
//               { q: "What's included in the hire fee?", a: "All standard equipment listed in the amenities section. Additional production support can be arranged separately." },
//               { q: "Can I view the space before booking?", a: "Yes, viewing requests can be arranged with the host. Please mention this in your enquiry." },
//               { q: "What's your cancellation policy?", a: "Cancellations made 48+ hours before booking are fully refundable." },
//               { q: "Do you offer production support?", a: "Yes, experienced crew and equipment hire can be arranged upon request." }
//             ].map((faq) => (
//               <div key={faq.q}>
//                 <p className="font-medium mb-2">{faq.q}</p>
//                 <p className="text-sm text-brand-dark/60">{faq.a}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <Footer />
    
//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// }

