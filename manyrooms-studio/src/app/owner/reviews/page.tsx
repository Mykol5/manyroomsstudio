// app/owner/reviews/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  StarIcon,
  ChatBubbleLeftIcon,
  FlagIcon,
  PencilIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

// Brand Colors
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  brown: '#DB8B8C',
  dark: '#3C291C',
};

interface Review {
  id: string;
  clientName: string;
  rating: number;
  date: string;
  content: string;
  response?: { text: string; date: string };
  isFlagged?: boolean;
}

interface RatingDistribution {
  stars: number;
  percentage: number;
  count: number;
}

export default function OwnerReviews() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [showResponseEditor, setShowResponseEditor] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const ratingDistribution: RatingDistribution[] = [
    { stars: 5, percentage: 92, count: 114 },
    { stars: 4, percentage: 6, count: 7 },
    { stars: 3, percentage: 2, count: 3 },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 },
  ];

  const [reviews, setReviews] = useState<Review[]>([
    { id: '1', clientName: 'Marcus Sterling', rating: 5, date: 'MAY 14, 2024', content: 'The light in the North Studio was absolutely breathtaking for our seasonal campaign. The minimalist aesthetic perfectly matched our brand vision. Impeccable cleanliness and the owner was exceptionally accommodating.' },
    { id: '2', clientName: 'Elena Rossi', rating: 5, date: 'MAY 10, 2024', content: 'Beautiful space. The acoustic treatment was better than expected for a loft conversion. My only note would be the elevator was a bit slow, but once inside, the experience was premium.', response: { text: 'Thank you, Elena! We\'re thrilled the acoustics worked for your session. We are currently working with the building management to improve the lift access. Hope to host you again soon.', date: 'MAY 12, 2024' } },
    { id: '3', clientName: 'David Chen', rating: 5, date: 'APRIL 28, 2024', content: 'The perfect sanctuary for creative thought. The Atelier represents the gold standard for studio rentals in the city. High ceilings, premium textures, and a silent environment.' },
    { id: '4', clientName: 'Sophia Martinez', rating: 4, date: 'APRIL 20, 2024', content: 'Great space overall! The natural lighting was perfect for our shoot. Only minor issue was the air conditioning was a bit loud during quiet moments.' },
    { id: '5', clientName: 'James Wilson', rating: 5, date: 'APRIL 15, 2024', content: 'Absolutely stunning studio. The attention to detail in the design is incredible. Will definitely be booking again for our next campaign.' },
    { id: '6', clientName: 'Olivia Chen', rating: 5, date: 'APRIL 10, 2024', content: 'One of the best studio experiences I\'ve had. The team was incredibly helpful and the space was pristine.' },
    { id: '7', clientName: 'Liam O\'Connor', rating: 3, date: 'APRIL 5, 2024', content: 'Nice space but parking was difficult to find. The studio itself was great though.' },
    { id: '8', clientName: 'Emma Thompson', rating: 5, date: 'MARCH 28, 2024', content: 'Absolutely perfect for our fashion editorial. The moody lighting options were exactly what we needed.' },
    { id: '9', clientName: 'Noah Williams', rating: 5, date: 'MARCH 20, 2024', content: 'Incredible space with top-notch equipment. The owner was very accommodating and communicative.' },
    { id: '10', clientName: 'Isabella Garcia', rating: 4, date: 'MARCH 15, 2024', content: 'Beautiful studio with great natural light. Would love to see more props available for use.' },
  ]);

  const totalReviews = 124;
  const averageRating = 4.9;
  const ratingIncrease = 0.2;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleReply = (reviewId: string) => {
    if (responseText.trim()) {
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, response: { text: responseText, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() } } : r));
      setShowResponseEditor(null); setResponseText('');
    }
  };

  const handleFlagReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isFlagged: true } : r));
  };

  const handleEditResponse = (reviewId: string, currentResponse: string) => {
    setResponseText(currentResponse); setShowResponseEditor(reviewId);
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => star <= rating ? <StarSolidIcon key={star} className="w-4 h-4 text-[#F1CB81]" /> : <StarIcon key={star} className="w-4 h-4 text-[#3C291C]/20" />)}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFBF5] p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-[#3C291C] tracking-tight">Reviews & Ratings</h2>
          <p className="text-[#3C291C]/60 text-sm mt-1">Manage your reputation. Monitor feedback and engage with your creative community.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Stats */}
          <div className="space-y-6">
            
            {/* Rating Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3C291C]/10">
              <div className="text-center mb-6">
                <p className="text-[#3C291C]/40 text-sm mb-2 uppercase tracking-widest font-bold">Current Standing</p>
                <p className="text-7xl font-extrabold text-[#3C291C]">{averageRating}</p>
                <div className="flex justify-center mt-2">{renderStars(5)}</div>
                <p className="text-[#3C291C]/40 text-sm mt-2">Based on {totalReviews} Reviews</p>
              </div>
              <div className="space-y-3">
                {ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-14">
                      <span className="text-sm font-bold text-[#3C291C]">{dist.stars}</span>
                      <StarSolidIcon className="w-3 h-3 text-[#F1CB81]" />
                    </div>
                    <div className="flex-1 bg-[#3C291C]/10 rounded-full h-2">
                      <div className="bg-[#F1CB81] h-2 rounded-full" style={{ width: `${dist.percentage}%` }}></div>
                    </div>
                    <span className="text-xs text-[#3C291C]/40 w-12">{dist.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Insight */}
            <div className="bg-[#F1CB81]/20 border border-[#F1CB81]/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#F1CB81] flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-[#3C291C]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#3C291C]">Growth Insight</h3>
              </div>
              <p className="text-[#3C291C]/70 text-sm">Your rating increased by <span className="text-[#3C291C] font-bold">{ratingIncrease}</span> this month. Consistent replies to reviews are driving visibility.</p>
            </div>

            {/* Elite Status */}
            <div className="bg-[#DB8B8C]/10 border border-[#DB8B8C]/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#DB8B8C]/20 flex items-center justify-center">
                  <TrophyIcon className="w-5 h-5 text-[#DB8B8C]" />
                </div>
                <h3 className="text-lg font-extrabold text-[#3C291C]">Elite Status</h3>
              </div>
              <p className="text-[#3C291C]/70 text-sm">You're in the top <span className="text-[#DB8B8C] font-bold">3%</span> of studio owners for guest satisfaction. Keep up the excellence.</p>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-[#3C291C]">Individual Feedback</h3>
              <select className="bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-3 py-1.5 text-sm text-[#3C291C] outline-none">
                <option>Most Recent</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
            </div>

            <div className="space-y-5">
              {currentReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#3C291C]/10">
                  
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F1CB81] flex items-center justify-center text-[#3C291C] font-bold">{review.clientName.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-[#3C291C]">{review.clientName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-[#3C291C]/40">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleFlagReview(review.id)} className="p-2 text-[#3C291C]/30 hover:text-[#DB8B8C] transition-colors" title="Flag Review">
                      <FlagIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[#3C291C]/70 text-sm leading-relaxed mb-4">{review.content}</p>

                  {/* Owner Response */}
                  {review.response && (
                    <div className="mt-4 pl-4 border-l-2 border-[#F1CB81]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#F1CB81]/20 flex items-center justify-center">
                            <ChatBubbleLeftIcon className="w-3 h-3 text-[#3C291C]" />
                          </div>
                          <p className="text-xs font-bold text-[#3C291C]">YOUR RESPONSE</p>
                          <span className="text-[10px] text-[#3C291C]/40">{review.response.date}</span>
                        </div>
                        <button onClick={() => handleEditResponse(review.id, review.response!.text)} className="text-xs text-[#3C291C]/40 hover:text-[#DB8B8C] transition-colors flex items-center gap-1">
                          <PencilIcon className="w-3 h-3" /> EDIT
                        </button>
                      </div>
                      <p className="text-sm text-[#3C291C]/60">{review.response.text}</p>
                    </div>
                  )}

                  {/* Reply/Flag Buttons */}
                  {showResponseEditor === review.id ? (
                    <div className="mt-4 space-y-3">
                      <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Write your response..."
                        className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl p-3 text-sm text-[#3C291C] placeholder:text-[#3C291C]/30 focus:ring-2 focus:ring-[#F1CB81] outline-none" rows={3} />
                      <div className="flex gap-3">
                        <button onClick={() => handleReply(review.id)} className="px-4 py-2 bg-[#F1CB81] text-[#3C291C] rounded-xl text-sm font-bold hover:bg-[#DB8B8C] hover:text-white transition-all">Post Response</button>
                        <button onClick={() => { setShowResponseEditor(null); setResponseText(''); }} className="px-4 py-2 bg-[#3C291C]/5 text-[#3C291C] rounded-xl text-sm font-bold hover:bg-[#3C291C]/10 transition-all">Cancel</button>
                      </div>
                    </div>
                  ) : !review.response ? (
                    <div className="mt-4 flex gap-3">
                      <button onClick={() => setShowResponseEditor(review.id)} className="px-4 py-2 bg-[#F1CB81]/20 text-[#3C291C] rounded-xl text-sm font-bold hover:bg-[#F1CB81] transition-all flex items-center gap-2">
                        <ChatBubbleLeftIcon className="w-4 h-4" /> REPLY
                      </button>
                      <button onClick={() => handleFlagReview(review.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2">
                        <FlagIcon className="w-4 h-4" /> FLAG
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-[#3C291C]/10">
                <p className="text-sm text-[#3C291C]/40">Showing {indexOfFirstReview + 1}–{Math.min(indexOfLastReview, reviews.length)} of {reviews.length}</p>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                    className="p-2 bg-[#3C291C]/5 hover:bg-[#3C291C]/10 rounded-lg disabled:opacity-50 transition-all text-[#3C291C]">
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                    return (
                      <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-[#F1CB81] text-[#3C291C]' : 'bg-[#3C291C]/5 text-[#3C291C]/60 hover:bg-[#3C291C]/10'}`}>{pageNum}</button>
                    );
                  })}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                    className="p-2 bg-[#3C291C]/5 hover:bg-[#3C291C]/10 rounded-lg disabled:opacity-50 transition-all text-[#3C291C]">
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import {
//   StarIcon,
//   ChatBubbleLeftIcon,
//   FlagIcon,
//   PencilIcon,
//   ArrowTrendingUpIcon,
//   TrophyIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@heroicons/react/24/outline';
// import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
// import './reviews.css';

// // Types
// interface Review {
//   id: string;
//   clientName: string;
//   clientAvatar?: string;
//   rating: number;
//   date: string;
//   content: string;
//   response?: {
//     text: string;
//     date: string;
//   };
//   isFlagged?: boolean;
// }

// interface RatingDistribution {
//   stars: number;
//   percentage: number;
//   count: number;
// }

// export default function OwnerReviews() {
//   const [selectedReview, setSelectedReview] = useState<string | null>(null);
//   const [showResponseEditor, setShowResponseEditor] = useState<string | null>(null);
//   const [responseText, setResponseText] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const reviewsPerPage = 10;

//   // Rating distribution data
//   const ratingDistribution: RatingDistribution[] = [
//     { stars: 5, percentage: 92, count: 114 },
//     { stars: 4, percentage: 6, count: 7 },
//     { stars: 3, percentage: 2, count: 3 },
//     { stars: 2, percentage: 0, count: 0 },
//     { stars: 1, percentage: 0, count: 0 },
//   ];

//   // Reviews data
//   const [reviews, setReviews] = useState<Review[]>([
//     {
//       id: '1',
//       clientName: 'Marcus Sterling',
//       rating: 5,
//       date: 'MAY 14, 2024',
//       content: 'The light in the North Studio was absolutely breathtaking for our seasonal campaign. The minimalist aesthetic perfectly matched our brand vision. Impeccable cleanliness and the owner was exceptionally accommodating of our equipment setup.',
//     },
//     {
//       id: '2',
//       clientName: 'Elena Rossi',
//       rating: 5,
//       date: 'MAY 10, 2024',
//       content: 'Beautiful space. The acoustic treatment was better than expected for a loft conversion. My only note would be the elevator was a bit slow, but once inside, the experience was premium.',
//       response: {
//         text: 'Thank you, Elena! We’re thrilled the acoustics worked for your session. We are currently working with the building management to improve the lift access. Hope to host you again soon.',
//         date: 'MAY 12, 2024',
//       },
//     },
//     {
//       id: '3',
//       clientName: 'David Chen',
//       rating: 5,
//       date: 'APRIL 28, 2024',
//       content: 'The perfect sanctuary for creative thought. The Atelier represents the gold standard for studio rentals in the city. High ceilings, premium textures, and a silent environment.',
//     },
//     {
//       id: '4',
//       clientName: 'Sophia Martinez',
//       rating: 4,
//       date: 'APRIL 20, 2024',
//       content: 'Great space overall! The natural lighting was perfect for our shoot. Only minor issue was the air conditioning was a bit loud during quiet moments.',
//     },
//     {
//       id: '5',
//       clientName: 'James Wilson',
//       rating: 5,
//       date: 'APRIL 15, 2024',
//       content: 'Absolutely stunning studio. The attention to detail in the design is incredible. Will definitely be booking again for our next campaign.',
//     },
//     {
//       id: '6',
//       clientName: 'Olivia Chen',
//       rating: 5,
//       date: 'APRIL 10, 2024',
//       content: 'One of the best studio experiences I\'ve had. The team was incredibly helpful and the space was pristine.',
//     },
//     {
//       id: '7',
//       clientName: 'Liam O\'Connor',
//       rating: 3,
//       date: 'APRIL 5, 2024',
//       content: 'Nice space but parking was difficult to find. The studio itself was great though.',
//     },
//     {
//       id: '8',
//       clientName: 'Emma Thompson',
//       rating: 5,
//       date: 'MARCH 28, 2024',
//       content: 'Absolutely perfect for our fashion editorial. The moody lighting options were exactly what we needed.',
//     },
//     {
//       id: '9',
//       clientName: 'Noah Williams',
//       rating: 5,
//       date: 'MARCH 20, 2024',
//       content: 'Incredible space with top-notch equipment. The owner was very accommodating and communicative.',
//     },
//     {
//       id: '10',
//       clientName: 'Isabella Garcia',
//       rating: 4,
//       date: 'MARCH 15, 2024',
//       content: 'Beautiful studio with great natural light. Would love to see more props available for use.',
//     },
//   ]);

//   const totalReviews = 124;
//   const averageRating = 4.9;
//   const ratingIncrease = 0.2;

//   // Pagination
//   const indexOfLastReview = currentPage * reviewsPerPage;
//   const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
//   const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
//   const totalPages = Math.ceil(reviews.length / reviewsPerPage);

//   const handleReply = (reviewId: string) => {
//     if (responseText.trim()) {
//       const updatedReviews = reviews.map(review => 
//         review.id === reviewId 
//           ? { 
//               ...review, 
//               response: { 
//                 text: responseText, 
//                 date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() 
//               } 
//             }
//           : review
//       );
//       setReviews(updatedReviews);
//       setShowResponseEditor(null);
//       setResponseText('');
//     }
//   };

//   const handleFlagReview = (reviewId: string) => {
//     const updatedReviews = reviews.map(review =>
//       review.id === reviewId ? { ...review, isFlagged: true } : review
//     );
//     setReviews(updatedReviews);
//     // Show toast notification (you can add this)
//     console.log('Review flagged for moderation');
//   };

//   const handleEditResponse = (reviewId: string, currentResponse: string) => {
//     setResponseText(currentResponse);
//     setShowResponseEditor(reviewId);
//   };

//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex items-center gap-0.5">
//         {[1, 2, 3, 4, 5].map((star) => (
//           star <= rating ? (
//             <StarSolidIcon key={star} className="w-4 h-4 text-amber-500" />
//           ) : (
//             <StarIcon key={star} className="w-4 h-4 text-slate-600" />
//           )
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="p-8 max-w-[1600px] mx-auto">
//       {/* Page Header */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-black tracking-tight">Studio Owner Reviews & Ratings</h2>
//         <p className="text-slate-400 text-sm mt-1">
//           Manage your reputation at The Atelier. Monitor feedback trends and engage with your creative community through thoughtful responses.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column - Stats & Distribution */}
//         <div className="space-y-6">
//           {/* Rating Summary Card */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <div className="text-center mb-6">
//               <p className="text-slate-400 text-sm mb-2">CURRENT STANDING</p>
//               <p className="text-7xl font-black text-white">{averageRating}</p>
//               <p className="text-slate-400 text-sm mt-2">Based on {totalReviews} Reviews</p>
//             </div>

//             {/* Rating Distribution */}
//             <div className="space-y-3">
//               {ratingDistribution.map((dist) => (
//                 <div key={dist.stars} className="flex items-center gap-3">
//                   <div className="flex items-center gap-1 w-16">
//                     <span className="text-sm font-medium">{dist.stars}</span>
//                     <StarSolidIcon className="w-3 h-3 text-amber-500" />
//                   </div>
//                   <div className="flex-1 bg-white/10 rounded-full h-2">
//                     <div
//                       className="bg-primary h-2 rounded-full"
//                       style={{ width: `${dist.percentage}%` }}
//                     ></div>
//                   </div>
//                   <span className="text-xs text-slate-400 w-12">{dist.percentage}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Growth Insight Card */}
//           <div className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
//                 <ArrowTrendingUpIcon className="w-5 h-5 text-primary" />
//               </div>
//               <h3 className="text-lg font-bold">Growth Insight</h3>
//             </div>
//             <p className="text-slate-300 text-sm">
//               Your rating increased by <span className="text-primary font-bold">{ratingIncrease}</span> this month. 
//               Consistent replies to reviews are driving visibility.
//             </p>
//           </div>

//           {/* Elite Status Card */}
//           <div className="bg-gradient-to-br from-amber-500/20 to-primary/20 border border-amber-500/20 rounded-xl p-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
//                 <TrophyIcon className="w-5 h-5 text-amber-500" />
//               </div>
//               <h3 className="text-lg font-bold">Elite Status</h3>
//             </div>
//             <p className="text-slate-300 text-sm">
//               You're in the top <span className="text-amber-500 font-bold">3%</span> of studio owners for guest satisfaction. 
//               Keep up the aesthetic excellence.
//             </p>
//           </div>
//         </div>

//         {/* Right Column - Reviews List */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="flex items-center justify-between">
//             <h3 className="text-xl font-bold">Individual Feedback</h3>
//             <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-400">
//               <option>Most Recent</option>
//               <option>Highest Rated</option>
//               <option>Lowest Rated</option>
//             </select>
//           </div>

//           {/* Reviews */}
//           <div className="space-y-6">
//             {currentReviews.map((review) => (
//               <div key={review.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
//                 {/* Review Header */}
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold">
//                       {review.clientName.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="font-bold text-white">{review.clientName}</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         {renderStars(review.rating)}
//                         <span className="text-xs text-slate-500">{review.date}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleFlagReview(review.id)}
//                       className="p-2 text-slate-500 hover:text-red-500 transition-colors"
//                       title="Flag Review"
//                     >
//                       <FlagIcon className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Review Content */}
//                 <p className="text-slate-300 text-sm leading-relaxed mb-4">
//                   {review.content}
//                 </p>

//                 {/* Owner Response */}
//                 {review.response && (
//                   <div className="mt-4 pl-4 border-l-2 border-primary/30">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center gap-2">
//                         <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
//                           <ChatBubbleLeftIcon className="w-3 h-3 text-primary" />
//                         </div>
//                         <p className="text-xs font-medium text-primary">YOUR RESPONSE</p>
//                         <span className="text-[10px] text-slate-500">{review.response.date}</span>
//                       </div>
//                       <button
//                         onClick={() => handleEditResponse(review.id, review.response!.text)}
//                         className="text-xs text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
//                       >
//                         <PencilIcon className="w-3 h-3" />
//                         EDIT RESPONSE
//                       </button>
//                     </div>
//                     <p className="text-sm text-slate-400">{review.response.text}</p>
//                   </div>
//                 )}

//                 {/* Reply Section */}
//                 {showResponseEditor === review.id ? (
//                   <div className="mt-4 space-y-3">
//                     <textarea
//                       value={responseText}
//                       onChange={(e) => setResponseText(e.target.value)}
//                       placeholder="Write your response..."
//                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none"
//                       rows={3}
//                     />
//                     <div className="flex gap-3">
//                       <button
//                         onClick={() => handleReply(review.id)}
//                         className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-all"
//                       >
//                         Post Response
//                       </button>
//                       <button
//                         onClick={() => {
//                           setShowResponseEditor(null);
//                           setResponseText('');
//                         }}
//                         className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : !review.response ? (
//                   <div className="mt-4 flex gap-3">
//                     <button
//                       onClick={() => setShowResponseEditor(review.id)}
//                       className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-medium transition-all flex items-center gap-2"
//                     >
//                       <ChatBubbleLeftIcon className="w-4 h-4" />
//                       REPLY TO {review.clientName.split(' ')[0].toUpperCase()}
//                     </button>
//                     <button
//                       onClick={() => handleFlagReview(review.id)}
//                       className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
//                     >
//                       <FlagIcon className="w-4 h-4" />
//                       FLAG REVIEW
//                     </button>
//                   </div>
//                 ) : null}
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between pt-6 border-t border-white/10">
//               <p className="text-sm text-slate-500">
//                 Showing {indexOfFirstReview + 1}–{Math.min(indexOfLastReview, reviews.length)} of {reviews.length} reviews
//               </p>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronLeftIcon className="w-5 h-5" />
//                 </button>
//                 <div className="flex gap-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
//                           currentPage === pageNum
//                             ? 'bg-primary text-white'
//                             : 'bg-white/5 hover:bg-white/10 text-slate-400'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={currentPage === totalPages}
//                   className="p-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronRightIcon className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* View All Link */}
//           {reviews.length > reviewsPerPage && (
//             <div className="text-center pt-4">
//               <button
//                 onClick={() => setCurrentPage(totalPages)}
//                 className="text-primary text-sm hover:underline"
//               >
//                 View All {totalReviews} Reviews
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }