import { useCachedImage } from '../../../hooks/useCachedImage';
import { cn } from '../../../lib/utils';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback?: string;
}

export function CachedImage({ src, alt, className, fallback, ...props }: CachedImageProps) {
  const { cachedUrl, loading } = useCachedImage(src);

  if (loading && fallback) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={cn('animate-pulse', className)}
        {...props}
      />
    );
  }

  return (
    <img
      src={cachedUrl}
      alt={alt}
      className={className}
      {...props}
    />
  );
} 