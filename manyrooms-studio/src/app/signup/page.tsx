'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  UserIcon,
  EnvelopeIcon,
  EyeIcon,
  Square2StackIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full bg-background-dark" />}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for role in URL parameters on page load
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['client', 'owner', 'franchisee'].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      await signup(name, email, password, selectedRole);
      setSuccessMessage('Account created! Please check your email to confirm your account.');
      
      // Optional: Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthText = ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength] || 'Weak';

  return (
    <div className="flex min-h-screen w-full bg-background-dark text-white overflow-hidden">
      {/* Left Side: Cinematic Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background-dark">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-transparent to-background-dark/30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" 
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7vvEr3Fq76wjx7ExuPDt-oTMueyXJolQjXQgJgp3LoUAKxLpS9DT-z7xtEshbQcBcz6tqB4D9gV7xUN5Y1bJe9CalNm5F7477jeiEVidqhbTvnPvfPb17Nz0mPYZ47qutpfKZFMlCChGN9jdUX5gtOTpTdVDz1bRukW05HP9kalRCRB8R74-hhBpzMTopgXQIx2gHK4AdDPnqGatosyyJAkEVamr92-Gco4lpZjIcCmZITh54Y8-5W2D4eu4ygry97Ju6zRikXEn3')" 
          }}
        ></div>
        
        <div className="relative z-20 flex flex-col justify-between p-16 w-full h-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Square2StackIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tighter uppercase italic">ManyRooms</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-6xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              Your vision, <br/>
              <span className="text-primary">amplified.</span>
            </h1>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              Access the world's most sophisticated creative spaces. Designed for artists, managed by pros, scaled by you.
            </p>
          </div>
          
          <div className="flex gap-8 text-sm font-medium text-slate-500 uppercase tracking-widest">
            <span>Recording</span>
            <span>Film</span>
            <span>Photography</span>
            <span>Podcast</span>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar">
        {/* Top Nav */}
        <div className="flex justify-between items-center px-8 lg:px-12 py-8">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Square2StackIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <p className="text-sm text-slate-500">
              Already have an account? 
              <Link href="/" className="text-primary font-bold ml-1 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-12 max-w-2xl mx-auto w-full">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold mb-3 tracking-tight text-white">Join the Studio.</h2>
            <p className="text-slate-500">Select your path to get started with ManyRooms.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-500 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Client Role */}
              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="client" 
                  checked={selectedRole === 'client'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="peer sr-only" 
                  required
                />
                <div className={`h-full p-4 rounded-xl border transition-all duration-200 
                  ${selectedRole === 'client' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-[#262626] bg-[#161616] hover:bg-white/5'}`}>
                  <UserIcon className="w-8 h-8 text-primary mb-3 block group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-bold text-white mb-1">Client</p>
                  <p className="text-xs text-slate-500">Book a space.</p>
                </div>
                <div className={`absolute top-2 right-2 ${selectedRole === 'client' ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckCircleSolid className="w-5 h-5 text-primary" />
                </div>
              </label>

              {/* Owner Role */}
              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="owner"
                  checked={selectedRole === 'owner'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="peer sr-only" 
                />
                <div className={`h-full p-4 rounded-xl border transition-all duration-200 
                  ${selectedRole === 'owner' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-[#262626] bg-[#161616] hover:bg-white/5'}`}>
                  <svg className="w-8 h-8 text-primary mb-3 block group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-sm font-bold text-white mb-1">Owner</p>
                  <p className="text-xs text-slate-500">Manage rooms.</p>
                </div>
                <div className={`absolute top-2 right-2 ${selectedRole === 'owner' ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckCircleSolid className="w-5 h-5 text-primary" />
                </div>
              </label>

              {/* Franchisee Role */}
              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="franchisee"
                  checked={selectedRole === 'franchisee'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="peer sr-only" 
                />
                <div className={`h-full p-4 rounded-xl border transition-all duration-200 
                  ${selectedRole === 'franchisee' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-[#262626] bg-[#161616] hover:bg-white/5'}`}>
                  <svg className="w-8 h-8 text-primary mb-3 block group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-sm font-bold text-white mb-1">Franchisee</p>
                  <p className="text-xs text-slate-500">Scale the brand.</p>
                </div>
                <div className={`absolute top-2 right-2 ${selectedRole === 'franchisee' ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckCircleSolid className="w-5 h-5 text-primary" />
                </div>
              </label>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 transition-colors group-focus-within:text-primary">
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
                  required
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 transition-colors group-focus-within:text-primary">
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="john@manyrooms.studio"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all" 
                  required
                />
              </div>

              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 transition-colors group-focus-within:text-primary">
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all pr-12" 
                    required
                    minLength={6}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <>
                    <div className="mt-2 flex gap-1 h-1">
                      {[0, 1, 2, 3].map((index) => (
                        <div 
                          key={index}
                          className={`flex-1 rounded-full transition-all ${
                            index < passwordStrength 
                              ? 'bg-primary' 
                              : 'bg-[#262626]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter">
                      Strength: {strengthText}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-5 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#262626]"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-600 uppercase tracking-widest">or continue with</span>
              <div className="flex-grow border-t border-[#262626]"></div>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-3 border border-[#262626] rounded-lg bg-[#161616] hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-bold">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-3 border border-[#262626] rounded-lg bg-[#161616] hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.008-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.69 3.56-1.702z" />
                </svg>
                <span className="text-sm font-bold">Apple</span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-slate-600 leading-relaxed">
              By clicking create account, you agree to our <br/>
              <a href="#" className="underline hover:text-slate-400">Terms of Service</a> and 
              <a href="#" className="underline hover:text-slate-400 ml-1">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}




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

