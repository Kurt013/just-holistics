import api from '@/lib/api';

export async function getCurrentUser() {
  try {
    const response = await api.get('/api/me');
    return response.data || null;
  } catch {
    return null;
  }
}

