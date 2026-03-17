'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import './home.css';

export default function HomePage() {
  const [currentMonth] = useState('March 2026');

  return (
    <div className="home-page">
      {/* BEGIN: Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tighter">
            MANYROOMS<span className="text-gray-400">.</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-medium uppercase tracking-widest">
            <Link href="#studios" className="hover:opacity-60 transition-opacity">Studios</Link>
            <Link href="#services" className="hover:opacity-60 transition-opacity">Services</Link>
            <Link href="#about" className="hover:opacity-60 transition-opacity">About</Link>
            <Link href="#contact" className="hover:opacity-60 transition-opacity">Contact</Link>
          </div>

          {/* CTA */}
          <div className="flex items-center">
            <Link
              href="/booking"
              className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-opacity-80 transition-all uppercase tracking-tight"
            >
              Book a Tour
            </Link>
          </div>
        </nav>
      </header>
      {/* END: Navigation */}

      {/* BEGIN: Hero Section */}
      <section className="relative pt-32 pb-20 min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background Imagery */}
        <div className="absolute inset-0 z-0">
          <Image
            alt="Minimalist Studio Space"
            className="w-full h-full object-cover opacity-10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2JfhXTeapUY-u7Gau6BCQcrlkoiCZfJhB2AQMeW9PFSfjJQbLn5NQ2JsLlG9FZ-gPLNdfD4RnRj2eJ1PzwpQeyKIZgT1Yt956NC9xowg5rg7_AMAH74NxgaHBXBQZkZuNi9cA7MeTicdVjVblfpkTe__2avioRr3gxaZSDYzT8OTRpRkGyp5B_TxnUdbqh0pZp-3hkWE3Y2KS_dqqhE7KvrmDaLjJS4fWJBdMFJObN6ylIY0aYCvJ-4i3XnrexrEgO9JNE1TzrrgJ"
            width={1920}
            height={1080}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Search Interface */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-white border border-gray-200 p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2">
              <div className="w-full flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Studio Type</label>
                <input
                  className="w-full border-none p-0 focus:ring-0 text-sm font-semibold placeholder-gray-300 outline-none"
                  placeholder="Fashion, Music, Film..."
                  type="text"
                />
              </div>
              <div className="w-full flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Where?</label>
                <input
                  className="w-full border-none p-0 focus:ring-0 text-sm font-semibold placeholder-gray-300 outline-none"
                  placeholder="City or Region"
                  type="text"
                />
              </div>
              <div className="w-full flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</label>
                <input
                  className="w-full border-none p-0 focus:ring-0 text-sm font-semibold text-gray-500 outline-none"
                  type="date"
                />
              </div>
              <div className="w-full flex-1 px-6 py-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time Range</label>
                <select className="w-full border-none p-0 focus:ring-0 text-sm font-semibold text-gray-500 bg-transparent outline-none">
                  <option>Full Day</option>
                  <option>Half Day (AM)</option>
                  <option>Half Day (PM)</option>
                  <option>Hourly</option>
                </select>
              </div>
              <button className="w-full md:w-auto bg-black text-white p-4 md:p-5 rounded-full hover:scale-105 transition-transform">
                <MagnifyingGlassIcon className="h-6 w-6 mx-auto" />
              </button>
            </div>
          </div>

          {/* Bold Headline */}
          <div className="text-center">
            <h1 className="hero-title text-[clamp(3rem,12vw,10rem)] font-extrabold uppercase mb-8">
              Space For<br />Visionaries.
            </h1>
            <p className="max-w-xl mx-auto text-lg text-gray-500 font-medium leading-relaxed">
              Premium production environments curated for the world's most ambitious creative agencies and independent makers.
            </p>
          </div>
        </div>
      </section>
      {/* END: Hero Section */}

      {/* BEGIN: Portfolio Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Our Work</h2>
              <h3 className="text-5xl font-extrabold">The Portfolio</h3>
            </div>
            <Link href="/portfolio" className="text-sm font-bold underline underline-offset-8">
              VIEW ALL PROJECTS
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
                <Image
                  alt="Fashion shoot"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6H2Fw4On5Ax2Ql4j1hHDRKR9Yoko5LZKysMxFIzyYp2OkY_pzr_T2aQBW5lWj-9nDVC387WjwKOGeST-5fj2Ik-1KWlBg86gU2BQNdavfu4WX5ZRjBCIPgzVYP0HSxMZ9aBYz56fyLwaLpq75DPi04J7LFkaRoIvmG-Tll8K59gbDMMs9q-fF6JWhCftyrM48XT4dVJhCbmYTjrbW6OU-uE-Ec_YBOT28NmYJWe50Mpp7yog1Y2x6EB0l9UzwIGT3qyB0IRy0a0nZ"
                  width={600}
                  height={750}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <PlayIcon className="w-6 h-6 ml-1" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Fashion Editorial</p>
              <h4 className="text-xl font-bold italic">Vogue x House of Marra</h4>
            </div>

            {/* Project 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
                <Image
                  alt="Music video"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl-g1O1-ldnmCmAN2asF6zE-OY2wUuyUyZq4rif2SlpBWksqE3xSubgs7jJcT1n79j5-BYwLrvFM1XzPur1lRNooAa-NE1AKlvsi90plsWgQ8XKLVDvmEU-ybpWMf7XxjAT0U_aUCoMj_fvXV4k3FpX9vAXaNafpTr_tZHloklpzFtn6_EDeCBXG0e3wyU8lMmJWIfmy0xsvU3_XGrH0fh5JlCBoXYLJ-qzyZDsViSuuWiJFLc1VHabJsD2bAcTr7toqfayqJNT2Mv"
                  width={600}
                  height={750}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <PlayIcon className="w-6 h-6 ml-1" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Music Video</p>
              <h4 className="text-xl font-bold italic">Lunar Echoes — Official Film</h4>
            </div>

            {/* Project 3 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden mb-6">
                <Image
                  alt="Interview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3qTtbdx84VTXlEx_wwcDHFUgzMal_n9hg3_d7O-jIY_l3dgsQh1cnAruQqWfX3QL89CYU7PmKXhUIAK90uAxqmmay_ksRBLB7wiAxRfSiyCCrYO3pzE3ZN56OexDY71n19g0srXven_NryTLiUNkVtrwwrH31TWtGkZNV0DvXpFfbChmSBW-ttqBW2nnC__CoFP43PQj11LKP12E9jo5fLEuDMOg_8vNG-iF48kcGgoWHwUXsiKuqpj1neLZj-aJOKKjCbtoBuJeR"
                  width={600}
                  height={750}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <PlayIcon className="w-6 h-6 ml-1" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Branded Content</p>
              <h4 className="text-xl font-bold italic">The Architects Series</h4>
            </div>
          </div>
        </div>
      </section>
      {/* END: Portfolio Section */}

      {/* BEGIN: Global Footprint */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Locations</h2>
            <h3 className="text-5xl font-extrabold">Global Footprint</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* NYC */}
            <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
              <Image
                alt="NYC"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxF9KiXpmr47byjlIR1OxHP3kpCxV0__PBCKlFHTRoc1SQAIItuYlfmDr1Q_jwEB7VUNICPizER9XgXErCTmQx6PtRmVWAw8mtfsAw1oZpB_RwC8Pljvfntzy_Hjwu5HtevCqxoEBl1RYIUeyvW866mpHcgI2dbuStMC7H2fD_TqfCTOxQ9VBl0G-RF6WoZM8FYur9CxyA_YtgdZfk3MIQS7eFriS9cp7dmul_L26hrajzG3rT19VA1fxvGWtyoJVNobVRm8a28oIg"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg">NYC</span>
              </div>
            </div>

            {/* London */}
            <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
              <Image
                alt="London"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF388dNc5LzjoMDNI4m1SB6JoLpUscTPSYMXCrJlLV_mIcaHOq00KR1Hs-sCsM238ejZWATi6_UOC390ZevRvhu7oGw-iA9dpbarnFK_SqnmrdGu8Z91065sP1KVT7eOddAzdYkZhmYX7P_tjHmdrD67fdfA5QQXq8AgsywbQvVwb7kLv4PFvMhS7IIBDTta36eOmVGkhsnRiA3pMR2C_ger8oZmS0QY7GO-sXzEFcLf1q3g5EbwheqzdLXiT_wEKnNoGH0kSbuMmY"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg">LONDON</span>
              </div>
            </div>

            {/* Paris */}
            <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
              <Image
                alt="Paris"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuThCWC0giax8u8XkKWOy-dHMF5q325dcfq8zJn_VjABGkdF3FewlXKfF8bQsn-_s4t-a4aNMWtqjDJeKiVutkqbtuieOC0XTVVObJlcy55nQnsEdpsJNQk_qehaXZFf9oKnB0CyHfDKDeJB9AJPQgVxdmt0EZykseVGQwYcl2W6UIYtJV9bovcLC9sIgk72r4JOd8qFy2BzjPF1RjRvUkCqpvE2byITeDgWhAcdUHINUCydOl1yH82y0ZmQP-tokTrZCj6HUO3dkO"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg">PARIS</span>
              </div>
            </div>

            {/* Berlin */}
            <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
              <Image
                alt="Berlin"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTXQeg62oRcSwobcv8ciy1Rxztq-jjVwYHYzA8Dv6kEHHnKT_toal4cqhjxnDEIAl6I33J6SXi1_P_1FH1YgmClpnbQtGty86drNI-B36hhz2pCJ3JlUyIrPE4AZOdMrGFRmRWvmAwlxTySskUvzSFdfO2ouH8f6WW1GYvB_f7PNylICCeDm6hpXsXE4GSiaWjkQ_2waauCsgRQ3kxYdq6aBJ8yn-X3UTY1FU_3_cMAZtimekni5ASEQbfyoKaeXgrdq7dRiaEPI8t"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg">BERLIN</span>
              </div>
            </div>

            {/* Tokyo */}
            <div className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg">
              <Image
                alt="Tokyo"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdLPuH-mWUPpDEyQRs5BWstk6PQKiAeP5aoX0K_kAVZmg0MAxE5ILeFhSOYL_pzqnSz0fhjiOnDjJMtUsuIDLhVuOnd2LZocLT8ytnhFhKCGma8tBSrl_A2AxE_HdwPsquhr9gzkhUfpUedqHfjH87MeWL7DtKpZuB4fGK7P9ooO44PTHhM3s6teYozk23RAkvadKewmc4p4AQTEoEW9csNIzSrBB7MisR4j9mvVIZoHi9xWvr2PB5z9EvnBH2TaDccPHRHJ2Bbtq5"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <span className="text-white font-bold text-lg">TOKYO</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Global Footprint */}

      {/* BEGIN: Availability Section */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Booking</h2>
              <h3 className="text-5xl font-extrabold mb-8 leading-tight">Live<br />Availability</h3>
              <p className="text-gray-500 mb-10 max-w-sm">
                Select a date and studio type to see real-time availability across our network. No more back-and-forth emails.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm font-bold">Studio A (Cyclorama) — Available</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-4 h-4 rounded-full bg-orange-400"></div>
                  <span className="text-sm font-bold">Studio B (Loft) — Limited</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm font-bold">Studio C (Green Screen) — Booked</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-8 border border-gray-200 shadow-xl rounded-3xl">
              {/* Calendar UI */}
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-bold text-xl uppercase tracking-tighter">{currentMonth}</h4>
                <div className="flex gap-2">
                  <button className="p-2 border rounded-full hover:bg-gray-50">
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 border rounded-full hover:bg-gray-50">
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {/* Previous month days */}
                {[1, 2, 3, 4, 5].map((day) => (
                  <div key={`prev-${day}`} className="aspect-square flex items-center justify-center text-gray-200">
                    {26 + day - 1}
                  </div>
                ))}

                {/* Current month days with indicators */}
                {[1, 2].map((day) => (
                  <button key={`day-${day}`} className="aspect-square flex items-center justify-center rounded-xl border border-gray-100 font-bold hover:bg-black hover:text-white transition-colors">
                    {day}
                  </button>
                ))}

                {[3, 4, 5, 6, 7, 8, 9].map((day) => (
                  <button key={`day-${day}`} className="aspect-square flex flex-col items-center justify-center rounded-xl border border-gray-100 font-bold hover:bg-black hover:text-white transition-colors">
                    <span>{day}</span>
                    <div className="w-1 h-1 bg-green-500 rounded-full mt-1"></div>
                  </button>
                ))}

                <button className="aspect-square flex flex-col items-center justify-center rounded-xl bg-black text-white font-bold">
                  <span>10</span>
                  <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
                </button>

                {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].map((day) => (
                  <button key={`day-${day}`} className="aspect-square flex flex-col items-center justify-center rounded-xl border border-gray-100 font-bold hover:bg-black hover:text-white transition-colors">
                    <span>{day}</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full mt-1"></div>
                  </button>
                ))}
              </div>

              <button className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* END: Availability Section */}

      {/* BEGIN: CTA Section */}
      {/* <section className="flex flex-col md:flex-row">
        <div className="flex-1 bg-black text-white p-20 flex flex-col justify-center items-start border-r border-white/10 group cursor-pointer relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold mb-6">List Your Studio</h3>
            <p className="text-gray-400 mb-8 max-w-xs">Join our network of premium production spaces and reach high-tier clients.</p>
            <span className="text-sm font-bold border-b-2 border-white pb-2">PARTNER WITH US</span>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 scale-150 group-hover:scale-125 transition-transform duration-1000">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path>
            </svg>
          </div>
        </div>

        <div className="flex-1 bg-white text-black p-20 flex flex-col justify-center items-start group cursor-pointer relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold mb-6">Become a Franchisee</h3>
            <p className="text-gray-500 mb-8 max-w-xs">Bring the ManyRooms standard to your city with our end-to-end management system.</p>
            <span className="text-sm font-bold border-b-2 border-black pb-2">LEARN MORE</span>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4 scale-150 group-hover:scale-125 transition-transform duration-1000">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
            </svg>
          </div>
        </div>
      </section> */}
      {/* BEGIN: CTA Section */}
<section className="flex flex-col md:flex-row">
  <Link 
    href="/signup?role=owner" 
    className="flex-1 bg-black text-white p-20 flex flex-col justify-center items-start border-r border-white/10 group cursor-pointer relative overflow-hidden"
  >
    <div className="relative z-10">
      <h3 className="text-4xl font-extrabold mb-6">List Your Studio</h3>
      <p className="text-gray-400 mb-8 max-w-xs">Join our network of premium production spaces and reach high-tier clients.</p>
      <span className="text-sm font-bold border-b-2 border-white pb-2">PARTNER WITH US</span>
    </div>
    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 scale-150 group-hover:scale-125 transition-transform duration-1000">
      <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path>
      </svg>
    </div>
  </Link>

  <Link 
    href="/signup?role=franchisee" 
    className="flex-1 bg-white text-black p-20 flex flex-col justify-center items-start group cursor-pointer relative overflow-hidden"
  >
    <div className="relative z-10">
      <h3 className="text-4xl font-extrabold mb-6">Become a Franchisee</h3>
      <p className="text-gray-500 mb-8 max-w-xs">Bring the ManyRooms standard to your city with our end-to-end management system.</p>
      <span className="text-sm font-bold border-b-2 border-black pb-2">LEARN MORE</span>
    </div>
    <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4 scale-150 group-hover:scale-125 transition-transform duration-1000">
      <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
      </svg>
    </div>
  </Link>
</section>
{/* END: CTA Section */}
      {/* END: CTA Section */}

      {/* BEGIN: Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-24">
            <div className="col-span-2">
              <div className="text-3xl font-extrabold tracking-tighter mb-8">MANYROOMS.</div>
              <p className="text-xl font-medium text-gray-500 max-w-md">
                The modern standard for creative production spaces. Globally available, locally curated.
              </p>
            </div>

            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Inquiries</h5>
              <a href="mailto:hello@manyrooms.io" className="text-lg font-bold hover:opacity-60 transition-opacity">
                hello@manyrooms.io
              </a>
              <div className="mt-4 text-gray-500 text-sm">
                +1 (555) 902-8800<br />
                224 W 30th St, New York, NY
              </div>
            </div>

            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Social</h5>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-sm font-bold hover:translate-x-1 transition-transform">Instagram</a>
                <a href="#" className="text-sm font-bold hover:translate-x-1 transition-transform">LinkedIn</a>
                <a href="#" className="text-sm font-bold hover:translate-x-1 transition-transform">Vimeo</a>
                <a href="#" className="text-sm font-bold hover:translate-x-1 transition-transform">Twitter</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100 gap-6">
            <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <a href="#" className="hover:text-black">Privacy Policy</a>
              <a href="#" className="hover:text-black">Terms of Service</a>
              <a href="#" className="hover:text-black">Cookies</a>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              © 2023 ManyRooms Agency Group.
            </div>
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </div>
  );
}








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
