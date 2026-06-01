import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Truck, Droplets, ChevronRight } from 'lucide-react';
import { getProducts, getCategories } from '../../api/webApi';
import ProductCard from '../../components/shop/ProductCard';

export default function Fish() {
  const [selectedSub, setSelectedSub] = useState<string>('all');
  const [hoveredPromo, setHoveredPromo] = useState<string | null>(null);

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [catsRes, productsRes] = await Promise.all([
          getCategories('fish'),
          getProducts({ petCategory: 'fish', limit: 20 })
        ]);
        if (active) {
          setDbCategories(catsRes);
          setDbProducts(productsRes.products);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = selectedSub === 'all'
    ? dbProducts
    : dbProducts.filter((p) => {
        const catSlug = typeof p.category === 'object' && p.category !== null ? p.category.slug : '';
        return catSlug === selectedSub;
      });

  const subcategories = [
    { id: 'all', label: 'All Essentials' },
    ...dbCategories.map(cat => ({ id: cat.slug, label: cat.name }))
  ];

  return (
    <div data-theme="fish" className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', paddingBottom: '2rem' }}>
      {/* Hero Banner */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          padding: '4.5rem 2rem',
        }}
      >
        {/* Background elements */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at top right, rgba(186, 230, 253, 0.3), transparent 60%)', pointerEvents: 'none' }} />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="container relative z-10 grid gap-8 md:grid-cols-12 md:items-center" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="md:col-span-7" style={{ textAlign: 'left' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: 9999,
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#bae6fd',
                width: 'max-content',
                marginBottom: '1.5rem',
                letterSpacing: '0.05em',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Sparkles className="h-4 w-4" />
              <span>THE AQUATIC EXTRAVAGANZA</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ lineHeight: 1.1, margin: 0, color: '#fff' }}
            >
              Vibrant & <br />
              <span style={{ color: '#bae6fd' }}>Crystal Clear Views</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                marginTop: '1.25rem',
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
                maxWidth: '34rem',
              }}
            >
              Build your dream underwater sanctuary with curved panoramic glass aquarium kits, adjustable 3-stage filtration systems, and color-enhancing spirulina flakes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
            >
              <a
                href="#catalog"
                style={{
                  borderRadius: 9999,
                  backgroundColor: '#fff',
                  padding: '0.85rem 2rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  color: '#0369a1',
                  textDecoration: 'none',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  transition: 'all 200ms ease',
                  display: 'inline-block',
                }}
              >
                Shop Fish Catalog
              </a>
              <Link
                to="/products?category=fish"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  borderRadius: 9999,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.8rem 1.75rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  color: '#fff',
                  textDecoration: 'none',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 200ms ease',
                }}
              >
                <span>View All Products</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <div className="relative md:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{
                position: 'relative',
                height: 320,
                width: 320,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <img
                src="/images/hero/fish.png"
                alt="Happy Fish"
                style={{ height: '80%', width: '80%', objectFit: 'contain' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=400&auto=format&fit=crop';
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 20 }} className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            borderRadius: 24,
            backgroundColor: '#fff',
            padding: '1.5rem 2rem',
            boxShadow: '0 10px 35px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.03)',
            gap: '2rem',
            maxWidth: 1280,
            margin: '0 auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRight: '1px solid #f3ebe1', paddingRight: '1rem' }} className="sm:border-r-0 md:border-r">
            <div style={{ display: 'flex', height: 48, width: 48, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
              <Droplets className="h-5 w-5 fill-sky-400 text-sky-400" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#2d2418', fontFamily: 'var(--font-display)' }}>Clear-Water Formulas</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#8a7e72', fontWeight: 500 }}>Nutrients formulated to prevent water cloudiness</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRight: '1px solid #f3ebe1', paddingRight: '1rem' }} className="sm:border-r-0 md:border-r">
            <div style={{ display: 'flex', height: 48, width: 48, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
              <Shield className="h-5 w-5" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#2d2418', fontFamily: 'var(--font-display)' }}>Leakproof Curved Glass</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#8a7e72', fontWeight: 500 }}>Heavy-duty seamless panoramic design</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', height: 48, width: 48, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
              <Truck className="h-5 w-5" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#2d2418', fontFamily: 'var(--font-display)' }}>Fragile Care Shipping</h4>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#8a7e72', fontWeight: 500 }}>Insured package protection for delicate glassware</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promos grid */}
      <section className="container mt-12" style={{ maxWidth: 1280, margin: '3rem auto 0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Promo 1 */}
          <motion.div
            onMouseEnter={() => setHoveredPromo('p1')}
            onMouseLeave={() => setHoveredPromo(null)}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 24,
              background: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)',
              padding: '2.5rem',
              color: '#fff',
              textAlign: 'left',
              boxShadow: hoveredPromo === 'p1' ? '0 20px 40px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.05)',
              transform: hoveredPromo === 'p1' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="absolute right-0 bottom-0 opacity-10" style={{ transform: 'translate(10%, 10%)' }}>
              <Droplets style={{ height: 160, width: 160, rotate: '45deg' }} />
            </div>
            <span style={{ display: 'inline-block', borderRadius: 9999, backgroundColor: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14,165,233,0.3)', padding: '4px 12px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#38bdf8' }}>
              PANORAMIC VIEWS
            </span>
            <h3 style={{ marginTop: '1rem', fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 900, lineHeight: 1.25 }}>
              Curved Glass Aquariums on Sale
            </h3>
            <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, maxWidth: '22rem' }}>
              Panoramic 180-degree seamless bent glass designs, complete with energy-efficient LED daylight & night moonlight hoods.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link
                to="/products?category=fish&subcategory=accessories"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textDecoration: 'none' }}
              >
                <span>View Aquarium Kits</span>
                <ChevronRight className="h-4 w-4" style={{ transition: 'transform 200ms ease' }} />
              </Link>
            </div>
          </motion.div>

          {/* Promo 2 */}
          <motion.div
            onMouseEnter={() => setHoveredPromo('p2')}
            onMouseLeave={() => setHoveredPromo(null)}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 24,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              padding: '2.5rem',
              color: '#fff',
              textAlign: 'left',
              boxShadow: hoveredPromo === 'p2' ? '0 20px 40px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.05)',
              transform: hoveredPromo === 'p2' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="absolute right-0 bottom-0 opacity-10" style={{ transform: 'translate(10%, 10%)' }}>
              <Sparkles style={{ height: 160, width: 160 }} />
            </div>
            <span style={{ display: 'inline-block', borderRadius: 9999, backgroundColor: 'rgba(186, 230, 253, 0.15)', border: '1px solid rgba(186,230,253,0.3)', padding: '4px 12px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#bae6fd' }}>
              COLOR VIBRANCY
            </span>
            <h3 style={{ marginTop: '1rem', fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 900, lineHeight: 1.25 }}>
              Save 15% on Tropical Flake Food
            </h3>
            <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, maxWidth: '22rem' }}>
              Formulated with natural color enhancers like krill, spirulina, and essential daily multi-vitamins to aid digestion.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link
                to="/products?category=fish&subcategory=food"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 800, color: '#bae6fd', textDecoration: 'none' }}
              >
                <span>Shop Flakes</span>
                <ChevronRight className="h-4 w-4" style={{ transition: 'transform 200ms ease' }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="container mt-16" style={{ maxWidth: 1280, margin: '4rem auto 2rem auto', scrollMarginTop: '6rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', margin: 0 }}>
              Aquatic Essentials Catalog
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#8a7e72', margin: '4px 0 0 0', fontWeight: 500 }}>
              Select a subcategory below to filter products instantly
            </p>
          </div>

          {/* Subcategory selectors */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSub(sub.id)}
                style={{
                  borderRadius: 9999,
                  padding: '0.55rem 1.35rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  border: '1.5px solid rgba(0,0,0,0.06)',
                  backgroundColor: selectedSub === sub.id ? '#0ea5e9' : '#fff',
                  color: selectedSub === sub.id ? '#fff' : '#4a4036',
                  cursor: 'pointer',
                  boxShadow: selectedSub === sub.id ? '0 4px 10px rgba(14,165,233,0.2)' : '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 200ms ease',
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: '1.5rem' }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: 24,
              padding: '4rem 2rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            }}
          >
            <Droplets className="h-16 w-16 text-sky-200 animate-bounce mb-4" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2d2418', margin: 0 }}>No products available</h3>
            <p style={{ fontSize: '0.8rem', color: '#8a7e72', marginTop: '4px' }}>We are currently updating our database with more essentials!</p>
            <button
              onClick={() => setSelectedSub('all')}
              style={{
                marginTop: '1rem',
                borderRadius: 9999,
                backgroundColor: '#0ea5e9',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.5rem 1.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
