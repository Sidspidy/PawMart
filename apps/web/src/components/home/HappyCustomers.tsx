import React, { useState } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    pet: 'Golden Retriever Mom',
    avatar: '👩‍🦰',
    rating: 5,
    text: 'PawMart completely changed how I shop for Max! The premium kibble is top quality and delivery is always on time. Best pet store ever!',
    petEmoji: '🐕',
    accentColor: '#f97316',
    bgGradient: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(251,191,36,0.06))',
    borderColor: 'rgba(249,115,22,0.15)',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    pet: 'Cat Dad × 3',
    avatar: '👨‍🦱',
    rating: 5,
    text: 'Three cats, zero stress. The subscription box for my fur babies arrives perfectly packed every month. The feather wands are their absolute favorite!',
    petEmoji: '🐈',
    accentColor: '#a855f7',
    bgGradient: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(192,132,252,0.06))',
    borderColor: 'rgba(168,85,247,0.15)',
  },
  {
    id: 3,
    name: 'Emily Chen',
    pet: 'Aquarium Enthusiast',
    avatar: '👩',
    rating: 5,
    text: 'Found the most amazing coral decor and LED lights here. My aquarium has never looked more stunning. Customer support was incredibly helpful too!',
    petEmoji: '🐠',
    accentColor: '#0ea5e9',
    bgGradient: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(56,189,248,0.06))',
    borderColor: 'rgba(14,165,233,0.15)',
  },
  {
    id: 4,
    name: 'David Park',
    pet: 'Parrot Whisperer',
    avatar: '🧔',
    rating: 5,
    text: 'Kiwi (my green cheek conure) goes crazy for the foraging toys from PawMart. The quality is leagues above anything at big box pet stores.',
    petEmoji: '🦜',
    accentColor: '#22c55e',
    bgGradient: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(74,222,128,0.06))',
    borderColor: 'rgba(34,197,94,0.15)',
  },
  {
    id: 5,
    name: 'Priya Sharma',
    pet: 'Hamster Family',
    avatar: '👩‍🦳',
    rating: 4,
    text: 'The exercise wheel and timothy hay bundle was the best deal I\'ve found anywhere. My hamsters are healthier and happier. Will definitely reorder!',
    petEmoji: '🐹',
    accentColor: '#ec4899',
    bgGradient: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(244,114,182,0.06))',
    borderColor: 'rgba(236,72,153,0.15)',
  },
  {
    id: 6,
    name: 'Michael Torres',
    pet: 'Rescue Dog Advocate',
    avatar: '👨',
    rating: 5,
    text: 'I adopt rescues and PawMart\'s orthopedic beds have been a game changer for my senior dogs. The reward points system is genuinely generous too!',
    petEmoji: '🐕‍🦺',
    accentColor: '#d97706',
    bgGradient: 'linear-gradient(135deg, rgba(217,119,6,0.08), rgba(245,158,11,0.06))',
    borderColor: 'rgba(217,119,6,0.15)',
  },
];

const stats = [
  { value: '50K+', label: 'Happy Pets', icon: '🐾' },
  { value: '4.9', label: 'Average Rating', icon: '⭐' },
  { value: '98%', label: 'Satisfaction', icon: '💯' },
  { value: '24/7', label: 'Pet Support', icon: '💬' },
];

