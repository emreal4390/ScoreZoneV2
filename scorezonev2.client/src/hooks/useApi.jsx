import { useState } from 'react';

const API_BASE_URL = 'https://localhost:7107'; // Backend'in çalıştığı port

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (url, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // CORS için gerekli
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'API isteği başarısız oldu');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Hatası:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error };
}; 