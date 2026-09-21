export const API_BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'https://ceylon-batik-git-main-isuru128s-projects.vercel.app'
).replace(/\/+$/, '');

export const getApiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/01.jpeg';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  if (imagePath.startsWith('/uploads')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  return imagePath;
};

const normalizeProduct = (p) => {
  if (!p) return p;
  return {
    ...p,
    images: (p.images || []).map(img => getImageUrl(img))
  };
};

export const apiClient = {
  // Auth Token helpers
  getAdminToken() {
    try {
      const admin = JSON.parse(localStorage.getItem('adminUser') || 'null');
      if (admin && admin.token) return admin.token;
    } catch {}
    return null;
  },

  getUserToken() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user && user.token) return user.token;
    } catch {}
    return null;
  },

  getToken() {
    // Prefer admin token if admin is logged in, otherwise customer user token
    return this.getAdminToken() || this.getUserToken();
  },

  getAuthHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  getAdminAuthHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };
    const token = this.getAdminToken() || this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // ── Products API ──
  async getProducts(category) {
    try {
      let url = getApiUrl('/api/products');
      if (category && category !== 'all') {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data.map(normalizeProduct) : [];
      }
    } catch (err) {
      console.error('Error fetching products from backend:', err);
    }
    return [];
  },

  async getProductBySlug(slug) {
    try {
      const res = await fetch(getApiUrl(`/api/products/${encodeURIComponent(slug)}`), {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        return normalizeProduct(data);
      }
    } catch (err) {
      console.error('Error looking up product by slug:', err);
    }
    return null;
  },

  async saveProduct(product) {
    const id = product.id || product._id;
    const isNew = !id || String(id).startsWith('temp_');
    const url = isNew ? getApiUrl('/api/products') : getApiUrl(`/api/products/${id}`);
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: this.getAdminAuthHeaders(),
      body: JSON.stringify(product)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to save product on server');
    }

    const saved = await res.json();
    return normalizeProduct(saved);
  },

  async deleteProduct(id) {
    const res = await fetch(getApiUrl(`/api/products/${id}`), {
      method: 'DELETE',
      headers: this.getAdminAuthHeaders()
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete product');
    }

    return true;
  },

  async uploadProductImages(files) {
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    const token = this.getAdminToken() || this.getToken();
    const res = await fetch(getApiUrl('/api/upload/product-images'), {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },

  // ── Customer Auth ──
  async login(contact, password) {
    const res = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, password })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }

    if (data && data.token) {
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  async register(data) {
    const res = await fetch(getApiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    if (result && result.token) {
      localStorage.setItem('user', JSON.stringify(result));
    }
    return result;
  },

  async getProfile() {
    try {
      const res = await fetch(getApiUrl('/api/auth/profile'), {
        headers: this.getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
    return null;
  },

  async updateProfile(profileData) {
    const res = await fetch(getApiUrl('/api/auth/profile'), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update profile');
    }
    const updated = await res.json();
    // Update stored user details
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...current, ...updated }));
    return updated;
  },

  // ── Admin Auth & Management ──
  async adminLogin(contact, password) {
    const res = await fetch(getApiUrl('/api/admin/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, password })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Invalid admin credentials');
    }

    if (data && data.token) {
      localStorage.setItem('adminUser', JSON.stringify(data));
    }
    return data;
  },

  async getAdminStats() {
    try {
      const res = await fetch(getApiUrl('/api/admin/stats'), {
        headers: this.getAdminAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
    return {
      totalRevenue: 0,
      activeProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      pendingOrders: 0
    };
  },

  async getAdminUsers() {
    try {
      const res = await fetch(getApiUrl('/api/admin/users'), {
        headers: this.getAdminAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    return [];
  },

  async getAdminOrders() {
    try {
      const res = await fetch(getApiUrl('/api/admin/orders'), {
        headers: this.getAdminAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
    return [];
  },

  async updateOrderStatus(orderId, status) {
    const res = await fetch(getApiUrl(`/api/admin/orders/${encodeURIComponent(orderId)}/status`), {
      method: 'PUT',
      headers: this.getAdminAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update order status');
    }
    return await res.json();
  },

  // ── Orders API ──
  async createOrder(orderPayload) {
    const res = await fetch(getApiUrl('/api/orders'), {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(orderPayload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to place order');
    }

    return await res.json();
  },

  async getMyOrders(email) {
    try {
      const url = email ? getApiUrl(`/api/orders/my-orders?email=${encodeURIComponent(email)}`) : getApiUrl('/api/orders/my-orders');
      const res = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching customer orders:', err);
    }
    return [];
  },

  // ── Dynamic Site Content (Testimonials, FAQs, Locations, Craft Steps) ──
  async getTestimonials() {
    try {
      const res = await fetch(getApiUrl('/api/content/testimonials'));
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
    return [];
  },

  async getCraftSteps() {
    try {
      const res = await fetch(getApiUrl('/api/content/craft-steps'));
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching craft steps:', err);
    }
    return [];
  },

  async getStoreLocations() {
    try {
      const res = await fetch(getApiUrl('/api/content/locations'));
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching store locations:', err);
    }
    return [];
  },

  async getFaqs() {
    try {
      const res = await fetch(getApiUrl('/api/content/faqs'));
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    }
    return [];
  },

  // ── Virtual Try-on Fit On Me ──
  getSessionId() {
    let sid = sessionStorage.getItem('cb_session_id');
    if (!sid) {
      sid = 'cb_sess_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      sessionStorage.setItem('cb_session_id', sid);
    }
    return sid;
  },

  async generateFitPreview({ customerImage, productTitle, productImage, customerGender, garmentGender, productCategory, productTags }) {
    const res = await fetch(getApiUrl('/api/fit-on-me'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': this.getSessionId()
      },
      body: JSON.stringify({ customerImage, productTitle, productImage, customerGender, garmentGender, productCategory, productTags })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Virtual try-on request failed');
    }
    return data;
  }
};

