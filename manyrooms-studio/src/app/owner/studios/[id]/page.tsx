'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

interface Studio {
  id: string;
  name: string;
  category: string;
  capacity: number;
  description: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  hourly_rate: number;
  daily_rate: number;
  weekly_rate: number;
  cleaning_fee: number;
  amenities: string[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    startTime: string;
    endTime: string;
  };
  images: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export default function OwnerStudioDetail() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  const studioId = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (studioId) {
      fetchStudio();
    }
  }, [studioId, user, authLoading]);

  const fetchStudio = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('studios')
        .select('*')
        .eq('id', studioId)
        .single();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Studio not found');
        return;
      }

      // Check if the logged-in user owns this studio
      if (data.owner_id !== user?.id) {
        setError('You do not have permission to view this studio');
        return;
      }

      setStudio(data);
    } catch (err: any) {
      console.error('Error fetching studio:', err);
      setError(err.message || 'Failed to load studio');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this studio? This action cannot be undone.')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('studios')
        .delete()
        .eq('id', studioId);

      if (deleteError) throw deleteError;

      router.push('/owner/studios');
    } catch (err: any) {
      console.error('Error deleting studio:', err);
      alert('Failed to delete studio');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500"><CheckCircleIcon className="w-3 h-3" /> Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-500"><ClockIcon className="w-3 h-3" /> Pending Review</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500"><XCircleIcon className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-400">{status || 'Draft'}</span>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
          <div className="text-primary font-bold">Loading Studio Details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/owner/studios" className="text-primary hover:underline">
            ← Back to My Studios
          </Link>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Studio not found</p>
          <Link href="/owner/studios" className="text-primary hover:underline">
            ← Back to My Studios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/owner/studios" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to My Studios
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/owner/studios/${studio.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Studio
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <div className="aspect-video bg-white/5 rounded-xl overflow-hidden mb-4">
          {studio.images && studio.images.length > 0 ? (
            <img
              src={studio.images[selectedImage]}
              alt={studio.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PhotoIcon className="w-16 h-16 text-slate-600" />
            </div>
          )}
        </div>
        {studio.images && studio.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {studio.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImage === idx ? 'border-primary' : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${studio.name} view ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Studio Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black tracking-tight">{studio.name}</h1>
              {getStatusBadge(studio.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                {studio.city}, {studio.state}
              </span>
              <span className="flex items-center gap-1">
                <UsersIcon className="w-4 h-4" />
                Up to {studio.capacity} people
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">Description</h3>
            <p className="text-slate-400 leading-relaxed">{studio.description || 'No description provided.'}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {studio.amenities && studio.amenities.length > 0 ? (
                studio.amenities.map((item) => (
                  <span key={item} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-sm">No amenities listed</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Availability</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-2">Days Available</p>
                <div className="flex flex-wrap gap-2">
                  {studio.availability && Object.entries(studio.availability)
                    .filter(([key, value]) => value === true && ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(key))
                    .map(([day]) => (
                      <span key={day} className="text-sm capitalize">{day.slice(0, 3)}</span>
                    ))}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-2">Operating Hours</p>
                <p className="text-sm">{studio.availability?.startTime || '09:00'} - {studio.availability?.endTime || '22:00'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Pricing</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Hourly Rate</span>
                <span className="text-xl font-bold text-primary">${studio.hourly_rate}/hr</span>
              </div>
              {studio.daily_rate > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Daily Rate</span>
                  <span className="font-medium">${studio.daily_rate}/day</span>
                </div>
              )}
              {studio.weekly_rate > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Weekly Rate</span>
                  <span className="font-medium">${studio.weekly_rate}/week</span>
                </div>
              )}
              {studio.cleaning_fee > 0 && (
                <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-2">
                  <span className="text-slate-400">Cleaning Fee</span>
                  <span className="font-medium">${studio.cleaning_fee}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Location Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-400">Address:</span> {studio.street_address}</p>
              <p><span className="text-slate-400">City:</span> {studio.city}</p>
              <p><span className="text-slate-400">State:</span> {studio.state}</p>
              <p><span className="text-slate-400">Postal Code:</span> {studio.postal_code}</p>
              <p><span className="text-slate-400">Country:</span> {studio.country}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Studio Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-400">Category:</span> {studio.category}</p>
              <p><span className="text-slate-400">Created:</span> {new Date(studio.created_at).toLocaleDateString()}</p>
              <p><span className="text-slate-400">Last Updated:</span> {new Date(studio.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}