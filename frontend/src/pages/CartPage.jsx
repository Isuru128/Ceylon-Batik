import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    discountAmount,
    couponCode,
    applyCoupon,
    total
  } = useCart();
  const { addToast } = useToast();

  const [promoInput, setPromoInput] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Colombo',
    paymentMethod: 'cod'
  });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput) return;
    applyCoupon(promoInput);
    setPromoInput('');
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address) {
      addToast('Please fill in all delivery details.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.createOrder({
        customer: checkoutForm,
        items,
        subtotal,
        shipping,
        discountAmount,
        couponCode,
        total,
        paymentMethod: checkoutForm.paymentMethod
      });
      clearCart();
      setOrderPlaced(true);
      setIsCheckoutOpen(false);
      addToast('Order placed successfully! We will contact you shortly.', 'success');
    } catch (err) {
      console.error('Order creation error:', err);
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const installmentVal = Math.round(total / 3);

  if (items.length === 0 && !orderPlaced) {
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
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--batik-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
            You haven't added any handcrafted batik pieces to your shopping cart yet. Discover our latest sarees, sarongs, and resort dresses.
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '14px 36px' }}>
            Browse Batik Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="cb-container">
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Checkout Flow</span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--batik-ink)' }}>Shopping Cart</h1>
        </div>

        {orderPlaced ? (
          <div style={{
            background: 'var(--batik-white)',
            padding: '48px 32px',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--batik-pink)',
            textAlign: 'center',
            maxWidth: '640px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-soft)'
          }}>
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: '#e6f4ea',
              color: '#137333',
              display: 'grid',
              placeItems: 'center',
              fontSize: '2.2rem',
              margin: '0 auto 20px'
            }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--batik-ink)', marginBottom: '8px' }}>
              Bohoma Isthuthi! (Thank You!)
            </h2>
            <p className="sinhala-text" style={{ color: 'var(--batik-pink)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>
              ඔබගේ ඇණවුම සාර්ථකව භාරගන්නා ලදී
            </p>
            <p style={{ color: 'var(--batik-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
              Your handcrafted batik order has been sent to our studio. We will prepare your pieces with care and dispatch via courier to:
              <br />
              <strong style={{ color: 'var(--batik-ink)' }}>{checkoutForm.address}, {checkoutForm.city} ({checkoutForm.phone})</strong>
            </p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
            {/* Cart Items Table */}
            <div style={{
              background: 'var(--batik-white)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--batik-border)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--batik-border)', paddingBottom: '14px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Items in Cart ({items.length})</h3>
                <button
                  type="button"
                  onClick={clearCart}
                  style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Empty Cart
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '90px 1fr auto auto',
                      gap: '20px',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--batik-border-subtle)',
                      paddingBottom: '20px'
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: '90px', height: '110px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#f5f2ed' }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Title & Info */}
                    <div>
                      <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--batik-pink)', fontWeight: 600 }}>
                        {item.category}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', margin: '4px 0 6px', color: 'var(--batik-ink)' }}>
                        <Link to={`/product/${item.slug}`}>{item.title}</Link>
                      </h4>
                      <span style={{ fontSize: '0.82rem', color: 'var(--batik-muted)', background: 'var(--batik-bg-alt)', padding: '2px 8px', borderRadius: '4px' }}>
                        Size: <strong>{item.size}</strong>
                      </span>
                      <div style={{ marginTop: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--batik-ink)' }}>
                        Rs. {item.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--batik-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        style={{ width: '32px', height: '34px', background: 'var(--batik-bg-alt)' }}
                      >
                        -
                      </button>
                      <span style={{ width: '34px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        style={{ width: '32px', height: '34px', background: 'var(--batik-bg-alt)' }}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--batik-ink)', marginBottom: '8px' }}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size)}
                        style={{ color: 'var(--batik-light-muted)', fontSize: '0.9rem' }}
                        title="Remove item"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <input
                  type="text"
                  placeholder="Promo Code (e.g. CEYLON10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--batik-border)'
                  }}
                />
                <button type="submit" className="btn btn-outline" style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)' }}>
                  Apply
                </button>
              </form>
              {couponCode && (
                <p style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: '8px', fontWeight: 600 }}>
                  <i className="fa-solid fa-tag"></i> Active Coupon: {couponCode} applied!
                </p>
              )}
            </div>

            {/* Order Summary Column */}
            <div style={{
              background: 'var(--batik-white)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--batik-border)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '100px'
            }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '1px solid var(--batik-border)', paddingBottom: '12px' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--batik-muted)' }}>Cart Subtotal:</span>
                  <strong style={{ color: 'var(--batik-ink)' }}>Rs. {subtotal.toLocaleString()}</strong>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                    <span>Coupon Discount:</span>
                    <strong>- Rs. {discountAmount.toLocaleString()}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--batik-muted)' }}>Islandwide Delivery:</span>
                  <strong>{shipping === 0 ? <span style={{ color: '#16a34a' }}>FREE</span> : `Rs. ${shipping}`}</strong>
                </div>

                {subtotal < 10000 && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--batik-pink)', background: 'var(--batik-bg-alt)', padding: '6px 10px', borderRadius: '4px' }}>
                    Add Rs. {(10000 - subtotal).toLocaleString()} more for FREE Delivery!
                  </div>
                )}

                <div style={{ borderTop: '2px solid var(--batik-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--batik-ink)' }}>
                  <span>Estimated Total:</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Installment Badge */}
              <div style={{ background: 'var(--batik-bg-alt)', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.82rem', color: 'var(--batik-text)' }}>
                <span>or 3 monthly installments of </span>
                <strong style={{ color: 'var(--batik-ink)' }}>Rs. {installmentVal.toLocaleString()}</strong>
                <span> with Koko / MintPay</span>
              </div>

              <button
                type="button"
                className="btn btn-pink"
                onClick={() => setIsCheckoutOpen(true)}
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Drawer / Modal */}
      {isCheckoutOpen && (
        <div className="modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '32px' }}>
            <button className="modal-close-btn" onClick={() => setIsCheckoutOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--batik-ink)' }}>
              Complete Your Order
            </h2>
            <p style={{ color: 'var(--batik-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Total to pay: <strong>Rs. {total.toLocaleString()}</strong>
            </p>

            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Fernando"
                  value={checkoutForm.fullName}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Delivery City *
                  </label>
                  <select
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                  >
                    <option value="Colombo">Colombo (1-15)</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Other">Other Districts</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Delivery Address *
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="House number, street address, area..."
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                  Payment Method *
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'cod', label: 'Cash on Delivery (Islandwide)', icon: 'fa-money-bill-wave' },
                    { id: 'kokopay', label: 'KokoPay (3 interest-free installments)', icon: 'fa-credit-card' },
                    { id: 'mintpay', label: 'MintPay (3 installments + 4.5% cashback)', icon: 'fa-wallet' },
                    { id: 'card', label: 'Visa / Mastercard / AMEX', icon: 'fa-shield-halved' }
                  ].map((method) => (
                    <label
                      key={method.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: `1px solid ${checkoutForm.paymentMethod === method.id ? 'var(--batik-pink)' : 'var(--batik-border)'}`,
                        background: checkoutForm.paymentMethod === method.id ? 'rgba(255,144,188,0.1)' : 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={checkoutForm.paymentMethod === method.id}
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: method.id })}
                      />
                      <i className={`fa-solid ${method.icon}`} style={{ color: 'var(--batik-ink)' }}></i>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsCheckoutOpen(false)} className="btn btn-outline" disabled={submitting}>
                  Back
                </button>
                <button type="submit" className="btn btn-pink" disabled={submitting}>
                  {submitting ? 'Placing Order...' : `Confirm & Place Order (Rs. ${total.toLocaleString()})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
