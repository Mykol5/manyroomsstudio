'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FolderOpenIcon,
  PlusIcon,
  ShareIcon,
  PencilIcon,
  EllipsisHorizontalIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

// Material Icon component for icons not in Heroicons
const MaterialIcon = ({ icon, className = '' }: { icon: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{icon}</span>
);

interface Collection {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  image: string;
  modifiedAt: string;
  isFeatured?: boolean;
  tags?: string[];
}

export default function ClientStudios() {
  const [activeTab, setActiveTab] = useState('collections');
  const [searchTerm, setSearchTerm] = useState('');

  // Featured collection data
  const featuredCollection = {
    id: 'featured',
    name: 'Summer Campaign 2024',
    description: 'A curated selection of minimalist urban lofts and brutalist concrete spaces for the upcoming seasonal brand photoshoot.',
    itemCount: 24,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWUoG_4LBt8RJmdfsqIxmMpMPpdsF5mKJrPQsy6wRWspm4WkL1RWT4jp5X2bET3H5hpiUVDihiBtkU8BdcLjh8PA_De6NItr9bxSQISwFlHuoHRS2SjFvnPOY_W3oo5cBz9oEVSrziU4RT4ZB--Ki4IcStRzaoNS7LLpuPD7nAkljkLVC3q9RPNbUHTsenszCo4JxE2P-bho91Qxzn7WmtftpIF_r3ILec7-LSpECBTtVI2woE6kFnWI0tcnNkTKkWUMxUJ_0uZDX0',
    modifiedAt: 'Today',
    isFeatured: true,
    tags: ['Updated Today', '24 Elements'],
  };

  // Collections data
  const [collections] = useState<Collection[]>([
    {
      id: '1',
      name: 'Podcast Ideas',
      itemCount: 8,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI9VPN3qRMrnmJf6-dtleYvlub7AUkzBgWiqk3rGhpT68lM8VtZXb4n2JR8OeOPOfg6VXpRgGzW7sJzb6BBUF45OYexBX1HDfBTG2TZB6_hjANhnnlXBmezXuGvXIOoLGrfuzuEUe97vQiT01v-6JAIAnZRGuaZjopI8bMmuZ9Mg3rS3QMaZrzjYIat6hCH7HsqZfLVKabXaK6Gayx5_XgtUAvvYhA-ZDz54_JUk3kGc7wrDNtDOmYgPQUSuGZZb8JddYTgJBO6b1Y',
      modifiedAt: '2 days ago',
    },
    {
      id: '2',
      name: 'Tech Launch Event',
      itemCount: 14,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd1ivrnRofQAQ2knux0r1QUAWwvNoHHZ3RgTE3gP5bqkYURQkQryErRzZrF7vBqzYBWbhpOF5FGgB-rfClKS9wlzt5Q70tsZy78yQNVgGrrXFPJO30FN5gTcBSiOOFTLT-0vGn71aZi8_K74zjQld5EqZ6Y9smupILj7kFEpEDjlaG8H-qRldQ0QrwYDwdr2hBxYJ9V0lnfC_kLEE2zq7bp3YS1nzNO3ABc_A5IHSmROuVSxgy276kg6HSlTszsw6hsEAxcmMJyUvN',
      modifiedAt: '1 week ago',
    },
    {
      id: '3',
      name: 'Interview Series',
      itemCount: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD48uH3-NXPHBsFO99Dydii3qDGUwJqhyksK32WDDMy5nRp0ifsjF0v_UBrzxKs5TK-OyGCv4__Lu2Xom6RLumgYypq25B7lT0tzlcHYk8pj8rGs994yEkxfKLrBmuFtrjnWUCWRx6QC5nLt2n--qjyT3sxdmYoZjBlXmeFVRE774KQB4aMAdFMrK6i8fQvgl12_I0wzmb9Gf_ZykmFMEa3Yu22D2jr7_EtMJRbBIBoGFSjGtmp8K7RTAT6PY5yKLSbgA33ZsvGDL3P',
      modifiedAt: '3 weeks ago',
    },
  ]);

  const tabs = [
    { id: 'collections', label: 'All Collections', count: collections.length + 1 },
    { id: 'individual', label: 'Individual Studios', count: 0 },
    { id: 'collaborative', label: 'Collaborative', count: 0 },
    { id: 'recent', label: 'Recently Viewed', count: 0 },
  ];

  const handleCreateCollection = () => {
    alert('Create new collection feature coming soon!');
  };

  const handleShare = (collectionId: string) => {
    console.log('Share collection:', collectionId);
  };

  const handleEdit = (collectionId: string) => {
    console.log('Edit collection:', collectionId);
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 pt-24 pb-12 px-6 lg:px-12">
      {/* Hero Title Section */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
            Premium Curation
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none">
            Saved Studios<br />
            <span className="text-white/40">&amp; Collections</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all border border-white/10">
            <FolderOpenIcon className="w-5 h-5" />
            Archive
          </button>
          <button
            onClick={handleCreateCollection}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-lg shadow-primary/20"
          >
            <PlusIcon className="w-5 h-5" />
            New Collection
          </button>
        </div>
      </section>

      {/* Featured Large Card */}
      <section className="mb-12 group">
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${featuredCollection.image}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background-dark/90"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                  Updated Today
                </span>
                <span className="text-white/60 text-xs font-medium uppercase tracking-widest">
                  • {featuredCollection.itemCount} Elements
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2">{featuredCollection.name}</h2>
              <p className="text-white/60 max-w-xl text-sm md:text-base leading-relaxed">
                {featuredCollection.description}
              </p>
            </div>
            <button className="whitespace-nowrap flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-background-dark font-extrabold text-sm hover:scale-105 transition-transform">
              Open Collection
              <MaterialIcon icon="arrow_forward" />
            </button>
          </div>
        </div>
      </section>

      {/* Search Bar (Mobile/Tablet) */}
      <div className="lg:hidden mb-8">
        <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Quick search..."
            className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-white/30 w-full ml-2 text-white outline-none"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-10 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-primary text-white'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            {tab.label}
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCollections.map((collection) => (
          <div key={collection.id} className="group flex flex-col gap-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/5 shadow-lg group-hover:shadow-primary/5 transition-all">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url('${collection.image}')` }}
              ></div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleShare(collection.id)}
                  className="size-10 rounded-full bg-background-dark/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(collection.id)}
                  className="size-10 rounded-full bg-background-dark/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 delay-75 duration-300"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-background-dark/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5">
                  <MaterialIcon icon="grid_view" className="text-sm" />
                  {collection.itemCount} Items
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <p className="text-white/40 text-xs font-medium uppercase tracking-tighter mt-1">
                  Modified {collection.modifiedAt}
                </p>
              </div>
              <button className="text-white/20 hover:text-white/40 transition-colors">
                <EllipsisHorizontalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State / New Card Style */}
        <button
          onClick={handleCreateCollection}
          className="group relative aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer"
        >
          <div className="size-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <PlusCircleIcon className="w-8 h-8 text-white/40 group-hover:text-primary transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-white/60 font-bold">Create New Folder</p>
            <p className="text-white/20 text-[10px] font-medium uppercase tracking-widest mt-1">
              Start fresh curation
            </p>
          </div>
        </button>
      </div>

      {/* Empty State Message */}
      {filteredCollections.length === 0 && (
        <div className="text-center py-16">
          <MaterialIcon icon="folder_open" className="text-6xl text-white/20 mb-4" />
          <p className="text-white/60">No collections found</p>
          <button
            onClick={handleCreateCollection}
            className="mt-4 text-primary hover:text-primary/80 text-sm font-medium"
          >
            Create your first collection
          </button>
        </div>
      )}
    </div>
  );
}