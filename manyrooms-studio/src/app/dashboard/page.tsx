// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  HomeIcon,
  DocumentTextIcon,
  BookmarkIcon,
  CalendarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  studio_name: string;
  studio_image: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending';
  location: string;
  people?: number;
}

interface Activity {
  id: string;
  type: 'confirmed' | 'review' | 'payment';
  title: string;
  description: string;
  time: string;
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      studio_name: 'The Concrete Vault',
      studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoXzOzeL2rihFuxd6CSyUVemzA3S-K4l-8SzLE0gMSlUjc63sUuljFeHsANEO-bgEomfJfVfOwqSbw_a127EanyE95KdhNsD0OagjsHIcUbPi44KyQKAPytywUu65KqTJJW06j1gU0NRYmt9QKlR3pb5hGGrlQulNXkmjbI48p-CTYpuRPe4cIorbPKlQFSuu3ueD_Q4uEFT4i3y8mpppPbO02-dQaubNzNgr_VChLMy91eGTa6oBUNPHCWTNky-JeaVF2O5bPP6Yp',
      date: 'Tomorrow',
      time: '10:00 AM',
      status: 'confirmed',
      location: 'Berlin, Kreuzberg',
    },
    {
      id: '2',
      studio_name: 'Flora & Light Studio',
      studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWT2nrPk1HLEYZvsCMXIHx02wFM6qavyDyvAhb4MHl3f31xOliVB8HD_UutIt3Wij3y4Tqm2d6ABCTYdFmuDdAWIn5tXCoTyaELK04ZxrXF_hRaP7OOESgturzykK6_G48E4UlZA-OBDHYZiKjKnUJz-CWoHQb19b1KtgRAD9knRMSLGOWlNcEIpbLrnEKOx7kYXtI61HCZSXSNllnZ5sl-XNoOn2bZqIf_-wplLI-WEFtL916CX1TC1afxxfiJPamL5AEVWRYjEhq',
      date: 'Friday',
      time: '2:00 PM',
      status: 'pending',
      location: 'London, Shoreditch',
      people: 4,
    },
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'confirmed',
      title: 'Booking Confirmed',
      description: 'Your reservation for "The Glass Box" has been accepted.',
      time: '2h ago',
    },
    {
      id: '2',
      type: 'review',
      title: 'New Review',
      description: 'Host "Studio Arches" left you a 5-star review.',
      time: '1d ago',
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Processed',
      description: 'Receipt #MR-8291 has been sent to your email.',
      time: '3d ago',
    },
  ]);

  const [stats] = useState({
    hours_booked: 124,
    creative_spaces: 12,
    vibe_match: 98,
  });

  // Fetch user's enquiries
  useEffect(() => {
    if (user) {
      fetchEnquiries();
    }
  }, [user]);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*, studios(name, city, state)')
        .eq('guest_email', user?.email)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setEnquiries(data);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set greeting
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');

      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      };
      setCurrentTime(now.toLocaleTimeString('en-US', options));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const firstName = user?.user_metadata?.name?.split(' ')[0] || 'Creative';
  const userRole = user?.user_metadata?.role || user?.role || 'client';

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'confirmed':
        return (
          <div className="h-12 w-12 rounded-full bg-primary-container flex items-center justify-center">
            <CheckCircleIcon className="w-6 h-6 text-primary" />
          </div>
        );
      case 'review':
        return (
          <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center">
            <StarIcon className="w-6 h-6 text-secondary" />
          </div>
        );
      case 'payment':
        return (
          <div className="h-12 w-12 rounded-full bg-tertiary-container flex items-center justify-center">
            <CreditCardIcon className="w-6 h-6 text-tertiary" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 space-y-8">
        
        {/* Welcoming Header - Lavender Tint */}
        <header className="relative overflow-hidden rounded-[2rem] p-6 md:p-10" style={{ background: 'linear-gradient(135deg, #e4d7fd 0%, #f8f9fa 100%)' }}>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#424937] uppercase tracking-widest">
                {greeting} • {currentTime}
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#191c1d] tracking-tight">
                Welcome back, <span className="text-[#446900] italic">{firstName}</span>.
              </h1>
              <p className="text-base text-[#424937] max-w-xl">
                Your creative empire is growing. 
                {enquiries.length > 0 
                  ? ` You have ${enquiries.filter(e => e.status === 'pending').length} pending enquiries and ${enquiries.filter(e => e.status === 'approved').length} confirmed bookings.`
                  : ' Start by exploring studios that match your aesthetic.'}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50">
              <div className="text-right">
                <p className="text-xs font-bold text-[#737a65] uppercase">Current Status</p>
                <p className="font-bold text-[#446900] capitalize">{userRole} Member</p>
              </div>
              <div className="h-12 w-12 rounded-full border-2 border-[#beff5f] overflow-hidden bg-[#446900] flex items-center justify-center text-white font-bold text-lg">
                {firstName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Bookings & Activity (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Upcoming Bookings Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#191c1d]">Upcoming Bookings</h2>
                <Link href="/dashboard/bookings" className="text-[#446900] font-bold text-sm hover:underline flex items-center gap-1">
                  View Schedule <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="group relative bg-white rounded-3xl overflow-hidden border border-[#c2c9b1]/20 shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={booking.studio_image}
                        alt={booking.studio_name}
                      />
                      <div className="absolute top-4 left-4 bg-[#beff5f] text-[#111f00] px-3 py-1 rounded-full text-xs font-bold">
                        {booking.date}, {booking.time}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="font-bold text-xl text-[#191c1d]">{booking.studio_name}</h4>
                        <p className="text-[#424937] text-sm">{booking.location}</p>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-[#c2c9b1]/30">
                        {booking.people ? (
                          <span className="text-sm font-medium text-[#424937]">{booking.people} People</span>
                        ) : (
                          <div className="flex -space-x-2">
                            <div className="h-8 w-8 rounded-full border-2 border-white bg-[#e1e3e4]"></div>
                            <div className="h-8 w-8 rounded-full border-2 border-white bg-[#e1e3e4]"></div>
                          </div>
                        )}
                        <button className="text-[#446900] bg-[#beff5f] px-4 py-2 rounded-lg text-sm font-bold hover:scale-105 transition-transform">
                          {booking.status === 'confirmed' ? 'Manage' : 'Check-in'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Enquiries Section */}
            {enquiries.length > 0 && (
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-[#191c1d] mb-6">Your Enquiries</h2>
                <div className="bg-white rounded-[2rem] p-4 shadow-lg border border-[#c2c9b1]/10 overflow-hidden">
                  <div className="divide-y divide-[#c2c9b1]/20">
                    {enquiries.slice(0, 5).map((enquiry) => (
                      <div key={enquiry.id} className="flex items-center gap-4 py-5 px-4 hover:bg-[#f3f4f5] transition-colors rounded-2xl">
                        <div className="h-12 w-12 rounded-full bg-[#e4d7fd] flex items-center justify-center text-[#665c7c] font-bold">
                          {enquiry.studios?.name?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1">
                          <p className="text-[#191c1d] font-bold">
                            {enquiry.studios?.name || 'Studio Enquiry'}
                          </p>
                          <p className="text-[#424937] text-sm">
                            {enquiry.event_date} • {enquiry.guests_count} guests
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          enquiry.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          enquiry.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {enquiry.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Recent Activity Section */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-[#191c1d] mb-6">Recent Activity</h2>
              <div className="bg-white rounded-[2rem] p-4 shadow-lg border border-[#c2c9b1]/10 overflow-hidden">
                <div className="divide-y divide-[#c2c9b1]/20">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 py-5 px-4 hover:bg-[#f3f4f5] transition-colors rounded-2xl group">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-[#191c1d] font-bold">{activity.title}</p>
                        <p className="text-[#424937] text-sm">{activity.description}</p>
                      </div>
                      <span className="text-xs text-[#737a65] font-medium whitespace-nowrap">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Quick Discovery & Stats (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Discovery by Vibes */}
            <section className="bg-[#2e3132] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#446900]/20 blur-3xl"></div>
              <h3 className="text-2xl font-bold mb-6 relative z-10">Find your vibe</h3>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {[
                  { icon: 'square_foot', label: 'Brutalist' },
                  { icon: 'eco', label: 'Organic' },
                  { icon: 'blur_on', label: 'Ethereal' },
                  { icon: 'architecture', label: 'Loft' },
                ].map((vibe) => (
                  <Link
                    key={vibe.label}
                    href={`/spaces?vibe=${vibe.label.toLowerCase()}`}
                    className="flex flex-col items-center gap-3 p-5 bg-white/10 border border-white/10 rounded-3xl hover:bg-[#beff5f] hover:text-[#111f00] transition-all group"
                  >
                    <span className="material-symbols-outlined text-2xl">{vibe.icon}</span>
                    <span className="font-bold text-sm">{vibe.label}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/spaces"
                className="block w-full mt-8 py-4 bg-[#beff5f] text-[#111f00] rounded-full font-bold text-center hover:scale-105 transition-transform"
              >
                Explore All Vibes
              </Link>
            </section>

            {/* Profile Stats */}
            <section className="bg-white rounded-[2rem] p-8 space-y-6 shadow-lg border border-[#c2c9b1]/10">
              <h4 className="text-xs font-bold text-[#737a65] uppercase tracking-wider">Your Momentum</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#424937]">Studio Hours</span>
                  <span className="font-bold text-xl text-[#191c1d]">{stats.hours_booked}h</span>
                </div>
                <div className="w-full bg-[#e1e3e4] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#446900] h-full w-[75%] rounded-full"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#424937]">Creative Spaces</span>
                  <span className="font-bold text-xl text-[#191c1d]">{stats.creative_spaces}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#424937]">Vibe Match</span>
                  <span className="font-bold text-xl text-[#446900]">{stats.vibe_match}%</span>
                </div>
              </div>
            </section>

            {/* Journal Preview Card */}
            <Link href="/journal" className="group relative rounded-[2rem] overflow-hidden h-64 shadow-xl block">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbRIZXQ0wM7iLVStr6IzM9_R6LapTRxK4iprhc4fmCk5BwCkmqq98u2zuFOI-VW9k394IAU4GcDTes-Qp6L2tVtwBcwZNRzzMfpqYkstAy-ISk5aMrxOip-3jMK9ks_oZsOQ0H31WHkHul10i8A1AKVXbP8-Y7x7mOEZQPwVsuWutDdRRYspnhMWIMxFM2KsIz8IxmUkPtGswNzcFCJx1_j_DKonhYGS1fFfHLDgkZx4nR4FHsE3mJDE2ZVlb-Fy_sJdXlK5hJTIHP"
                alt="Journal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <p className="text-[#b5f657] text-xs font-bold uppercase tracking-widest mb-2">The Journal</p>
                <h3 className="text-white font-bold text-xl leading-tight">Mastering Industrial Light: A Guide for Modern Creatives</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import {
//   PlusCircleIcon,
//   ArrowRightIcon,
// } from '@heroicons/react/24/outline';

// // Types
// interface Booking {
//   id: string;
//   studio_name: string;
//   studio_image: string;
//   date: string;
//   start_time: string;
//   end_time: string;
//   status: 'confirmed' | 'pending' | 'cancelled';
//   booking_id: string;
//   studio_location: string;
// }

// interface Recommendation {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
//   price_per_hour: number;
//   match_percentage: number;
//   category: string;
// }

// interface UserStats {
//   hours_booked: number;
//   active_projects: number;
//   credits: number;
// }

// export default function ClientDashboard() {
//   const { user } = useAuth();
//   const [greeting, setGreeting] = useState('');
//   const [currentTime, setCurrentTime] = useState('');
//   const [stats] = useState<UserStats>({
//     hours_booked: 124.5,
//     active_projects: 8,
//     credits: 1250,
//   });
//   const [bookings] = useState<Booking[]>([
//     {
//       id: '1',
//       studio_name: 'Studio A — North Wing',
//       studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ0OBOavY0FKXf_EMsibr6U6SbCoFfxj_lJt4X10gLu6kRMZpYBpuluXxmeR1uRUxsqG8n4Qmz7xdDCTfhXb6i05Jcvdyo1068Fwm3ds7yqHwiBsx1vd2oAKmQF0_KBOJ-vzK5nBUb9XjFzUqQfmXBP5aEh1DUrX-5nKtru-wvUGTm4BCm7ivreDJs4HhbNTfTj-BZ_DpIh8FRMUkAUPGJ11kqTL1FCCLdqAqxklAAhZ-vJJ7Gl193YYbntjkXljUhttJeMIFDLmZS',
//       date: 'Oct 24, 2023',
//       start_time: '10:00 AM',
//       end_time: '6:00 PM',
//       status: 'confirmed',
//       booking_id: 'MR-9920',
//       studio_location: 'North Wing, Manhattan',
//     },
//     {
//       id: '2',
//       studio_name: 'The Warehouse Loft',
//       studio_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAqqBObVeKGPWNBkarSwoSjOb_8jdm-kxV2JLgldG4Qvm17tLb3-GXqx1MmicQQZ6jSRodspMr45BPWGRKVZb2o-laegPpjyWanYuqhyfmHud1D5n6vnxnT2G3GiEWrJ1xEwoNqQyDVPC64gOq7XN2iYqdO-CWpEXH12W6zZTx_FUW8vRf7uclr422hECfIc5WogeTghAOrs0SZuhCB-ydnavlhF92VYOAE7he8854oLbDr0c3I74oemNGFJaoCQZujPYOxF8Klkee',
//       date: 'Oct 28, 2023',
//       start_time: '2:00 PM',
//       end_time: 'Late',
//       status: 'pending',
//       booking_id: 'MR-9941',
//       studio_location: 'Brooklyn, NY',
//     },
//   ]);
//   const [recommendations] = useState<Recommendation[]>([
//     {
//       id: '1',
//       name: 'Zenith Minimalist',
//       description: 'Perfect for high-fashion editorial',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbF4rh2VXQDIyfmTC2ymtujkho5xuTgPcIVvmngrJzpoM-EHE0On0oB12pKI7xXU6GbehfMfkpZXMLOcyglEjNttTRMGxQ1fZrM4P69WBAn9CejpIBuSIRe5sXMybw_EYG3dzyfeN-o8Gbo6Uvz26QEqFxggxMr_N_gdFS3acCyCbp7ROuSOK28HmGKlrObHFAYGCfE-3YKlZgqkMY1XIu_VY7g2ZU_bat3aPrChq4obiR24ABlkfc9Blae_RV93-essksclx68yPY',
//       price_per_hour: 180,
//       match_percentage: 98,
//       category: 'Editorial',
//     },
//     {
//       id: '2',
//       name: 'Obsidian Vault',
//       description: 'Low-light, cinematic depth',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoHGz2mHMIVoh3Rw5xKSeOrjElzgFKRYZdtzEQWHq7GAR5_oSwJDGLWxHAA2WqrN390ODniIy27ycOgJouZTJh7Nqn9QNeye1rdyqpOa93exErHpzNlUahjwF4J1N28V0DEzm9kMJBuKo983zKzEBhE99UliIy6AaTYcfotbPmWZYJ8JFF9pgp2UcRT5Z5xuPqwvT4O5rszytc1A1PXuU7QXibZ6mcyWGc2tpI8B9gO6vqHYagEm2Mbkln0b0ABHsNSGdVEyeP2h7j',
//       price_per_hour: 240,
//       match_percentage: 94,
//       category: 'Cinematic',
//     },
//     {
//       id: '3',
//       name: 'Solaris Attic',
//       description: 'Natural light, organic textures',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmszfPzgLGhKuxLS3msiKMOpXeMHWCqwS6zfsimoW_FT41pCSnQWaL2Ncrigj3Wp1dTbYBn6AswVht5ZaWlTMwtfFyP-SFsun4rPRGAQ_0yQCw-gWoMDEZEi_BKzm5w3mU-ASlB1UnqTgjRY2etqr0PFTZcBldugHTxmg_yUtBG45t1KFBLwJX_zIV5ll9OkSF_1Vv_6vgvgyI8zIF0-D3h69tra_YubneXr1y3faPNkzNr_wVSVPRMpYG5louHfjjBYiBBBIJ_MSu',
//       price_per_hour: 150,
//       match_percentage: 89,
//       category: 'Natural Light',
//     },
//     {
//       id: '4',
//       name: 'Neon Pulse',
//       description: 'Experimental music video set',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjrsoQOG5B3__M5L-1XQiWvwIeXEZxu5JuEd_k6zayLy8hd18Z3PjD3NaV8jEmdrk9j0hylGTOfWTgRNJvK-pDlYA3SuIl4_tKbn3B1wPSyqFB2dcYOHNK-X2LQJyKUz-jbjqdl9Ul6B2NvzbsStrctUhu_-ycoOSJxY4UXYPBYvqsKy7TXVokKLmsgaSElesZhVFeZvf50XbXV3el3q7GtxdZ9kRfb69RavWeZ04B_zyFkd0wdruxqa6UcyIL2RnynZj8wKu_IrmZ',
//       price_per_hour: 210,
//       match_percentage: 85,
//       category: 'Music',
//     },
//   ]);

//   useEffect(() => {
//     const updateGreeting = () => {
//       const hour = new Date().getHours();
//       if (hour < 12) setGreeting('GOOD MORNING');
//       else if (hour < 18) setGreeting('GOOD AFTERNOON');
//       else setGreeting('GOOD EVENING');

//       const now = new Date();
//       const options: Intl.DateTimeFormatOptions = {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true,
//         timeZoneName: 'short'
//       };
//       setCurrentTime(now.toLocaleTimeString('en-US', options));
//     };

//     updateGreeting();
//     const interval = setInterval(updateGreeting, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'confirmed':
//         return 'bg-primary/20 text-primary';
//       case 'pending':
//         return 'bg-amber-500/20 text-amber-500';
//       case 'cancelled':
//         return 'bg-red-500/20 text-red-500';
//       default:
//         return 'bg-slate-500/20 text-slate-500';
//     }
//   };

//   const firstName = user?.user_metadata?.name?.split(' ')[0] || 'CREATIVE';

//   return (
//     <>
//       {/* Hero Header Section */}
//       <section className="relative h-[70vh] w-full overflow-hidden">
//         <div 
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ 
//             backgroundImage: `linear-gradient(to right, rgba(10, 10, 10, 1) 10%, rgba(10, 10, 10, 0.4) 50%, rgba(10, 10, 10, 0.8) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJ8LheQbvDLa5tWz-xBoGVnWdcO5LTswcKR-F9_YFJeE4QpZTHPkS7dW8Zte0m8jZlfJDZ8eQPR4gghLxpgfcOPqu2HQl5cF1brU8FaQtCVg_lUvT8SZYm7HNjn5pn19NsnCz8Zn00fWrE5vy8huepMDxMpNaxD9rwNr8aphkdYoJgH6YbuF19PMCbgb3Q4eT75Vr1R_Q5kF5nbAq1bjmajODv9JrDSTuo1O4W3CrLAacNSt8DgGt8QgRva6D26-RH9fxKd-18GbTx')` 
//           }}
//         ></div>

//         <div className="relative z-10 h-full flex flex-col justify-center px-12 lg:px-24 max-w-7xl">
//           <p className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-4">
//             Creative Suite v2.4 • {currentTime}
//           </p>
//           <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-6">
//             {greeting},<br/>
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">
//               {firstName.toUpperCase()}.
//             </span>
//           </h1>
//           <p className="text-slate-400 text-lg md:text-xl max-w-xl font-light mb-10 leading-relaxed">
//             Your creative projects are scaling. Ready to book your next session in our AI-optimized environments?
//           </p>
//           <div className="flex flex-wrap gap-4">
//             <button className="bg-primary hover:bg-primary/90 transition-all text-white px-8 py-4 rounded-lg font-bold flex items-center gap-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
//               <PlusCircleIcon className="w-6 h-6" />
//               CREATE NEW SESSION
//             </button>
//             <button className="bg-white/5 hover:bg-white/10 transition-all text-white backdrop-blur-md px-8 py-4 rounded-lg font-bold border border-white/10">
//               VIEW ARCHIVES
//             </button>
//           </div>
//         </div>

//         {/* Stats overlay */}
//         <div className="absolute bottom-12 right-12 lg:right-24 flex gap-12 z-20">
//           <div className="flex flex-col">
//             <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Hours Booked</span>
//             <span className="text-3xl font-light text-white">{stats.hours_booked}</span>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Active Projects</span>
//             <span className="text-3xl font-light text-white">{stats.active_projects.toString().padStart(2, '0')}</span>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Credits</span>
//             <span className="text-3xl font-light text-primary">{stats.credits.toLocaleString()}</span>
//           </div>
//         </div>
//       </section>

//       {/* Content Area */}
//       <div className="px-12 lg:px-24 py-16 max-w-[1600px] w-full mx-auto">
//         {/* Upcoming Bookings Section */}
//         <section className="mb-24">
//           <div className="flex items-end justify-between mb-10">
//             <div>
//               <h2 className="text-4xl font-extrabold tracking-tight text-white">NOW & NEXT</h2>
//               <p className="text-slate-500 mt-2">Manage your upcoming studio residency sessions.</p>
//             </div>
//             <Link href="/dashboard/bookings" className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
//               SEE ALL BOOKINGS <ArrowRightIcon className="w-4 h-4" />
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {bookings.map((booking) => (
//               <div key={booking.id} className="group relative overflow-hidden rounded-xl bg-surface-dark border border-white/5 flex h-72">
//                 <div className="w-1/2 overflow-hidden">
//                   <img 
//                     className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out" 
//                     src={booking.studio_image}
//                     alt={booking.studio_name}
//                   />
//                 </div>
//                 <div className="w-1/2 p-8 flex flex-col justify-between">
//                   <div>
//                     <div className="flex justify-between items-start mb-4">
//                       <span className={`px-3 py-1 ${getStatusStyle(booking.status)} text-[10px] font-bold rounded-full uppercase tracking-tighter`}>
//                         {booking.status === 'confirmed' ? 'Confirmed' : 'Pending Approval'}
//                       </span>
//                       <span className="text-slate-500 text-xs">ID: {booking.booking_id}</span>
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{booking.studio_name}</h3>
//                     <p className="text-slate-400 text-sm font-light">
//                       {booking.date} | {booking.start_time} - {booking.end_time}
//                     </p>
//                     <p className="text-slate-500 text-xs mt-2">{booking.studio_location}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button className="flex-1 bg-white/5 hover:bg-primary transition-colors py-3 rounded text-xs font-bold text-white uppercase tracking-widest">
//                       Specs
//                     </button>
//                     <button className="flex-1 border border-white/10 hover:border-white transition-colors py-3 rounded text-xs font-bold text-white uppercase tracking-widest">
//                       {booking.status === 'confirmed' ? 'Modify' : 'Check-in'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* AI Recommendations Section */}
//         <section>
//           <div className="mb-10">
//             <h2 className="text-4xl font-extrabold tracking-tight text-white">CURATED FOR YOUR STYLE</h2>
//             <p className="text-slate-500 mt-2">AI-driven recommendations based on your architectural aesthetic.</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {recommendations.map((rec) => (
//               <div key={rec.id} className="group cursor-pointer">
//                 <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-4">
//                   <img 
//                     className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" 
//                     src={rec.image}
//                     alt={rec.name}
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent opacity-60"></div>
//                   <div className="absolute bottom-4 left-4">
//                     <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
//                       {rec.match_percentage}% Match
//                     </span>
//                   </div>
//                 </div>
//                 <h4 className="text-lg font-bold text-white">{rec.name}</h4>
//                 <p className="text-slate-500 text-sm">{rec.description}</p>
//                 <p className="text-primary text-sm font-bold mt-2">${rec.price_per_hour}/hr</p>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>

//       {/* Global Footer */}
//       <footer className="mt-auto px-12 lg:px-24 py-12 border-t border-white/5 bg-background-dark">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-8">
//           <div className="flex items-center gap-4">
//             <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-white font-black text-sm tracking-tighter">
//               MR
//             </div>
//             <p className="text-slate-500 text-sm font-light">
//               © {new Date().getFullYear()} ManyRooms Studios. All rights reserved.
//             </p>
//           </div>
//           <div className="flex gap-12">
//             <Link href="/support" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
//               Support
//             </Link>
//             <Link href="/billing" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
//               Billing
//             </Link>
//             <Link href="/legal" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
//               Legal
//             </Link>
//             <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
//               Privacy
//             </Link>
//           </div>
//           <div className="flex gap-4">
//             <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">language</span>
//             <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-white">dark_mode</span>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// }