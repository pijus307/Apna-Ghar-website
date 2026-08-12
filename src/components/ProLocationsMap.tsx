import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Star,
  ShieldCheck,
  Zap,
  Droplets,
  Wind,
  Paintbrush,
  Sparkles,
  Siren,
  Phone,
  Clock,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Info,
  ArrowRight,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';
import { Professional } from '../types';

interface ProLocationsMapProps {
  professionals: Professional[];
  currentCity: string;
  selectedCategory: string;
  onBookPro: (pro: Professional) => void;
  onSelectPro: (pro: Professional) => void;
}

// City Center Coordinates for relative spatial layout
const CITY_CENTERS: Record<string, { lat: number; lng: number; area: string }> = {
  Mumbai: { lat: 19.0760, lng: 72.8777, area: 'Bandra - Andheri Central Corridor' },
  'Delhi NCR': { lat: 28.6139, lng: 77.2090, area: 'Connaught Place & South Delhi Hub' },
  Bengaluru: { lat: 12.9716, lng: 77.5946, area: 'Koramangala - Indiranagar Corridor' },
  Hyderabad: { lat: 17.3850, lng: 78.4867, area: 'HITEC City & Gachibowli Sector' },
  Pune: { lat: 18.5204, lng: 73.8567, area: 'Koregaon Park & Viman Nagar Zone' },
  Kolkata: { lat: 22.5726, lng: 88.3639, area: 'Park Street & Salt Lake Sector' },
  Chennai: { lat: 13.0827, lng: 80.2707, area: 'T. Nagar & Adyar District' },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, area: 'SG Highway & Bodakdev Sector' },
  Jaipur: { lat: 26.9124, lng: 75.7873, area: 'C-Scheme & Malviya Nagar Zone' },
};

// Category Icon & Color Mapping
const CATEGORY_MAP: Record<
  string,
  { icon: React.ReactNode; bg: string; border: string; text: string; pinBg: string }
> = {
  Electrical: {
    icon: <Zap className="w-3.5 h-3.5" />,
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-800',
    pinBg: 'bg-amber-500',
  },
  Plumbing: {
    icon: <Droplets className="w-3.5 h-3.5" />,
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-800',
    pinBg: 'bg-blue-600',
  },
  'AC & Appliance': {
    icon: <Wind className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    pinBg: 'bg-emerald-600',
  },
  Painting: {
    icon: <Paintbrush className="w-3.5 h-3.5" />,
    bg: 'bg-indigo-100',
    border: 'border-indigo-300',
    text: 'text-indigo-800',
    pinBg: 'bg-indigo-600',
  },
  'Home Cleaning': {
    icon: <Sparkles className="w-3.5 h-3.5" />,
    bg: 'bg-teal-100',
    border: 'border-teal-300',
    text: 'text-teal-800',
    pinBg: 'bg-teal-600',
  },
  'Emergency Services': {
    icon: <Siren className="w-3.5 h-3.5" />,
    bg: 'bg-rose-100',
    border: 'border-rose-300',
    text: 'text-rose-800',
    pinBg: 'bg-rose-600',
  },
};

export const ProLocationsMap: React.FC<ProLocationsMapProps> = ({
  professionals,
  currentCity,
  selectedCategory,
  onBookPro,
  onSelectPro,
}) => {
  const [activeProId, setActiveProId] = useState<string | null>(professionals[0]?.id || null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(10);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [showCoverageRadius, setShowCoverageRadius] = useState<boolean>(true);

  const cityInfo = CITY_CENTERS[currentCity] || CITY_CENTERS['Mumbai'];

  // Map position calculation for professionals
  // Converts lat/lng or relative distance into x/y percentages on the stylized city map canvas
  const prosWithCoordinates = useMemo(() => {
    return professionals.map((pro, idx) => {
      // Calculate angle and radius based on index if lat/lng not strictly bounded to city
      const angle = (idx * (360 / Math.max(professionals.length, 1)) + 25) * (Math.PI / 180);
      const normalizedRadius = Math.min(pro.distanceKm / 5, 0.85); // 0 to 1 relative radius

      // Calculate x and y percentage (50% is city center)
      // Standard offset from center:
      let xPct = 50 + Math.cos(angle) * normalizedRadius * 38;
      let yPct = 50 + Math.sin(angle) * normalizedRadius * 38;

      // Keep inside 12% to 88% bounds
      xPct = Math.max(12, Math.min(88, xPct));
      yPct = Math.max(12, Math.min(88, yPct));

      return {
        ...pro,
        mapX: xPct,
        mapY: yPct,
      };
    });
  }, [professionals]);

  // Selected professional detail for bottom or overlay popover
  const selectedPro = useMemo(() => {
    return prosWithCoordinates.find((p) => p.id === activeProId) || prosWithCoordinates[0];
  }, [prosWithCoordinates, activeProId]);

  const activeCategoryConfig = CATEGORY_MAP[selectedPro?.category] || {
    icon: <MapPin className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    pinBg: 'bg-emerald-600',
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden mb-8 transition-all">
      
      {/* Map Header Controls */}
      <div className="p-4 sm:p-5 bg-stone-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              Live Technician Radar • {currentCity}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-serif text-stone-100 mt-0.5">
            Active Verified Tradespeople Near You ({professionals.length} Online)
          </h3>
          <p className="text-xs text-stone-400">
            {cityInfo.area} • Click on any pin to view live ETA & technician details
          </p>
        </div>

        {/* Top Control Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-between md:justify-end">
          {/* Map Style Switcher */}
          <div className="flex items-center bg-stone-800 p-1 rounded-xl border border-stone-700 text-xs font-semibold">
            <button
              onClick={() => setMapStyle('standard')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapStyle === 'standard' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Street Map
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapStyle === 'satellite' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Toggle Coverage Ring */}
          <button
            onClick={() => setShowCoverageRadius(!showCoverageRadius)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showCoverageRadius
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5km Service Zone</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map View Canvas */}
      <div className="relative w-full h-[420px] sm:h-[480px] bg-stone-100 overflow-hidden select-none">
        
        {/* Map Background Grid & City Vector Graphic Styling */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            mapStyle === 'satellite'
              ? 'bg-slate-900 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
              : 'bg-stone-100 bg-[linear-gradient(to_right,#e7e5e4_1px,transparent_1px),linear-gradient(to_bottom,#e7e5e4_1px,transparent_1px)] bg-[size:28px_28px]'
          }`}
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Simulated Roads / Highways Vector lines */}
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none stroke-stone-300" strokeWidth="3">
            <path d="M 0,100 Q 200,150 400,120 T 800,200 T 1200,180" fill="none" strokeWidth="6" className="stroke-amber-200/80" />
            <path d="M 150,0 Q 220,250 180,500 T 250,900" fill="none" strokeWidth="8" className="stroke-stone-300" />
            <path d="M 0,350 Q 400,280 800,380 T 1200,320" fill="none" strokeWidth="5" className="stroke-stone-300" />
            {/* Water body simulation */}
            <path d="M 0,0 C 80,100 60,300 0,450 Z" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="2" />
          </svg>

          {/* User's Center Location Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
            {showCoverageRadius && (
              <div className="absolute -inset-28 sm:-inset-36 rounded-full border-2 border-dashed border-emerald-500/40 bg-emerald-500/5 animate-pulse" />
            )}
            <div className="p-2.5 rounded-full bg-blue-600 text-white shadow-xl ring-4 ring-blue-200 animate-bounce">
              <Navigation className="w-5 h-5 fill-white" />
            </div>
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-extrabold shadow-md whitespace-nowrap">
              You ({currentCity})
            </span>
          </div>

          {/* Neighborhood Landmark Label Chips */}
          <div className="absolute top-12 left-16 px-2 py-1 rounded bg-stone-200/80 text-[10px] font-bold text-stone-500 uppercase tracking-widest pointer-events-none">
            North Sector
          </div>
          <div className="absolute bottom-16 right-16 px-2 py-1 rounded bg-stone-200/80 text-[10px] font-bold text-stone-500 uppercase tracking-widest pointer-events-none">
            East IT Hub
          </div>
          <div className="absolute bottom-12 left-24 px-2 py-1 rounded bg-stone-200/80 text-[10px] font-bold text-stone-500 uppercase tracking-widest pointer-events-none">
            South Station
          </div>

          {/* Professional Markers */}
          {prosWithCoordinates.map((pro) => {
            const isSelected = pro.id === selectedPro?.id;
            const categoryConfig = CATEGORY_MAP[pro.category] || CATEGORY_MAP['Electrical'];

            return (
              <div
                key={pro.id}
                style={{
                  top: `${pro.mapY}%`,
                  left: `${pro.mapX}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20 cursor-pointer group ${
                  isSelected ? 'z-30 scale-110' : 'hover:scale-110 hover:z-25'
                }`}
                onClick={() => setActiveProId(pro.id)}
              >
                {/* Marker Container */}
                <div className="flex flex-col items-center">
                  
                  {/* Tooltip Label on Hover or Select */}
                  <div
                    className={`mb-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold shadow-md transition-all flex items-center gap-1 whitespace-nowrap ${
                      isSelected
                        ? 'bg-stone-900 text-white ring-2 ring-emerald-500 scale-105'
                        : 'bg-white text-stone-800 border border-stone-200 group-hover:bg-stone-900 group-hover:text-white'
                    }`}
                  >
                    <span>{pro.name.split(' ')[0]}</span>
                    <span className="text-amber-500 flex items-center">
                      ★{pro.rating}
                    </span>
                  </div>

                  {/* Marker Pin Icon */}
                  <div className="relative">
                    {pro.isAvailable && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                      </span>
                    )}

                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center p-0.5 border-2 shadow-lg transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-white ring-4 ring-emerald-200 scale-110'
                          : 'border-white bg-white hover:border-emerald-400'
                      }`}
                    >
                      <img
                        src={pro.avatarUrl}
                        alt={pro.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    </div>

                    {/* Category Small Badge */}
                    <div
                      className={`absolute -bottom-1.5 -right-1.5 p-1 rounded-full text-white shadow-xs ${categoryConfig.pinBg}`}
                      title={pro.category}
                    >
                      {categoryConfig.icon}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Map Floating Controls (Zoom & Center) */}
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-stone-200 shadow-lg p-1 flex flex-col divide-y divide-stone-100">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
              className="p-2 hover:bg-stone-100 text-stone-700 rounded-xl transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-2 hover:bg-stone-100 text-stone-700 rounded-xl transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setZoomLevel(1)}
            className="p-2 bg-white/95 backdrop-blur-xs rounded-2xl border border-stone-200 shadow-lg text-stone-700 hover:text-emerald-700 transition-colors cursor-pointer flex items-center justify-center"
            title="Recenter City View"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Category Color Legend (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-30 hidden sm:flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-md text-[10px] font-bold text-stone-700">
          <span className="text-stone-400 uppercase tracking-wider pr-1">Legend:</span>
          {Object.entries(CATEGORY_MAP).map(([catName, config]) => (
            <span
              key={catName}
              className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${config.bg} ${config.text}`}
            >
              {config.icon}
              <span>{catName}</span>
            </span>
          ))}
        </div>

      </div>

      {/* Selected Professional Popover Bar (Bottom Interactive Sheet) */}
      {selectedPro && (
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Pro Info Left */}
            <div className="flex items-start gap-3.5">
              <img
                src={selectedPro.avatarUrl}
                alt={selectedPro.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-stone-900 font-serif">{selectedPro.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border ${activeCategoryConfig.bg} ${activeCategoryConfig.border} ${activeCategoryConfig.text}`}
                  >
                    {activeCategoryConfig.icon}
                    {selectedPro.category}
                  </span>
                  {selectedPro.isAvailable ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Available Now
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[10px] font-medium">
                      Busy on Job
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-stone-600">{selectedPro.title}</p>

                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    {selectedPro.rating} ({selectedPro.reviewCount} reviews)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-stone-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedPro.location} ({selectedPro.distanceKm} km away)
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Booking Actions Right */}
            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-stone-200">
              <div>
                <span className="text-[10px] font-semibold text-stone-400 uppercase block">Inspection Fee</span>
                <span className="text-lg font-extrabold text-emerald-700">₹{selectedPro.startingPrice}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectPro(selectedPro)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onBookPro(selectedPro)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Book {selectedPro.name.split(' ')[0]}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
