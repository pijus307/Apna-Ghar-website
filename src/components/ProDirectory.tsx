import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  UserCheck,
  Star,
  MapPin,
  ShieldCheck,
  Phone,
  Briefcase,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  Map as MapIcon,
  LayoutGrid,
  Layers,
} from 'lucide-react';
import { Professional, Review } from '../types';
import { ProCard } from './ProCard';
import { ProLocationsMap } from './ProLocationsMap';

interface ProDirectoryProps {
  professionals: Professional[];
  categories: string[];
  currentCity: string;
  selectedCategoryFilter?: string;
  onBookPro: (pro: Professional) => void;
  onOpenAIDiagnostic: () => void;
}

export const ProDirectory: React.FC<ProDirectoryProps> = ({
  professionals,
  categories,
  currentCity,
  selectedCategoryFilter,
  onBookPro,
  onOpenAIDiagnostic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategoryFilter || 'All');
  const [minRating, setMinRating] = useState<number>(0);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'nearest' | 'rating' | 'price_low'>('nearest');
  const [viewMode, setViewMode] = useState<'map_and_grid' | 'grid_only' | 'map_only'>('map_and_grid');

  // Active modal for deep inspecting professional profile
  const [inspectPro, setInspectPro] = useState<Professional | null>(null);

  // Filter logic
  const filteredPros = useMemo(() => {
    return professionals
      .filter((pro) => {
        // Search match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = pro.name.toLowerCase().includes(q);
          const matchesTitle = pro.title.toLowerCase().includes(q);
          const matchesCategory = pro.category.toLowerCase().includes(q);
          const matchesSkill = pro.topSkills.some((s) => s.toLowerCase().includes(q));
          if (!matchesName && !matchesTitle && !matchesCategory && !matchesSkill) return false;
        }

        // Category match
        if (activeCategory !== 'All' && pro.category !== activeCategory) {
          return false;
        }

        // Rating match
        if (pro.rating < minRating) return false;

        // Availability match
        if (availableOnly && !pro.isAvailable) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_low') return a.startingPrice - b.startingPrice;
        return 0;
      });
  }, [professionals, searchQuery, activeCategory, minRating, availableOnly, sortBy]);

  return (
    <section className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & View Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
              <UserCheck className="w-4 h-4" />
              <span>Verified Local Technicians in {currentCity}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
              Browse & Book Nearby Tradespeople
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Background verified with Aadhaar, police check & trade certifications. Standardized inspection rates.
            </p>
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center bg-stone-200/80 p-1 rounded-2xl border border-stone-300 self-start md:self-auto text-xs font-bold">
            <button
              onClick={() => setViewMode('map_and_grid')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map_and_grid'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Map + Cards</span>
            </button>
            <button
              onClick={() => setViewMode('map_only')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map_only'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Full Radar Map</span>
            </button>
            <button
              onClick={() => setViewMode('grid_only')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid_only'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid Only</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs mb-8 space-y-4">
          
          {/* Top Row: Search input + Sort dropdown */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, skill e.g. 'Rahul', 'MCB', 'Inverter'..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 outline-none cursor-pointer focus:border-emerald-600"
              >
                <option value="nearest">Nearest First (Distance)</option>
                <option value="rating">Highest Rated First</option>
                <option value="price_low">Lowest Visit Fee</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Chips & Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'All'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                  minRating === 4.5
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>4.5+ Stars</span>
              </button>

              <button
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                  availableOnly
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Available Today</span>
              </button>
            </div>
          </div>

        </div>

        {/* Visual Map Component */}
        {viewMode !== 'grid_only' && (
          <ProLocationsMap
            professionals={filteredPros}
            currentCity={currentCity}
            selectedCategory={activeCategory}
            onBookPro={onBookPro}
            onSelectPro={(p) => setInspectPro(p)}
          />
        )}

        {/* Directory Cards Grid */}
        {viewMode !== 'map_only' && (
          <>
            {filteredPros.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPros.map((pro) => (
                  <ProCard
                    key={pro.id}
                    pro={pro}
                    onSelectPro={(p) => setInspectPro(p)}
                    onBookPro={(p) => onBookPro(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900 font-serif">No matching professionals found</h3>
                <p className="text-xs text-stone-500">
                  Try relaxing your search query or switching categories. Alternatively, ask Ghar AI to diagnose your problem.
                </p>
                <button
                  onClick={onOpenAIDiagnostic}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Use Ghar AI Diagnostics
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* Inspect Professional Modal */}
      {inspectPro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 relative space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setInspectPro(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pr-8">
              <img
                src={inspectPro.avatarUrl}
                alt={inspectPro.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-stone-900 font-serif">{inspectPro.name}</h3>
                  {inspectPro.isVerified && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-stone-600">{inspectPro.title}</p>

                <div className="flex items-center gap-3 text-xs text-stone-600 pt-1">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    {inspectPro.rating} ({inspectPro.reviewCount} Reviews)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {inspectPro.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
              <div>
                <span className="text-[10px] font-semibold text-stone-400 uppercase block">Experience</span>
                <span className="text-sm font-extrabold text-stone-900">{inspectPro.experienceYears} Years</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-stone-400 uppercase block">Jobs Done</span>
                <span className="text-sm font-extrabold text-stone-900">{inspectPro.completedJobs}+ Completed</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-stone-400 uppercase block">Inspection Fee</span>
                <span className="text-sm font-extrabold text-emerald-700">₹{inspectPro.startingPrice}</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-1">
                About Professional
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                {inspectPro.bio}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-2">
                Specialized Trade Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {inspectPro.topSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Customer Reviews */}
            <div>
              <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-3">
                Verified Customer Reviews ({inspectPro.recentReviews.length})
              </h4>
              <div className="space-y-3">
                {inspectPro.recentReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">{rev.customerName}</span>
                      <span className="text-[11px] text-stone-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      <span>{rev.rating}.0</span>
                      <span className="text-stone-400 font-normal ml-1">for {rev.serviceName}</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">Visiting Charge</span>
                <span className="text-base font-extrabold text-stone-900">₹{inspectPro.startingPrice}</span>
              </div>
              <button
                onClick={() => {
                  const proToBook = inspectPro;
                  setInspectPro(null);
                  onBookPro(proToBook);
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Proceed to Book {inspectPro.name}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
