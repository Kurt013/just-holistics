interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className="flex justify-center items-center gap-1 mt-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600
                   hover:border-green-400 hover:text-green-600 disabled:opacity-40
                   disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${
              p === currentPage
                ? 'bg-green-600 text-white shadow-sm'
                : 'border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600
                   hover:border-green-400 hover:text-green-600 disabled:opacity-40
                   disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </nav>
  );
}