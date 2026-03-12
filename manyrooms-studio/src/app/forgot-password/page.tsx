'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EnvelopeIcon, ArrowLeftIcon, ArrowRightIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setShowSuccess(true);
    setIsSubmitted(true);
    
    // Auto hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800/60 px-6 py-4 flex items-center justify-between bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
              <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight dark:text-white text-slate-900 uppercase">
            ManyRooms <span className="text-primary/80">Studios</span>
          </span>
        </div>
        <div>
          <Link href="/">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <XMarkIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 cinematic-gradient relative overflow-hidden min-h-[calc(100vh-73px)]">
        {/* Abstract Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-[480px] space-y-10 relative z-10">
          {/* Content Header */}
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              Reset your <br/>password<span className="text-primary">.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
              Enter the email associated with your account and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-[#161d2b] border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 text-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-300 dark:text-white text-slate-900 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                  placeholder="name@agency.com"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-300 dark:text-slate-700 group-focus-within:text-primary transition-colors">
                  <EnvelopeIcon className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-xl text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <span>{isSubmitted ? 'Email Sent' : 'Send Reset Link'}</span>
                {!isSubmitted && (
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-all font-semibold">
              <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Login</span>
            </Link>
            <div className="h-px w-12 bg-slate-200 dark:bg-slate-800"></div>
            <p className="text-xs text-slate-400 dark:text-slate-600 font-medium tracking-wide text-center">
              Need help? <a href="#" className="text-primary hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </main>

      {/* Success Message Toast */}
      <div className={`fixed bottom-8 right-8 max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xl flex items-start gap-4 transform transition-all duration-500 ${showSuccess ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
        <div className="bg-green-500/10 p-2 rounded-lg text-green-500">
          <CheckCircleIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Email Sent</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            If an account exists for that email, you will receive password reset instructions shortly.
          </p>
        </div>
        <button 
          onClick={() => setShowSuccess(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Background Decoration Images */}
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10 mix-blend-overlay overflow-hidden">
        <img 
          className="absolute -top-1/4 -right-1/4 w-full h-full object-cover grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE9CPPkpd3f5ql9YhKTdaseY6Sia4Hd2GZfxhhRXBW2knoXIA6OhWP2WQU5h4lsLtvwj9capD0qL7nsYwb4jXsRC-PcD2_IVfx2XOJ9UkcYhjE2vNyUwT4Bf1G7D8ZLG4HlicpJ9cpd3_nms9AsII4MLabIpw35vb0bFyOHJA3s8MrcMvlmI3Xd-o39XVDJPHeasucUp5GsDm_yTE3zX9bsg3n_rW3RhEG4ChKvwfyU6oqZOaZTXeWKRlPhR2UQOUl6GWWDxynwbb4"
          alt=""
        />
      </div>
    </>
  );
}
