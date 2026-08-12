import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  XCircle,
  FileText,
  User,
  ArrowRight,
  Siren,
  Sparkles,
} from 'lucide-react';
import { Booking } from '../types';

interface BookingsListProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onOpenAIDiagnostic: () => void;
  onNavigateToServices: () => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  onCancelBooking,
  onOpenAIDiagnostic,
  onNavigateToServices,
}) => {
  return (
    <section className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
            <Calendar className="w-4 h-4" />
            <span>Service Schedule Tracker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
            My Service Bookings ({bookings.length})
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Track technician dispatch status, view contact details, or request changes.
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const isEmergency = booking.isEmergency;

              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs p-6 ${
                    isEmergency ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-stone-200'
                  }`}
                >
                  
                  {/* Top Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        isEmergency ? 'bg-amber-600 text-white animate-pulse' : 'bg-stone-900 text-white'
                      }`}>
                        {booking.id}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 font-serif">
                        {booking.serviceName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        Status: {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Live Progress Tracker Steps */}
                  {booking.status !== 'cancelled' && (
                    <div className="py-5 my-2 border-b border-stone-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block mb-3">
                        Live Dispatch Progress
                      </span>
                      <div className="grid grid-cols-4 gap-2 text-center relative">
                        <div className="space-y-1">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mx-auto">
                            ✓
                          </div>
                          <span className="text-[10px] font-bold text-stone-800 block">Confirmed</span>
                        </div>

                        <div className="space-y-1">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mx-auto">
                            ✓
                          </div>
                          <span className="text-[10px] font-bold text-stone-800 block">Pro Assigned</span>
                        </div>

                        <div className="space-y-1">
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center mx-auto animate-pulse">
                            •
                          </div>
                          <span className="text-[10px] font-bold text-amber-800 block">En Route</span>
                        </div>

                        <div className="space-y-1">
                          <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-400 text-xs font-bold flex items-center justify-center mx-auto">
                            4
                          </div>
                          <span className="text-[10px] font-medium text-stone-400 block">Job Finish</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    
                    {/* Left: Professional Info */}
                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                      <img
                        src={booking.proAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBxIis2YY8df7FFV8yXuBJDf9ECOpTwi7WUyql6vOj51oPuP6RaiElnJCNIPqOG3Pjr7ENMy5lf8pPAmHOxy_gp_T_4m06vsJp1Fb7i1P3mogXvVLaJsx9sRkpqEvCzS0hr8F9A78W3lH5CIEmAAGRJagUNRixjzpQJb52bRGi-WgMAGqU6ztFklRcZWtEa4CZiuq07fPFDLz22PfqS7Z9Km-Twzld8It_raB1SXfL8Io7dfsL-UvpnA'}
                        alt={booking.proName}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-stone-400 uppercase block">Assigned Technician</span>
                        <h4 className="text-sm font-bold text-stone-900 truncate">{booking.proName}</h4>
                        <a
                          href="tel:+919820012345"
                          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          Call Professional
                        </a>
                      </div>
                    </div>

                    {/* Right: Date, Time & Address */}
                    <div className="space-y-2 text-xs text-stone-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span><strong className="text-stone-900 font-semibold">{booking.date}</strong> ({booking.timeSlot})</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{booking.address}, {booking.city} - {booking.pincode}</span>
                      </div>

                      {booking.notes && (
                        <p className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg border border-stone-100">
                          Note: "{booking.notes}"
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500">Amount Payable:</span>
                      <strong className="text-emerald-700 text-sm font-extrabold">₹{booking.totalAmount}</strong>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase">({booking.paymentMethod})</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => onCancelBooking(booking.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-700 hover:bg-rose-50 transition-colors font-bold cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}

                      <button
                        onClick={() => alert(`Downloading official service receipt PDF for ${booking.id}...`)}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-600" />
                        Receipt
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif">No active bookings yet</h3>
            <p className="text-xs text-stone-500">
              When you schedule a technician or request emergency help, your active service progress will appear right here.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={onNavigateToServices}
                className="w-full py-2.5 px-4 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Browse All Services
              </button>
              <button
                onClick={onOpenAIDiagnostic}
                className="w-full py-2.5 px-4 bg-stone-100 text-stone-800 font-bold text-xs rounded-xl hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Try Ghar AI Diagnostic
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
