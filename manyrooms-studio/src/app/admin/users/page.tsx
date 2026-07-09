// 'use client';

// import { useState } from 'react';
// import {
//   UserPlusIcon,
//   FunnelIcon,
//   ArrowPathIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   EllipsisVerticalIcon,
//   InformationCircleIcon,
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

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'owner' | 'franchisee' | 'client';
//   status: 'active' | 'pending' | 'suspended';
//   lastActivity: string;
//   avatar?: string;
// }

// export default function AdminUsers() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRole, setSelectedRole] = useState('all');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const users: User[] = [
//     {
//       id: '1',
//       name: 'Sarah Jenkins',
//       email: 'sarah.j@manyrooms.com',
//       role: 'admin',
//       status: 'active',
//       lastActivity: 'Today, 2:45 PM',
//     },
//     {
//       id: '2',
//       name: 'Marcus Thorne',
//       email: 'm.thorne@studios.net',
//       role: 'owner',
//       status: 'active',
//       lastActivity: 'Yesterday, 10:12 AM',
//     },
//     {
//       id: '3',
//       name: 'Elena Rodriguez',
//       email: 'elena.r@franchisepartners.com',
//       role: 'franchisee',
//       status: 'pending',
//       lastActivity: 'Never',
//     },
//     {
//       id: '4',
//       name: 'David Chen',
//       email: 'dchen@member.com',
//       role: 'client',
//       status: 'suspended',
//       lastActivity: '3 days ago',
//     },
//     {
//       id: '5',
//       name: 'Linda G.',
//       email: 'linda.g@manyrooms.com',
//       role: 'admin',
//       status: 'active',
//       lastActivity: '1 hour ago',
//     },
//     {
//       id: '6',
//       name: 'James Wilson',
//       email: 'j.wilson@creative.com',
//       role: 'owner',
//       status: 'active',
//       lastActivity: '2 hours ago',
//     },
//     {
//       id: '7',
//       name: 'Sofia Martinez',
//       email: 'sofia.m@studios.com',
//       role: 'franchisee',
//       status: 'active',
//       lastActivity: 'Yesterday, 3:30 PM',
//     },
//     {
//       id: '8',
//       name: 'Oliver Chen',
//       email: 'oliver.c@member.com',
//       role: 'client',
//       status: 'active',
//       lastActivity: '5 hours ago',
//     },
//     {
//       id: '9',
//       name: 'Nina Kapoor',
//       email: 'nina.k@manyrooms.com',
//       role: 'admin',
//       status: 'active',
//       lastActivity: 'Today, 9:15 AM',
//     },
//     {
//       id: '10',
//       name: 'Thomas Reed',
//       email: 't.reed@studios.net',
//       role: 'owner',
//       status: 'pending',
//       lastActivity: '2 days ago',
//     },
//   ];

//   const getRoleStyle = (role: string) => {
//     switch (role) {
//       case 'admin':
//         return 'bg-primary/10 text-primary';
//       case 'owner':
//         return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
//       case 'franchisee':
//         return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
//       case 'client':
//         return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
//       default:
//         return 'bg-slate-100 text-slate-700';
//     }
//   };

//   const getStatusDot = (status: string) => {
//     switch (status) {
//       case 'active':
//         return 'bg-emerald-500';
//       case 'pending':
//         return 'bg-amber-500';
//       case 'suspended':
//         return 'bg-red-500';
//       default:
//         return 'bg-slate-500';
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = selectedRole === 'all' || user.role === selectedRole;
//     const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="p-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header Actions */}
//         <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//           <div>
//             <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">User & Access Control</h1>
//             <p className="mt-1 text-slate-500">Configure global permissions and manage account security across ManyRooms.</p>
//           </div>
//           <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/30">
//             <UserPlusIcon className="w-5 h-5" />
//             Add New User
//           </button>
//         </div>

