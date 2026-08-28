import './Loading.css';

export function SkeletonLoader({ 
  variant = 'text', 
  count = 1, 
  width, 
  height, 
  circle = false,
  className = '' 
}) {
  const items = Array.from({ length: count });

  return (
    <div className={`skeleton-wrapper ${className}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-${variant} ${circle ? 'skeleton-circle' : ''}`}
          style={{
            width: width || undefined,
            height: height || undefined,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
