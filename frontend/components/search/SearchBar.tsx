'use client';
import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  debounceMs?: number;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search…',
  defaultValue = '',
  debounceMs = 300,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(value), debounceMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [value, debounceMs, onSearch]);

  return (
    <div className="relative w-full">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl
                   text-sm text-gray-800 placeholder-gray-400 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                   transition-shadow"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}