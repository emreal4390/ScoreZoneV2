import { useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);

  const post = async (url, data) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('API isteği başarısız oldu');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Hatası:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { post, loading };
}; 