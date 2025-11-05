const API_URL = process.env.NEXT_PUBLIC_API || 'http://localhost:5000/api';

export async function apiRequest(
  endpoint: string,
  method = 'GET',
  data?: Record<string, unknown>,
  token?: string,
) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
