import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  Zap,
  Droplets,
  Paintbrush,
  Wind,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from 'lucide-react';

interface HeroSectionProps {
  currentCity: string;
  onSearch: (query: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenAIDiagnostic: () => void;
  onOpenEmergencyModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentCity,
  onSearch,
  onSelectCategory,
  onOpenAIDiagnostic,
  onOpenEmergencyModal,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-white pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-stone-200/60">
      
      {/* Decorative Subtle Background Accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Text & Search */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>India's Verified Home Service Network</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span className="text-stone-600 font-normal">{currentCity}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight font-serif">
              Trusted Local Professionals, <br className="hidden sm:inline" />
              <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-4">
                Right at Your Door.
              </span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
              Book background-verified electricians, plumbers, painters, cleaners, and appliance technicians in <strong className="text-stone-800">{currentCity}</strong>. Fair fixed pricing, upfront quotes, and 100% service guarantee.
            </p>

            {/* Interactive Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="flex items-center bg-white border-2 border-stone-300 focus-within:border-emerald-600 rounded-2xl shadow-lg shadow-stone-200/50 p-1.5 transition-all">
                <div className="pl-3 text-stone-400">
                  <Search className="w-5 h-5 text-emerald-600" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search 'Fan Repair', 'Tap Leak', 'Bathroom Cleaning'..."
                  className="w-full px-3 py-2.5 text-stone-800 text-sm bg-transparent outline-none placeholder-stone-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Service Pills */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Popular Searches:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSelectCategory('electrical')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-700 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Fan & Wiring
                </button>
                <button
                  onClick={() => onSelectCategory('plumbing')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-700 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  Tap Leak & Pipe
                </button>
                <button
                  onClick={() => onSelectCategory('ac_repair')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-700 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Wind className="w-3.5 h-3.5 text-cyan-500" />
                  AC Jet Service
                </button>
                <button
                  onClick={() => onSelectCategory('painting')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-700 text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Paintbrush className="w-3.5 h-3.5 text-rose-500" />
                  Wall Painting
                </button>
              </div>
            </div>

            {/* Ghar AI Prompt Card Trigger */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-700/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-100 flex items-center gap-2">
                    Unsure what service you need?
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-400 text-stone-900 uppercase tracking-wider">
                      Ghar AI
                    </span>
                  </h4>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    Describe your issue in plain words (e.g. "Water leak under sink", "AC making rattling sound"). Get instant cost estimate & safety tips!
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenAIDiagnostic}
                className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-900 font-extrabold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Diagnose Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Visual Showcase & Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Background Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-square bg-stone-200">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjBLhqrdp5DqgqFRgt3CiX-DkanxKo5Z8cw_CTNpQ2xCeeAjDcJnfSIh8D3ueHtkGARtUM7J_JHxjpTJr_OVJEtcNuk0-R-AFisU2tnxL08GIAysl3W8AjzYrKM9ORLLRDAJAY7R99zDna8NV-Z4OkpSFbxVs-bd-Cl7vSa2NwigCifmA_qX-qAHj7YQRnfsqrYN1VkLo35_XQHwq5yp9bb5CR609e23k1ZUXZyfbjBRnllko1XNrKnQ"
                  alt="Professional Service Technician"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      100% Background Verified
                    </span>
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300 stroke-amber-300" />
                      4.9 (50,000+ Jobs)
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Instant Emergency Card */}
              <div
                onClick={onOpenEmergencyModal}
                className="absolute -top-4 -left-4 sm:-left-6 bg-white border border-stone-200 rounded-2xl p-3 shadow-xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-stone-900">24/7 Emergency</div>
                  <div className="text-[11px] text-stone-500 font-medium">Under 30 Min Arrival</div>
                </div>
              </div>

              {/* Floating Badge 2: Upfront Pricing */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white border border-stone-200 rounded-2xl p-3 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  ₹
                </div>
                <div>
                  <div className="text-xs font-extrabold text-stone-900">Upfront Rate Card</div>
                  <div className="text-[11px] text-stone-500 font-medium">No Hidden Charges</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Trust Indicators Bar */}
        <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Aadhaar & Police Verified</div>
              <div className="text-[10px] text-stone-500">Thorough background check</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">4.9 Star Top Ratings</div>
              <div className="text-[10px] text-stone-500">Real customer reviews</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Slot-Based Timely Arrival</div>
              <div className="text-[10px] text-stone-500">On time or ₹50 discount</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">30-Day Service Warranty</div>
              <div className="text-[10px] text-stone-500">Free re-work protection</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
