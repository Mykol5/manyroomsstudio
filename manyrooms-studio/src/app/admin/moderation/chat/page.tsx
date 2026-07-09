// app/admin/moderation/chat/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeftIcon,
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  NoSymbolIcon,
  ClockIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

// Brand Colors
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  brown: '#DB8B8C',
  dark: '#3C291C',
};

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface Conversation {
  enquiry_id: string;
  studio_name: string;
  studio_image: string;
  guest_name: string;
  guest_email: string;
  owner_name: string;
  owner_email: string;
  last_message: string;
  last_message_time: string;
  message_count: number;
  flagged_count: number;
  flags: string[];
  status: string;
  event_date: string;
}

interface Message {
  id: string;
  enquiry_id: string;
  sender_id: string;
  sender_type: 'client' | 'owner' | 'system';
  sender_name: string;
  sender_role: string;
  message: string;
  image_url: string | null;
  read: boolean;
  created_at: string;
  is_flagged: boolean;
  flags: string[];
}

interface AuditLog {
  time: string;
  event: string;
  type: 'primary' | 'error' | 'neutral';
}

const FLAGGED_KEYWORDS = {
  payment: ['venmo', 'paypal', 'cashapp', 'zelle', 'bank transfer', 'direct deposit', 'friends & family', 'off-platform'],
  contact: ['whatsapp', 'phone number', 'call me', 'text me', 'my number', 'personal email', 'instagram', 'dm me'],
  fee_avoidance: ['save on fees', 'avoid fees', 'platform fee', 'commission', 'direct payment', 'outside the platform'],
};

function scanMessage(message: string): string[] {
  const flags: string[] = [];
  const lowerMsg = message.toLowerCase();
  
  if (FLAGGED_KEYWORDS.payment.some(kw => lowerMsg.includes(kw))) {
    flags.push('Off-Platform Payment');
  }
  if (FLAGGED_KEYWORDS.contact.some(kw => lowerMsg.includes(kw))) {
    flags.push('Contact Info Sharing');
  }
  if (FLAGGED_KEYWORDS.fee_avoidance.some(kw => lowerMsg.includes(kw))) {
    flags.push('Fee Avoidance');
  }
  
  return flags;
}

