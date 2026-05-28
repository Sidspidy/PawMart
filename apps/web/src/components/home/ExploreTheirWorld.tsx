import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const getProductImage = (id: string) => {
  if (id === 'dogs') return '/images/hero/dog.png';
  if (id === 'cats') return '/images/hero/cat.png';
  if (id === 'fish') return '/images/hero/fish.png';
  return '/images/hero/cat.png'; // Fallback
};

const habitats = [
  {
    id: 'dogs',
    title: 'Dogs',
    icon: '/habitat/icons/dog.png',
    cta: 'Explore Dog Park →',
    desc: 'Run, play, and fetch! Everything your loyal companion needs for a happy, healthy life.',
    bgColor: '#fef3c7',
    accentColor: '#d97706',
    image: '/habitat/dog.png',
    products: [
      { name: 'Premium Kibble', brand: 'Royal Canin', price: '$45', image: getProductImage('dogs') },
      { name: 'Tough Chew Toy', brand: 'Kong', price: '$12', image: getProductImage('dogs') },
      { name: 'Orthopedic Bed', brand: 'FurHaven', price: '$89', image: getProductImage('dogs') },
      { name: 'Leather Leash', brand: 'PetSafe', price: '$25', image: getProductImage('dogs') },
      { name: 'Training Treats', brand: 'Zukes', price: '$8', image: getProductImage('dogs') },
      { name: 'Grooming Brush', brand: 'Furminator', price: '$35', image: getProductImage('dogs') },
      { name: 'Slow Feeder Bowl', brand: 'Outward', price: '$15', image: getProductImage('dogs') },
      { name: 'Calming Chews', brand: 'Zesty Paws', price: '$28', image: getProductImage('dogs') },
      { name: 'Dog Dental Chews', brand: 'Greenies', price: '$18', image: getProductImage('dogs') },
      { name: 'Puzzle Toy', brand: 'Nina Ottosson', price: '$22', image: getProductImage('dogs') },
    ],
  },
  {
    id: 'cats',
    title: 'Cats',
    icon: '/habitat/icons/cat.png',
    cta: 'Enter Cat Kingdom →',
    desc: 'Lounge in style. Premium food, cozy towers, and engaging toys for your feline royalty.',
    bgColor: '#f3e8ff',
    accentColor: '#a855f7',
    image: '/habitat/cat.png',
    products: [
      { name: 'Cat Tree Tower', brand: 'Frisco', price: '$65', image: getProductImage('cats') },
      { name: 'Feather Wand', brand: 'Jackson', price: '$8', image: getProductImage('cats') },
      { name: 'Salmon Pate', brand: 'Purina Pro', price: '$24', image: getProductImage('cats') },
      { name: 'Cozy Cave Bed', brand: 'Snoozer', price: '$40', image: getProductImage('cats') },
      { name: 'Scratching Post', brand: 'SmartCat', price: '$35', image: getProductImage('cats') },
      { name: 'Catnip Mice', brand: 'Yeowww!', price: '$12', image: getProductImage('cats') },
      { name: 'Water Fountain', brand: 'Catit', price: '$28', image: getProductImage('cats') },
      { name: 'Self Groomer', brand: 'Safari', price: '$10', image: getProductImage('cats') },
      { name: 'Cat Grass Kit', brand: 'Pet Greens', price: '$6', image: getProductImage('cats') },
      { name: 'Laser Pointer', brand: 'KONG', price: '$5', image: getProductImage('cats') },
    ],
  },
  {
    id: 'fish',
    title: 'Fish',
    icon: '/habitat/icons/fish.png',
    cta: 'Enter Aquarium →',
    desc: 'Dive deep into aquatic wonders. Starter kits, advanced filters, and beautiful corals.',
    bgColor: '#e0f2fe',
    accentColor: '#0ea5e9',
    image: '/habitat/fish.png',
    products: [
      { name: 'Glass Aquarium', brand: 'Aqueon', price: '$120', image: getProductImage('fish') },
      { name: 'Coral Decor', brand: 'Penn-Plax', price: '$15', image: getProductImage('fish') },
      { name: 'Flake Food', brand: 'TetraMin', price: '$9', image: getProductImage('fish') },
      { name: 'Water Filter', brand: 'Fluval', price: '$35', image: getProductImage('fish') },
      { name: 'LED Light Hood', brand: 'Nicrew', price: '$25', image: getProductImage('fish') },
      { name: 'Gravel Vacuum', brand: 'Python', price: '$18', image: getProductImage('fish') },
      { name: 'Water Heater', brand: 'Eheim', price: '$28', image: getProductImage('fish') },
      { name: 'Sinking Pellets', brand: 'Hikari', price: '$12', image: getProductImage('fish') },
      { name: 'Algae Wafers', brand: 'Hikari', price: '$7', image: getProductImage('fish') },
      { name: 'Magnetic Cleaner', brand: 'Mag-Float', price: '$15', image: getProductImage('fish') },
    ],
  },
  {
    id: 'birds',
    title: 'Birds',
    icon: '/habitat/icons/bird.png',
    cta: 'Fly Into Aviary →',
    desc: 'Spread your wings! Spacious cages, nutritious seeds, and toys for active minds.',
    bgColor: '#dcfce7',
    accentColor: '#22c55e',
    image: '/habitat/bird.png',
    products: [
      { name: 'Seed Mix', brand: 'Kaytee', price: '$18', image: getProductImage('birds') },
      { name: 'Flight Cage', brand: 'Prevue', price: '$150', image: getProductImage('birds') },
      { name: 'Wooden Perch', brand: 'JW Pet', price: '$11', image: getProductImage('birds') },
      { name: 'Bell Toy', brand: 'Super Bird', price: '$7', image: getProductImage('birds') },
      { name: 'Cuttlebone', brand: 'Penn-Plax', price: '$5', image: getProductImage('birds') },
      { name: 'Foraging Ball', brand: 'Planet Pleasures', price: '$14', image: getProductImage('birds') },
      { name: 'Hanging Tent', brand: 'Snuggle Hut', price: '$16', image: getProductImage('birds') },
      { name: 'Millet Spray', brand: 'Browns', price: '$9', image: getProductImage('birds') },
      { name: 'Bird Bath', brand: 'Lixit', price: '$12', image: getProductImage('birds') },
      { name: 'Rope Bungee', brand: 'Booda', price: '$18', image: getProductImage('birds') },
    ],
  },
  {
    id: 'small-pets',
    title: 'Small Pets',
    icon: '/habitat/icons/small-pet.png',
    cta: 'Visit Cozy Burrows →',
    desc: 'A tiny world of fun. Running wheels, safe bedding, and tasty treats for little friends.',
    bgColor: '#fce7f3',
    accentColor: '#ec4899',
    image: '/habitat/small-pet.png',
    products: [
      { name: 'Exercise Wheel', brand: 'Exotic Nutrition', price: '$22', image: getProductImage('small-pets') },
      { name: 'Timothy Hay', brand: 'Oxbow', price: '$16', image: getProductImage('small-pets') },
      { name: 'Wood Hideout', brand: 'Niteangel', price: '$28', image: getProductImage('small-pets') },
      { name: 'Chew Sticks', brand: 'Kaytee', price: '$5', image: getProductImage('small-pets') },
      { name: 'Paper Bedding', brand: 'Carefresh', price: '$20', image: getProductImage('small-pets') },
      { name: 'Water Bottle', brand: 'Choco Nose', price: '$12', image: getProductImage('small-pets') },
      { name: 'Dust Bath', brand: 'Lixit', price: '$15', image: getProductImage('small-pets') },
      { name: 'Foraging Mix', brand: 'Higgins', price: '$10', image: getProductImage('small-pets') },
      { name: 'Corner Litter Pan', brand: 'Ware', price: '$9', image: getProductImage('small-pets') },
      { name: 'Mineral Chew', brand: 'Kaytee', price: '$4', image: getProductImage('small-pets') },
    ],
  },
];

