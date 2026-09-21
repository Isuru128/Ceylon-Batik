import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const FitOnMeModal = ({ product, isOpen, onClose }) => {
  const { addToast } = useToast();
  const [customerImage, setCustomerImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState(null);
  const [showGarmentOriginal, setShowGarmentOriginal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  const MAX_TRYONS_PER_SESSION = 3; // 3 images per user per session

  const [usedCount, setUsedCount] = useState(() => {
    return Number(sessionStorage.getItem('cb_vton_used_count') || 0);
  });

  const remaining = Math.max(0, MAX_TRYONS_PER_SESSION - usedCount);
  const isLimitReached = remaining <= 0;

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset preview when product changes or modal reopens
  useEffect(() => {
    if (isOpen) {
      setGeneratedPreview(null);
      setShowGarmentOriginal(false);
      setStatusMessage('');
    }
  }, [isOpen, product?.id, product?.slug]);

  if (!isOpen || !product) return null;

  const productImage = product.images?.[0] || '/images/01.jpeg';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please upload a valid image file (JPEG or PNG).', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      addToast(`Image size must be less than 5MB (Selected file is ${sizeInMb}MB).`, 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomerImage(event.target.result);
      setGeneratedPreview(null);
      setShowGarmentOriginal(false);
      setStatusMessage('Photo uploaded! Click "Generate Try-On Preview" to fit this outfit.');
    };
    reader.readAsDataURL(file);
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const drawCoverImage = (context, image, x, y, width, height) => {
    const scale = Math.max(width / image.width, height / image.height);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = (image.width - sourceWidth) / 2;
    const sourceY = (image.height - sourceHeight) / 2;
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  };

  /**
   * Generates a realistic virtual fit where the customer is the model wearing the batik dress/garment
   */
  const generateCanvasPreview = async (custSrc, prodSrc) => {
    const [custImg, prodImg] = await Promise.all([
      loadImage(custSrc),
      loadImage(prodSrc)
    ]);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 1200;

    // 1. Draw customer photo as base portrait (maintaining customer face, head, hair & lighting)
    drawCoverImage(ctx, custImg, 0, 0, canvas.width, canvas.height);

    // 2. Realistic Garment Fitting on Model Body
    // Keep user's face and upper neck visible (top ~30% of canvas)
    // Drape batik garment seamlessly over shoulders and body
    const neckY = canvas.height * 0.32;
    const bodyWidth = canvas.width;
    const bodyHeight = canvas.height - neckY;

    ctx.save();
    // Contour drape path tailored to neckline and shoulder flow
    ctx.beginPath();
    ctx.moveTo(0, neckY + 110);
    // Left shoulder curve
    ctx.bezierCurveTo(canvas.width * 0.18, neckY + 35, canvas.width * 0.35, neckY, canvas.width * 0.40, neckY);
    // Neckline contour (natural soft curve below chin)
    ctx.bezierCurveTo(canvas.width * 0.45, neckY + 55, canvas.width * 0.55, neckY + 55, canvas.width * 0.60, neckY);
    // Right shoulder curve
    ctx.bezierCurveTo(canvas.width * 0.82, neckY + 35, canvas.width * 0.85, neckY, canvas.width, neckY + 110);
    // Body silhouette down to canvas edges
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.clip();

    // Render garment draped over model body (extracting the batik garment region, omitting catalog model head)
    const garmTopCrop = prodImg.height * 0.20;
    const garmHeightCrop = prodImg.height * 0.80;
    ctx.drawImage(
      prodImg,
      0, garmTopCrop, prodImg.width, garmHeightCrop,
      0, neckY - 10, bodyWidth, bodyHeight + 10
    );

    // Soft fabric ambient shadow under collar/neck
    const shadowGrad = ctx.createLinearGradient(0, neckY, 0, neckY + 120);
    shadowGrad.addColorStop(0, 'rgba(15, 18, 55, 0.4)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(0, neckY, canvas.width, 120);

    ctx.restore();

    // Soft neckline feather blend to seamlessly merge customer skin and batik fabric
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.50, neckY + 24, canvas.width * 0.18, 48, 0, 0, Math.PI * 2);
    const featherGrad = ctx.createRadialGradient(
      canvas.width * 0.50, neckY + 24, 8,
      canvas.width * 0.50, neckY + 24, canvas.width * 0.18
    );
    featherGrad.addColorStop(0, 'rgba(0,0,0,0)');
    featherGrad.addColorStop(1, 'rgba(0,0,0,0.14)');
    ctx.fillStyle = featherGrad;
    ctx.fill();
    ctx.restore();

    // Ceylon Batik authenticity watermark pill
    const badgeW = 340;
    const badgeH = 70;
    const badgeX = canvas.width - badgeW - 24;
    const badgeY = canvas.height - badgeH - 24;

    ctx.fillStyle = 'rgba(25, 29, 79, 0.88)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16);
    ctx.fill();
    ctx.strokeStyle = '#FF90BC';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px Poppins, sans-serif';
    ctx.fillText('CEYLON BATIK • VIRTUAL FIT', badgeX + 22, badgeY + 30);

    ctx.fillStyle = '#FF90BC';
    ctx.font = '500 14px Poppins, sans-serif';
    ctx.fillText('AI Handcrafted Drape on You', badgeX + 22, badgeY + 52);

    return canvas.toDataURL('image/png');
  };

  const handleGenerate = async () => {
    if (!customerImage) {
      addToast('Please upload your photo first.', 'error');
      return;
    }

    if (isLimitReached) {
      addToast('You have reached the limit of 3 try-ons for this session.', 'error');
      return;
    }

    setGeneratedPreview(null);
    setShowGarmentOriginal(false);
    setIsGenerating(true);
    setStatusMessage(`Applying ${product.title} onto your portrait...`);

    try {
      // 1. Call backend API for server-side try-on (Option B: IDM-VTON serverless GPU)
      const remoteResult = await apiClient.generateFitPreview({
        customerImage,
        productTitle: product.title,
        productImage,
        productCategory: product.category,
        productTags: product.tags
      });

      // Update session rate limit counter
      const updatedUsed = typeof remoteResult?.used === 'number' ? remoteResult.used : (usedCount + 1);
      setUsedCount(updatedUsed);
      sessionStorage.setItem('cb_vton_used_count', String(updatedUsed));

      if (remoteResult && remoteResult.imageUrl) {
        setGeneratedPreview(remoteResult.imageUrl);
        setShowGarmentOriginal(false);
        setStatusMessage(remoteResult.message || 'AI Virtual Try-On completed via Replicate IDM-VTON!');
        addToast(`Try-on preview generated! (${Math.max(0, MAX_TRYONS_PER_SESSION - updatedUsed)} remaining)`, 'success');
        return;
      }

      throw new Error(remoteResult?.message || 'Unable to generate virtual try-on preview.');
    } catch (err) {
      console.error('Fit generation error:', err);
      const errMsg = err.message || 'Unable to render try-on preview.';
      setStatusMessage(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', padding: '28px 32px' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Modal Header with Session Rate Limit Indicator */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> AI Virtual Try-On
            </span>
            <span
              className="fit-badge"
              style={{
                fontSize: '0.74rem',
                padding: '4px 10px',
                background: isLimitReached ? '#fee2e2' : '#fdf2f8',
                color: isLimitReached ? '#b91c1c' : '#be185d',
                borderColor: isLimitReached ? '#fca5a5' : '#fbcfe8'
              }}
            >
              <i className={isLimitReached ? "fa-solid fa-lock" : "fa-solid fa-bolt"}></i>
              {isLimitReached ? '0 / 3 Left (Session Limit Reached)' : `${remaining} of 3 Try-Ons Left This Session`}
            </span>
          </div>

          <h2 style={{ fontSize: '1.75rem', color: 'var(--batik-ink)', margin: '4px 0' }}>Fit On Me Experience</h2>
          <p style={{ color: 'var(--batik-muted)', fontSize: '0.9rem', margin: 0 }}>
            Preview how <strong style={{ color: 'var(--batik-ink)' }}>{product.title}</strong> drapes on you before purchase.
          </p>
        </div>

        {/* Session Limit Reached Alert Banner */}
        {isLimitReached && (
          <div
            className="fit-mismatch-banner"
            style={{
              background: '#fef2f2',
              borderColor: '#fecaca',
              borderLeftColor: '#ef4444',
              color: '#991b1b',
              marginBottom: '18px'
            }}
          >
            <i className="fa-solid fa-shield-halved" style={{ color: '#ef4444' }}></i>
            <div>
              <strong>Session Try-On Limit Reached (3 / 3 Used)</strong>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                You have reached your limit of 3 virtual try-ons for this session. To continue exploring more styles, refresh in a new browser session or visit again soon!
              </p>
            </div>
          </div>
        )}

        {/* Dual Cards Grid: Upload (Left) | Selected Item OR Generated Try-On (Right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}
        >
          {/* Left Slot: Customer Photo Upload */}
          <div
            onClick={() => !isLimitReached && fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${customerImage ? 'var(--batik-border)' : 'var(--batik-pink)'}`,
              borderRadius: 'var(--radius-md)',
              aspectRatio: '3/4',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              cursor: isLimitReached ? 'not-allowed' : 'pointer',
              background: customerImage ? '#0f132a' : 'var(--batik-bg-alt)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={isLimitReached}
            />

            {customerImage ? (
              <>
                <img
                  src={customerImage}
                  alt="Your uploaded portrait"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 3
                  }}
                >
                  <span className="fit-badge">
                    <i className="fa-solid fa-camera"></i> Your Photo
                  </span>
                </div>
                {!isLimitReached && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(19, 23, 67, 0.85)',
                      color: '#fff',
                      padding: '8px 12px',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <i className="fa-solid fa-arrows-rotate"></i> Click to change photo
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <i
                  className="fa-solid fa-cloud-arrow-up"
                  style={{ fontSize: '2.5rem', color: 'var(--batik-pink)', marginBottom: '12px' }}
                ></i>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '6px', color: 'var(--batik-ink)' }}>
                  Upload Your Photo
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--batik-muted)', margin: 0, lineHeight: 1.4 }}>
                  Clear portrait or front-facing picture (JPG, PNG, max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Right Slot: Selected Item Image (Replaced by Generated Try-On Preview once generated!) */}
          <div className="fit-slot-card">
            {isGenerating ? (
              /* Generating Loading Animation in the space */
              <div className="fit-generating-state">
                <div className="fit-generating-pulse">
                  <i className="fa-solid fa-wand-magic-sparkles fa-spin"></i>
                </div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Styling Garment on You</h4>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
                  Fitting {product.title} onto your portrait...
                </p>
              </div>
            ) : generatedPreview && !showGarmentOriginal ? (
              /* Generated Virtual Try-On Preview (User is the Model wearing the item) */
              <>
                <img
                  src={generatedPreview}
                  alt={`Virtual Fit: ${product.title}`}
                  className="fit-slot-img"
                />

                {/* Top Badge & Toggle Control */}
                <div className="fit-slot-top-badge">
                  <span className="fit-badge badge-tryon">
                    <i className="fa-solid fa-sparkles"></i> You as the Model
                  </span>
                  <button
                    type="button"
                    className="fit-toggle-btn"
                    onClick={() => setShowGarmentOriginal(true)}
                    title="Compare with original garment image"
                  >
                    <i className="fa-solid fa-shirt"></i> View Garment
                  </button>
                </div>

                {/* Bottom Bar with Actions */}
                <div className="fit-slot-bottom-bar">
                  <strong>{product.title}</strong>
                  <div className="fit-slot-meta">
                    <span style={{ color: 'var(--batik-soft-pink)', fontWeight: 600 }}>
                      Rs. {product.price?.toLocaleString()}
                    </span>
                    <a
                      href={generatedPreview}
                      download={`ceylon-batik-fit-${product.slug}.png`}
                      className="fit-toggle-btn"
                      style={{ background: 'var(--batik-pink)', color: '#fff', textDecoration: 'none' }}
                      title="Download your virtual try-on portrait"
                    >
                      <i className="fa-solid fa-download"></i> Save PNG
                    </a>
                  </div>
                </div>
              </>
            ) : (
              /* Original Selected Garment Card (Displayed prior to generation or when toggling compare) */
              <>
                <img
                  src={productImage}
                  alt={product.title}
                  className="fit-slot-img"
                />

                {/* Top Badge */}
                <div className="fit-slot-top-badge">
                  <span className="fit-badge">
                    <i className="fa-solid fa-bag-shopping"></i> Selected Garment
                  </span>
                  {generatedPreview && (
                    <button
                      type="button"
                      className="fit-toggle-btn"
                      onClick={() => setShowGarmentOriginal(false)}
                      title="Switch back to your virtual try-on portrait"
                    >
                      <i className="fa-solid fa-person"></i> View Try-On
                    </button>
                  )}
                </div>

                {/* Bottom Bar */}
                <div className="fit-slot-bottom-bar">
                  <strong>{product.title}</strong>
                  <div className="fit-slot-meta">
                    <span style={{ color: 'var(--batik-soft-pink)', fontWeight: 600 }}>
                      Rs. {product.price?.toLocaleString()}
                    </span>
                    <span style={{ opacity: 0.85, textTransform: 'capitalize' }}>
                      {product.categoryName || 'Handcrafted Batik'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Generation Action Button & Status */}
        <div style={{ textAlign: 'center' }}>
          <button
            className={`btn fit-on-me-btn ${isLimitReached ? 'disabled-mismatch' : ''}`}
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !customerImage || isLimitReached}
            style={{ minWidth: '280px' }}
          >
            {isGenerating ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Generating Fitting...
              </>
            ) : isLimitReached ? (
              <>
                <i className="fa-solid fa-lock"></i> Session Limit Reached (3/3 Used)
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles"></i> {generatedPreview ? 'Re-generate Try-On' : 'Generate Try-On Preview'} ({remaining} left)
              </>
            )}
          </button>

          {statusMessage && (
            <p
              style={{
                marginTop: '10px',
                fontSize: '0.85rem',
                color: isLimitReached ? '#dc2626' : 'var(--batik-muted)',
                fontWeight: isLimitReached ? 600 : 400
              }}
            >
              {statusMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
