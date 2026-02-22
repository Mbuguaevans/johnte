// src/api.js
// ─────────────────────────────────────────────────────────
// Central helper for all Django API calls.
// Import this in any component that needs real data.
// ─────────────────────────────────────────────────────────

const BASE_URL = 'http://127.0.0.1:8000/api';

// Always attach the JWT token from sessionStorage
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`,
});

// ── AUTH ──────────────────────────────────────────────────

export const authAPI = {

  register: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;

    // Save token + user to sessionStorage after register
    sessionStorage.setItem('access_token',  json.tokens.access);
    sessionStorage.setItem('refresh_token', json.tokens.refresh);
    sessionStorage.setItem('user',          JSON.stringify(json.user));
    return json;
  },

  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (!res.ok) throw json;

    // Save token to sessionStorage
    sessionStorage.setItem('access_token',  json.access);
    sessionStorage.setItem('refresh_token', json.refresh);

    // After login, fetch full profile and store it
    const profile = await profileAPI.get();
    sessionStorage.setItem('user', JSON.stringify(profile));

    return { ...json, user: profile };
  },

  logout: () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  },

  isLoggedIn: () => !!sessionStorage.getItem('access_token'),
};

// ── PROFILE ───────────────────────────────────────────────

export const profileAPI = {

  get: async () => {
    const res = await fetch(`${BASE_URL}/auth/profile/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  update: async (data) => {
    const isFormData = data instanceof FormData;
    const headers = authHeaders();
    if (isFormData) {
      delete headers['Content-Type'];
    }

    const res = await fetch(`${BASE_URL}/auth/profile/update/`, {
      method: 'PATCH',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    const updated = await res.json();
    // Keep sessionStorage in sync
    sessionStorage.setItem('user', JSON.stringify(updated));
    return updated;
  },
};

// ── LISTINGS ──────────────────────────────────────────────

export const listingsAPI = {

  getAll: async ({ county, search, amenities, sort, min_acres, max_acres } = {}) => {
    const params = new URLSearchParams();
    if (county && county !== 'all') params.set('county', county);
    if (search)    params.set('search', search);
    if (sort)      params.set('sort', sort);
    if (min_acres) params.set('min_acres', min_acres);
    if (max_acres) params.set('max_acres', max_acres);
    if (amenities && amenities.length > 0) {
      params.set('amenities', amenities.join(','));
    }

    const res = await fetch(`${BASE_URL}/listings/?${params}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  getMine: async () => {
    const res = await fetch(`${BASE_URL}/listings/mine/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  getOne: async (id) => {
    const res = await fetch(`${BASE_URL}/listings/${id}/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  create: async (data) => {
    // If data is FormData, don't set Content-Type header manually (browser does it with boundary)
    const isFormData = data instanceof FormData;
    const headers = authHeaders();
    if (isFormData) {
      delete headers['Content-Type'];
    }

    const res = await fetch(`${BASE_URL}/listings/create/`, {
      method: 'POST',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/listings/${id}/`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/listings/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return true;
  },

  close: async (id) => {
    const res = await fetch(`${BASE_URL}/listings/close/${id}/`, {
      method: 'POST',
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── BIDS ──────────────────────────────────────────────────

export const bidsAPI = {

  getMine: async () => {
    const res = await fetch(`${BASE_URL}/bids/mine/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  getForLand: async (landId) => {
    const res = await fetch(`${BASE_URL}/bids/land/${landId}/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  place: async (landId, amountKes) => {
    const res = await fetch(`${BASE_URL}/bids/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ land: landId, amount_kes: amountKes }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── PAYMENTS ──────────────────────────────────────────────

export const paymentsAPI = {

  getMine: async () => {
    const res = await fetch(`${BASE_URL}/payments/mine/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  initiate: async (landId, phone) => {
    const res = await fetch(`${BASE_URL}/payments/initiate/${landId}/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── SUMMARY ───────────────────────────────────────────────

export const summaryAPI = {

  get: async () => {
    const res = await fetch(`${BASE_URL}/summary/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};