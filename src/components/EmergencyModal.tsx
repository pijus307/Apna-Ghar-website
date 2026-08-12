import React, { useState } from 'react';
import {
  Siren,
  PhoneCall,
  Clock,
  ShieldAlert,
  X,
  Zap,
  Droplets,
  Key,
  Flame,
  CheckCircle2,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Booking } from '../types';

interface EmergencyModalProps {
  currentCity: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmEmergencyBooking: (booking: Booking) => void;
}

const EMERGENCY_TYPES = [
  { id: 'lockout', title: 'Door Lockout / Locked Outside', icon: Key, estTime: '15 mins' },
  { id: 'water_leak', title: 'Burst Pipe / Major Water Flood', icon: Droplets, estTime: '20 mins' },
  { id: 'short_circuit', title: 'Main MCB Trip / Electric Sparking', icon: Zap, estTime: '15 mins' },
  { id: 'appliance_smoke', title: 'Appliance Smell / Gas Cylinder Leak Safety', icon: Flame, estTime: '10 mins' },
];

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  currentCity,
  isOpen,
  onClose,
  onConfirmEmergencyBooking,
}) => {
  const [selectedEmergency, setSelectedEmergency] = useState(EMERGENCY_TYPES[0].id);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmitEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) return;

    const chosenType = EMERGENCY_TYPES.find((t) => t.id === selectedEmergency);

    const newBooking: Booking = {
      id: `EMG-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceName: `24/7 Emergency: ${chosenType?.title || 'Urgent Help'}`,
      category: 'Emergency Services',
      proName: 'Deepak Verma (Dispatched)',
      proAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB83rfbo7Xcw2rS3l3DgMGybLfygA09SMzlvZNv7QPzJ_6NTlK_6qlYJzl_IssdzHlZZ3zAgJwn2b60vRui-ey8Z9wOSSoHiGmBhQpfAeJWjHRwtWon2DkPEv9xu9m7rpVmz8Tv9TtZTvoDD2H0lgyXi1ZOA3sIHWjIqwN-GvVauuinbYdOxLZsgB9pjC9kyYlEztfemS23M2-8_dv-O_NadzxaHWDI_6_B1UTWo238rPoELU7d-w47iw',
      date: 'Immediate (Today)',
      timeSlot: 'Dispatched (Arriving in 15-20 mins)',
      address: address,
      city: currentCity,
      pincode: '400001',
      phone: phone,
      notes: notes,
      status: 'assigned',
      totalAmount: 399,
      paymentMethod: 'cash',
      createdAt: new Date().toISOString(),
      isEmergency: true,
    };

    onConfirmEmergencyBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border-2 border-amber-500 shadow-2xl relative p-6 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg animate-pulse shrink-0">
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-stone-900 font-serif">
              24/7 Urgent Dispatch Hotline
            </h3>
            <p className="text-xs text-amber-800 font-bold">
              Immediate On-Call Technician in {currentCity} (Under 20 Mins)
            </p>
          </div>
        </div>

        {/* Toll Free Direct Callout Banner */}
        <a
          href="tel:18001234567"
          className="p-4 rounded-2xl bg-stone-900 text-white flex items-center justify-between hover:bg-stone-800 transition-all shadow-md group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Direct Phone Line</span>
              <span className="text-base font-extrabold text-amber-300">1800-123-4567</span>
            </div>
          </div>
          <span className="text-xs font-bold text-white bg-amber-600 px-3 py-1.5 rounded-lg group-hover:bg-amber-500 transition-colors">
            Call Operator
          </span>
        </a>

        {/* Emergency Form */}
        <form onSubmit={handleSubmitEmergency} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Select Emergency Scenario:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {EMERGENCY_TYPES.map((item) => {
                const IconComp = item.icon;
                const isSelected = selectedEmergency === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedEmergency(item.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold ring-2 ring-amber-500/20'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-700' : 'text-stone-500'}`} />
                      <span className="text-xs font-semibold">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                      ETA: {item.estTime}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              Your Mobile Number (For Call Confirmation):
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-600 outline-none text-stone-800 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              Exact Address in {currentCity}:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat No, Building Name, Street, Landmark..."
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-amber-600 outline-none text-stone-800 font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              Additional Details (Optional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Front door latch jammed, main switch sparked"
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white outline-none text-stone-800"
            />
          </div>

          {/* Pricing Disclaimer */}
          <div className="p-3 rounded-xl bg-stone-100 text-stone-600 text-[11px] flex items-center justify-between font-medium">
            <span>Emergency Night / Priority Visit Fee:</span>
            <strong className="text-stone-900 font-extrabold text-xs">₹399 (Flat)</strong>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Siren className="w-4 h-4" />
            <span>Dispatch Nearest Technician Now</span>
          </button>
        </form>

      </div>
    </div>
  );
};
