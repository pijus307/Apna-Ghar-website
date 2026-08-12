import React, { useState } from 'react';
import {
  Briefcase,
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Phone,
  User,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { savePartnerApplication } from '../lib/firebase';

interface PartnerOnboardingModalProps {
  currentCity: string;
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const PartnerOnboardingModal: React.FC<PartnerOnboardingModalProps> = ({
  currentCity,
  isOpen,
  onClose,
  userId,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [trade, setTrade] = useState('Electrical');
  const [experienceYears, setExperienceYears] = useState('5');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    try {
      await savePartnerApplication({
        fullName,
        phone,
        trade,
        experienceYears,
        city: currentCity,
        userId: userId || '',
      });
    } catch (err) {
      console.error('Error saving partner application:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl relative p-6 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setSubmitted(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-md shrink-0">
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
              Partner Network
            </span>
            <h3 className="text-xl font-extrabold text-stone-900 font-serif">
              Grow Your Business with Apna Ghar
            </h3>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmitPartner} className="space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              Join 12,000+ verified local electricians, plumbers, and technicians earning steady monthly income with weekly payouts in {currentCity}.
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Full Name:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Mobile Number:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Primary Trade:
                </label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-semibold cursor-pointer"
                >
                  <option value="Electrical">Electrician</option>
                  <option value="Plumbing">Plumber</option>
                  <option value="Painting">Painter</option>
                  <option value="Home Cleaning">Cleaning Specialist</option>
                  <option value="AC & Appliance">AC / Appliance Tech</option>
                  <option value="Emergency Services">Emergency Locksmith / Expert</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Operating City:
                </label>
                <input
                  type="text"
                  value={currentCity}
                  disabled
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Experience (Years):
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white outline-none font-semibold text-stone-800"
                />
              </div>
            </div>

            {/* Verification Checklist Teaser */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5 text-xs">
              <span className="font-bold text-emerald-900 block uppercase tracking-wider text-[10px]">
                Partner Verification Requirements:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-700">
                <span className="flex items-center gap-1">✓ Valid Aadhaar Card</span>
                <span className="flex items-center gap-1">✓ Police Verification Certificate</span>
                <span className="flex items-center gap-1">✓ Trade License (if applicable)</span>
                <span className="flex items-center gap-1">✓ Smartphone for Partner App</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Application...' : 'Submit Partner Application'}</span>
            </button>
          </form>
        ) : (
          /* Submission Success Pipeline Preview */
          <div className="space-y-6 text-center animate-in fade-in py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-stone-900 font-serif">Application Received!</h4>
              <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                Thank you, <strong className="text-stone-900">{fullName}</strong>. Our partner manager in {currentCity} will call you on <strong className="text-stone-900">{phone}</strong> within 24 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2.5">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                Next Onboarding Steps:
              </span>

              <div className="space-y-2 text-xs text-stone-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>Document verification call on phone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>In-person trade skill evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Background check & insurance setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                  <span>Apna Ghar Partner App Activation</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
