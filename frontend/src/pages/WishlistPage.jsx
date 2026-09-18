import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item, 1);
    });
    clearWishlist();
    addToast('All wishlist items moved to your cart!', 'success');
  };

  if (wishlistItems.length === 0) {
    return (
      <main style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center' }}>
        <div className="cb-container" style={{ maxWidth: '600px' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'var(--batik-bg-alt)',
            color: 'var(--batik-pink)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '2.2rem',
            margin: '0 auto 24px'
          }}>
            <i className="fa-regular fa-heart"></i>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--batik-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
            Keep track of traditional sarees, resort dresses, and matching couple sarongs you love by clicking the heart icon on any design.
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '14px 36px' }}>
            Discover Batik Pieces
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="cb-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="eyebrow">Saved Selections</span>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--batik-ink)' }}>My Wishlist ({wishlistItems.length})</h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={clearWishlist}
              className="btn btn-outline"
              style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="btn btn-pink"
              style={{ padding: '10px 24px', fontSize: '0.88rem' }}
            >
              <i className="fa-solid fa-cart-arrow-down"></i> Move All to Cart
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '28px'
        }}>
          {wishlistItems.map((prod) => (
            <div
              key={prod.id}
              style={{
                background: 'var(--batik-white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--batik-border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ aspectRatio: '3/4', position: 'relative', background: '#f5f2ed' }}>
                <img
                  src={prod.images?.[0] || '/images/01.jpeg'}
                  alt={prod.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removeFromWishlist(prod.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#ef4444',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  title="Remove"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--batik-pink)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {prod.categoryName || prod.category}
                </span>
                <h3 style={{ fontSize: '1.1rem', margin: '4px 0 8px' }}>
                  <Link to={`/product/${prod.slug}`}>{prod.title}</Link>
                </h3>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--batik-ink)', marginBottom: '16px' }}>
                  Rs. {prod.price?.toLocaleString()}
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => moveToCart(prod)}
                    className="btn btn-primary"
                    style={{ flexGrow: 1, padding: '10px', fontSize: '0.88rem' }}
                  >
                    <i className="fa-solid fa-cart-plus"></i> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
