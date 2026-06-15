'use client';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (val: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const sizeCls = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-6 h-6' }[size];

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${value} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const filled = star <= (interactive ? (hovered || value) : value);
        return (
          <svg
            key={star}
            className={`${sizeCls} transition-colors ${
              filled ? 'text-amber-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(star)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}