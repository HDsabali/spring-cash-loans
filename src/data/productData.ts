export interface ProductDetail {
  id: 'personal' | 'business' | 'asset';
  tabLabel: string;
  eyebrow: string;
  heading: string;
  bodyCopy: string;
  trustBadgeTitle: string;
  trustBadgeSubtitle: string;
  ctaText: string;
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
  highlights: { title: string; desc: string }[];
  useCases: string[];
}

export const productData: Record<'personal' | 'business' | 'asset', ProductDetail> = {
  personal: {
    id: 'personal',
    tabLabel: 'Personal Loans',
    eyebrow: 'PERSONAL LOANS',
    heading: 'Finance the things that matter to you',
    bodyCopy:
      "Whether you're looking to do home renovations, upgrade your electronics, invest in solar solutions, install a borehole or JoJo tank for water security, or take a break overseas, a personal loan offers a flexible solution.",
    trustBadgeTitle: 'Safe & Secure',
    trustBadgeSubtitle: 'Fixed interest rate',
    ctaText: 'Apply Now',
    imageSrc: '/personal-loan.jpg',
    imageAlt: 'Modern South African home upgrade with solar energy installation',
    imageCaption: 'Flexible Terms • Fixed Interest • Direct Payout',
    highlights: [
      { title: 'Flexible Terms', desc: 'Repayment options tailored to your monthly budget' },
      { title: 'Fixed Monthly Repayments', desc: 'Complete certainty with no unexpected rate spikes' },
      { title: 'Direct Account Payout', desc: 'Approved funds transferred directly to your bank account' },
    ],
    useCases: [
      'Flexible amounts and repayments',
      'Switch your Personal Loans to us and Save!',
      'Personalised Interest Rate',
      'Loans of up to R350 000 with flexible terms up to 74 months',
    ],
  },
  business: {
    id: 'business',
    tabLabel: 'Business Loans',
    eyebrow: 'BUSINESS LOANS',
    heading: 'Finance your next business opportunity',
    bodyCopy:
      'Power your commercial growth with tailored business financing. Access structured funding solutions designed for South African enterprises to unlock working capital, execute growth strategies, and manage cash flow with confidence.',
    trustBadgeTitle: 'Enterprise Grade',
    trustBadgeSubtitle: 'Structured business terms',
    ctaText: 'Apply Now',
    imageSrc: '/business-loan.jpg',
    imageAlt: 'South African business owner managing company operations',
    imageCaption: 'Working Capital • Fleet Expansion • Commercial Growth',
    highlights: [
      { title: 'Working Capital Support', desc: 'Bridge operational cash flow gaps and manage inventory' },
      { title: 'Expansion Capital', desc: 'Fund strategic market expansion and new location rollouts' },
      { title: 'Commercial Equipment', desc: 'Acquire tools and technology to improve operational scale' },
    ],
    useCases: [
      'Working Capital & Inventory Purchase',
      'Commercial Premises Expansion & Fit-Out',
      'Fleet & Transport Upgrades',
      'Technology & Software Infrastructure',
      'Cash Flow Optimization & Supplier Payments',
    ],
  },
  asset: {
    id: 'asset',
    tabLabel: 'Asset Finance',
    eyebrow: 'ASSET FINANCE',
    heading: 'Acquire high-value machinery and vehicle fleets',
    bodyCopy:
      'Acquire machinery, vehicles, and specialized equipment required for your operational needs without exhausting liquid capital reserves. Structured asset financing options tailored to South African industries.',
    trustBadgeTitle: 'Asset Backed',
    trustBadgeSubtitle: 'Secured financing options',
    ctaText: 'Apply Now',
    imageSrc: '/asset-finance.jpg',
    imageAlt: 'Industrial asset financing for equipment and vehicles in South Africa',
    imageCaption: 'Heavy Vehicles • Plant Machinery • Manufacturing Fleet',
    highlights: [
      { title: 'Capital Preservation', desc: 'Keep cash reserves intact while acquiring revenue-generating assets' },
      { title: 'Custom Repayment Structures', desc: 'Align payments with seasonal business cycles' },
      { title: 'Tax Efficient Financing', desc: 'Capitalize on allowable depreciation and interest tax deductions' },
    ],
    useCases: [
      'Commercial Vehicles & Transport Fleets',
      'Construction & Earthmoving Equipment',
      'Manufacturing & Production Machinery',
      'Medical & Healthcare Diagnostic Assets',
      'Agricultural Machinery & Solar Systems',
    ],
  },
};