//         {/* Filters Bar */}
//         <div className="mb-6 flex flex-wrap items-center gap-4">
//           <div className="relative flex-1 min-w-[300px]">
//             <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by name, email or ID..."
//               className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 text-sm focus:border-primary focus:ring-primary dark:border-slate-800 dark:bg-background-dark dark:text-white outline-none"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <select
//                 value={selectedRole}
//                 onChange={(e) => setSelectedRole(e.target.value)}
//                 className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 appearance-none cursor-pointer dark:border-slate-800 dark:bg-background-dark dark:text-slate-300 pr-8"
//               >
//                 <option value="all">All Roles</option>
//                 <option value="admin">Admin</option>
//                 <option value="owner">Owner</option>
//                 <option value="franchisee">Franchisee</option>
//                 <option value="client">Client</option>
//               </select>
//               <MaterialIcon icon="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
//             </div>
//             <div className="relative">
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 appearance-none cursor-pointer dark:border-slate-800 dark:bg-background-dark dark:text-slate-300 pr-8"
//               >
//                 <option value="all">Status: All</option>
//                 <option value="active">Active</option>
//                 <option value="pending">Pending</option>
//                 <option value="suspended">Suspended</option>
//               </select>
//               <MaterialIcon icon="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
//             </div>
//             <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-primary dark:border-slate-800 dark:bg-background-dark">
//               <ArrowPathIcon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Table Container */}
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-background-dark">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-slate-50 dark:bg-slate-900/50">
//                 <tr>
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">User Details</th>
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Last Activity</th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//                 {paginatedUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
//                           {user.name.charAt(0)}
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
//                           <p className="text-xs text-slate-500">{user.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getRoleStyle(user.role)}`}>
//                         {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-1.5">
//                         <div className={`h-2 w-2 rounded-full ${getStatusDot(user.status)}`}></div>
//                         <span className={`text-xs font-medium capitalize ${user.status === 'active' ? 'text-emerald-600' : user.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
//                           {user.status}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-xs text-slate-500">{user.lastActivity}</p>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
//                         <EllipsisVerticalIcon className="w-5 h-5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
//             <p className="text-xs font-medium text-slate-500">
//               Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
//             </p>
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-background-dark"
//               >
//                 <ChevronLeftIcon className="w-4 h-4" />
//               </button>
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => setCurrentPage(pageNum)}
//                     className={`flex h-8 w-8 items-center justify-center rounded text-xs font-medium transition-colors ${
//                       currentPage === pageNum
//                         ? 'bg-primary text-white'
//                         : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                 disabled={currentPage === totalPages}
//                 className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-background-dark"
//               >
//                 <ChevronRightIcon className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Security Update Banner */}
//         <div className="mt-8 flex items-center justify-between rounded-xl bg-slate-900 p-4 text-white dark:bg-primary/20 dark:backdrop-blur-md">
//           <div className="flex items-center gap-4">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
//               <InformationCircleIcon className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold">Security Update Scheduled</p>
//               <p className="text-xs text-slate-400">System maintenance is scheduled for Sunday at 02:00 AM UTC. Some access management tasks might be delayed.</p>
//             </div>
//           </div>
//           <button className="rounded-lg bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20">Learn More</button>
//         </div>
//       </div>
//     </div>
//   );
// }




// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import {
//   UserPlusIcon,
//   FunnelIcon,
//   ArrowPathIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   EllipsisVerticalIcon,
//   InformationCircleIcon,
//   PencilIcon,
//   TrashIcon,
//   CheckCircleIcon,
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

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'owner' | 'franchisee' | 'client';
//   status: 'active' | 'pending' | 'suspended';
//   lastActivity: string;
//   created_at: string;
// }

// export default function AdminUsers() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRole, setSelectedRole] = useState('all');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
//   const [updating, setUpdating] = useState(false);
//   const itemsPerPage = 10;

//   // Fetch users from Supabase
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
      
//       const formattedUsers = (data || []).map((user: any) => ({
//         id: user.id,
//         name: user.name || user.email?.split('@')[0] || 'User',
//         email: user.email,
//         role: user.role || 'client',
//         status: user.status || 'active',
//         lastActivity: user.last_sign_in_at 
//           ? new Date(user.last_sign_in_at).toLocaleDateString()
//           : user.created_at 
//           ? new Date(user.created_at).toLocaleDateString()
//           : 'Never',
//         created_at: user.created_at,
//       }));
      
//       setUsers(formattedUsers);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateUserStatus = async (userId: string, newStatus: string) => {
//     if (updating) return;
//     setUpdating(true);
    
//     try {
//       // First check if status column exists and update
//       const { error: updateError } = await supabase
//         .from('users')
//         .update({ status: newStatus })
//         .eq('id', userId);
      
//       if (updateError) {
//         console.error('Update error details:', updateError);
//         alert(`Failed to update status: ${updateError.message}`);
//         return;
//       }
      
//       // Update local state
//       setUsers(prev => prev.map(user => 
//         user.id === userId ? { ...user, status: newStatus as User['status'] } : user
//       ));
      
//       setShowActionMenu(null);
      
//       // Show success message
//       const statusText = newStatus === 'active' ? 'activated' : newStatus === 'suspended' ? 'suspended' : 'updated';
//       alert(`User successfully ${statusText}`);
      
//     } catch (error: any) {
//       console.error('Error updating user status:', error);
//       alert(`Failed to update user status: ${error.message || 'Unknown error'}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const updateUserRole = async (userId: string, newRole: string) => {
//     if (updating) return;
//     setUpdating(true);
    
//     try {
//       const { error: updateError } = await supabase
//         .from('users')
//         .update({ role: newRole })
//         .eq('id', userId);
      
//       if (updateError) {
//         console.error('Update error details:', updateError);
//         alert(`Failed to update role: ${updateError.message}`);
//         return;
//       }
      
//       setUsers(prev => prev.map(user => 
//         user.id === userId ? { ...user, role: newRole as User['role'] } : user
//       ));
      
//       setShowActionMenu(null);
//       alert(`User role updated to ${newRole}`);
      
//     } catch (error: any) {
//       console.error('Error updating user role:', error);
//       alert(`Failed to update user role: ${error.message || 'Unknown error'}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const deleteUser = async (userId: string, userName: string) => {
//     if (!confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
//       return;
//     }
    
//     if (updating) return;
//     setUpdating(true);
    
//     try {
//       const { error } = await supabase
//         .from('users')
//         .delete()
//         .eq('id', userId);
      
//       if (error) throw error;
      
//       setUsers(prev => prev.filter(user => user.id !== userId));
//       setShowActionMenu(null);
//       alert('User deleted successfully');
      
//     } catch (error: any) {
//       console.error('Error deleting user:', error);
//       alert(`Failed to delete user: ${error.message || 'Unknown error'}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getRoleStyle = (role: string) => {
//     switch (role) {
//       case 'admin':
//         return 'bg-primary/10 text-primary';
//       case 'owner':
//         return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
//       case 'franchisee':
//         return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
//       case 'client':
//         return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
//       default:
//         return 'bg-slate-100 text-slate-700';
//     }
//   };

//   const getStatusDot = (status: string) => {
//     switch (status) {
//       case 'active':
//         return 'bg-emerald-500';
//       case 'pending':
//         return 'bg-amber-500';
//       case 'suspended':
//         return 'bg-red-500';
//       default:
//         return 'bg-slate-500';
//     }
//   };

