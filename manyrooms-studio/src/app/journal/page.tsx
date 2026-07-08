// app/journal/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Footer from '@/components/Footer';

// Brand Colors
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  brown: '#DB8B8C',
  dark: '#3C291C',
};

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  image: string;
  readTime: string;
  featured?: boolean;
}

export default function JournalPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Stories');
  const [email, setEmail] = useState('');

  const filters = ['All Stories', 'Behind the Scenes', 'Gear Guides', 'Community', 'Artist Spotlights'];

  const featuredArticle: Article = {
    id: '1',
    title: 'The Brutalist Sanctuary: How Concrete Shapes Creativity',
    excerpt: 'Architect Elena Rossi takes us inside her latest studio project, where raw material meets refined soundscapes.',
    category: 'Studio Stories',
    categoryColor: 'text-[#3C291C]',
    categoryBg: 'bg-[#F1CB81]',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmEH-yxBuz4E9_fWApDLq8YQA8B4RTCrcQZTiWwu5o9bzAv1Cw15LvX5ObnoXVNtS9oGOott8eK3VSupFclBV3HCs8LEjMFlAF8ThY1AOrFbmOW1fKI6o5lFqvFGVFwtg29VGd4FLYSA2Juc9u7a-I4z_6pl8cWRYxW-56VS32gfcPCzowcwhbveORPxfQmY8ijIoAmHMGvSAg4aofKxpydWiJthslL8b1bSySg7ohkJbZReO5iseefcEgJ3-aR5uMxYb2yWqqQq7p',
    readTime: '12 Min Read',
    featured: true,
  };

  const articles: Article[] = [
    {
      id: '2',
      title: '7 Microphones That Defined the Sound of 2024',
      excerpt: 'From boutique ribbon mics to the latest in modeling technology, here is what the world\'s top producers are using this season.',
      category: 'Production Tips',
      categoryColor: 'text-white',
      categoryBg: 'bg-[#DB8B8C]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATejJJbZgatYI-7rS3vrQ9tq9ITc_4gHTJ2bPVnEw2LY2K5Q9W__sI6wtk0Z5ar9g7Rh05KNhnVBgKWlggE2evu6_f82ZcoBRFzi-ROC9O5CZm8ze0m007xHiRFfho693jrBg8P7CY5AbnM4iHlgHuv2fpwzDJH8PxZzsh-23F89KomgH3EYhNwy2DooMIdseCjh9f9nFl7Ga6kaV0y9btZngKD_kKa8vySsKpR5N1R7v9qL73JcglQZKLr8h-msELSEraqGiytIXq',
      readTime: '8 Min Read',
    },
    {
      id: '3',
      title: 'Meet the Maker: Zora Vance',
      excerpt: 'The digital surrealist on why she chose a former warehouse in Berlin for her latest residency.',
      category: 'Artist Spotlight',
      categoryColor: 'text-[#3C291C]',
      categoryBg: 'bg-[#91ADCD]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFJdgcN76VEnqVgPuTyA3cXRBgboVx9NLy5Vpe0Oysr-tw4VUR4nUtl5Z83l3RkH1RtKYWby2r13QhXKF89-mSUTjBu-qGZUj8Gc10l0tkJdo4Npa-Jzxumjaedv7ykyQBw_FIIwb77IH-ANakEu1LqD_b05Qg1Lpdht_Rm7DKaL_A3btqurb9Z9cmxiJx-zIApDfa2lcL70dsJhr-_b-bBCMbJO5J_F8JaTCy_Gxz7sDmWqlYBHSCLbfEyiCjPtiQWF9FFmRD98T-',
      readTime: '6 Min Read',
    },
    {
      id: '4',
      title: 'Anamorphic Lenses: The New Indie Standard',
      excerpt: 'Why more creators are ditching spherical glass for a wider perspective.',
      category: 'Gear Guides',
      categoryColor: 'text-[#3C291C]',
      categoryBg: 'bg-[#F1CB81]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQdj_A8JI1Qj-FaLV1E1BgtvJ9pqa0zcFktYxyFkefkSkvlcR4NUgHExbsffjFfqCSoYGLpYbqDB6YO5T1DQfF6Sn32acUPwwIIyyRbQ_a0DEmjlIurhVYT4ObYDtY3wpdYhnbTDJ_YzsyHVlJ4l1wi4DX1JJkiqnROurDQdQonEyJMZcs664zYH3F1aTyxlIGF5EceEIEaHT-ypfVuQKotAlxPGfOR3Caz4qAbEw2CZX0QMEcmXm6d3NPide_ZUz-RyZ-XKotMMNA',
      readTime: '5 Min Read',
    },
    {
      id: '5',
      title: 'The Power of Shared Spaces',
      excerpt: 'How co-working in specialized studios is fueling the next wave of creative startups.',
      category: 'Community',
      categoryColor: 'text-[#3C291C]',
      categoryBg: 'bg-[#DB8B8C]/30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRw69F1BeKlR8tLi4xZQOGhsJMygdie5nTPRvSMa0QrHeShd_5uOIcPwnYVH_L3ap3kF1dqUkF_NWdFAg7R1O7RB2LuU5fvXinyGcKdO6Lx8AR87q3_q_xqxhwLb43drXiODwY5a4JjpRJQK4kmkC-z89-d0OWSEcCtmrs5_BtV26NBKxwb-YFmPse9BxkCODOhDdPnKZzMXgEOHwXC8T33cjJ4ICRgzkXrAakVsR5AELC-bgfCg_4fM2hspIvBhIIw7mhG1_6bMbs',
      readTime: '7 Min Read',
    },
    {
      id: '6',
      title: "Inside 'Lust & Logic'",
      excerpt: 'A breakdown of the lighting setup for this season\'s most controversial music video.',
      category: 'Behind the Scenes',
      categoryColor: 'text-[#3C291C]',
      categoryBg: 'bg-[#91ADCD]/40',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa9kfAXzibBaXIJev9yqjMs7Ri4yVDkSx4BvADY5J6Ow14aG4Rauv1jXSLgRKQDGaulwqL558dmtDot9vX1N5-Ky9QABQFlupyppmf0fjUFxmaCiacznDqdAa4TfKc2uLh8JjkbTNpKvL3rA5EUUFTSggg8cGpnpqfgHiWwSHyMukGGHKA3lRHuGsHgZRgXzuE0TiLl2hOs85d-hPRwX0JMrgdVW-L6sSzbnGWYruPramiYy8wy7K4hLRotXTsnD-1ymcosFiyT7bg',
      readTime: '10 Min Read',
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thanks for subscribing!');
    setEmail('');
  };

  const filteredArticles = activeFilter === 'All Stories' 
    ? articles 
    : articles.filter(a => a.category === activeFilter || 
        (activeFilter === 'Behind the Scenes' && a.category === 'Behind the Scenes') ||
        (activeFilter === 'Gear Guides' && a.category === 'Gear Guides') ||
        (activeFilter === 'Community' && a.category === 'Community') ||
        (activeFilter === 'Artist Spotlights' && a.category === 'Artist Spotlight'));

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#3C291C] overflow-x-hidden">
      
      {/* Navigation - Consistent with homepage */}
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
              {['Marketplace', 'Studios', 'Spaces', 'Journal', 'Services'].map((item) => (
                <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} 
                  className={`py-1 font-bold text-sm transition-colors text-[#3C291C]/70 hover:text-[#3C291C] ${
                    item === 'Journal' ? 'text-[#DB8B8C] border-b-2 border-[#DB8B8C]' : ''
                  }`}
                >{item}</Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/signup?role=owner" className="hidden md:block px-6 py-2 bg-[#F1CB81] text-[#3C291C] font-bold text-sm rounded-full hover:bg-[#DB8B8C] hover:text-white transition-all">List Your Space</Link>
            <div className="hidden md:flex items-center gap-3">
              <span className="material-symbols-outlined text-[#3C291C] cursor-pointer hover:scale-105 transition-transform">favorite</span>
              <span className="material-symbols-outlined text-[#3C291C] cursor-pointer hover:scale-105 transition-transform">account_circle</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <Bars3Icon className="w-5 h-5 text-[#3C291C]" />
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
              <span className="text-2xl font-bold text-[#3C291C]">ManyRooms</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><XMarkIcon className="w-6 h-6 text-[#3C291C]" /></button>
            </div>
            <nav className="flex flex-col gap-6">
              {['Marketplace', 'Studios', 'Spaces', 'Journal', 'Services'].map((item) => (
                <Link key={item} href={item === 'Marketplace' ? '/' : `/${item.toLowerCase()}`} className={`text-base font-semibold hover:text-[#DB8B8C] ${item === 'Journal' ? 'text-[#DB8B8C]' : 'text-[#3C291C]'}`} onClick={() => setIsMobileMenuOpen(false)}>{item}</Link>
              ))}
              <div className="border-t border-gray-200 pt-6 mt-2">
                <Link href="/signup?role=owner" className="block text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] mb-4" onClick={() => setIsMobileMenuOpen(false)}>List Your Space</Link>
                <Link href="/login" className="block text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                <Link href="/signup" className="block text-base font-semibold text-[#3C291C] hover:text-[#DB8B8C] mb-4" onClick={() => setIsMobileMenuOpen(false)}>Sign up</Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden px-4 md:px-16 mb-8">
          <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
              style={{ backgroundImage: `url('${featuredArticle.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3C291C]/95 via-[#3C291C]/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-3xl">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className={`${featuredArticle.categoryBg} ${featuredArticle.categoryColor} font-bold text-xs px-4 py-1.5 rounded-full uppercase`}>
                  {featuredArticle.category}
                </span>
                <span className="text-white/70 text-sm font-medium">{featuredArticle.readTime}</span>
              </div>
              <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                {featuredArticle.title}
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mb-6">
                {featuredArticle.excerpt}
              </p>
              <button className="bg-white text-[#3C291C] px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-[#F1CB81] hover:scale-105 transition-all">
                Read Story <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="px-4 md:px-16 py-8">
          <div className="flex flex-wrap items-center gap-3 border-b border-[#3C291C]/10 pb-8">
            <span className="font-bold text-xs text-[#3C291C]/60 uppercase tracking-widest mr-2">Filter By</span>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                  activeFilter === filter
                    ? 'bg-[#3C291C] text-white shadow-lg'
                    : 'bg-white text-[#3C291C]/70 border border-[#3C291C]/10 hover:bg-[#F1CB81]/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Bento Grid - Secondary Stories */}
        <section className="px-4 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          {/* Large Card - First filtered article */}
          {filteredArticles.slice(0, 1).map((article) => (
            <div key={article.id} className="md:col-span-8 group cursor-pointer">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-5 shadow-lg">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={article.image} 
                  alt={article.title} 
                />
                <div className="absolute top-5 left-5">
                  <span className={`${article.categoryBg} ${article.categoryColor} px-3 py-1.5 rounded-lg font-bold text-xs uppercase`}>
                    {article.category}
                  </span>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-2 group-hover:text-[#DB8B8C] transition-colors">
                {article.title}
              </h3>
              <p className="text-[#3C291C]/60 text-sm line-clamp-2">{article.excerpt}</p>
            </div>
          ))}
          
          {/* Small Card - Second filtered article */}
          {filteredArticles.slice(1, 2).map((article) => (
            <div key={article.id} className="md:col-span-4 group cursor-pointer">
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-5 shadow-lg">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={article.image} 
                  alt={article.title} 
                />
                <div className="absolute top-5 left-5">
                  <span className={`${article.categoryBg} ${article.categoryColor} px-3 py-1.5 rounded-lg font-bold text-xs uppercase`}>
                    {article.category}
                  </span>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-2 group-hover:text-[#DB8B8C] transition-colors">
                {article.title}
              </h3>
              <p className="text-[#3C291C]/60 text-sm line-clamp-2">{article.excerpt}</p>
            </div>
          ))}
        </section>

        {/* Asymmetric Editorial Row */}
        <section className="px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {filteredArticles.slice(2, 5).map((article, i) => (
            <div key={article.id} className={`group cursor-pointer ${i === 1 ? 'md:mt-12' : ''}`}>
              <div className="relative h-56 rounded-xl overflow-hidden mb-5 shadow-md">
                <img 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-80" 
                  src={article.image} 
                  alt={article.title} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`${article.categoryBg} ${article.categoryColor} px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase`}>
                    {article.category}
                  </span>
                  <span className="text-[#3C291C]/50 text-xs">{article.readTime}</span>
                </div>
                <h4 className="text-lg font-extrabold leading-tight group-hover:text-[#DB8B8C] transition-colors group-hover:underline">
                  {article.title}
                </h4>
                <p className="text-[#3C291C]/60 text-sm">{article.excerpt}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Remaining articles */}
        {filteredArticles.length > 5 && (
          <section className="px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {filteredArticles.slice(5).map((article, i) => (
              <div key={article.id} className={`group cursor-pointer`}>
                <div className="relative h-56 rounded-xl overflow-hidden mb-5 shadow-md">
                  <img 
                    className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-80" 
                    src={article.image} 
                    alt={article.title} 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`${article.categoryBg} ${article.categoryColor} px-2.5 py-0.5 rounded-md font-bold text-[10px] uppercase`}>
                      {article.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold leading-tight group-hover:text-[#DB8B8C] transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-[#3C291C]/60 text-sm">{article.excerpt}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Newsletter Section */}
        <section className="px-4 md:px-16">
          <div className="relative bg-[#3C291C] rounded-[40px] p-8 md:p-20 overflow-hidden text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-[#F1CB81] rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#DB8B8C] rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-4">Stay in the Loop</h2>
              <p className="text-white/70 text-base md:text-lg mb-8">
                Join 15,000+ creators receiving our weekly digest of curated spaces, creative gear, and industry insights.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3">
                <input 
                  className="flex-grow bg-white/10 border border-white/20 text-white rounded-full px-6 py-4 focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-white/40" 
                  placeholder="Enter your email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  className="bg-[#F1CB81] text-[#3C291C] font-bold text-sm px-8 py-4 rounded-full hover:scale-105 transition-transform whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}