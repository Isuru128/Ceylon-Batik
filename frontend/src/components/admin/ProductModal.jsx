import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../api/apiClient';

export const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'sarees',
    categoryName: 'Handmade Sarees',
    price: '',
    oldPrice: '',
    stock: 10,
    sku: '',
    images: [],
    description: '',
    isFeatured: true,
    isSale: false,
    specs: { fabric: 'Cotton', washCare: 'Hand wash cold' }
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        stock: product.stock ?? 10,
        images: product.images?.length ? product.images : [],
        specs: product.specs || { fabric: 'Cotton', washCare: 'Hand wash cold' }
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        category: 'sarees',
        categoryName: 'Handmade Sarees',
        price: '',
        oldPrice: '',
        stock: 10,
        sku: 'CB-' + Math.floor(1000 + Math.random() * 9000),
        images: [],
        description: '',
        isFeatured: true,
        isSale: false,
        specs: { fabric: '100% Island Cotton', washCare: 'Hand wash separately' }
      });
    }
    setUploadError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    const catMap = {
      sarees: 'Handmade Sarees',
      dresses: 'Cotton Dresses & Kaftans',
      sarongs: "Men's Sarongs",
      couples: 'Couple Sets',
      custom: 'Custom Batik Orders',
      gifts: 'Gift Sets'
    };
    setFormData((prev) => ({ ...prev, category: val, categoryName: catMap[val] || 'Batik Wear' }));
  };

  const uploadFiles = async (files) => {
    const remaining = 3 - formData.images.length;
    if (remaining <= 0) {
      setUploadError('Maximum 3 images allowed. Remove one to add more.');
      return;
    }
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      toUpload.forEach((f) => fd.append('images', f));
      const token = apiClient.getAdminToken() || apiClient.getToken();
      const res = await fetch('/api/upload/product-images', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const moveImage = (from, to) => {
    setFormData((prev) => {
      const imgs = [...prev.images];
      const [moved] = imgs.splice(from, 1);
      imgs.splice(to, 0, moved);
      return { ...prev, images: imgs };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatted = {
      ...formData,
      ...(product ? { id: product.id || product._id, _id: product._id || product.id } : {}),
      price: Number(formData.price) || 0,
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stock: Number(formData.stock) || 0,
      slug: (formData.slug || formData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    };
    onSave(formatted);
    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--batik-border)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 700,
    marginBottom: '6px',
    color: 'var(--batik-ink)'
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '700px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 style={{ fontSize: '1.4rem', marginBottom: '22px', color: 'var(--batik-ink)' }}>
          {product ? 'Edit Batik Product' : 'Add New Batik Product'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>Product Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange}
              required placeholder="e.g. Royal Peacock Cotton Batik Saree" style={inputStyle} />
          </div>

          {/* Category + SKU */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={formData.category} onChange={handleCategoryChange} style={inputStyle}>
                <option value="sarees">Batik Sarees</option>
                <option value="dresses">Dresses &amp; Kaftans</option>
                <option value="sarongs">Sarongs &amp; Men's</option>
                <option value="couples">Couple Sets</option>
                <option value="custom">Custom Orders</option>
                <option value="gifts">Gift Ready</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>SKU Code</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange}
                placeholder="CB-S214" style={inputStyle} />
            </div>
          </div>

          {/* Price + Old Price + Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Price (Rs.) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange}
                required min="0" placeholder="8500" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Old Price (Rs.)</label>
              <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange}
                min="0" placeholder="10500" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stock Units</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange}
                min="0" style={inputStyle} />
            </div>
          </div>

          {/* ── Image Upload Section ── */}
          <div>
            <label style={labelStyle}>
              Product Images
              <span style={{ fontWeight: 400, color: 'var(--batik-muted)', marginLeft: '6px' }}>
                (up to 3 · JPG, PNG, WebP · max 10 MB each)
              </span>
            </label>

            {/* Image previews */}
            {formData.images.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {formData.images.map((src, idx) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden',
                    border: idx === 0 ? '2px solid var(--batik-pink)' : '2px solid var(--batik-border)',
                    width: '120px', height: '150px', flexShrink: 0 }}>
                    <img src={src} alt={`Product ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {/* Primary badge */}
                    {idx === 0 && (
                      <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'var(--batik-pink)',
                        color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '6px' }}>
                        PRIMARY
                      </span>
                    )}
                    {/* Controls */}
                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', display: 'flex',
                      justifyContent: 'space-between', background: 'rgba(0,0,0,0.55)', padding: '4px 6px' }}>
                      {idx > 0 && (
                        <button type="button" onClick={() => moveImage(idx, idx - 1)}
                          title="Move left" style={{ color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}>
                          <i className="fa-solid fa-arrow-left"></i>
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(idx)}
                        title="Remove" style={{ color: '#ff6b6b', fontSize: '0.7rem', cursor: 'pointer', marginLeft: 'auto' }}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Drop zone / file picker */}
            {formData.images.length < 3 && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--batik-pink)' : 'var(--batik-border)'}`,
                  borderRadius: '12px',
                  padding: '28px 20px',
                  textAlign: 'center',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  background: dragOver ? 'rgba(255,144,188,0.06)' : 'var(--batik-bg-alt)',
                  transition: 'all 0.2s'
                }}
              >
                {uploading ? (
                  <div>
                    <i className="fa-solid fa-spinner fa-spin"
                      style={{ fontSize: '1.6rem', color: 'var(--batik-pink)', marginBottom: '8px' }}></i>
                    <p style={{ margin: 0, color: 'var(--batik-muted)', fontSize: '0.88rem' }}>Uploading…</p>
                  </div>
                ) : (
                  <div>
                    <i className="fa-solid fa-cloud-arrow-up"
                      style={{ fontSize: '2rem', color: 'var(--batik-pink)', marginBottom: '10px' }}></i>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--batik-ink)', fontSize: '0.92rem' }}>
                      Click to browse or drag &amp; drop
                    </p>
                    <p style={{ margin: 0, color: 'var(--batik-muted)', fontSize: '0.8rem' }}>
                      {3 - formData.images.length} slot{3 - formData.images.length !== 1 ? 's' : ''} remaining
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {uploadError && (
              <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '6px' }}>
                <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '4px' }}></i>
                {uploadError}
              </p>
            )}
            <p style={{ fontSize: '0.75rem', color: 'var(--batik-muted)', marginTop: '6px' }}>
              First image is the primary card image. Drag images to reorder.
            </p>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              rows="3" placeholder="Describe the batik craft, wax patterns, fabric, and occasions…"
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Featured + Sale */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
              <span>Featured on Homepage</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="checkbox" name="isSale" checked={formData.isSale} onChange={handleChange} />
              <span>Mark as Sale</span>
            </label>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-pink" disabled={uploading}>
              <i className="fa-solid fa-check"></i> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
