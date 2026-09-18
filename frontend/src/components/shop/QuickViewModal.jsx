import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard');

  if (!product) return null;

  const images = product.images && product.images.length ? product.images : ['/images/01.jpeg'];
  const installmentKoko = Math.round(product.price / 3);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px', padding: '32px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Media Column */}
          <div>
            <div style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#f5f2ed', marginBottom: '12px' }}>
              <img
                src={images[selectedImg]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: `2px solid ${selectedImg === idx ? 'var(--batik-pink)' : 'transparent'}`,
                      opacity: selectedImg === idx ? 1 : 0.7
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="eyebrow" style={{ marginBottom: '4px' }}>
              {product.categoryName || product.category}
            </span>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{product.title}</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div className="product-rating" style={{ margin: 0 }}>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-star ${i < (product.rating || 5) ? 'fa-solid' : 'fa-regular'}`}></i>
                ))}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--batik-muted)' }}>
                SKU: {product.sku || 'CB-DEFAULT'}
              </span>
              <span className="badge badge-new" style={{ fontSize: '0.7rem' }}>
                In Stock ({product.stock || 10})
              </span>
            </div>

            <div className="product-price-row" style={{ marginBottom: '12px' }}>
              <span className="price-current" style={{ fontSize: '1.6rem' }}>
                Rs. {product.price?.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="price-old" style={{ fontSize: '1.1rem' }}>
                  Rs. {product.oldPrice?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Installments Box */}
            <div style={{ background: 'var(--batik-bg-alt)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--batik-border)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--batik-text)', margin: '0 0 4px' }}>
                3 X <strong>Rs. {installmentKoko.toLocaleString()}</strong> or 4.5% cashback with <strong style={{ color: '#00b4d8' }}>MintPay</strong>
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--batik-text)', margin: 0 }}>
                or 3 X <strong>Rs. {installmentKoko.toLocaleString()}</strong> with <strong style={{ color: '#7928ca' }}>KokoPay</strong>
              </p>
            </div>

            <p style={{ color: 'var(--batik-muted)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Size Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--batik-ink)' }}>
                Select Size:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Standard', 'S', 'M', 'L', 'XL', 'Custom'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: `1px solid ${selectedSize === sz ? 'var(--batik-ink)' : 'var(--batik-border)'}`,
                      background: selectedSize === sz ? 'var(--batik-ink)' : 'var(--batik-white)',
                      color: selectedSize === sz ? 'var(--batik-white)' : 'var(--batik-ink)'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--batik-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '38px', height: '38px', background: 'var(--batik-bg-alt)', fontSize: '1.1rem' }}
                >
                  -
                </button>
                <span style={{ width: '42px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem' }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '38px', height: '38px', background: 'var(--batik-bg-alt)', fontSize: '1.1rem' }}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-primary"
                type="button"
                onClick={handleAddToCart}
                style={{ flexGrow: 1 }}
              >
                <i className="fa-solid fa-cart-plus"></i> Add to Cart (Rs. {(product.price * quantity).toLocaleString()})
              </button>

              <button
                className={`icon-btn ${isWishlisted ? 'active' : ''}`}
                type="button"
                onClick={() => toggleWishlist(product)}
                title="Wishlist"
              >
                <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`} style={{ color: isWishlisted ? '#ff3366' : 'inherit' }}></i>
              </button>
            </div>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              style={{
                textAlign: 'center',
                fontSize: '0.88rem',
                color: 'var(--batik-ink)',
                textDecoration: 'underline',
                fontWeight: 600,
                marginTop: 'auto'
              }}
            >
              View Full Product Details &amp; Virtual Try-on →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
