import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: 'fa-chart-pie' },
    { id: 'products', label: 'Products & Inventory', icon: 'fa-shirt' },
    { id: 'orders', label: 'Orders & Fulfillment', icon: 'fa-truck-fast' },
    { id: 'users', label: 'Customer Accounts', icon: 'fa-users' },
    { id: 'gateways', label: 'Payment Gateways', icon: 'fa-credit-card' },
  ];

  return (
    <>
      <aside style={{
        width: '270px',
        background: 'var(--batik-ink)',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(31,35,95,0.15)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: '#fff',
            borderRadius: '8px',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden'
          }}>
            <img src="/images/logo1.png" alt="CB" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
          </div>
          <div>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#fff', display: 'block' }}>
              Ceylon Batik
            </strong>
            <small style={{ color: 'var(--batik-soft-pink)', fontSize: '0.75rem', fontWeight: 600 }}>
              Admin Portal
            </small>
          </div>
        </div>

        {/* Navigation List */}
        <ul style={{ listStyle: 'none', padding: '20px 12px', margin: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    color: isActive ? 'var(--batik-ink)' : 'rgba(255, 255, 255, 0.8)',
                    background: isActive ? 'var(--batik-pink)' : 'transparent',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    textAlign: 'left'
                  }}
                >
                  <i className={`fa-solid ${item.icon}`} style={{ width: '20px', textAlign: 'center' }}></i>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom Actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--batik-soft-pink)',
              fontSize: '0.88rem',
              fontWeight: 500
            }}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>View Customer Store</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ff8080',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              background: 'transparent',
              border: 'none',
              padding: '6px 0'
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Sign Out Confirmation Modal Dialog */}
      {showLogoutConfirm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowLogoutConfirm(false)}
          style={{ zIndex: 9999 }}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '440px',
              padding: '36px 32px 30px',
              textAlign: 'center',
              borderRadius: '24px',
              boxShadow: '0 25px 60px rgba(19, 23, 67, 0.35)',
              border: '1px solid var(--batik-border)',
              background: '#ffffff'
            }}
          >
            <button
              className="modal-close-btn"
              onClick={() => setShowLogoutConfirm(false)}
              aria-label="Close dialog"
              style={{ top: '16px', right: '16px', width: '36px', height: '36px' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Warning Icon Badge */}
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.75rem',
                margin: '0 auto 18px',
                border: '2px solid rgba(239, 68, 68, 0.2)'
              }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </div>

            <h3 style={{
              margin: '0 0 10px',
              fontSize: '1.35rem',
              color: 'var(--batik-ink)',
              fontWeight: 700
            }}>
              Sign Out of Admin Portal?
            </h3>

            <p style={{
              margin: '0 0 28px',
              color: 'var(--batik-muted)',
              fontSize: '0.92rem',
              lineHeight: 1.6
            }}>
              Are you sure you want to sign out? You will need to enter your admin credentials again to access the dashboard.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="btn btn-outline"
                style={{
                  flex: 1,
                  padding: '11px 18px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: '1px solid var(--batik-border)',
                  color: 'var(--batik-ink)',
                  background: 'transparent'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: '11px 18px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#dc2626')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#ef4444')}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Yes, Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