export default function HappyCustomers() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      padding: '7rem 0 10rem',
    }}>

      {/* ── Background Landscape Image with Overlays ─────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <img
          src="/images/footer.png"
          alt="PawMart World"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            display: 'block',
          }}
        />
        {/* Light overlay on top for text legibility fading into dark footer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.1) 40%, #1a1510 100%)',
        }} />

        {/* Floating paw prints over background */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`paw-bg-${i}`}
            style={{
              position: 'absolute',
              left: `${10 + i * 16}%`, top: `${15 + (i % 3) * 30}%`,
              fontSize: '1.2rem', opacity: 0.08,
            }}
            animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
          >
            🐾
          </motion.div>
        ))}
      </div>

      {/* ── Content Container (Responsive & Centered) ───────── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 1.5rem',
      }}>

        {/* ── Section Header ─────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
          <span style={{
            fontSize: '0.8rem', fontWeight: 700, color: '#f97316',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            display: 'block', marginBottom: '0.3rem',
          }}>
            Happy Customers
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900,
            color: '#2d2418', fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2,
          }}>
            Pet Parents Love Us
          </h2>
          <p style={{
            fontSize: '1rem', color: '#706457ff', marginTop: '0.6rem',
            maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6,
          }}>
            Thousands of pet parents trust PawMart for their furry, feathery, and finned family members.
          </p>
        </div>

        {/* ── Stats Row ──────────────────────────────────────── */}
        {/* <div style={{
          display: 'flex', justifyContent: 'center', gap: '1.5rem',
          marginBottom: '3rem', position: 'relative', zIndex: 1, flexWrap: 'wrap',
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.03 }}
              style={{
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(12px)',
                borderRadius: 20, padding: '1rem 1.75rem',
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                textAlign: 'center', minWidth: 130,
                cursor: 'default',
              }}
            >
              <span style={{ fontSize: '1.3rem', display: 'block', marginBottom: '0.2rem' }}>{stat.icon}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2d2418', fontFamily: 'var(--font-display)', display: 'block' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#8a7e72', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div> */}

        {/* ── Testimonial Cards Grid ─────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          position: 'relative', zIndex: 1,
        }}>
          {testimonials.map((t, i) => {
            const isHovered = hoveredId === t.id;
            return (
              <motion.div
                key={t.id}
                onMouseEnter={() => setHoveredId(t.id)}
                onMouseLeave={() => setHoveredId(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: isHovered
                    ? t.bgGradient
                    : 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: 28,
                  padding: '2rem',
                  border: `1.5px solid ${isHovered ? t.borderColor : 'rgba(255,255,255,0.6)'}`,
                  boxShadow: isHovered
                    ? `0 20px 50px rgba(0,0,0,0.08), 0 0 0 1px ${t.borderColor}`
                    : '0 2px 12px rgba(0,0,0,0.03)',
                  transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                {/* Decorative pet emoji in background */}
                <div style={{
                  position: 'absolute', bottom: -10, right: -5,
                  fontSize: '5rem', opacity: isHovered ? 0.08 : 0.04,
                  transition: 'opacity 400ms ease',
                  pointerEvents: 'none',
                }}>
                  {t.petEmoji}
                </div>

                {/* Quote mark */}
                <div style={{
                  position: 'absolute', top: 16, right: 20,
                  fontSize: '3rem', fontFamily: 'Georgia, serif',
                  color: isHovered ? '#ffffff' : t.accentColor,
                  opacity: isHovered ? 0.22 : 0.15,
                  lineHeight: 1, transition: 'all 400ms ease',
                  pointerEvents: 'none',
                }}>
                  "
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 2, marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} width="16" height="16" viewBox="0 0 24 24"
                      fill={si < t.rating ? (isHovered ? '#ffffff' : '#f59e0b') : (isHovered ? 'rgba(255,255,255,0.3)' : '#e5e7eb')} stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Review text */}
                <p style={{
                  fontSize: '0.92rem',
                  color: isHovered ? '#ffffff' : '#4a4036',
                  lineHeight: 1.65,
                  fontWeight: 500, marginBottom: '1.5rem', position: 'relative', zIndex: 1,
                  transition: 'color 400ms ease',
                }}>
                  {t.text}
                </p>

                {/* Author row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.03)',
                    border: `2px solid ${isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.05)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', transition: 'all 400ms ease',
                  }}>
                    {t.avatar}
                  </div>

                  <div>
                    <span style={{
                      display: 'block', fontSize: '0.88rem', fontWeight: 800,
                      color: isHovered ? '#ffffff' : '#2d2418',
                      fontFamily: 'var(--font-display)',
                      transition: 'color 400ms ease',
                    }}>
                      {t.name}
                    </span>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      fontSize: '0.72rem', fontWeight: 600,
                      color: isHovered ? 'rgba(255,255,255,0.85)' : t.accentColor,
                      transition: 'color 400ms ease',
                    }}>
                      {t.petEmoji} {t.pet}
                    </span>
                  </div>

                  {/* Verified badge */}
                  <div style={{
                    marginLeft: 'auto',
                    fontSize: '0.65rem', fontWeight: 700,
                    color: isHovered ? '#ffffff' : '#22c55e',
                    background: isHovered ? 'rgba(255,255,255,0.2)' : 'rgba(34,197,94,0.08)',
                    padding: '0.25rem 0.6rem', borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    transition: 'all 400ms ease',
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={isHovered ? '#ffffff' : '#22c55e'} stroke="none">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Verified
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