export default function ChatModerationPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'clean' | 'payment' | 'contact'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetchAllConversations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [conversations, filter, searchTerm]);

  const fetchAllConversations = async () => {
    setLoading(true);
    try {
      const { data: enquiries, error } = await supabase
        .from('enquiries')
        .select(`
          *,
          studios (
            id,
            name,
            images,
            city,
            state,
            owner_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversationList: Conversation[] = [];

      for (const enq of (enquiries || [])) {
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('enquiry_id', enq.id)
          .order('created_at', { ascending: false });

        let ownerName = 'Unknown Owner';
        let ownerEmail = '';
        if (enq.studios?.owner_id) {
          const { data: owner } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', enq.studios.owner_id)
            .single();
          if (owner) {
            ownerName = owner.name || 'Unknown';
            ownerEmail = owner.email || '';
          }
        }

        let flaggedCount = 0;
        const allFlags: Set<string> = new Set();
        
        if (messages) {
          for (const msg of messages) {
            const msgFlags = scanMessage(msg.message || '');
            if (msgFlags.length > 0) {
              flaggedCount++;
              msgFlags.forEach(f => allFlags.add(f));
            }
          }
        }

        const lastMsg = messages?.[0];
        
        conversationList.push({
          enquiry_id: enq.id,
          studio_name: enq.studios?.name || 'Unknown Studio',
          studio_image: enq.studios?.images?.[0] || '',
          guest_name: enq.guest_name || 'Unknown Guest',
          guest_email: enq.guest_email || '',
          owner_name: ownerName,
          owner_email: ownerEmail,
          last_message: lastMsg?.message || enq.brief || 'No messages yet',
          last_message_time: lastMsg?.created_at || enq.created_at,
          message_count: messages?.length || 0,
          flagged_count: flaggedCount,
          flags: Array.from(allFlags),
          status: enq.status || 'pending',
          event_date: enq.event_date || '',
        });
      }

      conversationList.sort((a, b) => {
        if (a.flagged_count > 0 && b.flagged_count === 0) return -1;
        if (a.flagged_count === 0 && b.flagged_count > 0) return 1;
        return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
      });

      setConversations(conversationList);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...conversations];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.studio_name.toLowerCase().includes(term) ||
        c.guest_name.toLowerCase().includes(term) ||
        c.owner_name.toLowerCase().includes(term) ||
        c.last_message.toLowerCase().includes(term)
      );
    }

    switch (filter) {
      case 'flagged':
        result = result.filter(c => c.flagged_count > 0);
        break;
      case 'clean':
        result = result.filter(c => c.flagged_count === 0);
        break;
      case 'payment':
        result = result.filter(c => c.flags.some(f => f.includes('Payment')));
        break;
      case 'contact':
        result = result.filter(c => c.flags.some(f => f.includes('Contact')));
        break;
    }

    setFilteredConversations(result);
  };

  const openConversation = async (enquiryId: string) => {
    setSelectedEnquiryId(enquiryId);
    
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('enquiry_id', enquiryId)
      .order('created_at', { ascending: true });

    if (messages) {
      const { data: enquiry } = await supabase
        .from('enquiries')
        .select('*, studios(name, owner_id)')
        .eq('id', enquiryId)
        .single();

      let ownerName = 'Unknown Owner';
      if (enquiry?.studios?.owner_id) {
        const { data: owner } = await supabase
          .from('users')
          .select('name')
          .eq('id', enquiry.studios.owner_id)
          .single();
        if (owner) ownerName = owner.name || 'Unknown';
      }

      const processed: Message[] = messages.map(msg => {
        const msgFlags = scanMessage(msg.message || '');
        return {
          id: msg.id,
          enquiry_id: msg.enquiry_id,
          sender_id: msg.sender_id,
          sender_type: msg.sender_type,
          sender_name: msg.sender_type === 'owner' ? ownerName : (enquiry?.guest_name || 'Client'),
          sender_role: msg.sender_type === 'owner' ? 'Studio Owner' : 'Client',
          message: msg.message,
          image_url: msg.image_url,
          read: msg.read,
          created_at: msg.created_at,
          is_flagged: msgFlags.length > 0,
          flags: msgFlags,
        };
      });

      setConversationMessages(processed);

      const logs: AuditLog[] = processed
        .filter(m => m.is_flagged)
        .map(m => ({
          time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
          event: `Flagged: "${m.flags.join(', ')}"`,
          type: 'error' as const,
        }));

      if (logs.length > 0) {
        logs.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
          event: 'Conversation under review',
          type: 'neutral' as const,
        });
      } else {
        logs.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
          event: 'No violations detected',
          type: 'primary' as const,
        });
      }

      setAuditLogs(logs);
    }
  };

  const handleDismissFlag = async () => {
    if (!selectedEnquiryId) return;
    await supabase.from('messages').update({ read: true }).eq('enquiry_id', selectedEnquiryId);
    setConversations(prev => prev.map(c => c.enquiry_id === selectedEnquiryId ? { ...c, flagged_count: 0, flags: [] } : c));
    setSelectedEnquiryId(null);
  };

  const handleIssueWarning = async () => {
    if (!selectedEnquiryId) return;
    const selectedConv = conversations.find(c => c.enquiry_id === selectedEnquiryId);
    await supabase.from('messages').insert({
      enquiry_id: selectedEnquiryId,
      sender_id: '00000000-0000-0000-0000-000000000000',
      sender_type: 'system',
      message: `WARNING: This conversation has been flagged for policy violations. Off-platform payments and sharing personal contact information violates ManyRooms terms of service. Continued violations may result in account suspension.`,
      read: false,
      created_at: new Date().toISOString(),
    });
    openConversation(selectedEnquiryId);
  };

  const handleSuspendUser = async () => {
    if (!selectedEnquiryId) return;
    if (!confirm('Are you sure you want to suspend the studio owner? This action can be reversed.')) return;
    const selectedConv = conversations.find(c => c.enquiry_id === selectedEnquiryId);
    await supabase.from('messages').insert({
      enquiry_id: selectedEnquiryId,
      sender_id: '00000000-0000-0000-0000-000000000000',
      sender_type: 'system',
      message: `ACCOUNT SUSPENDED: The studio owner has been temporarily suspended pending further review. Please contact ManyRooms support for more information.`,
      read: false,
      created_at: new Date().toISOString(),
    });
    openConversation(selectedEnquiryId);
  };

  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const totalFlagged = conversations.filter(c => c.flagged_count > 0).length;
  const totalClean = conversations.filter(c => c.flagged_count === 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-[#F1CB81]/40 rounded-full mx-auto mb-4"></div>
          <p className="text-[#3C291C] font-bold">Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Detail view
  if (selectedEnquiryId) {
    const selectedConv = conversations.find(c => c.enquiry_id === selectedEnquiryId);
    
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col bg-[#FFFBF5]">
        <header className="bg-white/70 backdrop-blur-xl border-b border-[#3C291C]/10 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedEnquiryId(null)} className="flex items-center gap-2 text-[#3C291C] font-bold text-sm hover:underline">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to All Chats
            </button>
            <div className="h-6 w-px bg-[#3C291C]/20"></div>
            <div>
              <h2 className="font-bold text-sm text-[#3C291C]">{selectedConv?.studio_name || 'Conversation'}</h2>
              <div className="flex items-center gap-2">
                {selectedConv && selectedConv.flagged_count > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    <span className="text-xs font-bold text-red-600 uppercase">{selectedConv.flagged_count} Flagged</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#3C291C]"></span>
                    <span className="text-xs font-bold text-[#3C291C] uppercase">Clean</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <section className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#FFFBF5] relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
              <h1 className="text-8xl font-extrabold -rotate-12 scale-150 text-[#3C291C]">CONFIDENTIAL</h1>
            </div>
            <div className="max-w-3xl mx-auto space-y-5 pb-16 relative z-10">
              <div className="text-center">
                <span className="text-xs font-bold bg-[#3C291C]/5 text-[#3C291C]/60 px-4 py-1.5 rounded-full uppercase">
                  {conversationMessages.length > 0 ? formatDate(conversationMessages[0].created_at) : ''} &bull; {conversationMessages.length} Messages
                </span>
              </div>

              {conversationMessages.length === 0 ? (
                <div className="text-center py-12">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 text-[#3C291C]/20 mx-auto mb-3" />
                  <p className="text-[#3C291C]/60 font-bold">No messages in this conversation yet.</p>
                </div>
              ) : (
                conversationMessages.map((msg, idx) => (
                  <div key={msg.id || idx} className={`flex flex-col ${msg.sender_type === 'owner' ? 'items-end' : msg.sender_type === 'system' ? 'items-center' : 'items-start'} gap-2`}>
                    {msg.sender_type === 'system' ? (
                      <div className="bg-[#F1CB81]/20 text-[#3C291C] text-xs font-bold px-4 py-2 rounded-full max-w-md text-center">
                        {msg.message}
                      </div>
                    ) : (
                      <>
                        <div className={`flex items-center gap-3 ${msg.sender_type === 'owner' ? 'flex-row-reverse mr-4' : 'ml-4'}`}>
                          {msg.is_flagged && (
                            <span className="text-red-600 text-xs font-bold flex items-center gap-1 uppercase">
                              <ExclamationTriangleIcon className="w-3 h-3" /> Flagged
                            </span>
                          )}
                          <span className="text-[10px] text-[#3C291C]/40 uppercase font-bold">{formatTime(msg.created_at)}</span>
                          <span className="text-xs font-bold text-[#3C291C]">
                            {msg.sender_name} ({msg.sender_type === 'owner' ? 'Owner' : 'Client'})
                          </span>
                        </div>
                        <div className={`px-5 py-3.5 rounded-2xl max-w-lg shadow-sm text-sm leading-relaxed ${
                          msg.is_flagged
                            ? 'bg-red-50 text-red-600 border-2 border-red-200'
                            : msg.sender_type === 'owner'
                              ? 'bg-[#91ADCD]/20 text-[#3C291C] rounded-tr-none'
                              : 'bg-white text-[#3C291C] border border-[#3C291C]/10 rounded-tl-none'
                        }`}>
                          {msg.message}
                        </div>
                        {msg.is_flagged && msg.flags.length > 0 && (
                          <div className={`flex gap-2 ${msg.sender_type === 'owner' ? 'flex-row-reverse' : ''}`}>
                            {msg.flags.map(flag => (
                              <span key={flag} className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase">{flag}</span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              )}

              <div className="flex justify-center pt-4">
                <div className="bg-[#3C291C]/5 border border-[#3C291C]/10 px-6 py-3 rounded-2xl flex items-center gap-3 text-[#3C291C]/60">
                  <EyeIcon className="w-4 h-4 text-[#3C291C]" />
                  <span className="text-xs font-bold uppercase">Admin View - Read Only</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="w-80 lg:w-96 border-l border-[#3C291C]/10 bg-white flex flex-col overflow-y-auto shrink-0">
            <section className="p-5 border-b border-[#3C291C]/10">
              <h3 className="text-xs font-bold uppercase text-[#3C291C]/40 mb-4 flex items-center gap-2">
                <ClockIcon className="w-4 h-4" /> Audit Log
              </h3>
              <div className="space-y-3">
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-[#3C291C]/40">No audit events.</p>
                ) : (
                  auditLogs.map((log, i) => (
                    <div key={i} className="flex gap-3 items-start border-l-2 pl-4 relative"
                      style={{ borderColor: log.type === 'error' ? '#DB8B8C' : log.type === 'primary' ? '#3C291C' : '#91ADCD' }}>
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                        style={{ backgroundColor: log.type === 'error' ? '#DB8B8C' : log.type === 'primary' ? '#3C291C' : '#91ADCD' }}></div>
                      <div>
                        <p className="text-[11px] font-bold text-[#3C291C]">{log.time}</p>
                        <p className="text-xs text-[#3C291C]/60">{log.event}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="p-5 border-b border-[#3C291C]/10 space-y-3">
              <h3 className="text-xs font-bold uppercase text-[#3C291C]/40 mb-3">Participants</h3>
              
              <div className="bg-[#3C291C]/5 p-4 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#91ADCD] flex items-center justify-center font-bold text-white text-sm">
                    {getInitials(selectedConv?.guest_name || 'G')}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#3C291C]">{selectedConv?.guest_name || 'Guest'}</p>
                    <p className="text-[10px] text-[#3C291C]/40 uppercase">Client</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#3C291C]/60">{selectedConv?.guest_email}</p>
              </div>

              <div className={`p-4 rounded-2xl ${(selectedConv?.flagged_count || 0) > 0 ? 'bg-red-50/30 border-2 border-red-200' : 'bg-[#3C291C]/5'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#F1CB81] flex items-center justify-center font-bold text-[#3C291C] text-sm">
                    {getInitials(selectedConv?.owner_name || 'O')}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#3C291C]">{selectedConv?.owner_name || 'Owner'}</p>
                    <p className="text-[10px] text-[#3C291C]/40 uppercase">Studio Owner</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#3C291C]/60">{selectedConv?.owner_email}</p>
                {(selectedConv?.flagged_count || 0) > 0 && (
                  <p className="text-[11px] mt-2 text-[#3C291C]/60">
                    Flags: <span className="font-bold text-red-600">{selectedConv?.flagged_count}</span>
                  </p>
                )}
              </div>
            </section>

            <section className="p-5 mt-auto bg-[#3C291C]/5 space-y-3">
              {(selectedConv?.flagged_count || 0) > 0 && (
                <button onClick={handleDismissFlag}
                  className="w-full bg-[#3C291C] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#3C291C]/80 transition-all flex items-center justify-center gap-2">
                  <CheckCircleIcon className="w-4 h-4" /> Dismiss & Clear Flags
                </button>
              )}
              <button onClick={handleIssueWarning}
                className="w-full bg-[#DB8B8C] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#DB8B8C]/80 transition-all flex items-center justify-center gap-2">
                <ExclamationTriangleIcon className="w-4 h-4" /> Issue Warning
              </button>
              <button onClick={handleSuspendUser}
                className="w-full bg-red-600 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                <NoSymbolIcon className="w-4 h-4" /> Suspend Owner
              </button>
            </section>
          </aside>
        </div>
      </div>
    );
  }

  // Main list
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#DB8B8C] uppercase tracking-widest mb-1">
              <span className="w-2 h-2 bg-[#DB8B8C] rounded-full animate-pulse"></span>
              Live Monitoring
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#3C291C] tracking-tight">Chat Moderation</h2>
            <p className="text-[#3C291C]/60 text-sm mt-1">
              {conversations.length} conversations &bull; {totalFlagged} flagged &bull; {totalClean} clean
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C291C]/30" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10 pr-4 py-2.5 bg-white border border-[#3C291C]/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#F1CB81] w-64 text-[#3C291C] placeholder:text-[#3C291C]/30"
              />
            </div>
            <Link
              href="/admin/moderation"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#3C291C]/10 rounded-xl font-bold text-sm hover:bg-[#3C291C]/5 transition-all text-[#3C291C]"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Moderation
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', label: `All Chats (${conversations.length})` },
            { id: 'flagged', label: `Flagged (${totalFlagged})` },
            { id: 'clean', label: `Clean (${totalClean})` },
            { id: 'payment', label: 'Payment' },
            { id: 'contact', label: 'Contact' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filter === tab.id ? 'bg-[#3C291C] text-white' : 'bg-white text-[#3C291C]/60 hover:bg-[#3C291C]/5 border border-[#3C291C]/10'
              }`}>
              {tab.label}
            </button>
          ))}
          <button onClick={fetchAllConversations}
            className="px-4 py-2 rounded-full text-xs font-bold bg-white text-[#3C291C] border border-[#3C291C]/10 hover:bg-[#F1CB81]/10 transition-all whitespace-nowrap">
            Refresh
          </button>
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
          {filteredConversations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#3C291C]/10">
              <ChatBubbleLeftRightIcon className="w-14 h-14 text-[#3C291C]/20 mx-auto mb-4" />
              <p className="text-[#3C291C] font-bold text-lg">No conversations found</p>
              <p className="text-sm text-[#3C291C]/40 mt-1">
                {searchTerm ? 'Try a different search term.' : 'No conversations match this filter.'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div key={conv.enquiry_id} onClick={() => openConversation(conv.enquiry_id)}
                className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-[#3C291C]/10 hover:border-[#F1CB81]/30 transition-all cursor-pointer group">
                
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#3C291C]/5">
                  {conv.studio_image ? (
                    <img src={conv.studio_image} alt={conv.studio_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#3C291C]/30">apartment</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-[#3C291C]">{conv.studio_name}</span>
                    <span className="text-[10px] text-[#3C291C]/40">
                      {conv.guest_name} &harr; {conv.owner_name}
                    </span>
                    {conv.flagged_count > 0 ? (
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase">
                        Flagged: {conv.flagged_count}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-bold uppercase">
                        Clean
                      </span>
                    )}
                    {conv.status !== 'pending' && (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        conv.status === 'approved' ? 'bg-[#F1CB81]/20 text-[#3C291C]' : 'bg-[#3C291C]/5 text-[#3C291C]/40'
                      }`}>
                        {conv.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#3C291C]/60 line-clamp-1">&ldquo;{conv.last_message}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-[#3C291C]/40">
                      {conv.message_count} message{conv.message_count !== 1 ? 's' : ''}
                      {conv.event_date && ` &bull; ${conv.event_date}`}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-[#3C291C]/40 font-bold">{formatTime(conv.last_message_time)}</p>
                </div>

                <ArrowLeftIcon className="w-4 h-4 text-[#3C291C]/20 group-hover:text-[#3C291C] transition-colors rotate-180 flex-shrink-0 hidden md:block" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}



// // app/admin/moderation/chat/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { supabase } from '@/lib/supabase';
// import {
//   ArrowLeftIcon,
//   ShieldExclamationIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   NoSymbolIcon,
//   ClockIcon,
//   EyeIcon,
//   MagnifyingGlassIcon,
//   ChatBubbleLeftRightIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface Conversation {
//   enquiry_id: string;
//   studio_name: string;
//   studio_image: string;
//   guest_name: string;
//   guest_email: string;
//   owner_name: string;
//   owner_email: string;
//   last_message: string;
//   last_message_time: string;
//   message_count: number;
//   flagged_count: number;
//   flags: string[];
//   status: string;
//   event_date: string;
// }

// interface Message {
//   id: string;
//   enquiry_id: string;
//   sender_id: string;
//   sender_type: 'client' | 'owner' | 'system';
//   sender_name: string;
//   sender_role: string;
//   message: string;
//   image_url: string | null;
//   read: boolean;
//   created_at: string;
//   is_flagged: boolean;
//   flags: string[];
// }

// interface AuditLog {
//   time: string;
//   event: string;
//   type: 'primary' | 'error' | 'neutral';
// }

// const FLAGGED_KEYWORDS = {
//   payment: ['venmo', 'paypal', 'cashapp', 'zelle', 'bank transfer', 'direct deposit', 'friends & family', 'off-platform'],
//   contact: ['whatsapp', 'phone number', 'call me', 'text me', 'my number', 'personal email', 'instagram', 'dm me'],
//   fee_avoidance: ['save on fees', 'avoid fees', 'platform fee', 'commission', 'direct payment', 'outside the platform'],
// };

// function scanMessage(message: string): string[] {
//   const flags: string[] = [];
//   const lowerMsg = message.toLowerCase();
  
//   if (FLAGGED_KEYWORDS.payment.some(kw => lowerMsg.includes(kw))) {
//     flags.push('Off-Platform Payment');
//   }
//   if (FLAGGED_KEYWORDS.contact.some(kw => lowerMsg.includes(kw))) {
//     flags.push('Contact Info Sharing');
//   }
//   if (FLAGGED_KEYWORDS.fee_avoidance.some(kw => lowerMsg.includes(kw))) {
//     flags.push('Fee Avoidance');
//   }
  
//   return flags;
// }

// export default function ChatModerationPage() {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
//   const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
//   const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<'all' | 'flagged' | 'clean' | 'payment' | 'contact'>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

//   useEffect(() => {
//     fetchAllConversations();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [conversations, filter, searchTerm]);

//   const fetchAllConversations = async () => {
//     setLoading(true);
//     try {
//       // Fetch all enquiries with their studio details
//       const { data: enquiries, error } = await supabase
//         .from('enquiries')
//         .select(`
//           *,
//           studios (
//             id,
//             name,
//             images,
//             city,
//             state,
//             owner_id
//           )
//         `)
//         .order('created_at', { ascending: false });

//       if (error) throw error;

//       const conversationList: Conversation[] = [];

//       for (const enq of (enquiries || [])) {
//         // Get messages for this enquiry
//         const { data: messages } = await supabase
//           .from('messages')
//           .select('*')
//           .eq('enquiry_id', enq.id)
//           .order('created_at', { ascending: false });

//         // Get owner name
//         let ownerName = 'Unknown Owner';
//         let ownerEmail = '';
//         if (enq.studios?.owner_id) {
//           const { data: owner } = await supabase
//             .from('users')
//             .select('name, email')
//             .eq('id', enq.studios.owner_id)
//             .single();
//           if (owner) {
//             ownerName = owner.name || 'Unknown';
//             ownerEmail = owner.email || '';
//           }
//         }

//         // Scan messages for flags
//         let flaggedCount = 0;
//         const allFlags: Set<string> = new Set();
        
//         if (messages) {
//           for (const msg of messages) {
//             const msgFlags = scanMessage(msg.message || '');
//             if (msgFlags.length > 0) {
//               flaggedCount++;
//               msgFlags.forEach(f => allFlags.add(f));
//             }
//           }
//         }

//         const lastMsg = messages?.[0];
        
//         conversationList.push({
//           enquiry_id: enq.id,
//           studio_name: enq.studios?.name || 'Unknown Studio',
//           studio_image: enq.studios?.images?.[0] || '',
//           guest_name: enq.guest_name || 'Unknown Guest',
//           guest_email: enq.guest_email || '',
//           owner_name: ownerName,
//           owner_email: ownerEmail,
//           last_message: lastMsg?.message || enq.brief || 'No messages yet',
//           last_message_time: lastMsg?.created_at || enq.created_at,
//           message_count: messages?.length || 0,
//           flagged_count: flaggedCount,
//           flags: Array.from(allFlags),
//           status: enq.status || 'pending',
//           event_date: enq.event_date || '',
//         });
//       }

//       // Sort: flagged first, then by most recent
//       conversationList.sort((a, b) => {
//         if (a.flagged_count > 0 && b.flagged_count === 0) return -1;
//         if (a.flagged_count === 0 && b.flagged_count > 0) return 1;
//         return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
//       });

//       setConversations(conversationList);
//     } catch (err) {
//       console.error('Error fetching conversations:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let result = [...conversations];

//     // Apply search
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(c =>
//         c.studio_name.toLowerCase().includes(term) ||
//         c.guest_name.toLowerCase().includes(term) ||
//         c.owner_name.toLowerCase().includes(term) ||
//         c.last_message.toLowerCase().includes(term)
//       );
//     }

//     // Apply filter
//     switch (filter) {
//       case 'flagged':
//         result = result.filter(c => c.flagged_count > 0);
//         break;
//       case 'clean':
//         result = result.filter(c => c.flagged_count === 0);
//         break;
//       case 'payment':
//         result = result.filter(c => c.flags.some(f => f.includes('Payment')));
//         break;
//       case 'contact':
//         result = result.filter(c => c.flags.some(f => f.includes('Contact')));
//         break;
//     }

//     setFilteredConversations(result);
//   };

//   const openConversation = async (enquiryId: string) => {
//     setSelectedEnquiryId(enquiryId);
    
//     const { data: messages } = await supabase
//       .from('messages')
//       .select('*')
//       .eq('enquiry_id', enquiryId)
//       .order('created_at', { ascending: true });

//     if (messages) {
//       const { data: enquiry } = await supabase
//         .from('enquiries')
//         .select('*, studios(name, owner_id)')
//         .eq('id', enquiryId)
//         .single();

//       let ownerName = 'Unknown Owner';
//       if (enquiry?.studios?.owner_id) {
//         const { data: owner } = await supabase
//           .from('users')
//           .select('name')
//           .eq('id', enquiry.studios.owner_id)
//           .single();
//         if (owner) ownerName = owner.name || 'Unknown';
//       }

//       const processed: Message[] = messages.map(msg => {
//         const msgFlags = scanMessage(msg.message || '');
//         return {
//           id: msg.id,
//           enquiry_id: msg.enquiry_id,
//           sender_id: msg.sender_id,
//           sender_type: msg.sender_type,
//           sender_name: msg.sender_type === 'owner' ? ownerName : (enquiry?.guest_name || 'Client'),
//           sender_role: msg.sender_type === 'owner' ? 'Studio Owner' : 'Client',
//           message: msg.message,
//           image_url: msg.image_url,
//           read: msg.read,
//           created_at: msg.created_at,
//           is_flagged: msgFlags.length > 0,
//           flags: msgFlags,
//         };
//       });

//       setConversationMessages(processed);

//       const logs: AuditLog[] = processed
//         .filter(m => m.is_flagged)
//         .map(m => ({
//           time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
//           event: `Flagged: "${m.flags.join(', ')}"`,
//           type: 'error' as const,
//         }));

//       if (logs.length > 0) {
//         logs.push({
//           time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
//           event: 'Conversation under review',
//           type: 'neutral' as const,
//         });
//       } else {
//         logs.push({
//           time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
//           event: 'No violations detected',
//           type: 'primary' as const,
//         });
//       }

//       setAuditLogs(logs);
//     }
//   };

//   const handleDismissFlag = async () => {
//     if (!selectedEnquiryId) return;
//     await supabase.from('messages').update({ read: true }).eq('enquiry_id', selectedEnquiryId);
//     setConversations(prev => prev.map(c => c.enquiry_id === selectedEnquiryId ? { ...c, flagged_count: 0, flags: [] } : c));
//     setSelectedEnquiryId(null);
//     alert('Flags dismissed. Conversation cleared.');
//   };

//   const handleIssueWarning = async () => {
//     if (!selectedEnquiryId) return;
//     const selectedConv = conversations.find(c => c.enquiry_id === selectedEnquiryId);
//     await supabase.from('messages').insert({
//       enquiry_id: selectedEnquiryId,
//       sender_id: '00000000-0000-0000-0000-000000000000',
//       sender_type: 'system',
//       message: `⚠️ WARNING: This conversation has been flagged for policy violations. Off-platform payments and sharing personal contact information violates ManyRooms terms of service. Continued violations may result in account suspension.`,
//       read: false,
//       created_at: new Date().toISOString(),
//     });
//     alert(`Warning issued to ${selectedConv?.owner_name || 'the user'}.`);
//     openConversation(selectedEnquiryId); // Refresh
//   };

//   const handleSuspendUser = async () => {
//     if (!selectedEnquiryId) return;
//     if (!confirm('Are you sure you want to suspend the studio owner? This action can be reversed.')) return;
//     const selectedConv = conversations.find(c => c.enquiry_id === selectedEnquiryId);
//     await supabase.from('messages').insert({
//       enquiry_id: selectedEnquiryId,
//       sender_id: '00000000-0000-0000-0000-000000000000',
//       sender_type: 'system',
//       message: `🚫 ACCOUNT SUSPENDED: The studio owner has been temporarily suspended pending further review. Please contact ManyRooms support for more information.`,
//       read: false,
//       created_at: new Date().toISOString(),
//     });
//     alert(`${selectedConv?.owner_name || 'User'} has been suspended.`);
//     openConversation(selectedEnquiryId); // Refresh
//   };

//   const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

//   const formatTime = (dateStr: string) => {
//     if (!dateStr) return '';
//     const date = new Date(dateStr);
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     if (days === 0) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//     if (days === 1) return 'Yesterday';
//     if (days < 7) return `${days}d ago`;
//     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return '';
//     return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
//   };

//   const totalFlagged = conversations.filter(c => c.flagged_count > 0).length;
//   const totalClean = conversations.filter(c => c.flagged_count === 0).length;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-[#446900] font-bold">Loading conversations...</p>
//         </div>
//       </div>
//     );
//   }

//   // Detail view
//   if (selectedEnquiryId) {
//     const selectedConv = conversations.find(c => c.enquiry_id === selectedEnquiryId);
    
//     return (
//       <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
//         <header className="bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSelectedEnquiryId(null)} className="flex items-center gap-2 text-[#446900] font-bold text-sm hover:underline">
//               <ArrowLeftIcon className="w-4 h-4" />
//               Back to All Chats
//             </button>
//             <div className="h-6 w-px bg-[#c2c9b1]"></div>
//             <div>
//               <h2 className="font-bold text-sm text-[#191c1d]">{selectedConv?.studio_name || 'Conversation'}</h2>
//               <div className="flex items-center gap-2">
//                 {selectedConv && selectedConv.flagged_count > 0 ? (
//                   <>
//                     <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
//                     <span className="text-xs font-bold text-[#ba1a1a] uppercase">{selectedConv.flagged_count} Flagged</span>
//                   </>
//                 ) : (
//                   <>
//                     <span className="w-2 h-2 rounded-full bg-[#446900]"></span>
//                     <span className="text-xs font-bold text-[#446900] uppercase">Clean</span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="flex-1 flex overflow-hidden">
//           <section className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#f8f9fa] relative">
//             <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
//               <h1 className="text-8xl font-extrabold -rotate-12 scale-150 text-[#191c1d]">CONFIDENTIAL</h1>
//             </div>
//             <div className="max-w-3xl mx-auto space-y-5 pb-16 relative z-10">
//               <div className="text-center">
//                 <span className="text-xs font-bold bg-[#e1e3e4] text-[#424937] px-4 py-1.5 rounded-full uppercase">
//                   {conversationMessages.length > 0 ? formatDate(conversationMessages[0].created_at) : ''} • {conversationMessages.length} Messages
//                 </span>
//               </div>

//               {conversationMessages.length === 0 ? (
//                 <div className="text-center py-12">
//                   <ChatBubbleLeftRightIcon className="w-12 h-12 text-[#c2c9b1] mx-auto mb-3" />
//                   <p className="text-[#424937] font-bold">No messages in this conversation yet.</p>
//                 </div>
//               ) : (
//                 conversationMessages.map((msg, idx) => (
//                   <div key={msg.id || idx} className={`flex flex-col ${msg.sender_type === 'owner' ? 'items-end' : msg.sender_type === 'system' ? 'items-center' : 'items-start'} gap-2`}>
//                     {msg.sender_type === 'system' ? (
//                       <div className="bg-[#e4d7fd]/50 text-[#665c7c] text-xs font-bold px-4 py-2 rounded-full max-w-md text-center">
//                         {msg.message}
//                       </div>
//                     ) : (
//                       <>
//                         <div className={`flex items-center gap-3 ${msg.sender_type === 'owner' ? 'flex-row-reverse mr-4' : 'ml-4'}`}>
//                           {msg.is_flagged && (
//                             <span className="text-[#ba1a1a] text-xs font-bold flex items-center gap-1 uppercase">
//                               <ExclamationTriangleIcon className="w-3 h-3" /> Flagged
//                             </span>
//                           )}
//                           <span className="text-[10px] text-[#737a65] uppercase font-bold">{formatTime(msg.created_at)}</span>
//                           <span className="text-xs font-bold text-[#191c1d]">
//                             {msg.sender_name} ({msg.sender_type === 'owner' ? 'Owner' : 'Client'})
//                           </span>
//                         </div>
//                         <div className={`px-5 py-3.5 rounded-2xl max-w-lg shadow-sm text-sm leading-relaxed ${
//                           msg.is_flagged
//                             ? 'bg-[#ffdad6] text-[#ba1a1a] border-2 border-[#ba1a1a]/30'
//                             : msg.sender_type === 'owner'
//                               ? 'bg-[#e4d7fd] text-[#1f1732] rounded-tr-none'
//                               : 'bg-white text-[#191c1d] border border-[#c2c9b1]/20 rounded-tl-none'
//                         }`}>
//                           {msg.message}
//                         </div>
//                         {msg.is_flagged && msg.flags.length > 0 && (
//                           <div className={`flex gap-2 ${msg.sender_type === 'owner' ? 'flex-row-reverse' : ''}`}>
//                             {msg.flags.map(flag => (
//                               <span key={flag} className="text-[10px] font-bold text-[#ba1a1a] bg-red-50 px-2 py-0.5 rounded-full uppercase">{flag}</span>
//                             ))}
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 ))
//               )}

//               <div className="flex justify-center pt-4">
//                 <div className="bg-[#e1e3e4] border border-[#c2c9b1]/30 px-6 py-3 rounded-2xl flex items-center gap-3 text-[#424937]">
//                   <EyeIcon className="w-4 h-4 text-[#446900]" />
//                   <span className="text-xs font-bold uppercase">Admin View - Read Only</span>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <aside className="w-80 lg:w-96 border-l border-[#c2c9b1]/20 bg-white flex flex-col overflow-y-auto shrink-0">
//             <section className="p-5 border-b border-[#c2c9b1]/20">
//               <h3 className="text-xs font-bold uppercase text-[#737a65] mb-4 flex items-center gap-2">
//                 <ClockIcon className="w-4 h-4" /> Audit Log
//               </h3>
//               <div className="space-y-3">
//                 {auditLogs.length === 0 ? (
//                   <p className="text-xs text-[#737a65]">No audit events.</p>
//                 ) : (
//                   auditLogs.map((log, i) => (
//                     <div key={i} className="flex gap-3 items-start border-l-2 pl-4 relative"
//                       style={{ borderColor: log.type === 'error' ? '#ba1a1a' : log.type === 'primary' ? '#446900' : '#c2c9b1' }}>
//                       <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
//                         style={{ backgroundColor: log.type === 'error' ? '#ba1a1a' : log.type === 'primary' ? '#446900' : '#c2c9b1' }}></div>
//                       <div>
//                         <p className="text-[11px] font-bold text-[#191c1d]">{log.time}</p>
//                         <p className="text-xs text-[#424937]">{log.event}</p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </section>

//             <section className="p-5 border-b border-[#c2c9b1]/20 space-y-3">
//               <h3 className="text-xs font-bold uppercase text-[#737a65] mb-3">Participants</h3>
              
//               <div className="bg-[#f3f4f5] p-4 rounded-2xl">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="w-10 h-10 rounded-full bg-[#e4d7fd] flex items-center justify-center font-bold text-[#665c7c] text-sm">
//                     {getInitials(selectedConv?.guest_name || 'G')}
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm text-[#191c1d]">{selectedConv?.guest_name || 'Guest'}</p>
//                     <p className="text-[10px] text-[#737a65] uppercase">Client</p>
//                   </div>
//                 </div>
//                 <p className="text-[11px] text-[#424937]">{selectedConv?.guest_email}</p>
//               </div>

//               <div className={`p-4 rounded-2xl ${(selectedConv?.flagged_count || 0) > 0 ? 'bg-red-50/30 border-2 border-[#ba1a1a]/20' : 'bg-[#f3f4f5]'}`}>
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="w-10 h-10 rounded-full bg-[#beff5f] flex items-center justify-center font-bold text-[#111f00] text-sm">
//                     {getInitials(selectedConv?.owner_name || 'O')}
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm text-[#191c1d]">{selectedConv?.owner_name || 'Owner'}</p>
//                     <p className="text-[10px] text-[#737a65] uppercase">Studio Owner</p>
//                   </div>
//                 </div>
//                 <p className="text-[11px] text-[#424937]">{selectedConv?.owner_email}</p>
//                 {(selectedConv?.flagged_count || 0) > 0 && (
//                   <p className="text-[11px] mt-2 text-[#424937]">
//                     Flags: <span className="font-bold text-[#ba1a1a]">{selectedConv?.flagged_count}</span>
//                   </p>
//                 )}
//               </div>
//             </section>

//             <section className="p-5 mt-auto bg-[#f3f4f5] space-y-3">
//               {(selectedConv?.flagged_count || 0) > 0 && (
//                 <button onClick={handleDismissFlag}
//                   className="w-full bg-[#446900] text-white font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
//                   <CheckCircleIcon className="w-4 h-4" /> Dismiss & Clear Flags
//                 </button>
//               )}
//               <button onClick={handleIssueWarning}
//                 className="w-full bg-[#a43c12] text-white font-bold text-sm py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
//                 <ExclamationTriangleIcon className="w-4 h-4" /> Issue Warning
//               </button>
//               <button onClick={handleSuspendUser}
//                 className="w-full bg-[#ba1a1a] text-white font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
//                 <NoSymbolIcon className="w-4 h-4" /> Suspend Owner
//               </button>
//             </section>
//           </aside>
//         </div>
//       </div>
//     );
//   }

//   // Main list
//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
//           <div>
//             <div className="flex items-center gap-2 text-xs font-bold text-[#446900] uppercase tracking-widest mb-1">
//               <span className="w-2 h-2 bg-[#446900] rounded-full animate-pulse"></span>
//               Live Monitoring
//             </div>
//             <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1d] tracking-tight">Chat Moderation</h2>
//             <p className="text-[#424937] text-sm mt-1">
//               {conversations.length} conversations • {totalFlagged} flagged • {totalClean} clean
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737a65]" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search conversations..."
//                 className="pl-10 pr-4 py-2.5 bg-white border border-[#c2c9b1]/20 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#beff5f] w-64 text-[#191c1d] placeholder:text-[#737a65]"
//               />
//             </div>
//             <Link
//               href="/admin/moderation"
//               className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#c2c9b1]/20 rounded-xl font-bold text-sm hover:bg-[#edeeef] transition-all"
//             >
//               <ArrowLeftIcon className="w-4 h-4" />
//               Back to Moderation
//             </Link>
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//           {[
//             { id: 'all', label: `All Chats (${conversations.length})` },
//             { id: 'flagged', label: `🚩 Flagged (${totalFlagged})` },
//             { id: 'clean', label: `✅ Clean (${totalClean})` },
//             { id: 'payment', label: '💰 Payment' },
//             { id: 'contact', label: '📞 Contact' },
//           ].map((tab) => (
//             <button key={tab.id} onClick={() => setFilter(tab.id as any)}
//               className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
//                 filter === tab.id ? 'bg-[#191c1d] text-white' : 'bg-white text-[#424937] hover:bg-[#edeeef] border border-[#c2c9b1]/20'
//               }`}>
//               {tab.label}
//             </button>
//           ))}
//           <button onClick={fetchAllConversations}
//             className="px-4 py-2 rounded-full text-xs font-bold bg-white text-[#446900] border border-[#446900]/20 hover:bg-[#beff5f]/10 transition-all whitespace-nowrap">
//             🔄 Refresh
//           </button>
//         </div>

//         {/* Conversations List */}
//         <div className="space-y-3">
//           {filteredConversations.length === 0 ? (
//             <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#c2c9b1]/20">
//               <ChatBubbleLeftRightIcon className="w-14 h-14 text-[#c2c9b1] mx-auto mb-4" />
//               <p className="text-[#424937] font-bold text-lg">No conversations found</p>
//               <p className="text-sm text-[#737a65] mt-1">
//                 {searchTerm ? 'Try a different search term.' : 'No conversations match this filter.'}
//               </p>
//             </div>
//           ) : (
//             filteredConversations.map((conv) => (
//               <div key={conv.enquiry_id} onClick={() => openConversation(conv.enquiry_id)}
//                 className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-[#c2c9b1]/20 hover:border-[#446900]/30 transition-all cursor-pointer group">
                
//                 {/* Studio Image or Icon */}
//                 <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#edeeef]">
//                   {conv.studio_image ? (
//                     <img src={conv.studio_image} alt={conv.studio_name} className="w-full h-full object-cover" />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <span className="material-symbols-outlined text-[#c2c9b1]">apartment</span>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1 flex-wrap">
//                     <span className="text-sm font-bold text-[#191c1d]">{conv.studio_name}</span>
//                     <span className="text-[10px] text-[#737a65]">
//                       {conv.guest_name} ↔ {conv.owner_name}
//                     </span>
//                     {conv.flagged_count > 0 ? (
//                       <span className="px-2 py-0.5 bg-red-50 text-[#ba1a1a] rounded text-[9px] font-bold uppercase">
//                         🚩 {conv.flagged_count} flag{conv.flagged_count > 1 ? 's' : ''}
//                       </span>
//                     ) : (
//                       <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-bold uppercase">
//                         ✅ Clean
//                       </span>
//                     )}
//                     {conv.status !== 'pending' && (
//                       <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
//                         conv.status === 'approved' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
//                       }`}>
//                         {conv.status}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-[#424937] line-clamp-1">"{conv.last_message}"</p>
//                   <div className="flex items-center gap-3 mt-1">
//                     <span className="text-[10px] text-[#737a65]">
//                       {conv.message_count} message{conv.message_count !== 1 ? 's' : ''}
//                       {conv.event_date && ` • ${conv.event_date}`}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="text-right flex-shrink-0">
//                   <p className="text-[10px] text-[#737a65] font-bold">{formatTime(conv.last_message_time)}</p>
//                 </div>

//                 <ArrowLeftIcon className="w-4 h-4 text-[#c2c9b1] group-hover:text-[#446900] transition-colors rotate-180 flex-shrink-0 hidden md:block" />
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// // app/admin/moderation/chat/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { supabase } from '@/lib/supabase';
// import {
//   ArrowLeftIcon,
//   ShieldExclamationIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   NoSymbolIcon,
//   ClockIcon,
//   EyeIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface FlaggedConversation {
//   enquiry_id: string;
//   studio_name: string;
//   guest_name: string;
//   guest_email: string;
//   owner_name: string;
//   owner_email: string;
//   flagged_count: number;
//   last_message: string;
//   last_message_time: string;
//   flags: string[];
//   status: string;
// }

// interface Message {
//   id: string;
//   enquiry_id: string;
//   sender_id: string;
//   sender_type: 'client' | 'owner' | 'system';
//   sender_name: string;
//   sender_role: string;
//   message: string;
//   image_url: string | null;
//   read: boolean;
//   created_at: string;
//   is_flagged: boolean;
//   flags: string[];
// }

// interface AuditLog {
//   time: string;
//   event: string;
//   type: 'primary' | 'error' | 'neutral';
// }

// // Keywords that trigger flags
// const FLAGGED_KEYWORDS = {
//   payment: ['venmo', 'paypal', 'cashapp', 'zelle', 'bank transfer', 'direct deposit', 'friends & family', 'off-platform'],
//   contact: ['whatsapp', 'phone number', 'call me', 'text me', 'my number', 'personal email', 'instagram', 'dm me'],
//   fee_avoidance: ['save on fees', 'avoid fees', 'platform fee', 'commission', 'direct payment', 'outside the platform'],
// };

// function scanMessage(message: string): string[] {
//   const flags: string[] = [];
//   const lowerMsg = message.toLowerCase();
  
//   // Check payment keywords
//   if (FLAGGED_KEYWORDS.payment.some(kw => lowerMsg.includes(kw))) {
//     flags.push('Off-Platform Payment');
//   }
  
//   // Check contact keywords
//   if (FLAGGED_KEYWORDS.contact.some(kw => lowerMsg.includes(kw))) {
//     flags.push('Contact Info Sharing');
//   }
  
//   // Check fee avoidance
//   if (FLAGGED_KEYWORDS.fee_avoidance.some(kw => lowerMsg.includes(kw))) {
//     flags.push('Fee Avoidance');
//   }
  
//   return flags;
// }

// export default function ChatModerationPage() {
//   const [flaggedConversations, setFlaggedConversations] = useState<FlaggedConversation[]>([]);
//   const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
//   const [conversation, setConversation] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<'all' | 'payment' | 'contact' | 'other'>('all');

//   const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

//   // Fetch all messages and scan for flags
//   useEffect(() => {
//     fetchFlaggedMessages();
//   }, []);

//   const fetchFlaggedMessages = async () => {
//     setLoading(true);
//     try {
//       // Fetch all messages with their enquiry and studio info
//       const { data: messages, error } = await supabase
//         .from('messages')
//         .select(`
//           *,
//           enquiries (
//             id,
//             guest_name,
//             guest_email,
//             studio_id,
//             studios (
//               id,
//               name,
//               owner_id,
//               users!studios_owner_id_fkey (name, email)
//             )
//           )
//         `)
//         .order('created_at', { ascending: false })
//         .limit(200);

//       if (error) {
//         console.error('Error fetching messages:', error);
//         // Fall back to simpler query
//         const { data: simpleMessages, error: simpleError } = await supabase
//           .from('messages')
//           .select('*')
//           .order('created_at', { ascending: false })
//           .limit(200);

//         if (simpleError) throw simpleError;
//         processMessages(simpleMessages || []);
//         return;
//       }

//       processMessages(messages || []);
//     } catch (err) {
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processMessages = async (messages: any[]) => {
//     // Group messages by enquiry_id and scan for flags
//     const conversationMap = new Map<string, {
//       messages: Message[];
//       flags: Set<string>;
//       flaggedCount: number;
//       studio_name: string;
//       guest_name: string;
//       guest_email: string;
//       owner_name: string;
//       owner_email: string;
//       status: string;
//     }>();

//     for (const msg of messages) {
//       const enquiryId = msg.enquiry_id;
//       const scannedFlags = scanMessage(msg.message || '');
      
//       if (!conversationMap.has(enquiryId)) {
//         // Fetch enquiry details
//         const { data: enquiry } = await supabase
//           .from('enquiries')
//           .select('*, studios(name, owner_id)')
//           .eq('id', enquiryId)
//           .single();

//         let ownerName = 'Unknown Owner';
//         let ownerEmail = '';
//         if (enquiry?.studios?.owner_id) {
//           const { data: owner } = await supabase
//             .from('users')
//             .select('name, email')
//             .eq('id', enquiry.studios.owner_id)
//             .single();
//           if (owner) {
//             ownerName = owner.name || 'Unknown';
//             ownerEmail = owner.email || '';
//           }
//         }

//         conversationMap.set(enquiryId, {
//           messages: [],
//           flags: new Set(),
//           flaggedCount: 0,
//           studio_name: enquiry?.studios?.name || 'Unknown Studio',
//           guest_name: enquiry?.guest_name || 'Unknown Guest',
//           guest_email: enquiry?.guest_email || '',
//           owner_name: ownerName,
//           owner_email: ownerEmail,
//           status: enquiry?.status || 'pending',
//         });
//       }

//       const conv = conversationMap.get(enquiryId)!;
      
//       const messageObj: Message = {
//         id: msg.id,
//         enquiry_id: msg.enquiry_id,
//         sender_id: msg.sender_id,
//         sender_type: msg.sender_type,
//         sender_name: msg.sender_type === 'owner' ? conv.owner_name : conv.guest_name,
//         sender_role: msg.sender_type === 'owner' ? 'Studio Owner' : 'Client',
//         message: msg.message,
//         image_url: msg.image_url,
//         read: msg.read,
//         created_at: msg.created_at,
//         is_flagged: scannedFlags.length > 0,
//         flags: scannedFlags,
//       };

//       conv.messages.push(messageObj);
      
//       if (scannedFlags.length > 0) {
//         scannedFlags.forEach(f => conv.flags.add(f));
//         conv.flaggedCount++;
//       }
//     }

//     // Convert to array and filter only conversations with flags
//     const flagged: FlaggedConversation[] = [];
    
//     for (const [enquiryId, conv] of conversationMap) {
//       if (conv.flaggedCount > 0) {
//         const sortedMessages = conv.messages.sort((a, b) => 
//           new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//         );
        
//         const lastMsg = sortedMessages[sortedMessages.length - 1];
        
//         flagged.push({
//           enquiry_id: enquiryId,
//           studio_name: conv.studio_name,
//           guest_name: conv.guest_name,
//           guest_email: conv.guest_email,
//           owner_name: conv.owner_name,
//           owner_email: conv.owner_email,
//           flagged_count: conv.flaggedCount,
//           last_message: lastMsg?.message || '',
//           last_message_time: lastMsg?.created_at || '',
//           flags: Array.from(conv.flags),
//           status: conv.status,
//         });
//       }
//     }

//     // Sort by most recent flag
//     flagged.sort((a, b) => 
//       new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
//     );

//     setFlaggedConversations(flagged);
//   };

//   const openCase = async (enquiryId: string) => {
//     setSelectedEnquiryId(enquiryId);
    
//     // Fetch the full conversation
//     const { data: messages } = await supabase
//       .from('messages')
//       .select('*')
//       .eq('enquiry_id', enquiryId)
//       .order('created_at', { ascending: true });

//     if (messages) {
//       // Get enquiry details for names
//       const { data: enquiry } = await supabase
//         .from('enquiries')
//         .select('*, studios(name, owner_id)')
//         .eq('id', enquiryId)
//         .single();

//       let ownerName = 'Unknown Owner';
//       if (enquiry?.studios?.owner_id) {
//         const { data: owner } = await supabase
//           .from('users')
//           .select('name')
//           .eq('id', enquiry.studios.owner_id)
//           .single();
//         if (owner) ownerName = owner.name || 'Unknown';
//       }

//       const processedMessages: Message[] = messages.map(msg => {
//         const scannedFlags = scanMessage(msg.message || '');
//         return {
//           id: msg.id,
//           enquiry_id: msg.enquiry_id,
//           sender_id: msg.sender_id,
//           sender_type: msg.sender_type,
//           sender_name: msg.sender_type === 'owner' ? ownerName : (enquiry?.guest_name || 'Client'),
//           sender_role: msg.sender_type === 'owner' ? 'Studio Owner' : 'Client',
//           message: msg.message,
//           image_url: msg.image_url,
//           read: msg.read,
//           created_at: msg.created_at,
//           is_flagged: scannedFlags.length > 0,
//           flags: scannedFlags,
//         };
//       });

//       setConversation(processedMessages);

//       // Generate audit logs from flagged messages
//       const logs: AuditLog[] = processedMessages
//         .filter(m => m.is_flagged)
//         .map(m => ({
//           time: new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
//           event: `System flagged: "${m.flags.join(', ')}" in message`,
//           type: 'error' as const,
//         }));

//       if (logs.length > 0) {
//         logs.push({
//           time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
//           event: 'Thread flagged for review',
//           type: 'neutral' as const,
//         });
//       }

//       setAuditLogs(logs);
//     }
//   };

//   const handleDismissFlag = async () => {
//     if (!selectedEnquiryId) return;
    
//     // Mark all messages in this conversation as reviewed
//     const { error } = await supabase
//       .from('messages')
//       .update({ read: true })
//       .eq('enquiry_id', selectedEnquiryId);

//     if (!error) {
//       alert('Flags dismissed. Conversation unlocked.');
//       setFlaggedConversations(prev => prev.filter(c => c.enquiry_id !== selectedEnquiryId));
//       setSelectedEnquiryId(null);
//     }
//   };

//   const handleIssueWarning = async () => {
//     if (!selectedEnquiryId) return;
    
//     const selectedConv = flaggedConversations.find(c => c.enquiry_id === selectedEnquiryId);
    
//     // Insert a system warning message
//     await supabase.from('messages').insert({
//       enquiry_id: selectedEnquiryId,
//       sender_id: '00000000-0000-0000-0000-000000000000',
//       sender_type: 'system',
//       message: `⚠️ WARNING: This conversation has been flagged for policy violations. Off-platform payments and sharing personal contact information violates ManyRooms terms of service. Continued violations may result in account suspension.`,
//       read: false,
//       created_at: new Date().toISOString(),
//     });

//     alert(`Warning issued to ${selectedConv?.owner_name || 'the studio owner'}.`);
//   };

//   const handleSuspendUser = async () => {
//     if (!selectedEnquiryId) return;
    
//     if (!confirm('Are you sure you want to suspend the studio owner? This action can be reversed.')) return;

//     const selectedConv = flaggedConversations.find(c => c.enquiry_id === selectedEnquiryId);
    
//     // Insert suspension message
//     await supabase.from('messages').insert({
//       enquiry_id: selectedEnquiryId,
//       sender_id: '00000000-0000-0000-0000-000000000000',
//       sender_type: 'system',
//       message: `🚫 ACCOUNT SUSPENDED: The studio owner has been temporarily suspended pending further review. Please contact ManyRooms support for more information.`,
//       read: false,
//       created_at: new Date().toISOString(),
//     });

//     alert(`${selectedConv?.owner_name || 'User'} has been suspended.`);
//   };

//   const filteredConversations = filter === 'all' 
//     ? flaggedConversations 
//     : flaggedConversations.filter(c => c.flags.some(f => 
//         filter === 'payment' ? f.includes('Payment') : 
//         filter === 'contact' ? f.includes('Contact') : true
//       ));

//   const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

//   const formatTime = (dateStr: string) => {
//     if (!dateStr) return '';
//     const date = new Date(dateStr);
//     return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
//   };

//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return '';
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-[#446900] font-bold">Scanning conversations...</p>
//         </div>
//       </div>
//     );
//   }

//   // Case detail view
//   if (selectedEnquiryId) {
//     const selectedConv = flaggedConversations.find(c => c.enquiry_id === selectedEnquiryId);
    
//     return (
//       <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
//         <header className="bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSelectedEnquiryId(null)} className="flex items-center gap-2 text-[#446900] font-bold text-sm hover:underline">
//               <ArrowLeftIcon className="w-4 h-4" />
//               Back to Queue
//             </button>
//             <div className="h-6 w-px bg-[#c2c9b1]"></div>
//             <div>
//               <h2 className="font-bold text-sm text-[#191c1d]">{selectedConv?.studio_name || 'Conversation'}</h2>
//               <div className="flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
//                 <span className="text-xs font-bold text-[#ba1a1a] uppercase">
//                   {selectedConv?.flagged_count || 0} Flagged Messages
//                 </span>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="flex-1 flex overflow-hidden">
//           <section className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#f8f9fa] relative">
//             <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
//               <h1 className="text-8xl font-extrabold -rotate-12 scale-150 text-[#191c1d]">CONFIDENTIAL</h1>
//             </div>
//             <div className="max-w-3xl mx-auto space-y-5 pb-16 relative z-10">
//               <div className="text-center">
//                 <span className="text-xs font-bold bg-[#e1e3e4] text-[#424937] px-4 py-1.5 rounded-full uppercase">
//                   {conversation.length > 0 ? formatDate(conversation[0].created_at) : ''} • Conversation
//                 </span>
//               </div>

//               {conversation.length === 0 ? (
//                 <div className="text-center py-12">
//                   <p className="text-[#424937]">No messages in this conversation.</p>
//                 </div>
//               ) : (
//                 conversation.map((msg, idx) => (
//                   <div key={msg.id || idx} className={`flex flex-col ${msg.sender_type === 'owner' ? 'items-end' : msg.sender_type === 'system' ? 'items-center' : 'items-start'} gap-2`}>
//                     {msg.sender_type === 'system' ? (
//                       <div className="bg-[#e4d7fd]/50 text-[#665c7c] text-xs font-bold px-4 py-2 rounded-full">
//                         {msg.message}
//                       </div>
//                     ) : (
//                       <>
//                         <div className={`flex items-center gap-3 ${msg.sender_type === 'owner' ? 'flex-row-reverse mr-4' : 'ml-4'}`}>
//                           {msg.is_flagged && (
//                             <span className="text-[#ba1a1a] text-xs font-bold flex items-center gap-1 uppercase">
//                               <ExclamationTriangleIcon className="w-3 h-3" />
//                               Flagged
//                             </span>
//                           )}
//                           <span className="text-[10px] text-[#737a65] uppercase font-bold">{formatTime(msg.created_at)}</span>
//                           <span className="text-xs font-bold text-[#191c1d]">
//                             {msg.sender_name} ({msg.sender_type === 'owner' ? 'Owner' : 'Client'})
//                           </span>
//                         </div>
//                         <div className={`px-5 py-3.5 rounded-2xl max-w-lg shadow-sm text-sm leading-relaxed ${
//                           msg.is_flagged
//                             ? 'bg-[#ffdad6] text-[#ba1a1a] border-2 border-[#ba1a1a]/30'
//                             : msg.sender_type === 'owner'
//                               ? 'bg-[#e4d7fd] text-[#1f1732] rounded-tr-none'
//                               : 'bg-white text-[#191c1d] border border-[#c2c9b1]/20 rounded-tl-none'
//                         }`}>
//                           {msg.message}
//                         </div>
//                         {msg.is_flagged && msg.flags.length > 0 && (
//                           <div className={`flex gap-2 ${msg.sender_type === 'owner' ? 'flex-row-reverse' : ''}`}>
//                             {msg.flags.map(flag => (
//                               <span key={flag} className="text-[10px] font-bold text-[#ba1a1a] bg-red-50 px-2 py-0.5 rounded-full uppercase">
//                                 {flag}
//                               </span>
//                             ))}
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 ))
//               )}

//               <div className="flex justify-center pt-4">
//                 <div className="bg-[#e1e3e4] border border-[#c2c9b1]/30 px-6 py-3 rounded-2xl flex items-center gap-3 text-[#424937]">
//                   <ShieldExclamationIcon className="w-4 h-4 text-[#446900]" />
//                   <span className="text-xs font-bold uppercase">Admin Review Mode</span>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <aside className="w-80 lg:w-96 border-l border-[#c2c9b1]/20 bg-white flex flex-col overflow-y-auto shrink-0">
//             <section className="p-5 border-b border-[#c2c9b1]/20">
//               <h3 className="text-xs font-bold uppercase text-[#737a65] mb-4 flex items-center gap-2">
//                 <ClockIcon className="w-4 h-4" /> Audit Timeline
//               </h3>
//               <div className="space-y-3">
//                 {auditLogs.length === 0 ? (
//                   <p className="text-xs text-[#737a65]">No audit events.</p>
//                 ) : (
//                   auditLogs.map((log, i) => (
//                     <div key={i} className="flex gap-3 items-start border-l-2 pl-4 relative"
//                       style={{ borderColor: log.type === 'error' ? '#ba1a1a' : log.type === 'primary' ? '#446900' : '#c2c9b1' }}>
//                       <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
//                         style={{ backgroundColor: log.type === 'error' ? '#ba1a1a' : log.type === 'primary' ? '#446900' : '#c2c9b1' }}></div>
//                       <div>
//                         <p className="text-[11px] font-bold text-[#191c1d]">{log.time}</p>
//                         <p className="text-xs text-[#424937]">{log.event}</p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </section>

//             <section className="p-5 border-b border-[#c2c9b1]/20 space-y-3">
//               <h3 className="text-xs font-bold uppercase text-[#737a65] mb-3">Participants</h3>
              
//               <div className="bg-[#f3f4f5] p-4 rounded-2xl">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-10 h-10 rounded-full bg-[#e4d7fd] flex items-center justify-center font-bold text-[#665c7c] text-sm">
//                     {getInitials(selectedConv?.guest_name || 'G')}
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm text-[#191c1d]">{selectedConv?.guest_name || 'Guest'}</p>
//                     <p className="text-[10px] text-[#737a65] uppercase">Client</p>
//                   </div>
//                 </div>
//                 <p className="text-[11px] text-[#424937]">{selectedConv?.guest_email}</p>
//               </div>

//               <div className="bg-red-50/30 p-4 rounded-2xl border-2 border-[#ba1a1a]/20">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-10 h-10 rounded-full bg-[#beff5f] flex items-center justify-center font-bold text-[#111f00] text-sm">
//                     {getInitials(selectedConv?.owner_name || 'O')}
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm text-[#191c1d]">{selectedConv?.owner_name || 'Owner'}</p>
//                     <p className="text-[10px] text-[#737a65] uppercase">Studio Owner</p>
//                   </div>
//                 </div>
//                 <p className="text-[11px] text-[#424937]">{selectedConv?.owner_email}</p>
//                 <p className="text-[11px] mt-2 text-[#424937]">
//                   Flags: <span className="font-bold text-[#ba1a1a]">{selectedConv?.flagged_count || 0}</span>
//                 </p>
//               </div>
//             </section>

//             <section className="p-5 mt-auto bg-[#f3f4f5] space-y-3">
//               <button onClick={handleDismissFlag}
//                 className="w-full bg-[#446900] text-white font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
//                 <CheckCircleIcon className="w-4 h-4" /> Dismiss & Unlock
//               </button>
//               <div className="grid grid-cols-2 gap-3">
//                 <button onClick={() => alert('Investigation mode activated.')}
//                   className="bg-white text-[#191c1d] font-bold text-xs py-3 border border-[#c2c9b1] rounded-xl hover:bg-[#edeeef] transition-colors flex items-center justify-center gap-2">
//                   <EyeIcon className="w-4 h-4" /> Investigate
//                 </button>
//                 <button onClick={handleIssueWarning}
//                   className="bg-[#a43c12] text-white font-bold text-xs py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
//                   <ExclamationTriangleIcon className="w-4 h-4" /> Issue Warning
//                 </button>
//               </div>
//               <button onClick={handleSuspendUser}
//                 className="w-full bg-[#ba1a1a] text-white font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
//                 <NoSymbolIcon className="w-4 h-4" /> Suspend Owner
//               </button>
//             </section>
//           </aside>
//         </div>
//       </div>
//     );
//   }

//   // Main list view
//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
//           <div>
//             <div className="flex items-center gap-2 text-xs font-bold text-[#ba1a1a] uppercase tracking-widest mb-1">
//               <span className="w-2 h-2 bg-[#ba1a1a] rounded-full animate-pulse"></span>
//               Active Monitoring
//             </div>
//             <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1d] tracking-tight">Chat Moderation</h2>
//             <p className="text-[#424937] text-sm mt-1">
//               {flaggedConversations.length} conversations flagged • Real-time policy violation detection
//             </p>
//           </div>
//           <Link
//             href="/admin/moderation"
//             className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#c2c9b1]/20 rounded-xl font-bold text-sm hover:bg-[#edeeef] transition-all"
//           >
//             <ArrowLeftIcon className="w-4 h-4" />
//             Back to Moderation
//           </Link>
//         </div>

//         <div className="flex gap-2 mb-6 overflow-x-auto">
//           {(['all', 'payment', 'contact', 'other'] as const).map((f) => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
//                 filter === f ? 'bg-[#191c1d] text-white' : 'bg-white text-[#424937] hover:bg-[#edeeef] border border-[#c2c9b1]/20'
//               }`}>
//               {f === 'all' ? 'All Flags' : f === 'payment' ? 'Payment Violations' : f === 'contact' ? 'Contact Sharing' : 'Other'}
//             </button>
//           ))}
//           <button onClick={fetchFlaggedMessages}
//             className="px-4 py-2 rounded-full text-xs font-bold bg-white text-[#446900] border border-[#446900]/20 hover:bg-[#beff5f]/10 transition-all">
//             Refresh Scan
//           </button>
//         </div>

//         <div className="space-y-3">
//           {filteredConversations.length === 0 ? (
//             <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#c2c9b1]/20">
//               <CheckCircleIcon className="w-14 h-14 text-[#c2c9b1] mx-auto mb-4" />
//               <p className="text-[#424937] font-bold text-lg">All clear!</p>
//               <p className="text-sm text-[#737a65] mt-1">No policy violations detected in any conversations.</p>
//             </div>
//           ) : (
//             filteredConversations.map((conv) => (
//               <div key={conv.enquiry_id} onClick={() => openCase(conv.enquiry_id)}
//                 className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-[#c2c9b1]/20 hover:border-[#ba1a1a]/30 transition-all cursor-pointer group">
                
//                 <div className="w-12 h-12 rounded-xl bg-[#ffdad6] flex items-center justify-center flex-shrink-0">
//                   <ShieldExclamationIcon className="w-6 h-6 text-[#ba1a1a]" />
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1 flex-wrap">
//                     <span className="text-sm font-bold text-[#191c1d]">{conv.studio_name}</span>
//                     <span className="text-[10px] text-[#737a65]">
//                       • {conv.guest_name} ↔ {conv.owner_name}
//                     </span>
//                     {conv.flags.map(flag => (
//                       <span key={flag} className="px-2 py-0.5 bg-red-50 text-[#ba1a1a] rounded text-[9px] font-bold uppercase">
//                         {flag}
//                       </span>
//                     ))}
//                   </div>
//                   <p className="text-sm text-[#424937] line-clamp-1">"{conv.last_message}"</p>
//                   <div className="flex items-center gap-3 mt-1">
//                     <span className="text-[10px] text-[#737a65]">
//                       {conv.flagged_count} flagged message{conv.flagged_count > 1 ? 's' : ''} • Status: {conv.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="text-right flex-shrink-0">
//                   <p className="text-[10px] text-[#737a65] font-bold">{formatTime(conv.last_message_time)}</p>
//                   <p className="text-[10px] text-[#737a65]">{new Date(conv.last_message_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
//                 </div>

//                 <ArrowLeftIcon className="w-4 h-4 text-[#c2c9b1] group-hover:text-[#446900] transition-colors rotate-180 flex-shrink-0" />
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




// // app/admin/moderation/chat/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import { supabase } from '@/lib/supabase';
// import {
//   ArrowLeftIcon,
//   ShieldExclamationIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   NoSymbolIcon,
//   ClockIcon,
//   UserIcon,
//   EyeIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

// interface FlaggedMessage {
//   id: string;
//   enquiry_id: string;
//   sender_name: string;
//   sender_type: 'client' | 'owner' | 'system';
//   sender_role: string;
//   message: string;
//   created_at: string;
//   flags: string[];
//   studio_name?: string;
//   guest_name?: string;
// }

// interface AuditLog {
//   time: string;
//   event: string;
//   type: 'primary' | 'error' | 'neutral';
// }

// export default function ChatModerationPage() {
//   const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
//   const [selectedCase, setSelectedCase] = useState<FlaggedMessage | null>(null);
//   const [conversation, setConversation] = useState<FlaggedMessage[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<'all' | 'payment' | 'contact' | 'other'>('all');

//   const auditLogs: AuditLog[] = [
//     { time: '14:16:04', event: 'System flagged phrase: "Venmo"', type: 'primary' },
//     { time: '14:20:11', event: 'Secondary flag: Off-platform contact', type: 'error' },
//     { time: '14:21:00', event: 'Thread auto-locked by AI', type: 'neutral' },
//   ];

//   // Mock flagged messages (in production, fetch from Supabase with AI flagging)
//   const mockFlaggedMessages: FlaggedMessage[] = [
//     {
//       id: '1',
//       enquiry_id: 'enq-001',
//       sender_name: 'Studio Loft',
//       sender_type: 'owner',
//       sender_role: 'Studio Owner • Pro Tier',
//       message: 'Actually, if you want to save on platform fees, you can just send me a deposit of $150 via Venmo at @StudioLoftNYC. We can handle the rest in person!',
//       created_at: '2024-10-24T14:16:00Z',
//       flags: ['Off-Platform Payment', 'Fee Avoidance'],
//       studio_name: 'Rooftop Studio',
//       guest_name: 'Alex Rivera',
//     },
//     {
//       id: '2',
//       enquiry_id: 'enq-002',
//       sender_name: 'Creative Space NYC',
//       sender_type: 'owner',
//       sender_role: 'Studio Owner',
//       message: 'Just WhatsApp me at +1-555-0123 and we can sort out the details without the platform fees.',
//       created_at: '2024-10-24T10:30:00Z',
//       flags: ['Contact Info Sharing', 'Fee Avoidance'],
//       studio_name: 'Downtown Loft',
//       guest_name: 'Maria Santos',
//     },
//     {
//       id: '3',
//       enquiry_id: 'enq-003',
//       sender_name: 'Lux Studios',
//       sender_type: 'owner',
//       sender_role: 'Studio Owner • Pro Tier',
//       message: 'I accept PayPal Friends & Family only. That way we both avoid the extra charges.',
//       created_at: '2024-10-23T16:45:00Z',
//       flags: ['Off-Platform Payment'],
//       studio_name: 'Premium Suite',
//       guest_name: 'James Wilson',
//     },
//   ];

//   const mockConversation: FlaggedMessage[] = [
//     {
//       id: 'c1', enquiry_id: 'enq-001', sender_name: 'Alex Rivera', sender_type: 'client', sender_role: 'Client • Member since 2022',
//       message: 'Hey! I love the portfolio. I want to book the Rooftop Studio for a 4-hour fashion shoot this weekend. Is it available?',
//       created_at: '2024-10-24T14:02:00Z', flags: [],
//     },
//     {
//       id: 'c2', enquiry_id: 'enq-001', sender_name: 'Studio Loft', sender_type: 'owner', sender_role: 'Studio Owner • Pro Tier',
//       message: 'Hi Alex! Yes, we have availability on Saturday from 2 PM to 6 PM. It\'s a great time for natural light.',
//       created_at: '2024-10-24T14:15:00Z', flags: [],
//     },
//     {
//       id: 'c3', enquiry_id: 'enq-001', sender_name: 'Studio Loft', sender_type: 'owner', sender_role: 'Studio Owner • Pro Tier',
//       message: 'Actually, if you want to save on platform fees, you can just send me a deposit of $150 via Venmo at @StudioLoftNYC. We can handle the rest in person!',
//       created_at: '2024-10-24T14:16:00Z', flags: ['Off-Platform Payment', 'Fee Avoidance'],
//     },
//     {
//       id: 'c4', enquiry_id: 'enq-001', sender_name: 'Alex Rivera', sender_type: 'client', sender_role: 'Client • Member since 2022',
//       message: 'Oh okay, that works. Should I send you my WhatsApp number so we can coordinate better?',
//       created_at: '2024-10-24T14:20:00Z', flags: ['Contact Info Sharing'],
//     },
//   ];

//   useEffect(() => {
//     // Fetch flagged messages from Supabase in production
//     setFlaggedMessages(mockFlaggedMessages);
//     setLoading(false);
//   }, []);

//   const openCase = (message: FlaggedMessage) => {
//     setSelectedCase(message);
//     setConversation(mockConversation.filter(m => m.enquiry_id === message.enquiry_id));
//   };

//   const handleDismissFlag = () => {
//     alert('Flag dismissed. Thread unlocked.');
//     setSelectedCase(null);
//   };

//   const handleIssueWarning = () => {
//     alert('Warning issued to the user.');
//   };

//   const handleSuspendUser = () => {
//     if (confirm('Are you sure you want to suspend this user? This action can be reversed.')) {
//       alert('User suspended successfully.');
//     }
//   };

//   const filteredMessages = filter === 'all' 
//     ? flaggedMessages 
//     : flaggedMessages.filter(m => m.flags.some(f => 
//         filter === 'payment' ? f.includes('Payment') : 
//         filter === 'contact' ? f.includes('Contact') : true
//       ));

//   const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

//   if (loading) {
//     return (
//       <div className="p-8 flex justify-center items-center min-h-[400px] bg-[#f8f9fa]">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-[#446900] font-bold">Loading chat moderation...</p>
//         </div>
//       </div>
//     );
//   }

//   // If a case is selected, show the chat moderation detail view
//   if (selectedCase) {
//     return (
//       <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
//         {/* Header */}
//         <header className="bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
//           <div className="flex items-center gap-4">
//             <button onClick={() => setSelectedCase(null)} className="flex items-center gap-2 text-[#446900] font-bold text-sm hover:underline">
//               <ArrowLeftIcon className="w-4 h-4" />
//               Back to Queue
//             </button>
//             <div className="h-6 w-px bg-[#c2c9b1]"></div>
//             <div>
//               <h2 className="font-bold text-sm text-[#191c1d]">Case #{selectedCase.enquiry_id.toUpperCase()}</h2>
//               <div className="flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
//                 <span className="text-xs font-bold text-[#ba1a1a] uppercase">
//                   Flagged for: {selectedCase.flags.join(', ')}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <span className="px-3 py-1 bg-[#beff5f]/20 text-[#446900] text-xs font-bold rounded-full">
//             Admin: {selectedCase.guest_name?.split(' ')[0] || 'Admin'}
//           </span>
//         </header>

//         {/* Chat + Sidebar */}
//         <div className="flex-1 flex overflow-hidden">
//           {/* Chat Transcript */}
//           <section className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#f8f9fa] relative">
//             <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
//               <h1 className="text-8xl font-extrabold -rotate-12 scale-150 text-[#191c1d]">CONFIDENTIAL</h1>
//             </div>
//             <div className="max-w-3xl mx-auto space-y-6 pb-16 relative z-10">
//               <div className="text-center">
//                 <span className="text-xs font-bold bg-[#e1e3e4] text-[#424937] px-4 py-1.5 rounded-full uppercase">
//                   {new Date(selectedCase.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • Thread Started
//                 </span>
//               </div>

//               {conversation.map((msg, idx) => {
//                 const isFlagged = msg.flags.length > 0;
//                 return (
//                   <div key={idx} className={`flex flex-col ${msg.sender_type === 'owner' ? 'items-end' : 'items-start'} gap-2`}>
//                     <div className={`flex items-center gap-3 ${msg.sender_type === 'owner' ? 'flex-row-reverse mr-4' : 'ml-4'}`}>
//                       {isFlagged && (
//                         <span className="text-[#ba1a1a] text-xs font-bold flex items-center gap-1 uppercase">
//                           <ExclamationTriangleIcon className="w-3 h-3" />
//                           Flagged by AI
//                         </span>
//                       )}
//                       <span className="text-[10px] text-[#737a65] uppercase font-bold">
//                         {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
//                       </span>
//                       <span className="text-xs font-bold text-[#191c1d]">
//                         {msg.sender_name} ({msg.sender_type === 'owner' ? 'Owner' : 'Client'})
//                       </span>
//                     </div>
//                     <div className={`px-5 py-3.5 rounded-2xl max-w-lg shadow-sm text-sm leading-relaxed ${
//                       isFlagged
//                         ? 'bg-[#ffdad6] text-[#ba1a1a] border-2 border-[#ba1a1a]/30 rounded-tr-none'
//                         : msg.sender_type === 'owner'
//                           ? 'bg-[#e4d7fd] text-[#1f1732] rounded-tr-none'
//                           : 'bg-white text-[#191c1d] border border-[#c2c9b1]/20 rounded-tl-none'
//                     }`}>
//                       {msg.message}
//                     </div>
//                     {isFlagged && (
//                       <div className={`flex gap-2 ${msg.sender_type === 'owner' ? 'flex-row-reverse' : ''}`}>
//                         {msg.flags.map(flag => (
//                           <span key={flag} className="text-[10px] font-bold text-[#ba1a1a] bg-red-50 px-2 py-0.5 rounded-full uppercase">
//                             {flag}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}

//               <div className="flex justify-center pt-4">
//                 <div className="bg-[#e1e3e4] border border-[#c2c9b1]/30 px-6 py-3 rounded-2xl flex items-center gap-3 text-[#424937]">
//                   <ShieldExclamationIcon className="w-4 h-4 text-[#446900]" />
//                   <span className="text-xs font-bold uppercase">System: Chat Restricted Pending Review</span>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Admin Control Sidebar */}
//           <aside className="w-80 lg:w-96 border-l border-[#c2c9b1]/20 bg-white flex flex-col overflow-y-auto shrink-0">
//             {/* Audit Timeline */}
//             <section className="p-5 border-b border-[#c2c9b1]/20">
//               <h3 className="text-xs font-bold uppercase text-[#737a65] mb-4 flex items-center gap-2">
//                 <ClockIcon className="w-4 h-4" /> Audit Timeline
//               </h3>
//               <div className="space-y-3">
//                 {auditLogs.map((log, i) => (
//                   <div key={i} className="flex gap-3 items-start border-l-2 pl-4 relative"
//                     style={{ borderColor: log.type === 'primary' ? '#446900' : log.type === 'error' ? '#ba1a1a' : '#c2c9b1' }}>
//                     <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
//                       style={{ backgroundColor: log.type === 'primary' ? '#446900' : log.type === 'error' ? '#ba1a1a' : '#c2c9b1' }}></div>
//                     <div>
//                       <p className="text-[11px] font-bold text-[#191c1d]">{log.time}</p>
//                       <p className="text-xs text-[#424937]">{log.event}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </section>

//             {/* Participant Context */}
//             <section className="p-5 border-b border-[#c2c9b1]/20 space-y-3">
//               <h3 className="text-xs font-bold uppercase text-[#737a65] mb-3">Participant Context</h3>
              
//               {/* Client Card */}
//               <div className="bg-[#f3f4f5] p-4 rounded-2xl">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-10 h-10 rounded-full bg-[#e4d7fd] flex items-center justify-center font-bold text-[#665c7c] text-sm">AR</div>
//                   <div>
//                     <p className="font-bold text-sm text-[#191c1d]">Alex Rivera</p>
//                     <p className="text-[10px] text-[#737a65] uppercase">Client • Member since 2022</p>
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center bg-white px-3 py-2 rounded-xl">
//                   <span className="text-[11px] font-bold uppercase text-[#737a65]">Trust Score</span>
//                   <span className="text-[11px] font-bold text-[#446900]">98/100</span>
//                 </div>
//                 <p className="text-[11px] mt-2 text-[#424937]">Violation History: <span className="font-bold text-[#191c1d]">0 Previous</span></p>
//               </div>

//               {/* Owner Card */}
//               <div className="bg-red-50/30 p-4 rounded-2xl border-2 border-[#ba1a1a]/20">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-10 h-10 rounded-full bg-[#beff5f] flex items-center justify-center font-bold text-[#111f00] text-sm">SL</div>
//                   <div>
//                     <p className="font-bold text-sm text-[#191c1d]">Studio Loft</p>
//                     <p className="text-[10px] text-[#737a65] uppercase">Studio Owner • Pro Tier</p>
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center bg-red-100 px-3 py-2 rounded-xl">
//                   <span className="text-[11px] font-bold uppercase text-[#ba1a1a]">Trust Score</span>
//                   <span className="text-[11px] font-bold text-[#ba1a1a]">62/100</span>
//                 </div>
//                 <p className="text-[11px] mt-2 text-[#424937]">Violation History: <span className="font-bold text-[#ba1a1a]">2 Warnings (2023)</span></p>
//               </div>
//             </section>

//             {/* Platform Insights */}
//             <section className="p-5 border-b border-[#c2c9b1]/20">
//               <h3 className="text-xs font-bold uppercase text-[#737a65] mb-3 flex items-center gap-2">
//                 <EyeIcon className="w-4 h-4" /> Platform Insights
//               </h3>
//               <div className="bg-[#ffe6de]/30 p-4 rounded-2xl border border-[#ffb59c]/40">
//                 <p className="text-xs text-[#822800] leading-snug italic">
//                   "Studio Loft has been reported twice for similar behavior in private studio walk-throughs. Recurrent pattern of fee avoidance detected."
//                 </p>
//               </div>
//             </section>

//             {/* Decision Actions */}
//             <section className="p-5 mt-auto bg-[#f3f4f5] space-y-3">
//               <button onClick={handleDismissFlag}
//                 className="w-full bg-[#446900] text-white font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
//                 <CheckCircleIcon className="w-4 h-4" /> Dismiss Flag & Unlock
//               </button>
//               <div className="grid grid-cols-2 gap-3">
//                 <button onClick={() => alert('Investigating...')}
//                   className="bg-white text-[#191c1d] font-bold text-xs py-3 border border-[#c2c9b1] rounded-xl hover:bg-[#edeeef] transition-colors flex items-center justify-center gap-2">
//                   <EyeIcon className="w-4 h-4" /> Investigate
//                 </button>
//                 <button onClick={handleIssueWarning}
//                   className="bg-[#a43c12] text-white font-bold text-xs py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
//                   <ExclamationTriangleIcon className="w-4 h-4" /> Issue Warning
//                 </button>
//               </div>
//               <button onClick={handleSuspendUser}
//                 className="w-full bg-[#ba1a1a] text-white font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
//                 <NoSymbolIcon className="w-4 h-4" /> Suspend User
//               </button>
//             </section>
//           </aside>
//         </div>
//       </div>
//     );
//   }

//   // Main flagged messages list
//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
//           <div>
//             <div className="flex items-center gap-2 text-xs font-bold text-[#ba1a1a] uppercase tracking-widest mb-1">
//               <span className="w-2 h-2 bg-[#ba1a1a] rounded-full animate-pulse"></span>
//               Active Monitoring
//             </div>
//             <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1d] tracking-tight">Chat Moderation</h2>
//             <p className="text-[#424937] text-sm mt-1">Monitor conversations for policy violations and platform safety.</p>
//           </div>
//           <Link
//             href="/admin/moderation"
//             className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#c2c9b1]/20 rounded-xl font-bold text-sm hover:bg-[#edeeef] transition-all"
//           >
//             <ArrowLeftIcon className="w-4 h-4" />
//             Back to Moderation
//           </Link>
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex gap-2 mb-6">
//           {(['all', 'payment', 'contact', 'other'] as const).map((f) => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
//                 filter === f ? 'bg-[#191c1d] text-white' : 'bg-white text-[#424937] hover:bg-[#edeeef] border border-[#c2c9b1]/20'
//               }`}>
//               {f === 'all' ? 'All Flags' : f === 'payment' ? 'Payment Violations' : f === 'contact' ? 'Contact Sharing' : 'Other'}
//             </button>
//           ))}
//         </div>

//         {/* Flagged Messages List */}
//         <div className="space-y-3">
//           {filteredMessages.length === 0 ? (
//             <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#c2c9b1]/20">
//               <CheckCircleIcon className="w-14 h-14 text-[#c2c9b1] mx-auto mb-4" />
//               <p className="text-[#424937] font-bold text-lg">No flagged messages</p>
//               <p className="text-sm text-[#737a65] mt-1">All conversations are clean.</p>
//             </div>
//           ) : (
//             filteredMessages.map((msg) => (
//               <div key={msg.id} onClick={() => openCase(msg)}
//                 className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-[#c2c9b1]/20 hover:border-[#ba1a1a]/30 transition-all cursor-pointer group">
                
//                 <div className="w-12 h-12 rounded-xl bg-[#ffdad6] flex items-center justify-center flex-shrink-0">
//                   <ShieldExclamationIcon className="w-6 h-6 text-[#ba1a1a]" />
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="text-sm font-bold text-[#191c1d]">{msg.sender_name}</span>
//                     <span className="text-[10px] text-[#737a65]">• {msg.sender_role}</span>
//                     {msg.flags.map(flag => (
//                       <span key={flag} className="px-2 py-0.5 bg-red-50 text-[#ba1a1a] rounded text-[9px] font-bold uppercase">
//                         {flag}
//                       </span>
//                     ))}
//                   </div>
//                   <p className="text-sm text-[#424937] line-clamp-1">"{msg.message}"</p>
//                   <div className="flex items-center gap-3 mt-1">
//                     <span className="text-[10px] text-[#737a65]">
//                       Studio: {msg.studio_name} • Guest: {msg.guest_name}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="text-right flex-shrink-0">
//                   <p className="text-[10px] text-[#737a65] font-bold">
//                     {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
//                   </p>
//                   <p className="text-[10px] text-[#737a65]">
//                     {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                   </p>
//                 </div>

//                 <ArrowLeftIcon className="w-4 h-4 text-[#c2c9b1] group-hover:text-[#446900] transition-colors rotate-180 flex-shrink-0" />
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }