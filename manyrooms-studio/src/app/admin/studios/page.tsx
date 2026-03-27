'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Material Icon component
const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
  <span 
    className={`material-symbols-outlined ${className}`} 
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {icon}
  </span>
);

interface Studio {
  id: string;
  name: string;
  owner: string;
  category: string;
  location: string;
  hourlyRate: number;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  bookings: number;
  image: string;
}

export default function AdminStudios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [studios] = useState<Studio[]>([
    {
      id: '1',
      name: 'Sunset Sound',
      owner: 'Marcus Sterling',
      category: 'Recording',
      location: 'Los Angeles, CA',
      hourlyRate: 120,
      status: 'active',
      rating: 4.9,
      bookings: 156,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAKI0GcZT2d2wkOa6sLzp--5mIQwZ360RHLGM5NkbHd9L121Wn0GyuIUP6PnURFqaFwdwXvzgy_xOCh77bz3RvIPRIyR04Y2f22AYTHqLvvxwywfMBPYB1zXVI6Ist_ATEZA1-JrkLYyWF_eTYOmjzo02ejG3MiYF78VIOXxqlt8lqJY2r5PonZaAPli2zr0HIb_X9P50qowM4UjEBPoEzg-v-35w1Q5jGoPtWCZsNYnoerUCz4vMjv4sjBNGB50dgfvbcDoIGw_Fb',
    },
    {
      id: '2',
      name: 'The Blue Room',
      owner: 'Elena Rossi',
      category: 'Photography',
      location: 'Brooklyn, NY',
      hourlyRate: 95,
      status: 'active',
      rating: 4.8,
      bookings: 98,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiLSJxx-JHP0NCl05p6LmS1CPKZi4X1XnyVc-ovuxK7BA8wXhljkrgqX1hLWHNbVTOZ10qWFadBw18fQ6em3y2CVzYQt6Dn6_f3c-U6RXYjR1Pb93X0aV9d9cXbdTX8m16i0PYAgD8eIyblJnEyasYjoi0-U8BSopx5UW2nWZTL92okKUZY34wybwUhx4qPiJZ0Sj9PT88U4imqY7T-mTWALO008NiF7T-fOIpNq7Ycy2UEGrfcrbURwMlhaqwCmfxBlYXrmUnhSmL',
    },
    {
      id: '3',
      name: 'Echo Studios',
      owner: 'James Chen',
      category: 'Rehearsal',
      location: 'London, UK',
      hourlyRate: 45,
      status: 'pending',
      rating: 4.5,
      bookings: 67,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY60-gsr7AqZzikT5ZViN86WXAKU3D6NNf917UwHt711pr5I2Vi_Eu_CHoZgjq2qNXTVJz2a5FQzEPLkHXU055Q5YnEPapwYwMnnXNCsg94Fwr2QuQCDyYNV8RuMPYSwWvTwVp2xY5oTbUt5kYy7abiKpcBPrmK77P5rD9zaxnHuybR3FGW_9yE0UdPQ8ZPu8YOHC_fev7mA3awsK1bRC99q2AFHhjuO3bGPGbJxE6nCVoyjk032qQxR6e21XLo24L2KkiDioFbZ8M',
    },
    {
      id: '4',
      name: 'Neon Lights Video',
      owner: 'Sofia Martinez',
      category: 'Video',
      location: 'Toronto, CAN',
      hourlyRate: 150,
      status: 'active',
      rating: 4.9,
      bookings: 124,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUygV54k5_jnQ2PKtCOl1U3ySZ4KVytZ-yWVjUvBCjl07usMddrq4qlOTo9ZY9HLCymFmlXfV3Z3e_zxP6SXXMwFr2aDcLssC925Jc7JK2ZGmij5EADi36QAHY8-R8X54qn52K5BkfEpFXuAGwQshZ4DKNadLpKPSI1aESsRW980meDNKP03IXbh9_VXyZlu4-VI2MSYFhetfdXgUiQgNoo08yLoZESJ6tznK2QUnSyKGMsU3bm6so0K6pWIUQyNVBIc5_SsNdUMYL',
    },
  ]);

  const categories = ['all', 'Recording', 'Photography', 'Rehearsal', 'Video'];
  const statuses = ['all', 'active', 'pending', 'suspended'];

  const filteredStudios = studios.filter(studio => {
    const matchesSearch = studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          studio.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          studio.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || studio.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || studio.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudios.length / itemsPerPage);
  const paginatedStudios = filteredStudios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500';
      case 'suspended':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Recording':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Photography':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Rehearsal':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400';
      case 'Video':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Studio Listings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and moderate all studios on the platform.</p>
          </div>
          <Link
            href="/admin/studios/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add New Studio
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, owner, or location..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 text-sm focus:border-primary focus:ring-primary dark:border-slate-800 dark:bg-background-dark dark:text-white outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-slate-800 dark:bg-background-dark dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium dark:border-slate-800 dark:bg-background-dark dark:text-white"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Studios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedStudios.map((studio) => (
            <div key={studio.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={studio.image}
                  alt={studio.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusStyle(studio.status)}`}>
                    {studio.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{studio.name}</h3>
                  <div className="flex items-center gap-1">
                    <MaterialIcon icon="star" className="text-amber-500 text-sm" />
                    <span className="text-sm font-medium">{studio.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-2">{studio.owner} • {studio.location}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getCategoryStyle(studio.category)}`}>
                    {studio.category}
                  </span>
                  <span className="text-xs text-slate-500">${studio.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-primary">{studio.bookings}</span> bookings
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStudios.length)} of {filteredStudios.length} studios
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary disabled:opacity-50 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary disabled:opacity-50 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}