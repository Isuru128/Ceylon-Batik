import React, { useState, useEffect } from 'react';

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
    images: ['/images/01.jpeg'],
    description: '',
    isFeatured: true,
    isSale: false,
    specs: {
      fabric: 'Cotton',
      washCare: 'Hand wash cold'
    }
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        stock: product.stock || 10,
        images: product.images && product.images.length ? product.images : ['/images/01.jpeg'],
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
        images: ['/images/01.jpeg', '/images/02.jpg'],
        description: '',
        isFeatured: true,
        isSale: false,
        specs: {
          fabric: '100% Island Cotton',
          washCare: 'Hand wash separately'
        }
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    setFormData((prev) => ({
      ...prev,
      category: val,
      categoryName: catMap[val] || 'Batik Wear'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatted = {
      ...formData,
      price: Number(formData.price) || 0,
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stock: Number(formData.stock) || 0,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    onSave(formatted);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', padding: '32px' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--batik-ink)' }}>
          {product ? 'Edit Product' : 'Add New Batik Product'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Royal Peacock Cotton Batik Saree"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              >
                <option value="sarees">Batik Sarees</option>
                <option value="dresses">Dresses &amp; Kaftans</option>
                <option value="sarongs">Sarongs &amp; Men's</option>
                <option value="couples">Couple Sets</option>
                <option value="custom">Custom Orders</option>
                <option value="gifts">Gift Ready</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                SKU Code
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="CB-S214"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Price (Rs.) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="8500"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Old Price (Rs.)
              </label>
              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                min="0"
                placeholder="10500"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Stock Units
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Image URL / Path
            </label>
            <input
              type="text"
              value={formData.images[0] || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, images: [e.target.value, '/images/02.jpg'] }))}
              placeholder="/images/01.jpeg or https://..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Provide information on the batik craft, wax patterns, occasions, and fabric drape..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--batik-border)', resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span>Featured on Homepage</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                name="isSale"
                checked={formData.isSale}
                onChange={handleChange}
              />
              <span>Mark as Sale</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-pink">
              <i className="fa-solid fa-check"></i> Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
