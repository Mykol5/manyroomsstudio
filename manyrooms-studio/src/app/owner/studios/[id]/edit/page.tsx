// app/owner/studios/[id]/edit/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
  MapPinIcon,
  TrashIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  UsersIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface StudioFormData {
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
  images: File[];
  existingImages: string[];
  removeImages: number[];
}

export default function EditStudioPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  const [formData, setFormData] = useState<StudioFormData>({
    name: '',
    category: '',
    capacity: 1,
    description: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    hourly_rate: 0,
    daily_rate: 0,
    weekly_rate: 0,
    cleaning_fee: 0,
    amenities: [],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
      startTime: '09:00',
      endTime: '22:00',
    },
    images: [],
    existingImages: [],
    removeImages: [],
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
    'Cyclorama Wall',
    'Green Screen',
    'Sound Treatment',
    'Freight Elevator',
  ];

  const studioId = params.id as string;

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: 'info' },
    { id: 'location', label: 'Location', icon: 'location_on' },
    { id: 'pricing', label: 'Pricing', icon: 'payments' },
    { id: 'amenities', label: 'Amenities', icon: 'checklist' },
    { id: 'availability', label: 'Availability', icon: 'event_available' },
    { id: 'photos', label: 'Photos', icon: 'photo_library' },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (studioId && user) {
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

      if (data.owner_id !== user?.id) {
        setError('You do not have permission to edit this studio');
        return;
      }

      setFormData({
        name: data.name || '',
        category: data.category || '',
        capacity: data.capacity || 1,
        description: data.description || '',
        street_address: data.street_address || '',
        city: data.city || '',
        state: data.state || '',
        postal_code: data.postal_code || '',
        country: data.country || 'United States',
        hourly_rate: data.hourly_rate || 0,
        daily_rate: data.daily_rate || 0,
        weekly_rate: data.weekly_rate || 0,
        cleaning_fee: data.cleaning_fee || 0,
        amenities: data.amenities || [],
        availability: data.availability || {
          monday: true, tuesday: true, wednesday: true, thursday: true,
          friday: true, saturday: true, sunday: true,
          startTime: '09:00', endTime: '22:00',
        },
        images: [],
        existingImages: data.images || [],
        removeImages: [],
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
    const totalImages = formData.images.length + formData.existingImages.length + files.length;
    
    if (totalImages > 10) {
      setError('Maximum 10 images allowed');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
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

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    
    try {
      const updateData: any = {
        name: formData.name,
        category: formData.category,
        capacity: formData.capacity,
        description: formData.description,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        hourly_rate: formData.hourly_rate,
        daily_rate: formData.daily_rate,
        weekly_rate: formData.weekly_rate,
        cleaning_fee: formData.cleaning_fee,
        amenities: formData.amenities,
        availability: formData.availability,
        updated_at: new Date().toISOString(),
      };

      let updatedImages = [...formData.existingImages];
      
      for (const image of formData.images) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const mimeType = image.type;
        updatedImages.push(`data:${mimeType};base64,${base64}`);
      }

      updateData.images = updatedImages;

      const { error: updateError } = await supabase
        .from('studios')
        .update(updateData)
        .eq('id', studioId);

      if (updateError) throw updateError;

      setSuccess('Studio updated successfully!');
      setTimeout(() => {
        router.push(`/owner/studios/${studioId}`);
      }, 1500);
      
    } catch (err: any) {
      console.error('Error updating studio:', err);
      setError(err.message || 'Failed to update studio');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="w-16 h-16 bg-[#446900]/20 rounded-full mx-auto"></div>
          <p className="text-[#446900] font-bold">Loading Studio...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <XMarkIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/owner/studios" className="text-[#446900] font-bold hover:underline">
              ← Back to My Studios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        
        {/* Success Toast */}
        {success && (
          <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
            <div className="bg-[#beff5f] border border-[#446900]/20 rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg">
              <CheckCircleIcon className="w-5 h-5 text-[#111f00]" />
              <span className="text-sm font-bold text-[#111f00]">{success}</span>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {error && formData.name && (
          <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
            <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg">
              <XMarkIcon className="w-5 h-5 text-red-500" />
              <span className="text-sm font-bold text-red-600">{error}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link 
              href={`/owner/studios/${studioId}`}
              className="flex items-center gap-2 text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm mb-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Studio Details
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#191c1d] tracking-tight">Edit Studio</h1>
            <p className="text-[#424937] text-sm mt-1">Update your studio information, photos, and pricing.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/owner/studios/${studioId}`)}
              className="px-6 py-3 border-2 border-[#c2c9b1] text-[#191c1d] rounded-xl font-bold text-sm hover:bg-[#edeeef] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[#beff5f] text-[#111f00] rounded-xl font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
            >
              <CheckCircleIcon className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-[#beff5f] text-[#111f00]'
                  : 'bg-white text-[#424937] hover:bg-[#edeeef] border border-[#c2c9b1]/20'
              }`}
            >
              <MaterialIcon icon={section.icon} className="text-lg" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
                <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
                  <MaterialIcon icon="info" className="text-[#446900]" />
                  Basic Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[#191c1d] mb-2">Studio Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., The High-Loft Gallery"
                      className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#191c1d] mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#191c1d] mb-2">Capacity (Persons)</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleInputChange('capacity', Math.max(1, formData.capacity - 1))}
                        className="w-12 h-12 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-xl font-bold text-[#191c1d] transition-all"
                      >−</button>
                      <span className="text-3xl font-extrabold w-16 text-center text-[#191c1d]">{formData.capacity}</span>
                      <button
                        type="button"
                        onClick={() => handleInputChange('capacity', formData.capacity + 1)}
                        className="w-12 h-12 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-xl font-bold text-[#191c1d] transition-all"
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#191c1d] mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={5}
                      placeholder="Describe your space, its unique features, and what makes it perfect for creatives..."
                      className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all resize-none placeholder:text-[#737a65]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Location Section */}
            {activeSection === 'location' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
                <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-[#446900]" />
                  Location
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[#191c1d] mb-2">Street Address *</label>
                    <input
                      type="text"
                      value={formData.street_address}
                      onChange={(e) => handleInputChange('street_address', e.target.value)}
                      placeholder="123 Creative Street"
                      className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#191c1d] mb-2">City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="New York"
                        className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#191c1d] mb-2">State *</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="NY"
                        className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#191c1d] mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postal_code}
                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                        placeholder="10001"
                        className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#191c1d] mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="United States"
                        className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Section */}
            {activeSection === 'pricing' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
                <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
                  <CurrencyDollarIcon className="w-6 h-6 text-[#446900]" />
                  Pricing
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[#191c1d] mb-2">Hourly Rate ($) *</label>
                    <input
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
                      placeholder="150"
                      className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#191c1d] mb-2">Daily Rate ($)</label>
                      <input
                        type="number"
                        value={formData.daily_rate}
                        onChange={(e) => handleInputChange('daily_rate', parseFloat(e.target.value) || 0)}
                        placeholder="800"
                        className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#191c1d] mb-2">Weekly Rate ($)</label>
                      <input
                        type="number"
                        value={formData.weekly_rate}
                        onChange={(e) => handleInputChange('weekly_rate', parseFloat(e.target.value) || 0)}
                        placeholder="4000"
                        className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#191c1d] mb-2">Cleaning Fee ($)</label>
                    <input
                      type="number"
                      value={formData.cleaning_fee}
                      onChange={(e) => handleInputChange('cleaning_fee', parseFloat(e.target.value) || 0)}
                      placeholder="50"
                      className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Amenities Section */}
            {activeSection === 'amenities' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
                <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
                  <MaterialIcon icon="checklist" className="text-[#446900]" />
                  Amenities & Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesList.map((amenity) => (
                    <label
                      key={amenity}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${
                        formData.amenities.includes(amenity)
                          ? 'bg-[#beff5f]/20 border-[#beff5f] text-[#111f00]'
                          : 'bg-[#f3f4f5] border-transparent text-[#424937] hover:bg-[#e7e8e9]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="sr-only"
                      />
                      <span className={`text-lg ${formData.amenities.includes(amenity) ? 'text-[#446900]' : 'text-[#737a65]'}`}>
                        {formData.amenities.includes(amenity) ? '✓' : '○'}
                      </span>
                      <span className="text-sm font-medium">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Section */}
            {activeSection === 'availability' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
                <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
                  <ClockIcon className="w-6 h-6 text-[#446900]" />
                  Availability
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#191c1d] mb-3">Open Days</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                        <label
                          key={day}
                          className={`flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all border-2 ${
                            (formData.availability as any)[day]
                              ? 'bg-[#beff5f]/20 border-[#beff5f] text-[#111f00] font-bold'
                              : 'bg-[#f3f4f5] border-transparent text-[#424937] hover:bg-[#e7e8e9]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={(formData.availability as any)[day]}
                            onChange={(e) => handleInputChange('availability', {
                              ...formData.availability,
                              [day]: e.target.checked,
                            })}
                            className="sr-only"
                          />
                          <span className="text-sm capitalize">{day.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#191c1d] mb-2">Start Time</label>
                      <input
                        type="time"
                        value={formData.availability.startTime}
                        onChange={(e) => handleInputChange('availability', {
                          ...formData.availability,
                          startTime: e.target.value,
                        })}
                        className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#191c1d] mb-2">End Time</label>
                      <input
                        type="time"
                        value={formData.availability.endTime}
                        onChange={(e) => handleInputChange('availability', {
                          ...formData.availability,
                          endTime: e.target.value,
                        })}
                        className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photos Section */}
            {activeSection === 'photos' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
                <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
                  <PhotoIcon className="w-6 h-6 text-[#446900]" />
                  Studio Photos
                </h3>
                
                {/* Existing Images */}
                {formData.existingImages.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-bold text-[#191c1d] mb-3">Current Photos</p>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.existingImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-[#f3f4f5] group">
                          <img src={img} alt={`Studio ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {formData.images.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-bold text-[#191c1d] mb-3">New Photos</p>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-[#f3f4f5] group">
                          <img src={URL.createObjectURL(img)} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
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
                    className="w-full aspect-[3/1] rounded-xl bg-[#f3f4f5] border-2 border-dashed border-[#c2c9b1] hover:border-[#446900] transition-colors flex flex-col items-center justify-center gap-3"
                  >
                    <PhotoIcon className="w-10 h-10 text-[#737a65]" />
                    <span className="text-sm font-bold text-[#424937]">Click to Add Photos</span>
                    <span className="text-xs text-[#737a65]">Maximum 10 photos</span>
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
              </div>
            )}
          </div>

          {/* Sidebar - Quick Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#c2c9b1]/20">
              <h3 className="text-lg font-extrabold text-[#191c1d] mb-4">Preview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#737a65]">Name</span>
                  <span className="font-medium text-[#191c1d]">{formData.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737a65]">Category</span>
                  <span className="font-medium text-[#191c1d]">{formData.category || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737a65]">Capacity</span>
                  <span className="font-medium text-[#191c1d]">{formData.capacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737a65]">Rate</span>
                  <span className="font-bold text-[#446900]">${formData.hourly_rate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737a65]">Location</span>
                  <span className="font-medium text-[#191c1d]">{formData.city || '—'}, {formData.state || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737a65]">Photos</span>
                  <span className="font-medium text-[#191c1d]">{formData.existingImages.length + formData.images.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#e4d7fd]/30 border border-[#e4d7fd] rounded-2xl p-6">
              <h3 className="text-sm font-extrabold text-[#665c7c] mb-2">Review Required</h3>
              <p className="text-sm text-[#665c7c]/80">
                Changes to your studio may require a new review by our team before appearing in search results.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full py-4 bg-[#beff5f] text-[#111f00] rounded-2xl font-extrabold text-lg hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
            >
              {saving ? 'Saving Changes...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import {
//   ArrowLeftIcon,
//   ArrowRightIcon,
//   PlusIcon,
//   XMarkIcon,
//   PhotoIcon,
//   MapPinIcon,
//   TrashIcon,
//   ScaleIcon,
// } from '@heroicons/react/24/outline';

// interface StudioFormData {
//   name: string;
//   category: string;
//   capacity: number;
//   description: string;
//   street_address: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country: string;
//   hourly_rate: number;
//   daily_rate: number;
//   weekly_rate: number;
//   cleaning_fee: number;
//   amenities: string[];
//   availability: {
//     monday: boolean;
//     tuesday: boolean;
//     wednesday: boolean;
//     thursday: boolean;
//     friday: boolean;
//     saturday: boolean;
//     sunday: boolean;
//     startTime: string;
//     endTime: string;
//   };
//   images: File[];
//   existingImages: string[];
//   removeImages: number[];
// }

// export default function EditStudioPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [formData, setFormData] = useState<StudioFormData>({
//     name: '',
//     category: '',
//     capacity: 1,
//     description: '',
//     street_address: '',
//     city: '',
//     state: '',
//     postal_code: '',
//     country: 'United States',
//     hourly_rate: 0,
//     daily_rate: 0,
//     weekly_rate: 0,
//     cleaning_fee: 0,
//     amenities: [],
//     availability: {
//       monday: true,
//       tuesday: true,
//       wednesday: true,
//       thursday: true,
//       friday: true,
//       saturday: true,
//       sunday: true,
//       startTime: '09:00',
//       endTime: '22:00',
//     },
//     images: [],
//     existingImages: [],
//     removeImages: [],
//   });

//   const categories = [
//     'Photography & Stills',
//     'Video Production',
//     'Audio Recording',
//     'Fashion & Editorial',
//     'Art Studio',
//     'Creative Office',
//     'Event Space',
//     'Other',
//   ];

//   const amenitiesList = [
//     'Natural Light',
//     'Studio Lighting Kit',
//     'Backdrop Paper',
//     'Changing Room',
//     'Makeup Station',
//     'WiFi',
//     'AC/Heating',
//     'Parking',
//     'Kitchenette',
//     'Bluetooth Speakers',
//     'Projector',
//     'Whiteboard',
//   ];

//   const studioId = params.id as string;

//   // Fetch studio data
//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push('/login');
//       return;
//     }
//     if (studioId && user) {
//       fetchStudio();
//     }
//   }, [studioId, user, authLoading]);

//   const fetchStudio = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const { data, error: fetchError } = await supabase
//         .from('studios')
//         .select('*')
//         .eq('id', studioId)
//         .single();

//       if (fetchError) throw fetchError;

//       if (!data) {
//         setError('Studio not found');
//         return;
//       }

//       if (data.owner_id !== user?.id) {
//         setError('You do not have permission to edit this studio');
//         return;
//       }

//       // Populate form with existing data
//       setFormData({
//         name: data.name || '',
//         category: data.category || '',
//         capacity: data.capacity || 1,
//         description: data.description || '',
//         street_address: data.street_address || '',
//         city: data.city || '',
//         state: data.state || '',
//         postal_code: data.postal_code || '',
//         country: data.country || 'United States',
//         hourly_rate: data.hourly_rate || 0,
//         daily_rate: data.daily_rate || 0,
//         weekly_rate: data.weekly_rate || 0,
//         cleaning_fee: data.cleaning_fee || 0,
//         amenities: data.amenities || [],
//         availability: data.availability || {
//           monday: true,
//           tuesday: true,
//           wednesday: true,
//           thursday: true,
//           friday: true,
//           saturday: true,
//           sunday: true,
//           startTime: '09:00',
//           endTime: '22:00',
//         },
//         images: [],
//         existingImages: data.images || [],
//         removeImages: [],
//       });
//     } catch (err: any) {
//       console.error('Error fetching studio:', err);
//       setError(err.message || 'Failed to load studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: keyof StudioFormData, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleAmenityToggle = (amenity: string) => {
//     setFormData(prev => ({
//       ...prev,
//       amenities: prev.amenities.includes(amenity)
//         ? prev.amenities.filter(a => a !== amenity)
//         : [...prev.amenities, amenity],
//     }));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     const newImages = [...formData.images, ...files];
    
//     if (newImages.length + formData.existingImages.length > 10) {
//       setError('Maximum 10 images allowed');
//       return;
//     }

//     setFormData(prev => ({
//       ...prev,
//       images: newImages,
//     }));
//     setError('');
//   };

//   const removeExistingImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       removeImages: [...prev.removeImages, index],
//       existingImages: prev.existingImages.filter((_, i) => i !== index),
//     }));
//   };

//   const removeNewImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async () => {
//     setSaving(true);
//     setError('');
    
//     try {
//       // Prepare update data
//       const updateData: any = {
//         name: formData.name,
//         category: formData.category,
//         capacity: formData.capacity,
//         description: formData.description,
//         street_address: formData.street_address,
//         city: formData.city,
//         state: formData.state,
//         postal_code: formData.postal_code,
//         country: formData.country,
//         hourly_rate: formData.hourly_rate,
//         daily_rate: formData.daily_rate,
//         weekly_rate: formData.weekly_rate,
//         cleaning_fee: formData.cleaning_fee,
//         amenities: formData.amenities,
//         availability: formData.availability,
//         updated_at: new Date().toISOString(),
//       };

//       // Handle images - remove deleted ones
//       let updatedImages = [...formData.existingImages];
      
//       // Add new images as base64
//       for (const image of formData.images) {
//         const bytes = await image.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const base64 = buffer.toString('base64');
//         const mimeType = image.type;
//         updatedImages.push(`data:${mimeType};base64,${base64}`);
//       }

//       updateData.images = updatedImages;

//       const { error: updateError } = await supabase
//         .from('studios')
//         .update(updateData)
//         .eq('id', studioId);

//       if (updateError) throw updateError;

//       setSuccess('Studio updated successfully!');
//       setTimeout(() => {
//         router.push(`/owner/studios/${studioId}`);
//       }, 1500);
      
//     } catch (err: any) {
//       console.error('Error updating studio:', err);
//       setError(err.message || 'Failed to update studio');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background-dark">
//         <div className="animate-pulse space-y-4">
//           <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto"></div>
//           <div className="text-primary font-bold">Loading Studio...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error && !formData.name) {
//     return (
//       <div className="p-8 max-w-4xl mx-auto">
//         <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
//           <p className="text-red-500 mb-4">{error}</p>
//           <Link href="/owner/studios" className="text-primary hover:underline">
//             ← Back to My Studios
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-[1400px] mx-auto">
//       {/* Success Toast */}
//       {success && (
//         <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
//           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-6 py-4 flex items-center gap-3 backdrop-blur-lg">
//             <span className="text-emerald-500">✓</span>
//             <span className="text-sm text-white">{success}</span>
//           </div>
//         </div>
//       )}

//       {/* Error Toast */}
//       {error && (
//         <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
//           <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-6 py-4 flex items-center gap-3 backdrop-blur-lg">
//             <span className="text-red-500">✗</span>
//             <span className="text-sm text-white">{error}</span>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <Link href={`/owner/studios/${studioId}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
//           <ArrowLeftIcon className="w-4 h-4" />
//           Back to Studio Details
//         </Link>
//         <div className="flex gap-3">
//           <button
//             onClick={() => router.push(`/owner/studios/${studioId}`)}
//             className="px-4 py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
//           >
//             <ScaleIcon className="w-4 h-4" />
//             {saving ? 'Saving...' : 'Save Changes'}
//           </button>
//         </div>
//       </div>

//       <div className="mb-8">
//         <h1 className="text-3xl font-black tracking-tight">Edit Studio</h1>
//         <p className="text-slate-400 text-sm mt-1">
//           Update your studio information, photos, and pricing.
//         </p>
//       </div>

//       {/* Form Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Form */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Basic Info */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-lg font-bold mb-4">Basic Information</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-bold mb-2">STUDIO NAME *</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">CATEGORY *</label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => handleInputChange('category', e.target.value)}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">CAPACITY (PERSONS)</label>
//                 <div className="flex items-center gap-4">
//                   <button
//                     type="button"
//                     onClick={() => handleInputChange('capacity', Math.max(1, formData.capacity - 1))}
//                     className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
//                   >-</button>
//                   <span className="text-2xl font-bold w-16 text-center">{formData.capacity}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleInputChange('capacity', formData.capacity + 1)}
//                     className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
//                   >+</button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">DESCRIPTION</label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => handleInputChange('description', e.target.value)}
//                   rows={4}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Location */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-lg font-bold mb-4">Location</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-bold mb-2">STREET ADDRESS *</label>
//                 <input
//                   type="text"
//                   value={formData.street_address}
//                   onChange={(e) => handleInputChange('street_address', e.target.value)}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-bold mb-2">CITY *</label>
//                   <input
//                     type="text"
//                     value={formData.city}
//                     onChange={(e) => handleInputChange('city', e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">STATE *</label>
//                   <input
//                     type="text"
//                     value={formData.state}
//                     onChange={(e) => handleInputChange('state', e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-bold mb-2">POSTAL CODE</label>
//                   <input
//                     type="text"
//                     value={formData.postal_code}
//                     onChange={(e) => handleInputChange('postal_code', e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">COUNTRY</label>
//                   <input
//                     type="text"
//                     value={formData.country}
//                     onChange={(e) => handleInputChange('country', e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Pricing */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-lg font-bold mb-4">Pricing</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-bold mb-2">HOURLY RATE ($) *</label>
//                 <input
//                   type="number"
//                   value={formData.hourly_rate}
//                   onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-bold mb-2">DAILY RATE</label>
//                   <input
//                     type="number"
//                     value={formData.daily_rate}
//                     onChange={(e) => handleInputChange('daily_rate', parseFloat(e.target.value) || 0)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">WEEKLY RATE</label>
//                   <input
//                     type="number"
//                     value={formData.weekly_rate}
//                     onChange={(e) => handleInputChange('weekly_rate', parseFloat(e.target.value) || 0)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-bold mb-2">CLEANING FEE</label>
//                 <input
//                   type="number"
//                   value={formData.cleaning_fee}
//                   onChange={(e) => handleInputChange('cleaning_fee', parseFloat(e.target.value) || 0)}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Amenities */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-lg font-bold mb-4">Amenities</h3>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//               {amenitiesList.map((amenity) => (
//                 <label key={amenity} className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.amenities.includes(amenity)}
//                     onChange={() => handleAmenityToggle(amenity)}
//                     className="w-4 h-4 text-primary rounded border-white/10 bg-white/5"
//                   />
//                   <span className="text-sm">{amenity}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Availability */}
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-lg font-bold mb-4">Availability</h3>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
//                 <label key={day} className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.availability[day as keyof typeof formData.availability] as boolean}
//                     onChange={(e) => handleInputChange('availability', {
//                       ...formData.availability,
//                       [day]: e.target.checked,
//                     })}
//                     className="w-4 h-4 text-primary rounded border-white/10 bg-white/5"
//                   />
//                   <span className="text-sm capitalize">{day}</span>
//                 </label>
//               ))}
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-bold mb-2">START TIME</label>
//                 <input
//                   type="time"
//                   value={formData.availability.startTime}
//                   onChange={(e) => handleInputChange('availability', {
//                     ...formData.availability,
//                     startTime: e.target.value,
//                   })}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-bold mb-2">END TIME</label>
//                 <input
//                   type="time"
//                   value={formData.availability.endTime}
//                   onChange={(e) => handleInputChange('availability', {
//                     ...formData.availability,
//                     endTime: e.target.value,
//                   })}
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Sidebar - Images */}
//         <div className="space-y-6">
//           <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//             <h3 className="text-lg font-bold mb-4">Studio Photos</h3>
            
//             {/* Existing Images */}
//             {formData.existingImages.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-xs text-slate-400 mb-2">Current Photos</p>
//                 <div className="grid grid-cols-3 gap-2">
//                   {formData.existingImages.map((img, idx) => (
//                     <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
//                       <img src={img} alt={`Studio ${idx + 1}`} className="w-full h-full object-cover" />
//                       <button
//                         type="button"
//                         onClick={() => removeExistingImage(idx)}
//                         className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
//                       >
//                         <TrashIcon className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* New Images */}
//             {formData.images.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-xs text-slate-400 mb-2">New Photos</p>
//                 <div className="grid grid-cols-3 gap-2">
//                   {formData.images.map((img, idx) => (
//                     <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
//                       <img src={URL.createObjectURL(img)} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
//                       <button
//                         type="button"
//                         onClick={() => removeNewImage(idx)}
//                         className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
//                       >
//                         <TrashIcon className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Upload Button */}
//             {(formData.existingImages.length + formData.images.length) < 10 && (
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full aspect-square rounded-lg bg-white/5 border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2"
//               >
//                 <PhotoIcon className="w-8 h-8 text-slate-400" />
//                 <span className="text-xs text-slate-400">Add Photo</span>
//               </button>
//             )}
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageUpload}
//               className="hidden"
//             />
//             <p className="text-xs text-slate-500 mt-3">
//               Recommended: Square images (1:1 ratio). Max 10 photos.
//             </p>
//           </div>

//           <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
//             <h3 className="text-sm font-bold text-primary mb-3">Need Help?</h3>
//             <p className="text-sm text-slate-400">
//               Your studio will need to be reviewed by our team before it appears in search results after making changes.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }