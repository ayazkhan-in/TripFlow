import React from 'react';
import { ConsumerTab } from '../../types/travel';
import { KERALA_HERO_IMAGE } from '../../data/mockData';
import { LuxuryCard } from '../common/LuxuryCard';

interface BookingsScreenProps {
  onNavigateTab: (tab: ConsumerTab) => void;
  onOpenTimeline: () => void;
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({
  onNavigateTab,
  onOpenTimeline,
}) => {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 pb-24 md:pb-12 text-left space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#DBE1FF] text-[#00174B] text-[11px] font-semibold uppercase">
            Confirmed Vouchers
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#151c27] tracking-tight">
          Your Bookings & Passes
        </h1>
        <p className="text-sm text-[#575E70] mt-1">
          Access all verified flight tickets, hotel confirmation codes, and private transfer passes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Booking 1: Kerala Escape */}
        <LuxuryCard
          id="booking-kerala"
          title="Kerala Escape — Luxury Circuit"
          kicker="REF #KL-9402 · Kochi → Munnar → Alleppey"
          description="Active 6-day luxury circuit with confirmed IndiGo flights, Old Harbour boutique hotel, and private houseboat."
          image={KERALA_HERO_IMAGE}
          rating="4.95/5"
          badge="Active Today"
          badgeColor="emerald"
          amenities={[
            { icon: 'flight', label: 'IndiGo 6E-204' },
            { icon: 'hotel', label: 'Old Harbour' },
            { icon: 'holiday_village', label: 'Leaf Munnar' },
            { icon: 'sailing', label: 'Houseboat' },
            { icon: 'directions_car', label: 'Innova KL-07' },
            { icon: 'verified', label: 'Concierge Arun' },
          ]}
          price="₹42,800"
          pricePeriod="/trip"
          actionLabel="Open Timeline"
          actionVariant="button"
          onClick={onOpenTimeline}
        />

        {/* Booking 2: Rajasthan Royal Heritage */}
        <LuxuryCard
          id="booking-rajasthan"
          title="Rajasthan Royal Heritage"
          kicker="REF #RJ-33411 · Jaipur → Udaipur"
          description="6 nights & 7 days palace circuit with private guide, heritage Havelis, and sunset desert dining."
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuDYoWQHDLBf3TSHPEbB_b3jDxw2Jt-X5Lzb-yOsbLzxWUJxb5g28sXzxlAl4dslwH4fJE-5f86LN6CojW_Pk9g5t3mzchWVM4uPEMJHgSk-FfatTWCqcuZFSxXBMoWOSEyimkrPWwBBWhFrjlDEqznGjSyQQVqZSTp39EgW--0iPYn6EB7V9B5AlL0934o8WSe7lh9zP1qGOGZ9zEwHjVJdDjr7xjUZDJTpYI4gAx9Mn4PbIWYizLyAfw"
          rating="4.9/5"
          badge="Confirmed (Oct 12)"
          badgeColor="blue"
          amenities={[
            { icon: 'flight', label: 'SpiceJet SG' },
            { icon: 'castle', label: 'Samode Haveli' },
            { icon: 'hotel', label: 'Lake Palace' },
            { icon: 'tour', label: 'Palace Guide' },
            { icon: 'directions_car', label: 'Private Chauffeur' },
            { icon: 'verified', label: 'Pre-Booked' },
          ]}
          price="₹68,500"
          pricePeriod="/trip"
          actionLabel="View Details"
          actionVariant="button"
          onClick={() => onNavigateTab('home')}
        />

        {/* Booking 3: Bali Cultural Retreat */}
        <LuxuryCard
          id="booking-bali"
          title="Bali Cultural Retreat"
          kicker="REF #BL-5502 · Ubud → Seminyak"
          description="7 nights & 8 days wellness journey with rainforest yoga pavilions, artisanal coffee plantations, and ocean sunsets."
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuBByXADs2g9PfqudzYxkj7KyJDF6ZQ9yyFek6w2gqfRr-EML0_oKL0IRb057Qttkd2QyTpq7NoqMACYqbqWrT8Sdx4CH6Qs3MMk2ZESUQwcHAK0RZq1iR1eor7XhZHaO0vGDERLrRIPgd3TwLfh_-PsCEizjAylSSiWgY6BrEFD8lZN0SDu5zx9FsAxi8EpEuNrDrXnRaT9cQSukMkRlYl7pnpkLNeQlZ6PtXLh_Hja1YUULi1FKrjDBA"
          rating="4.85/5"
          badge="Confirmed (Nov 4)"
          badgeColor="blue"
          amenities={[
            { icon: 'flight', label: 'Singapore Air' },
            { icon: 'cottage', label: 'Kamandalu Ubud' },
            { icon: 'hotel', label: 'Alila Seminyak' },
            { icon: 'spa', label: 'Sound Healing' },
            { icon: 'pool', label: 'Infinity Pool' },
            { icon: 'verified', label: 'Voucher Issued' },
          ]}
          price="₹84,000"
          pricePeriod="/trip"
          actionLabel="View Details"
          actionVariant="button"
          onClick={() => onNavigateTab('home')}
        />
      </div>
    </div>
  );
};
