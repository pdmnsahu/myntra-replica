import { RiStarFill, RiStarHalfFill, RiStarLine } from 'react-icons/ri';

export default function StarRating({ rating = 0, count, size = 14, interactive = false, onRate }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        const Icon = filled ? RiStarFill : half ? RiStarHalfFill : RiStarLine;
        return (
          <Icon
            key={star}
            size={size}
            className={filled || half ? 'star-filled' : 'star-empty'}
            style={interactive ? { cursor: 'pointer' } : {}}
            onClick={interactive ? () => onRate(star) : undefined}
          />
        );
      })}
      {count !== undefined && (
        <span className="text-muted text-xs ml-1">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
