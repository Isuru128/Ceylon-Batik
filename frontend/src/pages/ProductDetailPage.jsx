import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { FitOnMeModal } from '../components/shop/FitOnMeModal';
import { ProductCard } from '../components/shop/ProductCard';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [activeTab, setActiveTab] = useState('desc');
  const [isFitModalOpen, setIsFitModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      name: 'Kumari Wickramasinghe',
      rating: 5,
      date: '2 weeks ago',
      comment: 'The wax resist crackle detail on this piece is breathtaking! Fits beautifully and stays cool in humid weather.'
    },
    {
      name: 'Dinuka Fernanado',
      rating: 5,
      date: '1 month ago',
      comment: 'Top tier craftsmanship. Got so many compliments at my graduation ceremony.'
    }
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    apiClient.getProductBySlug(slug).then((prod) => {
      setProduct(prod);
      setSelectedImgIndex(0);
      setQuantity(1);
    });

    apiClient.getProducts().then((all) => {
      setRelatedProducts(all.filter((p) => p.slug !== slug).slice(0, 4));
    });
  }, [slug]);

  if (!product) {
    return (
      <main style={{ paddingTop: '120px', textAlign: 'center', minHeight: '60vh' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'var(--batik-pink)' }}></i>
        <p style={{ marginTop: '16px', color: 'var(--batik-muted)' }}>Loading product details...</p>
      </main>
    );
  }

  const images = product.images && product.images.length ? product.images : ['/images/01.jpeg'];
  const isWishlisted = isInWishlist(product.id);
  const installmentKoko = Math.round(product.price / 3);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    const newRev = {
      name: reviewName,
      rating: reviewRating,
      date: 'Just now',
      comment: reviewText
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewName('');
    setReviewText('');
    addToast('Thank you for submitting your verified review!', 'success');
  };

  return (
    <main style={{ paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="cb-container">
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '8px', fontSize: '0.88rem', color: 'var(--batik-muted)', marginBottom: '28px' }}>
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span style={{ color: 'var(--batik-ink)', fontWeight: 600 }}>{product.title}</span>
        </nav>

        {/* Top Product Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'start', marginBottom: '64px' }}>
          {/* Gallery Column */}
          <div>
            <div style={{ display: 'flex', gap: '16px' }}>
              {/* Thumbnails list */}
              {images.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImgIndex(idx)}
                      style={{
                        width: '74px',
                        height: '98px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: `2px solid ${selectedImgIndex === idx ? 'var(--batik-pink)' : 'transparent'}`,
                        opacity: selectedImgIndex === idx ? 1 : 0.75,
                        background: '#f5f2ed',
                        padding: 0
                      }}
                    >
                      <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div
                style={{
                  flexGrow: 1,
                  aspectRatio: '3/4',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#f5f2ed',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'zoom-in'
                }}
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={images[selectedImgIndex]}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(6px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <i className="fa-solid fa-expand"></i> Click to Zoom
                </div>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div>
            <span className="eyebrow">{product.categoryName || product.category}</span>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--batik-ink)', margin: '8px 0 12px', lineHeight: 1.2 }}>
              {product.title}
            </h1>

            {/* Ratings & SKU row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div className="product-rating" style={{ margin: 0 }}>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-star ${i < (product.rating || 5) ? 'fa-solid' : 'fa-regular'}`}></i>
                ))}
                <span style={{ color: 'var(--batik-muted)', fontSize: '0.85rem', marginLeft: '6px' }}>
                  ({reviewsList.length} verified reviews)
                </span>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--batik-muted)' }}>|</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--batik-muted)' }}>
                SKU: <strong>{product.sku || 'CB-B2026'}</strong>
              </span>
              <span className="badge badge-new" style={{ fontSize: '0.75rem' }}>
                In Stock ({product.stock || 12})
              </span>
            </div>

            {/* Price Box */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--batik-ink)' }}>
                Rs. {product.price?.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span style={{ fontSize: '1.3rem', color: 'var(--batik-light-muted)', textDecoration: 'line-through' }}>
                  Rs. {product.oldPrice?.toLocaleString()}
                </span>
              )}
              {product.oldPrice && (
                <span className="badge badge-sale">
                  Save Rs. {(product.oldPrice - product.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Installment Options Card */}
            <div style={{
              background: 'var(--batik-bg-alt)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--batik-border)',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <i className="fa-solid fa-credit-card" style={{ color: 'var(--batik-pink)' }}></i>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Interest-Free Installments Available</span>
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--batik-text)' }}>
                Pay in 3 X <strong>Rs. {installmentKoko.toLocaleString()}</strong> with <strong style={{ color: '#00b4d8' }}>MintPay</strong> (4.5% cashback)
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--batik-text)' }}>
                or 3 X <strong>Rs. {installmentKoko.toLocaleString()}</strong> with <strong style={{ color: '#7928ca' }}>KokoPay</strong>
              </p>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--batik-ink)' }}>
                  Garment Fit / Size:
                </label>
                <span style={{ fontSize: '0.85rem', color: 'var(--batik-pink)', cursor: 'pointer', textDecoration: 'underline' }}>
                  Size Guide
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['Standard', 'S', 'M', 'L', 'XL', 'Custom Made'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: `2px solid ${selectedSize === sz ? 'var(--batik-ink)' : 'var(--batik-border)'}`,
                      background: selectedSize === sz ? 'var(--batik-ink)' : 'var(--batik-white)',
                      color: selectedSize === sz ? 'var(--batik-white)' : 'var(--batik-ink)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Actions */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--batik-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '42px', height: '46px', background: 'var(--batik-bg-alt)', fontSize: '1.2rem' }}
                >
                  -
                </button>
                <span style={{ width: '48px', textAlign: 'center', fontWeight: 700, fontSize: '1.05rem' }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '42px', height: '46px', background: 'var(--batik-bg-alt)', fontSize: '1.2rem' }}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-primary"
                type="button"
                onClick={() => addToCart(product, quantity, selectedSize)}
                style={{ flexGrow: 1, padding: '14px 28px', fontSize: '1rem' }}
              >
                <i className="fa-solid fa-cart-plus"></i> Add to Cart (Rs. {(product.price * quantity).toLocaleString()})
              </button>

              <button
                className={`icon-btn ${isWishlisted ? 'active' : ''}`}
                type="button"
                onClick={() => toggleWishlist(product)}
                style={{ width: '48px', height: '48px' }}
                title="Save to Wishlist"
              >
                <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`} style={{ color: isWishlisted ? '#ff3366' : 'inherit', fontSize: '1.2rem' }}></i>
              </button>
            </div>

            {/* Signature "Fit on me" Button */}
            <div style={{ marginBottom: '28px' }}>
              <button
                type="button"
                className="btn fit-on-me-btn"
                onClick={() => setIsFitModalOpen(true)}
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                <i className="fa-solid fa-person-dress" style={{ fontSize: '1.2rem' }}></i>
                Fit on me (AI Virtual Try-On)
              </button>
            </div>

            {/* Delivery highlights */}
            <div style={{ borderTop: '1px solid var(--batik-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--batik-muted)' }}>
                <i className="fa-solid fa-truck" style={{ color: 'var(--batik-pink)', width: '20px' }}></i>
                <span>Fast islandwide courier delivery (2-4 business days)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--batik-muted)' }}>
                <i className="fa-solid fa-hand-holding-dollar" style={{ color: 'var(--batik-pink)', width: '20px' }}></i>
                <span>Cash on Delivery (COD) available across Sri Lanka</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--batik-muted)' }}>
                <i className="fa-solid fa-rotate-left" style={{ color: 'var(--batik-pink)', width: '20px' }}></i>
                <span>Hassle-free 7-day exchanges &amp; custom adjustments</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Information Tabs ── */}
        <section style={{
          background: 'var(--batik-white)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--batik-border)',
          padding: '36px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '64px'
        }}>
          {/* Tab Header Buttons */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '2px solid var(--batik-border)', paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto' }}>
            {[
              { id: 'desc', label: 'Description & Craft' },
              { id: 'specs', label: 'Fabric Specifications' },
              { id: 'care', label: 'Care & Washing' },
              { id: 'reviews', label: `Customer Reviews (${reviewsList.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontSize: '1.05rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? 'var(--batik-pink)' : 'var(--batik-muted)',
                  borderBottom: activeTab === tab.id ? '3px solid var(--batik-pink)' : '3px solid transparent',
                  paddingBottom: '12px',
                  marginBottom: '-14px',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'desc' && (
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Artisan Craftsmanship</h3>
              <p style={{ lineHeight: 1.8, color: 'var(--batik-text)', fontSize: '0.98rem', marginBottom: '16px' }}>
                {product.description}
              </p>
              <p style={{ lineHeight: 1.8, color: 'var(--batik-text)', fontSize: '0.98rem' }}>
                Each garment is handcrafted by certified Sri Lankan batik artisans. Due to the organic nature of beeswax cracking and hand-mixed mineral dye baths, minor variations in wax fissures occur naturally, ensuring every customer receives a truly singular work of island wearable art.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Material &amp; Construction</h3>
              <table style={{ width: '100%', maxWidth: '600px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--batik-border)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--batik-ink)', width: '40%' }}>Fabric Composition</td>
                    <td style={{ padding: '12px 0', color: 'var(--batik-muted)' }}>{product.specs?.fabric || '100% Island Cotton'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--batik-border)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--batik-ink)' }}>Drape / Fit</td>
                    <td style={{ padding: '12px 0', color: 'var(--batik-muted)' }}>{product.specs?.fit || 'Relaxed island silhouette'}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--batik-border)' }}>
                    <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--batik-ink)' }}>Dimensions</td>
                    <td style={{ padding: '12px 0', color: 'var(--batik-muted)' }}>{product.specs?.length || 'Tailored to standard Sri Lankan metric sizes'}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--batik-ink)' }}>Origin</td>
                    <td style={{ padding: '12px 0', color: 'var(--batik-muted)' }}>Sri Lanka (Certified Ethical Craft)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'care' && (
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '14px' }}>Preserving Your Batik</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--batik-text)' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <i className="fa-solid fa-droplet" style={{ color: 'var(--batik-blue)' }}></i>
                  <span>Hand wash separately in cold water using a mild gentle liquid soap.</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <i className="fa-solid fa-sun" style={{ color: 'var(--batik-gold)' }}></i>
                  <span>Do not wring or twist vigorously. Air dry in shaded tropical breezes to avoid fading.</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <i className="fa-solid fa-fire-burner" style={{ color: 'var(--batik-pink)' }}></i>
                  <span>Iron on medium setting on the reverse side of the wax motifs.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Customer Feedback</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '36px' }}>
                {reviewsList.map((rev, idx) => (
                  <div key={idx} style={{ padding: '16px', background: 'var(--batik-bg-alt)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--batik-ink)' }}>{rev.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--batik-muted)' }}>{rev.date}</span>
                    </div>
                    <div style={{ color: '#ffb800', fontSize: '0.85rem', marginBottom: '8px' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--batik-text)' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <div style={{ background: 'var(--batik-bg-light)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--batik-border)' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Write a Customer Review</h4>
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                    />
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 / 5) - Outstanding</option>
                      <option value="4">⭐⭐⭐⭐ (4 / 5) - Very Good</option>
                      <option value="3">⭐⭐⭐ (3 / 5) - Average</option>
                    </select>
                  </div>
                  <textarea
                    rows="3"
                    placeholder="Share your thoughts about fabric comfort, colors, and styling..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)', resize: 'vertical' }}
                  ></textarea>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>

        {/* ── Related Products ── */}
        <section>
          <div className="section-heading" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <span className="eyebrow">Complementary Looks</span>
            <h2>You May Also Adore</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={() => {}} />
            ))}
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="modal-backdrop" onClick={() => setIsLightboxOpen(false)}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsLightboxOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <img
              src={images[selectedImgIndex]}
              alt={product.title}
              style={{ maxHeight: '85vh', maxWidth: '85vw', borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

      {/* Fit On Me Modal */}
      <FitOnMeModal
        product={product}
        isOpen={isFitModalOpen}
        onClose={() => setIsFitModalOpen(false)}
      />
    </main>
  );
};
