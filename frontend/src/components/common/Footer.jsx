import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="cb-container">
        <div className="footer-top">
          {/* Brand Col */}
          <div>
            <Link to="/" className="footer-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
              <img src="/images/logo1.png" alt="Ceylon Batik" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              <div>
                <strong>Ceylon Batik</strong>
                <small>සිලෝන් බතික්</small>
              </div>
            </Link>
            <p className="footer-bio">
              Preserving the timeless heritage of Sri Lankan wax-resist textile artistry.
              Handcrafted in island studios with 100% sustainable breathable fabrics, vivid natural pigments,
              and modern island elegance.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="icon-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="icon-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="icon-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop Collection</Link></li>
              <li><Link to="/shop?filter=sale">Seasonal Sale</Link></li>
              <li><Link to="/story">Our Heritage Story</Link></li>
              <li><Link to="/contact">Store Locations</Link></li>
              <li><Link to="/admin/login">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Collections</h4>
            <ul className="footer-links">
              <li><Link to="/shop?category=sarees">Batik Sarees</Link></li>
              <li><Link to="/shop?category=dresses">Dresses &amp; Kaftans</Link></li>
              <li><Link to="/shop?category=sarongs">Sarongs &amp; Men's</Link></li>
              <li><Link to="/shop?category=couples">Matching Couple Sets</Link></li>
              <li><Link to="/shop?category=custom">Made to Measure</Link></li>
              <li><Link to="/shop?category=gifts">Souvenir Gift Boxes</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4>Stay Connected</h4>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
              Subscribe to receive private preview invitations, new drop alerts, and exclusive batik craft stories.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Ceylon Batik!'); }} className="newsletter-box">
              <input type="email" placeholder="Enter your email address..." required />
              <button type="submit" className="btn btn-pink" style={{ padding: '8px 18px', borderRadius: 'var(--radius-full)' }}>
                Join
              </button>
            </form>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--batik-soft-pink)', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-shield-halved"></i>
              <span>Islandwide delivery &amp; safe checkout</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Ceylon Batik. Handcrafted in Sri Lanka with pride.</p>
          <div className="payment-badges">
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Flexible Payments:</span>
            <span className="payment-pill" style={{ background: '#7928ca' }}>KokoPay</span>
            <span className="payment-pill" style={{ background: '#00b4d8' }}>MintPay</span>
            <span className="payment-pill">Cash on Delivery</span>
            <span className="payment-pill"><i className="fa-brands fa-cc-visa"></i> Visa</span>
            <span className="payment-pill"><i className="fa-brands fa-cc-mastercard"></i> Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