//   const getStatusTextStyle = (status: string) => {
//     switch (status) {
//       case 'active':
//         return 'text-emerald-600';
//       case 'pending':
//         return 'text-amber-600';
//       case 'suspended':
//         return 'text-red-600';
//       default:
//         return 'text-slate-500';
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = selectedRole === 'all' || user.role === selectedRole;
//     const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   if (loading) {
//     return (
//       <div className="p-8 flex justify-center items-center min-h-[400px]">
//         <div className="animate-pulse text-center">
//           <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
//           <p className="text-slate-500">Loading users...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//           <div>
//             <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">User & Access Control</h1>
//             <p className="mt-1 text-slate-500">Configure global permissions and manage account security across ManyRooms.</p>
//           </div>
//           <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
//             <UserPlusIcon className="w-5 h-5" />
//             Add New User
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="mb-6 flex flex-wrap items-center gap-4">
//           <div className="relative flex-1 min-w-[300px]">
//             <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by name, email or ID..."
//               className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 text-sm focus:border-primary focus:ring-primary dark:border-slate-800 dark:bg-background-dark dark:text-white outline-none"
//             />
//           </div>
//           <div className="relative">
//             <select
//               value={selectedRole}
//               onChange={(e) => setSelectedRole(e.target.value)}
//               className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 appearance-none cursor-pointer dark:border-slate-800 dark:bg-background-dark dark:text-slate-300 pr-8"
//             >
//               <option value="all">All Roles</option>
//               <option value="admin">Admin</option>
//               <option value="owner">Owner</option>
//               <option value="franchisee">Franchisee</option>
//               <option value="client">Client</option>
//             </select>
//             <MaterialIcon icon="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
//           </div>
//           <div className="relative">
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 appearance-none cursor-pointer dark:border-slate-800 dark:bg-background-dark dark:text-slate-300 pr-8"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="pending">Pending</option>
//               <option value="suspended">Suspended</option>
//             </select>
//             <MaterialIcon icon="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
//           </div>
//           <button 
//             onClick={() => fetchUsers()}
//             className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-primary dark:border-slate-800 dark:bg-background-dark"
//             title="Refresh"
//           >
//             <ArrowPathIcon className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Users Table */}
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-background-dark">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-slate-50 dark:bg-slate-900/50">
//                 <tr>
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">User Details</th>
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
//                   <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Last Activity</th>
//                   <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//                 {paginatedUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
//                       No users found matching your filters.
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
//                             {user.name.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
//                             <p className="text-xs text-slate-500">{user.email}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getRoleStyle(user.role)}`}>
//                           {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-1.5">
//                           <div className={`h-2 w-2 rounded-full ${getStatusDot(user.status)}`}></div>
//                           <span className={`text-xs font-medium capitalize ${getStatusTextStyle(user.status)}`}>
//                             {user.status}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="text-xs text-slate-500">{user.lastActivity}</p>
//                       </td>
//                       <td className="px-6 py-4 text-right relative">
//                         <button
//                           onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
//                           className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
//                           disabled={updating}
//                         >
//                           <EllipsisVerticalIcon className="w-5 h-5" />
//                         </button>
                        
//                         {showActionMenu === user.id && (
//                           <div className="absolute right-6 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
//                             <div className="p-2 space-y-1">
//                               <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700">
//                                 Change Role
//                               </div>
//                               <button
//                                 onClick={() => updateUserRole(user.id, 'client')}
//                                 className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
//                               >
//                                 Client
//                               </button>
//                               <button
//                                 onClick={() => updateUserRole(user.id, 'owner')}
//                                 className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
//                               >
//                                 Studio Owner
//                               </button>
//                               <button
//                                 onClick={() => updateUserRole(user.id, 'franchisee')}
//                                 className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
//                               >
//                                 Franchisee
//                               </button>
//                               <button
//                                 onClick={() => updateUserRole(user.id, 'admin')}
//                                 className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
//                               >
//                                 Admin
//                               </button>
                              
//                               <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>
                              
//                               <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase">
//                                 Status
//                               </div>
//                               {user.status !== 'active' && (
//                                 <button
//                                   onClick={() => updateUserStatus(user.id, 'active')}
//                                   className="w-full text-left px-3 py-2 text-sm text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-2"
//                                 >
//                                   <CheckCircleIcon className="w-4 h-4" /> Activate
//                                 </button>
//                               )}
//                               {user.status !== 'suspended' && (
//                                 <button
//                                   onClick={() => updateUserStatus(user.id, 'suspended')}
//                                   className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-2"
//                                 >
//                                   <XCircleIcon className="w-4 h-4" /> Suspend
//                                 </button>
//                               )}
                              
//                               <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>
                              
//                               <button
//                                 onClick={() => deleteUser(user.id, user.name)}
//                                 className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center gap-2"
//                               >
//                                 <TrashIcon className="w-4 h-4" /> Delete User
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
//               <p className="text-xs font-medium text-slate-500">
//                 Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
//               </p>
//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-background-dark"
//                 >
//                   <ChevronLeftIcon className="w-4 h-4" />
//                 </button>
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum;
//                   if (totalPages <= 5) {
//                     pageNum = i + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = i + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => setCurrentPage(pageNum)}
//                       className={`flex h-8 w-8 items-center justify-center rounded text-xs font-medium transition-colors ${
//                         currentPage === pageNum
//                           ? 'bg-primary text-white'
//                           : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
//                       }`}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={currentPage === totalPages}
//                   className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-background-dark"
//                 >
//                   <ChevronRightIcon className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Security Banner */}
//         <div className="mt-8 flex items-center justify-between rounded-xl bg-slate-900 p-4 text-white dark:bg-primary/20 dark:backdrop-blur-md">
//           <div className="flex items-center gap-4">
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
//               <InformationCircleIcon className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold">Security Update Scheduled</p>
//               <p className="text-xs text-slate-400">System maintenance is scheduled for Sunday at 02:00 AM UTC. Some access management tasks might be delayed.</p>
//             </div>
//           </div>
//           <button className="rounded-lg bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20">Learn More</button>
//         </div>
//       </div>
//     </div>
//   );
// }



// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  UserPlusIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'franchisee' | 'client';
  status: 'active' | 'pending' | 'suspended';
  lastActivity: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers((data || []).map((user: any) => ({
        id: user.id, name: user.name || user.email?.split('@')[0] || 'User', email: user.email,
        role: user.role || 'client', status: user.status || 'active',
        lastActivity: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Never',
        created_at: user.created_at,
      })));
    } catch (error) { console.error('Error fetching users:', error); }
    finally { setLoading(false); }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    if (updating) return; setUpdating(true);
    try {
      await supabase.from('users').update({ status: newStatus }).eq('id', userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus as User['status'] } : u));
      setShowActionMenu(null);
    } catch (error: any) { alert(`Failed to update: ${error.message}`); }
    finally { setUpdating(false); }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (updating) return; setUpdating(true);
    try {
      await supabase.from('users').update({ role: newRole }).eq('id', userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as User['role'] } : u));
      setShowActionMenu(null);
    } catch (error: any) { alert(`Failed to update: ${error.message}`); }
    finally { setUpdating(false); }
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Delete "${userName}"? This cannot be undone.`)) return;
    if (updating) return; setUpdating(true);
    try {
      await supabase.from('users').delete().eq('id', userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setShowActionMenu(null);
    } catch (error: any) { alert(`Failed to delete: ${error.message}`); }
    finally { setUpdating(false); }
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-[#F1CB81]/30 text-[#3C291C]';
      case 'owner': return 'bg-[#DB8B8C]/20 text-[#3C291C]';
      case 'franchisee': return 'bg-[#91ADCD]/20 text-[#3C291C]';
      case 'client': return 'bg-[#3C291C]/5 text-[#3C291C]';
      default: return 'bg-[#3C291C]/5 text-[#3C291C]';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) { case 'active': return 'bg-green-500'; case 'pending': return 'bg-amber-500'; case 'suspended': return 'bg-red-500'; default: return 'bg-[#3C291C]/20'; }
  };

  const filteredUsers = users.filter(u => {
    return (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
           (selectedRole === 'all' || u.role === selectedRole) && (selectedStatus === 'all' || u.status === selectedStatus);
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-8">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-[#F1CB81]/40 rounded-full mx-auto mb-4"></div>
          <p className="text-[#3C291C] font-bold">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#3C291C] tracking-tight">User & Access Control</h1>
            <p className="mt-1 text-[#3C291C]/60 text-sm">Configure global permissions and manage account security across ManyRooms.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#F1CB81] px-5 py-3 text-sm font-bold text-[#3C291C] hover:bg-[#DB8B8C] hover:text-white transition-all shadow-lg">
            <UserPlusIcon className="w-5 h-5" /> Add New User
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3C291C]/30 text-xl" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or email..."
              className="w-full rounded-xl border border-[#3C291C]/10 bg-white py-3 pl-10 text-sm focus:border-[#F1CB81] focus:ring-[#F1CB81] outline-none text-[#3C291C] placeholder:text-[#3C291C]/30" />
          </div>
          <div className="relative">
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-xl border border-[#3C291C]/10 bg-white px-4 py-3 text-sm font-bold text-[#3C291C] appearance-none cursor-pointer pr-8 outline-none">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option><option value="owner">Owner</option><option value="franchisee">Franchisee</option><option value="client">Client</option>
            </select>
            <MaterialIcon icon="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3C291C]/30 text-sm pointer-events-none" />
          </div>
          <div className="relative">
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-[#3C291C]/10 bg-white px-4 py-3 text-sm font-bold text-[#3C291C] appearance-none cursor-pointer pr-8 outline-none">
              <option value="all">All Status</option>
              <option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option>
            </select>
            <MaterialIcon icon="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3C291C]/30 text-sm pointer-events-none" />
          </div>
          <button onClick={fetchUsers} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#3C291C]/10 bg-white text-[#3C291C]/50 hover:text-[#3C291C] transition-colors" title="Refresh">
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-[#3C291C]/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#3C291C]/5">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#3C291C]/40">User Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#3C291C]/40">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#3C291C]/40">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#3C291C]/40">Last Activity</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#3C291C]/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3C291C]/5">
                {paginatedUsers.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-[#3C291C]/40">No users found matching your filters.</td></tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#3C291C]/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#F1CB81] flex items-center justify-center text-[#3C291C] font-bold text-sm">{user.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <p className="text-sm font-bold text-[#3C291C]">{user.name}</p>
                            <p className="text-xs text-[#3C291C]/40">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getRoleStyle(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${getStatusDot(user.status)}`}></div>
                          <span className="text-xs font-bold text-[#3C291C]/60 capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><p className="text-xs text-[#3C291C]/40">{user.lastActivity}</p></td>
                      <td className="px-6 py-4 text-right relative">
                        <button onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                          className="rounded-lg p-2 text-[#3C291C]/30 hover:bg-[#3C291C]/5 hover:text-[#3C291C] transition-colors" disabled={updating}>
                          <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                        {showActionMenu === user.id && (
                          <div className="absolute right-6 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#3C291C]/10 z-10 py-2">
                            <div className="px-4 py-2 text-xs font-bold text-[#3C291C]/40 uppercase">Change Role</div>
                            {['client','owner','franchisee','admin'].map(role => (
                              <button key={role} onClick={() => updateUserRole(user.id, role)}
                                className="w-full text-left px-4 py-2 text-sm text-[#3C291C] hover:bg-[#3C291C]/5 transition-colors">{role.charAt(0).toUpperCase() + role.slice(1)}</button>
                            ))}
                            <div className="border-t border-[#3C291C]/10 my-2"></div>
                            <div className="px-4 py-2 text-xs font-bold text-[#3C291C]/40 uppercase">Status</div>
                            {user.status !== 'active' && (
                              <button onClick={() => updateUserStatus(user.id, 'active')} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-[#3C291C]/5 transition-colors flex items-center gap-2"><CheckCircleIcon className="w-4 h-4" /> Activate</button>
                            )}
                            {user.status !== 'suspended' && (
                              <button onClick={() => updateUserStatus(user.id, 'suspended')} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#3C291C]/5 transition-colors flex items-center gap-2"><XCircleIcon className="w-4 h-4" /> Suspend</button>
                            )}
                            <div className="border-t border-[#3C291C]/10 my-2"></div>
                            <button onClick={() => deleteUser(user.id, user.name)} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"><TrashIcon className="w-4 h-4" /> Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#3C291C]/10 bg-[#3C291C]/5 px-6 py-4">
              <p className="text-xs font-medium text-[#3C291C]/40">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3C291C]/10 bg-white text-[#3C291C]/40 hover:bg-[#3C291C]/5 disabled:opacity-50 transition-colors"><ChevronLeftIcon className="w-4 h-4" /></button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${currentPage === pageNum ? 'bg-[#F1CB81] text-[#3C291C]' : 'text-[#3C291C]/60 hover:bg-[#3C291C]/5'}`}>{pageNum}</button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3C291C]/10 bg-white text-[#3C291C]/40 hover:bg-[#3C291C]/5 disabled:opacity-50 transition-colors"><ChevronRightIcon className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Security Banner */}
        <div className="mt-8 flex items-center justify-between rounded-2xl bg-[#3C291C] p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"><InformationCircleIcon className="w-5 h-5" /></div>
            <div>
              <p className="text-sm font-bold">Security Update Scheduled</p>
              <p className="text-xs text-[#91ADCD]">System maintenance scheduled for Sunday at 02:00 AM UTC.</p>
            </div>
          </div>
          <button className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20 transition-colors">Learn More</button>
        </div>
      </div>
    </div>
  );
}