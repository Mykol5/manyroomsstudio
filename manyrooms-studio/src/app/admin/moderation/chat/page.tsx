// app/admin/moderation/chat/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
  UserIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface FlaggedMessage {
  id: string;
  enquiry_id: string;
  sender_name: string;
  sender_type: 'client' | 'owner' | 'system';
  sender_role: string;
  message: string;
  created_at: string;
  flags: string[];
  studio_name?: string;
  guest_name?: string;
}

interface AuditLog {
  time: string;
  event: string;
  type: 'primary' | 'error' | 'neutral';
}

export default function ChatModerationPage() {
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
  const [selectedCase, setSelectedCase] = useState<FlaggedMessage | null>(null);
  const [conversation, setConversation] = useState<FlaggedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'payment' | 'contact' | 'other'>('all');

  const auditLogs: AuditLog[] = [
    { time: '14:16:04', event: 'System flagged phrase: "Venmo"', type: 'primary' },
    { time: '14:20:11', event: 'Secondary flag: Off-platform contact', type: 'error' },
    { time: '14:21:00', event: 'Thread auto-locked by AI', type: 'neutral' },
  ];

  // Mock flagged messages (in production, fetch from Supabase with AI flagging)
  const mockFlaggedMessages: FlaggedMessage[] = [
    {
      id: '1',
      enquiry_id: 'enq-001',
      sender_name: 'Studio Loft',
      sender_type: 'owner',
      sender_role: 'Studio Owner • Pro Tier',
      message: 'Actually, if you want to save on platform fees, you can just send me a deposit of $150 via Venmo at @StudioLoftNYC. We can handle the rest in person!',
      created_at: '2024-10-24T14:16:00Z',
      flags: ['Off-Platform Payment', 'Fee Avoidance'],
      studio_name: 'Rooftop Studio',
      guest_name: 'Alex Rivera',
    },
    {
      id: '2',
      enquiry_id: 'enq-002',
      sender_name: 'Creative Space NYC',
      sender_type: 'owner',
      sender_role: 'Studio Owner',
      message: 'Just WhatsApp me at +1-555-0123 and we can sort out the details without the platform fees.',
      created_at: '2024-10-24T10:30:00Z',
      flags: ['Contact Info Sharing', 'Fee Avoidance'],
      studio_name: 'Downtown Loft',
      guest_name: 'Maria Santos',
    },
    {
      id: '3',
      enquiry_id: 'enq-003',
      sender_name: 'Lux Studios',
      sender_type: 'owner',
      sender_role: 'Studio Owner • Pro Tier',
      message: 'I accept PayPal Friends & Family only. That way we both avoid the extra charges.',
      created_at: '2024-10-23T16:45:00Z',
      flags: ['Off-Platform Payment'],
      studio_name: 'Premium Suite',
      guest_name: 'James Wilson',
    },
  ];

  const mockConversation: FlaggedMessage[] = [
    {
      id: 'c1', enquiry_id: 'enq-001', sender_name: 'Alex Rivera', sender_type: 'client', sender_role: 'Client • Member since 2022',
      message: 'Hey! I love the portfolio. I want to book the Rooftop Studio for a 4-hour fashion shoot this weekend. Is it available?',
      created_at: '2024-10-24T14:02:00Z', flags: [],
    },
    {
      id: 'c2', enquiry_id: 'enq-001', sender_name: 'Studio Loft', sender_type: 'owner', sender_role: 'Studio Owner • Pro Tier',
      message: 'Hi Alex! Yes, we have availability on Saturday from 2 PM to 6 PM. It\'s a great time for natural light.',
      created_at: '2024-10-24T14:15:00Z', flags: [],
    },
    {
      id: 'c3', enquiry_id: 'enq-001', sender_name: 'Studio Loft', sender_type: 'owner', sender_role: 'Studio Owner • Pro Tier',
      message: 'Actually, if you want to save on platform fees, you can just send me a deposit of $150 via Venmo at @StudioLoftNYC. We can handle the rest in person!',
      created_at: '2024-10-24T14:16:00Z', flags: ['Off-Platform Payment', 'Fee Avoidance'],
    },
    {
      id: 'c4', enquiry_id: 'enq-001', sender_name: 'Alex Rivera', sender_type: 'client', sender_role: 'Client • Member since 2022',
      message: 'Oh okay, that works. Should I send you my WhatsApp number so we can coordinate better?',
      created_at: '2024-10-24T14:20:00Z', flags: ['Contact Info Sharing'],
    },
  ];

  useEffect(() => {
    // Fetch flagged messages from Supabase in production
    setFlaggedMessages(mockFlaggedMessages);
    setLoading(false);
  }, []);

  const openCase = (message: FlaggedMessage) => {
    setSelectedCase(message);
    setConversation(mockConversation.filter(m => m.enquiry_id === message.enquiry_id));
  };

  const handleDismissFlag = () => {
    alert('Flag dismissed. Thread unlocked.');
    setSelectedCase(null);
  };

  const handleIssueWarning = () => {
    alert('Warning issued to the user.');
  };

  const handleSuspendUser = () => {
    if (confirm('Are you sure you want to suspend this user? This action can be reversed.')) {
      alert('User suspended successfully.');
    }
  };

  const filteredMessages = filter === 'all' 
    ? flaggedMessages 
    : flaggedMessages.filter(m => m.flags.some(f => 
        filter === 'payment' ? f.includes('Payment') : 
        filter === 'contact' ? f.includes('Contact') : true
      ));

  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px] bg-[#f8f9fa]">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto mb-4"></div>
          <p className="text-[#446900] font-bold">Loading chat moderation...</p>
        </div>
      </div>
    );
  }

  // If a case is selected, show the chat moderation detail view
  if (selectedCase) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col bg-[#f8f9fa]">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-[#c2c9b1]/30 px-4 md:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedCase(null)} className="flex items-center gap-2 text-[#446900] font-bold text-sm hover:underline">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Queue
            </button>
            <div className="h-6 w-px bg-[#c2c9b1]"></div>
            <div>
              <h2 className="font-bold text-sm text-[#191c1d]">Case #{selectedCase.enquiry_id.toUpperCase()}</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                <span className="text-xs font-bold text-[#ba1a1a] uppercase">
                  Flagged for: {selectedCase.flags.join(', ')}
                </span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#beff5f]/20 text-[#446900] text-xs font-bold rounded-full">
            Admin: {selectedCase.guest_name?.split(' ')[0] || 'Admin'}
          </span>
        </header>

        {/* Chat + Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Transcript */}
          <section className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#f8f9fa] relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
              <h1 className="text-8xl font-extrabold -rotate-12 scale-150 text-[#191c1d]">CONFIDENTIAL</h1>
            </div>
            <div className="max-w-3xl mx-auto space-y-6 pb-16 relative z-10">
              <div className="text-center">
                <span className="text-xs font-bold bg-[#e1e3e4] text-[#424937] px-4 py-1.5 rounded-full uppercase">
                  {new Date(selectedCase.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • Thread Started
                </span>
              </div>

              {conversation.map((msg, idx) => {
                const isFlagged = msg.flags.length > 0;
                return (
                  <div key={idx} className={`flex flex-col ${msg.sender_type === 'owner' ? 'items-end' : 'items-start'} gap-2`}>
                    <div className={`flex items-center gap-3 ${msg.sender_type === 'owner' ? 'flex-row-reverse mr-4' : 'ml-4'}`}>
                      {isFlagged && (
                        <span className="text-[#ba1a1a] text-xs font-bold flex items-center gap-1 uppercase">
                          <ExclamationTriangleIcon className="w-3 h-3" />
                          Flagged by AI
                        </span>
                      )}
                      <span className="text-[10px] text-[#737a65] uppercase font-bold">
                        {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </span>
                      <span className="text-xs font-bold text-[#191c1d]">
                        {msg.sender_name} ({msg.sender_type === 'owner' ? 'Owner' : 'Client'})
                      </span>
                    </div>
                    <div className={`px-5 py-3.5 rounded-2xl max-w-lg shadow-sm text-sm leading-relaxed ${
                      isFlagged
                        ? 'bg-[#ffdad6] text-[#ba1a1a] border-2 border-[#ba1a1a]/30 rounded-tr-none'
                        : msg.sender_type === 'owner'
                          ? 'bg-[#e4d7fd] text-[#1f1732] rounded-tr-none'
                          : 'bg-white text-[#191c1d] border border-[#c2c9b1]/20 rounded-tl-none'
                    }`}>
                      {msg.message}
                    </div>
                    {isFlagged && (
                      <div className={`flex gap-2 ${msg.sender_type === 'owner' ? 'flex-row-reverse' : ''}`}>
                        {msg.flags.map(flag => (
                          <span key={flag} className="text-[10px] font-bold text-[#ba1a1a] bg-red-50 px-2 py-0.5 rounded-full uppercase">
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-center pt-4">
                <div className="bg-[#e1e3e4] border border-[#c2c9b1]/30 px-6 py-3 rounded-2xl flex items-center gap-3 text-[#424937]">
                  <ShieldExclamationIcon className="w-4 h-4 text-[#446900]" />
                  <span className="text-xs font-bold uppercase">System: Chat Restricted Pending Review</span>
                </div>
              </div>
            </div>
          </section>

          {/* Admin Control Sidebar */}
          <aside className="w-80 lg:w-96 border-l border-[#c2c9b1]/20 bg-white flex flex-col overflow-y-auto shrink-0">
            {/* Audit Timeline */}
            <section className="p-5 border-b border-[#c2c9b1]/20">
              <h3 className="text-xs font-bold uppercase text-[#737a65] mb-4 flex items-center gap-2">
                <ClockIcon className="w-4 h-4" /> Audit Timeline
              </h3>
              <div className="space-y-3">
                {auditLogs.map((log, i) => (
                  <div key={i} className="flex gap-3 items-start border-l-2 pl-4 relative"
                    style={{ borderColor: log.type === 'primary' ? '#446900' : log.type === 'error' ? '#ba1a1a' : '#c2c9b1' }}>
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: log.type === 'primary' ? '#446900' : log.type === 'error' ? '#ba1a1a' : '#c2c9b1' }}></div>
                    <div>
                      <p className="text-[11px] font-bold text-[#191c1d]">{log.time}</p>
                      <p className="text-xs text-[#424937]">{log.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Participant Context */}
            <section className="p-5 border-b border-[#c2c9b1]/20 space-y-3">
              <h3 className="text-xs font-bold uppercase text-[#737a65] mb-3">Participant Context</h3>
              
              {/* Client Card */}
              <div className="bg-[#f3f4f5] p-4 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#e4d7fd] flex items-center justify-center font-bold text-[#665c7c] text-sm">AR</div>
                  <div>
                    <p className="font-bold text-sm text-[#191c1d]">Alex Rivera</p>
                    <p className="text-[10px] text-[#737a65] uppercase">Client • Member since 2022</p>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white px-3 py-2 rounded-xl">
                  <span className="text-[11px] font-bold uppercase text-[#737a65]">Trust Score</span>
                  <span className="text-[11px] font-bold text-[#446900]">98/100</span>
                </div>
                <p className="text-[11px] mt-2 text-[#424937]">Violation History: <span className="font-bold text-[#191c1d]">0 Previous</span></p>
              </div>

              {/* Owner Card */}
              <div className="bg-red-50/30 p-4 rounded-2xl border-2 border-[#ba1a1a]/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#beff5f] flex items-center justify-center font-bold text-[#111f00] text-sm">SL</div>
                  <div>
                    <p className="font-bold text-sm text-[#191c1d]">Studio Loft</p>
                    <p className="text-[10px] text-[#737a65] uppercase">Studio Owner • Pro Tier</p>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-red-100 px-3 py-2 rounded-xl">
                  <span className="text-[11px] font-bold uppercase text-[#ba1a1a]">Trust Score</span>
                  <span className="text-[11px] font-bold text-[#ba1a1a]">62/100</span>
                </div>
                <p className="text-[11px] mt-2 text-[#424937]">Violation History: <span className="font-bold text-[#ba1a1a]">2 Warnings (2023)</span></p>
              </div>
            </section>

            {/* Platform Insights */}
            <section className="p-5 border-b border-[#c2c9b1]/20">
              <h3 className="text-xs font-bold uppercase text-[#737a65] mb-3 flex items-center gap-2">
                <EyeIcon className="w-4 h-4" /> Platform Insights
              </h3>
              <div className="bg-[#ffe6de]/30 p-4 rounded-2xl border border-[#ffb59c]/40">
                <p className="text-xs text-[#822800] leading-snug italic">
                  "Studio Loft has been reported twice for similar behavior in private studio walk-throughs. Recurrent pattern of fee avoidance detected."
                </p>
              </div>
            </section>

            {/* Decision Actions */}
            <section className="p-5 mt-auto bg-[#f3f4f5] space-y-3">
              <button onClick={handleDismissFlag}
                className="w-full bg-[#446900] text-white font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
                <CheckCircleIcon className="w-4 h-4" /> Dismiss Flag & Unlock
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => alert('Investigating...')}
                  className="bg-white text-[#191c1d] font-bold text-xs py-3 border border-[#c2c9b1] rounded-xl hover:bg-[#edeeef] transition-colors flex items-center justify-center gap-2">
                  <EyeIcon className="w-4 h-4" /> Investigate
                </button>
                <button onClick={handleIssueWarning}
                  className="bg-[#a43c12] text-white font-bold text-xs py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <ExclamationTriangleIcon className="w-4 h-4" /> Issue Warning
                </button>
              </div>
              <button onClick={handleSuspendUser}
                className="w-full bg-[#ba1a1a] text-white font-bold text-sm py-3.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
                <NoSymbolIcon className="w-4 h-4" /> Suspend User
              </button>
            </section>
          </aside>
        </div>
      </div>
    );
  }

  // Main flagged messages list
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#ba1a1a] uppercase tracking-widest mb-1">
              <span className="w-2 h-2 bg-[#ba1a1a] rounded-full animate-pulse"></span>
              Active Monitoring
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#191c1d] tracking-tight">Chat Moderation</h2>
            <p className="text-[#424937] text-sm mt-1">Monitor conversations for policy violations and platform safety.</p>
          </div>
          <Link
            href="/admin/moderation"
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#c2c9b1]/20 rounded-xl font-bold text-sm hover:bg-[#edeeef] transition-all"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Moderation
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'payment', 'contact', 'other'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === f ? 'bg-[#191c1d] text-white' : 'bg-white text-[#424937] hover:bg-[#edeeef] border border-[#c2c9b1]/20'
              }`}>
              {f === 'all' ? 'All Flags' : f === 'payment' ? 'Payment Violations' : f === 'contact' ? 'Contact Sharing' : 'Other'}
            </button>
          ))}
        </div>

        {/* Flagged Messages List */}
        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#c2c9b1]/20">
              <CheckCircleIcon className="w-14 h-14 text-[#c2c9b1] mx-auto mb-4" />
              <p className="text-[#424937] font-bold text-lg">No flagged messages</p>
              <p className="text-sm text-[#737a65] mt-1">All conversations are clean.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div key={msg.id} onClick={() => openCase(msg)}
                className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-[#c2c9b1]/20 hover:border-[#ba1a1a]/30 transition-all cursor-pointer group">
                
                <div className="w-12 h-12 rounded-xl bg-[#ffdad6] flex items-center justify-center flex-shrink-0">
                  <ShieldExclamationIcon className="w-6 h-6 text-[#ba1a1a]" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-[#191c1d]">{msg.sender_name}</span>
                    <span className="text-[10px] text-[#737a65]">• {msg.sender_role}</span>
                    {msg.flags.map(flag => (
                      <span key={flag} className="px-2 py-0.5 bg-red-50 text-[#ba1a1a] rounded text-[9px] font-bold uppercase">
                        {flag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-[#424937] line-clamp-1">"{msg.message}"</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-[#737a65]">
                      Studio: {msg.studio_name} • Guest: {msg.guest_name}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-[#737a65] font-bold">
                    {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </p>
                  <p className="text-[10px] text-[#737a65]">
                    {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                <ArrowLeftIcon className="w-4 h-4 text-[#c2c9b1] group-hover:text-[#446900] transition-colors rotate-180 flex-shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}