import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  X,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { Booking, Professional, ServiceCategory } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  preselectedCategory?: ServiceCategory | null;
  preselectedPro?: Professional | null;
  preselectedSubservice?: string | null;
  preselectedDiagnosisInfo?: { summary: string; costRange: string } | null;
  onConfirmBooking: (booking: Booking) => void;
}

const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '04:00 PM - 05:00 PM',
  '06:00 PM - 07:00 PM',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  preselectedCategory,
  preselectedPro,
  preselectedSubservice,
  preselectedDiagnosisInfo,
  onConfirmBooking,
}) => {
  const [selectedSubservice, setSelectedSubservice] = useState(
    preselectedSubservice || preselectedCategory?.popularServices[0] || 'Standard Inspection & Repair'
  );
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1]);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('400050');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card'>('upi');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const categoryName = preselectedPro?.category || preselectedCategory?.name || 'Home Service';
  const price = preselectedPro?.startingPrice || preselectedCategory?.startingPrice || 199;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !address) return;

    const newBooking: Booking = {
      id: `AG-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceName: `${categoryName}: ${selectedSubservice}`,
      category: categoryName,
      proId: preselectedPro?.id || 'pro-1',
      proName: preselectedPro?.name || 'Rahul Das (Auto-Assigned)',
      proAvatar: preselectedPro?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBxIis2YY8df7FFV8yXuBJDf9ECOpTwi7WUyql6vOj51oPuP6RaiElnJCNIPqOG3Pjr7ENMy5lf8pPAmHOxy_gp_T_4m06vsJp1Fb7i1P3mogXvVLaJsx9sRkpqEvCzS0hr8F9A78W3lH5CIEmAAGRJagUNRixjzpQJb52bRGi-WgMAGqU6ztFklRcZWtEa4CZiuq07fPFDLz22PfqS7Z9Km-Twzld8It_raB1SXfL8Io7dfsL-UvpnA',
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      address: address,
      city: currentCity,
      pincode: pincode,
      phone: phone,
      notes: notes,
      status: 'assigned',
      totalAmount: price,
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString(),
    };

    onConfirmBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl relative p-6 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-stone-100 pb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
            Schedule Professional Visit
          </span>
          <h3 className="text-xl font-extrabold text-stone-900 font-serif">
            Book {categoryName}
          </h3>
          {preselectedPro && (
            <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5 mt-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct booking with <strong className="text-stone-800">{preselectedPro.name}</strong>
            </p>
          )}
        </div>

        {/* Diagnosis callout if coming from AI */}
        {preselectedDiagnosisInfo && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
            <span className="font-extrabold text-emerald-900 uppercase tracking-wider block text-[10px]">
              Ghar AI Diagnosis attached
            </span>
            <p className="text-stone-700 italic font-medium">"{preselectedDiagnosisInfo.summary}"</p>
            <span className="text-stone-500 font-bold block mt-1">
              Estimated Range: {preselectedDiagnosisInfo.costRange}
            </span>
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="space-y-5">
          
          {/* Subservice Selection */}
          {preselectedCategory?.popularServices && preselectedCategory.popularServices.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Select Specific Task:
              </label>
              <select
                value={selectedSubservice}
                onChange={(e) => setSelectedSubservice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-semibold cursor-pointer"
              >
                {preselectedCategory.popularServices.map((task, idx) => (
                  <option key={idx} value={task}>
                    {task}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date & Time Slot Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Select Preferred Date & Slot:
            </label>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              {['Today', 'Tomorrow', 'Day After'].map((dateOpt) => (
                <button
                  key={dateOpt}
                  type="button"
                  onClick={() => setSelectedDate(dateOpt)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedDate === dateOpt
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {dateOpt}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedTimeSlot === slot
                      ? 'border-emerald-600 bg-emerald-600 text-white font-bold'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Contact & Address */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Your Phone Number (For SMS Updates):
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Full House Address in {currentCity}:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat No, Building, Street..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Pincode:
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800 font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                Work Instructions / Notes (Optional):
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Ring bell twice, bring ladder if possible"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none text-stone-800"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Payment Method:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 bg-stone-50 text-stone-600'
                }`}
              >
                <span>GPay / UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 bg-stone-50 text-stone-600'
                }`}
              >
                <span>Pay After Job</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 bg-stone-50 text-stone-600'
                }`}
              >
                <span>Debit / Credit</span>
              </button>
            </div>
          </div>

          {/* Pricing Breakdown Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Standard Visiting & Inspection Fee</span>
              <span>₹{price}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Safety & Insurance Protection</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-bold text-sm text-stone-900">
              <span>Total Payable</span>
              <span className="text-emerald-700 text-base">₹{price}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm & Place Booking</span>
          </button>
        </form>

      </div>
    </div>
  );
};
