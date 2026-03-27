'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon,
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

export default function AdminAddStudio() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    studioName: '',
    ownerName: '',
    ownerEmail: '',
    category: '',
    description: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    hourlyRate: '',
    capacity: '',
    equipment: [] as string[],
    images: [] as File[],
    status: 'pending',
  });

  const categories = [
    'Photography Studio',
    'Recording Studio',
    'Video Production',
    'Rehearsal Space',
    'Art Studio',
    'Creative Workspace',
    'Podcast Suite',
    'Other',
  ];

  const equipmentList = [
    'Professional Lighting',
    'Backdrop System',
    'Audio Interface',
    'Studio Monitors',
    'Microphones',
    'Mixing Console',
    'Green Screen',
    'Camera Equipment',
    'Props & Sets',
    'Makeup Station',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEquipmentToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter(e => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const handleSubmit = () => {
    alert('Studio added successfully!');
    router.push('/admin/studios');
  };

  const steps = [
    { number: 1, label: 'Basic Info', icon: 'info' },
    { number: 2, label: 'Location', icon: 'location_on' },
    { number: 3, label: 'Pricing & Details', icon: 'attach_money' },
    { number: 4, label: 'Media & Review', icon: 'image' },
  ];

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.studioName && formData.ownerName && formData.ownerEmail && formData.category;
    }
    if (currentStep === 2) {
      return formData.streetAddress && formData.city && formData.state && formData.postalCode;
    }
    if (currentStep === 3) {
      return formData.hourlyRate && formData.capacity;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < 4 && isStepValid()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 4) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/admin/studios');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/studios" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-4 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Studios
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Add New Studio</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create a new studio listing on the ManyRooms platform.</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.number ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {currentStep > step.number ? (
                      <MaterialIcon icon="check" className="text-lg" />
                    ) : (
                      <MaterialIcon icon={step.icon} className="text-lg" />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${
                    currentStep >= step.number ? 'text-primary' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${currentStep > step.number ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Studio Name *</label>
                <input
                  type="text"
                  value={formData.studioName}
                  onChange={(e) => handleInputChange('studioName', e.target.value)}
                  placeholder="e.g., Sunset Sound Studio"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Owner Name *</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Owner Email *</label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                    placeholder="owner@example.com"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  placeholder="Describe the studio's features, ambiance, and unique qualities..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Street Address *</label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  placeholder="123 Main St"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Los Angeles"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">State / Region *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="California"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Postal Code *</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="90001"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Hourly Rate ($) *</label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    placeholder="120"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Max Capacity (Persons) *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="12"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-3">Equipment & Amenities</label>
                <div className="grid grid-cols-2 gap-3">
                  {equipmentList.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.equipment.includes(item)}
                        onChange={() => handleEquipmentToggle(item)}
                        className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:border-primary focus:ring-primary outline-none"
                >
                  <option value="pending">Pending Review</option>
                  <option value="active">Active (Immediately Live)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Media & Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Studio Photos</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                  <PhotoIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-500 mb-2">Drag and drop photos here, or click to select</p>
                  <p className="text-xs text-slate-400">Upload up to 10 photos (JPG, PNG, WEBP)</p>
                  <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Select Images
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <h3 className="font-bold mb-4">Review Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Studio Name:</span>
                    <span className="font-medium">{formData.studioName || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-medium">{formData.category || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium">{formData.city}, {formData.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hourly Rate:</span>
                    <span className="font-medium">${formData.hourlyRate || '0'}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capacity:</span>
                    <span className="font-medium">{formData.capacity || '0'} persons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className={`font-medium ${formData.status === 'active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {formData.status === 'active' ? 'Active' : 'Pending Review'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 4 ? 'Create Studio' : 'Continue'}
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}