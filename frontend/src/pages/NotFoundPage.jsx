import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <main style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center' }}>
      <div className="cb-container" style={{ maxWidth: '540px' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--batik-pink)', margin: 0, fontFamily: 'var(--font-serif)' }}>404</h1>
        <h2 style={{ fontSize: '1.8rem', margin: '8px 0 16px', color: 'var(--batik-ink)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--batik-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
          The batik design, page, or link you were looking for cannot be found or has moved.
        </p>
        <Link to="/" className="btn btn-primary" style={{ padding: '12px 32px' }}>
          Return to Homepage
        </Link>
      </div>
    </main>
  );
};
