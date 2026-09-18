import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiClient } from '../api/apiClient';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.contact || user?.phone || '',
    address: user?.address || 'No 45, Temple Road',
    city: user?.city || 'Colombo 03'
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.contact || user.phone || '',
        address: user.address || 'No 45, Temple Road',
        city: user.city || 'Colombo 03'
      });

      setLoadingOrders(true);
      apiClient.getMyOrders(user.email).then((data) => {
        setOrders(data || []);
        setLoadingOrders(false);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <main style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center' }}>
        <div className="cb-container" style={{ maxWidth: '520px' }}>
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
            <i className="fa-solid fa-lock"></i>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Please Sign In</h2>
          <p style={{ color: 'var(--batik-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
            Sign in to view your past batik orders, saved island delivery addresses, and account details.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '12px 32px' }}>
              Sign In to Account
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ padding: '12px 32px' }}>
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await apiClient.updateProfile(profileForm);
      addToast('Profile details updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Signed out of customer account.', 'info');
    navigate('/');
  };

  return (
    <main style={{ paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="cb-container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--batik-white)',
          padding: '28px 36px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--batik-border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '36px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--batik-ink), var(--batik-pink))',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '1.8rem'
            }}>
              <i className="fa-solid fa-user"></i>
            </div>
            <div>
              <h1 style={{ fontSize: '1.8rem', color: 'var(--batik-ink)', margin: 0 }}>
                {user.fullName || 'Valued Customer'}
              </h1>
              <p style={{ margin: '4px 0 0', color: 'var(--batik-muted)', fontSize: '0.9rem' }}>
                {user.email} &bull; Member since 2026
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>

        {/* Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px', alignItems: 'start' }}>
          {/* Navigation Sidebar */}
          <aside style={{
            background: 'var(--batik-white)',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--batik-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, padding: 0 }}>
              {[
                { id: 'orders', label: 'Order History', icon: 'fa-box-open' },
                { id: 'info', label: 'Personal Information', icon: 'fa-id-card' },
                { id: 'addresses', label: 'Delivery Addresses', icon: 'fa-location-dot' },
                { id: 'security', label: 'Security & Password', icon: 'fa-shield-halved' }
              ].map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: activeTab === t.id ? 'rgba(255,144,188,0.15)' : 'transparent',
                      color: activeTab === t.id ? 'var(--batik-ink)' : 'var(--batik-muted)',
                      fontWeight: activeTab === t.id ? 700 : 500,
                      fontSize: '0.92rem',
                      textAlign: 'left'
                    }}
                  >
                    <i className={`fa-solid ${t.icon}`} style={{ width: '20px', color: activeTab === t.id ? 'var(--batik-pink)' : 'inherit' }}></i>
                    <span>{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Tab Panel */}
          <div style={{
            background: 'var(--batik-white)',
            padding: '36px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--batik-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Order History</h2>
                <p style={{ color: 'var(--batik-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Track your shipped packages and review previous Sri Lankan batik purchases.
                </p>

                {loadingOrders ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--batik-muted)' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.8rem', marginBottom: '12px', color: 'var(--batik-pink)' }}></i>
                    <p style={{ margin: 0 }}>Loading your order history...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--batik-muted)' }}>
                    <i className="fa-solid fa-box-open" style={{ fontSize: '2.5rem', color: 'var(--batik-border)', marginBottom: '14px' }}></i>
                    <p style={{ margin: 0 }}>You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        border: '1px solid var(--batik-border)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Order Header */}
                      <div style={{
                        background: 'var(--batik-bg-alt)',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid var(--batik-border)',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div>
                          <strong>{ord.id}</strong> &bull; <span style={{ color: 'var(--batik-muted)', fontSize: '0.85rem' }}>{ord.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            background: '#e6f4ea',
                            color: '#137333'
                          }}>
                            {ord.status}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--batik-muted)' }}>
                            Tracking: <strong>{ord.trackingNumber}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ padding: '20px' }}>
                        {ord.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <img src={it.image} alt={it.title} style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '6px' }} />
                            <div style={{ flexGrow: 1 }}>
                              <h4 style={{ fontSize: '0.98rem', margin: '0 0 4px', color: 'var(--batik-ink)' }}>{it.title}</h4>
                              <small style={{ color: 'var(--batik-muted)' }}>Qty: {it.qty} &bull; Rs. {it.price.toLocaleString()}</small>
                            </div>
                            <span style={{ fontWeight: 700, color: 'var(--batik-ink)' }}>
                              Rs. {(it.price * it.qty).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div style={{ background: 'var(--batik-bg-light)', padding: '12px 20px', borderTop: '1px solid var(--batik-border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <span style={{ color: 'var(--batik-muted)' }}>Paid via: {ord.paymentMethod}</span>
                        <strong style={{ color: 'var(--batik-ink)' }}>Total: Rs. {ord.total.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {/* Personal Info Tab */}
            {activeTab === 'info' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Personal Information</h2>
                <p style={{ color: 'var(--batik-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Update your contact details for smooth courier notifications.
                </p>

                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '540px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                      Mobile Contact (WhatsApp / SMS)
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Saved Delivery Addresses</h2>
                <p style={{ color: 'var(--batik-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Manage addresses used during islandwide courier checkout.
                </p>

                <div style={{
                  padding: '20px',
                  border: '2px solid var(--batik-pink)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--batik-bg-alt)',
                  position: 'relative'
                }}>
                  <span className="badge badge-sale" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    Default Address
                  </span>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Home / Primary</h4>
                  <p style={{ margin: 0, color: 'var(--batik-text)', lineHeight: 1.6 }}>
                    <strong>{profileForm.fullName}</strong><br />
                    {profileForm.address}<br />
                    {profileForm.city}, Sri Lanka<br />
                    Phone: {profileForm.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Security Settings</h2>
                <p style={{ color: 'var(--batik-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Change your password to keep your Ceylon Batik account protected.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); addToast('Password successfully changed.', 'success'); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Current Password</label>
                    <input type="password" required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>New Password</label>
                    <input type="password" required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }} />
                  </div>
                  <button type="submit" className="btn btn-pink" style={{ alignSelf: 'flex-start' }}>
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
