import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { useToast } from '../context/ToastContext';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [storeLocations, setStoreLocations] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    apiClient.getStoreLocations().then(setStoreLocations);
    apiClient.getFaqs().then(setFaqs);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Thank you! Your message has been sent to our customer care team.', 'success');
  };

  return (
    <main style={{ paddingTop: '84px', paddingBottom: '80px' }}>
      {/* ── Banner ── */}
      <section style={{
        background: 'linear-gradient(rgba(31, 35, 95, 0.85), rgba(31, 35, 95, 0.85)), url("/images/01.jpeg") center/cover no-repeat',
        color: '#fff',
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <div className="cb-container">
          <span className="eyebrow" style={{ color: 'var(--batik-soft-pink)' }}>We'd Love To Hear From You</span>
          <h1 style={{ fontSize: '2.8rem', color: '#fff', margin: '8px 0 12px' }}>Contact &amp; Store Galleries</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Visit our physical showrooms in Colombo, Galle Fort, and Kandy, or reach out for custom orders and virtual try-on assistance.
          </p>
        </div>
      </section>

      {/* ── Contact Form & Quick Info Grid ── */}
      <section className="section-space">
        <div className="cb-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'start' }}>
            {/* Form Column */}
            <div style={{
              background: 'var(--batik-white)',
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--batik-border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span className="eyebrow">Get In Touch</span>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Send Us a Message</h2>
              <p style={{ color: 'var(--batik-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
                Have a question about fabric measurements, bulk wedding orders, or islandwide courier status?
              </p>

              {submitted ? (
                <div style={{ padding: '24px', background: '#e6f4ea', borderRadius: 'var(--radius-md)', color: '#137333', textAlign: 'center' }}>
                  <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', marginBottom: '12px' }}></i>
                  <h4 style={{ margin: '0 0 6px' }}>Message Received!</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Our team will respond to your inquiry via email or WhatsApp within 24 hours.</p>
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' }); }}
                    className="btn btn-outline"
                    style={{ marginTop: '16px', fontSize: '0.85rem', padding: '8px 16px' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anuki Jayawardena"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+94 77 ..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Custom / Made-to-Measure">Custom / Made-to-Measure Order</option>
                      <option value="Wedding / Bulk Attire">Wedding / Bridal Party Orders</option>
                      <option value="Order Tracking">Courier Status &amp; Tracking</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Your Message *
                    </label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Tell us what you are looking for..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)', resize: 'vertical' }}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', alignSelf: 'flex-start' }}>
                    <i className="fa-solid fa-paper-plane"></i> Send Inquiry
                  </button>
                </form>
              )}
            </div>

            {/* Quick Contact & Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                background: 'var(--batik-ink)',
                color: '#fff',
                padding: '32px',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)'
              }}>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '16px' }}>Customer Care Desk</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Our style advisors are ready to assist you Monday through Saturday, 9:00 AM to 6:30 PM (IST).
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <a href="tel:+94112584930" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#fff' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'grid', placeItems: 'center' }}>
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <small style={{ color: 'var(--batik-soft-pink)', display: 'block' }}>Call Hotline</small>
                      <strong>+94 11 258 4930</strong>
                    </div>
                  </a>

                  <a href="https://whatsapp.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#fff' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#25D366', display: 'grid', placeItems: 'center', color: '#fff' }}>
                      <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                      <small style={{ color: 'var(--batik-soft-pink)', display: 'block' }}>Instant WhatsApp</small>
                      <strong>+94 77 123 4567</strong>
                    </div>
                  </a>

                  <a href="mailto:support@ceylonbatik.lk" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#fff' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'grid', placeItems: 'center' }}>
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <small style={{ color: 'var(--batik-soft-pink)', display: 'block' }}>Direct Email</small>
                      <strong>support@ceylonbatik.lk</strong>
                    </div>
                  </a>
                </div>
              </div>

              {/* Islandwide Courier Guarantee */}
              <div style={{
                background: 'var(--batik-bg-alt)',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--batik-border)'
              }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--batik-ink)', marginBottom: '8px' }}>
                  <i className="fa-solid fa-truck-ramp-box" style={{ color: 'var(--batik-pink)', marginRight: '8px' }}></i>
                  Islandwide Delivery Promise
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--batik-muted)', margin: 0, lineHeight: 1.6 }}>
                  Orders placed online are inspected in dust-proof batik pouches and dispatched within 24 hours. Enjoy tracking updates directly on your phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Store Showrooms ── */}
      <section className="section-space" style={{ background: 'var(--batik-bg-light)', borderTop: '1px solid var(--batik-border)' }}>
        <div className="cb-container">
          <div className="section-heading">
            <span className="eyebrow">Visit Us In Person</span>
            <h2>Our Physical Galleries</h2>
            <p>Touch the fabrics, admire the wax crackle motifs in natural light, and consult with our artisans.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}>
            {storeLocations.map((loc) => (
              <div
                key={loc.id}
                style={{
                  background: 'var(--batik-white)',
                  padding: '30px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--batik-border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,144,188,0.2)', color: 'var(--batik-pink)', display: 'grid', placeItems: 'center', fontSize: '1.2rem' }}>
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{loc.name}</h3>
                    <small className="sinhala-text" style={{ color: 'var(--batik-muted)' }}>{loc.sinhala}</small>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--batik-text)', marginBottom: '14px', lineHeight: 1.6 }}>
                  <i className="fa-solid fa-map-pin" style={{ color: 'var(--batik-muted)', marginRight: '8px' }}></i>
                  {loc.address}
                </p>

                <p style={{ fontSize: '0.88rem', color: 'var(--batik-muted)', marginBottom: '8px' }}>
                  <i className="fa-regular fa-clock" style={{ marginRight: '8px' }}></i>
                  {loc.hours}
                </p>

                <p style={{ fontSize: '0.88rem', color: 'var(--batik-muted)', marginBottom: '20px' }}>
                  <i className="fa-solid fa-phone" style={{ marginRight: '8px' }}></i>
                  {loc.phone}
                </p>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(loc.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ marginTop: 'auto', padding: '8px 16px', fontSize: '0.85rem', textAlign: 'center' }}
                >
                  <i className="fa-solid fa-diamond-turn-right"></i> Open in Google Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="section-space">
        <div className="cb-container" style={{ maxWidth: '800px' }}>
          <div className="section-heading">
            <span className="eyebrow">Common Inquiries</span>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    background: 'var(--batik-white)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--batik-border)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--batik-ink)',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ color: 'var(--batik-pink)', fontSize: '0.85rem' }}></i>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', color: 'var(--batik-muted)', fontSize: '0.92rem', lineHeight: 1.7, borderTop: '1px solid var(--batik-border-subtle)', paddingTop: '14px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
