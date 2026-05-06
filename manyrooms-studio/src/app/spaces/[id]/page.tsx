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


'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, UsersIcon, ArrowRightIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Chatbot from '@/components/Chatbot';
import Footer from '@/components/Footer';

interface Studio {
  id: string;
  name: string;
  location: string;
  city: string;
  area: string;
  description: string;
  longDescription: string;
  pricePerHour: number;
  minHours: number;
  capacity: number;
  floorArea: string;
  amenities: string[];
  useCases: string[];
  images: string[];
  availability: string;
  rating: number;
  reviews: number;
}

// In a real app, this would come from a database
const getStudioData = (id: string): Studio | null => {
  const studios: Record<string, Studio> = {
    'atelier-marais': {
      id: 'atelier-marais',
      name: 'Atelier Marais',
      location: 'Paris • Le Marais',
      city: 'Paris',
      area: 'Le Marais',
      description: 'Warm Haussmannian apartment with terracotta tones and tall windows.',
      longDescription: 'An intimate apartment-style location in the heart of Le Marais. Ochre walls, vintage Scandinavian furniture and tall industrial windows make this an editorial favourite for warm, lived-in storytelling.',
      pricePerHour: 320,
      minHours: 4,
      capacity: 12,
      floorArea: '980 sq ft',
      amenities: ['Natural light', 'Kitchen', 'Wi-Fi'],
      useCases: ['Editorial', 'Interiors', 'Lifestyle film', 'Lookbook'],
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBvvDxan6ygQqPl_Dhs9Usx_F94qKvzJRQrP-lsB2UyU2zRDRBwGfWtWthQRfSJ2P82FmYUK8_AYoW7NaxTXV8J4dY0L2QhM1JqwUgkGVkL7YhWLmCtpO_1tGpRhq0bHqMxJ6tZk9pU9pU9pU9pU9pU',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCNhE3lE1X4w3rL7bJqF6qI5pZkL0sK1jD8fG9hH2jK3lL4zZ5xX6cC7vV8bB9nN0mM',
      ],
      availability: 'Available this week',
      rating: 4.9,
      reviews: 48,
    },
    'arch-house': {
      id: 'arch-house',
      name: 'The Arch House',
      location: 'London • Shoreditch',
      city: 'London',
      area: 'Shoreditch',
      description: 'Vaulted natural-light studio with arched windows and warm oak floors.',
      longDescription: 'A stunning vaulted studio space with original arched windows and warm oak flooring. Perfect for editorial shoots, fashion campaigns, and lifestyle content.',
      pricePerHour: 280,
      minHours: 4,
      capacity: 20,
      floorArea: '1200 sq ft',
      amenities: ['Natural light', 'High ceilings', 'Cyclorama wall', 'Wi-Fi'],
      useCases: ['Editorial', 'Fashion', 'Campaign', 'Content day'],
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq'],
      availability: 'Available this week',
      rating: 4.9,
      reviews: 124,
    },
    'listening-room': {
      id: 'listening-room',
      name: 'The Listening Room',
      location: 'London • Mayfair',
      city: 'London',
      area: 'Mayfair',
      description: 'Walnut-panelled podcast suite with broadcast-grade acoustics.',
      longDescription: 'A dedicated podcast and recording suite with walnut panelling and broadcast-grade acoustics. Ideal for interviews, voice-overs, and audio production.',
      pricePerHour: 180,
      minHours: 2,
      capacity: 6,
      floorArea: '450 sq ft',
      amenities: ['Broadcast mic', 'Acoustic treatment', 'Soundproofing', 'Wi-Fi'],
      useCases: ['Podcast', 'Voice-over', 'Interview', 'Audio production'],
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC3uo9sJREVsvu55f7nYUN4U39aW_z8KVHJogKwCcF74e4qO3um1Vm8L0GNdnC-7qad2ww2ddmQ_NyD4jxu53Urbe728k136lK_MylNvq6GgTep-4C-bErsAl8krw_FjL78x1a4dEfs6e1h6HOMXjZ2sj0AGRr_708J4LzQujsrKe-gtw3ZQrXb1uffQnvMMOsr7bx8QQHvHe9a-G6QRNQ9ffp1z28Z6IGZ-EDJoN6Ej9ecKRdg96wxQWY_5eLsQmE1ID3wQFC90aBW'],
      availability: 'Available this week',
      rating: 4.8,
      reviews: 67,
    },
    'skyline-suite': {
      id: 'skyline-suite',
      name: 'Skyline Suite',
      location: 'Dubai • Downtown',
      city: 'Dubai',
      area: 'Downtown',
      description: 'Minimal penthouse content space with marble floors and 270° views.',
      longDescription: 'A breathtaking penthouse studio with marble floors and panoramic city views. Designed for luxury content, lookbooks, and high-end productions.',
      pricePerHour: 540,
      minHours: 3,
      capacity: 15,
      floorArea: '1500 sq ft',
      amenities: ['Marble floors', 'Floor-to-ceiling windows', 'Skyline views', 'Wi-Fi'],
      useCases: ['Luxury editorial', 'Lookbook', 'Campaign', 'Content day'],
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDd2EelDPKVJ7xPXWWjsxwfWBr7ckj1_BbhrkhbAcoZsZ-G_AmImWhGW7Q_0nA4NaXl8xLOntklDIQ3BX1QUwjgaItBwbl2FQ416yEBPCSdZtmpDrmaB03yMXu2E0bGrl9bovp8DAaPrL5NawayEECeqWxrdT5_pd8nGO_JrlKl7pMUkoUiyvyawmiPzkjBSKpxMZ9xBDVVCufHtyvQkHo01_sq9H2N746US0KF1WOWxeZrNSIweyt_NCapBxLOOe98-vfR3GpY7baK'],
      availability: 'Available this week',
      rating: 4.9,
      reviews: 89,
    },
  };

  return studios[id] || null;
};

