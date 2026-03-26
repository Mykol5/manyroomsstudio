'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ScaleIcon,
  PhotoIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  HomeIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

// Types
interface StudioFormData {
  // Space Identity
  name: string;
  category: string;
  capacity: number;
  description: string;
  
  // Location & Access
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Media (for step 2)
  images: File[];
  coverImage: string | null;
  
  // Amenities (for step 2)
  amenities: string[];
  
  // Pricing (for step 3)
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  cleaningFee: number;
  
  // Availability (for step 3)
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
}

export default function ListNewStudio() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudioFormData>({
    name: '',
    category: '',
    capacity: 25,
    description: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    images: [],
    coverImage: null,
    amenities: [],
    hourlyRate: 0,
    dailyRate: 0,
    weeklyRate: 0,
    cleaningFee: 0,
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
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const neighborhoods = [
    'Hollywood',
    'East Hollywood',
    'Silver Lake',
    'Echo Park',
    'West Hollywood',
    'North Hollywood',
    'South Los Angeles',
    'Central Hollywood',
    'Hollywood Hills',
    'Downtown LA',
  ];

  const handleChange = (field: keyof StudioFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Studio name is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.hourlyRate <= 0) newErrors.hourlyRate = 'Hourly rate is required';
    return newErrors;
  };

  const handleNext = () => {
    let validationErrors = {};
    if (currentStep === 1) validationErrors = validateStep1();
    if (currentStep === 2) validationErrors = validateStep2();
    if (currentStep === 3) validationErrors = validateStep3();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit form
      console.log('Submitting studio:', formData);
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/owner/studios');
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/owner/studios');
    }
  };

  const handleSaveProgress = () => {
    localStorage.setItem('studio_draft', JSON.stringify(formData));
    alert('Progress saved! You can continue later.');
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-6 py-4 flex items-center gap-3 backdrop-blur-lg">
            <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-white">Studio created successfully! Redirecting...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <PlusIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Create a New Digital Atelier</h1>
            <p className="text-slate-400 text-sm mt-1">
              List your creative space and connect with visionary artists worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex-1">
            <div
              className={`h-1 rounded-full transition-all ${
                step <= currentStep ? 'bg-primary' : 'bg-white/10'
              }`}
            />
            <p
              className={`text-xs mt-2 text-center ${
                step === currentStep ? 'text-primary font-medium' : 'text-slate-500'
              }`}
            >
              {step === 1 && 'Space Identity'}
              {step === 2 && 'Location & Access'}
              {step === 3 && 'Pricing & Availability'}
            </p>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Space Identity */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">STUDIO ROOM NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. The Obsidian Suite"
                  className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">PRIMARY CATEGORY</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.category ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">MAX CAPACITY (PERSONS)</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange('capacity', Math.max(1, formData.capacity - 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >-</button>
                  <span className="text-2xl font-bold w-16 text-center">{formData.capacity}</span>
                  <button
                    type="button"
                    onClick={() => handleChange('capacity', formData.capacity + 1)}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >+</button>
                </div>
                {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">ARCHITECTURAL DESCRIPTION</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={5}
                  placeholder="Describe the lighting, acoustics, and aesthetic energy of the room..."
                  className={`w-full bg-white/5 border ${errors.description ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Location & Access */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">STREET ADDRESS</label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleChange('streetAddress', e.target.value)}
                  placeholder="1242 Arts District Blvd"
                  className={`w-full bg-white/5 border ${errors.streetAddress ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                />
                {errors.streetAddress && <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">CITY</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Los Angeles"
                    className={`w-full bg-white/5 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">STATE / REGION</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="California"
                    className={`w-full bg-white/5 border ${errors.state ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">POSTAL CODE</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    placeholder="90012"
                    className={`w-full bg-white/5 border ${errors.postalCode ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">COUNTRY</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="United States"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Neighborhood Map */}
              <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-xs text-slate-400 mb-3">NEARBY NEIGHBORHOODS</p>
                <div className="flex flex-wrap gap-2">
                  {neighborhoods.map((hood) => (
                    <span key={hood} className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-400">
                      {hood}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Availability */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* Pricing Section */}
              <div>
                <h3 className="text-lg font-bold mb-4">Pricing</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">HOURLY RATE ($)</label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => handleChange('hourlyRate', parseInt(e.target.value) || 0)}
                      placeholder="180"
                      className={`w-full bg-white/5 border ${errors.hourlyRate ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                    />
                    {errors.hourlyRate && <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">DAILY RATE ($)</label>
                      <input
                        type="number"
                        value={formData.dailyRate}
                        onChange={(e) => handleChange('dailyRate', parseInt(e.target.value) || 0)}
                        placeholder="1200"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">WEEKLY RATE ($)</label>
                      <input
                        type="number"
                        value={formData.weeklyRate}
                        onChange={(e) => handleChange('weeklyRate', parseInt(e.target.value) || 0)}
                        placeholder="7000"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">CLEANING FEE ($)</label>
                    <input
                      type="number"
                      value={formData.cleaningFee}
                      onChange={(e) => handleChange('cleaningFee', parseInt(e.target.value) || 0)}
                      placeholder="50"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Availability Section */}
              <div>
                <h3 className="text-lg font-bold mb-4">Availability</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <label key={day} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.availability[day as keyof typeof formData.availability] as boolean}
                        onChange={(e) => handleChange('availability', {
                          ...formData.availability,
                          [day]: e.target.checked,
                        })}
                        className="w-4 h-4 text-primary rounded border-white/10 bg-white/5"
                      />
                      <span className="text-sm capitalize">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">START TIME</label>
                    <input
                      type="time"
                      value={formData.availability.startTime}
                      onChange={(e) => handleChange('availability', {
                        ...formData.availability,
                        startTime: e.target.value,
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">END TIME</label>
                    <input
                      type="time"
                      value={formData.availability.endTime}
                      onChange={(e) => handleChange('availability', {
                        ...formData.availability,
                        endTime: e.target.value,
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div>
                <h3 className="text-lg font-bold mb-4">Amenities</h3>
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
          )}
        </div>

        {/* Sidebar - Guidance */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="text-sm font-bold text-primary mb-3">Need Guidance?</h3>
              <p className="text-sm text-slate-400">
                Your space description should focus on the architectural soul and technical capabilities. 
                High-end clients value clarity and aesthetic tone.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="text-sm font-bold text-primary mb-3">Map Location</h3>
              <div className="aspect-video bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
                <MapPinIcon className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-xs text-slate-500">
                Accurate location helps clients find your studio easily.
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <h3 className="text-sm font-bold text-primary mb-3">Pricing Strategy</h3>
              <p className="text-sm text-slate-400 mb-4">
                Set competitive rates based on your location, amenities, and studio quality.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Studio Average in LA:</span>
                  <span className="text-white">$175/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Premium Studios:</span>
                  <span className="text-white">$225+/hr</span>
                </div>
              </div>
            </div>
          )}

          {/* Save Progress */}
          <button
            onClick={handleSaveProgress}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
          >
            <ScaleIcon className="w-4 h-4" />
            Save Progress
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {currentStep === 1 ? 'Back to Dashboard' : 'Back'}
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold transition-all"
        >
          {currentStep === 3 ? 'Publish Studio' : 'Continue'}
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}