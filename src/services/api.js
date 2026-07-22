let rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').trim();
// Normalize API_URL: strip trailing slashes to prevent double-slash (//) redirects
rawApiUrl = rawApiUrl.replace(/\/+$/, '');
if (rawApiUrl.startsWith('http') && !rawApiUrl.endsWith('/api')) {
  rawApiUrl = `${rawApiUrl}/api`;
}
const API_URL = rawApiUrl;

const getHeaders = () => {
  const token = localStorage.getItem('notes_app_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const parseResponse = async (res) => {
  let data = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // Not a JSON response
  }
  return data;
};

export const api = {
  // Auth API
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseResponse(res);
    if (!res.ok) throw new Error((data && data.message) || 'Login failed');
    return data;
  },

  signup: async (username, email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await parseResponse(res);
    if (!res.ok) throw new Error((data && data.message) || 'Signup failed');
    return data;
  },

  // User Configurations API
  updateTheme: async (theme) => {
    const res = await fetch(`${API_URL}/users/theme`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ theme }),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    const data = await parseResponse(res);
    if (!res.ok) throw new Error('Failed to update theme');
    return data;
  },

  // Notes API
  getNotes: async () => {
    const res = await fetch(`${API_URL}/notes`, {
      headers: getHeaders(),
    });
    if (res.status === 401) {
      throw new Error('UNAUTHORIZED');
    }
    const data = await parseResponse(res);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return data;
  },

  createNote: async (note) => {
    const res = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(note),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    const data = await parseResponse(res);
    if (!res.ok) throw new Error('Failed to create note');
    return data;
  },

  updateNote: async (id, note) => {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(note),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    const data = await parseResponse(res);
    if (!res.ok) throw new Error('Failed to update note');
    return data;
  },

  deleteNote: async (id) => {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (res.status === 401) throw new Error('UNAUTHORIZED');
    if (!res.ok) throw new Error('Failed to delete note');
    return true;
  },
};
