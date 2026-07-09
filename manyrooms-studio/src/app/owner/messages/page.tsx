// app/owner/messages/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  PaperAirplaneIcon,
  MapPinIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

// Brand Colors
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  brown: '#DB8B8C',
  dark: '#3C291C',
};

interface Enquiry {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  event_date: string;
  guests_count: number;
  brief: string;
  status: string;
  studio_id: string;
  studio_name: string;
  studio_image: string;
  studio_city: string;
  studio_state: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  enquiry_id: string;
  sender_id: string;
  sender_type: 'client' | 'owner' | 'system';
  message: string;
  image_url: string | null;
  read: boolean;
  created_at: string;
}

export default function OwnerMessagesPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [activeEnquiryId, setActiveEnquiryId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [approving, setApproving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => { if (user) fetchEnquiries(); }, [user]);

  useEffect(() => {
    if (!activeEnquiryId) return;
    fetchMessages(activeEnquiryId);
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    const channel = supabase
      .channel(`owner-msgs-${activeEnquiryId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `enquiry_id=eq.${activeEnquiryId}` }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages((prev) => { if (prev.find(m => m.id === newMessage.id)) return prev; return [...prev, newMessage]; });
        if (newMessage.sender_type === 'client') supabase.from('messages').update({ read: true }).eq('id', newMessage.id).then(() => {});
      }).subscribe();
    channelRef.current = channel;
    return () => { if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null; } };
  }, [activeEnquiryId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchEnquiries = async () => {
    try {
      const { data: studiosData } = await supabase.from('studios').select('id').eq('owner_id', user?.id);
      if (!studiosData || studiosData.length === 0) { setEnquiries([]); setLoading(false); return; }
      const studioIds = studiosData.map(s => s.id);
      const { data: enquiriesData, error } = await supabase.from('enquiries').select('*, studios(name, images, city, state)').in('studio_id', studioIds).order('created_at', { ascending: false });
      if (error) throw error;
      const enrichedEnquiries = await Promise.all((enquiriesData || []).map(async (enq: any) => {
        const { data: lastMsg } = await supabase.from('messages').select('message, created_at').eq('enquiry_id', enq.id).order('created_at', { ascending: false }).limit(1);
        const { count: unreadCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('enquiry_id', enq.id).eq('sender_type', 'client').eq('read', false);
        return {
          id: enq.id, guest_name: enq.guest_name, guest_email: enq.guest_email, guest_phone: enq.guest_phone,
          event_date: enq.event_date, guests_count: enq.guests_count, brief: enq.brief, status: enq.status,
          studio_id: enq.studio_id, studio_name: enq.studios?.name || 'Unknown Studio',
          studio_image: enq.studios?.images?.[0] || '', studio_city: enq.studios?.city || '', studio_state: enq.studios?.state || '',
          last_message: lastMsg?.[0]?.message || enq.brief || 'No messages yet',
          last_message_time: lastMsg?.[0]?.created_at || enq.created_at, unread_count: unreadCount || 0,
        };
      }));
      setEnquiries(enrichedEnquiries);
      if (enrichedEnquiries.length > 0 && !activeEnquiryId) setActiveEnquiryId(enrichedEnquiries[0].id);
    } catch (err) { console.error('Error:', err); } finally { setLoading(false); }
  };

  const fetchMessages = async (enquiryId: string) => {
    const { data } = await supabase.from('messages').select('*').eq('enquiry_id', enquiryId).order('created_at', { ascending: true });
    if (data) { setMessages(data); const unreadIds = data.filter(m => m.sender_type === 'client' && !m.read).map(m => m.id); if (unreadIds.length > 0) await supabase.from('messages').update({ read: true }).in('id', unreadIds); }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeEnquiryId || !user) return;
    setSending(true);
    const { error } = await supabase.from('messages').insert({ enquiry_id: activeEnquiryId, sender_id: user.id, sender_type: 'owner', message: messageInput.trim(), read: false, created_at: new Date().toISOString() });
    if (!error) setMessageInput(''); else alert('Failed to send message');
    setSending(false);
  };

  const handleApprove = async () => {
    if (!activeEnquiryId || !user) return;
    setApproving(true);
    await supabase.from('enquiries').update({ status: 'approved' }).eq('id', activeEnquiryId);
    const activeEnq = enquiries.find(e => e.id === activeEnquiryId);
    await supabase.from('messages').insert({ enquiry_id: activeEnquiryId, sender_id: user.id, sender_type: 'system', message: `✅ BOOKING APPROVED: Your enquiry for "${activeEnq?.studio_name}" on ${activeEnq?.event_date} has been approved!`, read: false, created_at: new Date().toISOString() });
    setEnquiries(prev => prev.map(e => e.id === activeEnquiryId ? { ...e, status: 'approved' } : e));
    setApproving(false);
  };

  const handleDecline = async () => {
    if (!activeEnquiryId || !user) return;
    if (!confirm('Are you sure?')) return;
    await supabase.from('enquiries').update({ status: 'declined' }).eq('id', activeEnquiryId);
    const activeEnq = enquiries.find(e => e.id === activeEnquiryId);
    await supabase.from('messages').insert({ enquiry_id: activeEnquiryId, sender_id: user.id, sender_type: 'system', message: `❌ BOOKING DECLINED: Unfortunately your enquiry for "${activeEnq?.studio_name}" could not be accommodated.`, read: false, created_at: new Date().toISOString() });
    setEnquiries(prev => prev.map(e => e.id === activeEnquiryId ? { ...e, status: 'declined' } : e));
  };

  const handleSendInvoice = async () => {
    if (!activeEnquiryId) return;
    const activeEnq = enquiries.find(e => e.id === activeEnquiryId);
    await supabase.from('messages').insert({ enquiry_id: activeEnquiryId, sender_id: user?.id, sender_type: 'system', message: `🧾 INVOICE SENT: An invoice has been generated for "${activeEnq?.studio_name}". Check ${activeEnq?.guest_email} for payment details.`, read: false, created_at: new Date().toISOString() });
    alert('Invoice notification sent!');
  };

  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr); const now = new Date(); const diff = now.getTime() - date.getTime(); const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (days === 1) return 'Yesterday'; if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const activeEnquiry = enquiries.find(e => e.id === activeEnquiryId);
  const unreadTotal = enquiries.reduce((sum, e) => sum + (e.unread_count || 0), 0);
  const filteredEnquiries = activeFilter === 'all' ? enquiries : enquiries.filter(e => e.status === activeFilter);

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-[#FFFBF5]">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-[#F1CB81]/40 rounded-full mx-auto mb-3"></div>
          <p className="text-[#3C291C] font-bold text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#FFFBF5]">
      <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-[#3C291C]/10 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-extrabold text-[#3C291C] tracking-tight">Inbox</h1>
          {unreadTotal > 0 && (
            <span className="px-2 py-0.5 bg-[#F1CB81] text-[#3C291C] text-xs font-bold rounded-full">{unreadTotal} New</span>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-[#3C291C]/10 flex flex-col bg-white shrink-0">
          <div className="p-4 border-b border-[#3C291C]/10 flex gap-2">
            {(['all', 'pending', 'approved'] as const).map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeFilter === filter ? 'bg-[#3C291C] text-white' : 'text-[#3C291C]/60 hover:bg-[#3C291C]/5'}`}>
                {filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : 'Approved'}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-[#3C291C]/20 mb-3">chat_bubble</span>
                <p className="text-[#3C291C]/60 font-bold text-sm">No enquiries yet</p>
              </div>
            ) : (
              filteredEnquiries.map((enq) => (
                <div key={enq.id} onClick={() => setActiveEnquiryId(enq.id)}
                  className={`p-4 cursor-pointer transition-colors border-b border-[#3C291C]/5 ${activeEnquiryId === enq.id ? 'bg-[#F1CB81]/10 border-l-4 border-[#F1CB81]' : 'hover:bg-[#3C291C]/[0.02]'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#3C291C]">{enq.guest_name}</span>
                      {(enq.unread_count || 0) > 0 && <span className="w-2 h-2 rounded-full bg-[#DB8B8C]"></span>}
                    </div>
                    <span className="text-[10px] text-[#3C291C]/40 uppercase font-bold">{formatTime(enq.last_message_time || enq.event_date)}</span>
                  </div>
                  <p className="text-xs font-bold text-[#3C291C]/60 mb-1">{enq.studio_name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${enq.status === 'approved' ? 'bg-green-100 text-green-700' : enq.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{enq.status}</span>
                    <p className="text-sm text-[#3C291C]/60 line-clamp-1">{enq.last_message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CENTER: Chat Area */}
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden min-w-0">
          {!activeEnquiry ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-[#3C291C]/20 mb-4">forum</span>
                <p className="text-[#3C291C]/60 font-bold">Select a conversation</p>
              </div>
            </div>
          ) : (
            <>
              <div className="h-16 border-b border-[#3C291C]/10 px-4 md:px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3C291C] text-white flex items-center justify-center font-bold text-sm">{getInitials(activeEnquiry.guest_name)}</div>
                  <div>
                    <h2 className="font-bold text-sm text-[#3C291C]">{activeEnquiry.guest_name}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeEnquiry.status === 'approved' ? 'bg-green-100 text-green-700' : activeEnquiry.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{activeEnquiry.status}</span>
                      <p className="text-[10px] text-[#3C291C]/60">{activeEnquiry.guest_email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeEnquiry.status === 'pending' && (
                    <>
                      <button onClick={handleApprove} disabled={approving}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#F1CB81] text-[#3C291C] rounded-lg text-xs font-bold hover:bg-[#DB8B8C] hover:text-white transition-all">
                        <CheckCircleIcon className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={handleDecline}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">
                        <XCircleIcon className="w-4 h-4" /> Decline
                      </button>
                    </>
                  )}
                  {activeEnquiry.status === 'approved' && (
                    <button onClick={handleSendInvoice}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#91ADCD]/30 text-[#3C291C] rounded-lg text-xs font-bold hover:scale-105 transition-all">
                      <DocumentTextIcon className="w-4 h-4" /> Send Invoice
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-[#3C291C]/60 font-bold">No messages yet</p>
                      <p className="text-sm text-[#3C291C]/40 mt-1">Send the first message</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id}>
                      {msg.sender_type === 'system' ? (
                        <div className="flex justify-center my-3">
                          <span className="bg-[#91ADCD]/20 text-[#3C291C] text-[11px] font-bold px-4 py-2 rounded-full">{msg.message}</span>
                        </div>
                      ) : (
                        <div className={`flex gap-3 max-w-[80%] ${msg.sender_type === 'owner' ? 'ml-auto flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${msg.sender_type === 'owner' ? 'bg-[#3C291C] text-white' : 'bg-[#3C291C]/10 text-[#3C291C]'}`}>
                            {msg.sender_type === 'owner' ? 'ME' : getInitials(activeEnquiry.guest_name)}
                          </div>
                          <div className={`flex flex-col ${msg.sender_type === 'owner' ? 'items-end' : ''}`}>
                            <div className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender_type === 'owner' ? 'bg-[#F1CB81]/30 text-[#3C291C] rounded-br-sm' : 'bg-[#3C291C]/5 text-[#3C291C] rounded-bl-sm'}`}>
                              {msg.message}
                            </div>
                            <span className="text-[10px] text-[#3C291C]/40 mt-1 px-1">{formatTime(msg.created_at)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-[#3C291C]/10 shrink-0">
                <div className="flex items-center gap-3 bg-[#3C291C]/5 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#F1CB81] transition-all">
                  <input
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none text-[#3C291C] placeholder:text-[#3C291C]/30"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  />
                  <button onClick={handleSendMessage} disabled={!messageInput.trim() || sending}
                    className="bg-[#F1CB81] text-[#3C291C] p-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                    <PaperAirplaneIcon className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Inquiry Context */}
        {activeEnquiry && (
          <div className="hidden xl:flex w-80 border-l border-[#3C291C]/10 flex-col bg-white overflow-y-auto shrink-0">
            <div className="p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#3C291C]/40 mb-6">Inquiry Details</h3>
              <div className="rounded-2xl overflow-hidden bg-[#FFFBF5] mb-6 shadow-sm border border-[#3C291C]/10">
                {activeEnquiry.studio_image && (
                  <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url('${activeEnquiry.studio_image}')` }}>
                    <div className="absolute top-3 right-3 bg-[#3C291C] text-white font-bold text-[10px] px-2 py-1 rounded-full uppercase">{activeEnquiry.status}</div>
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-bold text-sm text-[#3C291C] mb-1">{activeEnquiry.studio_name}</h4>
                  <p className="text-xs text-[#3C291C]/60 mb-4 flex items-center gap-1"><MapPinIcon className="w-3 h-3" />{activeEnquiry.studio_city}, {activeEnquiry.studio_state}</p>
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center text-sm"><span className="text-[#3C291C]/40">Event Date</span><span className="font-bold text-[#3C291C]">{activeEnquiry.event_date}</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="text-[#3C291C]/40">Guests</span><span className="font-bold text-[#3C291C]">{activeEnquiry.guests_count} Persons</span></div>
                  </div>
                  {activeEnquiry.brief && (
                    <div className="bg-[#3C291C]/5 p-3 rounded-xl"><p className="text-xs font-bold text-[#3C291C]/40 mb-1">Client Message</p><p className="text-sm text-[#3C291C]">{activeEnquiry.brief}</p></div>
                  )}
                </div>
              </div>
              <div className="bg-[#3C291C]/5 p-4 rounded-2xl">
                <h4 className="text-xs font-bold uppercase text-[#3C291C]/40 mb-3 tracking-widest">Client Info</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-[#3C291C]/40">Name:</span> <span className="font-bold text-[#3C291C]">{activeEnquiry.guest_name}</span></p>
                  <p><span className="text-[#3C291C]/40">Email:</span> <span className="font-bold text-[#3C291C]">{activeEnquiry.guest_email}</span></p>
                  {activeEnquiry.guest_phone && <p><span className="text-[#3C291C]/40">Phone:</span> <span className="font-bold text-[#3C291C]">{activeEnquiry.guest_phone}</span></p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// // app/owner/messages/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import {
//   PaperAirplaneIcon,
//   MapPinIcon,
//   CheckCircleIcon,
//   DocumentTextIcon,
//   XCircleIcon,
// } from '@heroicons/react/24/outline';

// interface Enquiry {
//   id: string;
//   guest_name: string;
//   guest_email: string;
//   guest_phone: string;
//   event_date: string;
//   guests_count: number;
//   brief: string;
//   status: string;
//   studio_id: string;
//   studio_name: string;
//   studio_image: string;
//   studio_city: string;
//   studio_state: string;
//   last_message?: string;
//   last_message_time?: string;
//   unread_count?: number;
// }

// interface Message {
//   id: string;
//   enquiry_id: string;
//   sender_id: string;
//   sender_type: 'client' | 'owner' | 'system';
//   message: string;
//   image_url: string | null;
//   read: boolean;
//   created_at: string;
// }

// export default function OwnerMessagesPage() {
//   const { user } = useAuth();
//   const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved'>('all');
//   const [activeEnquiryId, setActiveEnquiryId] = useState<string | null>(null);
//   const [messageInput, setMessageInput] = useState('');
//   const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [approving, setApproving] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

//   useEffect(() => {
//     if (user) fetchEnquiries();
//   }, [user]);

//   useEffect(() => {
//     if (!activeEnquiryId) return;

//     fetchMessages(activeEnquiryId);

//     if (channelRef.current) supabase.removeChannel(channelRef.current);

//     const channel = supabase
//       .channel(`owner-msgs-${activeEnquiryId}`)
//       .on('postgres_changes', {
//         event: 'INSERT',
//         schema: 'public',
//         table: 'messages',
//         filter: `enquiry_id=eq.${activeEnquiryId}`,
//       }, (payload) => {
//         const newMessage = payload.new as Message;
//         setMessages((prev) => {
//           if (prev.find(m => m.id === newMessage.id)) return prev;
//           return [...prev, newMessage];
//         });
//         if (newMessage.sender_type === 'client') {
//           supabase.from('messages').update({ read: true }).eq('id', newMessage.id).then(() => {});
//         }
//       })
//       .subscribe();

//     channelRef.current = channel;
//     return () => { if (channelRef.current) { supabase.removeChannel(channelRef.current); channelRef.current = null; } };
//   }, [activeEnquiryId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const fetchEnquiries = async () => {
//     try {
//       const { data: studiosData } = await supabase.from('studios').select('id').eq('owner_id', user?.id);
//       if (!studiosData || studiosData.length === 0) { setEnquiries([]); setLoading(false); return; }

//       const studioIds = studiosData.map(s => s.id);
//       const { data: enquiriesData, error } = await supabase
//         .from('enquiries')
//         .select('*, studios(name, images, city, state)')
//         .in('studio_id', studioIds)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const enrichedEnquiries = await Promise.all((enquiriesData || []).map(async (enq: any) => {
//         const { data: lastMsg } = await supabase.from('messages').select('message, created_at').eq('enquiry_id', enq.id).order('created_at', { ascending: false }).limit(1);
//         const { count: unreadCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('enquiry_id', enq.id).eq('sender_type', 'client').eq('read', false);

//         return {
//           id: enq.id,
//           guest_name: enq.guest_name,
//           guest_email: enq.guest_email,
//           guest_phone: enq.guest_phone,
//           event_date: enq.event_date,
//           guests_count: enq.guests_count,
//           brief: enq.brief,
//           status: enq.status,
//           studio_id: enq.studio_id,
//           studio_name: enq.studios?.name || 'Unknown Studio',
//           studio_image: enq.studios?.images?.[0] || '',
//           studio_city: enq.studios?.city || '',
//           studio_state: enq.studios?.state || '',
//           last_message: lastMsg?.[0]?.message || enq.brief || 'No messages yet',
//           last_message_time: lastMsg?.[0]?.created_at || enq.created_at,
//           unread_count: unreadCount || 0,
//         };
//       }));

//       setEnquiries(enrichedEnquiries);
//       if (enrichedEnquiries.length > 0 && !activeEnquiryId) setActiveEnquiryId(enrichedEnquiries[0].id);
//     } catch (err) { console.error('Error:', err); } finally { setLoading(false); }
//   };

//   const fetchMessages = async (enquiryId: string) => {
//     const { data } = await supabase.from('messages').select('*').eq('enquiry_id', enquiryId).order('created_at', { ascending: true });
//     if (data) {
//       setMessages(data);
//       const unreadIds = data.filter(m => m.sender_type === 'client' && !m.read).map(m => m.id);
//       if (unreadIds.length > 0) await supabase.from('messages').update({ read: true }).in('id', unreadIds);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!messageInput.trim() || !activeEnquiryId || !user) return;
//     setSending(true);
//     const { error } = await supabase.from('messages').insert({
//       enquiry_id: activeEnquiryId,
//       sender_id: user.id,
//       sender_type: 'owner',
//       message: messageInput.trim(),
//       read: false,
//       created_at: new Date().toISOString(),
//     });
//     if (!error) setMessageInput('');
//     else alert('Failed to send message');
//     setSending(false);
//   };

//   // APPROVE ENQUIRY
//   const handleApprove = async () => {
//     if (!activeEnquiryId || !user) return;
//     setApproving(true);

//     // Update enquiry status
//     const { error: updateError } = await supabase
//       .from('enquiries')
//       .update({ status: 'approved' })
//       .eq('id', activeEnquiryId);

//     if (updateError) { alert('Failed to approve'); setApproving(false); return; }

//     // Send automatic approval message
//     const activeEnq = enquiries.find(e => e.id === activeEnquiryId);
//     await supabase.from('messages').insert({
//       enquiry_id: activeEnquiryId,
//       sender_id: user.id,
//       sender_type: 'system',
//       message: `✅ BOOKING APPROVED: Your enquiry for "${activeEnq?.studio_name}" on ${activeEnq?.event_date} has been approved! The studio is confirmed for your session.`,
//       read: false,
//       created_at: new Date().toISOString(),
//     });

//     // Update local state
//     setEnquiries(prev => prev.map(e => e.id === activeEnquiryId ? { ...e, status: 'approved' } : e));
//     setApproving(false);
//   };

//   // DECLINE ENQUIRY
//   const handleDecline = async () => {
//     if (!activeEnquiryId || !user) return;
//     if (!confirm('Are you sure you want to decline this booking request?')) return;

//     const { error } = await supabase
//       .from('enquiries')
//       .update({ status: 'declined' })
//       .eq('id', activeEnquiryId);

//     if (error) { alert('Failed to decline'); return; }

//     const activeEnq = enquiries.find(e => e.id === activeEnquiryId);
//     await supabase.from('messages').insert({
//       enquiry_id: activeEnquiryId,
//       sender_id: user.id,
//       sender_type: 'system',
//       message: `❌ BOOKING DECLINED: Unfortunately, your enquiry for "${activeEnq?.studio_name}" on ${activeEnq?.event_date} could not be accommodated. Please try another date or studio.`,
//       read: false,
//       created_at: new Date().toISOString(),
//     });

//     setEnquiries(prev => prev.map(e => e.id === activeEnquiryId ? { ...e, status: 'declined' } : e));
//   };

//   // SEND INVOICE
//   const handleSendInvoice = async () => {
//     if (!activeEnquiryId) return;
//     const activeEnq = enquiries.find(e => e.id === activeEnquiryId);
//     await supabase.from('messages').insert({
//       enquiry_id: activeEnquiryId,
//       sender_id: user?.id,
//       sender_type: 'system',
//       message: `🧾 INVOICE SENT: An invoice has been generated for your booking at "${activeEnq?.studio_name}". Please check your email (${activeEnq?.guest_email}) for payment details.`,
//       read: false,
//       created_at: new Date().toISOString(),
//     });
//     alert('Invoice notification sent to client!');
//   };

//   const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

//   const formatTime = (dateStr: string) => {
//     if (!dateStr) return '';
//     const date = new Date(dateStr);
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     if (days === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
//     if (days === 1) return 'Yesterday';
//     if (days < 7) return `${days}d ago`;
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   const activeEnquiry = enquiries.find(e => e.id === activeEnquiryId);
//   const unreadTotal = enquiries.reduce((sum, e) => sum + (e.unread_count || 0), 0);
//   const filteredEnquiries = activeFilter === 'all' ? enquiries : enquiries.filter(e => e.status === activeFilter);

//   if (loading) {
//     return (
//       <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8f9fa]">
//         <div className="animate-pulse text-center">
//           <div className="w-12 h-12 bg-[#446900]/20 rounded-full mx-auto mb-3"></div>
//           <p className="text-[#446900] font-bold text-sm">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
//       <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 flex items-center justify-between px-4 md:px-6 shrink-0">
//         <div className="flex items-center gap-4">
//           <h1 className="text-xl md:text-2xl font-extrabold text-[#446900] tracking-tight">Inbox</h1>
//           {unreadTotal > 0 && (
//             <span className="px-2 py-0.5 bg-[#beff5f] text-[#111f00] text-xs font-bold rounded-full">{unreadTotal} New</span>
//           )}
//         </div>
//       </header>

//       <div className="flex-1 flex overflow-hidden">
//         {/* LEFT: Conversation List */}
//         <div className="w-full md:w-80 lg:w-96 border-r border-[#c2c9b1]/20 flex flex-col bg-white shrink-0">
//           <div className="p-4 border-b border-[#c2c9b1]/20 flex gap-2">
//             {(['all', 'pending', 'approved'] as const).map((filter) => (
//               <button key={filter} onClick={() => setActiveFilter(filter)}
//                 className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeFilter === filter ? 'bg-[#e7e8e9] text-[#191c1d]' : 'hover:bg-[#f3f4f5] text-[#424937]'}`}>
//                 {filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : 'Approved'}
//               </button>
//             ))}
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             {filteredEnquiries.length === 0 ? (
//               <div className="p-8 text-center">
//                 <span className="material-symbols-outlined text-4xl text-[#c2c9b1] mb-3">chat_bubble</span>
//                 <p className="text-[#424937] font-bold text-sm">No enquiries yet</p>
//               </div>
//             ) : (
//               filteredEnquiries.map((enq) => (
//                 <div key={enq.id} onClick={() => setActiveEnquiryId(enq.id)}
//                   className={`p-4 cursor-pointer transition-colors border-b border-[#c2c9b1]/10 ${activeEnquiryId === enq.id ? 'bg-[#beff5f]/10 border-l-4 border-[#446900]' : 'hover:bg-[#f3f4f5]'}`}>
//                   <div className="flex justify-between items-start mb-1">
//                     <div className="flex items-center gap-2">
//                       <span className="font-bold text-sm text-[#191c1d]">{enq.guest_name}</span>
//                       {(enq.unread_count || 0) > 0 && <span className="w-2 h-2 rounded-full bg-[#446900]"></span>}
//                     </div>
//                     <span className="text-[10px] text-[#737a65] uppercase font-bold">{formatTime(enq.last_message_time || enq.event_date)}</span>
//                   </div>
//                   <p className="text-xs font-bold text-[#424937] mb-1">{enq.studio_name}</p>
//                   <div className="flex items-center gap-2">
//                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${enq.status === 'approved' ? 'bg-green-100 text-green-700' : enq.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
//                       {enq.status}
//                     </span>
//                     <p className="text-sm text-[#424937] line-clamp-1">{enq.last_message}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* CENTER: Chat Area */}
//         <div className="flex-1 flex flex-col bg-white relative overflow-hidden min-w-0">
//           {!activeEnquiry ? (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center">
//                 <span className="material-symbols-outlined text-5xl text-[#c2c9b1] mb-4">forum</span>
//                 <p className="text-[#424937] font-bold">Select a conversation</p>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="h-16 border-b border-[#c2c9b1]/20 px-4 md:px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl shrink-0">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-[#635979] text-white flex items-center justify-center font-bold text-sm">
//                     {getInitials(activeEnquiry.guest_name)}
//                   </div>
//                   <div>
//                     <h2 className="font-bold text-sm text-[#191c1d]">{activeEnquiry.guest_name}</h2>
//                     <div className="flex items-center gap-2">
//                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeEnquiry.status === 'approved' ? 'bg-green-100 text-green-700' : activeEnquiry.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
//                         {activeEnquiry.status}
//                       </span>
//                       <p className="text-[10px] text-[#424937]">{activeEnquiry.guest_email}</p>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Action Buttons */}
//                 <div className="flex items-center gap-2">
//                   {activeEnquiry.status === 'pending' && (
//                     <>
//                       <button onClick={handleApprove} disabled={approving}
//                         className="flex items-center gap-1 px-3 py-1.5 bg-[#beff5f] text-[#111f00] rounded-lg text-xs font-bold hover:scale-105 transition-all">
//                         <CheckCircleIcon className="w-4 h-4" /> Approve
//                       </button>
//                       <button onClick={handleDecline}
//                         className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-[#ba1a1a] border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">
//                         <XCircleIcon className="w-4 h-4" /> Decline
//                       </button>
//                     </>
//                   )}
//                   {activeEnquiry.status === 'approved' && (
//                     <button onClick={handleSendInvoice}
//                       className="flex items-center gap-1 px-3 py-1.5 bg-[#e4d7fd] text-[#665c7c] rounded-lg text-xs font-bold hover:scale-105 transition-all">
//                       <DocumentTextIcon className="w-4 h-4" /> Send Invoice
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
//                 {messages.length === 0 ? (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <p className="text-[#424937] font-bold">No messages yet</p>
//                       <p className="text-sm text-[#737a65] mt-1">Send the first message to start the conversation</p>
//                     </div>
//                   </div>
//                 ) : (
//                   messages.map((msg) => (
//                     <div key={msg.id}>
//                       {msg.sender_type === 'system' ? (
//                         <div className="flex justify-center my-3">
//                           <span className="bg-[#e4d7fd]/50 text-[#665c7c] text-[11px] font-bold px-4 py-2 rounded-full">
//                             {msg.message}
//                           </span>
//                         </div>
//                       ) : (
//                         <div className={`flex gap-3 max-w-[80%] ${msg.sender_type === 'owner' ? 'ml-auto flex-row-reverse' : ''}`}>
//                           <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${msg.sender_type === 'owner' ? 'bg-[#446900] text-white' : 'bg-[#e1e3e4] text-[#424937]'}`}>
//                             {msg.sender_type === 'owner' ? 'ME' : getInitials(activeEnquiry.guest_name)}
//                           </div>
//                           <div className={`flex flex-col ${msg.sender_type === 'owner' ? 'items-end' : ''}`}>
//                             <div className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.sender_type === 'owner' ? 'bg-[#eaddff] text-[#1f1732] rounded-br-sm' : 'bg-[#f3f4f5] text-[#191c1d] rounded-bl-sm'}`}>
//                               {msg.message}
//                             </div>
//                             <span className="text-[10px] text-[#737a65] mt-1 px-1">{formatTime(msg.created_at)}</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className="p-4 bg-white border-t border-[#c2c9b1]/20 shrink-0">
//                 <div className="flex items-center gap-3 bg-[#edeeef] rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#beff5f] transition-all">
//                   <input
//                     className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none text-[#191c1d] placeholder:text-[#737a65]"
//                     placeholder="Type your message..."
//                     value={messageInput}
//                     onChange={(e) => setMessageInput(e.target.value)}
//                     onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
//                   />
//                   <button onClick={handleSendMessage} disabled={!messageInput.trim() || sending}
//                     className="bg-[#beff5f] text-[#111f00] p-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
//                     <PaperAirplaneIcon className="w-4 h-4 rotate-90" />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* RIGHT: Inquiry Context */}
//         {activeEnquiry && (
//           <div className="hidden xl:flex w-80 border-l border-[#c2c9b1]/20 flex-col bg-white overflow-y-auto shrink-0">
//             <div className="p-6">
//               <h3 className="text-xs font-bold uppercase tracking-widest text-[#737a65] mb-6">Inquiry Details</h3>
//               <div className="rounded-2xl overflow-hidden bg-[#f8f9fa] mb-6 shadow-sm border border-[#c2c9b1]/20">
//                 {activeEnquiry.studio_image && (
//                   <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url('${activeEnquiry.studio_image}')` }}>
//                     <div className="absolute top-3 right-3 bg-[#446900] text-white font-bold text-[10px] px-2 py-1 rounded-full uppercase">{activeEnquiry.status}</div>
//                   </div>
//                 )}
//                 <div className="p-4">
//                   <h4 className="font-bold text-sm text-[#191c1d] mb-1">{activeEnquiry.studio_name}</h4>
//                   <p className="text-xs text-[#424937] mb-4 flex items-center gap-1"><MapPinIcon className="w-3 h-3" />{activeEnquiry.studio_city}, {activeEnquiry.studio_state}</p>
//                   <div className="space-y-3 mb-5">
//                     <div className="flex justify-between items-center text-sm"><span className="text-[#737a65]">Event Date</span><span className="font-bold text-[#191c1d]">{activeEnquiry.event_date}</span></div>
//                     <div className="flex justify-between items-center text-sm"><span className="text-[#737a65]">Guests</span><span className="font-bold text-[#191c1d]">{activeEnquiry.guests_count} Persons</span></div>
//                   </div>
//                   {activeEnquiry.brief && (
//                     <div className="bg-[#f3f4f5] p-3 rounded-xl"><p className="text-xs font-bold text-[#737a65] mb-1">Client Message</p><p className="text-sm text-[#191c1d]">{activeEnquiry.brief}</p></div>
//                   )}
//                 </div>
//               </div>
//               <div className="bg-[#f3f4f5] p-4 rounded-2xl">
//                 <h4 className="text-xs font-bold uppercase text-[#737a65] mb-3 tracking-widest">Client Info</h4>
//                 <div className="space-y-2 text-sm">
//                   <p><span className="text-[#737a65]">Name:</span> <span className="font-bold text-[#191c1d]">{activeEnquiry.guest_name}</span></p>
//                   <p><span className="text-[#737a65]">Email:</span> <span className="font-bold text-[#191c1d]">{activeEnquiry.guest_email}</span></p>
//                   {activeEnquiry.guest_phone && <p><span className="text-[#737a65]">Phone:</span> <span className="font-bold text-[#191c1d]">{activeEnquiry.guest_phone}</span></p>}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// // app/owner/messages/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import {
//   PhoneIcon,
//   EllipsisVerticalIcon,
//   PaperAirplaneIcon,
//   MapPinIcon,
// } from '@heroicons/react/24/outline';

// interface Enquiry {
//   id: string;
//   guest_name: string;
//   guest_email: string;
//   guest_phone: string;
//   event_date: string;
//   guests_count: number;
//   brief: string;
//   status: string;
//   studio_id: string;
//   studio_name: string;
//   studio_image: string;
//   studio_city: string;
//   studio_state: string;
//   last_message?: string;
//   last_message_time?: string;
//   unread_count?: number;
// }

// interface Message {
//   id: string;
//   enquiry_id: string;
//   sender_id: string;
//   sender_type: 'client' | 'owner';
//   message: string;
//   image_url: string | null;
//   read: boolean;
//   created_at: string;
// }

// export default function OwnerMessagesPage() {
//   const { user } = useAuth();
//   const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
//   const [activeEnquiryId, setActiveEnquiryId] = useState<string | null>(null);
//   const [messageInput, setMessageInput] = useState('');
//   const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

//   useEffect(() => {
//     if (user) {
//       fetchEnquiries();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!activeEnquiryId) return;

//     fetchMessages(activeEnquiryId);

//     if (channelRef.current) {
//       supabase.removeChannel(channelRef.current);
//     }

//     const channel = supabase
//       .channel(`owner-messages-${activeEnquiryId}`)
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'messages',
//           filter: `enquiry_id=eq.${activeEnquiryId}`,
//         },
//         (payload) => {
//           console.log('Owner received message:', payload.new);
//           const newMessage = payload.new as Message;
//           setMessages((prev) => {
//             if (prev.find(m => m.id === newMessage.id)) return prev;
//             return [...prev, newMessage];
//           });
          
//           if (newMessage.sender_type === 'client') {
//             supabase
//               .from('messages')
//               .update({ read: true })
//               .eq('id', newMessage.id)
//               .then(() => console.log('Marked as read'));
//           }
//         }
//       )
//       .subscribe((status) => {
//         console.log('Owner subscription status:', status);
//       });

//     channelRef.current = channel;

//     return () => {
//       if (channelRef.current) {
//         supabase.removeChannel(channelRef.current);
//         channelRef.current = null;
//       }
//     };
//   }, [activeEnquiryId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const fetchEnquiries = async () => {
//     try {
//       const { data: studiosData } = await supabase
//         .from('studios')
//         .select('id')
//         .eq('owner_id', user?.id);

//       if (!studiosData || studiosData.length === 0) {
//         setEnquiries([]);
//         setLoading(false);
//         return;
//       }

//       const studioIds = studiosData.map(s => s.id);

//       const { data: enquiriesData, error } = await supabase
//         .from('enquiries')
//         .select('*, studios(name, images, city, state)')
//         .in('studio_id', studioIds)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const enrichedEnquiries = await Promise.all(
//         (enquiriesData || []).map(async (enq: any) => {
//           const { data: lastMsg } = await supabase
//             .from('messages')
//             .select('message, created_at')
//             .eq('enquiry_id', enq.id)
//             .order('created_at', { ascending: false })
//             .limit(1);

//           const { count: unreadCount } = await supabase
//             .from('messages')
//             .select('*', { count: 'exact', head: true })
//             .eq('enquiry_id', enq.id)
//             .eq('sender_type', 'client')
//             .eq('read', false);

//           return {
//             id: enq.id,
//             guest_name: enq.guest_name,
//             guest_email: enq.guest_email,
//             guest_phone: enq.guest_phone,
//             event_date: enq.event_date,
//             guests_count: enq.guests_count,
//             brief: enq.brief,
//             status: enq.status,
//             studio_id: enq.studio_id,
//             studio_name: enq.studios?.name || 'Unknown Studio',
//             studio_image: enq.studios?.images?.[0] || '',
//             studio_city: enq.studios?.city || '',
//             studio_state: enq.studios?.state || '',
//             last_message: lastMsg?.[0]?.message || enq.brief || 'No messages yet',
//             last_message_time: lastMsg?.[0]?.created_at || enq.created_at,
//             unread_count: unreadCount || 0,
//           };
//         })
//       );

//       setEnquiries(enrichedEnquiries);
      
//       if (enrichedEnquiries.length > 0 && !activeEnquiryId) {
//         setActiveEnquiryId(enrichedEnquiries[0].id);
//       }
//     } catch (err) {
//       console.error('Error fetching enquiries:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMessages = async (enquiryId: string) => {
//     const { data, error } = await supabase
//       .from('messages')
//       .select('*')
//       .eq('enquiry_id', enquiryId)
//       .order('created_at', { ascending: true });

//     if (error) {
//       console.error('Error fetching messages:', error);
//     } else {
//       console.log('Owner messages found:', data?.length || 0);
//       setMessages(data || []);

//       const unreadIds = (data || [])
//         .filter(m => m.sender_type === 'client' && !m.read)
//         .map(m => m.id);

//       if (unreadIds.length > 0) {
//         await supabase
//           .from('messages')
//           .update({ read: true })
//           .in('id', unreadIds);
//       }
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!messageInput.trim() || !activeEnquiryId || !user) return;

//     setSending(true);

//     const newMessage = {
//       enquiry_id: activeEnquiryId,
//       sender_id: user.id,
//       sender_type: 'owner' as const,
//       message: messageInput.trim(),
//       image_url: null,
//       read: false,
//       created_at: new Date().toISOString(),
//     };

//     console.log('Owner sending message:', newMessage);

//     const { data, error } = await supabase
//       .from('messages')
//       .insert(newMessage)
//       .select()
//       .single();

//     if (error) {
//       console.error('Error sending message:', error);
//       alert('Failed to send message: ' + error.message);
//     } else {
//       console.log('Owner message sent:', data);
//       setMessageInput('');
//       if (data) {
//         setMessages((prev) => [...prev, data]);
//       }
//     }
    
//     setSending(false);
//   };

//   const getInitials = (name: string) => {
//     return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
//   };

//   const formatTime = (dateStr: string) => {
//     if (!dateStr) return '';
//     const date = new Date(dateStr);
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
//     if (days === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
//     if (days === 1) return 'Yesterday';
//     if (days < 7) return `${days}d ago`;
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   const activeEnquiry = enquiries.find(e => e.id === activeEnquiryId);
//   const unreadTotal = enquiries.reduce((sum, e) => sum + (e.unread_count || 0), 0);

//   const filteredEnquiries = activeFilter === 'all' 
//     ? enquiries 
//     : enquiries.filter(e => e.status === activeFilter);

//   if (loading) {
//     return (
//       <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8f9fa]">
//         <div className="animate-pulse text-center">
//           <div className="w-12 h-12 bg-[#446900]/20 rounded-full mx-auto mb-3"></div>
//           <p className="text-[#446900] font-bold text-sm">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
//       <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 flex items-center justify-between px-4 md:px-6 shrink-0">
//         <div className="flex items-center gap-4">
//           <h1 className="text-xl md:text-2xl font-extrabold text-[#446900] tracking-tight">Inbox</h1>
//           {unreadTotal > 0 && (
//             <span className="px-2 py-0.5 bg-[#beff5f] text-[#111f00] text-xs font-bold rounded-full">{unreadTotal} New</span>
//           )}
//         </div>
//       </header>

//       <div className="flex-1 flex overflow-hidden">
//         {/* LEFT: Conversation List */}
//         <div className="w-full md:w-80 lg:w-96 border-r border-[#c2c9b1]/20 flex flex-col bg-white shrink-0">
//           <div className="p-4 border-b border-[#c2c9b1]/20 flex gap-2">
//             {(['all', 'pending', 'confirmed'] as const).map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveFilter(filter)}
//                 className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
//                   activeFilter === filter
//                     ? 'bg-[#e7e8e9] text-[#191c1d]'
//                     : 'hover:bg-[#f3f4f5] text-[#424937]'
//                 }`}
//               >
//                 {filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : 'Confirmed'}
//               </button>
//             ))}
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             {filteredEnquiries.length === 0 ? (
//               <div className="p-8 text-center">
//                 <span className="material-symbols-outlined text-4xl text-[#c2c9b1] mb-3">chat_bubble</span>
//                 <p className="text-[#424937] font-bold text-sm">No enquiries yet</p>
//                 <p className="text-xs text-[#737a65] mt-1">When clients book your studios, they'll appear here.</p>
//               </div>
//             ) : (
//               filteredEnquiries.map((enq) => (
//                 <div
//                   key={enq.id}
//                   onClick={() => setActiveEnquiryId(enq.id)}
//                   className={`p-4 cursor-pointer transition-colors border-b border-[#c2c9b1]/10 ${
//                     activeEnquiryId === enq.id
//                       ? 'bg-[#beff5f]/10 border-l-4 border-[#446900]'
//                       : 'hover:bg-[#f3f4f5]'
//                   }`}
//                 >
//                   <div className="flex justify-between items-start mb-1">
//                     <div className="flex items-center gap-2">
//                       <span className="font-bold text-sm text-[#191c1d]">{enq.guest_name}</span>
//                       {(enq.unread_count || 0) > 0 && (
//                         <span className="w-2 h-2 rounded-full bg-[#446900]"></span>
//                       )}
//                     </div>
//                     <span className="text-[10px] text-[#737a65] uppercase font-bold">
//                       {formatTime(enq.last_message_time || enq.event_date)}
//                     </span>
//                   </div>
//                   <p className="text-xs font-bold text-[#424937] mb-1">{enq.studio_name}</p>
//                   <p className="text-sm text-[#424937] line-clamp-1">{enq.last_message || 'No messages'}</p>
//                   {(enq.unread_count || 0) > 0 && (
//                     <span className="inline-block mt-1 px-2 py-0.5 bg-[#beff5f] text-[#111f00] text-[10px] font-bold rounded-full">
//                       {enq.unread_count}
//                     </span>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* CENTER: Chat Area */}
//         <div className="flex-1 flex flex-col bg-white relative overflow-hidden min-w-0">
//           {!activeEnquiry ? (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center">
//                 <span className="material-symbols-outlined text-5xl text-[#c2c9b1] mb-4">forum</span>
//                 <p className="text-[#424937] font-bold">Select a conversation</p>
//               </div>
//             </div>
//           ) : (
//             <>
//               <div className="h-16 border-b border-[#c2c9b1]/20 px-4 md:px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl shrink-0">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-[#635979] text-white flex items-center justify-center font-bold text-sm">
//                     {getInitials(activeEnquiry.guest_name)}
//                   </div>
//                   <div>
//                     <h2 className="font-bold text-sm text-[#191c1d]">{activeEnquiry.guest_name}</h2>
//                     <p className="text-[10px] text-[#424937]">{activeEnquiry.guest_email}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
//                 {messages.length === 0 ? (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <p className="text-[#424937] font-bold">No messages yet</p>
//                       <p className="text-sm text-[#737a65] mt-1">Send the first message to start the conversation</p>
//                     </div>
//                   </div>
//                 ) : (
//                   messages.map((msg) => (
//                     <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.sender_type === 'owner' ? 'ml-auto flex-row-reverse' : ''}`}>
//                       <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
//                         msg.sender_type === 'owner' ? 'bg-[#446900] text-white' : 'bg-[#e1e3e4] text-[#424937]'
//                       }`}>
//                         {msg.sender_type === 'owner' ? 'ME' : getInitials(activeEnquiry.guest_name)}
//                       </div>
//                       <div className={`flex flex-col ${msg.sender_type === 'owner' ? 'items-end' : ''}`}>
//                         <div className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
//                           msg.sender_type === 'owner'
//                             ? 'bg-[#eaddff] text-[#1f1732] rounded-br-sm'
//                             : 'bg-[#f3f4f5] text-[#191c1d] rounded-bl-sm'
//                         }`}>
//                           {msg.message}
//                         </div>
//                         <span className="text-[10px] text-[#737a65] mt-1 px-1">{formatTime(msg.created_at)}</span>
//                       </div>
//                     </div>
//                   ))
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className="p-4 bg-white border-t border-[#c2c9b1]/20 shrink-0">
//                 <div className="flex items-center gap-3 bg-[#edeeef] rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#beff5f] transition-all">
//                   <input
//                     className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none text-[#191c1d] placeholder:text-[#737a65]"
//                     placeholder="Type your message..."
//                     value={messageInput}
//                     onChange={(e) => setMessageInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         handleSendMessage();
//                       }
//                     }}
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!messageInput.trim() || sending}
//                     className="bg-[#beff5f] text-[#111f00] p-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
//                   >
//                     <PaperAirplaneIcon className="w-4 h-4 rotate-90" />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* RIGHT: Inquiry Context */}
//         {activeEnquiry && (
//           <div className="hidden xl:flex w-80 border-l border-[#c2c9b1]/20 flex-col bg-white overflow-y-auto shrink-0">
//             <div className="p-6">
//               <h3 className="text-xs font-bold uppercase tracking-widest text-[#737a65] mb-6">Inquiry Details</h3>
              
//               <div className="rounded-2xl overflow-hidden bg-[#f8f9fa] mb-6 shadow-sm border border-[#c2c9b1]/20">
//                 {activeEnquiry.studio_image && (
//                   <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url('${activeEnquiry.studio_image}')` }}>
//                     <div className="absolute top-3 right-3 bg-[#446900] text-white font-bold text-[10px] px-2 py-1 rounded-full uppercase">
//                       {activeEnquiry.status}
//                     </div>
//                   </div>
//                 )}
//                 <div className="p-4">
//                   <h4 className="font-bold text-sm text-[#191c1d] mb-1">{activeEnquiry.studio_name}</h4>
//                   <p className="text-xs text-[#424937] mb-4 flex items-center gap-1">
//                     <MapPinIcon className="w-3 h-3" />
//                     {activeEnquiry.studio_city}, {activeEnquiry.studio_state}
//                   </p>
//                   <div className="space-y-3 mb-5">
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="text-[#737a65]">Event Date</span>
//                       <span className="font-bold text-[#191c1d]">{activeEnquiry.event_date}</span>
//                     </div>
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="text-[#737a65]">Guests</span>
//                       <span className="font-bold text-[#191c1d]">{activeEnquiry.guests_count} Persons</span>
//                     </div>
//                   </div>
//                   {activeEnquiry.brief && (
//                     <div className="bg-[#f3f4f5] p-3 rounded-xl">
//                       <p className="text-xs font-bold text-[#737a65] mb-1">Client Message</p>
//                       <p className="text-sm text-[#191c1d]">{activeEnquiry.brief}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-[#f3f4f5] p-4 rounded-2xl">
//                 <h4 className="text-xs font-bold uppercase text-[#737a65] mb-3 tracking-widest">Client Info</h4>
//                 <div className="space-y-2 text-sm">
//                   <p><span className="text-[#737a65]">Name:</span> <span className="font-bold text-[#191c1d]">{activeEnquiry.guest_name}</span></p>
//                   <p><span className="text-[#737a65]">Email:</span> <span className="font-bold text-[#191c1d]">{activeEnquiry.guest_email}</span></p>
//                   {activeEnquiry.guest_phone && (
//                     <p><span className="text-[#737a65]">Phone:</span> <span className="font-bold text-[#191c1d]">{activeEnquiry.guest_phone}</span></p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// // app/owner/messages/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import {
//   MagnifyingGlassIcon,
//   PhoneIcon,
//   VideoCameraIcon,
//   EllipsisVerticalIcon,
//   FaceSmileIcon,
//   PaperAirplaneIcon,
//   PlusCircleIcon,
//   MapPinIcon,
//   StarIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface Enquiry {
//   id: string;
//   guest_name: string;
//   guest_email: string;
//   guest_phone: string;
//   event_date: string;
//   guests_count: number;
//   brief: string;
//   status: string;
//   studio_id: string;
//   studio_name: string;
//   studio_image: string;
//   studio_city: string;
//   studio_state: string;
//   last_message?: string;
//   last_message_time?: string;
//   unread_count?: number;
// }

// interface Message {
//   id: string;
//   enquiry_id: string;
//   sender_id: string;
//   sender_type: 'client' | 'owner';
//   message: string;
//   image_url: string | null;
//   read: boolean;
//   created_at: string;
// }

// export default function OwnerMessagesPage() {
//   const { user } = useAuth();
//   const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
//   const [activeEnquiryId, setActiveEnquiryId] = useState<string | null>(null);
//   const [messageInput, setMessageInput] = useState('');
//   const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const channelRef = useRef<any>(null);

//   // Fetch enquiries for owner's studios
//   useEffect(() => {
//     if (user) {
//       fetchEnquiries();
//     }
//   }, [user]);

//   // Subscribe to real-time messages
//   useEffect(() => {
//     if (!activeEnquiryId) return;

//     // Fetch existing messages
//     fetchMessages(activeEnquiryId);

//     // Subscribe to new messages
//     const channel = supabase
//       .channel(`messages:${activeEnquiryId}`)
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'messages',
//           filter: `enquiry_id=eq.${activeEnquiryId}`,
//         },
//         (payload) => {
//           const newMessage = payload.new as Message;
//           setMessages((prev) => [...prev, newMessage]);
          
//           // Mark as read if from client
//           if (newMessage.sender_type === 'client') {
//             supabase
//               .from('messages')
//               .update({ read: true })
//               .eq('id', newMessage.id)
//               .then(() => {});
//           }
//         }
//       )
//       .subscribe();

//     channelRef.current = channel;

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [activeEnquiryId]);

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const fetchEnquiries = async () => {
//     try {
//       // Get all enquiries for studios owned by this user
//       const { data: studiosData } = await supabase
//         .from('studios')
//         .select('id')
//         .eq('owner_id', user?.id);

//       if (!studiosData || studiosData.length === 0) {
//         setEnquiries([]);
//         setLoading(false);
//         return;
//       }

//       const studioIds = studiosData.map(s => s.id);

//       const { data: enquiriesData, error } = await supabase
//         .from('enquiries')
//         .select('*, studios(name, images, city, state)')
//         .in('studio_id', studioIds)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       // Get last message for each enquiry
//       const enrichedEnquiries = await Promise.all(
//         (enquiriesData || []).map(async (enq: any) => {
//           const { data: lastMsg } = await supabase
//             .from('messages')
//             .select('message, created_at, read')
//             .eq('enquiry_id', enq.id)
//             .order('created_at', { ascending: false })
//             .limit(1);

//           const { count: unreadCount } = await supabase
//             .from('messages')
//             .select('*', { count: 'exact', head: true })
//             .eq('enquiry_id', enq.id)
//             .eq('sender_type', 'client')
//             .eq('read', false);

//           return {
//             id: enq.id,
//             guest_name: enq.guest_name,
//             guest_email: enq.guest_email,
//             guest_phone: enq.guest_phone,
//             event_date: enq.event_date,
//             guests_count: enq.guests_count,
//             brief: enq.brief,
//             status: enq.status,
//             studio_id: enq.studio_id,
//             studio_name: enq.studios?.name || 'Unknown Studio',
//             studio_image: enq.studios?.images?.[0] || '',
//             studio_city: enq.studios?.city || '',
//             studio_state: enq.studios?.state || '',
//             last_message: lastMsg?.[0]?.message || enq.brief || 'No messages yet',
//             last_message_time: lastMsg?.[0]?.created_at || enq.created_at,
//             unread_count: unreadCount || 0,
//           };
//         })
//       );

//       setEnquiries(enrichedEnquiries);
      
//       // Auto-select first enquiry
//       if (enrichedEnquiries.length > 0 && !activeEnquiryId) {
//         setActiveEnquiryId(enrichedEnquiries[0].id);
//       }
//     } catch (err) {
//       console.error('Error fetching enquiries:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMessages = async (enquiryId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('messages')
//         .select('*')
//         .eq('enquiry_id', enquiryId)
//         .order('created_at', { ascending: true });

//       if (error) throw error;
//       setMessages(data || []);

//       // Mark unread messages as read
//       const unreadIds = (data || [])
//         .filter(m => m.sender_type === 'client' && !m.read)
//         .map(m => m.id);

//       if (unreadIds.length > 0) {
//         await supabase
//           .from('messages')
//           .update({ read: true })
//           .in('id', unreadIds);
//       }
//     } catch (err) {
//       console.error('Error fetching messages:', err);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!messageInput.trim() || !activeEnquiryId || !user) return;

//     const newMessage = {
//       enquiry_id: activeEnquiryId,
//       sender_id: user.id,
//       sender_type: 'owner' as const,
//       message: messageInput.trim(),
//       image_url: null,
//       read: false,
//       created_at: new Date().toISOString(),
//     };

//     try {
//       const { error } = await supabase
//         .from('messages')
//         .insert(newMessage);

//       if (error) throw error;
//       setMessageInput('');
//     } catch (err) {
//       console.error('Error sending message:', err);
//     }
//   };

//   const getInitials = (name: string) => {
//     return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
//   };

//   const formatTime = (dateStr: string) => {
//     const date = new Date(dateStr);
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
//     if (days === 0) {
//       return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
//     } else if (days === 1) {
//       return 'Yesterday';
//     } else if (days < 7) {
//       return `${days}d ago`;
//     } else {
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     }
//   };

//   const activeEnquiry = enquiries.find(e => e.id === activeEnquiryId);
//   const unreadTotal = enquiries.reduce((sum, e) => sum + (e.unread_count || 0), 0);

//   const filteredEnquiries = activeFilter === 'all' 
//     ? enquiries 
//     : enquiries.filter(e => e.status === activeFilter);

//   if (loading) {
//     return (
//       <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-[#f8f9fa]">
//         <div className="animate-pulse text-center">
//           <div className="w-12 h-12 bg-[#446900]/20 rounded-full mx-auto mb-3"></div>
//           <p className="text-[#446900] font-bold text-sm">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
//       {/* Header */}
//       <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shrink-0">
//         <div className="flex items-center gap-4">
//           <h1 className="text-xl md:text-2xl font-extrabold text-[#446900] tracking-tight">Inbox</h1>
//           {unreadTotal > 0 && (
//             <span className="px-2 py-0.5 bg-[#beff5f] text-[#111f00] text-xs font-bold rounded-full">
//               {unreadTotal} New
//             </span>
//           )}
//         </div>
//         <div className="flex items-center gap-3">
//           <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//             <span className="material-symbols-outlined text-[#424937]">notifications</span>
//           </button>
//         </div>
//       </header>

//       <div className="flex-1 flex overflow-hidden">
//         {/* LEFT: Conversation List */}
//         <div className="w-full md:w-80 lg:w-96 border-r border-[#c2c9b1]/20 flex flex-col bg-white shrink-0">
//           <div className="p-4 border-b border-[#c2c9b1]/20 flex gap-2">
//             {(['all', 'pending', 'confirmed'] as const).map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveFilter(filter)}
//                 className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
//                   activeFilter === filter
//                     ? 'bg-[#e7e8e9] text-[#191c1d]'
//                     : 'hover:bg-[#f3f4f5] text-[#424937]'
//                 }`}
//               >
//                 {filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : 'Confirmed'}
//               </button>
//             ))}
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             {filteredEnquiries.length === 0 ? (
//               <div className="p-8 text-center">
//                 <span className="material-symbols-outlined text-4xl text-[#c2c9b1] mb-3">chat_bubble</span>
//                 <p className="text-[#424937] font-bold text-sm">No enquiries yet</p>
//                 <p className="text-xs text-[#737a65] mt-1">When clients book your studios, they'll appear here.</p>
//               </div>
//             ) : (
//               filteredEnquiries.map((enq) => (
//                 <div
//                   key={enq.id}
//                   onClick={() => setActiveEnquiryId(enq.id)}
//                   className={`p-4 cursor-pointer transition-colors border-b border-[#c2c9b1]/10 ${
//                     activeEnquiryId === enq.id
//                       ? 'bg-[#beff5f]/10 border-l-4 border-[#446900]'
//                       : 'hover:bg-[#f3f4f5]'
//                   }`}
//                 >
//                   <div className="flex justify-between items-start mb-1">
//                     <div className="flex items-center gap-2">
//                       <span className="font-bold text-sm text-[#191c1d]">{enq.guest_name}</span>
//                       {(enq.unread_count || 0) > 0 && (
//                         <span className="w-2 h-2 rounded-full bg-[#446900]"></span>
//                       )}
//                     </div>
//                     <span className="text-[10px] text-[#737a65] uppercase font-bold">
//                       {formatTime(enq.last_message_time || enq.event_date)}
//                     </span>
//                   </div>
//                   <p className="text-xs font-bold text-[#424937] mb-1">
//                     {enq.studio_name}
//                   </p>
//                   <p className="text-sm text-[#424937] line-clamp-1">
//                     {enq.last_message || 'No messages'}
//                   </p>
//                   {(enq.unread_count || 0) > 0 && (
//                     <span className="inline-block mt-1 px-2 py-0.5 bg-[#beff5f] text-[#111f00] text-[10px] font-bold rounded-full">
//                       {enq.unread_count}
//                     </span>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* CENTER: Chat Area */}
//         <div className="flex-1 flex flex-col bg-white relative overflow-hidden min-w-0">
//           {!activeEnquiry ? (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center">
//                 <span className="material-symbols-outlined text-5xl text-[#c2c9b1] mb-4">forum</span>
//                 <p className="text-[#424937] font-bold">Select a conversation</p>
//                 <p className="text-sm text-[#737a65] mt-1">Choose an enquiry to view messages</p>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Chat Header */}
//               <div className="h-16 border-b border-[#c2c9b1]/20 px-4 md:px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl shrink-0">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-[#635979] text-white flex items-center justify-center font-bold text-sm">
//                     {getInitials(activeEnquiry.guest_name)}
//                   </div>
//                   <div>
//                     <h2 className="font-bold text-sm text-[#191c1d]">{activeEnquiry.guest_name}</h2>
//                     <p className="text-[10px] text-[#424937]">{activeEnquiry.guest_email}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//                     <PhoneIcon className="w-5 h-5 text-[#424937]" />
//                   </button>
//                   <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//                     <EllipsisVerticalIcon className="w-5 h-5 text-[#424937]" />
//                   </button>
//                 </div>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
//                 {messages.length === 0 ? (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center">
//                       <p className="text-[#424937] font-bold">No messages yet</p>
//                       <p className="text-sm text-[#737a65] mt-1">Send the first message to start the conversation</p>
//                     </div>
//                   </div>
//                 ) : (
//                   messages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex gap-3 max-w-[80%] ${msg.sender_type === 'owner' ? 'ml-auto flex-row-reverse' : ''}`}
//                     >
//                       <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
//                         msg.sender_type === 'owner' ? 'bg-[#446900] text-white' : 'bg-[#e1e3e4] text-[#424937]'
//                       }`}>
//                         {msg.sender_type === 'owner' ? 'ME' : getInitials(activeEnquiry.guest_name)}
//                       </div>
//                       <div className={`flex flex-col ${msg.sender_type === 'owner' ? 'items-end' : ''}`}>
//                         <div className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
//                           msg.sender_type === 'owner'
//                             ? 'bg-[#eaddff] text-[#1f1732] rounded-br-sm'
//                             : 'bg-[#f3f4f5] text-[#191c1d] rounded-bl-sm'
//                         }`}>
//                           {msg.message}
//                         </div>
//                         <span className="text-[10px] text-[#737a65] mt-1 px-1">
//                           {formatTime(msg.created_at)}
//                         </span>
//                       </div>
//                     </div>
//                   ))
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Message Input */}
//               <div className="p-4 bg-white/50 backdrop-blur-md border-t border-[#c2c9b1]/20 shrink-0">
//                 <div className="flex items-center gap-3 bg-[#edeeef] rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#beff5f] transition-all">
//                   <input
//                     className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none"
//                     placeholder="Type your message..."
//                     type="text"
//                     value={messageInput}
//                     onChange={(e) => setMessageInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault();
//                         handleSendMessage();
//                       }
//                     }}
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!messageInput.trim()}
//                     className="bg-[#beff5f] text-[#111f00] p-2 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
//                   >
//                     <PaperAirplaneIcon className="w-4 h-4 rotate-90" />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* RIGHT: Inquiry Context */}
//         {activeEnquiry && (
//           <div className="hidden xl:flex w-80 border-l border-[#c2c9b1]/20 flex-col bg-white overflow-y-auto shrink-0">
//             <div className="p-6">
//               <h3 className="text-xs font-bold uppercase tracking-widest text-[#737a65] mb-6">Inquiry Details</h3>
              
//               <div className="rounded-2xl overflow-hidden bg-[#f8f9fa] mb-6 shadow-sm border border-[#c2c9b1]/20">
//                 {activeEnquiry.studio_image && (
//                   <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url('${activeEnquiry.studio_image}')` }}>
//                     <div className="absolute top-3 right-3 bg-[#446900] text-white font-bold text-[10px] px-2 py-1 rounded-full">
//                       {activeEnquiry.status.toUpperCase()}
//                     </div>
//                   </div>
//                 )}
//                 <div className="p-4">
//                   <h4 className="font-bold text-sm text-[#191c1d] mb-1">{activeEnquiry.studio_name}</h4>
//                   <p className="text-xs text-[#424937] mb-4 flex items-center gap-1">
//                     <MapPinIcon className="w-3 h-3" />
//                     {activeEnquiry.studio_city}, {activeEnquiry.studio_state}
//                   </p>
//                   <div className="space-y-3 mb-5">
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="text-[#737a65]">Event Date</span>
//                       <span className="font-bold text-[#191c1d]">{activeEnquiry.event_date}</span>
//                     </div>
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="text-[#737a65]">Guests</span>
//                       <span className="font-bold text-[#191c1d]">{activeEnquiry.guests_count} Persons</span>
//                     </div>
//                     <div className="flex justify-between items-center text-sm">
//                       <span className="text-[#737a65]">Status</span>
//                       <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${
//                         activeEnquiry.status === 'pending' ? 'bg-amber-100 text-amber-700' :
//                         activeEnquiry.status === 'approved' ? 'bg-green-100 text-green-700' :
//                         'bg-gray-100 text-gray-600'
//                       }`}>
//                         {activeEnquiry.status}
//                       </span>
//                     </div>
//                   </div>
//                   {activeEnquiry.brief && (
//                     <div className="bg-[#f3f4f5] p-3 rounded-xl mb-4">
//                       <p className="text-xs font-bold text-[#737a65] mb-1">Client Message</p>
//                       <p className="text-sm text-[#191c1d]">{activeEnquiry.brief}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-[#f3f4f5] p-4 rounded-2xl">
//                 <h4 className="text-xs font-bold uppercase text-[#737a65] mb-3 tracking-widest">Client Info</h4>
//                 <div className="space-y-2 text-sm">
//                   <p><span className="text-[#737a65]">Name:</span> <span className="font-bold">{activeEnquiry.guest_name}</span></p>
//                   <p><span className="text-[#737a65]">Email:</span> <span className="font-bold">{activeEnquiry.guest_email}</span></p>
//                   {activeEnquiry.guest_phone && (
//                     <p><span className="text-[#737a65]">Phone:</span> <span className="font-bold">{activeEnquiry.guest_phone}</span></p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// // app/owner/messages/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import {
//   MagnifyingGlassIcon,
//   PhoneIcon,
//   VideoCameraIcon,
//   EllipsisVerticalIcon,
//   FaceSmileIcon,
//   PaperAirplaneIcon,
//   PlusCircleIcon,
//   MapPinIcon,
//   StarIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface Conversation {
//   id: string;
//   guestName: string;
//   guestInitials: string;
//   studioName: string;
//   lastMessage: string;
//   time: string;
//   unread: boolean;
//   online: boolean;
//   inquiryType: string;
//   status: 'active' | 'pending' | 'confirmed';
// }

// interface Message {
//   id: string;
//   sender: 'guest' | 'host';
//   text: string;
//   time: string;
//   isTyping?: boolean;
// }

// interface InquiryContext {
//   studioName: string;
//   studioImage: string;
//   location: string;
//   requestedDate: string;
//   timeSlot: string;
//   crewSize: number;
//   guestName: string;
//   guestInitials: string;
//   guestRating: number;
//   guestBookings: number;
//   tags: string[];
// }

// export default function OwnerMessagesPage() {
//   const { user } = useAuth();
//   const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
//   const [activeConversation, setActiveConversation] = useState('1');
//   const [messageInput, setMessageInput] = useState('');

//   const [conversations] = useState<Conversation[]>([
//     {
//       id: '1',
//       guestName: 'Julianne Moore',
//       guestInitials: 'JM',
//       studioName: 'Neon Void Studio',
//       lastMessage: '"We\'re looking to film a music video this coming Friday..."',
//       time: '12:45 PM',
//       unread: true,
//       online: true,
//       inquiryType: 'Music Video',
//       status: 'active',
//     },
//     {
//       id: '2',
//       guestName: 'Marcus Thorne',
//       guestInitials: 'MT',
//       studioName: 'Daylight Penthouse',
//       lastMessage: 'Can we bring a smoke machine for the shoot?',
//       time: 'Yesterday',
//       unread: false,
//       online: false,
//       inquiryType: 'Photography',
//       status: 'pending',
//     },
//     {
//       id: '3',
//       guestName: 'Elena Rodriguez',
//       guestInitials: 'ER',
//       studioName: 'Industrial Loft B',
//       lastMessage: 'The lighting looks perfect. Is there parking available?',
//       time: 'Oct 24',
//       unread: true,
//       online: true,
//       inquiryType: 'Fashion Shoot',
//       status: 'active',
//     },
//     {
//       id: '4',
//       guestName: 'Creative Pulse Agency',
//       guestInitials: 'CP',
//       studioName: 'The Glass House',
//       lastMessage: 'Finalizing the contract for next month\'s campaign.',
//       time: 'Oct 22',
//       unread: false,
//       online: false,
//       inquiryType: 'Commercial',
//       status: 'confirmed',
//     },
//   ]);

//   const [messages] = useState<Message[]>([
//     {
//       id: '1',
//       sender: 'guest',
//       text: 'Hi there! I\'m Julianne from the Collective. We are absolutely obsessed with the Neon Void Studio. We\'re planning a 6-hour music video shoot for an emerging artist this coming Friday.',
//       time: '10:25 AM',
//     },
//     {
//       id: '2',
//       sender: 'guest',
//       text: 'Is the overhead RGB rigging included in the standard hourly rate, or is that an add-on?',
//       time: '10:26 AM',
//     },
//     {
//       id: '3',
//       sender: 'host',
//       text: 'Hi Julianne! Excited to hear you\'re interested. Yes, the RGB rigging is fully integrated and included in your booking!',
//       time: '12:10 PM',
//     },
//     {
//       id: '4',
//       sender: 'guest',
//       text: 'Julianne is typing...',
//       time: '',
//       isTyping: true,
//     },
//   ]);

//   const [inquiryContext] = useState<InquiryContext>({
//     studioName: 'Neon Void Studio',
//     studioImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn1chR3WpbzIHQbQQrxUL5BjDTty3Q1xMgkClEg7ia5W98Pk-5EYxr-rLzQF2Q7E0xgFRV1DEExHAsbUXW7E6TtjX2m4gU4SFthT1P4hU36o52mYR_W15IguYIoAUZ1u6vO5Ux5ttk9FQSn7Ju8KIT3ClG3iu8GWxNbUwJvzQmoBsgdZ7R8Kg_sE0ZItZs-qJ6dcrt_kMxoaBECNGG_GyXTIvJqqxSmFI64ruUFRhBtzoq6lW_WsrVqEOpwvLku92R5UhQqZm_yHao',
//     location: 'Brooklyn, NY',
//     requestedDate: 'Oct 28, 2024',
//     timeSlot: '02:00 PM - 08:00 PM',
//     crewSize: 12,
//     guestName: 'Julianne Moore',
//     guestInitials: 'JM',
//     guestRating: 4.9,
//     guestBookings: 12,
//     tags: ['Music Video', 'Production', 'Loyal Client'],
//   });

//   const activeConv = conversations.find(c => c.id === activeConversation);
//   const unreadCount = conversations.filter(c => c.unread).length;

//   const handleSendMessage = () => {
//     if (messageInput.trim()) {
//       setMessageInput('');
//     }
//   };

//   const filteredConversations = activeFilter === 'all' 
//     ? conversations 
//     : conversations.filter(c => c.status === activeFilter);

//   return (
//     <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
//       {/* Header */}
//       <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
//         <div className="flex items-center gap-4">
//           <h1 className="text-xl md:text-2xl font-extrabold text-[#446900] tracking-tight">Inbox</h1>
//           {unreadCount > 0 && (
//             <span className="px-2 py-0.5 bg-[#beff5f] text-[#111f00] text-xs font-bold rounded-full">
//               {unreadCount} New
//             </span>
//           )}
//         </div>
//         <div className="flex items-center gap-4 md:gap-6">
//           <div className="relative hidden md:block">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c2c9b1]" />
//             <input
//               className="pl-10 pr-4 py-2 bg-[#edeeef] border-none rounded-full text-sm focus:ring-2 focus:ring-[#beff5f] w-64 outline-none"
//               placeholder="Search inquiries..."
//               type="text"
//             />
//           </div>
//           <div className="flex items-center gap-3">
//             <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//               <span className="material-symbols-outlined text-[#424937]">favorite</span>
//             </button>
//             <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//               <span className="material-symbols-outlined text-[#424937]">notifications</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Messaging Layout */}
//       <div className="flex-1 flex overflow-hidden">
        
//         {/* LEFT: Conversation List */}
//         <div className="w-full md:w-80 lg:w-96 border-r border-[#c2c9b1]/20 flex flex-col bg-white">
//           {/* Filter Tabs */}
//           <div className="p-4 border-b border-[#c2c9b1]/20 flex gap-2">
//             {(['all', 'pending', 'confirmed'] as const).map((filter) => (
//               <button
//                 key={filter}
//                 onClick={() => setActiveFilter(filter)}
//                 className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
//                   activeFilter === filter
//                     ? 'bg-[#e7e8e9] text-[#191c1d]'
//                     : 'hover:bg-[#f3f4f5] text-[#424937]'
//                 }`}
//               >
//                 {filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : 'Confirmed'}
//               </button>
//             ))}
//           </div>

//           {/* Conversation List */}
//           <div className="flex-1 overflow-y-auto">
//             {filteredConversations.map((conv) => (
//               <div
//                 key={conv.id}
//                 onClick={() => setActiveConversation(conv.id)}
//                 className={`p-4 cursor-pointer transition-colors border-b border-[#c2c9b1]/10 ${
//                   activeConversation === conv.id
//                     ? 'bg-[#beff5f]/10 border-l-4 border-[#446900]'
//                     : 'hover:bg-[#f3f4f5]'
//                 }`}
//               >
//                 <div className="flex justify-between items-start mb-1">
//                   <div className="flex items-center gap-2">
//                     <span className="font-bold text-sm text-[#191c1d]">{conv.guestName}</span>
//                     {conv.online && (
//                       <div className="w-2 h-2 rounded-full bg-[#446900] animate-pulse"></div>
//                     )}
//                   </div>
//                   <span className="text-[10px] text-[#737a65] uppercase font-bold">{conv.time}</span>
//                 </div>
//                 <p className={`text-xs font-bold mb-1 ${conv.unread ? 'text-[#446900]' : 'text-[#424937]'}`}>
//                   Inquiry: {conv.studioName}
//                 </p>
//                 <p className="text-sm text-[#424937] line-clamp-1 italic">"{conv.lastMessage}"</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* CENTER: Chat Area */}
//         <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
//           {/* Chat Header */}
//           <div className="h-16 border-b border-[#c2c9b1]/20 px-4 md:px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl sticky top-0 z-10">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-full bg-[#635979] text-white flex items-center justify-center font-bold text-xs">
//                 {activeConv?.guestInitials || '??'}
//               </div>
//               <div>
//                 <h2 className="font-bold text-sm text-[#191c1d]">{activeConv?.guestName || 'Select a conversation'}</h2>
//                 {activeConv?.online && (
//                   <p className="text-[10px] text-[#446900] flex items-center gap-1 uppercase tracking-wider font-bold">
//                     <span className="w-1.5 h-1.5 bg-[#446900] rounded-full"></span> Online
//                   </p>
//                 )}
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//                 <VideoCameraIcon className="w-5 h-5 text-[#424937]" />
//               </button>
//               <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//                 <PhoneIcon className="w-5 h-5 text-[#424937]" />
//               </button>
//               <button className="p-2 hover:bg-[#edeeef] rounded-full transition-colors">
//                 <EllipsisVerticalIcon className="w-5 h-5 text-[#424937]" />
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
//             <div className="flex justify-center">
//               <span className="text-[10px] uppercase font-bold text-[#737a65] tracking-widest bg-[#edeeef] px-3 py-1 rounded-full">
//                 Today, 10:24 AM
//               </span>
//             </div>

//             {messages.map((msg) => (
//               <div key={msg.id}>
//                 {msg.isTyping ? (
//                   <div className="flex gap-3 max-w-[80%]">
//                     <div className="w-8 h-8 shrink-0 rounded-full bg-[#e1e3e4] flex items-center justify-center">
//                       <span className="material-symbols-outlined text-xs text-[#424937]">person</span>
//                     </div>
//                     <div>
//                       <div className="bg-[#f3f4f5] p-4 rounded-2xl rounded-bl-sm shadow-sm text-sm text-[#191c1d] animate-pulse">
//                         {msg.text}
//                       </div>
//                     </div>
//                   </div>
//                 ) : msg.sender === 'guest' ? (
//                   <div className="flex gap-3 max-w-[80%]">
//                     <div className="w-8 h-8 shrink-0 rounded-full bg-[#e1e3e4] flex items-center justify-center">
//                       <span className="material-symbols-outlined text-xs text-[#424937]">person</span>
//                     </div>
//                     <div>
//                       <div className="bg-[#f3f4f5] p-4 rounded-2xl rounded-bl-sm shadow-sm text-sm text-[#191c1d] leading-relaxed">
//                         {msg.text}
//                       </div>
//                       {msg.time && (
//                         <span className="text-[10px] text-[#737a65] mt-1 ml-1 block">{msg.time}</span>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto">
//                     <div className="w-8 h-8 shrink-0 rounded-full bg-[#446900] flex items-center justify-center">
//                       <span className="material-symbols-outlined text-white text-xs">storefront</span>
//                     </div>
//                     <div className="flex flex-col items-end">
//                       <div className="bg-[#eaddff] p-4 rounded-2xl rounded-br-sm shadow-sm text-sm text-[#1f1732] leading-relaxed">
//                         {msg.text}
//                       </div>
//                       {msg.time && (
//                         <span className="text-[10px] text-[#737a65] mt-1 mr-1 block">{msg.time}</span>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Message Input */}
//           <div className="p-4 md:p-6 bg-white/50 backdrop-blur-md border-t border-[#c2c9b1]/20">
//             <div className="flex items-center gap-3 bg-[#edeeef] rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-[#beff5f] transition-all">
//               <button className="p-1 text-[#424937] hover:text-[#446900] transition-colors">
//                 <PlusCircleIcon className="w-5 h-5" />
//               </button>
//               <input
//                 className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none"
//                 placeholder="Type your message..."
//                 type="text"
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSendMessage();
//                   }
//                 }}
//               />
//               <button className="p-1 text-[#424937] hover:text-[#446900] transition-colors">
//                 <FaceSmileIcon className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={handleSendMessage}
//                 className="bg-[#beff5f] text-[#111f00] p-2 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
//               >
//                 <PaperAirplaneIcon className="w-4 h-4 rotate-90" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT: Inquiry Context */}
//         <div className="hidden xl:flex w-80 border-l border-[#c2c9b1]/20 flex-col bg-white overflow-y-auto">
//           <div className="p-6">
//             <h3 className="text-xs font-bold uppercase tracking-widest text-[#737a65] mb-6">Inquiry Context</h3>
            
//             {/* Studio Card */}
//             <div className="rounded-2xl overflow-hidden bg-[#f8f9fa] mb-6 shadow-sm border border-[#c2c9b1]/20">
//               <div
//                 className="h-40 bg-cover bg-center relative"
//                 style={{ backgroundImage: `url('${inquiryContext.studioImage}')` }}
//               >
//                 <div className="absolute top-3 right-3 bg-[#446900] text-white font-bold text-[10px] px-2 py-1 rounded-full shadow-lg">
//                   PREMIUM SPACE
//                 </div>
//               </div>
//               <div className="p-4">
//                 <h4 className="font-bold text-sm text-[#191c1d] mb-1">{inquiryContext.studioName}</h4>
//                 <p className="text-xs text-[#424937] mb-4 flex items-center gap-1">
//                   <MapPinIcon className="w-3 h-3" />
//                   {inquiryContext.location}
//                 </p>
//                 <div className="space-y-3 mb-5">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-[#737a65]">Requested Date</span>
//                     <span className="font-bold text-[#191c1d]">{inquiryContext.requestedDate}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-[#737a65]">Time Slot</span>
//                     <span className="font-bold text-[#191c1d]">{inquiryContext.timeSlot}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-[#737a65]">Crew Size</span>
//                     <span className="font-bold text-[#191c1d]">{inquiryContext.crewSize} Persons</span>
//                   </div>
//                 </div>
//                 <button className="w-full bg-[#beff5f] text-[#111f00] font-bold py-3 rounded-xl hover:scale-[1.02] transition-all shadow-md active:scale-95 mb-3 text-sm">
//                   View Full Booking
//                 </button>
//                 <button className="w-full border border-[#c2c9b1] text-[#424937] font-bold py-3 rounded-xl hover:bg-[#f3f4f5] transition-all text-sm">
//                   Send Invoice
//                 </button>
//               </div>
//             </div>

//             {/* Client Profile */}
//             <div className="bg-[#f3f4f5] p-4 rounded-2xl">
//               <h4 className="text-xs font-bold uppercase text-[#737a65] mb-3 tracking-widest">Client Profile</h4>
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-12 h-12 rounded-xl bg-[#e4d7fd] flex items-center justify-center font-bold text-[#665c7c] text-lg">
//                   {inquiryContext.guestInitials}
//                 </div>
//                 <div>
//                   <p className="font-bold text-sm text-[#191c1d]">{inquiryContext.guestName}</p>
//                   <p className="text-xs text-[#424937] flex items-center gap-1">
//                     <StarIcon className="w-3 h-3 text-[#446900] fill-current" />
//                     {inquiryContext.guestRating} ★ ({inquiryContext.guestBookings} bookings)
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {inquiryContext.tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="px-2 py-1 bg-white text-[10px] font-bold rounded-md border border-[#c2c9b1]/10 text-[#424937] uppercase"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }