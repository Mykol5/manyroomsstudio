
// app/admin/support/page.tsx
'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  DocumentIcon,
  FaceSmileIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Brand Colors
const brand = {
  yellow: '#F1CB81',
  blue: '#91ADCD',
  brown: '#DB8B8C',
  dark: '#3C291C',
};

const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>{icon}</span>
);

interface Ticket {
  id: string; ticketId: string; subject: string; description: string;
  user: { name: string; email: string; role: 'owner' | 'client' | 'franchisee' };
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string; createdAt: string; updatedAt: string; messages: Message[];
}

interface Message {
  id: string; sender: 'user' | 'admin'; senderName: string; content: string; timestamp: string;
}

interface SupportMetrics {
  totalTickets: number; openTickets: number; avgResponseTime: string; satisfactionRate: number;
}

export default function AdminSupport() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [metrics] = useState<SupportMetrics>({ totalTickets: 48, openTickets: 12, avgResponseTime: '2.4h', satisfactionRate: 94 });

  const [tickets] = useState<Ticket[]>([
    { id: '1', ticketId: 'TKT-1001', subject: 'Unable to upload studio photos', description: 'Getting an error when trying to upload photos.', user: { name: 'Marcus Sterling', email: 'marcus@sunsetstudios.com', role: 'owner' }, status: 'open', priority: 'high', category: 'Technical Issue', createdAt: '2024-10-24T10:30:00', updatedAt: '2024-10-24T10:30:00', messages: [{ id: '1', sender: 'user', senderName: 'Marcus Sterling', content: 'Getting an error when trying to upload photos to my studio listing.', timestamp: '2024-10-24T10:30:00' }] },
    { id: '2', ticketId: 'TKT-1002', subject: 'Commission rate question', description: 'Question about franchisee commission rates.', user: { name: 'Elena Rodriguez', email: 'elena@franchisepartners.com', role: 'franchisee' }, status: 'in-progress', priority: 'medium', category: 'Billing', createdAt: '2024-10-23T15:20:00', updatedAt: '2024-10-24T09:15:00', messages: [{ id: '1', sender: 'user', senderName: 'Elena Rodriguez', content: 'I have a question about commission rates.', timestamp: '2024-10-23T15:20:00' }, { id: '2', sender: 'admin', senderName: 'Support Team', content: 'Hi Elena, I will have our billing team review your account.', timestamp: '2024-10-24T09:15:00' }] },
    { id: '3', ticketId: 'TKT-1003', subject: 'Booking cancellation policy', description: 'Need to cancel a booking.', user: { name: 'Sarah Jenkins', email: 'sarah.j@manyrooms.com', role: 'client' }, status: 'resolved', priority: 'low', category: 'Booking', createdAt: '2024-10-22T11:00:00', updatedAt: '2024-10-23T14:30:00', messages: [{ id: '1', sender: 'user', senderName: 'Sarah Jenkins', content: 'Need to cancel a booking.', timestamp: '2024-10-22T11:00:00' }, { id: '2', sender: 'admin', senderName: 'Support Team', content: 'Cancellations 48+ hours before are free.', timestamp: '2024-10-22T14:30:00' }] },
    { id: '4', ticketId: 'TKT-1004', subject: 'Payment not processed', description: 'Payment declined but card charged.', user: { name: 'David Chen', email: 'david@member.com', role: 'client' }, status: 'open', priority: 'urgent', category: 'Payment', createdAt: '2024-10-24T08:45:00', updatedAt: '2024-10-24T08:45:00', messages: [{ id: '1', sender: 'user', senderName: 'David Chen', content: 'Payment for booking #MR-9920 was declined but I see a charge.', timestamp: '2024-10-24T08:45:00' }] },
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-600';
      case 'in-progress': return 'bg-amber-100 text-amber-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-[#3C291C]/5 text-[#3C291C]/60';
      default: return 'bg-[#3C291C]/5 text-[#3C291C]/60';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-600';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-[#91ADCD]/20 text-[#3C291C]';
      default: return 'bg-[#3C291C]/5 text-[#3C291C]/60';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-[#F1CB81]/30 text-[#3C291C]';
      case 'franchisee': return 'bg-[#91ADCD]/20 text-[#3C291C]';
      case 'client': return 'bg-[#DB8B8C]/20 text-[#3C291C]';
      default: return 'bg-[#3C291C]/5 text-[#3C291C]/60';
    }
  };

  const filteredTickets = tickets.filter(t => {
    return (t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.ticketId.toLowerCase().includes(searchTerm.toLowerCase())) &&
           (selectedStatus === 'all' || t.status === selectedStatus) && (selectedPriority === 'all' || t.priority === selectedPriority);
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    alert(`Reply sent to ${selectedTicket.user.name}`);
    setReplyMessage('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return diffHours < 24 ? `${diffHours}h ago` : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#3C291C] tracking-tight">Support Center</h1>
          <p className="text-[#3C291C]/60 text-sm mt-1">Manage support tickets, respond to inquiries, and track resolution metrics.</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: 'support_agent', color: 'text-[#F1CB81]', label: 'Total Tickets', value: metrics.totalTickets },
            { icon: 'pending', color: 'text-amber-500', label: 'Open Tickets', value: metrics.openTickets },
            { icon: 'schedule', color: 'text-[#DB8B8C]', label: 'Avg. Response Time', value: metrics.avgResponseTime },
            { icon: 'star', color: 'text-[#F1CB81]', label: 'Satisfaction Rate', value: `${metrics.satisfactionRate}%` },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#3C291C]/10 p-6 shadow-sm">
              <MaterialIcon icon={m.icon} className={`${m.color} text-3xl mb-3`} />
              <p className="text-[#3C291C]/40 text-xs font-bold uppercase tracking-widest mb-1">{m.label}</p>
              <p className="text-2xl font-extrabold text-[#3C291C]">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3C291C]/30" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tickets..."
              className="w-full rounded-xl border border-[#3C291C]/10 bg-white py-3 pl-10 text-sm focus:border-[#F1CB81] focus:ring-[#F1CB81] outline-none text-[#3C291C] placeholder:text-[#3C291C]/30" />
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-[#3C291C]/10 bg-white px-4 py-3 text-sm font-bold text-[#3C291C] outline-none">
            <option value="all">All Status</option><option value="open">Open</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
          </select>
          <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-xl border border-[#3C291C]/10 bg-white px-4 py-3 text-sm font-bold text-[#3C291C] outline-none">
            <option value="all">All Priority</option><option value="urgent">Urgent</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tickets List */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-[#3C291C]/10 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#3C291C]/10">
              <h3 className="font-extrabold text-[#3C291C]">All Tickets ({filteredTickets.length})</h3>
            </div>
            <div className="divide-y divide-[#3C291C]/5 max-h-[600px] overflow-y-auto">
              {paginatedTickets.map((ticket) => (
                <button key={ticket.id} onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-4 hover:bg-[#3C291C]/[0.02] transition-all ${selectedTicket?.id === ticket.id ? 'bg-[#F1CB81]/10' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#3C291C] line-clamp-1">{ticket.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPriorityStyle(ticket.priority)}`}>{ticket.priority.toUpperCase()}</span>
                        <span className="text-[10px] text-[#3C291C]/40">{ticket.ticketId}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusStyle(ticket.status)}`}>
                      {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-[#3C291C]/40">
                    <div className="flex items-center gap-1"><UserCircleIcon className="w-3 h-3" /><span>{ticket.user.name}</span></div>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </button>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-[#3C291C]/10">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 text-[#3C291C]/30 hover:text-[#3C291C] disabled:opacity-50"><ChevronLeftIcon className="w-4 h-4" /></button>
                <span className="text-xs text-[#3C291C]/40">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 text-[#3C291C]/30 hover:text-[#3C291C] disabled:opacity-50"><ChevronRightIcon className="w-4 h-4" /></button>
              </div>
            )}
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#3C291C]/10 overflow-hidden shadow-sm">
            {selectedTicket ? (
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-[#3C291C]/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-[#3C291C]">{selectedTicket.subject}</h3>
                      <p className="text-xs text-[#3C291C]/40 mt-1">Ticket #{selectedTicket.ticketId}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getPriorityStyle(selectedTicket.priority)}`}>{selectedTicket.priority.toUpperCase()}</span>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(selectedTicket.status)}`}>
                        {selectedTicket.status === 'in-progress' ? 'In Progress' : selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#F1CB81] flex items-center justify-center text-[#3C291C] font-bold text-xs">{selectedTicket.user.name.charAt(0)}</div>
                      <div><p className="font-bold text-[#3C291C]">{selectedTicket.user.name}</p><p className="text-xs text-[#3C291C]/40">{selectedTicket.user.email}</p></div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getRoleBadge(selectedTicket.user.role)}`}>{selectedTicket.user.role.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto max-h-[400px] space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl p-4 ${message.sender === 'admin' ? 'bg-[#F1CB81] text-[#3C291C]' : 'bg-[#3C291C]/5 text-[#3C291C]'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold">{message.senderName}</span>
                          <span className="text-[10px] opacity-60">{formatDate(message.timestamp)}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-[#3C291C]/10">
                  <div className="flex gap-2">
                    <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply..." rows={2}
                      className="flex-1 rounded-xl border border-[#3C291C]/10 bg-[#3C291C]/5 px-4 py-2 text-sm focus:border-[#F1CB81] outline-none resize-none text-[#3C291C] placeholder:text-[#3C291C]/30"
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); } }} />
                    <button onClick={handleSendReply} disabled={!replyMessage.trim()}
                      className="px-4 py-2 bg-[#F1CB81] text-[#3C291C] rounded-xl hover:bg-[#DB8B8C] hover:text-white transition-all disabled:opacity-50">
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    {[{ icon: PhotoIcon, label: 'Attach' }, { icon: DocumentIcon, label: 'File' }, { icon: FaceSmileIcon, label: 'Emoji' }].map((btn, i) => (
                      <button key={i} className="flex items-center gap-1 text-xs text-[#3C291C]/40 hover:text-[#3C291C] transition-colors"><btn.icon className="w-4 h-4" />{btn.label}</button>
                    ))}
                  </div>
                </div>

                {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                  <div className="p-4 bg-[#3C291C]/5 border-t border-[#3C291C]/10 flex gap-3">
                    <button className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"><CheckCircleIcon className="w-4 h-4 inline mr-2" />Resolve</button>
                    <button className="flex-1 py-2.5 border border-[#3C291C]/10 text-[#3C291C] rounded-xl text-sm font-bold hover:bg-[#3C291C]/5 transition-colors"><ClockIcon className="w-4 h-4 inline mr-2" />Snooze</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
                <MaterialIcon icon="support_agent" className="text-6xl text-[#3C291C]/20 mb-4" />
                <h3 className="text-lg font-extrabold text-[#3C291C] mb-2">Select a Ticket</h3>
                <p className="text-sm text-[#3C291C]/40">Choose a ticket from the list to view and respond.</p>
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
// import {
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   PaperAirplaneIcon,
//   PhotoIcon,
//   DocumentIcon,
//   FaceSmileIcon,
//   UserCircleIcon,
//   CheckCircleIcon,
//   ClockIcon,
//   XCircleIcon,
// } from '@heroicons/react/24/outline';

// // Material Icon component
// const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
//   <span 
//     className={`material-symbols-outlined ${className}`} 
//     style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
//   >
//     {icon}
//   </span>
// );

// interface Ticket {
//   id: string;
//   ticketId: string;
//   subject: string;
//   description: string;
//   user: {
//     name: string;
//     email: string;
//     avatar?: string;
//     role: 'owner' | 'client' | 'franchisee';
//   };
//   status: 'open' | 'in-progress' | 'resolved' | 'closed';
//   priority: 'low' | 'medium' | 'high' | 'urgent';
//   category: string;
//   createdAt: string;
//   updatedAt: string;
//   messages: Message[];
// }

// interface Message {
//   id: string;
//   sender: 'user' | 'admin';
//   senderName: string;
//   content: string;
//   timestamp: string;
//   attachments?: string[];
// }

// interface SupportMetrics {
//   totalTickets: number;
//   openTickets: number;
//   avgResponseTime: string;
//   satisfactionRate: number;
// }

// export default function AdminSupport() {
//   const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
//   const [replyMessage, setReplyMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [selectedPriority, setSelectedPriority] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Support metrics
//   const [metrics] = useState<SupportMetrics>({
//     totalTickets: 48,
//     openTickets: 12,
//     avgResponseTime: '2.4h',
//     satisfactionRate: 94,
//   });

//   // Tickets data
//   const [tickets] = useState<Ticket[]>([
//     {
//       id: '1',
//       ticketId: 'TKT-1001',
//       subject: 'Unable to upload studio photos',
//       description: 'Getting an error when trying to upload photos to my studio listing. The upload progress gets stuck at 50%.',
//       user: {
//         name: 'Marcus Sterling',
//         email: 'marcus@sunsetstudios.com',
//         role: 'owner',
//       },
//       status: 'open',
//       priority: 'high',
//       category: 'Technical Issue',
//       createdAt: '2024-10-24T10:30:00',
//       updatedAt: '2024-10-24T10:30:00',
//       messages: [
//         {
//           id: '1',
//           sender: 'user',
//           senderName: 'Marcus Sterling',
//           content: 'Getting an error when trying to upload photos to my studio listing. The upload progress gets stuck at 50%.',
//           timestamp: '2024-10-24T10:30:00',
//         },
//       ],
//     },
//     {
//       id: '2',
//       ticketId: 'TKT-1002',
//       subject: 'Commission rate question',
//       description: 'I have a question about how the commission rates are calculated for franchisee accounts.',
//       user: {
//         name: 'Elena Rodriguez',
//         email: 'elena@franchisepartners.com',
//         role: 'franchisee',
//       },
//       status: 'in-progress',
//       priority: 'medium',
//       category: 'Billing',
//       createdAt: '2024-10-23T15:20:00',
//       updatedAt: '2024-10-24T09:15:00',
//       messages: [
//         {
//           id: '1',
//           sender: 'user',
//           senderName: 'Elena Rodriguez',
//           content: 'I have a question about how the commission rates are calculated for franchisee accounts.',
//           timestamp: '2024-10-23T15:20:00',
//         },
//         {
//           id: '2',
//           sender: 'admin',
//           senderName: 'Support Team',
//           content: 'Hi Elena, thank you for reaching out. Franchisee accounts have a special commission structure. I will have our billing team review your account and get back to you shortly.',
//           timestamp: '2024-10-24T09:15:00',
//         },
//       ],
//     },
//     {
//       id: '3',
//       ticketId: 'TKT-1003',
//       subject: 'Booking cancellation policy',
//       description: 'Need to cancel a booking but unsure about the cancellation fee. Can you help?',
//       user: {
//         name: 'Sarah Jenkins',
//         email: 'sarah.j@manyrooms.com',
//         role: 'client',
//       },
//       status: 'resolved',
//       priority: 'low',
//       category: 'Booking',
//       createdAt: '2024-10-22T11:00:00',
//       updatedAt: '2024-10-23T14:30:00',
//       messages: [
//         {
//           id: '1',
//           sender: 'user',
//           senderName: 'Sarah Jenkins',
//           content: 'Need to cancel a booking but unsure about the cancellation fee. Can you help?',
//           timestamp: '2024-10-22T11:00:00',
//         },
//         {
//           id: '2',
//           sender: 'admin',
//           senderName: 'Support Team',
//           content: 'Hi Sarah, cancellations made 48+ hours before the booking are free. Since your booking is in 3 days, you can cancel without any fee.',
//           timestamp: '2024-10-22T14:30:00',
//         },
//         {
//           id: '3',
//           sender: 'user',
//           senderName: 'Sarah Jenkins',
//           content: 'Thank you for the quick response! I\'ve canceled it successfully.',
//           timestamp: '2024-10-23T14:30:00',
//         },
//       ],
//     },
//     {
//       id: '4',
//       ticketId: 'TKT-1004',
//       subject: 'Payment not processed',
//       description: 'My payment for booking #MR-9920 was declined but I see a charge on my card.',
//       user: {
//         name: 'David Chen',
//         email: 'david@member.com',
//         role: 'client',
//       },
//       status: 'open',
//       priority: 'urgent',
//       category: 'Payment',
//       createdAt: '2024-10-24T08:45:00',
//       updatedAt: '2024-10-24T08:45:00',
//       messages: [
//         {
//           id: '1',
//           sender: 'user',
//           senderName: 'David Chen',
//           content: 'My payment for booking #MR-9920 was declined but I see a charge on my card.',
//           timestamp: '2024-10-24T08:45:00',
//         },
//       ],
//     },
//   ]);

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'open':
//         return 'bg-red-500/10 text-red-500 border-red-500/20';
//       case 'in-progress':
//         return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
//       case 'resolved':
//         return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
//       case 'closed':
//         return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
//       default:
//         return 'bg-slate-500/10 text-slate-500';
//     }
//   };

//   const getPriorityStyle = (priority: string) => {
//     switch (priority) {
//       case 'urgent':
//         return 'bg-red-500/20 text-red-500';
//       case 'high':
//         return 'bg-orange-500/20 text-orange-500';
//       case 'medium':
//         return 'bg-amber-500/20 text-amber-500';
//       case 'low':
//         return 'bg-blue-500/20 text-blue-500';
//       default:
//         return 'bg-slate-500/20 text-slate-500';
//     }
//   };

//   const getRoleBadge = (role: string) => {
//     switch (role) {
//       case 'owner':
//         return 'bg-primary/10 text-primary';
//       case 'franchisee':
//         return 'bg-amber-500/10 text-amber-500';
//       case 'client':
//         return 'bg-emerald-500/10 text-emerald-500';
//       default:
//         return 'bg-slate-500/10 text-slate-500';
//     }
//   };

//   const filteredTickets = tickets.filter(ticket => {
//     const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
//     const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
//     return matchesSearch && matchesStatus && matchesPriority;
//   });

//   const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
//   const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const handleSendReply = () => {
//     if (!replyMessage.trim() || !selectedTicket) return;
    
//     const newMessage: Message = {
//       id: Date.now().toString(),
//       sender: 'admin',
//       senderName: 'Support Team',
//       content: replyMessage,
//       timestamp: new Date().toISOString(),
//     };
    
//     // In a real app, you'd update the ticket in the database
//     alert(`Reply sent to ${selectedTicket.user.name}: ${replyMessage}`);
//     setReplyMessage('');
//   };

//   const handleResolveTicket = () => {
//     alert(`Ticket ${selectedTicket?.ticketId} marked as resolved`);
//     setSelectedTicket(null);
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
//     if (diffHours < 24) {
//       return `${diffHours} hours ago`;
//     } else {
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Support Center</h1>
//           <p className="text-slate-500 dark:text-slate-400 mt-1">Manage support tickets, respond to inquiries, and track resolution metrics.</p>
//         </div>

//         {/* Metrics Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
//             <MaterialIcon icon="support_agent" className="text-primary text-3xl mb-3" />
//             <p className="text-slate-500 text-sm mb-1">Total Tickets</p>
//             <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.totalTickets}</p>
//           </div>
//           <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
//             <MaterialIcon icon="pending" className="text-amber-500 text-3xl mb-3" />
//             <p className="text-slate-500 text-sm mb-1">Open Tickets</p>
//             <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.openTickets}</p>
//           </div>
//           <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
//             <MaterialIcon icon="schedule" className="text-primary text-3xl mb-3" />
//             <p className="text-slate-500 text-sm mb-1">Avg. Response Time</p>
//             <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.avgResponseTime}</p>
//           </div>
//           <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
//             <MaterialIcon icon="star" className="text-amber-500 text-3xl mb-3" />
//             <p className="text-slate-500 text-sm mb-1">Satisfaction Rate</p>
//             <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.satisfactionRate}%</p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="mb-6 flex flex-wrap items-center gap-4">
//           <div className="relative flex-1 min-w-[300px]">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by ticket ID, subject, or user..."
//               className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 text-sm focus:border-primary focus:ring-primary dark:border-slate-800 dark:bg-background-dark dark:text-white outline-none"
//             />
//           </div>
//           <select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-slate-800 dark:bg-background-dark dark:text-white"
//           >
//             <option value="all">All Status</option>
//             <option value="open">Open</option>
//             <option value="in-progress">In Progress</option>
//             <option value="resolved">Resolved</option>
//             <option value="closed">Closed</option>
//           </select>
//           <select
//             value={selectedPriority}
//             onChange={(e) => setSelectedPriority(e.target.value)}
//             className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-slate-800 dark:bg-background-dark dark:text-white"
//           >
//             <option value="all">All Priority</option>
//             <option value="urgent">Urgent</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Tickets List */}
//           <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
//             <div className="p-4 border-b border-slate-200 dark:border-slate-800">
//               <h3 className="font-bold">All Tickets ({filteredTickets.length})</h3>
//             </div>
//             <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
//               {paginatedTickets.map((ticket) => (
//                 <button
//                   key={ticket.id}
//                   onClick={() => setSelectedTicket(ticket)}
//                   className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${
//                     selectedTicket?.id === ticket.id ? 'bg-slate-50 dark:bg-slate-800' : ''
//                   }`}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{ticket.subject}</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPriorityStyle(ticket.priority)}`}>
//                           {ticket.priority.toUpperCase()}
//                         </span>
//                         <span className="text-[10px] text-slate-500">{ticket.ticketId}</span>
//                       </div>
//                     </div>
//                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusStyle(ticket.status)}`}>
//                       {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
//                     <div className="flex items-center gap-1">
//                       <UserCircleIcon className="w-3 h-3" />
//                       <span>{ticket.user.name}</span>
//                     </div>
//                     <span>{formatDate(ticket.createdAt)}</span>
//                   </div>
//                 </button>
//               ))}
//             </div>
//             {totalPages > 1 && (
//               <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="p-1 text-slate-400 hover:text-primary disabled:opacity-50"
//                 >
//                   <ChevronLeftIcon className="w-4 h-4" />
//                 </button>
//                 <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={currentPage === totalPages}
//                   className="p-1 text-slate-400 hover:text-primary disabled:opacity-50"
//                 >
//                   <ChevronRightIcon className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Ticket Details & Chat */}
//           <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
//             {selectedTicket ? (
//               <div className="flex flex-col h-full">
//                 {/* Ticket Header */}
//                 <div className="p-6 border-b border-slate-200 dark:border-slate-800">
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedTicket.subject}</h3>
//                       <p className="text-xs text-slate-500 mt-1">Ticket #{selectedTicket.ticketId}</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getPriorityStyle(selectedTicket.priority)}`}>
//                         {selectedTicket.priority.toUpperCase()}
//                       </span>
//                       <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(selectedTicket.status)}`}>
//                         {selectedTicket.status === 'in-progress' ? 'In Progress' : selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4 text-sm">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
//                         {selectedTicket.user.name.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="font-medium">{selectedTicket.user.name}</p>
//                         <p className="text-xs text-slate-500">{selectedTicket.user.email}</p>
//                       </div>
//                     </div>
//                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getRoleBadge(selectedTicket.user.role)}`}>
//                       {selectedTicket.user.role.toUpperCase()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Messages */}
//                 <div className="flex-1 p-6 overflow-y-auto max-h-[400px] space-y-4">
//                   {selectedTicket.messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
//                     >
//                       <div className={`max-w-[80%] rounded-lg p-4 ${
//                         message.sender === 'admin'
//                           ? 'bg-primary text-white'
//                           : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
//                       }`}>
//                         <div className="flex items-center gap-2 mb-2">
//                           <span className="text-xs font-bold">{message.senderName}</span>
//                           <span className="text-[10px] opacity-70">{formatDate(message.timestamp)}</span>
//                         </div>
//                         <p className="text-sm">{message.content}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Reply Box */}
//                 <div className="p-4 border-t border-slate-200 dark:border-slate-800">
//                   <div className="flex gap-2">
//                     <textarea
//                       value={replyMessage}
//                       onChange={(e) => setReplyMessage(e.target.value)}
//                       placeholder="Type your reply..."
//                       rows={2}
//                       className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:border-primary focus:ring-primary outline-none resize-none"
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter' && !e.shiftKey) {
//                           e.preventDefault();
//                           handleSendReply();
//                         }
//                       }}
//                     />
//                     <button
//                       onClick={handleSendReply}
//                       disabled={!replyMessage.trim()}
//                       className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <PaperAirplaneIcon className="w-5 h-5" />
//                     </button>
//                   </div>
//                   <div className="flex items-center gap-4 mt-3">
//                     <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors">
//                       <PhotoIcon className="w-4 h-4" />
//                       Attach
//                     </button>
//                     <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors">
//                       <DocumentIcon className="w-4 h-4" />
//                       File
//                     </button>
//                     <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors">
//                       <FaceSmileIcon className="w-4 h-4" />
//                       Emoji
//                     </button>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
//                   <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex gap-3">
//                     <button className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
//                       <CheckCircleIcon className="w-4 h-4 inline mr-2" />
//                       Mark as Resolved
//                     </button>
//                     <button className="flex-1 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
//                       <ClockIcon className="w-4 h-4 inline mr-2" />
//                       Snooze
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
//                 <MaterialIcon icon="support_agent" className="text-6xl text-slate-400 mb-4" />
//                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Select a Ticket</h3>
//                 <p className="text-sm text-slate-500">Choose a ticket from the list to view and respond to customer inquiries.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }