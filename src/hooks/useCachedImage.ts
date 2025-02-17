import { CacheService } from '../services/cacheService';
import { useState, useEffect } from 'react';

export function useCachedImage(url: string) {
  const [cachedUrl, setCachedUrl] = useState<string>(url);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        const cached = await CacheService.loadAndCacheImage(url);
        if (isMounted) {
          setCachedUrl(cached);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading cached image:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { cachedUrl, loading };
} 