import React from 'react';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { Professional } from '../types';

interface ProCardProps {
  pro: Professional;
  onSelectPro: (pro: Professional) => void;
  onBookPro: (pro: Professional) => void;
}

export const ProCard: React.FC<ProCardProps> = ({
  pro,
  onSelectPro,
  onBookPro,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        
        {/* Top Header: Avatar, Name & Verification */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative shrink-0">
            <img
              src={pro.avatarUrl}
              alt={pro.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-100 shadow-sm"
            />
            {pro.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-xs" title="Verified Background Checked">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-base font-bold text-stone-900 truncate font-serif">
                {pro.name}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                pro.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
              }`}>
                {pro.isAvailable ? 'Available Now' : 'Busy Today'}
              </span>
            </div>

            <p className="text-xs font-medium text-stone-500 truncate mt-0.5">
              {pro.title}
            </p>

            <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-600">
              <div className="flex items-center gap-1 font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                <span>{pro.rating}</span>
                <span className="text-stone-400 font-normal">({pro.reviewCount})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 text-stone-500">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>{pro.distanceKm} km away</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Badges & Experience */}
        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-stone-50 border border-stone-100 my-3">
          <div className="flex items-center gap-1.5 text-stone-700">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            <span><strong className="text-stone-900 font-bold">{pro.experienceYears} yrs</strong> exp</span>
          </div>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-1.5 text-stone-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span><strong className="text-stone-900 font-bold">{pro.completedJobs}+</strong> jobs</span>
          </div>
        </div>

        {/* Bio Excerpt */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
          {pro.bio}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {pro.topSkills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

      </div>

      {/* Footer Price & Booking Buttons */}
      <div className="pt-3 border-t border-stone-100 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 font-semibold uppercase block">
              Inspection Fee
            </span>
            <span className="text-sm font-extrabold text-stone-900">
              ₹{pro.startingPrice} <span className="text-xs font-normal text-stone-500">/ visit</span>
            </span>
          </div>

          <button
            onClick={() => onSelectPro(pro)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Full Profile & Reviews
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => onBookPro(pro)}
          className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          Book {pro.name.split(' ')[0]} Now
        </button>
      </div>

    </div>
  );
};
