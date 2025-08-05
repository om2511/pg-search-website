// src/components/common/PGCardSkeleton.js
const PGCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-48 bg-gray-300 rounded-t-lg"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-6 bg-gray-300 rounded w-1/4"></div>
    </div>
  </div>
);

export default PGCardSkeleton;