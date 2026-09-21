import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const AiTryOnPopup = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`ai-modal-backdrop ${isOpen ? 'is-active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="aiModalTitle"
    >
      <div className="ai-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top-right close button */}
        <button
          className="ai-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close pop-up"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Floating gradient icon */}
        <div className="ai-modal-icon">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </div>

        {/* Card Header */}
        <span className="card-kicker" id="aiModalTitle">AI Try-On Experience</span>
        <h2>Virtual Batik Preview</h2>
        <p className="sinhala-text" style={{ color: 'var(--batik-pink)', fontSize: '0.95rem', fontWeight: 600, margin: '-6px 0 14px' }}>
          කෘත්‍රිම බුද්ධි අතථ්‍ය අත්හදා බැලීම
        </p>
        <p>
          Experience our intelligent fitting technology! Preview how handcrafted Sri Lankan sarees, dresses, and couple sarongs drape on you before you order.
        </p>

        {/* 3 Detailed Steps */}
        <div className="ai-modal-steps">
          <div className="ai-step-box">
            <div className="ai-step-num">Step 01</div>
            <div className="ai-step-title">Pick Attire</div>
            <p className="ai-step-desc">Select any handcrafted saree, dress, or couple set in our shop.</p>
          </div>

          <div className="ai-step-box">
            <div className="ai-step-num">Step 02</div>
            <div className="ai-step-title">Upload Photo</div>
            <p className="ai-step-desc">Upload a clear selfie or portrait photo on the product page.</p>
          </div>

          <div className="ai-step-box">
            <div className="ai-step-num">Step 03</div>
            <div className="ai-step-title">Instant Fitting</div>
            <p className="ai-step-desc">See the realistic drape composite rendered in seconds!</p>
          </div>
        </div>

        {/* Actions */}
        <div className="ai-modal-actions">
          <Link
            to="/shop"
            onClick={onClose}
            className="btn btn-pink cb-btn"
          >
            <i className="fa-solid fa-person-dress" style={{ marginRight: '4px' }}></i>
            Browse Designs &amp; Try On
          </Link>
          <button
            type="button"
            className="ai-modal-dismiss"
            onClick={onClose}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
