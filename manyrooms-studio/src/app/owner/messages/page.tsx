// app/owner/messages/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  MagnifyingGlassIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface Conversation {
  id: string;
  guestName: string;
  guestInitials: string;
  studioName: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
  inquiryType: string;
  status: 'active' | 'pending' | 'confirmed';
}

interface Message {
  id: string;
  sender: 'guest' | 'host';
  text: string;
  time: string;
  isTyping?: boolean;
}

interface InquiryContext {
  studioName: string;
  studioImage: string;
  location: string;
  requestedDate: string;
  timeSlot: string;
  crewSize: number;
  guestName: string;
  guestInitials: string;
  guestRating: number;
  guestBookings: number;
  tags: string[];
}

export default function OwnerMessagesPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [activeConversation, setActiveConversation] = useState('1');
  const [messageInput, setMessageInput] = useState('');

  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      guestName: 'Julianne Moore',
      guestInitials: 'JM',
      studioName: 'Neon Void Studio',
      lastMessage: '"We\'re looking to film a music video this coming Friday..."',
      time: '12:45 PM',
      unread: true,
      online: true,
      inquiryType: 'Music Video',
      status: 'active',
    },
    {
      id: '2',
      guestName: 'Marcus Thorne',
      guestInitials: 'MT',
      studioName: 'Daylight Penthouse',
      lastMessage: 'Can we bring a smoke machine for the shoot?',
      time: 'Yesterday',
      unread: false,
      online: false,
      inquiryType: 'Photography',
      status: 'pending',
    },
    {
      id: '3',
      guestName: 'Elena Rodriguez',
      guestInitials: 'ER',
      studioName: 'Industrial Loft B',
      lastMessage: 'The lighting looks perfect. Is there parking available?',
      time: 'Oct 24',
      unread: true,
      online: true,
      inquiryType: 'Fashion Shoot',
      status: 'active',
    },
    {
      id: '4',
      guestName: 'Creative Pulse Agency',
      guestInitials: 'CP',
      studioName: 'The Glass House',
      lastMessage: 'Finalizing the contract for next month\'s campaign.',
      time: 'Oct 22',
      unread: false,
      online: false,
      inquiryType: 'Commercial',
      status: 'confirmed',
    },
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'guest',
      text: 'Hi there! I\'m Julianne from the Collective. We are absolutely obsessed with the Neon Void Studio. We\'re planning a 6-hour music video shoot for an emerging artist this coming Friday.',
      time: '10:25 AM',
    },
    {
      id: '2',
      sender: 'guest',
      text: 'Is the overhead RGB rigging included in the standard hourly rate, or is that an add-on?',
      time: '10:26 AM',
    },
    {
      id: '3',
      sender: 'host',
      text: 'Hi Julianne! Excited to hear you\'re interested. Yes, the RGB rigging is fully integrated and included in your booking!',
      time: '12:10 PM',
    },
    {
      id: '4',
      sender: 'guest',
      text: 'Julianne is typing...',
      time: '',
      isTyping: true,
    },
  ]);

  const [inquiryContext] = useState<InquiryContext>({
    studioName: 'Neon Void Studio',
    studioImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn1chR3WpbzIHQbQQrxUL5BjDTty3Q1xMgkClEg7ia5W98Pk-5EYxr-rLzQF2Q7E0xgFRV1DEExHAsbUXW7E6TtjX2m4gU4SFthT1P4hU36o52mYR_W15IguYIoAUZ1u6vO5Ux5ttk9FQSn7Ju8KIT3ClG3iu8GWxNbUwJvzQmoBsgdZ7R8Kg_sE0ZItZs-qJ6dcrt_kMxoaBECNGG_GyXTIvJqqxSmFI64ruUFRhBtzoq6lW_WsrVqEOpwvLku92R5UhQqZm_yHao',
    location: 'Brooklyn, NY',
    requestedDate: 'Oct 28, 2024',
    timeSlot: '02:00 PM - 08:00 PM',
    crewSize: 12,
    guestName: 'Julianne Moore',
    guestInitials: 'JM',
    guestRating: 4.9,
    guestBookings: 12,
    tags: ['Music Video', 'Production', 'Loyal Client'],
  });

  const activeConv = conversations.find(c => c.id === activeConversation);
  const unreadCount = conversations.filter(c => c.unread).length;

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  const filteredConversations = activeFilter === 'all' 
    ? conversations 
    : conversations.filter(c => c.status === activeFilter);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
      {/* Header */}
      <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-extrabold text-[#446900] tracking-tight">Inbox</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-[#beff5f] text-[#111f00] text-xs font-bold rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c9b1]" />
            <input
              className="pl-10 pr-4 py-2 bg-[#edeeef] border-none rounded-full text-sm focus:ring-2 focus:ring-[#beff5f] w-64 outline-none"
              placeholder="Search inquiries..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
              <span className="material-symbols-outlined text-[#424937]">favorite</span>
            </button>
            <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
              <span className="material-symbols-outlined text-[#424937]">notifications</span>
            </button>
          </div>
        </div>
      </header>

      {/* Messaging Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-[#c2c9b1]/20 flex flex-col bg-white">
          {/* Filter Tabs */}
          <div className="p-4 border-b border-[#c2c9b1]/20 flex gap-2">
            {(['all', 'pending', 'confirmed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeFilter === filter
                    ? 'bg-[#e7e8e9] text-[#191c1d]'
                    : 'hover:bg-[#f3f4f5] text-[#424937]'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : 'Confirmed'}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`p-4 cursor-pointer transition-colors border-b border-[#c2c9b1]/10 ${
                  activeConversation === conv.id
                    ? 'bg-[#beff5f]/10 border-l-4 border-[#446900]'
                    : 'hover:bg-[#f3f4f5]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#191c1d]">{conv.guestName}</span>
                    {conv.online && (
                      <div className="w-2 h-2 rounded-full bg-[#446900] animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#737a65] uppercase font-bold">{conv.time}</span>
                </div>
                <p className={`text-xs font-bold mb-1 ${conv.unread ? 'text-[#446900]' : 'text-[#424937]'}`}>
                  Inquiry: {conv.studioName}
                </p>
                <p className="text-sm text-[#424937] line-clamp-1 italic">"{conv.lastMessage}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Chat Area */}
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
          {/* Chat Header */}
          <div className="h-16 border-b border-[#c2c9b1]/20 px-4 md:px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#635979] text-white flex items-center justify-center font-bold text-xs">
                {activeConv?.guestInitials || '??'}
              </div>
              <div>
                <h2 className="font-bold text-sm text-[#191c1d]">{activeConv?.guestName || 'Select a conversation'}</h2>
                {activeConv?.online && (
                  <p className="text-[10px] text-[#446900] flex items-center gap-1 uppercase tracking-wider font-bold">
                    <span className="w-1.5 h-1.5 bg-[#446900] rounded-full"></span> Online
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
                <VideoCameraIcon className="w-5 h-5 text-[#424937]" />
              </button>
              <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
                <PhoneIcon className="w-5 h-5 text-[#424937]" />
              </button>
              <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
                <EllipsisVerticalIcon className="w-5 h-5 text-[#424937]" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
            <div className="flex justify-center">
              <span className="text-[10px] uppercase font-bold text-[#737a65] tracking-widest bg-[#edeeef] px-3 py-1 rounded-full">
                Today, 10:24 AM
              </span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.isTyping ? (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#e1e3e4] flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-[#424937]">person</span>
                    </div>
                    <div>
                      <div className="bg-[#f3f4f5] p-4 rounded-2xl rounded-bl-sm shadow-sm text-sm text-[#191c1d] animate-pulse">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ) : msg.sender === 'guest' ? (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#e1e3e4] flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-[#424937]">person</span>
                    </div>
                    <div>
                      <div className="bg-[#f3f4f5] p-4 rounded-2xl rounded-bl-sm shadow-sm text-sm text-[#191c1d] leading-relaxed">
                        {msg.text}
                      </div>
                      {msg.time && (
                        <span className="text-[10px] text-[#737a65] mt-1 ml-1 block">{msg.time}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#446900] flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xs">storefront</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-[#eaddff] p-4 rounded-2xl rounded-br-sm shadow-sm text-sm text-[#1f1732] leading-relaxed">
                        {msg.text}
                      </div>
                      {msg.time && (
                        <span className="text-[10px] text-[#737a65] mt-1 mr-1 block">{msg.time}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 md:p-6 bg-white/50 backdrop-blur-md border-t border-[#c2c9b1]/20">
            <div className="flex items-center gap-3 bg-[#edeeef] rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#beff5f] transition-all">
              <button className="p-1 text-[#424937] hover:text-[#446900] transition-colors">
                <PlusCircleIcon className="w-5 h-5" />
              </button>
              <input
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none"
                placeholder="Type your message..."
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button className="p-1 text-[#424937] hover:text-[#446900] transition-colors">
                <FaceSmileIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-[#beff5f] text-[#111f00] p-2 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                <PaperAirplaneIcon className="w-4 h-4 rotate-90" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Inquiry Context */}
        <div className="hidden xl:flex w-80 border-l border-[#c2c9b1]/20 flex-col bg-white overflow-y-auto">
          <div className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#737a65] mb-6">Inquiry Context</h3>
            
            {/* Studio Card */}
            <div className="rounded-2xl overflow-hidden bg-[#f8f9fa] mb-6 shadow-sm border border-[#c2c9b1]/20">
              <div
                className="h-40 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${inquiryContext.studioImage}')` }}
              >
                <div className="absolute top-3 right-3 bg-[#446900] text-white font-bold text-[10px] px-2 py-1 rounded-full shadow-lg">
                  PREMIUM SPACE
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm text-[#191c1d] mb-1">{inquiryContext.studioName}</h4>
                <p className="text-xs text-[#424937] mb-4 flex items-center gap-1">
                  <MapPinIcon className="w-3 h-3" />
                  {inquiryContext.location}
                </p>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#737a65]">Requested Date</span>
                    <span className="font-bold text-[#191c1d]">{inquiryContext.requestedDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#737a65]">Time Slot</span>
                    <span className="font-bold text-[#191c1d]">{inquiryContext.timeSlot}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#737a65]">Crew Size</span>
                    <span className="font-bold text-[#191c1d]">{inquiryContext.crewSize} Persons</span>
                  </div>
                </div>
                <button className="w-full bg-[#beff5f] text-[#111f00] font-bold py-3 rounded-xl hover:scale-[1.02] transition-all shadow-md active:scale-95 mb-3 text-sm">
                  View Full Booking
                </button>
                <button className="w-full border border-[#c2c9b1] text-[#424937] font-bold py-3 rounded-xl hover:bg-[#f3f4f5] transition-all text-sm">
                  Send Invoice
                </button>
              </div>
            </div>

            {/* Client Profile */}
            <div className="bg-[#f3f4f5] p-4 rounded-2xl">
              <h4 className="text-xs font-bold uppercase text-[#737a65] mb-3 tracking-widest">Client Profile</h4>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#e4d7fd] flex items-center justify-center font-bold text-[#665c7c] text-lg">
                  {inquiryContext.guestInitials}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#191c1d]">{inquiryContext.guestName}</p>
                  <p className="text-xs text-[#424937] flex items-center gap-1">
                    <StarIcon className="w-3 h-3 text-[#446900] fill-current" />
                    {inquiryContext.guestRating} ★ ({inquiryContext.guestBookings} bookings)
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {inquiryContext.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white text-[10px] font-bold rounded-md border border-[#c2c9b1]/10 text-[#424937] uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}