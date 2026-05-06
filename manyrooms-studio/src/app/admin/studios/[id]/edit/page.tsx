'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  TrashIcon,
  PhotoIcon,
  XMarkIcon,
  ScaleIcon,
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

interface StudioFormData {
  name: string;
  owner_id: string;
  owner_email: string;
  owner_name: string;
  category: string;
  capacity: number;
  description: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  hourly_rate: number;
  amenities: string[];
  images: File[];
  existingImages: string[];
  removeImages: number[];
  status: string;
}

export default function AdminEditStudio() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<StudioFormData>({
    name: '',
    owner_id: '',
    owner_email: '',
    owner_name: '',
    category: '',
    capacity: 1,
    description: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    hourly_rate: 0,
    amenities: [],
    images: [],
    existingImages: [],
    removeImages: [],
    status: 'pending',
  });

  const categories = [
    'Photography & Stills',
    'Video Production',
    'Audio Recording',
    'Fashion & Editorial',
    'Art Studio',
    'Creative Office',
    'Event Space',
    'Other',
  ];

  const amenitiesList = [
    'Natural Light',
    'Studio Lighting Kit',
    'Backdrop Paper',
    'Changing Room',
    'Makeup Station',
    'WiFi',
    'AC/Heating',
    'Parking',
    'Kitchenette',
    'Bluetooth Speakers',
    'Projector',
    'Whiteboard',
  ];

  const studioId = params.id as string;

  useEffect(() => {
    if (studioId) {
      fetchStudio();
    }
  }, [studioId]);

  const fetchStudio = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch studio data
      const { data: studio, error: studioError } = await supabase
        .from('studios')
        .select('*')
        .eq('id', studioId)
        .single();

      if (studioError) throw studioError;
      
      if (!studio) {
        setError('Studio not found');
        setLoading(false);
        return;
      }

      // Fetch owner data
      let ownerEmail = '';
      let ownerName = '';
      if (studio.owner_id) {
        const { data: owner } = await supabase
          .from('users')
          .select('email, name')
          .eq('id', studio.owner_id)
          .single();
        
        if (owner) {
          ownerEmail = owner.email || '';
          ownerName = owner.name || '';
        }
      }

      setFormData({
        name: studio.name || '',
        owner_id: studio.owner_id || '',
        owner_email: ownerEmail,
        owner_name: ownerName,
        category: studio.category || '',
        capacity: studio.capacity || 1,
        description: studio.description || '',
        street_address: studio.street_address || '',
        city: studio.city || '',
        state: studio.state || '',
        postal_code: studio.postal_code || '',
        country: studio.country || 'United States',
        hourly_rate: studio.hourly_rate || 0,
        amenities: studio.amenities || [],
        images: [],
        existingImages: studio.images || [],
        removeImages: [],
        status: studio.status || 'pending',
      });
    } catch (err: any) {
      console.error('Error fetching studio:', err);
      setError(err.message || 'Failed to load studio');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StudioFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...formData.images, ...files];
    
    if (newImages.length + formData.existingImages.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
    setError('');
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      removeImages: [...prev.removeImages, index],
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateOwner = async () => {
    if (!formData.owner_email) return formData.owner_id;

    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, name')
        .eq('email', formData.owner_email)
        .single();

      if (existingUser) {
        // Update owner_id if changed
        if (existingUser.id !== formData.owner_id) {
          handleInputChange('owner_id', existingUser.id);
          handleInputChange('owner_name', existingUser.name);
        }
        return existingUser.id;
      }

      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          email: formData.owner_email,
          name: formData.owner_email.split('@')[0],
          role: 'owner',
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (userError) throw userError;
      
      handleInputChange('owner_id', newUser.id);
      handleInputChange('owner_name', newUser.name);
      return newUser.id;
    } catch (err) {
      console.error('Error updating owner:', err);
      return formData.owner_id;
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    
    try {
      // Update owner if email changed
      const ownerId = await handleUpdateOwner();

      // Process new images to base64
      const newImagePromises = formData.images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const mimeType = image.type;
        return `data:${mimeType};base64,${base64}`;
      });
      
      const newImageUrls = await Promise.all(newImagePromises);
      
      // Combine existing images (excluding removed ones) with new images
      const allImages = [...formData.existingImages, ...newImageUrls];

      // Update studio
      const { error: updateError } = await supabase
        .from('studios')
        .update({
          name: formData.name,
          owner_id: ownerId,
          category: formData.category,
          capacity: formData.capacity,
          description: formData.description,
          street_address: formData.street_address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          hourly_rate: formData.hourly_rate,
          amenities: formData.amenities,
          images: allImages,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', studioId);

      if (updateError) throw updateError;

      setSuccess('Studio updated successfully!');
      setTimeout(() => {
        router.push('/admin/studios');
      }, 1500);
      
    } catch (err: any) {
      console.error('Error updating studio:', err);
      setError(err.message || 'Failed to update studio');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'pending':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'rejected':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-white/5 border-white/10';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500">Loading studio...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/admin/studios" className="text-primary hover:underline">
            ← Back to Studios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/admin/studios" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Studios
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/studios')}
            className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
          >
            <ScaleIcon className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Edit Studio</h1>
        <p className="text-slate-400 text-sm mt-1">
          Update studio information, photos, and approval status.
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-emerald-500 text-sm">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Status Badge */}
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border">
        <span className="w-2 h-2 rounded-full animate-pulse bg-current"></span>
        <span>Current Status:</span>
        <span className={`font-bold ${getStatusColor(formData.status)} px-2 py-0.5 rounded`}>
          {formData.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">STUDIO NAME *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">OWNER EMAIL *</label>
                <input
                  type="email"
                  value={formData.owner_email}
                  onChange={(e) => handleInputChange('owner_email', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Current owner: {formData.owner_name || 'Unknown'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">CATEGORY *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">CAPACITY (PERSONS)</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('capacity', Math.max(1, formData.capacity - 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >-</button>
                  <span className="text-2xl font-bold w-16 text-center">{formData.capacity}</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('capacity', formData.capacity + 1)}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >+</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">DESCRIPTION</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">STREET ADDRESS *</label>
                <input
                  type="text"
                  value={formData.street_address}
                  onChange={(e) => handleInputChange('street_address', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">CITY *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">STATE *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">POSTAL CODE</label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">COUNTRY</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Amenities */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Pricing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">HOURLY RATE ($) *</label>
                <input
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4 mt-8">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-primary rounded border-white/10 bg-white/5"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Images & Status */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Studio Status</h3>
            <div className="space-y-4">
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full rounded-lg border px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all ${getStatusColor(formData.status)}`}
              >
                <option value="pending">Pending Review</option>
                <option value="approved">Approved (Live)</option>
                <option value="rejected">Rejected</option>
              </select>
              
              {formData.status === 'approved' && (
                <div className="p-3 bg-emerald-500/10 rounded-lg text-center">
                  <p className="text-xs text-emerald-500">Studio is live and visible to the public.</p>
                </div>
              )}
              {formData.status === 'pending' && (
                <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                  <p className="text-xs text-amber-500">Studio is pending review and not visible to the public.</p>
                </div>
              )}
              {formData.status === 'rejected' && (
                <div className="p-3 bg-red-500/10 rounded-lg text-center">
                  <p className="text-xs text-red-500">Studio has been rejected and not visible to the public.</p>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Studio Photos</h3>
            
            {/* Existing Images */}
            {formData.existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-2">Current Photos</p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.existingImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                      <img src={img} alt={`Studio ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {formData.images.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-2">New Photos</p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                      <img src={URL.createObjectURL(img)} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {(formData.existingImages.length + formData.images.length) < 10 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square rounded-lg bg-white/5 border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2"
              >
                <PhotoIcon className="w-8 h-8 text-slate-400" />
                <span className="text-xs text-slate-400">Add Photo</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="text-xs text-slate-500 mt-3">
              Recommended: Square images (1:1 ratio). Max 10 photos.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h3 className="text-sm font-bold text-primary mb-3">Admin Note</h3>
            <p className="text-sm text-slate-400">
              Changing the status to "Approved" will immediately make this studio visible to the public on the marketplace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}