// Related studios
const getRelatedStudios = (currentId: string, city: string) => {
  const allStudios = [
    { id: 'arch-house', name: 'The Arch House', location: 'London • Shoreditch', price: 280, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkMzUQ6RolEvzrqSplpw0GtvxvyaQreCCWKIDI5gjWFVW8UkMHWBc1XrOlD4k_GquA7_X7RialiAj41WtNjY8OOiZ77R8hjV5HmvWjQ5W4VYEeHrhyYScnB1LUNvu4R6mgRB3eI8t_1lNT0BBuGMyL4l587n7ydtBMd17jmjSPcybwkWvAGhlhFqJYXEALbui8RiTb3faE4uyjTMr1ilKIoCZEMdcZnewUxdbDJ5P_DwV8FJfMNjb4BWLgI_BZ-aS3vtLUxoTNXlBq' },
    { id: 'listening-room', name: 'The Listening Room', location: 'London • Mayfair', price: 180, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3uo9sJREVsvu55f7nYUN4U39aW_z8KVHJogKwCcF74e4qO3um1Vm8L0GNdnC-7qad2ww2ddmQ_NyD4jxu53Urbe728k136lK_MylNvq6GgTep-4C-bErsAl8krw_FjL78x1a4dEfs6e1h6HOMXjZ2sj0AGRr_708J4LzQujsrKe-gtw3ZQrXb1uffQnvMMOsr7bx8QQHvHe9a-G6QRNQ9ffp1z28Z6IGZ-EDJoN6Ej9ecKRdg96wxQWY_5eLsQmE1ID3wQFC90aBW' },
    { id: 'skyline-suite', name: 'Skyline Suite', location: 'Dubai • Downtown', price: 540, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd2EelDPKVJ7xPXWWjsxwfWBr7ckj1_BbhrkhbAcoZsZ-G_AmImWhGW7Q_0nA4NaXl8xLOntklDIQ3BX1QUwjgaItBwbl2FQ416yEBPCSdZtmpDrmaB03yMXu2E0bGrl9bovp8DAaPrL5NawayEECeqWxrdT5_pd8nGO_JrlKl7pMUkoUiyvyawmiPzkjBSKpxMZ9xBDVVCufHtyvQkHo01_sq9H2N746US0KF1WOWxeZrNSIweyt_NCapBxLOOe98-vfR3GpY7baK' },
  ];
  
  return allStudios.filter(s => s.id !== currentId && (city === 'Paris' ? s.location.includes('London') || s.location.includes('Dubai') : s.location.includes(city) || s.location.includes('Paris'))).slice(0, 3);
};

export default function StudioDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const studio = getStudioData(id);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(4);
  const [brief, setBrief] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  if (!studio) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Studio not found</h1>
          <Link href="/" className="text-brand-dark underline">Return to home</Link>
        </div>
      </div>
    );
  }

  const relatedStudios = getRelatedStudios(id, studio.city);
  
  // Get images: main image, then two smaller images (fill with placeholders if needed)
  const mainImage = studio.images[0] || '';
  const smallImage1 = studio.images[1] || '';
  const smallImage2 = studio.images[2] || '';

  return (
    <div className="home-page min-h-screen bg-brand-light text-brand-dark">
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-brand-light/90 backdrop-blur-md border-b border-brand-dark/5 py-4 px-6">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-xl font-medium tracking-widest uppercase">ManyRooms</Link>
          <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-medium">
            <Link href="/" className="hover:opacity-60 transition-opacity">Home</Link>
            <Link href="/spaces" className="hover:opacity-60 transition-opacity">Spaces</Link>
            <Link href="/cities" className="hover:opacity-60 transition-opacity">Cities</Link>
            <Link href="/how-it-works" className="hover:opacity-60 transition-opacity">How it works</Link>
            <Link href="/about" className="hover:opacity-60 transition-opacity">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signup?role=owner" className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity">List your space</Link>
            <button className="bg-brand-dark text-white px-6 py-2 rounded-full text-xs uppercase tracking-widest">FIND A SPACE</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-brand-dark/50 mb-8">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span>/</span>
          <Link href="/spaces" className="hover:text-brand-dark">Spaces</Link>
          <span>/</span>
          <span className="text-brand-dark">{studio.city}</span>
          <span>/</span>
          <span className="text-brand-dark font-medium">{studio.area}</span>
        </div>

        {/* Image Gallery - 2 column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16">
          {/* Main Large Image - takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={studio.name}
                  className="w-full h-full object-cover"
                  width={800}
                  height={1000}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <PhotoIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Two Smaller Images Stacked - takes 1/3 of the space */}
          <div className="flex flex-col gap-4">
            {/* Small Image 1 */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
              {smallImage1 ? (
                <Image
                  src={smallImage1}
                  alt={`${studio.name} view 2`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  width={400}
                  height={500}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <PhotoIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Small Image 2 */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
              {smallImage2 ? (
                <Image
                  src={smallImage2}
                  alt={`${studio.name} view 3`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  width={400}
                  height={500}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <PhotoIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Studio Info & Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Studio Details */}
          <div>
            {/* Location badge */}
            <div className="text-[10px] uppercase tracking-widest text-brand-dark/50 mb-2">SPACES/{studio.city}</div>
            <h1 className="text-4xl md:text-5xl font-serif mb-2">{studio.area}</h1>
            <h2 className="text-3xl font-serif mb-4">{studio.name}</h2>
            
            {/* Description */}
            <p className="text-brand-dark/60 leading-relaxed mb-6">{studio.longDescription}</p>

            {/* Availability badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {studio.availability}
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-brand-dark/10">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">CAPACITY</p>
                <p className="text-lg font-medium">{studio.capacity} people</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">FLOOR AREA</p>
                <p className="text-lg font-medium">{studio.floorArea}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">LOCATION</p>
                <p className="text-lg font-medium">{studio.area}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">RATING</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{studio.rating}</span>
                  <span className="text-brand-dark/40 text-sm">({studio.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-3">AMENITIES</p>
              <div className="flex flex-wrap gap-2">
                {studio.amenities.map((item) => (
                  <span key={item} className="text-xs border border-brand-dark/10 px-3 py-1.5 rounded-full">{item}</span>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-3">USE CASES</p>
              <div className="flex flex-wrap gap-2">
                {studio.useCases.map((useCase) => (
                  <span key={useCase} className="text-xs text-brand-dark/60">{useCase}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div>
            <div className="bg-brand-light border border-brand-dark/10 rounded-2xl p-6 sticky top-32">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-3xl font-serif">£{studio.pricePerHour}</span>
                  <span className="text-brand-dark/60"> / hour</span>
                  <p className="text-xs text-brand-dark/50 mt-1">{studio.minHours} hour minimum</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">DATE</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-brand-dark/20 rounded-lg px-4 py-3 text-sm focus:border-brand-dark focus:ring-0 outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">GUESTS</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors"
                    >-</button>
                    <span className="text-lg font-medium w-8 text-center">{guests}</span>
                    <button
                      onClick={() => setGuests(Math.min(studio.capacity, guests + 1))}
                      className="w-10 h-10 rounded-full border border-brand-dark/20 flex items-center justify-center hover:bg-brand-dark/5 transition-colors"
                    >+</button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-dark/40 mb-1">TELL US ABOUT YOUR SHOOT</label>
                  <textarea
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    rows={3}
                    placeholder="Brief, dates, mood, references..."
                    className="w-full border border-brand-dark/20 rounded-lg px-4 py-3 text-sm focus:border-brand-dark focus:ring-0 outline-none bg-transparent resize-none"
                  />
                </div>

                <button className="w-full bg-brand-dark text-white py-4 rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-black transition-all">
                  SEND ENQUIRY
                </button>
                <p className="text-center text-xs text-brand-dark/50 mt-3">Typical response within 2 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* You may also love section */}
        {relatedStudios.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-serif">You may also love</h3>
              <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-brand-dark/20 pb-1 hover:opacity-60 transition-opacity flex items-center gap-1">
                VIEW ALL <ArrowRightIcon className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedStudios.map((s) => (
                <Link key={s.id} href={`/spaces/${s.id}`} className="group">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
                    <Image
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      width={400}
                      height={500}
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-brand-dark/50">{s.location}</p>
                      <h4 className="text-xl font-serif mt-1 group-hover:opacity-70 transition-opacity">{s.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-brand-dark/50">From</p>
                      <p className="text-lg font-medium">£{s.price}</p>
                      <p className="text-[10px] text-brand-dark/40">/ hour</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-24 pt-12 border-t border-brand-dark/10">
          <h3 className="text-2xl font-serif mb-8">Frequently Asked</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { q: "What's included in the hire fee?", a: "All standard equipment listed in the amenities section. Additional production support can be arranged separately." },
              { q: "Can I view the space before booking?", a: "Yes, viewing requests can be arranged with the host. Please mention this in your enquiry." },
              { q: "What's your cancellation policy?", a: "Cancellations made 48+ hours before booking are fully refundable." },
              { q: "Do you offer production support?", a: "Yes, experienced crew and equipment hire can be arranged upon request." }
            ].map((faq) => (
              <div key={faq.q}>
                <p className="font-medium mb-2">{faq.q}</p>
                <p className="text-sm text-brand-dark/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}