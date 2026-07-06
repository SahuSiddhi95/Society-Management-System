import { useState, useEffect, useCallback } from "react";

/**
 * Client-side "infinite scroll" over an already-fetched array.
 * Reveals `pageSize` items at a time as loadMore() is called (e.g. on scroll).
 * Resets automatically whenever the source `items` reference changes
 * (new fetch, or a new filtered list from useMemo).
 */
export default function useInfiniteReveal(items, pageSize = 10) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (loadingMore || visibleCount >= items.length) return;
    setLoadingMore(true);
    // Small delay so the "Loading more…" state is visible even on fast/local data.
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, items.length));
      setLoadingMore(false);
    }, 200);
  }, [loadingMore, visibleCount, items.length, pageSize]);

  return {
    visible: items.slice(0, visibleCount),
    hasMore,
    loadingMore,
    loadMore,
  };
}