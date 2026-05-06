// footer

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In production, send this to your API
      console.log('Subscribed email:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-brand-dark text-white py-32 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-32">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-4xl max-w-xs leading-tight">Stay close to the world's best spaces.</h2>
            <p className="text-sm font-light opacity-60 max-w-sm">
              Early access to new cities, featured spaces and creator stories - once a month, beautifully curated.
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="bg-white/5 border border-white/10 rounded-l-full px-6 py-4 w-full focus:ring-0 focus:border-white/30 text-sm outline-none"
                required
              />
              <button
                type="submit"
                className="bg-white text-brand-dark px-8 rounded-r-full hover:bg-opacity-90 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
              </button>
            </form>
            {subscribed && (
              <p className="text-sm text-emerald-500">Thanks for subscribing! Check your inbox soon.</p>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-8">Discover</p>
            <ul className="space-y-4 text-xs opacity-70">
              <li><Link href="/spaces" className="hover:opacity-100 transition-opacity">All spaces</Link></li>
              <li><Link href="/cities" className="hover:opacity-100 transition-opacity">Cities</Link></li>
              <li><Link href="/how-it-works" className="hover:opacity-100 transition-opacity">How it works</Link></li>
              <li><Link href="/about" className="hover:opacity-100 transition-opacity">AI discovery</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-8">Cities</p>
            <ul className="space-y-4 text-xs opacity-70">
              <li><Link href="/spaces/london" className="hover:opacity-100 transition-opacity">London</Link></li>
              <li><Link href="/spaces/dubai" className="hover:opacity-100 transition-opacity">Dubai</Link></li>
              <li><Link href="/spaces/paris" className="hover:opacity-100 transition-opacity">Paris</Link></li>
              <li><Link href="/spaces/new-york" className="hover:opacity-100 transition-opacity">New York</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-8">Hosts</p>
            <ul className="space-y-4 text-xs opacity-70">
              <li><Link href="/signup?role=owner" className="hover:opacity-100 transition-opacity">List your space</Link></li>
              <li><Link href="/how-it-works" className="hover:opacity-100 transition-opacity">Why Many Rooms</Link></li>
              <li><Link href="/about" className="hover:opacity-100 transition-opacity">Host stories</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-12 gap-8">
          <div className="text-xl font-medium tracking-widest uppercase">Many Rooms</div>
          <div className="text-[10px] uppercase tracking-widest opacity-40">
            © 2026 MANY ROOMS STUDIOS • CRAFTED GLOBALLY
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest opacity-40">
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms</Link>
            <Link href="https://instagram.com" target="_blank" className="hover:opacity-100 transition-opacity">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
