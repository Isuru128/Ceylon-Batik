import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images = product.images && product.images.length ? product.images : ['/images/01.jpeg'];
  const hasMultipleImages = images.length > 1;
  const isWishlisted = isInWishlist(product.id);
  const installmentKoko = Math.round(product.price / 3);

  return (
    <article className="product-card">
      <div
        className="product-card-media"
        onMouseEnter={() => hasMultipleImages && setCurrentImgIndex(1)}
        onMouseLeave={() => setCurrentImgIndex(0)}
      >
        <img
          src={images[currentImgIndex]}
          alt={product.title}
          loading="lazy"
        />

        {/* Badges */}
        <div className="product-card-badges">
          {product.isSale && <span className="badge badge-sale">Sale</span>}
          {product.oldPrice && !product.isSale && <span className="badge badge-new">New</span>}
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <button
            className={`card-action-btn ${isWishlisted ? 'active' : ''}`}
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label="Wishlist"
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`}></i>
          </button>
        </div>

        {/* Quick View Button */}
        <button
          className="product-card-overlay-btn"
          type="button"
          onClick={() => onQuickView(product)}
        >
          <i className="fa-solid fa-eye"></i> Quick View
        </button>
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{product.categoryName || product.category}</span>
        
        <h3 className="product-card-title">
          <Link to={`/product/${product.slug}`}>{product.title}</Link>
        </h3>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`fa-star ${i < (product.rating || 5) ? 'fa-solid' : 'fa-regular'}`}
            ></i>
          ))}
          <span style={{ fontSize: '0.78rem', color: 'var(--batik-muted)', marginLeft: '4px' }}>
            ({product.reviewCount || 12})
          </span>
        </div>

        <div className="product-price-row">
          <span className="price-current">Rs. {product.price?.toLocaleString()}</span>
          {product.oldPrice && (
            <span className="price-old">Rs. {product.oldPrice?.toLocaleString()}</span>
          )}
        </div>

        <div className="installment-hint">
          or 3 X <strong>Rs. {installmentKoko.toLocaleString()}</strong> with <strong>koko / mintpay</strong>
        </div>

        <button
          className="btn btn-primary product-card-btn"
          type="button"
          onClick={() => addToCart(product, 1)}
        >
          <i className="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </article>
  );
};
