
import { Sponsor, SponsorshipLevel } from './sponsors';

export type SubscriptionPlan = {
  id: string;
  level: SponsorshipLevel;
  name: string;
  price: number;
  benefits: string[];
  featuresIncluded: string[];
  recommended?: boolean;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    level: 'bronze',
    name: 'Basic',
    price: 500,
    benefits: [
      'Logo displayed on sponsored reports',
      'Business name in "Rescue Powered By" column',
      'Support animal welfare in your community'
    ],
    featuresIncluded: [
      'Sponsor up to 5 rescues per month',
      'Monthly impact report',
      'Community recognition badge'
    ]
  },
  {
    id: 'standard',
    level: 'silver',
    name: 'Standard',
    price: 1000,
    recommended: true,
    benefits: [
      'Everything in Basic plan',
      'Featured in volunteer pages',
      'Social media mention',
      'Priority placement in sponsor lists'
    ],
    featuresIncluded: [
      'Sponsor up to 15 rescues per month',
      'Detailed quarterly impact reports',
      'Silver community recognition badge'
    ]
  },
  {
    id: 'premium',
    level: 'gold',
    name: 'Premium',
    price: 2000,
    benefits: [
      'Everything in Standard plan',
      'Featured on homepage',
      'Dedicated thank-you page',
      'Exclusive "Premium Sponsor" designation'
    ],
    featuresIncluded: [
      'Unlimited rescue sponsorships',
      'Custom impact dashboard',
      'Gold community recognition badge',
      'Annual recognition event invitation'
    ]
  }
];

export type SponsoredRescue = {
  id: string;
  report_id: string;
  sponsor_id: string;
  sponsored_at: string;
  animal_species: string;
  rescue_date: string;
  location: string;
  status: 'active' | 'completed';
};
