import React from 'react';
import {
  Zap,
  Droplets,
  Paintbrush,
  Sparkles,
  Wind,
  Siren,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface CategoryGridProps {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
  onBookSubService: (categoryName: string, subserviceName: string) => void;
  onOpenEmergencyModal: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
  onBookSubService,
  onOpenEmergencyModal,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-blue-500" />;
      case 'Paintbrush':
        return <Paintbrush className="w-6 h-6 text-rose-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-emerald-500" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-cyan-500" />;
      case 'Siren':
        return <Siren className="w-6 h-6 text-amber-500" />;
      default:
        return <Zap className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section className="py-12 bg-stone-50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 mb-1">
              Explore Our Trade Categories
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
              What home service do you need today?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md">
            All services backed by flat upfront pricing, 30-day service guarantee, and free re-visit protection.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const isEmergencyCategory = category.isEmergency;

            return (
              <div
                key={category.id}
                className={`group rounded-2xl bg-white border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  isEmergencyCategory
                    ? 'border-amber-300 ring-2 ring-amber-500/20 shadow-md hover:shadow-xl bg-gradient-to-b from-amber-50/40 via-white to-white'
                    : 'border-stone-200 hover:border-emerald-300 hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Card Banner Image Header */}
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"></div>

                    {/* Badge */}
                    {category.badge && (
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-sm ${
                          isEmergencyCategory
                            ? 'bg-amber-600 text-white animate-pulse'
                            : 'bg-white text-stone-900'
                        }`}
                      >
                        {category.badge}
                      </span>
                    )}

                    {/* Category Title & Price on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md">
                          {getIcon(category.iconName)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white leading-tight font-serif">
                            {category.name}
                          </h3>
                          <span className="text-xs text-stone-200 font-medium">
                            Starts @ <strong className="text-emerald-300 font-extrabold text-sm">₹{category.startingPrice}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Popular Services Sub-list */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                        Popular Tasks:
                      </span>
                      <div className="space-y-1">
                        {category.popularServices.slice(0, 3).map((subservice, idx) => (
                          <button
                            key={idx}
                            onClick={() => onBookSubService(category.name, subservice)}
                            className="w-full text-left text-xs font-medium text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors flex items-center justify-between group/sub cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {subservice}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover/sub:text-emerald-600 transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-4 pt-0">
                  {isEmergencyCategory ? (
                    <button
                      onClick={onOpenEmergencyModal}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Siren className="w-4 h-4" />
                      <span>Request Urgent 24/7 Callout</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectCategory(category)}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:bg-emerald-700"
                    >
                      <span>Explore {category.name} Pros</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
