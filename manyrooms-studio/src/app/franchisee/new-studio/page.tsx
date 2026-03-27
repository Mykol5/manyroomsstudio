'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  InformationCircleIcon,
  MapPinIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

// Material Icon component for icons not in Heroicons
const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

export default function NewStudioPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    studioName: '',
    category: '',
    description: '',
    
    // Location Details
    address: '',
    city: '',
    postalCode: '',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Photography Studio',
    'Podcast Suite',
    'Creative Workspace',
    'Music Production Lab',
    'Video Production Studio',
    'Art Gallery',
    'Event Space',
    'Other',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit form
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        router.push('/franchisee/studios');
      }, 1500);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/franchisee/studios');
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Your progress will be lost.')) {
      router.push('/franchisee/studios');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <main className="pb-20 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-12 pt-8 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 1 ? 'bg-primary text-on-primary' : 'border border-primary text-primary opacity-40'
              }`}>
                01
              </div>
              <span className={`text-sm font-semibold transition-all ${
                currentStep >= 1 ? 'text-primary' : 'text-primary opacity-40'
              }`}>
                Core Essentials
              </span>
            </div>
            <div className="h-px w-12 bg-outline-variant/30"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 2 ? 'bg-primary text-on-primary' : 'border border-primary text-primary opacity-40'
              }`}>
                02
              </div>
              <span className={`text-sm font-semibold transition-all ${
                currentStep >= 2 ? 'text-primary' : 'text-primary opacity-40'
              }`}>
                Spatial Identity
              </span>
            </div>
            <div className="h-px w-12 bg-outline-variant/30"></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 3 ? 'bg-primary text-on-primary' : 'border border-primary text-primary opacity-40'
              }`}>
                03
              </div>
              <span className={`text-sm font-semibold transition-all ${
                currentStep >= 3 ? 'text-primary' : 'text-primary opacity-40'
              }`}>
                Final Review
              </span>
            </div>
          </div>

          {/* Page Header */}
          <header className="mb-16 max-w-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-primary mb-4">Add New Studio</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Expand your regional network by onboarding a new production space. Ensure all specifications 
              are accurate to maintain the ManyRooms professional standard.
            </p>
          </header>

          {/* Cancel Button - Floating */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleCancel}
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
              Cancel Setup
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Input Section */}
            <div className="lg:col-span-7 space-y-12">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <InformationCircleIcon className="w-5 h-5 text-primary" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Basic Information
                    </h2>
                  </div>
                  <div className="space-y-10">
                    {/* Studio Name */}
                    <div className="group">
                      <label className="block text-xs font-semibold text-primary/60 mb-1 transition-all group-focus-within:text-primary">
                        STUDIO NAME
                      </label>
                      <input
                        type="text"
                        value={formData.studioName}
                        onChange={(e) => handleInputChange('studioName', e.target.value)}
                        placeholder="e.g. The Zenith Loft"
                        className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-3 text-xl font-medium transition-all placeholder:text-outline-variant/50 outline-none"
                      />
                    </div>

                    {/* Category Dropdown */}
                    <div className="group">
                      <label className="block text-xs font-semibold text-primary/60 mb-1 transition-all group-focus-within:text-primary">
                        CATEGORY
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-3 text-lg font-medium transition-all appearance-none outline-none"
                      >
                        <option value="" disabled>Select a studio type</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="group">
                      <label className="block text-xs font-semibold text-primary/60 mb-1 transition-all group-focus-within:text-primary">
                        DESCRIPTION
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe the ambiance, unique features, and intended use..."
                        rows={3}
                        className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-3 text-lg font-medium transition-all placeholder:text-outline-variant/50 resize-none outline-none"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Step 2: Location Details */}
              {currentStep === 2 && (
                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-primary" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Location Details
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {/* Street Address */}
                    <div className="group">
                      <label className="block text-xs font-semibold text-primary/60 mb-1 transition-all group-focus-within:text-primary">
                        STREET ADDRESS
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Search address or enter manually"
                          className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-3 text-lg font-medium transition-all placeholder:text-outline-variant/50 outline-none"
                        />
                        <MagnifyingGlassIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="group">
                        <label className="block text-xs font-semibold text-primary/60 mb-1">
                          CITY
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-3 text-lg font-medium transition-all outline-none"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs font-semibold text-primary/60 mb-1">
                          POSTAL CODE
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-3 text-lg font-medium transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Step 3: Final Review */}
              {currentStep === 3 && (
                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <InformationCircleIcon className="w-5 h-5 text-primary" />
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      Review Your Studio Details
                    </h2>
                  </div>
                  <div className="space-y-6 bg-surface-container-lowest rounded-lg p-6 border border-outline-variant/10">
                    <div className="flex justify-between py-3 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant">Studio Name</span>
                      <span className="text-sm font-medium">{formData.studioName || '—'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant">Category</span>
                      <span className="text-sm font-medium">{formData.category || '—'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant">Address</span>
                      <span className="text-sm font-medium text-right">{formData.address || '—'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-outline-variant/10">
                      <span className="text-sm text-on-surface-variant">City</span>
                      <span className="text-sm font-medium">{formData.city || '—'}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-sm text-on-surface-variant">Postal Code</span>
                      <span className="text-sm font-medium">{formData.postalCode || '—'}</span>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Visual Context / Map Side */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-8">
                {/* Map Container */}
                <div className="relative aspect-square w-full bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj5GsbC34_YkWOC0mUeoXbxT8Bq9mL3ORmcRNBmkN8NNQZFceeRbJu2kwSeEoMy8Exg1Z5w8_aG3Q1GtF3cFdHdFRuABPk0spV6z3Pfy9KoKJ01gB2LrU5d8rVxsoTzjzcnoNjzidDM-X9ma1z6a19htwmclI5bqfC6NRmEvBYjZjKb-H6kFHUUu7aO_cbHXGEWkM2awDIIFuVULvy6nSFLlQJeqBK8JtgfJ_N78lmTT0Uu6g5yN5ExWmeXz5qK3IGYrbvOXBJMMok"
                    alt="Map Preview"
                    className="w-full h-full object-cover opacity-80 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Map UI Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-30"></div>
                      <div className="w-6 h-6 bg-primary border-4 border-white rounded-full shadow-lg relative z-10"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded shadow-sm border border-outline-variant/20 max-w-[200px]">
                    <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">GEO-COORDINATES</p>
                    <p className="text-xs font-medium text-on-surface">
                      {formData.coordinates.lat}° N, {formData.coordinates.lng}° W
                    </p>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="p-8 bg-surface-container-lowest rounded-lg border border-outline-variant/10">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-6">
                    Listing Preview
                  </h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-surface-container-low rounded-md flex-shrink-0 flex items-center justify-center">
                      <PhotoIcon className="w-8 h-8 text-primary/20" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-surface-container-low rounded animate-pulse"></div>
                      <div className="h-3 w-48 bg-surface-container-low rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-surface-container-low rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-outline-variant/10 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
                    <span className="text-xs font-medium text-on-surface-variant">
                      Pending documentation upload
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <footer className="mt-20 pt-10 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-on-surface-variant" />
              <p className="text-sm text-on-surface-variant">Your progress is being saved automatically to drafts.</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={handlePrevious}
                className="flex-1 sm:flex-none px-8 py-3 text-sm font-bold text-primary border border-primary/10 hover:bg-surface-container-low transition-all"
              >
                {currentStep === 1 ? 'CANCEL' : 'PREVIOUS'}
              </button>
              <button
                onClick={handleNext}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-12 py-3 text-sm font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? 'SAVING...' : currentStep === 3 ? 'CREATE STUDIO' : 'NEXT STEP'}
                {!isSaving && <ArrowRightIcon className="w-4 h-4" />}
              </button>
            </div>
          </footer>
        </div>
      </main>

      {/* Global Canvas Texture */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-container-high/50"></div>
      </div>
    </div>
  );
}