'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  InformationCircleIcon,
  MapPinIcon,
  UserCircleIcon,
  HeartIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

// Material Icon component for icons not in Heroicons
const MaterialIcon = ({ icon, className = '', fill = false }: { icon: string; className?: string; fill?: boolean }) => (
  <span 
    className={`material-symbols-outlined ${className}`} 
    style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {icon}
  </span>
);

// Types
interface Studio {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  capacity: number;
  features: string[];
  image: string;
  location: string;
  rating: number;
  selected?: boolean;
}

interface TimeSlot {
  id: string;
  time: string;
  duration: string;
  available: boolean;
  selected?: boolean;
}

export default function NewBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [creativeRole, setCreativeRole] = useState('');
  const [brief, setBrief] = useState('');
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);

  // Studio data
  const studios: Studio[] = [
    {
      id: '1',
      name: 'The Zenith Loft',
      description: 'An expansive, sun-drenched space ideal for high-fashion editorial, multi-set productions, and minimalist workshops.',
      pricePerHour: 150,
      capacity: 12,
      features: ['Daylight', 'High Ceilings', 'Cyclorama Wall'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOhR5h0jvFDykI0vXb9vgOEg4aIjXR9WgsfCL07zmM-wwfDRwMEGNeid7zI-z3OY51vY0BLMK_g6znMVDCtViuEt3pC15vHPZknMudaXPebHXwB7jxy8OoCvXzEwU8CGAW5A1TNcF60aLRyt8jOymrRlDOFKhKI3UAPlw6E3cMkRV9oNHK1Q7Zb-GKYwA7zrDYyd_NLIjaJ9_73AGI6vzkV7zeTTUZp03pugebiZ1JkD-_AAfI4EL90rP4pebOwD07ZA6Z8pz1mPym',
      location: 'Studio A, West Wing',
      rating: 4.9,
    },
    {
      id: '2',
      name: 'Echo Sound Lab',
      description: 'State-of-the-art acoustic treatment with full Dolby Atmos 7.1.4 integration for world-class mixing and recording.',
      pricePerHour: 220,
      capacity: 4,
      features: ['Dolby Atmos', 'Acoustic Treatment', 'Mixing Console'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC64N0nKhBXtHwhNh6DcdbhRUNTNKSCMdI3cmK4mPBjc0lvt4kNzcndTxQv-xv0Ew11Mo6pxRUB6NyMmkxE3H0Ldz3g1lqi1qyv-3XjvGCLNc4pXBIWPmM2RSyRewbAvbuTb7PJN43rj_ekHj53hv2wFyKvZua4x1Na4qkx4UkwMvNlzOsbQdjNlv3Pa81r8ALYchJeOQX3dzUHTQlMlY-mfruSAbGT_u7vsxYErOzX-iMfJ38bzwaQ0wdagQCC0PSGKp299H0-Xsbm',
      location: 'Studio B, East Wing',
      rating: 4.8,
    },
    {
      id: '3',
      name: 'Noir Production Suite',
      description: 'A focused environment for color grading and non-linear editing, featuring high-speed servers and calibrated displays.',
      pricePerHour: 185,
      capacity: 6,
      features: ['8K Post', 'Color Grading', 'Calibrated Displays'],
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD19uyKQM4-hGNxbgLJqiThLHlao6CxQz5rYcY48Mza0FnbzlTS2wgfDDR1TLpoHASYBvETf6o9vNR3uRP-rdOllxD3FC1j1FN-3UUH8LdD_pjGh_7_J5OuGEWw55nQwQTgobYaSQkvQMxHxLWziJ0VUW5l7Cl3ahPVZcFJlTJpDqQ0lQ5Xj_xOILbmqVD0LhwX5nu6MIc54SH8CP9SJI0H56FnR_E3fBywIbR4EKb2Vr20jk3L7MYKleQKkOdpbu3uNBrMc7N_qOGd',
      location: 'Studio C, North Wing',
      rating: 4.9,
    },
  ];

  // Calendar days for October 2024
  const calendarDays = [
    { day: 29, disabled: true }, { day: 30, disabled: true }, { day: 1, disabled: false },
    { day: 2, disabled: false }, { day: 3, disabled: false }, { day: 4, disabled: false, available: true },
    { day: 5, disabled: true }, { day: 6, disabled: false }, { day: 7, disabled: false },
    { day: 8, disabled: false, selected: true }, { day: 9, disabled: false }, { day: 10, disabled: false },
    { day: 11, disabled: false }, { day: 12, disabled: false }, { day: 13, disabled: false },
    { day: 14, disabled: false }, { day: 15, disabled: false }, { day: 16, disabled: false },
  ];

  // Time slots
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '08:00', duration: '60 min', available: true },
    { id: '2', time: '09:30', duration: '60 min', available: true },
    { id: '3', time: '11:00', duration: '60 min', available: true, selected: true },
    { id: '4', time: '12:30', duration: '60 min', available: false },
    { id: '5', time: '14:00', duration: '120 min', available: true },
    { id: '6', time: '16:30', duration: '120 min', available: true },
    { id: '7', time: '18:00', duration: '120 min', available: false },
  ];

  const additionalServicesList = [
    { id: 'engineer', icon: 'engineering', label: 'On-site Engineer', description: 'Dedicated support' },
    { id: 'equipment', icon: 'speaker', label: 'Equipment Rental', description: 'List required gear' },
    { id: 'access', icon: 'key', label: 'Special Access', description: '24/7 or priority entry' },
  ];

  const handleSelectStudio = (studio: Studio) => {
    setSelectedStudio(studio);
  };

  const handleSelectDate = (day: number) => {
    setSelectedDate(`Oct ${day}, 2024`);
  };

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedTimeSlot(slot);
  };

  const handleToggleService = (serviceId: string) => {
    setAdditionalServices(prev =>
      prev.includes(serviceId) ? prev.filter(s => s !== serviceId) : [...prev, serviceId]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit booking
      router.push('/dashboard/bookings');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/dashboard');
    }
  };

  const calculateTotal = () => {
    if (!selectedStudio || !selectedTimeSlot) return 0;
    const hours = selectedTimeSlot.duration === '60 min' ? 1 : 2;
    const subtotal = selectedStudio.pricePerHour * hours;
    const serviceFee = 12;
    return subtotal + serviceFee;
  };

  const steps = [
    { number: 1, label: 'Selection', icon: 'grid_view' },
    { number: 2, label: 'Schedule', icon: 'calendar_today' },
    { number: 3, label: 'Details', icon: 'edit_note' },
    { number: 4, label: 'Review', icon: 'fact_check' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step >= s.number ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-outline'
                  }`}>
                    {step > s.number ? <CheckIcon className="w-5 h-5" /> : <span className="text-sm font-bold">{s.number}</span>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${
                    step >= s.number ? 'text-primary' : 'text-outline'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-16 h-px mx-4 ${step > s.number ? 'bg-primary' : 'bg-outline/30'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Step 1: Space Selection */}
            {step === 1 && (
              <div className="space-y-8">
                <header className="mb-8">
                  <h1 className="text-5xl font-extrabold font-headline tracking-tighter mb-4">Choose your space.</h1>
                  <p className="text-on-surface-variant max-w-xl leading-relaxed">
                    Select the environment that best fits your creative vision. Each room is precision-engineered for specific acoustic and visual workflows.
                  </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {studios.map((studio) => (
                    <div key={studio.id} className="group flex flex-col space-y-4">
                      <div className="aspect-[4/5] overflow-hidden rounded-md bg-surface-container relative">
                        <img
                          src={studio.image}
                          alt={studio.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                        {studio.id === '3' && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary text-on-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                              Selected
                            </span>
                          </div>
                        )}
                        {studio.id !== '3' && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                              Available Now
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-2xl font-bold font-headline tracking-tight">{studio.name}</h3>
                          <span className="text-sm font-medium text-on-surface-variant">${studio.pricePerHour} / hr</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-on-surface-variant uppercase tracking-widest font-medium">
                          <span className="flex items-center gap-1">
                            <MaterialIcon icon="groups" className="text-sm" /> {studio.capacity} Cap
                          </span>
                          <span className="flex items-center gap-1">
                            <MaterialIcon icon="photo_camera" className="text-sm" /> {studio.features[0]}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed pt-2">{studio.description}</p>
                        <button
                          onClick={() => handleSelectStudio(studio)}
                          className={`w-full mt-4 py-4 font-bold tracking-tight rounded-sm transition-all flex items-center justify-center gap-2 ${
                            selectedStudio?.id === studio.id
                              ? 'bg-primary-container text-on-primary'
                              : 'bg-primary text-on-primary hover:bg-primary-container'
                          }`}
                        >
                          {selectedStudio?.id === studio.id ? (
                            <>
                              <CheckIcon className="w-4 h-4" />
                              <span>Selected Room</span>
                            </>
                          ) : (
                            <>
                              <span>Select Space</span>
                              <MaterialIcon icon="arrow_forward" className="text-sm" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Schedule */}
            {step === 2 && (
              <div className="space-y-12">
                <header>
                  <h1 className="text-5xl font-extrabold font-headline tracking-tighter mb-4">Select Availability</h1>
                  <p className="text-on-surface-variant max-w-lg leading-relaxed">
                    Choose your preferred production window. All slots include 30 minutes of setup buffer as standard.
                  </p>
                </header>

                {/* Calendar */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-headline text-xs font-bold uppercase tracking-widest">October 2024</h3>
                    <div className="flex gap-4">
                      <MaterialIcon icon="chevron_left" className="text-on-surface/40 hover:text-on-surface cursor-pointer text-sm" />
                      <MaterialIcon icon="chevron_right" className="text-on-surface/40 hover:text-on-surface cursor-pointer text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-outline/10 border border-outline/10 rounded-sm overflow-hidden">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="bg-surface-container-low p-4 text-center text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day, idx) => (
                      <div
                        key={idx}
                        onClick={() => !day.disabled && handleSelectDate(day.day)}
                        className={`bg-surface-container-lowest p-6 flex flex-col items-center justify-center transition-all cursor-pointer hover:bg-neutral-50 ${
                          day.selected ? 'bg-primary text-on-primary' : ''
                        } ${day.disabled ? 'opacity-20 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-sm font-headline">{day.day}</span>
                        {day.available && !day.selected && (
                          <div className="absolute bottom-2 w-1 h-1 rounded-full bg-primary"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Time Slots */}
                <section className="space-y-8">
                  <div className="flex items-end justify-between">
                    <h3 className="font-headline text-xs font-bold uppercase tracking-widest">Available Time Slots</h3>
                    <span className="text-[10px] text-secondary">Local Time: GMT-05:00</span>
                  </div>
                  <div className="space-y-12">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
                        <MaterialIcon icon="light_mode" className="text-sm" /> Morning
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {timeSlots.slice(0, 4).map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleSelectTimeSlot(slot)}
                            disabled={!slot.available}
                            className={`border p-4 rounded-sm flex flex-col items-start transition-all ${
                              selectedTimeSlot?.id === slot.id
                                ? 'bg-primary text-on-primary border-primary'
                                : slot.available
                                ? 'border-outline/10 hover:border-primary cursor-pointer'
                                : 'border-outline/10 opacity-30 cursor-not-allowed'
                            }`}
                          >
                            <span className="text-sm font-bold font-headline">{slot.time}</span>
                            <span className="text-[10px]">{slot.duration}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
                        <MaterialIcon icon="sunny" className="text-sm" /> Afternoon
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {timeSlots.slice(4).map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleSelectTimeSlot(slot)}
                            disabled={!slot.available}
                            className={`border p-4 rounded-sm flex flex-col items-start transition-all ${
                              selectedTimeSlot?.id === slot.id
                                ? 'bg-primary text-on-primary border-primary'
                                : slot.available
                                ? 'border-outline/10 hover:border-primary cursor-pointer'
                                : 'border-outline/10 opacity-30 cursor-not-allowed'
                            }`}
                          >
                            <span className="text-sm font-bold font-headline">{slot.time}</span>
                            <span className="text-[10px]">{slot.duration}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Step 3: Project Details */}
            {step === 3 && (
              <div className="space-y-12">
                <header>
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-4 block">Section 03</span>
                  <h1 className="text-5xl font-extrabold font-headline tracking-tighter mb-4">Project Narrative</h1>
                  <p className="text-on-surface-variant max-w-xl leading-relaxed">
                    Provide the essential creative context for your session. This helps our technical team prepare the environment for your arrival.
                  </p>
                </header>

                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="group">
                      <label className="block font-label text-[10px] uppercase tracking-widest text-outline mb-2">Project Title</label>
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g., Midnight Sessions Vol. 2"
                        className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 text-lg font-medium py-2 outline-none"
                      />
                    </div>
                    <div className="group">
                      <label className="block font-label text-[10px] uppercase tracking-widest text-outline mb-2">Primary Creative (Role)</label>
                      <input
                        type="text"
                        value={creativeRole}
                        onChange={(e) => setCreativeRole(e.target.value)}
                        placeholder="Lead Engineer / Producer"
                        className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 text-lg font-medium py-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block font-label text-[10px] uppercase tracking-widest text-outline mb-2">Production Needs & Creative Brief</label>
                    <textarea
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      rows={6}
                      placeholder="Describe the sonic direction, instrumentation requirements, or specific technical setup needed for this project..."
                      className="w-full bg-surface-container-low border-0 focus:ring-0 p-6 text-on-surface leading-relaxed resize-none outline-none"
                    />
                  </div>

                  <div className="space-y-6 pt-8">
                    <h3 className="font-headline text-xl font-bold tracking-tight">Additional Requests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {additionalServicesList.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => handleToggleService(service.id)}
                          className={`bg-surface-container-lowest p-6 flex flex-col justify-between border transition-all cursor-pointer ${
                            additionalServices.includes(service.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-transparent hover:border-black/5'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-8">
                            <MaterialIcon icon={service.icon} className="text-xl" />
                            <input
                              type="checkbox"
                              checked={additionalServices.includes(service.id)}
                              onChange={() => {}}
                              className="w-5 h-5 border-2 border-outline/30 text-primary focus:ring-primary rounded-none"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{service.label}</p>
                            <p className="text-xs text-on-surface-variant mt-1">{service.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && selectedStudio && selectedTimeSlot && (
              <div className="space-y-12">
                <header>
                  <span className="text-[10px] font-black tracking-[0.3em] text-outline uppercase mb-4 block">Step 04 / Finalize</span>
                  <h1 className="text-6xl font-headline font-extrabold tracking-tighter leading-[1.1]">Review &amp; Confirm</h1>
                </header>

                <div className="space-y-8">
                  {/* Studio Identity */}
                  <div className="bg-surface-container-low p-8 rounded-lg">
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-outline uppercase mb-8">Creative Environment</h2>
                    <div className="flex items-start gap-8">
                      <div className="w-24 h-24 bg-surface-container-highest overflow-hidden rounded-md flex-shrink-0">
                        <img src={selectedStudio.image} alt={selectedStudio.name} className="w-full h-full object-cover grayscale contrast-125" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight text-primary">{selectedStudio.name}</h3>
                        <p className="text-on-surface-variant mt-2">{selectedStudio.location}</p>
                        <div className="mt-4 flex gap-2">
                          <span className="px-2 py-1 bg-secondary-container rounded-full text-[9px] font-black uppercase tracking-wider">Verified Professional</span>
                          <span className="px-2 py-1 bg-surface-container-highest rounded-full text-[9px] font-black uppercase tracking-wider">{selectedStudio.rating} Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-2 gap-y-12 gap-x-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black tracking-[0.2em] text-outline uppercase">Booking Date</p>
                      <p className="text-lg font-bold font-headline">{selectedDate || 'Oct 08, 2024'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black tracking-[0.2em] text-outline uppercase">Session Time</p>
                      <p className="text-lg font-bold font-headline">{selectedTimeSlot.time} — {selectedTimeSlot.duration}</p>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <p className="text-[10px] font-black tracking-[0.2em] text-outline uppercase">Project Title</p>
                      <p className="text-3xl font-extrabold font-headline tracking-tighter">{projectTitle || 'Untitled Project'}</p>
                    </div>
                    {additionalServices.length > 0 && (
                      <div className="col-span-2 space-y-4">
                        <p className="text-[10px] font-black tracking-[0.2em] text-outline uppercase">Selected Services</p>
                        <div className="flex flex-wrap gap-3">
                          {additionalServices.map((service) => (
                            <div key={service} className="flex items-center gap-2 px-4 py-3 bg-surface-container-lowest border border-outline/10 rounded-sm">
                              <MaterialIcon icon={service === 'engineer' ? 'engineering' : service === 'equipment' ? 'speaker' : 'key'} className="text-base" />
                              <span className="text-xs font-bold font-headline uppercase tracking-wider">
                                {service === 'engineer' ? 'On-site Engineer' : service === 'equipment' ? 'Equipment Rental' : 'Special Access'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-surface-container-lowest p-8 space-y-8 border border-outline/10 rounded-lg">
              <h4 className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">Booking Summary</h4>

              <div className="space-y-6">
                <div className="aspect-video overflow-hidden bg-zinc-200 rounded-sm">
                  <img
                    src={selectedStudio?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC29Sfrba7ly_obC-pqluOTkADZsfqerP_1Ja0lWuceaik1GauNBDKEF4x2H1IRmecmOiWJOgg6ItXcrGVEycKgyYsIzuiArFR8Fw7n7RYiK6OYrqUvAyvhynfC02rvovVUaRtDJrdJgC1Z1a1C5Ez1m-rQ6WF_thj_z7QoN18XBAhrSomVD1Ei4rLrsSKyWgNNoeTxOnB1VQCl1YC2BHXdLiRNpp_yLRzyHN_rnEsSvRIRvAvGTy-xMSO4UK_q4ApuxNnmlIujWQQq'}
                    alt={selectedStudio?.name || 'Studio Preview'}
                    className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
                  />
                </div>

                <div>
                  <p className="font-headline font-extrabold text-xl tracking-tight">{selectedStudio?.name || 'Select a Studio'}</p>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                    <MapPinIcon className="w-3 h-3" /> {selectedStudio?.location || 'Studio Location'}
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-outline/10 pt-4">
                  <div>
                    <p className="font-label text-[9px] uppercase tracking-widest text-outline">Date</p>
                    <p className="font-medium text-sm">{selectedDate || 'Not selected'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label text-[9px] uppercase tracking-widest text-outline">Time</p>
                    <p className="font-medium text-sm">{selectedTimeSlot?.time || '—'} — {selectedTimeSlot?.duration || '—'}</p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Studio Hourly Rate</span>
                    <span className="font-medium">${selectedStudio?.pricePerHour || 0}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Service Fee</span>
                    <span className="font-medium">$12.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-outline/10">
                    <span className="font-bold text-[10px] uppercase tracking-widest">Total Estimated</span>
                    <span className="font-headline font-bold text-lg">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-secondary-container/20 border-l-2 border-primary">
                  <InformationCircleIcon className="w-4 h-4 mt-0.5" />
                  <p className="text-[10px] leading-relaxed text-on-surface-variant">
                    48-hour cancellation policy applies. Standard backline included in base rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-outline/10">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {step === 1 ? 'Cancel' : 'Previous'}
          </button>
          <button
            onClick={handleNext}
            disabled={step === 1 && !selectedStudio || step === 2 && (!selectedDate || !selectedTimeSlot) || step === 3 && !projectTitle}
            className="bg-primary text-on-primary px-12 py-5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 4 ? 'Confirm & Pay' : 'Continue'}
            {step < 4 && <ArrowRightIcon className="w-4 h-4 inline-block ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}