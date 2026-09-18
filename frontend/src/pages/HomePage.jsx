import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { ProductCard } from '../components/shop/ProductCard';
import { QuickViewModal } from '../components/shop/QuickViewModal';
export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    apiClient.getProducts().then(setProducts);
    apiClient.getTestimonials().then(setTestimonials);
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'saree') return p.category === 'sarees';
    if (activeFilter === 'dress') return p.category === 'dresses';
    if (activeFilter === 'couple') return p.category === 'couples';
    if (activeFilter === 'sale') return p.isSale;
    return true;
  });

  const pageSize = 4;
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const videoRef = React.useRef(null);
  const [bannerMode, setBannerMode] = React.useState('image'); // 'image' | 'video'

  const nextLoop = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevLoop = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <main style={{ paddingTop: '84px' }}>
      {/* ── Hero Section with Proper High-Fashion Batik Banner Image ── */}
      <section style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        padding: '70px 0',
        overflow: 'hidden',
        background: '#131743'
      }}>
        {/* Banner Media */}
        {bannerMode === 'video' ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-banner.jpg"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              transform: 'scale(1.02)'
            }}
          >
            <source src="/images/hero-banner.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/images/hero-banner.jpg"
            alt="Ceylon Batik Luxury Silk Saree Collection"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              zIndex: 0,
              transition: 'transform 0.8s ease'
            }}
          />
        )}

        {/* Tailored Atmospheric Gradient Overlay (Preserves model on the right, gives dark contrast for text on the left) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(19, 23, 67, 0.92) 0%, rgba(19, 23, 67, 0.76) 45%, rgba(19, 23, 67, 0.28) 75%, rgba(19, 23, 67, 0.05) 100%)',
          zIndex: 1
        }}></div>

        <div className="cb-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '720px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 144, 188, 0.18)', border: '1px solid rgba(255, 144, 188, 0.35)', padding: '6px 16px', borderRadius: 'var(--radius-full)', marginBottom: '18px', backdropFilter: 'blur(10px)' }}>
              <i className="fa-solid fa-gem" style={{ color: 'var(--batik-pink)', fontSize: '0.85rem' }}></i>
              <span style={{ color: 'var(--batik-soft-pink)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
                Handcrafted in Sri Lanka
              </span>
            </div>

            <h1 style={{ fontSize: '3.4rem', color: '#ffffff', margin: '0 0 16px', lineHeight: 1.15 }}>
              Traditional batik wear for modern island living
            </h1>
            <p className="sinhala-text" style={{ fontSize: '1.45rem', color: 'var(--batik-soft-pink)', fontWeight: 600, marginBottom: '16px' }}>
              ශ්‍රී ලංකාවේ අත්කම් බතික් විලාසිතා
            </p>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.92)', marginBottom: '32px', lineHeight: 1.7 }}>
              Explore handcrafted sarees, sarongs, dresses, and resort pieces made with rich island color, wax-resist artistry, and pure breathable comfort.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/shop" className="btn btn-pink" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                <i className="fa-solid fa-bag-shopping"></i> Shop Collection
              </Link>
              <Link to="/story" className="btn btn-outline-light" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                <i className="fa-solid fa-compass"></i> Discover Craft
              </Link>

              {/* Mode Toggle Button */}
              <button
                type="button"
                onClick={() => setBannerMode(bannerMode === 'image' ? 'video' : 'image')}
                aria-label="Toggle banner media"
                title={bannerMode === 'image' ? 'Switch to 5s Video Banner' : 'Switch to Photo Banner'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={`fa-solid ${bannerMode === 'image' ? 'fa-circle-play' : 'fa-image'}`} style={{ color: 'var(--batik-pink)' }}></i>
                <span>{bannerMode === 'image' ? 'Watch Craft Video' : 'View Banner Photo'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Values / Highlights ── */}
      <section style={{ background: 'var(--batik-bg-alt)', borderBottom: '1px solid var(--batik-border)', padding: '36px 0' }}>
        <div className="cb-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,144,188,0.2)', color: 'var(--batik-pink)', display: 'grid', placeItems: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-paintbrush"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>Wax-Resist Artistry</h4>
                <small style={{ color: 'var(--batik-muted)' }}>Each piece hand-drawn by master artisans</small>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(138,205,215,0.25)', color: '#2c97a7', display: 'grid', placeItems: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-feather"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>100% Island Cotton</h4>
                <small style={{ color: 'var(--batik-muted)' }}>Ultra-soft, breathable tropical drape</small>
              </div>
            </div>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-popup'))}
              title="Click to learn about AI Try-On"
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(212,154,42,0.2)', color: 'var(--batik-gold)', display: 'grid', placeItems: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Fit On Me AI <i className="fa-solid fa-circle-question" style={{ fontSize: '0.8rem', color: 'var(--batik-pink)' }}></i>
                </h4>
                <small style={{ color: 'var(--batik-muted)' }}>Virtual try-on preview before purchasing</small>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(31,35,95,0.12)', color: 'var(--batik-ink)', display: 'grid', placeItems: 'center', fontSize: '1.4rem' }}>
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>Islandwide &amp; Global</h4>
                <small style={{ color: 'var(--batik-muted)' }}>Cash on Delivery &amp; 3x Installments</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Collection Loop ── */}
      <section className="section-space">
        <div className="cb-container">
          <div className="section-heading">
            <span className="eyebrow">Latest Collection</span>
            <h2>Featured Batik Wear</h2>
            <p>Curated pieces inspired by Sri Lankan craft, tropical occasions, and everyday elegance.</p>

            {/* Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'saree', label: 'Batik Sarees' },
                { id: 'dress', label: 'Cotton Dresses' },
                { id: 'couple', label: 'Couple Sets' },
                { id: 'sale', label: 'Sale Specials' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(f.id);
                    setCurrentPage(0);
                  }}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    background: activeFilter === f.id ? 'var(--batik-ink)' : 'var(--batik-bg-alt)',
                    color: activeFilter === f.id ? 'var(--batik-white)' : 'var(--batik-text)',
                    border: `1px solid ${activeFilter === f.id ? 'var(--batik-ink)' : 'var(--batik-border)'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loop Carousel Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                className="icon-btn"
                type="button"
                onClick={prevLoop}
                aria-label="Previous page"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--batik-muted)', fontWeight: 600 }}>
                {currentPage + 1} / {totalPages}
              </span>
              <button
                className="icon-btn"
                type="button"
                onClick={nextLoop}
                aria-label="Next page"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px'
          }}>
            {paginatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/shop" className="btn btn-outline" style={{ padding: '12px 36px' }}>
              Explore Full Catalog ({products.length} Designs) →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Virtual Try-on Feature Spotlight ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1f235f 0%, #2c327d 50%, #4a2b66 100%)',
        color: '#fff',
        padding: '80px 0',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div className="cb-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--batik-pink)' }}>Next-Gen Island Fashion</span>
              <h2 style={{ fontSize: '2.8rem', color: '#fff', margin: '12px 0 20px', lineHeight: 1.2 }}>
                Try On Handcrafted Batik From Anywhere With AI
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' }}>
                Wondering how the drape of an authentic Ceylon batik saree or a sunset couple sarong looks on you?
                Upload a portrait or selfie, and our AI preview composite will render a realistic fitting demonstration directly in your browser.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/product/island-bloom-batik-dress-set" className="btn fit-on-me-btn">
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Try "Fit On Me" Now
                </Link>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-ai-popup'))}
                  className="btn btn-outline-light"
                >
                  <i className="fa-solid fa-circle-info"></i> How AI Try-On Works
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                maxWidth: '420px',
                margin: '0 auto',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
                border: '4px solid rgba(255, 255, 255, 0.15)'
              }}>
                <img src="/images/02.jpg" alt="Fit on me preview" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="section-space" style={{ background: 'var(--batik-bg-light)' }}>
        <div className="cb-container">
          <div className="section-heading">
            <span className="eyebrow">Loved Across The Island</span>
            <h2>Words From Our Patrons</h2>
            <p>Read what our customers say about our handcrafted fabrics, vibrant colors, and courier delivery.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {testimonials.map((t) => (
              <div
                key={t.id}
                style={{
                  background: 'var(--batik-white)',
                  padding: '28px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--batik-border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', color: '#ffb800', marginBottom: '16px', gap: '4px' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--batik-text)', lineHeight: 1.7, marginBottom: '20px' }}>
                  "{t.comment}"
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--batik-ink)' }}>{t.name}</strong>
                    <small style={{ color: 'var(--batik-muted)' }}>{t.city}, Sri Lanka</small>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--batik-light-muted)' }}>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </main>
  );
};
