import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/webApi';
import { Product } from '../../data/mockProducts';
import { useCartStore } from '../../store/cart.store';

const habitatMetadata = [
  {
    id: 'dogs',
    title: 'Dogs',
    icon: '/habitat/icons/dog.png',
    cta: 'Explore Dog Park →',
    desc: 'Run, play, and fetch! Everything your loyal companion needs for a happy, healthy life.',
    bgColor: '#fef3c7',
    accentColor: '#d97706',
    image: '/habitat/dog.png',
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
  const [habitatProducts, setHabitatProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const addItem = useCartStore((s) => s.addItem);
  const toggleCartDrawer = useCartStore((s) => s.toggleDrawer);

  useEffect(() => {
    let active = true;
    const loadAllHabitats = async () => {
      const results: Record<string, Product[]> = {};
      const ids = ['dogs', 'cats', 'fish', 'birds', 'small-pets'];
      await Promise.all(
        ids.map(async (id) => {
          const apiPetCategory = id === 'small-pets' ? 'small_pets' : id;
          try {
            const res = await getProducts({ petCategory: apiPetCategory, limit: 10 });
            results[id] = res.products;
          } catch (err) {
            console.error(`Failed to load products for habitat ${id}:`, err);
            results[id] = [];
          }
        })
      );
      if (active) {
        setHabitatProducts(results);
        setLoading(false);
      }
    };
    loadAllHabitats();
    return () => {
      active = false;
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      product: product.id,
      name: product.name,
      image: product.image,
      sku: product.sku || `${product.id}`,
      quantity: 1,
      price: product.price,
      variant: undefined
    });
    
    toggleCartDrawer();
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const selectedHabitat = habitatMetadata.find(h => h.id === selectedId);
  const activeProducts = selectedId ? (habitatProducts[selectedId] || []) : [];

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
        {habitatMetadata.map((habitat) => (
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
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', backgroundColor: selectedHabitat.bgColor + 'e6', backdropFilter: 'blur(20px)', padding: '1.5rem 2.5rem', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', marginBottom: '1.5rem', justifyContent: 'space-between' }}>

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

              {/* Grid Section: Dynamic responsive layout */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  width: '100%',
                  maxHeight: '68vh',
                  overflowY: 'auto',
                  paddingRight: '6px'
                }}>
                  {activeProducts.map((product) => {
                    const isWish = !!wishlist[product.id];
                    return (
                      <Link
                        key={product.id}
                        to={`/products/${product.slug}`}
                        onClick={() => setSelectedId(null)}
                        style={{
                          backgroundColor: selectedHabitat.accentColor,
                          borderRadius: '20px',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          cursor: 'pointer',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          textDecoration: 'none',
                          color: 'inherit',
                          transition: 'all 200ms ease'
                        }}
                      >
                        {/* Image Area */}
                        <div style={{ backgroundColor: '#fff', borderRadius: '14px', height: '130px', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', justifyContent: 'center' }}>
                          <button
                            onClick={(e) => toggleWishlist(e, product.id)}
                            style={{ position: 'absolute', top: '6px', right: '6px', width: '26px', height: '26px', backgroundColor: isWish ? '#ef4444' : selectedHabitat.accentColor, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10, transition: 'all 200ms ease' }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill={isWish ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </button>

                          {/* Real Product Image */}
                          <motion.img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '85%', height: '100%', objectFit: 'contain', zIndex: 0 }}
                            whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
                            transition={{ duration: 0.3 }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop';
                            }}
                          />
                        </div>

                        {/* Info Area */}
                        <div style={{ padding: '10px 6px 4px', display: 'flex', flexDirection: 'column', textAlign: 'left', flexGrow: 1, gap: '2px' }}>
                          <h3 style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '-0.02em', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
                          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', fontWeight: 600, margin: '0 0 auto 0' }}>{product.brand || 'PawMart Premium'}</span>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '6px' }}>
                            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.04em' }}>₹{product.price.toLocaleString('en-IN')}</span>
                            {/* Shopping Bag Button */}
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              style={{ width: '30px', height: '30px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedHabitat.accentColor, border: 'none', cursor: 'pointer', transition: 'all 200ms ease' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

                  {activeProducts.length === 0 && !loading && (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '3rem', opacity: 0.9 }}>
                      <span style={{ fontSize: '3rem' }}>🐾</span>
                      <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>No products found in this habitat yet.</p>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Check back later as we populate our virtual shelves!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
