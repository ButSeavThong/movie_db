import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1 
}) => {
  // What: Generate page numbers to display
  // Why: Show limited pages with ellipsis for better UX
  const generatePageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2;
    
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, boundaryCount);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - boundaryCount);

    const showLeftDots = leftSiblingIndex > boundaryCount + 2;
    const showRightDots = rightSiblingIndex < totalPages - boundaryCount - 1;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount + boundaryCount;
      return [
        ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
        '...',
        ...Array.from({ length: boundaryCount }, (_, i) => totalPages - boundaryCount + i + 1)
      ];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount + boundaryCount;
      return [
        ...Array.from({ length: boundaryCount }, (_, i) => i + 1),
        '...',
        ...Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1)
      ];
    }

    if (showLeftDots && showRightDots) {
      const middleNumbers = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [
        ...Array.from({ length: boundaryCount }, (_, i) => i + 1),
        '...',
        ...middleNumbers,
        '...',
        ...Array.from({ length: boundaryCount }, (_, i) => totalPages - boundaryCount + i + 1)
      ];
    }
  };

  const pageNumbers = generatePageNumbers();

  // Don't show pagination if only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-12">
      {/* Page Info */}
      <div className="text-gray-400 text-sm">
        Page <span className="font-semibold text-white">{currentPage}</span> of{" "}
        <span className="font-semibold text-white">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* First Page Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg transition-colors ${
            currentPage === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
          aria-label="First page"
        >
          ««
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
            currentPage === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
          aria-label="Previous page"
        >
          <span>‹</span>
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers?.map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === pageNum
                    ? 'bg-red-600 text-white font-semibold shadow-lg transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                aria-label={`Page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
            currentPage === totalPages
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <span>›</span>
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
          }`}
          aria-label="Last page"
        >
          »»
        </button>
      </div>

      {/* Page Input (for jumping to specific page) */}
      <div className="flex items-center space-x-2 mt-4">
        <span className="text-gray-400 text-sm">Go to page:</span>
        <div className="relative">
          <input
            type="number"
            min="1"
            max={totalPages}
            defaultValue={currentPage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                  e.target.value = '';
                }
              }
            }}
            className="w-20 px-3 py-1 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Page number input"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
            /{totalPages}
          </span>
        </div>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-400 text-sm">Show:</span>
        <select
          className="px-3 py-1 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          defaultValue="20"
          onChange={(e) => {
            // Note: TMDB API doesn't support changing items per page
            // This is for demonstration/future use
            console.log('Items per page changed to:', e.target.value);
          }}
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;