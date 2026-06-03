import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db';
import Admin from './models/Admin';
import Product from './models/Product';
import Certification from './models/Certification';

// ──────────────────────────────────────────────
// Seed Data
// ──────────────────────────────────────────────

const products = [
  {
    name: 'Industrial Safety Gloves',
    category: 'Personal Protective Equipment',
    description:
      'Heavy-duty cut-resistant gloves engineered for industrial environments. Made from high-performance HPPE fiber with polyurethane coating. ANSI/ISEA 105-2016 Level A6 cut resistance. Ideal for metal fabrication, glass handling, and automotive assembly.',
    imageUrl:
      'https://images.unsplash.com/photo-1627163439134-7a8c47e08208?w=800&h=600&fit=crop',
    isActive: true,
  },
  {
    name: 'N95 Respirator Masks (50-Pack)',
    category: 'Personal Protective Equipment',
    description:
      'NIOSH-approved N95 filtering facepiece respirators offering ≥95% filtration efficiency against non-oil-based particles. Adjustable nose clip for secure seal. Cup shape for comfortable wear during extended shifts. Compliant with OSHA 29 CFR 1910.134.',
    imageUrl:
      'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&h=600&fit=crop',
    isActive: true,
  },
  {
    name: 'Stainless Steel Fastener Kit',
    category: 'Industrial Fasteners',
    description:
      'Comprehensive 1,200-piece Grade 316 stainless steel fastener assortment. Includes hex bolts (M4–M16), nuts, washers, and self-tapping screws. Superior corrosion resistance for marine and outdoor applications. Supplied in a labelled storage case.',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    isActive: true,
  },
  {
    name: 'High-Visibility Safety Vest',
    category: 'Personal Protective Equipment',
    description:
      'ANSI/ISEA 107-2015 Class 2 high-visibility safety vest with retroreflective striping. 100% polyester mesh for breathability. Zipper front closure. Available in fluorescent yellow-green and orange. Meets DOT and OSHA requirements for road and construction work.',
    imageUrl:
      'https://images.unsplash.com/photo-1609803384069-19f3f7d5b874?w=800&h=600&fit=crop',
    isActive: true,
  },
  {
    name: 'Digital Torque Wrench Set',
    category: 'Tools & Equipment',
    description:
      'Professional digital torque wrench set with ±2% accuracy. Range: 5–100 Nm. Backlit LCD display with peak-hold and track modes. Audible and visual alerts at target torque. Includes 3/8" and 1/2" drive adapters. Calibration certificate included.',
    imageUrl:
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=600&fit=crop',
    isActive: true,
  },
  {
    name: 'Industrial Cleaning Supplies Bundle',
    category: 'Maintenance & Janitorial',
    description:
      'Complete industrial cleaning bundle for heavy-duty facility maintenance. Includes concentrated floor cleaner (5L), degreaser spray (2L), microfibre mop set, and safety data sheets. Formulated for manufacturing plants, warehouses, and food-processing facilities. Eco-friendly and REACH-compliant.',
    imageUrl:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop',
    isActive: true,
  },
  {
    name: 'Arc Flash Protection Suit',
    category: 'Personal Protective Equipment',
    description:
      'Premium arc flash protection suit rated at 40 cal/cm² HRC 4. Includes hood with face shield, coat, bib overall, and gloves. FR cotton/nylon blend. NFPA 70E and IEC 61482-1-1 compliant. Designed for electrical maintenance, switchgear servicing, and utility work.',
    imageUrl:
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop',
    isActive: true,
  },
  {
    name: 'Barcode Label Printer (Industrial)',
    category: 'Office & Warehouse Equipment',
    description:
      'Industrial-grade direct thermal and thermal transfer label printer. Print speed up to 200mm/s. Resolution 203 dpi. Supports ZPL, EPL, and TSPL-EZ languages. USB, RS-232, and Ethernet connectivity. Compatible with all standard label widths 25–118mm. Ideal for warehouse management and asset tracking.',
    imageUrl:
      'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=600&fit=crop',
    isActive: true,
  },
];

const certifications = [
  {
    title: 'ISO 9001:2015 Quality Management',
    imageUrl: '',
    cloudinaryPublicId: '',
    issuer: 'Bureau Veritas',
    year: '2023',
    order: 1,
  },
  {
    title: 'ISO 14001:2015 Environmental Management',
    imageUrl: '',
    cloudinaryPublicId: '',
    issuer: 'DNV GL',
    year: '2022',
    order: 2,
  },
  {
    title: 'OHSAS 18001 Occupational Health & Safety',
    imageUrl: '',
    cloudinaryPublicId: '',
    issuer: 'BSI Group',
    year: '2023',
    order: 3,
  },
  {
    title: 'GEM Certified Seller',
    imageUrl: '',
    cloudinaryPublicId: '',
    issuer: 'Government e-Marketplace (GeM)',
    year: '2024',
    order: 4,
  },
];

// ──────────────────────────────────────────────
// Seed Function
// ──────────────────────────────────────────────

const seed = async (): Promise<void> => {
  console.log('🌱 Starting database seed...');

  await connectDB();

  // ── Admin ──────────────────────────────────
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@prosource.com';
  const adminPassword =
    process.env.INITIAL_ADMIN_PASSWORD || 'ChangeMe@2024!';

  const existingAdmin = await Admin.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log(`⏭️  Admin already exists: ${adminEmail} — skipping`);
  } else {
    await Admin.create({
      email: adminEmail,
      passwordHash: adminPassword, // pre-save hook will hash it
      role: 'super_admin',
    });
    console.log(`✅ Created admin: ${adminEmail}`);
  }

  // ── Products ───────────────────────────────
  const existingProductCount = await Product.countDocuments();
  if (existingProductCount > 0) {
    console.log(
      `⏭️  ${existingProductCount} products already exist — skipping product seed`
    );
  } else {
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
  }

  // ── Certifications ─────────────────────────
  const existingCertCount = await Certification.countDocuments();
  if (existingCertCount > 0) {
    console.log(
      `⏭️  ${existingCertCount} certifications already exist — skipping certification seed`
    );
  } else {
    await Certification.insertMany(certifications);
    console.log(`✅ Seeded ${certifications.length} certifications`);
  }

  // ── Done ───────────────────────────────────
  await mongoose.disconnect();
  console.log('✅ Seed complete. Database disconnected.');
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
