import type { Product, Certification } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Industrial Safety Equipment',
    category: 'Safety & PPE',
    description: 'Comprehensive range of personal protective equipment including helmets, gloves, goggles, and safety vests for industrial environments.',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Office Furniture & Workstations',
    category: 'Office Supplies',
    description: 'Ergonomic desks, chairs, and modular workstation solutions designed for high-productivity corporate environments.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'IT Hardware & Peripherals',
    category: 'Technology',
    description: 'Enterprise-grade laptops, servers, networking equipment, and accessories sourced from certified manufacturers.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'Industrial Cleaning Supplies',
    category: 'Facility Management',
    description: 'Bulk cleaning chemicals, janitorial equipment, and hygiene supplies for large-scale facility management.',
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
    createdAt: '2024-02-01',
  },
  {
    id: '5',
    name: 'Electrical Components',
    category: 'Electrical & Mechanical',
    description: 'Switchgear, cables, conduits, transformers, and industrial electrical components from verified suppliers.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    createdAt: '2024-02-05',
  },
  {
    id: '6',
    name: 'Stationery & Office Consumables',
    category: 'Office Supplies',
    description: 'Complete stationery bundles, printing supplies, and consumables for large enterprise office operations.',
    imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80',
    createdAt: '2024-02-10',
  },
  {
    id: '7',
    name: 'Packaging Materials',
    category: 'Logistics & Packaging',
    description: 'Industrial-grade packaging solutions including corrugated boxes, stretch film, and custom packaging for logistics.',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    createdAt: '2024-02-15',
  },
  {
    id: '8',
    name: 'Breakroom & Pantry Supplies',
    category: 'Facility Management',
    description: 'Coffee machines, water dispensers, snacks, and kitchen essentials for corporate cafeterias and breakrooms.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    createdAt: '2024-02-20',
  },
];

export const mockCertifications: Certification[] = [
  {
    id: '1',
    title: 'GST Registered',
    imageUrl: '',
    issuer: 'Government of India',
    year: '2018',
  },
  {
    id: '2',
    title: 'MSME Certified',
    imageUrl: '',
    issuer: 'Ministry of MSME',
    year: '2019',
  },
  {
    id: '3',
    title: 'ISO 9001:2015',
    imageUrl: '',
    issuer: 'Bureau Veritas',
    year: '2020',
  },
  {
    id: '4',
    title: 'Udyam Registration',
    imageUrl: '',
    issuer: 'Govt. of India',
    year: '2021',
  },
];

// mockLeads removed — leads come from the database only, never from static data

export const productCategories = [
  'All',
  'Adhesives & Sealants',
  'Coatings & Paints',
  'Lubricants, Oils, & Greases',
  'Mechanical Items & Consumables',
  'Cleaners & NDT Chemicals',
  'Tapes',
];


export const clientLogos = [
  { name: 'Tata Group', abbr: 'TATA' },
  { name: 'Infosys', abbr: 'INFY' },
  { name: 'Mahindra', abbr: 'M&M' },
  { name: 'Wipro', abbr: 'WIPRO' },
  { name: 'L&T', abbr: 'L&T' },
  { name: 'Reliance', abbr: 'RIL' },
];
