import { getNewAccessToken } from './tokenUtils';

export async function authFetch(url, options = {}) {
  try {
  
    let token = localStorage.getItem('token');

   
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    
    if (response.status === 401) {
      const newToken = await getNewAccessToken();
      if (!newToken) return response;

      const retryHeaders = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
        'Content-Type': 'application/json',
      };

      
      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    }

    return response;
  } catch (err) {
    console.error('authFetch error:', err);
    throw err;
  }
}
