import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { apiClient } from '../../api/apiClient';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { ProductModal } from '../../components/admin/ProductModal';

export const AdminDashboardPage = () => {
  const { adminUser, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Payment gateways state
  const [gateways, setGateways] = useState({
    kokoPay: true,
    mintPay: true,
    cod: true,
    card: true
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prods, s, u, ords] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getAdminStats(),
        apiClient.getAdminUsers(),
        apiClient.getAdminOrders()
      ]);
      setProducts(prods || []);
      if (s) setStats(s);
      setUsers(u || []);
      setOrders(ords || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    loadDashboardData();
  }, [isAdmin, navigate]);

  const handleCreateNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await apiClient.deleteProduct(id);
        addToast(`Deleted product "${title}"`, 'info');
        loadDashboardData();
      } catch (err) {
        addToast(err.message || 'Failed to delete product', 'error');
      }
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      await apiClient.saveProduct(productData);
      addToast(editingProduct ? 'Product updated successfully!' : 'New product published to store!', 'success');
      loadDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus);
      addToast(`Order ${orderId} updated to ${newStatus}`, 'success');
      const [ords, s] = await Promise.all([
        apiClient.getAdminOrders(),
        apiClient.getAdminStats()
      ]);
      setOrders(ords || []);
      if (s) setStats(s);
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  if (!isAdmin) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6fa' }}>
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div style={{ marginLeft: '270px', flexGrow: 1, padding: '32px 40px' }}>
        {/* Header Banner */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(31,35,95,0.05)',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: 'var(--batik-ink)', margin: 0, fontWeight: 700 }}>
              {activeTab === 'overview' && 'Store Operations Overview'}
              {activeTab === 'products' && 'Product Inventory Management'}
              {activeTab === 'orders' && 'Customer Orders & Shipments'}
              {activeTab === 'users' && 'Customer Accounts & Roles'}
              {activeTab === 'gateways' && 'Installments & Payment Gateways'}
            </h1>
            <p style={{ margin: '2px 0 0', color: 'var(--batik-muted)', fontSize: '0.85rem' }}>
              Ceylon Batik Storefront Administration &bull; Logged in as <strong>{adminUser?.username || 'admin'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/" target="_blank" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              <i className="fa-solid fa-store"></i> Live Storefront
            </Link>
            {activeTab === 'products' && (
              <button type="button" onClick={handleCreateNew} className="btn btn-pink" style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
                <i className="fa-solid fa-plus"></i> Add New Product
              </button>
            )}
          </div>
        </div>

        {/* ── Tab: Overview ── */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(31,35,95,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--batik-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Revenue</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--batik-ink)', marginTop: '4px' }}>Rs. {(stats.totalRevenue || 0).toLocaleString()}</div>
                  <small style={{ color: '#16a34a', fontWeight: 600 }}></small>
                </div>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,144,188,0.2)', color: 'var(--batik-pink)', display: 'grid', placeItems: 'center', fontSize: '1.4rem' }}>
                  <i className="fa-solid fa-coins"></i>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(31,35,95,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--batik-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Products</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--batik-ink)', marginTop: '4px' }}>{products.length} Designs</div>
                  <small style={{ color: 'var(--batik-muted)' }}>In stock &amp; ready</small>
                </div>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(138,205,215,0.25)', color: '#2c97a7', display: 'grid', placeItems: 'center', fontSize: '1.4rem' }}>
                  <i className="fa-solid fa-shirt"></i>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(31,35,95,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--batik-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Orders</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--batik-ink)', marginTop: '4px' }}>{orders.length} Orders</div>
                  <small style={{ color: '#16a34a', fontWeight: 600 }}>{stats.pendingOrders || 0} active fulfillment</small>
                </div>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(212,154,42,0.2)', color: 'var(--batik-gold)', display: 'grid', placeItems: 'center', fontSize: '1.4rem' }}>
                  <i className="fa-solid fa-truck-ramp-box"></i>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(31,35,95,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--batik-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Customers</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--batik-ink)', marginTop: '4px' }}>{users.length} Users</div>
                  <small style={{ color: '#16a34a', fontWeight: 600 }}>Registered accounts</small>
                </div>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(31,35,95,0.12)', color: 'var(--batik-ink)', display: 'grid', placeItems: 'center', fontSize: '1.4rem' }}>
                  <i className="fa-solid fa-users"></i>
                </div>
              </div>
            </div>

            {/* Recent Orders Table Panel */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(31,35,95,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--batik-ink)' }}>Recent Customer Orders</h2>
                <button type="button" onClick={() => setActiveTab('orders')} style={{ color: 'var(--batik-pink)', fontWeight: 600, fontSize: '0.88rem' }}>
                  View All Orders →
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fc', textAlign: 'left', fontSize: '0.82rem', color: 'var(--batik-muted)', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Customer</th>
                    <th style={{ padding: '12px 16px' }}>Items</th>
                    <th style={{ padding: '12px 16px' }}>Total</th>
                    <th style={{ padding: '12px 16px' }}>Method</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--batik-border)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>{ord.id}</td>
                      <td style={{ padding: '14px 16px' }}>{ord.customer}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--batik-muted)' }}>{ord.items}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>Rs. {ord.total.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px' }}>{ord.method}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600, background: ord.status === 'Delivered' ? '#e6f4ea' : '#e8f0fe', color: ord.status === 'Delivered' ? '#137333' : '#1a73e8' }}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Products Inventory ── */}
        {activeTab === 'products' && (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(31,35,95,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Product Catalog ({products.length} designs)</h2>
              <button type="button" onClick={handleCreateNew} className="btn btn-pink" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                <i className="fa-solid fa-plus"></i> Add New Product
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--batik-pink)' }}></i>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fc', textAlign: 'left', fontSize: '0.82rem', color: 'var(--batik-muted)', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Product</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Price</th>
                    <th style={{ padding: '12px 16px' }}>Stock</th>
                    <th style={{ padding: '12px 16px' }}>Featured</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--batik-muted)' }}>
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                          <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(255,144,188,0.15)',
                            color: 'var(--batik-pink)',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '1.8rem',
                            margin: '0 auto 16px'
                          }}>
                            <i className="fa-solid fa-box-open"></i>
                          </div>
                          <h3 style={{ margin: '0 0 8px', color: 'var(--batik-ink)', fontSize: '1.15rem' }}>No Products in Catalog</h3>
                          <p style={{ margin: '0 0 20px', fontSize: '0.88rem', color: 'var(--batik-muted)', lineHeight: 1.5 }}>
                            The catalog is completely clean and ready for your original batik creations. Click below to add your first design.
                          </p>
                          <button
                            type="button"
                            onClick={handleCreateNew}
                            className="btn btn-pink"
                            style={{ padding: '9px 24px', fontSize: '0.88rem' }}
                          >
                            <i className="fa-solid fa-plus"></i> Add First Product
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id || p._id} style={{ borderBottom: '1px solid var(--batik-border)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={p.images?.[0] || '/images/01.jpeg'} alt={p.title} style={{ width: '44px', height: '54px', objectFit: 'cover', borderRadius: '6px' }} />
                            <div>
                              <strong style={{ display: 'block', color: 'var(--batik-ink)' }}>{p.title}</strong>
                              <small style={{ color: 'var(--batik-muted)' }}>SKU: {p.sku || 'N/A'}</small>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>{p.categoryName || p.category}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>Rs. {p.price?.toLocaleString()}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontWeight: 600, color: (p.stock || 10) < 5 ? '#ef4444' : '#16a34a' }}>
                            {p.stock ?? 0} in stock
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {p.isFeatured ? <span style={{ color: '#16a34a' }}>✓ Yes</span> : <span style={{ color: 'var(--batik-muted)' }}>-</span>}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            style={{ color: 'var(--batik-ink)', marginRight: '14px', cursor: 'pointer' }}
                            title="Edit"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id || p._id, p.title)}
                            style={{ color: '#ef4444', cursor: 'pointer' }}
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Tab: Orders ── */}
        {activeTab === 'orders' && (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(31,35,95,0.05)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Store Orders ({orders.length})</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fc', textAlign: 'left', fontSize: '0.82rem', color: 'var(--batik-muted)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Order ID</th>
                  <th style={{ padding: '12px 16px' }}>Recipient</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Total Amount</th>
                  <th style={{ padding: '12px 16px' }}>Payment Provider</th>
                  <th style={{ padding: '12px 16px' }}>Fulfillment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--batik-border)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{ord.id}</td>
                    <td style={{ padding: '14px 16px' }}>{ord.customer}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--batik-muted)' }}>{ord.date}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>Rs. {ord.total.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px' }}>{ord.method}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: '1px solid var(--batik-border)',
                          background: ord.status === 'Delivered' ? '#e6f4ea' : (ord.status === 'Shipped' ? '#e8f0fe' : '#fff3e0'),
                          color: ord.status === 'Delivered' ? '#137333' : (ord.status === 'Shipped' ? '#1a73e8' : '#b45309'),
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tab: Customer Accounts ── */}
        {activeTab === 'users' && (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(31,35,95,0.05)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Registered Customers ({users.length})</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fc', textAlign: 'left', fontSize: '0.82rem', color: 'var(--batik-muted)', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Customer Name</th>
                  <th style={{ padding: '12px 16px' }}>Email / Contact</th>
                  <th style={{ padding: '12px 16px' }}>Tier</th>
                  <th style={{ padding: '12px 16px' }}>Past Orders</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--batik-border)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--batik-muted)' }}>{u.email}</td>
                    <td style={{ padding: '14px 16px' }}>{u.role}</td>
                    <td style={{ padding: '14px 16px' }}>{u.orders} purchases</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600, background: '#e6f4ea', color: '#137333' }}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Tab: Payment Gateways ── */}
        {activeTab === 'gateways' && (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(31,35,95,0.05)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Installment Gateways &amp; Payment Options</h2>
            <p style={{ color: 'var(--batik-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Configure installment integrations displayed to customers in product view and checkout.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* KokoPay */}
              <div style={{ border: '2px solid var(--batik-pink)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-credit-card" style={{ fontSize: '1.5rem', color: '#7928ca' }}></i>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>KokoPay</h3>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={gateways.kokoPay}
                      onChange={(e) => setGateways({ ...gateways, kokoPay: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--batik-muted)', lineHeight: 1.6 }}>
                  Splits purchases into 3 monthly interest-free payments. Displayed on product cards &amp; quick view.
                </p>
                <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                  ✓ Enabled for Cart &amp; Product Detail
                </div>
              </div>

              {/* MintPay */}
              <div style={{ border: '2px solid var(--batik-blue)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-wallet" style={{ fontSize: '1.5rem', color: '#00b4d8' }}></i>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>MintPay</h3>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={gateways.mintPay}
                      onChange={(e) => setGateways({ ...gateways, mintPay: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--batik-muted)', lineHeight: 1.6 }}>
                  Buy Now Pay Later with 3 installments and 4.5% cashback promotion.
                </p>
                <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                  ✓ Enabled for Cart &amp; Product Detail
                </div>
              </div>

              {/* COD */}
              <div style={{ border: '2px solid var(--batik-border)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-money-bill-wave" style={{ fontSize: '1.5rem', color: 'var(--batik-gold)' }}></i>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Cash on Delivery</h3>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={gateways.cod}
                      onChange={(e) => setGateways({ ...gateways, cod: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--batik-muted)', lineHeight: 1.6 }}>
                  Islandwide courier delivery with payment upon receiving the parcel.
                </p>
                <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                  ✓ Available Islandwide
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
};
