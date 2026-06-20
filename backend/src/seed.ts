import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db';
import Admin from './models/Admin';
import Product from './models/Product';
import Certification from './models/Certification';
import Category from './models/Category';
import Client from './models/Client';

// ──────────────────────────────────────────────
// Seed Data
// ──────────────────────────────────────────────

const products = [
  {
    name: 'Loctite EA 9497 Epoxy Adhesive',
    category: 'Adhesives',
    description: 'High temperature resistant, two-part epoxy adhesive designed for aerospace component bonding. Offers excellent thermal conductivity, high compressive strength, and electrical insulation properties.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764574/prosource/products/h4yqdmanjyy9twbqbhat.jpg',
    cloudinaryPublicId: 'prosource/products/h4yqdmanjyy9twbqbhat',
    isActive: true,
  },
  {
    name: 'RTV 157 Silicone Rubber Adhesive Sealant',
    category: 'Sealants',
    description: 'High-strength, high-temperature silicone sealant for aerospace sealing and gasketing. Excellent resistance to weathering, ozone, and aviation chemicals with a wide operational temperature range.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764576/prosource/products/i92emqhmq2in1vbbsrce.jpg',
    cloudinaryPublicId: 'prosource/products/i92emqhmq2in1vbbsrce',
    isActive: true,
  },
  {
    name: 'CHO-BOND 1030 Conductive Silicone',
    category: 'Sealants',
    description: 'Electrically conductive silicone gasket adhesive for EMI shielding. Highly resistant to aviation fluids, ensuring environmental sealing and conductive bonding.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764577/prosource/products/ho6o1thqomnkluqpbcsi.jpg',
    cloudinaryPublicId: 'prosource/products/ho6o1thqomnkluqpbcsi',
    isActive: true,
  },
  {
    name: '3M AF 163-2K Structural Film Adhesive',
    category: 'Adhesives',
    description: 'Structural adhesive film for aircraft composites and metal-to-metal bonding. Exceptional toughness, high peel strength, and resistance to environmental degradation.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764579/prosource/products/srljhrpkdrzz79nui3gw.jpg',
    cloudinaryPublicId: 'prosource/products/srljhrpkdrzz79nui3gw',
    isActive: true,
  },
  {
    name: 'Deft Polyurethane Camouflage Coating',
    category: 'Coatings',
    description: 'Durable military-grade polyurethane topcoat for aerospace exterior surfaces. Highly resistant to UV radiation, chemical exposure, and mechanical wear.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764581/prosource/products/n6qk84mq7s1sjan7uemc.jpg',
    cloudinaryPublicId: 'prosource/products/n6qk84mq7s1sjan7uemc',
    isActive: true,
  },
  {
    name: 'AeroShell Oil 80 Piston Engine Oil',
    category: 'Oils',
    description: 'Straight mineral oil for aviation piston engines. Recommended for break-in periods and light aircraft engines operating under normal conditions.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764583/prosource/products/ak9jgtsujfa8nkvgrtbr.jpg',
    cloudinaryPublicId: 'prosource/products/ak9jgtsujfa8nkvgrtbr',
    isActive: true,
  },
  {
    name: 'Mobil HyJet IV-A+ Aviation Hydraulic Fluid',
    category: 'Oils',
    description: 'Fire-resistant phosphate ester hydraulic fluid designed for commercial passenger aircraft systems. Excellent low-temperature viscosity and thermal stability.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764584/prosource/products/gezbzfvqoznqlxutmyyj.jpg',
    cloudinaryPublicId: 'prosource/products/gezbzfvqoznqlxutmyyj',
    isActive: true,
  },
  {
    name: 'Royco 782 Synthetic Hydraulic Fluid',
    category: 'Oils',
    description: 'Fire-resistant synthetic hydrocarbon hydraulic fluid formulated for military aircraft, missiles, and ordinance systems. Operates over a very wide temperature range.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764586/prosource/products/mg6gxz81ajjfdwsqrxid.jpg',
    cloudinaryPublicId: 'prosource/products/mg6gxz81ajjfdwsqrxid',
    isActive: true,
  },
  {
    name: 'Royco 481 Jet Engine Lubricating Oil',
    category: 'Oils',
    description: 'Synthetic turbine engine lubricating oil for aircraft jet engines. Provides clean operation, high thermal stability, and low volatility.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764588/prosource/products/b5uzogonjczzyyruzzx4.jpg',
    cloudinaryPublicId: 'prosource/products/b5uzogonjczzyyruzzx4',
    isActive: true,
  },
  {
    name: 'Aeroquip Medium Pressure Hose',
    category: 'Mechanical Items',
    description: 'Flexible synthetic rubber hose with single wire braid reinforcement. Designed for aircraft fuel, oil, coolant, and water lines with operational reliability.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764589/prosource/products/twuxbnbjmuhem04nbcjg.jpg',
    cloudinaryPublicId: 'prosource/products/twuxbnbjmuhem04nbcjg',
    isActive: true,
  },
  {
    name: 'Callington Aero Wash Aircraft Cleaner',
    category: 'Cleaners',
    description: 'High-performance aircraft washing compound. Neutral pH formulation that is safe on paint, polycarbonates, acrylics, and structural composites.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764591/prosource/products/tyrun0xvladu73cuo9ac.jpg',
    cloudinaryPublicId: 'prosource/products/tyrun0xvladu73cuo9ac',
    isActive: true,
  },
  {
    name: 'Ardrox 970P25 Fluorescent Penetrant',
    category: 'NDT Chemicals',
    description: 'Water-washable fluorescent penetrant (Level 2) for non-destructive testing of critical aerospace engine components, castings, and forgings.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764592/prosource/products/gtadrgpfmpdpn6zpfhqr.jpg',
    cloudinaryPublicId: 'prosource/products/gtadrgpfmpdpn6zpfhqr',
    isActive: true,
  },
  {
    name: '3M Polyurethane Protective Tape 8673',
    category: 'Tapes',
    description: 'Highly durable, weather-resistant polyurethane tape with acrylic adhesive. Protects aircraft leading edges, radomes, and surfaces from erosion and debris.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764594/prosource/products/klghg8baluvjry6hv7r7.jpg',
    cloudinaryPublicId: 'prosource/products/klghg8baluvjry6hv7r7',
    isActive: true,
  },
  {
    name: '3M Adhesive Transfer Tape 465',
    category: 'Tapes',
    description: 'High-tack acrylic adhesive transfer tape for quick bonding, splicing, and mounting in aviation warehouse and maintenance environments.',
    imageUrl: 'https://res.cloudinary.com/dbw4bmkoo/image/upload/v1781764595/prosource/products/lti5puvei7bxa1gn6kwr.jpg',
    cloudinaryPublicId: 'prosource/products/lti5puvei7bxa1gn6kwr',
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

const categories = [
  {
    name: 'Adhesives',
    description: 'High-performance structural epoxy, cyanoacrylate, and film adhesives for aerospace and industrial bonding applications.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    order: 1,
  },
  {
    name: 'Coatings',
    description: 'Corrosion-resistant primers, protective topcoats, and specialty aerospace coatings for metal and composite surfaces.',
    imageUrl: 'https://images.unsplash.com/photo-1590233649088-e8898b5b4e31?w=800&h=600&fit=crop',
    order: 2,
  },
  {
    name: 'Mechanical Items',
    description: 'Precision-engineered rivets, fasteners, fittings, and hardware for structural and mechanical assemblies.',
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=800&h=600&fit=crop',
    order: 3,
  },
  {
    name: 'Cleaners',
    description: 'Industrial-grade degreasers, solvent cleaners, and washing compounds for surface preparation and maintenance.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=600&fit=crop',
    order: 4,
  },
  {
    name: 'Lubricants',
    description: 'High-temperature lubricants, anti-seize compounds, and dry-film lubricants for moving mechanical parts.',
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&h=600&fit=crop',
    order: 5,
  },
  {
    name: 'Mechanical Consumables',
    description: 'Abrasive discs, cutting wheels, sanding belts, and other disposable tooling for fabrication and finishing.',
    imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=600&fit=crop',
    order: 6,
  },
  {
    name: 'Tapes',
    description: 'Erosion protection tapes, masking tapes, adhesive transfer tapes, and specialty sealing tapes for industry.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    order: 7,
  },
  {
    name: 'NDT Chemicals',
    description: 'Fluorescent penetrants, developers, magnetic particle inks, and inspection chemicals for non-destructive testing.',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop',
    order: 8,
  },
  {
    name: 'Oils',
    description: 'Aviation turbine engine oils, hydraulic fluids, and specialty industrial oils for lubrication and heat transfer.',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
    order: 9,
  },
  {
    name: 'Paints',
    description: 'Aerospace-grade primers, polyurethane topcoats, touch-up paints, and specialty finishes for industrial use.',
    imageUrl: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=800&h=600&fit=crop',
    order: 10,
  },
  {
    name: 'Greases',
    description: 'Multi-purpose greases, bearing greases, and specialty aviation greases for extreme-temperature applications.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    order: 11,
  },
  {
    name: 'Sealants',
    description: 'Polysulfide fuel tank sealants, silicone RTV sealants, and gasket compounds for sealing and weatherproofing.',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop',
    order: 12,
  },
];

const clients = [
  {
    name: 'Adani',
    logoUrl: '',
    cloudinaryPublicId: '',
    order: 1,
    isActive: true,
  },
  {
    name: 'Israel Aerospace',
    logoUrl: '',
    cloudinaryPublicId: '',
    order: 2,
    isActive: true,
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

  // ── Categories ─────────────────────────────
  const existingCatCount = await Category.countDocuments();
  if (existingCatCount > 0) {
    console.log(
      `⏭️  ${existingCatCount} categories already exist — skipping category seed`
    );
  } else {
    await Category.insertMany(categories);
    console.log(`✅ Seeded ${categories.length} categories`);
  }

  // ── Clients ────────────────────────────────
  const existingClientCount = await Client.countDocuments();
  if (existingClientCount > 0) {
    console.log(
      `⏭️  ${existingClientCount} clients already exist — skipping client seed`
    );
  } else {
    await Client.insertMany(clients);
    console.log(`✅ Seeded ${clients.length} clients`);
  }

  // ── Done ───────────────────────────────────
  await mongoose.disconnect();
  console.log('✅ Seed complete. Database disconnected.');
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
