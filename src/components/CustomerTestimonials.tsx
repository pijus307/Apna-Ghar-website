import React from 'react';
import { Star, Quote, ShieldCheck, ThumbsUp } from 'lucide-react';

export const CustomerTestimonials: React.FC = () => {
  const testimonials = [
    {
      id: 't-1',
      name: 'Ananya Deshmukh',
      city: 'Mumbai',
      service: 'Electrical & AC Jet Wash',
      comment: 'Rahul arrived exactly on time for the AC jet service. He protected our furniture with plastic sheets before washing and explained the gas pressure levels clearly. 10/10 service!',
      rating: 5,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuObn7FU02XsVoDKnPBcE1nsKUIuifa8I1Jfs24EWX-1ZE-5Jl7-b6TwoI2-6F6n8_FEpIOuYjJzRnpu9XXDtqmBhRRI95egW8P0oOhG8aFubIHvex5Lt67gK20zu1RwizdOAsKZm7sMYHBMRxMS_y-6d2mDL0N46ur7LAQ6Y_4lfwpqmJVAYc5qHiGfkdlB7WheSn1e0gle2sD6qw4-L6V0VSpUCClt-htFT2Nk5XtG3t0uEa6mI6Oyw',
    },
    {
      id: 't-2',
      name: 'Vikramaditya Sen',
      city: 'Bengaluru',
      service: 'Urgent Plumbing Leak',
      comment: 'A major pipe under our kitchen sink burst at 9 PM on a Sunday. Used Apna Ghar 24/7 Emergency and Amit arrived within 20 minutes! Saved us thousands in floor damage.',
      rating: 5,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAArX-sqATaJ4MpHEBmIYvj2wXi_KppxHk9c1zKZV0w7AMBCnR9kPuhL-NVeC-f_sGEAYg0A0_wkvYJXHhQSwJmb5H0GAlq4U3pVsm6BisLYaTZEfV04iNVe3BlPk61NRncvVUawU2rVm0d54amYaBqRsPPGPPbqpvnboYlo8ijOjASH3m41c4xoYRZZYahqugrCQkbh0gDni_QeWCFbICVpNA5iHy9sVEmlkCAugJBGA-6vYi1Di9xrg',
    },
    {
      id: 't-3',
      name: 'Pooja Agarwal',
      city: 'Delhi NCR',
      service: 'Home Painting & Waterproofing',
      comment: 'Ghar AI diagnosed our balcony wall dampness problem correctly and recommended damp-proof painting. The painters were super professional and completed 3 bedrooms in 2 days.',
      rating: 5,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBxIis2YY8df7FFV8yXuBJDf9ECOpTwi7WUyql6vOj51oPuP6RaiElnJCNIPqOG3Pjr7ENMy5lf8pPAmHOxy_gp_T_4m06vsJp1Fb7i1P3mogXvVLaJsx9sRkpqEvCzS0hr8F9A78W3lH5CIEmAAGRJagUNRixjzpQJb52bRGi-WgMAGqU6ztFklRcZWtEa4CZiuq07fPFDLz22PfqS7Z9Km-Twzld8It_raB1SXfL8Io7dfsL-UvpnA',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trusted By 50,000+ Indian Homeowners</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Real feedback from verified bookings across Mumbai, Delhi, Bengaluru, and major cities.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-stone-300" />
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-sans">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200/80 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{t.name}</h4>
                  <span className="text-[10px] text-stone-500 font-medium block">
                    {t.city} • <span className="text-emerald-700 font-semibold">{t.service}</span>
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
