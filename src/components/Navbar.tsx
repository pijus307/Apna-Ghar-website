import React, { useState } from 'react';
import {
  Home,
  MapPin,
  Search,
  Siren,
  Sparkles,
  UserCheck,
  Briefcase,
  Calendar,
  Phone,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Bot,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { CITIES } from '../data/mockData';

interface NavbarProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookingCount: number;
  currentUser: FirebaseUser | null;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  onOpenAIDiagnostic: () => void;
  onOpenChatbot: () => void;
  onOpenEmergencyModal: () => void;
  onOpenPartnerModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onCityChange,
  activeTab,
  setActiveTab,
  bookingCount,
  currentUser,
  onGoogleSignIn,
  onSignOut,
  onOpenAIDiagnostic,
  onOpenChatbot,
  onOpenEmergencyModal,
  onOpenPartnerModal,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/80 shadow-xs backdrop-blur-md bg-white/95">
      {/* Top Banner Alert for Emergency / Support */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center flex items-center justify-between font-medium">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Apna Ghar Verification Guarantee: All Pros standard background-checked & insured.</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-200">
            <button
              onClick={onOpenPartnerModal}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Join as Professional
            </button>
            <span>•</span>
            <a href="tel:18001234567" className="hover:text-white transition-colors flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              Toll-Free: 1800-123-4567
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-all">
                <Home className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-stone-900 block leading-none font-serif">
                  Apna<span className="text-emerald-600">Ghar</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 block mt-0.5">
                  Trusted Local Pros
                </span>
              </div>
            </button>

            {/* City Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{currentCity}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isCityDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsCityDropdownOpen(false)}
                  ></div>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-xl z-20 py-1 text-sm animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                      Select City
                    </div>
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          onCityChange(city);
                          setIsCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-between cursor-pointer ${
                          city === currentCity ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-stone-700'
                        }`}
                      >
                        {city}
                        {city === currentCity && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              All Services
            </button>

            <button
              onClick={() => setActiveTab('pros')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pros'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Pros
            </button>

            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                activeTab === 'upcoming'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Upcoming Services</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                New
              </span>
            </button>

            <button
              onClick={onOpenChatbot}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all flex items-center gap-1.5 border border-emerald-200/80 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              Ghar AI Assistant
            </button>
          </nav>

          {/* Action Callouts & Firebase Auth & My Bookings */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Emergency Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="px-3 py-2 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Siren className="w-3.5 h-3.5" />
              <span>24/7 Emergency</span>
            </button>

            {/* My Bookings Button */}
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 relative cursor-pointer border ${
                activeTab === 'bookings'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>My Bookings</span>
              {bookingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Google Firebase Auth Button */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-all cursor-pointer"
                  >
                    <img
                      src={currentUser.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBxIis2YY8df7FFV8yXuBJDf9ECOpTwi7WUyql6vOj51oPuP6RaiElnJCNIPqOG3Pjr7ENMy5lf8pPAmHOxy_gp_T_4m06vsJp1Fb7i1P3mogXvVLaJsx9sRkpqEvCzS0hr8F9A78W3lH5CIEmAAGRJagUNRixjzpQJb52bRGi-WgMAGqU6ztFklRcZWtEa4CZiuq07fPFDLz22PfqS7Z9Km-Twzld8It_raB1SXfL8Io7dfsL-UvpnA'}
                      alt={currentUser.displayName || 'User'}
                      className="w-7 h-7 rounded-lg object-cover border border-stone-200"
                    />
                    <span className="text-xs font-bold text-stone-800 max-w-[80px] truncate hidden md:inline">
                      {currentUser.displayName?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-stone-400 mr-1" />
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl z-20 py-2 text-xs space-y-1 animate-in fade-in">
                        <div className="px-3 py-1.5 border-b border-stone-100">
                          <p className="font-bold text-stone-900 truncate">{currentUser.displayName}</p>
                          <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('bookings');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-stone-500" />
                          <span>My Bookings History</span>
                        </button>
                        <button
                          onClick={() => {
                            onSignOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-stone-100"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={onGoogleSignIn}
                  className="px-3 py-2 rounded-lg text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Sign-In</span>
                </button>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenChatbot}
              className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800"
              title="Ghar AI Assistant"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-stone-100 text-stone-800 text-center"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab('services');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-stone-100 text-stone-800 text-center"
            >
              All Services
            </button>
            <button
              onClick={() => {
                setActiveTab('pros');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-stone-100 text-stone-800 text-center flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Pros
            </button>
            <button
              onClick={() => {
                setActiveTab('bookings');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-stone-100 text-stone-800 text-center flex items-center justify-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              Bookings ({bookingCount})
            </button>
            <button
              onClick={() => {
                setActiveTab('upcoming');
                setIsMobileMenuOpen(false);
              }}
              className="col-span-2 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 text-center flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Upcoming & Seasonal Services</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">NEW</span>
            </button>
          </div>

          <button
            onClick={() => {
              onOpenChatbot();
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            Launch Ghar AI Maintenance Chatbot
          </button>

          <button
            onClick={() => {
              onOpenEmergencyModal();
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 text-white flex items-center justify-center gap-2 shadow-sm"
          >
            <Siren className="w-4 h-4" />
            24/7 Immediate Emergency Help
          </button>

          {currentUser ? (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBxIis2YY8df7FFV8yXuBJDf9ECOpTwi7WUyql6vOj51oPuP6RaiElnJCNIPqOG3Pjr7ENMy5lf8pPAmHOxy_gp_T_4m06vsJp1Fb7i1P3mogXvVLaJsx9sRkpqEvCzS0hr8F9A78W3lH5CIEmAAGRJagUNRixjzpQJb52bRGi-WgMAGqU6ztFklRcZWtEa4CZiuq07fPFDLz22PfqS7Z9Km-Twzld8It_raB1SXfL8Io7dfsL-UvpnA'}
                  alt="User"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-xs font-bold text-stone-800">{currentUser.displayName}</span>
              </div>
              <button
                onClick={() => {
                  onSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-rose-600 px-2 py-1 bg-rose-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onGoogleSignIn();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-stone-900 text-white flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              Sign In with Google Account
            </button>
          )}

          <button
            onClick={() => {
              onOpenPartnerModal();
              setIsMobileMenuOpen(false);
            }}
            className="w-full py-2 px-4 text-xs text-stone-600 flex items-center justify-center gap-2 border border-stone-200 rounded-lg"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Register as Professional Partner
          </button>
        </div>
      )}
    </header>
  );
};