/* ── Custom Environment Animations on Hover ── */
const HabitatAnimations = ({ id }: { id: string }) => {
  if (id === 'fish') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-2 h-2 rounded-full border border-white/50 bg-white/20"
            style={{ left: `${20 + Math.random() * 60}%` }}
            initial={{ y: 0, opacity: 0, scale: 0.5 }}
            animate={{ y: -100, opacity: [0, 1, 0], scale: 1 }}
            transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() }}
          />
        ))}
      </div>
    );
  }
  if (id === 'dogs') {
    return (
      <div className="absolute bottom-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.div
          className="w-4 h-4 rounded-full bg-[#fcd34d] border-[2px] border-white shadow-md"
          animate={{ y: [0, -20, 0], scale: [1, 0.95, 1.05, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }
  if (id === 'cats') {
    return (
      <div className="absolute bottom-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <motion.div
          className="w-6 h-6 rounded-full bg-[#c084fc] shadow-sm relative overflow-hidden"
          animate={{ rotate: 360, x: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-[3px] border-dashed border-[#a855f7] rounded-full opacity-50" />
        </motion.div>
      </div>
    );
  }
  if (id === 'birds') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-4 w-3 h-1 bg-white/60 rounded-full"
            style={{ left: `${30 + Math.random() * 40}%` }}
            animate={{
              y: [0, 20, 40],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              rotate: [0, 45, 90]
            }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    );
  }
  if (id === 'small-pets') {
    return (
      <div className="absolute bottom-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <motion.div
          className="w-8 h-8 rounded-full border-[3px] border-dashed border-[#f472b6] bg-white/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }
  return null;
};

export default function ExploreTheirWorld() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedHabitat = habitats.find(h => h.id === selectedId);

  return (
    <div className="relative w-full">

      <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Explore Their World
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#8a7e72', maxWidth: '42rem', margin: '0 auto', lineHeight: 1.6 }}>
          Every pet has a unique world. Discover products designed for their lifestyle, comfort, and happiness.
        </p>
      </div>

      {/* SINGLE ROW OF SQUARE CARDS (Centered) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
        {habitats.map((habitat) => (
          <motion.div
            layoutId={`habitat-card-${habitat.id}`}
            key={habitat.id}
            className="w-40 h-40 md:w-48 md:h-48 rounded-[32px] cursor-pointer relative overflow-hidden group flex flex-col items-center justify-center shadow-sm hover:shadow-xl transition-shadow"
            style={{ backgroundColor: habitat.bgColor }}
            onClick={() => setSelectedId(habitat.id)}
            whileHover={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Background Image inside card */}
            <div className="absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none">
              <motion.img
                layoutId={`expanded-image-${habitat.id}`}
                src={habitat.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none z-0" />

            {/* Icon */}
            <motion.div layoutId={`icon-${habitat.id}`} className="text-5xl md:text-6xl mb-3 relative z-10 transition-transform duration-300 group-hover:scale-110">
              <img src={habitat.icon} alt="" className="w-20 h-20 object-contain" />
            </motion.div>

            {/* Title */}
            <motion.div layoutId={`title-${habitat.id}`} className="relative z-10">
              <h3
                className="text-lg md:text-xl font-black tracking-tight"
                style={{ color: habitat.accentColor, backgroundColor: habitat.bgColor, padding: '0rem 1rem', borderRadius: '12px' }}
              >
                {habitat.title}
              </h3>
            </motion.div>

            <HabitatAnimations id={habitat.id} />
          </motion.div>
        ))}
      </div>

      {/* Expanded Cinematic View (Single Screen Layout) */}
      <AnimatePresence>
        {selectedId && selectedHabitat && (
          <motion.div
            layoutId={`habitat-card-${selectedHabitat.id}`}
            style={{ position: 'fixed', inset: 0, zIndex: 100, width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'transparent' }}
            onWheel={(e) => {
              if (e.deltaY > 30) {
                setSelectedId(null);
              }
            }}
          >
            {/* Full Background Image */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
              <motion.img
                layoutId={`expanded-image-${selectedHabitat.id}`}
                src={selectedHabitat.image}
                alt={selectedHabitat.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedId(null)}
              style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 50, width: '3rem', height: '3rem', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2d2418', border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Content overlay (Top Header & Grid layout) */}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

              {/* Top Row: Title, Desc, and Glass wrapper */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', backgroundColor: selectedHabitat.bgColor + 'e6', backdropFilter: 'blur(20px)', padding: '1.5rem 2.5rem', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>

                {/* Left Side: Title & Desc */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <motion.div layoutId={`title-${selectedHabitat.id}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <motion.span layoutId={`icon-${selectedHabitat.id}`} style={{ fontSize: '3.5rem' }}>
                      <img src={selectedHabitat.icon} alt="" className="w-20 h-20 object-contain" />
                    </motion.span>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: selectedHabitat.accentColor, margin: 0, lineHeight: 1 }}>
                      {selectedHabitat.title}
                    </h2>
                  </motion.div>

                  <div style={{ width: '2px', height: '50px', backgroundColor: selectedHabitat.accentColor, opacity: 0.2 }} />

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '1rem', color: '#4a4036', lineHeight: 1.5, fontWeight: 600, margin: 0, maxWidth: '400px' }}
                  >
                    {selectedHabitat.desc}
                  </motion.p>
                </div>

                {/* Right Side: CTA */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                >
                  <Link
                    to="/products"
                    onClick={() => setSelectedId(null)}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem 2rem', borderRadius: '9999px', color: '#fff', fontWeight: 'bold', fontSize: '1rem', backgroundColor: selectedHabitat.accentColor, textDecoration: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                  >
                    {selectedHabitat.cta}
                  </Link>
                </motion.div>
              </div>

              {/* Grid Section: 5 columns, 2 rows */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '1rem', height: '100%' }}>
                  {selectedHabitat.products.map((product, idx) => (
                    <div
                      key={idx}
                      style={{ backgroundColor: selectedHabitat.accentColor, borderRadius: '20px', padding: '10px', display: 'flex', flexDirection: 'column', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    >
                      {/* Image Area */}
                      <div style={{ backgroundColor: '#fff', borderRadius: '14px', height: '120px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <button style={{ position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px', backgroundColor: selectedHabitat.accentColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </button>

                        {/* Real Product Image */}
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '85%', height: '100%', objectFit: 'contain', zIndex: 0 }}
                          whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {/* Info Area */}
                      <div style={{ padding: '10px 6px 4px', display: 'flex', flexDirection: 'column', textAlign: 'left', flexGrow: 1 }}>
                        <h3 style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '-0.02em', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', fontWeight: 600, margin: '0 0 auto 0' }}>{product.brand}</span>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                          <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.05em' }}>{product.price}</span>
                          {/* Shopping Bag Button */}
                          <button style={{ width: '28px', height: '28px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedHabitat.accentColor, border: 'none', cursor: 'pointer' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
