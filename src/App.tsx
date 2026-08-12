import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { ProDirectory } from './components/ProDirectory';
import { BookingsList } from './components/BookingsList';
import { UpcomingServices } from './components/UpcomingServices';
import { AIDiagnosticModal } from './components/AIDiagnosticModal';
import { EmergencyModal } from './components/EmergencyModal';
import { BookingModal } from './components/BookingModal';
import { PartnerOnboardingModal } from './components/PartnerOnboardingModal';
import { GharChatbotModal } from './components/GharChatbotModal';
import { CustomerTestimonials } from './components/CustomerTestimonials';
import { Footer } from './components/Footer';

import {
  SERVICE_CATEGORIES,
  PROFESSIONALS,
  INITIAL_BOOKINGS,
} from './data/mockData';
import { Booking, Professional, ServiceCategory, UpcomingService } from './types';
import { ArrowRight, Bot } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  logoutUser,
  subscribeToUserBookings,
  saveBookingToFirestore,
  updateBookingStatusInFirestore,
} from './lib/firebase';

export function App() {
  const [currentCity, setCurrentCity] = useState<string>('Mumbai');
  const [activeTab, setActiveTab] = useState<string>('home'); // 'home' | 'services' | 'pros' | 'bookings'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Firebase User State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Bookings state (initialized with mock, updated with Firestore if logged in)
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Modals state
  const [isAIDiagnosticOpen, setIsAIDiagnosticOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Booking pre-selections
  const [preselectedCategory, setPreselectedCategory] = useState<ServiceCategory | null>(null);
  const [preselectedPro, setPreselectedPro] = useState<Professional | null>(null);
  const [preselectedSubservice, setPreselectedSubservice] = useState<string | null>(null);
  const [preselectedDiagnosisInfo, setPreselectedDiagnosisInfo] = useState<{
    summary: string;
    costRange: string;
  } | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to user Firestore bookings when logged in
  useEffect(() => {
    if (currentUser) {
      const unsub = subscribeToUserBookings(currentUser.uid, (firestoreBookings) => {
        if (firestoreBookings.length > 0) {
          setBookings(firestoreBookings);
        }
      });
      return () => unsub();
    }
  }, [currentUser]);

  // Auth Handlers
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      alert('Sign-In failed: ' + err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setBookings(INITIAL_BOOKINGS);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  // Service Selection Handlers
  const handleSelectCategoryFromHero = (categoryId: string) => {
    const foundCat = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
    if (foundCat) {
      if (foundCat.isEmergency) {
        setIsEmergencyModalOpen(true);
      } else {
        setPreselectedCategory(foundCat);
        setPreselectedPro(null);
        setPreselectedSubservice(null);
        setPreselectedDiagnosisInfo(null);
        setIsBookingModalOpen(true);
      }
    }
  };

  const handleSelectCategoryCard = (category: ServiceCategory) => {
    if (category.isEmergency) {
      setIsEmergencyModalOpen(true);
    } else {
      setSelectedCategoryFilter(category.name);
      setActiveTab('pros');
    }
  };

  const handleBookSubService = (categoryName: string, subserviceName: string) => {
    const foundCat = SERVICE_CATEGORIES.find((c) => c.name === categoryName);
    setPreselectedCategory(foundCat || null);
    setPreselectedPro(null);
    setPreselectedSubservice(subserviceName);
    setPreselectedDiagnosisInfo(null);
    setIsBookingModalOpen(true);
  };

  const handleBookProDirect = (pro: Professional) => {
    setPreselectedPro(pro);
    setPreselectedCategory(null);
    setPreselectedSubservice(null);
    setPreselectedDiagnosisInfo(null);
    setIsBookingModalOpen(true);
  };

  const handleBookWithDiagnosis = (
    categoryName: string,
    summary: string,
    costRange: string
  ) => {
    const foundCat = SERVICE_CATEGORIES.find(
      (c) =>
        c.name.toLowerCase().includes(categoryName.toLowerCase()) ||
        categoryName.toLowerCase().includes(c.name.toLowerCase())
    );
    setPreselectedCategory(foundCat || SERVICE_CATEGORIES[0]);
    setPreselectedPro(null);
    setPreselectedSubservice(`AI Recommended: ${summary.slice(0, 40)}...`);
    setPreselectedDiagnosisInfo({ summary, costRange });
    setIsBookingModalOpen(true);
  };

  const handleBookUpcomingService = (service: UpcomingService) => {
    const foundCat = SERVICE_CATEGORIES.find(
      (c) => c.name.toLowerCase().includes(service.category.toLowerCase()) || service.category.toLowerCase().includes(c.name.toLowerCase())
    );
    setPreselectedCategory(foundCat || SERVICE_CATEGORIES[0]);
    setPreselectedPro(null);
    setPreselectedSubservice(`[Launch Pass Pre-Book] ${service.title}`);
    setPreselectedDiagnosisInfo({
      summary: `Pre-booking for launch on ${service.launchDate}. Includes early-bird discount pass.`,
      costRange: `₹${service.expectedStartingPrice}`,
    });
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Save to Firestore if user logged in
    if (currentUser) {
      try {
        await saveBookingToFirestore(currentUser.uid, newBooking);
      } catch (err) {
        console.error('Error saving booking to Firestore:', err);
      }
    }

    setActiveTab('bookings');
  };

  const handleCancelBooking = async (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
    );

    if (currentUser) {
      try {
        await updateBookingStatusInFirestore(currentUser.uid, id, 'cancelled');
      } catch (err) {
        console.error('Error updating booking status in Firestore:', err);
      }
    }
  };

  const categoryNamesList = SERVICE_CATEGORIES.map((c) => c.name);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 antialiased selection:bg-emerald-200 selection:text-emerald-900 relative">
      
      {/* Primary Header Navbar */}
      <Navbar
        currentCity={currentCity}
        onCityChange={(city) => setCurrentCity(city)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'services') setSelectedCategoryFilter('All');
        }}
        bookingCount={bookings.filter((b) => b.status !== 'cancelled').length}
        currentUser={currentUser}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
        onOpenAIDiagnostic={() => setIsAIDiagnosticOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
      />

      {/* Floating Action Button for AI Chatbot */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-600 text-white shadow-2xl hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer border-2 border-white"
        title="Open Ghar AI Maintenance Assistant"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="text-xs font-extrabold hidden sm:inline pr-1">Ask Ghar AI</span>
      </button>

      {/* Main View Router */}
      <main>
        {activeTab === 'home' && (
          <>
            <HeroSection
              currentCity={currentCity}
              onSearch={() => {
                setSelectedCategoryFilter('All');
                setActiveTab('pros');
              }}
              onSelectCategory={handleSelectCategoryFromHero}
              onOpenAIDiagnostic={() => setIsAIDiagnosticOpen(true)}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />

            <CategoryGrid
              categories={SERVICE_CATEGORIES}
              onSelectCategory={handleSelectCategoryCard}
              onBookSubService={handleBookSubService}
              onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            />

            {/* Featured Local Pros Preview */}
            <section className="py-12 bg-white border-b border-stone-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 mb-1">
                      Aadhaar & Police Background Checked
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
                      Top Verified Professionals in {currentCity}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('All');
                      setActiveTab('pros');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All {PROFESSIONALS.length}+ Professionals Near You
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PROFESSIONALS.slice(0, 3).map((pro) => (
                    <div
                      key={pro.id}
                      className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-300 hover:shadow-xl transition-all space-y-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={pro.avatarUrl}
                          alt={pro.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-stone-900 truncate font-serif">{pro.name}</h3>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              ★ {pro.rating}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 font-medium truncate">{pro.title}</p>
                          <span className="text-[11px] text-stone-400 block mt-0.5">{pro.location}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 italic">
                        "{pro.bio}"
                      </p>

                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          ₹{pro.startingPrice} <span className="text-[10px] font-normal text-stone-500">/ visit</span>
                        </span>
                        <button
                          onClick={() => handleBookProDirect(pro)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Book {pro.name.split(' ')[0]}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <CustomerTestimonials />
          </>
        )}

        {(activeTab === 'services' || activeTab === 'pros') && (
          <ProDirectory
            professionals={PROFESSIONALS}
            categories={categoryNamesList}
            currentCity={currentCity}
            selectedCategoryFilter={selectedCategoryFilter}
            onBookPro={handleBookProDirect}
            onOpenAIDiagnostic={() => setIsAIDiagnosticOpen(true)}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsList
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onOpenAIDiagnostic={() => setIsAIDiagnosticOpen(true)}
            onNavigateToServices={() => {
              setSelectedCategoryFilter('All');
              setActiveTab('services');
            }}
          />
        )}

        {activeTab === 'upcoming' && (
          <UpcomingServices
            currentCity={currentCity}
            userBookings={bookings}
            onNavigateToServices={() => {
              setSelectedCategoryFilter('All');
              setActiveTab('services');
            }}
            onOpenAIDiagnostic={() => setIsAIDiagnosticOpen(true)}
            onBookUpcomingService={handleBookUpcomingService}
          />
        )}
      </main>

      {/* Global Modals */}
      <AIDiagnosticModal
        currentCity={currentCity}
        isOpen={isAIDiagnosticOpen}
        onClose={() => setIsAIDiagnosticOpen(false)}
        onBookWithDiagnosis={handleBookWithDiagnosis}
      />

      <GharChatbotModal
        currentCity={currentCity}
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      <EmergencyModal
        currentCity={currentCity}
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onConfirmEmergencyBooking={handleConfirmBooking}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        currentCity={currentCity}
        preselectedCategory={preselectedCategory}
        preselectedPro={preselectedPro}
        preselectedSubservice={preselectedSubservice}
        preselectedDiagnosisInfo={preselectedDiagnosisInfo}
        onConfirmBooking={handleConfirmBooking}
      />

      <PartnerOnboardingModal
        currentCity={currentCity}
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        userId={currentUser?.uid}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(catId) => handleSelectCategoryFromHero(catId)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

    </div>
  );
}

export default App;
