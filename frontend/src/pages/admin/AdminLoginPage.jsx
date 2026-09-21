import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(contact, password);
      addToast('Authenticated to Ceylon Batik Admin Portal.', 'success');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setContact('admin');
    setPassword('admin123');
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, #1f235f, #0d0f2b)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 36px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'var(--batik-ink)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(31,35,95,0.25)'
          }}>
            <img src="/images/logo1.png" alt="CB" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--batik-ink)', margin: 0, fontFamily: 'var(--font-serif)' }}>
            Admin Portal
          </h1>
          <p style={{ color: 'var(--batik-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
            Storefront inventory, analytics &amp; fulfillment access.
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#b91c1c',
            padding: '12px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            border: '1px solid #fecaca'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Admin Username / Email
            </label>
            <input
              type="text"
              required
              placeholder="admin"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Security Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '6px' }}
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Authenticate as Admin'}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--batik-border)', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--batik-muted)', fontSize: '0.88rem' }}>
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </main>
  );
};
