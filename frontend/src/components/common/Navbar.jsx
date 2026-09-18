import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const Navbar = ({ onOpenSearch }) => {
  const { user, logout, isAdmin } = useAuth();
  const { totalCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="cb-container">
        <div className="header-inner">
          {/* Brand */}
          <Link to="/" className="brand-lockup">
            <img src="/images/logo1.png" alt="Ceylon Batik" className="brand-mark-img" />
            <div className="brand-titles">
              <strong>Ceylon Batik</strong>
              <small>සිලෝන් බතික්</small>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav>
            <ul className="nav-links">
              <li>
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Shop
                </NavLink>
              </li>
              <li
                className="nav-dropdown-wrapper"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <span className="nav-link" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Categories <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.75rem' }}></i>
                </span>
                {categoriesOpen && (
                  <div className="dropdown-menu">
                    <Link to="/shop?category=sarees" className="dropdown-item" onClick={() => setCategoriesOpen(false)}>
                      Batik Sarees
                    </Link>
                    <Link to="/shop?category=dresses" className="dropdown-item" onClick={() => setCategoriesOpen(false)}>
                      Dresses &amp; Kaftans
                    </Link>
                    <Link to="/shop?category=sarongs" className="dropdown-item" onClick={() => setCategoriesOpen(false)}>
                      Sarongs &amp; Men
                    </Link>
                    <Link to="/shop?category=couples" className="dropdown-item" onClick={() => setCategoriesOpen(false)}>
                      Couple Sets
                    </Link>
                    <Link to="/shop?category=gifts" className="dropdown-item" onClick={() => setCategoriesOpen(false)}>
                      Gift Sets
                    </Link>
                  </div>
                )}
              </li>
              <li>
                <NavLink to="/shop?filter=new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  New Collection
                </NavLink>
              </li>
              <li>
                <NavLink to="/story" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Our Story
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Contact
                </NavLink>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="badge badge-sale" style={{ padding: '6px 12px' }}>
                    <i className="fa-solid fa-gauge" style={{ marginRight: '6px' }}></i> Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Header Action Icons */}
          <div className="header-actions">
            {/* Search Button */}
            <button
              className="icon-btn"
              type="button"
              onClick={onOpenSearch}
              aria-label="Search catalog"
              title="Search products"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>

            {/* User Account / Dropdown */}
            <div style={{ position: 'relative' }}>
              {user ? (
                <div>
                  <button
                    className="user-profile-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    type="button"
                  >
                    <i className="fa-solid fa-circle-user" style={{ color: 'var(--batik-pink)', fontSize: '1.2rem' }}></i>
                    <span>{user.fullName?.split(' ')[0] || 'My Account'}</span>
                    <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.7rem' }}></i>
                  </button>

                  {userDropdownOpen && (
                    <div className="dropdown-menu" style={{ right: 0, left: 'auto' }}>
                      <div style={{ padding: '8px 20px', borderBottom: '1px solid var(--batik-border)', marginBottom: '6px' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--batik-ink)' }}>{user.fullName}</strong>
                        <small style={{ color: 'var(--batik-muted)', fontSize: '0.78rem' }}>{user.email}</small>
                      </div>
                      <Link to="/profile" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                        <i className="fa-regular fa-id-card" style={{ marginRight: '8px' }}></i> My Profile
                      </Link>
                      <Link to="/wishlist" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                        <i className="fa-regular fa-heart" style={{ marginRight: '8px' }}></i> Wishlist
                      </Link>
                      <Link to="/cart" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                        <i className="fa-solid fa-cart-shopping" style={{ marginRight: '8px' }}></i> My Cart
                      </Link>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        style={{ color: '#ef4444', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                      >
                        <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '8px' }}></i> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="user-profile-btn" title="Sign In">
                  <i className="fa-regular fa-user"></i>
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="icon-btn" aria-label="Wishlist" title="View Wishlist">
              <i className="fa-regular fa-heart"></i>
              {wishlistCount > 0 && <span className="count-badge">{wishlistCount}</span>}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="icon-btn" aria-label="Shopping Cart" title="View Cart">
              <i className="fa-solid fa-cart-shopping"></i>
              {totalCount > 0 && <span className="count-badge">{totalCount}</span>}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              className="mobile-nav-toggle icon-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--batik-white)',
          padding: '24px',
          borderBottom: '2px solid var(--batik-pink)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1.1rem' }}>Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1.1rem' }}>Shop All Products</Link>
          <Link to="/shop?category=sarees" onClick={() => setMobileMenuOpen(false)} style={{ paddingLeft: '16px', color: 'var(--batik-muted)' }}>- Batik Sarees</Link>
          <Link to="/shop?category=dresses" onClick={() => setMobileMenuOpen(false)} style={{ paddingLeft: '16px', color: 'var(--batik-muted)' }}>- Dresses &amp; Kaftans</Link>
          <Link to="/shop?category=sarongs" onClick={() => setMobileMenuOpen(false)} style={{ paddingLeft: '16px', color: 'var(--batik-muted)' }}>- Sarongs &amp; Men</Link>
          <Link to="/shop?category=couples" onClick={() => setMobileMenuOpen(false)} style={{ paddingLeft: '16px', color: 'var(--batik-muted)' }}>- Couple Sets</Link>
          <Link to="/story" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1.1rem' }}>Our Story</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1.1rem' }}>Contact</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--batik-pink)', fontWeight: 700 }}>
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
