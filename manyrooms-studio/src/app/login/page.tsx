'use client';

import { useState } from 'react';
import Image from 'next/image';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // No need to redirect here - middleware will handle role-based redirect
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-cinematic">
      {/* Main Login Container */}
      <div className="w-full max-w-[480px] animate-in fade-in zoom-in duration-700">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 relative mb-6">
            <Image
              src="/manyroomlogo.png"
              alt="ManyRooms Studios"
              width={64}
              height={64}
              className="rounded-xl"
            />
          </div>
          <h1 className="text-white text-xs font-bold tracking-[0.4em] uppercase opacity-60">
            ManyRooms Studios
          </h1>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                Access the Studio
              </h2>
              <p className="text-slate-400 text-sm font-medium tracking-wide">
                Enter your credentials to enter the space
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Email Address
                </label>
                <div className="relative group input-glow rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                    placeholder="name@studio.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group input-glow rounded-lg">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Entering...' : 'Enter Space'}</span>
                  {!loading && (
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
            </form>

            {/* Social/Other Login */}
            <div className="mt-10 pt-10 border-t border-white/5">
              <div className="flex flex-col items-center gap-6">
                <p className="text-slate-500 text-xs font-medium">
                  New here?{' '}
                  <Link href="/signup" className="text-white hover:text-primary transition-colors">
                    Join the Collective
                  </Link>
                </p>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => {
                      // Handle Google sign-in
                      const { supabase } = require('@/lib/supabase');
                      supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`,
                        },
                      });
                    }}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-2.21 5.39-7.84 5.39-4.84 0-8.79-4.01-8.79-8.94s3.95-8.94 8.79-8.94c2.75 0 4.59 1.16 5.64 2.18l2.58-2.48C18.88 1.41 15.91 0 12.48 0 5.58 0 0 5.58 0 12.48s5.58 12.48 12.48 12.48c7.21 0 11.99-5.07 11.99-12.21 0-.82-.09-1.44-.19-2.07l-11.8 0z" />
                    </svg>
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      // Handle Apple sign-in
                      const { supabase } = require('@/lib/supabase');
                      supabase.auth.signInWithOAuth({
                        provider: 'apple',
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`,
                        },
                      });
                    }}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.365 1.43c-1.14 0-2.316.48-3.045 1.144-.73-.664-1.905-1.144-3.045-1.144-2.327 0-4.225 1.898-4.225 4.225 0 4.225 6.136 10.743 7.27 11.956 1.134-1.213 7.27-7.731 7.27-11.956 0-2.327-1.898-4.225-4.225-4.225zM12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="mt-8 flex justify-center gap-8">
          <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors">
            Privacy
          </Link>
          <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors">
            Terms
          </Link>
          <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors">
            Support
          </Link>
        </div>
      </div>
    </main>
  );
}
