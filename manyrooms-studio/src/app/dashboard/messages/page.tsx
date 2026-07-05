
// app/dashboard/messages/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  PaperClipIcon,
  PhotoIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface Enquiry {
  id: string;
  studio_id: string;
  studio_name: string;
  studio_image: string;
  studio_city: string;
  studio_state: string;
  owner_name: string;
  event_date: string;
  guests_count: number;
  brief: string;
  status: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  enquiry_id: string;
  sender_id: string;
  sender_type: 'client' | 'owner';
  message: string;
  image_url: string | null;
  read: boolean;
  created_at: string;
}

export default function ClientMessagesPage() {
  const { user } = useAuth();
  const [activeEnquiryId, setActiveEnquiryId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchEnquiries();
    }
  }, [user]);

  useEffect(() => {
    if (!activeEnquiryId) return;

    fetchMessages(activeEnquiryId);

    const channel = supabase
      .channel(`messages:${activeEnquiryId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `enquiry_id=eq.${activeEnquiryId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeEnquiryId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*, studios(name, images, city, state, owner_id)')
        .eq('guest_email', user?.email)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enrichedEnquiries = await Promise.all(
        (data || []).map(async (enq: any) => {
          // Get owner name
          let ownerName = 'Studio Owner';
          if (enq.studios?.owner_id) {
            const { data: ownerData } = await supabase
              .from('users')
              .select('name')
              .eq('id', enq.studios.owner_id)
              .single();
            if (ownerData) ownerName = ownerData.name;
          }

          const { data: lastMsg } = await supabase
            .from('messages')
            .select('message, created_at')
            .eq('enquiry_id', enq.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('enquiry_id', enq.id)
            .eq('sender_type', 'owner')
            .eq('read', false);

          return {
            id: enq.id,
            studio_id: enq.studio_id,
            studio_name: enq.studios?.name || 'Unknown Studio',
            studio_image: enq.studios?.images?.[0] || '',
            studio_city: enq.studios?.city || '',
            studio_state: enq.studios?.state || '',
            owner_name: ownerName,
            event_date: enq.event_date,
            guests_count: enq.guests_count,
            brief: enq.brief,
            status: enq.status,
            last_message: lastMsg?.[0]?.message || enq.brief,
            last_message_time: lastMsg?.[0]?.created_at || enq.created_at,
            unread_count: unreadCount || 0,
          };
        })
      );

      setEnquiries(enrichedEnquiries);
      if (enrichedEnquiries.length > 0 && !activeEnquiryId) {
        setActiveEnquiryId(enrichedEnquiries[0].id);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (enquiryId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('enquiry_id', enquiryId)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeEnquiryId || !user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        enquiry_id: activeEnquiryId,
        sender_id: user.id,
        sender_type: 'client',
        message: messageInput.trim(),
        read: false,
        created_at: new Date().toISOString(),
      });

    if (!error) setMessageInput('');
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const activeEnquiry = enquiries.find(e => e.id === activeEnquiryId);
  const unreadTotal = enquiries.reduce((sum, e) => sum + (e.unread_count || 0), 0);

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-[#446900]/20 rounded-full mx-auto mb-3"></div>
          <p className="text-[#446900] font-bold text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
      <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#191c1d]">Messages</h2>
          {unreadTotal > 0 && (
            <span className="px-2 py-0.5 bg-[#beff5f] text-[#111f00] text-xs font-bold rounded-full">{unreadTotal} New</span>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-[#c2c9b1]/20 bg-white flex flex-col shrink-0">
          <div className="p-4">
            <div className="bg-[#edeeef] rounded-xl flex items-center px-4 py-2">
              <span className="material-symbols-outlined text-[#737a65]">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none" placeholder="Search..." type="text" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {enquiries.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-[#c2c9b1] mb-3">chat_bubble</span>
                <p className="text-[#424937] font-bold text-sm">No conversations yet</p>
              </div>
            ) : (
              enquiries.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => setActiveEnquiryId(enq.id)}
                  className={`p-4 cursor-pointer border-b border-[#c2c9b1]/10 ${
                    activeEnquiryId === enq.id ? 'bg-[#e4d7fd]/30 border-l-4 border-[#beff5f]' : 'hover:bg-[#e7e8e9]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      {enq.studio_image ? (
                        <img className="w-full h-full object-cover" src={enq.studio_image} alt={enq.studio_name} />
                      ) : (
                        <div className="w-full h-full bg-[#edeeef] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#c2c9b1]">photo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-sm truncate text-[#191c1d]">{enq.studio_name}</h3>
                        <span className="text-[10px] text-[#737a65] whitespace-nowrap ml-2">
                          {formatTime(enq.last_message_time || enq.event_date)}
                        </span>
                      </div>
                      <p className="text-sm text-[#424937] line-clamp-1">{enq.last_message}</p>
                      <span className="text-[11px] text-[#737a65]">Host: {enq.owner_name}</span>
                      {(enq.unread_count || 0) > 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#beff5f] text-[#111f00] text-[10px] font-bold rounded-full">
                          {enq.unread_count} new
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col bg-white min-w-0">
          {!activeEnquiry ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-[#c2c9b1] mb-4">forum</span>
                <p className="text-[#424937] font-bold">Select a conversation</p>
              </div>
            </div>
          ) : (
            <>
              <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-[#c2c9b1]/20 shrink-0">
                <div>
                  <h2 className="font-bold text-lg text-[#191c1d]">{activeEnquiry.studio_name}</h2>
                  <p className="text-[11px] text-[#424937]">Host: {activeEnquiry.owner_name}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-[#424937] font-bold">No messages yet</p>
                      <p className="text-sm text-[#737a65] mt-1">Send a message to the host</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.sender_type === 'client' ? 'ml-auto flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                        msg.sender_type === 'client' ? 'bg-[#446900] text-white' : 'bg-[#e1e3e4] text-[#424937]'
                      }`}>
                        {msg.sender_type === 'client' ? 'ME' : getInitials(activeEnquiry.owner_name)}
                      </div>
                      <div className={`flex flex-col ${msg.sender_type === 'client' ? 'items-end' : ''}`}>
                        <div className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                          msg.sender_type === 'client'
                            ? 'bg-[#beff5f] text-[#111f00] rounded-br-sm'
                            : 'bg-[#eaddff] text-[#1f1732] rounded-bl-sm'
                        }`}>
                          {msg.message}
                        </div>
                        <span className="text-[10px] text-[#737a65] mt-1 px-1">{formatTime(msg.created_at)}</span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-[#c2c9b1]/20 shrink-0">
                <div className="flex items-center gap-3 bg-[#edeeef] rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#beff5f] transition-all">
                  <input
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="bg-[#beff5f] text-[#111f00] p-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}



// // app/dashboard/messages/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import {
//   MagnifyingGlassIcon,
//   PhoneIcon,
//   VideoCameraIcon,
//   InformationCircleIcon,
//   PaperClipIcon,
//   PhotoIcon,
//   FaceSmileIcon,
//   PaperAirplaneIcon,
//   CalendarIcon,
//   ClockIcon,
//   CurrencyDollarIcon,
//   DocumentTextIcon,
//   ShieldCheckIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface Conversation {
//   id: string;
//   studioName: string;
//   studioImage: string;
//   hostName: string;
//   lastMessage: string;
//   time: string;
//   unread: boolean;
//   hasAttachment?: boolean;
// }

// interface Message {
//   id: string;
//   sender: 'user' | 'host';
//   text: string;
//   time: string;
//   image?: string;
//   imageAlt?: string;
// }

// export default function MessagesPage() {
//   const { user } = useAuth();
//   const [activeConversation, setActiveConversation] = useState('1');
//   const [messageInput, setMessageInput] = useState('');

//   const conversations: Conversation[] = [
//     {
//       id: '1',
//       studioName: 'Noir Curve Pavilion',
//       studioImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcSJJbzwfKfAtu82fUMI1wsMnxTLb7wOipOQzOGusuk7GvkWj5TBPC4N5MdtP9RAdbrYKzSbgH0T9pRCP102AvyeRVsNop0kzEKmAI_AN3VFEOIs5WIUiw7fgaKmKyF8IyLqAhR3uzLBEqwiFGA2t2b7gVzd1XEk8YUZojnQyWZacx_somAytTGqO1aocecVWHwiuOm0zrlsawzxQgStdrWXCFZPdksK0Q_SOG8kmvejAITEelq88Y45-79HhaK7-x3nW7B8-WewCV',
//       hostName: 'Elena Vance',
//       lastMessage: 'Looking forward to seeing you at the shoot!',
//       time: '2m ago',
//       unread: true,
//     },
//     {
//       id: '2',
//       studioName: 'Prism Loft',
//       studioImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvlLts0ifd6hpbdMJn8vX03NaTpInU77TB5MCXutzcIsqSJ8-su8qgIekww4TZ122OqwLDDk7xWomHdv_R34DRZlNLmWvA9N3BAUZayAnPPKgCsuObL0oWgO-kQZ6IOJxgW0YVNJtZe361ycB1f_7o6AFXoc7t2XSjg4a1VLntPX4uHwKFus2COS_bdfAns9ZTWqW2tN2yY5D1tq2hMqtaOGTg5wxgzukG9w_RFEjKvD1xRf6eoNaftwcQjIl-u6sMNscYQH0wanxy',
//       hostName: 'Marc Jacobs',
//       lastMessage: 'The lighting equipment is all set up for tomorrow.',
//       time: '3h ago',
//       unread: false,
//     },
//     {
//       id: '3',
//       studioName: 'Synth Wave Suite',
//       studioImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4FIP9cRDOYCWv9O_YomMXlKm-qUa3vHOPTt24NYuXrquN2XTgLvfrayFDI-1hc6PnFGDqipt9GlPDtBaMHim_K28fnoNGCci9KKv2Ez7oLUs064y7xw96vnZ3RRZfLYXfzlSMKsmYY6iawBK-aQD-UptZapfTmk5CBMcCELs8M53EhOnU-y5ytGvbpk9S7oPKEk_5lfRY0va-XKUQZGAVty_2GBIgcEpwu0SVtNfFuPddLGq_QI8t97vRVOS0UCE3l9lKrkiuzF7O',
//       hostName: 'Sarah Chen',
//       lastMessage: 'New Attachment: studio_map.pdf',
//       time: 'Yesterday',
//       unread: false,
//       hasAttachment: true,
//     },
//   ];

//   const messages: Message[] = [
//     {
//       id: '1',
//       sender: 'host',
//       text: 'Hi there! Thanks for your interest in Noir Curve Pavilion. The studio is available for your requested dates on Nov 12th. Do you need any specific lighting setup prepared beforehand?',
//       time: '10:42 AM',
//     },
//     {
//       id: '2',
//       sender: 'user',
//       text: "That's great news! Yes, we'll need three Profoto B10X units and a couple of v-flats. Also, is it possible to access the studio 30 minutes early for equipment drop-off?",
//       time: '10:45 AM',
//     },
//     {
//       id: '3',
//       sender: 'host',
//       text: 'Absolutely, we can accommodate the early drop-off. Here is the layout of the Profoto units currently set up in our Curve B room. Let me know if this works!',
//       time: '10:50 AM',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDglxzZv66BdoX0mvNrroq0x5JvLsja3LOUkJeeRL27_V0ycL9pB0gKhW0bOTOOU__F_2QDIKaExkNwwCtgRrW1sm94nl8_pFlFzTx6Q6xaoZgS9I435YwoWTuM4tX9-clgfrNQlZkO1lTOMIAb3sxQW6hGK52az1bMrsOnll2T1yLWlvJDGV-GbcmP-syQcqymyBcEH3Ou4yN4Ye2jd02-3Q_9OvFZySWlwTFFPHU03OH-2lYMsMtLsrlnT29SzeosYbplcicG7r6',
//       imageAlt: 'Studio layout diagram',
//     },
//     {
//       id: '4',
//       sender: 'user',
//       text: 'Looking forward to seeing you at the shoot!',
//       time: '11:02 AM',
//     },
//   ];

//   const activeConv = conversations.find(c => c.id === activeConversation);
//   const hostAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEfdLZF9nxxO4xn1bZ9G8eSuO225eMoeUF_EyyfttLq1yBjeIoOzzxqEEX0j9kjpdJPA79US6DlGOeh08Hos0YwHFGot8EFlXJ8xPN8Z5NdXHwwE6mkcYNu7ftSzIRV6VTMevoCtcuSZAp1bC0k9olkr_thmUiHGHXMcbxuCEYZSOxQqOXl22Rlkeu081CnGq33h9GIQKQKY-dFoXt_58-soYoVV8uMESb1NHBINqVRX9nI_Zck_Oo_kKJ7caBbU_25POEWvjBxSH8';
//   const userAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg0Xvu5NFVWRWHgxkJzqVuOPNxKfABUzUzfg5yPNV-1WEw5NyvzplMq7Uwh2S0uQiK_iBla8NfUB01jhAeltxT32UYq3cFVQO1iTEFQf_Fgr8j-Imk-MK7kpVT-ut2TZwlY_1lb6tIpwChj9_ue2FsorpX5YyhGcfp1WYDkRQFKoeNOsGDUPE95WG0Wh6LZAfVXliG9Y7WUen5ccFlSR1ayuP-CI7GUNHG6bknFuv7iMWL1H9szDqTGA1_NJwNeVtGGCxQQe8JAlpH';

//   const handleSendMessage = () => {
//     if (messageInput.trim()) {
//       // Send message logic here
//       setMessageInput('');
//     }
//   };

//   return (
//     <div className="h-[calc(100vh-64px)] flex flex-col">
//       {/* Header */}
//       <header className="h-16 flex justify-between items-center px-4 md:px-6 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/20">
//         <h2 className="text-xl md:text-2xl font-bold text-[#191c1d]">Messages</h2>
//         <div className="flex items-center gap-3">
//           <button className="p-2 hover:bg-[#edeeef] rounded-full">
//             <MagnifyingGlassIcon className="w-5 h-5 text-[#424937]" />
//           </button>
//         </div>
//       </header>

//       {/* Messaging Split Layout */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Conversations Sidebar */}
//         <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-[#c2c9b1]/20 bg-white overflow-y-auto">
//           <div className="p-4 md:p-6">
//             <div className="bg-[#edeeef] rounded-xl flex items-center px-4 py-2 mb-6">
//               <MagnifyingGlassIcon className="w-5 h-5 text-[#737a65]" />
//               <input
//                 className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none"
//                 placeholder="Search conversations..."
//                 type="text"
//               />
//             </div>
//             <div className="space-y-2">
//               {conversations.map((conv) => (
//                 <div
//                   key={conv.id}
//                   onClick={() => setActiveConversation(conv.id)}
//                   className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md ${
//                     activeConversation === conv.id
//                       ? 'bg-[#e4d7fd]/30 border-l-4 border-[#beff5f]'
//                       : 'hover:bg-[#e7e8e9]'
//                   }`}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
//                       <img className="w-full h-full object-cover" src={conv.studioImage} alt={conv.studioName} />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-center mb-1">
//                         <h3 className={`font-bold text-sm truncate ${conv.unread ? 'text-[#191c1d]' : 'text-[#424937]'}`}>
//                           {conv.studioName}
//                         </h3>
//                         <span className="text-[10px] uppercase font-bold text-[#737a65] whitespace-nowrap ml-2">{conv.time}</span>
//                       </div>
//                       <p className={`text-sm line-clamp-1 ${conv.hasAttachment ? 'text-[#446900] font-bold' : 'text-[#424937]'}`}>
//                         {conv.lastMessage}
//                       </p>
//                       <span className="text-[11px] text-[#737a65] font-bold">Host: {conv.hostName}</span>
//                     </div>
//                   </div>
//                   {conv.unread && (
//                     <div className="absolute top-4 right-4 w-2 h-2 bg-[#ba1a1a] rounded-full"></div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Main Chat Area */}
//         <section className="flex-1 flex flex-col bg-white overflow-hidden">
//           {/* Chat Header */}
//           <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-[#c2c9b1]/20 flex-shrink-0">
//             <div className="flex items-center gap-3">
//               <div className="flex flex-col">
//                 <h2 className="font-bold text-lg text-[#191c1d]">{activeConv?.studioName}</h2>
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 rounded-full bg-[#9bd93c] animate-pulse"></span>
//                   <span className="text-[10px] font-bold uppercase text-[#424937]">Host: {activeConv?.hostName} • Online</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//                 <VideoCameraIcon className="w-5 h-5 text-[#424937]" />
//               </button>
//               <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//                 <PhoneIcon className="w-5 h-5 text-[#424937]" />
//               </button>
//               <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//                 <InformationCircleIcon className="w-5 h-5 text-[#424937]" />
//               </button>
//             </div>
//           </div>

//           {/* Messages List */}
//           <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#e4d7fd]/10 via-white to-white">
//             <div className="flex justify-center my-4">
//               <span className="bg-[#edeeef] text-[#737a65] text-[11px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
//                 Thursday, Oct 24
//               </span>
//             </div>

//             {messages.map((msg) => (
//               <div key={msg.id} className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
//                 <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 mt-1">
//                   <img
//                     className="w-full h-full object-cover"
//                     src={msg.sender === 'host' ? hostAvatar : userAvatar}
//                     alt={msg.sender === 'host' ? 'Host' : 'You'}
//                   />
//                 </div>
//                 <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : ''}`}>
//                   <div className={`p-4 rounded-2xl shadow-sm ${
//                     msg.sender === 'host'
//                       ? 'bg-[#eaddff] text-[#1f1732] rounded-tl-none'
//                       : 'bg-[#beff5f] text-[#111f00] rounded-tr-none'
//                   }`}>
//                     <p className="text-sm">{msg.text}</p>
//                     {msg.image && (
//                       <div className="rounded-xl overflow-hidden border border-white/40 mt-3 cursor-pointer hover:opacity-90 transition-opacity">
//                         <img className="w-full h-48 object-cover" src={msg.image} alt={msg.imageAlt || 'Attachment'} />
//                       </div>
//                     )}
//                   </div>
//                   <span className="text-[10px] text-[#737a65] px-2">{msg.time}</span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Message Input */}
//           <div className="p-4 md:p-6 bg-white border-t border-[#c2c9b1]/20">
//             <div className="flex items-end gap-3 max-w-5xl mx-auto">
//               <div className="flex items-center gap-1 mb-1">
//                 <button className="p-2 text-[#424937] hover:bg-[#edeeef] rounded-full transition-colors">
//                   <PaperClipIcon className="w-5 h-5" />
//                 </button>
//                 <button className="p-2 text-[#424937] hover:bg-[#edeeef] rounded-full transition-colors">
//                   <PhotoIcon className="w-5 h-5" />
//                 </button>
//               </div>
//               <div className="flex-1 bg-[#f3f4f5] rounded-2xl p-3 min-h-[48px] flex items-center border border-transparent focus-within:border-[#446900] transition-all">
//                 <textarea
//                   className="bg-transparent border-none focus:ring-0 text-sm w-full resize-none py-0 outline-none"
//                   placeholder="Type a message..."
//                   rows={1}
//                   value={messageInput}
//                   onChange={(e) => setMessageInput(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendMessage();
//                     }
//                   }}
//                 />
//                 <button className="p-1 text-[#424937] hover:text-[#446900] transition-colors">
//                   <FaceSmileIcon className="w-5 h-5" />
//                 </button>
//               </div>
//               <button
//                 onClick={handleSendMessage}
//                 className="w-12 h-12 bg-[#beff5f] text-[#111f00] rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
//               >
//                 <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Context Sidebar (Booking Details) */}
//         <aside className="hidden xl:flex w-80 flex-col border-l border-[#c2c9b1]/20 bg-[#f8f9fa] overflow-y-auto">
//           <div className="p-6 space-y-6">
//             <div className="space-y-4">
//               <h3 className="text-xs font-bold uppercase tracking-widest text-[#737a65]">Booking Context</h3>
//               <div className="rounded-2xl overflow-hidden aspect-video relative group">
//                 <img
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMRJ8BENp4d336WK1hWoapstYgL5l03u0PFiVTRaSErh3j03VsxYV6SqRCIxYTw1GKa8RebI4v1dIBeGfxj7mxfpi0Z0MEAOc5T7qOkykdpN9CkCPjgFrpiw-Hv8YBPmv8KggLt9D7DcIvjlWQt2M2G8cwMN4t28m1uzc6Lwfw9kB_iIGtZIK5ugz2WP8f75cKnNl_N33J5W0vmM4A-Lonxm7_Flrw6l58jfiVcS2mM4WDVe7LhwOoHxKCBiCv8IGGi2vZYsD2fFwG"
//                   alt="Noir Curve Pavilion"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//                 <div className="absolute bottom-4 left-4 text-white">
//                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Studio space</p>
//                   <p className="font-bold">Noir Curve Pavilion</p>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex flex-col gap-2">
//                 <span className="text-[11px] font-bold uppercase tracking-widest text-[#737a65]">Scheduled Date</span>
//                 <div className="flex items-center gap-2">
//                   <CalendarIcon className="w-5 h-5 text-[#446900]" />
//                   <span className="text-sm font-bold">Nov 12, 2024</span>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <span className="text-[11px] font-bold uppercase tracking-widest text-[#737a65]">Duration</span>
//                 <div className="flex items-center gap-2">
//                   <ClockIcon className="w-5 h-5 text-[#446900]" />
//                   <span className="text-sm font-bold">09:00 AM - 05:00 PM (8h)</span>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <span className="text-[11px] font-bold uppercase tracking-widest text-[#737a65]">Total Paid</span>
//                 <div className="flex items-center gap-2">
//                   <CurrencyDollarIcon className="w-5 h-5 text-[#446900]" />
//                   <span className="text-xl font-bold">$1,250.00</span>
//                 </div>
//               </div>
//             </div>

//             <div className="pt-6 border-t border-[#c2c9b1]/30 space-y-3">
//               <button className="w-full py-3 px-6 rounded-xl border-2 border-[#c2c9b1] hover:border-[#191c1d] transition-all font-bold text-xs uppercase tracking-widest">
//                 Modify Booking
//               </button>
//               <button className="w-full py-3 px-6 rounded-xl bg-[#e1e3e4] text-[#191c1d] hover:bg-[#c2c9b1] transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
//                 <DocumentTextIcon className="w-4 h-4" />
//                 View Receipt
//               </button>
//             </div>

//             <div className="bg-[#beff5f]/20 p-5 rounded-2xl border border-[#beff5f]/30 space-y-2">
//               <div className="flex items-center gap-2 text-[#446900]">
//                 <ShieldCheckIcon className="w-5 h-5" />
//                 <span className="font-bold text-xs uppercase">Insurance Active</span>
//               </div>
//               <p className="text-xs leading-relaxed text-[#324f00]">
//                 Your creative session is fully protected under ManyRooms Studio Guardian™ insurance.
//               </p>
//             </div>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }