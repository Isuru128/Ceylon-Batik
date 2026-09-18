import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';

export const SearchDrawer = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      apiClient.getProducts().then(setAllProducts);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProducts.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [query, allProducts]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  // Highlights the searched word inside matching titles
  const highlightMatch = (text, q) => {
    if (!q.trim() || !text) return text;
    const cleanQ = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanQ})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            background: 'rgba(255, 144, 188, 0.45)',
            color: 'var(--batik-ink)',
            fontWeight: 700,
            padding: '1px 4px',
            borderRadius: '4px'
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const trimmedQuery = query.trim();

  return (
    <div className="search-drawer">
      <div className="cb-container">
        {/* Search Input Form */}
        <form onSubmit={handleSubmit} className="search-form-wrap">
          <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--batik-pink)' }}></i>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search handcrafted sarees, dresses, couple sets, sarongs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Active Searching Badge Inside Search Bar */}
          {trimmedQuery && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 144, 188, 0.2)',
              border: '1px solid var(--batik-pink)',
              color: 'var(--batik-ink)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              marginRight: '8px'
            }}>
              <span style={{ color: 'var(--batik-muted)', fontWeight: 500 }}>Searching:</span>
              <span style={{ color: 'var(--batik-ink)', fontWeight: 700 }}>"{trimmedQuery}"</span>
            </div>
          )}

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ color: 'var(--batik-muted)', padding: '4px', cursor: 'pointer' }}
              title="Clear search input"
            >
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          )}

          <button
            type="submit"
            className="btn btn-pink"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            Search
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{ color: 'var(--batik-ink)', fontWeight: 600, padding: '4px 8px', cursor: 'pointer' }}
          >
            Close
          </button>
        </form>

        {/* Searching Feedback Header */}
        {trimmedQuery && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            padding: '8px 16px',
            background: 'var(--batik-white)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--batik-border)',
            fontSize: '0.88rem'
          }}>
            <div>
              <span style={{ color: 'var(--batik-muted)' }}>Searching for: </span>
              <strong style={{ color: 'var(--batik-ink)', fontSize: '0.94rem' }}>"{trimmedQuery}"</strong>
              <span style={{ marginLeft: '8px', color: 'var(--batik-muted)', fontSize: '0.82rem' }}>
                ({results.length} {results.length === 1 ? 'item' : 'items'} found)
              </span>
            </div>

            {results.length > 0 && (
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  color: 'var(--batik-pink)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                View all in Catalog <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>
        )}

        {/* Live Search Results */}
        {trimmedQuery && results.length > 0 && (
          <div style={{
            marginTop: '12px',
            background: 'var(--batik-white)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            border: '1px solid var(--batik-border)',
            maxHeight: '340px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {results.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: 'var(--batik-bg-light)',
                    border: '1px solid var(--batik-border-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <h5 style={{
                      fontSize: '0.92rem',
                      margin: '0 0 4px',
                      color: 'var(--batik-ink)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {highlightMatch(p.title, trimmedQuery)}
                    </h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--batik-ink)' }}>
                        Rs. {p.price?.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--batik-pink)', fontWeight: 600 }}>
                        {p.categoryName || p.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Fallback */}
        {trimmedQuery && results.length === 0 && (
          <div style={{
            marginTop: '12px',
            background: 'var(--batik-white)',
            borderRadius: 'var(--radius-md)',
            padding: '24px 20px',
            border: '1px solid var(--batik-border)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, color: 'var(--batik-muted)', fontSize: '0.92rem' }}>
              No batik designs found matching <strong style={{ color: 'var(--batik-ink)' }}>"{trimmedQuery}"</strong>.
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--batik-muted)' }}>
              Try searching for popular terms like "Cotton Saree", "Sunset Sarong", or "Resort Dress".
            </p>
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--batik-muted)', fontWeight: 600 }}>Popular:</span>
          {['Cotton Sarees', 'Couple Sets', 'Resort Kaftans', 'Batik Sarongs', 'Gift Boxes'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setQuery(tag);
              }}
              style={{
                fontSize: '0.8rem',
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                background: trimmedQuery.toLowerCase() === tag.toLowerCase() ? 'var(--batik-ink)' : 'var(--batik-bg-alt)',
                color: trimmedQuery.toLowerCase() === tag.toLowerCase() ? '#ffffff' : 'var(--batik-ink)',
                border: '1px solid var(--batik-border)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.15s ease'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
