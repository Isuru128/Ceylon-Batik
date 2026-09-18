import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';

export const StoryPage = () => {
  const [craftSteps, setCraftSteps] = useState([]);

  useEffect(() => {
    apiClient.getCraftSteps().then(setCraftSteps);
  }, []);
  return (
    <main style={{ paddingTop: '84px' }}>
      {/* ── Hero Banner ── */}
      <section style={{
        background: 'linear-gradient(rgba(19, 23, 67, 0.75), rgba(19, 23, 67, 0.85)), url("/images/02.jpg") center/cover no-repeat',
        color: '#fff',
        padding: '90px 0',
        textAlign: 'center'
      }}>
        <div className="cb-container" style={{ maxWidth: '800px' }}>
          <span className="eyebrow" style={{ color: 'var(--batik-soft-pink)' }}>Ancient Roots, Modern Island Life</span>
          <h1 style={{ fontSize: '3.2rem', color: '#fff', margin: '12px 0 16px', lineHeight: 1.15 }}>
            The Living Art of Ceylon Batik
          </h1>
          <p className="sinhala-text" style={{ fontSize: '1.4rem', color: 'var(--batik-pink)', fontWeight: 600, marginBottom: '16px' }}>
            සිලෝන් බතික් කලා ඉතිහාසය සහ සම්ප්‍රදාය
          </p>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
            Centuries of wax-resist textile heritage, hand-drawn by local artisans, kissed by tropical sunlight, and tailored for contemporary elegance.
          </p>
        </div>
      </section>

      {/* ── Brand Origin Narrative ── */}
      <section className="section-space">
        <div className="cb-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
            <div>
              <span className="eyebrow">Our Philosophy</span>
              <h2 style={{ fontSize: '2.4rem', marginBottom: '20px', lineHeight: 1.25 }}>
                Preserving Handcraft In an Age of Fast Fashion
              </h2>
              <p style={{ lineHeight: 1.8, color: 'var(--batik-muted)', fontSize: '1.02rem', marginBottom: '16px' }}>
                At Ceylon Batik, we believe clothing should carry soul. Born out of a deep reverence for Sri Lanka's historic coastal and Kandyan batik workshops, our studio was founded to preserve authentic wax-resist dyeing techniques while introducing modern relaxed silhouettes suited for island lifestyles and international occasions.
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--batik-muted)', fontSize: '1.02rem', marginBottom: '24px' }}>
                Every single saree, sarong, and kaftan represents multiple days of attentive handcrafting. Molten beeswax is brushed or canted onto pure cotton fabric, dipped into vibrant non-toxic dye vats, dried under the equatorial sun, and washed in hot spring water to remove the wax.
              </p>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <h3 style={{ fontSize: '2rem', color: 'var(--batik-pink)', margin: 0 }}>100%</h3>
                  <small style={{ color: 'var(--batik-ink)', fontWeight: 600 }}>Pure Island Cotton</small>
                </div>
                <div>
                  <h3 style={{ fontSize: '2rem', color: 'var(--batik-pink)', margin: 0 }}>45+</h3>
                  <small style={{ color: 'var(--batik-ink)', fontWeight: 600 }}>Master Artisans</small>
                </div>
                <div>
                  <h3 style={{ fontSize: '2rem', color: 'var(--batik-pink)', margin: 0 }}>0%</h3>
                  <small style={{ color: 'var(--batik-ink)', fontWeight: 600 }}>Mass Factory Printing</small>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                aspectRatio: '4/5',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-soft)'
              }}>
                <img src="/images/03.jpeg" alt="Sri Lankan Batik Artistry" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                background: 'var(--batik-ink)',
                color: '#fff',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '280px',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>
                  "When you wear Ceylon Batik, you wear the patience, dreams, and story of Sri Lankan hands."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4-Step Craft Process ── */}
      <section className="section-space" style={{ background: 'var(--batik-bg-alt)', borderTop: '1px solid var(--batik-border)', borderBottom: '1px solid var(--batik-border)' }}>
        <div className="cb-container">
          <div className="section-heading">
            <span className="eyebrow">The Method</span>
            <h2>How An Authentic Batik Is Made</h2>
            <p>A time-honored, multi-stage ritual where hot wax, natural dyes, and tropical sunlight converge.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '28px'
          }}>
            {craftSteps.map((step) => (
              <div
                key={step.step}
                style={{
                  background: 'var(--batik-white)',
                  padding: '32px 24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--batik-border)',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative'
                }}
              >
                <span style={{
                  fontSize: '3rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 700,
                  color: 'rgba(255,144,188,0.3)',
                  lineHeight: 1,
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  {step.step}
                </span>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '6px', color: 'var(--batik-ink)' }}>
                  {step.title}
                </h3>
                <h4 className="sinhala-text" style={{ fontSize: '0.95rem', color: 'var(--batik-pink)', marginBottom: '14px', fontWeight: 600 }}>
                  {step.sinhala}
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--batik-muted)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fair Trade & Ethics ── */}
      <section className="section-space">
        <div className="cb-container" style={{ maxWidth: '880px', textAlign: 'center' }}>
          <span className="eyebrow">Ethical Promise</span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Supporting Artisan Communities</h2>
          <p style={{ color: 'var(--batik-muted)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '32px' }}>
            More than 70% of our master batik makers are women artisans working in village clusters across Marawila, Galle, and Mahiyanganaya. We ensure fair living wages, healthcare stipends, and flexible home-workshop conditions so that cultural pride and economic empowerment thrive together.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '14px 36px' }}>
              Shop Ethical Batik Wear
            </Link>
            <Link to="/contact" className="btn btn-outline" style={{ padding: '14px 36px' }}>
              Visit Our Galleries
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
