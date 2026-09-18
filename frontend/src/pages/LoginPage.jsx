import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const { login } = useAuth();
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
      await login(contact, password);
      addToast('Welcome back to Ceylon Batik!', 'success', 'Signed In');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setContact('isurudula28@gmail.com');
    setPassword('isuru123');
  };

  return (
    <main style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="cb-container" style={{ maxWidth: '480px' }}>
        <div style={{
          background: 'var(--batik-white)',
          padding: '40px 36px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--batik-border)',
          boxShadow: 'var(--shadow-card)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/images/logo1.png" alt="Ceylon Batik" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              <div style={{ textAlign: 'left' }}>
                <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--batik-ink)', display: 'block' }}>
                  Ceylon Batik
                </strong>
                <small className="sinhala-text" style={{ color: 'var(--batik-pink)', fontSize: '0.75rem', fontWeight: 600 }}>
                  සිලෝන් බතික්
                </small>
              </div>
            </Link>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--batik-ink)', margin: 0 }}>Customer Sign In</h1>
            <p style={{ color: 'var(--batik-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
              Access your wishlist, order tracking, and AI try-on history.
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#b91c1c',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
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
                Email or Mobile Number
              </label>
              <input
                type="text"
                required
                placeholder="isurudula28@gmail.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Password</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--batik-pink)', cursor: 'pointer' }}>
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '6px' }}
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Sign In to Account'}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                fontSize: '0.82rem',
                color: 'var(--batik-ink)',
                background: 'var(--batik-bg-alt)',
                border: '1px dashed var(--batik-border)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-key" style={{ marginRight: '6px', color: 'var(--batik-pink)' }}></i>
              Fill Demo Customer (isurudula28 / isuru123)
            </button>
          </div>

          {/* Switch to Register */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--batik-border)', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--batik-muted)' }}>Don't have an account yet? </span>
            <Link to="/register" style={{ color: 'var(--batik-pink)', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
