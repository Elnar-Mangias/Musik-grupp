const API_BASE = 'https://inai-col2.fishrungames.com/api';
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options, credentials: 'include',
    headers: {'Content-Type':'application/json', ...(options.headers || {})},
  });
  const text = await response.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const message = typeof data === 'object' && data !== null && 'detail' in data
      ? String((data as {detail: unknown}).detail)
      : typeof data === 'string' && data ? data : `Ошибка сервера (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}
export type Profile = Record<string, unknown>;
export const api = {
  register: (username: string, password: string) => request('/register/', {method:'POST',body:JSON.stringify({username,password})}),
  login: (username: string, password: string) => request('/login/', {method:'POST',body:JSON.stringify({username,password})}),
  logout: () => request('/logout/', {method:'POST'}),
  getProfile: () => request<Profile>('/profile/'),
  updateProfile: (profile: Profile) => request<Profile>('/profile/', {method:'PATCH',body:JSON.stringify(profile)}),
};