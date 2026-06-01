const BASE_URL = 'http://localhost:5000/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function request(path: string, options: RequestOptions = {}) {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, config);
    
    // If deleted successfully, fetch might return no content
    if (res.status === 204) return null;
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error: any) {
    console.error(`API Error on ${path}:`, error);
    throw error;
  }
}

export const apiClient = {
  get: (path: string, headers?: Record<string, string>) => request(path, { method: 'GET', headers }),
  post: (path: string, body: any, headers?: Record<string, string>) => request(path, { method: 'POST', body, headers }),
  put: (path: string, body: any, headers?: Record<string, string>) => request(path, { method: 'PUT', body, headers }),
  patch: (path: string, body: any, headers?: Record<string, string>) => request(path, { method: 'PATCH', body, headers }),
  delete: (path: string, headers?: Record<string, string>) => request(path, { method: 'DELETE', headers }),
};
