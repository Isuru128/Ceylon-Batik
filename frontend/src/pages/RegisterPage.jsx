import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        fullName,
        email,
        contact: contact || email,
        password
      });
      addToast('Account created successfully! Welcome to Ceylon Batik.', 'success');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="cb-container" style={{ maxWidth: '520px' }}>
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
            <h1 style={{ fontSize: '1.8rem', color: 'var(--batik-ink)', margin: 0 }}>Create Customer Account</h1>
            <p style={{ color: 'var(--batik-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
              Join the Ceylon Batik family for private collections &amp; express checkout.
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kasun Fernando"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="kasun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Mobile Number (for delivery SMS)
              </label>
              <input
                type="tel"
                placeholder="+94 77 123 4567"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-pink"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Register Account'}
            </button>
          </form>

          {/* Switch to Login */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--batik-border)', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--batik-muted)' }}>Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--batik-ink)', fontWeight: 700 }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
