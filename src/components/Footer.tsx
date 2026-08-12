import React from 'react';
import { Home, ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { CITIES } from '../data/mockData';

interface FooterProps {
  onSelectCategory: (catId: string) => void;
  onOpenPartnerModal: () => void;
  onOpenEmergencyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenPartnerModal,
  onOpenEmergencyModal,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Home className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight font-serif">
                Apna<span className="text-emerald-400">Ghar</span>
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Apna Ghar connects homeowners across India with background-verified local electricians, plumbers, painters, cleaners, and appliance technicians with instant upfront pricing and 30-day warranty.
            </p>

            <div className="flex items-center gap-3 text-xs text-stone-300 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Aadhaar Verified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-amber-400" />
                1800-123-4567
              </span>
            </div>
          </div>

          {/* Trade Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-serif">
              Home Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('electrical')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Electrical & Wiring
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('plumbing')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Plumbing & Leak Repair
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('painting')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Interior Wall Painting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cleaning')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Deep Home Cleaning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('ac_repair')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  AC Servicing & Gas Refill
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenEmergencyModal}
                  className="text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  24/7 Urgent Dispatch
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-serif">
              Company & Network
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPartnerModal}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Register as Professional Partner
                </button>
              </li>
              <li>
                <a href="#guarantee" className="hover:text-emerald-400 transition-colors">
                  30-Day Service Guarantee
                </a>
              </li>
              <li>
                <a href="#verification" className="hover:text-emerald-400 transition-colors">
                  Aadhaar & Police Verification
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-400 transition-colors">
                  Standard Rate Card
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-emerald-400 transition-colors">
                  Customer Care Hotline
                </a>
              </li>
            </ul>
          </div>

          {/* Service Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-serif">
              Operating Cities
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-400">
              {CITIES.map((city) => (
                <span
                  key={city}
                  className="px-2 py-1 rounded bg-stone-800 text-stone-300 font-medium"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Apna Ghar Technologies India Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-stone-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Homes
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
