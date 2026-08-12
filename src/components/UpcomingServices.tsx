import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Bell,
  CheckCircle2,
  Tag,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gift,
  Search,
  ThumbsUp,
  MapPin,
  MessageSquare,
  Send,
  Star,
  Download,
  AlertCircle,
  Siren,
  Phone,
} from 'lucide-react';
import { Booking, UpcomingService } from '../types';
import { UPCOMING_SERVICES } from '../data/mockData';

interface UpcomingServicesProps {
  currentCity: string;
  userBookings: Booking[];
  onNavigateToServices: () => void;
  onOpenAIDiagnostic: () => void;
  onBookUpcomingService: (service: UpcomingService) => void;
}

export const UpcomingServices: React.FC<UpcomingServicesProps> = ({
  currentCity,
  userBookings,
  onNavigateToServices,
  onOpenAIDiagnostic,
  onBookUpcomingService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [interestedMap, setInterestedMap] = useState<Record<string, boolean>>({});
  const [interestedCounts, setInterestedCounts] = useState<Record<string, number>>(
    UPCOMING_SERVICES.reduce((acc, item) => ({ ...acc, [item.id]: item.interestedCount }), {})
  );

  // Community Service Request Suggestion
  const [userSuggestion, setUserSuggestion] = useState<string>('');
  const [submittedSuggestions, setSubmittedSuggestions] = useState<string[]>([
    'Solar Water Heater Cleaning in Bandra',
    'Chandelier Assembly & Ceiling Anchor Testing',
  ]);
  const [isSuggestionSubmitted, setIsSuggestionSubmitted] = useState<boolean>(false);

  // Pre-Book Launch Pass Voucher Modal
  const [activePrebookService, setActivePrebookService] = useState<UpcomingService | null>(null);
  const [prebookSuccessCode, setPrebookSuccessCode] = useState<string | null>(null);

  // Filter user bookings that are upcoming (not cancelled and not completed)
  const upcomingBookings = userBookings.filter(
    (b) => b.status !== 'cancelled' && b.status !== 'completed'
  );

  const categories = [
    'All',
    'Electrical & Smart Home',
    'Plumbing & Water Care',
    'Carpentry & Furniture',
    'Pest Control',
    'Painting & Waterproofing',
    'Home Cleaning',
    'AC & Appliance Care',
    'Solar & Renewable',
    'Gardening & Outdoor',
  ];

  const filteredUpcomingServices = UPCOMING_SERVICES.filter((service) => {
    if (selectedCategory === 'All') return true;
    return service.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleToggleInterest = (id: string) => {
    setInterestedMap((prev) => {
      const isCurrentlyInterested = !!prev[id];
      const nextState = !isCurrentlyInterested;

      setInterestedCounts((counts) => ({
        ...counts,
        [id]: counts[id] + (nextState ? 1 : -1),
      }));

      return {
        ...prev,
        [id]: nextState,
      };
    });
  };

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSuggestion.trim()) return;
    setSubmittedSuggestions((prev) => [userSuggestion.trim(), ...prev]);
    setUserSuggestion('');
    setIsSuggestionSubmitted(true);
    setTimeout(() => setIsSuggestionSubmitted(false), 4000);
  };

  const handleConfirmPrebook = (service: UpcomingService) => {
    const randomCoupon = `AG-EARLY-${Math.floor(1000 + Math.random() * 9000)}`;
    setPrebookSuccessCode(randomCoupon);
    onBookUpcomingService(service);
  };

  const handleDownloadCalendarInvite = (booking: Booking) => {
    const title = encodeURIComponent(`Apna Ghar Service: ${booking.serviceName}`);
    const details = encodeURIComponent(`Technician: ${booking.proName || 'Assigned Pro'}. Address: ${booking.address}, ${booking.city}`);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    window.open(googleCalUrl, '_blank');
  };

  return (
    <section className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seasonal & Next-Gen Service Launchpad</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-stone-100">
              Upcoming Services for {currentCity}
            </h1>

            <p className="text-sm text-stone-300 leading-relaxed">
              Explore upcoming seasonal home maintenance, eco-energy upgrades, smart home automation, and pre-book early-bird launch slots with exclusive 15-20% discount passes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Priority Slot Reservation</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Early Bird Discount Passes</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Prepayment Penalty</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Active & Scheduled Appointments (Your Upcoming Visits) */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Scheduled Appointments</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif mt-1">
                Your Upcoming Service Visits ({upcomingBookings.length})
              </h2>
            </div>

            <button
              onClick={onNavigateToServices}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              Book New Service Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 hover:border-emerald-300 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                        {booking.id}
                      </span>
                      <h3 className="text-base font-bold text-stone-900 font-serif mt-1">
                        {booking.serviceName}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">{booking.category}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-stone-900 block">
                        ₹{booking.totalAmount}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Scheduled Date & Time */}
                  <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-stone-900 block">{booking.date}</span>
                        <span className="text-stone-500 text-[11px]">{booking.timeSlot}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadCalendarInvite(booking)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Add to Google Calendar"
                    >
                      <Download className="w-3 h-3 text-stone-500" />
                      Add to Cal
                    </button>
                  </div>

                  {/* Technician Info & Address */}
                  <div className="flex items-center justify-between pt-1 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <img
                        src={booking.proAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBxIis2YY8df7FFV8yXuBJDf9ECOpTwi7WUyql6vOj51oPuP6RaiElnJCNIPqOG3Pjr7ENMy5lf8pPAmHOxy_gp_T_4m06vsJp1Fb7i1P3mogXvVLaJsx9sRkpqEvCzS0hr8F9A78W3lH5CIEmAAGRJagUNRixjzpQJb52bRGi-WgMAGqU6ztFklRcZWtEa4CZiuq07fPFDLz22PfqS7Z9Km-Twzld8It_raB1SXfL8Io7dfsL-UvpnA'}
                        alt={booking.proName || 'Technician'}
                        className="w-7 h-7 rounded-lg object-cover border border-stone-200"
                      />
                      <span className="font-bold text-stone-900">{booking.proName || 'Assigned Pro'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate max-w-[150px]">{booking.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-3">
              <Calendar className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800 font-serif">No active upcoming appointments</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                You don't have any scheduled technician visits right now. Book a service or pre-book an upcoming launch below.
              </p>
              <button
                onClick={onNavigateToServices}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Browse Standard Home Services
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: Upcoming Services Launchpad (Seasonal & Smart Upgrades) */}
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-widest">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Upcoming Catalog & Pre-Book Vouchers</span>
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 font-serif mt-1">
                Seasonal & Next-Gen Services Coming to {currentCity}
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUpcomingServices.map((service) => {
              const isInterested = !!interestedMap[service.id];
              const count = interestedCounts[service.id] || service.interestedCount;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  {/* Image Header with Badge */}
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>

                      {/* Launch Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {service.badge}
                      </div>

                      {/* Launch Date Tag */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-stone-900/90 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Launches {service.launchDate}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px]">
                          {service.category}
                        </span>
                        {service.discountPercentage && (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                            {service.discountPercentage}% Early Bird Discount
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-stone-900 font-serif leading-snug">
                        {service.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Key Features List */}
                      <div className="space-y-1 pt-1">
                        {service.keyFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-stone-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-5 pt-0 space-y-3">
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 font-semibold block">Expected Price</span>
                        <span className="text-sm font-extrabold text-stone-900">
                          ₹{service.expectedStartingPrice}{' '}
                          <span className="text-[10px] font-normal text-stone-500">starting</span>
                        </span>
                      </div>

                      {/* Express Interest Button */}
                      <button
                        onClick={() => handleToggleInterest(service.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                          isInterested
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isInterested ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                        <span>{count} Interested</span>
                      </button>
                    </div>

                    {/* Pre-Book Launch Pass Button */}
                    <button
                      onClick={() => handleConfirmPrebook(service)}
                      className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Gift className="w-4 h-4 text-emerald-200" />
                      <span>Pre-Book Launch Pass (Save {service.discountPercentage || 15}%)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* SECTION 3: Community Wishlist & Request a Service in Your City */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Community Wishlist</span>
              </div>
              <h2 className="text-2xl font-extrabold font-serif text-stone-100">
                Need a Special Service in {currentCity}?
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Tell us what specialized repair or installation service you want added to Apna Ghar. Our local vendor network will onboard verified technicians within 7 days.
              </p>
            </div>

            <form onSubmit={handleSubmitSuggestion} className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="e.g. Solar panel repair, Gas pipeline check..."
                value={userSuggestion}
                onChange={(e) => setUserSuggestion(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Idea</span>
              </button>
            </form>
          </div>

          {isSuggestionSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Thank you! Your suggestion was added to the {currentCity} service launch voting queue.</span>
            </div>
          )}

          {/* Recent Community Ideas List */}
          <div className="pt-4 border-t border-stone-800">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest block mb-3">
              Popular Resident Requests in {currentCity}:
            </span>
            <div className="flex flex-wrap gap-2">
              {submittedSuggestions.map((sug, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5"
                >
                  <ThumbsUp className="w-3 h-3 text-emerald-400" />
                  {sug}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Early-Bird Pre-Booking Success Modal */}
      {prebookSuccessCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 text-center shadow-2xl border border-stone-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Gift className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-stone-900 font-serif">
                Launch Pass Voucher Unlocked!
              </h3>
              <p className="text-xs text-stone-600">
                You are registered for priority launch dispatch in {currentCity}. Use code below for 20% OFF when launching:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-100 border border-dashed border-stone-300 font-mono text-lg font-black tracking-wider text-emerald-800">
              {prebookSuccessCode}
            </div>

            <p className="text-[11px] text-stone-500">
              No advance payment charged today. We will send an SMS and WhatsApp notification 24 hours prior to launch!
            </p>

            <button
              onClick={() => setPrebookSuccessCode(null)}
              className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
