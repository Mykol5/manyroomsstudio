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


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { MapPinIcon, UsersIcon, ArrowRightIcon, PhotoIcon, HeartIcon, ShareIcon, StarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import Chatbot from '@/components/Chatbot';
import Footer from '@/components/Footer';

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
  const id = params.id as string;
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(4);
  const [brief, setBrief] = useState('');
  const [relatedStudios, setRelatedStudios] = useState<Studio[]>([]);
  const [ownerName, setOwnerName] = useState('');

  useEffect(() => {
    if (id) {
      fetchStudio();
    }
  }, [id]);

  const fetchStudio = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data: studioData, error: studioError } = await supabase
        .from('studios')
        .select('*')
        .eq('id', id)
        .single();

      if (studioError) throw studioError;
      
      if (!studioData) {
        setError('Studio not found');
        setLoading(false);
        return;
      }

      if (studioData.status !== 'approved') {
        setError('This studio is not yet available for booking');
        setLoading(false);
        return;
      }

      setStudio(studioData);

      // Fetch owner name
      if (studioData.owner_id) {
        const { data: owner } = await supabase
          .from('users')
          .select('name')
          .eq('id', studioData.owner_id)
          .single();
        if (owner) setOwnerName(owner.name || 'Studio Owner');
      }

      const { data: relatedData, error: relatedError } = await supabase
        .from('studios')
        .select('*')
        .eq('status', 'approved')
        .eq('city', studioData.city)
        .neq('id', id)
        .limit(3);

      if (!relatedError && relatedData) {
        setRelatedStudios(relatedData);
      }

    } catch (err: any) {
      console.error('Error fetching studio:', err);
      setError(err.message || 'Failed to load studio');
    } finally {
      setLoading(false);
    }
  };

  const getMainImage = () => {
    if (!studio?.images || studio.images.length === 0) return null;
    return studio.images[0];
  };

  const getSmallImage1 = () => {
    if (!studio?.images || studio.images.length < 2) return null;
    return studio.images[1];
  };

  const getSmallImage2 = () => {
    if (!studio?.images || studio.images.length < 3) return null;
    return studio.images[2];
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  const formatLocation = () => {
    if (!studio) return '';
    const parts = [studio.city, studio.state].filter(Boolean);
    return parts.join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
          <p className="text-[#424937]">Loading studio...</p>
        </div>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 text-[#737a65]">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">{error || 'Studio not found'}</h1>
          <p className="text-[#424937] mb-8">The studio you're looking for doesn't exist or isn't available yet.</p>
          <Link href="/spaces" className="inline-block bg-[#446900] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#446900]/90 transition-all">
            Browse all spaces
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = getMainImage();
  const smallImage1 = getSmallImage1();
  const smallImage2 = getSmallImage2();

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] font-body-md overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 shadow-sm">
        <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-[1440px] mx-auto">
          <Link href="/" className="text-2xl font-display-sm tracking-tighter text-[#446900] hover:scale-105 transition-transform duration-200">
            ManyRooms
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-[#446900] font-bold border-b-2 border-[#446900] font-body-md">Marketplace</Link>
            <Link href="/spaces" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Studios</Link>
            <Link href="/cities" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Vibes</Link>
            <Link href="/about" className="text-[#424937] hover:text-[#446900] transition-colors font-body-md">Journal</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="p-2 text-[#424937] hover:text-[#446900] transition-colors">
                <span className="material-symbols-outlined">favorite</span>
              </button>
              <button className="p-2 text-[#424937] hover:text-[#446900] transition-colors">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
            <Link 
              href="/signup?role=owner"
              className="hidden md:block bg-[#beff5f] text-[#111f00] font-label-bold px-6 py-2.5 rounded-full hover:scale-105 transition-transform active:scale-95"
            >
              List Studio
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          {/* Dynamic Header & Quick Actions */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#beff5f] text-[#111f00] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                  Featured Studio
                </span>
                <span className="bg-[#e4d7fd] text-[#665c7c] font-label-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.98 (124 Reviews)
                </span>
              </div>
              <h1 className="text-[48px] md:text-[84px] font-display-sm md:font-display-lg leading-[56px] md:leading-[92px] tracking-[-0.02em] md:tracking-[-0.04em] font-extrabold -ml-1">
                {studio.name}
              </h1>
              <div className="flex items-center gap-2 text-[#424937]">
                <span className="material-symbols-outlined">location_on</span>
                <span className="text-lg">{formatLocation()} • Creative Quarter</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
                <span className="material-symbols-outlined">share</span> Share
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-[#c2c9b1] rounded-full font-label-bold hover:bg-[#edeeef] transition-colors">
                <span className="material-symbols-outlined">favorite</span> Save
              </button>
            </div>
          </header>

          {/* Immersive Hero Gallery */}
          <section className="grid grid-cols-12 gap-4 h-[500px] md:h-[750px] mb-24 overflow-hidden rounded-3xl group">
            <div className="col-span-12 md:col-span-8 relative overflow-hidden h-full">
              {mainImage ? (
                <img 
                  src={mainImage}
                  alt={studio.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <PhotoIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="hidden md:grid col-span-4 grid-rows-2 gap-4 h-full">
              <div className="relative overflow-hidden">
                {smallImage1 ? (
                  <img 
                    src={smallImage1}
                    alt={`${studio.name} view 2`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="relative overflow-hidden">
                {smallImage2 ? (
                  <img 
                    src={smallImage2}
                    alt={`${studio.name} view 3`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <button className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full font-label-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform active:scale-95">
                  <span className="material-symbols-outlined">grid_view</span> View all {studio.images?.length || 0} photos
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
            {/* Main Content Left */}
            <div className="md:col-span-7 lg:col-span-8 space-y-24">
              {/* Studio Story & Vibe */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
                  <span className="font-label-bold uppercase tracking-[0.2em] text-[#424937]">The Vibe</span>
                  <div className="h-px flex-1 bg-[#c2c9b1]/30"></div>
                </div>
                <div className="mb-12">
                  <h2 className="text-[32px] font-headline-lg mb-6">Industrial Brutalist meets High-Fashion.</h2>
                  <p className="text-lg text-[#424937] leading-relaxed max-w-2xl mb-8">
                    {studio.description || 'A beautiful creative space ready for your next project. Designed for high-end editorial shoots, cinematic productions, and immersive brand activations.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {studio.amenities && studio.amenities.slice(0, 5).map((item) => (
                      <span key={item} className="bg-[#e7e8e9] px-4 py-2 rounded-full font-label-bold text-xs uppercase">
                        {item}
                      </span>
                    ))}
                    <span className="bg-[#e7e8e9] px-4 py-2 rounded-full font-label-bold text-xs uppercase">Premium Space</span>
                  </div>
                </div>
              </section>

              {/* Equipment & Amenities */}
              <section>
                <h2 className="text-[32px] font-headline-lg mb-8">Gear & Essentials</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {studio.amenities && studio.amenities.map((item) => (
                    <div key={item} className="flex items-start gap-4 p-6 bg-[#f3f4f5] rounded-2xl border border-[#c2c9b1]/10 hover:border-[#446900]/30 transition-all group">
                      <span className="material-symbols-outlined text-[#446900] bg-[#beff5f] p-3 rounded-xl group-hover:scale-110 transition-transform">
                        check_box_outline_blank
                      </span>
                      <div>
                        <h4 className="font-label-bold mb-1">{item}</h4>
                        <p className="text-sm text-[#424937]">Professional grade equipment included.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Host Profile & Reviews */}
              <section className="p-8 md:p-12 rounded-3xl bg-[#e4d7fd]/30 border border-[#e4d7fd]">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 ring-4 ring-white shadow-xl">
                    <div className="w-full h-full bg-[#446900] flex items-center justify-center text-white text-3xl font-bold">
                      {ownerName.charAt(0) || 'S'}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-[32px] font-headline-lg">Hosted by {ownerName || 'Studio Owner'}</h2>
                    <p className="text-base text-[#424937]">Creative Director & Curator. Dedicated to ensuring every creator has the tools and atmosphere needed to excel.</p>
                    <div className="flex gap-4">
                      <button className="bg-[#191c1d] text-[#f8f9fa] px-6 py-2.5 rounded-full font-label-bold text-sm hover:opacity-90 transition-opacity">
                        Contact Host
                      </button>
                      <div className="flex items-center gap-2 text-[#424937] font-label-bold">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Identity Verified
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-1 text-[#446900]">
                        <StarIcon className="w-5 h-5 fill-current" />
                        <StarIcon className="w-5 h-5 fill-current" />
                        <StarIcon className="w-5 h-5 fill-current" />
                        <StarIcon className="w-5 h-5 fill-current" />
                        <StarIcon className="w-5 h-5 fill-current" />
                      </div>
                      <p className="text-base italic">"The lighting in this space is unreal. We didn't even need our secondary rig for the first half of the shoot."</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e1e3e4]"></div>
                        <span className="font-label-bold text-xs uppercase">Marcus T., Vogue Italia</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-1 text-[#446900]">
                        <StarIcon className="w-5 h-5 fill-current" />
                        <StarIcon className="w-5 h-5 fill-current" />
                        <StarIcon className="w-5 h-5 fill-current" />
                        <StarIcon className="w-5 h-5 fill-current" />
                        <StarIcon className="w-5 h-5 fill-current" />
                      </div>
                      <p className="text-base italic">"Incredible textures. The brick and concrete mix is perfect for streetwear looks. Efficient load-in and great coffee nearby!"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e1e3e4]"></div>
                        <span className="font-label-bold text-xs uppercase">Sarah L., Creative Agency</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Location Map */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[32px] font-headline-lg">Where you'll be</h2>
                  <span className="font-label-bold text-[#446900]">{studio.city}, {studio.state}</span>
                </div>
                <div className="w-full h-96 rounded-3xl overflow-hidden shadow-inner grayscale contrast-125 border border-[#c2c9b1] relative group">
                  <div className="absolute inset-0 bg-[#446900]/5 pointer-events-none z-10"></div>
                  <div className="w-full h-full bg-[#edeeef] flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="w-12 h-12 text-[#446900] mx-auto mb-2" />
                      <p className="text-[#424937]">{formatLocation()}</p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-12 h-12 bg-[#beff5f] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <span className="material-symbols-outlined text-[#111f00] font-bold">location_on</span>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#446900]/20 rounded-full animate-ping"></div>
                  </div>
                </div>
                <p className="mt-6 text-base text-[#424937]">Located in the heart of the creative hub. Walking distance from major stations. Surrounded by world-class coffee shops and supply stores.</p>
              </section>
            </div>

            {/* Sticky Booking Sidebar */}
            <aside className="md:col-span-5 lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="bg-white/70 backdrop-blur-[20px] border border-white/40 shadow-[0_20px_40px_-15px_rgba(99,89,121,0.1)] p-8 rounded-[32px]">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <span className="text-[#424937] font-label-bold text-xs uppercase tracking-widest block mb-1">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold">{formatPrice(studio.hourly_rate)}</span>
                        <span className="text-[#424937]">/ hour</span>
                      </div>
                    </div>
                    <div className="bg-[#beff5f] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">Top Rated</div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-1 gap-2">
                      <label className="font-label-bold text-xs uppercase text-[#424937] ml-2">Date</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#beff5f] transition-all outline-none"
                        />
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#424937] pointer-events-none">calendar_today</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-label-bold text-xs uppercase text-[#424937] ml-2">Start</label>
                        <select className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#beff5f] appearance-none outline-none">
                          <option>09:00 AM</option>
                          <option>10:00 AM</option>
                          <option>11:00 AM</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-bold text-xs uppercase text-[#424937] ml-2">End</label>
                        <select className="w-full bg-[#f3f4f5] border-0 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-[#beff5f] appearance-none outline-none">
                          <option>01:00 PM</option>
                          <option>02:00 PM</option>
                          <option>03:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 border-t border-[#c2c9b1]/20 pt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#424937]">${studio.hourly_rate} x 4 hours</span>
                      <span>${studio.hourly_rate * 4}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#424937]">Cleaning Fee</span>
                      <span>$45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#424937]">ManyRooms Service Fee</span>
                      <span>$32</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span>Total</span>
                      <span className="text-[#446900]">${studio.hourly_rate * 4 + 77}</span>
                    </div>
                  </div>

                  <button className="w-full bg-[#beff5f] text-[#111f00] font-display-sm text-lg py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-[0_10px_30px_-5px_rgba(190,255,95,0.4)] active:scale-95">
                    Request to Book
                  </button>
                  <p className="text-center text-[10px] text-[#424937] mt-4 uppercase font-label-bold tracking-tighter">You won't be charged yet</p>
                </div>

                <div className="bg-[#edeeef] p-6 rounded-[24px] flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#446900] text-3xl">verified_user</span>
                  <div className="text-xs">
                    <p className="font-bold mb-1">ManyRooms Protection</p>
                    <p className="text-[#424937]">Every booking includes damage protection and host liability insurance.</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* You may also love section */}
          {relatedStudios.length > 0 && (
            <div className="mt-24">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[32px] font-headline-lg">You may also love</h3>
                <Link href="/spaces" className="text-xs uppercase tracking-widest border-b border-[#191c1d]/20 pb-1 hover:opacity-60 transition-opacity flex items-center gap-1">
                  VIEW ALL <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedStudios.map((s) => (
                  <Link key={s.id} href={`/spaces/${s.id}`} className="group">
                    <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
                      {s.images && s.images[0] ? (
                        <img
                          src={s.images[0]}
                          alt={s.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <PhotoIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#424937]">{s.city}, {s.state}</p>
                        <h4 className="text-xl font-bold mt-1 group-hover:opacity-70 transition-opacity">{s.name}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-[#424937]">From</p>
                        <p className="text-lg font-medium">{formatPrice(s.hourly_rate)}</p>
                        <p className="text-[10px] text-[#424937]">/ hour</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-24 pt-12 border-t border-[#c2c9b1]/10">
            <h3 className="text-[32px] font-headline-lg mb-8">Frequently Asked</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { q: "What's included in the hire fee?", a: "All standard equipment listed in the amenities section. Additional production support can be arranged separately." },
                { q: "Can I view the space before booking?", a: "Yes, viewing requests can be arranged with the host. Please mention this in your enquiry." },
                { q: "What's your cancellation policy?", a: "Cancellations made 48+ hours before booking are fully refundable." },
                { q: "Do you offer production support?", a: "Yes, experienced crew and equipment hire can be arranged upon request." }
              ].map((faq) => (
                <div key={faq.q}>
                  <p className="font-bold mb-2">{faq.q}</p>
                  <p className="text-sm text-[#424937]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}