// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  const { login } = useAuth();
  const router = useRouter();

  // Premium studio images for background carousel
  const studioImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1nB8OSMDUsNkAjUgjSwpjlliLiXMo7iWRhJ5E3wEXUgozXJ_eCPqjykQK6KY94W_P1URI5aDnYvkgRxtFt78nYbYzvhf2D7V4lGIdHS3PTuJEVtPrLu9ux0BPCzdmUCHmcZ0oh61pvXHIVDffE_hQFuDUOkW1xuB_qzh9mf-ebhdQVZ__ubUhTs61wl3OYOB-MKIY3sS1Lw0HsERjRPaN9mJ3s5xn5iOSEw_wICJcT-tSP3FO9wbJcdUXmdzeaXoIEtrTlhhzNJN2',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDo9P8cWMtlxC-vTKW_d789xE15ySyxsMb_U8Qe2iYrUWUJBlZ11z5sKoQQW5e-jeLwqaQOM0Kgb7ebgD6PqdUAKnW2S18GHubom8jAuDBqLBKkgP-ja77FpNibRKYP2eTFbt1LWmw_r-Tcwy29nP0kT3ERHsQ7AALtSKG623o-AmbEdIQSysiYVdkv3wzhPfpeuqsQUGNGfe0yYSqFPrzrb85t6zX4hO_Sp7K94b89goSxv0XdXC3e8wP-E5VGz5gk57zVVUbwzSDM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDSwmSKLUnWOMsQ3GugJdlOZS5BByKJaiEs61TyG209DcA2Bqys9Or3aAbjaOFLiR8KH9xts5is8WOCU89o8TxY4EuPTx3Y7eINF0W0JjMW8ZZ5xYUZB5ThUYmjzzq6EERLeNzzD0U1o50RoOSqZqR1kCc67u55wSoCa7qKpALt43g75uDvONV3VOrCUDZoDHw_1nvmvMdKyGSZQvV-ffQc-yIuf-LaLoT3SWHaSi85V5-kEkwfNlO-MZv8WnnM-HWMlBvx5TYjJB6F',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAtaHsD_Ee0OXgccRwyuBHMMGBF5R9Wv7zL6xdfFmVFYNTibEc531TN2DKYpRcRHkWa6LNR-2FEaFzFCKoH7alTA6ZN4q7jb2vYuVe8qo4dKOIRupQxXdeWuFfgP-ZD-bYdZ4y83gObwQRQga8Gb2f8GOaemUrFtQcqt_0rcQZ_GS3KH-aiNPL50ZBFTzVERvqcftQZLBU1XEGVqm59af7kBpaAV0rreAUxgHeTcLcawMQ__wUXvyFc0Ko9pGwkWWs9A1g6uMKIjl5F',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDLkL_S-dw1DwN3C_25Bg1DkuiE4eStzko3W4oDgh-uQKrWWmbQNb8qx0xEEcqWJ2UrtMJl3GF2rbvtvt2G6yyZf0PyFp7G6J-gkcEkNv8m_KbQUky3KfZmt1R18XEJJlqQe5VKA1HgbLcaAmUHy0nM7zSTyaMh6MSTiVto7EjDhv1SPZ4x0RuvmLu7w532bPBwYZ9IyoSjxBUn8v77ZUSe_yE-mHRWCYYoqLKUQc2mEqxLKKTXlIUP3oYmxWXzVhnkz0EXuhLHLU9U',
  ];

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % studioImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#191c1d]">
      {/* Background Image Gallery with Crossfade */}
      <div className="absolute inset-0 z-0">
        {studioImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
            style={{
              backgroundImage: `url('${image}')`,
              opacity: index === currentImage ? 1 : 0,
              transform: index === currentImage ? 'scale(1)' : 'scale(1.05)',
              transition: 'opacity 2s ease-in-out, transform 8s ease-in-out',
            }}
          />
        ))}
        
        {/* Dark overlay with gradient for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#191c1d]/95 via-[#191c1d]/80 to-[#191c1d]/90"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(190,255,95,0.03)_0%,_transparent_70%)]"></div>
        
        {/* Side accent glows */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#446900]/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#e4d7fd]/5 to-transparent"></div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {studioImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentImage 
                ? 'w-8 bg-[#beff5f]' 
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Main Login Container */}
      <div className="w-full max-w-[460px] relative z-10">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 relative mb-5">
            <Image
              src="/manyroomlogo.png"
              alt="ManyRooms Studios"
              width={56}
              height={56}
              className="rounded-xl shadow-lg ring-1 ring-white/10"
            />
          </div>
          <h1 className="text-white/80 text-xs font-bold tracking-[0.4em] uppercase">
            ManyRooms Studios
          </h1>
          <p className="text-white/50 text-sm mt-2 font-medium">
            Your Creative Stage, Redefined
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl border border-white/10 relative overflow-hidden">
          {/* Subtle top accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#beff5f] to-transparent"></div>
          
          {/* Card inner glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#beff5f]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                Welcome back
              </h2>
              <p className="text-white/50 text-sm">
                Sign in to access your creative spaces
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#beff5f] transition-colors">
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#beff5f]/50 focus:border-[#beff5f]/30 transition-all font-medium text-sm"
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
                  <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-bold text-[#beff5f] hover:text-[#9bd93c] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#beff5f] transition-colors">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#beff5f]/50 focus:border-[#beff5f]/30 transition-all font-medium text-sm"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#beff5f] focus:ring-[#beff5f]/50 focus:ring-offset-0"
                />
                <label htmlFor="remember" className="text-sm text-white/50">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#beff5f] hover:bg-[#9bd93c] text-[#111f00] font-bold py-4 rounded-xl shadow-lg shadow-[#beff5f]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                  {!loading && (
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-center text-sm text-white/40">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#beff5f] font-bold hover:text-[#9bd93c] transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 flex justify-center gap-8">
          <Link href="#" className="text-[11px] font-bold uppercase tracking-wider text-white/30 hover:text-white/60 transition-colors">
            Privacy
          </Link>
          <Link href="#" className="text-[11px] font-bold uppercase tracking-wider text-white/30 hover:text-white/60 transition-colors">
            Terms
          </Link>
          <Link href="#" className="text-[11px] font-bold uppercase tracking-wider text-white/30 hover:text-white/60 transition-colors">
            Support
          </Link>
        </div>
      </div>
    </main>
  );
}





// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import { EnvelopeIcon, LockClosedIcon, EyeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await login(email, password);
//       // No need to redirect here - middleware will handle role-based redirect
//       router.refresh();
//     } catch (err: any) {
//       setError(err.message || 'Invalid email or password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center p-6 bg-cinematic">
//       {/* Main Login Container */}
//       <div className="w-full max-w-[480px] animate-in fade-in zoom-in duration-700">
//         {/* Brand Identity */}
//         <div className="flex flex-col items-center mb-10">
//           <div className="w-16 h-16 relative mb-6">
//             <Image
//               src="/manyroomlogo.png"
//               alt="ManyRooms Studios"
//               width={64}
//               height={64}
//               className="rounded-xl"
//             />
//           </div>
//           <h1 className="text-white text-xs font-bold tracking-[0.4em] uppercase opacity-60">
//             ManyRooms Studios
//           </h1>
//         </div>

