// app/owner/list-new/page.tsx
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeftIcon,
  XMarkIcon,
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
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
  images: File[];
  imagePreviews: string[];
  amenities: string[];
  hourly_rate: number;
  daily_rate: number;
  weekly_rate: number;
  cleaning_fee: number;
  availability: {
    monday: boolean; tuesday: boolean; wednesday: boolean; thursday: boolean;
    friday: boolean; saturday: boolean; sunday: boolean;
    startTime: string; endTime: string;
  };
}

export default function ListNewStudioPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<StudioFormData>({
    name: '', category: '', capacity: 12, description: '',
    street_address: '', city: '', state: '', postal_code: '', country: 'United States',
    images: [], imagePreviews: [], amenities: [],
    hourly_rate: 0, daily_rate: 0, weekly_rate: 0, cleaning_fee: 0,
    availability: {
      monday: true, tuesday: true, wednesday: true, thursday: true,
      friday: true, saturday: true, sunday: true,
      startTime: '09:00', endTime: '22:00',
    },
  });

  const categories = [
    'Photography & Stills', 'Video Production', 'Audio Recording',
    'Fashion & Editorial', 'Art Studio', 'Creative Office', 'Event Space', 'Other',
  ];

  const amenitiesList = [
    'Natural Light', 'Studio Lighting Kit', 'Backdrop Paper', 'Changing Room',
    'Makeup Station', 'WiFi', 'AC/Heating', 'Parking', 'Kitchenette',
    'Bluetooth Speakers', 'Projector', 'Whiteboard', 'Cyclorama Wall',
    'Green Screen', 'Sound Treatment', 'Freight Elevator',
  ];

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: 'info' },
    { id: 'location', label: 'Location', icon: 'location_on' },
    { id: 'amenities', label: 'Amenities', icon: 'checklist' },
    { id: 'availability', label: 'Availability', icon: 'event_available' },
    { id: 'pricing', label: 'Pricing', icon: 'payments' },
    { id: 'photos', label: 'Photos', icon: 'photo_library' },
  ];

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
    if (formData.images.length + files.length > 10) {
      setError('Maximum 10 images allowed');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [...prev.imagePreviews, ...files.map(f => URL.createObjectURL(f))],
    }));
    setError('');
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(formData.imagePreviews[index]);
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!user?.id) { setError('You must be logged in'); return; }
    setLoading(true); setError('');
    try {
      const imageBase64Array: string[] = [];
      for (const image of formData.images) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        imageBase64Array.push(`data:${image.type};base64,${buffer.toString('base64')}`);
      }

      const { error: insertError } = await supabase.from('studios').insert({
        owner_id: user.id, name: formData.name, category: formData.category,
        capacity: formData.capacity, description: formData.description,
        street_address: formData.street_address, city: formData.city,
        state: formData.state, postal_code: formData.postal_code,
        country: formData.country, images: imageBase64Array,
        amenities: formData.amenities, hourly_rate: formData.hourly_rate,
        daily_rate: formData.daily_rate, weekly_rate: formData.weekly_rate,
        cleaning_fee: formData.cleaning_fee, availability: formData.availability,
        status: 'pending', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      });
      if (insertError) throw insertError;
      setSuccess('Studio created successfully! It will be reviewed by our team.');
      setTimeout(() => router.push('/owner/studios'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create studio');
    } finally { setLoading(false); }
  };

  const isFormComplete = () => {
    return formData.name && formData.category && formData.description &&
           formData.street_address && formData.city && formData.state &&
           formData.hourly_rate > 0 && formData.images.length >= 1;
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        
        {success && (
          <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
            <div className="bg-[#F1CB81] border border-[#3C291C]/10 rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg">
              <CheckCircleIcon className="w-5 h-5 text-[#3C291C]" />
              <span className="text-sm font-bold text-[#3C291C]">{success}</span>
            </div>
          </div>
        )}

        {error && (
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
            <Link href="/owner/studios" className="flex items-center gap-2 text-[#3C291C]/60 hover:text-[#3C291C] transition-colors font-bold text-sm mb-2">
              <ArrowLeftIcon className="w-4 h-4" /> Back to My Studios
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#3C291C] tracking-tight">List New Studio</h1>
            <p className="text-[#3C291C]/60 text-sm mt-1">Create a new creative space listing and reach professionals worldwide.</p>
          </div>
          <button onClick={handleSubmit} disabled={loading || !isFormComplete()}
            className="flex items-center gap-2 px-6 py-3 bg-[#F1CB81] text-[#3C291C] rounded-xl font-bold text-sm hover:bg-[#DB8B8C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap">
            <CheckCircleIcon className="w-5 h-5" />
            {loading ? 'Publishing...' : 'Publish Studio'}
          </button>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button key={section.id} onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-[#F1CB81] text-[#3C291C]'
                  : 'bg-white text-[#3C291C]/60 hover:bg-[#3C291C]/5 border border-[#3C291C]/10'
              }`}>
              <MaterialIcon icon={section.icon} className="text-lg" />
              {section.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Info */}
            {activeSection === 'basic' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
                <h3 className="text-xl font-extrabold text-[#3C291C] mb-6 flex items-center gap-2">
                  <MaterialIcon icon="info" className="text-[#DB8B8C]" /> Basic Information
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-2">Studio Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., The Obsidian Suite"
                      className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none transition-all placeholder:text-[#3C291C]/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-2">Category *</label>
                    <select value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none">
                      <option value="">Select a category</option>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-2">Capacity (Persons)</label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => handleInputChange('capacity', Math.max(1, formData.capacity - 1))}
                        className="w-12 h-12 rounded-xl bg-[#3C291C]/5 hover:bg-[#3C291C]/10 text-xl font-bold text-[#3C291C] transition-all">−</button>
                      <span className="text-3xl font-extrabold w-16 text-center text-[#3C291C]">{formData.capacity}</span>
                      <button type="button" onClick={() => handleInputChange('capacity', formData.capacity + 1)}
                        className="w-12 h-12 rounded-xl bg-[#3C291C]/5 hover:bg-[#3C291C]/10 text-xl font-bold text-[#3C291C] transition-all">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-2">Description *</label>
                    <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={5}
                      placeholder="Describe the lighting, acoustics, and aesthetic energy..."
                      className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none resize-none placeholder:text-[#3C291C]/30" />
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {activeSection === 'location' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
                <h3 className="text-xl font-extrabold text-[#3C291C] mb-6 flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-[#DB8B8C]" /> Location
                </h3>
                <div className="space-y-5">
                  {[
                    { label: 'Street Address *', field: 'street_address' as keyof StudioFormData, placeholder: '1242 Arts District Blvd' },
                    { label: 'City *', field: 'city' as keyof StudioFormData, placeholder: 'Los Angeles' },
                    { label: 'State *', field: 'state' as keyof StudioFormData, placeholder: 'California' },
                    { label: 'Postal Code', field: 'postal_code' as keyof StudioFormData, placeholder: '90012' },
                    { label: 'Country', field: 'country' as keyof StudioFormData, placeholder: 'United States' },
                  ].map((f, i) => (
                    <div key={i} className={i > 0 ? (i < 3 ? 'grid grid-cols-2 gap-4' : '') : ''}>
                      {i === 1 && (
                        <div>
                          <label className="block text-sm font-bold text-[#3C291C] mb-2">{f.label}</label>
                          <input type="text" value={String(formData[f.field] || '')} onChange={(e) => handleInputChange(f.field, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-[#3C291C]/30" />
                        </div>
                      )}
                      {i === 2 && (
                        <div>
                          <label className="block text-sm font-bold text-[#3C291C] mb-2">State *</label>
                          <input type="text" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)}
                            placeholder="California"
                            className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-[#3C291C]/30" />
                        </div>
                      )}
                      {i === 0 && (
                        <div>
                          <label className="block text-sm font-bold text-[#3C291C] mb-2">{f.label}</label>
                          <input type="text" value={String(formData[f.field] || '')} onChange={(e) => handleInputChange(f.field, e.target.value)}
                            placeholder={f.placeholder}
                            className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-[#3C291C]/30" />
                        </div>
                      )}
                      {i === 3 && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-[#3C291C] mb-2">Postal Code</label>
                            <input type="text" value={formData.postal_code} onChange={(e) => handleInputChange('postal_code', e.target.value)}
                              placeholder="90012"
                              className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-[#3C291C]/30" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-[#3C291C] mb-2">Country</label>
                            <input type="text" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)}
                              placeholder="United States"
                              className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-[#3C291C]/30" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {activeSection === 'amenities' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
                <h3 className="text-xl font-extrabold text-[#3C291C] mb-6 flex items-center gap-2">
                  <MaterialIcon icon="checklist" className="text-[#DB8B8C]" /> Amenities & Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${
                        formData.amenities.includes(amenity)
                          ? 'bg-[#F1CB81]/20 border-[#F1CB81] text-[#3C291C]'
                          : 'bg-[#3C291C]/5 border-transparent text-[#3C291C]/60 hover:bg-[#3C291C]/10'
                      }`}>
                      <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} className="sr-only" />
                      <span className={`text-lg ${formData.amenities.includes(amenity) ? 'text-[#3C291C]' : 'text-[#3C291C]/30'}`}>
                        {formData.amenities.includes(amenity) ? '✓' : '○'}
                      </span>
                      <span className="text-sm font-medium">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            {activeSection === 'availability' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
                <h3 className="text-xl font-extrabold text-[#3C291C] mb-6 flex items-center gap-2">
                  <ClockIcon className="w-6 h-6 text-[#DB8B8C]" /> Availability
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-3">Open Days</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map((day) => (
                        <label key={day}
                          className={`flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all border-2 ${
                            (formData.availability as any)[day]
                              ? 'bg-[#F1CB81]/20 border-[#F1CB81] text-[#3C291C] font-bold'
                              : 'bg-[#3C291C]/5 border-transparent text-[#3C291C]/60 hover:bg-[#3C291C]/10'
                          }`}>
                          <input type="checkbox" checked={(formData.availability as any)[day]}
                            onChange={(e) => handleInputChange('availability', { ...formData.availability, [day]: e.target.checked })}
                            className="sr-only" />
                          <span className="text-sm capitalize">{day.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#3C291C] mb-2">Start Time</label>
                      <input type="time" value={formData.availability.startTime}
                        onChange={(e) => handleInputChange('availability', { ...formData.availability, startTime: e.target.value })}
                        className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#3C291C] mb-2">End Time</label>
                      <input type="time" value={formData.availability.endTime}
                        onChange={(e) => handleInputChange('availability', { ...formData.availability, endTime: e.target.value })}
                        className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing */}
            {activeSection === 'pricing' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
                <h3 className="text-xl font-extrabold text-[#3C291C] mb-6 flex items-center gap-2">
                  <CurrencyDollarIcon className="w-6 h-6 text-[#DB8B8C]" /> Pricing
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-2">Hourly Rate ($) *</label>
                    <input type="number" value={formData.hourly_rate} onChange={(e) => handleInputChange('hourly_rate', parseInt(e.target.value) || 0)}
                      placeholder="180"
                      className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-[#3C291C]/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#3C291C] mb-2">Daily Rate ($)</label>
                      <input type="number" value={formData.daily_rate} onChange={(e) => handleInputChange('daily_rate', parseInt(e.target.value) || 0)}
                        placeholder="1200"
                        className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-[#3C291C]/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#3C291C] mb-2">Weekly Rate ($)</label>
                      <input type="number" value={formData.weekly_rate} onChange={(e) => handleInputChange('weekly_rate', parseInt(e.target.value) || 0)}
                        placeholder="7000"
                        className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-[#3C291C]/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#3C291C] mb-2">Cleaning Fee ($)</label>
                    <input type="number" value={formData.cleaning_fee} onChange={(e) => handleInputChange('cleaning_fee', parseInt(e.target.value) || 0)}
                      placeholder="50"
                      className="w-full bg-[#3C291C]/5 border border-[#3C291C]/10 rounded-xl px-4 py-3 text-[#3C291C] focus:ring-2 focus:ring-[#F1CB81] outline-none placeholder:text-[#3C291C]/30" />
                  </div>
                </div>
              </div>
            )}

            {/* Photos */}
            {activeSection === 'photos' && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#3C291C]/10">
                <h3 className="text-xl font-extrabold text-[#3C291C] mb-6 flex items-center gap-2">
                  <PhotoIcon className="w-6 h-6 text-[#DB8B8C]" /> Studio Photos *
                </h3>
                {formData.imagePreviews.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-[#3C291C]/5 group">
                          <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {formData.images.length < 10 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[3/1] rounded-xl bg-[#3C291C]/5 border-2 border-dashed border-[#3C291C]/20 hover:border-[#F1CB81] transition-colors flex flex-col items-center justify-center gap-3">
                    <PhotoIcon className="w-10 h-10 text-[#3C291C]/30" />
                    <span className="text-sm font-bold text-[#3C291C]">Click to Add Photos</span>
                    <span className="text-xs text-[#3C291C]/40">{formData.images.length === 0 ? 'At least 1 photo required' : `${10 - formData.images.length} slots remaining`}</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#3C291C]/10">
              <h3 className="text-lg font-extrabold text-[#3C291C] mb-4">Listing Preview</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Name', formData.name],
                  ['Category', formData.category],
                  ['Capacity', `${formData.capacity} people`],
                  ['Rate', formData.hourly_rate > 0 ? `$${formData.hourly_rate}/hr` : '—'],
                  ['Location', formData.city ? `${formData.city}, ${formData.state}` : '—'],
                  ['Photos', formData.imagePreviews.length.toString()],
                  ['Amenities', formData.amenities.length.toString()],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[#3C291C]/40">{label}</span>
                    <span className={`font-medium ${label === 'Rate' && formData.hourly_rate > 0 ? 'text-[#DB8B8C] font-bold' : 'text-[#3C291C]'}`}>{value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#91ADCD]/20 border border-[#91ADCD]/30 rounded-2xl p-6">
              <h3 className="text-sm font-extrabold text-[#3C291C] mb-2">Review Process</h3>
              <p className="text-sm text-[#3C291C]/60">Your studio will be reviewed by our team before appearing in search results. This usually takes 24-48 hours.</p>
            </div>

            <div className="bg-[#F1CB81]/20 border border-[#F1CB81]/30 rounded-2xl p-6">
              <h3 className="text-sm font-extrabold text-[#3C291C] mb-2">Quick Tips</h3>
              <ul className="text-sm text-[#3C291C]/60 space-y-2">
                <li>• Use high-quality, well-lit photos</li>
                <li>• Write a compelling description</li>
                <li>• Set competitive pricing</li>
                <li>• List all amenities accurately</li>
              </ul>
            </div>

            <button onClick={handleSubmit} disabled={loading || !isFormComplete()}
              className="w-full py-4 bg-[#F1CB81] text-[#3C291C] rounded-2xl font-extrabold text-lg hover:bg-[#DB8B8C] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
              {loading ? 'Publishing...' : 'Publish Studio'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




// // app/owner/list-new/page.tsx
// 'use client';

// import { useState, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import {
//   ArrowLeftIcon,
//   ArrowRightIcon,
//   PlusIcon,
//   XMarkIcon,
//   PhotoIcon,
//   MapPinIcon,
//   CurrencyDollarIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   DocumentTextIcon,
// } from '@heroicons/react/24/outline';

// const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
//   <span className={`material-symbols-outlined ${className}`}>{icon}</span>
// );

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
//   images: File[];
//   imagePreviews: string[];
//   amenities: string[];
//   hourly_rate: number;
//   daily_rate: number;
//   weekly_rate: number;
//   cleaning_fee: number;
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
// }

// export default function ListNewStudioPage() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [activeSection, setActiveSection] = useState('basic');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [formData, setFormData] = useState<StudioFormData>({
//     name: '',
//     category: '',
//     capacity: 12,
//     description: '',
//     street_address: '',
//     city: '',
//     state: '',
//     postal_code: '',
//     country: 'United States',
//     images: [],
//     imagePreviews: [],
//     amenities: [],
//     hourly_rate: 0,
//     daily_rate: 0,
//     weekly_rate: 0,
//     cleaning_fee: 0,
//     availability: {
//       monday: true, tuesday: true, wednesday: true, thursday: true,
//       friday: true, saturday: true, sunday: true,
//       startTime: '09:00', endTime: '22:00',
//     },
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
//     'Natural Light', 'Studio Lighting Kit', 'Backdrop Paper', 'Changing Room',
//     'Makeup Station', 'WiFi', 'AC/Heating', 'Parking', 'Kitchenette',
//     'Bluetooth Speakers', 'Projector', 'Whiteboard', 'Cyclorama Wall',
//     'Green Screen', 'Sound Treatment', 'Freight Elevator',
//   ];

//   const sections = [
//     { id: 'basic', label: 'Basic Info', icon: 'info' },
//     { id: 'location', label: 'Location', icon: 'location_on' },
//     { id: 'amenities', label: 'Amenities', icon: 'checklist' },
//     { id: 'availability', label: 'Availability', icon: 'event_available' },
//     { id: 'pricing', label: 'Pricing', icon: 'payments' },
//     { id: 'photos', label: 'Photos', icon: 'photo_library' },
//   ];

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
//     const totalImages = formData.images.length + files.length;
    
//     if (totalImages > 10) {
//       setError('Maximum 10 images allowed');
//       setTimeout(() => setError(''), 3000);
//       return;
//     }

//     const newPreviews = files.map(file => URL.createObjectURL(file));
    
//     setFormData(prev => ({
//       ...prev,
//       images: [...prev.images, ...files],
//       imagePreviews: [...prev.imagePreviews, ...newPreviews],
//     }));
//     setError('');
//   };

//   const removeImage = (index: number) => {
//     URL.revokeObjectURL(formData.imagePreviews[index]);
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//       imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!user?.id) {
//       setError('You must be logged in');
//       return;
//     }

//     setLoading(true);
//     setError('');
    
//     try {
//       // Convert images to base64
//       const imageBase64Array: string[] = [];
//       for (const image of formData.images) {
//         const bytes = await image.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const base64 = buffer.toString('base64');
//         const mimeType = image.type;
//         imageBase64Array.push(`data:${mimeType};base64,${base64}`);
//       }

//       const { error: insertError } = await supabase
//         .from('studios')
//         .insert({
//           owner_id: user.id,
//           name: formData.name,
//           category: formData.category,
//           capacity: formData.capacity,
//           description: formData.description,
//           street_address: formData.street_address,
//           city: formData.city,
//           state: formData.state,
//           postal_code: formData.postal_code,
//           country: formData.country,
//           images: imageBase64Array,
//           amenities: formData.amenities,
//           hourly_rate: formData.hourly_rate,
//           daily_rate: formData.daily_rate,
//           weekly_rate: formData.weekly_rate,
//           cleaning_fee: formData.cleaning_fee,
//           availability: formData.availability,
//           status: 'pending',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         });

//       if (insertError) throw insertError;

//       setSuccess('Studio created successfully! It will be reviewed by our team.');
//       setTimeout(() => {
//         router.push('/owner/studios');
//       }, 2000);
      
//     } catch (err: any) {
//       console.error('Error creating studio:', err);
//       setError(err.message || 'Failed to create studio');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isFormComplete = () => {
//     return formData.name && formData.category && formData.description &&
//            formData.street_address && formData.city && formData.state &&
//            formData.hourly_rate > 0 && formData.images.length >= 1;
//   };

//   const totalPhotos = formData.imagePreviews.length;

//   return (
//     <div className="min-h-screen bg-[#f8f9fa]">
//       <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        
//         {/* Success Toast */}
//         {success && (
//           <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
//             <div className="bg-[#beff5f] border border-[#446900]/20 rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg">
//               <CheckCircleIcon className="w-5 h-5 text-[#111f00]" />
//               <span className="text-sm font-bold text-[#111f00]">{success}</span>
//             </div>
//           </div>
//         )}

//         {/* Error Toast */}
//         {error && (
//           <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
//             <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg">
//               <XMarkIcon className="w-5 h-5 text-red-500" />
//               <span className="text-sm font-bold text-red-600">{error}</span>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <div>
//             <Link 
//               href="/owner/studios"
//               className="flex items-center gap-2 text-[#424937] hover:text-[#446900] transition-colors font-bold text-sm mb-2"
//             >
//               <ArrowLeftIcon className="w-4 h-4" />
//               Back to My Studios
//             </Link>
//             <h1 className="text-3xl md:text-4xl font-extrabold text-[#191c1d] tracking-tight">List New Studio</h1>
//             <p className="text-[#424937] text-sm mt-1">Create a new creative space listing and reach professionals worldwide.</p>
//           </div>
//           <button
//             onClick={handleSubmit}
//             disabled={loading || !isFormComplete()}
//             className="flex items-center gap-2 px-6 py-3 bg-[#beff5f] text-[#111f00] rounded-xl font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap"
//           >
//             <CheckCircleIcon className="w-5 h-5" />
//             {loading ? 'Publishing...' : 'Publish Studio'}
//           </button>
//         </div>

//         {/* Section Navigation */}
//         <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
//           {sections.map((section) => (
//             <button
//               key={section.id}
//               onClick={() => setActiveSection(section.id)}
//               className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
//                 activeSection === section.id
//                   ? 'bg-[#beff5f] text-[#111f00]'
//                   : 'bg-white text-[#424937] hover:bg-[#edeeef] border border-[#c2c9b1]/20'
//               }`}
//             >
//               <MaterialIcon icon={section.icon} className="text-lg" />
//               {section.label}
//             </button>
//           ))}
//         </div>

//         {/* Form Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-8">
            
//             {/* Basic Info Section */}
//             {activeSection === 'basic' && (
//               <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//                 <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
//                   <MaterialIcon icon="info" className="text-[#446900]" />
//                   Basic Information
//                 </h3>
//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-bold text-[#191c1d] mb-2">Studio Name *</label>
//                     <input
//                       type="text"
//                       value={formData.name}
//                       onChange={(e) => handleInputChange('name', e.target.value)}
//                       placeholder="e.g., The Obsidian Suite"
//                       className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-[#191c1d] mb-2">Category *</label>
//                     <select
//                       value={formData.category}
//                       onChange={(e) => handleInputChange('category', e.target.value)}
//                       className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all"
//                     >
//                       <option value="">Select a category</option>
//                       {categories.map((cat) => (
//                         <option key={cat} value={cat}>{cat}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-[#191c1d] mb-2">Capacity (Persons)</label>
//                     <div className="flex items-center gap-4">
//                       <button
//                         type="button"
//                         onClick={() => handleInputChange('capacity', Math.max(1, formData.capacity - 1))}
//                         className="w-12 h-12 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-xl font-bold text-[#191c1d] transition-all"
//                       >−</button>
//                       <span className="text-3xl font-extrabold w-16 text-center text-[#191c1d]">{formData.capacity}</span>
//                       <button
//                         type="button"
//                         onClick={() => handleInputChange('capacity', formData.capacity + 1)}
//                         className="w-12 h-12 rounded-xl bg-[#f3f4f5] hover:bg-[#e7e8e9] text-xl font-bold text-[#191c1d] transition-all"
//                       >+</button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-bold text-[#191c1d] mb-2">Description *</label>
//                     <textarea
//                       value={formData.description}
//                       onChange={(e) => handleInputChange('description', e.target.value)}
//                       rows={5}
//                       placeholder="Describe the lighting, acoustics, and aesthetic energy of the room..."
//                       className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all resize-none placeholder:text-[#737a65]"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Location Section */}
//             {activeSection === 'location' && (
//               <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//                 <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
//                   <MapPinIcon className="w-6 h-6 text-[#446900]" />
//                   Location
//                 </h3>
//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-bold text-[#191c1d] mb-2">Street Address *</label>
//                     <input
//                       type="text"
//                       value={formData.street_address}
//                       onChange={(e) => handleInputChange('street_address', e.target.value)}
//                       placeholder="1242 Arts District Blvd"
//                       className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-bold text-[#191c1d] mb-2">City *</label>
//                       <input
//                         type="text"
//                         value={formData.city}
//                         onChange={(e) => handleInputChange('city', e.target.value)}
//                         placeholder="Los Angeles"
//                         className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-bold text-[#191c1d] mb-2">State *</label>
//                       <input
//                         type="text"
//                         value={formData.state}
//                         onChange={(e) => handleInputChange('state', e.target.value)}
//                         placeholder="California"
//                         className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-bold text-[#191c1d] mb-2">Postal Code</label>
//                       <input
//                         type="text"
//                         value={formData.postal_code}
//                         onChange={(e) => handleInputChange('postal_code', e.target.value)}
//                         placeholder="90012"
//                         className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-bold text-[#191c1d] mb-2">Country</label>
//                       <input
//                         type="text"
//                         value={formData.country}
//                         onChange={(e) => handleInputChange('country', e.target.value)}
//                         placeholder="United States"
//                         className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Amenities Section */}
//             {activeSection === 'amenities' && (
//               <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//                 <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
//                   <MaterialIcon icon="checklist" className="text-[#446900]" />
//                   Amenities & Features
//                 </h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {amenitiesList.map((amenity) => (
//                     <label
//                       key={amenity}
//                       className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${
//                         formData.amenities.includes(amenity)
//                           ? 'bg-[#beff5f]/20 border-[#beff5f] text-[#111f00]'
//                           : 'bg-[#f3f4f5] border-transparent text-[#424937] hover:bg-[#e7e8e9]'
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={formData.amenities.includes(amenity)}
//                         onChange={() => handleAmenityToggle(amenity)}
//                         className="sr-only"
//                       />
//                       <span className={`text-lg ${formData.amenities.includes(amenity) ? 'text-[#446900]' : 'text-[#737a65]'}`}>
//                         {formData.amenities.includes(amenity) ? '✓' : '○'}
//                       </span>
//                       <span className="text-sm font-medium">{amenity}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Availability Section */}
//             {activeSection === 'availability' && (
//               <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//                 <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
//                   <ClockIcon className="w-6 h-6 text-[#446900]" />
//                   Availability
//                 </h3>
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-bold text-[#191c1d] mb-3">Open Days</label>
//                     <div className="grid grid-cols-4 gap-3">
//                       {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
//                         <label
//                           key={day}
//                           className={`flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all border-2 ${
//                             (formData.availability as any)[day]
//                               ? 'bg-[#beff5f]/20 border-[#beff5f] text-[#111f00] font-bold'
//                               : 'bg-[#f3f4f5] border-transparent text-[#424937] hover:bg-[#e7e8e9]'
//                           }`}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={(formData.availability as any)[day]}
//                             onChange={(e) => handleInputChange('availability', {
//                               ...formData.availability,
//                               [day]: e.target.checked,
//                             })}
//                             className="sr-only"
//                           />
//                           <span className="text-sm capitalize">{day.slice(0, 3)}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-bold text-[#191c1d] mb-2">Start Time</label>
//                       <input
//                         type="time"
//                         value={formData.availability.startTime}
//                         onChange={(e) => handleInputChange('availability', {
//                           ...formData.availability,
//                           startTime: e.target.value,
//                         })}
//                         className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-bold text-[#191c1d] mb-2">End Time</label>
//                       <input
//                         type="time"
//                         value={formData.availability.endTime}
//                         onChange={(e) => handleInputChange('availability', {
//                           ...formData.availability,
//                           endTime: e.target.value,
//                         })}
//                         className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Pricing Section */}
//             {activeSection === 'pricing' && (
//               <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//                 <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
//                   <CurrencyDollarIcon className="w-6 h-6 text-[#446900]" />
//                   Pricing
//                 </h3>
//                 <div className="space-y-5">
//                   <div>
//                     <label className="block text-sm font-bold text-[#191c1d] mb-2">Hourly Rate ($) *</label>
//                     <input
//                       type="number"
//                       value={formData.hourly_rate}
//                       onChange={(e) => handleInputChange('hourly_rate', parseInt(e.target.value) || 0)}
//                       placeholder="180"
//                       className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-bold text-[#191c1d] mb-2">Daily Rate ($)</label>
//                       <input
//                         type="number"
//                         value={formData.daily_rate}
//                         onChange={(e) => handleInputChange('daily_rate', parseInt(e.target.value) || 0)}
//                         placeholder="1200"
//                         className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-bold text-[#191c1d] mb-2">Weekly Rate ($)</label>
//                       <input
//                         type="number"
//                         value={formData.weekly_rate}
//                         onChange={(e) => handleInputChange('weekly_rate', parseInt(e.target.value) || 0)}
//                         placeholder="7000"
//                         className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold text-[#191c1d] mb-2">Cleaning Fee ($)</label>
//                     <input
//                       type="number"
//                       value={formData.cleaning_fee}
//                       onChange={(e) => handleInputChange('cleaning_fee', parseInt(e.target.value) || 0)}
//                       placeholder="50"
//                       className="w-full bg-[#f3f4f5] border border-[#c2c9b1]/20 rounded-xl px-4 py-3 text-[#191c1d] focus:ring-2 focus:ring-[#beff5f] focus:border-transparent outline-none transition-all placeholder:text-[#737a65]"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Photos Section */}
//             {activeSection === 'photos' && (
//               <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#c2c9b1]/20">
//                 <h3 className="text-xl font-extrabold text-[#191c1d] mb-6 flex items-center gap-2">
//                   <PhotoIcon className="w-6 h-6 text-[#446900]" />
//                   Studio Photos *
//                 </h3>
                
//                 {/* Image Previews */}
//                 {formData.imagePreviews.length > 0 && (
//                   <div className="mb-6">
//                     <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
//                       {formData.imagePreviews.map((preview, index) => (
//                         <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-[#f3f4f5] group">
//                           <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index)}
//                             className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                           >
//                             <XMarkIcon className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Upload Button */}
//                 {formData.images.length < 10 && (
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="w-full aspect-[3/1] rounded-xl bg-[#f3f4f5] border-2 border-dashed border-[#c2c9b1] hover:border-[#446900] transition-colors flex flex-col items-center justify-center gap-3"
//                   >
//                     <PhotoIcon className="w-10 h-10 text-[#737a65]" />
//                     <span className="text-sm font-bold text-[#424937]">Click to Add Photos</span>
//                     <span className="text-xs text-[#737a65]">
//                       {formData.images.length === 0 ? 'At least 1 photo required' : `${10 - formData.images.length} slots remaining`}
//                     </span>
//                   </button>
//                 )}
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//                 <p className="text-xs text-[#737a65] mt-3">
//                   Upload up to 10 high-quality photos. The first photo will be the cover image. Square (1:1) ratio recommended.
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Sidebar - Preview & Info */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#c2c9b1]/20">
//               <h3 className="text-lg font-extrabold text-[#191c1d] mb-4">Listing Preview</h3>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-[#737a65]">Name</span>
//                   <span className="font-medium text-[#191c1d]">{formData.name || '—'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#737a65]">Category</span>
//                   <span className="font-medium text-[#191c1d]">{formData.category || '—'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#737a65]">Capacity</span>
//                   <span className="font-medium text-[#191c1d]">{formData.capacity} people</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#737a65]">Rate</span>
//                   <span className="font-bold text-[#446900]">{formData.hourly_rate > 0 ? `$${formData.hourly_rate}/hr` : '—'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#737a65]">Location</span>
//                   <span className="font-medium text-[#191c1d]">
//                     {formData.city ? `${formData.city}, ${formData.state}` : '—'}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#737a65]">Photos</span>
//                   <span className="font-medium text-[#191c1d]">{totalPhotos}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-[#737a65]">Amenities</span>
//                   <span className="font-medium text-[#191c1d]">{formData.amenities.length}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-[#e4d7fd]/30 border border-[#e4d7fd] rounded-2xl p-6">
//               <h3 className="text-sm font-extrabold text-[#665c7c] mb-2">Review Process</h3>
//               <p className="text-sm text-[#665c7c]/80">
//                 Your studio will be reviewed by our team before appearing in search results. This usually takes 24-48 hours.
//               </p>
//             </div>

//             <div className="bg-[#beff5f]/20 border border-[#beff5f]/30 rounded-2xl p-6">
//               <h3 className="text-sm font-extrabold text-[#111f00] mb-2">Quick Tips</h3>
//               <ul className="text-sm text-[#324f00] space-y-2">
//                 <li>• Use high-quality, well-lit photos</li>
//                 <li>• Write a compelling description</li>
//                 <li>• Set competitive pricing</li>
//                 <li>• List all amenities accurately</li>
//               </ul>
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={loading || !isFormComplete()}
//               className="w-full py-4 bg-[#beff5f] text-[#111f00] rounded-2xl font-extrabold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//             >
//               {loading ? 'Publishing...' : 'Publish Studio'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useState, useRef } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import {
//   ArrowLeftIcon,
//   ArrowRightIcon,
//   PlusIcon,
//   XMarkIcon,
//   PhotoIcon,
//   MapPinIcon,
// } from '@heroicons/react/24/outline';

// interface StudioFormData {
//   name: string;
//   category: string;
//   capacity: number;
//   description: string;
//   streetAddress: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   images: File[];
//   imagePreviews: string[];
//   amenities: string[];
//   hourlyRate: number;
//   dailyRate: number;
//   weeklyRate: number;
//   cleaningFee: number;
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
// }

// export default function ListNewStudio() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [formData, setFormData] = useState<StudioFormData>({
//     name: '',
//     category: '',
//     capacity: 12,
//     description: '',
//     streetAddress: '',
//     city: '',
//     state: '',
//     postalCode: '',
//     country: 'United States',
//     images: [],
//     imagePreviews: [],
//     amenities: [],
//     hourlyRate: 0,
//     dailyRate: 0,
//     weeklyRate: 0,
//     cleaningFee: 0,
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
    
//     // Limit to 10 images max
//     if (newImages.length > 10) {
//       setError('Maximum 10 images allowed');
//       return;
//     }

//     // Create preview URLs
//     const newPreviews = files.map(file => URL.createObjectURL(file));
    
//     setFormData(prev => ({
//       ...prev,
//       images: newImages,
//       imagePreviews: [...prev.imagePreviews, ...newPreviews],
//     }));
//     setError('');
//   };

//   const removeImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//       imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
//     }));
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const submitData = new FormData();
//       submitData.append('name', formData.name);
//       submitData.append('category', formData.category);
//       submitData.append('capacity', formData.capacity.toString());
//       submitData.append('description', formData.description);
//       submitData.append('streetAddress', formData.streetAddress);
//       submitData.append('city', formData.city);
//       submitData.append('state', formData.state);
//       submitData.append('postalCode', formData.postalCode);
//       submitData.append('country', formData.country);
//       submitData.append('hourlyRate', formData.hourlyRate.toString());
//       submitData.append('dailyRate', formData.dailyRate.toString());
//       submitData.append('weeklyRate', formData.weeklyRate.toString());
//       submitData.append('cleaningFee', formData.cleaningFee.toString());
//       submitData.append('amenities', JSON.stringify(formData.amenities));
//       submitData.append('availability', JSON.stringify(formData.availability));
      
//       // Append images
//       formData.images.forEach((image, index) => {
//         submitData.append(`image_${index}`, image);
//       });

//       const response = await fetch('/api/studios', {
//         method: 'POST',
//         body: submitData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to create studio');
//       }

//       setSuccess(data.message || 'Studio created successfully!');
//       setTimeout(() => {
//         router.push('/owner/studios');
//       }, 2000);
      
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNext = () => {
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } else {
//       handleSubmit();
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } else {
//       router.push('/owner/studios');
//     }
//   };

//   const isStepValid = () => {
//     if (currentStep === 1) {
//       return formData.name && formData.category && formData.description;
//     }
//     if (currentStep === 2) {
//       return formData.streetAddress && formData.city && formData.state;
//     }
//     if (currentStep === 3) {
//       return formData.hourlyRate > 0 && formData.images.length >= 1;
//     }
//     return true;
//   };

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
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
//             <PlusIcon className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-black tracking-tight">Create a New Digital Atelier</h1>
//             <p className="text-slate-400 text-sm mt-1">
//               List your creative space and connect with visionary artists worldwide.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Progress Steps */}
//       <div className="flex items-center gap-2 mb-10">
//         {[1, 2, 3].map((step) => (
//           <div key={step} className="flex-1">
//             <div
//               className={`h-1 rounded-full transition-all ${
//                 step <= currentStep ? 'bg-primary' : 'bg-white/10'
//               }`}
//             />
//             <p
//               className={`text-xs mt-2 text-center ${
//                 step === currentStep ? 'text-primary font-medium' : 'text-slate-500'
//               }`}
//             >
//               {step === 1 && 'Space Identity'}
//               {step === 2 && 'Location & Access'}
//               {step === 3 && 'Media & Pricing'}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Form Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Form */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Step 1: Space Identity */}
//           {currentStep === 1 && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold mb-2">STUDIO NAME *</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                   placeholder="e.g., The Obsidian Suite"
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
//                 <label className="block text-sm font-bold mb-2">MAX CAPACITY</label>
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
//                 <label className="block text-sm font-bold mb-2">DESCRIPTION *</label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => handleInputChange('description', e.target.value)}
//                   rows={5}
//                   placeholder="Describe the lighting, acoustics, and aesthetic energy of the room..."
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Step 2: Location */}
//           {currentStep === 2 && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold mb-2">STREET ADDRESS *</label>
//                 <input
//                   type="text"
//                   value={formData.streetAddress}
//                   onChange={(e) => handleInputChange('streetAddress', e.target.value)}
//                   placeholder="1242 Arts District Blvd"
//                   className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-bold mb-2">CITY *</label>
//                   <input
//                     type="text"
//                     value={formData.city}
//                     onChange={(e) => handleInputChange('city', e.target.value)}
//                     placeholder="Los Angeles"
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">STATE *</label>
//                   <input
//                     type="text"
//                     value={formData.state}
//                     onChange={(e) => handleInputChange('state', e.target.value)}
//                     placeholder="California"
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-bold mb-2">POSTAL CODE</label>
//                   <input
//                     type="text"
//                     value={formData.postalCode}
//                     onChange={(e) => handleInputChange('postalCode', e.target.value)}
//                     placeholder="90012"
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">COUNTRY</label>
//                   <input
//                     type="text"
//                     value={formData.country}
//                     onChange={(e) => handleInputChange('country', e.target.value)}
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               {/* Amenities */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Amenities</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {amenitiesList.map((amenity) => (
//                     <label key={amenity} className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.amenities.includes(amenity)}
//                         onChange={() => handleAmenityToggle(amenity)}
//                         className="w-4 h-4 text-primary rounded border-white/10 bg-white/5"
//                       />
//                       <span className="text-sm">{amenity}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Availability */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Availability</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
//                   {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
//                     <label key={day} className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.availability[day as keyof typeof formData.availability] as boolean}
//                         onChange={(e) => handleInputChange('availability', {
//                           ...formData.availability,
//                           [day]: e.target.checked,
//                         })}
//                         className="w-4 h-4 text-primary rounded border-white/10 bg-white/5"
//                       />
//                       <span className="text-sm capitalize">{day.slice(0, 3)}</span>
//                     </label>
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-bold mb-2">START TIME</label>
//                     <input
//                       type="time"
//                       value={formData.availability.startTime}
//                       onChange={(e) => handleInputChange('availability', {
//                         ...formData.availability,
//                         startTime: e.target.value,
//                       })}
//                       className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold mb-2">END TIME</label>
//                     <input
//                       type="time"
//                       value={formData.availability.endTime}
//                       onChange={(e) => handleInputChange('availability', {
//                         ...formData.availability,
//                         endTime: e.target.value,
//                       })}
//                       className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Media & Pricing */}
//           {currentStep === 3 && (
//             <div className="space-y-8">
//               {/* Image Upload */}
//               <div>
//                 <label className="block text-sm font-bold mb-4">STUDIO PHOTOS * (Minimum 1)</label>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {formData.imagePreviews.map((preview, index) => (
//                     <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10">
//                       <img src={preview} alt={`Studio preview ${index + 1}`} className="w-full h-full object-cover" />
//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
//                       >
//                         <XMarkIcon className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                   {formData.images.length < 10 && (
//                     <button
//                       type="button"
//                       onClick={() => fileInputRef.current?.click()}
//                       className="aspect-square rounded-lg bg-white/5 border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2"
//                     >
//                       <PhotoIcon className="w-8 h-8 text-slate-400" />
//                       <span className="text-xs text-slate-400">Upload Photo</span>
//                     </button>
//                   )}
//                 </div>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//                 <p className="text-xs text-slate-500 mt-3">
//                   Upload up to 10 photos. First photo will be the cover image.
//                 </p>
//               </div>

//               {/* Pricing */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Pricing</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-bold mb-2">HOURLY RATE ($) *</label>
//                     <input
//                       type="number"
//                       value={formData.hourlyRate}
//                       onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value) || 0)}
//                       placeholder="180"
//                       className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-bold mb-2">DAILY RATE</label>
//                       <input
//                         type="number"
//                         value={formData.dailyRate}
//                         onChange={(e) => handleInputChange('dailyRate', parseInt(e.target.value) || 0)}
//                         placeholder="1200"
//                         className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-bold mb-2">WEEKLY RATE</label>
//                       <input
//                         type="number"
//                         value={formData.weeklyRate}
//                         onChange={(e) => handleInputChange('weeklyRate', parseInt(e.target.value) || 0)}
//                         placeholder="7000"
//                         className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold mb-2">CLEANING FEE</label>
//                     <input
//                       type="number"
//                       value={formData.cleaningFee}
//                       onChange={(e) => handleInputChange('cleaningFee', parseInt(e.target.value) || 0)}
//                       placeholder="50"
//                       className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sidebar Guidance */}
//         <div className="space-y-6">
//           {currentStep === 1 && (
//             <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
//               <h3 className="text-sm font-bold text-primary mb-3">Need Guidance?</h3>
//               <p className="text-sm text-slate-400">
//                 Your space description should focus on the architectural soul and technical capabilities. 
//                 High-end clients value clarity and aesthetic tone.
//               </p>
//             </div>
//           )}

//           {currentStep === 2 && (
//             <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
//               <h3 className="text-sm font-bold text-primary mb-3">Map Location</h3>
//               <div className="aspect-video bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
//                 <MapPinIcon className="w-8 h-8 text-slate-600" />
//               </div>
//               <p className="text-xs text-slate-500">
//                 Accurate location helps clients find your studio easily.
//               </p>
//             </div>
//           )}

//           {currentStep === 3 && (
//             <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
//               <h3 className="text-sm font-bold text-primary mb-3">Pricing Strategy</h3>
//               <p className="text-sm text-slate-400 mb-4">
//                 Set competitive rates based on your location, amenities, and studio quality.
//               </p>
//               <div className="space-y-2 text-xs">
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Studio Average in LA:</span>
//                   <span className="text-white">$175/hr</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Premium Studios:</span>
//                   <span className="text-white">$225+/hr</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
//         <button
//           onClick={handleBack}
//           className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
//         >
//           <ArrowLeftIcon className="w-4 h-4" />
//           {currentStep === 1 ? 'Cancel' : 'Back'}
//         </button>
//         <button
//           onClick={handleNext}
//           disabled={!isStepValid() || loading}
//           className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? 'Creating...' : currentStep === 3 ? 'Publish Studio' : 'Continue'}
//           <ArrowRightIcon className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// }





// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   ArrowLeftIcon,
//   ArrowRightIcon,
//   ScaleIcon,
//   PhotoIcon,
//   MapPinIcon,
//   UserGroupIcon,
//   DocumentTextIcon,
//   HomeIcon,
//   CheckCircleIcon,
//   XMarkIcon,
//   PlusIcon,
// } from '@heroicons/react/24/outline';

// // Types
// interface StudioFormData {
//   // Space Identity
//   name: string;
//   category: string;
//   capacity: number;
//   description: string;
  
//   // Location & Access
//   streetAddress: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
  
//   // Media (for step 2)
//   images: File[];
//   coverImage: string | null;
  
//   // Amenities (for step 2)
//   amenities: string[];
  
//   // Pricing (for step 3)
//   hourlyRate: number;
//   dailyRate: number;
//   weeklyRate: number;
//   cleaningFee: number;
  
//   // Availability (for step 3)
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
// }

// export default function ListNewStudio() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState<StudioFormData>({
//     name: '',
//     category: '',
//     capacity: 25,
//     description: '',
//     streetAddress: '',
//     city: '',
//     state: '',
//     postalCode: '',
//     country: 'United States',
//     images: [],
//     coverImage: null,
//     amenities: [],
//     hourlyRate: 0,
//     dailyRate: 0,
//     weeklyRate: 0,
//     cleaningFee: 0,
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
//   });
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

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

//   const neighborhoods = [
//     'Hollywood',
//     'East Hollywood',
//     'Silver Lake',
//     'Echo Park',
//     'West Hollywood',
//     'North Hollywood',
//     'South Los Angeles',
//     'Central Hollywood',
//     'Hollywood Hills',
//     'Downtown LA',
//   ];

//   const handleChange = (field: keyof StudioFormData, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   const handleAmenityToggle = (amenity: string) => {
//     setFormData(prev => ({
//       ...prev,
//       amenities: prev.amenities.includes(amenity)
//         ? prev.amenities.filter(a => a !== amenity)
//         : [...prev.amenities, amenity],
//     }));
//   };

//   const validateStep1 = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.name.trim()) newErrors.name = 'Studio name is required';
//     if (!formData.category) newErrors.category = 'Please select a category';
//     if (!formData.description.trim()) newErrors.description = 'Description is required';
//     if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
//     return newErrors;
//   };

//   const validateStep2 = () => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.state.trim()) newErrors.state = 'State is required';
//     if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
//     return newErrors;
//   };

//   const validateStep3 = () => {
//     const newErrors: Record<string, string> = {};
//     if (formData.hourlyRate <= 0) newErrors.hourlyRate = 'Hourly rate is required';
//     return newErrors;
//   };

//   const handleNext = () => {
//     let validationErrors = {};
//     if (currentStep === 1) validationErrors = validateStep1();
//     if (currentStep === 2) validationErrors = validateStep2();
//     if (currentStep === 3) validationErrors = validateStep3();

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } else {
//       // Submit form
//       console.log('Submitting studio:', formData);
//       setShowSuccess(true);
//       setTimeout(() => {
//         router.push('/owner/studios');
//       }, 2000);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } else {
//       router.push('/owner/studios');
//     }
//   };

//   const handleSaveProgress = () => {
//     localStorage.setItem('studio_draft', JSON.stringify(formData));
//     alert('Progress saved! You can continue later.');
//   };

//   return (
//     <div className="p-8 max-w-[1400px] mx-auto">
//       {/* Success Toast */}
//       {showSuccess && (
//         <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
//           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-6 py-4 flex items-center gap-3 backdrop-blur-lg">
//             <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
//             <span className="text-sm text-white">Studio created successfully! Redirecting...</span>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
//             <PlusIcon className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-black tracking-tight">Create a New Digital Atelier</h1>
//             <p className="text-slate-400 text-sm mt-1">
//               List your creative space and connect with visionary artists worldwide.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Progress Steps */}
//       <div className="flex items-center gap-2 mb-10">
//         {[1, 2, 3].map((step) => (
//           <div key={step} className="flex-1">
//             <div
//               className={`h-1 rounded-full transition-all ${
//                 step <= currentStep ? 'bg-primary' : 'bg-white/10'
//               }`}
//             />
//             <p
//               className={`text-xs mt-2 text-center ${
//                 step === currentStep ? 'text-primary font-medium' : 'text-slate-500'
//               }`}
//             >
//               {step === 1 && 'Space Identity'}
//               {step === 2 && 'Location & Access'}
//               {step === 3 && 'Pricing & Availability'}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Form Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Form */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Step 1: Space Identity */}
//           {currentStep === 1 && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold mb-2">STUDIO ROOM NAME</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => handleChange('name', e.target.value)}
//                   placeholder="e.g. The Obsidian Suite"
//                   className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
//                 />
//                 {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">PRIMARY CATEGORY</label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => handleChange('category', e.target.value)}
//                   className={`w-full bg-white/5 border ${errors.category ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//                 {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">MAX CAPACITY (PERSONS)</label>
//                 <div className="flex items-center gap-4">
//                   <button
//                     type="button"
//                     onClick={() => handleChange('capacity', Math.max(1, formData.capacity - 1))}
//                     className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
//                   >-</button>
//                   <span className="text-2xl font-bold w-16 text-center">{formData.capacity}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleChange('capacity', formData.capacity + 1)}
//                     className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
//                   >+</button>
//                 </div>
//                 {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">ARCHITECTURAL DESCRIPTION</label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => handleChange('description', e.target.value)}
//                   rows={5}
//                   placeholder="Describe the lighting, acoustics, and aesthetic energy of the room..."
//                   className={`w-full bg-white/5 border ${errors.description ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none`}
//                 />
//                 {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//               </div>
//             </div>
//           )}

//           {/* Step 2: Location & Access */}
//           {currentStep === 2 && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold mb-2">STREET ADDRESS</label>
//                 <input
//                   type="text"
//                   value={formData.streetAddress}
//                   onChange={(e) => handleChange('streetAddress', e.target.value)}
//                   placeholder="1242 Arts District Blvd"
//                   className={`w-full bg-white/5 border ${errors.streetAddress ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
//                 />
//                 {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-bold mb-2">CITY</label>
//                   <input
//                     type="text"
//                     value={formData.city}
//                     onChange={(e) => handleChange('city', e.target.value)}
//                     placeholder="Los Angeles"
//                     className={`w-full bg-white/5 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
//                   />
//                   {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">STATE / REGION</label>
//                   <input
//                     type="text"
//                     value={formData.state}
//                     onChange={(e) => handleChange('state', e.target.value)}
//                     placeholder="California"
//                     className={`w-full bg-white/5 border ${errors.state ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
//                   />
//                   {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-bold mb-2">POSTAL CODE</label>
//                   <input
//                     type="text"
//                     value={formData.postalCode}
//                     onChange={(e) => handleChange('postalCode', e.target.value)}
//                     placeholder="90012"
//                     className={`w-full bg-white/5 border ${errors.postalCode ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
//                   />
//                   {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">COUNTRY</label>
//                   <input
//                     type="text"
//                     value={formData.country}
//                     onChange={(e) => handleChange('country', e.target.value)}
//                     placeholder="United States"
//                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               {/* Neighborhood Map */}
//               <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
//                 <p className="text-xs text-slate-400 mb-3">NEARBY NEIGHBORHOODS</p>
//                 <div className="flex flex-wrap gap-2">
//                   {neighborhoods.map((hood) => (
//                     <span key={hood} className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-400">
//                       {hood}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Pricing & Availability */}
//           {currentStep === 3 && (
//             <div className="space-y-8">
//               {/* Pricing Section */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Pricing</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-bold mb-2">HOURLY RATE ($)</label>
//                     <input
//                       type="number"
//                       value={formData.hourlyRate}
//                       onChange={(e) => handleChange('hourlyRate', parseInt(e.target.value) || 0)}
//                       placeholder="180"
//                       className={`w-full bg-white/5 border ${errors.hourlyRate ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
//                     />
//                     {errors.hourlyRate && <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>}
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-bold mb-2">DAILY RATE ($)</label>
//                       <input
//                         type="number"
//                         value={formData.dailyRate}
//                         onChange={(e) => handleChange('dailyRate', parseInt(e.target.value) || 0)}
//                         placeholder="1200"
//                         className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-bold mb-2">WEEKLY RATE ($)</label>
//                       <input
//                         type="number"
//                         value={formData.weeklyRate}
//                         onChange={(e) => handleChange('weeklyRate', parseInt(e.target.value) || 0)}
//                         placeholder="7000"
//                         className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold mb-2">CLEANING FEE ($)</label>
//                     <input
//                       type="number"
//                       value={formData.cleaningFee}
//                       onChange={(e) => handleChange('cleaningFee', parseInt(e.target.value) || 0)}
//                       placeholder="50"
//                       className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Availability Section */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Availability</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
//                   {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
//                     <label key={day} className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.availability[day as keyof typeof formData.availability] as boolean}
//                         onChange={(e) => handleChange('availability', {
//                           ...formData.availability,
//                           [day]: e.target.checked,
//                         })}
//                         className="w-4 h-4 text-primary rounded border-white/10 bg-white/5"
//                       />
//                       <span className="text-sm capitalize">{day.slice(0, 3)}</span>
//                     </label>
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-bold mb-2">START TIME</label>
//                     <input
//                       type="time"
//                       value={formData.availability.startTime}
//                       onChange={(e) => handleChange('availability', {
//                         ...formData.availability,
//                         startTime: e.target.value,
//                       })}
//                       className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-bold mb-2">END TIME</label>
//                     <input
//                       type="time"
//                       value={formData.availability.endTime}
//                       onChange={(e) => handleChange('availability', {
//                         ...formData.availability,
//                         endTime: e.target.value,
//                       })}
//                       className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Amenities Section */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Amenities</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {amenitiesList.map((amenity) => (
//                     <label key={amenity} className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.amenities.includes(amenity)}
//                         onChange={() => handleAmenityToggle(amenity)}
//                         className="w-4 h-4 text-primary rounded border-white/10 bg-white/5"
//                       />
//                       <span className="text-sm">{amenity}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sidebar - Guidance */}
//         <div className="space-y-6">
//           {currentStep === 1 && (
//             <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
//               <h3 className="text-sm font-bold text-primary mb-3">Need Guidance?</h3>
//               <p className="text-sm text-slate-400">
//                 Your space description should focus on the architectural soul and technical capabilities. 
//                 High-end clients value clarity and aesthetic tone.
//               </p>
//             </div>
//           )}

//           {currentStep === 2 && (
//             <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
//               <h3 className="text-sm font-bold text-primary mb-3">Map Location</h3>
//               <div className="aspect-video bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
//                 <MapPinIcon className="w-8 h-8 text-slate-600" />
//               </div>
//               <p className="text-xs text-slate-500">
//                 Accurate location helps clients find your studio easily.
//               </p>
//             </div>
//           )}

//           {currentStep === 3 && (
//             <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
//               <h3 className="text-sm font-bold text-primary mb-3">Pricing Strategy</h3>
//               <p className="text-sm text-slate-400 mb-4">
//                 Set competitive rates based on your location, amenities, and studio quality.
//               </p>
//               <div className="space-y-2 text-xs">
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Studio Average in LA:</span>
//                   <span className="text-white">$175/hr</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-500">Premium Studios:</span>
//                   <span className="text-white">$225+/hr</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Save Progress */}
//           <button
//             onClick={handleSaveProgress}
//             className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
//           >
//             <ScaleIcon className="w-4 h-4" />
//             Save Progress
//           </button>
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
//         <button
//           onClick={handleBack}
//           className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
//         >
//           <ArrowLeftIcon className="w-4 h-4" />
//           {currentStep === 1 ? 'Back to Dashboard' : 'Back'}
//         </button>
//         <button
//           onClick={handleNext}
//           className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold transition-all"
//         >
//           {currentStep === 3 ? 'Publish Studio' : 'Continue'}
//           <ArrowRightIcon className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// }