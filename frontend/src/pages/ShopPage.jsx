import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { ProductCard } from '../components/shop/ProductCard';
import { QuickViewModal } from '../components/shop/QuickViewModal';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const filterParam = searchParams.get('filter') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [onlySale, setOnlySale] = useState(filterParam === 'sale');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('search') || '');
    if (searchParams.get('filter') === 'sale') setOnlySale(true);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    apiClient.getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'sarees', label: 'Batik Sarees' },
    { id: 'dresses', label: 'Dresses & Kaftans' },
    { id: 'sarongs', label: "Sarongs & Men's" },
    { id: 'couples', label: 'Couple Sets' },
    { id: 'custom', label: 'Custom Orders' },
    { id: 'gifts', label: 'Gift Ready' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category match
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title?.toLowerCase().includes(q);
          const matchCat = p.categoryName?.toLowerCase().includes(q);
          const matchTag = p.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchCat && !matchTag) return false;
        }
        // Price limit
        if (p.price > maxPrice) return false;
        // Sale only
        if (onlySale && !p.isSale) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, maxPrice, onlySale, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(15000);
    setOnlySale(false);
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <main style={{ paddingTop: '84px', minHeight: '80vh' }}>
      {/* ── Page Header ── */}
      <section style={{
        background: 'linear-gradient(rgba(31, 35, 95, 0.85), rgba(31, 35, 95, 0.85)), url("/images/02.jpg") center/cover no-repeat',
        color: '#fff',
        padding: '50px 0',
        textAlign: 'center'
      }}>
        <div className="cb-container">
          <span className="eyebrow" style={{ color: 'var(--batik-soft-pink)' }}>Online Storefront</span>
          <h1 style={{ fontSize: '2.8rem', color: '#fff', margin: '8px 0' }}>Batik Fashion Catalog</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
            Hand-waxed sarees, sarongs, couple sets &amp; comfortable cotton silhouettes.
          </p>
        </div>
      </section>

      {/* ── Main Catalog Layout ── */}
      <section className="section-space">
        <div className="cb-container">
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '40px', alignItems: 'start' }}>
            {/* Sidebar Filters */}
            <aside style={{
              background: 'var(--batik-white)',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--batik-border)',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '100px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Filter Pieces</h3>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  style={{ fontSize: '0.82rem', color: 'var(--batik-pink)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear All
                </button>
              </div>

              {/* Sidebar Search Input */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search attire..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 34px 10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--batik-border)',
                      fontSize: '0.88rem'
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--batik-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--batik-pink)', fontWeight: 600 }}>
                    Searching: "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Categories */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--batik-muted)', marginBottom: '12px' }}>
                  Categories
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const count = products.filter((p) => cat.id === 'all' || p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.9rem',
                          background: isSelected ? 'var(--batik-ink)' : 'transparent',
                          color: isSelected ? '#fff' : 'var(--batik-text)',
                          fontWeight: isSelected ? 600 : 400,
                          textAlign: 'left'
                        }}
                      >
                        <span>{cat.label}</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Price Slider */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--batik-muted)', margin: 0 }}>
                    Max Price
                  </h4>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--batik-ink)' }}>
                    Rs. {maxPrice.toLocaleString()}
                  </strong>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="15000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--batik-pink)' }}
                />
              </div>

              {/* Sale Only Toggle */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={onlySale}
                    onChange={(e) => setOnlySale(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--batik-pink)' }}
                  />
                  <span>On Sale Only</span>
                </label>
              </div>
            </aside>

            {/* Main Products Grid Column */}
            <div>
              {/* Toolbar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--batik-ink)' }}>
                    Showing {filteredProducts.length} results
                  </span>
                  {searchQuery && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255, 144, 188, 0.2)',
                      border: '1px solid var(--batik-pink)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem'
                    }}>
                      <span style={{ color: 'var(--batik-muted)', fontWeight: 500 }}>Searching for:</span>
                      <strong style={{ color: 'var(--batik-ink)' }}>"{searchQuery}"</strong>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        title="Clear search word"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--batik-ink)',
                          cursor: 'pointer',
                          display: 'grid',
                          placeItems: 'center',
                          padding: 0
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '0.88rem', color: 'var(--batik-muted)' }}>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--batik-border)',
                      background: 'var(--batik-white)',
                      fontSize: '0.9rem',
                      color: 'var(--batik-ink)',
                      fontWeight: 500
                    }}
                  >
                    <option value="featured">Featured Picks</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'var(--batik-pink)' }}></i>
                  <p style={{ marginTop: '16px', color: 'var(--batik-muted)' }}>Loading authentic batik wear...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 24px',
                  background: 'var(--batik-bg-light)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--batik-border)'
                }}>
                  <i className="fa-solid fa-filter" style={{ fontSize: '2.5rem', color: 'var(--batik-light-muted)', marginBottom: '16px' }}></i>
                  <h3>No products found</h3>
                  <p style={{ color: 'var(--batik-muted)', maxWidth: '400px', margin: '0 auto 20px' }}>
                    Try clearing or widening your filters to see our full handcrafted collection.
                  </p>
                  <button type="button" onClick={handleResetFilters} className="btn btn-primary">
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '24px'
                }}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </main>
  );
};