//         {/* Login Card */}
//         <div className="glass-card rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
//           {/* Subtle accent glow */}
//           <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"></div>

//           <div className="relative z-10">
//             <div className="mb-10">
//               <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
//                 Access the Studio
//               </h2>
//               <p className="text-slate-400 text-sm font-medium tracking-wide">
//                 Enter your credentials to enter the space
//               </p>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
//                 <p className="text-red-500 text-sm font-medium">{error}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email Field */}
//               <div className="space-y-2">
//                 <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
//                   Email Address
//                 </label>
//                 <div className="relative group input-glow rounded-lg">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
//                     <EnvelopeIcon className="w-5 h-5" />
//                   </div>
//                   <input
//                     className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
//                     placeholder="name@studio.com"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center ml-1">
//                   <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
//                     Password
//                   </label>
//                   <Link
//                     href="/forgot-password"
//                     className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
//                   >
//                     Forgot?
//                   </Link>
//                 </div>
//                 <div className="relative group input-glow rounded-lg">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
//                     <LockClosedIcon className="w-5 h-5" />
//                   </div>
//                   <input
//                     className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
//                     placeholder="••••••••"
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                   <button
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     <EyeIcon className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* CTA Button */}
//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <span>{loading ? 'Entering...' : 'Enter Space'}</span>
//                   {!loading && (
//                     <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                   )}
//                 </button>
//               </div>
//             </form>

//             {/* Social/Other Login */}
//             <div className="mt-10 pt-10 border-t border-white/5">
//               <div className="flex flex-col items-center gap-6">
//                 <p className="text-slate-500 text-xs font-medium">
//                   New here?{' '}
//                   <Link href="/signup" className="text-white hover:text-primary transition-colors">
//                     Join the Collective
//                   </Link>
//                 </p>
//                 <div className="flex gap-4">
//                   <button 
//                     type="button"
//                     onClick={() => {
//                       // Handle Google sign-in
//                       const { supabase } = require('@/lib/supabase');
//                       supabase.auth.signInWithOAuth({
//                         provider: 'google',
//                         options: {
//                           redirectTo: `${window.location.origin}/auth/callback`,
//                         },
//                       });
//                     }}
//                     className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
//                   >
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M12.48 10.92v3.28h7.84c-.24 1.84-2.21 5.39-7.84 5.39-4.84 0-8.79-4.01-8.79-8.94s3.95-8.94 8.79-8.94c2.75 0 4.59 1.16 5.64 2.18l2.58-2.48C18.88 1.41 15.91 0 12.48 0 5.58 0 0 5.58 0 12.48s5.58 12.48 12.48 12.48c7.21 0 11.99-5.07 11.99-12.21 0-.82-.09-1.44-.19-2.07l-11.8 0z" />
//                     </svg>
//                   </button>
//                   <button 
//                     type="button"
//                     onClick={() => {
//                       // Handle Apple sign-in
//                       const { supabase } = require('@/lib/supabase');
//                       supabase.auth.signInWithOAuth({
//                         provider: 'apple',
//                         options: {
//                           redirectTo: `${window.location.origin}/auth/callback`,
//                         },
//                       });
//                     }}
//                     className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
//                   >
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M16.365 1.43c-1.14 0-2.316.48-3.045 1.144-.73-.664-1.905-1.144-3.045-1.144-2.327 0-4.225 1.898-4.225 4.225 0 4.225 6.136 10.743 7.27 11.956 1.134-1.213 7.27-7.731 7.27-11.956 0-2.327-1.898-4.225-4.225-4.225zM12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Minimal Footer */}
//         <div className="mt-8 flex justify-center gap-8">
//           <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors">
//             Privacy
//           </Link>
//           <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors">
//             Terms
//           </Link>
//           <Link href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors">
//             Support
//           </Link>
//         </div>
//       </div>
//     </main>
//   );
// }
